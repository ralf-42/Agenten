---
layout: default
title: Multi-Agent-Systeme
parent: Konzepte
nav_order: 10
description: "Zusammenarbeit und Koordination mehrerer spezialisierter KI-Agenten"
has_toc: true
---

# Multi-Agent-Systeme
{: .no_toc }

> **Zusammenarbeit und Koordination mehrerer spezialisierter KI-Agenten**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1 Überblick

Ein einzelner Agent stößt bei komplexen Aufgaben schnell an Grenzen. Multi-Agent-Systeme (MAS) lösen dieses Problem durch **Arbeitsteilung**: Mehrere spezialisierte Agenten übernehmen jeweils Teilaufgaben und koordinieren sich untereinander.

**Kernidee:** Statt einem "Alleskönner" arbeiten mehrere "Spezialisten" zusammen – ähnlich wie in einem Team aus Rechercheur, Analyst und Redakteur.

| Aspekt              | Einzelner Agent                  | Multi-Agent-System          |
| ------------------- | -------------------------------- | --------------------------- |
| **Komplexität**     | Begrenzt durch Kontextfenster    | Skalierbar durch Verteilung |
| **Spezialisierung** | Generalist                       | Fokussierte Experten        |
| **Fehlertoleranz**  | Single Point of Failure          | Redundanz möglich           |
| **Wartbarkeit**     | Ein großer Prompt                | Modulare Komponenten        |
| **Debugging**       | Unübersichtlich bei vielen Tools | Klare Verantwortlichkeiten  |

**Typische Anwendungsfälle:**
- Content-Pipelines (Recherche → Schreiben → Review)
- Komplexe Analysen (Datensammlung → Verarbeitung → Visualisierung)
- Autonome Workflows mit Qualitätskontrolle
- Simulationen und Debatten zwischen "Experten"

---

## 2 Koordinationsmuster

Drei grundlegende Muster haben sich für die Zusammenarbeit von Agenten etabliert:

```mermaid
flowchart TD
    subgraph Supervisor
        S1[Supervisor] --> W1[Worker A]
        S1 --> W2[Worker B]
        S1 --> W3[Worker C]
    end
    
    subgraph Hierarchisch
        M[Manager] --> T1[Team Lead 1]
        M --> T2[Team Lead 2]
        T1 --> WA[Worker]
        T1 --> WB[Worker]
        T2 --> WC[Worker]
    end
    
    subgraph Kollaborativ
        A1[Agent 1] <--> A2[Agent 2]
        A2 <--> A3[Agent 3]
        A3 <--> A1
    end
```

| Muster           | Struktur        | Koordination | Komplexität |
| ---------------- | --------------- | ------------ | ----------- |
| **Supervisor**   | Flach (1 Ebene) | Zentral      | ⭐⭐          |
| **Hierarchisch** | Mehrere Ebenen  | Kaskadierend | ⭐⭐⭐         |
| **Kollaborativ** | Peer-to-Peer    | Dezentral    | ⭐⭐⭐⭐        |

---

## 3 Supervisor-Pattern

Das Supervisor-Pattern ist der Einstiegspunkt für Multi-Agent-Systeme. Ein **Supervisor** analysiert Aufgaben und delegiert sie an spezialisierte **Worker-Agenten**.

```mermaid
flowchart TD
    A[Aufgabe] --> S[Supervisor]
    S --> |"Code-Aufgabe"| C[Code-Agent]
    S --> |"Recherche"| R[Research-Agent]
    S --> |"Texterstellung"| W[Writer-Agent]
    C --> S
    R --> S
    W --> S
    S --> E[Finale Antwort]
```

### 3.1 Funktionsweise

1. **Supervisor** erhält die Aufgabe und analysiert sie
2. **Routing-Entscheidung**: Welcher Worker ist zuständig?
3. **Delegation**: Aufgabe wird an Worker übergeben
4. **Ergebnis-Sammlung**: Worker liefert Teilergebnis zurück
5. **Iteration**: Bei Bedarf weitere Worker einbeziehen
6. **Synthese**: Supervisor erstellt finale Antwort

### 3.2 Implementierung mit LangGraph

