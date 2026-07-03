---
layout: default
title: Einsteiger LangChain
parent: LangChain
grand_parent: Frameworks
nav_order: 1
description: Grundlagen und Best Practices für LangChain 1.0+
has_toc: true
---

# LangChain
{: .no_toc }

> **Grundlagen und Best Practices für LangChain 1.0+**

---

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Kurzüberblick: Warum LangChain?

Große Sprachmodelle (LLMs) wie GPT-5 sind beeindruckend – doch für den Einsatz in der Praxis stoßen sie schnell an Grenzen:

- **Wie verbindet man ein LLM mit eigenen Datenquellen?** (Dokumente, Datenbanken, APIs)
- **Wie wechselt man zwischen verschiedenen Anbietern?** (OpenAI, Anthropic, Google – ohne Code-Änderungen)
- **Wie bekommt man strukturierte Ausgaben?** (JSON, Objekte statt Freitext)
- **Wie erweitert man die Fähigkeiten eines LLMs?** (Rechnen, Websuche, Dateizugriff)
- **Wie baut man mehrstufige Workflows?** (Erst recherchieren, dann zusammenfassen, dann bewerten)

LangChain löst diese Herausforderungen durch:

- **Einheitliche Modell-Schnittstelle** – ein Interface für alle LLM-Anbieter
- **Tool-Integration** – LLMs können externe Funktionen aufrufen (Taschenrechner, APIs, Datenbanken)
- **Strukturierte Ausgaben** – garantiert valide Datenstrukturen statt unvorhersehbarem Text
- **Verkettung von Schritten** – komplexe Workflows als lesbare Pipelines
- **RAG-Unterstützung** – nahtlose Integration von Vektordatenbanken für Wissenserweiterung

**Kernprinzip:** LangChain abstrahiert die Komplexität der LLM-Integration und bietet wiederverwendbare Bausteine – vom einfachen Prompt bis zum autonomen Agenten mit Werkzeugen.

### LangChain Architektur-Überblick

```mermaid
graph TB
    subgraph "LangChain Core Components"
        MODELS[Models<br/>init_chat_model]
        PROMPTS[Prompts<br/>ChatPromptTemplate]
        TOOLS[Tools<br/>@tool decorator]
        CHAINS[Chains<br/>LCEL with pipe]
        AGENTS[Agents<br/>create_agent]
    end

    subgraph "External Systems"
        LLM_PROVIDERS[LLM Providers<br/>OpenAI, Anthropic, Google]
        VECTOR_DB[Vector Databases<br/>Chroma, FAISS]
        APIS[External APIs<br/>Web, Databases]
    end

    MODELS -->|unified interface| LLM_PROVIDERS
    PROMPTS --> CHAINS
    MODELS --> CHAINS
    TOOLS --> AGENTS
    MODELS --> AGENTS
    CHAINS -->|RAG| VECTOR_DB
    TOOLS -->|integrate| APIS

    style MODELS fill:#e1f5ff
    style PROMPTS fill:#e1f5ff
    style TOOLS fill:#e1f5ff
    style CHAINS fill:#e1f5ff
    style AGENTS fill:#e1f5ff
```

---

## Zentrale Konzepte

| Konzept | Rolle im LangChain-Workflow |
|---|---|
| Prompt | Formuliert Aufgabe, Rolle und Kontext für das Modell |
| Modell | Liefert Antworten über eine einheitliche Provider-Schnittstelle |
| Strukturierte Ausgabe | Erzwingt verlässliche Objekte statt Freitext |
| Tool | Erweitert das Modell um externe Funktionen |
| Chain | Verkettet mehrere Schritte mit LCEL |
| Agent | Entscheidet dynamisch, welche Tools und Schritte nötig sind |
| RAG | Verbindet Modellantworten mit eigenen Wissensquellen |

---

## Quickstart

```python
from langchain.chat_models import init_chat_model
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

llm = init_chat_model("openai:gpt-5.4-nano")
prompt = ChatPromptTemplate.from_template("Erkläre {thema} in drei Sätzen.")
chain = prompt | llm | StrOutputParser()

antwort = chain.invoke({"thema": "LangChain"})
print(antwort)
```

