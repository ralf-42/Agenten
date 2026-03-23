---
layout: default
title: Ressourcen
nav_order: 7
has_children: true
description: "Praktische Anleitungen, Werkzeuge und Hilfestellungen"
---

# Ressourcen

Praktische Anleitungen, Werkzeuge und Hilfestellungen für die Arbeit mit KI-Agenten.

> [!NOTE] Bei API- oder Trace-Problemen
> Zuerst [Troubleshooting](https://ralf-42.github.io/Agenten/resources/troubleshooting.html) prüfen. LangSmith-Verbindungsprobleme fast immer durch falschen Endpoint — EU-Workspace benötigt `https://eu.api.smith.langchain.com`.

## Einstieg & Orientierung

- **[Interaktive Visualisierungen](https://ralf-42.github.io/Agenten/resources/interaktive_visualisierungen.html)** – *Wie erkläre ich KI-Konzepte anschaulich?* Web-Demos für KI-Konzepte zum Erkunden und Verstehen
  - Transformer-Architektur, Embeddings und Tokenizer interaktiv
  - Modellsteuerung und Prompt-Effekte live ausprobieren

- **[API-Keys & Provider](https://ralf-42.github.io/Agenten/resources/API_Keys_und_Provider.html)** – *Welcher LLM-Provider ist für mich geeignet?* Übersicht über LLM-Provider, API-Keys und Colab-Integration
  - OpenAI, Anthropic, Google VertexAI, Cohere im Vergleich
  - Zahlungsoptionen und Freemium-Angebote
  - API-Key-Setup in Google Colab

## Standards & Best Practices

- **[Code Standards](https://ralf-42.github.io/Agenten/resources/standards.html)** – *Wie schreibe ich kurskonformen Code?* Coding-Konventionen und Best Practices für den Kurs
  - LangChain 1.0+ Features: `init_chat_model()`, `with_structured_output()`, `@tool`
  - Notebook-Konventionen und Import-Aliasing
  - Anti-Patterns und was zu vermeiden ist

## Hilfe & Fehlersuche

- **[Troubleshooting](https://ralf-42.github.io/Agenten/resources/troubleshooting.html)** – *Was tun, wenn etwas nicht funktioniert?* Lösungen für häufige Probleme
  - LCEL Chains: Input-Schema, Pipe-Operator, Output-Formatierung
  - LangGraph: Recursion-Limit, State-Fehler, Tool-Loops
  - API-Fehler: Token-Limits, Rate-Limiting, Modell-Parameter

- **[Von Colab zur lokalen Umgebung](https://ralf-42.github.io/Agenten/resources/Colab_zu_Lokal.html)** – *Wie führe ich die Notebooks lokal aus?* Anleitung zur Ausführung der Notebooks in Jupyter Lab / VS Code
  - Einmalige Einrichtung: venv, genai_lib, API-Keys
  - Anpassungen in der Setup-Zelle (3 Zeilen)
  - Besonderheiten für M08, M09, M28, M30

## Weiterführende Links

- **[Links](https://ralf-42.github.io/Agenten/resources/links.html)** – *Wo finde ich weiterführende Quellen?* Kuratierte Sammlung externer Ressourcen zu KI, LLMs und Frameworks
  - Offizielle Dokumentationen: LangChain, LangGraph, LangSmith
  - Artikel, Tutorials und Community-Ressourcen
