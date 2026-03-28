# LangGraph 1.0+ MUST-HAVE Features

> **Advanced Multi-Agent & State Machine Patterns für komplexe Workflows**

Dieses Dokument beschreibt die 7 verpflichtenden Features für **LangGraph 1.0+**, die für komplexe Multi-Agent-Systeme und State Machines verwendet werden müssen.

---

## 🎯 Wann LangGraph statt einfachem `create_agent()`?

| Use Case | LangChain `create_agent()` | LangGraph |
|----------|---------------------------|-----------|
| **Einfacher Agent** mit Tools | ✅ Perfekt | ❌ Overkill |
| **Multi-Step Workflows** mit Bedingungen | ⚠️ Begrenzt | ✅ Ideal |
| **Multi-Agent-Systeme** (Supervisor, Hierarchie) | ❌ Nicht möglich | ✅ Essential |
| **Langlebige Sessions** mit Checkpointing | ❌ Nicht möglich | ✅ Essential |
| **Human-in-the-Loop** (erweitert) | ⚠️ Basic (via Middleware) | ✅ Advanced |
| **Conditional Routing** | ❌ Nicht möglich | ✅ Essential |
| **State Persistence** über Tage/Wochen | ❌ Nicht möglich | ✅ Essential |

**Faustregel:**
- ✅ **LangChain** für einfache, lineare Agent-Tasks
- ✅ **LangGraph** für komplexe, verzweigte Workflows und Multi-Agent-Systeme

---

## 📋 Übersicht der 7 MUST-HAVE Features

| # | Feature | Priorität | Hauptvorteil | Use Case |
|---|---------|-----------|--------------|----------|
| 1 | StateGraph mit TypedDict | ⭐ PFLICHT | Type-safe State Management | Alle Workflows |
| 2 | Nodes & Edges | ⭐ PFLICHT | Workflow-Definition | Alle Workflows |
| 3 | Conditional Routing | ⭐ PFLICHT | Dynamische Entscheidungen | Verzweigte Logik |
| 4 | Checkpointing & Memory | ⭐ PFLICHT | Persistenz & Recovery | Langlebige Sessions |
| 5 | Human-in-the-Loop (erweitert) | ⭐ PFLICHT | Interrupt & Resume | Kritische Entscheidungen |
| 6 | Subgraphs & Multi-Agent | ⭐ PFLICHT | Modulare Systeme | Komplexe Workflows |
| 7 | Stream Modes | ⭐ PFLICHT | Debugging & Monitoring | Production-Ready Apps |

---

## 1️⃣ StateGraph mit TypedDict - Type-Safe State Management

### ❌ ALT (fehleranfällig)
```python
# Untyped State - Runtime-Fehler möglich
graph = StateGraph(dict)
state = {"messages": [], "count": 0}  # Keine Type-Checks!
```

### ✅ NEU (PFLICHT)
```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    """State-Definition mit TypedDict für Type-Safety."""
    messages: Annotated[list, add_messages]  # Reducer für Message-Akkumulation
    user_id: str
    session_id: str
    current_step: int

# StateGraph mit typisiertem State
graph = StateGraph(AgentState)
```

### 🎯 Vorteile
- ✅ **Type-Safety**: Fehler zur Entwicklungszeit, nicht zur Laufzeit
- ✅ **IDE-Unterstützung**: Autocomplete und IntelliSense
- ✅ **Reducer-Support**: `add_messages` für Message-Akkumulation
- ✅ **Minimal Overhead**: TypedDict ist stdlib, keine Runtime-Kosten

### 📦 Best Practices: TypedDict vs. Pydantic

| Kriterium | TypedDict | Pydantic BaseModel |
|-----------|-----------|-------------------|
| **Performance** | ✅ Schnell (kein Overhead) | ⚠️ Langsamer (Validation) |
| **Use Case** | Interne State Machines | API Boundaries, User Input |
| **Validation** | ❌ Keine Runtime-Validation | ✅ Strikte Validation |
| **Empfehlung** | **LangGraph State (intern)** | **Input/Output-Validierung** |

```python
# ✅ Best Practice: TypedDict für State
class GraphState(TypedDict):
    messages: Annotated[list, add_messages]

# ✅ Pydantic für User Input
from pydantic import BaseModel
class UserInput(BaseModel):
    query: str
    temperature: float = 0.7
```

---

## 2️⃣ Nodes & Edges - Workflow-Definition

### 🔄 Workflow-Bausteine

#### **Nodes** = Funktionen, die State transformieren
```python
def agent_node(state: AgentState) -> AgentState:
    """Ein Node ist eine Funktion, die State empfängt und transformiert."""
    messages = state["messages"]
    response = llm.invoke(messages)
    return {"messages": [response]}

def tool_node(state: AgentState) -> AgentState:
    """Tool-Ausführung als Node."""
    result = execute_tool(state["messages"][-1])
    return {"messages": [result]}
```

