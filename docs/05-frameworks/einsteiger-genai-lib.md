---
layout: default
title: Einsteiger GenAI_Lib
parent: Weitere Tools
grand_parent: Frameworks
nav_order: 2
description: "Projektspezifische Python-Bibliothek für Kursanwendungen"
has_toc: true
---

# GenAI_Lib - Projektspezifische Bibliothek
{: .no_toc }

> **Projektspezifische Bibliothek für den Kurs KI-Agenten**

---

Die `genai_lib` ist eine projektspezifische Python-Bibliothek, die speziell für die Anforderungen dieses Kurses entwickelt wurde. Sie bündelt die PMO-RAG-Kette, Modellrollen und allgemeine Hilfsfunktionen.

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Kurzüberblick: Was ist GenAI_Lib?

Die `genai_lib` bündelt wiederkehrende Hilfsfunktionen für den Agenten-Kurs: Environment-Checks, API-Key-Setup, Modellprofile, Rollenmodelle und die PMO-RAG-Kette. Sie ist keine externe Produktbibliothek, sondern die gemeinsame Kursbibliothek für Notebooks und Beispiele.

---

## Zentrale Konzepte

| Konzept | Bedeutung |
|---|---|
| `utilities.py` | Setup-, Diagnose- und Komfortfunktionen für Notebooks |
| `pmo_rag.py` | Laden, Chunking, Chroma-Indexierung und Agenten-Tools für den PMO-Korpus |
| `model_config.py` | Rollenbasierte Modellwahl für Agenten-Komponenten |
| Environment-Setup | Reproduzierbare Colab- und lokale Laufzeitumgebung |
| Model Roles | Trennung von Baseline, Worker, Judge, Planner und Router |

---

## Quickstart: Installation

Die `genai_lib` kann direkt aus dem GitHub-Repository installiert werden:

```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```

## Grundaufbau: Module im Überblick

Die Bibliothek besteht aus drei Hauptmodulen:

| Modul | Beschreibung | Hauptfunktionen |
|-------|-------------|----------------|
| **utilities.py** | Hilfsfunktionen für Environment-Setup | Environment-Checks, Paket-Installation, API-Keys, Prompt-Templates, LLM-Response-Parsing, Model-Profile, GitHub-Datei-Download |
| **pmo_rag.py** | Wiederverwendbare PMO-RAG-Kette | Mehrformat-Lader, Chunking, Chroma-Vectorstore, Indexierung, Tools `suche_wissensdatenbank` und `lies_tabellendaten` |
| **model_config.py** | Rollenbasierte Modell-Konfiguration | BASELINE, WORKER, JUDGE, PLANNER, ROUTER, CODING, WORKER_PREMIUM, FRONTIER, Medien-Rollen, EMBEDDINGS |

---

## Typische Workflows

Die folgenden Modulabschnitte zeigen typische Kurs-Workflows: Umgebung prüfen, API-Keys laden, Modellprofile vergleichen, die PMO-RAG-Kette aufbauen und Modellrollen zentral konfigurieren.

---

## utilities.py - Hilfsfunktionen

### Überblick

> [!NOTE] utilities.py auf einen Blick<br>
> Das `utilities`-Modul stellt grundlegende Hilfsfunktionen bereit, die in vielen Notebooks und Projekten wiederkehrend benötigt werden. Alle Funktionen sind über `from genai_lib.utilities import ...` importierbar.

### Hauptfunktionen

#### . `check_environment()`
Überprüft die Entwicklungsumgebung und zeigt installierte Pakete an.

```python
from genai_lib.utilities import check_environment

check_environment()
```

**Ausgabe:**
- Python-Version
- Alle installierten LangChain-Bibliotheken
- Unterdrückt automatisch Deprecation-Warnungen

#### . `install_packages(packages, upgrade=False)`
Installiert Python-Pakete automatisch, wenn sie noch nicht verfügbar sind.

```python
from genai_lib.utilities import install_packages

# Einfache Installation (überspringt bereits importierbare Pakete)
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])

# Versionspins erzwingen: immer installieren/aktualisieren
install_packages(['langchain-core>=1.3.0'], upgrade=True)
```

