# LangSmith Best Practices

**Projekt:** Generative KI mit LangChain 1.1+
**Version:** 1.9
**Datum:** 2026-03-04

---

## Übersicht

**LangSmith** ist die **Observability-Plattform** für LangChain/LangGraph-Anwendungen und bildet die **dritte Säule** des LangChain-Ökosystems:

- **LangChain** - Struktur (Chains, Tools, Prompts)
- **LangGraph** - Kontrolle (Workflows, State Machines, Multi-Agent)
- **LangSmith** - Observability (Monitoring, Debugging, Evaluation)

> **📘 Referenz:** Siehe `docs/deployment/Vom_Modell_zum_Produkt_LangChain_Oekosystem.md` für das Zusammenspiel aller drei Komponenten.

---

## 🎯 Warum LangSmith?

### Das Problem ohne LangSmith
```python
# ❌ OHNE LangSmith: Keine Transparenz
agent = create_agent(model=llm, tools=tools)
response = agent.invoke({"messages": [...]})

# Was ist passiert? Wir wissen nicht:
# - Welche Tools wurden aufgerufen?
# - Wie viele Tokens wurden verbraucht?
# - Wie lange hat jeder Schritt gedauert?
# - Gab es Fehler im Tool-Aufruf?
```

### Die Lösung mit LangSmith
```python
# ✅ MIT LangSmith: Vollständige Observability
import os
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "your-api-key"

agent = create_agent(model=llm, tools=tools)
response = agent.invoke({"messages": [...]})

# Automatisch geloggt in LangSmith:
# - Kompletter Trace mit allen Schritten
# - Token-Nutzung pro Call
# - Latenz pro Komponente
# - Fehler-Details mit Stack-Trace
```

---

## 📋 Die 5 Kern-Features von LangSmith

### 1. 🔍 Tracing & Debugging

**Was es macht:**
- Erfasst jeden Schritt einer LLM-Interaktion
- Visualisiert den kompletten Ablauf (Tree-View)
- Zeigt Input/Output jeder Komponente

**Wann nutzen:**
- ✅ Debugging komplexer Agent-Workflows
- ✅ Verstehen, warum ein Agent falsch reagiert
- ✅ Performance-Bottlenecks identifizieren

**Best Practice:**
```python
# Automatisches Tracing (empfohlen)
os.environ["LANGSMITH_TRACING"] = "true"

# Traces automatisch im LangSmith Dashboard sichtbar
```

**Trace-Filter:**
- Filter nach User-ID, Session-ID
- Suche nach Fehlern
- Zeitbasierte Filterung

**Trace Previews anpassen** *(neu: Feb 2026, v0.13.10)*

Konfigurierbar, welche Inputs und Outputs in der Tracing-Tabelle angezeigt werden – besonders nützlich bei Custom Data Structures:
- Im LangSmith Dashboard: Settings → Trace Preview → Felder auswählen
- Nützlich für Projekte mit verschachtelten Datenstrukturen oder langen Texten

**`.with_config()` – Traces benennen und taggen:**

Mit `.with_config()` lassen sich einzelne Chains und Aufrufe in LangSmith klar identifizieren.

**Pattern: Konfiguration vorab in Variable – dann `.with_config(**run_cfg)` anwenden:**

```python
# 1. Tracing-Konfiguration vorab festlegen
run_cfg = {
    "run_name": "M05_Kap6_BasicChain",  # Anzeigename im Trace-Tree
    "tags":     ["M05", "lcel", "chain"] # Filterbar im Dashboard
}

# 2. with_config() anwenden
chain = (prompt | llm | parser).with_config(**run_cfg)
result = chain.invoke({"input": "..."})
```

**Wann `.with_config()` einsetzen:**
- ✅ Mehrere Chains im selben Projekt – damit Traces unterscheidbar sind
- ✅ Parallele Chains (`RunnableParallel`) – jede Teilkette separat benennen
- ✅ Streaming-Aufrufe – auch `stream()` wird getraced
- ❌ Reine Python-Funktionen ohne LLM-Aufruf (`RunnableLambda` ohne LLM)
- ❌ Einführungsbeispiele, die LCEL-Syntax lehren – Codeklarheit geht vor

