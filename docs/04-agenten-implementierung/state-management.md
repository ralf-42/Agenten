---
layout: default
title: State Management
parent: Agenten-Implementierung
nav_order: 9
description: "Zustandsverwaltung in LangGraph: State, Reducer, TypedDict und Routing für mehrstufige Workflows"
has_toc: true
---

# State Management
{: .no_toc }

> **State Management hält zusammen, was ein mehrstufiger Workflow wissen muss.**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Warum State Management überhaupt nötig ist

Ein einfacher Chat mit einer einzelnen Anfrage braucht kaum mehr als die letzte Nachricht. Sobald ein Agent aber mehrere Schritte ausführt, Tools aufruft, Entscheidungen vorbereitet oder zwischen verschiedenen Pfaden routet, reicht ein loses Weiterreichen einzelner Variablen nicht mehr aus. Dann muss klar sein, welche Informationen an welcher Stelle vorhanden sind und wie sie sich verändern dürfen.

Genau das leistet State Management. Es bündelt die relevanten Daten eines Workflows in einer zentralen Struktur, die von Schritt zu Schritt mitgeführt wird. Ohne diese Struktur gehen Informationen verloren, werden versehentlich überschrieben oder lassen sich später kaum noch debuggen.

Typischer Fehler: State nur als technische Nebensache zu behandeln. In der Praxis entscheidet die Qualität des State-Designs oft darüber, ob ein LangGraph-Workflow nachvollziehbar oder fragil wird.

## Ein einfaches Beispiel

Ein Support-Agent soll eine Anfrage klassifizieren, dann entweder an einen Technikpfad oder einen Rechnungs-Pfad weiterleiten und am Ende eine Antwort erzeugen. Dafür muss er mindestens wissen, welche Nachricht zuletzt einging, welcher Typ erkannt wurde und ob die Bearbeitung bereits abgeschlossen ist. Diese Informationen entstehen nicht alle auf einmal. Sie werden während des Workflows aufgebaut.

Genau deshalb braucht ein Agent einen State. Er ist das gemeinsame Arbeitsgedächtnis des Graphen. Jeder Knoten liest daraus, was bisher bekannt ist, und schreibt zurück, was neu hinzugekommen ist.

## Was mit „State“ gemeint ist

Der State ist das zentrale Datenobjekt eines Workflows. Er enthält die Informationen, die ein Agent oder Graph zwischen Knoten behalten muss. Ein Knoten liest daraus relevante Felder, verarbeitet sie und gibt anschließend nur die Änderungen zurück.

```text
[Node A] -> State -> [Node B] -> State' -> [Node C] -> State'' -> ...
```

Ein guter State ist nicht einfach nur groß, sondern passend zugeschnitten. Er speichert nur, was wirklich benötigt wird, ist typisiert, bleibt möglichst serialisierbar und vermeidet unnötige Seiteneffekte.

| Eigenschaft | Warum sie wichtig ist |
|---|---|
| Minimal | unnötige Daten machen Debugging und Persistenz schwerer |
| Typisiert | Fehler werden früher sichtbar |
| Serialisierbar | State muss für Checkpointing speicherbar bleiben |
| Änderungsfreundlich | Knoten sollen gezielt neue Werte zurückgeben können |

## Ein erster State in LangGraph

Ein einfacher Chat-State kann bereits mehrere nützliche Felder enthalten: Nachrichtenverlauf, Benutzerkennung und einen kleinen Zähler oder Statuswert. Damit wird sichtbar, dass State mehr ist als nur `messages`.

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class ChatState(TypedDict):
    messages: Annotated[list, add_messages]
    user_id: str
    step_count: int
```

Dieses Muster ist für Entwickler besonders hilfreich, weil es klar trennt zwischen Gesprächsverlauf und zusätzlichen Ablaufdaten.

## Warum TypedDict für den Graph-State meist die beste Wahl ist

Für den internen State eines LangGraph-Workflows ist `TypedDict` in der Regel die beste Wahl. Es ist leichtgewichtig, gehört zur Standardbibliothek und reicht aus, um dem Code klare Feldnamen und Typen zu geben. Gerade in mehrstufigen Graphen hilft das enorm bei Lesbarkeit und IDE-Unterstützung.

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class WorkflowState(TypedDict):
    messages: Annotated[list, add_messages]
    context: str
    approved: bool
```

Pydantic ist dagegen besonders nützlich an Schnittstellen, also bei API-Eingaben oder strukturierten LLM-Ausgaben. Dort zählt Laufzeitvalidierung stärker als maximale Leichtgewichtigkeit.

