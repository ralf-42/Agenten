# LangChain 1.0+ MUST-HAVE Features

> **Pflichtlektüre für alle neuen Notebooks und Code im GenAI-Projekt**

Dieses Dokument fasst die 7 verpflichtenden Features für LangChain 1.0+ zusammen, die in allen neuen Implementierungen verwendet werden **MÜSSEN**.

---

## 📋 Übersicht der 7 MUST-HAVE Features

| # | Feature | Priorität | Ersetzt | Hauptvorteil |
|---|---------|-----------|---------|--------------|
| 1 | `init_chat_model()` | ⭐ PFLICHT | `ChatOpenAI()` direkt | Provider-Unabhängigkeit |
| 2 | `with_structured_output()` | ⭐ PFLICHT | `PydanticOutputParser` | Garantierte Schema-Konformität |
| 3 | `@tool` Decorator | ⭐ PFLICHT | `Tool()` wrapper | Automatische Schema-Generierung |
| 4 | `create_agent()` | ⭐ PFLICHT | `initialize_agent()` + `AgentExecutor` | LangGraph-basierte State Machine |
| 5 | LCEL `\|` Chains | ⭐ PFLICHT | Legacy Chain-Syntax | Moderne Pipe-Operator-Syntax |
| 6 | Middleware für Agents | ⭐ PFLICHT | Hook-Pattern | Production-Ready Features |
| 7 | Standard Content Blocks | ⭐ PFLICHT | Provider-spezifische Formate | Multimodal-Support |
| 8 | `.with_retry()` / `.with_fallbacks()` | 💡 EMPFOHLEN | Manuelle try/except-Blöcke | Robuste Production-Chains |

---

## 🆕 What's New in LangChain v1.2.0 (December 15, 2025)

LangChain v1.2.0 erweitert **3 von 7 Must-Haves** mit production-ready Features:

| Feature | Update | Impact |
|---------|--------|--------|
| **#2 with_structured_output()** | 🆕 Strict Schema für Agents | `response_format` in `create_agent` |
| **#3 @tool Decorator** | 🆕 Tool Extras | Provider-spezifische Tool-Parameter |
| **#4 create_agent()** | 🆕 response_format | Strikte Agent-Response-Validierung |

**Wichtigste Neuerungen v1.2.0:**
- ✨ **Tool Extras**: Provider-native Features (Anthropic programmatic tool calling, OpenAI strict mode)
- ✨ **Strict Schema Adherence**: `response_format` für garantierte Agent-Output-Konformität
- ✨ **Built-in Client-Side Tools**: Anthropic, OpenAI, und weitere Provider

**Wichtigste Neuerungen v1.1.0** (bereits integriert):
- ✨ **Model Profiles** (`.profile` Attribut): Chat-Modelle exposieren ihre Capabilities
- ✨ **Smart Structured Output**: `ProviderStrategy` wird automatisch aus Profiles abgeleitet
- ✨ **SystemMessage in create_agent**: Cache-Control für Anthropic Claude
- ✨ **ModelRetryMiddleware**: Automatische Retries mit exponential backoff
- ✨ **ContentModerationMiddleware**: OpenAI Moderation für User/Model/Tool-Outputs
- ✨ **Verbesserter SummarizationMiddleware**: Nutzt Model Profiles für intelligente Zusammenfassungen

**Wichtigste Neuerungen v1.2.1-v1.2.10** (Januar/Februar 2026):
- ✨ **ContextOverflowError**: Neuer Fehlertyp in `langchain-core` - wird von `langchain-openai` und `langchain-anthropic` ausgelöst, wenn das Context-Window überschritten wird. `SummarizationMiddleware` triggert automatisch bei diesem Fehler.
- ✨ **Token-Zählung für Tool-Schemas**: `count_tokens_approximately()` zählt jetzt auch Tokens aus Tool-Schemas für genauere Budgetierung.

**Wichtigste Neuerungen v1.1.10 (langchain-openai)** (Februar 2026):
- ✨ **Automatic Server-Side Compaction**: `context_management=[{"type": "compaction", "compact_threshold": N}]` — OpenAI komprimiert Konversationshistorie serverseitig, keine SummarizationMiddleware nötig.

**Breaking Changes:** Keine! v1.2.x ist vollständig rückwärtskompatibel mit v1.0+

---

## 1️⃣ `init_chat_model()` - Unified Model Initialization

### ❌ ALT (nicht mehr verwenden)
```python
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Auch veraltet: Langnotation mit separaten Variablen
model_provider = "openai"
model_name = "gpt-4o-mini"
llm = init_chat_model(model_name, model_provider=model_provider, temperature=0)
```

### ✅ NEU (PFLICHT) - Kurznotation "provider:model"
```python
from langchain.chat_models import init_chat_model

# ✨ Kurznotation: "provider:model" (STANDARD seit Dezember 2025)
llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)

# Weitere Beispiele:
llm = init_chat_model("anthropic:claude-3-sonnet", temperature=0.3)
llm = init_chat_model("groq:llama-3.1-70b", temperature=0.7)
llm = init_chat_model("google:gemini-pro", temperature=0.5)

# Mit zusätzlichen Parametern:
llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0, max_tokens=1000)
```

