# LangGraph Standards & Best Practices

> **Workflow-Patterns für komplexe Multi-Agent-Systeme**

Dieses Dokument definiert die **7 Standard-Patterns** für LangGraph 1.0+, die bei der Entwicklung komplexer Multi-Agent-Systeme und State Machines in diesem Projekt verwendet werden sollten.

---

## 🎯 Wann LangGraph verwenden?

| Use Case | LangChain `create_agent()` | LangGraph |
|----------|---------------------------|-----------|
| **Einfacher Agent** mit Tools | ✅ Empfohlen | ⚠️ Overkill |
| **Multi-Step Workflows** mit Bedingungen | ⚠️ Begrenzt | ✅ Empfohlen |
| **Multi-Agent-Systeme** (Supervisor, Hierarchie) | ❌ Nicht möglich | ✅ Erforderlich |
| **Langlebige Sessions** mit Checkpointing | ❌ Nicht möglich | ✅ Erforderlich |
| **Human-in-the-Loop** (erweitert) | ⚠️ Basic (via Middleware) | ✅ Advanced |
| **Conditional Routing** | ❌ Nicht möglich | ✅ Erforderlich |
| **State Persistence** über Tage/Wochen | ❌ Nicht möglich | ✅ Erforderlich |

**Faustregel:**
- ✅ **LangChain** für einfache, lineare Agent-Tasks
- ✅ **LangGraph** für komplexe, verzweigte Workflows und Multi-Agent-Systeme

---

## 📋 Übersicht der 7 Standard-Patterns

| # | Pattern | Zweck | Use Case |
|---|---------|-------|----------|
| 1 | StateGraph mit TypedDict | Type-safe State Management | Alle Workflows |
| 2 | Nodes & Edges | Workflow-Definition | Alle Workflows |
| 3 | Conditional Routing | Dynamische Entscheidungen | Verzweigte Logik |
| 4 | Checkpointing & Memory | Persistenz & Recovery | Langlebige Sessions |
| 5 | Human-in-the-Loop (erweitert) | Interrupt & Resume | Kritische Entscheidungen |
| 6 | Subgraphs & Multi-Agent | Modulare Systeme | Komplexe Workflows |
| 7 | Stream Modes | Debugging & Monitoring | Production-Ready Apps |

---

## 1️⃣ StateGraph mit TypedDict - Type-Safe State Management

### ✅ Standard Pattern

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

### 💡 Warum verwenden wir das?

**Type-Safety:**
- Fehler werden zur Entwicklungszeit erkannt, nicht zur Laufzeit
- IDE-Unterstützung mit Autocomplete und IntelliSense
- Reduziert Debugging-Zeit erheblich

**Reducer-Support:**
- `add_messages` akkumuliert Messages automatisch
- Keine manuelle List-Concatenation mehr
- Konsistentes Message-Handling über alle Nodes

**Performance:**
- TypedDict ist Teil der Python-Standardbibliothek
- Kein Runtime-Overhead (im Gegensatz zu Pydantic)
- Perfekt für interne State Machines

### 📦 TypedDict vs. Pydantic

| Kriterium | TypedDict (empfohlen für State) | Pydantic BaseModel |
|-----------|--------------------------------|-------------------|
| **Performance** | ✅ Schnell (kein Overhead) | ⚠️ Langsamer (Validation) |
| **Use Case** | Interne State Machines | API Boundaries, User Input |
| **Validation** | ❌ Keine Runtime-Validation | ✅ Strikte Validation |
| **LangGraph Empfehlung** | ✅ **Für Graph State** | ⚠️ Nur für Input/Output |

```python
# ✅ Best Practice: TypedDict für Graph State
class GraphState(TypedDict):
    messages: Annotated[list, add_messages]
    context: dict

# ✅ Pydantic für User Input/Output
from pydantic import BaseModel
class UserInput(BaseModel):
    query: str
    temperature: float = 0.7
```

---

## 2️⃣ Nodes & Edges - Workflow-Definition

### ✅ Standard Pattern

#### **Nodes** = Funktionen, die State transformieren

```python
def agent_node(state: AgentState) -> AgentState:
    """Ein Node ist eine Funktion, die State empfängt und transformiert."""
    messages = state["messages"]
    response = llm.invoke(messages)
    return {"messages": [response]}

def tool_node(state: AgentState) -> AgentState:
    """Tool-Ausführung als Node."""
    last_message = state["messages"][-1]
    tool_result = execute_tool(last_message.tool_calls[0])
    return {"messages": [tool_result]}
```