**Parameter:**
- `packages` (list): Paketnamen oder Tupel `(install_name, import_name)`
- `upgrade` (bool): `False` (Standard) — Skip wenn bereits importierbar. `True` — immer `uv pip install --upgrade` ausführen, nützlich für Versionspins.

**Features:**
- Prüft, ob Pakete bereits installiert sind
- Verwendet `uv pip install` für schnelle Installation in Google Colab
- Gibt klare Statusmeldungen (✅ ❌ ⚠️ 🔄)
- Unterstützt Tupel für verschiedene Install- und Import-Namen

#### . `setup_api_keys(key_names, create_globals=True)`
Lädt API-Keys aus Google Colab userdata und setzt sie als Umgebungsvariablen.

```python
from genai_lib.utilities import setup_api_keys

# Mit globalen Variablen (Standardverhalten)
setup_api_keys([
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "HF_TOKEN"
])

# Nur Umgebungsvariablen (keine globalen Variablen)
setup_api_keys(["OPENAI_API_KEY"], create_globals=False)
```

**Features:**
- Lädt Keys sicher aus Google Colab Secrets
- Erstellt optional globale Variablen für einfachen Zugriff
- Gibt Statusmeldungen für jeden Key aus
- Verhindert unbeabsichtigte Sichtbarkeit durch Return-Werte

#### . `get_ipinfo()`
Zeigt Geoinformationen zur aktuellen IP-Adresse an.

```python
from genai_lib.utilities import get_ipinfo

get_ipinfo()
```

**Ausgabe:**
- IP-Adresse
- Stadt, Region, Land
- Provider
- Koordinaten, Postleitzahl, Zeitzone

#### . `mprint(text)`
Gibt Markdown-formatierten Text in Jupyter Notebooks aus.

```python
from genai_lib.utilities import mprint

mprint("# Überschrift\n**Fett** und *kursiv*")
```

#### . `mermaid(code, width=None, height=None)`
Rendert Mermaid-Diagramme direkt im Notebook mit anpassbarer Größe.

```python
from genai_lib.utilities import mermaid

# Standard (automatische Größe)
mermaid('''
graph TD
    A[Start] --> B[Process]
    B --> C[End]
''')

# Mit angepasster Größe
mermaid('''
sequenceDiagram
    User->>Agent: Frage stellen
    Agent->>LLM: Query senden
    LLM-->>Agent: Antwort
    Agent-->>User: Ergebnis
''', width=800, height=600)
```

**Parameter:**
- `code` (str): Mermaid-Code für das Diagramm
- `width` (int, optional): Breite in Pixeln
- `height` (int, optional): Höhe in Pixeln

**Unterstützte Diagrammtypen:**
- Flowcharts (`graph TD`, `graph LR`)
- Sequenzdiagramme (`sequenceDiagram`)
- Gantt-Charts (`gantt`)
- State Machines (`stateDiagram`)

**Features:**
- Automatische oder manuelle Größenkontrolle
- Clientseitiges Rendering im Browser via Mermaid CDN (Emojis werden korrekt dargestellt)
- Robuste Fehlerbehandlung mit aussagekräftigen Fehlermeldungen
- Funktioniert in Google Colab und JupyterLab; nicht in VS Code Notebooks

#### . `load_prompt(path, mode="T")`
Lädt Prompt-Templates aus Markdown-Dateien (.md) als ChatPromptTemplate oder String.

```python
from genai_lib.utilities import load_prompt

# ChatPromptTemplate (default, mode="T")
prompt = load_prompt('05_prompt/sql_prompt.md')

# Nur als String ohne Frontmatter (mode="S")
text = load_prompt('05_prompt/sql_prompt.md', mode="S")

# Von GitHub (tree oder blob URLs werden automatisch konvertiert)
prompt = load_prompt(
    'https://github.com/ralf-42/Agenten/blob/main/05_prompt/pmo_system_prompt.md'
)
```

