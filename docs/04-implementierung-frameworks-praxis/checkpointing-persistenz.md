---
layout: default
title: Checkpointing & Persistenz
parent: "Implementierung: Frameworks & Praxis"
nav_order: 16
description: Checkpointing und Persistenz in LangGraph für unterbrechbare und wiederaufnehmbare Agenten-Workflows
has_toc: true
---

# Checkpointing & Persistenz
{: .no_toc }

> **Checkpointing speichert nicht nur Nachrichten, sondern den Arbeitszustand eines Agenten.**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Warum Checkpointing überhaupt gebraucht wird

Ein einfacher Workflow im Arbeitsspeicher funktioniert nur so lange, wie der Prozess läuft und niemand den Ablauf unterbricht. Sobald ein Agent mehrere Schritte ausführt, auf menschliche Freigabe warten soll oder nach einem Fehler wieder an derselben Stelle weitermachen muss, reicht flüchtiger Speicher nicht mehr aus. Genau hier beginnt Checkpointing.

Checkpointing speichert den Zustand eines Graphen nach einzelnen Ausführungsschritten, sodass dieser Zustand später wieder geladen werden kann. Damit werden längere Gespräche, Human-in-the-Loop, Fehlertoleranz und das Zurückspringen zu früheren Punkten erst praktikabel.

Typischer Fehler: Checkpointing mit Logging zu verwechseln. Logs beschreiben, was passiert ist. Checkpoints speichern, von wo aus ein Workflow exakt weiterlaufen kann.

## Ein einfaches Kursbeispiel

Ein Agent beantwortet nicht nur Fragen, sondern soll bei einer kritischen Aktion auf Freigabe warten. Ohne Persistenz wäre der Zustand zwischen Anfrage und Freigabe verloren, sobald der Prozess endet oder neu startet. Mit Checkpointing bleibt der Graph an genau dieser Stelle erhalten.

Dasselbe gilt für längere Konversationen. Wenn ein Nutzer zuerst den eigenen Namen nennt und später danach fragt, muss dieser Zustand an eine Sitzung gebunden bleiben. In LangGraph geschieht das über Threads und Checkpoints.

## Was ein Checkpoint in LangGraph eigentlich ist

LangGraph speichert nach Ausführung eines Knotens einen Snapshot des aktuellen States. Dieser Snapshot gehört zu einer bestimmten Sitzung und kann später wieder aufgerufen werden. Praktisch entsteht dadurch eine Folge gespeicherter Zustände, über die ein Workflow nicht nur vorwärts, sondern im Bedarfsfall auch rückwärts nachvollziehbar wird.

```mermaid
flowchart LR
    S([START]) --> N1[Node A]
    N1 -->|Checkpoint 1| N2[Node B]
    N2 -->|Checkpoint 2| N3[Node C]
    N3 -->|Checkpoint 3| E([END])

    CP1[(Checkpoint 1)] -.->|gespeichert| N1
    CP2[(Checkpoint 2)] -.->|gespeichert| N2
    CP3[(Checkpoint 3)] -.->|gespeichert| N3
```

Für den Einstieg genügen vier Begriffe. Ein Thread ist eine Sitzung, typischerweise identifiziert durch eine `thread_id`. Ein Checkpoint ist ein gespeicherter Snapshot dieses States. Jede gespeicherte Version besitzt eine eigene Checkpoint-ID. Ein Namespace dient zur zusätzlichen organisatorischen Trennung mehrerer Thread-Gruppen.

| Begriff | Bedeutung |
|---|---|
| Thread | eine Sitzung oder Konversation |
| Checkpoint | gespeicherter Snapshot des States |
| Checkpoint-ID | eindeutige Kennung eines Snapshots |
| Namespace | organisatorische Trennung mehrerer Thread-Bereiche |

## Warum die Thread-ID entscheidend ist

