---
layout: default
title: Frameworks
nav_order: 3
has_children: true
description: "Einsteiger-Guides für LangChain, LangGraph, LangSmith, ChromaDB und Agent Builder"
---

# Frameworks

Willkommen zu den Einsteiger-Guides für die wichtigsten Frameworks und Tools der Generativen KI!

Diese Guides führen Sie Schritt für Schritt in die wichtigsten Frameworks und Werkzeuge ein:

## LLM-Orchestrierung & Workflows

- **[LangChain Einsteiger](frameworks/Einsteiger_LangChain.html)** - Grundlagen für LLM-Orchestrierung, Chains und Agents
  - Model Integration und Prompting
  - Tool Use und Function Calling
  - Chains und LCEL (LangChain Expression Language)
  - RAG-Systeme mit LangChain

- **[LangGraph Einsteiger](frameworks/Einsteiger_LangGraph.html)** - Multi-Agent-Systeme und zustandsbasierte Workflows
  - StateGraph: Nodes, Edges und State
  - Conditional Routing und Entscheidungslogik
  - Checkpointing und Session-Management
  - Human-in-the-Loop und Supervisor-Pattern

## Monitoring & Debugging

- **[LangSmith Einsteiger](frameworks/Einsteiger_LangSmith.html)** - Tracing, Debugging und Evaluation von Agenten
  - Traces verstehen und auswerten
  - Runs, Feedback und Annotationen
  - Eval-Datasets und Regression-Tests
  - LangSmith in der Entwicklungs-Pipeline

## Vektordatenbanken

- **[ChromaDB Einsteiger](frameworks/Einsteiger_ChromaDB.html)** - Vektordatenbank für semantische Suche und RAG-Systeme
  - Embedding-Speicherung und -Retrieval
  - Similarity Search und Filtering
  - Collections und Metadaten
  - Integration mit LangChain

## Projektspezifische Bibliotheken

- **[GenAI_Lib Einsteiger](frameworks/genai_lib/)** - Projektspezifische Python-Bibliothek für Kursanwendungen
  - **utilities.py** - Environment-Checks, Paket-Installation, API-Keys, Prompt-Templates
  - **multimodal_rag.py** - Multimodales RAG-System mit Text- und Bildsuche (Bild ↔ Bild, Bild ↔ Text)

## No-Code / Low-Code

- **[Agent Builder Einsteiger](frameworks/Einsteiger_Agent_Builder.html)** - Agenten ohne Code: Custom GPTs und visueller Workflow-Builder
  - Custom GPT-Erstellung
  - Tool-Integration ohne Programmierung
  - Prompt-Design und Testing
  - Deployment und Sharing

## Modell-Auswahl

- **[Modell-Auswahl Guide](frameworks/Modell_Auswahl_Guide.html)** – Welches Modell für welche Aufgabe?
  - Designregeln: Router/Supervisor → `o3`, Worker → `gpt-5.1`, Demos → `gpt-4o-mini`
  - Entscheidungsbaum und Modul-Mapping (M12, M18/18, M16, M22)
  - Code-Muster für Mixed-Model-Setup
  - Kosten-Orientierung und Vergleichsstandard
