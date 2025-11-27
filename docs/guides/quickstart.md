---
layout: default
title: Quick Start
parent: Guides
nav_order: 1
description: "Installation und erste Schritte"
has_toc: true
---

# Quick Start Guide
{: .no_toc }

> **Installation und erste Schritte**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Schneller Einstieg in das Agenten-Projekt mit LangChain 1.0+ und LangGraph.

## 🚀 Installation

### 1. Repository klonen

```bash
git clone https://github.com/ralf-42/Agenten.git
cd Agenten
```

### 2. Python Environment einrichten

```bash
# Python 3.10+ erforderlich
python -m venv venv

# Environment aktivieren
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

### 3. Dependencies installieren

```bash
# Alle Abhängigkeiten installieren
pip install -r requirements.txt

# Oder mit uv (schneller)
uv pip install -r requirements.txt
```

### 4. API-Keys konfigurieren

Erstelle eine `.env` Datei im Projekt-Root:

```bash
# .env
OPENAI_API_KEY=sk-...
LANGCHAIN_API_KEY=lsv2_...  # Optional für LangSmith
LANGCHAIN_TRACING_V2=true   # Optional für Debugging
```

Oder setze Umgebungsvariablen:

```bash
# Linux/Mac
export OPENAI_API_KEY='sk-...'

# Windows
set OPENAI_API_KEY=sk-...
```

---

## 📝 Erste Schritte

### 1. Jupyter Lab starten

```bash
jupyter lab
```

### 2. Erstes Notebook öffnen

Navigiere zu `01_notebook/` und öffne:
- **M10_Agenten_LangChain.ipynb** - Single-Agent Basics
- **M08_RAG_LangChain.ipynb** - RAG-Systeme
- **M10c_Multi_Agent_Collaboration.ipynb** - Multi-Agent-Systeme

### 3. Setup im Notebook

Jedes Notebook beginnt mit diesem Standard-Setup:

```python
# ===== SETUP: API-Keys & Umgebung =====
import sys
from pathlib import Path

# Projekt-Root finden
project_root = Path.cwd()
while not (project_root / "04_modul").exists() and project_root != project_root.parent:
    project_root = project_root.parent

# Module verfügbar machen
sys.path.insert(0, str(project_root / "04_modul"))

# API-Keys laden
from genai_lib.utilities import setup_api_keys
setup_api_keys()
```

---

## 💡 Erste Beispiele

### Beispiel 1: Einfacher Agent

```python
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain_core.tools import tool

# LLM initialisieren
llm = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0.0)

# Tool definieren
@tool
def get_current_weather(location: str) -> str:
    """Gibt das aktuelle Wetter für einen Ort zurück."""
    return f"Das Wetter in {location} ist sonnig, 22°C"

# Agent erstellen
agent = create_agent(
    model=llm,
    tools=[get_current_weather],
    system_prompt="Du bist ein hilfreicher Wetter-Assistent"
)

# Agent ausführen
response = agent.invoke({
    "messages": [{"role": "user", "content": "Wie ist das Wetter in Berlin?"}]
})
print(response["messages"][-1].content)
```

### Beispiel 2: Strukturierte Outputs

```python
from pydantic import BaseModel, Field

# Schema definieren
class Person(BaseModel):
    name: str = Field(description="Name der Person")
    age: int = Field(description="Alter in Jahren")
    city: str = Field(description="Wohnort")

# LLM mit strukturiertem Output
structured_llm = llm.with_structured_output(Person)

# Aufruf
result = structured_llm.invoke("Max Mustermann ist 35 Jahre alt und lebt in München")
print(f"{result.name}, {result.age} Jahre, aus {result.city}")
```

### Beispiel 3: LCEL Chain

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Prompt Template
prompt = ChatPromptTemplate.from_messages([
    ("system", "Du bist ein hilfreicher Assistent."),
    ("user", "{input}")
])

# Chain mit LCEL (Pipe-Operator)
chain = prompt | llm | StrOutputParser()

# Aufruf
result = chain.invoke({"input": "Erkläre LangChain in einem Satz"})
print(result)
```

---

## 📚 Nächste Schritte

### 1. Einsteigerguides lesen

Kompakte Übersichten für schnellen Einstieg:
- [LangChain Einsteiger](Einsteiger_LangChain.html) - Grundlagen und Best Practices
- [LangGraph Einsteiger](Einsteiger_LangGraph.html) - Multi-Agent Workflows
- [LangSmith Einsteiger](Einsteiger_LangSmith.html) - Monitoring & Debugging

### 2. Code Standards beachten

Befolge die Coding-Konventionen:
- [Code Standards](standards.html) - Best Practices und Patterns

### 3. Projekt-Module nutzen

Installiere die Projekt-Module (für Google Colab):

```python
!uv pip install --system -q git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Module importieren
from genai_lib.utilities import setup_api_keys, mprint
from genai_lib.multimodal_rag import MultimodalRAG
```

### 4. Beispiel-Notebooks durcharbeiten

Empfohlene Reihenfolge:
1. **M10_Agenten_LangChain.ipynb** - Agent Basics
2. **M08_RAG_LangChain.ipynb** - RAG-Systeme
3. **M10c_Multi_Agent_Collaboration.ipynb** - Multi-Agent
4. **M04a_Multimodale_Modelle.ipynb** - Multimodal

---

## ⚡ Häufige Befehle

### Jupyter Lab

```bash
# Starten
jupyter lab

# Mit spezifischem Port
jupyter lab --port=8889

# Im Browser öffnen
jupyter lab --no-browser
```

### Environment Management

```bash
# Environment aktivieren
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Dependencies aktualisieren
pip install --upgrade -r requirements.txt

# Environment deaktivieren
deactivate
```

### LangChain Debugging

```bash
# Verbose mode
export LANGCHAIN_VERBOSE=true

# LangSmith Tracing
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=lsv2_...
```

---

## ❓ Troubleshooting

Für umfassende Lösungen siehe: [Troubleshooting Sheets](Troubleshooting%20Sheets.html)

### Problem: Module nicht gefunden

**Lösung:**
```python
# Projekt-Root zum Python-Pfad hinzufügen
import sys
from pathlib import Path
sys.path.insert(0, str(Path.cwd().parent / "04_modul"))
```

### Problem: API-Key Fehler

**Lösung:**
```python
# Überprüfen ob .env geladen wurde
from dotenv import load_dotenv
load_dotenv()

import os
print(os.getenv("OPENAI_API_KEY"))  # Sollte nicht None sein
```

### Problem: ChromaDB Fehler

**Lösung:**
```bash
# ChromaDB neu installieren
pip uninstall chromadb
pip install chromadb==0.4.22
```

---

## 📞 Hilfe & Support

- **Dokumentation:** [Vollständige Dokumentation](documentation.html)
- **Standards:** [Code Standards](standards.html)
- **Troubleshooting:** [Troubleshooting Sheets](Troubleshooting%20Sheets.html)
- **GitHub Issues:** [github.com/ralf-42/Agenten/issues](https://github.com/ralf-42/Agenten/issues)

---

> 💡 **Tipp:** Beginne mit den [Einsteigerguides](documentation.html) für strukturiertes Lernen!