Die `thread_id` entscheidet, ob ein neuer Aufruf als Fortsetzung oder als neue Sitzung behandelt wird. Wird dieselbe ID erneut verwendet, lädt LangGraph den dazugehörigen Verlauf. Wird eine andere ID verwendet, beginnt ein neuer Thread.

```python
config = {"configurable": {"thread_id": "nutzer-123-session-1"}}

result1 = app.invoke(
    {"messages": [{"role": "user", "content": "Mein Name ist Anna."}]},
    config=config
)

result2 = app.invoke(
    {"messages": [{"role": "user", "content": "Wie heisse ich?"}]},
    config=config
)
```

In diesem einfachen Beispiel bleibt der Gesprächskontext erhalten, weil beide Aufrufe dieselbe Thread-ID verwenden. Genau daran hängen in der Praxis Sitzungsfortsetzung, Zuordnung zu Nutzern und spätere Wiederaufnahme.

In der Praxis relevant, wenn: Mehrere Nutzer gleichzeitig arbeiten, Sessions unterbrochen werden oder eine Konversation nicht nach einem einzigen Request endet.

## Welche Checkpointer-Typen es gibt

LangGraph bietet unterschiedliche Checkpointer für unterschiedliche Reifestufen eines Projekts. Für erste Demos reicht In-Memory-Speicherung. Für lokale Prototypen ist SQLite oft ausreichend. Für produktive Umgebungen mit mehreren Nutzern wird typischerweise eine persistente Datenbank wie PostgreSQL benötigt.

### MemorySaver

`MemorySaver` ist schnell und ohne externe Abhängigkeit nutzbar, verliert aber alle Daten beim Neustart. Deshalb eignet er sich gut für Entwicklung, Tests und kleine Demos, aber nicht für echte Sitzungsfortsetzung nach Prozessende.

```python
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)
```

### SqliteSaver

`SqliteSaver` speichert Checkpoints dateibasiert und ist damit ein sinnvoller Zwischenschritt für lokale Anwendungen oder Prototypen. Der Einrichtungsaufwand bleibt niedrig, die Persistenz ist aber bereits real.

```python
from langgraph.checkpoint.sqlite import SqliteSaver

with SqliteSaver.from_conn_string("checkpoints.db") as checkpointer:
    app = graph.compile(checkpointer=checkpointer)
    result = app.invoke(inputs, config=config)
```

### AsyncSqliteSaver und PostgresSaver

Für asynchrone Anwendungen gibt es `AsyncSqliteSaver`. Für produktive Mehrnutzerumgebungen ist `PostgresSaver` meist die naheliegende Wahl, weil Persistenz, Skalierung und paralleler Zugriff dort besser aufgehoben sind.

```python
from langgraph.checkpoint.postgres import PostgresSaver
import psycopg

with psycopg.connect("postgresql://user:pass@host/db") as conn:
    checkpointer = PostgresSaver(conn)
    checkpointer.setup()
    app = graph.compile(checkpointer=checkpointer)
```

| Checkpointer | Geeignet für | Grenze |
|---|---|---|
| MemorySaver | Entwicklung, Tests, Demos | kein Zustand nach Neustart |
| SqliteSaver | lokale Prototypen, kleinere Anwendungen | begrenzter als echte Produktionsdatenbank |
| PostgresSaver | Produktionssysteme, mehrere Nutzer | höherer Betriebsaufwand |

## Eine einfache Entscheidungshilfe

```mermaid
flowchart TD
    A{Persistenz nötig?}
    A -->|Nein| B[MemorySaver]
    A -->|Ja| C{Produktionsumgebung?}
    C -->|Nein| D[SqliteSaver]
    C -->|Ja| E[PostgresSaver]
```

Nicht geeignet, wenn: Ein In-Memory-Checkpointer für einen produktiven Agenten mit echter Sitzungsfortsetzung oder HITL-Freigaben eingesetzt wird. Dann wäre der zentrale Vorteil von Checkpointing beim Neustart sofort verloren.

