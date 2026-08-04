---
layout: default
title: Einsteiger LangGraph
parent: LangGraph
grand_parent: Frameworks
nav_order: 1
description: Mehrstufige Agenten-Workflows mit LangGraph, State, Routing und Human-in-the-Loop
has_toc: true
---

# LangGraph
{: .no_toc }

> **Multi-Agent-Systeme und Workflows mit LangGraph**

---

## Inhaltsverzeichnis
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

## Lernpfad: Von einfach zu agentisch

LangGraph lernt sich am besten in kleinen Schritten. Nicht jedes Thema wird sofort gebraucht; zuerst sollten State, Nodes und Edges stabil sitzen.

| Stufe | Thema | Ziel |
|---|---|---|
| 1 | Minimaler Graph | State, Node, Edge, `START` und `END` verstehen |
| 2 | Sequenzieller Graph | lineare Workflows als Pipeline bauen |
| 3 | Conditional Routing | Entscheidungen in Code statt im Prompt modellieren |
| 4 | Loop / Retry | Wiederholungen mit klarer Exit-Bedingung bauen |
| 5 | Tool-Loop | LLM-Entscheidung, Tool-Ausführung und Antwort verbinden |
| 6 | Streaming | Zwischenschritte sichtbar machen |
| 7 | Checkpointing | Sessions wiederaufnehmen und lange Abläufe absichern |
| 8 | Human-in-the-Loop | Freigaben und Korrekturen technisch erzwingen |
| 9 | Subgraphs / Multi-Agent | größere Workflows modularisieren |
| 10 | Agentic RAG | Retrieval, Tools und Routing in einem Graph kombinieren |



---

## Zentrale Konzepte

| Konzept | Bedeutung |
|---|---|
| State | Gemeinsamer Zustand, der durch den Workflow wandert |
| Node | Ein einzelner Bearbeitungsschritt |
| Edge | Verbindung zwischen Schritten |
| Conditional Routing | Entscheidung, welcher Pfad als Nächstes läuft |
| Checkpointing | Speichert Zustand für Resume und Debugging |
| Interrupt | Technischer Halt für Human-in-the-Loop |

---

## Quickstart

Der schnellste Weg zum Verständnis ist ein Mini-Workflow.

Ein Workflow besteht aus:
- **State:** zentrale Daten
- **Nodes:** Bearbeitungsschritte
- **Edges:** Ablaufsteuerung

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
llm = init_chat_model("openai:gpt-5.6-luna")

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

**Ergebnis:** Ein vollständiger erster Workflow, bevor irgendein abstraktes Konzept erklärt wurde.

---

## Grundaufbau: Workflows als State Machine

Nach einem ersten funktionsfähiges Beispiel, kann das Konzept erklärt werden:

- Ein Workflow besteht aus klar definierten Schritten (*Nodes*).
- Der Zustand wird in einem *State* gespeichert.
- *Edges* bestimmen die Reihenfolge.
- *Reducer* wie `add_messages` fügen Informationen intelligent zusammen.

```mermaid
flowchart TD
    %% Einstiegspunkt
    INVOKE([graph.invoke]) --> START

    %% Hauptknoten
    subgraph START_NODE [ ]
        direction TB
        START([START])
    end

    subgraph AGENT_NODE [agent_node]
        direction TB
        StateIn[<b>1. State-Eingang</b><br/>Aktueller Snapshot]
        LLM[<b>2. Logik</b><br/>LLM / Tool-Aufruf]
        Update[<b>3. State Update</b><br/>Änderungen ausgeben]

        StateIn --> LLM
        LLM --> Update
    end

    subgraph END_NODE [ ]
        direction TB
        END([END])
    end

    %% Verbindungen
    START -->|erster Node| AGENT_NODE
    AGENT_NODE -->|Workflow beendet| END
    END --> RESULT([Finaler State])

    %% Styling
    style START fill:#90EE90,stroke:#333
    style END fill:#FFB6C1,stroke:#333
    style AGENT_NODE fill:#f9f9f9,stroke:#87CEEB,stroke-width:2px
    style StateIn fill:#E1F5FE,stroke:#01579B
    style LLM fill:#E1F5FE,stroke:#01579B
    style Update fill:#E1F5FE,stroke:#01579B
    style INVOKE fill:#eeeeee,stroke:#999,stroke-dasharray: 5 5
    style RESULT fill:#eeeeee,stroke:#999,stroke-dasharray: 5 5
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

**Ein Node ist immer eine Python-Funktion** — was sich unterscheidet, ist der Inhalt:

| Node-Typ | Inhalt der Funktion | Typischer Einsatz |
|---|---|---|
| **LLM-Node** | direkter LLM-Aufruf | Antworten, Zusammenfassungen |
| **Tool-Node** | Tool-Ausführung | Suche, Berechnungen, APIs |
| **Agent-Node** | vollständiger Agent (`create_agent`) | komplexe Teilaufgaben mit eigenem Tool-Loop |

### Typ 1: LLM-Node

```python
def summarize_node(state: ChatState) -> ChatState:
    text = "\n".join([m.content for m in state["messages"]])
    summary = llm.invoke([{"role": "human", "content": f"Fasse zusammen: {text}"}])
    return {"messages": [summary]}
