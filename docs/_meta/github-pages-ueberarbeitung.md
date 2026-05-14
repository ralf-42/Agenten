---
layout: default
title: GitHub-Pages-Überarbeitung
nav_exclude: true
description: Dokumentation der Überarbeitungsschritte zur Struktur, Navigation und Linkpflege der GitHub Pages im Projekt Agenten
---

# GitHub-Pages-Überarbeitung im Projekt Agenten

Diese Datei dokumentiert die Überarbeitungsschritte, mit denen die GitHub-Pages-Dokumentation im Projekt `Agenten` aktualisiert, verschlankt und stärker an der Kurslogik ausgerichtet wurde.

## Ausgangslage

Die ursprüngliche Dokumentation war vor allem nach technischen Inhaltsbereichen gegliedert:

- `concepts`
- `frameworks`
- `deployment`
- `regulatory`
- `resources`
- `projects`
- `legal`

Diese Struktur war fachlich nachvollziehbar, aber für Lernende nicht optimal. Nutzer mussten häufig zuerst wissen, ob ein Thema eher unter Konzepten, Frameworks, Deployment oder Ressourcen liegt. Für einen Kurs ist aber eine lernpfadnahe Navigation hilfreicher.

## Zielbild

Das Ziel war eine schlanke GitHub-Pages-Struktur, die:

- der Kurs- und Notebook-Logik folgt,
- die Navigation kürzer und verständlicher macht,
- Regulatorik als inhaltliches Kapitel von Rechtlichem als formalem Pflichtbereich trennt,
- Ressourcen als Servicebereich behandelt,
- redundante Sammelseiten vermeidet,
- interne Links konsistent hält.

## Neue Hauptstruktur

Die Hauptnavigation wurde auf kurze, gut lesbare Bezeichnungen reduziert:

| Navigation | Verzeichnis |
|---|---|
| Start | `index.md` |
| Zuerst lesen | `01-start-navigation/zuerst-lesen.md` |
| Lernpfad | `01-start-navigation/lernpfad.md` |
| Orientierung & Entscheidung | `02-orientierung-entscheidung/` |
| Modelle & Provider | `03-modelle-provider-anpassung/` |
| Agenten-Implementierung | `04-agenten-implementierung/` |
| Frameworks | `05-frameworks/` |
| Multi-Agent & Erweiterungen | `06-multi-agent-erweiterungen/` |
| Qualität & Sicherheit | `07-qualitaet-sicherheit/` |
| Deployment & Betrieb | `08-deployment-betrieb/` |
| Regulatorik & Verantwortung | `09-regulatorik-verantwortung/` |
| Ressourcen | `10-ressourcen/` |
| Rechtliches | `11-rechtliches/` |

Die Verzeichnisnamen sind bewusst nummeriert, damit Dateisystem und Sidebar dieselbe Reihenfolge zeigen.

## Umstrukturierung der Verzeichnisse

Die alten langen oder technisch geprägten Ordner wurden in kurze, navigationstaugliche Slugs überführt.

| Alt | Neu |
|---|---|
| `orientierung/` mit Bedarfsanalyse | `02-orientierung-entscheidung/` |
| Modellauswahl, Provider-Mapping, Fine-Tuning und API-Setup | `03-modelle-provider-anpassung/` |
| `erste-agenten/`, `orchestrierung/`, `rag-kontext/`, `memory-hitl/` | `04-agenten-implementierung/` und `05-frameworks/` |
| `multi-agent/` | `06-multi-agent-erweiterungen/` |
| `qualitaet-sicherheit/` | `07-qualitaet-sicherheit/` |
| `deployment-capstone/` | `08-deployment-betrieb/` |
| `regulatorik/` | `09-regulatorik-verantwortung/` |
| `ressourcen/` | `10-ressourcen/` |
| `rechtliches/` | `11-rechtliches/` |

Leere Altverzeichnisse wie `concepts`, `frameworks`, `deployment`, `projects`, `regulatory` und `legal` wurden entfernt.

## Navigation und Frontmatter

Die Frontmatter-Metadaten wurden an die neue Struktur angepasst:

- `title` der Hauptseiten wurde auf kurze Navigationsbezeichnungen gekürzt.
- `parent` der Unterseiten wurde auf die neuen Haupttitel umgestellt.
- `nav_order` wurde so gesetzt, dass die Navigation dem Lernpfad folgt.
- `has_children: true` wurde auf den neuen Hauptbereichen gesetzt.
- interne Hilfsseiten bleiben über `nav_exclude: true` aus der Hauptnavigation heraus.

Die Einsteiger-Dokumente wurden bewusst wieder mit `Einsteiger` im Titel versehen, damit ihre Funktion in der Navigation klar erkennbar bleibt.
Eine Ausnahme ist `Prompt-Templates`: Dieses Dokument ist als allgemeine Prompt-Vorlagenseite benannt und nicht mehr als Einsteiger-Dokument geführt.

## Lernpfad und Zuerst lesen

Die Seite `lesepfade.md` wurde zu `lernpfad.md` umbenannt. Inhaltlich wurde die Seite beibehalten, aber auf die neue Struktur ausgerichtet.

`zuerst-lesen.md` bleibt als kürzester Einstieg bestehen. Die Seite verweist nun auf die neuen Bereiche und nutzt die neuen Pfade.

Damit ergibt sich folgende Logik:

- `Start` erklärt das Gesamtbild.
- `Zuerst lesen` gibt den kürzesten Einstieg.
- `Lernpfad` bietet zielorientierte Vertiefungen.
- Danach folgen die fachlichen Hauptbereiche.
- `Rechtliches` steht als formaler Bereich am Ende.

