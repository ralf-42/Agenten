---
layout: default
title: LangChain-Oekosystem
parent: Frameworks
nav_order: 0
description: "Überblick über LangChain, LangGraph und LangSmith im Kurskontext"
has_toc: true
---

# LangChain-Ökosystem
{: .no_toc }

> **Werkzeuglandkarte für LangChain, LangGraph und LangSmith**

---

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Kurzüberblick

Die Frameworks sind hier zunächst eine Werkzeuglandkarte, damit die spätere Progression im Kurs einordbar bleibt.

Für den Kurs reicht als erste Unterscheidung:

- **LangChain** baut Bausteine: Modellaufrufe, Prompts, Tools, Retriever und einfache Agenten.
- **LangGraph** kontrolliert Abläufe: State, Routing, Schleifen, Unterbrechungen und Wiederaufnahme.
- **LangSmith** macht Verhalten prüfbar: Traces, Evaluation, Regressionen und Qualitätsvergleiche.

Für den PMO-Assistenten heißt das: LangChain liefert die Werkzeuge, LangGraph steuert den Arbeitsablauf, LangSmith zeigt, ob Quellen, Tool-Wahl und Eskalation nachvollziehbar funktionieren.

---

## Werkzeuglandkarte

```mermaid
graph TD
    %% Definition der Stile für die einzelnen Boxen
    classDef default fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0c4a6e;
    classDef input fill:#e0e7ff,stroke:#6366f1,stroke-width:2px,color:#1e1b4b;
    classDef target fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#701a75;

    subgraph Development ["<b>Entwicklung & Logik</b>"]
        LC_Core["<b>LangChain</b><br/>Basis & LCEL"]
        LC_Comm["<b>langchain-community</b><br/>Integrationen"]
        LC_Partner["<b>Provider-Pakete</b><br/>(OpenAI, etc.)"]
        LG["<b>LangGraph</b><br/>Agenten-Zyklen"]
    end

    subgraph Observability ["<b>Qualität & Monitoring</b>"]
        LS["<b>LangSmith</b><br/>Tracing & Testing"]
    end

    subgraph Deployment ["<b>Bereitstellung</b>"]
        LGP["<b>LangSmith Deployment</b>"]
    end

    %% Verbindungen
    LC_Core --> LC_Comm
    LC_Core --> LC_Partner
    LC_Core --> LG

    LG --> LS
    LC_Core --> LS

    LC_Core --> LGP
    LG --> LGP

    %% Klassen zuweisen
    class LC_Core input;
    class LGP target;
```

---

## Die Bausteine im Zusammenspiel

| Baustein | Rolle im Ökosystem | Typische Kursfragen |
|---|---|---|
| **LangChain** | Einheitliche Schnittstelle für Modelle, Prompts, Tools, Retriever und einfache Agenten. | Wie rufe ich ein Modell auf? Wie definiere ich Tools? Wie kombiniere ich Schritte mit LCEL? |
| **langchain-community** | Sammlung von Integrationen für Datenquellen, Loader, Vector Stores und externe Dienste. | Wie binde ich ChromaDB, APIs oder Dokumentquellen an? |
| **Provider-Pakete** | Separate Pakete für konkrete Modellanbieter und Dienste, zum Beispiel OpenAI. | Wie wechsle ich Provider, ohne die übrige Logik neu zu schreiben? |
| **LangGraph** | Kontrollschicht für Agenten-Workflows mit State, Routing, Schleifen, Checkpointing und Human-in-the-Loop. | Wann reicht ein einfacher Agent nicht mehr? Wie wird ein Ablauf robust steuerbar? |
| **LangSmith** | Beobachtbarkeit, Debugging, Evaluation und Regressionstests für LLM- und Agenten-Anwendungen. | Warum hat der Agent dieses Tool gewählt? Welche Runs sind besser? Wo entstehen Fehler oder Kosten? |
| **LangSmith Deployment** | Bereitstellung und Betrieb von LangGraph-Anwendungen. | Wie wird aus einem lokalen Graphen eine nutzbare Anwendung? |

---

## Kurslogik

Im Kurs ist LangChain der Einstieg: Erst werden Modellaufrufe, Prompts, strukturierte Ausgaben und Tools verständlich. Danach kommt LangGraph hinzu, sobald ein Agent nicht mehr nur linear reagieren soll, sondern Entscheidungen, Wiederholungen, Memory oder menschliche Freigaben braucht. LangSmith begleitet beide Ebenen, weil Agentenverhalten ohne Traces und Evaluation schwer prüfbar bleibt.

Die praktische Faustregel:

| Aufgabe | Passendes Werkzeug |
|---|---|
| Ein Modell aufrufen, einen Prompt formatieren oder ein Tool definieren | **LangChain** |
| Mehrere Schritte mit State, Routing oder Schleifen steuern | **LangGraph** |
| Nachvollziehen, was passiert ist und ob es besser wird | **LangSmith** |

---

## Weiterführende Dokumente

- [LangChain]({{ '/05-frameworks/langchain.html' | relative_url }}) für Einstieg und Best Practices zu LangChain.
- [LangGraph]({{ '/05-frameworks/langgraph.html' | relative_url }}) für StateGraph, Routing und robuste Graph-Patterns.
- [LangSmith]({{ '/05-frameworks/langsmith.html' | relative_url }}) für Tracing, Evaluation, Datasets und Monitoring.
- [Cheatsheet]({{ '/05-frameworks/langchain-langgraph-cheatsheet.html' | relative_url }}) als kompakte Arbeitsreferenz.

---

**Stand:** August 2026<br>