#### **Edges** = Verbindungen zwischen Nodes

```python
from langgraph.graph import StateGraph, START, END

graph = StateGraph(AgentState)

# Nodes hinzufügen
graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)

# Edges definieren
graph.add_edge(START, "agent")       # Start → agent
graph.add_edge("tools", "agent")      # tools → agent (Loop möglich)
graph.add_edge("agent", END)          # agent → END
```

### 💡 Warum verwenden wir das?

**Klarheit:**
- Workflow ist visuell verständlich als Directed Graph
- Jeder Node hat eine klar definierte Aufgabe
- Einfach zu dokumentieren und zu kommunizieren

**Testbarkeit:**
- Nodes sind isolierte Funktionen
- Unit-Tests für einzelne Nodes möglich
- Mocking von Dependencies einfach

**Wiederverwendbarkeit:**
- Nodes können in mehreren Workflows verwendet werden
- Shared Node-Libraries für häufige Operationen
- Komposition von Sub-Workflows

---

## 3️⃣ Conditional Routing - Dynamische Entscheidungen

### ✅ Standard Pattern

```python
def should_continue(state: AgentState) -> str:
    """Routing-Funktion: Entscheidet zur Laufzeit, welcher Node als nächstes kommt."""
    messages = state["messages"]
    last_message = messages[-1]

    # Entscheidungslogik
    if last_message.tool_calls:
        return "tools"  # Agent will Tool aufrufen
    return END  # Agent ist fertig

# Conditional Edge hinzufügen
graph.add_conditional_edges(
    "agent",            # Von welchem Node
    should_continue,    # Routing-Funktion
    {
        "tools": "tools",  # Wenn "tools" → zum tools-Node
        END: END           # Wenn END → Workflow beenden
    }
)
```

### 💡 Warum verwenden wir das?

**Dynamische Workflows:**
- Pfad wird zur Laufzeit basierend auf State entschieden
- Keine statischen, vorhersehbaren Abläufe mehr
- Echte Intelligenz im Routing

**Komplexe Logik:**
- Beliebige Python-Bedingungen möglich
- Zugriff auf vollständigen State
- Multi-Way Routing unterstützt

**Fehlerbehandlung:**
- Routing zu Error-Handling-Nodes
- Retry-Logik durch Loop-Edges
- Graceful Degradation möglich

### 📦 Advanced: Multi-Way Routing

```python
def route_to_specialists(state: AgentState) -> list[str]:
    """Routing zu mehreren Nodes parallel."""
    task_type = state["task_type"]

    if task_type == "research":
        return ["web_search", "database_query"]  # Beide parallel
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

### ✅ Standard Pattern

```python
from langgraph.checkpoint.memory import InMemorySaver
# from langgraph.checkpoint.postgres import PostgresSaver  # Production

# Checkpointing aktivieren
checkpointer = InMemorySaver()  # Für Development
# checkpointer = PostgresSaver(conn_string)  # Für Production

graph = graph_builder.compile(
    checkpointer=checkpointer  # Checkpoint-Support aktivieren
)

# Session mit eindeutiger ID
thread_id = "user-123-session-456"

# Workflow starten
config = {"configurable": {"thread_id": thread_id}}
result = graph.invoke({"messages": [...]}, config=config)

# Bei erneutem Aufruf: State wird automatisch geladen!
result2 = graph.invoke({"messages": [...]}, config=config)
```

### 💡 Warum verwenden wir das?

**Persistenz über Sessions:**
- State überlebt Server-Restarts
- Nutzer können Konversation später fortsetzen
- Wichtig für langlebige Chat-Apps

**Crash Recovery:**
- Bei Fehler kann Workflow an letztem Checkpoint weitermachen
- Keine verlorene Arbeit bei Infrastruktur-Problemen
- Reliability in Production

**Debugging:**
- State-Historie ist vollständig nachvollziehbar
- Time-Travel-Debugging möglich
- Reproduzierbare Fehler

### 📦 Checkpoint-Backends

| Backend | Use Case | Persistenz |
|---------|----------|------------|
| `InMemorySaver` | Development, Tests | ❌ Nur im Memory |
| `PostgresSaver` | Production (Single Server) | ✅ Datenbank |
| `RedisSaver` | Production (Distributed) | ✅ Redis Cluster |

```python
# Development
from langgraph.checkpoint.memory import InMemorySaver
checkpointer = InMemorySaver()

