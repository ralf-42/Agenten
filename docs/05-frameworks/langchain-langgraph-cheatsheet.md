---
layout: default
title: Cheatsheet
parent: Frameworks
nav_order: 5
description: Kompakte Referenz für LangChain, LangGraph, State, Routing, Checkpointing, Memory und LangSmith im Agenten-Kurs
has_toc: true
---

# Cheatsheet

> **Kurzreferenz für Agenten-Notebooks: Wann reicht LangChain, wann braucht es LangGraph, und wo gehören State, Memory und LangSmith hin?**

---

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

<img src="https://raw.githubusercontent.com/ralf-42/Agenten/main/07_image/cheatsheet.png" class="logo" width="750"/>
<p><font color='black' size="2">
KI-generiertes Bild
</font></p>

## Schnellentscheidung

| Frage | Empfehlung |
|---|---|
| Einzelner Modellaufruf, Prompt oder Parser? | LangChain |
| Lineare Pipeline ohne Verzweigung? | LangChain LCEL |
| Agent mit wenigen Tools, ohne eigene Ablaufsteuerung? | LangChain `create_agent()` |
| LLM soll selbst Tools wählen, Ablauf aber sichtbar bleiben? | LangGraph `ToolNode` + `tools_condition` |
| Mehrere Schritte mit Routing, Schleifen oder Gates? | LangGraph `StateGraph` |
| Review, Freigabe oder Unterbrechung? | LangGraph `interrupt()` + `Command(resume=...)` |
| Gesprächsverlauf in einer laufenden Session? | LangGraph Checkpointer + stabile `thread_id` |
| Dauerhafte Präferenzen, Nutzerprofile oder Fakten? | Separates Memory-System |
| Debugging, Tracing oder Evaluation? | LangSmith |

## Import-Spickzettel

```python
from typing import Annotated, Literal
from typing_extensions import TypedDict

from pydantic import BaseModel, Field

from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain_core.caches import InMemoryCache
from langchain_core.globals import set_llm_cache
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool

from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.types import Command, interrupt
```

## Minimaler LangChain-Baustein

```python
llm = init_chat_model("openai:gpt-5.4-mini")

prompt = ChatPromptTemplate([
    ("system", "Antworte kurz, konkret und auf Deutsch."),
    ("human", "{frage}"),
])

chain = prompt | llm | StrOutputParser()

antwort = chain.invoke({"frage": "Was ist ein KI-Agent?"})
print(antwort)
```

## LLM-Caching

```python
from langchain_core.caches import InMemoryCache
from langchain_core.globals import set_llm_cache

set_llm_cache(InMemoryCache())

antwort = llm.invoke("Erkläre Tool-Use bei Agenten in einem Satz.")
print(antwort.content)
```

**Regel:** Caching ist für wiederholte Demo-Aufrufe nützlich. Es ist kein Memory: Cache speichert Modellantworten zu identischen Requests, Checkpointing speichert Session- oder Graph-Zustand. Agenten- und Tool-Läufe mit Seiteneffekten nicht blind cachen.

**Hierher gehören:** Modellaufrufe, Prompt-Vorlagen, Output Parser, Structured Output, lineare RAG-Chains und einfache Agenten mit `create_agent()`.

## Einfacher Agent mit Tools

```python
@tool
def quellen_check(thema: str) -> str:
    """Prüft grob, ob ein Thema zum Research-Korpus passt."""
    if thema.lower() in {"rag", "retrieval", "evaluation"}:
        return "Korpusnah: Antwort mit Quelle belegen."
    return "Korpusabdeckung unklar."


agent = create_agent(
    model=init_chat_model("openai:gpt-5.4-mini"),
    tools=[quellen_check],
    system_prompt="Du bist ein Research Assistant. Nutze Tools für Korpusfragen.",
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "Prüfe RAG-Evaluation."}]
})
print(result["messages"][-1].content)
```

**Regel:** `create_agent()` ist gut für schnelle Agenten. Wenn Routing, Gates, Checkpointing oder HITL explizit sichtbar sein sollen, wechsle zu LangGraph.

