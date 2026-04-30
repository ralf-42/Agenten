---
layout: default
title: Frameworks
nav_order: 4
has_children: true
description: "Einsteiger-Guides für LangChain, LangGraph, LangSmith, ChromaDB und Agent Builder"
---

# Frameworks

Einsteiger-Guides zu wichtigen Frameworks und Werkzeugen der generativen KI.

## Wann dieser Bereich?

`frameworks/` passt, wenn das fachliche Ziel bereits klar ist und nun die konkrete Umsetzung folgt. Der Bereich beantwortet vor allem die Frage, mit welchem Werkzeug begonnen werden sollte, wie typische Arbeitsmuster in LangChain, LangGraph oder LangSmith aussehen und welche Best Practices im Projekt gelten.

Für eine empfohlene Lesereihenfolge über mehrere Bereiche hinweg zuerst [Lesepfade](./lesepfade.html) öffnen.

Die folgenden Seiten geben einen kompakten Einstieg in zentrale Frameworks und Werkzeuge:

## LLM-Orchestrierung & Workflows

- **[LangChain Einsteiger](./frameworks/einsteiger-langchain.html)** – *Wie orchestriere ich LLMs mit LangChain?* Grundlagen für LLM-Orchestrierung, Chains und Agents
  - Model Integration und Prompting
  - Tool Use und Function Calling
  - Chains und LCEL (LangChain Expression Language)
  - RAG-Systeme mit LangChain

- **[LangGraph Einsteiger](./frameworks/einsteiger-langgraph.html)** – *Wie baue ich Multi-Agent-Systeme mit LangGraph?* Multi-Agent-Systeme und zustandsbasierte Workflows
  - StateGraph: Nodes, Edges und State
  - Conditional Routing und Entscheidungslogik
  - Checkpointing und Session-Management
  - Human-in-the-Loop und Supervisor-Pattern

- **[DeepAgents Einsteiger](./frameworks/einsteiger-deepagents.html)** – *Wie nutze ich den Harness-Ansatz für Agenten?* Harness-Ansatz für Planning, Dateien und Sub-Agenten
  - `create_deep_agent()` als schneller Einstieg
  - Planning, Filesystem und Delegation
  - Vergleich: Harness vs. manueller LangGraph-Aufbau
  - Grenzen, Transparenz und Debugging


## Monitoring & Debugging

- **[LangSmith Einsteiger](./frameworks/einsteiger-langsmith.html)** – *Wie debugge und überwache ich Agenten?* Tracing, Debugging und Evaluation von Agenten
  - Traces verstehen und auswerten
  - Runs, Feedback und Annotationen
  - Eval-Datasets und Regression-Tests
  - LangSmith in der Entwicklungs-Pipeline

## Vektordatenbanken

- **[ChromaDB Einsteiger](./frameworks/einsteiger-chromadb.html)** – *Wie speichere und finde ich Embeddings?* Vektordatenbank für semantische Suche und RAG-Systeme
  - Embedding-Speicherung und -Retrieval
  - Similarity Search und Filtering
  - Collections und Metadaten
  - Integration mit LangChain

## Projektspezifische Bibliotheken

- **[GenAI_Lib Einsteiger](./frameworks/einsteiger-genai-lib.html)** – *Welche Utilities stellt das Projekt bereit?* Projektspezifische Python-Bibliothek für Kursanwendungen
  - **utilities.py** - Environment-Checks, Paket-Installation, API-Keys, Prompt-Templates
  - **model_config.py** - Rollenbasierte Modell-Konstanten (`BASELINE`, `ROUTER`, `JUDGE`, `WORKER`, ...)

## No-Code / Low-Code

- **[Agent Builder Einsteiger](./frameworks/einsteiger-agent-builder.html)** – *Wie erstelle ich Agenten ohne Code?* Agenten ohne Code: Custom GPTs und visueller Workflow-Builder
  - Custom GPT-Erstellung
  - Tool-Integration ohne Programmierung
  - Prompt-Design und Testing
  - Deployment und Sharing

## Modell-Auswahl

- **[Modell-Auswahl Guide](./frameworks/modell-auswahl-guide.html)** – *Welches Modell für welche Aufgabe?*
  - Designregeln: Router/Supervisor → `o3`, Worker → `gpt-5.1`, Demos → `gpt-4o-mini`
  - Entscheidungsbaum und Einordnung typischer Einsatzszenarien
  - Code-Muster für Mixed-Model-Setup
  - Kosten-Orientierung und Vergleichsstandard

- **[Provider-Modell-Mapping](./frameworks/provider-modell-mapping.html)** – *Wie bilde ich Modellrollen auf verschiedene Provider ab?* Wie sich dieselben Modellrollen auf OpenAI, Mistral und Anthropic abbilden lassen
  - Rollenbasiertes Mapping statt reiner Modellnamen
  - Zuordnung für Baseline, Router, Judge, Worker, Coding, Audio und Embeddings
  - Hilfestellung für providerneutrale Architektur- und Migrationstexte

## Prompt-Templates

- **[Prompt-Templates Einsteiger](./frameworks/einsteiger-prompts.html)** – *Wie erstelle ich eigene Prompt-Dateien?* Eigene Prompt-Dateien in `05_prompt/` erstellen
  - Was ist YAML? Frontmatter-Syntax und Felder erklärt
  - Was sind XML-Tags? Warum strukturieren sie Prompts besser
  - Die drei Typen: System-only, Template mit Variablen, Few-Shot
  - `load_prompt()` nutzen und häufige Fehler vermeiden

## Best Practices & Anti-Patterns

Für jedes zentrale Framework gibt es eine dedizierte Referenz mit empfohlenen Patterns und Anti-Patterns zum Vermeiden.

- **[LangChain Best Practices](./frameworks/langchain-best-practices.html)** – *Was sind die 7 MUST-HAVE Features?* Pflichtpatterns für alle LangChain 1.0+ Notebooks
  - `init_chat_model()`, `with_structured_output()`, `@tool`, `create_agent()`
  - LCEL `|` Chains, Middleware, Standard Content Blocks
  - Anti-Patterns und Migrationshinweise (v1.2.x Neuerungen)

- **[LangGraph Best Practices](./frameworks/langgraph-best-practices.html)** – *Wann LangGraph statt `create_agent()`?* Pflichtpatterns für Multi-Agent-Systeme und State Machines
  - StateGraph, Nodes & Edges, Conditional Routing
  - Checkpointing, Human-in-the-Loop, Subgraphs
  - Entscheidungshilfe: LangChain vs. LangGraph

- **[LangSmith Best Practices](./frameworks/langsmith-best-practices.html)** – *Wie observiere ich Agenten richtig?* Tracing, Evaluation und Monitoring in der Praxis
  - `LANGSMITH_*` Umgebungsvariablen (nicht `LANGCHAIN_*`)
  - `.with_config()`, `.func()`, Projektname-Konventionen
  - Troubleshooting: EU-Endpoint, falsches Projekt, fehlende Traces

- **[Agent Evaluation & Observability Best Practices](./frameworks/agent-evaluation-observability-best-practices.html)** – *Wie werden Agenten mit Baselines, Traces und Regressionen belastbar?*
  - Mindeststandard für Evaluation, Observability und kleine Harness-Logik
  - Teilnehmerfassung als Brücke zwischen Konzeptseite und Framework-Details