# Production
from langgraph.checkpoint.postgres import PostgresSaver
checkpointer = PostgresSaver("postgresql://...")
```

---

## 5️⃣ Human-in-the-Loop (erweitert) - Interrupt & Resume

### ✅ Standard Pattern

```python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import InMemorySaver

def approval_node(state: AgentState) -> AgentState:
    """Node, der auf menschliche Bestätigung wartet."""
    return state  # Pausiert hier automatisch

graph = StateGraph(AgentState)
graph.add_node("agent", agent_node)
graph.add_node("approval", approval_node)  # Human-in-Loop Node
graph.add_node("execute", execute_node)

# Workflow: agent → approval → execute
graph.add_edge("agent", "approval")
graph.add_edge("approval", "execute")
graph.add_edge("execute", END)

# Checkpointing ERFORDERLICH für Interrupt/Resume!
graph = graph.compile(
    checkpointer=InMemorySaver(),
    interrupt_before=["approval"]  # Pausiere vor diesem Node
)

# 1. Workflow starten
config = {"configurable": {"thread_id": "session-123"}}
result = graph.invoke({"messages": [...]}, config=config)

# 2. Nutzer reviewed und approved
# ... Zeit vergeht ...

# 3. Workflow fortsetzen
result = graph.invoke(None, config=config)  # Macht an Checkpoint weiter!
```

### 💡 Warum verwenden wir das?

**Erweiterte Kontrolle:**
- Nutzer kann kritische Entscheidungen überprüfen
- Bessere Erfahrung als einfaches Tool-Approval
- Workflow kann Stunden/Tage pausiert sein

**Compliance:**
- Auditable Decision-Points
- Menschliche Oversight für sensible Operationen
- Erfüllung von Regulatory Requirements

**Flexibilität:**
- Interrupts an beliebigen Nodes möglich
- State kann während Pause modifiziert werden
- Multiple Human-in-Loop-Points im Workflow

### 📦 Interrupt-Strategien

```python
# Interrupt BEFORE Node
graph.compile(interrupt_before=["approval", "execute"])

# Interrupt AFTER Node
graph.compile(interrupt_after=["agent"])

# Programmatisch während Node
def conditional_interrupt_node(state: AgentState):
    if state["needs_review"]:
        # Signal zum Interrupt
        return {"__interrupt__": True}
    return state
```

---

## 6️⃣ Subgraphs & Multi-Agent - Modulare Systeme

### ✅ Standard Pattern

#### **Subgraph:** Wiederverwendbarer Workflow

```python
# Subgraph: RAG-Workflow
def create_rag_subgraph():
    subgraph = StateGraph(AgentState)

    subgraph.add_node("retrieve", retrieve_documents)
    subgraph.add_node("rerank", rerank_documents)
    subgraph.add_node("generate", generate_answer)

    subgraph.add_edge("retrieve", "rerank")
    subgraph.add_edge("rerank", "generate")

    return subgraph.compile()

# Hauptgraph
main_graph = StateGraph(AgentState)
rag_workflow = create_rag_subgraph()

main_graph.add_node("rag", rag_workflow)  # Subgraph als Node!
main_graph.add_edge(START, "rag")
main_graph.add_edge("rag", END)
```

#### **Multi-Agent:** Mehrere spezialisierte Agents

```python
# Supervisor-Pattern
def supervisor_node(state: AgentState) -> AgentState:
    """Supervisor entscheidet, welcher Worker-Agent zuständig ist."""
    task = state["task"]

    # Route zu spezialisiertem Agent
    if "code" in task:
        next_agent = "code_agent"
    elif "research" in task:
        next_agent = "research_agent"
    else:
        next_agent = "general_agent"

    return {"next_agent": next_agent}

def routing_logic(state: AgentState) -> str:
    return state["next_agent"]

graph = StateGraph(AgentState)

# Supervisor
graph.add_node("supervisor", supervisor_node)

# Specialized Workers
graph.add_node("code_agent", code_agent_node)
graph.add_node("research_agent", research_agent_node)
graph.add_node("general_agent", general_agent_node)

