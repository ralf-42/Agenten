---
layout: default
title: Migration-Analyse Provider
parent: Deployment
nav_order: 3
description: Migrationsleitfaden für den Wechsel von OpenAI-basierten Kursmodulen in die Mistral-Modellwelt mit LangChain als Abstraktionsschicht
has_toc: true
---

# Migration: OpenAI → Mistral
{: .no_toc }

> **Migrationsleitfaden für das Projekt `Agenten`**      
> Zentrale Aussage: Die Migration wird vor allem dadurch vereinfacht, dass das Projekt stark auf **LangChain** und das umgebende Ökosystem setzt.

{: .note }
> Die in `01_notebook/` genannten Module dienen hier nur als **anfassbare Beispiele**.  
> Relevant ist nicht das einzelne Notebook, sondern **welche Art von Änderung** durch die bestehende LangChain-Struktur vereinfacht wird.

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1 Kernaussage

Eine Migration von OpenAI zu Mistral ist im Projekt `Agenten` **nicht trivial**, aber sie ist deutlich einfacher, weil große Teile der LLM-Nutzung bereits über **LangChain-Abstraktionen** laufen.

Die Vereinfachung entsteht vor allem durch:

- `init_chat_model(...)` statt provider-spezifischer Roh-Clients an vielen Stellen
- konsistente Nutzung von LangChain-/LangGraph-Mustern
- klare Trennung zwischen Modellrolle, Tooling und Workflow
- vorhandene Struktur für RAG, Agents, Structured Output und Evaluation

Die Migration ist deshalb in erster Linie:

- **kein Rewrite der Agentenlogik**
- **kein Neubau der Workflows**
- sondern vor allem eine **kontrollierte Anpassung der Modell- und Provider-Schicht**

---

## 2 Was LangChain bei der Migration vereinfacht

### 2.1 Vereinheitlichte Modellinitialisierung

Wo Modelle über `init_chat_model(...)` bezogen werden, wird die Migration deutlich leichter:

- Provider-Wechsel erfolgt über Modell-String und Konfiguration
- die umgebende Chain-, Agent- oder Graph-Logik bleibt oft unverändert
- dieselben Patterns bleiben erhalten

**Beispielhaft betroffen:**

- Prompt-Chains
- ReAct-Agenten
- LangGraph-Nodes
- Supervisor- oder Judge-Knoten

### 2.2 Einheitliche Patterns für Chains, Tools und Graphen

Die Architektur des Projekts basiert weitgehend auf stabilen Patterns:

- `ChatPromptTemplate`
- `@tool`
- `create_agent()` / ReAct
- `StateGraph`
- `with_structured_output()`

Das ist migrationsfreundlich, weil die LLM-Ebene ausgetauscht werden kann, ohne dass die Grundstruktur neu entworfen werden muss.

### 2.3 LangGraph hält die Ablaufsteuerung stabil

Bei Multi-Step-Agenten liegt die eigentliche Komplexität oft nicht im Modell, sondern im Ablauf:

- Routing
- State
- Checkpointing
- Human-in-the-Loop
- Supervisor-Logik

Da diese Teile im Projekt über **LangGraph** modelliert sind, bleiben sie bei einem Providerwechsel grundsätzlich erhalten. Geändert wird primär, **welches Modell** die Rolle eines Routers, Judges oder Workers übernimmt.

### 2.4 Strukturierte Ausgaben bleiben auf derselben Schiene

Wenn ein Modul `with_structured_output()` oder Pydantic-Schemata nutzt, muss bei einer Migration nicht die gesamte Extraktionslogik neu gebaut werden. Stattdessen wird geprüft:

- unterstützt das neue Modell Structured Output stabil
- bleiben die Schemata robust
- ändern sich Fehlermuster oder Validierungsraten

Auch hier reduziert LangChain den Migrationsaufwand, weil dieselbe Integrationsform bestehen bleibt.

---

## 3 Was trotz LangChain nicht automatisch gelöst ist

LangChain vereinfacht die Migration stark, aber es löst nicht alle Unterschiede zwischen Providern.

### 3.1 Modellrollen müssen neu gemappt werden

Das Projekt nutzt faktisch ein Rollenmodell:

- **Baseline**
- **Router**
- **Judge**
- **Worker**
- **Embeddings**

Die Migration besteht deshalb nicht nur darin, `"openai:..."` durch `"mistral:..."` zu ersetzen, sondern die Rollen sinnvoll auf Mistral-Modelle zu verteilen.

### 3.2 Embeddings sind ein eigenes Migrationsthema

RAG-Strecken sind nicht automatisch mit einem Chat-Modell-Wechsel mitmigriert.

Zu entscheiden ist:

- OpenAI-Embeddings vorerst beibehalten
- oder Mistral-Embeddings einführen

Das ist architektonisch getrennt von der Chat-Modell-Migration.

### 3.3 OpenAI-spezifische Inhalte bleiben OpenAI-spezifisch

Wo ein Modul fachlich auf OpenAI zielt, hilft die LangChain-Abstraktion nicht weiter. Solche Inhalte sollten nicht künstlich in eine Mistral-Migration hineingezogen werden.

### 3.4 Qualitätsunterschiede bleiben real

Auch wenn dieselbe LangChain-Schnittstelle verwendet wird, können sich ändern:

- Tool-Auswahl
- Structured Output
- Routing-Entscheidungen
- Antwortqualität
- Latenz
- Kosten

LangChain reduziert also den **Umbauaufwand**, nicht automatisch die **fachlichen Unterschiede**.

---

