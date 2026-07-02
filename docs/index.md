---
layout: default
title: Start
nav_order: 1
description: "Onboarding, Kursziel und Einstieg in die Dokumentation"
permalink: /
---

# KI-Agenten

> **KI-Agenten. Planen. Handeln. Prüfen.**<br>
> Praxisorientierte Entwicklung von KI-Agenten und Multi-Agent-Systemen mit LangChain, LangGraph und LangSmith

---

> [!TIP] Einstieg in die Dokumentation<br>
> Für den kürzesten Start zuerst [Zuerst lesen](./zuerst-lesen.html) öffnen. Der ausführliche [Lernpfad]({{ '/lernpfad.html' | relative_url }}) hilft danach bei der gezielten Vertiefung.

---

KI-Agenten bezeichnen eine Klasse von Anwendungen, die nicht nur Inhalte erzeugen, sondern Aufgaben eigenständig planen, Tools nutzen und Ergebnisse iterativ verbessern. Im Gegensatz zu klassischen Chat-Interaktionen geht es hier um zielorientiertes Handeln: Systeme, die analysieren, entscheiden und mehrstufige Workflows ausführen.

Im Zentrum dieser Entwicklung stehen **Large Language Models (LLMs)** als reasoning-nahe Kernkomponente sowie Frameworks wie **LangChain** und **LangGraph** für robuste Orchestrierung. Damit werden Agenten nicht als einzelne Prompts gebaut, sondern als zustandsbasierte Systeme mit klaren Schritten, Werkzeugen und Kontrollpunkten.

Der Kurs bündelt diese Konzepte in einem durchgehenden Endprodukt: einem **Meeting- & Research-Briefing-Agent** als kontrolliertes Agentensystem. Die fiktive Projektleiterin Mara Vogt arbeitet mit einem kuratierten Projektkorpus aus Protokollen, Entscheidungen, Risiken und Fachartikeln, stellt Fragen und erwartet belegbare Antworten. Der Agent sucht semantisch, nutzt RAG als Evidence Tool, strukturiert Ergebnisse, nennt Quellen, erkennt Out-of-Corpus-Fragen und pausiert bei kritischen Entscheidungen für menschliche Freigabe.

**Leitprofil:** Vom KI-Feature zum kontrollierten Arbeitssystem — Tools, State, Entscheidungen, Freigabe und Evaluation. Anders als im GenAI-Kurs, wo einzelne KI-Features im Vordergrund stehen, geht es hier um ein durchgängiges System, das drei Dinge leisten muss: **Planen** (Routing, State, Tool-Auswahl, Supervisor), **Handeln** (Tools, RAG als Evidence Tool, Workflows) und **Prüfen** (Human-in-the-Loop, Security, Evaluation).

Der Kurs Agenten folgt drei Arbeitsbewegungen, die sich durch alle Module ziehen:

## Planen

Agentische Systeme brauchen explizite Planung: Welche Aufgabe liegt vor, welche Informationen fehlen, welches Tool passt, welcher Zustand muss erhalten bleiben und wann muss ein Mensch einbezogen werden? Dazu gehören ReAct/TAO-Denkmuster, Tool Use & Function Calling, State Management, Routing-Logik, Supervisor-Patterns und klare Grenzen für LLM-basierte Entscheidungen.

## Handeln

Ein Agent wird erst greifbar, wenn Planung in kontrollierte Handlung übersetzt wird: Prompts steuern Rollen und Grenzen, Tools führen konkrete Arbeitsschritte aus, RAG liefert Evidenz, Structured Output macht Ergebnisse maschinenlesbar und LangGraph verbindet alles zu nachvollziehbaren Workflows. Mit **LangChain**, **LangGraph**, **LangSmith** und **ChromaDB** entstehen produktionsnahe Agenten für Recherche, Support, Automatisierung und Wissensarbeit.

## Prüfen

Agenten müssen prüfbar bleiben. Quellen, Tool-Aufrufe, Zustandswechsel, Freigaben und Qualitätsmetriken gehören deshalb zum Systementwurf. Evaluation, Monitoring, Security, Human-in-the-Loop und Governance sorgen dafür, dass aus Prototypen verlässliche Produkte werden und kritische Entscheidungen nicht unsichtbar im Modell verschwinden.

Die Entwicklung von Agentenprodukten erfordert mehr als einzelne Notebook-Demos: saubere Architektur, reproduzierbare Tests und kontinuierliche Verbesserung mit Tracing und Evaluation. Der Weg vom Experiment zum stabilen Agentensystem ist kürzer, wenn Struktur von Anfang an mitgedacht wird — Checkpointing, Evaluation und Monitoring sind keine Nacharbeiten, sondern Bestandteile des Entwurfs.

Agenten scheitern häufiger an schlechten Prompts, unklarer Rollentrennung oder fehlendem Monitoring als an der Technologie selbst. Das ist die eigentliche Herausforderung — und der Kern dieses Kurses. 


> [!Note] Hinweis<br>
>  Bei der Erstellung dieser Unterlagen kamen KI-Werkzeuge zum Einsatz. Die Inhalte wurden anschließend fachlich geprüft und überarbeitet.

---

**Version:** 1.3<br>
**Stand:** Juli 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
