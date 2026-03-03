# LangSmith Standards & Best Practices

> **Monitoring, Debugging & Evaluation-Standards für das Agenten-Projekt**

Dieses Dokument definiert die **Standard-Patterns** für LangSmith, die bei der Verwendung von LangSmith für Observability, Debugging und Evaluation in diesem Projekt angewendet werden sollten.

---

## 🎯 Wann LangSmith verwenden?

| Use Case | Ohne LangSmith | Mit LangSmith |
|----------|----------------|---------------|
| **Development & Debugging** | ⚠️ print-Debugging, schwer nachvollziehbar | ✅ Vollständiges Tracing aller LLM-Calls |
| **Production Monitoring** | ❌ Kein Einblick in Fehler | ✅ Echtzeit-Monitoring mit Alerts |
| **Evaluation & Testing** | ⚠️ Manuelle Tests, nicht reproduzierbar | ✅ Dataset-basierte Evaluierung |
| **Performance-Optimierung** | ⚠️ Keine Metriken | ✅ Latency, Kosten, Token-Usage |
| **Fehleranalyse** | ⚠️ Logs durchsuchen | ✅ Visual Workflow-Traces |

**Faustregel:**
- ✅ **Immer aktivieren** in Development (lokales Debugging)
- ✅ **Essential** in Production (Monitoring & Alerts)
- ✅ **Unverzichtbar** für systematische Evaluation

---

## 📋 Übersicht der Standard-Patterns

| # | Pattern | Zweck | Wann verwenden? |
|---|---------|-------|-----------------|
| 1 | Tracing aktivieren | Vollständige Workflow-Visibility | Immer (Dev + Production) |
| 2 | Projekte organisieren | Trennung von Environments | Pro Environment ein Projekt |
| 3 | Datasets für Testing | Reproduzierbare Evaluierung | Vor Production-Deployment |
| 4 | Feedback Collection | Qualitätsbewertung | Production-Apps mit Nutzern |
| 5 | Custom Metadata & Tags | Filterbare Traces | Komplexe Multi-Tenant-Apps |
| 6 | Playground für Prompts | Prompt-Engineering | Beim Entwickeln neuer Prompts |
| 7 | Monitoring & Alerts | Fehler-Detection | Production-Apps |

---

## 1️⃣ Tracing aktivieren - Vollständige Workflow-Visibility

### ✅ Standard Pattern

#### **Setup: API-Keys konfigurieren**

```python
# In Google Colab: Secrets verwenden (empfohlen)
from genai_lib.utilities import setup_api_keys

setup_api_keys(['OPENAI_API_KEY', 'LANGCHAIN_API_KEY'], create_globals=False)

# Alternativ: Direkt setzen (nicht empfohlen für Production)
import os
os.environ["LANGCHAIN_API_KEY"] = "lsv2_pt_..."  # Von smith.langchain.com
```

#### **Tracing aktivieren**

```python
import os

# LangSmith Tracing einschalten
os.environ["LANGCHAIN_TRACING_V2"] = "true"

# Projektname definieren (organisiert Traces)
os.environ["LANGCHAIN_PROJECT"] = "Agenten-Dev"

# EU-Endpoint (PFLICHT für EU-Workspace)
os.environ["LANGCHAIN_ENDPOINT"] = "https://eu.api.smith.langchain.com"

print("✅ LangSmith Tracing aktiviert!")
print(f"📊 Projekt: {os.environ['LANGCHAIN_PROJECT']}")
```

#### **Automatisches Tracing**

```python
from langchain.chat_models import init_chat_model

llm = init_chat_model("gpt-4o-mini", model_provider="openai")

# Ab jetzt werden ALLE LangChain-Operationen automatisch getrackt
response = llm.invoke("Was ist ein LLM?")

# ✅ Trace ist jetzt sichtbar auf smith.langchain.com
```

### 💡 Warum verwenden wir das?

**Vollständige Visibility:**
- Jeder LLM-Call wird automatisch protokolliert
- Keine manuelle Instrumentation nötig
- Auch verschachtelte Chains und Agents werden erfasst

**Zero-Overhead Integration:**
- Kein zusätzlicher Code im Workflow
- Performance-Impact vernachlässigbar (<1ms pro Call)
- Kann jederzeit an/ausgeschaltet werden

**Production-Ready:**
- Auch bei Millionen Requests skalierbar
- Sampling möglich (nur X% tracken)
- Kein Impact auf Nutzer-Experience

### ⚠️ Wichtig
- API-Key **NIEMALS** im Code hardcoden
- Verwende Colab Secrets oder Environment Variables
- In Production: Separate Projekte für Dev/Staging/Prod

