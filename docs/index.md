---
layout: default
title: Start
nav_order: 1
description: "KI-Agenten mit LangChain & LangGraph"
permalink: /
---

# KI-Agenten

> **KI-Agenten. Verstehen. Anwenden. Gestalten. - Implementierungen von KI-Agenten, Multi-Agent-Systemen und autonomen Workflows**

## 1 🎯 Übersicht

Entwicklung und Implementierung von **KI-Agenten** und **Multi-Agent-Systemen** mit **LangChain 1.0+** und **LangGraph**.      
Praxisorientierte Notebooks, wiederverwendbare Module und umfassende Dokumentation für produktionsreife Agent-Systeme.

### 1.1 🔑 Kernthemen

- **Single-Agent Systeme** mit Tools und Middleware
- **Multi-Agent-Architekturen** (Supervisor, Hierarchical, Collaborative)
- **State Machines** mit LangGraph
- **Human-in-the-Loop** Workflows
- **RAG-Systeme** (Retrieval Augmented Generation)
- **Multimodale Agenten** (Text, Bild, Audio, Video)

---

## 2 🚀 Quick Start

**Installation:** Siehe [Quick Start Guide](guides/quickstart.html)

```bash
# Projekt klonen
git clone https://github.com/ralf-42/Agenten.git
cd Agenten

# Environment & Dependencies
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Jupyter Lab starten
jupyter lab
```

---

## 3 📚 Dokumentation

### 3.1 Einsteigerguides

| Dokument | Beschreibung |
|----------|--------------|
| [LangChain Einsteiger](frameworks/Einsteiger_LangChain.html) | Grundlagen und Best Practices |
| [LangGraph Einsteiger](frameworks/Einsteiger_LangGraph.html) | Multi-Agent-Systeme und Workflows |
| [LangSmith Einsteiger](frameworks/Einsteiger_LangSmith.html) | Monitoring & Debugging |
| [ChromaDB Einsteiger](frameworks/Einsteiger_ChromaDB.html) | Vektordatenbanken für RAG-Systeme |

### 3.2 Weitere Ressourcen

| Dokument | Beschreibung |
|----------|--------------|
| [Quick Start Guide](guides/quickstart.html) | Installation und erste Schritte |
| [Vollständige Dokumentation](guides/documentation.html) | Übersicht aller Ressourcen |
| [Code Standards](guides/standards.html) | Coding-Konventionen |
| [Troubleshooting](guides/Troubleshooting%20Sheets.html) | Lösungen für Probleme |

---

## 4 💡 Code-Beispiel

### 4.1 Single-Agent mit Tools

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

**Mehr Beispiele:** [Quick Start Guide](guides/quickstart.html)

---

## 5 🛠️ Technologie-Stack

- **LangChain** (>=1.0.0) - LLM-Orchestrierung, Chains, Agents
- **LangGraph** (>=0.2.0) - Multi-Agent-Systeme, State Machines
- **OpenAI API** (>=1.0.0) - GPT-4o, GPT-4o-mini
- **ChromaDB** (>=0.4.0) - Vektorspeicherung für RAG
- **Gradio** (>=3.x) - Webinterfaces für Demos

---

## 6 📞 Support

- **Dokumentation:** [Vollständige Dokumentation](guides/documentation.html)
- **GitHub Issues:** [github.com/ralf-42/Agenten/issues](https://github.com/ralf-42/Agenten/issues)
- **Projekt-Repository:** [github.com/ralf-42/Agenten](https://github.com/ralf-42/Agenten)

---

## 7 🔗 Externe Ressourcen

- [LangChain Documentation](https://python.langchain.com/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [OpenAI API Reference](https://platform.openai.com/docs)

---

---

**Version:** 1.0  
**Stand:** November 2025  
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.

---

> 💡 **Tipp:** Starte mit den [Einsteigerguides](guides/documentation.html) für einen schnellen Einstieg!