#### **Edges** = Verbindungen zwischen Nodes
```python
from langgraph.graph import StateGraph, START, END

graph = StateGraph(AgentState)

# Nodes hinzufügen
graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)

# Edges definieren
graph.add_edge(START, "agent")  # Start → agent
graph.add_edge("tools", "agent")  # tools → agent (Loop)
graph.add_edge("agent", END)  # agent → END
```

### 📦 Graph-Visualisierung (PFLICHT nach compile())

Nach `graph_builder.compile()` den Graphen immer grafisch darstellen – als sofortige Sichtprüfung der Struktur (Nodes, Edges, Routing).

```python
from IPython.display import Image, display

# Direkt nach graph.compile():
graph = graph_builder.compile()

try:
    display(Image(graph.get_graph().draw_mermaid_png()))
except Exception as e:
    print(f"⚠️ Graph-Visualisierung nicht verfügbar: {e}")
```

**Warum `try/except`:** `draw_mermaid_png()` benötigt `pygraphviz` oder einen Playwright-Browser.
In Colab und Jupyter meist verfügbar – `try/except` verhindert Abbruch falls nicht installiert.

**Was die Visualisierung zeigt:**
- Alle Nodes mit Namen
- Edges und deren Richtung
- Conditional Edges als Verzweigungen
- START- und END-Knoten

### 🎯 Vorteile
- ✅ **Klarheit**: Workflow ist visuell verständlich
- ✅ **Testbarkeit**: Nodes sind isolierte Funktionen
- ✅ **Wiederverwendbarkeit**: Nodes können geteilt werden
- ✅ **Debugging**: Einzelne Nodes testbar

### 📦 Advanced: Node Caching (verfügbar ab v1.0)

**Warum:** Eliminiere redundante Berechnungen und spare API-Kosten während der Entwicklung.

```python
from langgraph.graph import StateGraph

graph = StateGraph(AgentState)

# Node mit Caching
def expensive_research(state: AgentState) -> AgentState:
    """Teurer Research-Node - Ergebnis wird gecacht."""
    result = expensive_api_call(state["query"])
    return {"research_data": result}

# Node mit Cache aktivieren
graph.add_node("research", expensive_research, cache=True)

# Optional: Cache TTL setzen (in Sekunden)
graph.add_node("research", expensive_research, cache=True, cache_ttl=3600)  # 1 Stunde
```

**Use Cases:**
- ✅ Teure API-Calls (Web Search, Database Queries)
- ✅ Development & Testing (schnellere Iteration)
- ✅ Wiederholbare Berechnungen mit gleichen Inputs

**Vorteile:**
- 🚀 Entwicklungsgeschwindigkeit erhöhen
- 💰 API-Kosten reduzieren
- ⚡ Workflow-Iterationen beschleunigen

### 📦 Advanced: Deferred Nodes (verfügbar ab v1.0)

**Warum:** Verzögere Node-Ausführung bis alle Upstream-Pfade abgeschlossen sind (Map-Reduce, Consensus).

```python
from langgraph.graph import StateGraph

graph = StateGraph(AgentState)

# Parallel Research Nodes
def web_search_node(state: AgentState) -> AgentState:
    return {"web_results": search_web(state["query"])}

def db_query_node(state: AgentState) -> AgentState:
    return {"db_results": query_database(state["query"])}

def api_fetch_node(state: AgentState) -> AgentState:
    return {"api_results": fetch_from_api(state["query"])}

# Deferred Node wartet auf ALLE Upstream-Nodes
def aggregate_results(state: AgentState) -> AgentState:
    """Aggregiert Ergebnisse von allen parallelen Research-Nodes."""
    all_results = (
        state.get("web_results", []) +
        state.get("db_results", []) +
        state.get("api_results", [])
    )
    return {"aggregated_data": all_results}

# Nodes hinzufügen
graph.add_node("web_search", web_search_node)
graph.add_node("db_query", db_query_node)
graph.add_node("api_fetch", api_fetch_node)

# Deferred Node - wartet auf alle Upstream-Nodes!
graph.add_node("aggregate", aggregate_results, deferred=True)

# Alle Worker-Nodes führen zum Aggregator
graph.add_edge("web_search", "aggregate")
graph.add_edge("db_query", "aggregate")
graph.add_edge("api_fetch", "aggregate")
```

**Use Cases:**
- ✅ **Map-Reduce Patterns**: Parallele Verarbeitung + Aggregation
- ✅ **Consensus Mechanisms**: Mehrere Agents einigen sich auf Ergebnis
- ✅ **Multi-Agent Collaboration**: Warte auf alle Agent-Antworten vor Entscheidung

**Vorteile:**
- 🔄 Saubere Map-Reduce-Semantik
- 🤝 Perfekt für Multi-Agent-Consensus
- ⚡ Maximale Parallelisierung + saubere Aggregation

---

## 3️⃣ Conditional Routing - Dynamische Entscheidungen

### ❌ ALT (statische Edges)
```python
graph.add_edge("agent", "tools")  # Immer gleicher Pfad
```

