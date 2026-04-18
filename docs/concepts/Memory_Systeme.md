---
layout: default
title: Wie erinnern sich Agenten über mehrere Schritte und Sitzungen hinweg?
parent: Konzepte
nav_order: 8
description: Kurz- und Langzeitgedächtnis für KI-Agenten mit LangGraph, Vektordatenbanken und nutzerspezifischer Persistenz
has_toc: true
---

# Wie erinnern sich Agenten über mehrere Schritte und Sitzungen hinweg?
{: .no_toc }

> **Memory macht aus einem einmaligen Modellaufruf ein System, das Kontext behalten kann.**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Warum Agenten überhaupt ein Gedächtnis brauchen

Ein Sprachmodell bringt kein dauerhaftes Gedächtnis mit. Ohne zusätzliche Mechanismen beginnt jede Konversation praktisch von vorn. Nutzerpräferenzen gehen verloren, frühere Entscheidungen verschwinden, und wichtige Fakten müssen immer wieder neu genannt werden. Für einfache Einmalanfragen ist das oft egal. Für mehrstufige Agenten, persönliche Assistenten oder längere Sitzungen wird es schnell zum Problem.

Memory-Systeme lösen genau diese Lücke. Sie speichern nicht nur Gesprächsverlauf, sondern je nach Bedarf auch verdichtete Zusammenfassungen, strukturierte Entitäten oder dauerhaftes Wissen über Sitzungen hinweg. Damit entsteht ein entscheidender Unterschied zwischen einem Modellaufruf und einem wiederverwendbaren Agentensystem.

Typischer Fehler: Alles, was ein Agent behalten soll, einfach im Prompt zu wiederholen. Das skaliert schlecht, wird teuer und verliert bei langen Sitzungen schnell die Übersicht.

## Ein einfaches Beispiel

Ein Assistent soll sich merken, dass eine Nutzerin kurze Antworten bevorzugt, an einem Python-Kurs arbeitet und in einer späteren Sitzung nach genau diesem Thema weiterlernen will. Ohne Memory müsste diese Information jedes Mal neu genannt werden. Mit einem geeigneten Gedächtnissystem kann der Agent in der laufenden Sitzung den unmittelbaren Kontext halten und zusätzlich langfristig relevante Fakten speichern.

Dieses Beispiel zeigt bereits die wichtigste Unterscheidung: Nicht alles, was ein Agent behalten soll, gehört in dieselbe Form von Memory. Für den letzten Gesprächsverlauf braucht es etwas anderes als für dauerhafte Nutzerfakten.

## Zwei Grundformen von Memory

Für Einsteiger ist die Trennung zwischen Kurzzeit- und Langzeit-Memory zentral. Kurzzeit-Memory hält fest, was in der aktuellen Sitzung gerade relevant ist. Langzeit-Memory bewahrt Informationen über das Ende einer einzelnen Sitzung hinaus auf.

```mermaid
flowchart TB
    M[Memory-Systeme] --> K[Kurzzeit-Memory]
    M --> L[Langzeit-Memory]

    K --> K1["Conversation Buffer"]
    K --> K2["Sliding Window"]
    K --> K3["Summarization"]

    L --> L1["Semantisches Memory"]
    L --> L2["Episodisches Memory"]
    L --> L3["Entity Memory"]
```

Kurzzeit-Memory ist fast immer nötig, weil ein Agent sonst schon innerhalb einer Sitzung den roten Faden verliert. Langzeit-Memory wird dann wichtig, wenn Personalisierung, Nutzerprofile oder sitzungsübergreifendes Wissen gebraucht werden.

## Conversation Buffer: der einfachste Einstieg

Der einfachste Ansatz besteht darin, alle Nachrichten im State zu behalten. In LangGraph ist das besonders naheliegend, weil der Verlauf direkt Teil des States sein kann. Für kurze Konversationen ist dieser Ansatz didaktisch ideal, weil er kaum zusätzliche Infrastruktur braucht.

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class ChatState(TypedDict):
    messages: Annotated[list, add_messages]

