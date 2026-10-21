# Korpus-Qualitätsprüfung

**Stand:** Oktober 2026

## Ergebnis

Der PMO-Korpus (Projekt Kompass) ist für die überarbeitete Kursversion geeignet.

| Kriterium | Ergebnis |
|---|---|
| Umfang | 22 Wissensartefakte: 13 PDFs, 7 Markdown-Dateien und 2 CSV-Dateien; README, Qualitätsdatei und Metadaten werden nicht indexiert |
| Tiefe der Projektartefakte | Die 13 neuen Projekt-PDFs wurden auf ca. 300-500 Wörter erweitert; aktuelle Spanne: 321-396 Wörter |
| Dateiformat | Die 13 PDFs haben gültige `%PDF`-Header; Markdown und CSV werden über den Mehrformat-Lader mit MarkItDown eingelesen |
| Umlaute | Alle neuen PDFs enthalten echte deutsche Umlaute, kein Mojibake (mit `PyPDFLoader`-Extraktion verifiziert) |
| Thematische Perspektiven | Projektunterlagen, Meeting-Protokolle, Entscheidungs-Log, Risikoliste, Follow-up-Tracker, Agenda-Vorlage, Meilensteine, Budget, Rohnotizen, Change Request, Ressourcen |
| Eingebaute Edge Cases | Konflikt (D1 vs. D2), Mehrdeutigkeit, Versionierung (Risiko R2), Unsicherheit, Prompt Injection, Fremdprojekt-Treffer und überholter Entwurf |
| Lange Dokumente | Anforderungskatalog (1.026 Wörter) und Statusbericht (1.055 Wörter) enthalten relevante Informationen in mehreren Abschnitten; Eval-Fragen zielen auf Anfang, Mittelteil und Schluss des Katalogs |
| Quellenfilter | Metadaten enthalten `project_id`, `source_status` und `source_authority`; Fremdprojekt und nicht freigegebener Entwurf sind explizit markiert |
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
| Lange PMO-Dokumente | `anforderungskatalog_pmo_assistent_v1.md`, `statusbericht_projekt_kompass_2026-05-20.md` |
| Kontrollierte Distraktoren | `protokoll_fremdprojekt_nordstern_2026-05-14.md`, `entwurf_architekturentscheidung_pmo_2026-03-10_ueberholt.md` |

## Ground-Truth-Abdeckung

Das Eval-Set `eval_pmo.json` enthält 38 reguläre Fragen und deckt die fachlichen PMO-Quellen einschließlich der beiden langen Dokumente ab. Drei Fragen zum Anforderungskatalog zielen bewusst auf Informationen aus Anfang, Mittelteil und Schluss. `eval_pmo_edge.json` enthält 20 Fälle und prüft zusätzlich die Zuordnung zum richtigen Projekt sowie den Umgang mit einem nicht freigegebenen Entwurf. Die Fragetypen sind: negativ, out_of_scope, prompt_injection, konflikt, mehrdeutig, unsicherheit, versionierung, vergleich_mit_grenze und quellenautoritaet.

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
| `anforderungskatalog_pmo_assistent_v1.md` | q39, q40, q42, q43 |
| `statusbericht_projekt_kompass_2026-05-20.md` | q41 |
| `protokoll_fremdprojekt_nordstern_2026-05-14.md` | e17, e19 |
| `entwurf_architekturentscheidung_pmo_2026-03-10_ueberholt.md` | e18, e20 |

## Hinweise für den Unterricht

- In M10/M11 zuerst mit den Meeting-Protokollen (3-5 Dokumente) arbeiten, damit Chunking und Retrieval sichtbar bleiben.
- In M12/M13 den gesamten Korpus verwenden.
- In M14/M23 mit `eval_pmo.json` starten und Edge-Cases aus `eval_pmo_edge.json` erst danach hinzunehmen.
- Der Konflikt zwischen D1 (17.03.) und D2 (14.04.) sowie die Versionierung von Risiko R2 eignen sich besonders gut, um zu zeigen, warum ein Agent nicht unkritisch die erste gefundene Quelle zitieren darf, sondern Datum und Aktualität prüfen muss.
- Das zitierte Prompt-Injection-Beispiel in `protokoll_fachbereich_workshop_2026-05-05.pdf` eignet sich für M16/M22, um zu zeigen, dass zitierte Inhalte in Quelldokumenten nicht automatisch als Systemanweisung gelten dürfen.
- Die ergänzten Markdown- und CSV-Dateien eignen sich für Mehrformat-Laden, Tabellenfragen, Statussynthese und die Überführung von Rohnotizen in strukturierte Ergebnisse.
- Die langen Dokumente enthalten prüfbare Details an unterschiedlichen Stellen. Für einen Chunking-Vergleich sollten dieselben Fragen mit mehreren Chunk-Größen und Overlap-Werten beantwortet und Trefferposition sowie Quellenbeleg protokolliert werden.
- Das Nordstern-Protokoll ist ein kontrollierter Fremdprojekt-Treffer. Es soll bei Projekt-Kompass-Fragen durch `project_id`-Filter ausgeschlossen werden; ohne Filter muss die Antwort den Projektkontext zuverlässig prüfen.
- Der Architekturentwurf vom 10.03.2026 ist kein gültiger Beschluss. `source_status` und `source_authority` kennzeichnen ihn als überholt und nicht freigegeben; spätere offizielle Quellen tragen den aktuellen Entscheidungsstand.