## Structured Output

```python
class FrageTyp(BaseModel):
    kategorie: Literal["definition", "retrieval", "out_of_corpus"] = Field(
        description="Kategorie der Research-Frage"
    )


router = llm.with_structured_output(FrageTyp)
ergebnis = router.invoke("Warum verbessert RAG die Zuverlässigkeit?")
print(ergebnis.kategorie)
```

**Regel:** Für robuste Klassifikation oder Extraktion nicht nur JSON im Prompt verlangen, sondern `with_structured_output()` mit Pydantic-Schema nutzen.

## Minimaler LangGraph-State

```python
class ResearchState(TypedDict):
    messages: Annotated[list, add_messages]
    routing: str
    antwort: str
```

**State enthält nur, was zwischen Nodes gebraucht wird.**

| Gehoert in den State | Besser nicht in den State |
|---|---|
| Nachrichtenverlauf | grosse Dokumente |
| Routing-Entscheidung | komplette Vektorindizes |
| Zwischenergebnis für nächste Node | temporäre lokale Hilfsvariablen |
| Freigabe-Status | API-Keys oder Secrets |
| Fehlerstatus | rohe Debug-Logs |

## Minimaler StateGraph

```python
def analyse_node(state: ResearchState) -> dict:
    frage = state["messages"][-1].content
    routing = "retrieval" if "rag" in frage.lower() else "definition"
    return {"routing": routing}


def antwort_node(state: ResearchState) -> dict:
    return {"antwort": f"Gewählter Pfad: {state['routing']}"}


builder = StateGraph(ResearchState)
builder.add_node("analyse", analyse_node)
builder.add_node("antwort", antwort_node)
builder.add_edge(START, "analyse")
builder.add_edge("analyse", "antwort")
builder.add_edge("antwort", END)

graph = builder.compile()
```

## Conditional Routing

```python
def route_by_category(state: ResearchState) -> str:
    return state["routing"]


def definition_node(state: ResearchState) -> dict:
    return {"antwort": "Definitionspfad: kurz erklären."}


def retrieval_node(state: ResearchState) -> dict:
    return {"antwort": "Retrievalpfad: Korpus abrufen und Quellen nennen."}


builder = StateGraph(ResearchState)
builder.add_node("analyse", analyse_node)
builder.add_node("definition", definition_node)
builder.add_node("retrieval", retrieval_node)
builder.add_edge(START, "analyse")
builder.add_conditional_edges(
    "analyse",
    route_by_category,
    {
        "definition": "definition",
        "retrieval": "retrieval",
    },
)
builder.add_edge("definition", END)
builder.add_edge("retrieval", END)

graph = builder.compile()
```

**Regel:** Router-Funktionen entscheiden nur. Die eigentliche Arbeit gehört in Nodes.

## Qualitätsgate mit Schleife

```python
class QualityState(TypedDict):
    antwort: str
    score: float
    versuche: int


def check_node(state: QualityState) -> dict:
    score = 0.9 if "Quelle:" in state["antwort"] else 0.4
    return {"score": score, "versuche": state["versuche"] + 1}


def revise_node(state: QualityState) -> dict:
    return {"antwort": state["antwort"] + " Quelle: kurs_korpus.md"}


def quality_router(state: QualityState) -> str:
    if state["score"] < 0.7 and state["versuche"] < 2:
        return "revise"
    return END


builder.add_conditional_edges("check", quality_router)
builder.add_edge("revise", "check")
```

**Regel:** Schleifen brauchen Abbruchbedingungen im State, zum Beispiel `versuche` oder `max_iter`.

## Tool-Loop im Graph

```python
@tool
def research_signal(text: str) -> str:
    """Extrahiert einfache Research-Signale."""
    begriffe = ["rag", "retrieval", "evaluation", "quelle"]
    treffer = [b for b in begriffe if b in text.lower()]
    return ", ".join(treffer) if treffer else "Keine klaren Signale."


tools = [research_signal]
llm_with_tools = llm.bind_tools(tools)


class ToolState(TypedDict):
    messages: Annotated[list, add_messages]


def agent_node(state: ToolState) -> dict:
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}


builder = StateGraph(ToolState)
builder.add_node("agent", agent_node)
builder.add_node("tools", ToolNode(tools))
builder.add_edge(START, "agent")
builder.add_conditional_edges("agent", tools_condition)
builder.add_edge("tools", "agent")

graph = builder.compile()
```

