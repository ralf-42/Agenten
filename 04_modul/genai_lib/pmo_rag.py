"""
pmo_rag.py — Wiederverwendbare Chroma-RAG-Kette für den PMO-Assistenten

Extrahiert aus der in M14_RAG_Agent.ipynb final genutzten Implementierung
(Dokumentladen, Zeichen-Chunking, Chroma-Erstellung/Indexierung, Retrieval-Tool),
damit M15 und die nachfolgenden Module (M26, M28, M29, M36-M38) dieselbe Kette wiederverwenden statt sie zu duplizieren.

M11 enthält die früheren M12/M13-Schritte und baut die Kette weiterhin
Schritt für Schritt selbst als Inline-Code. M14 nutzt den Mehrformat-Lader
dieses Moduls, damit der PMO-Korpus einschließlich Markdown- und CSV-Artefakten
indexiert werden kann. M22 nutzt
bewusst einen synthetischen In-Memory-Datensatz, M27 eine isolierte
Experiment-Collection mit anderer Chunk-Granularität.

Nur für Google Colab: Die produktive Collection liegt auf Google Drive
(Agenten/02_daten/05_sonstiges/chroma_pmo). Vor dem ersten Zugriff muss
in JEDEM Notebook Google Drive gemountet sein:

    from google.colab import drive
    drive.mount("/content/drive")

Installation (einmalig):
    !uv pip install --system -q git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

Import im Notebook:
    from genai_lib.pmo_rag import get_pmo_vectorstore, index_pmo_corpus, make_suche_wissensdatenbank_tool

    vectorstore = get_pmo_vectorstore()
    index_pmo_corpus(vectorstore, KORPUS_TARGET)
    suche_wissensdatenbank = make_suche_wissensdatenbank_tool(vectorstore)

Lokaler Test ohne Google Drive:
    vectorstore = get_pmo_vectorstore(persist_directory="./chroma_pmo_local")

Bei einem lokalen Pfad wird kein Google-Drive-Mount vorausgesetzt. Der
Standardpfad bleibt für die Kurs-Notebooks die persistente Google-Drive-Collection.
"""

import csv
import json
import urllib.request
from functools import lru_cache
from pathlib import Path

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.tools import tool
from langchain_openai import OpenAIEmbeddings
from pypdf import PdfReader

from genai_lib.model_config import EMBEDDINGS

DEFAULT_COLLECTION_NAME = "pmo_korpus_m14"
DEFAULT_PERSIST_DIRECTORY = "/content/drive/MyDrive/Agenten/02_daten/05_sonstiges/chroma_pmo"
KORPUS_METADATA_URL = (
    "https://raw.githubusercontent.com/ralf-42/Agenten/main/"
    "02_daten/01_text/korpus_pmo_assistent/metadata.json"
)

SUPPORTED_EXTENSIONS = {
    ".txt", ".md", ".pdf", ".docx", ".doc", ".xlsx",
    ".html", ".htm", ".csv", ".json", ".xml",
}
IGNORED_FILENAMES = {"README.md", "KORPUS_QUALITAET.md", "metadata.json"}


def _require_drive_mounted(persist_directory: str) -> None:
    """Bricht hart ab, wenn ein Drive-Pfad verwendet wird, aber Google Drive nicht gemountet ist."""
    if not persist_directory.startswith("/content/drive"):
        return
    if not Path("/content/drive").is_dir():
        raise RuntimeError(
            "Google Drive ist nicht gemountet. Vor dem Zugriff auf die PMO-Collection "
            "muss zuerst 'from google.colab import drive; drive.mount(\"/content/drive\")' "
            "ausgeführt werden."
        )


def load_pdf_documents(directory_path: str) -> list[Document]:
    """Lädt alle PDF-Seiten aus einem Verzeichnis mit pypdf."""
    documents: list[Document] = []
    for pdf_path in sorted(Path(directory_path).glob("*.pdf")):
        try:
            reader = PdfReader(str(pdf_path))
            for page_number, page in enumerate(reader.pages):
                documents.append(
                    Document(
                        page_content=page.extract_text() or "",
                        metadata={
                            "source": str(pdf_path),
                            "page": page_number,
                        },
                    )
                )
        except Exception as exc:
            print(f"  ⚠ {pdf_path.name} übersprungen: {exc}")
    return documents


