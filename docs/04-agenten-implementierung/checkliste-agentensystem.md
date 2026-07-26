---
layout: default
title: "Checkliste Agentensystem"
parent: Agenten-Implementierung
nav_order: 9
description: "Praktische Checkliste für Entwurf, Umsetzung, Evaluation und Observability eines Agentensystems"
has_toc: true
---

# Checkliste: Erstellung eines Agentensystems

Diese Checkliste bündelt die wichtigsten Prüfpunkte für ein Agentensystem: von Zielklärung und Architektur über Tools, Kontext, State und Multi-Agent-Erweiterungen bis zu Evaluation, Observability und Betrieb.

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

Quellenbasis:

- [Agenten-Implementierung]({{ '/04-agenten-implementierung/' | relative_url }})
- [Multi-Agent & Erweiterungen]({{ '/06-multi-agent-erweiterungen/' | relative_url }})
- [Qualität & Sicherheit]({{ '/07-qualitaet-sicherheit/' | relative_url }})

## Wann diese Checkliste nutzen?

- vor dem Bau eines neuen Agentensystems
- beim Review eines Prototyps
- vor der Freigabe einer Demo oder eines produktionsnahen Systems
- nach größeren Änderungen an Prompt, Tools, Kontext, State, Modell oder Datenquellen

## Ziel, Scope und Risiko

- [ ] Der Use Case ist konkret beschrieben: Eingaben, erwartete Ausgaben, Nutzergruppe und Erfolgskriterium.
- [ ] Es ist entschieden, ob ein Agent, ein deterministischer Workflow oder klassischer Code die passende Lösung ist.
- [ ] Die Aufgabe ist nach Handlungstypen klassifiziert: lesen, berechnen, schreiben, kommunizieren, ausführen.
- [ ] Risiken sind benannt: falsche Antwort, falscher Tool-Aufruf, Datenabfluss, irreversible Aktion, Kosten, Latenz.
- [ ] Für riskante Aktionen gibt es Abbruchkriterien, Freigaben oder technische Sperren.
- [ ] Die Definition of Done ist messbar formuliert, nicht nur als "soll gut funktionieren".

## Architektur und Orchestrierung

- [ ] Die Architekturklasse ist gewählt: Tool-Calling, Single-Agent, Workflow-Agent, Multi-Agent oder hybrider Ansatz.
- [ ] **Agent Harness vs. Agent Loop:** Die äußere Kontrollumgebung (Harness: Leitplanken, Veto-Rechte, Timeouts, State-Sicherung) ist klar von der inneren Reasoning-Schleife (Loop) entkoppelt.
- [ ] **Modell-Routing & Resilienz:** Aufgaben werden nach Komplexität an passende Modelle geroutet (Model Routing); bei Provider-Ausfällen oder Rate Limits greifen Ausweichketten und Circuit Breaker.
- [ ] **Task Decomposition & Planning:** Komplexe Aufgaben werden vor der Ausführung in klare Teilziele (Sub-Goals / Plan-and-Solve) zerlegt und Fortschritte schrittweise abgearbeitet.
- [ ] Deterministische Schritte sind als Code, Graph-Knoten oder Workflow modelliert und nicht nur in Prompts beschrieben.
- [ ] Agentische Freiheit ist nur dort vorgesehen, wo Planung, Auswahl oder flexible Problemlösung wirklich nötig ist.
- [ ] Rollen, Komponenten und Verantwortlichkeiten sind klar getrennt.
- [ ] Der Ablauf hat definierte Start-, Erfolgs-, Fehler- und Abbruchzustände.
- [ ] Es gibt Schutz gegen Endlosschleifen: Iterationslimit, Timeout, Fallback oder Eskalation.
- [ ] Für wichtige Entscheidungen ist nachvollziehbar, warum der Agent welchen nächsten Schritt wählt.

## Prompt- und Instruktionsdesign