```python
from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.types import Command
from langchain.chat_models import init_chat_model

# State-Definition
class TeamState(TypedDict):
    messages: Annotated[list, add_messages]
    next_worker: str
    task_complete: bool

# LLM initialisieren
llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)

# Supervisor-Node
def supervisor_node(state: TeamState) -> Command:
    """Analysiert Aufgabe und routet zum passenden Worker."""
    messages = state["messages"]
    last_message = messages[-1].content.lower()
    
    # Einfache Routing-Logik (in Produktion: LLM-basiert)
    if "code" in last_message or "programmier" in last_message:
        return Command(goto="code_agent")
    elif "recherche" in last_message or "suche" in last_message:
        return Command(goto="research_agent")
    elif "schreib" in last_message or "text" in last_message:
        return Command(goto="writer_agent")
    else:
        return Command(goto="writer_agent")  # Default

# Worker-Nodes
def code_agent(state: TeamState) -> TeamState:
    """Spezialisiert auf Code-Aufgaben."""
    response = llm.invoke([
        {"role": "system", "content": "Du bist ein Code-Experte. Schreibe sauberen, dokumentierten Code."},
        *state["messages"]
    ])
    return {"messages": [response], "task_complete": True}

def research_agent(state: TeamState) -> TeamState:
    """Spezialisiert auf Recherche."""
    response = llm.invoke([
        {"role": "system", "content": "Du bist ein Recherche-Experte. Sammle und strukturiere Informationen."},
        *state["messages"]
    ])
    return {"messages": [response], "task_complete": True}

def writer_agent(state: TeamState) -> TeamState:
    """Spezialisiert auf Texterstellung."""
    response = llm.invoke([
        {"role": "system", "content": "Du bist ein Redakteur. Schreibe klare, verständliche Texte."},
        *state["messages"]
    ])
    return {"messages": [response], "task_complete": True}

# Graph aufbauen
graph = StateGraph(TeamState)

graph.add_node("supervisor", supervisor_node)
graph.add_node("code_agent", code_agent)
graph.add_node("research_agent", research_agent)
graph.add_node("writer_agent", writer_agent)

graph.add_edge(START, "supervisor")
graph.add_edge("code_agent", END)
graph.add_edge("research_agent", END)
graph.add_edge("writer_agent", END)

team = graph.compile()
```

### 3.3 Vorteile und Grenzen

| Vorteile | Grenzen |
|----------|---------|
| Einfach zu verstehen und implementieren | Supervisor als Bottleneck |
| Klare Verantwortlichkeiten | Keine direkte Worker-Kommunikation |
| Gut für parallele Aufgaben | Begrenzte Skalierbarkeit |

---

## 4 Hierarchisches Pattern

Bei sehr komplexen Aufgaben reicht eine Ebene nicht aus. Das hierarchische Pattern führt **Team Leads** ein, die selbst wieder Teams koordinieren.

```mermaid
flowchart TD
    A[Komplexe Aufgabe] --> M[Manager]
    M --> TL1[Team Lead: Entwicklung]
    M --> TL2[Team Lead: Content]
    
    TL1 --> D1[Backend-Dev]
    TL1 --> D2[Frontend-Dev]
    TL1 --> D3[Tester]
    
    TL2 --> C1[Rechercheur]
    TL2 --> C2[Redakteur]
    TL2 --> C3[Lektor]
    
    D1 --> TL1
    D2 --> TL1
    D3 --> TL1
    C1 --> TL2
    C2 --> TL2
    C3 --> TL2
    
    TL1 --> M
    TL2 --> M
    M --> E[Finale Lösung]
```

### 4.1 Funktionsweise

1. **Manager** zerlegt Aufgabe in Teilbereiche
2. **Team Leads** übernehmen Teilbereiche
3. **Worker** bearbeiten konkrete Teilaufgaben
4. **Ergebnisse** fließen die Hierarchie hinauf
5. **Manager** integriert alle Teilergebnisse

### 4.2 Wann hierarchisch?

| Kriterium | Supervisor reicht | Hierarchie nötig |
|-----------|-------------------|------------------|
| Anzahl Spezialisten | < 5 | > 5 |
| Aufgaben-Komplexität | Einzelne Schritte | Verschachtelte Teilaufgaben |
| Domänen | Eine Domäne | Mehrere Fachbereiche |
| Abhängigkeiten | Unabhängig | Stark verknüpft |