## Trennung von Regulatorik und Rechtlichem

Regulatorik und Rechtliches wurden bewusst getrennt:

- `09-regulatorik-verantwortung/` ist ein inhaltliches Kurskapitel.
- `11-rechtliches/` ist der formale Pflichtbereich der Website.

Dadurch bleiben EU AI Act, DSGVO, Ethik und digitale Souveränität fachliche Kursthemen. Impressum, Datenschutzerklärung und Haftungsausschluss werden nicht mit diesen Inhalten vermischt.

## Indexseiten als Frage-Einstieg

Die Indexseiten der Hauptbereiche wurden auf eine Frage-Logik umgestellt. Statt bloßer Listen zeigen sie jetzt direkt, welches Dokument welche Frage beantwortet.

Beispiele:

- **Warum** überhaupt KI oder Agenten einsetzen?
- **Was** ist die passende Lösungsklasse?
- **Wie** nutzt ein Agent Werkzeuge?
- **Wann** reicht Prompting nicht mehr aus?
- **Wie** bleiben Sitzungen und Zustände erhalten?
- **Woran** erkennt man, ob ein Agent gut arbeitet?

Damit übernehmen die Indexseiten die Rolle der Orientierung und ersetzen generische Hub-Seiten.

Im Bereich `04-agenten-implementierung/` wurde zusätzlich eine echte Sidebar-Unterstruktur für Just-the-Docs eingeführt. Die sichtbaren Gruppentitel wurden bewusst kurz gehalten, damit sie in der linken Navigation möglichst einzeilig bleiben:

- Entwurf
- Kontext & Wissen
- Ablauf & Zustand

Dafür wurden drei Gruppenseiten angelegt und die fachlichen Dokumente per `parent` und `grand_parent` darunter eingeordnet. Dadurch bleibt der größte Inhaltsbereich trotz vieler Dokumente in der linken Navigation besser lesbar, ohne die Dateien in zusätzliche Unterordner zu verschieben.

## Verschlankung der Struktur

Die generische Hub-Seite `qualitaet-sicherheit/best-practices.md` wurde entfernt. Sie war ein Überbleibsel der alten Framework-Struktur.

Stattdessen gilt:

- Generische Verweise zeigen auf den Bereich `Qualität und Sicherheit`.
- Spezifische Verweise zeigen direkt auf die passende Fachseite, z. B.:
  - `05-frameworks/langchain-best-practices.md`
  - `05-frameworks/langgraph-best-practices.md`
  - `05-frameworks/langsmith-best-practices.md`
  - `07-qualitaet-sicherheit/agent-evaluation-observability-best-practices.md`

Dadurch bleibt die Struktur flacher und Nutzer landen schneller beim konkreten Inhalt.

Zusätzlich wurden weitere Redundanzen bereinigt:

- technische Test- und Vorlagendateien wurden aus `10-ressourcen/` nach `_meta/` verschoben,
- die Sammelseite `erste-agenten/framework-guides.md` wurde entfernt,
- die drei Modellauswahl-Seiten wurden in `03-modelle-provider-anpassung/modellauswahl.md` zusammengeführt,
- `fine-tuning.md` wurde nach `03-modelle-provider-anpassung/` verschoben, weil es eine Modellanpassung und keine Wissensanbindung beschreibt,
- der Navigationspunkt wurde auf `Modelle & Provider` gekürzt,
- LangSmith-Seiten wurden aus `07-qualitaet-sicherheit/` nach `05-frameworks/` verschoben, weil sie konkrete Tool-Anleitungen sind,
- `capstone-briefing.md` und `projekte.md` wurden entfernt; Workshop und Challenge wurden in `08-deployment-betrieb/research-assistant.md` zusammengeführt,
- `02-orientierung-entscheidung/research-assistant-leitaufgabe.md` wurde ergänzt, damit das Zielbild der übergreifenden Kursaufgabe getrennt von der praktischen Umsetzung dokumentiert ist.

## Linkpflege

Nach der Umstrukturierung wurden interne Links systematisch umgestellt:

- alte Pfade wie `concepts/...`, `frameworks/...`, `deployment/...`, `regulatory/...`, `projects/...` und `legal/...` wurden ersetzt,
- Footer-Links wurden von `/legal/...` auf `/11-rechtliches/...` angepasst,
- Links auf gelöschte Sammelseiten wurden entfernt oder auf passende Zielseiten umgebogen,
- interne Links wurden auf lokale Existenz geprüft.

## Validierung

Nach den Änderungen wurden Prüfungen durchgeführt:

- Alle `parent`-Bezüge haben passende `title`-Ziele.
- Es wurden keine defekten lokalen Markdown-Links gefunden.
- Alte lange Verzeichnisnamen kommen in den lokalen Dokumentationspfaden nicht mehr vor.
- Verweise auf die gelöschte Datei `qualitaet-sicherheit/best-practices.md` wurden entfernt.

Ein lokaler Jekyll-Build wurde nicht ausgeführt, weil im Projekt kein `Gemfile` vorhanden ist.

## Ergebnis

Die GitHub-Pages-Dokumentation ist jetzt stärker am Lernpfad orientiert, nutzt kürzere Navigationsbezeichnungen, trennt fachliche und formale Bereiche klarer und vermeidet redundante Hub-Seiten. Die Struktur ist damit schlanker, verständlicher und besser auf einen Kurs zu KI-Agenten ausgerichtet.
