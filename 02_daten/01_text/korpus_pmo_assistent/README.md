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

Der Korpus enthält **18 kuratierte Wissensartefakte**: 13 PDFs sowie ergänzende Markdown- und CSV-Dateien zu Meeting- und Projektartefakten von "Projekt Kompass".

> [!NOTE]
> Der Ordner heißt jetzt `korpus_pmo_assistent`. Damit stimmen Pfad, Use Case und Leitprojekt überein. Ältere Verweise auf `korpus_research` müssen auf diesen Pfad umgestellt werden.

## Maschinenlesbare Metadaten

Die Datei `metadata.json` beschreibt jedes Dokument mit stabilen Feldern für Retrieval, Filterung und Evaluation:

- `corpus_part`: `project` für Projekt-/Meeting-Artefakte
- `document_type`: z. B. `meeting_protokoll`, `decision_log`, `risikoliste`
- `date`, `stakeholders`, `priority`
- `has_decision`, `has_open_question`, `decision_ids`, `risk_ids`
- `topics` und `recommended_modules`

Empfehlung für den Unterricht: In M10/M11 zuerst mit einem Teil der Protokolle arbeiten und den Korpus erst danach vollständig verwenden.

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

## Empfohlene Nutzung im Kurs

1. M10/M11: Keyword-Suche vs. semantische Suche auf den Meeting-Protokollen.
2. M12/M13: RAG-Chain und RAG-Agent mit Quellenpflicht auf dem gesamten Korpus, inkl. Konflikt- und Versionierungsfällen.
3. M14/M23: Eval-Fragen gegen Retrieval- und Antwortqualität prüfen, insbesondere die Edge Cases.
4. M16/M22: Unsicherheit, offene Punkte, Prompt Injection (Dokument 9) und HITL diskutieren.
5. M19/M20/M27/M38: strukturierte CSV-Daten für Budget-, Status- und Kapazitätsfragen verwenden.
6. M04/M06/M17/M34: Rohnotizen in ein strukturiertes Meeting-Ergebnis überführen.
7. M35: Teilnehmer bauen eine Variante mit eigenem PMO-Korpus oder Zusatzdokumenten.

## Eval-Sets

Die passenden Eval-Dateien liegen unter `02_daten/05_sonstiges/`:

| Datei | Rolle | Hinweis |
|---|---|---|
| `eval_pmo.json` | reguläre Fragen | Enthält Fragen zum PMO-Korpus. |
| `eval_pmo_edge.json` | Edge Cases | Enthält Negativ-, Konflikt-, Mehrdeutigkeits-, Prompt-Injection- und Versionierungsfälle. |

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

**Stand:** Juli 2026
