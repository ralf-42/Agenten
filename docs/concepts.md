---
layout: default
title: Konzepte
nav_order: 2
has_children: true
description: "Theoretische Grundlagen und technische Konzepte für KI-Agenten"
---

# Konzepte

Theoretische Grundlagen, technische Konzepte und fundamentale Prinzipien für KI-Agenten und Multi-Agent-Systeme.

## Grundlagen & Architektur

- **[Agent-Architekturen](./concepts/Agent_Architekturen.html)** – Architekturmuster und Design-Prinzipien für KI-Agenten (→ M01)
  - ReAct-Architektur: Denken → Handeln → Beobachten
  - Tool-Calling: LLM wählt und nutzt Werkzeuge
  - Workflow-basiert: Definierte Schritte mit Verzweigungen
  - Multi-Agent: Spezialisierte Agenten arbeiten zusammen

- **[Tool Use & Function Calling](./concepts/Tool_Use_Function_Calling.html)** – Wie KI-Agenten durch Werkzeuge ihre Fähigkeiten erweitern (→ M02)
  - Werkzeuge für aktuelles Wissen, Berechnungen und Dateizugriff
  - Function Calling: Schema-Definition und Parameterübergabe
  - Tool-Auswahl durch das LLM

- **[Prompt Engineering](./concepts/Prompt_Engineering.html)** – Strategien für effektive Prompts in KI-Agenten-Systemen (→ M04)
  - System-Prompts: Rolle und Grenzen definieren
  - Tool-Beschreibungen und Reasoning-Prompts
  - Output-Formatierung für strukturierte Antworten

## Wissensmanagement

- **[RAG-Konzepte](./concepts/RAG_Konzepte.html)** – Retrieval Augmented Generation: Architektur, Strategien und Best Practices (→ M08–M11)
  - Warum RAG? Wissens-Cutoff, Domänenwissen, Halluzination
  - Chunking, Embedding und Vektordatenbanken
  - Retrieval-Strategien: Similarity Search, Reranking

## Workflows & State

- **[State Management](./concepts/State_Management.html)** – Zustandsverwaltung in komplexen Workflows mit LangGraph (→ M12–M15)
  - Warum State Management? Daten über Schritte hinweg erhalten
  - TypedDict-basierter State, Reducer-Funktionen
  - Checkpointing und Session-Persistenz

- **[Multi-Agent-Systeme](./concepts/Multi_Agent_Systeme.html)** – Zusammenarbeit und Koordination mehrerer spezialisierter KI-Agenten (→ M17–M18)
  - Supervisor-Pattern, Hierarchical und Collaborative Patterns
  - Spezialisierung, Fehlertoleranz und Skalierbarkeit
  - Kommunikation und Übergabe zwischen Agenten

## Qualität & Praxis

- **[Evaluation & Testing](./concepts/Evaluation_Testing.html)** – Bewertung und Qualitätssicherung von KI-Agenten (→ M21, M23)
  - Eval-Datasets, Metriken und Regression-Tests
  - LangSmith Evaluation Pipeline
  - Baseline, Drift-Erkennung und Production-Monitoring
