---
layout: default
title: "Frameworks"
nav_order: 4
has_children: true
description: "LangChain, LangGraph und LangSmith als Kernframeworks; DeepAgents, ChromaDB und Kursbibliothek als optionale Ergänzungen"
has_toc: false
redirect_from: ["/05-frameworks/"]
---

# Frameworks
{: .no_toc }

Diese Orientierungsseite sammelt die konkreten Werkzeug- und Framework-Guides. Die konzeptionellen Grundlagen stehen im Bereich [Entwicklung]({{ '/03-entwicklung/' | relative_url }}); hier geht es um die praktische Nutzung einzelner Bibliotheken und Plattformbausteine.

Es gilt eine klare Reihenfolge: **LangChain**, **LangGraph** und **LangSmith** bilden den Kern. **ChromaDB** unterstützt die RAG-Übungen. **DeepAgents** ist eine optionale Vertiefung für vorbereitete Harnesses mit Planning, Dateizugriff und Sub-Agenten. Die Projektbibliothek und weitere Tools sind Hilfen, aber kein eigenes Lernziel.

- **Pflicht**: LangChain, LangGraph – Agenten bauen, Tools anbinden, State und Routing verstehen.
- **Empfohlen**: LangSmith, ChromaDB – Tracing, Evaluation und Retrieval im Leitprojekt.
- **Optional**: DeepAgents, Kursbibliothek, weitere Tools – Vorgefertigte Agent-Harnesses, Komfortfunktionen, Transfer und Nachschlagewerk.

## Themen

| Thema | Inhalt |
|---|---|
| [LangChain-Ökosystem]({{ '/04-frameworks/langchain-oekosystem.html' | relative_url }}) | *LangChain, LangGraph und LangSmith einordnen:* Zusammenspiel und Aufgaben der Kernkomponenten |
| [Einsteiger LangChain]({{ '/04-frameworks/langchain/einsteiger-langchain.html' | relative_url }}) | *LangChain erstmals nutzen:* Lernweg und erste Chains, Tools und Agenten |
| [LangChain Best Practices]({{ '/04-frameworks/langchain/langchain-best-practices.html' | relative_url }}) | *Verbindliche LangChain-Muster nachschlagen:* Projektstandards und robuste API-Muster |
| [Einsteiger LangGraph]({{ '/04-frameworks/langgraph/einsteiger-langgraph.html' | relative_url }}) | *LangGraph erstmals nutzen:* StateGraph-Grundlagen und erste Workflows |
| [Graphen mit LangGraph aufbauen]({{ '/04-frameworks/langgraph/graphen-aufbauen.html' | relative_url }}) | *Einen Graphen strukturiert aufbauen:* Kompakter Bauplan für Nodes, Edges und Routing |
| [LangGraph Best Practices]({{ '/04-frameworks/langgraph/langgraph-best-practices.html' | relative_url }}) | *Robuste Graph-Patterns nachschlagen:* State, Routing, Checkpointing und Freigaben |
| [Einsteiger DeepAgents]({{ '/04-frameworks/einsteiger-deepagents.html' | relative_url }}) | *DeepAgents erstmals nutzen:* Optionaler Harness für Planning, Filesystem, Sub-Agenten und Backends |
| [Cheatsheet]({{ '/04-frameworks/langchain-langgraph-cheatsheet.html' | relative_url }}) | *Code-Bausteine schnell finden:* Kurzreferenz; ersetzt keine Einführung oder Standards |
| [LangSmith]({{ '/04-frameworks/langsmith/' | relative_url }}) und [Weitere Tools]({{ '/04-frameworks/weitere-tools.html' | relative_url }}) | *LangSmith und weitere Tools einordnen:* Tracing, Evaluation, ChromaDB und Kursbibliothek |

## Weiterführend

Die konzeptionellen Bausteine stehen unter [Entwicklung]({{ '/03-entwicklung/' | relative_url }}). Die Übersichten [LangChain]({{ '/04-frameworks/langchain/' | relative_url }}) und [LangGraph]({{ '/04-frameworks/langgraph/' | relative_url }}) bündeln die jeweiligen Einführungen und Best Practices.