**Merksatz:** `bind_tools()` macht Tools dem Modell bekannt. `ToolNode` führt Tool-Calls aus. `tools_condition` routet zwischen Tool-Ausführung und `END`.

## Checkpointing ist Session-Gedaechtnis

```python
checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "research-pia-rag-01"}}

graph.invoke(
    {"messages": [("human", "Merke: Thema ist RAG-Evaluation.")]},
    config=config,
)

result = graph.invoke(
    {"messages": [("human", "Was war das Thema?")]},
    config=config,
)
```

**Checkpointing speichert den Graph-State pro `thread_id`.** Das ist ideal für laufende Sessions, Wiederaufnahme und Human-in-the-Loop.

| Begriff | Bedeutung |
|---|---|
| `checkpointer` | Speicher für Graph-Zustände |
| `thread_id` | eindeutige Session-ID |
| `InMemorySaver` | flüchtiger Speicher für Notebooks und Demos |
| `SqliteSaver` | persistenter Speicher für lokale Prototypen |
| Postgres-Checkpointer | persistenter Speicher für produktionsnahe Umgebungen |

## Persistenter Checkpointer

```python
import sqlite3
from langgraph.checkpoint.sqlite import SqliteSaver


conn = sqlite3.connect("agent_sessions.db", check_same_thread=False)
checkpointer = SqliteSaver(conn)
app = builder.compile(checkpointer=checkpointer)
```

**Regel:** `InMemorySaver()` ist für Demos. Sobald ein Notebook-Neustart oder mehrere Sessions relevant sind, persistenten Checkpointer nutzen.

## Human-in-the-Loop

```python
class ReviewState(TypedDict):
    entwurf: str
    genehmigt: bool
    finaler_text: str


def review_node(state: ReviewState) -> dict:
    entscheidung = interrupt({
        "frage": "Research-Antwort freigeben?",
        "entwurf": state["entwurf"],
    })
    return {"genehmigt": str(entscheidung).lower() == "ja"}


def publish_node(state: ReviewState) -> dict:
    if not state["genehmigt"]:
        return {"finaler_text": "Nicht veröffentlicht."}
    return {"finaler_text": state["entwurf"]}


graph = builder.compile(checkpointer=InMemorySaver())
config = {"configurable": {"thread_id": "review-42"}}

graph.invoke(start_state, config=config)
result = graph.invoke(Command(resume="ja"), config=config)
```

**Wichtig:** `interrupt()` braucht einen Checkpointer und eine stabile `thread_id`, sonst kann der Graph nicht sauber fortgesetzt werden.

## Memory ist mehr als Chatverlauf

| Ebene | Zweck | Typische Umsetzung |
|---|---|---|
| Prompt-Kontext | Aktuelle Aufgabe steuern | Systemprompt, Beispiele |
| Message History | Bisheriger Dialog | `add_messages` |
| Checkpointing | Session fortsetzen | LangGraph Checkpointer |
| RAG-Memory | Wissen abrufen | ChromaDB, Retriever |
| Semantisches Memory | Präferenzen/Fakten suchen | Vektorstore + Regeln |
| Langzeit-Memory | Nutzerprofile, Policies | Datenbank + explizite Freigabe |

**Nicht verwechseln:** Ein Checkpointer speichert Zustand. Er entscheidet nicht, was dauerhaft sinnvoll, erlaubt oder relevant ist.

## Multi-Agent Supervisor

