# Action-Item-Regeln

Diese Regeln definieren, wie der Gate-Agent Action Items aus Kontext-Dokumenten extrahiert.

## Definition: Was ist ein Action Item?

Ein Action Item ist eine **konkrete, zugewiesene Aufgabe** mit:
- **Was**: klar beschriebene Tätigkeit (Verb + Objekt)
- **Wer**: benannte Person oder Rolle (kein „jemand" oder „Team")
- **Bis wann**: konkretes Datum oder relativer Zeitraum

Fehlt eines dieser drei Elemente → Action Item trotzdem aufnehmen, fehlende Felder als `[offen]` markieren.

## Erkennungsregeln

### Starke Signale (immer extrahieren)
- Explizite Zuweisungen: „X übernimmt …", „Y kümmert sich um …", „Z sendet …"
- Klare Verben: erstellen, prüfen, senden, freigeben, einladen, koordinieren, liefern, implementieren
- Zeitangaben direkt danach: „bis Freitag", „bis zum 15.", „nächste Woche"

### Schwache Signale (nur bei klarer Zuordnung extrahieren)
- Absichtserklärungen: „wir sollten …", „es wäre gut, wenn …"
- Passivformulierungen ohne Eigentümer: „muss noch geklärt werden"
- Fragen ohne Antwort: nicht als Action Item, sondern als offene Frage

### Nicht extrahieren
- Allgemeine Prozessbeschreibungen ohne Eigentümer
- Bereits abgeschlossene Aufgaben (Vergangenheitsform + Bestätigung)
- Themen ohne konkreten nächsten Schritt

## Format-Regeln

### Beschreibung
- Kurz und aktionsorientiert: „Report bis Freitag finalisieren" statt „Es wurde besprochen, dass der Report..."
- Infinitiv oder Imperativ — kein Nominalstil
- Maximal eine Zeile

### Verantwortlicher
- Einzelperson bevorzugen — keine Gruppen wenn vermeidbar
- Wenn Gruppe: „Projektteam", „Entwicklung", „Marketing" (nicht „alle")
- Wenn unklar: `[offen]`

### Fälligkeitsdatum
- Absolutes Datum bevorzugen: `2026-03-28`
- Relativer Zeitraum wenn kein Datum: `nächste Woche`, `bis Sprint-Ende`
- Wenn nicht genannt: `[offen]`

## Priorisierung bei mehr als 10 Action Items

1. Sortieren nach Fälligkeit (frühestes Datum zuerst)
2. Top 5 vollständig ausgeben
3. Restliche Items zusammenfassen: `Backlog (X weitere Punkte)`
4. Backlog-Punkte kurz auflisten (nur Beschreibung, ohne Eigentümer/Datum)

## Konflikte

Wenn zwei Quellen dasselbe Action Item unterschiedlich beschreiben:
- Beide Varianten ausgeben
- `conflict: true` im Gate-Output setzen
- Writer benennt Konflikt explizit im Briefing

## Sonderfall: Keine Action Items vorhanden

- Leere Tabelle ausgeben mit Hinweis: „Keine Action Items in den Unterlagen gefunden."
- Kein Erfinden von Aufgaben