**Parameter:**
- `mode="T"`: Gibt ein `ChatPromptTemplate` zurück (benötigt `## system` / `## human` Sections)
- `mode="S"`: Gibt den Inhalt als reinen String zurück. Ein vorhandenes YAML-Frontmatter (Metadaten-Block zwischen `---` am Dateianfang) wird dabei automatisch entfernt und das Ergebnis mit `strip()` von führenden/folgenden Leerzeichen bereinigt.

**Template-Format (Markdown):**
```markdown
---
name: rag_prompt
description: RAG-Prompt für Question-Answering
variables: [system_prompt, question, context]
---

## system

{system_prompt}

## human

Question: {question}

Context: {context}

Answer:
```

**Format-Konvention:**
- YAML-Frontmatter: Metadaten (name, description, variables)
- `## system` / `## human`: Message-Rollen als H2-Headings
- `{variable}`: Platzhalter wie bei ChatPromptTemplate

#### . `extract_thinking(response)` 🆕
Universeller Parser für verschiedene Thinking-Formate von LLMs. Extrahiert den Denkprozess und die eigentliche Antwort aus unterschiedlichen Response-Strukturen.

```python
from genai_lib.utilities import extract_thinking

# Response von beliebigem LLM
response = llm.invoke("Erkläre Schritt für Schritt, was 2+2 ergibt")

# Universeller Parser für alle Formate
thinking, answer = extract_thinking(response)

print(f"Denkprozess: {thinking[:200]}...")
print(f"Antwort: {answer}")
```

**Unterstützte Formate:**

| Provider/Modell | Format | Beispiel |
|-----------------|--------|----------|
| Claude (Extended Thinking) | Liste mit `{"type": "thinking"}` Blöcken | `content = [{"type": "thinking", "thinking": "..."}]` |
| Gemini | Liste mit `{"type": "thinking"}` Blöcken | `content = [{"type": "thinking", "thinking": "..."}]` |
| Qwen3, DeepSeek R1 | String mit `<think>` Tags | `"<think>Denkprozess</think>Antwort"` |
| DeepSeek | `additional_kwargs["reasoning_content"]` | Separates Feld im Response |

**Rückgabe:**
- `thinking` (str): Extrahierter Denkprozess (leer, wenn nicht vorhanden)
- `answer` (str): Eigentliche Antwort

**Features:**
- Provider-agnostisch: Ein Parser für alle LLMs
- Fallback-Logik: Prüft automatisch alle bekannten Formate
- Robust: Gibt leeren Thinking-String zurück, wenn kein Denkprozess vorhanden

#### . `get_model_profile(model, print_profile=True, **kwargs)` 🆕
Ruft Model-Profile von models.dev ab und zeigt die wichtigsten Capabilities eines LLM-Modells. Nutzt intern `init_chat_model()` und gibt detaillierte Informationen über Structured Output, Function Calling, Vision, Token-Limits, etc. zurück.

```python
from genai_lib.utilities import get_model_profile

# Formatierte Ausgabe aller wichtigen Capabilities
profile = get_model_profile("openai:gpt-5.6-luna")

# Output:
# 🔍 Model Profile: openai:gpt-5.6-luna
# ============================================================
#
# 📋 Core Capabilities:
#   ✓ Structured Output:  True
#   ✓ Function Calling:   True
#   ✓ JSON Mode:          True
#   ✓ Reasoning:          False
#
# 🎨 Multimodal Capabilities:
#   ✓ Input:  📝 Text, 🖼️ Image
#   ✓ Output: 📝 Text
#
# 📊 Token Limits:
#   ✓ Max Input Tokens:   128000
#   ✓ Max Output Tokens:  16384
#
# ⚙️ Model Configuration:
#   ✓ Temperature:        Yes
#   ✓ Knowledge Cutoff:   2023-10
#
# 🔧 Additional Features:
#   ✓ Streaming:          True
#   ✓ Async:              True
# ============================================================

# Ohne Ausgabe (nur Profile-Dict zurückgeben)
profile = get_model_profile("openai:gpt-5.4-mini", print_profile=False)

# Verschiedene Models vergleichen (mit Fehlerbehandlung)
for model in ["openai:gpt-5.6-luna", "openai:gpt-5.4-mini", "openai:gpt-5.4", "openai:gpt-5.6-terra", "openai:gpt-5.6-sol"]:
    print(f"\n{model}:")
    profile = get_model_profile(model, print_profile=False)

    if profile:  # Nur verarbeiten, wenn Model erfolgreich initialisiert
        print(f"  Context: {profile['max_input_tokens']} tokens")
        print(f"  Vision: {profile['image_inputs']}")
        print(f"  Reasoning: {profile.get('reasoning', False)}")
        print(f"  Knowledge: {profile.get('knowledge_cutoff', 'N/A')}")
    else:
        print(f"  ❌ Fehler beim Initialisieren des Modells (Provider-Bibliothek fehlt?)")
```