```

### Typ 2: Tool-Node

```python
from langchain_core.tools import tool
from langchain_core.messages import AIMessage

@tool
def suche(query: str) -> str:
    """Führt eine Websuche durch."""
    return f"Ergebnis für: {query}"

def tool_node(state: ChatState) -> ChatState:
    result = suche.invoke({"query": state["messages"][-1].content})
    return {"messages": [AIMessage(content=result)]}
```

### Typ 3: Agent-Node

Ein Node kann intern einen vollständigen Agenten ausführen — inklusive eigenem Tool-Loop:

```python
from langchain.agents import create_agent

research_agent = create_agent(
    model=llm,
    tools=[suche],
    system_prompt="Du bist ein Research-Spezialist. Recherchiere gründlich.",
)

def research_node(state: ChatState) -> ChatState:
    result = research_agent.invoke({"messages": state["messages"]})
    return {"messages": result["messages"]}
```

> **Hinweis:** Der Agent-Node ist das Muster hinter Supervisor-Architekturen (M19, M20). Der Supervisor ruft `research_node`, `writer_node` etc. auf — jeder Node kapselt intern einen vollständigen Agenten.

---

## Typische Workflows

Die folgenden Abschnitte zeigen die wichtigsten Einsteiger-Workflows: lineare Graphen, bedingtes Routing, Streaming, Sessions, Human-in-the-Loop und einfache Multi-Agent-Muster.

---

## Edges & Conditional Routing

Nun erst wird Routing eingeführt – **nachdem Entwickler Nodes und State kennen**.

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

### State ändern und gleichzeitig routen: `Command`

Wenn ein Schritt den State aktualisieren soll und gleichzeitig bestimmt, wohin als Nächstes gegangen wird, ist `Command(update=..., goto=...)` das passende Muster.

```python
from typing import Literal
from langgraph.types import Command

def classify_node(state: ChatState) -> Command[Literal["tools", "answer"]]:
    if "suche" in state["messages"][-1].content.lower():
        return Command(update={"step": state["step"] + 1}, goto="tools")
    return Command(update={"step": state["step"] + 1}, goto="answer")
```

Für Einsteiger gilt: Nutze erst einfache Verzweigungen mit `add_conditional_edges()`. `Command` lohnt sich besonders dann, wenn Update und Routing fachlich zusammengehören.

---

## Streaming: Schritte sichtbar machen

Streaming ist ein wichtiges Werkzeug für das Verständnis.

```python
config = {"configurable": {"thread_id": "demo"}}

for chunk in graph.stream(
    initial_state,
    config=config,
    stream_mode="updates",
    version="v2",
):
    if chunk["type"] == "updates":
        print(chunk["data"])
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
- `debug`: detaillierte Ausführungsinformationen

Empfehlung: **updates**.

**Tipp für später:** Ab LangGraph v1.2.0 gibt es zusätzlich `stream_events(version="v3")` mit getrennten Kanälen (`run.values`, `run.messages`, `run.lifecycle`, `run.subgraphs`). Für den Einstieg reicht `stream(..., stream_mode=...)` völlig aus.

---

## Checkpointing & Sessions

Checkpointing ermöglicht:
- längerfristige Workflows
- Resume nach Unterbrechung
- stabile Interaktion