- [ ] Der System-Prompt definiert Rolle, Ziel, Grenzen, Arbeitsweise und Eskalationsregeln.
- [ ] Kritische Regeln stehen priorisiert und eindeutig im Prompt oder besser als Code-Guardrail im System.
- [ ] Aufgabe, Kontext, Regeln, Beispiele und Ausgabeformat sind klar getrennt.
- [ ] **Structured Output & Schema-Validierung:** Modellantworten und Ausgaben sind typisiert und werden gegen strikte Schemas (z. B. Pydantic) validiert; bei Parsing-Fehlern greift ein automatischer Korrektur-Retry.
- [ ] Das Ausgabeformat ist für Weiterverarbeitung strukturiert, zum Beispiel über ein Schema.
- [ ] Few-Shot-Beispiele werden nur verwendet, wenn sie Verhalten messbar stabilisieren.
- [ ] Prompts enthalten keine geheimen Informationen, API-Keys oder irrelevanten Kontext.
- [ ] Prompt-Regeln ersetzen keine Berechtigungen, Validierung oder Freigabelogik.

## Tools, Function Calling und MCP

- [ ] Jedes Tool hat einen klaren Namen, eine präzise Beschreibung und ein typisiertes Parameterschema.
- [ ] Tool-Beschreibungen erklären, wann das Tool verwendet werden soll und wann ausdrücklich nicht.
- [ ] Tool-Ausgaben sind begrenzt, gefiltert und für den Agenten verständlich.
- [ ] **Idempotenz & Veto-Sicherheit:** Werkzeuge mit Nebenwirkungen (Schreiben, Senden, Buchen) sind idempotend gestaltet (z. B. Transaktions-IDs, Deduplizierung), damit Fehler-Retries keine ungewollten Mehrfachaktionen auslösen.
- [ ] Fehlerfälle liefern weiterverarbeitbare Rückmeldungen statt roher Exceptions.
- [ ] Riskante Tools haben zusätzliche Kontrolle: Validierung, Two-Step-Veto, Freigabe oder Audit.
- [ ] Der Agent erhält nur die Tools, die er für die aktuelle Aufgabe wirklich braucht.
- [ ] Bei MCP ist klar, welcher Host welche Server verbindet, welche Daten weitergegeben werden und welche Aktionen freigabepflichtig sind.
- [ ] MCP-Server sind vertrauenswürdig, minimal berechtigt und nach Datenräumen getrennt.

## Kontext, Wissen und RAG

- [ ] Die Kontextstrategie ist gewählt: Long Context, RAG, CAG, Prompt Caching oder Kombination.
- [ ] **Context Compaction & Token Budgeting:** Dynamisches Kontext-Management (Message Summarization, Message Pruning, Prompt Caching) hält das Tokenverbrauch-Budget ein und verhindert Token-Overflows sowie hohe Latenzen.
- [ ] Relevanzklassen sind definiert: kritisch, wichtig, ergänzend, weglassen.
- [ ] Kontext wird nicht nur gekürzt, sondern nach Nutzen, Aktualität und Risiko priorisiert.
- [ ] Für RAG ist die Pipeline definiert: Quellen, Chunking, Embeddings, Index, Retrieval, Kontext-Assembly, Generation.
- [ ] Chunk-Größe, Overlap und Metadaten sind getestet und nicht nur übernommen.
- [ ] Dasselbe Embedding-Modell und dasselbe Ähnlichkeitsmaß (z. B. Cosine Similarity) werden konsistent für Indexierung und Abfrage verwendet.
- [ ] Die Retrieval-Strategie ist bewusst gewählt: Similarity, MMR, Hybrid (Keyword + semantisch) oder Threshold-Retrieval, ggf. mit Reranking.
- [ ] Es gibt einen Fallback für leere, schwache oder widersprüchliche Retrieval-Ergebnisse.
- [ ] Quellenangaben oder Belege werden dort ausgegeben, wo Grounding wichtig ist.
- [ ] Kontextwachstum wird begrenzt: Sliding Window, Summaries, Compaction oder gezielte Nachladung.

## State, Memory und Checkpointing