## Ein vollständiges Beispiel für eine Multi-Turn-Konversation

Das folgende Minimalbeispiel zeigt, wie ein Checkpointer an einen einfachen Chat-Graphen gebunden wird. Die eigentliche Fachlogik ist klein. Entscheidend ist, dass die Sitzung über die `thread_id` wiedergefunden werden kann.

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langchain.chat_models import init_chat_model

class ConversationState(TypedDict):
    messages: Annotated[list, add_messages]

llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)

def chat_node(state: ConversationState) -> ConversationState:
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

graph = StateGraph(ConversationState)
graph.add_node("chat", chat_node)
graph.add_edge(START, "chat")
graph.add_edge("chat", END)

checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "user-42"}}

app.invoke(
    {"messages": [{"role": "user", "content": "Mein Name ist Anna."}]},
    config=config
)

result = app.invoke(
    {"messages": [{"role": "user", "content": "Wie heisse ich?"}]},
    config=config
)
```

Dieses Beispiel ist didaktisch einfach, aber es zeigt den Kern: Der zweite Aufruf setzt denselben Thread fort, statt neu zu beginnen.

## Den aktuellen State und die Historie abrufen

Checkpointing wird besonders nützlich, wenn der gespeicherte Zustand nicht nur implizit genutzt, sondern auch aktiv inspiziert wird. LangGraph erlaubt es, den aktuellen State eines Threads abzurufen und frühere Checkpoints durchzugehen.

```python
state = app.get_state(config)
print(state.values)
print(state.next)
print(state.config)

for checkpoint in app.get_state_history(config):
    cid = checkpoint.config["configurable"]["checkpoint_id"]
    n_msgs = len(checkpoint.values.get("messages", []))
    print(f"Checkpoint {cid}: {n_msgs} Nachrichten")
```

Gerade für Debugging, Nachvollziehbarkeit und spätere Fehleranalyse ist diese Sicht oft wichtiger als eine bloße Erfolgs- oder Fehlermeldung.

## Warum Human-in-the-Loop ohne Checkpointing nicht sauber funktioniert

Sobald ein Agent an einer kritischen Stelle pausieren und auf eine menschliche Entscheidung warten soll, braucht der Workflow eine persistente Stelle zum Anhalten. `interrupt()` ist genau dafür gedacht. Der Graph stoppt, der State bleibt erhalten und kann später mit einer Entscheidung fortgesetzt werden.

```python
from langgraph.types import interrupt, Command

def kritische_aktion(state: ConversationState) -> ConversationState:
    entscheidung = interrupt({
        "frage": "Soll ich die E-Mail wirklich senden?",
        "empfaenger": "team@firma.de"
    })

    if entscheidung == "ja":
        return {"messages": [{"role": "assistant", "content": "E-Mail gesendet."}]}
    return {"messages": [{"role": "assistant", "content": "E-Mail abgebrochen."}]}

app.invoke(inputs, config=config)
app.invoke(Command(resume="ja"), config=config)
```

```mermaid
flowchart LR
    A([START]) --> B[Aufgabe bearbeiten]
    B --> C{Kritische Aktion}
    C -->|interrupt| D[(Checkpoint gespeichert)]
    D --> E[Mensch entscheidet]
    E -->|resume| F[Aktion ausfuehren]
    F --> G([END])
```

> [!WARNING] interrupt() braucht einen Checkpointer<br>
> Ohne kompilierten Checkpointer kann ein unterbrochener Workflow nicht zuverlässig wieder aufgenommen werden. `graph.compile(checkpointer=...)` ist dafür zwingend.

## Time Travel: warum frühere Zustände nützlich sind

Ein gespeicherter Verlauf ist nicht nur für Fortsetzung interessant. Er ermöglicht auch, zu einem früheren Punkt zurückzugehen und von dort einen neuen Pfad zu testen. Genau deshalb wird in LangGraph oft von Time Travel gesprochen.

```python
history = list(app.get_state_history(config))
earlier = history[3]

