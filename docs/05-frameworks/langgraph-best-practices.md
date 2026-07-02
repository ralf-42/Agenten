---
layout: default
title: LangGraph Best Practices
parent: LangGraph
grand_parent: Frameworks
nav_order: 2
description: "Best Practices für zustandsbehaftete Agenten-Workflows mit LangGraph"
has_toc: true
---

# LangGraph Best Practices
{: .no_toc }

> **Vertiefung für Entwickler, die nach dem Einsteiger-Guide robuste LangGraph-Muster für echte Workflows nachschlagen möchten.**

Diese Seite ist keine erste Einführung in LangGraph. Sie richtet sich an Entwickler, die bereits verstanden haben, warum ein Graph nötig ist und nun stabilere Muster für State, Routing, Checkpointing oder Multi-Agent-Flüsse suchen. Für den ersten Zugang empfiehlt sich zuerst [LangGraph Einsteiger](./einsteiger-langgraph.html).

Der Ton dieser Seite ist bewusst normativer als in den Konzept- und Einsteigerseiten. Im Kurs bedeutet das nicht, dass jede Funktion sofort verwendet werden muss. Wichtiger ist zu verstehen, wann ein Pattern wirklich nötig ist und wann es für den aktuellen Schritt noch überdimensioniert wäre.

---

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Überblick / Zweck

LangGraph ist die Standardebene für zustandsbehaftete, verzweigte und wiederaufnehmbare Agenten-Workflows. Dieses Dokument sammelt die Patterns, die im Kurs und in produktionsnahen Beispielen als robuste Grundlage gelten.

Ziel ist ein expliziter Kontrollfluss: State, Nodes, Edges, Routing, Checkpointing und Freigaben sollen im Graph sichtbar sein, statt in Prompts oder großen Python-Funktionen versteckt zu werden.

---

## Wann nutzen?

LangGraph lohnt sich, wenn ein Agent nicht mehr linear arbeitet. Sobald Routing, langlebiger State, Wiederaufnahme, mehrere Agenten oder menschliche Freigaben eine Rolle spielen, wird ein expliziter Graph robuster als eine lose Folge von Tool-Aufrufen.

| Use Case | LangChain `create_agent()` | LangGraph |
|---|---|---|
| Einfacher Agent mit Tools | Gut geeignet | Meist zu schwergewichtig |
| Mehrstufiger Workflow mit Bedingungen | Begrenzt | Gut geeignet |
| Multi-Agent-System | Nicht ausreichend | Kernfall |
| Langlebige Session mit Checkpointing | Nicht ausreichend | Kernfall |
| Human-in-the-Loop | Nur einfache Fälle | Gut geeignet |
| State über Tage oder Wochen | Nicht ausreichend | Kernfall |

Typischer Fehler: LangGraph wird zu früh eingesetzt, nur weil es flexibler klingt. Ein einfacher Agent mit zwei Tools braucht meistens noch keinen Graph. Umgekehrt wird es teuer, eine gewachsene Tool-Kette ohne Graph weiter zu pflegen, sobald Bedingungen, Wiederaufnahme und Fehlerpfade dazukommen.

## Standards / Kern-Features

| Standard | Priorität | Zweck |
|---|---|---|
| `StateGraph` mit `TypedDict` | Kernstandard | State explizit und typisiert halten |
| Kleine Nodes | Kernstandard | Workflow testbar und austauschbar machen |
| Conditional Routing | Kernstandard | Entscheidungen im Graph statt im Fließtext verstecken |
| Checkpointing | Produktionsstandard | Unterbrechung, Resume und Recovery ermöglichen |
| Human-in-the-Loop | Produktionsstandard | Kritische Aktionen freigeben lassen |
| Subgraphs | Vertiefung | große Workflows modularisieren |
| Streaming und Tracing | Vertiefung | Abläufe beobachtbar machen |

## Quick Start

```python
from typing import Annotated, TypedDict

from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    task_status: str


def agent_node(state: AgentState) -> dict:
    response = llm.invoke(state["messages"])
    return {"messages": [response], "task_status": "answered"}


builder = StateGraph(AgentState)
builder.add_node("agent", agent_node)
builder.add_edge(START, "agent")
builder.add_edge("agent", END)

graph = builder.compile()
result = graph.invoke({"messages": [("human", "Fasse LangGraph kurz zusammen.")], "task_status": "new"})
```

Der Quick Start zeigt nur den minimalen Graph. Für echte Workflows kommen danach Routing, Checkpointing, Human-in-the-Loop und Observability gezielt dazu.

## State Design

