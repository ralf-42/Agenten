---
layout: default
title: Deployment
nav_order: 7
has_children: true
description: Von der Entwicklung zur produktionsreifen Anwendung
---

# Deployment

Vom Prototyp zur produktionsreifen Agent-Anwendung - Praktische Anleitungen für Deployment, Architektur und Provider-Migration.

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

## Wann dieser Bereich?

`deployment/` wird meist erst dann relevant, wenn ein Notebook oder Prototyp bereits funktioniert und in eine robustere Form überführt werden soll. Themen wie Projektstruktur, Konfiguration, APIs, Docker, Provider-Wechsel und Produktreife stehen deshalb erst nach dem konzeptionellen und technischen Einstieg im Vordergrund.

Für einen passenden Gesamtpfad zuerst [Lesepfade](./lesepfade.html) öffnen.

## Übersicht

### Architektur & Ökosystem
- **[Vom Modell zum Produkt](deployment/vom-modell-zum-produkt-langchain-oekosystem.html)** – *Wie wird ein Prototyp produktionsreif?* Das LangChain-Ökosystem verstehen
  - Von Prototypen zu produktionsreifen Systemen
  - LangChain, LangGraph und LangSmith im Überblick
  - Entscheidungshilfe: Wann welches Tool?
  - Alternativen zum LangChain-Ökosystem

### Deployment-Prozess
- **[Aus Entwicklung ins Deployment](deployment/aus-entwicklung-ins-deployment.html)** – *Wie kommt der Agent in die Produktion?* Vom Notebook zur produktionsreifen App
  - Notebook aufräumen und Code extrahieren
  - Projektstruktur und Best Practices
  - Konfiguration externalisieren
  - Testing, API-Endpunkte, Docker
  - Deployment-Optionen im Vergleich

### Stack & Infrastruktur
- **[Minimum Viable Agent Stack](deployment/minimum-viable-agent-stack.html)** – *Welche Schichten braucht ein Produktionsagent?* Die sechs Infrastrukturschichten zwischen LLM und Produktionssystem
  - Übersichtstabelle: Einstiegspunkt und Upgrade-Kriterium pro Schicht
  - Bewertungsrahmen: Zustand, Lock-in-Risiko, Demo-Produktions-Lücke
  - Detailanalyse aller sechs Schichten mit ehrlicher Einschätzung
  - Stack-Empfehlung nach Agententyp (Stateless bis Multi-Agent)

### Migration & Provider-Wechsel
- **[Migration: OpenAI → Mistral](deployment/migration-openai-mistral.html)** – *Wie wechsle ich den LLM-Provider?* Technische Analyse der Provider-Migration
  - Kernaussage: LangChain vereinfacht die Migration strukturell
  - Modell-Rollenmapping für Baseline, Router, Judge, Worker
  - Embeddings und OpenAI-spezifische Module separat bewerten
  - Empfohlene Reihenfolge für eine kontrollierte Migration
