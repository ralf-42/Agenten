---
layout: default
title: Navigationsumstellung November 2026
nav_exclude: true
search_exclude: true
has_toc: false
---

# Navigationsumstellung November 2026

Die Dokumentation wird nach sieben Themenbereichen gegliedert. Die Dateistruktur folgt derselben Zuordnung. Bei Ressourcen und Rechtliches bleiben Titel, Reihenfolge, Unterpunkte, Fachseiten und Pfade erhalten. Auf ausdrücklichen Wunsch folgen ihre Indexseiten ebenfalls dem gemeinsamen Aufbau.

## Arbeitsplan

- [x] Aktiven Dateibestand und Navigationsmetadaten inventarisieren; Git-Ausgangsstand prüfen.
- [x] Bestehende Fachartikel den sieben Hauptbereichen zuordnen.
- [x] Bereichsübersichten und Startseite anpassen, ohne Fachartikel umfassend umzuschreiben.
- [x] Die sechs Arbeitsreiter des Agent Labs mit identischen Namen auf Ebene 2 verorten.
- [x] Themen über die Seitenleiste erschließen und wechselseitige Links zwischen Dokumentation und Lab ergänzen.
- [x] Auf zusätzliche Bereichsleiste verzichten; Suche und „Agent Lab öffnen ↗“ oben beibehalten.
- [x] Dateien in passende Haupt- und Unterverzeichnisse verschieben.
- [x] Interne Verweise auf die neuen Ziele umstellen; historische HTML-Adressen mit `redirect_from` erhalten.
- [x] Navigationshierarchie, Weiterleitungen, interne Links und unveränderte Ressourcen-/Rechtsfachseiten prüfen.
- [x] Alle 16 Bereichs- und Kategorieindizes einschließlich Ressourcen und Rechtliches auf „Einführung → Themen → Weiterführend“ vereinheitlichen; Startseiten-Tabelle angleichen.
- [x] Vorhandene Lab-Tests ausführen und eine Prüfung zur Übereinstimmung der Navigation ergänzen.
- [x] Darstellung und Reiterwechsel des Labs bei 1440 und 390 Pixeln in Headless Edge prüfen.
- [x] Header und Seiteneinstieg mit dem vorhandenen Theme bei Desktop- und Mobilbreite prüfen.
- [ ] Zwei Links in der geschützten Projekt-README nach Freigabe auf die neuen Dateipfade umstellen (DeepAgents und Kursüberblick).

## Zielstruktur

```text
docs/
├── index.md
├── 01-einstieg/
├── 02-architekturen/
├── 03-entwicklung/
│   ├── modelle-zugang/
│   ├── prompts-werkzeuge/
│   ├── kontext-wissen/
│   ├── loop-engineering.md
│   ├── state-checkpoints/
│   └── checkliste-agentensystem.md
├── 04-frameworks/
│   ├── langchain/
│   ├── langgraph/
│   └── langsmith/
├── 05-qualitaet-sicherheit/
├── 06-praxis-betrieb/
├── 07-verantwortung/
├── 10-ressourcen/                  Gliederung erhalten
├── 11-rechtliches/                 Gliederung erhalten
└── visualisierungen/
    └── agent_patterns_lab/
```

## Gleiche Begriffe in Lab und Dokumentation

| Arbeitsreiter im Lab | Hauptbereich | Ebene 2 |
|---|---|---|
| Agenten-Architekturen | Architekturen | Agenten-Architekturen |
| Kontext & Wissen | Entwicklung | Kontext & Wissen |
| Loop Engineering | Entwicklung | Loop Engineering |
| State & Checkpoints | Entwicklung | State & Checkpoints |
| Agent Harness | Qualität & Sicherheit | Agent Harness |
| Evaluation | Qualität & Sicherheit | Evaluation |

Die Themen stehen in der Seitenleiste; eine zusätzliche Bereichsleiste im Dokumentationsheader entfällt. Oben bleiben die Suche und die Zusatzlinks zum Agent Lab und zum Repository. `_data/course_navigation.yml` hält die sieben Bereiche als Referenz für die Navigationsprüfung fest. Der Startbereich des Labs bietet dieselben sieben Einstiegspunkte. Änderungen an diesen Bezeichnungen müssen an beiden Stellen nachgeführt werden.

## Regeln für weitere Umgliederungen

Vor jedem Verschieben werden Quell- und Zielpfade sowie bestehende Weiterleitungen vollständig inventarisiert. Änderungen an internen Links werden zuerst vorbereitet und geprüft, anschließend gemeinsam angewendet. Bereits vorhandene historische Weiterleitungen bleiben erhalten; zusätzliche alte HTML-Adressen werden ergänzt. Relative Links sind gegen die neue Ausgabetiefe zu prüfen. Dateien außerhalb von `docs/`, etwa Notebooks und Projektregeln, werden auf der Website über Repository-Links erschlossen.

Die PDF-Begleitdatei `modellauswahl.pdf` liegt jetzt neben dem Artikel unter `03-entwicklung/modelle-zugang/`. `redirect_from` gilt für HTML-Seiten; eine Weiterleitung der bisherigen PDF-Adresse ist damit nicht eingerichtet.

## Prüfgrenzen

Ergebnis: neun Lab-Testsuiten ohne Fehler; Navigationshierarchie, interne Liquid- und relative Artikellinks sowie die Links aus dem Lab geprüft. 66 Markdown-Dateien und eine unverändert erhaltene PDF-Begleitdatei wurden verschoben. Die 68 Weiterleitungen umfassen die bisherigen HTML-Adressen und bereits zuvor vorhandene historische Adressen. Gliederung und Fachseiten von Ressourcen und Rechtliches sind unverändert; ihre Indexseiten wurden in das gemeinsame Schema überführt.

Die Browserprüfung der Dokumentation verwendet eine Layoutvorschau mit dem vorhandenen veröffentlichten Theme. Ein vollständiger lokaler Jekyll-Build war nicht möglich: Ruby/Jekyll sind nicht installiert, und der Docker-Dienst läuft nicht. Das tatsächliche Lab wurde lokal im Browser geprüft. Änderungen sind noch nicht veröffentlicht.

**Stand:** 24. November 2026