Der Quickstart zeigt das Standardmuster: Prompt vorbereiten, Modell initialisieren, Schritte mit LCEL verbinden und ausführen.

---

## Grundaufbau

## Prompts mit `ChatPromptTemplate`

Für wiederverwendbare und klar strukturierte Prompts steht in LangChain 1.0 das `ChatPromptTemplate` im Mittelpunkt. Es beschreibt, welche Nachrichtenrollen im Dialog verwendet werden und welche Platzhalter dynamisch zur Laufzeit gefüllt werden.

**Zentrale Aspekte:**

- Trennung von System-, Nutzer- und Assistenz‑Nachrichten
- Verwendung von Platzhaltern (z. B. `{frage}`, `{kontext}`) für dynamische Inhalte
- Wiederverwendbarkeit desselben Templates in unterschiedlichen Chains und Agenten
- Klare Trennung von Prompt‑Design und Geschäftslogik

### Beispiel 1: Einfacher Frage-Antwort-Prompt

```python
from langchain_core.prompts import ChatPromptTemplate

# Template mit System- und Nutzerrolle
prompt = ChatPromptTemplate([
    ("system", "Du bist ein hilfreicher KI-Assistent für Einsteiger in LangChain."),
    ("human", "Beantworte die folgende Frage in 3-5 Sätzen: {frage}")
])

# ❌ Anti-Pattern (veraltet): ChatPromptTemplate.from_messages([...])

# Später in einer Chain oder direkt:
rendered_messages = prompt.format_messages(frage="Was ist ein LLM?")
rendered_messages
```

### Beispiel 2: Prompt für RAG (mit Kontext)

```python
rag_prompt = ChatPromptTemplate([
    ("system", "Nutze ausschließlich den bereitgestellten Kontext, um die Frage zu beantworten."),
    ("human", "Kontext:\n{kontext}\n\nFrage: {frage}")
])

msgs = rag_prompt.format_messages(
    frage="Wie funktioniert das System?",
    kontext="Dies ist ein Auszug aus dem Handbuch ..."
)
```

---

## Einheitliche Modell-Initialisierung: `init_chat_model()`

Eine stabile und provider-unabhängige Initialisierung des zugrunde liegenden Sprachmodells bildet die Basis jeder Agentenarchitektur. `init_chat_model()` stellt sicher, dass verschiedene Modellanbieter konsistent angesprochen werden können, ohne die restliche Codebasis anpassen zu müssen.

**Beispiel: Standard-Setup für den Kurs**

```python
from langchain.chat_models import init_chat_model

# Kurznotation "provider:model"
llm = init_chat_model("openai:gpt-5.4-nano")

# Weitere Beispiele:
# llm = init_chat_model("anthropic:claude-sonnet-4-5", temperature=0.3)
# llm = init_chat_model("groq:llama-3.3-70b-versatile", temperature=0.7)
# llm = init_chat_model("google_genai:gemini-2.5-flash", temperature=0.5)

# Testaufruf
response = llm.invoke("Nenne drei typische Einsatzgebiete von KI-Agenten.")
print(response.content)
```

---

## Strukturierte Ausgaben: `with_structured_output()`

Viele Anwendungen benötigen klar definierte Datenstrukturen – etwa bei der Extraktion von Feldern, Bewertungen oder Metadaten. Mit `with_structured_output()` lassen sich Modellantworten direkt an Pydantic-Modelle koppeln und zuverlässig validieren.

**Beispiel: Einfache Entity-Extraktion in ein Pydantic-Modell**

