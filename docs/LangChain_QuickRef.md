# LangChain Quick Reference

> **Kompakte Übersicht der 7 wichtigsten Patterns + Anti-Patterns**
> 📖 Vollständige Dokumentation: [LangChain_Standards_Full.md](./LangChain_Standards_Full.md)

---

## ⚡ Die 7 MUST-HAVE Patterns

### 1. `init_chat_model()` - Unified Model Init

```python
from langchain.chat_models import init_chat_model

llm = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0.0)
```

---

### 2. `with_structured_output()` - Native Structured Outputs

```python
from pydantic import BaseModel, Field

class Person(BaseModel):
    name: str = Field(description="Name")
    age: int = Field(description="Alter")

structured_llm = llm.with_structured_output(Person)
result = structured_llm.invoke("Max ist 25 Jahre alt")  # → Person-Objekt
```

---

### 3. `@tool` Decorator - Tool Definitions

```python
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multipliziert zwei Zahlen."""
    return a * b
```

---

### 4. `create_agent()` - Modern Agent API

```python
from langchain.agents import create_agent

agent = create_agent(
    model=llm,
    tools=[multiply],
    system_prompt="Du bist ein hilfreicher Assistent",
    debug=True
)

response = agent.invoke({"messages": [{"role": "user", "content": "5 * 7?"}]})
```

---

### 5. LCEL Chains - Pipe Operator

```python
from langchain_core.output_parsers import StrOutputParser

chain = prompt | llm | StrOutputParser()
result = chain.invoke({"input": "Was ist LangChain?"})
```

---

### 6. Middleware - Human-in-Loop, Summarization

```python
from langchain.agents.middleware import HumanInTheLoopMiddleware

middleware = [
    HumanInTheLoopMiddleware(tool_names=["delete_file"])
]

agent = create_agent(model=llm, tools=[...], middleware=middleware)
```

---

### 7. Standard Message Content Blocks - Multimodal

```python
from langchain_core.messages import HumanMessage

message = HumanMessage(content=[
    {"type": "text", "text": "Was siehst du?"},
    {"type": "image", "url": "data:image/png;base64,..."}
])

response = llm.invoke([message])
```

---

## ⚠️ Top 5 Anti-Patterns

| # | Problem | Lösung |
|---|---------|--------|
| **1** | Agent ohne max_iterations | `create_agent(..., max_iterations=10)` |
| **2** | API-Key hardcoded | `os.environ["OPENAI_API_KEY"] = userdata.get("...")` |
| **3** | Tools ohne Type Hints | `@tool` mit vollständigen Type Hints |
| **4** | Prompt ohne Testing | Unit-Tests für Prompts schreiben |
| **5** | Fehlende Error-Handling | Try-Except um Tool-Calls |

---

## 🧪 Testing (Kurzform)

```python
def test_multiply_tool():
    result = multiply.invoke({"a": 5, "b": 3})
    assert result == 15

def test_agent_with_mock():
    from unittest.mock import Mock
    llm_mock = Mock()
    llm_mock.invoke.return_value = AIMessage(content="15")

    agent = create_agent(model=llm_mock, tools=[multiply])
    # Test agent behavior
```

---

## 🔒 Security (Kurzform)

```python
# ✅ API-Keys aus Environment
from genai_lib.utilities import setup_api_keys
setup_api_keys(['OPENAI_API_KEY'], create_globals=False)

# ✅ PII-Filter
def sanitize_pii(text: str) -> str:
    import re
    text = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[EMAIL]', text)
    return text

# ✅ Rate Limiting
from langchain.llms import RateLimitError
try:
    response = llm.invoke(prompt)
except RateLimitError:
    time.sleep(60)  # Retry nach 1 Minute
```

---

## 📚 Import-Cheatsheet

```python
# Core
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Middleware
from langchain.agents.middleware import HumanInTheLoopMiddleware

# Messages
from langchain_core.messages import AIMessage, HumanMessage
```

---

## 🔗 Vollständige Dokumentation

📖 **Für Details siehe:** [LangChain_Standards_Full.md](./LangChain_Standards_Full.md)

**Inhalt Full Standards:**
- Ausführliche Erklärungen zu jedem Pattern
- Alle 5 Anti-Patterns mit Beispielen
- Komplette Testing-Sektion (Unit, Integration, TDD)
- Komplette Security-Sektion (5 Aspekte)
- Breaking Changes von 0.x zu 1.0+
- Migration-Checkliste

---

**Version:** 1.0
**Tokens:** ~2.000 (vs. 12.000 in Full)
**Letzte Aktualisierung:** November 2025