---

## 2️⃣ Projekte organisieren - Trennung von Environments

### ✅ Standard Pattern

```python
import os

# Environment-basierte Projekt-Namen
ENVIRONMENT = "dev"  # "dev", "staging", "prod"
PROJECT_NAME = f"Agenten-{ENVIRONMENT}"

os.environ["LANGCHAIN_PROJECT"] = PROJECT_NAME

# Optional: Weitere Metadata
os.environ["LANGCHAIN_SESSION_ID"] = f"user-123-session-456"
```

### 💡 Warum verwenden wir das?

**Trennung von Environments:**
- Development-Experimente verschmutzen nicht Production-Logs
- Separate Dashboards für Dev/Staging/Prod
- Einfacheres Debugging durch Isolation

**Team-Organisation:**
- Verschiedene Projekte für verschiedene Features
- Pro Team-Mitglied ein Projekt möglich
- Bessere Collaboration

**Cost Tracking:**
- Kosten pro Projekt sichtbar
- Separate Billing für Abteilungen möglich
- Performance-Vergleiche zwischen Projekten

### 📦 Empfohlene Projekt-Struktur

```
Organisation: "Meine Firma"
├── Agenten-Dev           # Development
├── Agenten-Staging       # Testing vor Production
├── Agenten-Prod          # Production
├── Agenten-Feature-X     # Feature-Branch
└── Agenten-User-Ralf     # Persönliches Projekt
```

---

## 3️⃣ Datasets für Testing - Reproduzierbare Evaluierung

### ✅ Standard Pattern

#### **1. Dataset erstellen**

```python
from langsmith import Client

client = Client()

# Test-Cases definieren
examples = [
    {
        "inputs": {"question": "Was ist LangChain?"},
        "outputs": {"answer": "LangChain ist ein Framework..."}  # Expected Output
    },
    {
        "inputs": {"question": "Erkläre LangGraph"},
        "outputs": {"answer": "LangGraph ermöglicht..."}
    },
    # ... 10-50 Beispiele
]

# Dataset erstellen
dataset_name = "RAG-Evaluation-v1"
dataset = client.create_dataset(
    dataset_name=dataset_name,
    description="Evaluierungs-Dataset für RAG-System"
)

# Examples hinzufügen
for example in examples:
    client.create_example(
        dataset_id=dataset.id,
        inputs=example["inputs"],
        outputs=example["outputs"]
    )
```

#### **2. Agent gegen Dataset testen**

```python
from langsmith.evaluation import evaluate

def my_agent(inputs: dict) -> dict:
    """Der zu testende Agent."""
    question = inputs["question"]
    # ... Agent-Logik
    return {"answer": agent.invoke(question)}

# Evaluation durchführen
results = evaluate(
    my_agent,
    data=dataset_name,
    evaluators=[
        # Custom Evaluators (siehe Pattern #4)
    ],
    experiment_prefix="RAG-v2"  # Versionierung
)

print(f"Accuracy: {results['accuracy']}")
print(f"Average Latency: {results['latency_p50']}ms")
```

### 💡 Warum verwenden wir das?

**Reproduzierbarkeit:**
- Gleiche Tests bei jedem Run
- Vergleiche zwischen Modell-Versionen
- Keine "funktioniert bei mir"-Probleme mehr

**Systematische Evaluation:**
- 50+ Test-Cases in Sekunden durchlaufen
- Automatische Metriken (Accuracy, Latency, Cost)
- Regression-Tests vor Deployment

**Kontinuierliche Verbesserung:**
- Baseline etablieren
- Jede Änderung gegen Baseline testen
- Datengetriebene Optimierung

### 📦 Best Practices für Datasets

| Aspekt | Empfehlung | Warum |
|--------|------------|-------|
| **Größe** | 20-50 Examples | Balance: Aussagekraft vs. Laufzeit |
| **Qualität** | Manuell kuratiert | Garbage In = Garbage Out |
| **Diversity** | Edge Cases abdecken | Nicht nur "Happy Path" |
| **Versionierung** | Dataset-Namen mit Version | `RAG-v1`, `RAG-v2` |

---

## 4️⃣ Feedback Collection - Qualitätsbewertung

### ✅ Standard Pattern

#### **1. Feedback von Nutzern sammeln**