```python
from pydantic import BaseModel, Field

class SupportTicket(BaseModel):
    kundennummer: str = Field(description="Eindeutige Kundennummer")
    kategorie: str = Field(description="z.B. 'Rechnung', 'Technik', 'Vertrag'")
    dringlichkeit: int = Field(description="Dringlichkeit von 1 (niedrig) bis 5 (hoch)")

structured_llm = llm.with_structured_output(SupportTicket)

text = "Kundennummer 4711 meldet ein dringendes technisches Problem. Bitte sofort lösen!"
result = structured_llm.invoke(
    "Extrahiere Kundennummer, Kategorie und Dringlichkeit aus folgendem Text: " + text
)

# result ist direkt ein SupportTicket-Objekt
print(result)
print(result.kategorie, result.dringlichkeit)
```

Hinweis: Dieses Feature setzt voraus, dass der verwendete Modell‑Provider native strukturierte Ausgaben unterstützt (z. B. OpenAI). Bei reinen Text‑Modellen ohne API‑Unterstützung steht diese Funktion nicht vollständig zur Verfügung.

---

## Werkzeuge definieren: `@tool`

Tools erweitern die Fähigkeiten eines Agenten erheblich, da sie Funktionen abdecken, die ein Modell selbst nicht ausführen kann – etwa Berechnungen, Datenabrufe, lokale Analysen oder Abfragen externer Systeme. Der `@tool`‑Decorator ermöglicht eine klare, typensichere und gut dokumentierte Definition solcher Werkzeuge.

### Tool-Namen und Beschreibungen präzise wählen

Der Funktionsname wird standardmäßig zum Tool-Namen. Er sollte deshalb nicht nur technisch korrekt sein, sondern dem Modell zeigen, **wann** das Tool eingesetzt werden soll.

Gute Tool-Docstrings beschreiben Einsatzgrenzen: „nur bei Bestellnummer“, „nicht für Produktsuche“, „nur für interne Kundendaten“. Solche Formulierungen reduzieren Fehlaufrufe stärker als generische Beschreibungen wie „ruft Daten ab“.

### Beispiel: Ein einfaches Rechentool

```python
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multipliziert zwei ganze Zahlen a und b."""
    return a * b

# Direkter Test des Tools (ohne Agent)
print(multiply.invoke({"a": 6, "b": 7}))
```

### Beispiel: Tool mit Fehlerbehandlung und Docstring

```python
@tool
def safe_divide(a: float, b: float) -> str:
    """Teilt a durch b und gibt eine verständliche Textantwort zurück."""
    if b == 0:
        return "Division durch 0 ist nicht erlaubt."
    return f"Ergebnis: {a / b:.2f}"

print(safe_divide.invoke({"a": 10, "b": 2}))
print(safe_divide.invoke({"a": 10, "b": 0}))
```



### Tool Extras für Provider-spezifische Features (NEU v1.2.0)

Der extras-Parameter beim @tool-Dekorator erlaubt es, provider‑spezifische Features und Flags (z. B. Anthropic‑Caching, OpenAI‑strict‑Mode oder spezielle „computer“/Display‑Flags) an ein LangChain‑Tool zu hängen, die die Standard‑Tool‑API nicht abbildet. Diese Extras werden nur wirksam, wenn der jeweilige Provider‑Adapter/Integration die entsprechenden Keys interpretiert; andernfalls haben sie keine Wirkung.

```python
from langchain_core.tools import tool

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

> [!WARNING] Cache-Typ beachten<br>
> `cache_control: {"type": "ephemeral"}` erzeugt einen kurzlebigen Cache innerhalb derselben Sitzung. Damit der Cache wiederverwendet werden kann, sollte die `extras`-Konfiguration eines Tools konsistent bleiben. Wird dasselbe Tool später mit einer anderen `extras`-Konfiguration registriert oder verwendet, entsteht ein Cache-Miss — die Anfrage wird erneut vollständig verarbeitet und verursacht erneut volle Kosten.

---

## Agenten erstellen: `create_agent()`

Mit `create_agent()` werden Modell, Tools, Systemprompt und optional Middleware zu einer Einheit verbunden. Agenten basieren auf einer klaren Struktur, die intern auf der LangGraph-State-Machine aufsetzt.

**Beispiel: Kleinstmöglicher Tool-Agent**

```python
from langchain.agents import create_agent

## 1. LLM (aus Abschnitt 1.2)
# llm = init_chat_model(...)

