---
layout: default
title: Meeting- & Research-Briefing-Agent
parent: "Deployment & Betrieb"
nav_order: 5
description: "Praxisprojekt: quellengebundener Meeting- & Research-Briefing-Agent"
has_toc: true
---

# Meeting- & Research-Briefing-Agent Workshop
{: .no_toc }

> [!NOTE] Kernfrage<br>
> Wie entsteht ein quellengebundener Meeting- & Research-Briefing-Agent, der Protokolle, Entscheidungen, Risiken und Fachartikel durchsucht, Aussagen belegt, Unsicherheit sichtbar macht und bei Bedarf menschliche Freigabe einholt?

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Projektübersicht

In diesem Praxisprojekt entsteht schrittweise ein **Meeting- & Research-Briefing-Agent**. Ausgangspunkt ist Mara Vogt, Projektleiterin des internen Vorhabens "Projekt Kompass": Sie muss regelmäßig Protokolle, Risikolisten und Fachartikel sichten, sucht relevante Passagen und will geprüfte Briefings erhalten, statt einem vollautomatischen System blind zu vertrauen.

> [!NOTE] Dateiname und URL<br>
> Diese Seite liegt unter `meeting-research-briefing-agent.md`. Der frühere Dateiname wurde abgelöst, damit URL, Titel und Leitprojekt wieder zusammenpassen.

Der Agent lädt einen PDF-Korpus aus Meeting-Protokollen, Entscheidungen, Risikolisten und Fachartikeln, sucht semantisch nach relevanten Passagen, formuliert eine strukturierte Antwort mit Quellenangaben, erkennt Out-of-Corpus-Fragen und pausiert bei Unsicherheit für menschliche Prüfung.

Das Zielbild der Leitaufgabe ist in [Meeting- & Research-Briefing-Agent]({{ '/02-orientierung-entscheidung/meeting-research-briefing-leitaufgabe.html' | relative_url }}) beschrieben.

**Lernziele:**
- LangGraph State Machines für kontrollierte Antwortpfade einsetzen
- einen Projektkorpus (Protokolle, Entscheidungen, Risiken, Fachartikel) laden, strukturieren und durchsuchen
- Retrieval-Ergebnisse in belegte Antworten überführen
- Out-of-Corpus-Fragen sicher stoppen
- Sessions mit Checkpointing speichern
- Human-in-the-Loop für unsichere oder folgenreiche Antworten einbauen
- optional eine kleine Gradio-Oberfläche bereitstellen

**Arbeitsumgebung:** Google Colab, Jupyter Notebook oder lokales Python

**Voraussetzung:** Grundlagen zu Tool Use, LangGraph, RAG, State, HITL und Evaluation

---

## Zielprodukt

Am Ende steht ein Agent, der:

1. einen PDF-Korpus reproduzierbar lädt,
2. Dokumente in Chunks zerlegt und optional in ChromaDB einbettet,
3. Fragen in natürlicher Sprache beantwortet,
4. jede fachliche Antwort mit Dokumenttitel und Passagen-Zitat belegt,
5. bei fehlendem Beleg "Nicht im Korpus" ausgibt,
6. vor unsicheren finalen Antworten einen HITL-Schritt auslöst,
7. optional als Supervisor-System mit Tabellen-Worker und Fließtext-Worker arbeitet.

Nicht erforderlich ist ein produktionsreifes Deployment. UI, LangSmith, Hugging Face Spaces und Multi-Agent-Ausbau sind Erweiterungen.

---

## Leitplanken

Der Meeting- & Research-Briefing-Agent ist ein Assistenzsystem, kein autonomes Entscheidungssystem.

| Leitplanke | Bedeutung |
|---|---|
| Quellenpflicht | Fachliche Antworten brauchen Quellenangaben oder den Hinweis "Nicht im Korpus". |
| Out-of-Corpus-Regel | Fehlendes Wissen wird nicht frei erfunden. |
| HITL bei Unsicherheit | Niedrige Sicherheit oder folgenreiche Aussagen werden vor der finalen Ausgabe geprüft. |
| Tool-Grenzen | Tools laden, suchen, zitieren oder formatieren; offene Seiteneffekte brauchen Freigabe. |
| Datenschutz | Beispiele nutzen öffentliche Fachtexte oder synthetische Daten. |
| Logging bewusst einsetzen | Tracing hilft beim Debugging, sensible Inhalte werden aber nicht unbedacht protokolliert. |