# Routing
graph.add_edge(START, "supervisor")
graph.add_conditional_edges(
    "supervisor",
    routing_logic,
    {
        "code_agent": "code_agent",
        "research_agent": "research_agent",
        "general_agent": "general_agent"
    }
)

# Workers → Supervisor (Loop)
graph.add_edge("code_agent", "supervisor")
graph.add_edge("research_agent", "supervisor")
graph.add_edge("general_agent", END)
```

### 💡 Warum verwenden wir das?

**Modularität:**
- Subgraphs sind wiederverwendbare Workflow-Komponenten
- Einfach zu testen und zu warten
- Shared Libraries für häufige Patterns

**Spezialisierung:**
- Verschiedene Agents für verschiedene Aufgaben
- Bessere Performance durch Task-spezifische Optimierung
- Separation of Concerns

**Skalierbarkeit:**
- Parallele Ausführung mehrerer Agents
- Load Balancing zwischen Workers
- Horizontale Skalierung

### 📦 Multi-Agent Patterns

| Pattern | Struktur | Use Case |
|---------|----------|----------|
| **Supervisor** | 1 Supervisor → N Workers | Task-Routing, Load Balancing |
| **Hierarchical** | Manager → Team Leads → Workers | Komplexe Organisationsstrukturen |
| **Collaborative** | Agents kommunizieren peer-to-peer | Brainstorming, Consensus-Finding |

---

## 7️⃣ Stream Modes - Debugging & Monitoring

### ✅ Standard Pattern

```python
# 1. Values Mode: Nur finale State-Updates
for output in graph.stream({"messages": [...]}, stream_mode="values"):
    print(output["messages"][-1].content)

# 2. Updates Mode: Deltas zwischen Nodes
for output in graph.stream({"messages": [...]}, stream_mode="updates"):
    for node_name, node_output in output.items():
        print(f"Node '{node_name}' updated: {node_output}")

# 3. Debug Mode: Vollständige Event-History
for output in graph.stream({"messages": [...]}, stream_mode="debug"):
    print(f"Event: {output['type']}, Node: {output['node']}")
    print(f"State: {output['state']}")

# 4. Messages Mode: Nur AIMessage-Chunks (für UI)
for chunk in graph.stream({"messages": [...]}, stream_mode="messages"):
    print(chunk.content, end="", flush=True)
```

### 💡 Warum verwenden wir das?

**Debugging:**
- `debug` Mode zeigt vollständige Event-Timeline
- Verstehe, welche Nodes in welcher Reihenfolge ausgeführt werden
- Identifiziere Bottlenecks und Fehlerquellen

**Monitoring:**
- Production-Apps können Stream-Events loggen
- Echtzeit-Einblick in laufende Workflows
- Performance-Metriken pro Node

**User Experience:**
- `messages` Mode für Streaming-UI (wie ChatGPT)
- Nutzer sieht Antwort in Echtzeit
- Besseres Gefühl für Agent-Arbeit

### 📦 Stream Modes im Überblick

| Mode | Output | Use Case |
|------|--------|----------|
| `values` | Finale State-Updates | Production: Nur Ergebnis wichtig |
| `updates` | Deltas zwischen Nodes | Debugging: Was hat jeder Node geändert? |
| `debug` | Vollständige Events | Development: Tiefes Debugging |
| `messages` | Nur AIMessage-Chunks | UI: Streaming-Antworten |

---

## 🚀 Quick Start: Komplettes Minimal-Beispiel

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import InMemorySaver

# 1. State definieren (Pattern #1)
class ChatState(TypedDict):
    messages: Annotated[list, add_messages]

# 2. Nodes definieren (Pattern #2)
def agent_node(state: ChatState) -> ChatState:
    from langchain.chat_models import init_chat_model
    llm = init_chat_model("gpt-4o-mini", model_provider="openai")
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

# 3. Graph erstellen
graph = StateGraph(ChatState)
graph.add_node("agent", agent_node)
graph.add_edge(START, "agent")
graph.add_edge("agent", END)

# 4. Checkpointing aktivieren (Pattern #4)
checkpointer = InMemorySaver()
app = graph.compile(checkpointer=checkpointer)

# 5. Workflow ausführen
config = {"configurable": {"thread_id": "session-1"}}
result = app.invoke(
    {"messages": [{"role": "user", "content": "Hallo!"}]},
    config=config
)

print(result["messages"][-1].content)
```