def chat_node(state: ChatState) -> ChatState:
    response = llm.invoke(state["messages"])
    return {"messages": [response]}
```

Grenze: Der Verlauf wächst mit jeder Nachricht. Dadurch steigen Tokenverbrauch, Kosten und die Gefahr, dass das Kontextfenster überschritten wird.

## Sliding Window: wenn nur das Jüngste wichtig ist

Beim Sliding Window werden nur die letzten Nachrichten im aktiven Kontext behalten. Ältere Inhalte fallen aus dem direkten Arbeitsgedächtnis heraus. Diese Strategie ist einfach, günstig und für viele Chats ausreichend, solange frühe Informationen nicht dauerhaft relevant bleiben.

```python
from langchain_core.messages import trim_messages

def chat_node(state: ChatState) -> ChatState:
    trimmed = trim_messages(
        state["messages"],
        max_tokens=4000,
        strategy="last",
        token_counter=llm,
        include_system=True,
        allow_partial=False,
    )
    response = llm.invoke(trimmed)
    return {"messages": [response]}
```

Nicht geeignet, wenn: Frühe Informationen später wieder wichtig werden, etwa Nutzerpräferenzen, offene Aufgaben oder definierte Projektziele.

## Summarization: wenn Kontext erhalten bleiben soll

Statt alte Nachrichten vollständig zu verwerfen, kann ein Agent sie zusammenfassen. Dadurch bleibt die inhaltliche Linie erhalten, ohne dass jede einzelne Nachricht im Modellkontext liegen muss. Genau hier beginnt Summarization Memory.

```python
from langchain_core.messages import RemoveMessage, SystemMessage

class SummaryState(TypedDict):
    messages: Annotated[list, add_messages]
    summary: str

def summarize_node(state: SummaryState) -> SummaryState:
    messages = state["messages"]
    if len(messages) < 10:
        return {}

    existing_summary = state.get("summary", "Keine bisherige Zusammenfassung.")
    to_summarize = messages[:-4]

    prompt = (
        f"Bestehende Zusammenfassung: {existing_summary}\n\n"
        f"Neue Nachrichten zum Einarbeiten:\n"
        + "\n".join(f"{m.type}: {m.content}" for m in to_summarize)
    )
    new_summary = llm.invoke(prompt).content

    to_remove = [RemoveMessage(id=m.id) for m in to_summarize]
    summary_msg = SystemMessage(
        content=f"Bisheriger Gesprächsverlauf (komprimiert): {new_summary}"
    )

    return {
        "messages": [summary_msg] + to_remove,
        "summary": new_summary
    }
```

```mermaid
flowchart LR
    A[Langer Verlauf] --> B{Limit erreicht?}
    B -->|Nein| C[Normal weiterarbeiten]
    B -->|Ja| D[Aeltere Nachrichten zusammenfassen]
    D --> E[Zusammenfassung bleibt]
    E --> F[Letzte Nachrichten bleiben voll erhalten]
```

In der Praxis relevant, wenn: Sitzungen lang werden, aber der frühere Verlauf nicht vollständig verloren gehen darf.

## Langzeit-Memory: wenn Wissen Sitzungen überleben soll

Langzeit-Memory wird nötig, sobald relevante Informationen nach Ende einer Sitzung noch verfügbar sein sollen. Dazu gehören Nutzerpräferenzen, Ziele, wichtige Fakten oder Wissen, das später semantisch wiedergefunden werden soll.

Ein typischer technischer Weg ist semantisches Memory über eine Vektordatenbank. Gespeicherte Fakten werden eingebettet und bei Bedarf per Ähnlichkeitssuche wieder abgerufen.

```python
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.tools import tool

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
memory_store = Chroma(
    collection_name="agent_memory",
    embedding_function=embeddings,
    persist_directory="./agent_memory_db"
)

@tool
def memory_speichern(information: str) -> str:
    memory_store.add_texts([information])
    return f"Gespeichert: {information}"

@tool
def memory_abrufen(frage: str) -> str:
    docs = memory_store.similarity_search(frage, k=3)
    if not docs:
        return "Keine relevanten Informationen im Gedächtnis gefunden."
    return "\n".join(f"- {doc.page_content}" for doc in docs)
