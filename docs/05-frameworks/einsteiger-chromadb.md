---
layout: default
title: Einsteiger ChromaDB
parent: Weitere Tools
grand_parent: Frameworks
nav_order: 1
description: "Vektordatenbanken und ChromaDB für RAG-Systeme"
has_toc: true
---

# ChromaDB
{: .no_toc }

> **Vektordatenbanken und ChromaDB für RAG-Systeme**

---

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Kurzüberblick: Warum ChromaDB Vektordatenbanken?

Large Language Models haben trotz ihrer beeindruckenden Fähigkeiten klare Limitierungen:

- **Wissens-Cutoff:** Das Modell kennt nur Informationen bis zum Trainingszeitpunkt
- **Kein Firmenwissen:** Interne Dokumente, Richtlinien oder aktuelle Daten sind unbekannt
- **Halluzination:** Bei fehlendem Wissen werden plausibel klingende, aber falsche Antworten generiert
- **Kontextlimit:** Nicht alle relevanten Dokumente passen in den Prompt

> [!WARNING] Ohne Retrieval riskant<br>
> Bei wissensintensiven Aufgaben ohne RAG steigt das Risiko für Halluzinationen und veraltete Antworten deutlich.

Vektordatenbanken lösen diese Probleme durch **semantische Suche**:

| Aspekt | Keyword-Suche | Semantische Suche |
|--------|---------------|-------------------|
| **Funktionsweise** | Exakte Wortübereinstimmung | Bedeutungsähnlichkeit |
| **Beispiel** | "Auto" findet nicht "Fahrzeug" | "Auto" findet auch "Fahrzeug", "PKW", "Wagen" |
| **Synonyme** | ❌ Nicht erkannt | ✅ Erkannt |
| **Tippfehler** | ❌ Keine Treffer | ✅ Oft trotzdem Treffer |
| **Kontext** | ❌ Ignoriert | ✅ Berücksichtigt |

**Kernidee:** Texte werden in Vektoren umgewandelt. Ähnliche Bedeutungen führen zu ähnlichen Vektoren. Die Suche arbeitet dann nicht primär mit exakten Wörtern, sondern mit Nähe im Vektorraum.

Gerade bei RAG-Systemen ist das oft der entscheidende Unterschied. Wer nur auf Keywords setzt, findet vor allem exakte Treffer. Semantische Suche wird dann interessant, wenn Formulierungen variieren, Synonyme vorkommen oder Fragen den Wortlaut der Quelle nicht direkt wiederholen.

> [!NOTE] Merksatz<br>
> Semantische Suche findet Bedeutung, nicht nur exakte Wörter. Das ermöglicht Treffer für Synonyme, verwandte Konzepte und paraphrasierte Satzstrukturen — selbst wenn kein Wort übereinstimmt.

---

## Zentrale Konzepte

| Konzept | Bedeutung |
|---|---|
| Embedding | Vektor-Repräsentation eines Textes |
| Collection | Speicherbereich für Dokumente, Metadaten und Embeddings |
| Chunk | Suchfähiger Ausschnitt eines größeren Dokuments |
| Similarity Search | Suche nach semantisch ähnlichen Inhalten |
| Retriever | LangChain-Schnittstelle für RAG-Abfragen |
| Persistenz | Speicherung von Vektordaten über Notebook- oder Server-Neustarts hinweg |

---

## Quickstart: ChromaDB Basics

ChromaDB ist eine leichtgewichtige, Open-Source-Vektordatenbank, die sich ideal für Entwicklung und Prototyping eignet.

ChromaDB vor allem deshalb nützlich, weil sich damit die Mechanik von Retrieval-Systemen gut nachvollziehen lässt. Für kleine bis mittlere Datenbestände funktioniert das meist unkompliziert. Die eigentlichen Qualitätsfragen entstehen nicht bei der Datenbank selbst, sondern bei Embeddings, Chunking und Retrieval-Parametern.

### Installation

**Standard-Installation:**

```python
!pip install chromadb langchain-chroma
```

`chromadb` ist der native ChromaDB-Client. `langchain-chroma` stellt die aktuelle LangChain-Integration `from langchain_chroma import Chroma` bereit.

**Google Colab – SQLite-Patch (WICHTIG!):**

