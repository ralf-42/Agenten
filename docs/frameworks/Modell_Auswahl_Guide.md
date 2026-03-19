---
layout: default
title: Modell-Auswahl Guide
parent: Frameworks
nav_order: 8
description: Welches Modell für welche Aufgabe? Designregeln für gpt-4o-mini, o3, gpt-5.1 im Agentenkontext
has_toc: true
---

# Modell-Auswahl Guide
{: .no_toc }

> **Welches Modell für welche Aufgabe?**      
> Designregeln, Entscheidungsbaum und Modul-Mapping für den Agenten-Kurs.

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1 Modelle im Kurs

| Modell        | Stärke                                                      | Typischer Einsatz                              |
| ------------- | ----------------------------------------------------------- | ---------------------------------------------- |
| `gpt-4o-mini` | Schnell, günstig                                            | Grundlagen, einfache Tool-Calls, Demos         |
| `o3-mini`     | Reasoning, kompakt                                          | Leichte Entscheidungslogik, Routing            |
| `o3`          | Starkes Reasoning                                           | Supervisor, Judge, komplexes Routing, Security |
| `gpt-5.1`     | Coding & Agentic Tasks, konfigurierbarer Reasoning-Aufwand | Worker-Agenten, Code-Generierung, RAG-Synthese |

> [!TIP] Faustregel    
> Nicht das stärkste Modell wählen — das *passende* für den Knoten.


---

## 2 Designregeln

Diese Regeln gelten für alle Module, in denen Modelle explizit zugewiesen werden:

### Regel 1 — Router und Supervisor: `o3`

Knoten, die **Entscheidungen treffen** (Routing, Supervisor-Logik, Conditional Edges), erhalten `o3`.

> [!WARNING] Schwaches Modell als Router → Fehler im gesamten Graph    
> Schwache Modelle treffen fehlerhafte Routing-Entscheidungen, die sich durch alle nachgelagerten Nodes fortpflanzen. Ein einzelner falscher Route-Entscheid kann den gesamten Workflow zum Scheitern bringen.

Begründung: Schwache Modelle treffen fehlerhafte Routing-Entscheidungen, die sich durch den gesamten Graphen fortpflanzen.

```python
from langchain.chat_models import init_chat_model

supervisor_llm = init_chat_model("openai:o3")
```

### Regel 1b — Kostenbewusste Routing-Baseline: `o3-mini`

Für **einfache** Entscheidungslogik (2-3 Routen, geringe Fehlertoleranz, Demo/Prototyp) kann `o3-mini` als kostengünstige Baseline genutzt werden.
Bei kritischen Entscheidungen (Supervisor, Security, Evaluation) bleibt `o3` die Standardwahl.

```python
router_llm = init_chat_model("openai:o3-mini")
```

> [!DANGER] o3 / o3-mini: kein temperature-Parameter    
> Beide Modelle unterstützen `temperature` nicht. Jeder Aufruf mit `temperature=...` führt zu einem API-Fehler. Parameter einfach weglassen — der API-Default wird automatisch verwendet.

### Regel 2 — Worker und Content: `gpt-5.1`

Knoten, die **Inhalte erzeugen** (Texte, Code, RAG-Antworten, strukturierte Ausgaben), erhalten `gpt-5.1`.
Begründung: Optimiert für Coding und agentic Tasks mit konfigurierbarem Reasoning-Aufwand.

```python
worker_llm = init_chat_model("openai:gpt-5.1")
```

> [!DANGER] gpt-5.1 + temperature → API-Fehler     
> `temperature` ist nur mit `reasoning_effort="none"` gültig. Bei allen anderen Werten (`"low"`, `"medium"`, `"high"`) wirft die API sofort einen Fehler.
> **Empfehlung:** `temperature` bei gpt-5.1 weglassen und stattdessen `reasoning_effort` zur Qualitätssteuerung nutzen.
>
> ```python
> # Korrekt: ohne temperature
> worker_llm = init_chat_model("openai:gpt-5.1")
> ```

### Regel 3 — Judge und Evaluator: `o3`

