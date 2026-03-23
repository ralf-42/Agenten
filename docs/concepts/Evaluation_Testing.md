---
layout: default
title: Evaluation & Testing
parent: Konzepte
nav_order: 11
description: "Bewertung und Qualitätssicherung von KI-Agenten"
has_toc: true
---

# Evaluation & Testing
{: .no_toc }

> **Bewertung und Qualitätssicherung von KI-Agenten**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Kurzüberblick: Warum Evaluation?

KI-Agenten unterscheiden sich fundamental von klassischer Software: Ihre Ausgaben sind nicht deterministisch, ihre Entscheidungswege oft überraschend, und kleine Prompt-Änderungen können große Auswirkungen haben. Ohne systematische Evaluation entstehen kritische Probleme:

- **Keine Baseline:** Ist Version 2.0 wirklich besser als 1.0?
- **Versteckte Regressionen:** Ein "Fix" verbessert einen Fall, verschlechtert zehn andere
- **Subjektive Bewertung:** "Fühlt sich besser an" ist keine Metrik
- **Production-Überraschungen:** Agenten verhalten sich mit echten Nutzern anders als im Test

Systematische Evaluation löst diese Probleme durch:

| Aspekt | Ohne Evaluation | Mit Evaluation |
|--------|-----------------|----------------|
| **Qualitätsmessung** | Bauchgefühl | Objektive Metriken |
| **Vergleichbarkeit** | Nicht möglich | A/B-Tests, Experimente |
| **Regression** | Zufällig entdeckt | Automatisch erkannt |
| **Dokumentation** | Anekdoten | Reproduzierbare Ergebnisse |

**Kernprinzip:** Was nicht gemessen wird, kann nicht verbessert werden — und bei KI-Agenten ist Messen schwieriger als bei klassischer Software.

---

## Evaluierungsebenen

### Komponenten-Evaluation

Einzelne Bausteine werden isoliert getestet:

| Komponente | Was wird geprüft? | Beispiel-Metrik |
|------------|-------------------|-----------------|
| **LLM-Ausgabe** | Qualität der Antwort | Relevanz, Kohärenz |
| **Tool-Auswahl** | Richtiges Tool gewählt? | Accuracy |
| **Tool-Parameter** | Korrekte Argumente? | Validierungsrate |
| **Retriever** | Relevante Dokumente gefunden? | Precision@k, Recall |
| **Strukturierte Ausgabe** | Schema eingehalten? | Validierungsrate |

### Workflow-Evaluation

Der gesamte Ablauf wird End-to-End bewertet:

- Erreicht der Agent das gewünschte Ziel?
- Wie viele Schritte werden benötigt?
- Welche Fehler treten auf?
- Wie lange dauert die Ausführung?

### Nutzer-Evaluation

Die tatsächliche Nutzererfahrung steht im Fokus:

- Zufriedenheit mit der Antwort
- War die Interaktion hilfreich?
- Würde der Nutzer den Agenten erneut verwenden?

---

> [!WARNING] Ohne Baseline keine belastbare Aussage
> Eine einzelne Messung sagt nichts — erst der Vergleich (vorher/nachher, Version A/B) zeigt, ob eine Änderung wirklich hilft oder nur an einem Ort verbessert und anderswo verschlechtert. Regression-Tests sind kein Optional-Feature.

## Metriken für Agenten

### Quantitative Metriken

**Accuracy-basiert:**

```python
# Beispiel: Tool-Auswahl-Accuracy
expected_tool = "search_database"
actual_tool = agent_response.tool_calls[0].name

accuracy = 1.0 if expected_tool == actual_tool else 0.0
```

| Metrik | Beschreibung | Berechnung |
|--------|--------------|------------|
| **Accuracy** | Anteil korrekter Antworten | Richtig / Gesamt |
| **Precision** | Anteil relevanter unter gefundenen | TP / (TP + FP) |
| **Recall** | Anteil gefundener unter relevanten | TP / (TP + FN) |
| **F1-Score** | Harmonisches Mittel | 2 × (P × R) / (P + R) |