- [ ] Der State ist als zentrale Struktur modelliert und wird nicht beliebig in Knoten mutiert.
- [ ] Akkumulierte Felder wie Nachrichten verwenden passende Reducer (kein Überschreiben von Listen, keine Nachrichten-Duplikate).
- [ ] Knoten geben nur Änderungen zurück, nicht ungeprüft den gesamten State.
- [ ] Bei parallelen Ausführungspfaden (Fan-out/Fan-in) sind State-Änderungen konfliktfrei zusammengeführt (keine Race Conditions).
- [ ] Es ist entschieden, ob Memory überhaupt nötig ist.
- [ ] Kurzzeit-Memory ist begrenzt: Buffer, Sliding Window, Summary oder semantischer Cache.
- [ ] Persistentes Memory hat klare Regeln für Speichern, Abrufen, Aktualisieren und Löschen.
- [ ] Checkpointing ist für Unterbrechungen, Human-in-the-Loop und Fehler-Recovery eingerichtet.
- [ ] Session-, Nutzer- oder Thread-IDs sowie Namespaces verhindern Vermischung von Zuständen.
- [ ] Checkpoint-Größe wird begrenzt, damit gespeicherte Zustände nicht unkontrolliert wachsen (State-Bloat).
- [ ] Es gibt eine Strategie für die Migration bestehender Checkpoints, wenn sich das State-Schema ändert.
- [ ] Der Checkpointer passt zur Umgebung: Demo, Prototyp oder produktiver Betrieb.

## Human-in-the-Loop

- [ ] Menschliche Freigabe ist nur an sinnvollen Stellen eingebaut: irreversible Aktionen, externe Kommunikation, Compliance, hohe Unsicherheit.
- [ ] Das HITL-Muster ist gewählt: Freigabe (Approval) oder Eskalation.
- [ ] Es ist unterschieden, ob HITL für den produktiven Betrieb oder nur für Debugging/Entwicklung eingesetzt wird.
- [ ] Vor einer Freigabe sieht der Mensch die entscheidungsrelevanten Informationen, nicht nur eine Kurzbehauptung.
- [ ] Ablehnung, Änderung und Timeout haben definierte Folgepfade.
- [ ] HITL-Punkte sind sparsam gesetzt, damit der Agent nicht unbrauchbar langsam wird.
- [ ] Unterbrechungen setzen zwingend einen konfigurierten Checkpointer voraus (siehe Abschnitt 6).

## Multi-Agent, Kommunikation und Skills

- [ ] Multi-Agent wird nur eingesetzt, wenn Spezialisierung, Trennung von Verantwortung oder Skalierung echten Nutzen bringt.
- [ ] Das Kooperationsmuster ist bewusst gewählt, z. B. Supervisor, Router, Pipeline, Handoff, Skill-orientiert, Planner-Executor, Blackboard oder Swarm (vollständige Musterübersicht in `multi-agent-systeme.md`).
- [ ] Jeder Agent hat eine eindeutige Rolle, eigene Grenzen und definierte Übergaben.
- [ ] Gemeinsamer State oder Nachrichtenformate sind explizit beschrieben.
- [ ] Kommunikationsprotokolle sind nach Ebene getrennt: MCP für Tools, A2A/ACP für Agenten, AG-UI für Nutzerinteraktion.
- [ ] Bei A2A ist der Lebenszyklus geklärt: Discovery (Agent Card), Authentication, Communication.
- [ ] Skills werden nur für wiederholbare, regelhafte oder sicherheitskritische Abläufe ausgelagert.
- [ ] Skills haben Metadaten, klare Trigger (Frontmatter `description` als Routing-Bedingung), progressive Ladung, Anwendungsgrenzen und bei Bedarf referenzierte Zusatzdateien.
- [ ] Es gibt Schutz gegen Agenten-Pingpong, Verantwortungsdiffusion und unklare Endzustände.

## Evaluation

