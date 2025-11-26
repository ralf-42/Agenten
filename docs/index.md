---
layout: default
title: Home
nav_order: 1
description: "Hauptseite - Multi-Agent Systeme mit LangChain & LangGraph"
permalink: /
---

# Agenten - Multi-Agent Systeme mit LangChain & LangGraph

> **Fortgeschrittene Implementierungen von KI-Agenten, Multi-Agent-Systemen und autonomen Workflows**

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

Für detaillierte Installationsanweisungen siehe: [Quick Start Guide](quickstart.html)

### Installation (Kurzversion)

```bash
# Projekt klonen
git clone https://github.com/ralf-42/Agenten.git
cd Agenten

# Python Environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Dependencies installieren
pip install -r requirements.txt

# Jupyter Lab starten
jupyter lab
```

---

## 📚 Dokumentation

### Einsteigerguides

Kompakte Übersichten für schnellen Einstieg:

| Dokument | Beschreibung |
|----------|--------------|
| [LangChain Einsteiger](Einsteiger_LangChain.html) | Grundlagen und Best Practices für LangChain |
| [LangGraph Einsteiger](Einsteiger_LangGraph.html) | Multi-Agent-Systeme und Workflows |
| [LangSmith Einsteiger](Einsteiger_LangSmith.html) | Monitoring & Debugging |

### Weitere Ressourcen

| Dokument | Beschreibung |
|----------|--------------|
| [Quick Start Guide](quickstart.html) | Installation und erste Schritte |
| [Vollständige Dokumentation](documentation.html) | Übersicht über alle Dokumentations-Ressourcen |
| [Code Standards](standards.html) | Coding-Konventionen und Best Practices |
| [Troubleshooting](Troubleshooting%20Sheets.html) | Lösungen für häufige Probleme |

---

## 🎯 Die 7 MUST-HAVE Features (LangChain 1.0+)

**PFLICHT für alle neuen Implementierungen:**

1. ✅ `init_chat_model()` - Unified Model Initialization
2. ✅ `with_structured_output()` - Native Structured Outputs
3. ✅ `@tool` Decorator - Tool Definitions
4. ✅ `create_agent()` - Modern Agent API
5. ✅ LCEL `|` Chains - Expression Language
6. ✅ Middleware - Human-in-Loop, Summarization, PII
7. ✅ Content Blocks - Multimodal Support

**Details:** [Code Standards](standards.html)

---

## 💡 Code-Beispiele

### Single-Agent mit Tools

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

### Multi-Agent System (LangGraph)

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

### RAG-System

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

---

## ⚠️ Breaking Changes: LangChain 0.x → 1.0+

| Alt (0.x) | Neu (1.0+) | Status |
|-----------|------------|--------|
| `ChatOpenAI()` direkt | `init_chat_model()` | ⛔ Deprecated |
| `PydanticOutputParser` | `with_structured_output()` | ⛔ Deprecated |
| `Tool()` wrapper | `@tool` decorator | ⛔ Deprecated |
| `initialize_agent()` | `create_agent()` | ⛔ Deprecated |

**Migration-Guide:** [Code Standards](standards.html)

---

## 🤝 Beitragen

Pull Requests sind willkommen! Bitte beachte:

1. **Code-Standards:** Nur LangChain 1.0+ Patterns verwenden → [Code Standards](standards.html)
2. **Dokumentation:** Docstrings für alle Funktionen
3. **Tests:** Notebooks müssen durchlaufen
4. **Commits:** Aussagekräftige Commit-Messages

---

## 📝 Lizenz

MIT License - Copyright (c) 2025 Ralf

---

## 📞 Kontakt & Support

- **Dokumentation:** [Vollständige Dokumentation](documentation.html)
- **GitHub Issues:** [github.com/ralf-42/Agenten/issues](https://github.com/ralf-42/Agenten/issues)
- **Projekt-Repository:** [github.com/ralf-42/Agenten](https://github.com/ralf-42/Agenten)

---

## 🔗 Externe Ressourcen

- [LangChain Documentation](https://python.langchain.com/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [LangChain v1.0 Migration Guide](https://docs.langchain.com/oss/python/migrate/langchain-v1)

---

**Letzte Aktualisierung:** November 2025 | **Version:** 1.0 | **Maintainer:** Ralf

---

> 💡 **Tipp:** Starte mit den [Einsteigerguides](documentation.html#-einsteigerguides-start-here) für einen schnellen Einstieg!