def load_documents_from_directory(directory_path: str) -> list[Document]:
    """Lädt unterstützte Dokumentformate mit MarkItDown.

    Unterstützt werden PDF, Markdown/Text, CSV, XLSX, JSON, XML, HTML und
    Word-Dokumente. Verwaltungsdateien des PMO-Korpus werden nicht als
    Wissensquellen indexiert. Die Konvertierung erzeugt pro Datei ein
    LangChain-Document mit Dateiquelle und Dateityp als Metadaten.
    """
    try:
        from markitdown import MarkItDown
    except ImportError as exc:
        raise ImportError(
            "Für den Mehrformat-Korpuslader wird markitdown[all] benötigt. "
            "Installieren Sie die Abhängigkeit aus requirements.txt."
        ) from exc

    converter = MarkItDown()
    directory = Path(directory_path)
    documents: list[Document] = []

    for file_path in sorted(directory.rglob("*")):
        if (
            not file_path.is_file()
            or file_path.suffix.lower() not in SUPPORTED_EXTENSIONS
            or file_path.name in IGNORED_FILENAMES
        ):
            continue

        try:
            result = converter.convert(str(file_path))
            text = (result.text_content or "").strip()
            if not text:
                print(f"  ⚠ {file_path.name} übersprungen (kein Text)")
                continue
            documents.append(
                Document(
                    page_content=text,
                    metadata={
                        "source": str(file_path),
                        "file_type": file_path.suffix.lower().lstrip("."),
                    },
                )
            )
        except Exception as exc:
            print(f"  ⚠ {file_path.name} übersprungen: {exc}")

    return documents


def split_documents_by_characters(
    documents: list[Document], chunk_size: int = 300, chunk_overlap: int = 30
) -> list[Document]:
    """Teilt Dokumentseiten in überlappende Zeichen-Chunks (identisch zu M13/M14)."""
    chunks: list[Document] = []
    step = max(1, chunk_size - chunk_overlap)
    for doc in documents:
        text = doc.page_content or ""
        for chunk_index, start in enumerate(range(0, len(text), step)):
            chunk_text = text[start:start + chunk_size].strip()
            if not chunk_text:
                continue
            metadata = dict(doc.metadata)
            metadata["chunk_index"] = chunk_index
            chunks.append(Document(page_content=chunk_text, metadata=metadata))
    return chunks


def get_pmo_vectorstore(
    persist_directory: str = DEFAULT_PERSIST_DIRECTORY,
    collection_name: str = DEFAULT_COLLECTION_NAME,
) -> Chroma:
    """Erstellt/lädt die produktive PMO-Collection.

    Bei Drive-Pfaden (Standard) muss Google Drive vorher gemountet sein,
    sonst wird ein RuntimeError ausgelöst statt eines leeren Fallback-Index.
    Für lokale Tests kann ein eigener Pfad außerhalb von ``/content/drive``
    übergeben werden; dafür ist kein Google-Drive-Mount erforderlich.
    """
    _require_drive_mounted(persist_directory)
    embeddings = OpenAIEmbeddings(model=EMBEDDINGS)
    return Chroma(
        collection_name=collection_name,
        embedding_function=embeddings,
        persist_directory=persist_directory,
    )


def index_pmo_corpus(
    vectorstore: Chroma,
    directory_path: str,
    chunk_size: int = 300,
    chunk_overlap: int = 30,
    batch_size: int = 500,
    force: bool = False,
) -> int:
    """Indexiert unterstützte Dokumente aus directory_path in die Collection.

    Indexiert nur, wenn die Collection leer ist. Mit force=True werden
    vorhandene Einträge zuerst gelöscht und die Collection neu aufgebaut —
    nötig, falls sich der PDF-Korpus nach dem ersten Aufbau ändert.
    """
    if force:
        vorhandene_ids = vectorstore.get()["ids"]
        if vorhandene_ids:
            vectorstore.delete(ids=vorhandene_ids)
    elif vectorstore._collection.count() > 0:
        print(
            f"Collection hat bereits {vectorstore._collection.count()} Einträge "
            "— kein erneutes Indexieren (force=True für Neuaufbau)"
        )
        return 0

    dokumente = load_documents_from_directory(directory_path)
    chunks = split_documents_by_characters(
        dokumente, chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )

    for start in range(0, len(chunks), batch_size):
        batch = chunks[start:start + batch_size]
        vectorstore.add_documents(batch)
        ende = min(start + batch_size, len(chunks))
        print(f"  Batch {start // batch_size + 1}: {ende}/{len(chunks)} Chunks indexiert")

    return len(chunks)


