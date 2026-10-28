---
layout: default
title: "Checkliste Agentensystem"
parent: Agenten-Implementierung
nav_order: 9
description: "Kompakte Prüfliste für Entwurf, Umsetzung, Evaluation und Freigabe eines Agentensystems"
has_toc: true
---

# Checkliste: Erstellung eines Agentensystems

Diese Checkliste begleitet Entwurf, Umsetzung und Freigabe. Sie enthält die entscheidenden Prüfpunkte; Erklärungen und Umsetzungsmuster stehen in den verlinkten Fachkapiteln und Projektstandards. Produktionsspezifische Ergänzungen sind am Ende als optional gekennzeichnet.

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

Quellenbasis:

- [Agenten-Implementierung]({{ '/04-agenten-implementierung/' | relative_url }})
- [Multi-Agent & Erweiterungen]({{ '/06-multi-agent-erweiterungen/' | relative_url }})
- [Qualität & Sicherheit]({{ '/07-qualitaet-sicherheit/' | relative_url }})
- Projektregeln: AGENTS.md · CLAUDE.md · LangChain_Standards.md · LangGraph_Standards.md
- API-Referenzen: [LangChain Agents](https://docs.langchain.com/oss/python/langchain/agents) · [LangGraph Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)

## Ziel, Scope und Risiko

- [ ] Use Case, Nutzergruppe, Ein- und Ausgaben sowie messbares Erfolgskriterium sind beschrieben.
- [ ] Die passende Lösungsform ist gewählt: deterministischer Code, Workflow, Agent oder begründete Kombination.
- [ ] Risiken wie falsche Antworten, Datenabfluss, Kosten und irreversible Aktionen sind bewertet.
- [ ] Für riskante Aktionen sind Freigabe, Abbruchkriterien oder technische Sperren vorgesehen.
- [ ] Definition of Done und Freigabekriterien sind überprüfbar formuliert.

## Architektur und Orchestrierung

- [ ] Deterministische Schritte sind als Code, Workflow oder Graph modelliert und nicht nur im Prompt beschrieben.
- [ ] Rollen, Zuständigkeiten, Übergaben und erlaubte Aktionen sind klar begrenzt.
- [ ] Start, Erfolg, Fehler, Abbruch und Eskalation haben definierte Zustände oder Pfade.
- [ ] Schleifen und lange Läufe sind durch passende Schritt-, Zeit- oder Abbruchgrenzen geschützt.
- [ ] Die äußere Kontrollschicht (Harness) und die Agentenschleife (Loop) sind bei Bedarf getrennt nachvollziehbar.

## Projekt- und API-Standards

- [ ] Die Implementierung folgt [Agenten/AGENTS.md](../AGENTS.md) und [Agenten/CLAUDE.md](../CLAUDE.md); bei API-Fragen gilt die aktuelle offizielle Dokumentation.
- [ ] Modelle werden gemäß Projektstandard mit `init_chat_model()` und der festgelegten Modellwahl initialisiert; provider-spezifische Klassen wie `ChatOpenAI()` werden vermieden.
- [ ] Ein einfacher Tool-Agent nutzt `langchain.agents.create_agent()`; ein expliziter, mehrstufiger Kontrollfluss nutzt bei Bedarf `StateGraph`.
- [ ] Neue Implementierungen verwenden keine abgelösten APIs wie `initialize_agent`, `create_react_agent`, `LLMChain`, `Tool()` oder `PydanticOutputParser`.
- [ ] Projektkonventionen für Namen sind eingehalten: State `*State`, Builder `agent_builder`/`*_builder`, Laufzeitobjekt `agent`/`*_agent`, Nodes `*_node`, Router `router`/`*_router`, Ergebnis-Schemas `*Result`.
- [ ] Python-Bezeichner sind englisch; LangSmith-Projekt-, Run-, Experiment-, Dataset- und Prompt-Namen folgen dem modulbezogenen `m##_snake_case`-Schema; `show_trace(...)` erhält denselben Projektnamen.

## Prompts, strukturierte Ausgabe und Tools

- [ ] System-Prompt, Aufgabe, Kontext, Regeln und Ausgabeformat sind klar voneinander abgegrenzt.
- [ ] Kritische Berechtigungen und Schutzregeln sind technisch abgesichert und nicht allein dem Prompt überlassen.
- [ ] Strukturierte Modellgrenzen verwenden `with_structured_output()` oder bei `create_agent()` ein passendes `response_format`; Ergebnis-Schemas sind typisiert.
- [ ] Validierungsfehler haben einen definierten Fehlerpfad; Retries sind begrenzt und ausdrücklich konfiguriert.
- [ ] Jedes Tool hat einen eindeutigen Namen, eine präzise Beschreibung und ein typisiertes Parameterschema.
- [ ] Tool-Ausgaben sind begrenzt, validiert und als nicht vertrauenswürdige Daten behandelt.
- [ ] Schreibende oder externe Aktionen sind gegen Mehrfachausführung geschützt und erhalten bei Bedarf Freigabe und Audit.

## Kontext, Wissen und RAG

- [ ] Die Kontextstrategie (z. B. Long Context, RAG, CAG oder Kombination) ist begründet gewählt.
- [ ] Für RAG sind Quellen, Chunking, Embeddings, Index, Retrieval und Antwortaufbau festgelegt.
- [ ] Chunk-Größe, Overlap und Metadaten sind an repräsentativen Beispielen geprüft.
- [ ] Indexierung und Abfrage verwenden kompatible Embedding-Modelle und Distanzmaße.
- [ ] Retrieval-Strategie und gegebenenfalls Reranking sind an den Daten und dem Suchziel ausgerichtet.
- [ ] Leere oder schwache Treffer führen zu einem definierten Fallback; wichtige Aussagen erhalten nachvollziehbare Quellen.
- [ ] Kontext- und Tokenwachstum werden mit passenden Grenzen, Zusammenfassungen oder gezielter Nachladung kontrolliert.

## State, Memory und Checkpointing

- [ ] State ist als typisierte, möglichst kleine und serialisierbare Struktur modelliert; Graph-State nutzt bevorzugt `TypedDict`.
- [ ] Reducer sind passend zur Zusammenführung gewählt; `add_messages` hängt standardmäßig an und aktualisiert vorhandene Nachrichten bei übereinstimmender ID.
- [ ] Nodes mutieren den bestehenden State nicht direkt und geben nur die vorgesehenen Änderungen zurück.
- [ ] Router liefern typisierte Ziele, etwa mit `Literal[...]`; alle Ziele stimmen mit registrierten Nodes oder `END` überein.
- [ ] Parallele Pfade können gemeinsame State-Felder konfliktfrei aktualisieren.
- [ ] Es ist entschieden, welche Informationen im Kurzzeit-State und welche in dauerhaftem Memory liegen; Speichern, Abrufen und Löschen sind geregelt.
- [ ] Wenn Sitzungsfortsetzung, Recovery oder Interrupts benötigt werden, sind Checkpointer und stabile `thread_id` konfiguriert. `create_agent()` unterstützt `checkpointer`; bei `StateGraph` wird er beim Kompilieren übergeben.
- [ ] Thread-IDs und Store-Namespaces trennen Nutzer und Sitzungen; State-Größe und Schemaänderungen sind berücksichtigt.

## Human-in-the-Loop, Multi-Agent und Skills

- [ ] Menschliche Freigaben stehen an begründeten Stellen, etwa vor irreversiblen Aktionen oder externer Kommunikation.
- [ ] Bei LangGraph-Interrupts sind Checkpointer, stabile `thread_id`, Resume-Pfad sowie Ablehnung und Timeout vorgesehen.
- [ ] Der Mensch erhält die Informationen, die für eine fundierte Freigabe nötig sind.
- [ ] Multi-Agent wird nur eingesetzt, wenn Spezialisierung, Verantwortlichkeit oder Skalierung einen konkreten Vorteil bringt.
- [ ] Muster, Rollen, Übergaben und gemeinsamer State bzw. Nachrichtenformate sind definiert.
- [ ] Schleifen, Ping-Pong und unklare Endzustände zwischen Agenten sind begrenzt.
- [ ] Skills sind für wiederverwendbare Abläufe klar abgegrenzt, mit passenden Metadaten und Anwendungsgrenzen versehen.

## Evaluation und Regression

- [ ] Ein repräsentatives Testset enthält normale, schwierige, negative und nicht lösbare Fälle.
- [ ] Erwartetes Verhalten, zulässige Abweichungen und Fehlerkriterien sind pro Testfall beschrieben.
- [ ] Tool-Auswahl, Parameter, unnötige Tool-Aufrufe und Verweigerungen werden geprüft.
- [ ] RAG wird separat auf Retrieval-Qualität, Quellenabdeckung und Grounding geprüft.
- [ ] End-to-End-Läufe werden nach Änderungen an Prompt, Modell, Tools, State oder Datenquellen erneut bewertet.
- [ ] LLM-as-Judge nutzt eine klare Bewertungsrubrik und wird stichprobenartig kontrolliert.
- [ ] Evaluationsmetriken bilden Produktziele wie Qualität, Sicherheit, Kosten und Latenz ab.

## Sicherheit und Datenschutz

- [ ] API-Schlüssel und andere Geheimnisse liegen in Secret Stores oder Umgebungsvariablen, nicht in Prompts und Logs.
- [ ] Modell und Agent erhalten nur die minimal nötigen Berechtigungen und Tools.
- [ ] Eingaben, Tool-Parameter und externe Tool-Ergebnisse werden validiert.
- [ ] Prompt Injection und Datenabfluss aus Web-, Datei- und Tool-Inhalten sind berücksichtigt.
- [ ] Externe Inhalte werden als nicht vertrauenswürdige Daten behandelt, nicht als Systemanweisungen.
- [ ] Schreibaktionen und externe Kommunikation haben geeignete Freigabe-, Audit- oder Rücknahmemöglichkeiten.
- [ ] Logs, Traces und Checkpoints vermeiden unnötige personenbezogene oder vertrauliche Daten; Aufbewahrung ist geregelt.

## Observability und Freigabe

- [ ] Traces oder strukturierte Logs machen Modell, Prompt-Version, Konfiguration, Tools und Fehler nachvollziehbar.
- [ ] State-Änderungen, Checkpoints und relevante Retrieval-Ergebnisse lassen sich bei Bedarf untersuchen.
- [ ] Qualität wird nicht aus einem technisch erfolgreichen Lauf allein abgeleitet.
- [ ] Tokenverbrauch, Kosten, Latenz und Fehlerraten werden für den vorgesehenen Einsatz überwacht.
- [ ] Fehler führen zu einer nachvollziehbaren Klassifikation und zu geeigneten Fallbacks oder Eskalationen.
- [ ] Dokumentation beschreibt Zweck, Grenzen, Datenquellen, Tools und Betriebsannahmen.
- [ ] Freigabeentscheidung ist festgehalten: freigeben, nacharbeiten oder bewusst auf eine Demo begrenzen.

## Optional: Produktionshärtung

Diese Punkte sind abhängig von Risiko, Last und Betriebsumgebung zusätzlich zu prüfen:

- [ ] Modell-Routing, Provider-Fallbacks oder Circuit Breaker sind bei Bedarf eingerichtet.
- [ ] Kosten- und Tokenbudgets besitzen bei Bedarf messbare Schwellen und Reaktionen.
- [ ] Replay oder detaillierte Trace-Aufzeichnung ist für Debugging und Compliance erforderlich und datenschutzgerecht konfiguriert.
- [ ] Protokolle wie MCP, A2A oder AG-UI werden nur genutzt, wenn die jeweilige Integration sie benötigt.
- [ ] Nach Störungen oder Sicherheitsereignissen werden Ursachen ausgewertet und in Tests oder Schutzregeln überführt.

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
| Kontrollschicht | [Agent Harness]({{ '/07-qualitaet-sicherheit/agent-harness.html' | relative_url }}) |
| Betrieb | [Minimum Viable Agent Stack]({{ '/08-deployment-betrieb/minimum-viable-agent-stack.html' | relative_url }}) |

---

**Version:** 1.1<br>
**Stand:** Oktober 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