In Colab kann es zu SQLite-Versionskonflikten kommen. Folgender Patch löst das Problem:

```python
# NUR in Google Colab erforderlich!
!pip install pysqlite3-binary

import sys
__import__('pysqlite3')
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
```

Dieser Patch muss **vor** dem Import von ChromaDB ausgeführt werden.

> [!DANGER] Reihenfolge beachten<br>
> Wird ChromaDB vor dem Patch importiert, schlägt die Initialisierung in Colab mit einem SQLite-Fehler fehl — und ChromaDB-Daten gehen ggf. unbemerkt verloren. Der Patch muss zwingend **vor** jedem `import chromadb` stehen.

### Client erstellen

```python
import chromadb

# In-Memory Client (Daten gehen bei Neustart verloren)
client = chromadb.Client()

# Persistenter Client (Daten werden gespeichert)
client = chromadb.PersistentClient(path="./chroma_db")
```

| Modus | Verwendung | Vorteil |
|-------|------------|---------|
| **In-Memory** | Entwicklung, Tests | Schnell, kein Aufräumen nötig |
| **Persistent** | Produktion, große Datenmengen | Daten überleben Neustart |

## Grundaufbau

### Collections

Eine **Collection** ist vergleichbar mit einer Tabelle in relationalen Datenbanken.

```python
# Collection erstellen
collection = client.create_collection(
    name="meine_dokumente",
    metadata={"description": "Firmendokumente für RAG"}
)

# Oder: Collection holen/erstellen (idempotent)
collection = client.get_or_create_collection(name="meine_dokumente")

# Bestehende Collection holen
collection = client.get_collection(name="meine_dokumente")

# Collection löschen
client.delete_collection(name="meine_dokumente")

# Alle Collections auflisten
print(client.list_collections())
```

**Best Practice:** `get_or_create_collection()` verwenden, um Fehler bei wiederholter Ausführung zu vermeiden.

Gerade in Notebooks zahlt sich das sofort aus. Viele Probleme entstehen nicht durch ChromaDB selbst, sondern durch wiederholt ausgeführte Setup-Zellen, inkonsistente Collection-Namen oder wechselnde Embedding-Konfigurationen.

> [!SUCCESS] Idempotenz im Alltag<br>
> `get_or_create_collection()` macht Notebooks robuster bei mehrfacher Ausführung und reduziert Setup-Fehler.     
> 
> *Idempotenz* = Operation kann mehrfach hintereinander ausgeführt werden kann, ohne dass sich das Ergebnis verändert

### Dokumente hinzufügen

```python
collection.add(
    documents=["Erster Text", "Zweiter Text", "Dritter Text"],
    ids=["doc1", "doc2", "doc3"],
    metadatas=[
        {"source": "handbuch.pdf", "seite": 1},
        {"source": "handbuch.pdf", "seite": 2},
        {"source": "richtlinie.pdf", "seite": 1}
    ]
)
```

**Parameter:**

| Parameter | Pflicht | Beschreibung |
|-----------|---------|--------------|
| `documents` | ✅ | Liste der Texte |
| `ids` | ✅ | Eindeutige IDs (Strings) |
| `metadatas` | ❌ | Zusätzliche Informationen pro Dokument |
| `embeddings` | ❌ | Vorgefertigte Vektoren (sonst automatisch) |

> [!TIP] Embedding-Konsistenz<br>
> Ohne explizite `embeddings` verwendet ChromaDB ein internes Embedding-Modell. Für Konsistenz mit LangChain immer dasselbe Embedding-Modell für Indexierung und Query verwenden — ein Wechsel des Modells führt zu Dimensionsmismatch und fehlerhaften Suchergebnissen.

---

## Embeddings mit OpenAI

Für produktive RAG-Systeme werden typischerweise OpenAI-Embeddings verwendet.

### Verfügbare Modelle

| Modell | Dimensionen | Kosten | Empfehlung |
|--------|-------------|--------|------------|
| `text-embedding-3-small` | 1536 | Günstig | ✅ Standard für Kurs |
| `text-embedding-3-large` | 3072 | Mittel | Höhere Qualität |
| `text-embedding-ada-002` | 1536 | Günstig | Legacy, nicht empfohlen |

### Embeddings erzeugen

