# Meeting- & Research-Briefing-Korpus: Projekt Kompass

## Thema

**Ein KI-gestützter Meeting- & Research-Briefing-Agent für ein internes Projekt: Entscheidungen, offene Punkte und Risiken aus Meetings verlässlich zusammenfassen und mit Quellen belegen.**

## Fiktives Szenario

Die Nordlicht Software GmbH (fiktiv) führt "Projekt Kompass" durch: die Einführung eines internen KI-gestützten Recherche- und Wissensassistenten für ihre Fachabteilungen. Projektleiterin Mara Vogt steuert das Vorhaben zusammen mit Jonas Reiter (IT-Architektur), Elif Kaya (Fachbereich Vertrieb), Dr. Thomas Brandt (Datenschutz/Compliance) und Sponsorin Sabine Holler (Geschäftsführung). Der Korpus enthält die Projekt- und Meeting-Unterlagen dieses fiktiven Projekts von März bis Mai 2026.

## Warum dieses Thema passt

- Einsteigergeeignet: Der Use Case ist direkt verständlich: Fragen zu Entscheidungen, Risiken und offenen Punkten stellen und Antworten mit Quellen erhalten.
- Passt zum Kurs: RAG, Embeddings, ChromaDB, Citations, Evaluation, HITL und Agenten lassen sich am Meeting-Briefing-Fall natürlich aufbauen.
- Realistische Mehrdeutigkeit: Entscheidungen werden revidiert, Risiken ändern ihren Status, offene Punkte bleiben ungeklärt — genau die Fälle, die ein kontrollierter Agent robust behandeln muss.
- Didaktisch sauber: Konflikt, Versionierung, Unsicherheit und Prompt-Injection lassen sich an konkreten Dokumentenpaaren zeigen statt nur abstrakt zu erklären.
- Datenschutzarm: Alle Personen, Firmen und Inhalte sind fiktiv.

## Korpusumfang

Der Korpus enthält **18 kuratierte PDFs**: 13 neue Meeting- und Projektartefakte zu "Projekt Kompass" sowie 5 weiterverwendete Fachartikel als Recherche-Hintergrund, die das fiktive Projektteam bei der Tool-Bewertung selbst sichtet.

> [!NOTE]
> Der Ordner heißt jetzt `korpus_meeting_briefing`. Damit stimmen Pfad, Use Case und Leitprojekt überein. Ältere Verweise auf `korpus_research` müssen auf diesen Pfad umgestellt werden.

## Maschinenlesbare Metadaten

Die Datei `metadata.json` beschreibt jedes Dokument mit stabilen Feldern für Retrieval, Filterung und Evaluation:

- `corpus_part`: `project` für Projekt-/Meeting-Artefakte, `background` für Fachartikel
- `document_type`: z. B. `meeting_protokoll`, `decision_log`, `risikoliste`, `fachartikel`
- `date`, `stakeholders`, `priority`
- `has_decision`, `has_open_question`, `decision_ids`, `risk_ids`
- `topics` und `recommended_modules`

Empfehlung für den Unterricht: In M11/M12 zuerst mit `corpus_part = "project"` arbeiten. Die Fachartikel aus `corpus_part = "background"` sollten erst später oder gezielt zugeschaltet werden, damit sie die kurzen Projektartefakte im Retrieval nicht überlagern.

## Enthaltene Dokumente — Meeting- & Projektartefakte

