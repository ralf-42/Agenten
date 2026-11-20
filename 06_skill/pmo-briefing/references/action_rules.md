# Action-Item-Regeln

Diese Regeln definieren, wie der Skill Action Items aus Kontext-Dokumenten extrahiert.

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

## Gemeinsame Aufgabenübersicht

`extract_actions` wird für die bereitgestellten Quelltexte aufgerufen. Seine Ausgabe bleibt als Skriptergebnis erkennbar. Die Heuristik kann Aufgaben übersehen; ein leeres Skriptergebnis beweist nicht, dass der Quelltext keine Aufgaben enthält.

Alle für die Anfrage relevanten, belegten Aufgaben werden in einer gemeinsamen Tabelle zusammengeführt. Die Spalte `Herkunft` enthält `extract_actions` für tatsächlich ausgegebene Skript-Treffer oder `Quellenbefund` für ausdrücklich im Quelltext genannte, vom Skript nicht erfasste Aufgaben. Ein Quellenbefund darf nicht als Skriptergebnis ausgegeben werden. Allgemeine Empfehlungen und neue Vorschläge sind keine dokumentierten Aufgaben und bleiben getrennt.

Je Zeile werden Aufgabe, Verantwortlich, Fällig, Herkunft und `Quelle / Datum` angegeben. Quelle ist der exakte Dateiname mit Dokumentdatum, soweit vorhanden. Bei mehreren Eingabedokumenten werden die Skript-Treffer anhand des jeweiligen Aufrufs zugeordnet; die Texte möglichst pro Quelldatei übergeben. Fehlende Angaben bleiben `[offen]`. Insbesondere wird keine Frist aus einem anderen Dokument oder einem bloßen Berichtsdatum übernommen. Nachweislich gleiche Aufgaben können zusammengeführt werden, ihre Quellen bleiben erhalten.

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
- `conflict: true` im strukturierten Skill-Output setzen
- Konflikt im Briefing explizit benennen

## Sonderfall: Keine Action Items vorhanden

- Nur wenn weder Skript-Treffer noch ausdrücklich belegte Quellenbefunde vorliegen, eine leere Tabelle mit „Keine belegten Action Items gefunden“ ausgeben. Ein leeres Skriptergebnis allein reicht dafür nicht.
- Kein Erfinden von Aufgaben