```python
from pydantic import BaseModel, Field

class UserInput(BaseModel):
    query: str = Field(description="Die Benutzerfrage")
    temperature: float = Field(default=0.7, ge=0, le=2)
```

| Einsatz | Naheliegende Wahl |
|---|---|
| Interner Graph-State | TypedDict |
| API-Eingaben | Pydantic |
| Strukturierte LLM-Ausgabe | Pydantic |

> [!TIP] Faustregel<br>
> TypedDict für den laufenden Graphen, Pydantic für valide Ein- und Ausgaben.

## Reducer: warum Werte nicht einfach überschrieben werden dürfen

Sobald mehrere Knoten an denselben Feldern arbeiten, reicht ein einfaches „letzter Wert gewinnt“ oft nicht mehr aus. Genau hier kommen Reducer ins Spiel. Sie bestimmen, wie neue Werte mit bestehenden Werten kombiniert werden.

Ohne Reducer wird ein Feld bei jeder Rückgabe ersetzt. Für Nachrichtenverläufe ist das fast immer falsch, weil sonst frühere Nachrichten verloren gehen.

```python
# Ohne Reducer
state = {"messages": ["Hallo"]}
return_value = {"messages": ["Wie geht's?"]}
# Ergebnis: ["Wie geht's?"]  # die erste Nachricht ist weg
```

Mit `add_messages` verhält sich das Feld wie ein kontrolliert wachsender Verlauf.

```python
from typing import Annotated
from langgraph.graph.message import add_messages

class ChatState(TypedDict):
    messages: Annotated[list, add_messages]
```

> [!WARNING] Reducer sind kein Detail<br>
> Bei Feldern wie `messages` ist ein passender Reducer keine Komfortfunktion, sondern notwendig, damit der Graph korrekt arbeitet.

## Welche Reducer typischerweise gebraucht werden

Für Chat-Verläufe wird meist `add_messages` verwendet. Für Zähler, Listen von Funden oder Log-Einträge reicht oft `operator.add`. Damit lassen sich Ergebnisse akkumulieren, statt sie bei jedem Schritt zu überschreiben.

```python
from typing import Annotated
import operator

class AnalysisState(TypedDict):
    messages: Annotated[list, add_messages]
    findings: Annotated[list, operator.add]
    total_tokens: Annotated[int, operator.add]
```

Der praktische Effekt ist einfach: Ein Knoten fügt neue Findings hinzu, statt die vorhandenen zu ersetzen. Ein Token-Zähler wächst weiter, statt bei jedem Schritt neu zu starten.

## Wie ein Knoten mit State arbeitet

In LangGraph empfängt jeder Knoten den aktuellen State und gibt danach nur die Änderungen zurück. Genau dieses Prinzip hält den Workflow übersichtlich.

```python
from langgraph.graph import StateGraph, START, END

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    current_task: str
    completed: bool

def process_node(state: AgentState) -> AgentState:
    task = state["current_task"]
    result = do_something(task)
    return {
        "messages": [result],
        "completed": True
    }

graph = StateGraph(AgentState)
graph.add_node("process", process_node)
graph.add_edge(START, "process")
graph.add_edge("process", END)

app = graph.compile()
```

Typischer Fehler: Den gesamten State zurückzugeben oder ihn direkt zu mutieren, obwohl sich nur ein Feld geändert hat. Dadurch wird der Code unnötig unübersichtlich und kann spätere Checkpoints oder Reducer-Mechanismen stören.

## Ein mehrstufiger Analyse-Workflow

Ein gutes Kursbeispiel ist ein Workflow, der ein Dokument zusammenfasst, danach ein Sentiment bestimmt und am Ende Schlüsselwörter extrahiert. Hier zeigt sich, dass verschiedene Knoten nacheinander auf unterschiedliche Felder desselben States aufbauen.

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain.chat_models import init_chat_model

class AnalysisState(TypedDict):
    messages: Annotated[list, add_messages]
    document: str
    summary: str
    sentiment: str
    keywords: list[str]
    analysis_complete: bool

llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)

def summarize_node(state: AnalysisState) -> AnalysisState:
    response = llm.invoke(f"Fasse zusammen: {state['document']}")
    return {"summary": response.content}

def sentiment_node(state: AnalysisState) -> AnalysisState:
    response = llm.invoke(f"Bestimme das Sentiment: {state['summary']}")
    return {"sentiment": response.content}

def keywords_node(state: AnalysisState) -> AnalysisState:
    response = llm.invoke(f"Extrahiere 5 Keywords: {state['document']}")
    keywords = response.content.split(", ")
    return {"keywords": keywords, "analysis_complete": True}