```python
from langchain_openai import OpenAIEmbeddings

# Modell initialisieren
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Einzelner Text (für Queries)
query_vector = embeddings.embed_query("Was ist ein KI-Agent?")

# Mehrere Texte (für Dokumente)
texts = ["Text 1", "Text 2", "Text 3"]
doc_vectors = embeddings.embed_documents(texts)

print(f"Query-Vektor: {len(query_vector)} Dimensionen")
print(f"Dokument-Vektoren: {len(doc_vectors)} Stück")
```

### Alternative: Sentence Transformers (lokal)

Für Szenarien ohne API-Zugriff:

```python
# Zusatzpaket installieren, falls nicht vorhanden:
# !pip install langchain-huggingface

from langchain_huggingface import HuggingFaceEmbeddings

# Lokales Modell (kein API-Key nötig)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
```

**Vorteile:** Kostenlos, offline nutzbar, DSGVO-konform  
**Nachteile:** Geringere Qualität als OpenAI, benötigt mehr Speicher

---

## Typische Workflows: Dokumente indexieren und suchen

Bevor Dokumente durchsucht werden können, müssen sie in Chunks aufgeteilt und indexiert werden.

### Warum Chunking?

- **Kontextlimit:** LLMs haben begrenzte Eingabelänge
- **Präzision:** Kleinere Chunks ermöglichen gezieltere Treffer
- **Relevanz:** Nur relevante Teile werden dem LLM übergeben

### Chunking-Strategien

> [!TIP] Praktischer Startwert<br>
> Für viele deutschsprachige Wissensdokumente funktionieren `chunk_size=500` und `chunk_overlap=100` als stabiler Ausgangspunkt.
> 
> Für FAQ und Kurztexte eher 200–300, für Rechtsdokumente 800–1000 (vollständige Paragraphen). Kurs-Referenz: Tabelle in Kapitel 9.1.

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Standard-Splitter
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,      # Maximale Chunk-Größe in Zeichen
    chunk_overlap=100,   # Überlappung zwischen Chunks
    separators=["\n\n", "\n", ". ", " ", ""]  # Trennzeichen-Hierarchie
)

text = """Langer Dokumenttext hier...
Mit mehreren Absätzen...
Und viel Inhalt..."""

chunks = splitter.split_text(text)
print(f"Anzahl Chunks: {len(chunks)}")
```

**Parameter erklärt:**

| Parameter | Beschreibung | Empfehlung |
|-----------|--------------|------------|
| `chunk_size` | Maximale Zeichen pro Chunk | 500–1000 |
| `chunk_overlap` | Überlappung (verhindert Informationsverlust) | 10–20% von chunk_size |
| `separators` | Bevorzugte Trennstellen | Standard belassen |

### Overlap visualisiert

```mermaid
flowchart TB
    subgraph "Ohne Overlap - Informationsverlust"
        DOC1[Dokument: AAAA BBBB CCCC DDDD]
        C1[Chunk 1: AAAA]
        C2[Chunk 2: BBBB]
        C3[Chunk 3: CCCC]
        C4[Chunk 4: DDDD]

        DOC1 --> C1
        DOC1 --> C2
        DOC1 --> C3
        DOC1 --> C4

        WARN1[⚠️ Sätze werden zerrissen!]
    end

    subgraph "Mit 25% Overlap - Kontext erhalten"
        DOC2[Dokument: AAAA BBBB CCCC DDDD]
        O1[Chunk 1: AAAA BB]
        O2[Chunk 2: BB CCCC CC]
        O3[Chunk 3: CC DDDD]

        DOC2 --> O1
        DOC2 --> O2
        DOC2 --> O3

        OK1[✅ Kontext bleibt erhalten!]
    end

    style WARN1 fill:#f8cecc
    style OK1 fill:#d5e8d4
```

**ASCII-Darstellung:**
```
Dokument: [AAAA|BBBB|CCCC|DDDD]

Ohne Overlap:
  Chunk 1: [AAAA]
  Chunk 2: [BBBB]
  Chunk 3: [CCCC]
  → Sätze an Grenzen werden zerrissen!

Mit Overlap (25%):
  Chunk 1: [AAAA|BB]
  Chunk 2: [BB|CCCC]
  Chunk 3: [CC|DDDD]
  → Kontext bleibt erhalten!