### 4.3 Implementierungshinweis

Hierarchische Systeme werden als **verschachtelte Subgraphs** in LangGraph umgesetzt:

```python
# Team Lead als eigener Subgraph
def create_dev_team():
    team = StateGraph(TeamState)
    team.add_node("lead", dev_lead_node)
    team.add_node("backend", backend_node)
    team.add_node("frontend", frontend_node)
    # ... Edges definieren
    return team.compile()

# Manager-Graph bindet Subgraphs ein
manager_graph = StateGraph(ManagerState)
manager_graph.add_node("dev_team", create_dev_team())
manager_graph.add_node("content_team", create_content_team())
```

---

## 5 Kollaboratives Pattern

Im kollaborativen Pattern kommunizieren Agenten **direkt miteinander**, ohne zentrale Koordination. Dies ermöglicht emergentes Verhalten und komplexe Interaktionen.

```mermaid
flowchart LR
    A[Kritiker] <-->|Feedback| B[Autor]
    B <-->|Entwurf| C[Faktenchecker]
    C <-->|Korrekturen| A
    
    D[Moderator] -.->|Beobachtet| A
    D -.->|Beobachtet| B
    D -.->|Beobachtet| C
```

### 5.1 Typische Szenarien

**Debatte/Diskussion:**
- Mehrere "Experten" diskutieren ein Thema
- Unterschiedliche Perspektiven werden eingebracht
- Konsens oder beste Lösung wird ermittelt

**Iterative Verbesserung:**
- Autor erstellt Entwurf
- Kritiker gibt Feedback
- Autor überarbeitet
- Zyklus bis Qualitätsziel erreicht

**Peer Review:**
- Agent A prüft Arbeit von Agent B
- Agent B prüft Arbeit von Agent C
- Gegenseitige Qualitätskontrolle

### 5.2 Implementierung: Autor-Kritiker-Zyklus

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

class ReviewState(TypedDict):
    messages: Annotated[list, add_messages]
    draft: str
    feedback: str
    revision_count: int
    approved: bool

def author_node(state: ReviewState) -> ReviewState:
    """Erstellt oder überarbeitet den Text."""
    if state["revision_count"] == 0:
        # Erster Entwurf
        prompt = f"Schreibe einen Artikel über: {state['messages'][-1].content}"
    else:
        # Überarbeitung basierend auf Feedback
        prompt = f"Überarbeite den Text basierend auf diesem Feedback:\n{state['feedback']}\n\nAktueller Text:\n{state['draft']}"
    
    response = llm.invoke([{"role": "user", "content": prompt}])
    return {
        "draft": response.content,
        "revision_count": state["revision_count"] + 1
    }

def critic_node(state: ReviewState) -> ReviewState:
    """Bewertet den Text und gibt Feedback."""
    prompt = f"""Bewerte diesen Text kritisch:

{state['draft']}

Antworte im Format:
APPROVED: ja/nein
FEEDBACK: [Dein detailliertes Feedback]"""
    
    response = llm.invoke([{"role": "user", "content": prompt}])
    content = response.content
    
    approved = "APPROVED: ja" in content.lower()
    feedback = content.split("FEEDBACK:")[-1].strip() if "FEEDBACK:" in content else content
    
    return {"feedback": feedback, "approved": approved}

def should_continue(state: ReviewState) -> str:
    """Entscheidet, ob weitere Überarbeitung nötig ist."""
    if state["approved"]:
        return END
    if state["revision_count"] >= 3:  # Maximum 3 Revisionen
        return END
    return "author"

# Graph aufbauen
graph = StateGraph(ReviewState)
graph.add_node("author", author_node)
graph.add_node("critic", critic_node)

graph.add_edge(START, "author")
graph.add_edge("author", "critic")
graph.add_conditional_edges("critic", should_continue, {"author": "author", END: END})

