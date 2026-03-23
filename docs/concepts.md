---
layout: default
title: Konzepte
nav_order: 2
has_children: true
description: "Theoretische Grundlagen und technische Konzepte für KI-Agenten"
---

# Konzepte  

Theoretische Grundlagen, technische Konzepte und fundamentale Prinzipien für KI-Agenten und Multi-Agent-Systeme.    

## Einstieg & Entscheidung

- **[Lohnt es sich überhaupt?](https://ralf-42.github.io/Agenten/concepts/Lohnt_es_sich.html)** – Machbarkeit, Nutzen und Risiken vor dem Projektstart bewerten
  - Problemklärung: Ist das Problem klar und messbar?
  - Datengrundlage: Sind die richtigen Daten vorhanden und nutzbar?
  - Nutzeneinschätzung: Lohnt sich KI gegenüber dem Status quo?
  - Risikoeinschätzung: Technisch, organisatorisch, regulatorisch
  - Go / No-Go Checkliste

- **[Welches Werkzeug?](https://ralf-42.github.io/Agenten/concepts/Aufgabenklassen_und_Loesungswege.html)** – Zweistufige Entscheidungshilfe: wann Agenten, welche Architektur?
  - Ebene 1: Chat / Workflow / RAG / Agenten / Python — was passt wann?
  - Ebene 2: ReAct / Tool-Calling / LangGraph Workflow / Multi-Agent — wie entscheiden?
  - Vollständiger Entscheidungsbaum (beide Ebenen kombiniert)
  - Checkliste vor dem Agentenbau

## Grundlagen & Architektur

- **[Agent-Architekturen](https://ralf-42.github.io/Agenten/concepts/Agent_Architekturen.html)** – *Wie ist ein Agent aufgebaut?* Architekturmuster und Design-Prinzipien für KI-Agenten (→ M01)
  - ReAct-Architektur: Denken → Handeln → Beobachten
  - Tool-Calling: LLM wählt und nutzt Werkzeuge
  - Workflow-basiert: Definierte Schritte mit Verzweigungen
  - Multi-Agent: Spezialisierte Agenten arbeiten zusammen

- **[Tool Use & Function Calling](https://ralf-42.github.io/Agenten/concepts/Tool_Use_Function_Calling.html)** – *Wie nutzt ein Agent Werkzeuge?* Erweiterung der Fähigkeiten durch externe Tools (→ M02)
  - Werkzeuge für aktuelles Wissen, Berechnungen und Dateizugriff
  - Function Calling: Schema-Definition und Parameterübergabe
  - Tool-Auswahl durch das LLM

- **[Prompt Engineering](https://ralf-42.github.io/Agenten/concepts/Prompt_Engineering.html)** – *Wie wird ein Agent gesteuert?* Strategien für effektive Prompts in Agenten-Systemen (→ M04)
  - System-Prompts: Rolle und Grenzen definieren
  - Tool-Beschreibungen und Reasoning-Prompts
  - Output-Formatierung für strukturierte Antworten

## Wissensmanagement

- **[RAG-Konzepte](https://ralf-42.github.io/Agenten/concepts/RAG_Konzepte.html)** – *Wie kommt Wissen in den Agenten?* Retrieval Augmented Generation: Architektur, Strategien und Best Practices (→ M08–M11)
  - Warum RAG? Wissens-Cutoff, Domänenwissen, Halluzination
  - Chunking, Embedding und Vektordatenbanken
  - Retrieval-Strategien: Similarity Search, Reranking

## Workflows & State

- **[State Management](https://ralf-42.github.io/Agenten/concepts/State_Management.html)** – *Wie merkt sich ein Agent seinen Zustand?* Zustandsverwaltung in komplexen Workflows mit LangGraph (→ M12–M15)
  - Warum State Management? Daten über Schritte hinweg erhalten
  - TypedDict-basierter State, Reducer-Funktionen
  - Nodes geben nur Änderungen zurück, nicht den gesamten State

- **[Checkpointing & Persistenz](https://ralf-42.github.io/Agenten/concepts/Checkpointing_Persistenz.html)** – *Wie werden Sitzungen gespeichert?* Zustandsspeicherung und Session-Persistenz in LangGraph (→ M16–M17)
  - MemorySaver, SqliteSaver, PostgresSaver – Wahl des richtigen Checkpointers
  - Thread-IDs für Multi-User-Konversationen
  - Interrupt & Resume für Human-in-the-Loop
  - Time Travel: Zu früherem State zurückspringen

- **[Memory-Systeme](https://ralf-42.github.io/Agenten/concepts/Memory_Systeme.html)** – *Wie erinnert sich ein Agent?* Kurz- und Langzeitgedächtnis für persistente KI-Agenten (→ M16)
  - Kurzzeit: Conversation Buffer, Sliding Window, Summarization
  - Langzeit: Semantisches Memory (Vektordatenbank), Entity Memory
  - Per-User-Memory für Multi-Session-Anwendungen

- **[Human-in-the-Loop](https://ralf-42.github.io/Agenten/concepts/Human_in_the_Loop.html)** – *Wann greift der Mensch ein?* Einbindung menschlicher Kontrolle in Agenten-Systeme (→ M17)
  - Autonomie-Spektrum: von assistiert bis vollständig autonom
  - Approval-Pattern vs. Eskalations-Pattern
  - Entscheidungskritikalität und Vertrauensgrenzen

- **[Multi-Agent-Systeme](https://ralf-42.github.io/Agenten/concepts/Multi_Agent_Systeme.html)** – *Wie arbeiten mehrere Agenten zusammen?* Zusammenarbeit und Koordination spezialisierter KI-Agenten (→ M21–M22)
  - Supervisor-Pattern, Hierarchical, Collaborative Patterns
  - Paralleles Pattern: Fan-out / Fan-in mit Send und Map-Reduce
  - Spezialisierung, Fehlertoleranz und Skalierbarkeit
  - Kommunikation und Übergabe zwischen Agenten

## Qualität & Praxis

- **[Evaluation & Testing](https://ralf-42.github.io/Agenten/concepts/Evaluation_Testing.html)** – *Wie gut ist das System wirklich?* Bewertung und Qualitätssicherung von KI-Agenten (→ M15, M24)
  - Eval-Datasets, Metriken und Regression-Tests
  - LangSmith Evaluation Pipeline
  - Baseline, Drift-Erkennung und Production-Monitoring

- **[Agent Security](https://ralf-42.github.io/Agenten/concepts/Agent_Security.html)** – *Wie wird ein Agent abgesichert?* Sicherheitsrisiken und Schutzprinzipien für KI-Agenten (→ M20)
  - Prompt Injection, Tool Missbrauch, Daten-Exfiltration
  - Principle of Least Privilege, Tool Whitelisting, PII-Redaktion
  - Vertrauensgrenzen und sichere Entwicklungspraxis

## Kommunikation & Protokolle

- **[Agenten-Kommunikationsprotokolle](https://ralf-42.github.io/Agenten/concepts/Agenten_Kommunikationsprotokolle.html)** – *Wie sprechen Agenten miteinander?* Kommunikationsstandards zwischen Agenten und Tools (→ MCP, A2A, AG-UI)
  - MCP: Universelle Tool-Integration (Anthropic, 2024)
  - A2A / ACP: Agent-zu-Agent-Kommunikation (Google / Linux Foundation, 2025)
  - AG-UI: Echtzeit-Streaming zwischen Agent und Frontend
  - Agent Contracts: Ressourcensteuerung und Kostenkontrolle

## Fortgeschritten & Optional

- **[Skills](https://ralf-42.github.io/Agenten/concepts/Skills.html)** – *Wie werden Agenten zuverlässig gesteuert?* Wiederverwendbare Arbeitsrezepte für verlässliche Agenten (→ M31, optional)
  - Unterschied zwischen Prompt und Skill
  - `SKILL.md`, `references/` und `scripts/` als Strukturmuster
  - Guardrails, Progressive Disclosure und Auditierbarkeit
