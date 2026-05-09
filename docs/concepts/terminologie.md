---
layout: default
title: Terminologie
parent: Einstieg & Entscheidung
grand_parent: Konzepte
nav_order: 3
has_toc: true
description: Englisch-deutsche Übersetzungstabelle für KI-Agenten-Fachbegriffe mit Verwendungshinweisen
---

# Terminologie

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Viele englische KI-Fachbegriffe werden im Deutschen nicht übersetzt — nicht aus Bequemlichkeit, sondern weil die Übersetzungen oft unschärfer sind als das Original. „Prompt" ins Deutsche zu übersetzen würde das Wort aus seinem Kontext reißen; „Kontextfenster" hingegen ist präziser als „context window". Diese Tabelle legt fest, welche Form in den Kursmaterialien verwendet wird — und warum.

## Übersetzungsregel

Drei Fälle lassen sich unterscheiden.

Erstens: Der englische Begriff ist so eingebürgert, dass die Übersetzung künstlich wirkt. Das gilt für „Prompt", „Embedding", „Chunking" und „Streaming" — hier bleibt die englische Form auch in deutschen Erklärungstexten stehen.

Zweitens: Beide Formen sind im Umlauf, aber je nach Kontext ist eine klarer. „Memory" wird bei der kognitiven Metapher (das Agenten-Gedächtnis) auf Deutsch erklärt, bleibt aber in Code-Kontexten englisch. „Fallback" heißt in Erklärungstexten „Rückfallstrategie", im Code `fallback`.

Drittens: Die deutsche Übersetzung ist tatsächlich klarer. „Guardrail" → „Leitplanke" ist eingängiger für Einsteiger. „Handoff" → „Übergabe" ist eindeutiger als das englische Wort. „State" → „Zustand" ist Pflicht — wer im Kurs „state" schreibt, meint Python-Code, nicht den deutschen Fließtext.

## Vollständige Begriffsliste

| Englisch          | Deutsch (bevorzugt)                       | Hinweis                                                                        |
| ----------------- | ----------------------------------------- | ------------------------------------------------------------------------------ |
| action            | Aktion                                    | Standardübersetzung — immer übersetzen                                         |
| agent framework   | Agenten-Framework                         | Hybrid: „Framework" bleibt englisch                                            |
| agent loop        | Agentenschleife                           | In Erklärungstexten immer ausschreiben                                         |
| chain             | Kette / Verarbeitungskette                | „Kette" bei LCEL-Kontexten                                                     |
| checkpoint        | Checkpoint / Sicherungspunkt              | „Checkpoint" ist in LangGraph-Kontexten Standard                               |
| chunking          | Chunking                                  | Keine treffende deutsche Form — bleibt englisch                                |
| context window    | Kontextfenster                            | Immer übersetzen                                                               |
| edge              | Kante                                     | In Graph-Erklärungen immer „Kante" — nie „Edge"                                |
| embedding         | Embedding / Einbettung                    | „Embedding" in Fachtexten, „Einbettung" für Einsteiger                         |
| evaluation        | Evaluation                                | Im ML-Kontext Standard — nicht „Bewertung"                                     |
| fallback          | Rückfallstrategie / Fallback              | „Rückfallstrategie" in Erklärungen, `fallback` im Code                         |
| feedback          | Feedback                                  | Meist direkt übernommen                                                        |
| graph             | Graph / Ausführungsgraph                  | „Graph" bei LangGraph; „Ausführungsgraph" für erste Einführungen               |
| grounding         | Verankerung / Grounding                   | „Verankerung" bei Faktentreue und Halluzinationsschutz                         |
| guardrail         | Leitplanke                                | Immer übersetzen — „Leitplanke" ist einprägsamer                               |
| hallucination     | Halluzination                             | Immer übersetzen; Hauptmotivation für RAG und Grounding                        |
| handoff           | Übergabe                                  | In Erklärungen immer „Übergabe" — klar ohne Vorwissen                          |
| harness           | Agenten-Umgebung / Orchestrierungsschicht | Je nach Kontext auch „Laufzeitumgebung"                                        |
| human-in-the-loop | Menschliche Kontrolle / HITL              | Konzept ausschreiben, Abkürzung HITL beibehalten                               |
| inference         | Inferenz / Ausführung                     | „Inferenz" in Fachtexten; Abgrenzung zu Training betonen                       |
| instruction       | Anweisung                                 | Standardübersetzung — immer übersetzen                                         |
| interrupt         | Unterbrechung                             | Bei Human-in-the-Loop-Flows                                                    |
| judge             | Bewerter / Judge                          | „Bewerter" in Erklärungen; im Code bleibt die Rollenbezeichnung „Judge"        |
| memory            | Gedächtnis / Speicher                     | „Gedächtnis" für die kognitive Metapher, „Speicher" für technische Komponenten |
| node              | Knoten / Node                             | „Knoten" in Erklärungen, „Node" im Code                                        |
| observability     | Beobachtbarkeit / Observability           | Beide Formen gebräuchlich — Konsistenz pro Dokument wählen                     |
| orchestration     | Orchestrierung                            | Direktübersetzung — immer übersetzen                                           |
| planner           | Planer / Planungsmodul                    | „Planer" bei Agentenrollen                                                     |
| policy            | Richtlinie / Steuerungsregel              | Technisch → „Steuerungsregel", organisatorisch → „Richtlinie"                  |
| prompt            | Prompt                                    | Im KI-Kontext nie „Eingabeaufforderung" — wirkt veraltet                       |
| reranking         | Reranking                                 | Im RAG-Fachkontext Standard — keine treffende Übersetzung                      |
| retrieval         | Retrieval / Informationsabruf             | In RAG-Erklärungen „Informationsabruf" beim ersten Auftreten                   |
| retry             | Wiederholung                              | In Erklärungstexten immer „Wiederholung"                                       |
| routing           | Routing / Weiterleitung                   | „Routing" ist eingebürgert; „Weiterleitung" für Einsteiger-Einführungen        |
| runtime           | Laufzeitumgebung                          | Standardübersetzung — immer übersetzen                                         |
| scaffold          | Gerüst / Grundgerüst                      | Wenn etwas strukturell vorstrukturiert wird                                    |
| state             | Zustand                                   | Pflicht: im deutschen Fließtext immer „Zustand" — „state" ist Code             |
| streaming         | Streaming                                 | Kein deutsches Äquivalent — bleibt englisch                                    |
| supervisor        | Supervisor / Koordinator                  | Rollenbezeichnung bleibt englisch; in Einführungen „Koordinator"               |
| temperature       | Temperatur                                | Standardübersetzung — Metapher für Kreativität vs. Determinismus               |
| tool use          | Tool-Nutzung / Werkzeugnutzung            | „Tool" bleibt auch im Deutschen üblich                                         |
| tracing           | Tracing / Nachverfolgung                  | In LangSmith-Kontexten bleibt „Tracing" Standard                               |
| vector store      | Vektordatenbank                           | Immer übersetzen                                                               |
| worker            | Worker / Ausführungsagent                 | „Ausführungsagent" bei erster Einführung                                       |
| workflow          | Workflow / Arbeitsablauf                  | „Workflow" im Tech-Kontext üblich                                              |

