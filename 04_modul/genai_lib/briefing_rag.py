"""
briefing_rag.py — Wiederverwendbare Chroma-RAG-Kette für den Meeting- & Research-Briefing-Agenten

Extrahiert aus der in M14_RAG_Agent.ipynb final genutzten Implementierung
(PDF-Laden, Zeichen-Chunking, Chroma-Erstellung/Indexierung, Retrieval-Tool),
damit M26/M35 dieselbe Kette wiederverwenden statt sie zu duplizieren.

M12/M13/M14 bleiben didaktisch davon unberührt und bauen die Kette weiterhin
Schritt für Schritt selbst als Inline-Code — dieses Modul bündelt nur den
bereits in M14 final genutzten Stand für die nachfolgenden Module. M22 nutzt
bewusst einen synthetischen In-Memory-Datensatz, M27 eine isolierte
Experiment-Collection mit anderer Chunk-Granularität.

Nur für Google Colab: Die produktive Collection liegt auf Google Drive
(Agenten/02_daten/05_sonstiges/chroma_briefing). Vor dem ersten Zugriff muss
in JEDEM Notebook Google Drive gemountet sein:

    from google.colab import drive
    drive.mount("/content/drive")

Installation (einmalig):
    !uv pip install --system -q git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

Import im Notebook:
    from genai_lib.briefing_rag import get_briefing_vectorstore, index_briefing_corpus, make_suche_wissensdatenbank_tool

    vectorstore = get_briefing_vectorstore()
    index_briefing_corpus(vectorstore, KORPUS_TARGET)
    suche_wissensdatenbank = make_suche_wissensdatenbank_tool(vectorstore)
"""

from pathlib import Path

from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from langchain_core.tools import tool
from langchain_openai import OpenAIEmbeddings

from genai_lib.model_config import EMBEDDINGS

DEFAULT_COLLECTION_NAME = "meeting_briefing_korpus_m14"
DEFAULT_PERSIST_DIRECTORY = "/content/drive/MyDrive/Agenten/02_daten/05_sonstiges/chroma_briefing"


def _require_drive_mounted(persist_directory: str) -> None:
    """Bricht hart ab, wenn ein Drive-Pfad verwendet wird, aber Google Drive nicht gemountet ist."""
    if not persist_directory.startswith("/content/drive"):
        return
    if not Path("/content/drive").is_dir():
        raise RuntimeError(
            "Google Drive ist nicht gemountet. Vor dem Zugriff auf die Briefing-Collection "
            "muss zuerst 'from google.colab import drive; drive.mount(\"/content/drive\")' "
            "ausgeführt werden."
        )


def load_pdf_documents(directory_path: str) -> list[Document]:
    """Lädt alle PDF-Seiten aus einem Verzeichnis (identisch zu M13/M14)."""
    documents: list[Document] = []
    for pdf_path in sorted(Path(directory_path).glob("*.pdf")):
        try:
            loader = PyPDFLoader(str(pdf_path))
            documents.extend(loader.load())
        except Exception as exc:
            print(f"  ⚠ {pdf_path.name} übersprungen: {exc}")
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


def get_briefing_vectorstore(
    persist_directory: str = DEFAULT_PERSIST_DIRECTORY,
    collection_name: str = DEFAULT_COLLECTION_NAME,
) -> Chroma:
    """Erstellt/lädt die produktive Meeting-Briefing-Collection.

    Bei Drive-Pfaden (Standard) muss Google Drive vorher gemountet sein,
    sonst wird ein RuntimeError ausgelöst statt eines leeren Fallback-Index.
    """
    _require_drive_mounted(persist_directory)
    embeddings = OpenAIEmbeddings(model=EMBEDDINGS)
    return Chroma(
        collection_name=collection_name,
        embedding_function=embeddings,
        persist_directory=persist_directory,
    )


def index_briefing_corpus(
    vectorstore: Chroma,
    directory_path: str,
    chunk_size: int = 300,
    chunk_overlap: int = 30,
    batch_size: int = 500,
    force: bool = False,
) -> int:
    """Indexiert PDFs aus directory_path in die Collection.

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

    dokumente = load_pdf_documents(directory_path)
    chunks = split_documents_by_characters(
        dokumente, chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )

    for start in range(0, len(chunks), batch_size):
        batch = chunks[start:start + batch_size]
        vectorstore.add_documents(batch)
        ende = min(start + batch_size, len(chunks))
        print(f"  Batch {start // batch_size + 1}: {ende}/{len(chunks)} Chunks indexiert")

    return len(chunks)


def make_suche_wissensdatenbank_tool(vectorstore: Chroma):
    """Baut das @tool suche_wissensdatenbank für eine gegebene Vectorstore-Instanz.

    Factory-Pattern nötig, weil @tool-Funktionen vom Agenten mit genau einem
    Argument (frage) aufgerufen werden — der vectorstore wird per Closure
    injiziert statt über globalen Modul-State.
    """

    @tool
    def suche_wissensdatenbank(frage: str) -> str:
        """Durchsucht den Meeting- & Projekt-Korpus zu Entscheidungen, Risiken und offenen Punkten
        sowie die Fachartikel zu RAG, Retrieval, Evaluation und Agenten.
        Geeignet für belegbare Fragen zu Projekt Kompass und Fragen nach Quellen.
        """
        try:
            ergebnisse = vectorstore.similarity_search_with_score(frage, k=3)
            if not ergebnisse:
                return "Nicht im Korpus. Keine relevanten Informationen gefunden."

            antwort_teile = []
            for doc, score in ergebnisse:
                quelle = doc.metadata.get("source", "unbekannt").split("/")[-1]
                ausschnitt = doc.page_content.replace("\n", " ")[:700]
                antwort_teile.append(
                    f"Quelle: {quelle}\n"
                    f"Score: {score:.4f}\n"
                    f"Ausschnitt: {ausschnitt}"
                )

            return "\n\n---\n\n".join(antwort_teile)
        except Exception as exc:
            return f"Fehler bei der Datenbanksuche: {exc}"

    return suche_wissensdatenbank
