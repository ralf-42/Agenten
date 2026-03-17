---
layout: default
title: Code Standards
parent: Ressourcen
nav_order: 3
description: "Coding-Konventionen und Best Practices"
has_toc: true
---

# Code Standards
{: .no_toc }

> **Coding-Konventionen und Best Practices**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 🎯 LangChain 1.0+ Features

Die 7 MUST-HAVE Features für LangChain 1.0+ sind vollständig dokumentiert in:

👉 **[Einsteiger LangChain](../frameworks/Einsteiger_LangChain.html)** - Tutorial mit ausführlichen Erklärungen und Mermaid-Diagrammen

**Kurzübersicht der 7 Patterns:**

| # | Feature | Beschreibung |
|---|---------|--------------|
| 1 | `init_chat_model()` | Unified Model Initialization für alle Provider |
| 2 | `with_structured_output()` | Native Structured Outputs mit Pydantic |
| 3 | `@tool` Decorator | Tool-Definitionen mit Type Hints |
| 4 | `create_agent()` | Moderne Agent-API basierend auf LangGraph |
| 5 | LCEL `\|` Chains | Lesbare Chain-Syntax mit Pipe-Operator |
| 6 | Middleware | Granulare Kontrolle über Agent-Loop |
| 7 | Content Blocks | Provider-agnostische multimodale Inhalte |

**Neu in v1.2.0:** Tool Extras und response_format für Agents (siehe Einsteiger LangChain Abschnitte 5.3 und 6.2)

---

## 📋 Namenskonventionen

### Python Style Guide (PEP 8)

- **snake_case** für:
  - Variablen: `model_output`, `training_data`
  - Funktionen: `load_model()`, `preprocess_text()`
  - Module: `utilities.py`, `multimodal_rag.py`

- **PascalCase** für:
  - Klassen: `TypedDict`, `BaseModel` (Pydantic)
  - Beispiele: `ResearchState`, `Person`

- **UPPER_CASE** für:
  - Konstanten: `MAX_TOKENS`, `DEFAULT_TEMPERATURE`

### Aussagekräftige Namen

```python
# ✅ GUT: Beschreibende Namen
model_provider = "openai"
temperature = 0.0
max_retries = 3

# ❌ SCHLECHT: Kryptische Namen
mp = "openai"
temp = 0.0
mr = 3
```

---

## 🔧 Import-Struktur

**Standard-Reihenfolge für Imports:**

```python
# 1. Standardbibliotheken
import os
from pathlib import Path
from typing import List, Dict

# 2. LangChain Community
from langchain_community.vectorstores import Chroma

# 3. LangChain Core (LCEL)
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain_core.output_parsers import StrOutputParser

# 4. LangChain Top-Level
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent

# 5. Projekt-Module
from genai_lib.utilities import setup_api_keys
```

### Import-Konflikte vermeiden

```python
# ✅ EMPFOHLEN: Aliasing verwenden
from PIL import Image as PILImage
from IPython.display import Image as IPImage

# ✅ ALTERNATIVE: Modul-Import
import PIL.Image
from IPython import display
# Nutzung: PIL.Image.open() und display.Image()

# ❌ VERMEIDEN: Direkter Import (Konflikt!)
from PIL import Image
from IPython.display import Image  # Überschreibt PIL.Image!
```

---

## 📝 Code-Stil

### Maximale Zeilenlänge

- **88 Zeichen** (Black-Standard)
- Bei Überschreitung: Zeilenumbruch verwenden

```python
# ✅ GUT: Zeilenumbruch bei langen Chains
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# ❌ SCHLECHT: Zu lange Zeile
chain = {"context": retriever, "question": RunnablePassthrough()} | prompt | llm | StrOutputParser()
```

### Docstrings

```python
def process_documents(docs: List[str], chunk_size: int = 1000) -> List[str]:
    """
    Verarbeitet Dokumente und teilt sie in Chunks.

    Args:
        docs: Liste von Dokumenten als Strings
        chunk_size: Maximale Größe eines Chunks (default: 1000)

    Returns:
        Liste von Chunks als Strings

    Raises:
        ValueError: Wenn docs leer ist
    """
    if not docs:
        raise ValueError("docs darf nicht leer sein")

    # Implementation...
    return chunks
```

