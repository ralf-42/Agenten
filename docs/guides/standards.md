---
layout: default
title: Code Standards
parent: Guides
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

Vollständige Code-Konventionen und Best Practices für das Agenten-Projekt.

---

## 1 🎯 Die 7 MUST-HAVE Features (LangChain 1.0+)

**PFLICHT für alle neuen Implementierungen:**

### 1.1 ✅ `init_chat_model()` - Unified Model Initialization

**Warum:** Einheitliche API für alle LLM-Provider (OpenAI, Anthropic, Google, etc.)

```python
from langchain.chat_models import init_chat_model

# Separate Variablen für Konfiguration
model_provider = "openai"
model_name = "gpt-4o-mini"
temperature = 0.0

llm = init_chat_model(model_name, model_provider=model_provider, temperature=temperature)
```

---

### 1.2 ✅ `with_structured_output()` - Native Structured Outputs

**Warum:** Nutzt OpenAI's Native Structured Output API für garantierte Schema-Konformität

```python
from pydantic import BaseModel, Field

class Person(BaseModel):
    name: str = Field(description="Name der Person")
    age: int = Field(description="Alter in Jahren")

structured_llm = llm.with_structured_output(Person)
result = structured_llm.invoke("Max ist 25 Jahre alt")
```

---

### 1.3 ✅ `@tool` Decorator - Tool Definitions

**Warum:** Automatische Tool-Schema-Generierung aus Docstring und Type Hints

```python
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multipliziert zwei Zahlen."""
    return a * b
```

---

### 1.4 ✅ `create_agent()` - Modern Agent API

**Warum:** Moderne Agent-API basierend auf LangGraph (kein AgentExecutor mehr)

```python
from langchain.agents import create_agent

agent = create_agent(
    model=llm,
    tools=[tool1, tool2],
    system_prompt="You are a helpful assistant",
    debug=True
)

response = agent.invoke({
    "messages": [{"role": "user", "content": "your question"}]
})
```

---

### 1.5 ✅ LCEL `|` Chains

**Warum:** Moderne, lesbare Chain-Syntax mit automatischem Streaming-Support

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

chain = prompt | llm | StrOutputParser()
result = chain.invoke({"input": "text"})
```

---

### 1.6 ✅ Middleware für Agents

**Warum:** Middleware bietet granulare Kontrolle über die Agent-Loop

```python
from langchain.agents.middleware import HumanInTheLoopMiddleware, SummarizationMiddleware

middleware = [
    HumanInTheLoopMiddleware(tool_names=["delete_file"]),
    SummarizationMiddleware(max_tokens=1000)
]

agent = create_agent(
    model=llm,
    tools=tools,
    middleware=middleware
)
```

---

### 1.7 ✅ Standard Message Content Blocks

**Warum:** Provider-agnostische Content-Verarbeitung (Text, Bilder, Audio, Video)

```python
from langchain_core.messages import AIMessage

message = AIMessage(
    content=[
        {"type": "text", "text": "Here's the image analysis:"},
        {"type": "image", "url": "data:image/png;base64,...", "mime_type": "image/png"}
    ]
)

for block in message.content_blocks:
    if block["type"] == "text":
        print(block["text"])
    elif block["type"] == "image":
        display_image(block["url"])
```

---

## 2 📋 Namenskonventionen

### 2.1 Python Style Guide (PEP 8)

- **snake_case** für:
  - Variablen: `model_output`, `training_data`
  - Funktionen: `load_model()`, `preprocess_text()`
  - Module: `utilities.py`, `multimodal_rag.py`

- **PascalCase** für:
  - Klassen: `TypedDict`, `BaseModel` (Pydantic)
  - Beispiele: `ResearchState`, `Person`

- **UPPER_CASE** für:
  - Konstanten: `MAX_TOKENS`, `DEFAULT_TEMPERATURE`

### 2.2 Aussagekräftige Namen

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

## 3 🔧 Import-Struktur

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

### 3.1 Import-Konflikte vermeiden

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

## 4 📝 Code-Stil

### 4.1 Maximale Zeilenlänge

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

### 4.2 Docstrings

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

### 4.3 Kommentare

```python
# ✅ GUT: Erklärt das "Warum"
# Middleware verhindert versehentliches Löschen von Dateien
middleware = [HumanInTheLoopMiddleware(tool_names=["delete_file"])]

# ❌ SCHLECHT: Erklärt das "Was" (offensichtlich aus Code)
# Erstellt eine Liste mit einem HumanInTheLoopMiddleware-Objekt
middleware = [HumanInTheLoopMiddleware(tool_names=["delete_file"])]
```

---

## 5 ⚠️ Breaking Changes: 0.x → 1.0+

### 5.1 Migration-Tabelle

| Alt (0.x) | Neu (1.0+) | Status |
|-----------|------------|--------|
| `ChatOpenAI()` direkt | `init_chat_model()` | ⛔ Deprecated |
| `PydanticOutputParser` | `with_structured_output()` | ⛔ Deprecated |
| `Tool()` wrapper | `@tool` decorator | ⛔ Deprecated |
| `initialize_agent()` | `create_agent()` | ⛔ Deprecated |
| `AgentExecutor` | `create_agent()` (gibt Graph zurück) | ⛔ Deprecated |

### 5.2 Beispiel-Migration

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

llm = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0.0)
agent = create_agent(model=llm, tools=tools, debug=True)
```

---

## 6 🔒 Security Best Practices

### 6.1 API-Keys sicher verwalten

```python
# ✅ GUT: Umgebungsvariablen
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# ❌ SCHLECHT: Hardcoded API-Keys
api_key = "sk-..."  # NIEMALS!
```

### 6.2 Input-Validierung

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

### 6.3 PII-Handling

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

## 7 🧪 Testing Best Practices

### 7.1 Unit Tests

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

### 7.2 Integration Tests

```python
def test_agent_with_tools():
    llm = init_chat_model("gpt-4o-mini", model_provider="openai")

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

## 8 📚 Weitere Ressourcen

- **Quick References:** [Dokumentation](documentation.html)
- **Quick Start:** [Quick Start Guide](quickstart.html)
- **LangChain Docs:** [python.langchain.com](https://python.langchain.com/)
- **LangGraph Docs:** [langchain-ai.github.io/langgraph](https://langchain-ai.github.io/langgraph/)

---

> 💡 **Tipp:** Nutze die [Quick References](documentation.html) für konkrete Code-Beispiele!

---

**Version:** 1.0  
**Stand:** November 2025  
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.


