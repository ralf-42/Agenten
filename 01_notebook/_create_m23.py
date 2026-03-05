import json

def md(cid, src):
    return {"cell_type": "markdown", "id": cid, "metadata": {}, "source": src}

def code(cid, src):
    return {"cell_type": "code", "id": cid, "metadata": {},
            "execution_count": None, "outputs": [], "source": src}

cells = []

# ── Banner & Titel ────────────────────────────────────────────────────────────
cells.append(md("m000", "![Banner](https://raw.githubusercontent.com/ralf-42/Image/main/genai-banner-2.jpg)"))

cells.append(md("m001", """<p><font size="6" color='grey'> <b>
KI-Agenten. Verstehen. Anwenden. Gestalten.
</b></font> </br></p>

<p><font size="5" color='grey'> <b>
Agent Evaluation & Testing
</b></font> </br></p>

---"""))

# ── Setup ─────────────────────────────────────────────────────────────────────
cells.append(code("c001", """\
#@title 🔧 Umgebung einrichten{ display-mode: "form" }
!uv pip install --system -q git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

import os
os.environ["LANGSMITH_TRACING"]  = "true"
os.environ["LANGSMITH_PROJECT"]  = "M23-Agent-Evaluation"
os.environ["LANGSMITH_ENDPOINT"] = "https://eu.api.smith.langchain.com"

from genai_lib.utilities import (
    check_environment, get_ipinfo, setup_api_keys,
    mprint, install_packages, mermaid, load_prompt
)
setup_api_keys(['OPENAI_API_KEY', 'LANGSMITH_API_KEY'], create_globals=False)
print()
check_environment()
print()
get_ipinfo()"""))

cells.append(code("c002", """\
#@title 📦 Pakete installieren{ display-mode: "form" }
install_packages([
    ('ragas', 'ragas'),
    ('wikipedia', 'wikipedia'),
])"""))

# ── Kapitel 1: Übersicht ──────────────────────────────────────────────────────
cells.append(md("m010", "# 1 | Übersicht\n---"))

cells.append(md("m011", """\
**M21** legte die Grundlagen: Tracing, Datasets, Custom Evaluator, LLM-as-Judge, A/B-Tests.
**M23** vertieft und erweitert: Metriken-Taxonomie, Tool-Unit-Tests, RAGAS und Regressions-Tests.

| Thema | M21 | M23 |
|-------|-----|-----|
| Tracing & Datasets | ✅ Basics | ✅ Anwendung |
| Custom Evaluator | ✅ Keyword-Overlap | ✅ Task-Erfolg, Tool-Präzision |
| LLM-as-Judge | ✅ Einführung | ✅ Erweiterter Judge |
| Tool-Unit-Tests | ❌ | ✅ unittest-Pattern |
| RAGAS | ⚡ Ausblick | ✅ Praxis |
| Regressions-Tests | ❌ | ✅ Baseline-Workflow |

**Lernziele:**
- Metriken für Agenten systematisch auswählen (Task-Erfolg, Tool-Nutzung, Kosten)
- Tools isoliert mit unittest testen
- RAGAS für RAG-Agenten einsetzen
- Regressions-Tests nach Prompt- oder Modell-Änderungen durchführen"""))

cells.append(code("c012", """\
#@title
#@markdown   <p><font size="4" color='green'>  flowchart: Lernpfad M21 → M23</font> </br></p>

diagram = '''
%%{init: {'theme':'dark'}}%%
flowchart LR
    M21["M21\\nEvaluations Basics\\nTracing · Datasets · A/B-Test"]
    M22["M22\\nAgentic RAG\\nMulti-Hop · Adaptive"]
    M23(["🎯 M23\\nAgent Evaluation\\n& Testing"])

    M21 --> M23
    M22 --> M23

    style M21 fill:#37474F,color:#fff
    style M22 fill:#37474F,color:#fff
    style M23 fill:#FF9800,color:#000
'''
mermaid(diagram, width=700)"""))

# ── Kapitel 2: Metriken-Taxonomie ─────────────────────────────────────────────
cells.append(md("m020", "# 2 | Metriken-Taxonomie\n---"))