State ist die gemeinsame Datenstruktur des Graphen. Er sollte klein, explizit und stabil sein. Alles, was nur temporär in einer Node gebraucht wird, gehört nicht automatisch in den State.

```python
from typing import Annotated, TypedDict

from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user_id: str
    task_status: str
    retry_count: int


graph_builder = StateGraph(AgentState)
```

`TypedDict` ist für internen LangGraph-State meist die richtige Wahl, weil es wenig Overhead erzeugt und den State für Editor, Tests und Code-Review sichtbar macht. Pydantic eignet sich besser an Systemgrenzen: Eingaben aus APIs, Formulare, strukturierte Modellantworten oder Daten, die zur Laufzeit validiert werden müssen.

| Bedarf | Empfehlung |
|---|---|
| Interner Graph-State | `TypedDict` |
| API-Input oder UI-Formular | Pydantic-Modell |
| Modellantwort mit Schema | Pydantic oder `with_structured_output()` |
| Message-Historie | `Annotated[list, add_messages]` |

Grenze: Ein großer State wirkt bequem, macht Graphen aber schwer testbar. Wenn jede Node auf dieselbe breite Datenstruktur zugreift, entstehen verdeckte Abhängigkeiten.

## Nodes Und Edges

Nodes sind normale Funktionen, die State lesen und Teil-State zurückgeben. Eine Node sollte eine fachliche Verantwortung haben: Modell aufrufen, Tool ausführen, Entscheidung vorbereiten, Ergebnis validieren oder Fehler behandeln.

```python
def agent_node(state: AgentState) -> dict:
    response = llm.invoke(state["messages"])
    return {"messages": [response]}


def tool_node(state: AgentState) -> dict:
    result = execute_tool(state["messages"][-1])
    return {"messages": [result]}
```

Edges verbinden Nodes. Der Graph sollte direkt nach dem Kompilieren visualisiert werden, weil falsche Kanten, vergessene Endpunkte oder ungewollte Schleifen so schneller auffallen als im Debugger.

```python
from IPython.display import Image, display
from langgraph.graph import END, START

graph_builder.add_node("agent", agent_node)
graph_builder.add_node("tools", tool_node)

graph_builder.add_edge(START, "agent")
graph_builder.add_edge("tools", "agent")
graph_builder.add_edge("agent", END)

graph = graph_builder.compile()

try:
    display(Image(graph.get_graph().draw_mermaid_png()))
except Exception as exc:
    print(f"Graph-Visualisierung nicht verfügbar: {exc}")
```

Typischer Fehler: In einer Node wird zu viel Logik gesammelt. Wenn eine Funktion Modellaufruf, Tool-Auswahl, Validierung und Fehlerbehandlung gleichzeitig übernimmt, ist der Graph nur noch optisch modular.

## Conditional Routing

Conditional Routing macht Entscheidungen explizit. Statt in einer großen Node mehrere Fälle zu verschachteln, entscheidet eine Routing-Funktion, welcher Pfad als Nächstes ausgeführt wird.

```python
from typing import Literal


def route_after_agent(state: AgentState) -> Literal["tools", "review", "__end__"]:
    last_message = state["messages"][-1]

    if has_tool_calls(last_message):
        return "tools"
    if needs_human_review(last_message):
        return "review"
    return "__end__"


graph_builder.add_conditional_edges(
    "agent",
    route_after_agent,
    {
        "tools": "tools",
        "review": "human_review",
        "__end__": END,
    },
)
```

In der Praxis relevant, wenn: Ein Workflow nicht nur erfolgreich oder fehlgeschlagen sein kann, sondern mehrere fachliche Zustände kennt. Beispiele sind Freigabe nötig, Daten fehlen, Tool fehlgeschlagen, Ergebnis ausreichend oder Eskalation erforderlich.

## Checkpointing Und Persistenz

Checkpointing speichert Graph-Zustand zwischen Ausführungsschritten. Das ist nicht nur ein Produktionsfeature. Schon im Kurs ist es hilfreich, wenn ein Workflow unterbrochen, inspiziert oder mit derselben `thread_id` fortgesetzt werden soll.

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
graph = graph_builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "demo-session-1"}}
result = graph.invoke(initial_state, config=config)
```

Für lokale Demos reicht ein In-Memory-Checkpointer. Für produktive Systeme braucht es einen persistenten Store und ein Löschkonzept. Besonders bei nutzerspezifischem Memory muss klar sein, welche Informationen nur zur Session gehören und welche dauerhaft gespeichert werden.

| Umgebung | Checkpointing |
|---|---|
| Notebook-Demo | `InMemorySaver` |
| Lokale Entwicklung | SQLite oder lokaler Store |
| Produktion | Datenbank-Checkpointer |
| Sensible Daten | Persistenz nur mit Lösch- und Zugriffskonzept |

Nicht geeignet, wenn: Checkpointing als Ersatz für gutes State-Design verstanden wird. Persistenz macht unklare Zustände nicht besser, sondern nur langlebiger.

## Human-in-the-Loop

Human-in-the-Loop wird nötig, wenn ein Agent schwer reversible Aktionen vorbereitet: E-Mails senden, Daten löschen, externe Systeme ändern, Zahlungen auslösen oder sensible Inhalte weitergeben. LangGraph macht solche Unterbrechungen explizit, statt sie als nachträglichen UI-Hack anzubauen.

```python
from langgraph.types import Command, interrupt