```

### Vollständiger Indexierungs-Workflow

```mermaid
flowchart LR
    START([Dokument<br/>dokument.txt])
    LOAD[Document Loader<br/>TextLoader]
    SPLIT[Text Splitter<br/>RecursiveCharacterTextSplitter]
    EMBED[Embedding Model<br/>OpenAIEmbeddings]
    STORE[Vector Store<br/>ChromaDB]
    END([Indexed & Ready<br/>for Search])

    START --> LOAD
    LOAD -->|documents| SPLIT
    SPLIT -->|chunks<br/>chunk_size=500<br/>overlap=100| EMBED
    EMBED -->|vectors<br/>1536 dimensions| STORE
    STORE --> END

    style LOAD fill:#e1f5ff
    style SPLIT fill:#ffe6cc
    style EMBED fill:#d5e8d4
    style STORE fill:#dae8fc
```

```python
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

## 1. Dokument laden
loader = TextLoader("dokument.txt", encoding="utf-8")
documents = loader.load()

## 2. In Chunks aufteilen
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)
chunks = splitter.split_documents(documents)

print(f"Dokument in {len(chunks)} Chunks aufgeteilt")

## 3. Embeddings erstellen und in ChromaDB speichern
embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model,
    collection_name="meine_dokumente",
    persist_directory="./chroma_db"  # Optional: Persistenz
)

print("✅ Indexierung abgeschlossen!")
```

### Batch-Indexierung (große Datenmengen)

> [!WARNING] Hohe API-Kosten bei großen Datenmengen<br>
> 10.000 Dokumente × API-Calls für Embedding-Erzeugung können in einer Sitzung erhebliche Kosten verursachen. Batch-Größe und Gesamtvolumen vorher abschätzen, Fortschrittsanzeige (`tqdm`) verwenden.

Bei vielen Dokumenten sollte in Batches indexiert werden:

```python
from tqdm import tqdm

batch_size = 100
all_chunks = [...]  # Große Liste von Chunks

for i in tqdm(range(0, len(all_chunks), batch_size)):
    batch = all_chunks[i:i+batch_size]
    vectorstore.add_documents(batch)
```

---

## Similarity Search

Die Suche in der Vektordatenbank findet die semantisch ähnlichsten Dokumente.

### Similarity Search Workflow

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant App
    participant Embeddings as Embedding Model
    participant ChromaDB as Vector Store

    User->>App: Query: "Was sind KI-Agenten?"
    App->>Embeddings: embed_query(query)
    Embeddings-->>App: query_vector [1536 dims]
    App->>ChromaDB: similarity_search(query_vector, k=3)
    ChromaDB->>ChromaDB: Cosine Similarity<br/>mit allen Vektoren
    ChromaDB-->>App: Top-3 Documents<br/>with scores
    App-->>User: Relevante Dokumente

    Note over ChromaDB: Nur Vektoren vergleichen,<br/>kein Text-Matching
```

### Grundlegende Suche

```python
# Einfache Suche
results = vectorstore.similarity_search(
    query="Was sind die Vorteile von KI-Agenten?",
    k=3  # Anzahl der Ergebnisse
)

for i, doc in enumerate(results, 1):
    print(f"\n--- Treffer {i} ---")
    print(f"Inhalt: {doc.page_content[:200]}...")
    print(f"Metadaten: {doc.metadata}")
```

### Suche mit Scores

```python
# Suche mit Ähnlichkeits-Scores
results_with_scores = vectorstore.similarity_search_with_score(
    query="Was sind die Vorteile von KI-Agenten?",
    k=3
)

for doc, score in results_with_scores:
    print(f"Score: {score:.4f} | {doc.page_content[:100]}...")
```

**Score-Interpretation (Cosine Distance):**
- **0.0** = Perfekte Übereinstimmung
- **< 0.3** = Sehr relevant
- **0.3–0.5** = Relevant
- **> 0.5** = Weniger relevant

### Metadaten-Filtering

```python
# Nur Dokumente aus bestimmter Quelle
results = vectorstore.similarity_search(
    query="Sicherheitsrichtlinien",
    k=5,
    filter={"source": "sicherheit.pdf"}
)

# Komplexere Filter
results = vectorstore.similarity_search(
    query="Umsatzzahlen",
    k=5,
    filter={
        "$and": [
            {"jahr": {"$gte": 2023}},
            {"abteilung": "Vertrieb"}
        ]
    }
)
```

