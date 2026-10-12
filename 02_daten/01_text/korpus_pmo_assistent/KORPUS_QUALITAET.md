# Korpus-Qualitätsprüfung

**Stand:** Juli 2026

## Ergebnis

Der PMO-Korpus (Projekt Kompass) ist für die überarbeitete Kursversion geeignet.

| Kriterium | Ergebnis |
|---|---|
| Umfang | 18 Wissensartefakte: 13 PDFs, 3 Markdown-Dateien und 2 CSV-Dateien; README, Qualitätsdatei und Metadaten werden nicht indexiert |
| Tiefe der Projektartefakte | Die 13 neuen Projekt-PDFs wurden auf ca. 300-500 Wörter erweitert; aktuelle Spanne: 321-396 Wörter |
| Dateiformat | Die 13 PDFs haben gültige `%PDF`-Header; Markdown und CSV werden über den Mehrformat-Lader mit MarkItDown eingelesen |
| Umlaute | Alle neuen PDFs enthalten echte deutsche Umlaute, kein Mojibake (mit `PyPDFLoader`-Extraktion verifiziert) |
| Thematische Perspektiven | Projektunterlagen, Meeting-Protokolle, Entscheidungs-Log, Risikoliste, Follow-up-Tracker, Agenda-Vorlage, Meilensteine, Budget, Rohnotizen, Change Request, Ressourcen |
| Eingebaute Edge Cases | Konflikt (D1 vs. D2), Mehrdeutigkeit, Versionierung (Risiko R2), Unsicherheit, Prompt Injection (zitiert, nicht auszuführen) |
| Datenschutz | Vollständig fiktive Firma, Personen und Inhalte (Nordlicht Software GmbH, Projekt Kompass) |
| Einsteigerpassung | Geeignet, wenn im Unterricht mit Teilkorpus und geführten Fragen gestartet wird; CSV und Rohnotizen werden schrittweise eingeführt |

## Dokumentgruppen

| Gruppe | Dateien |
|---|---|
| Projektunterlagen | `projektauftrag_kompass.pdf`, `stakeholder_rollenliste.pdf`, `risikoliste_v1.pdf` |
| Meeting-Protokolle | `protokoll_kickoff_2026-03-03.pdf`, `protokoll_steuerkreis_2026-03-17.pdf`, `protokoll_steuerkreis_2026-03-31.pdf`, `protokoll_steuerkreis_2026-04-14.pdf`, `protokoll_steuerkreis_2026-04-28.pdf`, `protokoll_fachbereich_workshop_2026-05-05.pdf`, `protokoll_steuerkreis_2026-05-19.pdf` |
| Entscheidungs- und Nachverfolgungs-Dokumente | `entscheidungsprotokoll_gesamt.pdf`, `follow_up_tracker.pdf` |
| Vorlagen | `agenda_vorlage_steuerkreis.pdf` |
| Planung und Controlling | `meilensteinplan_phasen_kompass.md`, `projektbudget_kostenstatus_q2_2026.csv`, `ressourcen_kapazitaetsmatrix_2026.csv` |
| Roh- und Ergänzungsdokumente | `meeting_notizen_raw_2026-05-19.md`, `change_request_cr02_cloud_vektordatenbank.md` |

## Ground-Truth-Abdeckung

Das Eval-Set `eval_pmo.json` enthält 33 reguläre Fragen und deckt alle 18 Wissensartefakte ab. Die fünf ergänzten Artefakte sind jeweils mit mindestens einer gezielten Frage vertreten. Das Edge-Case-Set `eval_pmo_edge.json` enthält 16 Fälle und deckt 9 Fragetypen ab: negativ, out_of_scope, prompt_injection, konflikt, mehrdeutig, unsicherheit, versionierung, vergleich_mit_grenze, quellenautoritaet.

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
| `meilensteinplan_phasen_kompass.md` | q38 |
| `projektbudget_kostenstatus_q2_2026.csv` | q34 |
| `meeting_notizen_raw_2026-05-19.md` | q35 |
| `change_request_cr02_cloud_vektordatenbank.md` | q36 |
| `ressourcen_kapazitaetsmatrix_2026.csv` | q37 |

## Hinweise für den Unterricht

- In M10/M11 zuerst mit den Meeting-Protokollen (3-5 Dokumente) arbeiten, damit Chunking und Retrieval sichtbar bleiben.
- In M12/M13 den gesamten Korpus verwenden.
- In M14/M23 mit `eval_pmo.json` starten und Edge-Cases aus `eval_pmo_edge.json` erst danach hinzunehmen.
- Der Konflikt zwischen D1 (17.03.) und D2 (14.04.) sowie die Versionierung von Risiko R2 eignen sich besonders gut, um zu zeigen, warum ein Agent nicht unkritisch die erste gefundene Quelle zitieren darf, sondern Datum und Aktualität prüfen muss.
- Das zitierte Prompt-Injection-Beispiel in `protokoll_fachbereich_workshop_2026-05-05.pdf` eignet sich für M16/M22, um zu zeigen, dass zitierte Inhalte in Quelldokumenten nicht automatisch als Systemanweisung gelten dürfen.
- Die ergänzten Markdown- und CSV-Dateien eignen sich für Mehrformat-Laden, Tabellenfragen, Statussynthese und die Überführung von Rohnotizen in strukturierte Ergebnisse.