### 🎯 Vorteile
- ✅ Kompakte, lesbare Syntax
- ✅ Provider-übergreifende Kompatibilität
- ✅ Einfacher Modell-Wechsel
- ✅ Zukunftssichere API

### 🆕 NEU in v1.1.0: Model Profile System

Chat-Modelle exposieren jetzt ihre Capabilities über das `.profile` Attribut:

```python
from langchain.chat_models import init_chat_model

# Kurznotation verwenden
llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)

# ✨ NEU: Model Profiles (sourced from models.dev)
print(llm.profile.supports_structured_output)  # True (deprecated: use 'structured_output')
print(llm.profile.supports_function_calling)   # True (deprecated: use 'tool_calling')
print(llm.profile.supports_vision)             # True (deprecated: use 'image_inputs')
print(llm.profile.supports_json_mode)          # True (deprecated: use JSON Mode check)

# ✨ Moderne Attribute (v1.1.0+)
print(llm.profile['structured_output'])  # True
print(llm.profile['tool_calling'])       # True
print(llm.profile['image_inputs'])       # True
print(llm.profile['max_input_tokens'])   # 128000

# Dynamische Feature-Detection statt hartcodierter Provider-Logik!
if llm.profile['image_inputs']:
    # Bild-Verarbeitung möglich
    response = llm.invoke([HumanMessage(content=[
        {"type": "text", "text": "Was siehst du?"},
        {"type": "image", "url": "..."}
    ])])
```

**🆕 Utility-Funktion: `get_model_profile()`**

Für einfachere Nutzung gibt es in `genai_lib.utilities` eine Hilfsfunktion:

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
        print(f"  ⚠️  Model konnte nicht initialisiert werden (Provider-Bibliothek fehlt?)")
```

**Vorteile:**
- ✅ Automatische Capability-Detection
- ✅ Keine hardcoded Provider-Checks mehr
- ✅ Quelle: models.dev (Open-Source Model-Index)
- ✅ Basis für intelligente Middleware (z.B. SummarizationMiddleware)
- ✅ `get_model_profile()` für formatierte Ausgabe und Modellvergleiche

---

## 2️⃣ `with_structured_output()` - Native Structured Outputs

### ❌ ALT (nicht mehr verwenden)
```python
from langchain.output_parsers import PydanticOutputParser

parser = PydanticOutputParser(pydantic_object=Person)
prompt = PromptTemplate(
    template="...\n{format_instructions}",
    input_variables=["query"],
    partial_variables={"format_instructions": parser.get_format_instructions()}
)
```

### ✅ NEU (PFLICHT)
```python
from pydantic import BaseModel, Field

class Person(BaseModel):
    name: str = Field(description="Name der Person")
    age: int = Field(description="Alter in Jahren")

# Direkt strukturierte Ausgabe
structured_llm = llm.with_structured_output(Person)
result = structured_llm.invoke("Max ist 25 Jahre alt")
# result ist direkt ein Person-Objekt!
```

### 🎯 Vorteile
- ✅ Garantierte Schema-Konformität (nutzt OpenAI's Native API)
- ✅ Keine manuelle `format_instructions` mehr
- ✅ Robuster und weniger fehleranfällig
- ✅ Kein JSON-Parsing mehr nötig

### 🆕 NEU in v1.1.0: Auto-Inference von ProviderStrategy

`ProviderStrategy` wird jetzt automatisch aus Model Profiles abgeleitet:

```python
from pydantic import BaseModel, Field

class MovieRecommendation(BaseModel):
    title: str = Field(description="Filmtitel")
    genre: str = Field(description="Genre")
    rating: float = Field(description="Bewertung 1-10")

# ✨ NEU in v1.1.0: Automatische Provider-Detection
structured_llm = llm.with_structured_output(MovieRecommendation)
# Nutzt automatisch native API wenn verfügbar (z.B. OpenAI's Structured Output)
# Basiert auf llm.profile.supports_structured_output

# Optional: Explizite Strategie (wie vorher)
structured_llm = llm.with_structured_output(
    MovieRecommendation,
    provider_strategy="native"  # Wird automatisch aus Profile erkannt!
)
```

**Vorteile:**
- ✅ Intelligente Defaults basierend auf Model Capabilities
- ✅ Weniger manuelle Konfiguration
- ✅ Optimale Strategie pro Provider (OpenAI native vs. fallback)

---

## 3️⃣ `@tool` Decorator - Tool Definitions

### ❌ ALT (nicht mehr verwenden)
```python
from langchain.agents import Tool

