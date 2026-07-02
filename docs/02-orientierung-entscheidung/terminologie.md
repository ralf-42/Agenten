---
layout: default
title: Terminologie
parent: "Orientierung & Entscheidung"
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

Viele englische KI-Fachbegriffe werden im Deutschen nicht übersetzt. Das passiert nicht aus Bequemlichkeit, sondern weil die deutschen Varianten oft weniger genau treffen. „Prompt" würde im Deutschen den Zusammenhang verlieren; „Kontextfenster" ist dagegen klarer als „context window". Diese Tabelle legt fest, welche Form in den Kursmaterialien genutzt wird — und warum.

## Übersetzungsregel

Es gibt drei Fälle.

Erstens: Der englische Begriff ist so stark etabliert, dass eine Übersetzung unnatürlich wirken würde. Das gilt für „Prompt", „Embedding", „Chunking" und „Streaming" — hier bleibt die englische Form auch in deutschen Erklärungstexten stehen.

Zweitens: Die Begriffe kursieren auf Englisch und Deutsch, aber je nach Kontext ist eine Form passender. „Memory" wird bei der kognitiven Metapher (das Agenten-Gedächtnis) auf Deutsch erklärt, im Code-Kontext bleibt es jedoch englisch. „Fallback" heißt in Erklärungstexten „Rückfallstrategie", im Code `fallback`.

Drittens: Die deutsche Übersetzung ist tatsächlich die bessere Wahl. „Guardrail" → „Leitplanke" ist für Entwickler schneller greifbar. „Handoff" → „Übergabe" ist eindeutiger als das englische Wort. „State" → „Zustand" ist Pflicht — wer im Kurs „state" schreibt, meint den Python-Code, nicht den deutschen Fließtext.

## Vollständige Begriffsliste

| Englisch          | Deutsch (bevorzugt)                       | Hinweis                                                                        |
| ----------------- | ----------------------------------------- | ------------------------------------------------------------------------------ |
| action            | Aktion                                    | Standardübersetzung — immer übersetzen                                         |
| agent framework   | Agenten-Framework                         | Hybrid: „Framework" bleibt englisch                                          |
| agent loop        | Agentenschleife                           | In Erklärungstexten immer ausschreiben                                         |
| chain             | Kette / Verarbeitungskette                | „Kette" bei LCEL-Kontexten                                                     |
| checkpoint        | Checkpoint / Sicherungspunkt              | „Checkpoint" ist in LangGraph-Kontexten Standard                               |
| chunking          | Chunking                                  | Keine treffende deutsche Form — bleibt englisch                                |
| context window    | Kontextfenster                            | Immer übersetzen                                                               |
| edge              | Kante                                     | In Graph-Erklärungen immer „Kante" — nie „Edge"                                |
| embedding         | Embedding / Einbettung                    | „Embedding" in Fachtexten, „Einbettung" für Entwickler                         |
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
| routing           | Routing / Weiterleitung                   | „Routing" ist eingebürgert; „Weiterleitung" für Entwickler-Einführungen        |
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

Bestimmte Begriffspaare werden besonders oft durcheinandergebracht.

**Memory, State und Context** meinen unterschiedliche Speicherkonzepte, werden aber in Texten häufig als Synonyme behandelt. State ist der strukturierte Arbeitsspeicher eines einzelnen Graphdurchlaufs — er entsteht und endet mit der Ausführung. Memory ist persistenter: Ein Agent kann Informationen aus früheren Sitzungen wieder abrufen. Context ist das Kontextfenster des Modells, also das, was das LLM beim nächsten Token-Aufruf tatsächlich „sieht“.

> [!WARNING] Typischer Fehler<br>
> „Memory" und „State" werden in Erklärungstexten oft vertauscht. Der Test: Bleibt die Information nach einem Neustart der Anwendung erhalten? Wenn nein → State. Wenn ja → Memory.

**Node und Graph** klingen nach Mathematik, meinen aber in LangGraph konkrete Python-Objekte: Ein `StateGraph` ist der Graph, jede Funktion darin ist ein Knoten. In Erklärungstexten machen die Begriffe „Knoten" und „Ausführungsgraph" den Einstieg leichter — danach darf der Code-Begriff stehen.

**Evaluation und Observability** werden oft gegeneinander gehalten, obwohl sie unterschiedliche Ziele haben. Evaluation misst die Qualität eines Agenten anhand von Testfällen. Observability zeigt, was ein laufendes System im Produktionsbetrieb tatsächlich macht. Beides ist wichtig — aber zu unterschiedlichen Zeitpunkten im Entwicklungszyklus.

## Kursinterne Begriffe

Drei Begriffe sind keine Übersetzungen etablierter Fachbegriffe, sondern kursintern geprägt und werden durchgängig verwendet.

**Evidence Tool** bezeichnet ein Tool, dessen Aufgabe es ist, eine Behauptung mit einem abrufbaren Beleg zu unterlegen — im Kurs vor allem RAG. Der Begriff grenzt RAG bewusst von einer reinen Antwortmaschine ab: Ein Evidence Tool liefert Belege, es ersetzt nicht das Urteil des Agenten.

**Gate** ist ein Kontrollpunkt vor einer kritischen oder folgenreichen Ausgabe. Human-in-the-Loop ist eine mögliche Umsetzung eines Gates, aber nicht die einzige — ein Gate kann auch automatisiert prüfen (etwa ein Score-Schwellenwert) und nur bei Unterschreitung eskalieren.

**Agenten-Vertrag** meint das feste Input/Output-Schema zwischen Agent und Tool oder zwischen Agent und Ausgabe — etwa ein Tool-Schema (`@tool`) oder ein Pydantic-Schema bei Structured Output. Der Begriff macht sichtbar, dass sich Agent und Schnittstelle aufeinander verlassen, ähnlich einem Vertrag zwischen zwei Parteien.

Diese drei Begriffe stehen in engem Bezug zum Kursmotto **Planen, Handeln, Prüfen**: Ein Evidence Tool liefert die Grundlage für Planung und Tool-Wahl, ein Agenten-Vertrag macht Ausgaben und Zustände verlässlich greifbar, und ein Gate ist die konkrete Umsetzung von Prüfung vor der nächsten Aktion oder finalen Ausgabe.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Lohnt sich KI?]({{ '/02-orientierung-entscheidung/lohnt-es-sich.html' | relative_url }}) | Wann ist ein KI-Vorhaben überhaupt sinnvoll? |
| [Welches Werkzeug?]({{ '/02-orientierung-entscheidung/aufgabenklassen-und-loesungswege.html' | relative_url }}) | Welcher Lösungsweg passt zur Aufgabe? |
| [Agenten-Architekturen]({{ '/04-agenten-implementierung/entwurf/agent-architekturen.html' | relative_url }}) | Welche Architekturmuster gibt es und wann passen sie? |

---

**Version:** 1.1<br>
**Stand:** Mai 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
