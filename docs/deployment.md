---
layout: default
title: Deployment
nav_order: 5
has_children: true
description: "Von der Entwicklung zur produktionsreifen Anwendung"
---

# Deployment

Vom Prototyp zur produktionsreifen Agent-Anwendung - Praktische Anleitungen für Deployment, Architektur und Provider-Migration.

## Übersicht

### Architektur & Ökosystem
- **[Vom Modell zum Produkt](https://ralf-42.github.io/Agenten/deployment/Vom_Modell_zum_Produkt_LangChain_Oekosystem.html)** - Das LangChain-Ökosystem verstehen
  - Von Prototypen zu produktionsreifen Systemen
  - LangChain, LangGraph und LangSmith im Überblick
  - Entscheidungshilfe: Wann welches Tool?
  - Alternativen zum LangChain-Ökosystem

### Deployment-Prozess
- **[Aus Entwicklung ins Deployment](https://ralf-42.github.io/Agenten/deployment/aus-entwicklung-ins-deployment.html)** - Vom Notebook zur produktionsreifen App
  - Notebook aufräumen und Code extrahieren
  - Projektstruktur und Best Practices
  - Konfiguration externalisieren
  - Testing, API-Endpunkte, Docker
  - Deployment-Optionen im Vergleich

### Migration & Provider-Wechsel
- **[Migration: OpenAI → Mistral](https://ralf-42.github.io/Agenten/deployment/Migration_OpenAI_Mistral.html)** - Technische Analyse der Provider-Migration
  - Kernaussage: LangChain vereinfacht die Migration strukturell
  - Modell-Rollenmapping für Baseline, Router, Judge, Worker
  - Embeddings und OpenAI-spezifische Module separat bewerten
  - Empfohlene Reihenfolge für eine kontrollierte Migration