def approval_node(state: AgentState) -> dict:
    decision = interrupt(
        {
            "action": "send_email",
            "preview": state["messages"][-1].content,
        }
    )

    if decision["approved"]:
        return {"task_status": "approved"}
    return {"task_status": "rejected"}


graph_builder.add_node("approval", approval_node)
```

Nach einem Interrupt wird mit einem `Command` fortgesetzt. Wichtig ist, dass Interrupts stabil und vorhersehbar bleiben: dieselbe Node, dieselbe Reihenfolge, dieselbe erwartete Datenstruktur.

```python
resume_command = Command(resume={"approved": True})
result = graph.invoke(resume_command, config=config)
```

Typischer Fehler: Freigaben werden nur als Text im Prompt formuliert. Das Modell "weiß" dann zwar, dass es fragen soll, aber der Workflow erzwingt die Freigabe technisch nicht.

## Subgraphs Und Multi-Agent-Muster

Subgraphs helfen, große Workflows in kleinere Graphen zu zerlegen. Das ist sinnvoll, wenn ein Teilprozess eine eigene Struktur hat: Recherche, Validierung, Zusammenfassung, Review oder Eskalation.

```python
research_graph = research_builder.compile()
review_graph = review_builder.compile()

graph_builder.add_node("research", research_graph)
graph_builder.add_node("review", review_graph)
```

Multi-Agent-Systeme brauchen mehr als mehrere Modellaufrufe. Entscheidend ist die Koordination: Wer entscheidet über die nächste Aufgabe? Wer prüft Ergebnisse? Wann wird an einen anderen Agenten übergeben? Ohne klare Koordination entsteht schnell ein System, das viel kommuniziert, aber wenig verlässlich abschließt.

| Muster | Geeignet Wenn |
|---|---|
| Supervisor | Ein zentraler Agent verteilt Aufgaben |
| Handoff | Zuständigkeit wechselt zwischen spezialisierten Agenten |
| Hierarchie | Teams oder Teilgraphen eigene Verantwortung haben |
| Parallele Bearbeitung | unabhängige Teilaufgaben gleichzeitig laufen können |

Grenze: Multi-Agent ist selten der beste Einstieg. Erst wenn Rollen wirklich unterschiedliche Werkzeuge, Daten oder Bewertungskriterien haben, lohnt sich die zusätzliche Koordination.

## ToolRuntime Und ToolNode-Handoff

`ToolRuntime` ist relevant, wenn Tools Zugriff auf Laufzeitkontext brauchen, etwa `thread_id`, Store, Stream Writer oder Konfiguration. Einfache Tools sollten weiter einfach bleiben; Runtime-Kontext ist kein Standardargument für jede Funktion.

```python
from langchain_core.tools import tool


@tool
def lookup_customer(customer_id: str) -> str:
    """Fetch customer data by ID."""
    return customer_store.get(customer_id)
```

Bei komplexeren Tool-Flows kann ein Tool nicht nur Daten zurückgeben, sondern einen nächsten Graph-Schritt auslösen. Das ist nützlich für Handoffs, sollte aber sparsam eingesetzt werden, weil Routing dann teilweise aus dem Graph in Tool-Code wandert.

> [!WARNING] Routing Im Tool<br>
> Tool-Handoffs sind mächtig, aber sie verstecken Kontrollfluss leichter als `add_conditional_edges`. Für Kurs- und Review-Zwecke bleibt explizites Routing im Graph meist besser nachvollziehbar.

## Streaming Und Observability

Streaming macht sichtbar, was ein Graph gerade tut. Für Debugging sind Zwischenzustände oft wichtiger als die finale Antwort: Welche Node lief? Welche Tool-Calls wurden ausgeführt? Wo wurde unterbrochen?

```python
config = {"configurable": {"thread_id": "demo-session-1"}}

