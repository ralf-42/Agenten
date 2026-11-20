---
name: pmo-briefing
description: >-
  Erstellt strukturierte Meeting-Briefings auf Basis von Kontext-Dokumenten,
  Agenda und Teilnehmerliste. Erfasst Action Items, offene Fragen und
  quellengebundene Statusinformationen.
  Aktivieren wenn Nutzer sagt: "bereite das Meeting vor",
  "erstelle ein Briefing", "was muss ich für das Gespräch wissen",
  "Meeting-Vorbereitung", "Agenda erstellen", "Besprechung vorbereiten",
  "fasse den Kontext zusammen", "welche Fragen sollte ich stellen",
  "Action Items erfassen", "Statusbericht", "Projektstatus" oder "Nachbereitung".
---

# PMO-Briefing-Skill

Dieser Skill ist der Kern-Baustein des Leitprojekts **PMO-Assistent**: er erstellt strukturierte Meeting-Briefings für beliebige Gesprächstypen —
Projektmeetings, Kundengespräche, interne Reviews, Workshops oder Kurssitzungen. Im Leitprojekt-Szenario nutzt Mara Vogt (Projektleiterin, Projekt "Kompass") diesen Skill, um Protokolle, Risikolisten und offene Punkte in ein geprüftes Briefing zu verwandeln. Der PMO-Bezug umfasst drei Kernfunktionen: Meeting-Vorbereitung, Aufgabenverfolgung und Statusreporting.

## Aktivierungsbedingung

Dieser Skill wird aktiv, wenn der Nutzer ein Meeting vorbereiten oder nachbereiten möchte.
Typische Trigger-Phrasen sind in der `description` aufgeführt.

## Hard Rules

1. **Immer alle verfügbaren Kontext-Dokumente laden** — kein Briefing ohne Grundlage.
2. **Agenda-Regeln zwingend einhalten** — Format aus `agenda_rules.md` ist bindend.
3. **Action Items mit nachvollziehbarer Herkunft** — `extract_actions` aufrufen und seine Treffer übernehmen. Zusätzlich ausdrücklich belegte Aufgaben als `Quellenbefund` kennzeichnen; keine Aufgaben erfinden.
4. **Keine Annahmen über fehlende Informationen** — Lücken explizit als „offen" markieren.
5. **Sprache des Meetings übernehmen** — Deutsch wenn Meeting auf Deutsch, sonst Englisch.
6. **Keine verbindlichen Projektentscheidungen ohne Freigabe** — Status, Aufgaben und Empfehlungen bleiben quellengebunden; externe Aktionen oder verbindliche Entscheidungen erfordern menschliche Prüfung.

## Workflow

```
Nutzeranfrage (Thema, Teilnehmer, Kontext)
    │
    ▼
[PMO-Briefing-Skill]
    ├─ Kontext-Dokumente laden & auswerten
    ├─ Agenda strukturieren (agenda_rules.md)
    ├─ Offene Fragen & Risiken identifizieren
    ├─ Tool: extract_actions (Action Items aus Kontext extrahieren)
    ├─ Statusinformationen, Entscheidungen und Abweichungen quellengebunden zusammenfassen
    └─ Meeting-Briefing im definierten Ausgabeformat erstellen
```

## Aufgaben

- Thema und Gesprächstyp klassifizieren (Vorbereitung oder Nachbereitung)
- Alle übergebenen Kontext-Dokumente sichten
- Agenda-Punkte nach Priorität ordnen
- Offene Fragen und potenzielle Konflikte identifizieren
- `extract_actions` für bestehende Action Items aufrufen
- Briefing exakt im Ausgabeformat erstellen
- Für Statusanfragen eine kompakte, quellengebundene Statusübersicht erstellen
- Sachlicher, klarer Stil — keine Füllwörter
- Keine eigenen Bewertungen ohne Quellenbeleg aus dem Kontext

## Gemeinsame Aufgabenübersicht

`extract_actions` wird für die bereitgestellten Quelltexte aufgerufen. Seine Ausgabe bleibt als Skriptergebnis erkennbar. Die Heuristik kann Aufgaben übersehen; ein leeres Skriptergebnis beweist nicht, dass der Quelltext keine Aufgaben enthält.

Alle für die Anfrage relevanten, belegten Aufgaben werden in einer gemeinsamen Tabelle zusammengeführt. Die Spalte `Herkunft` enthält `extract_actions` für tatsächlich ausgegebene Skript-Treffer oder `Quellenbefund` für ausdrücklich im Quelltext genannte, vom Skript nicht erfasste Aufgaben. Ein Quellenbefund darf nicht als Skriptergebnis ausgegeben werden. Allgemeine Empfehlungen und neue Vorschläge sind keine dokumentierten Aufgaben und bleiben getrennt.

