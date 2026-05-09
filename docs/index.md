---
layout: default
title: Start
nav_order: 1
description: KI-Agenten und Multi-Agent-Systeme mit LangChain & LangGraph
permalink: /
---

# KI-Agenten

> **Agenten. Verstehen. Anwenden. Gestalten.**<br>
> Praxisorientierte Entwicklung von KI-Agenten und Multi-Agent-Systemen mit LangChain, LangGraph und LangSmith

---

> [!TIP] Einstieg in die Dokumentation<br>
> Für den kürzesten Start zuerst [Zuerst lesen](./zuerst-lesen.html) öffnen. Die ausführlichen [Lesepfade](./lesepfade.html) helfen danach bei der gezielten Vertiefung.

---

KI-Agenten bezeichnen eine Klasse von Anwendungen, die nicht nur Inhalte erzeugen, sondern Aufgaben eigenständig planen, Tools nutzen und Ergebnisse iterativ verbessern. Im Gegensatz zu klassischen Chat-Interaktionen geht es hier um zielorientiertes Handeln: Systeme, die analysieren, entscheiden und mehrstufige Workflows ausführen.

Im Zentrum dieser Entwicklung stehen **Large Language Models (LLMs)** als reasoning-nahe Kernkomponente sowie Frameworks wie **LangChain** und **LangGraph** für robuste Orchestrierung. Damit werden Agenten nicht als einzelne Prompts gebaut, sondern als zustandsbasierte Systeme mit klaren Schritten, Werkzeugen und Kontrollpunkten.

Der Kurs bündelt diese Konzepte in einem durchgehenden Endprodukt: einem **Research Assistant für Fachartikel**. Die fiktive Nutzerin Pia arbeitet mit einem kuratierten PDF-Korpus, stellt fachliche Fragen und erwartet belegbare Antworten. Der Assistant sucht semantisch, nutzt RAG, strukturiert Ergebnisse, nennt Quellen, erkennt Out-of-Corpus-Fragen und pausiert bei kritischen Entscheidungen für menschliche Freigabe.

Dieses Endprodukt ist der rote Faden vom ersten Tool bis zum Capstone:

- M02-M05 legen Tools, Prompts und strukturierte Antworten an.
- M11-M15 bauen semantische Suche, ChromaDB, RAG und Evaluation auf.
- M17 ergänzt Human-in-the-Loop als Kontrollpunkt.
- Die späteren Module erweitern den Assistant um Memory, Supervisor-Patterns, Skills, UI und Deployment.

Der Kurs Agenten lässt sich aus drei **Perspektiven** betrachten:

## Verstehen

Grundlegend ist das Verständnis dafür, wie agentische Systeme funktionieren. Dazu gehören ReAct/TAO-Denkmuster, Tool Use & Function Calling, State Management, Routing-Logik sowie Grenzen und Risiken von LLM-basierten Entscheidungen. Auch Robustheit, Transparenz und verantwortungsvoller Einsatz gehören zu diesem Verständnis.

## Anwenden

Die praktische Umsetzung von Agenten erfordert die Fähigkeit, Modelle gezielt zu steuern und Workflows modular aufzubauen - etwa durch **Prompt Engineering**, **RAG**, **Structured Output** und **Tool-Integration**. Mit **LangChain**, **LangGraph**, **LangSmith** und **ChromaDB** entstehen produktionsnahe Agenten für Recherche, Support, Automatisierung und Wissensarbeit.

## Gestalten

Mit zunehmender Verfügbarkeit von APIs, Open-Source-Modellen und Orchestrierungs-Frameworks entsteht ein neues Feld der Gestaltung: Single-Agent-Lösungen, Supervisor-Patterns und komplette Multi-Agent-Systeme. Gleichzeitig wachsen Anforderungen an Evaluation, Monitoring, Security und Governance, damit aus Prototypen verlässliche Produkte werden.

Die Entwicklung von Agentenprodukten erfordert mehr als einzelne Notebook-Demos: saubere Architektur, reproduzierbare Tests und kontinuierliche Verbesserung mit Tracing und Evaluation. Der Weg vom Experiment zum stabilen Agentensystem ist kürzer, wenn Struktur von Anfang an mitgedacht wird — Checkpointing, Evaluation und Monitoring sind keine Nacharbeiten, sondern Bestandteile des Entwurfs.

Agenten scheitern häufiger an schlechten Prompts, unklarer Rollentrennung oder fehlendem Monitoring als an der Technologie selbst. Das ist die eigentliche Herausforderung — und der Kern dieses Kurses.

---

**Version:** 1.2<br>
**Stand:** Mai 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