review_system = graph.compile()
```

### 5.3 Herausforderungen

> [!WARNING] Endlosschleifen ohne Iterationslimit    
> Kollaborative Systeme können ohne Abbruchbedingung endlos zwischen Agenten iterieren. Immer `recursion_limit` in der Config setzen und Iterationszähler im State führen.

| Herausforderung | Lösungsansatz |
|-----------------|---------------|
| Endlosschleifen | Maximale Iterationen setzen |
| Inkonsistente Kommunikation | Strukturierte Nachrichtenformate |
| Konvergenz-Probleme | Moderator-Agent einführen |
| Hohe Token-Kosten | Zusammenfassungen zwischen Runden |

---

## 6 Paralleles Pattern (Fan-out / Fan-in)

Während Supervisor und kollaborative Muster Aufgaben sequenziell verarbeiten, ermöglicht das **Parallele Pattern** die gleichzeitige Ausführung unabhängiger Teilaufgaben. Dies reduziert die Gesamtlaufzeit erheblich – besonders bei I/O-lastigen Operationen wie Websuchen oder API-Abfragen.

```mermaid
flowchart TD
    A[Aufgabe] --> S[Orchestrator]
    S -->|Fan-out| R[Research-Agent]
    S -->|Fan-out| D[Data-Agent]
    S -->|Fan-out| W[Writer-Agent]
    R -->|Fan-in| J[Aggregator]
    D -->|Fan-in| J
    W -->|Fan-in| J
    J --> E[Finale Antwort]
```

### 6.1 Wann Parallelismus sinnvoll ist

| Geeignet | Nicht geeignet |
|----------|----------------|
| Unabhängige Teilaufgaben | Aufgaben mit Abhängigkeiten (B braucht Ergebnis von A) |
| Mehrere Datenquellen gleichzeitig abfragen | Sequenzielle Verarbeitung mit Zustandsaufbau |
| Viele Dokumente gleichzeitig analysieren | Strikte Reihenfolge erforderlich |
| Mehrere Modell-Prompts parallel vergleichen | Kleine Aufgaben mit wenig Laufzeitvorteil |

### 6.2 Implementierung mit Send

LangGraph realisiert Parallelismus über das `Send`-Primitive. Nodes geben eine Liste von `Send`-Objekten zurück, die LangGraph parallel ausführt.

```python
import operator
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from langchain.chat_models import init_chat_model

llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)

class ParallelState(TypedDict):
    aufgabe: str
    teilaufgaben: list[str]
    ergebnisse: Annotated[list, operator.add]  # Fan-in: Ergebnisse akkumulieren

def fan_out(state: ParallelState) -> list[Send]:
    """Erstellt parallele Worker-Ausführungen für jede Teilaufgabe."""
    return [
        Send("worker", {"aufgabe": state["aufgabe"], "teilaufgabe": t})
        for t in state["teilaufgaben"]
    ]

def worker_node(state: dict) -> dict:
    """Bearbeitet eine einzelne Teilaufgabe."""
    response = llm.invoke(
        f"Bearbeite: {state['teilaufgabe']} im Kontext von: {state['aufgabe']}"
    )
    return {"ergebnisse": [response.content]}

def aggregator_node(state: ParallelState) -> ParallelState:
    """Fan-in: Fasst alle Parallel-Ergebnisse zusammen."""
    alle = "\n\n".join(f"- {e}" for e in state["ergebnisse"])
    response = llm.invoke(f"Fasse die Teilauswertungen zusammen:\n\n{alle}")
    return {"ergebnisse": [response.content]}

# Graph mit parallelen Kanten aufbauen
graph = StateGraph(ParallelState)
graph.add_node("worker", worker_node)
graph.add_node("aggregator", aggregator_node)

graph.add_conditional_edges(START, fan_out, ["worker"])  # Fan-out
graph.add_edge("worker", "aggregator")                    # Fan-in
graph.add_edge("aggregator", END)

app = graph.compile()

# Ausführen
result = app.invoke({
    "aufgabe": "Schreibe einen Bericht über KI-Trends 2025",
    "teilaufgaben": ["Recherche", "Analyse", "Zusammenfassung"],
    "ergebnisse": []
})
```

### 6.3 Map-Reduce-Pattern

Ein häufiges Anwendungsmuster ist Map-Reduce: Viele Dokumente gleichzeitig analysieren, dann Ergebnisse zusammenführen.

```python
class MapReduceState(TypedDict):
    dokumente: list[str]                         # Eingabe: Liste von Dokumenten
    analysen: Annotated[list, operator.add]      # Fan-in: alle Analysen
    zusammenfassung: str                          # Ausgabe: finale Zusammenfassung

