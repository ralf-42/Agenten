---
layout: default
title: Kursüberblick
parent: Orientierung & Entscheidung
nav_order: 0
description: "Überblick über Zielgruppe, Kursstruktur, Modulprogression und roten Faden im Agenten-Kurs"
has_toc: true
---

# Kursüberblick
{: .no_toc }

> **KI-Agenten. Planen. Handeln. Prüfen.**

---

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Worum es in diesem Kurs geht

Der Kurs zeigt, wie aus einzelnen KI-Funktionen kontrollierte Agentensysteme werden: Anwendungen, die planen, Werkzeuge nutzen, Zwischenergebnisse prüfen und bei Bedarf Menschen einbeziehen.

Der rote Faden ist ein **PMO-Assistent**. Er unterstützt die Meeting-Vorbereitung, die Aufbereitung von Besprechungs- und Projektdokumenten, die Aufgabenverfolgung sowie die Erstellung quellengebundener Briefings und Statusübersichten. Dazu arbeitet er mit einem kuratierten Projektkorpus, sucht relevante Passagen, erstellt belegbare Antworten, erkennt Grenzen des Wissens und macht kritische Ausgaben prüfbar. Er ersetzt kein vollständiges PMO-System und trifft keine verbindlichen Projektentscheidungen.

Der Fokus liegt auf praktischer Umsetzung mit Python, LangChain, LangGraph, LangSmith und ChromaDB. Theorie wird so weit erklärt, wie sie für Entwurf, Implementierung und Bewertung nötig ist.

## Zielgruppe

Der Kurs passt besonders für:

- Entwicklerinnen und Entwickler mit Python-Grundlagen,
- IT-Fachkräfte, die KI-Agenten in Arbeitsprozesse einordnen möchten,
- fortgeschrittene GenAI-Anwenderinnen und -Anwender, die von Prompts und Chains zu kontrollierten Workflows wechseln wollen.

Hilfreich sind sichere Grundlagen in Python, Jupyter/Colab und API-Nutzung.

Der Kurs baut auf dem GenAI-Kurs auf. Wer Prompting, Modellaufrufe, Chains, RAG und strukturierte Ausgaben kennt, kann sich hier auf kontrollierte Handlung, Zustand, Tool-Auswahl, Freigabe und Evaluation konzentrieren.

## Was der Kurs vermittelt

Nach dem Kurs ist es möglich:

- Agenten von Chatbots, Chains und klassischen Workflows abzugrenzen,
- Tools, Prompts, State und Routing gezielt zu kombinieren,
- sichtbare Planungs-, Tool- und Prüf-Artefakte statt versteckter Gedankengänge zu nutzen,
- RAG als Evidence Tool in Agenten einzubinden,
- LangGraph für kontrollierte mehrstufige Abläufe zu nutzen,
- Human-in-the-Loop im Grundlagenpfad umzusetzen und Evaluation, Security und Budgetkontrolle über die Aufbaumodule einzuplanen,
- einen PMO-Assistenten für Meeting-Vorbereitung, Dokumentenaufbereitung, Aufgabenverfolgung sowie quellengebundene Briefings und Statusübersichten weiterzuentwickeln.

Das praktische Ergebnis ist kein loses Beispielset, sondern ein wachsendes Zielsystem: ein Agent, der Projektmaterial durchsucht, Meeting-Briefings und Statusübersichten erstellt, offene Aufgaben strukturiert erfasst, relevante Evidenz sammelt, menschliche Freigaben einbezieht und am Ende als überprüfbarer Prototyp weitergeführt werden kann.

## Kursstruktur

Die Module führen von ersten Agentenbegriffen über Tool Use, LangGraph, RAG und Multi-Agent-Patterns bis zu Evaluation, Betrieb und Capstone.