### ✅ NEU (PFLICHT für verzweigte Logik)
```python
def should_continue(state: AgentState) -> str:
    """Routing-Funktion: Entscheidet zur Laufzeit, welcher Node als nächstes."""
    messages = state["messages"]
    last_message = messages[-1]

    # Entscheidungslogik
    if last_message.tool_calls:
        return "tools"  # Agent will Tool aufrufen
    return END  # Agent ist fertig

# Conditional Edge hinzufügen
graph.add_conditional_edges(
    "agent",  # Von welchem Node
    should_continue,  # Routing-Funktion
    {
        "tools": "tools",  # Wenn "tools" → zum tools-Node
        END: END  # Wenn END → Workflow beenden
    }
)
```

### 🎯 Vorteile
- ✅ **Dynamische Workflows**: Pfad abhängig von State
- ✅ **Komplexe Logik**: Beliebige Bedingungen möglich
- ✅ **Fehlerbehandlung**: Routing zu Error-Nodes
- ✅ **Multi-Agent**: Routing zu verschiedenen Agents

### 📦 Advanced: Routing zu mehreren Nodes
```python
def route_to_specialists(state: AgentState) -> list[str]:
    """Routing zu mehreren Nodes parallel."""
    task_type = state["task_type"]

    if task_type == "research":
        return ["web_search", "database_query"]  # Parallel
    elif task_type == "analysis":
        return ["data_analyzer"]
    return [END]

graph.add_conditional_edges(
    "supervisor",
    route_to_specialists
)
```

---

## 4️⃣ Checkpointing & Memory - Persistenz & Recovery

### ❌ ALT (State verloren bei Neustart)
```python
graph = graph_builder.compile()  # Kein Checkpointing!
# Bei Crash oder Neustart: Alles weg ❌
```

### ✅ NEU (PFLICHT für Production)
```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.sqlite import SqliteSaver

# Option 1: In-Memory (Development)
memory = MemorySaver()
graph = graph_builder.compile(checkpointer=memory)

# Option 2: SQLite (Production)
checkpointer = SqliteSaver.from_conn_string("checkpoints.db")
graph = graph_builder.compile(checkpointer=checkpointer)

# Workflow mit Thread-ID starten (für Persistenz)
config = {"configurable": {"thread_id": "user-123-session-456"}}
result = graph.invoke(initial_state, config)

# Später fortsetzen (auch nach Tagen!)
result = graph.invoke(None, config)  # Lädt automatisch letzten Checkpoint
```

### 🎯 Vorteile
- ✅ **Crash-Recovery**: Kein Datenverlust bei Absturz
- ✅ **Langlebige Sessions**: Workflows über Tage/Wochen
- ✅ **Debugging**: State-Historie verfügbar
- ✅ **Rollback**: Zurück zu früheren Checkpoints

### 📦 Checkpoint-Backends

| Backend | Use Case | Persistenz | Version |
|---------|----------|-----------|---------|
| `MemorySaver` | Development, Testing | ❌ Nur RAM | - |
| `SqliteSaver` | Production (single instance) | ✅ Disk | v3.0.1+ (Security Hardening) |
| `PostgresSaver` | Production (distributed) | ✅ Database | v3.0.2+ (Security Hardening) |
| Custom | Spezielle Anforderungen | ✅ Anpassbar | - |

**⚠️ Security Update (v1.0.5):**
- **SQLite Checkpoint v3.0.1**: Security Hardening für Production-Deployments
- **PostgreSQL Checkpoint v3.0.2**: Security Hardening + Custom Encryption at Rest
- **Empfehlung**: Update auf v3.x für sichere Production-Umgebungen

```python
# SQLite mit Security Features (v3.0.1+)
from langgraph.checkpoint.sqlite import SqliteSaver

checkpointer = SqliteSaver.from_conn_string(
    "checkpoints.db",
    encryption_key="your-encryption-key"  # Optional: Custom Encryption
)

# PostgreSQL mit Security Features (v3.0.2+)
from langgraph.checkpoint.postgres import PostgresSaver

checkpointer = PostgresSaver.from_conn_string(
    "postgresql://user:pass@localhost/db",
    encryption_at_rest=True  # NEU: Encryption at Rest
)
```

---

## 5️⃣ Human-in-the-Loop (erweitert) - Interrupt & Resume

### ❌ ALT (LangChain Middleware - basic)
```python
# LangChain HumanInTheLoopMiddleware ist limitiert
middleware = [HumanInTheLoopMiddleware(tool_names=["delete_file"])]
```

### ✅ NEU (PFLICHT für erweiterte Kontrolle)
```python
from langgraph.types import interrupt, Command

def approval_node(state: AgentState) -> AgentState:
    """Node mit Human-in-the-Loop Interrupt."""
    action = state["proposed_action"]

    # Workflow pausieren und auf Benutzer warten
    approved = interrupt(
        f"Approve this action? {action}\nType 'yes' or 'no'"
    )

    if approved == "yes":
        return {"status": "approved"}
    else:
        return {"status": "rejected"}

# Graph mit Interrupt kompilieren
graph = graph_builder.compile(checkpointer=checkpointer)

# Workflow starten
config = {"configurable": {"thread_id": "session-123"}}
try:
    result = graph.invoke(initial_state, config)
except GraphInterrupt as e:
    # Interrupt wurde ausgelöst
    print(f"Waiting for user input: {e.message}")

# Nach User-Input: Fortsetzen mit Command
from langgraph.types import Command

result = graph.invoke(
    Command(resume="yes"),  # User-Antwort übergeben
    config
)
```