**Parameter:**
- `model` (str): Model-Name im Format "provider:model"
- `print_profile` (bool): Formatierte Ausgabe aktivieren (Standard: True)
- `**kwargs`: Zusätzliche Parameter für `init_chat_model()` (z.B. max_tokens)

**Rückgabe:**
- `dict`: Vollständiges Model-Profile mit allen Capabilities

**Profile-Attribute (Auswahl):**

**Core Capabilities:**
- `structured_output`: Native Structured Output API
- `tool_calling`: Function Calling Support
- `supports_json_mode`: JSON Mode Support
- `reasoning`: Extended Thinking/Reasoning Support

**Multimodal Input:**
- `text_inputs`: Text Input (Standard) - Anzeige: 📝 Text
- `image_inputs`: Bild Input (Vision) - Anzeige: 🖼️ Image
- `audio_inputs`: Audio Input Support - Anzeige: 🎵 Audio
- `video_inputs`: Video Input Support - Anzeige: 🎬 Video

**Multimodal Output:**
- `text_outputs`: Text Output (Standard) - Anzeige: 📝 Text
- `image_outputs`: Bild-Generierung - Anzeige: 🖼️ Image
- `audio_outputs`: Audio-Generierung (TTS) - Anzeige: 🎵 Audio
- `video_outputs`: Video-Generierung - Anzeige: 🎬 Video

**Token Limits:**
- `max_input_tokens`: Context Window Größe
- `max_output_tokens`: Max. Output-Länge

**Model Configuration:**
- `temperature`: Temperature-Parameter Support
- `knowledge_cutoff`: Knowledge Cutoff Date

**Additional Features:**
- `streaming`: Streaming Support
- `async_capable`: Async Support

**Features:**
- Quelle: models.dev (Open-Source Model-Index)
- Automatische Capability-Detection
- Formatierte Übersicht mit Symbolen (📝🖼️🎵🎬) oder Raw-Dict
- Reasoning/Thinking Support Detection
- Temperature-Support-Check
- Knowledge Cutoff Date
- Perfekt für Modellvergleiche in Notebooks

**Use Cases:**
- Modell-Fähigkeiten vor Verwendung prüfen (Reasoning, Vision, Audio, etc.)
- Verschiedene LLMs vergleichen (Context Window, Multimodal, Knowledge)
- Feature-Gates in Code (z.B. "nur wenn Vision verfügbar")
- Reasoning-Modelle identifizieren (Claude Extended Thinking, DeepSeek R1)
- Temperature-Unterstützung prüfen
- Debugging und Dokumentation

#### . `copy_from_github(source, target, mask="*", ...)` 🆕
Kopiert Dateien aus einem GitHub-Repository (oder Unterverzeichnis) in ein lokales Verzeichnis — ohne vollständigen Clone.