**Verfügbare Filter-Operatoren:**

| Operator | Beschreibung | Beispiel |
|----------|--------------|----------|
| `$eq` | Gleich | `{"status": {"$eq": "aktiv"}}` |
| `$ne` | Ungleich | `{"status": {"$ne": "archiviert"}}` |
| `$gt`, `$gte` | Größer (gleich) | `{"jahr": {"$gte": 2023}}` |
| `$lt`, `$lte` | Kleiner (gleich) | `{"seite": {"$lt": 10}}` |
| `$in` | In Liste | `{"typ": {"$in": ["pdf", "docx"]}}` |
| `$and`, `$or` | Logische Verknüpfung | Siehe Beispiel oben |

### Retriever erstellen

Für die Integration in LangChain-Chains wird ein Retriever benötigt:

```python
# Standard-Retriever
retriever = vectorstore.as_retriever(
    search_kwargs={"k": 3}
)

# Retriever mit Filter
retriever = vectorstore.as_retriever(
    search_kwargs={
        "k": 5,
        "filter": {"source": "handbuch.pdf"}
    }
)

# Retriever mit Score-Threshold
retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={
        "score_threshold": 0.5,  # Nur relevante Treffer
        "k": 10
    }
)
```

---

## Erweiterungen / Fortgeschrittene Themen

### LangChain-Integration

ChromaDB integriert sich nahtlos in LangChain für RAG-Systeme.

### Vectorstore erstellen (Zusammenfassung)

```python
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

# Variante 1: Aus Texten
vectorstore = Chroma.from_texts(
    texts=["Text 1", "Text 2", "Text 3"],
    embedding=OpenAIEmbeddings(model="text-embedding-3-small"),
    collection_name="demo",
    persist_directory="./chroma_db"
)

# Variante 2: Aus Documents (mit Metadaten)
vectorstore = Chroma.from_documents(
    documents=chunks,  # Liste von Document-Objekten
    embedding=OpenAIEmbeddings(model="text-embedding-3-small"),
    collection_name="demo"
)

# Variante 3: Bestehende Collection laden
vectorstore = Chroma(
    collection_name="demo",
    embedding_function=OpenAIEmbeddings(model="text-embedding-3-small"),
    persist_directory="./chroma_db"
)
```

### RAG-Chain mit LCEL

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.chat_models import init_chat_model

# Komponenten vorbereiten
llm = init_chat_model("openai:gpt-5.4-mini")
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# Hilfsfunktion: Dokumente formatieren
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# RAG-Prompt
rag_prompt = ChatPromptTemplate.from_template(
    """Beantworte die Frage basierend auf dem folgenden Kontext.
Wenn die Antwort nicht im Kontext steht, sage ehrlich, dass keine Information vorliegt.

Kontext:
{context}

Frage: {question}

Antwort:"""
)

# LCEL Chain
rag_chain = (
    {
        "context": retriever | format_docs,
        "question": RunnablePassthrough()
    }
    | rag_prompt
    | llm
    | StrOutputParser()
)

# Aufruf
antwort = rag_chain.invoke("Was sind die wichtigsten Sicherheitsrichtlinien?")
print(antwort)
```

### RAG als Agent-Tool

```python
from langchain_core.tools import tool

@tool
def firmenwissen_suchen(frage: str) -> str:
    """🔍 FIRMENWISSEN – Durchsucht interne Dokumente nach relevanten Informationen.
    
    Verwende dieses Tool für Fragen zu:
    - Unternehmensrichtlinien
    - Internen Prozessen
    - Produktinformationen
    
    Args:
        frage: Die Suchanfrage in natürlicher Sprache
    
    Returns:
        Relevante Informationen aus den Firmendokumenten
    """
    try:
        antwort = rag_chain.invoke(frage)
        return antwort
    except Exception as e:
        return f"Fehler bei der Suche: {str(e)}"
