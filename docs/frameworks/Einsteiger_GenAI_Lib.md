---
layout: default
title: GenAI_Lib Einsteiger
parent: Frameworks
nav_order: 6
description: Projektspezifische Python-Bibliothek für Kursanwendungen
---

# GenAI_Lib - Projektspezifische Bibliothek
{: .no_toc }

> **Projektspezifische Bibliothek für den Kurs Generative KI**

---

Die `genai_lib` ist eine projektspezifische Python-Bibliothek, die speziell für die Anforderungen dieses Kurses entwickelt wurde. Sie bündelt wichtige Funktionen für multimodale RAG-Systeme und allgemeine Hilfsfunktionen.

## Inhalt
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Installation

Die `genai_lib` kann direkt aus dem GitHub-Repository installiert werden:

```bash
# Mit pip
pip install git+https://github.com/ralf-42/GenAI.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/GenAI.git#subdirectory=04_modul
```

## Module im Überblick

Die Bibliothek besteht aus zwei Hauptmodulen:

| Modul | Beschreibung | Hauptfunktionen |
|-------|-------------|----------------|
| **utilities.py** | Hilfsfunktionen für Environment-Setup | Environment-Checks, Paket-Installation, API-Keys, Prompt-Templates, LLM-Response-Parsing, Model-Profile, LangSmith Trace-Analyse |
| **multimodal_rag.py** | Multimodales RAG-System (v3.1) | Text- und Bildsuche, Bild-zu-Bild-Suche, Cross-Modal-Retrieval, System-Status |

---

## utilities.py - Hilfsfunktionen

### Überblick

Das `utilities`-Modul stellt grundlegende Hilfsfunktionen bereit, die in vielen Notebooks und Projekten wiederkehrend benötigt werden.

### Hauptfunktionen

#### 1. `check_environment()`

Überprüft die Entwicklungsumgebung und zeigt installierte Pakete an.

```python
from genai_lib.utilities import check_environment

check_environment()
```

**Ausgabe:**
- Python-Version
- Alle installierten LangChain-Bibliotheken
- Unterdrückt automatisch Deprecation-Warnungen

#### 2. `install_packages(packages)`

Installiert Python-Pakete automatisch, wenn sie noch nicht verfügbar sind.

```python
from genai_lib.utilities import install_packages

# Einfache Installation
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])
```

**Features:**
- Prüft, ob Pakete bereits installiert sind
- Verwendet `uv pip install` für schnelle Installation in Google Colab
- Gibt klare Statusmeldungen (✅ ❌ ⚠️ 🔄)
- Unterstützt Tupel für verschiedene Install- und Import-Namen

#### 3. `setup_api_keys(key_names, create_globals=True)`

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

#### 4. `get_ipinfo()`

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

#### 5. `mprint(text)`

Gibt Markdown-formatierten Text in Jupyter Notebooks aus.

```python
from genai_lib.utilities import mprint

mprint("# Überschrift\n**Fett** und *kursiv*")
```

#### 6. `mermaid(code, width=None, height=None)`

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

#### 7. `load_prompt(path, mode="T")`

Lädt Prompt-Templates aus Markdown-Dateien (.md) als ChatPromptTemplate oder String.

```python
from genai_lib.utilities import load_prompt

# ChatPromptTemplate (default, mode="T")
prompt = load_prompt('05_prompt/sql_prompt.md')

# Nur als String ohne Frontmatter (mode="S")
text = load_prompt('05_prompt/sql_prompt.md', mode="S")

# Von GitHub (tree oder blob URLs werden automatisch konvertiert)
prompt = load_prompt(
    'https://github.com/ralf-42/GenAI/blob/main/05_prompt/text_zusammenfassung.md'
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

#### 8. `extract_thinking(response)` 🆕

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

#### 9. `get_model_profile(model, print_profile=True, **kwargs)` 🆕

Ruft Model-Profile von models.dev ab und zeigt die wichtigsten Capabilities eines LLM-Modells. Nutzt intern `init_chat_model()` und gibt detaillierte Informationen über Structured Output, Function Calling, Vision, Token-Limits, etc. zurück.

```python
from genai_lib.utilities import get_model_profile