**Performance-basiert:**

| Metrik | Beschreibung | Zielwert |
|--------|--------------|----------|
| **Latenz (p50)** | Median der Antwortzeit | < 2 Sekunden |
| **Latenz (p95)** | 95. Perzentil | < 5 Sekunden |
| **Token-Verbrauch** | Kosten pro Request | Minimieren |
| **Schritte bis Lösung** | Anzahl Tool-Calls | Minimieren |

### Qualitative Metriken

Nicht alles lässt sich in Zahlen fassen. Qualitative Bewertungen erfassen:

- **Kohärenz:** Ist die Antwort in sich schlüssig?
- **Relevanz:** Beantwortet die Antwort die Frage?
- **Vollständigkeit:** Fehlen wichtige Aspekte?
- **Ton:** Ist die Antwort angemessen formuliert?
- **Sicherheit:** Enthält die Antwort problematische Inhalte?

---

## Datasets erstellen

Gute Evaluation beginnt mit guten Testdaten. Ein Dataset besteht aus Input-Output-Paaren, die das erwartete Verhalten definieren.

### Grundstruktur

```python
examples = [
    {
        "inputs": {"question": "Was ist die Hauptstadt von Frankreich?"},
        "outputs": {"answer": "Paris"}
    },
    {
        "inputs": {"question": "Berechne 15 * 7"},
        "outputs": {"answer": "105", "tool_used": "calculator"}
    },
]
```

### Dataset-Erstellung mit LangSmith

```python
from langsmith import Client

client = Client()

# Dataset anlegen
dataset = client.create_dataset(
    dataset_name="Agent-Evaluation-v1",
    description="Testfälle für den Support-Agenten"
)

# Beispiele hinzufügen
for example in examples:
    client.create_example(
        dataset_id=dataset.id,
        inputs=example["inputs"],
        outputs=example["outputs"],
    )
```

### Best Practices für Datasets

| Aspekt | Empfehlung | Begründung |
|--------|------------|------------|
| **Größe** | 20–50 Beispiele | Balance: Aussagekraft vs. Laufzeit |
| **Diversität** | Edge Cases abdecken | Nicht nur "Happy Path" |
| **Versionierung** | Namen mit Version | `v1`, `v2` für Vergleiche |
| **Dokumentation** | Beschreibung pro Beispiel | Nachvollziehbarkeit |
| **Aktualisierung** | Bei neuen Fehlern erweitern | Kontinuierliche Verbesserung |

### Kategorien von Testfällen

Ein ausgewogenes Dataset enthält verschiedene Kategorien:

```
Dataset-Struktur:
├── Happy Path (60%)
│   └── Typische, erwartbare Anfragen
├── Edge Cases (25%)
│   ├── Grenzwerte
│   ├── Ungewöhnliche Formulierungen
│   └── Mehrdeutige Anfragen
└── Negative Tests (15%)
    ├── Ungültige Eingaben
    ├── Out-of-Scope Fragen
    └── Adversariale Inputs
```

---

## Evaluierungsmethoden

### Exakte Übereinstimmung

Die einfachste Form: Stimmt die Ausgabe exakt mit dem Erwartungswert überein?

```python
def exact_match(predicted: str, expected: str) -> float:
    return 1.0 if predicted.strip().lower() == expected.strip().lower() else 0.0
```

**Vorteile:** Einfach, deterministisch, schnell  
**Nachteile:** Zu streng für natürlichsprachliche Ausgaben

### Teilübereinstimmung

Prüft, ob erwartete Elemente in der Antwort enthalten sind:

```python
def contains_answer(predicted: str, expected_keywords: list) -> float:
    predicted_lower = predicted.lower()
    matches = sum(1 for kw in expected_keywords if kw.lower() in predicted_lower)
    return matches / len(expected_keywords)
```

### Semantische Ähnlichkeit

Nutzt Embeddings, um die Bedeutungsähnlichkeit zu messen:

```python
from langchain_openai import OpenAIEmbeddings
import numpy as np

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

def semantic_similarity(text1: str, text2: str) -> float:
    vec1 = embeddings.embed_query(text1)
    vec2 = embeddings.embed_query(text2)
    # Cosine Similarity
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
```

### LLM-as-Judge

Ein LLM bewertet die Qualität einer Antwort — der mächtigste, aber auch teuerste Ansatz.

```python
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate

judge_llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)

judge_prompt = ChatPromptTemplate.from_template("""
Bewerte die folgende Antwort auf einer Skala von 1 bis 5.

Frage: {question}
Erwartete Antwort: {expected}
Tatsächliche Antwort: {actual}

Bewertungskriterien:
- 5: Perfekt, vollständig korrekt
- 4: Korrekt mit minimalen Abweichungen
- 3: Teilweise korrekt
- 2: Überwiegend falsch
- 1: Komplett falsch oder irrelevant

Antworte NUR mit einer Zahl von 1 bis 5.
""")

def llm_judge(question: str, expected: str, actual: str) -> float:
    response = judge_llm.invoke(
        judge_prompt.format(question=question, expected=expected, actual=actual)
    )
    score = int(response.content.strip())
    return score / 5.0  # Normalisiert auf 0-1
```

**Vorteile:**
- Flexibel bei natürlichsprachlichen Ausgaben
- Kann komplexe Kriterien bewerten
- Skaliert besser als menschliche Bewertung

**Nachteile:**
- Zusätzliche LLM-Kosten
- Nicht deterministisch
- Kann eigene Fehler haben (Bias)

---

## Automatisierte Evaluation mit LangSmith

LangSmith bietet integrierte Tools für systematische Evaluation.

### Evaluator definieren

```python
from langsmith.evaluation import evaluate

def my_agent(inputs: dict) -> dict:
    """Wrapper für den zu testenden Agenten."""
    response = agent.invoke({
        "messages": [{"role": "user", "content": inputs["question"]}]
    })
    return {"answer": response["messages"][-1].content}

def accuracy_evaluator(inputs: dict, outputs: dict, reference_outputs: dict) -> dict:
    """Custom Evaluator: Vergleicht mit Referenz."""
    predicted = outputs["answer"].lower()
    expected = reference_outputs["answer"].lower()
    
    score = 1.0 if expected in predicted else 0.0
    
    return {
        "key": "contains_answer",
        "score": score,
        "comment": f"Expected '{expected}' in output"
    }
```

### Evaluation ausführen

```python
results = evaluate(
    my_agent,
    data="Agent-Evaluation-v1",
    evaluators=[accuracy_evaluator],
    experiment_prefix="v2.0-release"
)

print(f"Durchschnittliche Accuracy: {results['contains_answer']:.1%}")
```

### Mehrere Evaluatoren kombinieren

```python
def latency_evaluator(inputs: dict, outputs: dict, reference_outputs: dict) -> dict:
    """Bewertet die Antwortzeit."""
    latency = outputs.get("latency_ms", 0)
    score = 1.0 if latency < 2000 else 0.5 if latency < 5000 else 0.0
    return {"key": "latency_ok", "score": score}

def length_evaluator(inputs: dict, outputs: dict, reference_outputs: dict) -> dict:
    """Prüft, ob Antwort nicht zu lang ist."""
    word_count = len(outputs["answer"].split())
    score = 1.0 if word_count <= 100 else 0.5 if word_count <= 200 else 0.0
    return {"key": "concise", "score": score}

# Alle Evaluatoren zusammen
results = evaluate(
    my_agent,
    data="Agent-Evaluation-v1",
    evaluators=[
        accuracy_evaluator,
        latency_evaluator,
        length_evaluator,
    ],
    experiment_prefix="v2.0-full-eval"
)
```

---

## Regression Testing

Regression Testing stellt sicher, dass Änderungen keine bestehende Funktionalität brechen.

### Workflow