### 🎯 Vorteile
- ✅ **Volle Kontrolle**: Workflow pausiert exakt an definiertem Punkt
- ✅ **Asynchron**: User kann Stunden/Tage später antworten
- ✅ **Multiple Interrupts**: Mehrere Pausen im Workflow
- ✅ **State-Preservation**: Kompletter State bleibt erhalten

### 📦 Interrupt-Patterns

#### Pattern 1: Approval Gate
```python
def requires_approval(state: AgentState) -> AgentState:
    action = state["action"]
    approved = interrupt(f"Approve: {action}?")
    return {"approved": approved == "yes"}
```

#### Pattern 2: Data Collection
```python
def collect_user_data(state: AgentState) -> AgentState:
    name = interrupt("What is your name?")
    age = interrupt("What is your age?")
    return {"name": name, "age": age}
```

#### Pattern 3: Error Handling
```python
def error_recovery(state: AgentState) -> AgentState:
    error = state["error"]
    choice = interrupt(f"Error: {error}\nRetry or Skip?")
    return {"action": choice}
```

### 📦 Advanced: Multiple Interrupt Resume (verfügbar ab v1.0)

**Warum:** Parallele Tool Calls oder mehrere Interrupts gleichzeitig fortsetzen.

**Problem (vor v1.0):** Interrupts mussten sequenziell bearbeitet werden.

**Lösung (ab v1.0):** Alle Interrupts können gleichzeitig mit einem einzigen `Command(resume=...)` fortgesetzt werden.

```python
from langgraph.types import Command, interrupt
from langgraph.errors import GraphInterrupt

# Workflow mit parallelen Tool Calls
def parallel_tool_node(state: AgentState) -> AgentState:
    """Mehrere Tools parallel ausführen - jedes braucht Approval."""
    tool_calls = state["tool_calls"]

    # Jeder Tool Call löst eigenen Interrupt aus
    results = []
    for tool in tool_calls:
        approved = interrupt(f"Approve tool: {tool.name}?")
        results.append({"tool": tool.name, "approved": approved})

    return {"tool_results": results}

# Graph ausführen
config = {"configurable": {"thread_id": "session-1"}}

try:
    result = graph.invoke(initial_state, config)
except GraphInterrupt as e:
    # Mehrere Interrupts (z.B. 3 parallele Tool Calls)
    interrupts = e.interrupts  # Liste von Interrupt-Objekten
    print(f"Got {len(interrupts)} interrupts to resolve")

    # User gibt Feedback für ALLE Interrupts
    resume_values = {
        interrupts[0].id: "yes",  # Approve tool1
        interrupts[1].id: "yes",  # Approve tool2
        interrupts[2].id: "no"    # Reject tool3
    }

    # Resume ALLE Interrupts gleichzeitig! (verfügbar ab v1.0)
    result = graph.invoke(
        Command(resume=resume_values),
        config
    )

    print(f"All interrupts resolved: {result}")
```

**Use Cases:**
- ✅ **Parallel Tool Calls**: Agent will mehrere Tools gleichzeitig ausführen
- ✅ **Batch Approvals**: User kann mehrere Aktionen auf einmal genehmigen
- ✅ **Out-of-Order Resume**: Interrupts können in beliebiger Reihenfolge beantwortet werden

**Vorteile:**
- 🚀 **Effizienz**: Keine sequenzielle Bearbeitung mehr nötig
- 🤝 **User Experience**: User kann alle Entscheidungen auf einmal treffen
- ⚡ **Performance**: Parallele Tool Calls bleiben parallel

**Best Practice:**
```python
# Interrupt-IDs tracken für bessere UX
interrupts_map = {}
for interrupt in e.interrupts:
    print(f"[{interrupt.id}] {interrupt.message}")
    interrupts_map[interrupt.id] = interrupt.message

# User gibt Antworten basierend auf IDs
user_responses = collect_user_input(interrupts_map)

# Resume mit allen Antworten
result = graph.invoke(Command(resume=user_responses), config)
```

### ⚠️ Best Practices (2025)

1. **Verwende `interrupt()` (Standard seit v1.0)**
   ```python
   # ✅ NEU
   value = interrupt("message")

   # ❌ ALT (deprecated)
   raise NodeInterrupt("message")
   ```

2. **Interrupt-Reihenfolge ist wichtig**
   ```python
   # ✅ Konsistente Reihenfolge
   name = interrupt("Name?")
   age = interrupt("Age?")

   # ❌ Dynamische Reihenfolge (kann Probleme verursachen)
   if random.choice([True, False]):
       interrupt("A")
   interrupt("B")  # Index-basiertes Matching kann fehlschlagen
   ```

3. **Resume mit Command-Object**
   ```python
   # ✅ Empfohlen
   graph.invoke(Command(resume="value"), config)

   # ❌ Vermeiden (deprecated)
   graph.invoke({"resume": "value"}, config)
   ```

