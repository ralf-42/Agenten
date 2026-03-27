---
name: meeting-briefing
description: >-
  Erstellt strukturierte Meeting-Briefings auf Basis von Kontext-Dokumenten,
  Agenda und Teilnehmerliste. Erfasst Action Items und offene Fragen.
  Aktivieren wenn Nutzer sagt: "bereite das Meeting vor",
  "erstelle ein Briefing", "was muss ich für das Gespräch wissen",
  "Meeting-Vorbereitung", "Agenda erstellen", "Besprechung vorbereiten",
  "fasse den Kontext zusammen", "welche Fragen sollte ich stellen",
  "Action Items erfassen" oder "Nachbereitung".
---

# Meeting-Briefing Skill

Dieser Skill erstellt strukturierte Meeting-Briefings für beliebige Gesprächstypen —
Projektmeetings, Kundengespräche, interne Reviews, Workshops oder Kurssitzungen.

## Aktivierungsbedingung

Dieser Skill wird aktiv, wenn der Nutzer ein Meeting vorbereiten oder nachbereiten möchte.
Typische Trigger-Phrasen sind in der `description` aufgeführt.

## Hard Rules

1. **Immer alle verfügbaren Kontext-Dokumente laden** — kein Briefing ohne Grundlage.
2. **Agenda-Regeln zwingend einhalten** — Format aus `agenda_rules.md` ist bindend.
3. **Action Items deterministisch extrahieren** — Tool `extract_actions` aufrufen, nie manuell.
4. **Keine Annahmen über fehlende Informationen** — Lücken explizit als „offen" markieren.
5. **Sprache des Meetings übernehmen** — Deutsch wenn Meeting auf Deutsch, sonst Englisch.

## Workflow

```
Nutzeranfrage (Thema, Teilnehmer, Kontext)
    │
    ▼
[Meeting-Briefing-Skill]
    ├─ Kontext-Dokumente laden & auswerten
    ├─ Agenda strukturieren (agenda_rules.md)
    ├─ Offene Fragen & Risiken identifizieren
    ├─ Tool: extract_actions (Action Items aus Kontext extrahieren)
    └─ Meeting-Briefing im definierten Ausgabeformat erstellen
```

## Aufgaben

- Thema und Gesprächstyp klassifizieren (Vorbereitung oder Nachbereitung)
- Alle übergebenen Kontext-Dokumente sichten
- Agenda-Punkte nach Priorität ordnen
- Offene Fragen und potenzielle Konflikte identifizieren
- `extract_actions` für bestehende Action Items aufrufen
- Briefing exakt im Ausgabeformat erstellen
- Sachlicher, klarer Stil — keine Füllwörter
- Keine eigenen Bewertungen ohne Quellenbeleg aus dem Kontext

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

| Priorität | Punkt | Ziel | Dauer |
|-----------|-------|------|-------|
| 🔴 Hoch   | ...   | ...  | ...   |
| 🟡 Mittel | ...   | ...  | ...   |
| 🟢 Gering | ...   | ...  | ...   |

#### Offene Fragen (vor dem Meeting klären)

- [Frage 1]
- [Frage 2]

#### Bekannte Risiken / Konflikte

- [Risiko oder Konfliktpunkt, falls vorhanden — sonst „keine identifiziert"]

#### Empfohlene Fragen im Meeting

1. [Konkrete Frage an Teilnehmer X]
2. [Konkrete Frage zu Thema Y]

#### Action Items (aus Vorgesprächen / Dokumenten)

| # | Aufgabe | Verantwortlich | Fällig |
|---|---------|---------------|--------|
| 1 | ...     | ...           | ...    |

---
*Erstellt durch Meeting-Briefing-Skill*
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

| # | Aufgabe | Verantwortlich | Fällig |
|---|---------|---------------|--------|
| 1 | ...     | ...           | ...    |

#### Offene Punkte (vertagt)

- [Punkt, der nicht abgeschlossen wurde]

---
*Erstellt durch Meeting-Briefing-Skill*
```

## Eskalation

- Kein Kontext übergeben → Gate gibt `"status": "no_context"` zurück, Writer erstellt leeres Template
- Widersprüchliche Agenda-Punkte → Gate markiert `"conflict": true`
- Mehr als 10 Action Items → Gate priorisiert nach Fälligkeit, Rest in „Backlog"

## Verwandte Module

- M17 – Human-in-the-Loop (Briefing mit `interrupt()` vor Versand)
- M20 – Supervisor Pattern (Briefing als Teilaufgabe im Supervisor-Workflow)
- M26 – Integration Pipeline (Meeting-Briefing als Schritt in einer Prozesskette)
