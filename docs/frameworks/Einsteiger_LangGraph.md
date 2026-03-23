---
layout: default
title: LangGraph Einsteiger
parent: Frameworks
nav_order: 2
description: "Multi-Agent-Systeme und Workflows mit LangGraph"
has_toc: true
---

# LangGraph Einsteiger
{: .no_toc }

> **Multi-Agent-Systeme und Workflows mit LangGraph**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Kurzüberblick: Warum LangGraph?

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

```mermaid
graph LR
    A[LangChain] --> B[LangGraph]
    B --> C[Multi-Step Workflows]
    B --> D[Conditional Routing]
    B --> E[Multi-Agent Systems]
    B --> F[Checkpointing]
    B --> G[Human-in-Loop]

    style B fill:#10a37f
    style A fill:#0066cc
```

Damit ist sofort klar: LangGraph strukturiert Workflows, anstatt alles in ein einzelnes LLM-Prompt zu packen.

---

## Das kleinstmögliche funktionierende Beispiel

Der schnellste Weg zum Verständnis ist ein Mini-Workflow.

### State definieren

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class ChatState(TypedDict):
    messages: Annotated[list, add_messages]
    step: int
```

### Ein einzelner Node

```python
from langchain.chat_models import init_chat_model
llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)

def agent_node(state: ChatState) -> ChatState:
    response = llm.invoke(state["messages"])
    return {"messages": [response], "step": state["step"] + 1}
```

### Graph bauen

```python
from langgraph.graph import StateGraph, START, END

g = StateGraph(ChatState)
g.add_node("agent", agent_node)
g.add_edge(START, "agent")
g.add_edge("agent", END)

graph = g.compile()
```

### Graphen visualisieren

```python
from IPython.display import Image

display(Image(graph.get_graph().draw_mermaid_png()))
```

Dieser minimale Workflow sieht so aus:

```mermaid
flowchart LR
    START([START]) --> AGENT[agent_node]
    AGENT --> END([END])

    style START fill:#90EE90
    style END fill:#FFB6C1
    style AGENT fill:#87CEEB
```

### Ausführen

```python
from langchain_core.messages import HumanMessage

initial_state = {"messages": [HumanMessage(content="Was ist LangGraph?")], "step": 0}
result = graph.invoke(initial_state)
result
```

**Ergebnis:** Ein vollständiger Einsteiger-Workflow, bevor irgendein abstraktes Konzept erklärt wurde.

---

## Die Grundidee: Workflows als State Machine

Nachdem Einsteiger ein funktionsfähiges Beispiel gesehen haben, kann das Konzept erklärt werden:

- Ein Workflow besteht aus klar definierten Schritten (*Nodes*).
- Der Zustand wird in einem *State* gespeichert.
- *Edges* bestimmen die Reihenfolge.
- *Reducer* wie `add_messages` fügen Informationen intelligent zusammen.

```mermaid
stateDiagram-v2
    [*] --> State: Initialize
    State --> Node1: Edge
    Node1 --> State: Update (Reducer)
    State --> Node2: Edge
    Node2 --> State: Update (Reducer)
    State --> [*]: Complete

    note right of State
        messages: []
        step: 0
    end note
```

Kurz: **Nodes sind Funktionen – Edges sind der Ablauf.**

---

## State sauber definieren (vertieft)

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

## Nodes: Bausteine des Workflows

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

## Edges & Conditional Routing

Nun erst wird Routing eingeführt – **nachdem Einsteiger Nodes und State kennen**.

### Lineare Edges

```python
g.add_edge(START, "agent")
g.add_edge("agent", END)
```

### Bedingtes Routing

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

**Visualisierung des Tool-Loops:**

```mermaid
flowchart TB
    START([START]) --> AGENT[Agent Node]
    AGENT --> COND{Tool Calls?}
    COND -->|Yes| TOOLS[Tool Node]
    COND -->|No| END([END])
    TOOLS --> AGENT

    style START fill:#90EE90
    style END fill:#FFB6C1
    style COND fill:#FFD700
    style TOOLS fill:#FFA500
    style AGENT fill:#87CEEB
```

### Typische Muster
- Schlüsselwort-Trigger
- Unsicherheitsanalyse
- Routing nach Tool-Feedback
- Wiederholschleifen (Retry)

---

## Streaming: Schritte sichtbar machen

Streaming ist ein wichtiges Werkzeug für das Verständnis.

```python
for event in graph.stream(initial_state, {"configurable": {"thread_id": "demo"}}, stream_mode="updates"):
    print(event)
```

**Streaming-Prozess:**

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Graph
    participant Node1
    participant Node2

    User->>Graph: invoke(state)
    Graph->>Node1: process
    Node1-->>User: stream update 1
    Graph->>Node2: process
    Node2-->>User: stream update 2
    Graph-->>User: final result
```

