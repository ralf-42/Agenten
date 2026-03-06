---
layout: default
title: Agenten-Kommunikation
parent: Konzepte
nav_order: 12
description: Wie KI-Agenten miteinander und mit Tools kommunizieren – MCP, A2A, ACP und AG-UI im Überblick
has_toc: true
---

# Agenten-Kommunikation
{: .no_toc }

> **Wie KI-Agenten miteinander und mit Tools kommunizieren – MCP, A2A, ACP und AG-UI im Überblick**    

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Warum brauchen Agenten Protokolle?

Ein einzelner KI-Agent kann heute beeindruckende Dinge – aber kein einzelnes Modell kann alles. In der Praxis arbeiten spezialisierte Agenten zusammen: Ein Agent recherchiert, ein anderer analysiert, ein dritter schreibt den Bericht. Damit das funktioniert, brauchen sie eine gemeinsame Sprache.

**Protokolle sind genau das:** standardisierte Regeln, die festlegen, wie Nachrichten aufgebaut sind, was sie bedeuten und in welcher Reihenfolge sie ausgetauscht werden. Ohne solche Regeln wäre jede Verbindung zwischen Agenten eine aufwändige Einzelintegration.

Ein Vergleich aus der Netzwerktechnik hilft: TCP/IP hat das Internet möglich gemacht, indem es definierte, wie Datenpakete übertragen werden – unabhängig davon, welche Geräte kommunizieren. Agenten-Protokolle spielen heute eine ähnliche Rolle für die KI-Welt. Dieser „TCP/IP-Moment für KI“ markiert den Übergang von experimentellen Einzellösungen hin zu einer stabilen, skalierbaren Infrastruktur.


---

## Drei Kommunikationsebenen

Die Protokoll-Landschaft lässt sich in drei Schichten einteilen, je nachdem, wer mit wem kommuniziert:

```mermaid
flowchart TD
    H[Mensch / Nutzer]
    O[Orchestrator-Agent]
    W1[Worker-Agent 1]
    W2[Worker-Agent 2]
    T1[Datenbank]
    T2[Web-API]

    H -->|AG-UI| O
    O -->|A2A / ACP| W1
    O -->|A2A / ACP| W2
    W1 -->|MCP| T1
    W2 -->|MCP| T2
```

| Ebene | Wer kommuniziert? | Protokoll |
|-------|-------------------|-----------|
| **Tool-Integration** | Agent mit Werkzeug / Datenquelle | MCP |
| **Agenten-Kooperation** | Agent mit Agent | A2A, ACP |
| **Nutzer-Interaktion** | Agent mit Mensch / Frontend | AG-UI |

---

## Kurze Geschichte: Von KQML zu MCP

Die Suche nach einer universellen Agentensprache ist nicht neu. Bereits in den 1990er Jahren entstanden erste Standards:

- **KQML** (1990er): Eines der ersten Protokolle für Agentenkommunikation. Führte das Konzept von „Facilitator-Agenten“ ein, die als Vermittler zwischen Agenten fungieren.
- **FIPA-ACL** (1997+): Vom FIPA-Konsortium entwickelt, mit stärkerer Standardisierung für industrielle Anwendungen.

Beide Protokolle basierten auf der **Sprechakttheorie**: Nachrichten sind nicht nur Daten, sondern Handlungen – ein Agent „fragt“, „befiehlt“ oder „informiert“. Das war ein kluger Ansatz, scheiterte aber an der damaligen Infrastruktur.

Erst mit dem Durchbruch großer Sprachmodelle (LLMs) wird diese Idee wieder relevant – denn LLMs können die Bedeutung strukturierter Nachrichten viel besser verarbeiten als frühere regelbasierte Systeme. Seit 2024 erleben Agenten-Protokolle daher eine Renaissance.

| Protokoll | Jahr | Besonderheit |
|-----------|------|-------------|
| KQML | ~1993 | Erster offener Standard, Facilitator-Konzept |
| FIPA-ACL | 1997 | Stärkere Standardisierung, industriell ausgerichtet |
| MCP | 2024 | Tool-Integration für LLM-Agenten, von Anthropic |
| A2A | 2025 | Agent-zu-Agent-Kommunikation, von Google / Linux Foundation |

---