LLM-as-Judge Evaluatoren erhalten `o3`.
Begründung: Qualitative Bewertung erfordert Urteilsvermögen, nicht nur Textgenerierung.

```python
judge_llm = init_chat_model("openai:o3")
```

### Regel 4 — Grundlagen und Demos: `gpt-4o-mini`

Alle Module, in denen das Konzept im Vordergrund steht (nicht die Ausgabequalität), verwenden `gpt-4o-mini`.
Begründung: Didaktik, Kosteneffizienz, schnelle Iteration.

```python
llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)
```

### Regel 5 — Baseline immer dokumentieren

Jeder Mixed-Model-Einsatz startet mit einem **Single-Model-Baseline-Run** auf `gpt-4o-mini`.
Vergleich mit 4 Kennzahlen: Ergebnisqualität · Schritte bis FINISH · Latenz · Kosten.

### Regel 6 — Einfache Aufgaben nicht hochheben

Extraktion, Formatierung, einfache Klassifikation: immer `gpt-4o-mini`.
Premium-Modelle für strukturierte Datenextraktion aus klar definierten Texten bringen keinen Mehrwert.

---

## 3 Entscheidungsbaum

```mermaid
flowchart TD
    START(["Welche Rolle hat\nder Knoten?"])

    START --> R{"Routing · Supervisor\nConditional Edge?"}
    START --> J{"LLM-as-Judge\nEvaluator · Fact-Check?"}
    START --> W{"Worker: Code · Text\nRAG-Antwort · Structured Output?"}
    START --> G{"Grundlagen-Demo\nEinzel-Tool · einfache Chain?"}
    START --> U{"Unklarer Fall?"}

    R -->|kritisch| O3A["🔵 o3"]
    R -->|einfach / Demo| O3M["🔵 o3-mini"]
    J -->|Ja| O3B["🔵 o3"]
    W -->|Ja| GP["🟢 gpt-5.1"]
    G -->|Ja| MINI["⚪ gpt-4o-mini"]
    U -->|Ja| BASE["⚪ gpt-4o-mini\nals Baseline starten\ndann gezielt upgraden"]

    style O3A  fill:#1565C0,color:#fff
    style O3M  fill:#1976D2,color:#fff
    style O3B  fill:#1565C0,color:#fff
    style GP   fill:#2E7D32,color:#fff
    style MINI fill:#546E7A,color:#fff
    style BASE fill:#546E7A,color:#fff
    style START fill:#E65100,color:#fff
```

---

## 4 Modul-Mapping

### Standard: `gpt-4o-mini` (Fokus Konzept, nicht Modellqualität)

| Module | Begründung |
|--------|-----------|
| M01–M11 | Grundlagen, Tool Use, RAG-Aufbau — Konzept > Qualität |
| M13–M17 | StateGraph, Checkpointing, HITL — Struktur lernen |
| M29 | Überblick Agent Builder — Vergleich, nicht Optimierung |
| M28 | Gradio/UI-Fokus — Interaktionsdesign > Modellqualität |
| M31 | Production Deployment — Kostenmodell verstehen |

### Mixed-Model: Lerninhalt im Modul verankert

| Modul | Supervisor / Router | Worker / Generator | Lernziel |
|-------|--------------------|--------------------|-----------|
| **M12** | Einführung Konzept | — | *Warum Routing-Knoten ein stärkeres Modell brauchen* |
| **M21 / M22** | `o3` | `gpt-4o-mini` | Supervisor-Pattern: Modell-Rollentrennung live erleben |
| **M18** | `o3` (Judge) | `gpt-4o-mini` (Candidate) | LLM-as-Judge: Warum der Judge stark sein muss |
| **M26** | `o3` (Planner) | `gpt-5.1` (Generator) | Agentic RAG: Retrieval-Steuerung vs. Antwortsynthese |
| **M19** | `o3` (Judge, optional Demo) | `gpt-4o-mini` (Candidate) | Evaluation: Baseline vs. starker Evaluator |
| **M20** | `o3` (Policy/Risk) | `gpt-4o-mini` (Worker) | Security: robuste Gate-Entscheidungen |