```python
class SupervisorState(TypedDict):
    frage: str
    route: str
    tabellenbefund: str
    textbefund: str
    synthese: str
    log: list[str]


def supervisor_node(state: SupervisorState) -> dict:
    if not state["tabellenbefund"]:
        route = "tabellen_worker"
    elif not state["textbefund"]:
        route = "text_worker"
    elif not state["synthese"]:
        route = "synthese_worker"
    else:
        route = "FINISH"
    return {"route": route, "log": state["log"] + [f"Supervisor -> {route}"]}


def supervisor_router(state: SupervisorState) -> str:
    return END if state["route"] == "FINISH" else state["route"]


builder.add_conditional_edges(
    "supervisor",
    supervisor_router,
    {
        "tabellen_worker": "tabellen_worker",
        "text_worker": "text_worker",
        "synthese_worker": "synthese_worker",
        END: END,
    },
)
```

**Regel:** Supervisor-Pattern nutzen, wenn mehrere spezialisierte Worker koordiniert werden müssen und die Entscheidung im Trace sichtbar sein soll.

## LangSmith im Agenten-Workflow

LangSmith gehört ins Cheatsheet, aber nicht als Memory- oder State-System. Es macht Runs, Node-Schritte, Tool-Calls, HITL-Unterbrechungen und Evaluationen sichtbar.

### Setup-Regel

```python
import os

# Vor dem ersten LangChain-/LangGraph-Import setzen.
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_PROJECT"] = "Agenten-Cheatsheet"
os.environ["LANGSMITH_ENDPOINT"] = "https://eu.api.smith.langchain.com"
```

**Regel:** `LANGSMITH_ENDPOINT` und `LANGSMITH_TRACING` müssen vor LangChain-/LangGraph-Imports gesetzt sein. `LANGSMITH_PROJECT` gehört in die Setup-Zelle, bevor der erste Trace entsteht.

### Run-Konfiguration

```python
run_cfg = {
    "run_name": "Research_Assistant_Demo",
    "tags": ["cheatsheet", "langgraph", "research"],
    "metadata": {
        "kurs": "Agenten",
        "version": "1.0",
        "workflow": "research-assistant",
    },
}

result = graph.invoke(start_state, config=run_cfg)
```

Bei Sessions wird `thread_id` zusaetzlich in `configurable` gesetzt:

```python
run_cfg = {
    "run_name": "Research_Assistant_Demo",
    "tags": ["cheatsheet", "checkpointing"],
    "metadata": {"kurs": "Agenten", "workflow": "session"},
}

result = graph.invoke(start_state, config={
    "configurable": {"thread_id": "research-demo-01"},
    **run_cfg,
})
```

### `with_config()` für wiederverwendbare Chains

```python
chain = (prompt | llm | StrOutputParser()).with_config({
    "run_name": "Kurzantwort_Chain",
    "tags": ["langchain", "snippet"],
    "metadata": {"baustein": "prompt-llm-parser"},
})

antwort = chain.invoke({"frage": "Was ist Checkpointing?"})
```

**Regel:** `with_config()` eignet sich für wiederverwendbare Chains oder Sub-Komponenten. Pro konkretem Lauf kann `invoke(..., config=...)` weitere Tags, Metadaten oder `thread_id` ergänzen.

### Was LangSmith bei LangGraph zeigt

| Ebene | Sichtbar in LangSmith | Nutzen |
|---|---|---|
| Graph-Run | Input, Output, Laufzeit, Status | Gesamtablauf pruefen |
| Node-Run | ein Span pro Node | Routing und Gates nachvollziehen |
| LLM-Run | Prompt, Response, Token, Modell | Prompt-Debugging |
| Tool-Run | Tool-Name, Argumente, Ergebnis | Tool-Nutzung pruefen |
| HITL-Run | `interrupted` und Resume-Run | Freigabeprozesse nachvollziehen |
| Evaluation | Dataset, Experiment, Scores | Regressionen erkennen |

### Mini-Evaluation