```

Für die vollständige RAG-Chain-Implementierung siehe **einsteiger-langchain.md, Kapitel 11**.

---

## Troubleshooting

> [!TIP] Diagnose-Reihenfolge<br>
> Zuerst Embedding-Modell, Chunking und `k`-Wert prüfen. Erst danach lohnt ein Umbau der gesamten Pipeline.

Häufige Probleme und deren Lösungen:

### SQLite-Versionsfehler (Google Colab)

**Fehlermeldung:**
```
sqlite3.OperationalError: database is locked
RuntimeError: Your system has an unsupported version of sqlite3
```

**Lösung:**
```python
# Am ANFANG des Notebooks ausführen (vor chromadb import!)
!pip install pysqlite3-binary

import sys
__import__('pysqlite3')
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

# Erst JETZT chromadb importieren
import chromadb
```

### Collection existiert bereits

**Fehlermeldung:**
```
ValueError: Collection meine_dokumente already exists
```

**Lösung:**
```python
# Option A: get_or_create verwenden (empfohlen)
collection = client.get_or_create_collection(name="meine_dokumente")

# Option B: Bestehende Collection löschen
client.delete_collection(name="meine_dokumente")
collection = client.create_collection(name="meine_dokumente")
```

### Keine Ergebnisse bei Suche

**Mögliche Ursachen und Lösungen:**

| Ursache | Diagnose | Lösung |
|---------|----------|--------|
| Collection leer | `collection.count()` prüfen | Dokumente hinzufügen |
| Falsches Embedding-Modell | Dimensionen vergleichen | Gleiches Modell für Index und Query |
| Query zu spezifisch | Mit breiterem Begriff testen | Query umformulieren |
| k zu klein | k erhöhen | `search_kwargs={"k": 10}` |

**Diagnose-Code:**
```python
# Collection-Status prüfen
print(f"Anzahl Dokumente: {vectorstore._collection.count()}")

# Test-Query ohne Filter
results = vectorstore.similarity_search("test", k=1)
print(f"Test-Ergebnis: {results}")
```

### Langsame Queries

**Optimierungen:**

```python
## 1. Batch-Größe bei Indexierung anpassen
vectorstore.add_documents(chunks, batch_size=100)

## 2. Persistenten Client verwenden
client = chromadb.PersistentClient(path="./chroma_db")

## 3. k reduzieren
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

## 4. Metadaten-Filter nutzen (reduziert Suchraum)
results = vectorstore.similarity_search(
    query="Frage",
    k=5,
    filter={"kategorie": "relevant"}
)
```

### Speicherprobleme

**Bei großen Datenmengen:**

```python
# In-Memory vermeiden
client = chromadb.PersistentClient(path="./chroma_db")

# Alte Collections aufräumen
for coll in client.list_collections():
    if "test" in coll.name:
        client.delete_collection(coll.name)
```

---

## Best Practices

### Chunk-Size Empfehlungen

| Dokumenttyp | chunk_size | chunk_overlap | Begründung |
|-------------|------------|---------------|------------|
| **FAQ / kurze Texte** | 200–300 | 50 | Präzise Antworten |
| **Handbücher** | 500–800 | 100–150 | Kontext erhalten |
| **Rechtsdokumente** | 800–1000 | 200 | Vollständige Paragraphen |
| **Code-Dokumentation** | 300–500 | 100 | Funktionen zusammenhalten |

### Embedding-Modell-Auswahl

| Kriterium | OpenAI | Sentence Transformers |
|-----------|--------|----------------------|
| **Qualität** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Kosten** | ~$0.02 / 1M Tokens | Kostenlos |
| **Geschwindigkeit** | Mittel (API) | Schnell (lokal) |
| **Offline** | ❌ | ✅ |
| **DSGVO** | ⚠️ Prüfen | ✅ |

**Empfehlung für Kurs:** `text-embedding-3-small` (beste Balance)

### Persistenz-Strategie

```python
# Entwicklung: In-Memory (schnell, sauber)
client = chromadb.Client()

# Produktion: Persistent
client = chromadb.PersistentClient(path="./chroma_db")

# Wichtig: Pfad in .gitignore aufnehmen!
# .gitignore:
# chroma_db/
```

### Metadaten sinnvoll nutzen

```python
# Gute Metadaten ermöglichen präzises Filtering
collection.add(
    documents=[chunk.page_content],
    ids=[f"doc_{i}"],
    metadatas=[{
        "source": "handbuch_v2.pdf",
        "seite": 42,
        "kapitel": "Sicherheit",
        "version": "2.0",
        "erstellt": "2024-01-15",
        "sprache": "de"
    }]
)