def map_phase(state: MapReduceState) -> list[Send]:
    """Map: Jedes Dokument wird parallel analysiert."""
    return [
        Send("analysiere_dokument", {"dokument": doc, "index": i})
        for i, doc in enumerate(state["dokumente"])
    ]

def analysiere_dokument(state: dict) -> dict:
    response = llm.invoke(f"Analysiere kurz: {state['dokument']}")
    return {"analysen": [f"Dok {state['index']}: {response.content}"]}

def reduce_phase(state: MapReduceState) -> MapReduceState:
    """Reduce: Alle Analysen zu einer Gesamtzusammenfassung verdichten."""
    combined = "\n".join(state["analysen"])
    response = llm.invoke(
        f"Gesamtzusammenfassung aus {len(state['analysen'])} Analysen:\n{combined}"
    )
    return {"zusammenfassung": response.content}
```

### 6.4 Vorteile und Grenzen

| Vorteile | Grenzen |
|---------|---------|
| Deutlich kürzere Laufzeit bei unabhängigen Tasks | Höherer simultaner API-Call-Verbrauch |
| Skaliert linear mit Anzahl Teilaufgaben | Debugging komplexer als sequenziell |
| Klare Fehler-Isolation pro Worker | Nur für wirklich unabhängige Aufgaben geeignet |

---

## 7 Kommunikation zwischen Agenten

Die Art der Kommunikation bestimmt maßgeblich die Effektivität eines Multi-Agent-Systems.

### 7.1 Kommunikationsformen

```mermaid
flowchart TD
    subgraph Direkt
        A1[Agent A] -->|Message| A2[Agent B]
    end
    
    subgraph Shared State
        B1[Agent A] --> S[(State)]
        B2[Agent B] --> S
        S --> B1
        S --> B2
    end
    
    subgraph Message Queue
        C1[Agent A] --> Q[Queue]
        Q --> C2[Agent B]
        C2 --> Q
        Q --> C1
    end
```

| Form | Beschreibung | Einsatz |
|------|-------------|---------|
| **Direkt** | Agent ruft anderen Agent auf | Einfache Delegation |
| **Shared State** | Gemeinsamer Zustand (LangGraph) | Standard in LangGraph |
| **Message Queue** | Asynchrone Nachrichten | Komplexe Systeme |

> [!WARNING] Deadlocks bei falschem Kommunikationsdesign    
> Wenn Agent A auf das Ergebnis von Agent B wartet und Agent B auf das Ergebnis von Agent A — entsteht ein Deadlock. Klare Kommunikationsrichtungen (keine zirkulären Abhängigkeiten) und Timeouts sind Pflicht.

### 7.2 Strukturierte Übergaben

Für zuverlässige Kommunikation sollten Übergaben strukturiert erfolgen:

```python
from pydantic import BaseModel, Field

class TaskHandoff(BaseModel):
    """Strukturierte Aufgabenübergabe zwischen Agenten."""
    task_description: str = Field(description="Was soll erledigt werden?")
    context: str = Field(description="Relevanter Kontext")
    expected_output: str = Field(description="Erwartetes Ergebnisformat")
    priority: int = Field(description="Priorität 1-5", ge=1, le=5)

class TaskResult(BaseModel):
    """Strukturiertes Ergebnis eines Agenten."""
    status: str = Field(description="success | partial | failed")
    result: str = Field(description="Das eigentliche Ergebnis")
    confidence: float = Field(description="Konfidenz 0.0-1.0", ge=0.0, le=1.0)
    notes: str = Field(description="Zusätzliche Anmerkungen")
```

---

## 8 State-Management

Der gemeinsame State ist das Rückgrat eines Multi-Agent-Systems in LangGraph. Das typische Multi-Agent-State-Schema erweitert den Basis-Chat-State um koordinationsspezifische Felder:

```python
from typing import TypedDict, Annotated, Optional
from langgraph.graph.message import add_messages

class MultiAgentState(TypedDict):
    messages: Annotated[list, add_messages]  # Kommunikation
    current_task: str                         # Aktuelle Aufgabe
    completed_tasks: list[str]                # Abgeschlossene Aufgaben
    next_agent: str                           # Nächster Agent
    iteration_count: int                      # Zähler gegen Endlosschleifen
    final_output: Optional[str]               # Endergebnis