---

## 6️⃣ Subgraphs & Multi-Agent - Modulare Systeme

### 🏗️ Multi-Agent-Patterns

#### Pattern 1: Supervisor Pattern
```python
from langchain.agents import create_agent

# Spezialisierte Worker-Agents
research_agent = create_agent(
    model=llm,
    tools=[web_search, database_query],
    system_prompt="You are a research specialist"
)

writer_agent = create_agent(
    model=llm,
    tools=[write_document],
    system_prompt="You are a writing specialist"
)

# Supervisor-Node
def supervisor(state: AgentState) -> Command:
    """Supervisor entscheidet, welcher Agent als nächstes."""
    task = state["current_task"]

    if "research" in task:
        return Command(goto="research_agent")
    elif "write" in task:
        return Command(goto="writer_agent")
    return Command(goto=END)

# Graph mit Supervisor
graph = StateGraph(AgentState)
graph.add_node("supervisor", supervisor)
graph.add_node("research_agent", research_agent)
graph.add_node("writer_agent", writer_agent)

graph.add_edge(START, "supervisor")
graph.add_edge("research_agent", "supervisor")
graph.add_edge("writer_agent", "supervisor")
```

#### Pattern 2: Hierarchical Teams mit Subgraphs
```python
def create_research_team() -> StateGraph:
    """Subgraph für Research-Team."""
    team_graph = StateGraph(AgentState)
    team_graph.add_node("web_searcher", web_search_node)
    team_graph.add_node("db_analyst", db_analyst_node)
    team_graph.add_node("summarizer", summarizer_node)
    # ... Edges definieren
    return team_graph.compile()

def create_writing_team() -> StateGraph:
    """Subgraph für Writing-Team."""
    team_graph = StateGraph(AgentState)
    team_graph.add_node("writer", writer_node)
    team_graph.add_node("editor", editor_node)
    # ... Edges definieren
    return team_graph.compile()

# Top-Level Graph mit Subgraphs
main_graph = StateGraph(AgentState)
main_graph.add_node("research_team", create_research_team())
main_graph.add_node("writing_team", create_writing_team())
main_graph.add_node("coordinator", coordinator_node)

main_graph.add_edge(START, "coordinator")
main_graph.add_conditional_edges("coordinator", route_to_team)
```

### 🎯 Vorteile
- ✅ **Modularität**: Teams als wiederverwendbare Komponenten
- ✅ **Skalierbarkeit**: Einfache Erweiterung durch neue Teams
- ✅ **Klarheit**: Klare Verantwortlichkeiten
- ✅ **Testing**: Subgraphs isoliert testbar

### 📦 Wann welches Pattern?

| Pattern | Use Case | Komplexität | Vorteile |
|---------|----------|-------------|----------|
| **Supervisor** | 3-5 Agents, flache Struktur | ⭐ Niedrig | Einfach, schnell |
| **Hierarchical** | >5 Agents, mehrere Ebenen | ⭐⭐ Mittel | Skalierbar, strukturiert |
| **Collaborative** | Agents arbeiten parallel | ⭐⭐⭐ Hoch | Effizient, komplex |

### 🆕 ToolRuntime – Dependency Injection in Tools *(langgraph-prebuilt 1.0.8, Feb 2026)*

**ToolRuntime** ermöglicht Tools den Zugriff auf den vollständigen LangGraph-Laufzeit-Kontext via Dependency Injection – ähnlich wie `InjectedState` und `InjectedStore`, aber mit Zugang zum gesamten Runtime-Bundle.

```python
from dataclasses import dataclass
from langgraph.prebuilt import ToolNode
from langchain_core.tools import tool
from typing import Any
from langchain_core.runnables import RunnableConfig

# ToolRuntime wird automatisch von ToolNode injiziert
@tool
def kontext_bewusstes_tool(query: str, runtime: ToolRuntime) -> str:
    """Tool mit vollständigem Zugriff auf den LangGraph-Laufzeit-Kontext."""
    # Aktuellen State lesen (ohne State-Parameter im Tool)
    aktueller_user = runtime.state.get("user_id", "unbekannt")
    # Persistenten Store nutzen
    if runtime.store:
        vergangene_anfragen = runtime.store.get("anfragen", runtime.state["session_id"])
    # Tool-Call-ID für Tracking
    call_id = runtime.tool_call_id
    return f"Antwort für {aktueller_user}: {query}"

# ToolNode injiziert ToolRuntime automatisch
tools = [kontext_bewusstes_tool]
tool_node = ToolNode(tools)

graph = StateGraph(AgentState)
graph.add_node("tools", tool_node)  # ToolRuntime wird automatisch übergeben
```

**ToolRuntime-Felder:**

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `state` | `dict` | Aktueller Graph-State |
| `context` | `Any` | LangGraph Runtime-Context |
| `config` | `RunnableConfig` | Runnable-Konfiguration |
| `stream_writer` | `StreamWriter` | Für direktes Streaming aus dem Tool |
| `tool_call_id` | `str` | ID des aktuellen Tool-Calls |
| `store` | `BaseStore \| None` | Persistenter Store (falls konfiguriert) |

