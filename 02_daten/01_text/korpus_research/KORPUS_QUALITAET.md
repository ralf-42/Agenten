# Korpus-Qualitätsprüfung

**Stand:** 2026-07-02

## Ergebnis

Der Meeting- & Research-Briefing-Korpus (Projekt Kompass) ist für die überarbeitete Kursversion geeignet.

| Kriterium | Ergebnis |
|---|---|
| Umfang | 18 PDF-Dateien (13 neue Meeting-/Projektartefakte, 5 weiterverwendete Fachartikel) |
| Tiefe der Projektartefakte | Die 13 neuen Projekt-PDFs wurden auf ca. 300-500 Wörter erweitert; aktuelle Spanne: 321-396 Wörter |
| Dateiformat | Alle Dateien haben gültigen `%PDF`-Header, mit `PyPDFLoader` geprüft |
| Umlaute | Alle neuen PDFs enthalten echte deutsche Umlaute, kein Mojibake (mit `PyPDFLoader`-Extraktion verifiziert) |
| Thematische Perspektiven | Projektunterlagen, Meeting-Protokolle, Entscheidungs-Log, Risikoliste, Follow-up-Tracker, Agenda-Vorlage, RAG-/Agenten-Recherche-Hintergrund |
| Eingebaute Edge Cases | Konflikt (D1 vs. D2), Mehrdeutigkeit, Versionierung (Risiko R2), Unsicherheit, Prompt Injection (zitiert, nicht auszuführen) |
| Datenschutz | Vollständig fiktive Firma, Personen und Inhalte (Nordlicht Software GmbH, Projekt Kompass) |
| Einsteigerpassung | Geeignet, wenn im Unterricht mit Teilkorpus und geführten Fragen gestartet wird |

## Dokumentgruppen

| Gruppe | Dateien |
|---|---|
| Projektunterlagen | `projektauftrag_kompass.pdf`, `stakeholder_rollenliste.pdf`, `risikoliste_v1.pdf` |
| Meeting-Protokolle | `protokoll_kickoff_2026-03-03.pdf`, `protokoll_steuerkreis_2026-03-17.pdf`, `protokoll_steuerkreis_2026-03-31.pdf`, `protokoll_steuerkreis_2026-04-14.pdf`, `protokoll_steuerkreis_2026-04-28.pdf`, `protokoll_fachbereich_workshop_2026-05-05.pdf`, `protokoll_steuerkreis_2026-05-19.pdf` |
| Entscheidungs- und Nachverfolgungs-Dokumente | `entscheidungsprotokoll_gesamt.pdf`, `follow_up_tracker.pdf` |
| Vorlagen | `agenda_vorlage_steuerkreis.pdf` |
| Recherche-Hintergrund (RAG/Agenten) | `rag_survey_2312_10997.pdf`, `llm_autonomous_agents_survey_2308_11432.pdf`, `prompt_engineering_survey_2402_07927.pdf`, `ragas_evaluation_2309_15217.pdf`, `robust_rag_irrelevant_context_2310_01558.pdf` |

## Ground-Truth-Abdeckung

Das Eval-Set `eval_research.json` enthält 33 reguläre Fragen und deckt alle 13 neuen Dokumente sowie die 5 Recherche-Hintergrund-Dokumente ab. Für jedes neue Projektartefakt gibt es mindestens 2 reguläre Fragen. Das Edge-Case-Set `eval_research_edge.json` enthält 10 Fälle und deckt 8 Fragetypen ab: negativ, out_of_scope, prompt_injection, konflikt, mehrdeutig, unsicherheit, versionierung, vergleich_mit_grenze.

| Datei | Abdeckung |
|---|---|
| `projektauftrag_kompass.pdf` | q01, q02, q31 |
| `stakeholder_rollenliste.pdf` | q03, q20 |
| `risikoliste_v1.pdf` | q04, q21 |
| `protokoll_kickoff_2026-03-03.pdf` | q05, q22 |
| `protokoll_steuerkreis_2026-03-17.pdf` | q06, q23 |
| `protokoll_steuerkreis_2026-03-31.pdf` | q24, q33, e06 |
| `protokoll_steuerkreis_2026-04-14.pdf` | q07, q25, e05 |
| `protokoll_steuerkreis_2026-04-28.pdf` | q08, q26, e08 |
| `protokoll_fachbereich_workshop_2026-05-05.pdf` | q09, q27, e04 |
| `protokoll_steuerkreis_2026-05-19.pdf` | q10, q28, e07 |
| `entscheidungsprotokoll_gesamt.pdf` | q11, q19, q32 |
| `follow_up_tracker.pdf` | q12, q29 |
| `agenda_vorlage_steuerkreis.pdf` | q13, q30, e09 |
| `rag_survey_2312_10997.pdf` | q14 |
| `ragas_evaluation_2309_15217.pdf` | q15 |
| `llm_autonomous_agents_survey_2308_11432.pdf` | q16 |
| `prompt_engineering_survey_2402_07927.pdf` | q17 |
| `robust_rag_irrelevant_context_2310_01558.pdf` | q18 |

## Hinweise für den Unterricht

- In M11/M12 zuerst mit den Meeting-Protokollen (3-5 Dokumente) arbeiten, damit Chunking und Retrieval sichtbar bleiben.
- In M13/M14 den gesamten Korpus verwenden, inklusive der Recherche-Hintergrund-Dokumente.
- In M15/M24 mit `eval_research.json` starten und Edge-Cases aus `eval_research_edge.json` erst danach hinzunehmen.
- Der Konflikt zwischen D1 (17.03.) und D2 (14.04.) sowie die Versionierung von Risiko R2 eignen sich besonders gut, um zu zeigen, warum ein Agent nicht unkritisch die erste gefundene Quelle zitieren darf, sondern Datum und Aktualität prüfen muss.
- Das zitierte Prompt-Injection-Beispiel in `protokoll_fachbereich_workshop_2026-05-05.pdf` eignet sich für M17/M23, um zu zeigen, dass zitierte Inhalte in Quelldokumenten nicht automatisch als Systemanweisung gelten dürfen.