```

Der Vorteil liegt darin, dass nicht nur exakte Schlüssel gesucht werden, sondern inhaltlich ähnliche Informationen wieder auftauchen können. Das passt gut zu Präferenzen, Erfahrungswissen oder thematischen Fakten.

## Entity Memory: wenn Informationen strukturiert bleiben sollen

Manche Informationen sollen nicht nur auffindbar, sondern geordnet gespeichert werden. Genau dafür eignet sich Entity Memory. Personen, Projekte oder Orte werden als benannte Entitäten im State oder in einem Store abgelegt. Das ist besonders nützlich, wenn ein Agent mit Kundendaten, Projektnamen oder festen Objekten arbeitet.

```python
from pydantic import BaseModel, Field

class EntityMemoryState(TypedDict):
    messages: Annotated[list, add_messages]
    entity_memory: dict

class Entitaet(BaseModel):
    name: str = Field(description="Name der Entität")
    beschreibung: str = Field(description="Beschreibung in einem Satz")

class EntitaetListe(BaseModel):
    entitaeten: list[Entitaet] = Field(description="Extrahierte Entitäten")

FRAGE_PRAEFIXE = ("was ", "wer ", "wie ", "wo ", "wann ", "warum ", "welche", "kennst")

def entity_extractor_node(state: EntityMemoryState) -> EntityMemoryState:
    letzte = state["messages"][-1].content.strip()
    if letzte.endswith("?") or letzte.lower().startswith(FRAGE_PRAEFIXE):
        return {}

    extractor = llm.with_structured_output(EntitaetListe)
    result = extractor.invoke(
        f"Extrahiere wichtige Entitäten (Personen, Projekte, Orte) aus:\n{letzte}"
    )

    updated = dict(state.get("entity_memory", {}))
    for e in result.entitaeten:
        if e.name in updated and e.beschreibung not in updated[e.name]:
            updated[e.name] = updated[e.name] + "; " + e.beschreibung
        else:
            updated[e.name] = e.beschreibung

    return {"entity_memory": updated}
```

Typischer Fehler: Alle Fakten unstrukturiert in eine Vektordatenbank zu schreiben, obwohl bestimmte Informationen besser als klar benannte Entitäten gepflegt würden.

## Per-User Memory: wenn mehrere Nutzer getrennt bleiben müssen

Sobald ein Agent von mehreren Nutzern verwendet wird, reicht ein globales Gedächtnis nicht mehr aus. Sitzungen und langfristige Fakten müssen nutzerspezifisch getrennt bleiben. In LangGraph bildet Checkpointing mit Thread-IDs dafür die natürliche Grundlage.

```python
from langgraph.checkpoint.sqlite import SqliteSaver
import sqlite3

conn = sqlite3.connect("user_memory.db", check_same_thread=False)
checkpointer = SqliteSaver(conn)
app = graph.compile(checkpointer=checkpointer)

def get_user_config(user_id: str, session_id: str) -> dict:
    return {
        "configurable": {
            "thread_id": f"{user_id}:{session_id}"
        }
    }
```

Wenn ein Nutzer über mehrere Sitzungen hinweg erinnert werden soll, reicht eine Thread-ID allein nicht aus. Dann braucht es zusätzlich einen Store für nutzerspezifische Fakten, der unabhängig von einzelnen Sessions existiert.

```python
from langgraph.store.memory import InMemoryStore

user_store = InMemoryStore()

def save_user_fact(user_id: str, fact: str):
    namespace = ("user_profiles", user_id)
    existing = user_store.get(namespace, "facts") or {"facts": []}
    existing["facts"].append(fact)
    user_store.put(namespace, "facts", existing)

def get_user_facts(user_id: str) -> list[str]:
    namespace = ("user_profiles", user_id)
    data = user_store.get(namespace, "facts")
    return data["facts"] if data else []
