---
layout: default
title: State Management
parent: Konzepte
nav_order: 5
description: "Zustandsverwaltung in komplexen Workflows mit LangGraph"
has_toc: true
---

# State Management
{: .no_toc }

> **Zustandsverwaltung in komplexen Workflows mit LangGraph**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1 Kurzüberblick: Warum State Management?

Ein einfacher Chatbot benötigt keinen komplexen Zustand – die letzte Nachricht reicht. Doch sobald Workflows mehrere Schritte umfassen, Tools aufrufen oder Entscheidungen treffen, wird die **zentrale Verwaltung von Zustandsdaten** unverzichtbar.

Typische Herausforderungen ohne strukturiertes State Management:

| Problem | Auswirkung |
|---------|------------|
| Daten gehen zwischen Schritten verloren | Workflow bricht ab oder liefert falsche Ergebnisse |
| Unklare Datenstruktur | Fehler erst zur Laufzeit erkennbar |
| Parallele Änderungen | Überschreibungen und Inkonsistenzen |
| Debugging erschwert | Unklar, welcher Schritt welchen Zustand verändert hat |

**State Management löst diese Probleme durch:**

- **Zentrale Datenstruktur** – alle Komponenten arbeiten mit demselben State
- **Typisierung** – Fehler werden früh erkannt (IDE-Unterstützung, Autocomplete)
- **Reducer-Funktionen** – kontrollierte Aktualisierung (z.B. Nachrichten anhängen statt überschreiben)
- **Nachvollziehbarkeit** – jeder Schritt dokumentiert seine Änderungen

---

## 2 Grundkonzepte

### 2.1 Was ist "State"?

Der State ist ein **zentrales Datenobjekt**, das alle relevanten Informationen eines Workflows enthält. Er wird von Node zu Node weitergereicht und dabei transformiert.

```
[Node A] → State → [Node B] → State' → [Node C] → State'' → ...
```

### 2.2 Eigenschaften eines guten States

| Eigenschaft | Beschreibung |
|-------------|--------------|
| **Minimal** | Nur speichern, was tatsächlich benötigt wird |
| **Typisiert** | Klare Datentypen für jedes Feld |
| **Immutable-freundlich** | Änderungen erzeugen neue Versionen, kein Überschreiben |
| **Serialisierbar** | Für Checkpointing und Debugging speicherbar |

### 2.3 Beispiel: Einfacher Chat-State

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class ChatState(TypedDict):
    messages: Annotated[list, add_messages]  # Chat-Verlauf
    user_id: str                              # Benutzeridentifikation
    step_count: int                           # Zähler für Debugging
```

---

## 3 TypedDict vs. Pydantic

Für State-Definitionen stehen zwei Hauptansätze zur Verfügung. Die Wahl hängt vom Einsatzzweck ab.

### 3.1 TypedDict – Empfohlen für internen State

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class WorkflowState(TypedDict):
    messages: Annotated[list, add_messages]
    context: str
    approved: bool
```

**Vorteile:**
- Teil der Python-Standardbibliothek
- Kein Runtime-Overhead (keine Validierung)
- Perfekt für State Machines
- Von LangGraph empfohlen

### 3.2 Pydantic BaseModel – Für Schnittstellen

```python
from pydantic import BaseModel, Field

class UserInput(BaseModel):
    query: str = Field(description="Die Benutzerfrage")
    temperature: float = Field(default=0.7, ge=0, le=2)
```

**Vorteile:**
- Strikte Validierung zur Laufzeit
- Automatische Typkonvertierung
- Ideal für API-Eingaben und strukturierte LLM-Ausgaben

### 3.3 Entscheidungshilfe

| Kriterium | TypedDict | Pydantic |
|-----------|-----------|----------|
| **Performance** | ⭐⭐⭐ Schnell | ⭐⭐ Langsamer |
| **Validierung** | Keine (nur Typen) | Strikt zur Laufzeit |
| **LangGraph State** | ✅ Empfohlen | ⚠️ Möglich, aber Overhead |
| **LLM-Ausgaben** | ⚠️ Keine Validierung | ✅ `with_structured_output()` |
| **API-Eingaben** | ⚠️ Unsicher | ✅ Validiert automatisch |