# Formatierte Ausgabe aller wichtigen Capabilities
profile = get_model_profile("openai:gpt-4o-mini")

# Output:
# 🔍 Model Profile: openai:gpt-4o-mini
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
profile = get_model_profile("anthropic:claude-3-sonnet", print_profile=False)

# Verschiedene Models vergleichen (mit Fehlerbehandlung)
for model in ["openai:gpt-4o-mini", "anthropic:claude-3-sonnet", "google:gemini-pro"]:
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

#### 10. `show_trace(project_name, limit=5, show_steps=False)` 🆕

Zeigt die letzten LangSmith-Runs eines Projekts als formatierte Markdown-Tabelle.
Mit `show_steps=True` werden alle Child-Runs (Tool-Calls, LLM-Calls) des letzten Runs
aufgelistet — ideal zur Erkennung von Trace-Patterns direkt im Notebook.

```python
from genai_lib.utilities import show_trace

# Letzte 3 Runs anzeigen
show_trace("M32-DeepAgents-Harness", limit=3)

# Mit Step-Analyse: zeigt alle Tool-Calls des letzten Runs
show_trace("M32-DeepAgents-Harness", show_steps=True)
```

**Ausgabe (Haupttabelle):**

| Run | Status | Dauer | Child-Runs |
|-----|--------|-------|------------|
| `m32-planning-demo` | ✅ success | 14.2s | 8 |
| `m32-custom-tools` | ✅ success | 6.1s | 5 |

**Ausgabe mit `show_steps=True`:**

| # | Typ | Name | Status | Dauer |
|---|-----|------|--------|-------|
| 1 | `tool` | `grep` | ✅ | 0.1s |
| 2 | `tool` | `grep` | ✅ | 0.1s |
| 3 | `llm` | `ChatOpenAI` | ✅ | 2.3s |

**Erkennbare Trace-Patterns:**

| Pattern | Erkennungszeichen |
|---------|------------------|
| Unexpected Tool Calls | `grep`-Calls bei reiner Wissensfrage |
| Retry-Loop | Gleicher Tool-Name mehrfach mit `error` |
| Over-Planning | Viele `write_todos`-Steps, wenig eigentliche Arbeit |
| Missing Tool Use | Keine Tool-Runs trotz verfügbarer Tools |

**Parameter:**
- `project_name` (str): Name des LangSmith-Projekts
- `limit` (int): Anzahl der anzuzeigenden Runs (Standard: 5)
- `show_steps` (bool): Child-Runs des letzten Runs anzeigen (Standard: False)

**Hinweis:** Benötigt `langsmith` (Soft-Dependency — wird nur bei Aufruf importiert).
Nach einem Agent-Run kurz warten: `time.sleep(2)` vor dem Aufruf.

---

## multimodal_rag.py - Multimodales RAG

### Überblick

Das `multimodal_rag`-Modul implementiert ein vollständiges RAG-System mit Unterstützung für Text- und Bilddokumente. Es kombiniert OpenAI-Embeddings für Text und CLIP-Embeddings für Bilder.

### Architektur

```
multimodal_rag
├── Text-Pipeline: OpenAI Embeddings + ChromaDB
├── Bild-Pipeline: CLIP Embeddings + ChromaDB
├── Vision-LLM: GPT-4o-mini für Bildbeschreibungen (via init_chat_model)
└── Hybride Suche: Text ↔ Bild ↔ Bild
```

**🆕 LangChain 1.0+ Integration (v3.1):**
- Nutzt `init_chat_model("openai:gpt-4o-mini")` für LLM-Initialisierung
- Vision-Analysen mit `HumanMessage` und Standard Content Blocks
- Provider-agnostische Multimodal-Verarbeitung

### Hauptfunktionen

