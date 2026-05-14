---
layout: default
title: Agenten-Implementierung
nav_order: 4
has_children: true
description: "Architektur, Prompting, Tool Use, State, RAG, Memory und Human-in-the-Loop"
---

# Agenten-Implementierung

Dieser Bereich beschreibt die fachlichen und technischen Bausteine eines Agentensystems unabhängig vom konkreten Framework. Im Mittelpunkt stehen Architekturentscheidungen, Anweisungen, Tools, Zustand, Kontext, Wissensanbindung, Memory und menschliche Kontrolle.

| Frage | Dokument | Bezug |
|---|---|---|
| **Welche** Bauplaene gibt es? | [Agenten-Architekturen]({{ '/04-agenten-implementierung/agent-architekturen.html' | relative_url }}) | ReAct, Router, Supervisor und grundlegende Agentenmuster. |
| **Wie** werden Anweisungen formuliert? | [Prompt Engineering]({{ '/04-agenten-implementierung/prompt-engineering.html' | relative_url }}) | Rollen, Instruktionen, Struktur und Grenzen von Prompts. |
| **Wie** nutzt ein Agent Werkzeuge? | [Tool Use & Function Calling]({{ '/04-agenten-implementierung/tool-use-function-calling.html' | relative_url }}) | Structured Output, Tool-Schemas und deterministische Hilfsoperationen. |
| **Wie** werden Ablaeufe kontrolliert? | [State Management]({{ '/04-agenten-implementierung/state-management.html' | relative_url }}) | Zustand, Nachrichten, Routing und mehrstufige Verarbeitung. |
| **Wie** wird Wissen angebunden? | [Context Engineering]({{ '/04-agenten-implementierung/context-engineering.html' | relative_url }}) und [RAG-Konzepte]({{ '/04-agenten-implementierung/rag-konzepte.html' | relative_url }}) | Kontextstrategie, Grounding, Chunking und Embeddings. |
| **Wie** bleiben Sitzungen kontrollierbar? | [Checkpointing & Persistenz]({{ '/04-agenten-implementierung/checkpointing-persistenz.html' | relative_url }}), [Memory-Systeme]({{ '/04-agenten-implementierung/memory-systeme.html' | relative_url }}) und [Human-in-the-Loop]({{ '/04-agenten-implementierung/human-in-the-loop.html' | relative_url }}) | Sessions, Langzeitgedaechtnis, Freigaben und Korrekturschleifen. |