**Faustregel:** TypedDict für Graph-State, Pydantic für Ein-/Ausgaben.

---

## 4 Reducer-Funktionen

{: .warning }
> **Ohne Reducer werden State-Werte überschrieben.** Jeder Node-Return ersetzt das gesamte Feld — bei `messages` gehen so alle vorherigen Nachrichten verloren. `Annotated[list, add_messages]` ist kein optionaler Komfort, sondern notwendig für korrektes State-Management.

Reducer bestimmen, **wie** State-Felder aktualisiert werden. Ohne Reducer wird ein Feld bei jeder Änderung überschrieben. Mit Reducer können Werte intelligent kombiniert werden.

### 4.1 Das Problem ohne Reducer

```python
# Ohne Reducer: Überschreiben
state = {"messages": ["Hallo"]}
# Node A gibt zurück:
{"messages": ["Wie geht's?"]}
# Ergebnis: messages = ["Wie geht's?"]  ← "Hallo" ist weg!
```

### 4.2 Die Lösung mit add_messages

```python
from typing import Annotated
from langgraph.graph.message import add_messages

class ChatState(TypedDict):
    messages: Annotated[list, add_messages]  # Reducer aktiviert

# Mit Reducer: Anhängen
state = {"messages": ["Hallo"]}
# Node A gibt zurück:
{"messages": ["Wie geht's?"]}
# Ergebnis: messages = ["Hallo", "Wie geht's?"]  ← Beide erhalten!
```

### 4.3 Eingebaute Reducer

| Reducer | Verhalten | Anwendung |
|---------|-----------|-----------|
| `add_messages` | Fügt Nachrichten hinzu, dedupliziert nach ID | Chat-Verläufe |
| `operator.add` | Addiert Werte (Listen, Zahlen) | Zähler, Log-Listen |

### 4.4 Beispiel: Eigener Reducer

```python
from typing import Annotated
import operator

class AnalysisState(TypedDict):
    messages: Annotated[list, add_messages]
    findings: Annotated[list, operator.add]  # Ergebnisse sammeln
    total_tokens: Annotated[int, operator.add]  # Token-Zähler addieren
```

### 4.5 Visualisierung: Reducer in Aktion

```
Initial State:
  messages: []
  findings: []
  total_tokens: 0

Nach Node 1:
  return {"messages": [msg1], "findings": ["Fund A"], "total_tokens": 100}
  
State nach Node 1:
  messages: [msg1]
  findings: ["Fund A"]
  total_tokens: 100

Nach Node 2:
  return {"messages": [msg2], "findings": ["Fund B", "Fund C"], "total_tokens": 150}

State nach Node 2:
  messages: [msg1, msg2]           ← add_messages
  findings: ["Fund A", "Fund B", "Fund C"]  ← operator.add
  total_tokens: 250                 ← operator.add (100 + 150)
```

---

## 5 State in LangGraph

LangGraph nutzt State als zentrales Element für Workflows. Jeder Node empfängt den aktuellen State und gibt Änderungen zurück.

### 5.1 Grundstruktur

```python
from langgraph.graph import StateGraph, START, END

# State definieren
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    current_task: str
    completed: bool

# Node-Funktion: Empfängt State, gibt Änderungen zurück
def process_node(state: AgentState) -> AgentState:
    # Lese aus State
    task = state["current_task"]
    
    # Verarbeite...
    result = do_something(task)
    
    # Gib NUR die Änderungen zurück
    return {
        "messages": [result],
        "completed": True
    }

# Graph erstellen
graph = StateGraph(AgentState)
graph.add_node("process", process_node)
graph.add_edge(START, "process")
graph.add_edge("process", END)

app = graph.compile()
```

### 5.2 Wichtige Prinzipien

**Nodes geben nur Änderungen zurück:**