| Bereich | Inhalte |
|---|---|
| **Agenten-Grundlagen** | Agentenbegriff, ReAct/TAO als sichtbarer Tool-Zyklus, Tool Use, erster LangChain-Agent |
| **Strukturierte Agenten** | Prompt Engineering, Structured Output, Multi-Tool-Agenten, LCEL |
| **Kontrollierte Workflows** | LangGraph, StateGraph, Conditional Routing, Planning-Patterns, Tool Loop |
| **Wissensbasierte Agenten** | RAG, ChromaDB, Retrieval als Tool, LangSmith-Evaluation |
| **Kontrollierte Zusammenarbeit** | Sessions, HITL, Memory, Multi-Agent-Patterns |
| **Aufbau: Qualität und Integration** | Agentic RAG, Security, Evaluation, Routing, Kostenkontrolle, Pipeline, Projekt-Templates, Advanced RAG |
| **Vertiefung: Skills und Produktion** | UI, MCP, Skill-Design, DeepAgents, Deployment, Capstone |

Der Grundlagenpfad KI-Agenten und Tool Use bis Human in the Loop sowie Multi-Agent Patterns bis Reflection, Parallel, Hierarchy ist auf fünf Kurstage mit je vier 90-Minuten-Blöcken (09:00–16:30 Uhr) verteilt. Das frühere Memory-Modul ist in Sessions, Checkpointing und Memory integriert und liegt nur noch als Legacy-Backup vor. Die Aufbaumodule Agentic RAG bis Advanced RAG Pipeline Patterns und die Vertiefungsmodule Gradio UI für Agenten bis Production Deployment erweitern einzelne Blöcke gezielt oder dienen als Material nach dem Kurs. Welche Zusatzmodule im Kurs eingesetzt werden, hängt von Tempo und Vorkenntnissen ab.

Ergänzend geht es um Governance-Fragen. Wer den Kurs nur überblicken möchte, liest zuerst Kursprogression und Modulübersicht. Wer entscheiden möchte, ob der Kurs passt, beginnt mit Zielgruppe, Vorbereitung und den nächsten Schritten am Ende dieser Seite.

## Kursprogression

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'timelineLineColor': '#0284c7',
    'sectionBkgColor': '#e0f2fe',
    'sectionTextColor': '#0c4a6e',
    'containerBkgColor': '#f8fafc',
    'taskBkgColor': '#e0f2fe',
    'taskTextColor': '#0c4a6e'
  }
}}%%
timeline
    title Agenten-Progression im Kursverlauf
    section Agenten-Grundlagen
        Erste handlungsfähige Agenten : Agentenbegriff, Tools, erster LangChain-Agent
                                     : KI-Agenten und Tool Use bis LangChain Erste Agenten
    section Strukturierte Agenten
        Steuerbare Einzelschritte     : Prompts, Schemas, Multi-Tool, LCEL
                                     : Prompt Engineering für Agenten bis LCEL Chains
    section Kontrollierte Workflows
        Agenten mit Zustand           : LangGraph, StateGraph, Routing, Tool Loop
                                     : Warum LangGraph bis Tool Loop
    section Wissensbasierte Agenten
        RAG als Evidence Tool         : ChromaDB, Retrieval, RAG-Agent, Evaluation
                                     : RAG Grundlagen bis LangSmith Evaluations Basics
    section Kontrollierte Zusammenarbeit
        Sessions, Freigabe und Teams  : Checkpointing, HITL, Memory, Multi-Agent-Patterns
                                     : Sessions, Checkpointing und Memory bis Human in the Loop, Multi-Agent Patterns bis Reflection, Parallel, Hierarchy
    section Aufbau
        Belastbare Agentensysteme     : Agentic RAG, Security, Evaluation, Routing, Kosten, Pipeline, Advanced RAG
                                     : Agentic RAG bis Advanced RAG Pipeline Patterns
    section Vertiefung
        Vom Kursprojekt zum System    : UI, MCP, Skills, DeepAgents, Deployment, Capstone
                                     : Gradio UI für Agenten bis Production Deployment
