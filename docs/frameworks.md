---
layout: default
title: Frameworks
nav_order: 3
has_children: true
description: "Einsteiger-Guides für LangChain, LangGraph, LangSmith, ChromaDB und Agent Builder"
---

# Frameworks

Einsteiger-Guides zu wichtigen Frameworks und Werkzeugen der generativen KI.

Die folgenden Seiten geben einen kompakten Einstieg in zentrale Frameworks und Werkzeuge:

## LLM-Orchestrierung & Workflows

- **[LangChain Einsteiger](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_LangChain.html)** - Grundlagen für LLM-Orchestrierung, Chains und Agents
  - Model Integration und Prompting
  - Tool Use und Function Calling
  - Chains und LCEL (LangChain Expression Language)
  - RAG-Systeme mit LangChain

- **[LangGraph Einsteiger](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_LangGraph.html)** - Multi-Agent-Systeme und zustandsbasierte Workflows
  - StateGraph: Nodes, Edges und State
  - Conditional Routing und Entscheidungslogik
  - Checkpointing und Session-Management
  - Human-in-the-Loop und Supervisor-Pattern

- **[DeepAgents Einsteiger](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_DeepAgents.html)** - Harness-Ansatz für Planning, Dateien und Sub-Agenten
  - `create_deep_agent()` als schneller Einstieg
  - Planning, Filesystem und Delegation
  - Vergleich: Harness vs. manueller LangGraph-Aufbau
  - Grenzen, Transparenz und Debugging

## Monitoring & Debugging

- **[LangSmith Einsteiger](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_LangSmith.html)** - Tracing, Debugging und Evaluation von Agenten
  - Traces verstehen und auswerten
  - Runs, Feedback und Annotationen
  - Eval-Datasets und Regression-Tests
  - LangSmith in der Entwicklungs-Pipeline

## Vektordatenbanken

- **[ChromaDB Einsteiger](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_ChromaDB.html)** - Vektordatenbank für semantische Suche und RAG-Systeme
  - Embedding-Speicherung und -Retrieval
  - Similarity Search und Filtering
  - Collections und Metadaten
  - Integration mit LangChain

## Projektspezifische Bibliotheken

- **[GenAI_Lib Einsteiger](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_GenAI_Lib.html)** - Projektspezifische Python-Bibliothek für Kursanwendungen
  - **utilities.py** - Environment-Checks, Paket-Installation, API-Keys, Prompt-Templates
  - **multimodal_rag.py** - Multimodales RAG-System mit Text- und Bildsuche (Bild ↔ Bild, Bild ↔ Text)

## No-Code / Low-Code

- **[Agent Builder Einsteiger](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_Agent_Builder.html)** - Agenten ohne Code: Custom GPTs und visueller Workflow-Builder
  - Custom GPT-Erstellung
  - Tool-Integration ohne Programmierung
  - Prompt-Design und Testing
  - Deployment und Sharing

## Modell-Auswahl

- **[Modell-Auswahl Guide](https://ralf-42.github.io/Agenten/frameworks/Modell_Auswahl_Guide.html)** – Welches Modell für welche Aufgabe?
  - Designregeln: Router/Supervisor → `o3`, Worker → `gpt-5.1`, Demos → `gpt-4o-mini`
  - Entscheidungsbaum und Einordnung typischer Einsatzszenarien
  - Code-Muster für Mixed-Model-Setup
  - Kosten-Orientierung und Vergleichsstandard

- **[Provider-Modell-Mapping](https://ralf-42.github.io/Agenten/frameworks/Provider_Modell_Mapping.html)** – Wie sich dieselben Modellrollen auf OpenAI, Mistral und Anthropic abbilden lassen
  - Rollenbasiertes Mapping statt reiner Modellnamen
  - Zuordnung für Baseline, Router, Judge, Worker, Coding, Audio und Embeddings
  - Hilfestellung für providerneutrale Architektur- und Migrationstexte

## Prompt-Templates

- **[Prompt-Templates Einsteiger](https://ralf-42.github.io/Agenten/frameworks/Einsteiger_Prompts.html)** – Eigene Prompt-Dateien in `05_prompt/` erstellen
  - Was ist YAML? Frontmatter-Syntax und Felder erklärt
  - Was sind XML-Tags? Warum strukturieren sie Prompts besser
  - Die drei Typen: System-only, Template mit Variablen, Few-Shot
  - `load_prompt()` nutzen und häufige Fehler vermeiden