**Wann ToolRuntime verwenden:**
- ✅ Tool braucht Zugriff auf State-Felder (ohne `InjectedState`-Annotation)
- ✅ Dynamisch registrierte Tools (zur Laufzeit hinzugefügt)
- ✅ Tool soll direkt in den Stream schreiben (`runtime.stream_writer`)
- ❌ Einfache Tools ohne Kontext-Bedarf → kein Overhead nötig

---

## 7️⃣ Stream Modes - Debugging & Monitoring

### ❌ ALT (keine Einsicht in Workflow)
```python
result = graph.invoke(state)  # Blackbox - keine Zwischenschritte
```

### ✅ NEU (PFLICHT für Production)
```python
# Stream Mode: "values" - Full State nach jedem Node
for event in graph.stream(initial_state, config):
    print(f"Node: {event['node']}")
    print(f"State: {event['values']}")

# Stream Mode: "updates" - Nur State-Deltas
for event in graph.stream(initial_state, config, stream_mode="updates"):
    print(f"Update from {event['node']}: {event['updates']}")

# Stream Mode: "debug" - Detaillierte Traces
for event in graph.stream(initial_state, config, stream_mode="debug"):
    print(f"Debug: {event}")

# Kombination mehrerer Modes
for event in graph.stream(
    initial_state,
    config,
    stream_mode=["values", "updates", "debug"]
):
    if event["type"] == "values":
        print(f"State: {event['values']}")
    elif event["type"] == "updates":
        print(f"Update: {event['updates']}")
```

### 🎯 Vorteile
- ✅ **Real-time Monitoring**: Workflow-Progress live verfolgen
- ✅ **Debugging**: Fehler sofort identifizieren
- ✅ **User Feedback**: Progress-Bar, Status-Updates
- ✅ **Production Monitoring**: Logging, Metrics

### 📦 Stream Modes Übersicht

| Mode | Output | Use Case | Performance |
|------|--------|----------|-------------|
| **values** | Full State | Simple Workflows, Debugging | ⚠️ Viel Daten |
| **updates** | State Deltas | Production, Monitoring | ✅ Effizient |
| **debug** | Execution Traces | Development, Fehlersuche | ⚠️ Verbose |
| **messages** | LLM Tokens | Streaming Chat UIs | ✅ Real-time |
| **custom** | User-defined | Spezielle Anforderungen | ✅ Flexibel |

### 📦 Practical Example: Progress Bar
```python
from tqdm import tqdm

def run_with_progress(graph, state, config):
    """Workflow mit Progress Bar."""
    nodes = ["node1", "node2", "node3", "node4"]

    with tqdm(total=len(nodes), desc="Workflow") as pbar:
        for event in graph.stream(state, config, stream_mode="updates"):
            node_name = list(event.keys())[0]
            pbar.set_description(f"Running: {node_name}")
            pbar.update(1)

    return graph.invoke(state, config)
```

### 📦 Advanced: Pre/Post Model Hooks (verfügbar ab v1.0)

**Warum:** Custom Logic vor/nach Model Calls für Context-Management, Guardrails und Human-in-Loop Gates.

**Use Cases:**
- **Pre-Hook:** Context-Size-Management (Token-Bloat verhindern), Custom Prompt Injection
- **Post-Hook:** Guardrails, Content Moderation, Compliance-Checks, Human Review Gates

```python
# Ausnahme: create_react_agent aus langgraph.prebuilt (nicht create_agent aus langchain.agents),
# da pre_model_hook / post_model_hook LangGraph-exklusive Parameter sind.
from langgraph.prebuilt import create_react_agent

def pre_model_hook(state):
    """Vor Model Call: Verhindere Token-Bloat."""
    messages = state["messages"]
    token_count = sum(len(m.content) for m in messages)

    if token_count > 100000:
        # Fasse alte Messages zusammen
        summary = llm_summarize(messages[:40])
        return {
            "messages": [
                SystemMessage(content=summary),
                *messages[40:]
            ]
        }
    return state

def post_model_hook(state, response):
    """Nach Model Call: Content Moderation & Guardrails."""
    # Guardrail 1: Sensitive Content Detection
    if contains_pii(response.content):
        return {"needs_review": True, "reason": "PII detected"}

    # Guardrail 2: Policy Violation
    if violates_policy(response.content):
        return interrupt(f"Policy violation detected. Review required:\n{response.content}")

    # Guardrail 3: Confidence Check
    if response.confidence < 0.7:
        return {"approved": False, "reason": "Low confidence"}

    return {"response": response, "approved": True}

# Agent mit Hooks erstellen
agent = create_react_agent(
    model=llm,
    tools=[tool1, tool2],
    pre_model_hook=pre_model_hook,   # NEU!
    post_model_hook=post_model_hook  # NEU!
)
```