```python
from genai_lib.utilities import copy_from_github

# Alle Notebooks aus dem Root eines Repos
copy_from_github("ralf-42/Agenten", "./lokal", mask="*.ipynb")

# Nur ein Unterverzeichnis, alle Python-Dateien
copy_from_github("ralf-42/Agenten/04_modul", "./module", mask="*.py")

# Vorschau: anzeigen, was kopiert würde (keine Dateien schreiben)
copy_from_github("ralf-42/Agenten", "./ziel", dry_run=True)

# Private Repos: Token übergeben oder GITHUB_TOKEN setzen
copy_from_github("myorg/private-repo", "./ziel", token="ghp_...")
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `source` | str | `owner/repo` oder `owner/repo/unterordner` (auch GitHub-URL) |
| `target` | str | Lokales Zielverzeichnis (wird erstellt) |
| `mask` | str | Dateimaske, z.B. `"*.ipynb"`, `"data_*.csv"` (Default: `"*"`) |
| `token` | str | GitHub-Token (alternativ: Env-Var `GITHUB_TOKEN`) |
| `recursive` | bool | Unterordner einschließen (Default: `True`) |
| `branch` | str | Branch-Name (Default: wird automatisch ermittelt) |
| `dry_run` | bool | Nur anzeigen, nichts kopieren |

**Rückgabe:**
- `list[str]`: Liste der kopierten (oder bei `dry_run=True`: gefundenen) Dateipfade

**Features:**
- Nutzt GitHub Contents API — kein `git clone` nötig
- Unterstützt Unterverzeichnisse großer Repos direkt
- Erhält die Verzeichnisstruktur im Zielverzeichnis
- Automatische Branch-Erkennung (`main`, `master`, etc.)

---

#### . `show_trace(project_name, limit=5, show_steps=False)` 🆕
Zeigt die letzten LangSmith-Runs eines Projekts als formatierte Markdown-Tabelle direkt im Notebook.

```python
from genai_lib.utilities import show_trace

# Letzte 5 Runs als Tabelle
show_trace("m11_rag_chain")

# Mit Step-Analyse des letzten Runs
show_trace("m11_rag_chain", limit=3, show_steps=True)
```

**Parameter:**
- `project_name` (str): Name des LangSmith-Projekts (z.B. `LANGSMITH_PROJECT="m11_rag_chain"`)
- `limit` (int): Anzahl der anzuzeigenden Runs (Standard: 5)
- `show_steps` (bool): Child-Runs (Tool-Calls, LLM-Calls) des letzten Runs anzeigen (Standard: False)

**Ausgabe (Haupttabelle):**

| Run | Status | Dauer | Child-Runs |
|-----|--------|-------|------------|
| `RunnableSequence` | ✅ success | 2.3s | 4 |
| `RunnableSequence` | ❌ error | 1.1s | 2 |

**Ausgabe mit `show_steps=True` (Step-Analyse):**

| # | Typ | Name | Status | Dauer |
|---|-----|------|--------|-------|
| 1 | `llm` | `ChatOpenAI` | ✅ | 1.8s |
| 2 | `tool` | `firmenwissen_suchen` | ✅ | 0.4s |

**Erkannte Anti-Patterns (`show_steps=True`):**
- **Retry-Loops:** Wiederholter Tool-Call mit gleichen Argumenten nach Fehler
- **Over-Planning:** Viele interne Steps, wenig Ergebnis-Output
- **Missing Tool Use:** Agent antwortet ohne Tool-Call trotz verfügbarer Tools
- **Hohe Child-Run-Anzahl:** Deutet auf interne Loops oder Middleware hin

**Voraussetzung:** LangSmith muss konfiguriert sein (`LANGSMITH_TRACING=true`, `LANGSMITH_API_KEY`).

---

## pmo_rag.py - PMO-RAG-Kette

### Überblick

Das Modul `pmo_rag` bündelt die RAG-Kette des PMO-Assistenten: Dokumente laden, in Chunks teilen, in eine persistente Chroma-Collection indexieren und als Tool für Agenten bereitstellen. Notebooks wie RAG-Agent, LangSmith Evaluations Basics, Integration Pipeline, Advanced RAG Pipeline Patterns, Gradio UI für Agenten und Production Deployment verwenden dieselbe Kette, statt sie jeweils neu aufzubauen. RAG Grundlagen baut dieselben Schritte bewusst Schritt für Schritt selbst, um die Mechanik zu zeigen.

### Architektur

```
pmo_rag
├── Laden:      load_documents_from_directory (MarkItDown), load_pdf_documents (pypdf)
├── Chunking:   split_documents_by_characters (Standard 300/30, Wortgrenzen)
├── Vectorstore: get_pmo_vectorstore + index_pmo_corpus (Chroma, Batching)
├── Kontext:    load_korpus_metadata, format_docs
└── Tools:      make_suche_wissensdatenbank_tool, make_lies_tabellendaten_tool
```

### Hauptfunktionen

| Funktion | Zweck |
|---|---|
| `get_pmo_vectorstore(persist_directory, collection_name)` | Erstellt oder lädt die Chroma-Collection `pmo_korpus` mit `EMBEDDINGS` |
| `index_pmo_corpus(vectorstore, directory_path, chunk_size=300, chunk_overlap=30, batch_size=500, force=False)` | Lädt, teilt und indexiert den Korpus; überspringt eine gefüllte Collection |
| `load_documents_from_directory(directory_path)` | Mehrformat-Lader für PDF, Markdown/Text, CSV, XLSX, JSON, XML, HTML und Word |
| `split_documents_by_characters(documents, chunk_size, chunk_overlap)` | Chunking mit Zeichenlängen an Wortgrenzen (`RecursiveCharacterTextSplitter`); `chunk_index` und `chunk_version` in den Metadaten |
| `make_suche_wissensdatenbank_tool(vectorstore, rag_chain=None)` | Erzeugt das Agenten-Tool `suche_wissensdatenbank` |
| `make_lies_tabellendaten_tool(directory_path)` | Erzeugt das Tool `lies_tabellendaten` für Budget- und Ressourcentabellen |
| `check_corpus(vectorstore, directory_path)` | Vergleicht Korpusdateien mit den indexierten Quellen |
| `load_korpus_metadata(metadata_path=None)` | Lädt Datum, Dokumenttyp sowie Entscheidungs- und Risiko-IDs |
| `format_docs(docs)` | Formatiert Treffer mit Quelle und Korpus-Metadaten |

### Typischer Ablauf im Notebook

```python
from google.colab import drive
drive.mount("/content/drive")