---

## Notebook-Struktur

Zu erstellen ist **ein Notebook** mit **6 aufbauenden Kapiteln**:

```text
Meeting_Briefing_Workshop.ipynb
   ├── Kapitel 1: StateGraph Basics
   ├── Kapitel 2: Intent Routing
   ├── Kapitel 3: Projektkorpus & Retrieval
   ├── Kapitel 4: Checkpointing & Sessions
   ├── Kapitel 5: Research-Synthese, Quellen und Freigabe
   └── Kapitel 6: UI, Evaluation und Ausbau
```

| Kapitel | Schwerpunkt | Ergebnis |
|---|---|---|
| 1 | StateGraph Basics | Ein minimaler Graph mit State und Fallback |
| 2 | Intent Routing | Fragen werden nach Typ geroutet |
| 3 | Korpus & Retrieval | Relevante Passagen werden aus Protokollen, Entscheidungen und Fachartikeln geholt |
| 4 | Sessions | Verlauf bleibt über Checkpointing erhalten |
| 5 | Synthese & HITL | Antworten sind strukturiert, belegt und kontrollierbar |
| 6 | Ausbau | UI, Evaluation oder Multi-Agent-Variante |

---

## Vorbereitung

### API-Key speichern

Beim Arbeiten mit einem externen Modell den `OPENAI_API_KEY` in Colab Secrets oder lokal in einer `.env` speichern.

### Basis-Pakete installieren

```python
!uv pip install --system -q git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
!uv pip install --system -q langgraph>=1.0.0 langgraph-checkpoint-sqlite langchain-chroma gradio pypdf
```

### API-Key laden und Umgebung prüfen

```python
from genai_lib.utilities import setup_api_keys, check_environment

setup_api_keys(["OPENAI_API_KEY"])
check_environment()
```

---

## Kapitel 1: StateGraph Basics

**Lernziel:** Einen kleinen Graphen mit TypedDict-State und sicheren Fallbacks aufbauen.

Beispielfragen:

- "Welche Entscheidung wurde am 17.03. zur Vektordatenbank getroffen?"
- "Vergleiche die Aussagen aus zwei Steuerkreis-Protokollen."
- "Welchen Status hat Risiko R2 aktuell?"

### Aufgabe 1.1: State definieren

```python
from typing import Literal, TypedDict
from langgraph.graph import END, START, StateGraph

class BriefingState(TypedDict):
    user_query: str
    intent: Literal["factual", "comparison", "summary", "out_of_scope", "fallback"] | None
    retrieved_context: str
    sources: list[dict]
    confidence: Literal["hoch", "mittel", "niedrig"] | None
    needs_approval: bool
    answer: str
```

### Aufgabe 1.2: Minimal-Nodes erstellen

```python
def classify_intent(state: BriefingState) -> BriefingState:
    """Erkennt den Fragetyp."""
    query = state["user_query"].lower()
    # einfache Heuristik oder LLM-Klassifikation ergänzen
    return state

def fallback_answer(state: BriefingState) -> BriefingState:
    """Gibt eine sichere Fallback-Antwort zurück."""
    state["answer"] = "Ich kann diese Frage noch nicht zuverlässig aus dem Korpus beantworten."
    return state
```

### Aufgabe 1.3: Minimalen Graphen bauen

```python
workflow = StateGraph(BriefingState)
workflow.add_node("classify_intent", classify_intent)
workflow.add_node("fallback", fallback_answer)

workflow.add_edge(START, "classify_intent")
workflow.add_edge("classify_intent", "fallback")
workflow.add_edge("fallback", END)

graph = workflow.compile()
```

**Erfolgskriterium:**
- Der Graph läuft fehlerfrei.
- Der State wird korrekt befüllt.
- Unklare Fragen erhalten eine sichere Antwort.

---

## Kapitel 2: Intent Routing

**Lernziel:** Verschiedene Fragetypen über Conditional Edges zu spezialisierten Nodes leiten.

### Aufgabe 2.1: Router-Funktion definieren

```python
from typing import Literal

def route_by_intent(
    state: BriefingState,
) -> Literal["factual", "comparison", "summary", "out_of_scope", "fallback"]:
    return state["intent"] or "fallback"
```