- [ ] Es gibt ein kleines, repräsentatives Testset mit typischen, schwierigen und negativen Fällen.
- [ ] **Out-of-Corpus & Refusal-Testing:** Das Testset enthält gezielt unlösbare, unvollständige oder irreführende Anfragen, um zu prüfen, ob der Agent Grenzen einhält, Wissenslücken zugibt oder korrekt ablehnt (Grounding-Check).
- [ ] Für jeden Testfall sind erwartetes Verhalten, erlaubte Abweichungen und Fehlerkriterien definiert.
- [ ] Tool-Auswahl wird geprüft: richtiges Tool, richtige Parameter, kein Tool bei unnötiger Nutzung.
- [ ] RAG wird separat evaluiert: Retrieval-Qualität, Quellenabdeckung, Grounding und Antwortrelevanz.
- [ ] Agentenläufe werden als End-to-End-Szenarien getestet, nicht nur einzelne Prompts.
- [ ] Regressionstests laufen nach Änderungen an Prompt, Tools, Kontext, State oder Modell.
- [ ] LLM-as-Judge wird nur mit klarer Rubric und Stichprobenkontrolle eingesetzt.
- [ ] Generierung und Bewertung sind entkoppelt (kein Self-Grading durch denselben Modellaufruf), um optimistischen Bewertungs-Bias zu vermeiden.
- [ ] Fehlgeschlagene Fälle werden klassifiziert (z. B. wrong_tool, bad_args, hallucination, empty_retrieval, looping, unsafe_action, format_error) nach Ursache: Prompt, Tool, Retrieval, State, Memory, Modell, Berechtigung oder Nutzerinput.
- [ ] Evaluationsmetriken sind mit Produktzielen verbunden: Qualität, Sicherheit, Kosten, Latenz, Erfolgsrate.

## Observability

- [ ] Silent Failures werden erkannt: ein technisch fehlerfreier Lauf (kein Exception, Status 200) ist keine Garantie für ein fachlich korrektes Ergebnis.
- [ ] Tool-Aufrufe werden nachvollziehbar protokolliert: Name, Parameter, Ergebnisstatus, Laufzeit, Fehler.
- [ ] Agentenentscheidungen sind über Traces oder strukturierte Logs rekonstruierbar.
- [ ] State-Änderungen und Checkpoints können inspiziert werden.
- [ ] Retrieval-Ergebnisse sind sichtbar: Query, Treffer, Scores, Quellen, verwendeter Kontext.
- [ ] Prompts, Modellversionen und Konfigurationen sind pro Lauf nachvollziehbar.
- [ ] **Replay- & Trace-Reproduzierbarkeit:** Agentenläufe (Modellversion, Parametersatz, State-History, Tool-Payloads) sind so protokolliert, dass fehlerhafte Schritte für Debugging und Regressionstests lokal exakt nachgestellt (replayed) werden können.
- [ ] Kosten, Tokenverbrauch und Latenz werden gemessen.
- [ ] **Token- & Kostenanalyse:** Detaillierte Erfassung von `usage_metadata` pro Aufruf (Input-, Output- und Prompt-Caching-Tokens).
- [ ] **Budget Gates:** Automatische Kostenkontrollen oder Schwellenwerte schützen vor unkontrolliertem Kostenanstieg und blockieren oder skalieren teure Anfragen herunter.
- [ ] Fehler werden nicht nur geloggt, sondern nach Ursache und Auswirkung klassifiziert.
- [ ] Für produktive Systeme gibt es Alerts oder Review-Prozesse für Fehlerraten, Kostenanstieg und Sicherheitsereignisse.
- [ ] Bei UI-Integration werden relevante Laufereignisse sichtbar gemacht: Text-Streaming, Tool-Start, Tool-Ende, State-Delta, Fehler.

## Sicherheit, Datenschutz und Betrieb