## 2. Tools (aus Abschnitt 1.4)
tools = [multiply, safe_divide]

## 3. Agent erzeugen
agent = create_agent(
    model=llm,
    tools=tools,
    system_prompt=(
        "Du bist ein Taschenrechner-Agent. "
        "Beantworte nur Rechenfragen und verwende immer die bereitgestellten Tools."
    ),
    debug=False,  # in Colab besser meist False lassen
)

## 4. Aufruf
messages = [
    {"role": "human", "content": "Multipliziere 12 mit 8."},
]

result = agent.invoke({"messages": messages})
result
```

Hier liefert `create_agent()` bereits ein kompiliertes LangGraph‑Objekt (CompiledStateGraph). Dadurch kann derselbe Agent später in komplexere Workflows eingebettet werden.

### Strict Schema für Agent-Responses

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

agent = create_agent(
    model=llm,
    tools=[multiply, safe_divide],
    system_prompt="You are a helpful research assistant",
    response_format=AgentResponse,  # Strikte Validierung
)

response = agent.invoke({
    "messages": [{"role": "human", "content": "Recherchiere die Bevölkerung von Berlin"}]
})

# Strukturierte Antwort liegt im Agent-State.
structured = response["structured_response"]
print(structured.reasoning)
print(structured.confidence)
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


### Agent-Tool-Interaktion

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Agent
    participant LLM
    participant Tools

    User->>Agent: "Multipliziere 12 mit 8"
    Agent->>LLM: Process request + available tools
    LLM->>LLM: Decide to use multiply tool
    LLM-->>Agent: Tool call: multiply(12, 8)
    Agent->>Tools: Execute multiply(12, 8)
    Tools-->>Agent: Result: 96
    Agent->>LLM: Tool result: 96
    LLM-->>Agent: Format final answer
    Agent-->>User: "Das Ergebnis ist 96"

    Note over Agent,Tools: Agent orchestrates<br/>LLM and Tool calls
```

---

## Moderne Kettensyntax: LCEL `|`

LangChain Expression Language (LCEL) ersetzt frühere Chain‑Implementierungen. Über den Pipe‑Operator `|` werden Verarbeitungsschritte logisch miteinander verbunden.

### LCEL Pipeline-Visualisierung

```mermaid
flowchart LR
    INPUT[Input Data<br/>input_text: ...]
    PROMPT[Prompt Template<br/>ChatPromptTemplate]
    LLM[Language Model<br/>llm]
    PARSER[Output Parser<br/>StrOutputParser]
    OUTPUT[Output<br/>String result]

    INPUT -->|pipe operator| PROMPT
    PROMPT -->|pipe operator| LLM
    LLM -->|pipe operator| PARSER
    PARSER --> OUTPUT

    style PROMPT fill:#ffe6cc
    style LLM fill:#d5e8d4
    style PARSER fill:#dae8fc
```

### Beispiel: Einfache LCEL-Chain für Textumformung

```python
from langchain_core.output_parsers import StrOutputParser

rewrite_prompt = ChatPromptTemplate.from_template(
    "Formuliere den folgenden Text freundlicher um:\n\n{input_text}"
)

rewrite_chain = rewrite_prompt | llm | StrOutputParser()

text = "Das ist schlecht dokumentiert und unverständlich."
output = rewrite_chain.invoke({"input_text": text})
print(output)
```

### Beispiel: LCEL-Chain mit zusätzlicher Eingabe (Pass-Through)

`RunnablePassthrough` ergänzt Daten innerhalb einer Chain, ohne den ursprünglichen Input zu verändern. Dadurch können zusätzliche Informationen wie Kontext, Metadaten oder Zwischenergebnisse einfach ergänzt werden.