## 4 Welche Migrationsarbeiten konkret anfallen

### 4.1 Provider-Schicht abstrahieren

Die wichtigste technische Maßnahme ist eine zentrale Modellinitialisierung.

```python
from langchain.chat_models import init_chat_model

MODEL_CONFIG = {
    "openai": {
        "baseline": "openai:gpt-4o-mini",
        "router": "openai:o3-mini",
        "judge": "openai:o3",
        "worker": "openai:gpt-5.1",
    },
    "mistral": {
        "baseline": "mistral:mistral-small-latest",
        "router": "mistral:magistral-medium-latest",
        "judge": "mistral:magistral-medium-latest",
        "worker": "mistral:mistral-medium-latest",
    },
}

def get_llm(role: str = "baseline", provider: str = "openai", **kwargs):
    model = MODEL_CONFIG[provider][role]
    return init_chat_model(model, **kwargs)
```

**Effekt:**  
Die eigentliche LangChain-/LangGraph-Logik bleibt weitgehend gleich, während die Providerwahl zentralisiert wird.

### 4.2 Embeddings separat kapseln

```python
from langchain_openai import OpenAIEmbeddings

def get_embeddings(provider: str = "openai"):
    if provider == "openai":
        return OpenAIEmbeddings(model="text-embedding-3-small")
    raise ValueError("Für diesen Provider ist noch kein Embedding-Backend konfiguriert.")
```

**Effekt:**  
Chat-Provider und Embedding-Provider werden sauber getrennt.

### 4.3 Modultexte und Doku markieren

Sinnvolle Markierungen:

- `Provider-neutral`
- `OpenAI-spezifisch`
- `Mistral-kompatibel`
- `RAG + Embeddings`
- `Mixed-Model-Demo`

**Effekt:**  
Die Migration wird transparent dokumentiert, ohne dass einzelne Notebooks überinterpretiert werden.

---

## 5 Wie die Notebooks als Beispiele dienen

Die Notebooks dienen nur dazu, die Typen von Migrationsarbeit anschaulich zu machen:

- **einfache Chat-Module** zeigen, wie gut `init_chat_model(...)` den Providerwechsel abfedert
- **Agent- und Graph-Module** zeigen, dass Workflow-Logik und Provider-Schicht getrennt bleiben
- **RAG-Module** zeigen, dass Embeddings separat betrachtet werden müssen
- **Mixed-Model-Module** zeigen, dass Rollenmapping wichtiger ist als reine Modellnamen
- **provider-spezifische Module** zeigen, wo Migration bewusst nicht das Ziel ist

Die Botschaft ist also:

> Die Notebooks sind keine Migrationsliste, sondern **Beleg dafür, dass die bestehende LangChain-Struktur die Migration systematisch vereinfacht**.

---

## 6 Prüf- und Testpunkte

Für jede Migration auf Mistral bleiben dieselben Kernfragen relevant:

- läuft die bestehende LangChain-/LangGraph-Struktur weiter stabil
- bleiben Tool-Aufrufe korrekt
- bleibt Structured Output valide
- bleiben Routing-Entscheidungen brauchbar
- passen Qualität, Latenz und Kosten zum Kursbetrieb

**Minimalmatrix:**

| Kriterium | Prüffrage |
|----------|-----------|
| **Qualität** | Ist die Ausgabe im Kurskontext brauchbar? |
| **Tool Use** | Werden Tools sinnvoll gewählt und korrekt aufgerufen? |
| **Structured Output** | Bleibt das Schema stabil gültig? |
| **Routing** | Bleibt die Rollenlogik nachvollziehbar? |
| **Latenz** | Ist der Flow noch flüssig? |
| **Kosten** | Ist der Lauf wirtschaftlich vertretbar? |

---

## 7 Empfohlene Reihenfolge

### Phase 1: Provider-Schicht zentralisieren

- `get_llm()`-Pattern einführen
- Rollenmapping dokumentieren
- OpenAI als Default beibehalten

### Phase 2: Einfache LangChain-Pfade prüfen

- einfache Chat- und Tool-Module als erste Beispiele verwenden
- Providerwechsel auf Mistral testen
- Unterschiede dokumentieren

### Phase 3: LangGraph- und Multi-Agent-Pfade vergleichen

- Router-, Judge- und Worker-Rollen auf Mistral prüfen
- Supervisor- und Routing-Verhalten testen

### Phase 4: Embedding-Strategie festlegen

- OpenAI-Embeddings vorerst beibehalten oder Mistral-Embeddings ergänzen
- RAG-Module getrennt bewerten

### Phase 5: Doku nachziehen

- Provider-Markierungen ergänzen
- OpenAI-spezifische Inhalte explizit ausweisen
- Mistral-Kompatibilität nur dort behaupten, wo sie geprüft wurde

---

## 8 Fazit

Die eigentliche Botschaft dieser Migration ist:

> Der Wechsel von OpenAI zu Mistral wird im Projekt `Agenten` nicht deshalb handhabbar, weil Provider austauschbar wären, sondern weil **LangChain und LangGraph die LLM-Schicht bereits stark standardisieren**.

Damit verschiebt sich die Arbeit weg von:

- komplettem Neuaufbau der Workflows

hin zu:

- Provider-Mapping
- Rollenmapping
- Embedding-Entscheidungen
- gezielten Qualitätsvergleichen

Genau darin liegt der architektonische Vorteil des bestehenden Ökosystems.

---

**Version:** 4.0    
**Stand:** März 2026    
**Kurs:** Agenten. Verstehen. Anwenden. Gestalten.    