cells.append(md("m021", """\
Agenten-Evaluation braucht andere Metriken als einfache LLM-Evaluation,
weil Agenten **Entscheidungen treffen**, **Tools nutzen** und **iterieren**.

| Kategorie | Metrik | Frage |
|-----------|--------|-------|
| **Task-Erfolg** | Aufgabe erfüllt? | Hat der Agent das Ziel erreicht? |
| **Tool-Nutzung** | Richtiges Tool? | Präzision der Tool-Selektion |
| **Effizienz** | Wie viele Schritte? | Iterationen, Loop-Tiefe |
| **Kosten** | Token-Verbrauch | Input + Output Tokens, API-Kosten |

> **Tipp:** Nicht alle vier Kategorien sind immer relevant.
> Für einfache FAQ-Agenten genügen Task-Erfolg und Kosten.
> Für Multi-Agent-Supervisoren sind Tool-Nutzung und Effizienz entscheidend."""))

cells.append(code("c022", """\
#@title
#@markdown   <p><font size="4" color='green'>  flowchart: Metriken-Übersicht</font> </br></p>

diagram = '''
%%{init: {'theme':'dark'}}%%
flowchart TD
    ROOT(["Agent-Metriken"])
    ROOT --> TE["✅ Task-Erfolg"]
    ROOT --> TN["🔧 Tool-Nutzung"]
    ROOT --> EF["⚡ Effizienz"]
    ROOT --> KO["💰 Kosten"]
    TE --> TE1["Aufgabe erfüllt"]
    TE --> TE2["Korrekte Antwort"]
    TN --> TN1["Richtiges Tool"]
    TN --> TN2["Unnötige Calls"]
    EF --> EF1["Schritt-Anzahl"]
    EF --> EF2["Latenz"]
    KO --> KO1["Input-Tokens"]
    KO --> KO2["Output-Tokens"]
    style ROOT fill:#FF9800,color:#000
    style TE   fill:#4CAF50,color:#fff
    style TN   fill:#2196F3,color:#fff
    style EF   fill:#9C27B0,color:#fff
    style KO   fill:#F44336,color:#fff
'''
mermaid(diagram, width=700)"""))

cells.append(code("c023", """\
import dataclasses, time, re
from typing import Annotated
from typing_extensions import TypedDict
from langchain.chat_models import init_chat_model
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition, create_react_agent
from IPython.display import Image as IPImage, display

llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)
print("✅ LLM initialisiert")"""))

cells.append(code("c024", """\
@dataclasses.dataclass
class AgentMetriken:
    \"\"\"Sammelt Metriken eines Agent-Laufs.\"\"\"
    task_erfuellt:  bool  = False
    tool_calls:     int   = 0
    richtige_tools: int   = 0
    schritte:       int   = 0
    input_tokens:   int   = 0
    output_tokens:  int   = 0
    latenz_sek:     float = 0.0

    @property
    def tool_praezision(self) -> float:
        return self.richtige_tools / self.tool_calls if self.tool_calls > 0 else 0.0

    @property
    def kosten_usd(self) -> float:
        \"\"\"Schätzung gpt-4o-mini: 0.15$/1M input, 0.60$/1M output.\"\"\"
        return (self.input_tokens * 0.00000015) + (self.output_tokens * 0.0000006)

    def report(self) -> str:
        ok = "✅" if self.task_erfuellt else "❌"
        return (
            f"Task erfüllt:      {ok}\\n"
            f"Tool-Calls:        {self.tool_calls}\\n"
            f"Tool-Präzision:    {self.tool_praezision:.0%}\\n"
            f"Schritte:          {self.schritte}\\n"
            f"Tokens (in/out):   {self.input_tokens} / {self.output_tokens}\\n"
            f"Geschätzte Kosten: ${self.kosten_usd:.5f}\\n"
            f"Latenz:            {self.latenz_sek:.2f}s"
        )

def extrahiere_metriken(result: dict, start_time: float,
                        erwartete_tools: list = None) -> AgentMetriken:
    \"\"\"Extrahiert Metriken aus einem Agent-Ergebnis.\"\"\"
    m = AgentMetriken()
    m.latenz_sek = time.time() - start_time
    messages = result.get("messages", [])
    m.schritte = len(messages)
    for msg in messages:
        if hasattr(msg, "tool_calls") and msg.tool_calls:
            m.tool_calls += len(msg.tool_calls)
            if erwartete_tools:
                for tc in msg.tool_calls:
                    if tc["name"] in erwartete_tools:
                        m.richtige_tools += 1
        if hasattr(msg, "usage_metadata") and msg.usage_metadata:
            m.input_tokens  += msg.usage_metadata.get("input_tokens", 0)
            m.output_tokens += msg.usage_metadata.get("output_tokens", 0)
    letzter = messages[-1].content if messages else ""
    m.task_erfuellt = bool(letzter and len(letzter) > 20)
    return m

print("✅ AgentMetriken und extrahiere_metriken bereit")"""))