<img src="https://raw.githubusercontent.com/ralf-42/Agenten/main/07_image/Agenten_Interoperabilitaet.png" alt="Raster aus Pixelwerten" width="1000">


## MCP – Model Context Protocol

### Was ist MCP?

Das **Model Context Protocol (MCP)** wurde von Anthropic im November 2024 eingeführt und hat sich schnell als Standard für die Verbindung von Agenten mit Tools und Datenquellen etabliert.

**Das Problem, das MCP löst:** Früher brauchte jede Verbindung zwischen einem Agenten und einem Tool (z. B. Slack, Google Drive, eine Datenbank) eine individuelle Integration. MCP definiert eine einheitliche Schnittstelle: Integration einmal schreiben, überall nutzen.

```mermaid
flowchart LR
    subgraph MCP-Architektur
        HOST[Host LLM-App]
        CLIENT[MCP Client Connector]
        SERVER[MCP Server Tool / Datenquelle]

        HOST --> CLIENT
        CLIENT -->|JSON-RPC 2.0| SERVER
    end

    SERVER --> DB[(Datenbank)]
    SERVER --> API[Web-API]
    SERVER --> FS[Dateisystem]
```

### Die drei MCP-Abstraktionen

MCP stellt drei Typen von Schnittstellen bereit:

| Typ | Beschreibung | Beispiel |
|-----|-------------|---------|
| **Resources** | Daten lesen (schreibgeschützt) | Dateiinhalt, API-Antwort |
| **Tools** | Aktionen ausführen | Datei schreiben, E-Mail senden |
| **Prompts** | Wiederverwendbare Vorlagen | Analyse-Prompt, Übersetzungs-Vorlage |

### Effizienz durch intelligentes Laden

Statt alle Tool-Definitionen vorab in das Kontextfenster des Modells zu laden (was bei hunderten Tools extrem teuer wäre), kann der Agent Tools bei Bedarf laden und Daten vorverarbeiten. In der Praxis konnte der Token-Verbrauch dadurch von 150.000 auf 2.000 Token gesenkt werden – eine Ersparnis von über 98 %.

### Sicherheit

Da MCP Zugriff auf Dateisysteme und die Ausführung von Code ermöglicht, ist Sicherheit zentral. Das Protokoll setzt auf **explizite Nutzer-Zustimmung**: Jeder Zugriff muss autorisiert werden. Trotzdem bleiben Bedrohungen wie Prompt-Injection aktive Forschungsfelder.

---

## A2A – Agent2Agent Protocol

### Was ist A2A?

Während MCP die Verbindung zwischen Agent und Tool regelt, löst **A2A (Agent2Agent Protocol)** die Kommunikation zwischen autonomen Agenten. Google Cloud startete das Projekt im April 2025, heute wird es unter der Linux Foundation als offener Standard weiterentwickelt.

Das Ziel: Agenten verschiedener Hersteller und Frameworks sollen eine „gemeinsame Sprache sprechen“, unabhängig davon, ob sie in LangGraph, AutoGen oder CrewAI implementiert sind.

### Agent Cards: Wie Agenten sich vorstellen

**Agent Cards** sind maschinenlesbare Profile, über die ein Agent seine Fähigkeiten ankündigt. Über standardisierte Pfade wie `/.well-known/agent.json` können Agenten diese Karten autonom finden:

```mermaid
sequenceDiagram
    participant C as Client-Agent
    participant S as Server-Agent

    C->>S: GET /.well-known/agent.json
    S-->>C: Agent Card (Faehigkeiten, Endpunkt, Auth)
    C->>S: Aufgabe delegieren (Task)
    S-->>C: Status: Working...
    S-->>C: Status: Completed + Ergebnis
```

Eine Agent Card enthält:
- Name und Beschreibung der Fähigkeiten
- Unterstützte Eingabe-/Ausgabeformate (Text, Audio, Bild)
- Authentifizierungsanforderungen
- Endpunkt-URL und Versionsinformationen

### Aufgaben-Lebenszyklus

A2A ist für langlaufende, asynchrone Aufgaben konzipiert. Ein Task durchläuft folgende Zustände:

```mermaid
stateDiagram-v2
    [*] --> Submitted: Aufgabe uebergeben
    Submitted --> Working: Bearbeitung beginnt
    Working --> InputRequired: Rueckfrage noetig
    InputRequired --> Working: Antwort erhalten
    Working --> Completed: Erfolgreich
    Working --> Failed: Fehler aufgetreten
    Completed --> [*]
    Failed --> [*]
```

---

## ACP – Agent Communication Protocol

### Was ist ACP?

Das **Agent Communication Protocol (ACP)**, ursprünglich von IBMs BeeAI-Projekt entwickelt, verfolgt einen pragmatischen Ansatz: Es nutzt konsequent **REST und Standard-HTTP** – die gleiche Technologie, auf der das gesamte Web aufgebaut ist.

ACP wird auch als „HTTP für KI-Agenten“ bezeichnet. Wer schon einmal eine REST-API genutzt hat, findet sich sofort zurecht.

### Kernmerkmale

| Merkmal | Beschreibung |
|---------|-------------|
| **REST-basiert** | Standard HTTP-Verben (GET, POST, ...) |
| **Kein SDK-Zwang** | Funktioniert mit cURL, Postman oder jedem HTTP-Client |
| **Multimodal** | Unterstützt Text, Audio, Bilder via MIME-Typen |
| **Zustandsbehaftet** | Sessions für mehrteilige Gespräche |

### ACP und A2A – gemeinsam stärker

Im August 2025 wurde ACP offiziell Teil des A2A-Projekts unter der Linux Foundation. Die beiden Protokolle ergänzen sich:

- **A2A** bietet robuste Aufgabensteuerung und Agenten-Discovery
- **ACP** bringt die weit verbreitete REST-Kompatibilität ein

Zusammen bilden sie einen starken Industriestandard, unterstützt von Google, IBM, Microsoft, AWS und Salesforce.

---

## AG-UI – Agent-User Interaction Protocol

### Was ist AG-UI?

**AG-UI** standardisiert die Kommunikation zwischen Agenten-Backends und Nutzer-Frontends. Agentische Aufgaben dauern oft Minuten – der Nutzer will aber nicht einfach warten, sondern sehen, was der Agent gerade tut.

AG-UI nutzt eine **ereignisbasierte Architektur**: Der Agent streamt seinen Fortschritt in Echtzeit an das Frontend.

```mermaid
sequenceDiagram
    participant N as Nutzer Frontend
    participant A as Agent Backend

    N->>A: Aufgabe starten
    A-->>N: TEXT_MESSAGE_CONTENT Denkt nach...
    A-->>N: TOOL_CALL_START Suche Wikipedia...
    A-->>N: TOOL_CALL_END Suche abgeschlossen
    A-->>N: TEXT_MESSAGE_CONTENT Hier ist das Ergebnis...
    A-->>N: STATE_DELTA Status fertig
```

### Standard-Events

AG-UI definiert ca. 16 Event-Typen, darunter:

| Event | Bedeutung |
|-------|-----------|
| `TEXT_MESSAGE_CONTENT` | Generierter Text wird übermittelt |
| `TOOL_CALL_START` | Agent beginnt Tool-Nutzung |
| `TOOL_CALL_END` | Tool-Ausführung abgeschlossen |
| `STATE_DELTA` | Frontend-Zustand wird synchronisiert |

AG-UI ist kompatibel mit LangGraph, CrewAI und Pydantic AI und unterstützt sowohl Server-Sent Events (SSE) als auch WebSockets.

---

## Kommunikationsmuster in LangGraph und AutoGen

Neben den universellen Protokollen haben populäre Frameworks eigene interne Kommunikationsmuster:

### LangGraph: Kommunikation über geteilten State

In LangGraph kommunizieren Agenten nicht direkt miteinander – sie lesen und schreiben einen **gemeinsamen Zustand (State)**. Jeder Knoten (Agent) empfängt den aktuellen State und gibt eine aktualisierte Version zurück.

```mermaid
flowchart LR
    A[Agent A] -->|schreibt| S[(State)]
    S -->|liest| B[Agent B]
    B -->|schreibt| S
    S -->|liest| C[Agent C]
```

**Vorteil:** Kein komplexes Nachrichten-Routing nötig.
**Anforderung:** Das State-Schema muss klar definiert sein.

### AutoGen: Direkte Nachrichten und Broadcast