---

## 📚 Import-Cheatsheet

```python
# Core
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated

# Message Reducers
from langgraph.graph.message import add_messages

# Checkpointing
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.checkpoint.redis import RedisSaver

# Streaming
# stream_mode="values"|"updates"|"debug"|"messages"

# Integration mit LangChain
from langchain.chat_models import init_chat_model
from langchain_core.tools import tool
from langchain.agents import create_agent  # Kann in LangGraph eingebettet werden
```

---

## 🔗 Multi-Agent Patterns (Deep Dive)

### Supervisor Pattern

```python
def create_supervisor_workflow():
    """Ein Supervisor routet Tasks zu spezialisierten Workers."""

    class SupervisorState(TypedDict):
        messages: Annotated[list, add_messages]
        next_worker: str
        task_complete: bool

    def supervisor_node(state):
        # Supervisor entscheidet basierend auf Task
        task = state["messages"][-1].content
        if "code" in task.lower():
            return {"next_worker": "coder"}
        elif "research" in task.lower():
            return {"next_worker": "researcher"}
        return {"next_worker": "end", "task_complete": True}

    def coder_node(state):
        # Spezialisierter Coder-Agent
        response = coder_agent.invoke(state["messages"])
        return {"messages": [response], "task_complete": True}

    def researcher_node(state):
        # Spezialisierter Research-Agent
        response = researcher_agent.invoke(state["messages"])
        return {"messages": [response], "task_complete": True}

    def routing_logic(state):
        if state.get("task_complete"):
            return END
        return state["next_worker"]

    graph = StateGraph(SupervisorState)
    graph.add_node("supervisor", supervisor_node)
    graph.add_node("coder", coder_node)
    graph.add_node("researcher", researcher_node)

    graph.add_edge(START, "supervisor")
    graph.add_conditional_edges(
        "supervisor",
        routing_logic,
        {"coder": "coder", "researcher": "researcher", END: END}
    )
    graph.add_edge("coder", "supervisor")  # Loop back
    graph.add_edge("researcher", "supervisor")  # Loop back

    return graph.compile()
```

---

## ⚠️ Anti-Patterns & Häufige Fehler

### ❌ Anti-Pattern 1: Untypisierter State (dict statt TypedDict)

**Problem:**
```python
# Untypisierter State
graph = StateGraph(dict)  # ⚠️ Keine Type-Safety!

def node(state):  # Welche Keys gibt es in state?
    messages = state["mesages"]  # Typo! Runtime-Error
    return {"messages": [...]}
```

**Warum problematisch:**
- Typos in Key-Namen werden erst zur Laufzeit entdeckt
- Keine IDE-Unterstützung (Autocomplete)
- Schwer zu maintainen bei großen Workflows

**Lösung:**
```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class AgentState(TypedDict):  # ✅ Type-Safe!
    messages: Annotated[list, add_messages]
    user_id: str
    step: int

graph = StateGraph(AgentState)

def node(state: AgentState) -> AgentState:
    messages = state["messages"]  # IDE zeigt Autocomplete!
    return {"messages": [...]}
```

---

### ❌ Anti-Pattern 2: Fehlende Cycles-Prevention

**Problem:**
```python
# Graph mit möglichem Endlos-Loop
graph.add_edge("agent", "tools")
graph.add_edge("tools", "agent")  # ⚠️ Kann endlos loopen!

# Keine Max-Iterations
app = graph.compile()
app.invoke({"messages": [...]})  # Kann hängen bleiben!
```

**Warum problematisch:**
- Bei Fehlern in Routing-Logik: Endlos-Loops
- Kosten explodieren
- Server hängt sich auf

**Lösung:**
```python
# 1. Recursion Limit setzen
from langgraph.graph import StateGraph

app = graph.compile(
    recursion_limit=20  # ✅ Max 20 Node-Executions
)

# 2. Conditional Routing mit END
def should_continue(state: AgentState) -> str:
    # Prüfe Abbruchbedingung
    if state["step"] > 10:
        return END  # ✅ Erzwinge Abbruch nach 10 Steps

    if state["messages"][-1].tool_calls:
        return "tools"
    return END

graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
```

---