# ── Kapitel 3: Tool-Unit-Tests ────────────────────────────────────────────────
cells.append(md("m030", "# 3 | Tool-Unit-Tests\n---"))

cells.append(md("m031", """\
<p><font color='black' size="5">Warum Tools isoliert testen?</font></p>

Agenten-Fehler entstehen oft nicht im LLM, sondern in den Tools:
falsche Datentypen, fehlende Fehlerbehandlung, unerwartete Rückgaben.

| Ebene | Was | Geschwindigkeit | Kosten |
|-------|-----|----------------|--------|
| **Unit-Tests** | Einzelne Tools | ⚡ sehr schnell | kostenlos |
| **Integration** | Agent + Tools | 🐢 mittel | API-Kosten |
| **End-to-End** | Vollständiges System | 🐌 langsam | höchste Kosten |

> Empfehlung: Zuerst alle Tools mit Unit-Tests absichern,
> dann Integration-Tests für häufige Szenarien."""))

cells.append(code("c032", """\
#@title
#@markdown   <p><font size="4" color='green'>  flowchart: Test-Pyramide</font> </br></p>

diagram = '''
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph E2E["🔺 End-to-End"]
        EE["Vollständiger Flow\\nLangSmith evaluate()\\nLangsam · teuer"]
    end
    subgraph INT["🔶 Integration"]
        IT["Agent + Tools\\ninvoke()\\nMittel · API-Kosten"]
    end
    subgraph UNIT["🔷 Unit"]
        UT["Einzelne Tools\\nunittest\\nSchnell · kostenlos"]
    end
    UNIT --> INT --> E2E
    style UNIT fill:#1565C0,color:#fff
    style INT  fill:#E65100,color:#fff
    style E2E  fill:#880E4F,color:#fff
'''
mermaid(diagram, width=600)"""))

cells.append(code("c033", """\
@tool
def berechne_mwst(betrag: float, steuersatz: float = 0.19) -> str:
    \"\"\"Berechnet die MwSt fuer einen Netto-Betrag.

    Args:
        betrag:     Netto-Betrag in Euro (muss > 0 sein)
        steuersatz: Steuersatz als Dezimalzahl (Standard: 0.19 = 19%)
    \"\"\"
    if betrag <= 0:
        return "Fehler: Betrag muss groesser als 0 sein."
    if not (0 < steuersatz < 1):
        return "Fehler: Steuersatz muss zwischen 0 und 1 liegen."
    steuer = round(betrag * steuersatz, 2)
    brutto = round(betrag + steuer, 2)
    return f"Netto: {betrag:.2f}€ | MwSt ({steuersatz:.0%}): {steuer:.2f}€ | Brutto: {brutto:.2f}€"

@tool
def umrechne_waehrung(betrag: float, von: str, nach: str) -> str:
    \"\"\"Rechnet einen Betrag zwischen EUR, USD und GBP um (feste Beispiel-Kurse).

    Args:
        betrag: Zu konvertierender Betrag
        von:    Quell-Waehrung (EUR, USD, GBP)
        nach:   Ziel-Waehrung (EUR, USD, GBP)
    \"\"\"
    kurse = {
        ("EUR", "USD"): 1.08, ("USD", "EUR"): 0.93,
        ("EUR", "GBP"): 0.86, ("GBP", "EUR"): 1.16,
        ("USD", "GBP"): 0.79, ("GBP", "USD"): 1.26,
    }
    von, nach = von.upper(), nach.upper()
    if von == nach:
        return f"{betrag:.2f} {von} = {betrag:.2f} {nach}"
    kurs = kurse.get((von, nach))
    if kurs is None:
        return f"Fehler: Umrechnung {von} nach {nach} nicht unterstuetzt."
    return f"{betrag:.2f} {von} = {round(betrag * kurs, 2):.2f} {nach} (Kurs: {kurs})"

print("✅ Tools: berechne_mwst, umrechne_waehrung")"""))