### Aufgabe 2.2: Antwort-Nodes anlegen

```python
def answer_factual_question(state: BriefingState) -> BriefingState:
    """Beantwortet faktische Fragen mit Quellenbezug."""
    ...

def compare_sources(state: BriefingState) -> BriefingState:
    """Vergleicht Aussagen aus mehreren Quellen."""
    ...

def summarize_findings(state: BriefingState) -> BriefingState:
    """Fasst relevante Passagen aus dem Korpus zusammen."""
    ...

def handle_out_of_scope(state: BriefingState) -> BriefingState:
    """Stoppt Antworten, die nicht aus dem Korpus belegbar sind."""
    state["answer"] = "Nicht im Korpus."
    state["confidence"] = "niedrig"
    return state
```

### Aufgabe 2.3: Conditional Edges einbauen

```python
workflow.add_conditional_edges(
    "classify_intent",
    route_by_intent,
    {
        "factual": "factual",
        "comparison": "comparison",
        "summary": "summary",
        "out_of_scope": "out_of_scope",
        "fallback": "fallback",
    },
)
```

**Erfolgskriterium:**
- Faktische Fragen, Vergleichsfragen, Zusammenfassungen und Out-of-Corpus-Fragen landen in unterschiedlichen Pfaden.
- Der Graph endet deterministisch.

---

## Kapitel 3: Projektkorpus & Retrieval

**Lernziel:** Protokolle, Entscheidungen, Risikolisten und Fachartikel laden, in Passagen strukturieren und als belegbaren Kontext in den Graphen einbinden.

### Aufgabe 3.1: Korpus laden

Der Beispielkorpus liegt im Repository unter `02_daten/01_text/korpus_meeting_briefing/`. Im Notebook kann er reproduzierbar geladen werden:

```python
from genai_lib.github import copy_from_github

KORPUS_QUELLE = "ralf-42/Agenten/02_daten/01_text/korpus_meeting_briefing"
KORPUS_MASKE = "*.pdf"
KORPUS_TARGET = "/content/files"

copy_from_github(KORPUS_QUELLE, KORPUS_TARGET, pattern=KORPUS_MASKE)
```

Jedes Dokument braucht mindestens:

- Dateiname oder Titel
- extrahierten Text
- Chunk-ID oder Seitenhinweis
- zitierfähige Passage

### Aufgabe 3.2: Retrieval implementieren

Für eine Basisversion reicht Retrieval-Light mit einfacher Chunk-Suche. Die bessere Variante nutzt Embeddings, ChromaDB und Score-Thresholds.

```python
def retrieve_context(state: BriefingState) -> BriefingState:
    """Sucht passende Passagen im Projektkorpus."""
    query = state["user_query"]
    # Chunks suchen, Scores prüfen, Quellen speichern
    ...
    return state
```

### Aufgabe 3.3: Retrieval in den Graphen einbauen

```python
workflow.add_node("retrieve_context", retrieve_context)

workflow.add_edge(START, "classify_intent")
workflow.add_edge("classify_intent", "retrieve_context")
workflow.add_conditional_edges("retrieve_context", route_by_intent, ...)
```

**Erfolgskriterium:**
- Antworten nutzen belegte Passagen aus dem Korpus.
- Quellen enthalten Dokumenttitel und Textausschnitt.
- Bei schwachem Retrieval wird keine freie Antwort erfunden.

---

## Kapitel 4: Checkpointing & Sessions

**Lernziel:** Verlauf und Sitzungen für wiederholte Recherchefragen speichern.

### Aufgabe 4.1: Checkpointer einrichten

```python
from langgraph.checkpoint.sqlite import SqliteSaver

checkpointer = SqliteSaver.from_conn_string("briefing_agent_sessions.db")
graph = workflow.compile(checkpointer=checkpointer)
```

### Aufgabe 4.2: Session-basierte Interaktion

```python
config = {"configurable": {"thread_id": "mara_001"}}

result1 = graph.invoke(
    {
        "user_query": "Welche Entscheidungen wurden zur Vektordatenbank getroffen?",
        "intent": None,
        "retrieved_context": "",
        "sources": [],
        "confidence": None,
        "needs_approval": False,
        "answer": "",
    },
    config=config,
)

result2 = graph.invoke(
    {
        "user_query": "Welche Quelle war dafür am wichtigsten?",
        "intent": None,
        "retrieved_context": "",
        "sources": [],
        "confidence": None,
        "needs_approval": False,
        "answer": "",
    },
    config=config,
)
```

