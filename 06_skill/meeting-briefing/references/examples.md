# Beispielfälle

## Beispiel 1: Vorbereitung — Projektmeeting (vollständige Unterlagen)

Eingabe:
- Thema: „Sprint-Review KI-Agenten Modul M24"
- Teilnehmer: Anna (PO), Björn (Entwicklung), Caro (QA)
- Kontext: Sprint-Bericht vom 18.03., offene Tickets aus Jira
- Typ: Vorbereitung

Gate-Output (vereinfacht):
```json
{
  "type": "vorbereitung",
  "meeting_type": "Projektmeeting",
  "topic": "Sprint-Review KI-Agenten Modul M24",
  "participants": ["Anna (PO)", "Björn (Entwicklung)", "Caro (QA)"],
  "agenda": [
    {"priority": "hoch", "point": "Blockierung: Tool-Calling-Fehler in M24", "goal": "entscheiden", "duration": 15, "owner": "Björn"},
    {"priority": "hoch", "point": "Deadline Abnahme bis 25.03.", "goal": "klären", "duration": 10, "owner": "Anna"},
    {"priority": "mittel", "point": "Status Sprint-Fortschritt", "goal": "informieren", "duration": 10, "owner": "Caro"},
    {"priority": "gering", "point": "Sonstiges", "goal": "informieren", "duration": 5, "owner": "alle"}
  ],
  "open_questions": ["Ist der Bugfix bis 25.03. realistisch?", "Wer übernimmt das Testing nach dem Fix?"],
  "action_items": [
    {"task": "Bugfix Tool-Calling dokumentieren", "owner": "Björn", "due": "2026-03-22"},
    {"task": "Abnahmekriterien finalisieren", "owner": "Anna", "due": "2026-03-20"}
  ],
  "risks": ["Blockierung durch Tool-Calling-Bug verzögert Abnahme"],
  "status": "ok"
}
```

Erwartetes Ergebnis: Vollständiges Briefing, Agenda mit 4 Punkten (Hoch zuerst), 2 Action Items, 1 Risiko

---

## Beispiel 2: Nachbereitung — Kundengespräch

Eingabe:
- Thema: „Abstimmung Pilotprojekt mit Firma XYZ"
- Teilnehmer: Ralf (intern), Dr. Müller (Kunde), Petra (Vertrieb)
- Kontext: Gesprächsnotizen 19.03.2026
- Typ: Nachbereitung

Gate-Output (vereinfacht):
```json
{
  "type": "nachbereitung",
  "meeting_type": "Kundengespräch",
  "topic": "Abstimmung Pilotprojekt mit Firma XYZ",
  "date": "2026-03-19",
  "participants": ["Ralf (intern)", "Dr. Müller (Kunde)", "Petra (Vertrieb)"],
  "decisions": [
    "Pilotprojekt startet am 01.04.2026",
    "Scope: 3 Use Cases, Laufzeit 8 Wochen",
    "Ansprechpartner Kunde: Dr. Müller"
  ],
  "action_items": [
    {"task": "Projektvertrag an Dr. Müller senden", "owner": "Petra", "due": "2026-03-21"},
    {"task": "Kick-off-Termin abstimmen", "owner": "Ralf", "due": "2026-03-25"},
    {"task": "Use-Case-Dokumentation erstellen", "owner": "Ralf", "due": "2026-03-28"}
  ],
  "open_points": ["Budgetfreigabe seitens XYZ noch ausstehend"],
  "status": "ok"
}
```

Erwartetes Ergebnis: Nachbereitungs-Format, 3 Entscheidungen, 3 Action Items mit Datum, 1 offener Punkt

---

## Beispiel 3: Fehlende Informationen

Eingabe:
- Thema: „Teammeeting"
- Teilnehmer: nicht angegeben
- Kontext: kein Dokument übergeben
- Typ: Vorbereitung

Gate-Output:
```json
{
  "status": "no_context",
  "topic": "Teammeeting",
  "participants": "[offen]"
}
```

Erwartetes Ergebnis: Leeres Briefing-Template mit Platzhaltern `[offen]`, Hinweis auf fehlenden Kontext

---

## Beispiel 4: Widersprüchliche Agenda-Punkte

Eingabe:
- Thema: „Budget-Review Q2"
- Kontext: Zwei Dokumente mit abweichenden Budgetzahlen (Dok A: 120k€, Dok B: 95k€)

Gate-Output (Auszug):
```json
{
  "conflict": true,
  "findings": [
    {"fact": "Budget Q2: 120.000 €", "source": "Finanzplanung Q2 v1", "score": 0.88},
    {"fact": "Budget Q2: 95.000 €", "source": "Aktualisierte Planung März", "score": 0.91}
  ],
  "agenda": [
    {"priority": "hoch", "point": "Budgetwiderspruch klären (120k vs. 95k)", "goal": "entscheiden", "duration": 20, "owner": "[offen]"}
  ]
}
```

Erwartetes Ergebnis: Konflikt-Markierung im Abschnitt „Bekannte Risiken / Konflikte", beide Zahlen explizit genannt