#### 1. `init_rag_system(config=None)`

Initialisiert das vollständige RAG-System.

```python
from genai_lib.multimodal_rag import init_rag_system, RAGConfig

# Mit Standard-Konfiguration
rag = init_rag_system()

# Mit eigener Konfiguration
config = RAGConfig(
    chunk_size=300,
    chunk_overlap=50,
    clip_model='clip-ViT-B-32',
    llm_model='gpt-4o-mini',
    db_path='./my_rag_db'
)
rag = init_rag_system(config)
```

**Was wird initialisiert:**
- OpenAI Text-Embeddings
- CLIP-Modell für Bild-Embeddings
- GPT-4o-mini für Text und Vision (via `init_chat_model()` - LangChain 1.0+)
- ChromaDB mit zwei Collections (texts, images)
- MarkItDown für Dokumentenkonvertierung

**Interne LangChain 1.0+ Patterns:**
```python
# System nutzt intern moderne LangChain APIs
llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)

# Vision-Analyse mit Standard Content Blocks
message = HumanMessage(content=[
    {"type": "text", "text": "Beschreibe dieses Bild"},
    {"type": "image", "url": "data:image/png;base64,...", "mime_type": "image/png"}
])
```

#### 2. `process_directory(rag, directory_path, auto_describe_images=True)`

Verarbeitet ein Verzeichnis mit Text- und Bilddateien.

```python
from genai_lib.multimodal_rag import process_directory

# Verzeichnis mit automatischen Bildbeschreibungen
process_directory(rag, './files', auto_describe_images=True)

# Ohne Bildbeschreibungen (nur CLIP-Embeddings)
process_directory(rag, './files', auto_describe_images=False)
```

**Unterstützte Dateitypen:**
- **Text:** `.txt`, `.md`, `.pdf`, `.docx`, `.pptx`, `.xlsx`
- **Bilder:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`

**Features:**
- Automatische Dokumentenkonvertierung mit MarkItDown
- Text-Chunking mit RecursiveCharacterTextSplitter
- Automatische Bildbeschreibung mit GPT-4o-mini
- CLIP-Embeddings für Bilder
- Fortschrittsanzeige

#### 3. `multimodal_search(rag, query, k=5, text_only=False, images_only=False)`

Durchsucht Text und Bilder gleichzeitig.

```python
from genai_lib.multimodal_rag import multimodal_search

# Hybride Suche (Text + Bilder)
results = multimodal_search(rag, "Roboter mit KI", k=5)

# Nur Text
text_results = multimodal_search(rag, "Maschinelles Lernen", text_only=True)

# Nur Bilder
image_results = multimodal_search(rag, "rote Autos", images_only=True)
```

**Rückgabe:**
- `text_docs`: Liste von LangChain Documents mit Text-Chunks
- `image_results`: Liste von Dictionaries mit Bildpfaden und Metadaten

#### 4. `search_similar_images(rag, image_path, k=5)`

Findet ähnliche Bilder zu einem Query-Bild (Bild → Bild Suche).

```python
from genai_lib.multimodal_rag import search_similar_images

# Ähnliche Bilder finden
similar = search_similar_images(rag, "./query_image.jpg", k=5)

for img in similar:
    print(f"Ähnlichkeit: {img['similarity']:.2f}")
    print(f"Pfad: {img['image_path']}")
```

**Use Cases:**
- Duplikate finden
- Ähnliche Produkte vorschlagen
- Bildkategorisierung

#### 5. `search_text_by_image(rag, image_path, k=3)`

Findet Textdokumente, die zum Bildinhalt passen (Bild → Text Suche).

```python
from genai_lib.multimodal_rag import search_text_by_image

# Passende Texte zu einem Bild finden
texts = search_text_by_image(rag, "./product_image.jpg", k=3)

for doc in texts:
    print(doc.page_content)