cells.append(code("c034", """\
import unittest

class TestBerechneMwst(unittest.TestCase):

    def test_standard_19_prozent(self):
        r = berechne_mwst.invoke({"betrag": 100.0})
        self.assertIn("19.00", r)
        self.assertIn("119.00", r)

    def test_reduzierter_steuersatz(self):
        r = berechne_mwst.invoke({"betrag": 100.0, "steuersatz": 0.07})
        self.assertIn("7.00", r)

    def test_negativer_betrag(self):
        r = berechne_mwst.invoke({"betrag": -50.0})
        self.assertIn("Fehler", r)

    def test_betrag_null(self):
        r = berechne_mwst.invoke({"betrag": 0.0})
        self.assertIn("Fehler", r)

    def test_ungültiger_steuersatz(self):
        r = berechne_mwst.invoke({"betrag": 100.0, "steuersatz": 1.5})
        self.assertIn("Fehler", r)


class TestUmrechneWaehrung(unittest.TestCase):

    def test_eur_zu_usd(self):
        r = umrechne_waehrung.invoke({"betrag": 100.0, "von": "EUR", "nach": "USD"})
        self.assertIn("108.00", r)

    def test_gleiche_waehrung(self):
        r = umrechne_waehrung.invoke({"betrag": 50.0, "von": "EUR", "nach": "EUR"})
        self.assertIn("50.00", r)

    def test_nicht_unterstuetzt(self):
        r = umrechne_waehrung.invoke({"betrag": 100.0, "von": "EUR", "nach": "JPY"})
        self.assertIn("Fehler", r)


loader = unittest.TestLoader()
suite  = unittest.TestSuite()
suite.addTests(loader.loadTestsFromTestCase(TestBerechneMwst))
suite.addTests(loader.loadTestsFromTestCase(TestUmrechneWaehrung))
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"\\n{'✅ Alle Tests bestanden!' if result.wasSuccessful() else '❌ Tests fehlgeschlagen!'}")
print(f"Ausgeführt: {result.testsRun} | Fehler: {len(result.errors)} | Fehlschläge: {len(result.failures)}")"""))

# ── Kapitel 4: Dataset-basierte Evaluation ────────────────────────────────────
cells.append(md("m040", "# 4 | Dataset-basierte Agent-Evaluation\n---"))

cells.append(md("m041", """\
<p><font color='black' size="5">Finanz-Agent & Dataset</font></p>

Wir evaluieren einen Finanz-Assistenten mit den zwei getesteten Tools.
Neu gegenüber M21: drei aufeinander abgestimmte Evaluatoren.

| Evaluator | Prüft | Typ |
|-----------|-------|-----|
| **task_erfolg** | Erwartete Zahl in Antwort | Custom |
| **tool_auswahl** | Richtiges Tool aufgerufen | Custom |
| **effizienz** | Schritt-Anzahl ≤ 3 optimal | Custom |"""))

cells.append(code("c042", """\
finanz_agent = create_react_agent(
    llm,
    tools=[berechne_mwst, umrechne_waehrung],
    prompt=SystemMessage(
        "Du bist ein Finanz-Assistent. "
        "Nutze berechne_mwst fuer Steuerberechnungen und "
        "umrechne_waehrung fuer Waehrungsumrechnungen. "
        "Antworte auf Deutsch und zeige immer die berechneten Zahlen."
    )
)
try:
    display(IPImage(finanz_agent.get_graph().draw_mermaid_png()))
except Exception as e:
    print(f"(Graph-Visualisierung: {e})")
print("✅ Finanz-Agent erstellt")"""))

cells.append(code("c043", """\
from langsmith import Client
from langsmith.evaluation import evaluate

client      = Client()
DATASET_M23 = "M23-Finanz-Agent-v1"

examples = [
    {"inputs": {"frage": "Wie viel MwSt faellt auf 200 Euro an?"},
     "outputs": {"antwort": "38.00", "tool": "berechne_mwst"}},
    {"inputs": {"frage": "Was ist der Brutto-Preis fuer 500 Euro netto?"},
     "outputs": {"antwort": "595.00", "tool": "berechne_mwst"}},
    {"inputs": {"frage": "Wie viel sind 100 Euro in US-Dollar?"},
     "outputs": {"antwort": "108.00", "tool": "umrechne_waehrung"}},
    {"inputs": {"frage": "Rechne 250 USD in GBP um."},
     "outputs": {"antwort": "197.50", "tool": "umrechne_waehrung"}},
    {"inputs": {"frage": "Berechne MwSt 7% auf 80 Euro."},
     "outputs": {"antwort": "5.60", "tool": "berechne_mwst"}},
    {"inputs": {"frage": "100 GBP in Euro?"},
     "outputs": {"antwort": "116.00", "tool": "umrechne_waehrung"}},
]

vorhandene = [ds.name for ds in client.list_datasets()]
if DATASET_M23 in vorhandene:
    dataset = next(ds for ds in client.list_datasets() if ds.name == DATASET_M23)
    print(f"✅ Dataset vorhanden: '{DATASET_M23}'")
else:
    dataset = client.create_dataset(dataset_name=DATASET_M23,
        description="Finanz-Agent Evaluation – MwSt & Waehrungsumrechnung")
    for ex in examples:
        client.create_example(dataset_id=dataset.id,
            inputs=ex["inputs"], outputs=ex["outputs"])
    print(f"✅ Dataset erstellt mit {len(examples)} Examples")"""))

