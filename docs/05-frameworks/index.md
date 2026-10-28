---
layout: default
title: Frameworks
nav_order: 10
has_children: true
description: "LangChain, LangGraph und LangSmith als Kernframeworks; DeepAgents, ChromaDB und Kursbibliothek als optionale Ergänzungen"
---

# Frameworks

Diese Orientierungsseite sammelt die konkreten Werkzeug- und Framework-Guides. Die konzeptionellen Grundlagen stehen im Bereich Agenten-Implementierung; hier geht es um die praktische Nutzung einzelner Bibliotheken und Plattformbausteine.

Es gilt eine klare Reihenfolge: **LangChain**, **LangGraph** und **LangSmith** bilden den Kern. **ChromaDB** unterstützt die RAG-Übungen. **DeepAgents** ist eine optionale Vertiefung für vorbereitete Harnesses mit Planning, Dateizugriff und Sub-Agenten. Die Projektbibliothek und weitere Tools sind Hilfen, aber kein eigenes Lernziel.

| Priorität | Frameworks und Tools | Kursrolle |
|---|---|---|
| **Pflicht** | LangChain, LangGraph | Agenten bauen, Tools anbinden, State und Routing verstehen |
| **Empfohlen** | LangSmith, ChromaDB | Tracing, Evaluation und Retrieval im Leitprojekt |
| **Optional** | DeepAgents, Kursbibliothek, weitere Tools | Vorgefertigte Agent-Harnesses, Komfortfunktionen, Transfer und Nachschlagewerk |

## Welche Framework-Seite passt zu meinem Lernziel?

| Lernziel | Maßgebliche Seite | Umfang |
|---|---|---|
| LangChain, LangGraph und LangSmith einordnen | [LangChain-Ökosystem]({{ '/05-frameworks/langchain-oekosystem.html' | relative_url }}) | Zusammenspiel und Aufgaben der Kernkomponenten |
| LangChain erstmals nutzen | [Einsteiger LangChain]({{ '/05-frameworks/einsteiger-langchain.html' | relative_url }}) | Lernweg und erste Chains, Tools und Agenten |
| Verbindliche LangChain-Muster nachschlagen | [LangChain Best Practices]({{ '/05-frameworks/langchain-best-practices.html' | relative_url }}) | Projektstandards und robuste API-Muster |
| LangGraph erstmals nutzen | [Einsteiger LangGraph]({{ '/05-frameworks/einsteiger-langgraph.html' | relative_url }}) | StateGraph-Grundlagen und erste Workflows |
| Einen Graphen strukturiert aufbauen | [Graphen mit LangGraph aufbauen]({{ '/05-frameworks/graphen-aufbauen.html' | relative_url }}) | Kompakter Bauplan für Nodes, Edges und Routing |
| Robuste Graph-Patterns nachschlagen | [LangGraph Best Practices]({{ '/05-frameworks/langgraph-best-practices.html' | relative_url }}) | State, Routing, Checkpointing und Freigaben |
| DeepAgents erstmals nutzen | [Einsteiger DeepAgents]({{ '/05-frameworks/einsteiger-deepagents.html' | relative_url }}) | Optionaler Harness für Planning, Filesystem, Sub-Agenten und Backends |
| Code-Bausteine schnell finden | [Cheatsheet]({{ '/05-frameworks/langchain-langgraph-cheatsheet.html' | relative_url }}) | Kurzreferenz; ersetzt keine Einführung oder Standards |
| LangSmith und weitere Tools einordnen | [LangSmith]({{ '/05-frameworks/langsmith.html' | relative_url }}) und [Weitere Tools]({{ '/05-frameworks/weitere-tools.html' | relative_url }}) | Tracing, Evaluation, ChromaDB und Kursbibliothek |

---

**Stand:** Oktober 2026<br>