```python
# ✅ Richtig: Nur geänderte Felder
def good_node(state: AgentState) -> AgentState:
    return {"completed": True}  # Nur was sich ändert

# ❌ Falsch: Gesamten State kopieren
def bad_node(state: AgentState) -> AgentState:
    return {
        "messages": state["messages"],  # Unnötig
        "current_task": state["current_task"],  # Unnötig
        "completed": True
    }
```

**State ist typsicher:**

```python
def typed_node(state: AgentState) -> AgentState:
    # IDE zeigt Autocomplete für state["..."]
    messages = state["messages"]  # ✅ Typ: list
    task = state["current_task"]  # ✅ Typ: str
    
    # Fehler werden früh erkannt
    # state["invalid_field"]  # ❌ IDE warnt
```

---

## 6 Praktische Beispiele

### 6.1 Beispiel: Mehrstufiger Analyse-Workflow

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain.chat_models import init_chat_model

# State mit mehreren Feldern
class AnalysisState(TypedDict):
    messages: Annotated[list, add_messages]
    document: str
    summary: str
    sentiment: str
    keywords: list[str]
    analysis_complete: bool

# LLM initialisieren
llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)

# Node 1: Zusammenfassung erstellen
def summarize_node(state: AnalysisState) -> AnalysisState:
    doc = state["document"]
    response = llm.invoke(f"Fasse zusammen: {doc}")
    return {"summary": response.content}

# Node 2: Sentiment analysieren
def sentiment_node(state: AnalysisState) -> AnalysisState:
    summary = state["summary"]
    response = llm.invoke(f"Bestimme das Sentiment: {summary}")
    return {"sentiment": response.content}

# Node 3: Keywords extrahieren
def keywords_node(state: AnalysisState) -> AnalysisState:
    doc = state["document"]
    response = llm.invoke(f"Extrahiere 5 Keywords: {doc}")
    keywords = response.content.split(", ")
    return {"keywords": keywords, "analysis_complete": True}

# Graph aufbauen
graph = StateGraph(AnalysisState)
graph.add_node("summarize", summarize_node)
graph.add_node("sentiment", sentiment_node)
graph.add_node("keywords", keywords_node)

graph.add_edge(START, "summarize")
graph.add_edge("summarize", "sentiment")
graph.add_edge("sentiment", "keywords")
graph.add_edge("keywords", END)

app = graph.compile()

# Ausführen
initial_state = {
    "messages": [],
    "document": "Ein langer Text...",
    "summary": "",
    "sentiment": "",
    "keywords": [],
    "analysis_complete": False
}

result = app.invoke(initial_state)
```

### 6.2 Beispiel: Bedingtes Routing basierend auf State

```python
class RouterState(TypedDict):
    messages: Annotated[list, add_messages]
    query_type: str  # "technical", "billing", "general"
    response: str

def classify_node(state: RouterState) -> RouterState:
    # Klassifiziere die Anfrage
    query = state["messages"][-1].content
    # ... Klassifizierungslogik ...
    return {"query_type": "technical"}

def route_by_type(state: RouterState) -> str:
    """Routing-Funktion: Liest State und gibt Ziel-Node zurück."""
    query_type = state["query_type"]
    
    if query_type == "technical":
        return "tech_agent"
    elif query_type == "billing":
        return "billing_agent"
    else:
        return "general_agent"

# Graph mit bedingtem Routing
graph = StateGraph(RouterState)
graph.add_node("classify", classify_node)
graph.add_node("tech_agent", tech_handler)
graph.add_node("billing_agent", billing_handler)
graph.add_node("general_agent", general_handler)

graph.add_edge(START, "classify")
graph.add_conditional_edges(
    "classify",
    route_by_type,
    {
        "tech_agent": "tech_agent",
        "billing_agent": "billing_agent",
        "general_agent": "general_agent"
    }
)
```

---

## 7 Best Practices

### 7.1 State-Design

| Empfehlung | Begründung |
|------------|------------|
| **Flache Strukturen bevorzugen** | Einfacher zu debuggen und serialisieren |
| **Aussagekräftige Feldnamen** | `user_query` statt `q` |
| **Optionale Felder vermeiden** | Lieber Defaults setzen |
| **Keine sensiblen Daten** | PII gehört nicht in den State |

### 7.2 Reducer-Nutzung

```python
# ✅ Empfohlen: Reducer für akkumulierende Felder
class GoodState(TypedDict):
    messages: Annotated[list, add_messages]
    logs: Annotated[list, operator.add]
    
