---
layout: default
title: Agenten-Dimensionen
parent: Konzepte
nav_order: 14
description: "Drei Ebenen eines KI-Agenten: Eigenschaften, Funktionen und Infrastruktur"
has_toc: false
---

# Agenten-Dimensionen
{: .no_toc }

> **Drei Ebenen, die einen KI-Agenten vollständig beschreiben**       

---

Ein KI-Agent lässt sich entlang von drei Ebenen strukturieren: seinen grundlegenden **Eigenschaften**, den daraus abgeleiteten **Funktionen** und der **Infrastruktur**, die den stabilen Betrieb ermöglicht. Diese Ebenen bauen aufeinander auf — ohne ein solides Fundament können Funktionen nicht zuverlässig ausgeführt werden, und ohne Funktionen bleiben Eigenschaften abstrakt.

```mermaid
%%{init: {'theme': 'base'}}%%
graph TD
    classDef property fill:#ececff,stroke:#9370db,stroke-width:2px,color:#333
    classDef function fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#333
    classDef infra fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#333
    classDef groupStyle fill:#f9f9f9,stroke:#ccc

    subgraph E1["🧠 1. Eigenschaften — Das Wesen"]
        direction LR
        A(["<b>Autonomie</b><br/>Trifft eigenständig Entscheidungen"])
        R(["<b>Reaktionsfähigkeit</b><br/>Reagiert auf Änderungen"])
        P(["<b>Proaktivität</b><br/>Verfolgt Ziele über Zeit"])
        I(["<b>Interaktionsfähigkeit</b><br/>Kommuniziert mit Menschen und Systemen"])
    end

    subgraph E2["🛠️ 2. Funktionen — Das Können"]
        direction LR
        PL["<b>Planning</b><br/>Zerlegt Ziele in Schritte"]
        ME["<b>Memory</b><br/>Hält Zustand und Verlauf"]
        TU["<b>Tool Use</b><br/>Nutzt externe Werkzeuge und APIs"]
        MO["<b>Monitoring</b><br/>Beobachtet Ergebnisse und Feedback"]
        DE["<b>Delegation</b><br/>Orchestriert Sub-Agenten"]
    end

    subgraph E3["🏗️ 3. Infrastruktur — Das Fundament"]
        direction LR
        CM["<b>Context Management</b><br/>Filtert und verdichtet Kontext"]
        GR["<b>Guardrails</b><br/>Prüft und begrenzt Aktionen"]
        EA["<b>Environment Access</b><br/>Dateien, APIs, externe Systeme"]
        OB["<b>Observability</b><br/>Logs, Traces, Debugging"]
    end

    E1 ==> E2
    E2 ==> E3

    A -.-> PL
    A -.-> TU
    P -.-> PL
    P -.-> ME
    P -.-> DE
    R -.-> MO
    I -.-> TU

    PL --> CM
    ME --> CM
    TU --> EA
    TU --> GR
    MO --> OB
    DE --> OB

    class A,R,P,I property
    class PL,ME,TU,MO,DE function
    class CM,GR,EA,OB infra
    class E1,E2,E3 groupStyle
```


---

## Ebene 1 — Eigenschaften

Die Eigenschaften beschreiben das **Wesen** eines Agenten: was ihn von einem einfachen Chatbot oder einer klassischen Anwendung unterscheidet.

| Eigenschaft | Bedeutung |
|-------------|-----------|
| **Autonomie** | Der Agent trifft Entscheidungen ohne explizite Schritt-für-Schritt-Anweisung |
| **Reaktionsfähigkeit** | Er erkennt Veränderungen in seiner Umgebung und passt sein Verhalten an |
| **Proaktivität** | Er verfolgt Ziele aktiv über mehrere Schritte hinweg |
| **Interaktionsfähigkeit** | Er kommuniziert mit Menschen, anderen Agenten und externen Systemen |

## Ebene 2 — Funktionen

Die Funktionen beschreiben das **Können**: konkrete Fähigkeiten, die ein Agent zur Aufgabenerfüllung benötigt.

| Funktion | Bedeutung |
|----------|-----------|
| **Planning** | Aufgaben in Teilschritte zerlegen und priorisieren |
| **Memory** | Zustand, Verlauf und Kontext über Zeit speichern |
| **Tool Use** | Externe Werkzeuge, APIs und Dienste aufrufen |
| **Monitoring** | Eigene Ergebnisse beobachten und auf Feedback reagieren |
| **Delegation** | Teilaufgaben an spezialisierte Sub-Agenten übergeben |

## Ebene 3 — Infrastruktur

Die Infrastruktur beschreibt das **Fundament**: technische Rahmenbedingungen, die zuverlässigen Betrieb ermöglichen.

| Komponente | Bedeutung |
|------------|-----------|
| **Context Management** | Relevante Informationen filtern, verdichten und priorisieren |
| **Guardrails** | Aktionen auf Sicherheit und Korrektheit prüfen, ggf. blockieren |
| **Environment Access** | Kontrollierten Zugriff auf Dateien, APIs und Betriebssystem bereitstellen |
| **Observability** | Logs, Traces und Debugging-Werkzeuge für Transparenz und Nachvollziehbarkeit |