cells.append(code("c044", """\
def task_erfolg_evaluator(inputs, outputs, reference_outputs) -> dict:
    \"\"\"Prueft ob die erwartete Zahl in der Antwort vorkommt.\"\"\"
    antwort  = outputs.get("antwort", "")
    referenz = reference_outputs.get("antwort", "")
    zahlen   = re.findall(r"\\d+\\.\\d+", referenz)
    if not zahlen:
        return {"key": "task_erfolg", "score": 0.5}
    treffer = sum(1 for z in zahlen if z in antwort)
    return {"key": "task_erfolg", "score": round(treffer / len(zahlen), 3)}

def tool_auswahl_evaluator(inputs, outputs, reference_outputs) -> dict:
    \"\"\"Prueft ob der Agent das richtige Tool aufgerufen hat.\"\"\"
    erwartetes = reference_outputs.get("tool", "")
    genutztes  = outputs.get("tool_genutzt", "")
    return {"key": "tool_auswahl", "score": 1.0 if erwartetes in genutztes else 0.0}

def effizienz_evaluator(inputs, outputs, reference_outputs) -> dict:
    \"\"\"Bewertet Effizienz: 3 Schritte = optimal (Score 1.0).\"\"\"
    schritte = outputs.get("schritte", 10)
    score    = max(0.0, 1.0 - (schritte - 3) * 0.2)
    return {"key": "effizienz", "score": round(score, 2)}

print("✅ Evaluatoren: task_erfolg, tool_auswahl, effizienz")"""))

cells.append(code("c045", """\
def finanz_agent_fn(inputs: dict) -> dict:
    t0   = time.time()
    result = finanz_agent.invoke(
        {"messages": [HumanMessage(inputs["frage"])]},
        config={"run_name": "M23-Eval", "tags": ["m23"],
                "recursion_limit": 10}
    )
    msgs = result.get("messages", [])
    tools_genutzt = []
    for msg in msgs:
        if hasattr(msg, "tool_calls") and msg.tool_calls:
            tools_genutzt.extend(tc["name"] for tc in msg.tool_calls)
    return {
        "antwort":      msgs[-1].content if msgs else "",
        "tool_genutzt": ",".join(tools_genutzt),
        "schritte":     len(msgs),
        "latenz":       round(time.time() - t0, 2),
    }

print("Starte Evaluation...\\n")
eval_results = evaluate(
    finanz_agent_fn,
    data              = DATASET_M23,
    evaluators        = [task_erfolg_evaluator, tool_auswahl_evaluator, effizienz_evaluator],
    experiment_prefix = "M23-Basis",
    max_concurrency   = 1,
)
print(f"\\n✅ Evaluation: {eval_results.experiment_name}")
print("→ Ergebnisse in LangSmith: Projekt M23-Agent-Evaluation")"""))

# ── Kapitel 5: RAGAS ─────────────────────────────────────────────────────────
cells.append(md("m050", "# 5 | RAGAS für RAG-Agenten\n---"))

cells.append(md("m051", """\
<p><font color='black' size="5">RAGAS-Metriken im Überblick</font></p>

Aufbauend auf dem Agentic RAG aus M22 – RAGAS ergänzt LangSmith Evaluations
mit RAG-spezifischen Metriken.

| Metrik | Frage | Wertebereich |
|--------|-------|-------------|
| **Faithfulness** | Ist die Antwort durch die Chunks belegbar? | 0.0 – 1.0 |
| **Answer Relevancy** | Beantwortet die Antwort die Frage? | 0.0 – 1.0 |
| **Context Recall** | Wurden alle relevanten Chunks gefunden? | 0.0 – 1.0 |
| **Context Precision** | Wie viele Chunks sind tatsächlich relevant? | 0.0 – 1.0 |

**Wann RAGAS, wann LangSmith evaluate()?**

| | RAGAS | LangSmith evaluate() |
|---|---|---|
| **Fokus** | Retrieval-Qualität | Agent-Verhalten allgemein |
| **Metriken** | Faithfulness, Recall | Custom + LLM-as-Judge |
| **Einsatz** | M08–M11, M22 | M21, alle Agenten |"""))