result = app.invoke(
    {"messages": [{"role": "user", "content": "Versuche es anders."}]},
    config=earlier.config
)
```

Typische Anwendungsfälle sind Fehlerkorrektur, alternatives Routing, schrittweises Debugging oder der Vergleich zweier Varianten aus derselben Ausgangslage.

## Was in der Praxis schnell schiefgeht

Eine häufige Fehlerquelle ist eine zu generische `thread_id`. Wenn mehrere Nutzer versehentlich denselben Thread teilen, vermischen sich Zustände. Ebenso problematisch ist es, einen Checkpointer zu vergessen und dann `interrupt()` zu verwenden. Auch direkte Mutation des States ist riskant, weil dadurch schwer nachvollziehbare Seiteneffekte entstehen können.

```python
# Falsch: alle Nutzer teilen einen Thread
config = {"configurable": {"thread_id": "global"}}

# Richtig: pro Nutzer oder Session eigener Thread
config = {"configurable": {"thread_id": f"user_{user_id}"}}
```

```python
# Falsch: State direkt mutieren
def bad_node(state):
    state["messages"].append("neue Nachricht")
    return state

# Richtig: neue Werte zurückgeben
def good_node(state):
    return {"messages": [{"role": "assistant", "content": "neue Nachricht"}]}
```

## Best Practices für Entwicklerprojekte

Thread-IDs sollten eindeutig und nachvollziehbar sein. Der State sollte nicht unnötig groß werden, weil jeder Checkpoint den gesamten Zustand speichert. Deshalb kann es sinnvoll sein, ältere Nachrichten vor dem Speichern zu kürzen oder zu verdichten. Datenbank-Checkpointer sollten sauber über Context Manager geöffnet und geschlossen werden.

```python
from langchain_core.messages import trim_messages

def trim_node(state: ConversationState) -> ConversationState:
    trimmed = trim_messages(
        state["messages"],
        max_tokens=4000,
        strategy="last",
        token_counter=llm,
    )
    return {"messages": trimmed}
```

```python
with SqliteSaver.from_conn_string("db.sqlite") as checkpointer:
    app = graph.compile(checkpointer=checkpointer)
    result = app.invoke(inputs, config=config)
```

In der Praxis relevant, wenn: Multi-Turn-Sitzungen wachsen, viele Nachrichten im State liegen oder mehrere Nutzer gleichzeitig mit demselben System arbeiten.

## Was für Entwickler zuerst wichtig ist

Für den Einstieg reicht meist schon ein klares mentales Modell: Ein Checkpointer macht aus einem flüchtigen Ablauf eine wiederaufnehmbare Sitzung. Wer Multi-Turn-Gespräche, HITL-Freigaben oder Fehlertoleranz bauen will, braucht diese Grundlage früh.

Entwickler unterschätzen oft, dass Checkpointing kein Luxus für große Produktionssysteme ist. Schon kleine Kursprojekte mit Unterbrechung, Freigabe oder Sitzungsfortsetzung profitieren sofort davon.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [State Management]({{ '/04-implementierung-frameworks-praxis/state-management.html' | relative_url }}) | Wie ist der State aufgebaut, der durch Checkpoints gespeichert wird? |
| [Memory-Systeme]({{ '/04-implementierung-frameworks-praxis/memory-systeme.html' | relative_url }}) | Wie unterscheidet sich langfristiges Gedächtnis von sitzungsbezogener Persistenz? |
| [Human-in-the-Loop]({{ '/04-implementierung-frameworks-praxis/human-in-the-loop.html' | relative_url }}) | Wie werden Unterbrechung, Freigabe und Wiederaufnahme praktisch gestaltet? |

---

**Version:** 1.1<br>
**Stand:** April 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.