---

## 5 Code-Muster für Mixed-Model-Setup

### Supervisor + Worker (M21 / M22)

```python
from langchain.chat_models import init_chat_model

# Supervisor: trifft Routing-Entscheidungen
supervisor_llm = init_chat_model("openai:o3")

# Worker: erzeugt Inhalte
worker_llm = init_chat_model("openai:gpt-4o-mini", temperature=0.2)

# Baseline: alles auf gpt-4o-mini (immer zuerst!)
baseline_llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)
```

### Judge + Candidate (M18)

```python
# LLM-as-Judge: bewertet Antwortqualität
judge_llm   = init_chat_model("openai:o3")

# Candidate: der evaluierte Agent
agent_llm   = init_chat_model("openai:gpt-4o-mini", temperature=0.0)
```

### Planner + Generator (M26 — Agentic RAG)

```python
# Planner/Router: entscheidet ob RAG nötig, welche Quellen
planner_llm   = init_chat_model("openai:o3")

# Generator: synthetisiert die finale Antwort aus Chunks
# Hinweis: gpt-5.1 ohne temperature (Kompatibilität, siehe Regel 2)
generator_llm = init_chat_model("openai:gpt-5.1")
```

---

## 6 Kosten-Orientierung

> Wichtig für Kursteilnehmer: Das Kurs-Budget liegt bei ca. 5 EUR.
> Mixed-Model-Runs mit `o3` kosten deutlich mehr als `gpt-4o-mini`.

| Setup | Relatives Kostenniveau | Empfehlung |
|-------|----------------------|------------|
| Alles `gpt-4o-mini` | ⭐ (Baseline) | Standard für alle Lernschritte |
| Supervisor `o3` + Worker `gpt-4o-mini` | ⭐⭐⭐ | Nur für Mixed-Model-Demo-Zellen |
| Supervisor `o3` + Worker `gpt-5.1` | ⭐⭐⭐⭐⭐ | Nur als abschließender Qualitätsvergleich |

**Empfohlenes Vorgehen im Kurs:**

1. Konzept mit `gpt-4o-mini` verstehen und ausprobieren
2. Mixed-Model-Zellen als optionale Demo kennzeichnen (`# Optional: Mixed-Model`)
3. Vergleichstabelle (Qualität · Schritte · Latenz · Kosten) gemeinsam ausfüllen

---

## 7 Vergleichsstandard (Minimalformat)

Jeder Mixed-Model-Abschnitt in den Modulen dokumentiert den Vergleich in dieser Tabelle:

```python
# Vorlage Vergleichstabelle
vergleich = {
    "Modell-Setup":      ["Baseline (gpt-4o-mini)", "Mixed (o3 + gpt-4o-mini)"],
    "Ergebnisqualität":  ["...", "..."],   # subjektiv: schlecht / gut / sehr gut
    "Schritte":          [n1, n2],
    "Latenz (sek)":      [t1, t2],
    "Kosten (USD)":      [c1, c2],
}
```

---

## 8 Wo ist dieser Guide im Kurs verankert?

| Modul | Art der Verankerung |
|-------|---------------------|
| M12 | Markdown-Zelle: Konzept Modell-Rollentrennung + Link zu diesem Guide |
| M21 | Code-Zelle: Supervisor `o3` vs. `gpt-4o-mini` Baseline-Vergleich |
| M22 | Vergleichstabelle: Supervisor-Pattern mit Kennzahlen |
| M18 | Code-Zelle: Judge `o3` — Warum der Evaluator stark sein muss |
| M26 | Code-Zelle: Planner `o3` + Generator `gpt-5.1` |
| M19 | Modul-Mapping: `o3` als optionaler Judge in Evaluation-Pipeline |
| M20 | Modul-Mapping: `o3` als Policy/Risk-Klassifizierer, `gpt-4o-mini` als Worker |

---

**Version:** 1.2    
**Stand:** März 2026    
**Gilt für:** LangChain 1.0+, LangGraph 1.0+, OpenAI API    
