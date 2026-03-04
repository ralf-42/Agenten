# LangSmith Quick Reference

> **Kompakte Übersicht der 7 wichtigsten Patterns + Anti-Patterns**
> 📖 Vollständige Dokumentation: [LangSmith_Standards_Full.md](./LangSmith_Standards_Full.md)

---

## ⚡ Die 7 MUST-HAVE Patterns

### 1. Tracing aktivieren - Vollständige Visibility

```python
import os
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_PROJECT"] = "Agenten-Dev"

# Ab jetzt werden ALLE LangChain-Operationen automatisch getrackt
```

---

### 2. Projekte organisieren - Environment-Trennung

```python
ENVIRONMENT = "dev"  # "dev", "staging", "prod"
os.environ["LANGSMITH_PROJECT"] = f"Agenten-{ENVIRONMENT}"
```

---

### 3. Datasets für Testing - Reproduzierbare Evaluierung

```python
from langsmith import Client

client = Client()
dataset = client.create_dataset(dataset_name="RAG-Evaluation-v1")

examples = [
    {"inputs": {"question": "Was ist LangChain?"}, "outputs": {"answer": "..."}},
]

for ex in examples:
    client.create_example(dataset_id=dataset.id, inputs=ex["inputs"], outputs=ex["outputs"])
```

---

### 4. Feedback Collection - Qualitätsbewertung

```python
from langsmith import Client

client = Client()

response = agent.invoke({"messages": [...]})
run_id = response.metadata["run_id"]

# Nutzer-Feedback sammeln
client.create_feedback(
    run_id=run_id,
    key="user_rating",
    score=0.8,  # 4/5 Sterne
    comment="Sehr hilfreich!"
)
```

---

### 5. Custom Metadata & Tags - Filterbare Traces

```python
response = agent.invoke(
    {"messages": [...]},
    config={
        "metadata": {"user_id": "user-123", "session_id": "abc"},
        "tags": ["premium-customer", "experiment-A"]
    }
)
```

---

### 6. Playground - Prompt-Engineering

```
1. Gehe zu smith.langchain.com
2. Wähle Projekt → Finde Trace
3. "Open in Playground"
4. Prompt editieren, Modell wechseln, testen
5. Optimierten Prompt zurück in Code übernehmen
```

---

### 7. Monitoring & Alerts - Fehler-Detection

```python
# Dashboard trackt automatisch:
# - Latency (p50, p95, p99)
# - Error Rate (%)
# - Cost (Token-Usage)
# - Throughput (Requests/Min)

# Alerts konfigurieren (in UI):
# Bedingung: Error Rate > 5%
# Action: Email an team@example.com
```

---

## ⚠️ Top 5 Anti-Patterns

| # | Problem | Lösung |
|---|---------|--------|
| **1** | Tracing nicht aktiviert | `os.environ["LANGSMITH_TRACING"] = "true"` |
| **2** | Production ohne Dataset-Tests | Evaluiere mit `evaluate()` vor Deployment |
| **3** | Kein Feedback gesammelt | `client.create_feedback(run_id=..., score=...)` |
| **4** | Dev + Prod im gleichen Projekt | Separate Projekte: `Agenten-dev`, `Agenten-prod` |
| **5** | Keine Cost-Monitoring | Dashboard-Alerts konfigurieren |

---

## 🧪 Testing (Kurzform)

```python
from langsmith.evaluation import evaluate

def my_agent(inputs: dict) -> dict:
    return {"answer": agent.invoke(inputs["question"])}

results = evaluate(
    my_agent,
    data="RAG-Evaluation-v1",
    evaluators=[accuracy_evaluator],
    experiment_prefix="ci-test"
)

assert results["accuracy"] >= 0.8  # Regression-Test
```

---

## 🔒 Security (Kurzform)

```python
# ✅ API-Keys aus Environment
from genai_lib.utilities import setup_api_keys
setup_api_keys(['LANGSMITH_API_KEY'], create_globals=False)

# ✅ PII vor Tracing filtern
import re
def sanitize_pii(text: str) -> str:
    text = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[EMAIL]', text)
    return text

# ✅ Nur IDs in Metadata (keine PII!)
config = {"metadata": {"user_id": "user-123"}}  # ✅ Nicht: "user_email"
```

---

## 📚 Import-Cheatsheet

```python
# Core
from langsmith import Client
from langsmith.evaluation import evaluate

# Utilities
from genai_lib.utilities import setup_api_keys
import os
```

---

## 🔗 Vollständige Dokumentation

📖 **Für Details siehe:** [LangSmith_Standards_Full.md](./LangSmith_Standards_Full.md)

**Inhalt Full Standards:**
- Ausführliche Erklärungen zu jedem Pattern
- Alle 5 Anti-Patterns mit Beispielen
- Komplette Testing-Sektion (Dataset-Tests, Custom Evaluators, A/B-Testing, TDD)
- Komplette Security-Sektion (API-Keys, PII-Handling, Data Retention, Audit Logging)
- Production-Monitoring Best Practices

---

**Version:** 1.0
**Tokens:** ~1.500 (vs. 15.000 in Full)
**Letzte Aktualisierung:** November 2025