### ❌ Anti-Pattern 3: Kein Checkpointing in Production

**Problem:**
```python
# Kein Checkpointing
app = graph.compile()  # ⚠️ State verloren bei Crash!

# Bei Server-Neustart oder Error: Alles weg
app.invoke({"messages": [...]})
```

**Warum problematisch:**
- Bei Crash: Nutzer muss von vorne beginnen
- Langlebige Workflows (>10 Min) riskant
- Schlechte User Experience

**Lösung:**
```python
from langgraph.checkpoint.postgres import PostgresSaver
# from langgraph.checkpoint.memory import InMemorySaver  # Nur Dev!

# Production: Persistentes Checkpointing
checkpointer = PostgresSaver("postgresql://user:pass@host/db")

app = graph.compile(
    checkpointer=checkpointer  # ✅ State überlebt Crashes!
)

# Session-basierter Zugriff
config = {"configurable": {"thread_id": "user-123"}}
app.invoke({"messages": [...]}, config=config)

# Bei erneutem Aufruf: State wird geladen
app.invoke({"messages": [...]}, config=config)  # Macht weiter!
```

---

### ❌ Anti-Pattern 4: Fehlende Error-Handling in Nodes

**Problem:**
```python
def risky_node(state: AgentState) -> AgentState:
    """Node ohne Error-Handling."""
    result = call_external_api()  # ⚠️ Kann fehlschlagen!
    return {"messages": [result]}

# Bei API-Fehler: Ganzer Workflow bricht ab
```

**Warum problematisch:**
- Externe Services (APIs, DBs) können ausfallen
- Workflow hat keine Chance zu recovern
- Schlechte UX

**Lösung:**
```python
def safe_node(state: AgentState) -> AgentState:
    """Node mit Error-Handling."""
    try:
        result = call_external_api()
        return {"messages": [result]}
    except APIError as e:
        # ✅ Fallback: Fehler-Message für nächsten Node
        error_msg = f"API-Fehler: {str(e)}. Versuche Alternative..."
        return {"messages": [error_msg], "error": True}
    except TimeoutError:
        return {"messages": ["Timeout. Retry später."], "error": True}

# Routing kann auf Error reagieren
def handle_errors(state: AgentState) -> str:
    if state.get("error"):
        return "error_handler"  # Route zu Error-Node
    return "next_node"

graph.add_conditional_edges("safe_node", handle_errors)
```

---

### ❌ Anti-Pattern 5: Ungetestete Routing-Logik

**Problem:**
```python
# Komplexe Routing-Logik ohne Tests
def complex_routing(state: AgentState) -> str:
    if state["count"] > 10 and state["flag"] or not state["ready"]:
        return "node_a"
    return "node_b"

# ⚠️ Was passiert bei Edge Cases?
```

**Warum problematisch:**
- Routing-Bugs sind schwer zu debuggen
- Workflow nimmt unerwartete Pfade
- Production-Probleme erst spät sichtbar

**Lösung:**
```python
# 1. Unit Tests für Routing-Funktionen
def test_complex_routing():
    # Test Case 1: Normal
    state = {"count": 5, "flag": True, "ready": True}
    assert complex_routing(state) == "node_b"

    # Test Case 2: High count
    state = {"count": 15, "flag": True, "ready": True}
    assert complex_routing(state) == "node_a"

    # Test Case 3: Edge Case
    state = {"count": 10, "flag": False, "ready": False}
    assert complex_routing(state) == "node_a"

# 2. Stream Mode "debug" verwenden
for event in app.stream(inputs, stream_mode="debug"):
    print(f"Routing von {event['node']} nach {event['next']}")
    # Verifiziere erwartete Pfade
```

---

## 🧪 Testing Best Practices

### Unit Tests für Nodes

```python
# tests/test_nodes.py
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class TestState(TypedDict):
    messages: Annotated[list, add_messages]
    count: int

def agent_node(state: TestState) -> TestState:
    """Test-Node: Erhöht Counter."""
    return {"count": state["count"] + 1}

def test_agent_node():
    """Test: Node erhöht Counter korrekt."""
    initial_state = {"messages": [], "count": 5}
    result = agent_node(initial_state)

    assert result["count"] == 6

def test_agent_node_with_messages():
    """Test: Node behält Messages bei."""
    from langchain_core.messages import HumanMessage

    initial_state = {
        "messages": [HumanMessage(content="Test")],
        "count": 0
    }
    result = agent_node(initial_state)

    # Messages-Reducer: Alte bleiben erhalten
    assert len(result.get("messages", [])) == 0  # Node ändert Messages nicht
    assert result["count"] == 1
```

