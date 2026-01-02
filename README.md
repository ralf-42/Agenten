# Agenten - Multi-Agent Systeme mit LangChain & LangGraph

[![LangChain 1.0+ Compliant](https://img.shields.io/badge/LangChain-1.0%2B%20Compliant-brightgreen)](./LangChain_Compliance_Report_2025-12-31.md)
[![Code Quality](https://img.shields.io/badge/Compliance-100%25-success)](./LangChain_Compliance_Report_2025-12-31.md)
[![Last Audit](https://img.shields.io/badge/Last%20Audit-2025--12--31-blue)](./LangChain_Compliance_Report_2025-12-31.md)

> **Fortgeschrittene Implementierungen von KI-Agenten, Multi-Agent-Systemen und autonomen Workflows**

## 🤖 For AI Agents

This repository includes **agent governance** documentation:

- **[AGENTS.md](./AGENTS.md)** - How AI agents should work with this codebase (role, rules, scope, quality gates)
- **[CLAUDE.md](./CLAUDE.md)** - Project structure, conventions, and technical documentation
- **[LangChain_1.0_Must_Haves.md](./LangChain_1.0_Must_Haves.md)** - Required patterns for all LangChain code
- **[LangGraph_1.0_Must_Haves.md](./LangGraph_1.0_Must_Haves.md)** - Required patterns for multi-agent systems

**Note:** AGENTS.md defines **behavior**, while CLAUDE.md describes **structure**. Read both before making changes.

## 🎯 Übersicht

Dieses Projekt fokussiert sich auf die Entwicklung und Implementierung von **KI-Agenten** und **Multi-Agent-Systemen** mit modernsten Technologien wie **LangChain 1.0+** und **LangGraph**. Es bietet praxisorientierte Notebooks, wiederverwendbare Module und umfassende Dokumentation für den Aufbau von produktionsreifen Agent-Systemen.

### 🔑 Kernthemen

- **Single-Agent Systeme** mit Tools und Middleware
- **Multi-Agent-Architekturen** (Supervisor, Hierarchical, Collaborative)
- **State Machines** mit LangGraph
- **Human-in-the-Loop** Workflows
- **Checkpointing & Memory** für langlebige Sessions
- **RAG-Systeme** (Retrieval Augmented Generation)
- **Multimodale Agenten** (Text, Bild, Audio, Video)

---

## 🚀 Quick Start

### Installation

```bash
# Projekt klonen
git clone https://github.com/ralf-42/Agenten.git
cd Agenten

# Python Environment (empfohlen: Python 3.10+)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Dependencies installieren
pip install -r requirements.txt

# Jupyter Lab starten
jupyter lab
```

### Erste Schritte

1. **API-Keys konfigurieren:**
   ```bash
   # .env Datei erstellen
   echo "OPENAI_API_KEY=your-key-here" > .env
   ```

2. **Erstes Notebook öffnen:**
   - Navigiere zu `01_notebook/`
   - Öffne ein Modul (z.B. `M10_Agenten_LangChain.ipynb`)
   - Folge dem Setup-Guide im Notebook

3. **Module nutzen:**
   ```python
   # Projekt-Module von GitHub installieren (für Google Colab)
   !uv pip install --system -q git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

   # Lokale Entwicklung
   from genai_lib.utilities import setup_api_keys, mprint
   from genai_lib.multimodal_rag import MultimodalRAG
   ```

---

## 📂 Projektstruktur

```
Agenten/
├── 01_notebook/              # Jupyter Notebooks (Kursmodule)
│   ├── M00-M18/              # Haupt-Module
│   └── X01-X99/              # Experimentelle Notebooks
├── 02_daten/                 # Trainingsdaten und Datasets
│   ├── 01_text/              # Text-Dateien
│   ├── 02_bild/              # Bilder
│   ├── 03_audio/             # Audio-Dateien
│   └── 04_video/             # Videos
├── 03_skript/                # Kursmaterialien & Dokumentation
├── 04_modul/                 # Python-Module (genai_lib)
│   └── genai_lib/            # Wiederverwendbare Bibliothek
│       ├── utilities.py      # Hilfsfunktionen
│       ├── multimodal_rag.py # Multimodales RAG-System
│       └── mcp_modul.py      # MCP-Integration
├── 05_prompt/                # Prompt-Templates
├── .claude/commands/         # Automatisierungskommandos
│   ├── README.md             # Command-Dokumentation
│   ├── sync-docs.md          # Dokumentations-Synchronisierung
│   └── check-langchain.md    # LangChain Compliance-Checks
├── AGENTS.md                 # Agent Governance (für KI-Assistenten)
├── CLAUDE.md                 # Projekt-Konventionen (Pflichtlektüre!)
├── LangChain_1.0_Must_Haves.md  # 7 MUST-HAVE Features
├── LangGraph_1.0_Must_Haves.md  # Multi-Agent Patterns
├── LangChain_QuickRef.md     # Quick Reference (~200 Zeilen)
├── LangGraph_QuickRef.md     # Quick Reference (~200 Zeilen)
├── LangSmith_QuickRef.md     # Quick Reference (~150 Zeilen)
├── LangChain_Standards_Full.md  # Full Standards (~1200 Zeilen)
├── LangGraph_Standards_Full.md  # Full Standards (~1200 Zeilen)
├── LangSmith_Standards_Full.md  # Full Standards (~1200 Zeilen)
├── Notebook_Template_Guide.md   # Standard-Notebook-Struktur
└── Project_Structure_Guide.md   # Verzeichnisstruktur-Guide
```

**Detaillierte Struktur:** Siehe [Project_Structure_Guide.md](./Project_Structure_Guide.md)

---

## 📚 Dokumentation (MUST-READ!)

### Pflicht-Lektüre für alle Entwickler

| Dokument | Zweck | Wann lesen? |
|----------|-------|-------------|
| **[AGENTS.md](./AGENTS.md)** 🤖 | Agent Governance (für KI-Assistenten) | **Für AI-Agents:** Vor allen Änderungen |
| **[CLAUDE.md](./CLAUDE.md)** | Projekt-Konventionen, Code-Standards | **START HIER!** Vor dem ersten Code |
| **[LangChain_1.0_Must_Haves.md](./LangChain_1.0_Must_Haves.md)** | 7 PFLICHT-Features für LangChain 1.0+ | Vor jedem neuen Agent/RAG-System |
| **[LangGraph_1.0_Must_Haves.md](./LangGraph_1.0_Must_Haves.md)** | Multi-Agent Patterns & State Machines | Vor Multi-Agent-Implementierung |
| **[Notebook_Template_Guide.md](./Notebook_Template_Guide.md)** | Standard-Struktur für Notebooks | Vor neuem Notebook |
| **[Project_Structure_Guide.md](./Project_Structure_Guide.md)** | Verzeichnis-Organisation | Setup neuer Projekte |

### Quick References (für schnellen Zugriff)

| Dokument | Beschreibung | Umfang |
|----------|--------------|--------|
| [LangChain_QuickRef.md](./LangChain_QuickRef.md) | 7 Patterns + Anti-Patterns | ~200 Zeilen |
| [LangGraph_QuickRef.md](./LangGraph_QuickRef.md) | Multi-Agent Patterns | ~200 Zeilen |
| [LangSmith_QuickRef.md](./LangSmith_QuickRef.md) | Monitoring & Debugging | ~150 Zeilen |

### Full Standards (für Deep Dive)

| Dokument | Beschreibung | Umfang |
|----------|--------------|--------|
| [LangChain_Standards_Full.md](./LangChain_Standards_Full.md) | Vollständige LangChain Standards | ~1200 Zeilen |
| [LangGraph_Standards_Full.md](./LangGraph_Standards_Full.md) | Vollständige LangGraph Standards | ~1200 Zeilen |
| [LangSmith_Standards_Full.md](./LangSmith_Standards_Full.md) | Vollständige LangSmith Standards | ~1200 Zeilen |

### 🎯 Die 7 MUST-HAVE Features (LangChain 1.0+)

**PFLICHT für alle neuen Implementierungen:**

1. ✅ `init_chat_model()` - Unified Model Initialization
2. ✅ `with_structured_output()` - Native Structured Outputs
3. ✅ `@tool` Decorator - Tool Definitions
4. ✅ `create_agent()` - Modern Agent API
5. ✅ LCEL `|` Chains - Expression Language
6. ✅ Middleware - Human-in-Loop, Summarization, PII
7. ✅ Content Blocks - Multimodal Support

**Details:** [LangChain_1.0_Must_Haves.md](./LangChain_1.0_Must_Haves.md)

---

## 🛠️ Technologie-Stack

### KI/ML Frameworks

- **LangChain** (>=1.0.0) - LLM-Orchestrierung, Chains, Agents
- **LangGraph** (>=0.2.0) - Multi-Agent-Systeme, State Machines
- **OpenAI API** (>=1.0.0) - GPT-4o, GPT-4o-mini

### Vektordatenbanken & RAG

- **ChromaDB** (>=0.4.0) - Vektorspeicherung
- **FAISS** - Schnelle Similarity Search
- **RecursiveCharacterTextSplitter** - Text-Chunking

### Visualisierung & UI

- **Plotly Express** - Interaktive Visualisierungen
- **Gradio** (>=3.x) - Webinterfaces für Demos

### Development

- **Jupyter Lab** - Interaktive Notebooks
- **Python** 3.10+ (erforderlich)
- **python-dotenv** - Environment-Management

---

## 💡 Use Cases & Beispiele

### 1. Single-Agent mit Tools

```python
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain_core.tools import tool

# LLM initialisieren
llm = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0.0)

# Tool definieren
@tool
def calculator(expression: str) -> float:
    """Berechnet mathematische Ausdrücke."""
    return eval(expression)

# Agent erstellen
agent = create_agent(
    model=llm,
    tools=[calculator],
    system_prompt="Du bist ein hilfreicher Assistent"
)

# Agent ausführen
response = agent.invoke({
    "messages": [{"role": "user", "content": "Berechne 123 * 456"}]
})
```

**Referenz-Notebook:** `01_notebook/M10_Agenten_LangChain.ipynb`

---

### 2. Multi-Agent System (LangGraph)

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.sqlite import SqliteSaver

# State Definition
class ResearchState(TypedDict):
    messages: Annotated[list, add_messages]
    topic: str
    report: str

# Agents
research_agent = create_agent(model=llm, tools=[web_search], ...)
writer_agent = create_agent(model=llm, tools=[write_doc], ...)

# Graph erstellen
builder = StateGraph(ResearchState)
builder.add_node("researcher", research_agent)
builder.add_node("writer", writer_agent)
builder.add_edge(START, "researcher")
builder.add_edge("researcher", "writer")
builder.add_edge("writer", END)

# Mit Checkpointing kompilieren
checkpointer = SqliteSaver.from_conn_string("research.db")
graph = builder.compile(checkpointer=checkpointer)
```

**Referenz-Notebook:** `01_notebook/M10c_Multi_Agent_Collaboration.ipynb`

---

### 3. RAG-System (Retrieval Augmented Generation)

```python
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.output_parsers import StrOutputParser

# Vectorstore erstellen
vectorstore = Chroma.from_documents(
    documents=docs,
    embedding=OpenAIEmbeddings()
)
retriever = vectorstore.as_retriever()

# RAG Chain (LCEL)
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# Query
answer = chain.invoke("Was ist LangGraph?")
```

**Referenz-Notebook:** `01_notebook/M08_RAG_LangChain.ipynb`

---

## 🎓 Code-Konventionen

### Namenskonventionen

- **snake_case** für Variablen, Funktionen, Module
- **PascalCase** für Klassen (TypedDict, Pydantic Models)
- Aussagekräftige Namen (nicht `x`, `temp`, `data`)

### Import-Struktur (Standard-Reihenfolge)

```python
# 1. Standardbibliotheken
import os
from pathlib import Path

# 2. LangChain Community
from langchain_community.vectorstores import Chroma

# 3. LangChain Core (LCEL)
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool

# 4. LangChain Top-Level
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent

# 5. Projekt-Module
from genai_lib.utilities import setup_api_keys
```

**Vollständige Standards:** [CLAUDE.md](./CLAUDE.md)

---

## ⚠️ Breaking Changes: LangChain 0.x → 1.0+

| Alt (0.x) | Neu (1.0+) | Status |
|-----------|------------|--------|
| `ChatOpenAI()` direkt | `init_chat_model()` | ⛔ Deprecated |
| `PydanticOutputParser` | `with_structured_output()` | ⛔ Deprecated |
| `Tool()` wrapper | `@tool` decorator | ⛔ Deprecated |
| `initialize_agent()` | `create_agent()` | ⛔ Deprecated |

**Migration-Guide:** [LangChain_1.0_Must_Haves.md](./LangChain_1.0_Must_Haves.md)

---

## 🤝 Beitragen

Pull Requests sind willkommen! Bitte beachte:

1. **Code-Standards:** Befolge [CLAUDE.md](./CLAUDE.md)
2. **LangChain 1.0+:** Nur moderne Patterns verwenden
3. **Dokumentation:** Docstrings für alle Funktionen
4. **Tests:** Notebooks müssen durchlaufen
5. **Commits:** Aussagekräftige Commit-Messages

---

## 📝 Lizenz

MIT License - Copyright (c) 2025 Ralf

---

## 📞 Kontakt & Support

- **GitHub Issues:** [github.com/ralf-42/Agenten/issues](https://github.com/ralf-42/Agenten/issues)
- **Projekt-Repository:** [github.com/ralf-42/Agenten](https://github.com/ralf-42/Agenten)

---

## 🔗 Externe Ressourcen

- [LangChain Documentation](https://python.langchain.com/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [LangChain v1.0 Migration Guide](https://docs.langchain.com/oss/python/migrate/langchain-v1)

---

**Letzte Aktualisierung:** November 2025
**Version:** 1.0
**Maintainer:** Ralf

---

> 💡 **Tipp:** Starte mit [CLAUDE.md](./CLAUDE.md) und den Must-Have-Dokumenten, bevor du Code schreibst!
