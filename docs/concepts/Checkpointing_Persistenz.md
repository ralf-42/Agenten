---
layout: default
title: Checkpointing & Persistenz
parent: Konzepte
nav_order: 7
description: "Zustandsspeicherung und Session-Persistenz in LangGraph"
has_toc: true
---

# Checkpointing & Persistenz
{: .no_toc }

> **Zustandsspeicherung und Session-Persistenz in LangGraph**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Überblick

In einem einfachen LangGraph-Workflow läuft eine Konversation vollständig im Arbeitsspeicher – sobald der Prozess endet, ist der gesamte State verloren. **Checkpointing** löst dieses Problem: Der State wird nach jedem Node-Schritt persistiert und kann jederzeit wiederhergestellt werden.

| Fähigkeit | Beschreibung |
|-----------|-------------|
| **Multi-Turn-Konversationen** | Nutzer können Gespräche unterbrechen und nahtlos fortsetzen |
| **Human-in-the-Loop** | Agent pausiert und wartet auf menschliche Eingabe |
| **Fehlertoleranz** | Bei Absturz läuft der Workflow vom letzten Checkpoint weiter |
| **Time Travel** | Zu einem früheren State zurückspringen und Workflow neu starten |

> [!INFO] **Checkpointing ist kein Logging.**     
> Es speichert den vollständigen State – nicht nur Protokolleinträge. Jeder gespeicherte Checkpoint ist ein vollständiger Snapshot, von dem aus der Workflow exakt fortgesetzt werden kann.

---

## Wie Checkpointing funktioniert

LangGraph speichert nach **jedem Node-Ausführungsschritt** einen Snapshot des States. Diese Snapshots sind nach Thread-ID und Checkpoint-ID adressierbar.

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

### Kernkonzepte

| Konzept | Beschreibung |
|---------|-------------|
| **Thread** | Eine Konversations-Sitzung, identifiziert durch `thread_id` |
| **Checkpoint** | Vollständiger Snapshot des States nach einem Node |
| **Checkpoint-ID** | Eindeutige ID jedes Snapshots |
| **Namespace** | Organisationseinheit für mehrere Threads |

### Thread-IDs

Jede Konversation erhält eine eindeutige `thread_id`. LangGraph speichert und lädt Checkpoints automatisch anhand dieser ID.

```python
# Erster Aufruf
config = {"configurable": {"thread_id": "nutzer-123-session-1"}}
result1 = app.invoke(
    {"messages": [{"role": "user", "content": "Mein Name ist Anna."}]},
    config=config
)

# Zweiter Aufruf – Kontext ist erhalten, da gleiche thread_id
result2 = app.invoke(
    {"messages": [{"role": "user", "content": "Wie heisse ich?"}]},
    config=config
)
# Antwort: "Du heisst Anna." – der Agent erinnert sich
```

---

## Checkpointer-Typen

LangGraph bietet verschiedene Checkpointer für unterschiedliche Anforderungen.

### MemorySaver – Entwicklung & Tests

```python
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)
```

| Eigenschaft | Wert |
|------------|------|
| **Persistenz** | Nein – verloren beim Neustart |
| **Performance** | Sehr schnell |
| **Einsatz** | Entwicklung, Tests, einfache Demos |
| **Setup** | Keine externe Abhängigkeit |

### SqliteSaver – Leichtgewichtige Persistenz

```python
from langgraph.checkpoint.sqlite import SqliteSaver

# Datei-basiert (persistent)
with SqliteSaver.from_conn_string("checkpoints.db") as checkpointer:
    app = graph.compile(checkpointer=checkpointer)
    result = app.invoke(inputs, config=config)
```

| Eigenschaft | Wert |
|------------|------|
| **Persistenz** | Ja – Datei bleibt erhalten |
| **Performance** | Gut für moderate Last |
| **Einsatz** | Prototypen, lokale Anwendungen |
| **Setup** | `pip install langgraph-checkpoint-sqlite` |

### AsyncSqliteSaver – Async-Anwendungen

```python
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

async with AsyncSqliteSaver.from_conn_string("checkpoints.db") as checkpointer:
    app = graph.compile(checkpointer=checkpointer)
    result = await app.ainvoke(inputs, config=config)
```

### PostgresSaver – Produktionsumgebungen

```python
from langgraph.checkpoint.postgres import PostgresSaver
import psycopg

with psycopg.connect("postgresql://user:pass@host/db") as conn:
    checkpointer = PostgresSaver(conn)
    checkpointer.setup()  # Erstellt notwendige Tabellen einmalig
    app = graph.compile(checkpointer=checkpointer)
```