---

### Integration Tests für Workflows

```python
# tests/test_workflow.py
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver

def test_simple_workflow():
    """Test: End-to-End Workflow."""

    class SimpleState(TypedDict):
        value: int

    def add_one(state: SimpleState) -> SimpleState:
        return {"value": state["value"] + 1}

    def multiply_two(state: SimpleState) -> SimpleState:
        return {"value": state["value"] * 2}

    # Graph aufbauen
    graph = StateGraph(SimpleState)
    graph.add_node("add", add_one)
    graph.add_node("multiply", multiply_two)
    graph.add_edge(START, "add")
    graph.add_edge("add", "multiply")
    graph.add_edge("multiply", END)

    app = graph.compile()

    # Test
    result = app.invoke({"value": 5})
    # 5 + 1 = 6, 6 * 2 = 12
    assert result["value"] == 12

def test_conditional_workflow():
    """Test: Conditional Routing funktioniert."""

    class CondState(TypedDict):
        value: int
        route: str

    def router(state: CondState) -> str:
        return "high" if state["value"] > 10 else "low"

    def high_node(state: CondState) -> CondState:
        return {"route": "took_high_path"}

    def low_node(state: CondState) -> CondState:
        return {"route": "took_low_path"}

    graph = StateGraph(CondState)
    graph.add_node("high", high_node)
    graph.add_node("low", low_node)

    graph.add_conditional_edges(
        START,
        router,
        {"high": "high", "low": "low"}
    )
    graph.add_edge("high", END)
    graph.add_edge("low", END)

    app = graph.compile()

    # Test 1: High Path
    result = app.invoke({"value": 15})
    assert result["route"] == "took_high_path"

    # Test 2: Low Path
    result = app.invoke({"value": 5})
    assert result["route"] == "took_low_path"
```

---

### Checkpointing Tests

```python
def test_checkpointing_persistence():
    """Test: State bleibt über mehrere Invocations erhalten."""
    from langgraph.checkpoint.memory import InMemorySaver

    checkpointer = InMemorySaver()

    # Graph mit Checkpoint
    app = graph.compile(checkpointer=checkpointer)

    config = {"configurable": {"thread_id": "test-session"}}

    # First call
    result1 = app.invoke({"messages": [{"role": "user", "content": "Hallo"}]}, config=config)
    assert len(result1["messages"]) > 0

    # Second call: State sollte geladen werden
    result2 = app.invoke({"messages": [{"role": "user", "content": "Wie geht's?"}]}, config=config)

    # Assert: Alte Messages sind noch da
    assert len(result2["messages"]) > len(result1["messages"])
```

---

## 🔒 Security Best Practices

### 1. State Sanitization (PII-Protection)

**Problem: Sensitive Daten im State**
```python
class UserState(TypedDict):
    messages: Annotated[list, add_messages]
    user_email: str  # ⚠️ PII!
    credit_card: str  # ⚠️ Hochsensibel!

# State wird in Checkpointer gespeichert (DB, Redis)
```

**Lösung: PII niemals im State**
```python
class SafeUserState(TypedDict):
    messages: Annotated[list, add_messages]
    user_id: str  # ✅ Nur ID, keine PII!

# Sensitive Daten in separater DB
def fetch_user_data(user_id: str):
    """Holt Nutzerdaten aus sicherer DB."""
    return db.get_user(user_id)  # Encrypted at rest

def node_with_sensitive_data(state: SafeUserState) -> SafeUserState:
    user_id = state["user_id"]
    user_data = fetch_user_data(user_id)  # Holt bei Bedarf

    # Verwende Daten, aber speichere NICHT im State
    result = process(user_data)

    return {"messages": [result]}  # Keine PII im Return!
```

---

### 2. Interrupt-based Authorization (Human-in-Loop)