# ⚠️ Vorsicht: Ohne Reducer werden Werte überschrieben
class RiskyState(TypedDict):
    messages: list  # Kann unbeabsichtigt überschrieben werden
```

### 7.3 Node-Design

```python
# ✅ Node gibt nur Änderungen zurück
def good_node(state: MyState) -> MyState:
    new_value = process(state["input"])
    return {"output": new_value}

# ✅ Fehlerbehandlung im Node
def safe_node(state: MyState) -> MyState:
    try:
        result = risky_operation()
        return {"result": result, "error": None}
    except Exception as e:
        return {"result": None, "error": str(e)}
```

### 7.4 Debugging

```python
# State-Änderungen loggen
def debug_node(state: MyState) -> MyState:
    print(f"[DEBUG] Eingehender State: {state}")
    
    result = process(state)
    
    print(f"[DEBUG] Rückgabe: {result}")
    return result
```

---

## 8 Häufige Fehler

### 8.1 Fehler: Gesamten State zurückgeben

```python
# ❌ Falsch
def bad_node(state: MyState) -> MyState:
    state["new_field"] = "value"
    return state  # Gibt alles zurück, auch Ungeändertes

# ✅ Richtig
def good_node(state: MyState) -> MyState:
    return {"new_field": "value"}  # Nur die Änderung
```

### 8.2 Fehler: Reducer vergessen

```python
# ❌ Problem: Nachrichten werden überschrieben
class BadState(TypedDict):
    messages: list  # Kein Reducer!

# ✅ Lösung: add_messages verwenden
class GoodState(TypedDict):
    messages: Annotated[list, add_messages]
```

### 8.3 Fehler: State mutieren statt neue Werte zurückgeben

```python
# ❌ Falsch: In-Place-Mutation
def mutating_node(state: MyState) -> MyState:
    state["items"].append("new")  # Mutiert Original!
    return {"items": state["items"]}

# ✅ Richtig: Neue Liste erstellen
def pure_node(state: MyState) -> MyState:
    new_items = state["items"] + ["new"]  # Neue Liste
    return {"items": new_items}
```

### 8.4 Fehler: Untypisierter State

```python
# ❌ Falsch: dict ohne Typen
graph = StateGraph(dict)  # Keine IDE-Unterstützung

# ✅ Richtig: TypedDict mit Typen
class TypedState(TypedDict):
    messages: Annotated[list, add_messages]
    count: int

graph = StateGraph(TypedState)  # Volle IDE-Unterstützung
```

---

## 9 Zusammenfassung

State Management bildet das Rückgrat komplexer KI-Workflows. Die wichtigsten Punkte:

| Konzept | Kernaussage |
|---------|-------------|
| **State** | Zentrales Datenobjekt für alle Workflow-Informationen |
| **TypedDict** | Empfohlen für Graph-State (leichtgewichtig, typsicher) |
| **Pydantic** | Für Ein-/Ausgaben und LLM-Strukturierung |
| **Reducer** | Kontrollieren, wie Felder aktualisiert werden |
| **add_messages** | Standard-Reducer für Chat-Verläufe |
| **Nodes** | Geben nur Änderungen zurück, nicht den gesamten State |

### 9.1 Quick Reference

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

# State definieren
class MyState(TypedDict):
    messages: Annotated[list, add_messages]
    data: str

# Node erstellen
def my_node(state: MyState) -> MyState:
    return {"data": "processed"}

# Graph bauen
graph = StateGraph(MyState)
graph.add_node("process", my_node)
graph.add_edge(START, "process")
graph.add_edge("process", END)

app = graph.compile()

# Ausführen
result = app.invoke({"messages": [], "data": ""})
```

---

**Version:** 1.0  
**Stand:** November 2025  
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
