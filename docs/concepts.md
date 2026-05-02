---
layout: default
title: Konzepte
nav_order: 4
has_children: true
description: "Theoretische Grundlagen und technische Konzepte für KI-Agenten"
---

# Konzepte  

Theoretische Grundlagen, technische Konzepte und fundamentale Prinzipien für KI-Agenten und Multi-Agent-Systeme.    

## Wann dieser Bereich?

`concepts/` ist der richtige Einstieg, wenn Begriffe, Muster oder Architekturentscheidungen noch unscharf sind. Der Bereich hilft vor allem dann, wenn zuerst geklärt werden soll, was ein Agent überhaupt ist, wann RAG sinnvoll wird, wie State funktioniert oder an welcher Stelle Human-in-the-Loop und Security relevant werden.

Für einen schnellen Gesamtpfad zuerst [Lesepfade](./lesepfade.html) öffnen.

## Einstieg & Entscheidung

- **[Lohnt es sich überhaupt?](./concepts/einstieg/lohnt-es-sich.html)** – *Lohnt sich ein KI-Vorhaben fachlich, organisatorisch und wirtschaftlich?*
  - Problemklärung vor Toolwahl und Umsetzung
  - Datenlage, Nutzen, Risiken und Realisierbarkeit
  - Go-/No-Go-Fragen für den Projektstart

- **[Welches Werkzeug?](./concepts/einstieg/aufgabenklassen-und-loesungswege.html)** – *Welcher Lösungsweg passt zur Aufgabe?*
  - Entscheidung zwischen Chat, Workflow, RAG, Agent und klassischem Code
  - Zweite Ebene: passende Agentenarchitektur auswählen
  - Kursnahe Beispiele für typische Fehlentscheidungen


## Grundlagen & Architektur

- **[Welche Architektur passt zu diesem Agenten?](./concepts/architektur/agent-architekturen.html)** – *Wann passt ReAct, Workflow, Tool-Calling oder Multi-Agent?* (→ M01)
  - Einsteigerorientierte Auswahl der wichtigsten Muster
  - Konkrete Umsetzungsbeispiele statt reiner Musterkataloge

- **[Wie nutzen Agenten Werkzeuge?](./concepts/architektur/tool-use-function-calling.html)** – *Wie werden Tools sauber definiert und sicher genutzt?* (→ M02)
  - Function Calling, Tool-Schemata und Fehlerbehandlung
  - Praktische Muster für sichere und belastbare Tool-Nutzung

- **[Wie werden gute Prompts für Agenten aufgebaut?](./concepts/architektur/prompt-engineering.html)** – *Wie steuern Prompts Rollen, Regeln und Ausgabeformate?* (→ M04)
  - System-Prompts, Struktur und Guardrails
  - Prompting als Verhaltensvertrag statt Formulierungsgefühl

## Modell- und Kontextgrundlagen

- **[Modellauswahl](./concepts/modell-kontext/modellauswahl.html)** – *Welches Basismodell passt zu welcher Agentenaufgabe?*
  - Qualitäts-, Kosten-, Latenz- und Modalitätskriterien
  - Abgrenzung zum praktischen [Modell-Auswahl Guide](./frameworks/modell-auswahl/modell-auswahl-guide.html)

- **[Context Engineering](./concepts/modell-kontext/context-engineering.html)** – *Welche Informationen braucht ein Agent zur richtigen Zeit?*
  - Kontextauswahl, Kontextstruktur, Memory, RAG und Tool-Ausgaben
  - Systematische Sicht auf viele scheinbare Modellfehler

- **[Fine-Tuning](./concepts/modell-kontext/fine-tuning.html)** – *Wann reichen Prompting, RAG und Tools nicht mehr aus?*
  - Einordnung von Training als spätere Optimierungsoption
  - Abgrenzung zu besserer Kontextstrategie und Modellwahl

## Wissensmanagement

- **[Wie bekommen Agenten Zugriff auf eigenes Wissen?](./concepts/wissensmanagement/rag-konzepte.html)** – *Wann ist RAG sinnvoll und wie funktioniert es sauber?* (→ M08–M11)
  - Grundidee, Chunking, Retrieval und Reranking
  - Praxisnahe Einführung in Wissensanbindung ohne Feintuning

