# PMO-Korpus: Projekt Kompass

## Thema

**Ein KI-gestützter PMO-Assistent für ein internes Projekt: Entscheidungen, offene Punkte und Risiken aus Meetings verlässlich zusammenfassen und mit Quellen belegen.**

## Fiktives Szenario

Die Nordlicht Software GmbH (fiktiv) führt "Projekt Kompass" durch: die Einführung eines internen KI-gestützten Recherche- und Wissensassistenten für ihre Fachabteilungen. Projektleiterin Mara Vogt steuert das Vorhaben zusammen mit Jonas Reiter (IT-Architektur), Elif Kaya (Fachbereich Vertrieb), Dr. Thomas Brandt (Datenschutz/Compliance) und Sponsorin Sabine Holler (Geschäftsführung). Der Korpus enthält die Projekt- und Meeting-Unterlagen dieses fiktiven Projekts von März bis Mai 2026.

## Warum dieses Thema passt

- Einsteigergeeignet: Der Use Case ist direkt verständlich: Fragen zu Entscheidungen, Risiken und offenen Punkten stellen und Antworten mit Quellen erhalten.
- Passt zum Kurs: RAG, Embeddings, ChromaDB, Citations, Evaluation, HITL und Agenten lassen sich am PMO-Fall natürlich aufbauen.
- Realistische Mehrdeutigkeit: Entscheidungen werden revidiert, Risiken ändern ihren Status, offene Punkte bleiben ungeklärt — genau die Fälle, die ein kontrollierter Agent robust behandeln muss.
- Didaktisch sauber: Konflikt, Versionierung, Unsicherheit und Prompt-Injection lassen sich an konkreten Dokumentenpaaren zeigen statt nur abstrakt zu erklären.
- Datenschutzarm: Alle Personen, Firmen und Inhalte sind fiktiv.

## Korpusumfang

Der Korpus enthält **22 kuratierte Wissensartefakte**: 13 PDFs, 7 Markdown-Dateien und 2 CSV-Dateien. Vier neue Dokumente erweitern ihn um zwei längere PMO-Texte sowie kontrollierte Quellen aus einem Fremdprojekt und einen überholten Entwurf.

> [!NOTE]
> Der Ordner heißt jetzt `korpus_pmo_assistent`. Damit stimmen Pfad, Use Case und Leitprojekt überein. Ältere Verweise auf `korpus_research` müssen auf diesen Pfad umgestellt werden.

## Maschinenlesbare Metadaten

Die Datei `metadata.json` beschreibt jedes Dokument mit stabilen Feldern für Retrieval, Filterung und Evaluation:

- `corpus_part`: `project` für Projekt-/Meeting-Artefakte
- `document_type`: z. B. `meeting_protokoll`, `decision_log`, `risikoliste`
- `date`, `stakeholders`, `priority`
- `has_decision`, `has_open_question`, `decision_ids`, `risk_ids`
- `topics` und `recommended_modules`
- `project_id`, `source_status` und `source_authority` für Projektfilter und Quellenprüfung

Empfehlung für den Unterricht: In Tool Loop/RAG Grundlagen zuerst mit einem Teil der Protokolle arbeiten und den Korpus erst danach vollständig verwenden.

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
| `meilensteinplan_phasen_kompass.md` | Meilensteinplan | nein | ja (Gates) | alle | hoch |
| `projektbudget_kostenstatus_q2_2026.csv` | Controlling | nein | ja (Forecast) | Sabine Holler, Jonas Reiter | hoch |
| `meeting_notizen_raw_2026-05-19.md` | Rohnotizen | nein | ja (Rechte/Rollen) | Mara Vogt, Jonas Reiter, Dr. Thomas Brandt | mittel |
| `change_request_cr02_cloud_vektordatenbank.md` | Änderungsantrag | ja (CR-02) | nein | Jonas Reiter | hoch |
| `ressourcen_kapazitaetsmatrix_2026.csv` | Ressourcenplanung | nein | ja (Engpässe) | alle | mittel |
| `anforderungskatalog_pmo_assistent_v1.md` | Langer Anforderungskatalog mit Abnahmekriterien | nein | ja (Zugriffsregeln, Anbieter) | Mara Vogt, Jonas Reiter, Dr. Thomas Brandt | hoch |
| `statusbericht_projekt_kompass_2026-05-20.md` | Langer Projektstatusbericht mit Budget, Terminen und Abhängigkeiten | nein | ja (Pilotfreigabe) | alle | hoch |
| `protokoll_fremdprojekt_nordstern_2026-05-14.md` | Ähnliches Protokoll eines anderen Projekts; gezielter Retrieval-Distraktor | ja (Nordstern) | ja (Support-Übergabe) | Nordstern-Team | mittel |
| `entwurf_architekturentscheidung_pmo_2026-03-10_ueberholt.md` | Nicht freigegebener, überholter Architekturentwurf | nein | ja (damalige Prüfungen) | Jonas Reiter | niedrig |