```
1. Baseline etablieren
   └── Evaluation gegen Dataset → Metriken speichern

2. Änderung durchführen
   └── Prompt, Tool, Modell anpassen

3. Re-Evaluation
   └── Gleiche Tests, gleiche Metriken

4. Vergleich
   └── Ist die neue Version besser oder schlechter?

5. Entscheidung
   └── Deployment oder Rollback
```

### Praktische Umsetzung

```python
# Baseline etablieren (einmalig)
baseline_results = evaluate(
    my_agent_v1,
    data="Agent-Evaluation-v1",
    evaluators=[accuracy_evaluator],
    experiment_prefix="baseline-v1"
)

# Nach Änderungen: Re-Evaluation
new_results = evaluate(
    my_agent_v2,
    data="Agent-Evaluation-v1",
    evaluators=[accuracy_evaluator],
    experiment_prefix="candidate-v2"
)

# Automatischer Vergleich
if new_results["contains_answer"] >= baseline_results["contains_answer"]:
    print("✅ Keine Regression — Deployment möglich")
else:
    print("❌ Regression erkannt — Änderungen überprüfen")
```

### CI/CD-Integration

```python
# In pytest-Test integrieren
def test_agent_regression():
    """Regression-Test für CI/CD-Pipeline."""
    results = evaluate(
        my_agent,
        data="Agent-Evaluation-v1",
        evaluators=[accuracy_evaluator],
        experiment_prefix="ci-test"
    )
    
    # Mindest-Schwellenwert
    assert results["contains_answer"] >= 0.8, \
        f"Accuracy zu niedrig: {results['contains_answer']:.1%}"
```

---

## Feedback-Schleifen

Evaluation ist kein einmaliger Vorgang, sondern ein kontinuierlicher Prozess.

### Production-Feedback sammeln

```python
from langsmith import Client

client = Client()

# Nach jeder Agent-Antwort in Production
def collect_user_feedback(run_id: str, rating: int, comment: str = ""):
    """Sammelt Nutzer-Feedback für kontinuierliche Verbesserung."""
    client.create_feedback(
        run_id=run_id,
        key="user_satisfaction",
        score=rating / 5.0,  # Normalisiert auf 0-1
        comment=comment
    )
```

### Feedback → Dataset → Verbesserung

```
Production-Feedback
       │
       ▼
┌──────────────────┐
│ Schlechte Fälle  │
│ identifizieren   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Zu Dataset       │
│ hinzufügen       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Agent            │
│ verbessern       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Re-Evaluation    │
│ durchführen      │
└──────────────────┘
```

### Automatische Anomalie-Erkennung

```python
def monitor_agent_quality():
    """Überwacht Agent-Qualität in Production."""
    # Letzte 100 Runs abrufen
    runs = client.list_runs(
        project_name="Production-Agent",
        limit=100
    )
    
    # Feedback-Scores aggregieren
    scores = [r.feedback_stats.get("user_satisfaction", {}).get("avg", 0) 
              for r in runs if r.feedback_stats]
    
    avg_score = sum(scores) / len(scores) if scores else 0
    
    # Alert bei Qualitätsabfall
    if avg_score < 0.7:
        send_alert(f"⚠️ Agent-Qualität gesunken: {avg_score:.1%}")
```

---

## A/B-Testing

Systematischer Vergleich verschiedener Agent-Varianten unter realen Bedingungen.

### Versuchsaufbau

```python
import random

def get_agent_variant(user_id: str) -> str:
    """Deterministische Zuweisung zu Variante."""
    # Gleicher User → immer gleiche Variante
    random.seed(hash(user_id))
    return random.choice(["control", "treatment"])

def invoke_with_variant(user_id: str, question: str):
    """Ruft die zugewiesene Agent-Variante auf."""
    variant = get_agent_variant(user_id)
    
    if variant == "control":
        agent = agent_v1  # Bisherige Version
    else:
        agent = agent_v2  # Neue Version
    
    response = agent.invoke({
        "messages": [{"role": "user", "content": question}]
    }, config={
        "metadata": {"variant": variant, "user_id": user_id}
    })
    
    return response
```