- **[Tokenizing & Chunking](./concepts/wissensmanagement/tokenizing-chunking.html)** – *Wie wird Text für Retrieval und Kontextfenster vorbereitet?*
  - Tokenisierung, Chunk-Größen und Overlap
  - Grundlage für stabile RAG- und Memory-Systeme

- **[Embeddings](./concepts/wissensmanagement/embeddings.html)** – *Wie wird Bedeutung als Vektor durchsuchbar?*
  - Semantische Suche, Ähnlichkeit und Vektorräume
  - Grundlage für RAG, ChromaDB und langfristiges Agenten-Memory

## Workflows & State

- **[Wie behalten Agenten zwischen Schritten den Überblick?](./concepts/workflows-state/state-management.html)** – *Wie wird Zustand in mehrstufigen Abläufen sauber geführt?* (→ M12–M15)
  - State als gemeinsame Arbeitsgrundlage im Workflow
  - Praktische Muster für strukturierte Zustandsführung

- **[Wie bleiben Sitzungen und Zustände erhalten?](./concepts/workflows-state/checkpointing-persistenz.html)** – *Wie funktionieren Checkpointing, Resume und Persistenz?* (→ M16–M17)
  - Sitzungen wiederaufnehmen und Arbeitsstände speichern
  - Beispiele für Interrupt, Resume und dauerhafte Speicherung

- **[Wie erinnern sich Agenten über mehrere Schritte und Sitzungen hinweg?](./concepts/workflows-state/memory-systeme.html)** – *Was gehört in Kurzzeit- und Langzeitgedächtnis?* (→ M16)
  - Unterschied zwischen Kontext, State und Memory
  - Einsteigerfreundliche Einordnung mit praktischen Beispielen

- **[Wann sollten Menschen in den Ablauf eingreifen?](./concepts/workflows-state/human-in-the-loop.html)** – *Wo braucht ein Agent Freigaben, Rückfragen oder Eskalation?* (→ M17)
  - Human-in-the-Loop als Sicherheits- und Qualitätsmechanismus
  - Approval, Eskalation und Vertrauensgrenzen

- **[Wann lohnt sich echte Arbeitsteilung zwischen mehreren Agenten?](./concepts/workflows-state/multi-agent-systeme.html)** – *Wann hilft Multi-Agent wirklich und wann macht es Systeme nur komplizierter?* (→ M21–M22)
  - Supervisor, Handoff, Hierarchie und Parallelisierung
  - Fokus auf sinnvolle Abgrenzung statt Multi-Agent als Selbstzweck

## Qualität & Praxis

- **[Woher zeigt sich, ob ein Agent gut arbeitet?](./concepts/qualitaet-praxis/evaluation-observability.html)** – *Wie unterscheiden sich Evaluation und Observability?* (→ M15, M24)
  - Testsets, Metriken, Fehlersuche und Produktionssicht
  - Qualitätssicherung mit konkreten Praxisbeispielen

- **[Wie werden Agenten gegen Missbrauch und Fehlverhalten abgesichert?](./concepts/qualitaet-praxis/agent-security.html)** – *Welche Sicherheitsprobleme entstehen durch Prompts, Tools und Rechte?* (→ M20)
  - Prompt Injection, Least Privilege und Vertrauensgrenzen
  - Praktische Schutzmaßnahmen für Einsteigerprojekte

## Kommunikation & Protokolle

- **[Wie sprechen Agenten mit Tools, anderen Agenten und Nutzern?](./concepts/protokolle/agenten-kommunikationsprotokolle.html)** – *Welche Rolle spielen MCP, A2A, ACP und AG-UI?*
  - Einordnung der wichtigsten Protokolle und Schnittstellen
  - Fokus auf praktische Unterschiede und Einsatzgrenzen

## Fortgeschritten & Optional

- **[Wann wird aus einem Prompt ein wiederverwendbarer Skill?](./concepts/protokolle/skills.html)** – *Wie werden wiederkehrende Arbeitsmuster stabil gekapselt?* (→ M31, optional)
  - Unterschied zwischen losem Prompt und belastbarem Skill
  - `SKILL.md`, `references/` und `scripts/` als wiederverwendbare Struktur