from genai_lib.pmo_rag import (
    get_pmo_vectorstore,
    index_pmo_corpus,
    make_suche_wissensdatenbank_tool,
)

vectorstore = get_pmo_vectorstore()
index_pmo_corpus(vectorstore, "/content/files", chunk_size=300, chunk_overlap=30)

suche_wissensdatenbank = make_suche_wissensdatenbank_tool(vectorstore)
tools = [suche_wissensdatenbank]
```

Ohne `rag_chain` liefert das Tool den formatierten Korpuskontext (Quelle, Dokument-Metadaten, Ausschnitt). Mit `rag_chain` erzeugt es daraus eine quellengebundene Antwort.

Der RAG-Ablauf bleibt in drei Schritte getrennt:

```python
# 1. Dokumente explizit abrufen
retrieved = retriever.invoke(frage)

# 2. Dokumente formatieren
kontext_text = format_docs(retrieved)

# 3. Reine Chain mit dem fertigen Dictionary aufrufen
antwort = rag_chain.invoke(
    {"context": kontext_text, "question": frage},
    config={"run_name": "m11_rag_chain_antwort"},
)
```

Die Chain selbst umfasst ausschließlich:

```python
rag_chain = prompt | llm | parser
```

Das optionale `rag_chain` kann beim Erzeugen des Tools übergeben werden:

```python
suche_wissensdatenbank = make_suche_wissensdatenbank_tool(
    vectorstore,
    rag_chain=rag_chain,
)
```

### Retriever und Relevanz-Score

`pmo_rag.py` verwendet für das Tool den normalen Retriever-Aufruf
`retriever.invoke(frage)`. Wenn in eigenen Experimenten zusätzlich Scores oder
Schwellwerte ausgewertet werden, gilt: Ein `score_threshold` bei
`as_retriever(search_type="similarity_score_threshold")` arbeitet mit einem
**Relevanz-Score** (höher = besser). Andere Chroma-Suchmethoden können dagegen
eine **Distanz** liefern (kleiner = ähnlicher). Beide Skalen dürfen nicht
gemischt werden.

### Grenzen und typische Fehler

- **Typischer Fehler:** Google Drive ist nicht gemountet. Bei Drive-Pfaden bricht `get_pmo_vectorstore()` mit `RuntimeError` ab, statt einen leeren Index anzulegen.
- **Typischer Fehler:** `force=True` am falschen Vectorstore. Der Aufruf löscht alle vorhandenen Einträge der Collection und baut sie neu auf.
- **Metadaten:** `load_korpus_metadata()` lädt `metadata.json` standardmäßig von GitHub. Offline entfällt nur die Zeile `Metadaten:` in der Tool-Ausgabe; die Suche selbst funktioniert weiter. Nur erfolgreiche Abrufe werden zwischengespeichert, nach einem Netzfehler versucht die nächste Anfrage es erneut. Lokal hilft `metadata_path`.
- **Chunking:** Chunks werden an Absätzen, Zeilenumbrüchen und Leerzeichen geschnitten, nicht mitten im Wort. Wer `chunk_size` oder `chunk_overlap` ändert, muss die Collection mit `force=True` neu indexieren, sonst mischen sich alte und neue Chunks.
- **Überlappung:** `chunk_overlap` greift nur, wenn ganze Zeilen oder Sätze hineinpassen. Bei kurzen Zeilen (zum Beispiel Tabellen in PDFs) fällt die tatsächliche Überlappung kleiner aus.
- **Chunk-Kopfzeile:** Jeder Chunk beginnt mit `Dokument: <Dateiname>` (zum Beispiel `Dokument: risikoliste v1`), damit Embeddings den Dokumenttyp abbilden. `index_pmo_corpus` erkennt Collections mit älterem Chunking (ohne Kopfzeile oder `chunk_version`) und baut sie automatisch neu auf.

---

## Best Practices

### . Environment-Setup in Notebooks
```python
from genai_lib.utilities import check_environment, setup_api_keys, install_packages