@lru_cache(maxsize=4)
def load_korpus_metadata(metadata_path: str | None = None) -> dict[str, dict]:
    """Lädt die Dokument-Metadaten des Korpus als Dict {dateiname: eintrag}.

    Ohne metadata_path wird metadata.json aus dem Kurs-Repository (GitHub, main)
    geladen. Ist die Datei nicht erreichbar, wird ein leeres Dict zurückgegeben —
    die Suche funktioniert dann wie bisher, nur ohne Datum und Dokumenttyp.
    """
    try:
        if metadata_path:
            inhalt = Path(metadata_path).read_text(encoding="utf-8")
        else:
            with urllib.request.urlopen(KORPUS_METADATA_URL, timeout=10) as antwort:
                inhalt = antwort.read().decode("utf-8")
        return {eintrag["file"]: eintrag for eintrag in json.loads(inhalt)["documents"]}
    except Exception as exc:
        print(f"  ⚠ Korpus-Metadaten nicht geladen: {exc}")
        return {}


def _format_metadaten(eintrag: dict | None) -> str:
    """Formatiert Datum, Dokumenttyp sowie Entscheidungs- und Risiko-IDs als eine Zeile."""
    if not eintrag:
        return ""
    teile = [f"Datum: {eintrag['date']}", f"Typ: {eintrag['document_type']}"]
    if eintrag.get("decision_ids"):
        teile.append("Entscheidungen: " + ", ".join(eintrag["decision_ids"]))
    if eintrag.get("risk_ids"):
        teile.append("Risiken: " + ", ".join(eintrag["risk_ids"]))
    return " | ".join(teile)


def check_corpus(vectorstore: Chroma, directory_path: str) -> dict[str, list[str]]:
    """Vergleicht die unterstützten Korpusdateien mit den Quellen in der Collection.

    Gibt zurück: {"fehlt_im_index": [...], "veraltet_im_index": [...]}.
    "veraltet_im_index" enthält Quellen, die im Ordner nicht mehr existieren
    (z. B. gelöschte Dokumente) — dann die Collection neu aufbauen
    (index_pmo_corpus mit force=True bzw. M14 neu ausführen).
    """
    im_ordner = {
        file_path.name
        for file_path in Path(directory_path).rglob("*")
        if (
            file_path.is_file()
            and file_path.suffix.lower() in SUPPORTED_EXTENSIONS
            and file_path.name not in IGNORED_FILENAMES
        )
    }
    metadaten = vectorstore.get(include=["metadatas"])["metadatas"]
    im_index = {Path((meta or {}).get("source", "")).name for meta in metadaten} - {""}
    ergebnis = {
        "fehlt_im_index": sorted(im_ordner - im_index),
        "veraltet_im_index": sorted(im_index - im_ordner),
    }
    if any(ergebnis.values()):
        print(f"⚠ Index und Korpusordner weichen ab: {ergebnis}")
    else:
        print(f"Index passt zum Korpusordner ({len(im_ordner)} Dokumente)")
    return ergebnis


def format_docs(docs: list[Document]) -> str:
    """Formatiert Retrieval-Treffer mit ihren Dateiquellen."""
    teile = []
    for doc in docs:
        quelle = doc.metadata.get("source", "?").split("/")[-1]
        teile.append(f"Quelle: {quelle}\n{doc.page_content}")
    return "\n\n---\n\n".join(teile)