```

## Warum gute Systeme mehrere Memory-Formen kombinieren

In realen Agenten wird Memory selten nur in einer Form eingesetzt. Ein System kann die letzten Nachrichten im State halten, ältere Teile zusammenfassen, Nutzerfakten in einer Vektordatenbank speichern und zusätzlich strukturierte Entitäten pflegen.

```mermaid
flowchart TD
    INPUT[Nutzereingabe] --> AGENT[Agent]

    AGENT -->|liest| ST[Kurzzeit-Memory]
    AGENT -->|liest| LT[Langzeit-Memory]
    AGENT -->|liest| EM[Entity Memory]

    AGENT --> RESPONSE[Antwort]
    RESPONSE -->|schreibt| ST
    RESPONSE -->|optional| LT
    RESPONSE -->|optional| EM
```

```python
class HybridMemoryState(TypedDict):
    messages: Annotated[list, add_messages]
    summary: str
    entity_memory: dict

def chat_with_memory(state: HybridMemoryState) -> HybridMemoryState:
    long_term = memory_store.similarity_search(
        state["messages"][-1].content, k=2
    )
    memory_context = "\n".join(d.page_content for d in long_term)

    system_msg = (
        "Du bist ein hilfreicher Assistent.\n\n"
        f"Gespeicherte Fakten:\n{memory_context}\n\n"
        f"Bekannte Entitäten: {state.get('entity_memory', {})}\n\n"
        f"Bisheriger Verlauf (komprimiert): {state.get('summary', 'Kein Verlauf')}"
    )

    messages = [{"role": "system", "content": system_msg}] + state["messages"]
    response = llm.invoke(messages)
    return {"messages": [response]}
```

Genau darin liegt die eigentliche Architekturentscheidung: Nicht `ob` Memory eingesetzt wird, sondern `welche Art` von Memory für welche Information passend ist.

## Was in der Praxis schnell schiefgeht

Viele Systeme speichern zu viel, zu wahllos oder zu unsauber getrennt. Kurze Floskeln wie `ok` oder `danke` gehören selten in ein dauerhaftes Gedächtnis. Sensible personenbezogene Daten sollten nicht unreflektiert in Vektordatenbanken landen. Ebenso problematisch ist es, Memory ohne Löschstrategie aufzubauen.

```python
def sollte_gespeichert_werden(nachricht: str) -> bool:
    if len(nachricht) < 30:
        return False
    floskel_woerter = ["ok", "danke", "hallo", "tschuess", "ja", "nein"]
    return not all(w in nachricht.lower() for w in floskel_woerter)
```

| Empfehlung | Warum sie wichtig ist |
|---|---|
| Keine PII unkritisch einbetten | Embeddings sind kein Freifahrtschein für sensible Daten |
| Lösch- und Ablaufregeln definieren | Gedächtnis darf nicht unkontrolliert wachsen |
| Nutzerkontrolle anbieten | rechtliche und organisatorische Nachvollziehbarkeit |
| Relevanz vor dem Speichern prüfen | sonst füllt sich das Memory mit Ballast |

## Was für Einsteiger zuerst wichtig ist

Für einen ersten Agenten reicht meist ein einfaches Schema: Kurzzeit-Memory im State, bei längeren Gesprächen optional eine Zusammenfassung und nur dann Langzeit-Memory, wenn echte Personalisierung oder sitzungsübergreifendes Erinnern gebraucht wird. Damit bleibt die Architektur verständlich und trotzdem praxisnah.

Teilnehmende unterschätzen oft, dass Memory nicht nur eine Komfortfunktion ist. Ohne Gedächtnis werden viele scheinbar intelligente Agenten schon nach wenigen Nachrichten brüchig oder müssen dieselben Informationen immer wieder neu erfragen.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Wie bleiben Sitzungen und Zustände erhalten?](./Checkpointing_Persistenz.html) | Wie wird der State technisch gespeichert und wiederaufgenommen? |
| [State Management](./State_Management.html) | Wie sind Nachrichten, Variablen und andere Zustandsdaten im Graph organisiert? |
| [Human-in-the-Loop](./Human_in_the_Loop.html) | Wie wirkt sich gespeicherter Kontext auf Unterbrechung und Freigabe aus? |

---

**Version:** 1.1<br>
**Stand:** April 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
