---
layout: default
title: LangGraph Einsteiger
parent: Frameworks
nav_order: 2
description: "Multi-Agent-Systeme und Workflows mit LangGraph"
---

# 1 Kurzüberblick: Warum LangGraph?

LangChain bietet Modelle, Tools und einfache Agenten. LangGraph baut darauf auf und ermöglicht:
- **Abläufe in mehreren Schritten**
- **Bedingte Entscheidungswege**
- **Mehrere Agenten (Rollen)**
- **Sitzungen, die wieder aufgenommen werden können**
- **Human-in-the-Loop**

Ein Workflow besteht aus:
- **State:** zentrale Daten
- **Nodes:** Bearbeitungsschritte
- **Edges:** Ablaufsteuerung

Ein minimales Diagramm:

```
START → agent → END
```

Damit ist sofort klar: LangGraph strukturiert Workflows, anstatt alles in ein einzelnes LLM-Prompt zu packen.

---

# 2 Das kleinstmögliche funktionierende Beispiel

Der schnellste Weg zum Verständnis ist ein Mini-Workflow.

## 2.1 State definieren

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class ChatState(TypedDict):
    messages: Annotated[list, add_messages]
    step: int
```

## 2.2 Ein einzelner Node

```python
from langchain.chat_models import init_chat_model
llm = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0.0)

def agent_node(state: ChatState) -> ChatState:
    response = llm.invoke(state["messages"])
    return {"messages": [response], "step": state["step"] + 1}
```

## 2.3 Graph bauen

```python
from langgraph.graph import StateGraph, START, END

g = StateGraph(ChatState)
g.add_node("agent", agent_node)
g.add_edge(START, "agent")
g.add_edge("agent", END)

graph = g.compile()
```

## 2.4 Graphen visualisieren

```python
from IPython.display import Image

display(Image(graph.get_graph().draw_mermaid_png()))
```
## 2.5 Ausführen

```python
from langchain_core.messages import HumanMessage

initial_state = {"messages": [HumanMessage(content="Was ist LangGraph?")], "step": 0}
result = graph.invoke(initial_state)
result
```

**Ergebnis:** Ein vollständiger Einsteiger-Workflow, bevor irgendein abstraktes Konzept erklärt wurde.

---

# 3 Die Grundidee: Workflows als State Machine

Nachdem Einsteiger ein funktionsfähiges Beispiel gesehen haben, kann das Konzept erklärt werden:

- Ein Workflow besteht aus klar definierten Schritten (*Nodes*).
- Der Zustand wird in einem *State* gespeichert.
- *Edges* bestimmen die Reihenfolge.
- *Reducer* wie `add_messages` fügen Informationen intelligent zusammen.

Kurz: **Nodes sind Funktionen – Edges sind der Ablauf.**

---

# 4 State sauber definieren (vertieft)

```python
class ChatState(TypedDict):
    messages: Annotated[list, add_messages]
    step: int
    # erweiterbar: approved: bool, analysis: str
```

Prinzipien:
- Nur speichern, was später benötigt wird.
- Typisierung unterstützt Verständnis und Fehlersuche.
- Reducer sorgen dafür, dass Listen (z. B. Nachrichten) korrekt gemergt werden.

---

# 5 Nodes: Bausteine des Workflows

Nodes sollen klein, fokussiert und deterministisch sein.

Beispiele für Node-Typen:
- LLM-Schritt
- Tool-Besorgung
- Validierung
- Zusammenfassung
- Human-in-the-Loop

Ein LLM-Node wurde oben bereits eingeführt; hier ein kleiner weiterer Beispieltyp:

```python
def summarize_node(state: ChatState) -> ChatState:
    text = "
".join([m.content for m in state["messages"]])
    summary = llm.invoke([{"role": "user", "content": f"Fasse zusammen: {text}"}])
    return {"messages": [summary]}