cells.append(code("c052", """\
#@title
#@markdown   <p><font size="4" color='green'>  flowchart: RAGAS Evaluation Pipeline</font> </br></p>

diagram = '''
%%{init: {'theme':'dark'}}%%
flowchart LR
    subgraph RAG["RAG-Agent (M22)"]
        Q[/Query/] --> RET[Retrieval] --> GEN[Generation] --> ANS[/Antwort/]
    end
    subgraph EVAL["RAGAS"]
        F["Faithfulness\\nAntwort vs. Chunks"]
        AR["Answer Relevancy\\nAntwort vs. Frage"]
    end
    RET -->|contexts| F
    ANS -->|answer| F & AR
    Q   -->|question| AR
    F  --> S[/"Score 0–1"/]
    AR --> S
    style RAG  fill:#1A237E,color:#fff
    style EVAL fill:#1B5E20,color:#fff
    style S    fill:#FF9800,color:#000
'''
mermaid(diagram, width=800)"""))

cells.append(code("c053", """\
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

DOCS = [
    Document(page_content=(
        "LangChain ist ein Framework fuer LLM-Anwendungen. "
        "Es bietet Abstraktion fuer Modelle, Prompts, Chains und Agenten. "
        "LangChain 1.0 fuehrte init_chat_model() und with_structured_output() ein."
    ), metadata={"source": "langchain_info"}),
    Document(page_content=(
        "LangGraph ist ein Framework fuer Multi-Agent-Systeme. "
        "Es verwendet StateGraph mit Nodes und Edges. "
        "Checkpointing mit MemorySaver ermoeglicht persistente Sessions."
    ), metadata={"source": "langgraph_info"}),
    Document(page_content=(
        "LangSmith ist das Observability-Tool fuer LangChain-Anwendungen. "
        "Es trackt LLM-Aufrufe, ermoeglicht Dataset-basierte Evaluierung "
        "und A/B-Tests zwischen verschiedenen Modellen und Prompts."
    ), metadata={"source": "langsmith_info"}),
]

splitter    = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
split_docs  = splitter.split_documents(DOCS)
embeddings  = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(split_docs, embeddings,
                                    collection_name="m23_ragas_demo")
retriever   = vectorstore.as_retriever(search_kwargs={"k": 2})
print(f"✅ Vektordatenbank: {len(split_docs)} Chunks")"""))

cells.append(code("c054", """\
rag_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "Beantworte die Frage auf Basis des Kontexts. Sei praezise."),
        ("human",  "Kontext:\\n{context}\\n\\nFrage: {question}")
    ])
    | llm | StrOutputParser()
)

testfragen = [
    ("Was ist LangChain?",
     "LangChain ist ein Framework fuer LLM-Anwendungen mit Abstraktion fuer Modelle."),
    ("Was ermoeglicht Checkpointing in LangGraph?",
     "Checkpointing mit MemorySaver ermoeglicht persistente Sessions."),
    ("Wofuer nutzt man LangSmith?",
     "LangSmith trackt LLM-Aufrufe und ermoeglicht Evaluierung und A/B-Tests."),
]

ragas_samples = []
for frage, ground_truth in testfragen:
    contexts  = retriever.invoke(frage)
    ctx_texts = [c.page_content for c in contexts]
    antwort   = rag_chain.invoke({"context": "\\n\\n".join(ctx_texts), "question": frage})
    ragas_samples.append({
        "user_input":         frage,
        "retrieved_contexts": ctx_texts,
        "response":           antwort,
        "reference":          ground_truth,
    })
    mprint(f"**Frage:** {frage}  \\n**Antwort:** {antwort}  \\n---")

print(f"\\n✅ {len(ragas_samples)} RAGAS-Samples vorbereitet")"""))

cells.append(code("c055", """\
try:
    from ragas import EvaluationDataset, evaluate as ragas_evaluate
    from ragas.metrics import faithfulness, answer_relevancy
    from ragas.llms import LangchainLLMWrapper

    ragas_llm = LangchainLLMWrapper(init_chat_model("openai:gpt-4o-mini", temperature=0.0))
    dataset   = EvaluationDataset.from_list(ragas_samples)
    result    = ragas_evaluate(dataset,
                    metrics=[faithfulness, answer_relevancy], llm=ragas_llm)

    mprint("## 📊 RAGAS Ergebnisse")
    df = result.to_pandas()
    for _, row in df.iterrows():
        mprint(
            f"**Frage:** {row.get('user_input', '')[:60]}  \\n"
            f"Faithfulness: `{row.get('faithfulness', 0):.2f}` | "
            f"Answer Relevancy: `{row.get('answer_relevancy', 0):.2f}`  \\n---"
        )
    mprint(f"**Ø Faithfulness:** `{df['faithfulness'].mean():.2f}` | "
           f"**Ø Answer Relevancy:** `{df['answer_relevancy'].mean():.2f}`")

except ImportError:
    mprint("⚠️ RAGAS nicht installiert – install_packages([('ragas','ragas')]) ausführen")
except Exception as e:
    mprint(f"⚠️ RAGAS-Fehler: {e}")"""))