```python
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate

qa_prompt = ChatPromptTemplate.from_template(
    "Kontext:\n{context}\n\nFrage: {question}"
)

# Die Chain erhält ein Dictionary, z. B. {"question": "..."}.
# RunnablePassthrough.assign ergänzt daraus ein weiteres Feld: "context".

qa_chain = (
    RunnablePassthrough.assign(
        context=lambda x: "Hier stehen z.B. Infos aus einer Datenbank."
    )
    | qa_prompt
    | llm
    | StrOutputParser()
)

# Aufruf:
# "question" wird unverändert weitergegeben.
# "context" wird von der Chain automatisch ergänzt.

answer = qa_chain.invoke({"question": "Was ist RAG?"})
print(answer)
```

---

## Typische Workflows

Die folgenden Abschnitte zeigen typische Einsteiger-Workflows: multimodale Eingaben, Chunking, Embeddings und ein vollständiges RAG-Pattern.

---

## Middleware zur Agentensteuerung

Middleware ergänzt Agenten um wichtige Kontrollmechanismen, etwa Sicherheitsprüfungen oder automatische Kontextverdichtung.

**Ein Agent mit Human-in-the-Loop für sensible Tools**

```python
from langchain.agents.middleware import HumanInTheLoopMiddleware

sensitive_tools = [safe_divide]  # hier exemplarisch

middleware = [
    HumanInTheLoopMiddleware(
        tool_names=[t.name for t in sensitive_tools]
    )
]

secure_agent = create_agent(
    model=llm,
    tools=sensitive_tools,
    system_prompt=(
        "Du bist ein vorsichtiger Assistent. "
        "Bei allen sicherheitsrelevanten Aktionen muss der Mensch zustimmen."
    ),
    middleware=middleware,
)
```

Für produktionsnähere Human-in-the-Loop-Abläufe mit explizitem Pause/Resume ist LangGraph `interrupt()` meist besser nachvollziehbar. Die Middleware eignet sich für einfache Agenten, bei denen bestimmte Tools vor der Ausführung bestätigt werden sollen.


**Kontext-Management bei langen Konversationen**

Für lange Sessions gibt es zwei komplementäre Ansätze:

```python
from langchain.agents.middleware import SummarizationMiddleware

# Ansatz 1: SummarizationMiddleware (provider-unabhängig)
agent_summarize = create_agent(
    model=llm,
    tools=tools,
    middleware=[
        SummarizationMiddleware(
            model=llm,
            max_tokens_before_summary=4000,
        )
    ]
    # Fasst Konversation automatisch zusammen, wenn Token-Limit überschritten
)

# Ansatz 2: OpenAI Server-Side Compaction (nur OpenAI, wenn vom Modell unterstützt)
llm_compact = init_chat_model(
    "openai:gpt-5.4-nano",
    context_management=[{"type": "compaction", "compact_threshold": 10_000}]
)
agent_compact = create_agent(model=llm_compact, tools=tools)
# → OpenAI komprimiert serverseitig, kein Middleware-Layer nötig
```

| Ansatz | Provider | Wann verwenden? |
|--------|----------|-----------------|
| `SummarizationMiddleware` | Alle | Provider-unabhängig, mehr Kontrolle |
| `context_management` | Nur OpenAI | Einfachste Lösung für OpenAI-Apps |

---

## Einheitliche Content-Blöcke für multimodale Eingaben

Da moderne Modelle verschiedene Datentypen verarbeiten, benötigen Agenten ein einheitliches Format für Eingaben. LangChain 1.0 definiert Content‑Blöcke, die Text, Bilder, Audio oder andere Inhalte abbilden.

**Beispiel: Einfacher Vision-Call mit Text + Bild**

```python
from langchain_core.messages import HumanMessage

image_bytes_b64 = "data:image/png;base64,..."  # Platzhalter

vision_message = HumanMessage(
    content=[
        {"type": "text", "text": "Was ist auf diesem Bild zu sehen?"},
        {"type": "image", "url": image_bytes_b64, "mime_type": "image/png"},
    ]
)

vision_response = llm.invoke([vision_message])

# content_blocks können provider-agnostisch ausgewertet werden
for block in vision_response.content_blocks:
    if block["type"] == "text":
        print("Antwort:", block["text"])
```

Dieses Muster kann später in multimodalen RAG‑Notebooks wiederverwendet werden.

---