**Erfolgskriterium:**
- Mehrere Anfragen gehören zur gleichen Session.
- Verlauf kann eingesehen oder zurückgesetzt werden.
- Der Assistant kann Folgefragen auf vorherige Recherche beziehen.

---

## Kapitel 5: Research-Synthese, Quellen und Freigabe

**Lernziel:** Antworten strukturieren, Quellenpflicht erzwingen und unsichere Ergebnisse zur Freigabe markieren.

### Aufgabe 5.1: Antwortschema definieren

```python
from pydantic import BaseModel, Field

class Quellenangabe(BaseModel):
    dokument: str = Field(description="Dateiname oder Titel der Quelle")
    passage: str = Field(description="Zitierter Textausschnitt, maximal 2 Sätze")

class ResearchAntwort(BaseModel):
    antwort: str = Field(description="Synthese-Antwort auf die Frage")
    quellen: list[Quellenangabe] = Field(description="Mindestens eine Quellenangabe")
    sicherheit: str = Field(description="hoch / mittel / niedrig")
    hinweis: str = Field(description="'Nicht im Korpus' wenn out-of-scope")
```

### Aufgabe 5.2: Qualitäts-Gate ergänzen

```python
def quality_gate(state: BriefingState) -> BriefingState:
    """Markiert unsichere oder unbelegte Antworten für menschliche Prüfung."""
    if state["confidence"] == "niedrig" or not state["sources"]:
        state["needs_approval"] = True
        state["answer"] = "Freigabe erforderlich: Antwort ist nicht ausreichend belegt."
    return state
```

Der HITL-Schritt liegt nach der Synthese und vor der finalen Ausgabe.

### Aufgabe 5.3: Testfragen definieren

Mindestens diese fünf Fälle testen:

- Faktische Frage mit direkter Antwort im Korpus
- Inferenzfrage, die mehrere Passagen zusammenführt
- Vergleichsfrage zu zwei Quellen
- Tabellen- oder Statistikfrage für einen spezialisierten Worker
- Out-of-Corpus-Frage mit Antwort: "Nicht im Korpus"

**Erfolgskriterium:**
- Antworten bleiben beim belegten Korpus.
- Quellenangaben sind nachvollziehbar.
- Out-of-Corpus-Fragen werden gestoppt.
- HITL wird bei niedriger Sicherheit ausgelöst.
- Testfragen laufen reproduzierbar durch.

---

## Kapitel 6: UI, Evaluation und Ausbau

**Lernziel:** Den Assistant nutzbar machen und die Qualität systematisch prüfen.

### Option A: Gradio UI

```python
import gradio as gr

def chat_with_briefing_agent(message, history, thread_id):
    config = {"configurable": {"thread_id": thread_id}}
    result = graph.invoke(
        {
            "user_query": message,
            "intent": None,
            "retrieved_context": "",
            "sources": [],
            "confidence": None,
            "needs_approval": False,
            "answer": "",
        },
        config=config,
    )
    return "", history + [(message, result["answer"])]

with gr.Blocks() as demo:
    gr.Markdown("# Meeting- & Research-Briefing-Agent")
    thread_id = gr.Textbox(label="Session ID", value="mara_001")
    chatbot = gr.Chatbot(height=450)
    msg = gr.Textbox(placeholder="Frage zum Projektkorpus stellen ...")
    msg.submit(chat_with_briefing_agent, [msg, chatbot, thread_id], [msg, chatbot])
```

### Option B: Eval-Set

Ein kleines Eval-Set prüft Retrieval und Quellenbindung:

```json
{
  "id": "q01",
  "frage": "Welche Methode wird in Dokument X zur Chunking-Optimierung vorgeschlagen?",
  "erwartete_passage": "...exakter Textausschnitt...",
  "quelle": "dateiname.pdf",
  "typ": "faktisch"
}
```

Sinnvolle Fragetypen:

- faktische Fragen
- Inferenzfragen
- Vergleichsfragen
- Negativbeispiele mit "Nicht im Korpus"

### Option C: Multi-Agent-Ausbau

```text
Supervisor
├── Tabellen-Worker   -> verarbeitet Tabellen, Werte und strukturierte Abschnitte
└── Fließtext-Worker  -> verarbeitet Prosa, Argumentationen und Zusammenfassungen
```

