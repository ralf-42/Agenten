
---

# 1 Kurzüberblick: Warum LangSmith?

LangChain und LangGraph ermöglichen den Bau komplexer KI-Agenten. Doch bei der Entwicklung stellen sich schnell Fragen:
- **Warum** hat der Agent eine bestimmte Entscheidung getroffen?
- **Welche** Tools wurden in welcher Reihenfolge aufgerufen?
- **Wo** ist der Fehler in einer 10-Schritte-Chain?
- **Wie gut** funktioniert das System mit echten Nutzerfragen?

LangSmith beantwortet diese Fragen durch:
- **Vollständiges Tracing** aller LLM-Calls, Tool-Aufrufe und Chain-Schritte
- **Visuelle Darstellung** komplexer Agent-Workflows
- **Dataset-Management** für systematische Evaluierung
- **Performance-Monitoring** in Produktion
- **Feedback-Collection** von Nutzern

Kernprinzip: **Jede Ausführung wird automatisch protokolliert und kann nachvollzogen werden** – ohne zusätzlichen Code im Workflow selbst.

---

# 2 Setup: API-Key und Umgebung

## 2.1 LangSmith-Account erstellen

1. Kostenlosen Account anlegen: [smith.langchain.com](https://smith.langchain.com)
2. API-Key generieren: Settings → API Keys → Create API Key
3. Optional: Organisation und Projekte anlegen

## 2.2 API-Keys in Google Colab Secrets hinterlegen

**Schritt 1: Secrets in Colab einrichten**
1. In Google Colab: Schlüssel-Symbol 🔑 in der linken Seitenleiste
2. Neue Secrets hinzufügen:
   - `OPENAI_API_KEY`: Eigener OpenAI-Key
   - `LANGCHAIN_API_KEY`: LangSmith-Key (beginnt mit `lsv2_pt_...`)
   - Optional: `HF_TOKEN` für Hugging Face

**Schritt 2: Umgebung einrichten (Standard-Setup)**

```python
#@title 🔧 Umgebung einrichten{ display-mode: "form" }
!uv pip install --system -q git+https://github.com/ralf-42/GenAI.git#subdirectory=04_modul
from genai_lib.utilities import check_environment, get_ipinfo, setup_api_keys, mprint

# API-Keys aus Colab Secrets laden und aktivieren
setup_api_keys(['OPENAI_API_KEY', 'LANGCHAIN_API_KEY'], create_globals=False)

print()
check_environment()
print()
get_ipinfo()
```

**Schritt 3: LangSmith-Tracing aktivieren**

```python
import os

# LangSmith Tracing einschalten (WICHTIG!)
os.environ["LANGCHAIN_TRACING_V2"] = "true"

# Projektname für Organisation (beliebig anpassbar)
os.environ["LANGCHAIN_PROJECT"] = "Kurs-Beispiel"

# Optional: Endpoint (nur bei Self-Hosted nötig)
# os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"

print("✅ LangSmith Tracing aktiviert!")
print(f"📊 Projekt: {os.environ['LANGCHAIN_PROJECT']}")
```

**Wichtig:** 
- `setup_api_keys()` liest die Secrets aus und setzt die Umgebungsvariablen
- `create_globals=False` verhindert globale Variablen (Best Practice)
- Ab jetzt werden **alle** LangChain/LangGraph-Operationen automatisch getrackt

---

# 3 Das kleinstmögliche funktionierende Beispiel

Der schnellste Weg zum Verständnis: Ein einfacher LLM-Call mit automatischem Tracing.

```python
from langchain.chat_models import init_chat_model

# Normaler LLM-Setup (wie gewohnt)
llm = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0.0)

# Einfacher Call - wird automatisch getrackt!
response = llm.invoke("Erkläre LangSmith in einem Satz.")
print(response.content)
```

**Was passiert im Hintergrund:**
1. LangSmith empfängt automatisch alle Daten (Input, Output, Latenz, Token)
2. Ein "Trace" wird erstellt und in der Web-UI angezeigt
3. Kein zusätzlicher Code nötig – funktioniert "out of the box"

**Nächster Schritt:** LangSmith-Dashboard öffnen und den Trace inspizieren
- URL: [smith.langchain.com/projects](https://smith.langchain.com/projects)
- Projekt auswählen: "Kurs-Beispiel"
- Ersten Trace anklicken → vollständige Details sehen

---

# 4 Traces verstehen: Die Grundstruktur

Ein **Trace** ist die vollständige Aufzeichnung einer Ausführung. Jeder Trace besteht aus einem oder mehreren **Runs**.

## 4.1 Run-Typen

| Run-Typ | Beschreibung | Beispiel |
|---------|-------------|----------|
| **LLM** | Direkter Modell-Call | `llm.invoke()` |
| **Chain** | LCEL-Pipeline | `prompt \| llm \| parser` |
| **Tool** | Tool-Ausführung | `@tool` Decorator |
| **Agent** | Agent-Entscheidungsloop | `create_agent()` |
| **Retriever** | Dokumenten-Abruf | `vectorstore.as_retriever()` |

## 4.2 Beispiel: Chain mit mehreren Runs

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# LCEL-Chain (aus LangChain-Anleitung bekannt)
prompt = ChatPromptTemplate.from_template("Erkläre {topic} für Einsteiger.")
chain = prompt | llm | StrOutputParser()

result = chain.invoke({"topic": "Vektordatenbanken"})
```

**Im LangSmith-Trace sichtbar:**
```
Chain Run (Gesamt)
├─ Prompt Run (Template-Formatierung)
├─ LLM Run (GPT-4o-mini Call)
│  ├─ Input: "Erkläre Vektordatenbanken für Einsteiger."
│  ├─ Output: "Vektordatenbanken speichern..."
│  ├─ Tokens: 245 (Input: 12, Output: 233)
│  └─ Latenz: 1.2s
└─ Parser Run (String-Extraktion)
```

---

# 5 Praktisches Beispiel: Agent mit Tools tracken

Tools und Agents profitieren besonders von LangSmith, da ihre Entscheidungswege oft komplex sind.

```python
from langchain_core.tools import tool
from langchain.agents import create_agent

# Tool definieren (wie in LangChain-Anleitung)
@tool
def multiply(a: int, b: int) -> int:
    """Multipliziert zwei Zahlen."""
    return a * b

@tool
def add(a: int, b: int) -> int:
    """Addiert zwei Zahlen."""
    return a + b

# Agent erstellen
tools = [multiply, add]
agent = create_agent(
    model=llm,
    tools=tools,
    system_prompt="Du bist ein Rechen-Agent. Nutze Tools für Berechnungen.",
)

# Agent ausführen - komplexe Frage
response = agent.invoke({
    "messages": [{"role": "user", "content": "Berechne (5 * 8) + 3"}]
})
```

**Im LangSmith-Trace wird sichtbar:**
1. Agent erhält Frage
2. Agent entscheidet: "Ich brauche multiply(5, 8)"
3. Tool wird ausgeführt → Ergebnis: 40
4. Agent erhält Tool-Output
5. Agent entscheidet: "Ich brauche add(40, 3)"
6. Tool wird ausgeführt → Ergebnis: 43
7. Agent formuliert finale Antwort: "Das Ergebnis ist 43."

**Wichtig:** Jeder Schritt ist einzeln inspizierbar – Input, Output, Latenz, Fehler.

---

# 6 Datasets: Systematisches Testen

Datasets ermöglichen wiederholbare Tests mit definierten Inputs und erwarteten Outputs.

## 6.1 Dataset erstellen (UI oder Code)

**Variante A: Über UI**
1. LangSmith → Datasets → Create Dataset
2. Beispiele hinzufügen (Input/Output-Paare)

**Variante B: Programmatisch**

```python
from langsmith import Client

client = Client()

# Dataset mit Beispielen
examples = [
    {"inputs": {"question": "Was ist 5 * 8?"}, "outputs": {"answer": "40"}},
    {"inputs": {"question": "Addiere 10 und 15"}, "outputs": {"answer": "25"}},
    {"inputs": {"question": "Was ist die Hauptstadt von Frankreich?"}, "outputs": {"answer": "Paris"}},
]

dataset_name = "Rechen-Agent-Tests"
dataset = client.create_dataset(dataset_name=dataset_name)

for example in examples:
    client.create_example(
        dataset_id=dataset.id,
        inputs=example["inputs"],
        outputs=example["outputs"],
    )
```

## 6.2 Agent gegen Dataset evaluieren

```python
from langsmith.evaluation import evaluate

def predict(inputs: dict) -> dict:
    """Wrapper für Agent-Aufruf"""
    response = agent.invoke({
        "messages": [{"role": "user", "content": inputs["question"]}]
    })
    # Antwort aus letzter Message extrahieren
    return {"answer": response["messages"][-1].content}

# Evaluierung starten
results = evaluate(
    predict,
    data=dataset_name,
    experiment_prefix="Agent-v1",
)
```

**Ergebnis:**
- Jeder Test-Case wird einzeln ausgeführt
- Traces für alle Runs werden automatisch gespeichert
- Vergleich über UI: Welche Fragen wurden korrekt beantwortet?

---

# 7 Feedback: Qualität messen

Feedback ermöglicht es, die Qualität von Antworten zu bewerten – manuell oder automatisch.

## 7.1 Manuelles Feedback (UI)

In der LangSmith-UI kann jeder Run bewertet werden:
- Daumen hoch/runter
- Sterne (1-5)
- Freitext-Kommentar

## 7.2 Programmatisches Feedback

```python
from langsmith import Client

client = Client()

# Nach Agent-Ausführung
run_id = response["__run"].id  # Run-ID aus Response

# Positives Feedback
client.create_feedback(
    run_id=run_id,
    key="user_satisfaction",
    score=1.0,  # 0.0 = schlecht, 1.0 = gut
    comment="Antwort war präzise und korrekt.",
)
```

## 7.3 Automatische Evaluierung mit LLM-as-Judge

```python
from langsmith.evaluation import evaluate, LangChainStringEvaluator

# Evaluator: Bewertet Antwort-Qualität mit LLM
qa_evaluator = LangChainStringEvaluator(
    "qa",
    config={
        "llm": llm,
        "criteria": "correctness",
    },
)

# Evaluierung mit automatischem Scoring
results = evaluate(
    predict,
    data=dataset_name,
    evaluators=[qa_evaluator],
    experiment_prefix="Agent-v1-auto-eval",
)
```

**Vorteile:**
- Skalierbar: 100+ Beispiele automatisch testen
- Konsistent: Gleiche Bewertungskriterien
- Nachvollziehbar: LLM-Begründungen werden gespeichert

---

# 8 Integration in LangGraph-Workflows

LangSmith trackt auch komplexe LangGraph-State-Machines automatisch.

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class ChatState(TypedDict):
    messages: Annotated[list, add_messages]

def agent_node(state: ChatState):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

# Graph bauen
graph = StateGraph(ChatState)
graph.add_node("agent", agent_node)
graph.add_edge(START, "agent")
graph.add_edge("agent", END)

# Mit Checkpointer kompilieren
checkpointer = MemorySaver()
compiled_graph = graph.compile(checkpointer=checkpointer)

# Ausführen - wird automatisch getrackt!
config = {"configurable": {"thread_id": "demo-session"}}
result = compiled_graph.invoke(
    {"messages": [{"role": "user", "content": "Hallo!"}]},
    config=config,
)
```

**Im LangSmith-Trace:**
- Vollständiger Graph-Ablauf sichtbar
- Jeden Node-Durchlauf einzeln inspizierbar
- State-Änderungen nachvollziehbar
- Checkpointing-Events protokolliert

---

# 9 Best Practices für den Kurs

## 9.1 Projekt-Organisation

**Empfehlung: Ein Projekt pro Kurstag**
```python
# Tag 1: Grundlagen
os.environ["LANGCHAIN_PROJECT"] = "Tag1-Grundlagen"

# Tag 3: RAG-Systeme
os.environ["LANGCHAIN_PROJECT"] = "Tag3-RAG"

# Tag 5: Multi-Agent
os.environ["LANGCHAIN_PROJECT"] = "Tag5-MultiAgent"
```

**Alternative: Einmaliges Setup im Notebook-Header**
```python
#@title 🔧 Umgebung einrichten{ display-mode: "form" }
!uv pip install --system -q git+https://github.com/ralf-42/GenAI.git#subdirectory=04_modul
from genai_lib.utilities import setup_api_keys, check_environment, get_ipinfo
import os

# API-Keys laden
setup_api_keys(['OPENAI_API_KEY', 'LANGCHAIN_API_KEY'], create_globals=False)

# LangSmith aktivieren
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "Tag1-Grundlagen"  # Je nach Tag anpassen

check_environment()
get_ipinfo()
```

## 9.2 Tags für bessere Organisation

```python
from langsmith import traceable

@traceable(
    run_type="chain",
    tags=["rag", "produktiv", "version-2.0"],
)
def my_rag_chain(question: str):
    # RAG-Logik hier
    pass
```

## 9.3 Fehler debuggen

**Typischer Workflow:**
1. Agent schlägt fehl (z.B. falsches Tool gewählt)
2. LangSmith öffnen → Run finden
3. Trace inspizieren: An welcher Stelle ging es schief?
4. System-Prompt oder Tool-Description anpassen
5. Erneut testen → Vergleichen im UI

**Vorteil:** Direkter Vorher/Nachher-Vergleich im LangSmith-UI.

## 9.4 Performance-Monitoring

```python
# Metadaten hinzufügen für Filterung
from langsmith import traceable

@traceable(metadata={"user_id": "student_42", "environment": "colab"})
def process_query(query: str):
    return agent.invoke({"messages": [{"role": "user", "content": query}]})
```

**Nutzen:**
- Langsame Runs identifizieren (Latenz > 5s)
- Token-Verbrauch pro Student analysieren
- Fehlerraten nach Umgebung filtern

---

# 10 Vergleich: LangSmith vs. Alternatives

| Aspekt | LangSmith | Print/Logs | LangGraph Debug |
|--------|-----------|-----------|-----------------|
| **Setup** | 3 Zeilen Code | Immer verfügbar | Graph-spezifisch |
| **Visualisierung** | Interaktive UI | Terminal-Output | Stream-Modus |
| **Historie** | Persistent | Verloren nach Neustart | Session-basiert |
| **Datasets** | Integriert | Manuell verwalten | Nicht verfügbar |
| **Team-Kollaboration** | URL-Sharing | Screenshots | Nicht verfügbar |
| **Produktion** | Monitoring | Nicht skalierbar | Nur Development |

**Fazit für den Kurs:**
- **Tag 1-2:** LangSmith parallel zu Print-Debugging einführen
- **Tag 3-4:** LangSmith als primäres Debug-Tool etablieren
- **Tag 5:** LangSmith für Multi-Agent-Vergleiche und Evaluierung nutzen

---

# 11 Häufige Fragen (FAQ)

## 11.1 "Werden alle Daten an LangSmith gesendet?"

**Ja**, standardmäßig:
- Alle Inputs und Outputs
- Metadaten (Latenz, Tokens, etc.)
- Fehler und Stack-Traces

**Kontrolle:**
- Sensitive Daten vorher filtern/anonymisieren
- Selective Tracing mit `@traceable(enabled=False)`
- Self-Hosted LangSmith für vollständige Kontrolle

## 11.2 "Kostet LangSmith extra?"

**Free Tier:** 5.000 Traces/Monat kostenlos (ausreichend für Kurs)
**Paid Tiers:** Ab $39/Monat für Production-Nutzung

## 11.3 "Wie deaktiviere ich Tracing?"

```python
# Temporär deaktivieren
os.environ["LANGCHAIN_TRACING_V2"] = "false"

# Für einzelne Funktionen
from langsmith import traceable

@traceable(enabled=False)
def nicht_getrackt():
    pass
```

## 11.4 "Kann ich LangSmith ohne LangChain nutzen?"

**Ja**, mit dem `@traceable` Decorator:
```python
from langsmith import traceable

@traceable
def custom_function(input_data):
    # Beliebiger Python-Code
    return result
```

## 11.5 "Was passiert, wenn ich den API-Key vergesse?"

```python
# Setup prüft automatisch, ob Keys vorhanden sind
setup_api_keys(['OPENAI_API_KEY', 'LANGCHAIN_API_KEY'], create_globals=False)

# Falls Key fehlt: Klare Fehlermeldung mit Hinweis auf Colab Secrets
```

**Best Practice:** Alle benötigten Keys zu Beginn im Setup-Block definieren.

---

# 12 Zusammenfassung

**LangSmith ist essentiell für:**
- **Entwicklung:** Verstehen, warum Agents bestimmte Entscheidungen treffen
- **Debugging:** Fehlerquellen in komplexen Chains identifizieren
- **Evaluierung:** Systematisches Testen mit Datasets
- **Monitoring:** Performance und Qualität in Produktion überwachen

**Für Kurs-Teilnehmer bedeutet das:**
1. Setup einmalig zu Beginn (Google Colab Secrets + 3 Zeilen Code)
2. Automatisches Tracing aller Übungen
3. Visuelles Verständnis komplexer Agent-Workflows
4. Systematische Vergleiche verschiedener Ansätze

**Next Steps im Kurs:**
- Tag 1: Erste Traces inspizieren (einfache Chains)
- Tag 2: Agent-Entscheidungen nachvollziehen
- Tag 3: RAG-System evaluieren mit Datasets
- Tag 4: LangGraph-Workflows debuggen
- Tag 5: Multi-Agent-Systeme vergleichen

**Standard-Setup für alle Notebooks:**
```python
#@title 🔧 Umgebung einrichten{ display-mode: "form" }
!uv pip install --system -q git+https://github.com/ralf-42/GenAI.git#subdirectory=04_modul
from genai_lib.utilities import setup_api_keys, check_environment, get_ipinfo
import os

# API-Keys aus Colab Secrets laden
setup_api_keys(['OPENAI_API_KEY', 'LANGCHAIN_API_KEY'], create_globals=False)

# LangSmith Tracing aktivieren
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "Kurs-Tag-X"  # Anpassen je nach Tag

check_environment()
get_ipinfo()
```

---

**Version:** 1.1  
**Letzte Aktualisierung:** November 2025  
**Kompatibel mit:** LangChain 1.0+, LangGraph 0.2+, LangSmith 0.4+, Google Colab Secrets

---

> 💡 **Tipp:** LangSmith-UI immer im zweiten Browser-Tab öffnen – so können Traces direkt während der Entwicklung inspiziert werden!

> 🔑 **Wichtig:** Alle API-Keys werden sicher in Google Colab Secrets hinterlegt und niemals im Code sichtbar!
