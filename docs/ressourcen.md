---
layout: default
title: Ressourcen
nav_order: 7
has_children: true
description: "Praktische Anleitungen, Werkzeuge und Hilfestellungen"
permalink: /ressourcen/
---

# Ressourcen

Praktische Anleitungen, Werkzeuge und Hilfestellungen für die Arbeit mit KI-Agenten.

{: .note }
> **Bei API- oder Trace-Problemen:** Zuerst [Troubleshooting](./ressourcen/troubleshooting.html) prüfen. LangSmith-Verbindungsprobleme fast immer durch falschen Endpoint — EU-Workspace benötigt `https://eu.api.smith.langchain.com`.

## Einstieg & Orientierung

- **[Interaktive Visualisierungen](./ressourcen/interaktive_visualisierungen.html)** – Web-Demos für KI-Konzepte zum Erkunden und Verstehen
  - Transformer-Architektur, Embeddings und Tokenizer interaktiv
  - Modellsteuerung und Prompt-Effekte live ausprobieren

- **[API-Keys & Provider](./ressourcen/API-Keys%20und%20Provider.html)** – Übersicht über LLM-Provider, API-Keys und Colab-Integration
  - OpenAI, Anthropic, Google VertexAI, Cohere im Vergleich
  - Zahlungsoptionen und Freemium-Angebote
  - API-Key-Setup in Google Colab

## Standards & Best Practices

- **[Code Standards](./ressourcen/standards.html)** – Coding-Konventionen und Best Practices für den Kurs
  - LangChain 1.0+ Features: `init_chat_model()`, `with_structured_output()`, `@tool`
  - Notebook-Konventionen und Import-Aliasing
  - Anti-Patterns und was zu vermeiden ist

## Hilfe & Fehlersuche

- **[Troubleshooting](./ressourcen/troubleshooting.html)** – Lösungen für häufige Probleme
  - LCEL Chains: Input-Schema, Pipe-Operator, Output-Formatierung
  - LangGraph: Recursion-Limit, State-Fehler, Tool-Loops
  - API-Fehler: Token-Limits, Rate-Limiting, Modell-Parameter

- **[Von Colab zur lokalen Umgebung](./ressourcen/Colab_zu_Lokal.html)** – Anleitung zur Ausführung der Notebooks in Jupyter Lab / VS Code
  - Einmalige Einrichtung: venv, genai_lib, API-Keys
  - Anpassungen in der Setup-Zelle (3 Zeilen)
  - Besonderheiten für M08, M09, M28, M30

## Weiterführende Links

- **[Links](./ressourcen/links.html)** – Kuratierte Sammlung externer Ressourcen zu KI, LLMs und Frameworks
  - Offizielle Dokumentationen: LangChain, LangGraph, LangSmith
  - Artikel, Tutorials und Community-Ressourcen