Der Supervisor analysiert den Fragetyp und delegiert. Bei Unsicherheit geht die Antwort nach der Synthese in die menschliche Freigabe.

---

## Bewertungskriterien

| Kriterium | Mindestanforderung |
|---|---|
| Korpus | PDF-Korpus wird reproduzierbar geladen oder dokumentiert eingebunden. |
| Retrieval | Relevante Passagen werden besser gefunden als mit reinem Stichwortabgleich. |
| Antwortformat | Ausgabe folgt einem strukturierten Schema mit Antwort, Quellen, Sicherheit und Hinweis. |
| Quellenbindung | Mindestens eine Antwort enthält nachvollziehbare Quellenangaben. |
| Kontrolle | HITL oder eine vergleichbare Freigabelogik ist erkennbar. |
| Sessions | Checkpointing speichert mindestens eine wiederaufnehmbare Session. |
| Reflexion | Grenzen, Risiken und nächste Verbesserungen werden benannt. |

**Bestanden:** Der Assistant beantwortet belegbare Fragen aus dem Korpus, verweigert unbelegte Fragen kontrolliert und zeigt den Kontrollpunkt für unsichere Antworten.

---

## Abgabe

**Pflicht:**
- `Meeting_Briefing_Workshop.ipynb`
- mindestens fünf dokumentierte Testfragen mit Ergebnissen
- kurze Architekturübersicht, gern als Mermaid-Diagramm
- kurze Reflexion zu Quellenbindung, Unsicherheit und Grenzen

**Optional:**
- `briefing_agent_sessions.db`
- `app.py` für Gradio
- kleines Eval-Set als JSON
- Hugging Face Space oder anderes Demo-Deployment

### Checkliste

- [ ] Notebook läuft von oben bis unten fehlerfrei durch
- [ ] StateGraph ist definiert
- [ ] Intent-Routing funktioniert
- [ ] Korpus oder ChromaDB ist eingebunden
- [ ] Antworten enthalten Quellen
- [ ] Out-of-Corpus-Fragen werden gestoppt
- [ ] HITL oder Freigabelogik ist sichtbar
- [ ] mindestens fünf Testfragen wurden ausgeführt

---

## Hilfreiche Ressourcen

**LangGraph:**
- [StateGraph Guide](https://langchain-ai.github.io/langgraph/concepts/low_level/)
- [Checkpointing](https://langchain-ai.github.io/langgraph/how-tos/persistence/)
- [Human-in-the-Loop](https://docs.langchain.com/oss/python/langgraph/interrupts)

**Projektinterne Dokumente:**
- [Meeting- & Research-Briefing-Agent Leitaufgabe]({{ '/02-orientierung-entscheidung/meeting-research-briefing-leitaufgabe.html' | relative_url }})
- [State Management]({{ '/04-agenten-implementierung/ablauf-zustand/state-management.html' | relative_url }})
- [Checkpointing & Persistenz]({{ '/04-agenten-implementierung/ablauf-zustand/checkpointing-persistenz.html' | relative_url }})
- [LangGraph Guide]({{ '/05-frameworks/einsteiger-langgraph.html' | relative_url }})

---

## FAQ

**Brauche ich vollständiges RAG?**  
Nein. Eine Basisversion darf mit Retrieval-Light starten. Für eine stärkere Lösung sind Embeddings, ChromaDB und Score-Thresholds sinnvoll.

**Muss ich eine UI bauen?**  
Nein. Eine kleine Gradio-UI ist ein sinnvoller Ausbau, aber der Kern ist der kontrollierte Briefing-Agent-Graph.

**Muss ich Multi-Agent implementieren?**  
Nein. Für den Workshop reicht ein klarer Graph. Für die Challenge ist Supervisor plus zwei Worker die empfohlene Ausbauvariante.

**Kann ich einen eigenen Korpus verwenden?**  
Ja. Der Korpus muss reproduzierbar geladen werden und genügend belegbare Fragen ermöglichen.

**Was ist der wichtigste Qualitätsmaßstab?**  
Der Agent darf fachliche Aussagen nur mit Quellenbezug ausgeben und muss fehlendes Wissen sichtbar begrenzen.

---

**Version:** 2.0<br>
**Stand:** Juli 2026<br>