Streaming-Varianten:
- `updates`: nur Änderungen
- `values`: vollständiger State
- `messages`: nur neue Nachrichten

Empfehlung für Einsteiger: **updates**.

---

## Checkpointing & Sessions

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

**Session-Management mit Checkpointing:**

```mermaid
stateDiagram-v2
    [*] --> Session1: invoke(state, thread_id)
    Session1 --> Checkpoint: save state
    Checkpoint --> Session1: resume
    Session1 --> Session2: continue later
    Session2 --> [*]: complete

    note right of Checkpoint
        MemorySaver (Dev)
        SQLite (Staging)
        Postgres (Production)
    end note
```

Hinweise:
- Optimale Einstiegsvariante: MemorySaver.
- Für produktive Systeme: SQLite/Postgres.
- Graphänderungen können Sessions invalidieren.

---

## Human-in-the-Loop (Approval & Formulare)

Human-in-the-Loop ist ein wichtiges Konzept – aber erst an dieser Stelle sinnvoll.

### Interrupt

```python
from langgraph.types import interrupt

def approval_node(state: ChatState) -> ChatState:
    decision = interrupt("Aktion ausführen? yes/no")
    return {"approved": decision == "yes"}
```

### Weiterführen

```python
from langgraph.types import Command
result = graph.invoke(Command(resume="yes"), config)
```

**Human-in-the-Loop Pattern:**

```mermaid
flowchart TB
    START([START]) --> NODE1[Process Data]
    NODE1 --> APPROVAL[👤 Approval Node]
    APPROVAL --> INTERRUPT{interrupt}
    INTERRUPT -.Wait for Human.-> DECISION{Decision?}
    DECISION -->|yes| EXECUTE[Execute Action]
    DECISION -->|no| REJECT[Reject Action]
    EXECUTE --> END([END])
    REJECT --> END

    style START fill:#90EE90
    style END fill:#FFB6C1
    style APPROVAL fill:#FFA500
    style INTERRUPT fill:#FFD700
    style EXECUTE fill:#87CEEB
    style REJECT fill:#ff6b6b
```

Einsatzmöglichkeiten:
- sicherheitsrelevante Aktionen
- wichtige Entscheidungen
- mehrschrittige Formulareingaben

---

## Multi-Agent-Workflows (Fortgeschritten)

Dieses Thema wurde bewusst ans Ende verschoben.

### Agenten definieren

```python
from langchain.agents import create_agent

research_agent = create_agent(model=llm, tools=[...], system_prompt="Research")
writer_agent   = create_agent(model=llm, tools=[...], system_prompt="Writer")
```

### Supervisor

```python
from langgraph.types import Command

def supervisor(state: ChatState) -> Command:
    task = state.get("task_type", "research")
    return Command(goto=f"{task}_agent")
```

**Multi-Agent Supervisor Pattern:**

```mermaid
graph TB
    START([User Request]) --> SUPERVISOR[Supervisor Agent]

    SUPERVISOR --> COND{Task Type?}
    COND -->|research| RESEARCH[Research Agent]
    COND -->|writing| WRITER[Writer Agent]
    COND -->|analysis| ANALYST[Analyst Agent]

    RESEARCH --> REVIEW[Quality Check]
    WRITER --> REVIEW
    ANALYST --> REVIEW

    REVIEW --> ITERCHECK{Good enough?}
    ITERCHECK -->|No| SUPERVISOR
    ITERCHECK -->|Yes| END([END])

    style SUPERVISOR fill:#10a37f
    style RESEARCH fill:#87CEEB
    style WRITER fill:#FFB6C1
    style ANALYST fill:#FFA500
    style REVIEW fill:#FFD700
```

Mögliche Erweiterungen:
- iterative Qualitätsprüfungen
- mehrere Worker mit Prioritäten
- automatische oder manuelle Rollenwechsel

## Abgrenzung zu verwandten Dokumenten

| Dokument | Inhalt |
|---|---|
| [Einsteiger LangChain](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_LangChain.html) | Voraussetzung: Modell-Init, Tools und Agenten mit LangChain |
| [Einsteiger ChromaDB](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_ChromaDB.html) | Vektordatenbank als RAG-Tool in LangGraph-Workflows |
| [State Management](https://ralf-42.github.io/Agenten/concepts/State_Management.html) | Konzeptionelle Tiefe hinter TypedDict und Reducer-Funktionen |
| [Checkpointing & Persistenz](https://ralf-42.github.io/Agenten/concepts/Checkpointing_Persistenz.html) | Technische Details zu MemorySaver und Thread-IDs |
| [Human-in-the-Loop](https://ralf-42.github.io/Agenten/concepts/Human_in_the_Loop.html) | Konzept hinter Interrupt & Resume aus Abschnitt 9 |


---

**Version:** 2.0  
**Stand:** Januar 2026  
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.    

