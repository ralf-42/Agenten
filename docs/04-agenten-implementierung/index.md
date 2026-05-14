---
layout: default
title: Agenten-Implementierung
nav_order: 4
has_children: true
description: "Architektur, Prompting, Tool Use, Kontext, RAG, State, Memory und Human-in-the-Loop"
---

# Agenten-Implementierung

Dieser Bereich beschreibt die fachlichen und technischen Bausteine eines Agentensystems unabhängig vom konkreten Framework. Die Dokumente sind in drei Teilbereiche gegliedert: Agentenentwurf, Kontext und Wissensanbindung sowie Ablaufsteuerung und Zustand.

## Grundlagen des Agentenentwurfs

| Frage | Dokument | Bezug |
|---|---|---|
| **Welche** Bauplaene gibt es? | [Agenten-Architekturen]({{ '/04-agenten-implementierung/agent-architekturen.html' | relative_url }}) | ReAct, Router, Supervisor und grundlegende Agentenmuster. |
| **Wie** werden Anweisungen formuliert? | [Prompt Engineering]({{ '/04-agenten-implementierung/prompt-engineering.html' | relative_url }}) | Rollen, Instruktionen, Struktur und Grenzen von Prompts. |
| **Wie** werden Prompts wiederverwendbar? | [Prompt-Templates]({{ '/04-agenten-implementierung/einsteiger-prompts.html' | relative_url }}) | Prompt-Dateien, Variablen, YAML und wiederverwendbare Vorlagen. |
| **Wie** nutzt ein Agent Werkzeuge? | [Tool Use & Function Calling]({{ '/04-agenten-implementierung/tool-use-function-calling.html' | relative_url }}) | Structured Output, Tool-Schemas und deterministische Hilfsoperationen. |

## Kontext und Wissensanbindung

| Frage | Dokument | Bezug |
|---|---|---|
| **Was** gehoert in den Kontext? | [Context Engineering]({{ '/04-agenten-implementierung/context-engineering.html' | relative_url }}) | Auswahl, Struktur und Zeitpunkt relevanter Informationen. |
| **Wie** wird Text vorbereitet? | [Tokenizing & Chunking]({{ '/04-agenten-implementierung/tokenizing-chunking.html' | relative_url }}) | Tokenisierung, Chunk-Groessen, Overlap und Dokumentstruktur. |
| **Wie** wird Bedeutung suchbar? | [Embeddings]({{ '/04-agenten-implementierung/embeddings.html' | relative_url }}) | Vektoren, Aehnlichkeit und semantische Suche. |
| **Wie** entsteht daraus RAG? | [RAG-Konzepte]({{ '/04-agenten-implementierung/rag-konzepte.html' | relative_url }}) | Retrieval, Quellenbindung, Reranking, Grounding und Antwortgenerierung. |

## Ablaufsteuerung und Zustand

| Frage | Dokument | Bezug |
|---|---|---|
| **Wie** werden Ablaeufe kontrolliert? | [State Management]({{ '/04-agenten-implementierung/state-management.html' | relative_url }}) | Zustand, Nachrichten, Routing und mehrstufige Verarbeitung. |
| **Wie** bleiben Laeufe wiederaufnehmbar? | [Checkpointing & Persistenz]({{ '/04-agenten-implementierung/checkpointing-persistenz.html' | relative_url }}) | Speichern, Fortsetzen und Wiederaufnehmen von Agentenlaeufen. |
| **Was** sollte ein Agent erinnern? | [Memory-Systeme]({{ '/04-agenten-implementierung/memory-systeme.html' | relative_url }}) | Kurzzeitgedaechtnis, Langzeitgedaechtnis und nutzerspezifische Persistenz. |
| **Wann** muss ein Mensch eingreifen? | [Human-in-the-Loop]({{ '/04-agenten-implementierung/human-in-the-loop.html' | relative_url }}) | Freigaben, Rueckfragen, Eskalationen und kontrollierte Unterbrechungen. |
