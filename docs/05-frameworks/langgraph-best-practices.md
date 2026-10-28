---
layout: default
title: LangGraph Best Practices
parent: LangGraph
grand_parent: Frameworks
nav_order: 2
description: "Kompakte Muster für zustandsbehaftete Workflows mit LangGraph"
has_toc: true
---

# LangGraph Best Practices
{: .no_toc }

LangGraph beschreibt Workflows mit **State**, **Nodes** und **Edges**. Verwende einen expliziten Graphen, wenn Abläufe verzweigen, pausieren, fortgesetzt oder in Teilgraphen organisiert werden sollen.

Für den Einstieg siehe [LangGraph Einsteiger](./einsteiger-langgraph.html). Für einfache Agenten mit Tools siehe [LangChain Best Practices](./langchain-best-practices.html).

---

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Workflow als StateGraph

Der State enthält gemeinsam genutzte Workflow-Daten. Nodes übernehmen jeweils eine Aufgabe und geben nur die Änderungen zurück. Der Router wählt den nächsten Schritt.

~~~python
from typing import Literal, TypedDict

from langgraph.graph import END, START, StateGraph


class SupportState(TypedDict, total=False):
    query: str
    category: Literal["billing", "general"]
    answer: str


def classify_node(state: SupportState) -> dict:
    category = "billing" if "rechnung" in state["query"].lower() else "general"
    return {"category": category}


def billing_node(state: SupportState) -> dict:
    return {"answer": f"Die Abrechnung prüfen wir zu: {state['query']}"}


def general_node(state: SupportState) -> dict:
    return {"answer": f"Wir kümmern uns um: {state['query']}"}


def support_router(state: SupportState) -> Literal["billing_node", "general_node"]:
    return state["category"]


support_builder = StateGraph(SupportState)
support_builder.add_node("classify_node", classify_node)
support_builder.add_node("billing_node", billing_node)
support_builder.add_node("general_node", general_node)
support_builder.add_edge(START, "classify_node")
support_builder.add_conditional_edges(
    "classify_node",
    support_router,
    {
        "billing_node": "billing_node",
        "general_node": "general_node",
    },
)
support_builder.add_edge("billing_node", END)
support_builder.add_edge("general_node", END)

support_agent = support_builder.compile()
result = support_agent.invoke({"query": "Frage zu meiner Rechnung"})
~~~

Für ein neues Beispiel gelten im Projekt diese Namen:

- State-Klassen tragen einen fachlichen Namen mit State, etwa SupportState.
- Node-Funktionen enden auf _node.
- Router heißen router oder fachlich eindeutig, etwa support_router.
- Builder heißen agent_builder oder fachlich eindeutig, etwa support_builder.
- Der kompilierte Workflow heißt agent oder fachlich eindeutig, etwa support_agent.

## State und Reducer

Halte den State klein und fachlich verständlich. TypedDict beschreibt den internen Graph-State. Für Daten an API-Grenzen oder validierte Modellantworten eignen sich Pydantic-Modelle.

Für Nachrichtenverläufe übernimmt add_messages das Zusammenführen der Nachrichtenliste. Neue Nachrichten werden angefügt; Nachrichten mit bereits vorhandener ID werden aktualisiert.

~~~python
from typing import Annotated, TypedDict

from langchain_core.messages import AnyMessage
from langgraph.graph.message import add_messages


class ConversationState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
~~~

## Checkpointing und Wiederaufnahme

Ein Checkpointer speichert Zwischenstände eines Threads. Die thread_id bezeichnet die Unterhaltung, die fortgesetzt werden soll.

~~~python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
support_agent = support_builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "support-001"}}
result = support_agent.invoke(
    {"query": "Frage zu meiner Rechnung"},
    config=config,
)
~~~

InMemorySaver eignet sich für eine lokale Demo. Für dauerhafte Sitzungen wird ein persistenter Checkpointer verwendet. Checkpointer speichern Thread-State; ein Store eignet sich für Informationen, die über mehrere Threads hinweg verfügbar sein sollen.

## Freigabe mit Human-in-the-Loop

interrupt() hält den Lauf an und stellt eine strukturierte Anfrage bereit. Zum Fortsetzen werden derselbe Checkpointer und dieselbe thread_id verwendet.

~~~python
from typing import TypedDict

from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt


class ReviewState(TypedDict, total=False):
    draft: str
    approved: bool


def approval_node(state: ReviewState) -> dict:
    decision = interrupt({"draft": state["draft"], "action": "publish"})
    return {"approved": decision["approved"]}


approval_builder = StateGraph(ReviewState)
approval_builder.add_node("approval_node", approval_node)
approval_builder.add_edge(START, "approval_node")
approval_builder.add_edge("approval_node", END)

approval_agent = approval_builder.compile(checkpointer=InMemorySaver())
approval_config = {"configurable": {"thread_id": "review-001"}}
approval_agent.invoke({"draft": "Entwurf zur Prüfung"}, config=approval_config)

# Fortsetzen, nachdem der Lauf für diese thread_id unterbrochen wurde:
result = approval_agent.invoke(
    Command(resume={"approved": True}),
    config=approval_config,
)
~~~

Die Eingabe von interrupt() sollte JSON-serialisierbar und für die freigebende Person verständlich sein.

## Teilgraphen und Streaming

Ein kompiliertes Teilstück kann als Node in einen übergeordneten Workflow eingebunden werden. So bleiben fachlich eigenständige Abläufe modular und wiederverwendbar.

~~~python
research_subgraph = research_builder.compile()
support_builder.add_node("research_subgraph", research_subgraph)
~~~

Mit Streaming lassen sich Updates während eines Laufs beobachten:

~~~python
for update in support_agent.stream(
    {"query": "Frage zu meiner Rechnung"},
    stream_mode="updates",
):
    print(update)
~~~

Für eine Auswertung des gesamten Ablaufs können LangSmith-Traces und Datasets ergänzt werden. Siehe [LangSmith Best Practices](./langsmith-best-practices.html).

## Praxischeck

- State enthält die Daten, die Nodes tatsächlich gemeinsam benötigen.
- Nodes übernehmen klar benannte Aufgaben und geben State-Updates zurück.
- Router liefern ausschließlich registrierte Node-IDs oder END.
- Threads erhalten eine stabile thread_id, wenn Läufe fortgesetzt werden sollen.
- Freigaben verwenden interrupt() zusammen mit einem Checkpointer.
- Teilgraphen bilden fachlich zusammengehörige Abläufe ab.

## Weiterführende Ressourcen

- [LangGraph: Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api)
- [LangGraph: Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangGraph: Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)
- [LangGraph: Multi-agent](https://docs.langchain.com/oss/python/langchain/multi-agent)
- [LangSmith Best Practices](./langsmith-best-practices.html)
- [LangChain Best Practices](./langchain-best-practices.html)

---

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [LangChain Best Practices](langchain-best-practices.html) | Wie werden Modelle, Tools und einfache Agenten aufgebaut? |
| [LangSmith Best Practices](langsmith-best-practices.html) | Wie werden Runs beobachtet und ausgewertet? |

---

**Version:** 2.0<br>
**Stand:** Oktober 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