for event in graph.stream(initial_state, config=config, stream_mode="updates"):
    print(event)
```

| Stream Mode | Zweck |
|---|---|
| `updates` | Änderungen pro Node beobachten |
| `values` | vollständigen State nach Schritten sehen |
| `messages` | Token- oder Message-Ausgabe streamen |
| `debug` | detaillierte Debug-Informationen |

In produktiven Systemen gehört Tracing dazu. LangSmith oder ein vergleichbares Observability-Setup hilft, Graphläufe später zu untersuchen, Regressionen zu finden und Evals aus echten Fehlerfällen abzuleiten.

## Migration Von LangChain Zu LangGraph

Eine Migration ist sinnvoll, wenn ein bestehender Agent immer mehr Kontrolllogik bekommt: verschachtelte Bedingungen, manuelle Wiederaufnahme, separate Freigabeschritte, komplexe Fehlerbehandlung oder mehrere spezialisierte Rollen.

| Symptom | LangGraph-Nutzen |
|---|---|
| Bedingungen wachsen im Prompt | Routing wird Code |
| manuelle Session-Fortsetzung | Checkpointing übernimmt Resume |
| Freigaben sind nur Textregeln | Interrupts erzwingen Gates |
| mehrere Agenten koordinieren sich lose | Graph macht Zuständigkeiten sichtbar |
| Fehlerbehandlung verteilt sich über Tools | Error-Nodes bündeln Pfade |

Migration sollte schrittweise erfolgen. Zuerst wird der bestehende Ablauf als Graph modelliert, ohne das Verhalten fachlich zu ändern. Danach werden Routing, Checkpointing und Freigaben einzeln ergänzt und getestet.

## Production-Checkliste

- State als `TypedDict` modellieren.
- Message-Historie mit `add_messages` reduzieren lassen.
- Nodes klein halten und isoliert testen.
- Routing-Funktionen typisieren und benennen.
- Graph nach `compile()` visualisieren.
- Für längere Sessions Checkpointing aktivieren.
- Kritische Aktionen mit Interrupts absichern.
- Produktionsläufe streamen oder tracen.
- Multi-Agent-Muster nur einsetzen, wenn Rollen wirklich getrennte Verantwortung haben.
- Migrationen gegen bestehende Testfälle prüfen.

## Troubleshooting

### Problem: Der Graph ist nur eine große Node

**Symptom:** Eine Node enthält Modellaufruf, Tool-Auswahl, Validierung, Fehlerbehandlung und Routing.

**Fix:** Verantwortlichkeiten trennen. Modellaufruf, Tool-Ausführung, Entscheidung und Review gehören in eigene Nodes oder explizite Routing-Funktionen.

### Problem: State wächst unkontrolliert

**Symptom:** Jede Node liest und schreibt viele Felder, Abhängigkeiten sind im Review schwer nachvollziehbar.

**Fix:** State klein halten, temporäre Werte lokal lassen und nur langlebige Workflow-Daten aufnehmen.

### Problem: Resume funktioniert nicht zuverlässig

**Symptom:** Unterbrochene Läufe starten neu oder landen in falschen Zuständen.

**Fix:** Checkpointer aktivieren, stabile `thread_id` verwenden und Interrupts in fixer Reihenfolge halten.

## Weitere Ressourcen

- **LangGraph Docs**: <https://langchain-ai.github.io/langgraph/>
- **LangGraph Changelog**: <https://changelog.langchain.com/>
- **Multi-Agent Tutorial**: <https://langchain-ai.github.io/langgraph/tutorials/multi_agent/>
- **Checkpointing Guide**: <https://langchain-ai.github.io/langgraph/concepts/persistence/>
- **Human-in-the-Loop**: <https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/>

> [!TIP] Tipp<br>
> Mit einem linearen Agenten starten und erst zu LangGraph wechseln, wenn State, Routing, Checkpointing oder Freigaben echte Anforderungen sind. Das hält frühe Prototypen klein und macht die spätere Migration nachvollziehbar.

---

## Changelog

### Version 1.7 (Mai 2026)
- Zielstruktur an die Framework-Best-Practice-Dokumente angeglichen.
- Quick Start, Production-Checkliste und Troubleshooting ergänzt.

---

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [LangChain Best Practices](langchain-best-practices.html) | Welche LangChain-Patterns bilden die Grundlage für Graph-Workflows? |
| [LangSmith Best Practices](langsmith-best-practices.html) | Wie werden LangGraph-Runs beobachtet, verglichen und ausgewertet? |

---

**Version:** 1.7<br>
**Stand:** Mai 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.