| Eigenschaft | Wert |
|------------|------|
| **Persistenz** | Ja – vollständig persistent |
| **Performance** | Skalierbar, Multi-User-fähig |
| **Einsatz** | Produktionssysteme |
| **Setup** | `pip install langgraph-checkpoint-postgres` |

### Entscheidungshilfe

```mermaid
flowchart TD
    A{Persistenz nötig?}
    A -->|Nein| B[MemorySaver]
    A -->|Ja| C{Produktionsumgebung?}
    C -->|Nein| D[SqliteSaver]
    C -->|Ja| E{Async?}
    E -->|Ja| F[AsyncSqliteSaver + Postgres]
    E -->|Nein| G[PostgresSaver]
```

---

## Vollständiges Beispiel: Multi-Turn-Konversation

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

# Graph mit Checkpointing aufbauen
graph = StateGraph(ConversationState)
graph.add_node("chat", chat_node)
graph.add_edge(START, "chat")
graph.add_edge("chat", END)

checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)

# Erste Nachricht
config = {"configurable": {"thread_id": "user-42"}}
result = app.invoke(
    {"messages": [{"role": "user", "content": "Mein Name ist Anna."}]},
    config=config
)

# Zweite Nachricht – Kontext aus Checkpoint geladen
result = app.invoke(
    {"messages": [{"role": "user", "content": "Wie heisse ich?"}]},
    config=config
)
print(result["messages"][-1].content)
# "Du heisst Anna."
```

---

## Checkpoint-State abrufen

```python
# Aktuellen State eines Threads abrufen
state = app.get_state(config)
print(state.values)       # Aktueller State-Inhalt
print(state.next)         # Nächste geplante Nodes (bei Interrupt)
print(state.config)       # Aktuelle Konfiguration inkl. checkpoint_id

# Verlauf aller Checkpoints (neueste zuerst)
for checkpoint in app.get_state_history(config):
    cid = checkpoint.config["configurable"]["checkpoint_id"]
    n_msgs = len(checkpoint.values.get("messages", []))
    print(f"Checkpoint {cid}: {n_msgs} Nachrichten")
```

---

## Interrupt & Resume (Human-in-the-Loop)

Checkpointing ist die technische Basis für Human-in-the-Loop. Der Agent pausiert an einem definierten Punkt – der State bleibt gespeichert, bis ein Mensch antwortet.

```python
from langgraph.types import interrupt, Command

def kritische_aktion(state: ConversationState) -> ConversationState:
    """Node, der menschliche Bestätigung erfordert."""
    # interrupt() pausiert den Workflow und gibt Daten zurück
    entscheidung = interrupt({
        "frage": "Soll ich die E-Mail wirklich senden?",
        "empfaenger": "team@firma.de"
    })

    if entscheidung == "ja":
        return {"messages": [{"role": "assistant", "content": "E-Mail gesendet."}]}
    else:
        return {"messages": [{"role": "assistant", "content": "E-Mail abgebrochen."}]}

# Workflow starten – stoppt beim interrupt()
app.invoke(inputs, config=config)

# Mensch entscheidet und setzt Workflow fort
app.invoke(Command(resume="ja"), config=config)
```

```mermaid
flowchart LR
    A([START]) --> B[Aufgabe bearbeiten]
    B --> C{Kritische Aktion}
    C -->|interrupt| D[(Checkpoint\ngespeichert)]
    D --> E[Mensch entscheidet]
    E -->|resume| F[Aktion ausfuehren]
    F --> G([END])

    style D fill:#FFA500,color:#000
    style E fill:#87CEEB,color:#000
```

> [!WARNING] interrupt() erfordert einen Checkpointer    
> Ohne kompilierten Checkpointer wirft `interrupt()` eine Exception. Immer `graph.compile(checkpointer=...)` verwenden, wenn HITL genutzt wird.

---

## Time Travel: Zu früherem State zurückkehren

LangGraph ermöglicht es, zu einem früheren Checkpoint zurückzuspringen und den Workflow von dort neu zu starten.

```python
# Verlauf abrufen (neueste zuerst)
history = list(app.get_state_history(config))

# Früherer Checkpoint (z.B. vor einer Fehlerentscheidung)
earlier = history[3]