Die beiden Distraktoren sind absichtlich enthalten. `corpus_part`, `project_id`, `source_status` und `source_authority` unterscheiden Projektquellen, Fremdprojekt, Arbeitsnotizen und überholten Entwurf. Filter und Quellenprüfung sollen verhindern, dass ein ähnlicher Treffer als gültige Aussage zu Projekt Kompass verwendet wird.

## Empfohlene Nutzung im Kurs

1. Tool Loop/RAG Grundlagen: Keyword-Suche vs. semantische Suche auf den Meeting-Protokollen.
2. RAG Grundlagen: RAG-Chain und RAG-Agent mit Quellenpflicht auf dem gesamten Korpus, inkl. Konflikt- und Versionierungsfällen.
3. RAG-Agent/Agent Security Best Practices: Eval-Fragen gegen Retrieval- und Antwortqualität prüfen, insbesondere die Edge Cases.
4. Sessions, Checkpointing und Memory/Agentic RAG: Unsicherheit, offene Punkte, Prompt Injection (Dokument 9) und HITL diskutieren.
5. Multi-Agent Patterns/Supervisor Pattern: strukturierte CSV-Daten für Budget-, Status- und Kapazitätsfragen verwenden.
6. Structured Output/LCEL Chains/Human in the Loop/DeepAgents Skill PMO-Assistent: Rohnotizen in ein strukturiertes Meeting-Ergebnis überführen.
7. DeepAgent Multi-Skill: Teilnehmer bauen eine Variante mit eigenem PMO-Korpus oder Zusatzdokumenten.

## Eval-Sets

Die passenden Eval-Dateien liegen unter `02_daten/05_sonstiges/`:

| Datei | Rolle | Hinweis |
|---|---|---|
| `eval_pmo.json` | reguläre Fragen | Enthält Fragen zum PMO-Korpus. |
| `eval_pmo_edge.json` | Edge Cases | Enthält Negativ-, Konflikt-, Mehrdeutigkeits-, Prompt-Injection- und Versionierungsfälle. |

Die reguläre Eval enthält zusätzlich Fragen zu den langen PMO-Dokumenten. Das Edge-Set prüft, ob Fremdprojekt-Angaben und der nicht freigegebene Entwurf korrekt eingeordnet werden.

Die früheren `eval_research*`-Dateinamen wurden abgelöst; Notebooks und Dokumentation verweisen auf die neuen Dateien.

## Gute Eval-Fragetypen

| Typ | Beispiel |
|---|---|
| Faktisch | Wer ist Projektleiterin von Projekt Kompass? |
| Vergleich | Wie unterscheidet sich die Formulierung zu ChromaDB am 17.03. von der am 31.03.? |
| Anwendung | Welche offenen Punkte bestehen laut Follow-up-Tracker? |
| Quantitativ | Wie hoch ist die Forecast-Abweichung im Kostenstatus? |
| Strukturiert | Wer ist im Mai mit hoher Kapazitätsauslastung eingeplant? |
| Konflikt | Welche Entscheidung zur Vektordatenbank gilt aktuell — D1 oder D2? |
| Versionierung | Wie hat sich der Status von Risiko R2 zwischen dem 17.03. und dem 28.04. verändert? |
| Negativ | Wie hoch ist das exakte Projektbudget in Euro? |

---

**Stand:** Oktober 2026