# . Environment checken
check_environment()

# . Pakete installieren
install_packages([
    'langchain',
    'langchain-openai',
    ('markitdown[all]', 'markitdown')
])

# . API-Keys setzen
setup_api_keys(["OPENAI_API_KEY"])
```

### . LangSmith Trace-Analyse
```python
from genai_lib.utilities import show_trace

# Letzte Runs prüfen
show_trace("m11_rag_chain")

# Step-Analyse für Debugging
show_trace("m11_rag_chain", show_steps=True)
```

### . PMO-RAG-Kette
```python
from genai_lib.pmo_rag import (
    get_pmo_vectorstore,
    index_pmo_corpus,
    check_corpus,
)

# Lokaler Test ohne Google Drive
vectorstore = get_pmo_vectorstore(persist_directory="./chroma_pmo_local")

# Neuaufbau nach geänderten Dokumenten oder geänderter Chunk-Größe
index_pmo_corpus(vectorstore, "./files", chunk_size=300, chunk_overlap=30, force=True)

# Prüfen, ob alle Korpusdateien indexiert sind
print(check_corpus(vectorstore, "./files"))
```

---

## Troubleshooting

### Installation schlägt fehl

Prüfe, ob `uv` verfügbar ist oder nutze den `pip`-Befehl aus dem Quickstart. In Colab muss die Installation vor Imports aus `genai_lib` erfolgen.

### API-Key wird nicht gefunden

Lege den Key in Google Colab Secrets an und rufe `setup_api_keys([...], create_globals=False)` erneut aus.

### Modellrolle liefert unerwartetes Modell

Prüfe die Rollen-Konfiguration in `model_config.py` und ob lokale Overrides oder Umgebungsvariablen gesetzt sind.

---

## Erweiterungen / Fortgeschrittene Themen

### Abhängigkeiten

### Kern-Abhängigkeiten
```python
# LangChain Stack
langchain>=1.3.13
langchain-core>=1.4.0
langchain-openai>=1.2.2
langchain-text-splitters>=1.1.2
langchain-chroma>=1.1.0
langchain-ollama>=1.1.0

# Dokumente laden (pmo_rag)
pypdf>=5.0.0
markitdown[all]>=0.0.1

# LangGraph Stack
langgraph>=1.2.4
langgraph-checkpoint>=4.1.1
langgraph-checkpoint-sqlite>=3.1.0
langgraph-prebuilt>=1.1.0
langgraph-sdk>=0.4.2

# LangSmith
langsmith>=0.8.0

# Agent Harness
deepagents>=0.7.0