## Häufige Verwechslungen

Drei Begriffspaare führen besonders oft zu Missverständnissen in Kursunterlagen.

**Memory, State und Context** bezeichnen unterschiedliche Speicherkonzepte, werden aber häufig synonym verwendet. State ist der strukturierte Arbeitsspeicher eines einzelnen Graphdurchlaufs — er entsteht und endet mit der Ausführung. Memory ist persistenter: ein Agent kann Informationen aus früheren Sitzungen abrufen. Context ist das Kontextfenster des Modells, also das, was das LLM beim nächsten Token-Aufruf tatsächlich „sieht".

> [!WARNING] Typischer Fehler<br>
> „Memory" und „State" werden in Erklärungstexten oft vertauscht. Der Test: Überlebt die Information einen Neustart der Anwendung? Wenn nein → State. Wenn ja → Memory.

**Node und Graph** klingen nach Mathematik, meinen aber in LangGraph konkrete Python-Objekte: ein `StateGraph` ist der Graph, jede Funktion darin ist ein Knoten. In Erklärungstexten helfen die Übersetzungen „Knoten" und „Ausführungsgraph" beim ersten Kontakt — danach darf der Code-Begriff stehen.

**Evaluation und Observability** werden oft als Synonyme behandelt. Evaluation bewertet die Qualität eines Agenten anhand von Testfällen. Observability zeigt, was ein laufendes System im Produktionsbetrieb tut. Beides ist nötig — aber zu unterschiedlichen Zeitpunkten im Entwicklungszyklus.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Lohnt sich KI?](./einstieg/lohnt-es-sich.html) | Wann ist ein KI-Vorhaben überhaupt sinnvoll? |
| [Welches Werkzeug?](./einstieg/aufgabenklassen-und-loesungswege.html) | Welcher Lösungsweg passt zur Aufgabe? |
| [Agenten-Architekturen](./architektur/agent-architekturen.html) | Welche Architekturmuster gibt es und wann passen sie? |

---

**Version:** 1.1<br>
**Stand:** Mai 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