**Sicherheitskritische Operationen genehmigen lassen:**
```python
class SecureState(TypedDict):
    messages: Annotated[list, add_messages]
    pending_action: str
    approved: bool

def request_approval(state: SecureState) -> SecureState:
    """Node pausiert für manuelle Genehmigung."""
    action = state["pending_action"]
    # State wird hier gespeichert, Workflow pausiert
    return state

def execute_action(state: SecureState) -> SecureState:
    """Nur ausgeführt wenn approved."""
    if not state.get("approved"):
        return {"messages": ["Aktion wurde nicht genehmigt."]}

    action = state["pending_action"]
    # Führe kritische Aktion aus
    result = execute_critical_operation(action)
    return {"messages": [f"Ausgeführt: {result}"]}

# Graph mit Interrupt
graph = StateGraph(SecureState)
graph.add_node("request_approval", request_approval)
graph.add_node("execute", execute_action)

graph.add_edge("request_approval", "execute")

app = graph.compile(
    checkpointer=checkpointer,
    interrupt_before=["execute"]  # ✅ Pausiert vor Ausführung!
)

# 1. User startet Workflow
config = {"configurable": {"thread_id": "session-123"}}
app.invoke({"pending_action": "delete_all_data"}, config=config)

# 2. Admin prüft und approved
# ... Zeit vergeht ...

# 3. Workflow fortsetzen mit Approval
app.invoke({"approved": True}, config=config)
```

---

### 3. Rate Limiting für Workflows

**Pro-User Limits:**
```python
from collections import defaultdict
from time import time

workflow_counts = defaultdict(list)

def rate_limited_invoke(user_id: str, inputs: dict):
    """Max 10 Workflows pro Stunde pro User."""
    now = time()
    hour_ago = now - 3600

    # Cleanup alte Einträge
    workflow_counts[user_id] = [
        ts for ts in workflow_counts[user_id]
        if ts > hour_ago
    ]

    # Check Limit
    if len(workflow_counts[user_id]) >= 10:
        raise ValueError(f"Rate limit: Max 10 Workflows/Stunde für User {user_id}")

    # Track
    workflow_counts[user_id].append(now)

    # Execute
    config = {"configurable": {"thread_id": f"{user_id}-{int(now)}"}}
    return app.invoke(inputs, config=config)
```

---

### 4. Secure Checkpointer Configuration

**Production Checkpointer mit Encryption:**
```python
from langgraph.checkpoint.postgres import PostgresSaver

# ❌ Unsicher: Plain-Text DB
checkpointer = PostgresSaver("postgresql://user:pass@host/db")

# ✅ Secure: Mit Encryption at Rest
checkpointer = PostgresSaver(
    connection_string="postgresql://user:pass@host/db",
    encryption_key=os.environ["DB_ENCRYPTION_KEY"]  # AES-256
)

# Zusätzlich: SSL-Verbindung zur DB
checkpointer = PostgresSaver(
    connection_string="postgresql://user:pass@host/db?sslmode=require"
)
```

---

### 5. Audit Logging für Workflows

**Alle Workflow-Executions loggen:**
```python
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

def audit_log_node(state: AgentState) -> AgentState:
    """Loggt Workflow-Execution für Compliance."""
    user_id = state.get("user_id", "unknown")
    action = state.get("action", "unknown")

    logger.info(f"[AUDIT] {datetime.now()} | User: {user_id} | Action: {action} | State: {state}")

    return state  # Pass-through

# Graph mit Audit-Node
graph.add_node("audit", audit_log_node)
graph.add_edge(START, "audit")  # Logge vor jedem Workflow
graph.add_edge("audit", "main_logic")

# Logs landen in audit.log (tamper-proof, encrypted)
```

---

## 📖 Weitere Ressourcen

- **Einsteiger-Guide:** [03_skript/kurs/Einsteiger_LangGraph.md](./03_skript/kurs/Einsteiger_LangGraph.md)
- **LangChain Standards:** [LangChain_Standards.md](./LangChain_Standards.md)
- **LangSmith Standards:** [LangSmith_Standards.md](./LangSmith_Standards.md)
- **Projekt CLAUDE.md:** Vollständige Projektinstruktionen
- **LangGraph Docs:** https://langchain-ai.github.io/langgraph/

---

**Version:** 2.0
**Letzte Aktualisierung:** November 2025
**Maintainer:** Agenten Projekt Team

---

> 💡 **Tipp:** LangGraph ist mächtig, aber komplex. Beginne mit einfachen Workflows und erweitere schrittweise!