# Spätere Suche mit Filter
results = vectorstore.similarity_search(
    query="Passwortrichtlinien",
    filter={
        "$and": [
            {"kapitel": "Sicherheit"},
            {"version": "2.0"}
        ]
    }
)
```

### Qualitätssicherung

```python
# Test-Queries vor Produktion
test_queries = [
    "Was ist die Passwort-Policy?",
    "Wie beantrage ich Urlaub?",
    "Wer ist mein Ansprechpartner für IT-Probleme?"
]

for query in test_queries:
    results = vectorstore.similarity_search_with_score(query, k=3)
    print(f"\nQuery: {query}")
    for doc, score in results:
        print(f"  Score: {score:.3f} | {doc.page_content[:50]}...")
```

---

## Zusammenfassung

### Kernkonzepte

| Konzept | Beschreibung |
|---------|--------------|
| **Embedding** | Numerische Repräsentation von Text (Vektor) |
| **Vektordatenbank** | Speichert Vektoren und ermöglicht Ähnlichkeitssuche |
| **Similarity Search** | Findet semantisch ähnliche Dokumente |
| **Chunking** | Aufteilung großer Dokumente in kleinere Teile |
| **RAG** | Retrieval-Augmented Generation – LLM + externes Wissen |

### Typischer RAG-Workflow

```mermaid
flowchart TB
    LOAD[1. Dokumente laden<br/>TextLoader, PyPDFLoader]
    CHUNK[2. Chunking<br/>RecursiveCharacterTextSplitter<br/>chunk_size=500, overlap=100]
    EMBED[3. Embeddings erzeugen<br/>OpenAIEmbeddings<br/>text-embedding-3-small]
    STORE[4. In ChromaDB speichern<br/>Chroma.from_documents]
    RETRIEVE[5. Retriever erstellen<br/>vectorstore.as_retriever]
    CHAIN[6. RAG-Chain bauen<br/>LCEL Pipeline]
    AGENT[7. Agent mit RAG-Tool ausstatten<br/>create_agent + @tool]

    LOAD --> CHUNK
    CHUNK --> EMBED
    EMBED --> STORE
    STORE --> RETRIEVE
    RETRIEVE --> CHAIN
    CHAIN --> AGENT

    style LOAD fill:#e1f5ff
    style CHUNK fill:#ffe6cc
    style EMBED fill:#d5e8d4
    style STORE fill:#dae8fc
    style RETRIEVE fill:#e1f5ff
    style CHAIN fill:#ffe6cc
    style AGENT fill:#d5e8d4
```

**Text-Version:**
```
1. Dokumente laden
      ↓
2. Chunking (RecursiveCharacterTextSplitter)
      ↓
3. Embeddings erzeugen (OpenAIEmbeddings)
      ↓
4. In ChromaDB speichern
      ↓
5. Retriever erstellen
      ↓
6. RAG-Chain bauen (LCEL)
      ↓
7. Agent mit RAG-Tool ausstatten
```

### Quick Reference

```python
# Setup (Colab)
!pip install chromadb pysqlite3-binary
import sys; __import__('pysqlite3'); sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

# Imports
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Indexieren
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
chunks = splitter.split_documents(documents)
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=OpenAIEmbeddings(model="text-embedding-3-small"),
    collection_name="quick_reference"
)

# Suchen
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
results = retriever.invoke("Meine Frage")
```

---


> 🔗 **Weiterführend:** 
> + [ChromaDB Dokumentation](https://docs.trychroma.com/) 
> + [LangChain Chroma Integration](https://api.python.langchain.com/en/latest/chroma/vectorstores/langchain_chroma.vectorstores.Chroma.html)


## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Embeddings](../03-grundlagen/embeddings.html) | Warum funktionieren semantische Suchvektoren? |
| [RAG-Konzepte](../05-prompting-rag/rag-konzepte.html) | Wann wird ChromaDB Teil einer Retrieval-Architektur? |

---

**Version:** 1.1<br>
**Stand:** Juli 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.