**Namenskonvention (Empfehlung):**
```python
# Kurs-Notebooks: Modul_Kapitel_ChainTyp
run_name="M05_Kap3_BasicChain"
run_name="M05_Kap5_ParallelChain"
run_name="M05_Kap7_Stream"

# Produktion: Anwendung_Funktion
run_name="Chatbot_Retrieval"
run_name="Classifier_Intent"
```

**Tags-Konvention (Empfehlung):**
```python
# Kurs-Notebooks
tags=["M05", "lcel", "parallel"]

# Produktion
tags=["production", "rag", "v2"]
```

> ⚠️ **Regel:** `.with_config()` gehört in den Abschnitt, der Tracing *erklärt* –
> nicht pauschal auf jede Chain im Notebook. In Lehr-Notebooks einmalig
> demonstrieren (z. B. in einem eigenen „LangSmith"-Kapitel), in den
> vorherigen LCEL-Beispielen weglassen.

**`.func()` – Tool-Tests ohne Tracing:**

Für isolierte Funktionstests (`@tool`-dekorierte Funktionen) die Python-Funktion direkt über `.func()` aufrufen – vollständig am Runnable-Framework vorbei, kein Trace entsteht.

```python
from langchain_core.tools import tool

@tool
def celsius_nach_fahrenheit(temperatur: float) -> float:
    """Rechnet Celsius in Fahrenheit um."""
    return round(temperatur * 9 / 5 + 32, 2)

# ✅ Kein Tracing – direkte Python-Funktion
ergebnis = celsius_nach_fahrenheit.func(temperatur=37.0)

# ⚠️ Mit Tracing – geht durch das Runnable-Framework
ergebnis = celsius_nach_fahrenheit.invoke({"temperatur": 37.0})
```

**Wann `.func()` einsetzen:**
- ✅ Isolierte Unit-Tests von Tool-Funktionen (Kapitel vor der LangSmith-Demo)
- ✅ Wenn Tracing-Unterdrückung via Context Manager nicht zuverlässig funktioniert
- ❌ Nicht verwenden, wenn das Runnable-Verhalten (Schema-Validierung, Callbacks) getestet werden soll

> 💡 **Didaktischer Mehrwert:** Der Kontrast `.func()` vs. `.invoke()` macht sichtbar, was das Runnable-Framework zusätzlich leistet – ideal für Lehr-Notebooks.

---

### 2. 📊 Datasets & Evaluation

**Was es macht:**
- Test-Datasets für LLM-Anwendungen erstellen
- Automatisierte Evaluierung vor Deployment
- Benchmark-Vergleiche über Zeit

**Wann nutzen:**
- ✅ Regression-Tests nach Code-Änderungen
- ✅ A/B-Testing von Prompts
- ✅ Qualitätssicherung vor Production

**Best Practice:**
```python
from langsmith import Client

client = Client()

# Dataset erstellen
dataset = client.create_dataset("customer-support-qa")
client.create_examples(
    inputs=[{"question": "Wie kann ich meine Bestellung stornieren?"}],
    outputs=[{"answer": "Sie können..."}],
    dataset_id=dataset.id
)

# Evaluation ausführen
from langsmith.evaluation import evaluate

results = evaluate(
    lambda inputs: agent.invoke(inputs),
    data="customer-support-qa",
    evaluators=[accuracy_evaluator],
)
```

**Evaluator-Typen:**
- **Accuracy** - Korrektheit der Antwort
- **Relevance** - Relevanz zum Kontext
- **Hallucination** - Erfundene Fakten erkennen
- **Custom** - Eigene Evaluierungs-Logik

**Baseline-Experiment fixieren** *(neu: Feb 2026)*

Seit Februar 2026 kann ein beliebiges Experiment als **Baseline** fixiert werden. Alle nachfolgenden Runs werden automatisch dagegen verglichen – kein manuelles Auswählen mehr nötig:

```python
# Im LangSmith Dashboard: Experiments → Run auswählen → "Pin as Baseline"
# Automatischer Vergleich aller nachfolgenden evaluate()-Runs
results_v2 = evaluate(
    lambda inputs: agent_v2.invoke(inputs),
    data="customer-support-qa",
    evaluators=[accuracy_evaluator],
    experiment_prefix="v2-test",  # Automatisch gegen fixierte Baseline verglichen
)
```

**Pairwise Annotation Queues** *(neu: Dez 2025, v0.12.61)*

Side-by-Side Vergleich zweier Agent-Outputs für subjektive Evaluation:
- Im LangSmith Dashboard: Annotation Queues → Pairwise Queue erstellen
- Zeigt zwei Antworten nebeneinander zur manuellen Bewertung
- Ideal für: Ton, Kreativität, Stil – schwer automatisch bewertbar

---

### 3. 📈 Monitoring & Observability

**Was es macht:**
- Production-Monitoring in Echtzeit
- Dashboards für Metriken (Latenz, Fehlerrate, Token-Nutzung)
- Alerts bei Anomalien

**Wann nutzen:**
- ✅ **Obligatorisch** für alle Production-Deployments
- ✅ Monitoring von SLAs (Response-Zeit, Fehlerrate)
- ✅ Frühwarnung bei Problemen

**Best Practice:**
```python
# LangSmith in Production aktivieren
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_PROJECT"] = "production"  # Projekt-Name

# Automatisches Monitoring aller Requests
```

**Key Metrics:**
- **Latency** - P50, P95, P99 Response-Zeiten
- **Error Rate** - Fehlerrate pro Endpoint
- **Token Usage** - Kosten pro Request
- **Throughput** - Requests/Minute

---

### 4. 💰 Cost Tracking & Budget Management

**Was es macht:**
- Token-Nutzung pro Request tracken
- Budget-Limits setzen
- Kosten-Alerts konfigurieren

**Wann nutzen:**
- ✅ Budget-Kontrolle für Production-Apps
- ✅ Kosten-Optimierung identifizieren
- ✅ Abrechnungs-Transparenz

**Best Practice:**
```python
# Automatisches Token-Tracking (keine Konfiguration nötig)
# LangSmith erfasst Token-Nutzung aller unterstützten Provider

# Im Dashboard:
# - Token-Nutzung pro Tag/Woche/Monat
# - Kosten-Breakdown nach Modell
# - Budget-Alerts konfigurieren
```

**Unterstützte Provider:**
- OpenAI, Anthropic, Google, Cohere, etc.
- Automatische Kosten-Berechnung basierend auf Pricing

**Kosten über gesamten Agent-Stack tracken** *(neu: Feb 2026)*

Seit Februar 2026 bietet LangSmith eine **unified Cost View** über den gesamten Agent-Workflow – nicht nur LLM-Calls, sondern alle Komponenten (Tools, externe APIs etc.):

```python
# Custom Cost Metadata für nicht-LLM-Komponenten
from langsmith import Client
client = Client(api_url=os.environ["LANGSMITH_ENDPOINT"])

# Kosten für externe API-Calls, Tools etc. manuell loggen
client.update_run(
    run_id=run_id,
    extra={"cost": {"total_cost": 0.005, "currency": "USD"}}
)
```

---

### 5. 📝 Prompt Hub

**Was es macht:**
- Zentrale Verwaltung von Prompts
- Versionierung von Prompts
- Prompt-Sharing im Team

**Wann nutzen:**
- ✅ Prompt-Iterationen versionieren
- ✅ Prompt-Wiederverwendung über Projekte
- ✅ Team-Kollaboration

**Best Practice:**
```python
from langchain import hub

# Prompt aus Hub laden
prompt = hub.pull("owner/my-prompt")

# Mit Agent verwenden
agent = create_agent(
    model=llm,
    tools=tools,
    system_prompt=prompt
)

# Prompt im Hub updaten → automatisch neue Version
```

---

## 🚀 Quick Start: LangSmith aktivieren

### 1. API-Key generieren
```bash
# https://smith.langchain.com/settings
# → API Keys → Create API Key
```

### 2. Environment-Variablen setzen
```python
import os

# LangSmith aktivieren – MUSS vor allen LangChain-Imports stehen!
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "lsv2_pt_..."  # Dein API-Key
os.environ["LANGSMITH_PROJECT"] = "my-project"   # Optional: Projekt-Name

# EU-Account: Endpoint explizit setzen (ebenfalls vor Imports!)
os.environ["LANGSMITH_ENDPOINT"] = "https://eu.api.smith.langchain.com"
```

> ⚠️ **Reihenfolge-Regel:** `LANGSMITH_ENDPOINT` und `LANGSMITH_TRACING` müssen gesetzt sein, **bevor** `langchain`, `langsmith` oder `genai_lib` importiert werden. Der LangChain-Tracer liest die Env-Vars beim ersten Import – späteres Setzen wird ignoriert.
>
> **In Notebooks:** Env-Vars in die Setup-Cell (ganz oben), vor alle anderen Imports.

**Unterschiedliche Gültigkeit der Env-Vars:**

| Variable | Wann gelesen | Dynamisch änderbar? |
|---|---|---|
| `LANGSMITH_ENDPOINT` | Einmalig beim **ersten LangChain-Import** | ❌ Nein – muss vor Imports stehen |
| `LANGSMITH_TRACING` | Einmalig beim **ersten LangChain-Import** | ❌ Nein – muss vor Imports stehen |
| `LANGSMITH_PROJECT` | Beim **ersten Trace** – dann gecacht via `lru_cache` | ⚠️ Nur wenn **vor dem ersten Trace** gesetzt |

> ⚠️ **LangSmith-SDK Verhalten:** `get_tracer_project()` in `langsmith/utils.py` ist mit `@functools.lru_cache(maxsize=1)` dekoriert. Der Projektnamen wird beim ersten Trace eingefroren. `os.environ`-Änderungen **nach** dem ersten Trace werden ignoriert.
>
> **Empfehlung:** `LANGSMITH_PROJECT` in der **Setup-Cell** korrekt setzen – dann funktioniert es zuverlässig. Projekt-Wechsel nach Notebook-Start sind nicht vorgesehen.

**Empfohlenes Notebook-Pattern (Kurs):**
```python
# ── Setup-Cell: Modulname direkt setzen (vor allen Imports!) ─────────────
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_ENDPOINT"]   = "https://eu.api.smith.langchain.com"
os.environ["LANGSMITH_PROJECT"]    = "M06-Structured-Output"  # Modulname

# ── LangSmith-Abschnitt: nur noch anzeigen ───────────────────────────────
import os
print(f"📊 LangSmith-Projekt: {os.environ['LANGSMITH_PROJECT']}")

# ── invoke() direkt – Projekt bereits korrekt gesetzt ────────────────────
run_cfg = {"run_name": "M06_Kap6_StructuredTrace", "tags": ["M06", "structured-output"]}
chain = llm.with_structured_output(MyModel).with_config(**run_cfg)
result = chain.invoke("...")
```

**Projektname-Konvention:**

| Kontext | Empfehlung | Beispiel |
|---------|-----------|---------|
| Kurs-Notebook (Setup) | Platzhalter | `"default"` |
| Kurs-Notebook (LangSmith-Abschnitt) | Modulname | `"M06-Structured-Output"` |
| Produktion | Anwendungsname | `"chatbot-production"` |
| Experiment | Thema + Datum | `"rag-experiment-2026-03"` |

❌ **Nicht empfohlen:** Ein gemeinsames Projekt für mehrere Module (z. B. `"KI_Agenten_Kurs"`) – Traces aus verschiedenen Modulen vermischen sich, die Filterung wird aufwändiger.

### 3. Code ausführen (keine Änderungen nötig!)
```python
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent

llm = init_chat_model("openai:gpt-4o-mini")
agent = create_agent(model=llm, tools=[...])

# Automatisch geloggt in LangSmith!
response = agent.invoke({"messages": [...]})
```

### 4. Im Dashboard anschauen
- https://smith.langchain.com/
- → Projects → "my-project"
- → Traces anschauen

---

## 📊 Production-Deployment Checklist

Bevor du in Production gehst:

### ✅ MUST-HAVES
- [ ] **LangSmith aktiviert** (`LANGSMITH_TRACING=true`)
- [ ] **Project Name gesetzt** (`LANGSMITH_PROJECT=production`)
- [ ] **API-Key konfiguriert** (Environment Variable oder Secret Manager)
- [ ] **Monitoring-Dashboard** für Production-Projekt erstellt
- [ ] **Alerts konfiguriert** (Fehlerrate, Latenz, Budget)

### ✅ EMPFOHLEN
- [ ] **Dataset für Regression-Tests** erstellt
- [ ] **Baseline-Evaluation** durchgeführt (vor Deployment)
- [ ] **Budget-Limits** gesetzt
- [ ] **Team-Zugriff** konfiguriert
- [ ] **Prompt Hub** für kritische Prompts verwendet

### ✅ OPTIONAL
- [ ] **Custom Evaluators** für domänen-spezifische Metriken
- [ ] **Automated Testing** im CI/CD-Pipeline integriert
- [ ] **Weekly Review** der Traces und Metrics

---

## 🔗 Integration mit LangChain/LangGraph

### LangChain Chains
```python
# Automatisches Tracing für LCEL Chains
chain = prompt | llm | parser

# Jeder Schritt wird automatisch geloggt:
# 1. Prompt-Formatierung
# 2. LLM-Call
# 3. Output-Parsing
response = chain.invoke({"input": "..."})
```

### LangGraph Workflows
```python
from langgraph.graph import StateGraph

workflow = StateGraph(State)
workflow.add_node("classify", classify_node)
workflow.add_node("respond", respond_node)
# ... weitere Nodes

agent = workflow.compile()

# LangSmith zeigt kompletten Graph-Ablauf:
# - Welche Nodes wurden besucht
# - Conditional Edge Decisions
# - State-Übergänge
response = agent.invoke({"messages": [...]})
```

### Multi-Agent Systems
```python
# Supervisor-Agent Pattern
supervisor = create_agent(model=llm, tools=[...])
worker1 = create_agent(model=llm, tools=[...])
worker2 = create_agent(model=llm, tools=[...])

# LangSmith zeigt Hierarchie:
# - Supervisor-Entscheidungen
# - Worker-Aufrufe
# - Inter-Agent-Kommunikation
```

---

## 📚 Best Practices für verschiedene Use Cases

### RAG-Systeme
**LangSmith-Features nutzen:**
- ✅ **Tracing** - Retrieval-Qualität analysieren (Welche Dokumente wurden abgerufen?)
- ✅ **Evaluation** - Dataset mit Ground-Truth-Antworten
- ✅ **Monitoring** - Retrieval-Latenz, LLM-Latenz separat tracken

```python
# RAG mit LangSmith
retriever = vectorstore.as_retriever()
rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | parser
)

# Im Trace sichtbar:
# - Welche Dokumente retrieved wurden
# - Relevanz-Scores
# - LLM-Antwort basierend auf Kontext
```

### Multi-Tool Agents
**LangSmith-Features nutzen:**
- ✅ **Tracing** - Tool-Auswahl-Entscheidungen verstehen
- ✅ **Debugging** - Fehlerhafte Tool-Calls identifizieren
- ✅ **Cost Tracking** - Kosten pro Tool-Call

```python
@tool
def expensive_api_call(query: str) -> str:
    """Teurer API-Call (trackt Kosten automatisch)."""
    return api.call(query)

agent = create_agent(model=llm, tools=[expensive_api_call, ...])

# Im Trace:
# - Anzahl Tool-Calls
# - Erfolgsrate pro Tool
# - Kosten pro Tool
```

### Production-Chatbots
**LangSmith-Features nutzen:**
- ✅ **Monitoring** - User-Zufriedenheit (via Custom-Feedback)
- ✅ **Alerts** - Fehlerrate > 5%
- ✅ **Budget** - Kosten-Limit pro User/Session

```python
# Feedback-Integration
from langsmith import Client
client = Client()

def chatbot_with_feedback(message: str, session_id: str):
    response = agent.invoke({"messages": [message]})

    # User-Feedback erfassen (optional)
    # client.create_feedback(run_id=..., score=1.0)

    return response
```

---

## 🔧 Troubleshooting

### Problem: Traces landen in falschem Projekt (`default` statt Modulname)

**Ursache:** `LANGSMITH_PROJECT` wurde in der Setup-Cell auf `"default"` gesetzt (oder gar nicht), und später im Notebook per `os.environ` überschrieben. Das funktioniert nicht – der Projektnamen wird beim ersten Trace via `lru_cache` eingefroren.

**Symptom:** `os.environ["LANGSMITH_PROJECT"] = "M06-Structured-Output"` gibt den richtigen Wert aus, aber Traces landen trotzdem in `default`.

**Lösung:** Modulnamen direkt in der Setup-Cell setzen – **vor** allen LangChain-Imports:
```python
# ✅ Einmal korrekt in der Setup-Cell – funktioniert zuverlässig
os.environ["LANGSMITH_PROJECT"] = "M06-Structured-Output"

# ❌ Nach dem ersten Trace überschreiben – wird ignoriert
os.environ["LANGSMITH_PROJECT"] = "M06-Structured-Output"  # zu spät
```

**Alternativer Workaround** (wenn kein Kernel-Neustart möglich): `ls.tracing_context()`:
```python
import langsmith as ls
with ls.tracing_context(project_name="M06-Structured-Output"):
    result = chain.invoke("...")
```

---

### Problem: Traces erscheinen nicht
**Lösung:**
```python
# 1. Prüfe Environment-Variablen
print(os.getenv("LANGSMITH_TRACING"))  # Sollte "true" sein
print(os.getenv("LANGSMITH_API_KEY"))     # Sollte gesetzt sein

# 2. Prüfe Internet-Verbindung zu LangSmith
# 3. Prüfe API-Key Gültigkeit (https://smith.langchain.com/settings)
```

---

### Problem: 403 Forbidden beim Tracing (EU-Account)

**Ursache:** Ein EU-API-Key wird gegen den US-Default-Endpoint `api.smith.langchain.com` verwendet, weil `LANGSMITH_ENDPOINT` fehlt oder **nach** dem ersten LangChain-Import gesetzt wird.

**Symptom:**
```
WARNING:langsmith.client:Failed to multipart ingest runs:
HTTPError('403 Client Error: Forbidden for url: https://api.smith.langchain.com/runs/multipart')
```

**Lösung:**
```python
import os

# ✅ Env-Vars ZUERST – vor allen Imports
os.environ["LANGSMITH_ENDPOINT"] = "https://eu.api.smith.langchain.com"
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "lsv2_eu_pt_..."

# ✅ Client immer mit explizitem api_url
from langsmith import Client
client = Client(api_url=os.environ["LANGSMITH_ENDPOINT"])

# ✅ Erst dann LangChain importieren
from langchain.chat_models import init_chat_model
```

**Anti-Patterns:**
```python
# ❌ Client ohne URL → greift auf US-Default zurück
client = Client()

# ❌ Env-Var nach LangChain-Import setzen → wird ignoriert
from langchain.chat_models import init_chat_model   # Tracer bereits init!
os.environ["LANGSMITH_ENDPOINT"] = "https://eu.api.smith.langchain.com"  # Zu spät
```

### Problem: Zu viele Traces (Kosten-Kontrolle)
**Lösung:**
```python
# Sampling aktivieren (nur 10% der Requests tracken)
os.environ["LANGSMITH_SAMPLING_RATE"] = "0.1"

# Oder: Nur für Development tracken
if os.getenv("ENVIRONMENT") == "development":
    os.environ["LANGSMITH_TRACING"] = "true"
```

### Problem: Sensible Daten in Traces
**Lösung:**
```python
# Anonymisierung aktivieren
from langchain.callbacks import LangSmithCallback

callback = LangSmithCallback(
    hide_inputs=True,  # Input verstecken
    hide_outputs=True  # Output verstecken
)

# Oder: Custom Redaction-Logik
```

---

## 📖 Weiterführende Ressourcen

### Offizielle Dokumentation
- [LangSmith Docs](https://docs.smith.langchain.com/)
- [LangSmith Python SDK](https://github.com/langchain-ai/langsmith-sdk)
- [Release Notes](https://docs.smith.langchain.com/release-notes)

### Interne Dokumentation
- [Vom Modell zum Produkt: LangChain-Ökosystem](./docs/deployment/Vom_Modell_zum_Produkt_LangChain_Oekosystem.md)
- [LangChain 1.0 Must-Haves](./LangChain_Best_Practices.md)
- [LangGraph 1.0 Must-Haves](./LangGraph_Best_Practices.md)

### Related Commands
- `/check-langsmith-changelog` - Prüft neue LangSmith-Features
- `/sync-must-haves` - Synchronisiert alle Dokumentationen

---

## 📝 Changelog

### Version 1.9 (2026-03-04)
- ✅ BREAKING: Alle `LANGCHAIN_*` Env-Vars → `LANGSMITH_*` (LANGSMITH_TRACING, LANGSMITH_API_KEY, LANGSMITH_PROJECT, LANGSMITH_ENDPOINT, LANGSMITH_SAMPLING_RATE)
- ✅ NEU: Baseline-Experiment fixieren (Feb 2026) in Datasets & Evaluation
- ✅ NEU: Pairwise Annotation Queues (Dez 2025) in Datasets & Evaluation
- ✅ NEU: Track Costs Across Agent Stack (Feb 2026) in Cost Tracking
- ✅ NEU: Trace Previews konfigurieren (Feb 2026, v0.13.10) in Tracing

### Version 1.8 (2026-03-03)
- ✅ VEREINFACHT: Modulnamen direkt in Setup-Cell setzen – kein `tracing_context` nötig
- ✅ Tabelle korrigiert: `LANGSMITH_PROJECT` nur zuverlässig wenn vor erstem Trace gesetzt
- ✅ Troubleshooting: `tracing_context` als Workaround für Edge Cases dokumentiert (kein Kern-Neustart)

### Version 1.7 (2026-03-03)
- ✅ KORREKTUR: `LANGSMITH_PROJECT` ist **nicht** dynamisch – `get_tracer_project()` wird via `lru_cache` gecacht
- ✅ Empfohlenes Notebook-Pattern: `ls.tracing_context(project_name=...)` statt `os.environ`-Setzung
- ✅ Troubleshooting: Neuer Eintrag "Projektnamen-Wechsel wird ignoriert" mit Workaround via `cache_clear()`

### Version 1.6 (2026-03-03)
- ✅ Tracing & Debugging: `.with_config()` – Zwei-Schritt-Pattern dokumentiert (`run_cfg = {...}` → `.with_config(**run_cfg)`)

### Version 1.5 (2026-03-03)
- ✅ Quick Start: Unterschiedliche Gültigkeit der Env-Vars dokumentiert (`LANGSMITH_PROJECT` dynamisch änderbar, `ENDPOINT`/`TRACING_V2` nicht)
- ✅ Empfohlenes Notebook-Pattern ergänzt: `"default"` in Setup-Cell, Modulname vor LangSmith-Abschnitt
- ✅ Projektname-Konvention um Kurs-Setup-Zeile erweitert

### Version 1.4 (2026-03-02)
- ✅ Tracing & Debugging: `.func()` – Tool-Tests ohne Tracing ergänzt (inkl. Abgrenzung zu `.invoke()`)

### Version 1.3 (2026-03-02)
- ✅ Quick Start: Projektname-Konvention (modulspezifisch statt generisch) ergänzt

### Version 1.2 (2026-03-02)
- ✅ Tracing & Debugging: `.with_config()` – Best Practice mit Namens- und Tags-Konvention ergänzt

### Version 1.1 (2026-03-02)
- ✅ Quick Start: EU-Endpoint (`LANGSMITH_ENDPOINT`) und Reihenfolge-Regel ergänzt
- ✅ Troubleshooting: Neuer Eintrag "403 Forbidden / EU-Account-Konflikt"

### Version 1.0 (2026-01-02)
- ✅ Initiale Dokumentation
- ✅ 5 Kern-Features dokumentiert (Tracing, Datasets, Monitoring, Cost Tracking, Prompt Hub)
- ✅ Quick Start Guide
- ✅ Production-Deployment Checklist
- ✅ Integration mit LangChain/LangGraph
- ✅ Best Practices für RAG, Agents, Chatbots
- ✅ Troubleshooting-Sektion

---

**Version:** 1.9
**Maintainer:** Ralf
**Lizenz:** MIT License
