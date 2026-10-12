# Beispielfälle

## Beispiel 1: Vorbereitung — Steuerkreis (vollständige Unterlagen)

Eingabe:
- Thema: „Nächster Steuerkreis Projekt Kompass"
- Teilnehmer: Mara Vogt (Projektleitung), Jonas Reiter (IT-Architektur), Dr. Thomas Brandt (Datenschutz/Compliance)
- Kontext: Meeting-Auftrag, Projektstatus vom 20.05.2026, Mail-Verlauf, Notizen der Vorbesprechung
- Typ: Vorbereitung

Strukturierter Skill-Output (vereinfacht):
```json
{
  "type": "vorbereitung",
  "meeting_type": "Projektmeeting",
  "topic": "Nächster Steuerkreis Projekt Kompass",
  "date": "[offen]",
  "participants": ["Mara Vogt (Projektleitung)", "Jonas Reiter (IT-Architektur)", "Dr. Thomas Brandt (Datenschutz/Compliance)"],
  "agenda": [
    {"priority": "hoch", "point": "Rechte- und Rollensteuerung: Optionen und Mindestanforderungen", "goal": "entscheiden", "duration": 20, "owner": "Mara Vogt"},
    {"priority": "mittel", "point": "Stand Risiko R2 (mitigiert für den kuratierten Korpus)", "goal": "klären", "duration": 10, "owner": "Dr. Thomas Brandt"},
    {"priority": "mittel", "point": "Offene Aufgaben aus dem Follow-up-Tracker", "goal": "informieren", "duration": 10, "owner": "Mara Vogt"},
    {"priority": "gering", "point": "Nächste Schritte", "goal": "informieren", "duration": 5, "owner": "Mara Vogt"}
  ],
  "open_questions": ["Welche technische Option für die Zugriffssteuerung ist für den Prototyp realistisch?", "Wann findet der nächste Steuerkreis statt? [offen]"],
  "action_items": [
    {"task": "Zwei technische Optionen für die Zugriffssteuerung skizzieren", "owner": "Jonas Reiter", "due": "[offen]"},
    {"task": "Mindestanforderungen für datenschutzkonforme Dokumentzugriffe formulieren", "owner": "Dr. Thomas Brandt", "due": "[offen]"}
  ],
  "risks": ["Nachträgliche Filterung allein ist kein ausreichender Schutz", "R1, R3, R4: nur Stand 17.03.2026 dokumentiert"],
  "status": "ok"
}
```

Erwartetes Ergebnis: Vollständiges Briefing, Agenda mit 4 Punkten (Hoch zuerst), 2 Action Items, 2 Risiken, Rechte- und Rollensteuerung als „diskutiert, nicht beschlossen"

---

## Beispiel 2: Nachbereitung — Steuerkreis vom 28.04.2026

Eingabe:
- Thema: „Steuerkreis Projekt Kompass: Risikoliste-Update"
- Teilnehmer: Mara Vogt, Dr. Thomas Brandt, Jonas Reiter
- Kontext: protokoll_steuerkreis_2026-04-28.pdf
- Typ: Nachbereitung

Strukturierter Skill-Output (vereinfacht):
```json
{
  "type": "nachbereitung",
  "meeting_type": "Projektmeeting",
  "topic": "Steuerkreis Projekt Kompass: Risikoliste-Update",
  "date": "2026-04-28",
  "participants": ["Mara Vogt", "Dr. Thomas Brandt", "Jonas Reiter"],
  "decisions": [
    "Status von Risiko R2 (Datenschutzfreigabe) von offen auf mitigiert geändert (D3)",
    "Die Freigabe gilt für den kuratierten Testkorpus; für produktive Daten ist eine separate Prüfung erforderlich"
  ],
  "action_items": [
    {"task": "Risikoliste aktualisieren und den Statuswechsel vermerken", "owner": "Mara Vogt", "due": "[offen]"},
    {"task": "Formulierungen für Datenschutzgrenzen liefern", "owner": "Dr. Thomas Brandt", "due": "[offen]"},
    {"task": "Technische Logging- und Zugriffskonzepte vorbereiten", "owner": "Jonas Reiter", "due": "[offen]"}
  ],
  "open_points": ["Mitigiert bedeutet nicht erledigt: Das Risiko bleibt beobachtet"],
  "status": "ok"
}
```

Erwartetes Ergebnis: Nachbereitungs-Format, 2 Entscheidungen, 3 Action Items (Fälligkeit [offen]), 1 offener Punkt

---

## Beispiel 3: Fehlende Informationen

Eingabe:
- Thema: „Teammeeting"
- Teilnehmer: nicht angegeben
- Kontext: kein Dokument übergeben
- Typ: Vorbereitung

Strukturierter Skill-Output:
```json
{
  "status": "no_context",
  "topic": "Teammeeting",
  "participants": "[offen]"
}
```

Erwartetes Ergebnis: Leeres Briefing-Template mit Platzhaltern `[offen]`, Hinweis auf fehlenden Kontext

---

## Beispiel 4: Widersprüchliche Quellen

Eingabe:
- Thema: „Vektordatenbank-Entscheidung"
- Kontext: Zwei Protokolle mit abweichenden Entscheidungen (Steuerkreis 17.03.2026: D1, Steuerkreis 14.04.2026: D2)

Strukturierter Skill-Output (Auszug):
```json
{
  "conflict": true,
  "findings": [
    {"fact": "D1 (17.03.2026): ChromaDB wird für den Prototyp evaluiert", "source": "protokoll_steuerkreis_2026-03-17.pdf", "score": 0.89},
    {"fact": "D2 (14.04.2026): Verwaltete Cloud-Vektordatenbank für den produktiven Einsatz; ChromaDB verworfen", "source": "protokoll_steuerkreis_2026-04-14.pdf", "score": 0.93}
  ],
  "agenda": [
    {"priority": "hoch", "point": "Aktuelle Entscheidung bestätigen: D2 ersetzt D1", "goal": "klären", "duration": 10, "owner": "Jonas Reiter"}
  ]
}
```

Erwartetes Ergebnis: Konflikt-Markierung im Abschnitt „Bekannte Risiken / Konflikte", beide Entscheidungen mit Datum genannt, D2 als aktiv und D1 als überholt gekennzeichnet