AutoGen nutzt zwei Kommunikationsmuster:
- **Direct Messaging:** Agent A sendet direkt an Agent B (für Request/Response)
- **Broadcast:** Agent veröffentlicht an ein Thema, alle Abonnenten empfangen es (für Pub/Sub)

---

## Protokolle im Vergleich

### Wann welches Protokoll?

```mermaid
flowchart TD
    F{Was soll kommunizieren?}

    F -->|Agent mit Tool / Datenquelle| MCP[MCP]
    F -->|Agent mit Agent| A2A[A2A / ACP]
    F -->|Agent mit Nutzer-Frontend| AGUI[AG-UI]
    F -->|Hochsicherheit + niedrige Latenz| SLIM[SLIM]
```

### Vergleichübersicht

| Protokoll | Einsatzbereich | Technologie | Stärke |
|-----------|---------------|-------------|--------|
| **MCP** | Agent mit Tool | JSON-RPC 2.0 | Universelle Tool-Integration |
| **A2A** | Agent mit Agent | JSON-RPC, SSE | Asynchrone Multi-Agent-Workflows |
| **ACP** | Agent mit Agent | REST / HTTP | Einfachste Integration, kein SDK nötig |
| **AG-UI** | Agent mit Frontend | SSE / WebSocket | Echtzeit-Streaming für UIs |
| **SLIM** | Infrastruktur | gRPC + MLS | Höchste Sicherheit und Performance |

In der Praxis werden diese Protokolle **kombiniert**: MCP verbindet interne Datenbanken mit einem Orchestrator-Agenten, der über A2A/ACP mit spezialisierten Agenten kommuniziert.

---

## Ressourcensteuerung: Agent Contracts

Wenn Agenten autonom zusammenarbeiten, entsteht ein praktisches Problem: Wer stoppt einen Agenten, der in eine Endlosschleife gerät? Wer begrenzt die Kosten?

Das Konzept der **Agent Contracts** schlägt einen formalen Rahmen vor. Ein Vertrag definiert:

- **Eingabe- und Ausgabespezifikationen** – Was wird erwartet?
- **Ressourcenlimits** – Maximales Budget in USD, Token-Limit
- **Zeitgrenzen** – Timeout nach X Sekunden
- **Erfolgskriterien** – Wann gilt die Aufgabe als erledigt?

```mermaid
stateDiagram-v2
    [*] --> Drafted: Parameter festlegen
    Drafted --> Active: Ressourcen reservieren
    Active --> Fulfilled: Aufgabe erfuellt
    Active --> Violated: Limit ueberschritten
    Active --> Expired: Zeit abgelaufen
    Active --> Terminated: Manuell abgebrochen
    Fulfilled --> [*]
    Violated --> [*]
    Expired --> [*]
    Terminated --> [*]
```

Für den Produktionseinsatz in Unternehmen ist diese Ebene essenziell – sie schafft Kostentransparenz und verhindert unkontrollierte Endlosläufe.

---

## Zusammenfassung

Agenten-Kommunikationsprotokolle sind das unsichtbare Rückgrat moderner KI-Systeme. Sie ermöglichen erst die Zusammenarbeit zwischen spezialisierten Agenten in komplexen Workflows.

**Die wichtigsten Protokolle auf einen Blick:**

| Protokoll | Merken als... |
|-----------|---------------|
| **MCP** | „Steckdose für Tools“ – universeller Anschluss an Werkzeuge und Daten |
| **A2A / ACP** | „Telefon zwischen Agenten“ – standardisierte Kommunikation in Multi-Agent-Systemen |
| **AG-UI** | „Fenster zum Nutzer“ – Echtzeit-Streaming von Agentenaktivität ins Frontend |

**Empfehlungen für den Einstieg:**

1. **MCP kennenlernen** – heute obligatorisch für jede Tool-Integration
2. **A2A/ACP verstehen** – der zukunftssicherste Standard für Multi-Agent-Workflows
3. **AG-UI einsetzen** – wenn Agenten in eigene Frontend-Anwendungen integriert werden sollen

Der Trend ist klar: Weg von monolithischen KI-Anwendungen, hin zu modularen Ökosystemen aus spezialisierten, vernetzten Agenten. Die hier vorgestellten Protokolle bilden die Grundlage für dieses „Internet der Agenten“.

---

**Version:** 1.0    
**Stand:** März 2026    
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.     
