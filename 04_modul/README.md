# Kursbibliothek Agenten

Diese Bibliothek stellt Hilfsmittel und Funktionen für den Kurs **"KI-Agenten"** bereit. Sie erleichtert Teilnehmer:innen den Einstieg und die praktische Anwendung von Multi-Agent-Systemen mit LangChain und LangGraph in Jupyter- und Google Colab-Umgebungen.

## 1. Installation

Die Bibliothek kann direkt aus GitHub installiert werden:

```bash
# Jupyter / lokal
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Google Colab (mit uv)
!uv pip install -q git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```

Nach der Installation:

```python
from genai_lib.utilities import mprint, mermaid, setup_api_keys, check_environment, show_trace
```

## 2. Architektur und Module

Die Bibliothek besteht aus modularen Hilfsdateien im `genai_lib/` Verzeichnis:

- **`utilities.py`** - Kernfunktionen: Markdown-Ausgabe, Mermaid-Diagramme, API-Key-Verwaltung, LangSmith Trace-Analyse, Model-Profile, Thinking-Parser, Prompt-Loader
- **`model_config.py`** - Rollenbasierte Modell-Konstanten (`BASELINE`, `ROUTER`, `JUDGE`, `PLANNER`, `WORKER`, `WORKER_PREMIUM`, `CODING`, `EMBEDDINGS`)

## 3. Abhängigkeiten

Vollständige Liste in `requirements.txt`. Wichtigste Pakete:

- `langchain`, `langchain-openai`, `langchain-community`
- `langgraph`
- `langsmith`
- `chromadb`

## 4. Funktionen (utilities.py)

### Notebook-Ausgabe

```python
from genai_lib.utilities import mprint, mermaid

mprint("# Überschrift\n**fett** und *kursiv*")   # Markdown rendern

mermaid('''
flowchart TB
    START([START]) --> AGENT[Agent]
    AGENT --> TOOL[Tool Call]
    TOOL --> END([END])
''')                                               # Mermaid-Diagramm rendern
```

- `mprint(text)` - Rendert Markdown in Jupyter/Colab
- `mermaid(code, width=None, height=None)` - Rendert Mermaid-Diagramme via CDN

### Umgebung und API-Keys

```python
from genai_lib.utilities import check_environment, setup_api_keys

check_environment()                               # Python- und LangChain-Versionen anzeigen
setup_api_keys(["OPENAI_API_KEY"])               # API-Keys aus Colab userdata laden
```

- `check_environment()` - Zeigt Python-Version und installierte LangChain/LangGraph-Pakete
- `setup_api_keys(key_names, create_globals=True)` - Setzt API-Keys aus Google Colab `userdata` als Umgebungsvariablen
- `install_packages(packages)` - Installiert fehlende Pakete automatisch via `uv pip` (Colab)
- `get_ipinfo()` - Zeigt Geoinformationen zur aktuellen IP-Adresse

### LangSmith Trace-Analyse

```python
from genai_lib.utilities import show_trace

show_trace("M12-MultiAgent", limit=5, show_steps=True)
```

- `show_trace(project_name, limit=5, show_steps=False)` - Analysiert LangSmith-Traces des angegebenen Projekts und zeigt Laufzeiten, Token-Nutzung und optional Einzelschritte

### Model-Profile

```python
from genai_lib.utilities import get_model_profile

profile = get_model_profile("openai:gpt-4o-mini")
```

- `get_model_profile(model, print_profile=True, **kwargs)` - Ruft Model-Capabilities von models.dev ab (Structured Output, Vision, Token-Limits, etc.)

### Thinking-Parser

```python
from genai_lib.utilities import extract_thinking

thinking, answer = extract_thinking(response)
```

- `extract_thinking(response)` - Extrahiert Denkprozess und Antwort aus LLM-Responses (unterstützt Claude, Qwen3, DeepSeek R1)

### Prompt-Template Loader

```python
from genai_lib.utilities import load_prompt

# ChatPromptTemplate aus Markdown-Datei laden
template = load_prompt("05_prompt/mein_prompt.md")           # lokal
template = load_prompt("https://github.com/.../prompt.md")  # GitHub-URL

# Als reinen String laden
text = load_prompt("05_prompt/mein_prompt.md", mode="S")
```

- `load_prompt(path, mode="T")` - Lädt Markdown-Prompt-Templates (lokal oder GitHub-URL)
  - `mode="T"` (Standard): gibt `ChatPromptTemplate` zurück
  - `mode="S"`: gibt Inhalt als String zurück (Frontmatter wird entfernt)

**Prompt-Format:**

```markdown
---
name: beispiel_prompt
variables: [text]
---

## system

Du bist ein hilfreicher Assistent.

## human

Bitte verarbeite folgenden Text: {text}
```

## 5. Typische Verwendung

```python
# 1. Setup
from genai_lib.utilities import setup_api_keys, check_environment
setup_api_keys(["OPENAI_API_KEY", "LANGSMITH_API_KEY"])
check_environment()

# 2. LLM initialisieren (LangChain 1.0+)
from langchain.chat_models import init_chat_model
llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)

# 3. Agent mit LangGraph erstellen
from langgraph.graph import StateGraph, START, END, MessagesState
from langchain_core.tools import tool

@tool
def my_tool(query: str) -> str:
    """Verarbeitet eine Anfrage."""
    return f"Ergebnis: {query}"

# 4. Ergebnis anzeigen und Trace analysieren
from genai_lib.utilities import mprint, show_trace
mprint(result)
show_trace("M12-MultiAgent", show_steps=True)
```

## 6. Entwicklung

```bash
# Installation im Entwicklungsmodus
pip install -e .

# Utilities testen
python -m genai_lib.utilities
```

## 7. Dateiorganisation

```
04_modul/
├── genai_lib/
│   ├── __init__.py          # Package-Exports
│   ├── utilities.py         # Kernfunktionen (mprint, mermaid, setup_api_keys, show_trace, ...)
│   └── model_config.py      # Rollenbasierte Modell-Konstanten (BASELINE, ROUTER, JUDGE, ...)
├── README.md
├── requirements.txt
└── setup.py
```

## 8. Lizenz

MIT License - Copyright (c) 2025 Ralf