# OpenAI
openai>=2.0.0

# Vektordatenbank
chromadb>=1.0.0

# Pillow-Pin (Colab-Basisimage, wird u.a. von Gradio importiert)
pillow>=11.0.0,<12.0.0

# Utilities
requests>=2.32.0

# Notebook-Tooling
nbformat>=5.10.0
```

---

### model_config.py - Rollenbasierte Modell-Konfiguration

### Überblick

> [!NOTE] model_config.py auf einen Blick<br>
> Das `model_config`-Modul definiert Modell-IDs als benannte Konstanten nach Rolle. Die Instanziierung erfolgt im Notebook mit `init_chat_model()`, sodass API-Keys bereits gesetzt sind.

```python
from genai_lib.model_config import BASELINE, WORKER, JUDGE, FRONTIER
```

### Konstanten

| Konstante | Modell | Typischer Einsatz |
|-----------|--------|------------------|
| `BASELINE` | `gpt-5.6-luna` | Grundlagen, günstige Demos, kurze Modellaufrufe |
| `ROUTER` | `gpt-5.6-luna` | Einfache Routing- und Auswahlentscheidungen |
| `WORKER` | `gpt-5.4-mini` | RAG-Synthese, strukturierte Ausgaben, Tool-Agenten |
| `CODING` | `gpt-5.4-mini` | Code-Generierung, Refactoring, technische Agenten |
| `JUDGE` | `gpt-5.4` | Evaluation, Bewertung, LLM-as-Judge |
| `PLANNER` | `gpt-5.4` | Aufgabenzerlegung, Supervisor-Logik, Agentic RAG |
| `WORKER_PREMIUM` | `gpt-5.6-terra` | Komplexe RAG, finale Reports |
| `FRONTIER` | `gpt-5.6-sol` | Schwierige Coding-, Judge- und Agenten-Aufgaben |
| `IMAGE_GENERATION` | `gpt-image-2` | Bildgenerierung |
| `TRANSCRIPTION` | `gpt-4o-mini-transcribe` | Audio-Transkription |
| `TRANSCRIPTION_SEGMENTS` | `whisper-1` | Audio-Transkription mit `verbose_json` und Segment-Zeitstempeln |
| `EMBEDDINGS` | `text-embedding-3-small` | Retrieval, Chunk-Suche, Vektorindizes |


### Verwendung

```python
from langchain.chat_models import init_chat_model
from genai_lib.model_config import BASELINE, WORKER, JUDGE, FRONTIER

# Demo / Grundlagen
llm = init_chat_model(BASELINE)

# RAG-Synthese
worker_llm = init_chat_model(WORKER)

# Evaluation
judge_llm = init_chat_model(JUDGE)

# Frontier-Aufgaben
frontier_llm = init_chat_model(FRONTIER)
```

> [!DANGER] Kein temperature bei GPT-5.x<br>
> `BASELINE`, `WORKER`, `JUDGE`, `PLANNER`, `ROUTER`, `CODING`, `WORKER_PREMIUM` und `FRONTIER` basieren auf GPT-5.x-Modellen. `temperature` wird für diese Rollen nicht gesetzt. Das gilt nicht automatisch für Medienmodelle wie `IMAGE_GENERATION` oder `TRANSCRIPTION`.

---

## Zusammenfassung

GenAI_Lib ist die gemeinsame technische Basis für Kurs-Notebooks im Agenten-Projekt. Für Einsteiger sind zuerst Installation, Environment-Check und API-Key-Setup wichtig; danach folgen Modellrollen und die PMO-RAG-Kette als fortgeschrittene Bausteine.

---

## Lizenz

MIT License - Copyright (c) 2025 Ralf

Die Module stehen unter der MIT-Lizenz und können frei für eigene Projekte verwendet werden.



## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Standards](../10-ressourcen/standards.html) | Welche projektweiten Code- und Notebook-Regeln gelten? |
| [Modell-Auswahl Guide](../03-modelle-provider-anpassung/modellauswahl.html) | Welche Modellrolle passt zu welchem Kursbeispiel? |

---

**Version:** 3.5<br>
**Stand:** Oktober 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.