### Auswertung

Nach ausreichend Datenpunkten (typischerweise > 100 pro Variante):

```python
def analyze_ab_test():
    """Analysiert A/B-Test-Ergebnisse."""
    control_runs = client.list_runs(
        project_name="Production-Agent",
        filter="eq(metadata.variant, 'control')"
    )
    
    treatment_runs = client.list_runs(
        project_name="Production-Agent",
        filter="eq(metadata.variant, 'treatment')"
    )
    
    control_satisfaction = calculate_avg_satisfaction(control_runs)
    treatment_satisfaction = calculate_avg_satisfaction(treatment_runs)
    
    print(f"Control (v1): {control_satisfaction:.1%}")
    print(f"Treatment (v2): {treatment_satisfaction:.1%}")
    
    if treatment_satisfaction > control_satisfaction + 0.05:
        print("✅ Treatment signifikant besser — Rollout empfohlen")
    elif treatment_satisfaction < control_satisfaction - 0.05:
        print("❌ Treatment schlechter — Rollback empfohlen")
    else:
        print("⚖️ Kein signifikanter Unterschied — mehr Daten sammeln")
```

---

## Evaluation von RAG-Systemen

RAG-Systeme erfordern spezialisierte Evaluation auf mehreren Ebenen.

### Retrieval-Evaluation

Findet der Retriever die richtigen Dokumente?

```python
def evaluate_retrieval(query: str, relevant_doc_ids: list, k: int = 5):
    """Bewertet Retriever-Qualität."""
    results = retriever.invoke(query)
    retrieved_ids = [doc.metadata.get("id") for doc in results[:k]]
    
    # Precision@k
    relevant_retrieved = len(set(retrieved_ids) & set(relevant_doc_ids))
    precision = relevant_retrieved / k
    
    # Recall@k
    recall = relevant_retrieved / len(relevant_doc_ids)
    
    return {"precision": precision, "recall": recall}
```

### Generation-Evaluation

Nutzt das LLM den Kontext korrekt?

| Metrik | Beschreibung | Prüfung |
|--------|--------------|---------|
| **Faithfulness** | Basiert Antwort auf Kontext? | Keine Halluzination |
| **Relevanz** | Beantwortet Frage? | Nicht off-topic |
| **Groundedness** | Quellenangaben korrekt? | Zitate prüfbar |

```python
def faithfulness_evaluator(inputs: dict, outputs: dict, reference_outputs: dict) -> dict:
    """Prüft, ob Antwort auf dem Kontext basiert."""
    context = inputs.get("context", "")
    answer = outputs["answer"]
    
    # LLM-as-Judge für Faithfulness
    prompt = f"""
    Kontext: {context}
    
    Antwort: {answer}
    
    Basiert die Antwort ausschließlich auf dem gegebenen Kontext?
    Antworte mit JA oder NEIN.
    """
    
    response = judge_llm.invoke(prompt)
    score = 1.0 if "JA" in response.content.upper() else 0.0
    
    return {"key": "faithfulness", "score": score}
```

### End-to-End RAG-Evaluation

```python
rag_evaluators = [
    retrieval_precision_evaluator,
    retrieval_recall_evaluator,
    faithfulness_evaluator,
    relevance_evaluator,
    latency_evaluator,
]

results = evaluate(
    my_rag_chain,
    data="RAG-Evaluation-v1",
    evaluators=rag_evaluators,
    experiment_prefix="rag-v2"
)
```

---

## Best Practices

### Evaluations-Strategie

| Phase | Fokus | Methode |
|-------|-------|---------|
| **Entwicklung** | Schnelles Feedback | Kleine Datasets, einfache Metriken |
| **Pre-Release** | Umfassende Prüfung | Volle Datasets, alle Evaluatoren |
| **Production** | Kontinuierlich | Sampling, Feedback-Loops |

### Häufige Fehler vermeiden