```python
from langsmith import Client

client = Client()

# Nach Agent-Response: Nutzer-Feedback anfordern
def collect_feedback(run_id: str, user_rating: float, comment: str = ""):
    """
    Sammelt Feedback für einen spezifischen Run.

    Args:
        run_id: ID des LangSmith-Runs (aus Trace)
        user_rating: 0.0 (schlecht) bis 1.0 (gut)
        comment: Optionaler Text-Kommentar
    """
    client.create_feedback(
        run_id=run_id,
        key="user_rating",
        score=user_rating,
        comment=comment
    )

# Beispiel: Nach Agent-Response
response = agent.invoke({"messages": [...]})
run_id = response.metadata["run_id"]  # LangSmith Run-ID

# Nutzer bewertet
user_rating = 0.8  # 4 von 5 Sternen → 0.8
collect_feedback(run_id, user_rating, "Gute Antwort, aber etwas lang")
```

#### **2. Programmatisches Feedback (Custom Evaluators)**

```python
from langsmith.evaluation import evaluate, LangChainStringEvaluator

def accuracy_evaluator(inputs: dict, outputs: dict, reference_outputs: dict) -> dict:
    """Custom Evaluator: Vergleicht Output mit Expected Output."""
    predicted = outputs["answer"]
    expected = reference_outputs["answer"]

    # Einfache String-Übereinstimmung (oder nutze LLM-as-Judge)
    score = 1.0 if predicted.strip().lower() == expected.strip().lower() else 0.0

    return {"key": "accuracy", "score": score}

# Evaluation mit Custom Evaluator
results = evaluate(
    my_agent,
    data="RAG-Evaluation-v1",
    evaluators=[accuracy_evaluator],
    experiment_prefix="RAG-v3"
)
```

### 💡 Warum verwenden wir das?

**Qualitätsmessung:**
- Objektive Metriken für Agent-Performance
- Identifiziere schlechte Antworten automatisch
- Continuous Improvement durch Feedback-Loop

**A/B-Testing:**
- Vergleiche verschiedene Prompts
- Welches Modell performt besser?
- Datengetriebene Entscheidungen

**Compliance:**
- Dokumentiere Nutzer-Zufriedenheit
- Auditable Metriken für Stakeholder
- Identifiziere Bias und Fairness-Issues

### 📦 Feedback-Kategorien

| Kategorie | Score | Wann verwenden? |
|-----------|-------|-----------------|
| `user_rating` | 0.0 - 1.0 | Nutzer-Bewertung (Sterne) |
| `accuracy` | 0.0 oder 1.0 | Automatische Evaluierung |
| `helpfulness` | 0.0 - 1.0 | LLM-as-Judge Bewertung |
| `toxicity` | 0.0 - 1.0 | Safety-Check |

---

## 5️⃣ Custom Metadata & Tags - Filterbare Traces

### ✅ Standard Pattern

```python
import os

# Global: Für alle Traces in diesem Prozess
os.environ["LANGCHAIN_METADATA"] = '{"environment": "production", "version": "v2.1"}'
os.environ["LANGCHAIN_TAGS"] = '["rag", "customer-support"]'

# Per-Run: Für einzelnen Workflow
from langchain.callbacks import trace

@trace(
    name="RAG Query",
    metadata={"user_id": "user-123", "tenant": "acme-corp"},
    tags=["premium-customer", "urgent"]
)
def rag_query(question: str) -> str:
    # ... RAG-Logik
    return response

# Oder direkt beim Invoke
response = agent.invoke(
    {"messages": [...]},
    config={
        "metadata": {"session_id": "abc-123"},
        "tags": ["experiment-A"]
    }
)
```

### 💡 Warum verwenden wir das?

**Filterbarkeit:**
- In LangSmith Dashboard: Filtern nach Tags
- Nur "premium-customer" Traces anzeigen
- Nur Fehler mit Tag "production"

**Multi-Tenancy:**
- Separate Traces pro Kunde/Tenant
- Kosten-Tracking pro Tenant
- Isolierte Debugging-Sessions

**Experimentation:**
- Tag: "experiment-A" vs. "experiment-B"
- A/B-Tests einfach auswerten
- Feature-Flags tracken

### 📦 Nützliche Metadata-Keys

```python
{
    "environment": "prod|staging|dev",
    "version": "v2.1.0",
    "user_id": "user-123",
    "session_id": "session-456",
    "tenant": "acme-corp",
    "experiment": "prompt-variant-A",
    "feature_flags": ["new-ui", "beta-rag"]
}
```

---

## 6️⃣ Playground für Prompts - Prompt-Engineering

### ✅ Standard Pattern

#### **1. Traces im Dashboard finden**