```

**Kernprinzip:** Jede Komponente liest aus dem State und gibt nur Änderungen zurück – niemals den gesamten State.

Für Grundlagen zu State-Design, Reducer-Funktionen und häufigen Fehlern siehe → [State Management](./State_Management.html).

---

## 9 Fehlerbehandlung

In Multi-Agent-Systemen können Fehler an vielen Stellen auftreten. Robuste Fehlerbehandlung ist essenziell.

### 9.1 Fehlerquellen

```mermaid
flowchart TD
    E[Fehlerquellen] --> E1[Agent-Fehler]
    E --> E2[Kommunikations-Fehler]
    E --> E3[Koordinations-Fehler]
    
    E1 --> E1a[LLM-Timeout]
    E1 --> E1b[Tool-Fehler]
    E1 --> E1c[Ungültige Ausgabe]
    
    E2 --> E2a[State-Inkonsistenz]
    E2 --> E2b[Verlorene Nachrichten]
    
    E3 --> E3a[Deadlock]
    E3 --> E3b[Endlosschleife]
    E3 --> E3c[Falsche Routing-Entscheidung]
```

### 9.2 Strategien

**Retry mit Backoff:**
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
def resilient_agent_call(state):
    return agent_node(state)
```

**Fallback-Agent:**
```python
def safe_routing(state: TeamState) -> str:
    try:
        return determine_next_agent(state)
    except Exception:
        return "fallback_agent"  # Generalist als Backup
```

**Iterationslimit:**
```python
def should_continue(state: TeamState) -> str:
    if state["iteration_count"] >= 10:
        return "timeout_handler"  # Graceful Degradation
    return "next_agent"
```

---

## 10 Entscheidungshilfe

Die Wahl des richtigen Patterns hängt von den Anforderungen ab:

```mermaid
flowchart TD
    A[Anforderung analysieren] --> B{Wie viele Spezialisten?}
    B -->|1-2| C[Einzelner Agent mit Tools]
    B -->|3-5| D{Müssen Agenten kommunizieren?}
    B -->|>5| E[Hierarchisches Pattern]
    
    D -->|Nein| F[Supervisor-Pattern]
    D -->|Ja, sequenziell| G[Supervisor mit Routing]
    D -->|Ja, iterativ| H[Kollaboratives Pattern]
    D -->|Ja, unabhaengig| I[Paralleles Pattern]
```

| Situation | Empfohlenes Pattern |
|-----------|---------------------|
| Einfache Aufgabenteilung (Recherche + Schreiben) | Supervisor |
| Qualitätssicherung mit Feedback-Schleifen | Kollaborativ |
| Großes Team mit Fachbereichen | Hierarchisch |
| Debatte/Diskussion simulieren | Kollaborativ |
| Content-Pipeline mit Stages | Supervisor |
| Komplexe Software-Entwicklung | Hierarchisch |

---

## 11 Zusammenfassung

Multi-Agent-Systeme ermöglichen die Lösung komplexer Aufgaben durch spezialisierte, kooperierende Agenten.

**Kernkonzepte:**

| Konzept | Beschreibung |
|---------|-------------|
| **Supervisor** | Zentraler Koordinator verteilt Aufgaben |
| **Hierarchisch** | Mehrere Ebenen für sehr komplexe Systeme |
| **Kollaborativ** | Direkte Agent-zu-Agent-Kommunikation |
| **Paralleles Pattern** | Fan-out / Fan-in für unabhängige Aufgaben |
| **Shared State** | Gemeinsamer Zustand in LangGraph |
| **Strukturierte Übergaben** | Pydantic-Modelle für klare Schnittstellen |

**Design-Prinzipien:**

- Klare Verantwortlichkeiten pro Agent
- Minimaler, gut strukturierter State
- Robuste Fehlerbehandlung
- Iterationslimits gegen Endlosschleifen
- Strukturierte Kommunikationsformate

**Nächste Schritte im Kurs:**

Die praktische Umsetzung erfolgt mit LangGraph. Dort werden diese Patterns Schritt für Schritt implementiert – vom einfachen Supervisor bis zum kollaborativen Review-System.

---

**Version:** 1.0  
**Stand:** November 2025  
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.   