```

## Maturity Model als Overlay

Die Kursprogression lässt sich auch als Reifegradmodell lesen. Es ist keine zweite Kursstruktur und keine Rangliste. Es zeigt, welche Fähigkeiten hinzukommen und welche Kontrollpunkte dadurch nötig werden.

| Reifegrad | Kurzbeschreibung | Kursbezug | Einordnung |
|---|---|---|---|
| **Level 1: Reactive** | Reagiert auf Eingaben und ruft kontrolliert Tools auf. | KI-Agenten und Tool Use bis Multi-Tool-Agents, MCP Local | Der Agent nutzt Werkzeuge und lernt standardisierte Schnittstellen wie MCP kennen. |
| **Level 2: Assisted** | Wird durch Harness, State und menschliche Freigaben steuerbar. | Prompt Engineering für Agenten bis Tool Loop, Sessions, Checkpointing und Memory bis Human in the Loop | Prompts, Schemas, Routing, Checkpointing, Memory und Human-in-the-Loop machen Verhalten kontrollierbarer. |
| **Level 3: Supervised** | Wird koordiniert, evaluiert und abgesichert. | LangSmith Evaluations Basics, Multi-Agent Patterns bis Agent Evaluation und Testing | Multi-Agent-Muster, Supervisor, Evaluation, Regression, Security und Guardrails machen Ergebnisse prüfbar. |
| **Level 4: Autonomous** | Bearbeitet längere Aufgaben mit Memory, Betriebskontrolle und Kostenlimits. | Sessions, Checkpointing und Memory, Agentic RAG bis Production Deployment | Memory, Kostenkontrolle, Deployment, Monitoring und produktionsnahe Schleifen schaffen Betriebsfähigkeit. |
| **Level 5: Self-Improving** | Nutzt Feedback und Evaluation zur Verbesserung, bleibt aber beaufsichtigt. | Agent Evaluation und Testing | Der Kurs zeigt Verbesserungszyklen, aber kein vollautomatisches selbstlernendes Agentensystem. |

Wichtig ist die Lesart: Die Module folgen keiner starren Level-Treppe. Das Modell hilft beim Einordnen: Welche zusätzliche Freiheit bekommt der Agent, und welche Kontrolle muss dadurch sichtbar werden? Bausteine wie Memory oder Evaluation erscheinen dort, wo sie didaktisch gebraucht werden. Level 5 bleibt bewusst als Grenze markiert: Reale Systeme können durch Feedback besser geprüft werden, verbessern sich aber nicht unbegrenzt und unbeaufsichtigt selbst.

## Modulübersicht

| Modul | Block                             | Inhalt                               | Schwerpunkt                                            |
| :---: | --------------------------------- | ------------------------------------ | ------------------------------------------------------ |
|  KI-Agenten und Tool Use  | Agenten-Grundlagen                | KI-Agenten und Tool Use              | Agentenbegriff, ReAct/TAO, Kurszielbild, erste Werkzeuge |
|  LangChain Erste Agenten  | Agenten-Grundlagen                | Erste Agenten mit LangChain          | `create_agent()`, Tool-Auswahl, erster PMO-Assistent  |
|  Prompt Engineering für Agenten  | Strukturierte Agenten             | Prompt Engineering                   | Rollen, Grenzen, Tool-Regeln, sichtbare Reasoning-Artefakte |
|  Structured Output  | Strukturierte Agenten             | Structured Output                    | Antwortschema, Quellenpflicht, Prüfbarkeit             |
|  Multi-Tool-Agents  | Strukturierte Agenten             | Multi-Tool Agents                    | Mehrere Tools, Fehlerbehandlung, Auswahl               |
|  LCEL Chains  | Strukturierte Agenten             | LCEL Chains                          | Kontrollierte Teilketten und Übergang zu LangGraph     |
|  Warum LangGraph  | Kontrollierte Workflows           | Warum LangGraph?                     | Grenzen einfacher Agents, expliziter State             |
|  StateGraph Basics  | Kontrollierte Workflows           | StateGraph Basics                    | Nodes, Edges, State und Verbesserungsschleifen         |
|  Conditional Routing  | Kontrollierte Workflows           | Conditional Routing & Qualitäts-Gate | Routing, Qualitäts-Gate, Security-Basics, Planning-Patterns |
|  Tool Loop  | Kontrollierte Workflows           | Tool-Loop                            | Tool-Loop, Tool-Steuerung im Graph                     |
|  RAG Grundlagen  | Wissensbasierte Agenten           | RAG-Konzepte & Embeddings            | Korpus, Embeddings, Chunking                           |
|  RAG Grundlagen  | Wissensbasierte Agenten           | ChromaDB Indexing                    | Vektordatenbank, Indexierung, Abfrage                  |
|  RAG Grundlagen  | Wissensbasierte Agenten           | RAG Chain mit LangChain              | Retriever, Quellenbindung, Antwortkette                |
|  RAG-Agent  | Wissensbasierte Agenten           | RAG-Agent                            | Retrieval als Agenten-Tool                             |
|  LangSmith Evaluations Basics  | Wissensbasierte Agenten           | LangSmith Evaluations Basics         | Eval-Set, Retrieval-Score, Regression                  |
|  Sessions, Checkpointing und Memory  | Kontrollierte Zusammenarbeit      | Sessions, Checkpointing & Memory     | Thread-ID, Fortsetzen, Kurzzeit- und Langzeit-Memory   |
|  Human in the Loop  | Kontrollierte Zusammenarbeit      | Human-in-the-Loop                    | Review, Freigabe, Unterbrechung                        |
|  Multi-Agent Patterns  | Kontrollierte Zusammenarbeit      | Multi-Agent Patterns                 | Supervisor, Hierarchie, Pipeline                       |
|  Supervisor Pattern  | Kontrollierte Zusammenarbeit      | Supervisor Pattern                   | Worker, Supervisor, Guardrails                         |
|  Reflection, Parallel, Hierarchy  | Kontrollierte Zusammenarbeit      | Reflection, Parallel, Hierarchie     | Prüfschleife, Fan-out, Teams                              |
|  Agentic RAG  | Aufbau: Qualität und Integration  | Agentic RAG                          | Retrieval-Budget, Grounding, Out-of-Context-Stopp      |
|  Agent Security Best Practices  | Aufbau: Qualität und Integration  | Agent Security Best Practices        | Prompt Injection, Tool-Gating, Audit                   |
|  Agent Evaluation und Testing  | Aufbau: Qualität und Integration  | Agent Evaluation & Testing           | Tests, Regression, Tool-Choice-Scoring, Adversarial Benchmarks |
|  Model Routing und Cost Control  | Aufbau: Qualität und Integration  | Model Routing & Cost Control         | Fallback, Circuit Breaker, Budget Gate                 |
|  Integration Pipeline  | Aufbau: Qualität und Integration  | Integration Pipeline                 | PMO-Assistentensystem als E2E-Pipeline   |
|  Advanced RAG Pipeline Patterns  | Aufbau: Qualität und Integration  | Advanced RAG Pipeline Patterns       | Self-RAG, Reranking, CRAG                              |
|  Gradio UI für Agenten  | Vertiefung: Skills und Produktion | Gradio UI für Agenten                | Chat UI, Streaming, HITL-UI                            |
|  MCP Local  | Vertiefung: Skills und Produktion | MCP Local                            | Lokale MCP-Server und standardisierte Tool-Integration |
|  Agent Skill Compliance  | Vertiefung: Skills und Produktion | Agent Skill Compliance               | Skill-Struktur, Guardrails, Mixed Models               |
|  DeepAgents Harness  | Vertiefung: Skills und Produktion | DeepAgents Harness                   | Planning, Tools, Sub-Agenten (Kern)                    |
|  DeepAgents Vertiefung  | Vertiefung: Skills und Produktion | DeepAgents: Parameter & Einordnung   | Weitere Parameter, Sandbox, Vergleich zu LangGraph     |
|  DeepAgents Skill PMO-Assistent  | Vertiefung: Skills und Produktion | DeepAgents-Skill für PMO-Briefings  | PMO-Briefing als Skill für den PMO-Assistenten         |
|  DeepAgent Multi-Skill  | Vertiefung: Skills und Produktion | DeepAgent Multi-Skill                | Multi-Skill-Routing und Progressive Disclosure         |
|  Production Deployment  | Vertiefung: Skills und Produktion | Production Deployment                | Notebook → Production, Modell-Konfig, Docker           |

In der Modulübersicht steht der fachliche Schwerpunkt im Vordergrund. Der Beitrag zum Leitprojekt bleibt durchgehend derselbe: Jeder Block erweitert den PMO-Assistenten um eine neue Fähigkeit oder einen neuen Kontrollpunkt.

| Kursblock | Ausbau am PMO-Assistenten |
|---|---|
| **KI-Agenten und Tool Use bis LangChain Erste Agenten: Agenten-Grundlagen** | Der Agent bekommt ein Zielbild, erste Tools und einen einfachen LangChain-Harness. |
| **Prompt Engineering für Agenten bis LCEL Chains: Strukturierte Agenten** | Prompts, Schemas und Teilketten machen Aufgaben, Grenzen und Antwortformate kontrollierbar. |
| **Warum LangGraph bis Tool Loop: Kontrollierte Workflows** | LangGraph ergänzt expliziten State, Routing, Qualitäts-Gates und Tool-Loops. |
| **RAG Grundlagen bis LangSmith Evaluations Basics: Wissensbasierte Agenten** | Der Agent nutzt einen Projektkorpus, Retrieval, Quellenbindung und erste Evaluationen. |
| **Sessions, Checkpointing und Memory bis Human in the Loop, Multi-Agent Patterns bis Reflection, Parallel, Hierarchy: Kontrollierte Zusammenarbeit** | Sessions, Memory, Human-in-the-Loop und Multi-Agent-Muster machen längere Abläufe steuerbar. |
| **Agentic RAG bis Advanced RAG Pipeline Patterns: Aufbau: Qualität und Integration** | Agentic RAG, Security, Tests, Regression, Modellrouting und Kostenkontrolle sichern den Agenten ab; Pipeline, Projekt-Templates und Advanced RAG führen die Bausteine zusammen. |
| **Gradio UI für Agenten bis Production Deployment: Vertiefung: Skills und Produktion** | UI, MCP-Integration, Skills, DeepAgents, Deployment und Capstone bringen den Agenten in einen betriebsnahen Zustand. |

Einige Begriffe sind bewusst knapp gehalten. **Evidence Tool** meint ein Retrieval-Werkzeug, das Antworten mit Quellenmaterial verbindet. **Out-of-Context-Stopp** bedeutet, dass der Agent anhält, wenn die vorhandenen Quellen keine belastbare Antwort tragen. **Circuit Breaker** bezeichnet eine Schutzschaltung, die Abläufe bei Fehlern, Kosten- oder Qualitätsgrenzen stoppt.

## Vorbereitung

Für die praktischen Übungen werden typischerweise benötigt:

- ein Google-Account für Google Colab und Google Drive,
- ein OpenAI-Account mit API-Key und kleinem API-Guthaben,
- ein LangSmith-Account für Tracing, Debugging und Evaluation,
- ein Gerät, auf dem Browser, Notebook-Umgebung und Kursmaterial zuverlässig funktionieren,
- Grundverständnis von Python-Funktionen, Decorators, Type Hints, Dictionaries und Fehlerbehandlung.

Google Colab und Google Drive sind vor allem für den gemeinsamen Kursbetrieb praktisch. Wer lokal arbeitet, braucht stattdessen eine funktionierende Python-Umgebung mit Zugriff auf die Kursnotebooks. LangSmith wird für Beobachtung und Evaluation empfohlen; einzelne Grundlagen lassen sich auch ohne LangSmith nachvollziehen, verlieren dann aber den Trace- und Bewertungsblick.

Bei Business-Laptops sollte vorab geprüft werden, ob Cloud-Dienste, API-Zugriffe, GitHub, Google Colab und LangSmith durch die IT-Richtlinien erlaubt sind.

Nützliche Einstiege:

- [OpenAI Platform](https://platform.openai.com/)
- [LangSmith](https://smith.langchain.com/)
- [Google Colab](https://colab.research.google.com/)

## Arbeitsweise

Der Kurs ist als Werkstatt aufgebaut. Die Notebooks sind nicht nur Lesematerial, sondern sollen ausgeführt, verändert und kritisch geprüft werden. Jede größere Technik wird am PMO-Assistenten eingeordnet: Was plant der Agent, welche Handlung führt er aus, und wie wird das Ergebnis geprüft?

Sinnvoll ist es, eigene Fragen oder kleine Prozessideen mitzubringen. Dadurch wird schneller sichtbar, wann ein Agent wirklich hilft und wann ein klassischer Workflow, eine einfache Chain oder ein RAG-System ohne Agent ausreicht.

## Lernen mit KI

Generative KI darf im Kurs als Lern- und Entwicklungshilfe genutzt werden. Bei Fehlermeldungen, Verständnisfragen oder Varianten kann ein Modell Teilschritte erklären oder alternative Implementierungen vorschlagen.

Die Grenze bleibt wichtig: KI ersetzt nicht das eigene Verständnis. Der Schwerpunkt liegt darauf, Agentensysteme selbst zu entwerfen, auszuführen, zu beobachten und zu bewerten.

## Kompetenzillusion vermeiden

Agenten-Demos können überzeugend wirken, obwohl wichtige Kontrollpunkte fehlen. Gerade bei mehrstufigen Systemen entsteht leicht der Eindruck, der Agent habe verstanden, geplant und geprüft, obwohl er nur plausibel formuliert.


<img src="https://raw.githubusercontent.com/ralf-42/Agenten/main/07_image/kompetenzillusion.png" alt="Kompetenzillusion beim Lernen mit KI" width="700">
<p><small>KI-generiertes Bild</small></p>


Deshalb gehören im Kurs immer drei Prüfbewegungen dazu:

- Tool-Aufrufe und Zwischenschritte sichtbar machen,
- Quellen, State und Entscheidungen nachvollziehen,
- Ergebnisse mit Tests, Human-in-the-Loop oder Evaluation prüfen.

## Aufgaben nach Vorkenntnissen und Lerntempo bearbeiten

Die Aufgaben je Modul sind in **Grundlagen**, **Aufbau** und **Vertiefung** unterteilt. Die Auswahl richtet sich nach **Vorkenntnissen** und **Lerntempo**: Grundlagen sichern das zentrale Verständnis, Aufbau-Aufgaben vertiefen die Anwendung, und Vertiefungsaufgaben bieten zusätzliche Übung, Varianten oder Transferfragen.

Einige Module enthalten außerdem den Unterabschnitt **Praxis-Transfer: PMO-Assistent**. Diesen Abschnitt sollten sich möglichst alle ansehen, weil er die jeweilige Technik mit dem durchgehenden Kursprojekt verbindet.

## Zeitfenster für Aufgaben

Für Übungsaufgaben hat sich ein kurzer Arbeitsrhythmus bewährt: etwa **10 Minuten Bearbeitungszeit**, ein kurzer **Zwischenstopp** und anschließend weitere **10 Minuten oder mehr**. Die erste Phase ist lang genug für den Einstieg und kurz genug, damit Blockaden früh sichtbar werden.

Der Zwischenstopp sollte niedrigschwellig sein. Statt nur zu fragen „Gibt es Fragen?“, hilft ein aktiver Check: zum Beispiel Daumen hoch/seitlich/runter oder eine kurze Zahl im Chat für den eigenen Fortschritt.

Der Check ist keine harte Pflicht-Unterbrechung für alle. Wer gut im Flow ist, kann weiterarbeiten; wer festhängt, bekommt früh Gelegenheit zur Klärung. Bei unterschiedlichem Tempo bleibt der Takt flexibel: Schnellere bearbeiten Aufbau- oder Vertiefungsaufgaben, langsamere sichern zunächst die Grundlagen.

Auch während der Übungszeit stehen Fragen jederzeit offen. Wer lieber ungestört im eigenen Flow bleiben möchte, schaltet dafür einfach den eigenen Lautsprecher **stumm**.

Statt der gestellten Aufgaben lässt sich bei Bedarf auch eine **eigene** Problemstellung bearbeiten. Unterstützung dafür gibt es, soweit es der Rahmen zulässt.

Fehler gehören zum Lernprozess dazu und sind kein Rückschlag: Eine Fehlermeldung zeigt oft genauer, wie ein System tatsächlich funktioniert, als ein Durchlauf ohne Probleme, und trägt damit direkt zum Lernerfolg bei.

## Nächste Schritte

| Dokument | Frage |
|---|---|
| [Lohnt es sich?](./lohnt-es-sich.html) | Ist ein Agent für diese Aufgabe überhaupt sinnvoll? |
| [Aufgabenklassen & Lösungswege](./aufgabenklassen-und-loesungswege.html) | Welche Lösungsklasse passt zur Aufgabe? |
| [PMO-Assistent](./pmo-assistent.html) | Welches Kursprojekt verbindet die Module? |
| [Lernpfad](../lernpfad.html) | Welche Dokumente passen zu meinem Lernziel? |

---

**Version:** 1.2<br>
**Stand:** Oktober 2026<br>
**Fachstand:** Oktober 2026; Versionsnummern sind dokumentbezogen.<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