1. Gehe zu [smith.langchain.com](https://smith.langchain.com)
2. Wähle dein Projekt (z.B. "Agenten-Dev")
3. Finde einen interessanten Trace (z.B. fehlerhafte Antwort)

#### **2. Playground öffnen**

- Klicke auf den Trace
- Button: "Open in Playground"
- Jetzt kannst du:
  - Prompt editieren
  - Modell wechseln (GPT-4 ↔ Claude)
  - Temperature ändern
  - Neue Inputs testen

#### **3. Optimierten Prompt zurück in Code übernehmen**

```python
# Alter Prompt (in Code)
prompt = ChatPromptTemplate.from_template(
    "Beantworte die Frage: {question}"
)

# Neuer Prompt (aus Playground optimiert)
prompt = ChatPromptTemplate.from_template(
    "Du bist ein hilfreicher Assistent. "
    "Beantworte die Frage präzise und in maximal 3 Sätzen.\n\n"
    "Frage: {question}\n\n"
    "Antwort:"
)
```

### 💡 Warum verwenden wir das?

**Schnelles Prototyping:**
- Keine Code-Änderungen für Prompt-Tests
- Sofortiges Feedback
- Iteratives Prompt-Engineering

**Modell-Vergleich:**
- Gleicher Prompt, verschiedene Modelle
- Latency und Cost side-by-side
- Objektiver Vergleich

**Collaboration:**
- Teile Playground-Links mit Team
- Nicht-technische Stakeholder können Prompts testen
- Feedback ohne Code-Deployment

---

## 7️⃣ Monitoring & Alerts - Fehler-Detection

### ✅ Standard Pattern

#### **1. Dashboard-Metriken beobachten**

Standardmäßig trackt LangSmith:
- ✅ **Latency** (p50, p95, p99)
- ✅ **Error Rate** (% fehlgeschlagener Runs)
- ✅ **Cost** (Token-Usage × Modell-Preise)
- ✅ **Throughput** (Requests/Minute)

#### **2. Alerts konfigurieren** (in LangSmith UI)

```
Beispiel-Alert:
- Bedingung: Error Rate > 5%
- Zeitfenster: Letzte 10 Minuten
- Action: Email an team@example.com
- Projekt: Agenten-Prod
```

#### **3. Custom Monitoring in Code**

```python
from langsmith import Client
import time

client = Client()

def monitor_agent_performance():
    """Monitoring-Loop für Production-Agents."""
    project = "Agenten-Prod"

    while True:
        # Letzte 10 Minuten abrufen
        runs = client.list_runs(
            project_name=project,
            start_time=time.time() - 600  # 10 Minuten
        )

        # Metriken berechnen
        total = len(runs)
        errors = sum(1 for r in runs if r.error)
        error_rate = errors / total if total > 0 else 0

        if error_rate > 0.05:  # > 5%
            send_alert(f"⚠️ High error rate: {error_rate:.1%}")

        time.sleep(60)  # Jede Minute checken
```

### 💡 Warum verwenden wir das?

**Proactive Monitoring:**
- Fehler erkennen, bevor Nutzer sie bemerken
- Automatische Alerts bei Anomalien
- Schnelle Reaktion auf Incidents

**Performance-Tracking:**
- Ist der Agent schneller/langsamer geworden?
- Kosten-Explosionen früh erkennen
- Capacity Planning

**Quality Assurance:**
- Regression-Detection nach Deployments
- Automatische Rollbacks bei kritischen Fehlern
- Continuous Quality Monitoring

---

## ⚠️ Anti-Patterns: Häufige Fehler vermeiden

Diese 5 Anti-Patterns sollten in diesem Projekt **NIEMALS** vorkommen:

### ❌ Anti-Pattern 1: Tracing nicht aktiviert (Development ohne Visibility)

**Problem:**
```python
# ❌ Entwickeln OHNE Tracing
llm = init_chat_model("gpt-4o-mini", model_provider="openai")
agent = create_agent(model=llm, tools=[...])

# Wenn Fehler auftreten: Keine Ahnung, was passiert ist!
response = agent.invoke({"messages": [...]})
```

**Lösung:**
```python
# ✅ Tracing IMMER aktivieren (auch in Development)
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "Agenten-Dev"

llm = init_chat_model("gpt-4o-mini", model_provider="openai")
agent = create_agent(model=llm, tools=[...])

# Jetzt: Vollständige Visibility im Dashboard
response = agent.invoke({"messages": [...]})
```

**Warum kritisch:**
- Debugging ohne Traces = Blindflug
- LLM-Fehler nicht nachvollziehbar
- Performance-Probleme nicht erkennbar

---

### ❌ Anti-Pattern 2: Keine Dataset-basierte Evaluation (Production-Deployment ohne Tests)

**Problem:**
```python
# ❌ Agent direkt in Production deployen ohne Tests
agent = create_agent(model=llm, tools=[...])

# Hoffen, dass es funktioniert... 🤞
deploy_to_production(agent)
```

**Lösung:**
```python
# ✅ Vor Production: Dataset-basierte Evaluierung
from langsmith import Client
from langsmith.evaluation import evaluate

client = Client()

# 1. Test-Dataset erstellen
examples = [
    {"inputs": {"question": "..."}, "outputs": {"answer": "..."}},
    # ... 20-50 Beispiele
]

dataset = client.create_dataset(dataset_name="RAG-Evaluation-v1")
for ex in examples:
    client.create_example(dataset_id=dataset.id, inputs=ex["inputs"], outputs=ex["outputs"])

# 2. Agent evaluieren
def my_agent(inputs: dict) -> dict:
    return {"answer": agent.invoke(inputs["question"])}

results = evaluate(
    my_agent,
    data="RAG-Evaluation-v1",
    evaluators=[accuracy_evaluator],
    experiment_prefix="pre-production"
)

# 3. Nur deployen, wenn Accuracy > 80%
if results["accuracy"] > 0.8:
    deploy_to_production(agent)
else:
    print(f"❌ Accuracy zu niedrig: {results['accuracy']:.1%}")
```

**Warum kritisch:**
- Production-Fehler kosten Nutzer-Vertrauen
- Keine Baseline für Verbesserungen
- Regressionen werden nicht erkannt

---

### ❌ Anti-Pattern 3: Fehlende Feedback-Collection (Keine Qualitätsmessung)

**Problem:**
```python
# ❌ Production-Agent ohne Feedback-Loop
response = agent.invoke({"messages": [...]})

# Nutzer bewertet Antwort (Sterne) → wird nirgends gespeichert!
user_rating = get_user_rating()  # 4/5 Sterne → verloren!
```

**Lösung:**
```python
# ✅ Feedback systematisch sammeln
from langsmith import Client

client = Client()

response = agent.invoke({"messages": [...]})
run_id = response.metadata["run_id"]

# Nutzer-Feedback persistieren
user_rating = get_user_rating()  # 4/5 Sterne
client.create_feedback(
    run_id=run_id,
    key="user_rating",
    score=user_rating / 5.0,  # Normalisiert: 0.0 - 1.0
    comment="Hilfreich, aber etwas lang"
)

# Jetzt: Auswertbar im Dashboard für Qualitätsmetriken
```

**Warum kritisch:**
- Keine Daten = Keine Optimierung möglich
- Schlechte Antworten bleiben unerkannt
- Kein objektives Qualitätsmaß

---

### ❌ Anti-Pattern 4: Schlechte Projekt-Organisation (Alles in einem Projekt)

**Problem:**
```python
# ❌ Development UND Production im gleichen Projekt
os.environ["LANGCHAIN_PROJECT"] = "Agenten"  # Für alles!

# Development-Experimente
experiment_agent.invoke(...)  # → Projekt "Agenten"

# Production-Traffic
production_agent.invoke(...)  # → Projekt "Agenten"

# Jetzt: Dashboard unübersichtlich, Metriken vermischt!
```

**Lösung:**
```python
# ✅ Separate Projekte für verschiedene Environments
import os

ENVIRONMENT = os.getenv("ENVIRONMENT", "dev")  # dev, staging, prod
os.environ["LANGCHAIN_PROJECT"] = f"Agenten-{ENVIRONMENT}"

# Development: Projekt "Agenten-dev"
# Production: Projekt "Agenten-prod"
# Separate Dashboards, klare Metriken!
```

**Warum kritisch:**
- Production-Metriken durch Experimente verfälscht
- Debugging schwierig (welcher Trace ist relevant?)
- Keine saubere Cost-Attribution

---

### ❌ Anti-Pattern 5: Keine Cost-Monitoring (Token-Kosten explodieren unbemerkt)

**Problem:**
```python
# ❌ Agent mit teuren Modellen ohne Monitoring
llm = init_chat_model("gpt-4", model_provider="openai")  # Teuer!
agent = create_agent(model=llm, tools=[...])

# Production-Traffic: 10.000 Requests/Tag
for request in production_requests:
    agent.invoke(request)  # 💸💸💸 Kosten explodieren!
```

**Lösung:**
```python
# ✅ Cost-Monitoring aktivieren + Budget-Alerts
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "Agenten-Prod"

# LangSmith trackt automatisch Token-Usage und Kosten!
llm = init_chat_model("gpt-4", model_provider="openai")
agent = create_agent(model=llm, tools=[...])

# Dashboard: Kosten-Metriken pro Tag/Woche/Monat
# Alert konfigurieren: "Warnen bei > 100€/Tag"

# Alternative: Günstigeres Modell für einfache Queries
cheap_llm = init_chat_model("gpt-4o-mini", model_provider="openai")

# Routing: Komplexe Queries → GPT-4, Einfache → GPT-4o-mini
if is_complex_query(request):
    agent = create_agent(model=llm, tools=[...])  # GPT-4
else:
    agent = create_agent(model=cheap_llm, tools=[...])  # GPT-4o-mini
```

**Warum kritisch:**
- Unerwartete Rechnungen (Tausende Euro)
- Keine Cost-Optimierung möglich
- Budget-Überschreitungen unbemerkt

---

## 🧪 Testing: LangSmith für systematische Evaluierung

### 1. Dataset-basierte Regression-Tests

**Ziel:** Vor jedem Deployment sicherstellen, dass Agent nicht schlechter wird.

```python
# test_agent_regression.py
import pytest
from langsmith import Client
from langsmith.evaluation import evaluate

client = Client()

def test_agent_regression():
    """Regression-Test gegen bekanntes Dataset."""

    # Agent-Funktion (zu testender Agent)
    def my_agent(inputs: dict) -> dict:
        question = inputs["question"]
        response = agent.invoke({"messages": [{"role": "user", "content": question}]})
        return {"answer": response["messages"][-1].content}

    # Evaluation gegen Dataset
    results = evaluate(
        my_agent,
        data="RAG-Evaluation-v1",  # Feste Test-Cases
        evaluators=[accuracy_evaluator],
        experiment_prefix="ci-test"
    )

    # Assertion: Mindestens 80% Accuracy
    assert results["accuracy"] >= 0.8, f"Regression detected! Accuracy: {results['accuracy']:.1%}"

    print(f"✅ Regression-Test passed: {results['accuracy']:.1%}")

# In CI/CD-Pipeline:
# pytest test_agent_regression.py
```

---

### 2. Custom Evaluators für Domain-spezifische Metriken

```python
from langsmith.evaluation import evaluate

def custom_length_evaluator(inputs: dict, outputs: dict, reference_outputs: dict) -> dict:
    """Prüft, ob Antwort nicht zu lang ist (max 200 Wörter)."""
    answer = outputs["answer"]
    word_count = len(answer.split())

    # Score: 1.0 wenn ≤200 Wörter, sonst 0.0
    score = 1.0 if word_count <= 200 else 0.0

    return {
        "key": "length_ok",
        "score": score,
        "comment": f"Wörter: {word_count}"
    }

def custom_politeness_evaluator(inputs: dict, outputs: dict, reference_outputs: dict) -> dict:
    """Prüft, ob Antwort höflich ist (LLM-as-Judge)."""
    from langchain.chat_models import init_chat_model

    llm = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0.0)

    prompt = f"""
    Bewerte folgende Antwort auf Höflichkeit (0.0 = unhöflich, 1.0 = sehr höflich):

    Antwort: {outputs["answer"]}

    Antworte nur mit einer Zahl zwischen 0.0 und 1.0.
    """

    score_str = llm.invoke(prompt).content.strip()
    score = float(score_str)

    return {"key": "politeness", "score": score}

# Evaluation mit Custom Evaluators
results = evaluate(
    my_agent,
    data="RAG-Evaluation-v1",
    evaluators=[
        custom_length_evaluator,
        custom_politeness_evaluator
    ],
    experiment_prefix="custom-metrics"
)

print(f"Length OK: {results['length_ok']:.1%}")
print(f"Politeness: {results['politeness']:.1%}")
```

---

### 3. A/B-Testing mit Experiments

**Ziel:** Vergleiche verschiedene Agent-Varianten objektiv.

```python
from langsmith.evaluation import evaluate

# Variante A: GPT-4o-mini
def agent_variant_a(inputs: dict) -> dict:
    llm = init_chat_model("gpt-4o-mini", model_provider="openai")
    agent = create_agent(model=llm, tools=[...])
    return {"answer": agent.invoke(inputs["question"])}

# Variante B: GPT-4
def agent_variant_b(inputs: dict) -> dict:
    llm = init_chat_model("gpt-4", model_provider="openai")
    agent = create_agent(model=llm, tools=[...])
    return {"answer": agent.invoke(inputs["question"])}

# A/B-Test: Gleiche Test-Cases, verschiedene Agents
results_a = evaluate(agent_variant_a, data="RAG-Evaluation-v1", experiment_prefix="variant-A")
results_b = evaluate(agent_variant_b, data="RAG-Evaluation-v1", experiment_prefix="variant-B")

# Vergleich
print(f"Variante A (GPT-4o-mini): Accuracy={results_a['accuracy']:.1%}, Cost={results_a['total_cost']:.2f}€")
print(f"Variante B (GPT-4): Accuracy={results_b['accuracy']:.1%}, Cost={results_b['total_cost']:.2f}€")

# Entscheidung: Bessere Accuracy vs. Kosten
```

---

### 4. TDD-Workflow mit LangSmith

**Test-Driven Development für Agents:**

```python
# 1. Test schreiben (BEVOR Agent implementiert ist)
def test_agent_should_answer_factual_questions():
    """Agent soll faktische Fragen korrekt beantworten."""

    # Test-Case
    inputs = {"question": "Was ist die Hauptstadt von Frankreich?"}
    expected_answer = "Paris"

    # Agent aufrufen (noch nicht implementiert!)
    result = my_agent(inputs)

    # Assertion
    assert expected_answer.lower() in result["answer"].lower()

# 2. Test läuft fehl (erwartetes Verhalten in TDD)
# pytest test_agent.py → FAILED

# 3. Agent implementieren, bis Test grün wird
def my_agent(inputs: dict) -> dict:
    llm = init_chat_model("gpt-4o-mini", model_provider="openai")
    response = llm.invoke(inputs["question"])
    return {"answer": response.content}

# 4. Test erneut laufen lassen
# pytest test_agent.py → PASSED ✅

# 5. Dataset erweitern mit neuen Test-Cases
# → Regression-Tests wachsen kontinuierlich
```

---

## 🔒 Security: Sichere LangSmith-Nutzung

### 1. API-Key Management - Secrets, nicht hardcoded

**Problem:**
```python
# ❌ NIEMALS: API-Keys im Code hardcoden
os.environ["LANGCHAIN_API_KEY"] = "lsv2_pt_abc123..."  # Sicherheitslücke!
```

**Lösung:**
```python
# ✅ Google Colab: Secrets verwenden
from google.colab import userdata
os.environ["LANGCHAIN_API_KEY"] = userdata.get("LANGCHAIN_API_KEY")

# ✅ Projekt-Utility (empfohlen)
from genai_lib.utilities import setup_api_keys
setup_api_keys(['LANGCHAIN_API_KEY'], create_globals=False)

# ✅ Lokale Entwicklung: .env-Datei
from dotenv import load_dotenv
load_dotenv()  # Lädt aus .env (nicht versioniert!)
```

**Best Practice:**
- `.env` in `.gitignore` aufnehmen
- Secrets nie committen
- In CI/CD: Environment Variables nutzen

---

### 2. Data Retention Policies - PII automatisch löschen

**Problem:**
```python
# ❌ PII landet in LangSmith Traces und bleibt ewig gespeichert
user_input = "Mein Name ist Max Mustermann, Email: max@example.com"
response = agent.invoke({"messages": [{"role": "user", "content": user_input}]})

# Trace enthält PII → DSGVO-Problem!
```

**Lösung:**
```python
# ✅ PII vor Tracing filtern (Pre-Processing)
import re

def sanitize_pii(text: str) -> str:
    """Entfernt PII aus Text vor LLM-Call."""
    # Email-Adressen
    text = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[EMAIL]', text)

    # Telefonnummern (DE)
    text = re.sub(r'\+?\d{1,4}[\s-]?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}', '[PHONE]', text)

    # Kreditkarten
    text = re.sub(r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b', '[CC]', text)

    return text

# Anwendung
user_input = "Mein Name ist Max Mustermann, Email: max@example.com"
sanitized_input = sanitize_pii(user_input)

response = agent.invoke({"messages": [{"role": "user", "content": sanitized_input}]})
# Trace enthält nur: "Mein Name ist Max Mustermann, Email: [EMAIL]"
```

**LangSmith Data Retention:**
```python
# LangSmith Dashboard: Projekt-Settings → Data Retention
# - Standard: 30 Tage (kostenlos)
# - Enterprise: Anpassbar (14 Tage empfohlen für DSGVO)
```

---

### 3. PII in Traces vermeiden - Metadata-Sanitization

**Problem:**
```python
# ❌ PII in Metadata
response = agent.invoke(
    {"messages": [...]},
    config={
        "metadata": {
            "user_email": "max@example.com",  # PII!
            "user_name": "Max Mustermann"    # PII!
        }
    }
)
```

**Lösung:**
```python
# ✅ Nur nicht-identifizierende IDs in Metadata
response = agent.invoke(
    {"messages": [...]},
    config={
        "metadata": {
            "user_id": "user-12345",  # OK: Keine PII
            "session_id": "session-abc",
            "tenant": "acme-corp"
        }
    }
)

# User-Mapping separat in sicherer DB speichern:
# user-12345 → max@example.com (nicht in LangSmith!)
```

---

### 4. Secure Project Access - Team-Permissions

**Problem:**
```
❌ Alle Team-Mitglieder haben Zugriff auf Production-Projekt
→ Risiko: Versehentliches Löschen von Traces, falsche Konfiguration
```

**Lösung:**
```
✅ LangSmith Dashboard: Project Settings → Team Access

Rolle-basierte Permissions:
- Admin: Voller Zugriff (nur 1-2 Personen)
- Editor: Kann Traces anschauen, Datasets bearbeiten
- Viewer: Nur Lese-Zugriff (für Stakeholder)

Projekt-Struktur:
- "Agenten-Prod" → Admin: DevOps-Team, Viewer: Alle
- "Agenten-Dev" → Editor: Alle Entwickler
```

---

### 5. Audit Logging - Wer hat was geändert?

**Problem:**
```
❌ Dataset wurde gelöscht → Wer war das?
❌ Projekt-Konfiguration geändert → Keine Nachvollziehbarkeit
```

**Lösung:**
```python
# ✅ LangSmith Enterprise: Audit Logs aktivieren
# Dashboard: Organization Settings → Audit Logs

# Audit-Events:
# - Dataset created/deleted
# - Project settings changed
# - Team member added/removed
# - API-Key regenerated

# Beispiel-Audit-Log:
# {
#   "event": "dataset_deleted",
#   "user": "user@example.com",
#   "timestamp": "2025-11-24T10:30:00Z",
#   "project": "Agenten-Prod",
#   "dataset": "RAG-Evaluation-v1"
# }
```

**Best Practice:**
- Audit Logs regelmäßig reviewen
- Bei kritischen Changes: 4-Augen-Prinzip
- Automatische Alerts bei sensiblen Events

---

## 🚀 Quick Start: Komplettes Setup

```python
# 1. Setup (einmalig pro Session)
from genai_lib.utilities import setup_api_keys
import os

setup_api_keys(['OPENAI_API_KEY', 'LANGCHAIN_API_KEY'], create_globals=False)

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "Agenten-Dev"

# 2. Agent entwickeln (automatisches Tracing)
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain_core.tools import tool

llm = init_chat_model("gpt-4o-mini", model_provider="openai")

@tool
def search(query: str) -> str:
    """Sucht nach Informationen."""
    return f"Ergebnisse für: {query}"

agent = create_agent(
    model=llm,
    tools=[search],
    system_prompt="Du bist ein hilfreicher Assistent"
)

# 3. Agent verwenden
response = agent.invoke({
    "messages": [{"role": "user", "content": "Suche nach Python Tutorials"}]
})

# ✅ Automatisch in LangSmith getrackt!
# Dashboard: https://smith.langchain.com

# 4. Feedback sammeln (optional)
from langsmith import Client
client = Client()

# Nach Nutzer-Bewertung
run_id = response.metadata["run_id"]
client.create_feedback(
    run_id=run_id,
    key="user_rating",
    score=0.9,  # 4.5/5 Sterne
    comment="Sehr hilfreich!"
)
```

---

## 📚 Import-Cheatsheet

```python
# Tracing (automatisch, kein Import nötig)
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "project-name"

# Client für API-Zugriff
from langsmith import Client
client = Client()

# Evaluation
from langsmith.evaluation import evaluate, LangChainStringEvaluator

# Callbacks (für Custom Tracing)
from langchain.callbacks import trace

# Utilities (Projekt-spezifisch)
from genai_lib.utilities import setup_api_keys
```

---

## 📖 Weitere Ressourcen

- **Einsteiger-Guide:** [03_skript/kurs/Einsteiger_LangSmith.md](./03_skript/kurs/Einsteiger_LangSmith.md)
- **LangChain Standards:** [LangChain_Standards.md](./LangChain_Standards.md)
- **LangGraph Standards:** [LangGraph_Standards.md](./LangGraph_Standards.md)
- **Projekt CLAUDE.md:** Vollständige Projektinstruktionen
- **LangSmith Docs:** https://docs.smith.langchain.com/

---

**Version:** 1.1
**Letzte Aktualisierung:** November 2025
**Maintainer:** Agenten Projekt Team

**Changelog v1.1:**
- ✅ Anti-Patterns hinzugefügt (5 häufige Fehler mit Lösungen)
- ✅ Testing-Sektion hinzugefügt (Dataset-Tests, Custom Evaluators, A/B-Testing, TDD)
- ✅ Security-Sektion hinzugefügt (API-Keys, PII-Handling, Data Retention, Audit Logging)

---

> 💡 **Tipp:** LangSmith ist kostenlos für Development. Aktiviere es in jedem Projekt für besseres Debugging!
