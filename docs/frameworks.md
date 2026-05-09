---
layout: default
title: Frameworks
nav_order: 5
has_children: true
description: "Werkzeugkarte für den Kurs: Einsteiger-Guides, Modell-Auswahl und Best Practices für LangChain, LangGraph, DeepAgents, LangSmith und weitere Werkzeuge"
---

# Frameworks

**Version:** 1.0<br>
**Stand:** Mai 2026<br>
**Kurs:** KI-Agenten

Diese Seite ist eine **thematische Werkzeugkarte** — sie ordnet die Werkzeuge nach Verwendungszweck. Die Seitennavigation folgt einer anderen Logik: sie gliedert nach Lernphase (Einsteiger-Guides → Modell-Auswahl → Best Practices). Beides zusammen ergibt das vollständige Bild.

Für eine empfohlene Lesereihenfolge über mehrere Bereiche hinweg zuerst [Lesepfade](./lesepfade.html) öffnen.

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

## LLM-Orchestrierung & Workflows

Die drei Schichten bauen aufeinander auf und haben klar getrennte Zuständigkeiten:

- **LangChain** ist die Basisschicht: Modell-Init, Prompts, Tools, Chains und einfache Agenten.
- **LangGraph** ergänzt LangChain um expliziten State, bedingtes Routing und Checkpointing — nötig, sobald Abläufe mehrere Schritte, Verzweigungen oder Sitzungsgedächtnis brauchen.
- **DeepAgents** ist ein Harness über LangGraph: schneller Einstieg in Planning, Filesystem-Zugriff und Sub-Agenten-Delegation ohne manuellen Graph-Aufbau. Sinnvoll, wenn Struktur wichtiger ist als Transparenz über einzelne Knoten.

**Guides:**

- **[LangChain Einsteiger](./frameworks/einsteiger/einsteiger-langchain.html)** – *Wie orchestriere ich LLMs mit LangChain?* Model Integration, Tool Use, Chains, LCEL und RAG-Systeme.
- **[LangGraph Einsteiger](./frameworks/einsteiger/einsteiger-langgraph.html)** – *Wie baue ich Multi-Agent-Systeme mit LangGraph?* StateGraph, Conditional Routing, Checkpointing und Human-in-the-Loop.
- **[DeepAgents Einsteiger](./frameworks/einsteiger/einsteiger-deepagents.html)** – *Wie nutze ich den Harness-Ansatz?* `create_deep_agent()`, Planning, Filesystem, Delegation und Grenzen.

## Monitoring & Debugging

LangSmith ist das zentrale Observability-Werkzeug: Tracing, Eval-Datasets und Regression-Tests für Chains und Agenten.

- **[LangSmith Einsteiger](./frameworks/einsteiger/einsteiger-langsmith.html)** – *Wie debugge und überwache ich Agenten?* Traces, Runs, Feedback, Annotationen und Eval-Pipeline.

## Vektordatenbanken

- **[ChromaDB Einsteiger](./frameworks/einsteiger/einsteiger-chromadb.html)** – *Wie speichere und finde ich Embeddings?* Embedding-Speicherung, Similarity Search, Collections und LangChain-Integration.

## Projektspezifische Bibliotheken & Prompts

- **[GenAI_Lib Einsteiger](./frameworks/einsteiger/einsteiger-genai-lib.html)** – *Welche Utilities stellt das Projekt bereit?* `utilities.py` und `model_config.py` mit rollenbasierten Modell-Konstanten.
- **[Prompt-Templates Einsteiger](./frameworks/einsteiger/einsteiger-prompts.html)** – *Wie erstelle ich eigene Prompt-Dateien?* YAML, XML-Tags, die drei Prompt-Typen und `load_prompt()`.

## No-Code / Low-Code

- **[Agent Builder Einsteiger](./frameworks/einsteiger/einsteiger-agent-builder.html)** – *Wie erstelle ich Agenten ohne Code?* Custom GPTs, Tool-Integration und Deployment ohne Programmierung.

## Modell-Auswahl

Konkrete Provider, Modelle und Kurs-Defaults — konzeptionelle Kriterien und Trade-offs stehen unter [Konzepte → Modellauswahl](./concepts/modell-kontext/modellauswahl.html).

- **[Modell-Auswahl Guide](./frameworks/modell-auswahl/modell-auswahl-guide.html)** – *Welches Modell für welche Aufgabe?* Designregeln: Router/Supervisor → `o3`, Worker → `gpt-5.4-mini`, Demos → `gpt-4o-mini`.
- **[Provider-Modell-Mapping](./frameworks/modell-auswahl/provider-modell-mapping.html)** – *Wie bilde ich Modellrollen auf verschiedene Provider ab?* Rollenbasiertes Mapping für OpenAI, Mistral und Anthropic.

## Best Practices

Empfohlene Patterns und Anti-Patterns für die zentralen Frameworks.

- **[LangChain Best Practices](./frameworks/best-practices/langchain-best-practices.html)** – *Was sind die 7 MUST-HAVE Features?* `init_chat_model()`, `with_structured_output()`, `@tool`, `create_agent()`, LCEL `|` Chains, Middleware, Standard Content Blocks.
- **[LangGraph Best Practices](./frameworks/best-practices/langgraph-best-practices.html)** – *Wann LangGraph statt `create_agent()`?* StateGraph, Nodes & Edges, Conditional Routing, Checkpointing und Human-in-the-Loop.
- **[LangSmith Best Practices](./frameworks/best-practices/langsmith-best-practices.html)** – *Wie observiere ich Agenten richtig?* `LANGSMITH_*` Umgebungsvariablen, Tracing, Evaluation und Monitoring.
- **[Agent Evaluation & Observability Best Practices](./frameworks/best-practices/agent-evaluation-observability-best-practices.html)** – *Wie werden Agenten mit Baselines, Traces und Regressionen belastbar?* Mindeststandard für Evaluation, Observability und Harness-Logik.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Einsteiger-Guides](frameworks/einsteiger-guides.html) | Wo starte ich als Einsteiger mit Frameworks? |
| [Best Practices](frameworks/best-practices.html) | Welche Produktionsstandards gelten für Frameworks? |