**Vorteile:**
- 🛡️ **Safety-Layer**: Automatische Guardrails vor Production-Deployment
- 💰 **Token-Management**: Verhindere teure Token-Overflows
- 🔍 **Compliance**: DSGVO-konforme PII-Redaktion
- 🤝 **Human-in-Loop**: Pause bei kritischen Entscheidungen

**Best Practices:**

1. **Pre-Hook für Context-Management**
   ```python
   def pre_hook(state):
       """Optimiere Context-Size."""
       if len(state["messages"]) > 50:
           return summarize_old_messages(state)
       return state
   ```

2. **Post-Hook für Guardrails**
   ```python
   def post_hook(state, response):
       """Multi-Layer Safety."""
       # Layer 1: Content Moderation
       if is_unsafe(response):
           return {"blocked": True}

       # Layer 2: Fact-Check
       if needs_verification(response):
           return interrupt("Verify facts before proceeding")

       return {"response": response}
   ```

3. **Kombination mit Human-in-Loop**
   ```python
   def post_hook(state, response):
       """Human Review für kritische Aktionen."""
       if response.tool_calls:
           for call in response.tool_calls:
               if call.name in ["delete_database", "send_email"]:
                   return interrupt(f"Approve tool call: {call.name}?")
       return {"response": response}
   ```

---

## 🚀 Complete Example: Multi-Agent Research System

```python
from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.types import interrupt, Command

# 1. State Definition mit TypedDict
class ResearchState(TypedDict):
    messages: Annotated[list, add_messages]
    topic: str
    research_data: str
    report: str
    approved: bool

# 2. Nodes definieren
def supervisor(state: ResearchState) -> Command:
    """Supervisor entscheidet über nächsten Schritt."""
    if not state.get("research_data"):
        return Command(goto="researcher")
    elif not state.get("report"):
        return Command(goto="writer")
    elif not state.get("approved"):
        return Command(goto="approval")
    return Command(goto=END)

def researcher(state: ResearchState) -> ResearchState:
    """Research Agent sammelt Daten."""
    topic = state["topic"]
    # Simuliere Research
    data = f"Research data about {topic}..."
    return {"research_data": data}

def writer(state: ResearchState) -> ResearchState:
    """Writer Agent erstellt Report."""
    data = state["research_data"]
    report = f"Report based on: {data}"
    return {"report": report}

def approval(state: ResearchState) -> ResearchState:
    """Human-in-the-Loop Approval."""
    report = state["report"]
    approved = interrupt(f"Approve this report?\n{report}\n(yes/no)")
    return {"approved": approved == "yes"}

# 3. Graph mit Conditional Routing
graph_builder = StateGraph(ResearchState)

graph_builder.add_node("supervisor", supervisor)
graph_builder.add_node("researcher", researcher)
graph_builder.add_node("writer", writer)
graph_builder.add_node("approval", approval)

graph_builder.add_edge(START, "supervisor")
graph_builder.add_edge("researcher", "supervisor")
graph_builder.add_edge("writer", "supervisor")
graph_builder.add_edge("approval", "supervisor")

# 4. Checkpointing für Persistenz
checkpointer = SqliteSaver.from_conn_string("research.db")
graph = graph_builder.compile(checkpointer=checkpointer)

# 5. Workflow mit Streaming ausführen
config = {"configurable": {"thread_id": "research-session-1"}}
initial_state = {"topic": "LangGraph Best Practices"}

try:
    for event in graph.stream(initial_state, config, stream_mode="updates"):
        print(f"Update: {event}")
except GraphInterrupt as e:
    print(f"Waiting for approval: {e.message}")

    # User gibt Feedback
    user_input = input("Your decision: ")

    # Resume mit Command
    result = graph.invoke(Command(resume=user_input), config)
    print(f"Final result: {result}")
```

---

## 📚 Import-Cheatsheet

```python
# Core
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from typing import TypedDict, Annotated

# Checkpointing
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.sqlite import SqliteSaver

# Human-in-the-Loop
from langgraph.types import interrupt, Command
from langgraph.errors import GraphInterrupt

# Integration mit LangChain Agents
from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from langchain_core.tools import tool
```

---

## ⚠️ Migration von LangChain zu LangGraph

### Wann migrieren?

- ✅ Multi-Step Workflows mit Verzweigungen
- ✅ Multi-Agent-Systeme (>2 Agents)
- ✅ Langlebige Sessions (>1 Stunde)
- ✅ Human-in-the-Loop mit erweiterten Features
- ✅ State Persistence erforderlich

### Migration-Checkliste

- [ ] State als TypedDict definieren
- [ ] Agent-Logik in Nodes umwandeln
- [ ] Conditional Routing für Verzweigungen
- [ ] Checkpointer hinzufügen (SQLite/Postgres)
- [ ] Interrupt-Punkte für Human-in-the-Loop
- [ ] Stream Modes für Monitoring
- [ ] Tests für einzelne Nodes schreiben
- [ ] **Graph nach `compile()` visualisieren** (`draw_mermaid_png()`)
- [ ] `config_schema` → `context_schema` ersetzen (deprecated seit v1.0)
- [ ] `langgraph.prebuilt` Imports → `langchain.agents` migrieren

### ⚠️ Deprecated APIs (ab v1.0)