# ── Kapitel 6: Regressions-Tests ──────────────────────────────────────────────
cells.append(md("m060", "# 6 | Regressions-Tests\n---"))

cells.append(md("m061", """\
<p><font color='black' size="5">Konzept</font></p>

Ein **Regressions-Test** prüft: *Hat meine Änderung etwas verschlechtert?*

Typische Auslöser:
- Neues Modell (`gpt-4o-mini` → `gpt-4o`)
- Geänderter System-Prompt
- Neue oder veränderte Tools
- Neue LangChain/LangGraph-Version

**Workflow:**
```
1. Baseline-Experiment auf Dataset  → Scores fixieren
2. Änderung vornehmen
3. Neues Experiment auf gleichem Dataset
4. Vergleich: besser · gleich · schlechter?
```

> In LangSmith: Baseline-Experiment → **"Pin as Baseline"**
> Alle nachfolgenden Experimente zeigen automatisch den Differenz-Score."""))

cells.append(code("c062", """\
#@title
#@markdown   <p><font size="4" color='green'>  flowchart: Regressions-Test Workflow</font> </br></p>

diagram = '''
%%{init: {'theme':'dark'}}%%
flowchart TD
    DS[("Dataset (fixiert)")]
    subgraph BASE["Baseline"]
        B1["Agent v1 (alter Prompt)"] --> B2["evaluate()"] --> B3["Baseline-Scores"]
    end
    subgraph NEW["Neues Experiment"]
        N1["Agent v2 (neuer Prompt)"] --> N2["evaluate()"] --> N3["Neue Scores"]
    end
    V1{"Score gestiegen?"}
    DS --> BASE & NEW
    B3 --> V1
    N3 --> V1
    V1 -->|"✅ JA"| DEPLOY["Deployment"]
    V1 -->|"❌ NEIN"| FIX["Analyse & Fix"]
    style BASE   fill:#1B5E20,color:#fff
    style NEW    fill:#E65100,color:#fff
    style DEPLOY fill:#4CAF50,color:#fff
    style FIX    fill:#B71C1C,color:#fff
'''
mermaid(diagram, width=700)"""))

cells.append(code("c063", """\
# Baseline
print("Schritt 1: Baseline...\\n")
baseline_results = evaluate(
    finanz_agent_fn, data=DATASET_M23,
    evaluators=[task_erfolg_evaluator, tool_auswahl_evaluator],
    experiment_prefix="M23-Baseline-v1", max_concurrency=1,
)
print(f"✅ Baseline: {baseline_results.experiment_name}")
print("→ In LangSmith als Baseline fixieren: Experiment → 'Pin as Baseline'\\n")

# Agent v2 mit verbessertem Prompt
finanz_agent_v2 = create_react_agent(
    llm,
    tools=[berechne_mwst, umrechne_waehrung],
    prompt=SystemMessage(
        "Du bist ein praeziser Finanz-Assistent. "
        "IMMER: Rufe zuerst das passende Tool auf, bevor du antwortest. "
        "berechne_mwst fuer MwSt- und Brutto-Fragen. "
        "umrechne_waehrung fuer alle Waehrungsumrechnungen. "
        "Zeige alle Zahlen mit Einheiten (€, $, £)."
    )
)

def finanz_agent_v2_fn(inputs: dict) -> dict:
    t0 = time.time()
    result = finanz_agent_v2.invoke(
        {"messages": [HumanMessage(inputs["frage"])]},
        config={"run_name": "M23-Eval-v2", "tags": ["m23", "regression"],
                "recursion_limit": 10}
    )
    msgs = result.get("messages", [])
    tools_genutzt = []
    for msg in msgs:
        if hasattr(msg, "tool_calls") and msg.tool_calls:
            tools_genutzt.extend(tc["name"] for tc in msg.tool_calls)
    return {
        "antwort":      msgs[-1].content if msgs else "",
        "tool_genutzt": ",".join(tools_genutzt),
        "schritte":     len(msgs),
        "latenz":       round(time.time() - t0, 2),
    }

print("Schritt 2: Regressions-Test (verbesserter Prompt)...\\n")
regression_results = evaluate(
    finanz_agent_v2_fn, data=DATASET_M23,
    evaluators=[task_erfolg_evaluator, tool_auswahl_evaluator],
    experiment_prefix="M23-Regression-v2", max_concurrency=1,
)
print(f"✅ Regressions-Test: {regression_results.experiment_name}")
print("→ LangSmith: Beide Experimente vergleichen → Side-by-Side-Ansicht")"""))