**Fehler 1: Zu kleine Datasets**

```
❌ 5 Beispiele → Keine statistische Aussagekraft
✅ 30+ Beispiele → Belastbare Ergebnisse
```

**Fehler 2: Nur Happy Path testen**

```
❌ Nur Standardfälle → Produktions-Überraschungen
✅ Edge Cases einbeziehen → Robustere Agenten
```

**Fehler 3: Evaluation ignorieren nach Launch**

```
❌ Einmalige Evaluation → Schleichende Qualitätsverluste
✅ Kontinuierliches Monitoring → Frühe Problemerkennung
```

**Fehler 4: Falsche Metriken**

```
❌ Nur Accuracy → Langsame, teure Antworten unerkannt
✅ Mehrere Dimensionen → Vollständiges Bild
```

### Dokumentation

Jede Evaluation sollte dokumentiert werden:

```markdown
## Evaluation Report: Agent v2.1

**Datum:** 2025-01-15
**Dataset:** Agent-Evaluation-v1 (45 Beispiele)
**Experiment:** v2.1-pre-release

### Ergebnisse

| Metrik | v2.0 | v2.1 | Δ |
|--------|------|------|---|
| Accuracy | 82% | 87% | +5% |
| Latenz (p50) | 1.8s | 1.5s | -17% |
| Kosten/Request | $0.02 | $0.018 | -10% |

### Fazit
Version 2.1 zeigt Verbesserungen in allen Metriken.
Empfehlung: Deployment freigeben.
```

---

## Zusammenfassung

### Kernkonzepte

| Konzept | Beschreibung |
|---------|--------------|
| **Dataset** | Sammlung von Input-Output-Paaren für reproduzierbare Tests |
| **Evaluator** | Funktion, die Qualität einer Antwort bewertet |
| **Experiment** | Ein Durchlauf der Evaluation mit eindeutigem Identifier |
| **Metrik** | Quantifizierbare Messgröße (Accuracy, Latenz, etc.) |
| **Baseline** | Referenzwert für Vergleiche |
| **Regression** | Qualitätsverschlechterung nach Änderungen |

### Evaluierungs-Workflow

```
1. Dataset erstellen
   └── Inputs + erwartete Outputs definieren

2. Evaluatoren wählen
   └── Accuracy, LLM-as-Judge, Custom-Metriken

3. Baseline etablieren
   └── Aktuelle Version evaluieren

4. Änderungen testen
   └── Neue Version gegen gleiches Dataset

5. Vergleichen & Entscheiden
   └── Deployment oder Iteration

6. Kontinuierlich überwachen
   └── Production-Feedback → Dataset erweitern
```

### Quick Reference

```python
# Dataset erstellen
from langsmith import Client
client = Client()
dataset = client.create_dataset(dataset_name="My-Tests")

# Evaluator definieren
def my_evaluator(inputs, outputs, reference_outputs):
    score = 1.0 if expected in outputs["answer"] else 0.0
    return {"key": "accuracy", "score": score}

# Evaluation ausführen
from langsmith.evaluation import evaluate
results = evaluate(my_agent, data="My-Tests", evaluators=[my_evaluator])

# Feedback sammeln
client.create_feedback(run_id=run_id, key="user_rating", score=0.8)
```

## Abgrenzung zu verwandten Dokumenten

| Dokument | Inhalt |
|---|---|
| [Lohnt es sich überhaupt?](https://ralf-42.github.io/Agenten/concepts/Lohnt_es_sich.html) | Machbarkeitsbewertung vor dem Bau — Evaluation bewertet nach dem Bau |
| [RAG-Konzepte](https://ralf-42.github.io/Agenten/concepts/RAG_Konzepte.html) | RAG-Architektur — dieses Dokument beschreibt deren Evaluierung |
| [Agent Security](https://ralf-42.github.io/Agenten/concepts/Agent_Security.html) | Sicherheitstests als eigene Evaluierungsebene |


---

**Version:** 1.0     
**Stand:** November 2025     
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.   