```

**Use Cases:**
- Produktbeschreibungen zu Bildern finden
- Dokumentation zu Screenshots suchen
- Bild-Text-Verknüpfung in Datenbanken

#### 6. `get_system_status(rag)`

Gibt Statistiken über das RAG-System zurück.

```python
from genai_lib.multimodal_rag import get_system_status

status = get_system_status(rag)
print(f"Text-Chunks: {status['text_chunks']}")
print(f"Bilder: {status['images']}")
print(f"Bildbeschreibungen: {status['image_descriptions']}")
```

**Rückgabe:**
- `text_chunks`: Anzahl der Text-Dokument-Chunks
- `images`: Anzahl der Bilder in der Datenbank
- `image_descriptions`: Anzahl der Bildbeschreibungen
- `total_documents`: Gesamtanzahl aller Einträge

#### 7. `cleanup_database(db_path)`

Löscht die Datenbank komplett für einen Neustart.

```python
from genai_lib.multimodal_rag import cleanup_database

cleanup_database('./multimodal_rag_db')
```

### Vollständiges Beispiel

```python
from genai_lib.multimodal_rag import (
    init_rag_system,
    process_directory,
    multimodal_search,
    search_similar_images,
    get_system_status
)

# 1. System initialisieren
rag = init_rag_system()

# 2. Dokumente verarbeiten
process_directory(rag, './knowledge_base', auto_describe_images=True)

# 3. Status prüfen
status = get_system_status(rag)
print(f"Verarbeitet: {status['text_chunks']} Texte, {status['images']} Bilder")

# 4. Multimodale Suche (Text + Bilder + Cross-Modal)
results = multimodal_search(rag, "Neuronale Netze", k_text=3, k_images=3)
print(results)

# 5. Bild-zu-Bild Suche
similar = search_similar_images(rag, "./query_image.jpg", k=5)
for img in similar:
    print(f"{img['filename']}: {img['similarity']}")
```

---

## Best Practices

### 1. Environment-Setup in Notebooks

```python
from genai_lib.utilities import check_environment, setup_api_keys, install_packages

# 1. Environment checken
check_environment()

# 2. Pakete installieren
install_packages([
    'langchain',
    'langchain-openai',
    ('markitdown[all]', 'markitdown')
])

# 3. API-Keys setzen
setup_api_keys(["OPENAI_API_KEY"])
```

### 2. Multimodales RAG-System

```python
from genai_lib.multimodal_rag import (
    init_rag_system,
    RAGConfig,
    process_directory,
    multimodal_search
)

# Custom Konfiguration für große Dokumente
config = RAGConfig(
    chunk_size=500,
    chunk_overlap=100,
    text_threshold=1.0,
    db_path='./projekt_rag'
)

rag = init_rag_system(config)
process_directory(rag, './docs', auto_describe_images=True)
```

---

## Abhängigkeiten

### Kern-Abhängigkeiten
```python
# LangChain Stack
langchain>=1.1.0
langchain-core>=1.1.0
langchain-openai>=1.0.0
langchain-community>=0.3.0
langchain-chroma>=0.1.0

# OpenAI
openai>=1.0.0

# Multimodal
sentence-transformers>=3.0.0
pillow>=10.0.0
markitdown>=0.0.1

# Vektordatenbank
chromadb>=0.5.0

# Utilities
python-dotenv>=1.0.0
requests>=2.31.0
```

---

## Lizenz

MIT License - Copyright (c) 2025 Ralf

Die Module stehen unter der MIT-Lizenz und können frei für eigene Projekte verwendet werden.


## Abgrenzung zu verwandten Dokumenten

| Dokument | Inhalt |
|---|---|
| [Einsteiger LangChain](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_LangChain.html) | LangChain-Basis, auf der genai_lib aufbaut |
| [Einsteiger LangGraph](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_LangGraph.html) | LangGraph-Workflows, die genai_lib-Utilities nutzen |
| [Einsteiger Prompts](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_Prompts.html) |  aus genai_lib im Kontext von Prompt-Dateien |


---

**Version:** 3.2   
**Stand:** März 2026   
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.            