def make_suche_wissensdatenbank_tool(vectorstore: Chroma, rag_chain=None):
    """Baut das @tool suche_wissensdatenbank für eine gegebene Vectorstore-Instanz.

    Factory-Pattern nötig, weil @tool-Funktionen vom Agenten mit genau einem
    Argument (frage) aufgerufen werden — der vectorstore wird per Closure
    injiziert statt über globalen Modul-State.
    """

    @tool
    def suche_wissensdatenbank(frage: str) -> str:
        """Durchsucht den Meeting- & Projekt-Korpus zu Entscheidungen, Risiken, Aufgaben und offenen Punkten.
        Geeignet für belegbare Fragen zu Projekt Kompass und Fragen nach Quellen.
        """
        try:
            ergebnisse = vectorstore.similarity_search_with_score(frage, k=3)
            if not ergebnisse:
                return "Nicht im Korpus. Keine relevanten Informationen gefunden."

            metadaten = load_korpus_metadata()
            antwort_teile = []
            for doc, score in ergebnisse:
                quelle = doc.metadata.get("source", "unbekannt").split("/")[-1]
                ausschnitt = doc.page_content.replace("\n", " ")[:700]
                info = _format_metadaten(metadaten.get(quelle))
                antwort_teile.append(
                    f"Quelle: {quelle}\n"
                    + (f"Dokument: {info}\n" if info else "")
                    + f"Distanz (kleiner = ähnlicher): {score:.4f}\n"
                    f"Ausschnitt: {ausschnitt}"
                )

            return "\n\n---\n\n".join(antwort_teile)
        except Exception as exc:
            return f"Fehler bei der Datenbanksuche: {exc}"

    return suche_wissensdatenbank


def make_lies_tabellendaten_tool(directory_path: str):
    """Baut das @tool lies_tabellendaten für strukturierte CSV-Analysen im PMO-Korpus.

    Ermöglicht dem Tabellen-Worker im Supervisor-Pattern den gezielten Zugriff
    auf Controlling- und Ressourcentabellen (projektbudget_kostenstatus_q2_2026.csv,
    ressourcen_kapazitaetsmatrix_2026.csv) ohne Vektor-Chunking-Verluste.
    """
    korpus_dir = Path(directory_path)

    @tool
    def lies_tabellendaten(bereich: str) -> str:
        """Liest strukturierte Tabellendaten aus dem PMO-Korpus.
        Gültige Bereiche: 'budget' (Kostenstatus, Forecast, Abweichungen) oder
        'ressourcen' (Kapazitätsmatrix, Rollenallokation, Engpässe).
        """
        bereich_clean = bereich.strip().lower()
        if "budget" in bereich_clean or "kosten" in bereich_clean:
            datei = korpus_dir / "projektbudget_kostenstatus_q2_2026.csv"
        elif "ressource" in bereich_clean or "kapazit" in bereich_clean or "allokation" in bereich_clean:
            datei = korpus_dir / "ressourcen_kapazitaetsmatrix_2026.csv"
        else:
            return (
                f"Unbekannter Tabellenbereich '{bereich}'. "
                "Verfügbare Bereiche: 'budget' (Kostenstatus) und 'ressourcen' (Kapazitätsmatrix)."
            )

        if not datei.exists():
            kandidaten = list(korpus_dir.rglob(datei.name))
            if kandidaten:
                datei = kandidaten[0]
            else:
                return f"Tabelle {datei.name} nicht im Verzeichnis {directory_path} gefunden."

        try:
            with open(datei, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f, delimiter=";")
                zeilen = list(reader)
            if not zeilen:
                return f"Tabelle {datei.name} ist leer."

            header = list(zeilen[0].keys())
            md_zeilen = [
                f"### Tabelle: {datei.name}",
                "",
                "| " + " | ".join(header) + " |",
                "| " + " | ".join(["---"] * len(header)) + " |",
            ]
            for row in zeilen:
                md_zeilen.append("| " + " | ".join(str(row.get(col, "")) for col in header) + " |")

            return "\n".join(md_zeilen)
        except Exception as exc:
            return f"Fehler beim Lesen der Tabelle {datei.name}: {exc}"

    return lies_tabellendaten