## Chunking‑Best Practices

Damit RAG‑Systeme sinnvoll arbeiten, müssen Dokumente in geeignete Textstücke („Chunks“) zerlegt werden. In LangChain hat sich der `RecursiveCharacterTextSplitter` etabliert.

**Beispiel: Text in sinnvolle Chunks schneiden**

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

text = """Längerer Dokumententext ... (z.B. Handbuch, Richtlinie, Artikel)"""

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=200,
)

chunks = splitter.split_text(text)
print(len(chunks))
print(chunks[0][:200])
```

Im Kurs lässt sich hier gut mit unterschiedlichen Chunk‑Größen und Overlaps experimentieren, um deren Einfluss auf Retrieval und Antwortqualität zu zeigen.

---

## Embeddings: Grundlagen für semantische Suche

Embeddings repräsentieren Texte als Vektoren und bilden die Basis für semantische Suche und RAG. Häufig kommen OpenAI‑Embeddings in Kombination mit Chroma zum Einsatz.

**Beispiel: Embeddings erzeugen und in Chroma speichern**

```python
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

## 1. Dokumente (z.B. Ergebnis des Chunkings)
documents = [
    "LangChain verbindet LLMs mit Tools.",
    "RAG kombiniert Retrieval mit Textgenerierung.",
    "Chroma ist ein leichter Vektorspeicher.",
]

## 2. Embedding-Modell
embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

## 3. Vektorspeicher erstellen
vectorstore = Chroma.from_texts(
    texts=documents,
    embedding=embedding_model,
    collection_name="demo_rag",
)

## 4. Ähnlichkeitssuche
query = "Was ist RAG?"
results = vectorstore.similarity_search(query, k=2)

for i, doc in enumerate(results, start=1):
    print(f"Treffer {i}: {doc.page_content}")
```

---

## Standard‑Pattern für RAG mit LangChain

Retrieval‑Augmented Generation (RAG) ist eines der wichtigsten Einsatzszenarien für LangChain. Typischerweise werden Vektorspeicher, Retriever und eine LCEL‑Pipeline kombiniert.

### RAG-Workflow Visualisierung

```mermaid
flowchart TB

START([Benutzeranfrage])

EMBED[Embedding-Modell
Anfrage in Vektor umwandeln]

RETRIEVE[Vektordatenbank-Abfrage
Ähnlichkeitssuche]

FORMAT[Dokumente formatieren
Gefundene Chunks kombinieren]

PROMPT[RAG Prompt-Vorlage
Kontext + Frage]

LLM[Sprachmodell
Antwort generieren]

FINISH([Antwort an Benutzer])

START --> EMBED
EMBED --> RETRIEVE
RETRIEVE -->|Top-k Dokumente| FORMAT
FORMAT -->|Kontext| PROMPT
START -->|Frage| PROMPT
PROMPT --> LLM
LLM --> FINISH

subgraph "<b>Vektordatenbank</b>"
    RETRIEVE
end

subgraph "<b>LCEL Chain (Kette)</b>"
    FORMAT
    PROMPT
    LLM
end

style EMBED fill:#ffe6cc
style RETRIEVE fill:#f8cecc
style FORMAT fill:#d5e8d4
style PROMPT fill:#dae8fc
style LLM fill:#d5e8d4
```

**Beispiel: Minimaler RAG-Workflow mit LCEL**

```python
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

## 1. Retriever aus bestehendem Chroma-Store
doc_retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

## 2. Hilfsfunktion zur Formatierung der Dokumente

def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

## 3. Prompt für RAG
rag_prompt = ChatPromptTemplate.from_template(
    """Du bist ein hilfreicher Assistent.
Nutze NUR den folgenden Kontext, um die Frage zu beantworten.
Wenn die Antwort im Kontext nicht steht, sage ehrlich, dass keine Information vorliegt.

Kontext:
{context}

Frage: {question}
"""
)

