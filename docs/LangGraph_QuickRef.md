# LangGraph Quick Reference

> **Kompakte Übersicht der 7 wichtigsten Patterns + Anti-Patterns**
> 📖 Vollständige Dokumentation: [LangGraph_Standards_Full.md](./LangGraph_Standards_Full.md)

---

## ⚡ Die 7 MUST-HAVE Patterns

### 1. TypedDict State - Typsicherer State

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user_id: str
    step: int
```

---

### 2. StateGraph mit Nodes - Workflow-Basis

```python
from langgraph.graph import StateGraph, START, END

builder = StateGraph(AgentState)

def agent_node(state: AgentState) -> AgentState:
    response = llm.invoke(state["messages"])
    return {"messages": [response], "step": state["step"] + 1}

builder.add_node("agent", agent_node)
builder.add_edge(START, "agent")
builder.add_edge("agent", END)

graph = builder.compile()
```

---

### 3. Conditional Routing - Bedingte Verzweigungen

```python
def route_after_agent(state: AgentState) -> str:
    last_msg = state["messages"][-1]
    if getattr(last_msg, "tool_calls", None):
        return "tools"
    return END

builder.add_conditional_edges("agent", route_after_agent, {"tools": "tools", END: END})
builder.add_edge("tools", "agent")  # Loop zurück
```

---

### 4. Checkpointing - Sessions speichern

```python
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "session-123"}}
result = graph.invoke(initial_state, config)

# Später fortsetzen
result2 = graph.invoke(None, config)  # Setzt fort!
```

---

### 5. Human-in-Loop - Interrupt & Resume

```python
from langgraph.types import interrupt, Command

def approval_node(state: AgentState) -> AgentState:
    decision = interrupt("Aktion ausführen? yes/no")
    return {"approved": decision == "yes"}

builder.add_node("approval", approval_node)

# Später fortsetzen
result = graph.invoke(Command(resume="yes"), config)
```

---

### 6. Multi-Agent Pattern - Supervisor

```python
from langgraph.types import Command

def supervisor(state: AgentState) -> Command:
    task = state.get("task_type", "research")
    return Command(goto=f"{task}_agent")

builder.add_node("supervisor", supervisor)
builder.add_node("research_agent", research_node)
builder.add_node("writer_agent", writer_node)
builder.add_edge(START, "supervisor")
```

---

### 7. Streaming - Schrittweise Ausgaben

```python
for event in graph.stream(initial_state, config, stream_mode="updates"):
    print(event)  # Jeder Node-Output einzeln

# Andere Modi: "values" (vollständiger State), "messages" (nur neue Nachrichten)
```

---

## ⚠️ Top 5 Anti-Patterns

| # | Problem | Lösung |
|---|---------|--------|
| **1** | State ohne Type Hints | `TypedDict` mit vollständigen Typen |
| **2** | Fehlende Cycles-Prevention | `graph.compile(recursion_limit=20)` |
| **3** | Kein Checkpointing | `MemorySaver()` für Langlebige Sessions |
| **4** | Kein Error-Handling | Try-Except in jedem Node |
| **5** | Ungetestete Routing-Logik | Unit-Tests für Route-Functions |

---

## 🧪 Testing (Kurzform)

```python
def test_simple_workflow():
    result = graph.invoke({"messages": [], "user_id": "test", "step": 0})
    assert result["step"] == 1
    assert len(result["messages"]) > 0

def test_routing_logic():
    from langchain_core.messages import AIMessage
    from langchain_core.messages.tool import ToolCall

    state = {"messages": [AIMessage(content="", tool_calls=[ToolCall(...)])]}
    route = route_after_agent(state)
    assert route == "tools"
```

---

## 🔒 Security (Kurzform)

```python
# ✅ State Sanitization - Keine PII im State
class SafeState(TypedDict):
    user_id: str  # ✅ Nur ID, keine Email!
    session_id: str

# ✅ Interrupt-basierte Auth
def sensitive_action(state: SafeState):
    approved = interrupt("Admin-Genehmigung erforderlich")
    if not approved:
        raise PermissionError("Nicht genehmigt")

# ✅ Checkpointer Security
from langgraph.checkpoint.postgres import PostgresSaver
checkpointer = PostgresSaver(conn_string=DATABASE_URL)  # Encrypted DB
```

---

## 📚 Import-Cheatsheet

```python
# Core
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

# Multi-Agent
from langchain.agents import create_agent
```

---

## 🔗 Vollständige Dokumentation

📖 **Für Details siehe:** [LangGraph_Standards_Full.md](./LangGraph_Standards_Full.md)

**Inhalt Full Standards:**
- Ausführliche Erklärungen zu jedem Pattern
- Alle 5 Anti-Patterns mit Beispielen
- Komplette Testing-Sektion (Node-Tests, Workflow-Tests)
- Komplette Security-Sektion (State-Sanitization, Secure Checkpoints)
- Multi-Agent Patterns (Supervisor, Hierarchical, Collaborative)
- Komplettes 120-Zeilen-Beispiel

---

**Version:** 1.0
**Tokens:** ~2.000 (vs. 12.000 in Full)
**Letzte Aktualisierung:** November 2025