cells.append(code("c064", """\
def berechne_scores(eval_result) -> dict:
    scores = {}
    try:
        df = eval_result.to_pandas()
        for col in df.columns:
            if col not in ["input", "output", "reference", "id"]:
                try:
                    scores[col] = round(df[col].mean(), 3)
                except Exception:
                    pass
    except Exception:
        pass
    return scores

s1 = berechne_scores(baseline_results)
s2 = berechne_scores(regression_results)

mprint("## 📊 Regressions-Vergleich\\n")
mprint("| Metrik | Baseline v1 | Neu v2 | Δ |")
mprint("|--------|------------|--------|---|")
for m in sorted(set(s1.keys()) | set(s2.keys())):
    v1   = s1.get(m, 0)
    v2   = s2.get(m, 0)
    diff = v2 - v1
    sym  = "⬆️" if diff > 0.01 else ("⬇️" if diff < -0.01 else "➡️")
    mprint(f"| {m} | {v1:.3f} | {v2:.3f} | {sym} {diff:+.3f} |")"""))

# ── Aufgabe ───────────────────────────────────────────────────────────────────
cells.append(md("m_a00", "# A | Aufgabe\n---"))
cells.append(md("m_a01", "Die Aufgabenstellungen bieten Anregungen. Du kannst auch eine andere Herausforderung angehen."))

cells.append(md("m_a02", """\
<p><font color='black' size="5">Aufgabe 1: Eigene Tools testen</font></p>

Erstelle **zwei eigene Tools** (z.B. Einheiten-Umrechner, Text-Analyse, Kalender-Rechner).

1. Implementiere die Tools mit dem `@tool` Decorator
2. Schreibe **mindestens 4 Unit-Tests** pro Tool mit `unittest`
3. Teste auch **Fehlerfälle** (negativer Input, ungültige Typen, leere Strings)
4. Alle Tests müssen grün sein

**Bonus:** Wandle die Tests in `pytest`-Format um (`def test_...()` ohne Klasse)."""))

cells.append(md("m_a03", """\
<p><font color='black' size="5">Aufgabe 2: Dataset & Evaluation</font></p>

Baue einen Agenten mit den Tools aus Aufgabe 1 und evaluiere ihn mit LangSmith.

1. Erstelle ein **Dataset** mit 5–8 Beispielen
2. Implementiere einen `task_erfolg_evaluator` passend zu deinem Thema
3. Implementiere einen `tool_auswahl_evaluator`
4. Führe `evaluate()` aus und analysiere die Scores

**Bonus:** Füge einen LLM-as-Judge hinzu (aufbauend auf M21)."""))

cells.append(md("m_a04", """\
<p><font color='black' size="5">Aufgabe 3: Regressions-Test</font></p>

Führe einen Regressions-Test mit zwei Prompt-Varianten durch:

1. **Baseline**: Kurzer System-Prompt (1–2 Sätze)
2. **Variante**: Detaillierter Prompt mit expliziten Tool-Anweisungen
3. Beide Experimente auf **demselben Dataset**
4. Vergleiche Scores lokal und in LangSmith

Welche Variante erzielt bessere Task-Erfolg-Scores?
Ist der detailliertere Prompt immer besser?"""))

# ── Notebook schreiben ────────────────────────────────────────────────────────
nb = {
    "nbformat": 4,
    "nbformat_minor": 5,
    "metadata": {
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
        "language_info": {"name": "python", "version": "3.10.0"},
        "colab": {"provenance": []}
    },
    "cells": cells
}

path = "C:/Users/ralfb/OneDrive/Desktop/Kurse/Agenten/01_Notebook/M23_Agent_Evaluation_Testing.ipynb"
with open(path, "w", encoding="utf-8") as f:
    json.dump(nb, f, ensure_ascii=False, indent=1)

print(f"✅ Notebook: {path}")
print(f"   Zellen gesamt: {len(cells)}")