Je Zeile werden Aufgabe, Verantwortlich, Fällig, Herkunft und `Quelle / Datum` angegeben. Quelle ist der exakte Dateiname mit Dokumentdatum, soweit vorhanden. Bei mehreren Eingabedokumenten werden die Skript-Treffer anhand des jeweiligen Aufrufs zugeordnet; die Texte möglichst pro Quelldatei übergeben. Fehlende Angaben bleiben `[offen]`. Insbesondere wird keine Frist aus einem anderen Dokument oder einem bloßen Berichtsdatum übernommen. Nachweislich gleiche Aufgaben können zusammengeführt werden, ihre Quellen bleiben erhalten.

## Ausgabeformat — Vorbereitung

```
### Meeting-Briefing: [Titel]

**Datum/Zeit:** [wenn bekannt, sonst „nicht angegeben"]
**Teilnehmer:** [Liste]
**Typ:** [Projektmeeting | Kundengespräch | Review | Workshop | Sonstiges]

---

#### Kontext & Hintergrund

[2–4 Sätze: Worum geht es? Was ist der aktuelle Stand?]

#### Agenda

| Priorität | Punkt | Ziel | Dauer | Owner |
|-----------|-------|------|-------|-------|
| 🔴 Hoch   | ...   | ...  | ...   | [offen] |
| 🟡 Mittel | ...   | ...  | ...   | [offen] |
| 🟢 Gering | ...   | ...  | ...   | [offen] |

#### Offene Fragen (vor dem Meeting klären)

- [Frage 1]
- [Frage 2]

#### Bekannte Risiken / Konflikte

- [Risiko oder Konfliktpunkt, falls vorhanden — sonst „keine identifiziert"]

#### Empfohlene Fragen im Meeting

1. [Konkrete Frage an Teilnehmer X]
2. [Konkrete Frage zu Thema Y]

#### Action Items (aus Vorgesprächen / Dokumenten)

| # | Aufgabe | Verantwortlich | Fällig | Herkunft | Quelle / Datum |
|---|---------|----------------|--------|----------|----------------|
| 1 | ... | [offen] | [offen] | extract_actions oder Quellenbefund | dateiname, Dokumentdatum oder [offen] |

---
*Erstellt durch PMO-Briefing-Skill*
```

## Ausgabeformat — Statusübersicht

```
### Projektstatus: [Projekt / Vorhaben]

**Stand:** [Datum oder „nicht angegeben"]
**Quellen:** [Dokumente / „nicht angegeben"]

---

#### Statusübersicht

| Bereich | Status | Quelle | Hinweis |
|---------|--------|--------|---------|
| ...     | ...    | ...    | ...     |

#### Offene Aufgaben

| # | Aufgabe | Verantwortlich | Fällig | Status | Herkunft | Quelle / Datum |
|---|---------|----------------|--------|--------|----------|----------------|
| 1 | ... | [offen] | [offen] | ... | extract_actions oder Quellenbefund | dateiname, Dokumentdatum oder [offen] |

#### Risiken, Entscheidungen und Abweichungen

- [Nur quellengebundene Angaben; fehlende Evidenz als „offen" markieren]

---
*Erstellt durch PMO-Briefing-Skill*
```

## Ausgabeformat — Nachbereitung

```
### Meeting-Nachbereitung: [Titel]

**Datum:** [Datum]
**Teilnehmer:** [Liste]

---

#### Ergebnisse & Entscheidungen

- [Entscheidung 1]
- [Entscheidung 2]

#### Action Items (neu)

| # | Aufgabe | Verantwortlich | Fällig | Herkunft | Quelle / Datum |
|---|---------|----------------|--------|----------|----------------|
| 1 | ... | [offen] | [offen] | extract_actions oder Quellenbefund | dateiname, Dokumentdatum oder [offen] |

#### Offene Punkte (vertagt)

- [Punkt, der nicht abgeschlossen wurde]

---
*Erstellt durch PMO-Briefing-Skill*
```

## Eskalation

- Kein Kontext übergeben → Gate gibt `"status": "no_context"` zurück, Writer erstellt leeres Template
- Widersprüchliche Agenda-Punkte → Gate markiert `"conflict": true`
- Mehr als 10 Action Items → Gate priorisiert nach Fälligkeit, Rest in „Backlog"
- Fehlende Statusquelle → Status nicht ableiten, sondern als „offen / nicht belegt" ausgeben

## Verwandte Module

- Human in the Loop – Human-in-the-Loop (Briefing mit `interrupt()` vor Versand)
- Supervisor Pattern (Briefing als Teilaufgabe im Supervisor-Workflow)
- DeepAgents Skill PMO-Assistent – DeepAgents-Skill für PMO-Briefings (direkte Anwendung dieses Skills als Leitprojekt-Baustein)