### Kommentare

```python
# ✅ GUT: Erklärt das "Warum"
# Middleware verhindert versehentliches Löschen von Dateien
middleware = [HumanInTheLoopMiddleware(tool_names=["delete_file"])]

# ❌ SCHLECHT: Erklärt das "Was" (offensichtlich aus Code)
# Erstellt eine Liste mit einem HumanInTheLoopMiddleware-Objekt
middleware = [HumanInTheLoopMiddleware(tool_names=["delete_file"])]
```

---

{: .important }
> **Migrationspflicht bei LangChain 0.x-Code.** Alle veralteten Patterns (`ChatOpenAI()`, `initialize_agent()`, `LLMChain`, `PydanticOutputParser`) funktionieren in neuen Projekten nicht mehr korrekt oder erzeugen Deprecation-Warnings. Bestehenden Code vor der Nutzung im Kurs auf 1.0+ migrieren.

## ⚠️ Breaking Changes: 0.x → 1.0+

### Migration-Tabelle

| Alt (0.x) | Neu (1.0+) | Status |
|-----------|------------|--------|
| `ChatOpenAI()` direkt | `init_chat_model()` | ⛔ Deprecated |
| `PydanticOutputParser` | `with_structured_output()` | ⛔ Deprecated |
| `Tool()` wrapper | `@tool` decorator | ⛔ Deprecated |
| `initialize_agent()` | `create_agent()` | ⛔ Deprecated |
| `AgentExecutor` | `create_agent()` (gibt Graph zurück) | ⛔ Deprecated |

### Beispiel-Migration

**ALT (0.x):**
```python
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION)
```

**NEU (1.0+):**
```python
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent

llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)
agent = create_agent(model=llm, tools=tools, debug=True)
```

---

## 🔒 Security Best Practices

### 1. API-Keys sicher verwalten

```python
# ✅ GUT: Umgebungsvariablen
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# ❌ SCHLECHT: Hardcoded API-Keys
api_key = "sk-..."  # NIEMALS!
```

### 2. Input-Validierung

```python
from pydantic import BaseModel, Field, field_validator

class UserInput(BaseModel):
    query: str = Field(min_length=1, max_length=500)

    @field_validator('query')
    def validate_query(cls, v):
        if not v.strip():
            raise ValueError("Query darf nicht leer sein")
        return v.strip()
```

### 3. PII-Handling

```python
from langchain.agents.middleware import PIIMiddleware

# PII automatisch erkennen und entfernen
middleware = [
    PIIMiddleware(
        patterns=["email", "phone", "ssn"],
        redact=True
    )
]
```

---

## 🧪 Testing Best Practices

### Unit Tests

```python
import pytest
from langchain_core.tools import tool

def test_calculator_tool():
    @tool
    def add(a: int, b: int) -> int:
        """Addiert zwei Zahlen."""
        return a + b

    result = add.invoke({"a": 2, "b": 3})
    assert result == 5
```

### Integration Tests

```python
def test_agent_with_tools():
    llm = init_chat_model("openai:gpt-4o-mini")

    @tool
    def get_weather(location: str) -> str:
        """Mock weather tool."""
        return f"Sunny in {location}"

    agent = create_agent(model=llm, tools=[get_weather])
    response = agent.invoke({
        "messages": [{"role": "user", "content": "Weather in Berlin?"}]
    })

    assert "Berlin" in response["messages"][-1].content
```

---

## 📚 Weitere Ressourcen

- **LangChain Tutorial:** [Einsteiger LangChain](../frameworks/Einsteiger_LangChain.html)
- **LangGraph Tutorial:** [Einsteiger LangGraph](../frameworks/Einsteiger_LangGraph.html)
- **LangChain Docs:** [python.langchain.com](https://python.langchain.com/)
- **LangGraph Docs:** [langchain-ai.github.io/langgraph](https://langchain-ai.github.io/langgraph/)

---

> 💡 **Tipp:** Für ausführliche LangChain-Beispiele mit Mermaid-Diagrammen siehe [Einsteiger LangChain](../frameworks/Einsteiger_LangChain.html)!

---

**Version:** 2.0 (konsolidiert)
**Stand:** Januar 2026
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