multiply_tool = Tool(
    name="multiply",
    func=lambda a, b: a * b,
    description="Multipliziert zwei Zahlen"
)
```

### ✅ NEU (PFLICHT)
```python
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multipliziert zwei Zahlen."""
    return a * b
```

### 🎯 Vorteile
- ✅ Automatische Schema-Generierung aus Docstring
- ✅ Type-Safety durch Python Type Hints
- ✅ Weniger Boilerplate-Code
- ✅ Bessere IDE-Unterstützung

### 🆕 NEU in v1.2.0: Tool Extras für Provider-spezifische Features

Tools unterstützen jetzt `extras` für provider-native Konfigurationen:

```python
from langchain_core.tools import tool

# ✨ NEU: Provider-spezifische Tool-Parameter
@tool(extras={
    "anthropic": {
        "cache_control": {"type": "ephemeral"},  # Anthropic Prompt Caching
        "disable_parallel_tool_use": False
    },
    "openai": {
        "strict": True  # OpenAI Strict Mode (garantierte Schema-Konformität)
    }
})
def search_database(query: str, limit: int = 10) -> str:
    """Durchsucht die Datenbank nach relevanten Informationen.

    Args:
        query: Suchanfrage
        limit: Maximale Anzahl Ergebnisse
    """
    return f"Gefunden: {limit} Ergebnisse für '{query}'"

# Tool mit Anthropic programmatic tool calling
@tool(extras={
    "anthropic": {
        "type": "computer_20241022",  # Anthropic Computer Use
        "display_width_px": 1024,
        "display_height_px": 768
    }
})
def take_screenshot() -> str:
    """Erstellt einen Screenshot des Bildschirms."""
    return "screenshot.png"
```

**Vorteile:**
- ✅ **Provider-native Features** nutzen (Caching, Strict Mode, Computer Use)
- ✅ **Built-in Client-Side Tools** für Anthropic, OpenAI
- ✅ **Optimierte Performance** durch provider-spezifische Optimierungen
- ✅ **Backwards-compatible**: Tools ohne `extras` funktionieren weiterhin

**Use Cases:**
- Anthropic Prompt Caching für häufig verwendete Tools
- OpenAI Strict Mode für garantierte Schema-Konformität
- Anthropic Computer Use für Browser-Automation
- Provider-spezifische Tool-Konfigurationen

---

## 4️⃣ `create_agent()` - Modern Agent API

### ❌ ALT (nicht mehr verwenden)
```python
from langchain.agents import initialize_agent, AgentType

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)
```

### ✅ NEU (PFLICHT)
```python
from langchain.agents import create_agent

agent = create_agent(
    model=llm,  # oder "openai:gpt-4"
    tools=[tool1, tool2],
    system_prompt="You are a helpful assistant",
    debug=True  # Zeigt Denkprozess (= verbose=True)
)

# Agent aufrufen (gibt CompiledStateGraph zurück)
response = agent.invoke({
    "messages": [{"role": "user", "content": "your question"}]
})
```

### 🎯 Vorteile
- ✅ Basiert auf LangGraph (State Machine)
- ✅ Kein `AgentExecutor` mehr nötig
- ✅ Besseres Debugging mit `debug=True`
- ✅ Middleware-Support (siehe Feature #6)

### 🆕 NEU in v1.1.0: SystemMessage Support

`system_prompt` akzeptiert jetzt `SystemMessage` mit erweiterten Features:

```python
from langchain.agents import create_agent
from langchain_core.messages import SystemMessage

# ❌ ALT: Nur String
agent = create_agent(
    model=llm,
    tools=tools,
    system_prompt="You are a helpful assistant"
)

# ✅ NEU in v1.1.0: SystemMessage mit Cache-Control
agent = create_agent(
    model=llm,
    tools=tools,
    system_prompt=SystemMessage(
        content="You are a helpful research assistant with access to web search and databases.",
        cache_control={"type": "ephemeral"}  # Anthropic Cache-Control
    )
)

# ✅ NEU: SystemMessage mit strukturierten Content Blocks
agent = create_agent(
    model=llm,
    tools=tools,
    system_prompt=SystemMessage(
        content=[
            {"type": "text", "text": "You are a helpful assistant."},
            {"type": "text", "text": "Important guidelines:", "cache_control": {"type": "ephemeral"}}
        ]
    )
)
```

**Vorteile:**
- ✅ **Cache-Control** für Anthropic Claude (schneller + günstiger)
- ✅ **Strukturierte Content Blocks** im System-Prompt
- ✅ **Richer System-Level Instructions** mit Metadata
- ✅ **Backwards-compatible**: String-Prompts funktionieren weiterhin

### 🆕 NEU in v1.2.0: Strict Schema für Agent-Responses

Agents unterstützen jetzt `response_format` für strikte Validierung von Agent-Outputs:

```python
from langchain.agents import create_agent
from pydantic import BaseModel, Field

# Definiere strukturiertes Response-Schema
class AgentResponse(BaseModel):
    """Strukturierte Agent-Antwort mit Reasoning."""
    reasoning: str = Field(description="Denkprozess des Agents")
    action: str = Field(description="Geplante Aktion")
    tool_to_use: str | None = Field(description="Zu verwendendes Tool (optional)")
    confidence: float = Field(description="Konfidenz 0-1", ge=0, le=1)

# ✨ NEU in v1.2.0: response_format für garantierte Schema-Konformität
agent = create_agent(
    model=llm,
    tools=[search_tool, calculator_tool],
    system_prompt="You are a helpful research assistant",
    response_format=AgentResponse,  # Strikte Validierung!
    provider_strategy="strict"  # Nutzt OpenAI Structured Output (wenn verfügbar)
)

# Agent-Response ist garantiert schema-konform
response = agent.invoke({
    "messages": [{"role": "user", "content": "Recherchiere die Bevölkerung von Berlin"}]
})

# Typsicherer Zugriff auf strukturierte Felder
print(response.reasoning)  # str
print(response.confidence)  # float (0-1)
```

**Vorteile:**
- ✅ **Garantierte Schema-Konformität** für Agent-Outputs (keine JSON-Parsing-Fehler)
- ✅ **Type-Safety** mit Pydantic-Validierung
- ✅ **Bessere Fehlerbehandlung** durch strukturierte Responses
- ✅ **Strikte Provider-Integration** (OpenAI Structured Output, Anthropic Tool Use)
- ✅ **Predictable Agent-Behavior** für Production-Systeme

**Use Cases:**
- Production-Agents mit garantierten Output-Formaten
- Multi-Step-Reasoning mit strukturierten Zwischenschritten
- Agent-Monitoring mit standardisierten Response-Metriken
- Integration in typsichere Workflows

**Kombination mit Structured Output:**
```python
# response_format arbeitet nahtlos mit with_structured_output()
structured_llm = llm.with_structured_output(AgentResponse)

agent = create_agent(
    model=structured_llm,
    tools=tools,
    response_format=AgentResponse,  # Doppelte Validierung (LLM + Agent-Level)
    provider_strategy="strict"
)
```

---

## 5️⃣ LCEL `|` Chains - Expression Language

### ❌ ALT (vermeiden)
```python
from langchain.chains import LLMChain

chain = LLMChain(llm=llm, prompt=prompt)
result = chain.run(input="text")
```

### ✅ NEU (PFLICHT)
```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Pipe-Operator für Chain-Komposition
chain = prompt | llm | StrOutputParser()

# Aufruf
result = chain.invoke({"input": "text"})

# Asynchrone Unterstützung
result = await chain.ainvoke({"input": "text"})
```

### 🎯 Vorteile
- ✅ Moderne, lesbare Syntax
- ✅ Automatisches Streaming-Support
- ✅ Parallele Ausführung wo möglich
- ✅ Native async/await-Unterstützung

---

## 6️⃣ Middleware für Agents - Production-Ready Features

### ❌ ALT (deprecated)
```python
# Hooks sind in 1.0+ deprecated
agent_executor.register_hook("before_agent", my_hook)
```

### ✅ NEU (PFLICHT)
```python
from langchain.agents import create_agent
from langchain.agents.middleware import (
    HumanInTheLoopMiddleware,
    SummarizationMiddleware,
    PIIMiddleware
)

middleware = [
    HumanInTheLoopMiddleware(
        tool_names=["delete_file", "execute_command"]  # Genehmigung erforderlich
    ),
    SummarizationMiddleware(
        max_tokens=1000  # Automatische Kontext-Zusammenfassung
    ),
    PIIMiddleware(
        patterns=["email", "phone"]  # PII-Redaktion
    )
]

agent = create_agent(
    model=llm,
    tools=tools,
    system_prompt="You are a helpful assistant",
    middleware=middleware  # Middleware hinzufügen
)
```

### 🎯 Vorteile
- ✅ **Human-in-the-Loop** für sensible Operationen (Essential für Production!)
- ✅ **Automatische Kontextverwaltung** bei langen Sessions (verhindert Token-Overflow)
- ✅ **PII-Redaktion** für Datenschutz (DSGVO-konform)
- ✅ **Custom Middleware** für spezifische Anforderungen

### 📦 Built-in Middleware

| Middleware | Zweck | Wann verwenden? |
|-----------|-------|-----------------|
| `HumanInTheLoopMiddleware` | Manuelle Genehmigung vor Tool-Ausführung | Dateioperationen, API-Calls, kritische Aktionen |
| `SummarizationMiddleware` | Automatische Zusammenfassung langer Konversationen | Chat-Apps, lange Sessions |
| `PIIMiddleware` | Datenschutz durch Mustererkennung | DSGVO-Compliance, sensible Daten |
| `ModelRetryMiddleware` 🆕 | Automatische Retries mit exponential backoff | Flaky APIs, Rate Limits |
| `ContentModerationMiddleware` 🆕 | OpenAI Moderation für User/Model/Tool-Outputs | Safety-Layer, Content-Filter |

### 🆕 NEU in v1.1.0: Erweiterte Middleware

#### ModelRetryMiddleware (NEU!)

Automatische Retries bei API-Fehlern mit konfigurierbarem exponential backoff:

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ModelRetryMiddleware

agent = create_agent(
    model=llm,
    tools=tools,
    middleware=[
        ModelRetryMiddleware(
            max_retries=3,
            backoff_factor=2.0,  # Exponential Backoff (2s, 4s, 8s)
            retry_on=["rate_limit_error", "timeout", "server_error"],
            jitter=True  # Randomized delay
        )
    ]
)
```

**Use Cases:**
- ✅ Rate-Limiting von API-Providern
- ✅ Transiente Netzwerkfehler
- ✅ Server-Timeouts
- ✅ Production-Resilience

#### ContentModerationMiddleware (NEU!)

OpenAI Moderation API für konsistente Safety-Layer:

```python
from langchain.agents.middleware import ContentModerationMiddleware

agent = create_agent(
    model=llm,
    tools=tools,
    middleware=[
        ContentModerationMiddleware(
            provider="openai",  # Nutzt OpenAI Moderation API
            check_user_input=True,      # Filter User-Inputs
            check_model_output=True,    # Filter Model-Responses
            check_tool_output=True,     # Filter Tool-Results
            block_on_violation=True,    # Workflow stoppen bei Violation
            categories=["hate", "violence", "sexual"]  # Spezifische Kategorien
        )
    ]
)
```

**Use Cases:**
- ✅ User-Generated Content-Filter
- ✅ DSGVO-Compliance & Safety
- ✅ Brand-Safety für Production-Apps
- ✅ Multi-Layer-Content-Moderation

#### Verbesserter SummarizationMiddleware

Nutzt jetzt Model Profiles für intelligente Zusammenfassungen:

```python
from langchain.agents.middleware import SummarizationMiddleware

# ✅ v1.1.0: Context-aware Summarization
middleware = SummarizationMiddleware(
    max_tokens=1000,
    # NEU: Automatische Detection von Summarization-Capabilities via llm.profile
    # Provider-spezifische Optimierungen (GPT-4 vs Claude vs Gemini)
    trigger_strategy="flexible"  # Intelligente Trigger-Points basierend auf Model
)
```

**Verbesserungen:**
- ✅ Nutzt `llm.profile` für optimale Summarization-Strategie
- ✅ Provider-spezifische Optimierungen
- ✅ Flexible Trigger-Points (nicht nur hard limit)
- ✅ Bessere Performance auf langen Sessions

#### 🆕 ContextOverflowError (v1.2.1+, Januar 2026)

Neuer Fehlertyp für automatisches Context-Window-Management:

```python
from langchain_core.exceptions import ContextOverflowError
from langchain.agents.middleware import SummarizationMiddleware

# SummarizationMiddleware fängt ContextOverflowError automatisch ab
# und fasst die bisherige Konversation zusammen, bevor der Aufruf wiederholt wird
middleware = SummarizationMiddleware(
    max_tokens=1000,
    # NEU: Automatischer Trigger bei ContextOverflowError
    # Kein manuelles Token-Zählen mehr nötig!
)
```

**Vorteile:**
- ✅ Wird von `langchain-openai` und `langchain-anthropic` nativ ausgelöst
- ✅ `SummarizationMiddleware` reagiert automatisch darauf
- ✅ Kein manuelles Context-Window-Management mehr nötig
- ✅ `count_tokens_approximately()` zählt jetzt auch Tool-Schema-Tokens

#### 🆕 Automatic Server-Side Compaction (langchain-openai 1.1.10, Feb 2026)

**Alternative zu SummarizationMiddleware:** OpenAI komprimiert die Konversationshistorie **serverseitig** – kein extra Middleware-Layer nötig.

```python
from langchain.chat_models import init_chat_model

# OpenAI komprimiert automatisch bei langen Konversationen
llm = init_chat_model(
    "openai:gpt-4o",
    context_management=[{"type": "compaction", "compact_threshold": 10_000}]
    # compact_threshold: Token-Schwellenwert, ab dem komprimiert wird
)
```

**Vergleich: Server-Side vs. Client-Side Context-Management:**

| Ansatz | Wie | Provider | Kosten |
|--------|-----|----------|--------|
| `SummarizationMiddleware` | Client: LLM fasst zusammen | Alle | Zusätzliche LLM-Kosten |
| `context_management` (neu) | Server: OpenAI komprimiert | Nur OpenAI | In API-Kosten enthalten |

**Wann welchen Ansatz wählen:**
- ✅ `context_management` → OpenAI-Apps, einfachste Lösung
- ✅ `SummarizationMiddleware` → Provider-unabhängig, mehr Kontrolle

---

## 7️⃣ Standard Message Content Blocks - Multimodal Support

### ❌ ALT (provider-spezifisch)
```python
# OpenAI-spezifisch
message.additional_kwargs["image_url"]

# Anthropic-spezifisch
message.additional_kwargs["content"]
```

### ✅ NEU (PFLICHT)
```python
from langchain_core.messages import AIMessage, HumanMessage

# Standardisierte content_blocks
message = AIMessage(
    content=[
        {"type": "text", "text": "Here's the image analysis:"},
        {"type": "image", "url": "data:image/png;base64,...", "mime_type": "image/png"}
    ]
)

# Provider-agnostischer Zugriff
for block in message.content_blocks:
    if block["type"] == "text":
        print(block["text"])
    elif block["type"] == "image":
        display_image(block["url"])
    elif block["type"] == "audio":
        play_audio(block["url"])
```

### 🎯 Vorteile
- ✅ **Einheitliches Interface** über alle Provider (OpenAI, Anthropic, Google, Cohere)
- ✅ **Multimodal-Support**: Text, Bilder, Audio, Video
- ✅ **Reasoning Traces & Citations** für transparente KI-Entscheidungen
- ✅ **Einfacher Provider-Wechsel** ohne Code-Änderungen

### 📦 Unterstützte Content-Typen

```python
# Text
{"type": "text", "text": "..."}

# Bild
{"type": "image", "url": "...", "mime_type": "image/png"}

# Audio
{"type": "audio", "url": "...", "mime_type": "audio/mp3"}

# Video
{"type": "video", "url": "...", "mime_type": "video/mp4"}

# Reasoning Trace (für erklärbare KI)
{"type": "reasoning", "text": "...", "confidence": 0.95}

# Citation (Quellenangaben)
{"type": "citation", "text": "...", "source": "..."}
```

### 🎨 Anwendungsfälle
- ✅ Multimodale RAG-Systeme (perfekt für `04_modul/genai_lib/multimodal_rag.py`)
- ✅ Bild-zu-Text und Text-zu-Bild Pipelines
- ✅ Audio/Video-Analyse mit LLMs
- ✅ Provider-unabhängige Chatbots

### 🧠 Thinking-Formate parsen mit `extract_thinking()`

Verschiedene LLMs liefern "Thinking" (Denkprozess) in unterschiedlichen Formaten. Die Utility-Funktion `extract_thinking()` aus `genai_lib.utilities` bietet einen universellen Parser:

```python
from genai_lib.utilities import extract_thinking

# Response von beliebigem LLM
response = llm.invoke("Erkläre Schritt für Schritt...")

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

**Vorteile:**
- ✅ **Provider-agnostisch**: Ein Parser für alle LLMs
- ✅ **Fallback-Logik**: Prüft alle bekannten Formate
- ✅ **Robust**: Gibt leeren Thinking-String zurück, wenn kein Denkprozess vorhanden

---

## 8️⃣ `.with_retry()` und `.with_fallbacks()` - Robuste Chains

Beide Methoden gehören zum **Runnable-Interface** (LCEL) und lassen sich auf jede Chain, jedes LLM oder jeden OutputParser anwenden.

---

### `.with_retry()` – Fehlertolerante Ausführung

Wiederholt einen Runnable automatisch bei definierten Fehlern (z. B. Rate Limits, Timeouts).

#### ❌ ALT (manuell)
```python
import time

for attempt in range(3):
    try:
        result = llm.invoke("...")
        break
    except RateLimitError:
        time.sleep(2 ** attempt)
```

#### ✅ NEU (EMPFOHLEN)
```python
# Einfachste Form: 3 Versuche bei allen Fehlern
robust_llm = llm.with_retry(stop_after_attempt=3)

# Gezielt: nur bei Rate-Limit- und Timeout-Fehlern
from langchain_openai.exceptions import RateLimitError
import httpx

robust_llm = llm.with_retry(
    retry_if_exception_type=(RateLimitError, httpx.TimeoutException),
    stop_after_attempt=3,
    wait_exponential_jitter=True   # Exponential Backoff + Jitter
)

result = robust_llm.invoke("Wie ist das Wetter?")
```

#### Auf LCEL-Chains anwenden
```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

chain = (
    ChatPromptTemplate.from_template("Beantworte: {frage}")
    | llm
    | StrOutputParser()
).with_retry(stop_after_attempt=3)

result = chain.invoke({"frage": "Was ist LangChain?"})
```

#### 🎯 Vorteile
- ✅ Kein Boilerplate-Code für Retry-Logik
- ✅ Konfigurierbare Fehlertypen (nur relevante Exceptions)
- ✅ Exponential Backoff mit Jitter verhindert API-Überlastung
- ✅ Gilt für LLMs, Chains, Tools – jeden Runnable

#### Wann verwenden?
- ✅ Rate-Limit-Fehler (OpenAI, Anthropic)
- ✅ Transiente Netzwerkfehler / Timeouts
- ✅ Flaky externe APIs in Tools
- ❌ **Nicht** bei Validierungs- oder Logikfehlern (die sind nicht transient)

---

### `.with_fallbacks()` – Ausfallsichere Chains

Schaltet automatisch auf ein Fallback-LLM oder eine alternative Chain um, wenn der primäre Runnable fehlschlägt.

#### ✅ Verwendung
```python
from langchain.chat_models import init_chat_model

primary_llm   = init_chat_model("openai:gpt-4o",      temperature=0.0)
fallback_llm  = init_chat_model("openai:gpt-4o-mini",  temperature=0.0)

# Bei Fehler des primären LLMs → automatisch gpt-4o-mini
safe_llm = primary_llm.with_fallbacks([fallback_llm])

result = safe_llm.invoke("Erkläre Transformer-Modelle.")
```

#### Mehrere Fallbacks (Kaskade)
```python
llm_gpt4        = init_chat_model("openai:gpt-4o",       temperature=0.0)
llm_gpt4_mini   = init_chat_model("openai:gpt-4o-mini",  temperature=0.0)
llm_anthropic   = init_chat_model("anthropic:claude-3-haiku", temperature=0.0)

# Kaskade: gpt-4o → gpt-4o-mini → claude-3-haiku
resilient_llm = llm_gpt4.with_fallbacks([llm_gpt4_mini, llm_anthropic])
```

#### Kombination mit `.with_retry()`
```python
# Empfohlenes Pattern für Production:
# 1. Erst 3× Retry auf dem primären LLM
# 2. Dann Fallback auf alternatives Modell
safe_chain = (
    llm_gpt4.with_retry(stop_after_attempt=3)
).with_fallbacks([llm_gpt4_mini])
```

#### Auf structured output anwenden
```python
structured_primary  = llm_gpt4.with_structured_output(Person)
structured_fallback = llm_gpt4_mini.with_structured_output(Person)

safe_structured = structured_primary.with_fallbacks([structured_fallback])
result = safe_structured.invoke("Anna Müller ist 32 Jahre alt.")
```

#### 🎯 Vorteile
- ✅ Zero-Downtime bei Provider-Ausfällen
- ✅ Kostenkontrolle (teures Modell → günstiges Fallback)
- ✅ Provider-Diversität als Resilienz-Strategie
- ✅ Kombinierbar mit `.with_retry()` und `with_structured_output()`

#### Wann verwenden?
- ✅ Production-Systeme mit hoher Verfügbarkeitsanforderung
- ✅ Kostenoptimierung (Primär: leistungsstark, Fallback: günstig)
- ✅ Multi-Provider-Setups
- ❌ **Nicht** als Ersatz für Retry (Fallback = anderes Modell, nicht Wiederholung)

---

## 🚀 Quick Start: Komplettes Beispiel

```python
# 1. Model Initialization
from langchain.chat_models import init_chat_model

llm = init_chat_model(
    "gpt-4o-mini",
    model_provider="openai",
    temperature=0.0
)

# 2. Structured Output
from pydantic import BaseModel, Field

class MovieRecommendation(BaseModel):
    title: str = Field(description="Filmtitel")
    genre: str = Field(description="Genre")
    rating: float = Field(description="Bewertung 1-10")

structured_llm = llm.with_structured_output(MovieRecommendation)

# 3. Tools mit @tool Decorator
from langchain_core.tools import tool

@tool
def search_movies(query: str) -> str:
    """Sucht nach Filmen in der Datenbank."""
    return f"Ergebnisse für: {query}"

# 4. Agent mit Middleware
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware

agent = create_agent(
    model=llm,
    tools=[search_movies],
    system_prompt="Du bist ein hilfreicher Film-Assistent",
    middleware=[
        HumanInTheLoopMiddleware(tool_names=["search_movies"])
    ],
    debug=True
)

# 5. LCEL Chain
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("Empfehle einen {genre}-Film")
chain = prompt | llm | StrOutputParser()
result = chain.invoke({"genre": "Sci-Fi"})

# 6. Multimodal Content Blocks
from langchain_core.messages import HumanMessage

message = HumanMessage(
    content=[
        {"type": "text", "text": "Was siehst du auf diesem Bild?"},
        {"type": "image", "url": "data:image/png;base64,...", "mime_type": "image/png"}
    ]
)
response = llm.invoke([message])
```

---

## 📚 Import-Cheatsheet

```python
# Models
from langchain.chat_models import init_chat_model

# Structured Output
from pydantic import BaseModel, Field

# Tools
from langchain_core.tools import tool

# Agents & Middleware
from langchain.agents import create_agent
from langchain.agents.middleware import (
    HumanInTheLoopMiddleware,
    SummarizationMiddleware,
    PIIMiddleware,
    ModelRetryMiddleware,  # 🆕 v1.1.0
    ContentModerationMiddleware  # 🆕 v1.1.0
)

# Chains (LCEL)
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Messages & Content Blocks
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

# Prompts
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate

# Robustheit (with_retry / with_fallbacks sind Methoden auf Runnables,
# kein separater Import nötig – direkt auf llm/chain anwenden)

# Vectorstores & RAG
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
```

---

## ⚠️ Breaking Changes von 0.x zu 1.0+

| Alt (0.x) | Neu (1.0+) | Status |
|-----------|------------|--------|
| `ChatOpenAI()` direkt | `init_chat_model()` | ⛔ Deprecated |
| `PydanticOutputParser` | `with_structured_output()` | ⛔ Deprecated |
| `Tool()` wrapper | `@tool` decorator | ⛔ Deprecated |
| `initialize_agent()` + `AgentExecutor` | `create_agent()` | ⛔ Deprecated |
| Hook-Pattern | Middleware | ⛔ Deprecated |
| Provider-spezifische Content-Formate | Standard Content Blocks | ⛔ Deprecated |

---

## 🎯 Migration-Checkliste

Beim Refactoring von altem Code:

- [ ] `ChatOpenAI()` → `init_chat_model()` ersetzen
- [ ] `PydanticOutputParser` → `with_structured_output()` ersetzen
- [ ] `Tool()` wrapper → `@tool` decorator ersetzen
- [ ] `initialize_agent()` → `create_agent()` ersetzen
- [ ] Legacy Chain-Syntax → LCEL `|` ersetzen
- [ ] Hooks → Middleware ersetzen
- [ ] Provider-spezifische Content → `content_blocks` ersetzen
- [ ] Python 3.10+ erforderlich (3.9 wird nicht mehr unterstützt)
- [ ] Custom State muss `TypedDict` verwenden (keine Pydantic Models)

---

## 📖 Weitere Ressourcen

- **LangChain Docs**: https://python.langchain.com/
- **Migration Guide**: https://docs.langchain.com/oss/python/migrate/langchain-v1
- **LangChain Blog**: https://blog.langchain.com/langchain-langgraph-1dot0/
- **Projekt CLAUDE.md**: Vollständige Projektinstruktionen im Repository

---

**Version:** 1.6
**Letzte Aktualisierung:** März 2026 (LangChain v1.2.10 / langchain-openai v1.1.10)
**Autor:** GenAI Projekt Team

---

## 📝 Changelog

### Version 1.6 (März 2026)
- 🆕 Automatic Server-Side Compaction dokumentiert (langchain-openai 1.1.10) — Must-Have #6 Ergänzung
- ✅ "What's New" Sektion um langchain-openai v1.1.10 erweitert
- ✅ Vergleichstabelle: Server-Side vs. Client-Side Context-Management

### Version 1.5 (März 2026)
- 🆕 Abschnitt 8️⃣ hinzugefügt: `.with_retry()` und `.with_fallbacks()` für robuste Production-Chains
- ✅ Übersichtstabelle um Must-Have #8 ergänzt
- ✅ Import-Cheatsheet mit Hinweis auf Runnable-Methoden aktualisiert

### Version 1.4 (Februar 2026)
- 🆕 ContextOverflowError dokumentiert (Must-Have #6 - SummarizationMiddleware)
- 🆕 Token-Zählung für Tool-Schemas (count_tokens_approximately)
- ✅ "What's New in v1.2.1-v1.2.10" Sektion hinzugefügt

### Version 1.3 (Dezember 2025)
- 🆕 LangChain v1.2.0 Features integriert (15. Dezember 2025)
- 🆕 Tool Extras dokumentiert (Must-Have #3) - Provider-native Features
- 🆕 Strict Schema für Agent `response_format` (Must-Have #4)
- 🆕 Built-in Client-Side Tools (Anthropic Computer Use, OpenAI Strict Mode)
- ✅ "What's New in v1.2.0" Sektion aktualisiert
- ✅ Code-Beispiele erweitert (Tool Extras, response_format)

### Version 1.2 (Dezember 2025)
- 🆕 `extract_thinking()` Utility dokumentiert (Must-Have #7)
- ✅ Universeller Parser für Thinking-Formate (Claude, Gemini, Qwen3, DeepSeek)
- ✅ Integration mit genai_lib.utilities

### Version 1.1 (Dezember 2025)
- ✅ LangChain v1.1.0 Features integriert
- 🆕 Model Profile System dokumentiert (Must-Have #1)
- 🆕 Auto-Inference für Structured Output (Must-Have #2)
- 🆕 SystemMessage Support in create_agent (Must-Have #4)
- 🆕 ModelRetryMiddleware & ContentModerationMiddleware (Must-Have #6)
- 🆕 Verbesserter SummarizationMiddleware
- ✅ Import-Cheatsheet erweitert
- ✅ "What's New in v1.1.0" Sektion hinzugefügt

### Version 1.0 (November 2025)
- Initiale Version mit 7 MUST-HAVE Features
- LangChain 1.0+ Best Practices
- Breaking Changes dokumentiert
- Migration-Checkliste

---

> 💡 **Tipp:** Bookmark diese Datei und konsultiere sie bei jedem neuen Notebook oder Code-Modul!