```

---

# 6 Edges & Conditional Routing

Nun erst wird Routing eingeführt – **nachdem Einsteiger Nodes und State kennen**.

## 6.1 Lineare Edges

```python
g.add_edge(START, "agent")
g.add_edge("agent", END)
```

## 6.2 Bedingtes Routing

```python
def tool_node(state: ChatState):
    result_message = ...  # echtes Tool
    return {"messages": [result_message]}

def routing_after_agent(state: ChatState) -> str:
    last_msg = state["messages"][-1]
    if getattr(last_msg, "tool_calls", None):
        return "tools"
    return END
```

```python
g.add_node("tools", tool_node)
g.add_conditional_edges(
    "agent",
    routing_after_agent,
    {"tools": "tools", END: END},
)
g.add_edge("tools", "agent")
```

## 6.3 Typische Muster
- Schlüsselwort-Trigger
- Unsicherheitsanalyse
- Routing nach Tool-Feedback
- Wiederholschleifen (Retry)

---

# 7 Streaming: Schritte sichtbar machen

Streaming ist ein wichtiges Werkzeug für das Verständnis.

```python
for event in graph.stream(initial_state, {"configurable": {"thread_id": "demo"}}, stream_mode="updates"):
    print(event)
```

Streaming-Varianten:
- `updates`: nur Änderungen
- `values`: vollständiger State
- `messages`: nur neue Nachrichten

Empfehlung für Einsteiger: **updates**.

---

# 8 Checkpointing & Sessions

Checkpointing ermöglicht:
- längerfristige Workflows
- Resume nach Unterbrechung
- stabile Interaktion

```python
from langgraph.checkpoint.memory import MemorySaver
checkpointer = MemorySaver()
graph = g.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "session-01"}}
result1 = graph.invoke(initial_state, config)
```

Später:

```python
result2 = graph.invoke(None, config)  # setzt fort
```

Hinweise:
- Optimale Einstiegsvariante: MemorySaver.
- Für produktive Systeme: SQLite/Postgres.
- Graphänderungen können Sessions invalidieren.

---

# 9 Human-in-the-Loop (Approval & Formulare)

Human-in-the-Loop ist ein wichtiges Konzept – aber erst an dieser Stelle sinnvoll.

## 9.1 Interrupt

```python
from langgraph.types import interrupt

def approval_node(state: ChatState) -> ChatState:
    decision = interrupt("Aktion ausführen? yes/no")
    return {"approved": decision == "yes"}
```

## 9.2 Weiterführen

```python
from langgraph.types import Command
result = graph.invoke(Command(resume="yes"), config)
```

Einsatzmöglichkeiten:
- sicherheitsrelevante Aktionen
- wichtige Entscheidungen
- mehrschrittige Formulareingaben

---

# 10 Multi-Agent-Workflows (Fortgeschritten)

Dieses Thema wurde bewusst ans Ende verschoben.

## 10.1 Agenten definieren

```python
from langchain.agents import create_agent

research_agent = create_agent(model=llm, tools=[...], system_prompt="Research")
writer_agent   = create_agent(model=llm, tools=[...], system_prompt="Writer")
```

## 10.2 Supervisor

```python
from langgraph.types import Command

def supervisor(state: ChatState) -> Command:
    task = state.get("task_type", "research")
    return Command(goto=f"{task}_agent")
```

Mögliche Erweiterungen:
- iterative Qualitätsprüfungen
- mehrere Worker mit Prioritäten
- automatische oder manuelle Rollenwechsel

---

# 11 End-to-End-Übung

Eine sinnvolle Abschlussaufgabe ist ein Workflow:

1. `agent` führt Analyse durch
2. `approval` fragt nach Bestätigung
3. optional `tool` wird ausgeführt
4. `summarize` erstellt ein Abschlussfazit

Damit besitzen Einsteiger alle zentralen Bausteine, um eigene Agentensysteme umzusetzen.

---

Ende der neu sortierten und erweiterten Anleitung.