| Deprecated | Ersatz | Status |
|-----------|--------|--------|
| `config_schema` Parameter in `StateGraph` | `context_schema` | Deprecation-Warning, Entfernung in v2.0 |
| `langgraph.prebuilt.create_react_agent` | `langchain.agents.create_react_agent` / `create_agent` | Deprecation-Warning, Entfernung in v2.0 |
| `langgraph.prebuilt.AgentState` | `langchain.agents.AgentState` | Deprecation-Warning, Entfernung in v2.0 |
| `raise NodeInterrupt()` | `interrupt()` Funktion | Deprecation-Warning |

```python
# ❌ ALT (deprecated)
graph = StateGraph(MyState, config_schema=ConfigSchema)

# ✅ NEU (v1.0+)
graph = StateGraph(MyState, context_schema=ContextSchema)
```

---

## 🎯 Best Practices Zusammenfassung

### 1. State Design
- ✅ **TypedDict** für LangGraph State (Performance)
- ✅ **Pydantic** für Input/Output-Validierung
- ✅ **Minimal State**: Nur nötige Daten im State
- ✅ **Reducer**: `add_messages` für Message-Akkumulation

### 2. Workflow-Design
- ✅ **Kleine Nodes**: Eine Verantwortung pro Node
- ✅ **Conditional Routing**: Statt viele kleine Edges
- ✅ **Subgraphs**: Für >5 Nodes gruppieren
- ✅ **Error Handling**: Dedicated Error-Nodes
- ✅ **Graph-Visualisierung**: Direkt nach `compile()` mit `draw_mermaid_png()`

### 3. Production-Ready
- ✅ **Checkpointing**: Immer in Production
- ✅ **Stream Modes**: Für Monitoring
- ✅ **Thread-IDs**: User/Session-spezifisch
- ✅ **Testing**: Nodes isoliert testen
- ✅ **Recursion Limit**: Explizit setzen (Default geändert in v1.0.6)
- ✅ **Python**: Minimum 3.10+ (3.13 kompatibel, 3.9 abgekündigt)

### 4. Human-in-the-Loop
- ✅ **`interrupt()`** verwenden (nicht `NodeInterrupt`)
- ✅ **Konsistente Reihenfolge** der Interrupts
- ✅ **Command-Object** für Resume
- ✅ **Approval Gates** für kritische Aktionen

---

## 📖 Weitere Ressourcen

- **LangGraph Docs**: https://langchain-ai.github.io/langgraph/
- **LangGraph Changelog**: https://changelog.langchain.com/ (Node Caching, Deferred Nodes, Hooks)
- **Multi-Agent Tutorial**: https://langchain-ai.github.io/langgraph/tutorials/multi_agent/
- **Checkpointing Guide**: https://langchain-ai.github.io/langgraph/concepts/persistence/
- **Human-in-the-Loop**: https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/
- **LangGraph Studio**: Visuelle Debugging-Umgebung

---

**Version:** 1.4
**Letzte Aktualisierung:** März 2026 (LangGraph v1.0.10 / langgraph-prebuilt v1.0.8)
**Autor:** GenAI Projekt Team

**Changelog v1.4 (März 2026):**
- 🆕 **ToolRuntime** dokumentiert (Must-Have #6) — Dependency Injection des vollständigen Laufzeit-Kontexts in Tools via `ToolNode` (langgraph-prebuilt 1.0.8)
- ✅ Vergleichstabelle: ToolRuntime-Felder und Wann-verwenden-Empfehlung

**Changelog v1.3 (März 2026):**
- ✅ **Graph-Visualisierung** in Section 2 dokumentiert: `draw_mermaid_png()` direkt nach `compile()` (PFLICHT)
- ✅ Migration-Checkliste und Best Practices Zusammenfassung ergänzt

**Changelog v1.2 (Februar 2026):**
- ✅ **Deprecated APIs** Sektion hinzugefügt (`config_schema` → `context_schema`, `langgraph.prebuilt` → `langchain.agents`)
- ✅ **Default Recursion Limit** Hinweis: Ab v1.0.6 geändert - explizites Setzen in Notebooks empfohlen
- ✅ **Python 3.13** Kompatibilität bestätigt, Python 3.9 abgekündigt (Minimum: 3.10+)
- ✅ Veraltete v0.x Referenzen auf v1.0 aktualisiert
- ✅ Migration-Checkliste erweitert

**Changelog v1.1 (Dezember 2025):**
- ✅ **Node Caching** dokumentiert - Performance-Optimierung
- ✅ **Deferred Nodes** dokumentiert - Map-Reduce & Consensus
- ✅ **Pre/Post Model Hooks** dokumentiert - Guardrails & Context-Management
- ✅ **Multiple Interrupt Resume** dokumentiert - Parallele Tool Calls
- ✅ **Security Hardening** für Checkpointers
- ✅ **LangGraph 1.0 GA** Features integriert (Oktober 2025)

---

> 💡 **Tipp:** Starte mit einfachen `create_agent()` Workflows und migriere zu LangGraph, wenn Komplexität steigt!
