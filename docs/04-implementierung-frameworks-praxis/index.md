---
layout: default
title: "Implementierung: Frameworks & Praxis"
nav_order: 4
has_children: true
description: "Technische Umsetzung: Architekturen, Prompting, Tool Use, LangGraph, RAG, Memory und HITL"
---

# Implementierung: Frameworks & Praxis

Dieser Bereich ist der konsolidierte Technikblock. Er fuehrt von den ersten Agentenmustern ueber Tool Use und LangGraph bis zu RAG, Memory, Sessions und Human-in-the-Loop.

| Frage | Dokument | Bezug |
|---|---|---|
| **Welche** Bauplaene gibt es? | [Agenten-Architekturen]({{ '/04-implementierung-frameworks-praxis/agent-architekturen.html' | relative_url }}) | ReAct, Router, Supervisor und grundlegende Agentenmuster. |
| **Wie** werden Anweisungen und Tools angebunden? | [Prompt Engineering]({{ '/04-implementierung-frameworks-praxis/prompt-engineering.html' | relative_url }}) und [Tool Use]({{ '/04-implementierung-frameworks-praxis/tool-use-function-calling.html' | relative_url }}) | Prompting, Structured Output und Function Calling. |
| **Wie** entsteht ein erster Agent? | [Einsteiger LangChain]({{ '/04-implementierung-frameworks-praxis/einsteiger-langchain.html' | relative_url }}) | Praktischer Einstieg in Chains, Tools und Agentenlogik. |
| **Wie** werden Ablaeufe kontrolliert? | [State Management]({{ '/04-implementierung-frameworks-praxis/state-management.html' | relative_url }}) und [Einsteiger LangGraph]({{ '/04-implementierung-frameworks-praxis/einsteiger-langgraph.html' | relative_url }}) | State, Routing, Graphen und kontrollierte Workflows. |
| **Wie** wird Wissen angebunden? | [Context Engineering]({{ '/04-implementierung-frameworks-praxis/context-engineering.html' | relative_url }}) und [RAG-Konzepte]({{ '/04-implementierung-frameworks-praxis/rag-konzepte.html' | relative_url }}) | Kontextstrategie, Grounding, Chunking, Embeddings und ChromaDB. |
| **Wie** bleiben Sitzungen kontrollierbar? | [Checkpointing & Persistenz]({{ '/04-implementierung-frameworks-praxis/checkpointing-persistenz.html' | relative_url }}), [Memory-Systeme]({{ '/04-implementierung-frameworks-praxis/memory-systeme.html' | relative_url }}) und [Human-in-the-Loop]({{ '/04-implementierung-frameworks-praxis/human-in-the-loop.html' | relative_url }}) | Sessions, Langzeitgedaechtnis, Freigaben und Korrekturschleifen. |