- [ ] Geheimnisse liegen in `.env` oder Secret Stores, nicht in Prompts, Notebooks oder Logs.
- [ ] Berechtigungen sind minimal vergeben und nicht vom Modell frei entscheidbar.
- [ ] Eingaben, Tool-Parameter und Tool-Ausgaben werden validiert.
- [ ] Prompt Injection und Datenexfiltration sind als Risiko explizit behandelt.
- [ ] **Indirect Prompt Injection Protection:** Ausgaben aus externen Tools, Web-Quellen, PDFs oder E-Mails werden vor der Modellübergabe strukturiert isoliert oder gefiltert, um versteckte Steuerbefehle Dritter zu neutralisieren.
- [ ] Externe Quellen sind nach Vertrauensstufen (hoch/mittel/niedrig) klassifiziert.
- [ ] Externe Inhalte gelten als nicht vertrauenswürdige Daten, nicht als Anweisungen an den Agenten.
- [ ] Externe Kommunikation oder Schreibaktionen haben Freigabe, Audit oder Rollback.
- [ ] Logs und Traces enthalten keine unnötigen personenbezogenen oder vertraulichen Daten.
- [ ] Rate Limits, Kostenlimits, Budget-Regeln und Timeouts sind definiert.
- [ ] **Graceful Degradation:** Bei Teilausfällen (z. B. Tool-Fehler, leeres Retrieval, Budget-Limit) bricht das System nicht unkontrolliert ab, sondern liefert eine verständliche Fallback-Antwort oder eine strukturierte Degratisierung.
- [ ] Der Betrieb hat eine Strategie für Modellwechsel, Tool-Änderungen und Datenaktualisierung.
- [ ] **Incident Retrospectives & Lernschleife:** Nach Fehlverhalten, Sicherheitsereignissen oder Produktionsausfällen werden Ursachen analysiert und systematisch als neue Guardrails, Testfälle oder Checklistenregeln nachgeführt.
- [ ] Bekannte Fehler führen zu Regel-, Test- oder Dokumentationsupdates.

## Abschlussprüfung vor Freigabe

- [ ] Der Agent löst die Kernaufgabe in wiederholbaren Tests zuverlässig.
- [ ] Fehlerfälle sind getestet und führen zu kontrolliertem Verhalten.
- [ ] Evaluation und Observability sind eingerichtet, nicht als spätere Aufgabe offen.
- [ ] Sicherheitsgrenzen sind technisch umgesetzt und nicht nur beschrieben.
- [ ] Dokumentation erklärt Zweck, Grenzen, Konfiguration, Tools, Datenquellen und Betriebsannahmen.
- [ ] Es gibt eine klare Entscheidung: freigeben, nacharbeiten oder bewusst nur als Demo verwenden.

## Weiterführende Seiten

| Thema | Dokument |
|---|---|
| Architektur und Agenten-Patterns | [Agenten-Architekturen]({{ '/04-agenten-implementierung/entwurf/agent-architekturen.html' | relative_url }}) |
| Tool Use und Function Calling | [Tool Use & Function Calling]({{ '/04-agenten-implementierung/entwurf/tool-use-function-calling.html' | relative_url }}) |
| Kontextstrategie | [Context Engineering]({{ '/04-agenten-implementierung/kontext-wissen/context-engineering.html' | relative_url }}) |
| RAG und Grounding | [RAG-Konzepte]({{ '/04-agenten-implementierung/kontext-wissen/rag-konzepte.html' | relative_url }}) |
| State und Ablaufkontrolle | [State Management]({{ '/04-agenten-implementierung/ablauf-zustand/state-management.html' | relative_url }}) |
| Persistenz und Unterbrechungen | [Checkpointing & Persistenz]({{ '/04-agenten-implementierung/ablauf-zustand/checkpointing-persistenz.html' | relative_url }}) |
| Menschliche Freigabe | [Human-in-the-Loop]({{ '/04-agenten-implementierung/ablauf-zustand/human-in-the-loop.html' | relative_url }}) |
| Multi-Agent-Systeme | [Multi-Agent-Systeme]({{ '/06-multi-agent-erweiterungen/multi-agent-systeme.html' | relative_url }}) |
| Evaluation und Observability | [Evaluation & Observability]({{ '/07-qualitaet-sicherheit/evaluation-observability.html' | relative_url }}) |
| Sicherheit | [Agenten-Sicherheit]({{ '/07-qualitaet-sicherheit/agent-security.html' | relative_url }}) |
| Betrieb | [Minimum Viable Agent Stack]({{ '/08-deployment-betrieb/minimum-viable-agent-stack.html' | relative_url }}) |

---

**Version:** 1.0<br>
**Stand:** Juli 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