```python
from langsmith import Client

client = Client(api_url=os.environ["LANGSMITH_ENDPOINT"])

dataset_name = "A00 Research Assistant Smoke Test"
dataset = client.create_dataset(
    dataset_name=dataset_name,
    description="Kleine Regressionstests für Research-Antworten.",
)

client.create_example(
    inputs={"frage": "Wann ist LangGraph sinnvoll?"},
    outputs={"must_contain": "Routing"},
    dataset_id=dataset.id,
)


def target(inputs: dict) -> dict:
    antwort = chain.invoke({"frage": inputs["frage"]})
    return {"antwort": antwort}


def contains_expected(outputs: dict, reference_outputs: dict) -> bool:
    return reference_outputs["must_contain"].lower() in outputs["antwort"].lower()
```

**Regel:** Evaluation gehört nicht in jede kleine Demo-Zelle. Sie lohnt sich für wiederkehrende Tests: Routing, Quellenpflicht, Out-of-Corpus-Regel, Tool-Gates und HITL-Entscheidungen.

## Typische Fehler

| Fehler | Besser |
|---|---|
| LangGraph für jeden kleinen Modellaufruf verwenden | Erst LangChain, bei Routing/State zu LangGraph wechseln |
| Riesigen State bauen | State klein, explizit und typisiert halten |
| Pydantic als internen Graph-State nutzen | `TypedDict` für State, Pydantic für Ein-/Ausgaben |
| Routing im Prompt verstecken | Routing als `add_conditional_edges` sichtbar machen |
| Router-Funktion laesst LLM arbeiten | Router liest State und entscheidet nur |
| Schleife ohne Abbruch bauen | `versuche`, `max_iter` oder Qualitätsgrenze im State |
| Checkpointing als Langzeit-Memory verstehen | Session-State und Langzeit-Memory trennen |
| `thread_id` jedes Mal neu erzeugen | stabile ID pro Gespräch/Sitzung verwenden |
| `interrupt()` ohne Checkpointer nutzen | Graph mit `checkpointer=...` kompilieren |
| Tools direkt riskante Aktionen ausführen lassen | HITL-Gate vor irreversible Aktionen setzen |
| API-Keys oder Rohdaten im State speichern | Secrets extern halten, State datensparsam gestalten |
| LangSmith als Speicher verstehen | LangSmith für Tracing, Evaluation und Monitoring nutzen |

## Mini-Checkliste für neue Agenten-Notebooks

- [ ] Reicht LangChain oder ist LangGraph wirklich noetig?
- [ ] State als `TypedDict` definiert?
- [ ] Nachrichtenliste mit `Annotated[list, add_messages]` modelliert?
- [ ] Routing als eigene Funktion sichtbar?
- [ ] `with_structured_output()` für Klassifikation/Extraktion genutzt?
- [ ] Tool-Loop mit `bind_tools`, `ToolNode` und `tools_condition` sauber getrennt?
- [ ] Checkpointer nur dort aktiviert, wo Session-State gebraucht wird?
- [ ] Stabile `thread_id` für mehrturnige Beispiele gesetzt?
- [ ] LangSmith `run_name`, `tags` und `metadata` gesetzt?
- [ ] RAG-Retriever ausserhalb des State gehalten?
- [ ] Riskante Aktion mit `interrupt()` oder HITL-Gate abgesichert?
- [ ] Beispiel läuft deterministisch genug für Kurs und Colab?

## Weiterführende Kursseiten

| Thema | Seite |
|---|---|
| LangChain Einstieg | [Einsteiger LangChain](./einsteiger-langchain.html) |
| LangChain Standards | [LangChain Best Practices](./langchain-best-practices.html) |
| LangGraph Einstieg | [Einsteiger LangGraph](./einsteiger-langgraph.html) |
| LangGraph Standards | [LangGraph Best Practices](./langgraph-best-practices.html) |
| LangSmith Einstieg | [Einsteiger LangSmith](./einsteiger-langsmith.html) |
| LangSmith Standards | [LangSmith Best Practices](./langsmith-best-practices.html) |
| Checkpointing | [Checkpointing & Persistenz](../04-agenten-implementierung/ablauf-zustand/checkpointing-persistenz.html) |
| Human-in-the-Loop | [Human-in-the-Loop](../04-agenten-implementierung/ablauf-zustand/human-in-the-loop.html) |

---

**Version:** 1.0<br>
**Stand:** Juni 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