# 4. LCEL-Chain
rag_chain = (
    {
        # Hier wird die Frage an den Retriever gegeben und das Ergebnis formatiert
        "context": doc_retriever | format_docs,
        # Hier wird die ursprüngliche Frage ("Wozu wird Chroma verwendet?") einfach durchgereicht
        "question": RunnablePassthrough(), 
    }
    | rag_prompt
    | llm
    | StrOutputParser()
)

## 5. Aufruf
frage = "Wozu wird Chroma verwendet?"
antwort = rag_chain.invoke(frage)
print(antwort)
```

Dieses Pattern bildet die Grundlage für Wissens‑Chatbots, Dokumenten‑Assistenten oder interne Suchsysteme im Kurs und kann schrittweise um Evaluierung, Feedback‑Schleifen oder LangGraph‑Workflows erweitert werden.

---

## Best Practices

- `init_chat_model()` statt provider-spezifischer Modellklassen verwenden.
- Prompts mit `ChatPromptTemplate` statt zusammengesetzten Strings bauen.
- Strukturierte Daten mit `with_structured_output()` erzeugen.
- Tools mit `@tool`, Type Hints und klaren Docstrings definieren.
- LCEL `|` für lineare Chains verwenden.
- Für RAG zuerst Chunking, Embeddings und Retrieval-Qualität testen, bevor der Agent komplexer wird.

---

## Troubleshooting

### Import funktioniert nicht

Prüfe, ob die benötigten Pakete installiert sind und ob du die aktuellen LangChain-Importpfade verwendest.

### Modell liefert Freitext statt Schema

Nutze `with_structured_output()` mit einem Pydantic-Modell. Prompt-Anweisungen allein reichen für robuste strukturierte Daten nicht aus.

### RAG-Antworten sind ungenau

Prüfe zuerst Chunk-Größe, Overlap, Embedding-Modell und Retriever-Parameter. Das Modell kann nur mit dem Kontext arbeiten, den der Retriever liefert.

---

## Erweiterungen / Fortgeschrittene Themen

### Ausblick auf Best Practices

Diese Begriffe musst du für die ersten Beispiele nicht aktiv verwenden, sie erklären aber einige Muster aus den Best-Practice-Seiten:

| Konzept | Kurz erklärt |
|---|---|
| `llm.profile` / Model Profiles | Modelle stellen Fähigkeiten wie strukturierte Ausgabe, Tool Calling, Bild-Eingaben und Kontextgröße maschinenlesbar bereit. So muss Code weniger provider-spezifisch entscheiden. |
| `ProviderStrategy` | Bei `with_structured_output()` wählt LangChain möglichst automatisch die passende Strategie: native strukturierte Ausgabe, wenn der Provider sie unterstützt, sonst ein Fallback. |
| `.with_retry()` / `.with_fallbacks()` | Runnables können bei transienten Fehlern erneut ausgeführt oder auf ein alternatives Modell umgeleitet werden. Das ist vor allem für produktionsnähere Chains relevant. |
| `ContextOverflowError` | Wenn ein Modellaufruf das Kontextfenster überschreitet, kann dieser Fehler entstehen. Context-Management oder `SummarizationMiddleware` verhindert, dass lange Sessions daran scheitern. |

---

- Middleware zur Agentensteuerung
- Multimodale Content-Blöcke
- Provider-spezifische Tool Extras
- Strict Schema für Agent-Responses
- RAG mit Vektordatenbanken

---

## Zusammenfassung

LangChain liefert die Bausteine für LLM-Anwendungen: Prompts, Modelle, strukturierte Ausgaben, Tools, Chains, Agents und RAG. Für Einsteiger ist die wichtigste Reihenfolge: erst einen einfachen Modellaufruf stabil bekommen, dann LCEL-Chains bauen, anschließend Tools und Retrieval ergänzen.


## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [LangGraph](einsteiger-langgraph.html) | Wann reicht eine Chain nicht mehr aus und ein Graph wird sinnvoll? |
| [LangChain Best Practices](./langchain-best-practices.html) | Welche Muster gelten für produktionsnähere LangChain-Anwendungen? |

---

**Version:** 1.1<br>
**Stand:** Juli 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.