| Datei | meeting_context | entscheidung | offene_frage | stakeholder | priorität |
|---|---|---|---|---|---|
| `projektauftrag_kompass.pdf` | Projektunterlage | nein | nein | Sabine Holler, Mara Vogt | hoch |
| `stakeholder_rollenliste.pdf` | Projektunterlage | nein | nein | alle | mittel |
| `risikoliste_v1.pdf` | Projektunterlage | nein | ja (R1-R4) | alle | hoch |
| `protokoll_kickoff_2026-03-03.pdf` | Kickoff | nein | ja (Tool-Auswahl) | alle | mittel |
| `protokoll_steuerkreis_2026-03-17.pdf` | Steuerkreis | ja (D1) | nein | Jonas Reiter | hoch |
| `protokoll_steuerkreis_2026-03-31.pdf` | Steuerkreis | ja (D1, uneindeutig bestätigt) | nein | Jonas Reiter | mittel |
| `protokoll_steuerkreis_2026-04-14.pdf` | Steuerkreis | ja (D2, widerspricht D1) | nein | Jonas Reiter | hoch |
| `protokoll_steuerkreis_2026-04-28.pdf` | Steuerkreis | ja (D3, Risikostatus) | nein | Dr. Thomas Brandt | mittel |
| `protokoll_fachbereich_workshop_2026-05-05.pdf` | Workshop | nein | nein | Elif Kaya | hoch |
| `protokoll_steuerkreis_2026-05-19.pdf` | Steuerkreis | nein | ja (Rechte-/Rollensteuerung) | Mara Vogt | hoch |
| `entscheidungsprotokoll_gesamt.pdf` | Decision Log | ja (D1-D3, kumulativ) | nein | alle | hoch |
| `follow_up_tracker.pdf` | Tracker | nein | ja (1 offenes Item) | alle | mittel |
| `agenda_vorlage_steuerkreis.pdf` | Vorlage | nein | nein | Mara Vogt | niedrig |

## Enthaltene Dokumente — Recherche-Hintergrund

| Datei | arXiv | Rolle im Korpus |
|---|---|---|
| `rag_survey_2312_10997.pdf` | https://arxiv.org/abs/2312.10997 | Recherche-Hintergrund des Projektteams zur RAG-Technologiebewertung |
| `llm_autonomous_agents_survey_2308_11432.pdf` | https://arxiv.org/abs/2308.11432 | Recherche-Hintergrund zu LLM-basierten Agenten |
| `prompt_engineering_survey_2402_07927.pdf` | https://arxiv.org/abs/2402.07927 | Recherche-Hintergrund zu Prompting-Techniken |
| `ragas_evaluation_2309_15217.pdf` | https://arxiv.org/abs/2309.15217 | Recherche-Hintergrund zur RAG-Evaluation |
| `robust_rag_irrelevant_context_2310_01558.pdf` | https://arxiv.org/abs/2310.01558 | Recherche-Hintergrund zu Robustheit gegen irrelevanten Kontext |

## Empfohlene Nutzung im Kurs

1. M11/M12: Keyword-Suche vs. semantische Suche auf den Meeting-Protokollen.
2. M13/M14: RAG-Chain und RAG-Agent mit Quellenpflicht auf dem gesamten Korpus, inkl. Konflikt- und Versionierungsfällen.
3. M15/M24: Eval-Fragen gegen Retrieval- und Antwortqualität prüfen, insbesondere die Edge Cases.
4. M17/M23: Unsicherheit, offene Punkte, Prompt Injection (Dokument 9) und HITL diskutieren.
5. M36: Teilnehmer bauen eine Variante mit eigenem Meeting-Korpus oder Zusatzdokumenten.

## Eval-Sets

Die passenden Eval-Dateien liegen unter `02_daten/05_sonstiges/`:

| Datei | Rolle | Hinweis |
|---|---|---|
| `eval_meeting_briefing.json` | reguläre Fragen | Enthält Fragen zum Meeting- & Research-Briefing-Korpus. |
| `eval_meeting_briefing_edge.json` | Edge Cases | Enthält Negativ-, Konflikt-, Mehrdeutigkeits-, Prompt-Injection- und Versionierungsfälle. |

Die früheren `eval_research*`-Dateinamen wurden abgelöst; Notebooks und Dokumentation verweisen auf die neuen Dateien.

## Gute Eval-Fragetypen

| Typ | Beispiel |
|---|---|
| Faktisch | Wer ist Projektleiterin von Projekt Kompass? |
| Vergleich | Wie unterscheidet sich die Formulierung zu ChromaDB am 17.03. von der am 31.03.? |
| Anwendung | Welche offenen Punkte bestehen laut Follow-up-Tracker? |
| Konflikt | Welche Entscheidung zur Vektordatenbank gilt aktuell — D1 oder D2? |
| Versionierung | Wie hat sich der Status von Risiko R2 zwischen dem 17.03. und dem 28.04. verändert? |
| Negativ | Wie hoch ist das exakte Projektbudget in Euro? |

---

**Stand:** Juli 2026