# Workflow vom früheren State aus neu starten
result = app.invoke(
    {"messages": [{"role": "user", "content": "Versuche es anders."}]},
    config=earlier.config  # Früherer Checkpoint als Ausgangspunkt
)
```

**Einsatzszenarien:**

| Szenario | Beschreibung |
|----------|-------------|
| **Fehlerkorrektur** | Fehlerhafte Entscheidung rückgängig machen |
| **Alternatives Routing** | Anderen Entscheidungspfad testen |
| **Debugging** | Agenten-Verhalten schrittweise analysieren |
| **A/B-Vergleich** | Zwei Antworten aus gleicher Ausgangssituation vergleichen |

---

## Best Practices

### Thread-ID-Design

> [!TIP] Thread-ID-Design für Multi-User    
> Für produktive Systeme: `thread_id = f"user_{user_id}_session_{session_id}"`. Generische IDs wie `"session1"` führen zu Datenvermischung zwischen Nutzern.

```python
# Eindeutige, nachvollziehbare Thread-IDs
thread_id = f"user_{user_id}_session_{session_id}"

# UUID für automatisch generierte IDs
import uuid
thread_id = str(uuid.uuid4())

# Nicht: zu generisch
# thread_id = "session1"  # Kollisionsgefahr
```

### State-Größe kontrollieren

Checkpoints speichern den gesamten State. Großer State bedeutet mehr Speicher und langsamere I/O.

```python
from langchain_core.messages import trim_messages

def trim_node(state: ConversationState) -> ConversationState:
    """Begrenzt die Nachrichten-History vor dem Checkpointing."""
    trimmed = trim_messages(
        state["messages"],
        max_tokens=4000,
        strategy="last",
        token_counter=llm,
    )
    return {"messages": trimmed}
```

### Checkpointer-Ressourcen korrekt schließen

```python
# Mit Context Manager (empfohlen)
with SqliteSaver.from_conn_string("db.sqlite") as checkpointer:
    app = graph.compile(checkpointer=checkpointer)
    result = app.invoke(inputs, config=config)
# Ressource wird automatisch freigegeben
```

---

## Häufige Fehler

### interrupt() ohne Checkpointer

```python
# Fehler
app = graph.compile()  # Kein Checkpointer
app.invoke(inputs, config=config)  # Wirft: "No checkpointer set"

# Richtig
app = graph.compile(checkpointer=MemorySaver())
```

### Gleiche thread_id für verschiedene Nutzer

```python
# Falsch: alle Nutzer teilen einen Thread
config = {"configurable": {"thread_id": "global"}}

# Richtig: pro Nutzer eigener Thread
config = {"configurable": {"thread_id": f"user_{user_id}"}}
```

### State direkt mutieren

```python
# Falsch: mutiert den gespeicherten State
def bad_node(state):
    state["messages"].append("neue Nachricht")
    return state

# Richtig: neue Werte als Return
def good_node(state):
    return {"messages": [{"role": "assistant", "content": "neue Nachricht"}]}
```

---

## Zusammenfassung

Checkpointing ist das technische Fundament für persistente, unterbrechbare Agenten-Workflows.

| Konzept | Kernaussage |
|---------|-------------|
| **MemorySaver** | Entwicklung & Tests – kein Setup, nicht persistent |
| **SqliteSaver** | Lokale Persistenz – einfach, dateibasiert |
| **PostgresSaver** | Produktion – skalierbar, multi-user-fähig |
| **Thread-ID** | Identifiziert eine Konversations-Sitzung eindeutig |
| **interrupt()** | Pausiert Workflow für menschliche Eingabe |
| **Time Travel** | Zu früherem State zurückspringen |

**Verwandte Konzepte:**

- [State Management](./State_Management.html) – Grundlagen der Zustandsverwaltung
- [Human-in-the-Loop](./Human_in_the_Loop.html) – Interrupt & Resume in der Praxis
- [Memory-Systeme](./Memory_Systeme.html) – Langfristige Gedächtnisstrukturen

## Abgrenzung zu verwandten Dokumenten

| Dokument | Inhalt |
|---|---|
| [State Management](https://ralf-42.github.io/Agenten/concepts/State_Management.html) | Definition und Struktur des States, der gespeichert wird |
| [Memory-Systeme](https://ralf-42.github.io/Agenten/concepts/Memory_Systeme.html) | Langzeitgedächtnis jenseits des Checkpoint-Scopes (semantisch, per User) |
| [Human-in-the-Loop](https://ralf-42.github.io/Agenten/concepts/Human_in_the_Loop.html) | Interrupt & Resume als Anwendungsfall von Checkpointing |


---

**Version:** 1.0
**Stand:** März 2026
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