```

An diesem Beispiel lässt sich gut zeigen, dass State Management nicht abstrakt ist. Ohne das Feld `summary` könnte der nächste Schritt nicht sauber auf dem Ergebnis des ersten aufbauen.

## Routing funktioniert über State

State ist nicht nur Speicher, sondern auch Entscheidungsgrundlage. Wenn ein Workflow nach einer Klassifikation unterschiedlich weiterlaufen soll, liest die Routing-Funktion den aktuellen State und entscheidet den nächsten Pfad.

```python
class RouterState(TypedDict):
    messages: Annotated[list, add_messages]
    query_type: str
    response: str

def classify_node(state: RouterState) -> RouterState:
    query = state["messages"][-1].content
    return {"query_type": "technical"}

def route_by_type(state: RouterState) -> str:
    if state["query_type"] == "technical":
        return "tech_agent"
    elif state["query_type"] == "billing":
        return "billing_agent"
    return "general_agent"
```

In der Praxis relevant, wenn: Ein Graph nach Klassifikation, Freigabe, Risikostufe oder Tool-Ergebnis unterschiedliche Wege nehmen soll.

## Was in der Praxis schnell schiefgeht

Viele Probleme entstehen nicht im Modell, sondern im schlecht gepflegten State. Häufig wird `messages` ohne Reducer definiert. Oder ein Knoten mutiert Listen direkt im bestehenden State. Ebenso problematisch sind untypisierte States, bei denen Fehler erst zur Laufzeit auffallen.

```python
# Falsch: State direkt mutieren
def mutating_node(state: MyState) -> MyState:
    state["items"].append("new")
    return {"items": state["items"]}

# Richtig: neue Liste erzeugen
def pure_node(state: MyState) -> MyState:
    new_items = state["items"] + ["new"]
    return {"items": new_items}
```

```python
# Falsch: kein Reducer fuer messages
class BadState(TypedDict):
    messages: list

# Richtig: add_messages verwenden
class GoodState(TypedDict):
    messages: Annotated[list, add_messages]
```

Grenze: Auch ein sauberer State ersetzt keine gute Workflow-Logik. Er sorgt nur dafür, dass die Logik nachvollziehbar und stabil mit Daten arbeiten kann.

## Best Practices für Entwicklerprojekte

Der State sollte flach und sprechend benannt sein. Felder wie `user_query`, `current_step` oder `analysis_complete` sind hilfreicher als kryptische Kurzformen. Sensible personenbezogene Daten gehören nicht unreflektiert in den State, besonders wenn Checkpointing oder Logging mitgedacht wird.

Reducer sollten nur dort eingesetzt werden, wo wirklich akkumuliert wird. Knoten sollten nur Änderungen zurückgeben. Und Debugging wird einfacher, wenn eingehender State und Rückgabe im Zweifel kurz protokolliert werden.

```python
def debug_node(state: MyState) -> MyState:
    print(f"[DEBUG] Eingehender State: {state}")
    result = process(state)
    print(f"[DEBUG] Rueckgabe: {result}")
    return result
```

## Was für Entwickler zuerst wichtig ist

Für einen ersten LangGraph-Workflow reichen meist drei Regeln. Erstens: State explizit definieren, statt mit beliebigen Dictionaries zu arbeiten. Zweitens: `messages` fast immer mit `add_messages` absichern. Drittens: Knoten geben nur die Änderungen zurück, nicht den gesamten State.

Entwickler unterschätzen oft, wie stark diese drei Regeln spätere Erweiterungen erleichtern. Wer sie früh sauber anlegt, kann Routing, Checkpointing, Human-in-the-Loop und Memory wesentlich einfacher ergänzen.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Wie bleiben Sitzungen und Zustände erhalten?]({{ '/04-agenten-implementierung/checkpointing-persistenz.html' | relative_url }}) | Wie wird State über Sitzungen hinweg gespeichert und wiederaufgenommen? |
| [Wie erinnern sich Agenten über mehrere Schritte und Sitzungen hinweg?]({{ '/04-agenten-implementierung/memory-systeme.html' | relative_url }}) | Wie wird aus dem laufenden State ein längerfristiges Gedächtnis? |
| [Multi-Agent-Systeme]({{ '/06-multi-agent-erweiterungen/multi-agent-systeme.html' | relative_url }}) | Wie wird State zwischen mehreren Rollen oder Knoten eines Systems übergeben? |

---

**Version:** 1.1<br>
**Stand:** April 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.