```python
from langgraph.checkpoint.memory import InMemorySaver
checkpointer = InMemorySaver()
graph = g.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "session-01"}}
result1 = graph.invoke(initial_state, config)
```

Später:

```python
new_input = {
    "messages": [HumanMessage(content="Fahre mit der nächsten Frage fort.")],
    "step": 0,
}
result2 = graph.invoke(new_input, config)
```

Checkpointing lädt dabei den gespeicherten Zustand der `thread_id` und ergänzt ihn um den neuen Input. Für Human-in-the-Loop-Unterbrechungen wird dagegen nicht ein neuer State übergeben, sondern `Command(resume=...)`.

**Session-Management mit Checkpointing:**

```mermaid
stateDiagram-v2
    [*] --> Session1: invoke(state, thread_id)
    Session1 --> Checkpoint: save state
    Checkpoint --> Session1: resume
    Session1 --> Session2: continue later
    Session2 --> [*]: complete

    note right of Checkpoint
        InMemorySaver (Dev)
        SQLite (Staging)
        Postgres (Production)
    end note
```

Hinweise:
- Optimale Einstiegsvariante: InMemorySaver.
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

---

## Best Practices

- State klein und explizit halten.
- Nodes nach fachlicher Verantwortung trennen.
- Routing als Funktion modellieren statt in Prompt-Text zu verstecken.
- Graph nach dem Kompilieren visualisieren.
- Checkpointing einsetzen, sobald Sessions wiederaufgenommen werden sollen.
- Human-in-the-Loop technisch mit Interrupts erzwingen.

---

## Troubleshooting

### Graph endet zu früh

Prüfe die Edges und Rückgabewerte der Routing-Funktion. Jeder mögliche Rückgabewert muss auf einen gültigen Zielknoten oder `END` zeigen.

### State wird überschrieben

Nutze Reducer wie `add_messages`, wenn Listen über mehrere Schritte erweitert statt ersetzt werden sollen.

### Human-in-the-Loop läuft nicht weiter

Setze eine stabile `thread_id` und verwende `Command(resume=...)`, um nach einem Interrupt fortzufahren.

---

## Erweiterungen / Fortgeschrittene Themen

### Ausblick auf Best Practices

Diese Konzepte gehören nicht in den ersten Minimalgraph, erklären aber die produktionsnähere LangGraph-Dokumentation:

| Konzept | Kurz erklärt |
|---|---|
| Persistenter Store und Löschkonzept | Checkpointing speichert Zustand. Sobald Daten dauerhaft gespeichert werden, muss klar sein, was nur zur Session gehört, was langfristig bleibt und wie sensible Daten gelöscht werden. |
| `ToolRuntime` | Tools können bei Bedarf Laufzeitkontext erhalten, etwa `thread_id`, Store, Stream Writer oder Konfiguration. Für einfache Tools bleibt ein normaler Funktionsparameter aber verständlicher. |
| Robustheit für Production (v1.2.0) | Node-Timeouts (`timeout=` in `add_node()`), Node-Level Error-Handler (`error_handler=`) und Graceful Shutdown (`RunControl.request_drain()`) sorgen dafür, dass einzelne Nodes nicht den ganzen Graph blockieren oder abstürzen lassen. |

---

- Checkpointing über persistente Stores
- Human-in-the-Loop mit Formularen
- Multi-Agent-Workflows
- LangSmith-Tracing für Graph-Runs

---

## Zusammenfassung

LangGraph wird dann sinnvoll, wenn ein LLM-Workflow echten Zustand, Routing oder Unterbrechungen braucht. Der Einstieg gelingt am besten über den minimalen Graph aus State, Node und Edge; danach kommen Conditional Routing, Streaming, Checkpointing und Human-in-the-Loop hinzu.

---

## Abgrenzung zu verwandten Dokumenten

| Dokument | Inhalt |
|---|---|
| [LangChain Einsteiger](einsteiger-langchain.html) | Voraussetzung: Modell-Init, Tools und Agenten mit LangChain |
| [ChromaDB Einsteiger](einsteiger-chromadb.html) | Vektordatenbank als RAG-Tool in LangGraph-Workflows |


---

**Version:** 2.1<br>
**Stand:** Juli 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.

