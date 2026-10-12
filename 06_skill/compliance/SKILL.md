---
name: compliance
description: >-
  Führt Freigabeprüfungen für Briefings, Protokolle und Statusberichte durch —
  Datenschutzfreigabe, Empfängerkreis, Datenbasis, Risikobewertung
  (low/medium/high), Freigabe-Gate und auditierbare Entscheidungsnotiz.
  Aktivieren wenn Nutzer sagt: "Briefing freigeben", "darf der Statusbericht
  raus", "Protokoll versenden", "Freigabeprüfung", "Datenschutzprüfung",
  "Versand prüfen", "Compliance-Check", "Go/No-Go für das Briefing",
  "an externe Empfänger senden" oder "Freigabe-Gate".
---

# Compliance Skill

Dieser Skill definiert einen wiederverwendbaren Freigabe-Workflow für den PMO-Assistenten. Das Freigabe-Gate in Schritt 5 ist eine konkrete Ausprägung des kursweiten **Gate**-Begriffs (siehe `docs/02-orientierung-entscheidung/terminologie.md`): ein Kontrollpunkt vor einer kritischen oder folgenreichen Ausgabe, hier automatisiert über den Risiko-Score aus `compliance_check`.

## Schnellstart

Diesen Skill verwenden, wenn eine Anfrage eines oder mehrere dieser Muster enthält:

- Ein Briefing, Protokoll oder Statusbericht soll versendet oder veröffentlicht werden
- Der Agent muss eine feste Prüfsequenz einhalten, bevor er handelt
- Der Nutzer fragt nach Datenschutzfreigabe, Empfängerkreis, Vertraulichkeit oder Freigabe-Gates
- Die Aufgabe erfordert eine dokumentierte Go/No-Go-Entscheidung

Wenn die Anfrage rein informationell ist und keine operative Freigabe erforderlich ist, eine normale Antwort geben und den vollständigen Workflow überspringen.

## Kernworkflow

Diese Schritte der Reihe nach ausführen. Keinen Schritt überspringen.

1. Alle verfügbaren Informationen aus der Nutzernachricht und dem Gesprächsverlauf extrahieren.
2. Feststellen, welche erforderlichen Eingaben noch fehlen. Nur nach diesen fragen — niemals nach Informationen fragen, die bereits angegeben wurden. **Hier stoppen und auf die Antwort warten, bevor weitergemacht wird.**
3. Pflichtprüfungen durchführen.
4. **Das Tool `compliance_check` aufrufen**, um den Risiko-Score zu berechnen. Risiko-Scores niemals manuell berechnen.
5. Anhand des Tool-Ergebnisses entscheiden, ob das Dokument freigegeben, blockiert oder eskaliert wird.
6. Eine prüfungsfähige Entscheidungsnotiz erstellen.

Die Schritte 3 bis 6 niemals überspringen, wenn die Aufgabe eine operative Freigabeentscheidung erfordert.

## Mindestanforderungen an Eingaben

Diese Felder aus der Nutzernachricht oder dem Gesprächsverlauf extrahieren, bevor eine Entscheidung getroffen wird:

- subject_type: Briefing, Protokoll oder Statusbericht
- subject_name
- recipient_scope: projektteam, steuerkreis oder extern
- data_basis: testkorpus oder produktivdaten
- confidential_content: enthält das Dokument vertrauliche Inhalte (zum Beispiel Budget- oder Personalangaben)
- conflict_unresolved: gibt es widersprüchliche Quellen, die noch nicht aufgelöst sind (zum Beispiel zwei Entscheidungen zum selben Thema)
- sources_complete: sind alle Aussagen mit Quellen belegt
- privacy_clearance_confirmed: ausdrückliche Bestätigung, dass eine formale Datenschutzprüfung durchgeführt wurde und ob eine Freigabe erteilt wurde

Aus natürlicher Sprache extrahieren, wenn möglich. Nur nach Feldern fragen, die tatsächlich fehlen oder unklar sind — eine bereits beantwortete Frage niemals wiederholen.

**Strikte Regel — niemals ableiten, niemals überspringen:** `privacy_clearance_confirmed` kann nicht aus dem Kontext abgeleitet werden. Den Nutzer MUSS explizit gefragt werden, ob eine formale Datenschutzprüfung durchgeführt wurde und was das Ergebnis war. Nicht mit Schritt 3 fortfahren, bis dies bestätigt ist. Diese Regel überschreibt alles andere.

**Hinweis zum Geltungsbereich:** Eine Datenschutzfreigabe gilt nur für die Datenbasis, für die sie erteilt wurde. Liegt die Freigabe nur für den Testkorpus vor, das Dokument nutzt aber produktive Daten, `data_basis` auf produktivdaten setzen — dafür ist eine separate Prüfung erforderlich.

## Pflichtprüfungen

Diese Prüfungen immer durchführen:

- Datenschutzprüfung (Freigabe bestätigt, Geltungsbereich beachtet)
- Empfängerkreisprüfung
- Datenbasisprüfung (Testkorpus oder Produktivdaten)
- Prüfung auf vertrauliche Inhalte
- Prüfung auf ungelöste Widersprüche und fehlende Quellen

Die genaue Checkliste steht in [references/checklist.md](references/checklist.md).

## Risikobewertung

**Das Tool `compliance_check` immer aufrufen**, um den Risiko-Score zu berechnen. Das Risikoniveau niemals schätzen oder manuell ableiten — das Tool-Ergebnis ist bindend.

Das Tool gibt eine von drei Stufen zurück: low, medium, high.

## Entscheidungsrichtlinie

Diese Richtlinie anwenden:

- `low` und alle Pflichtangaben vorhanden: freigeben
- `medium`: zur menschlichen Prüfung eskalieren, es sei denn, der Nutzer hat ausdrücklich nur eine Empfehlung angefragt
- `high`: nicht freigeben und begründen
- verweigerte Datenschutzfreigabe: sofort nicht freigeben
- fehlende kritische Daten: zurückhalten bis vollständig

## Ausgabeformat

Die abschließende Antwort in dieser Struktur zurückgeben:

### Freigabe-Entscheidung

- Fall
- Durchgeführte Prüfungen
- Risikoniveau
- Entscheidung
- Begründung
- Fehlende Informationen oder Eskalationspunkt
- Prüfungsnotiz

## Tools

Du hast Zugriff auf folgende Tools. **Rufe sie in dieser Reihenfolge auf — ohne Ausnahme:**

1. **`load_reference("checklist.md")`** — MUSS aufgerufen werden, bevor Schritt 3 (Pflichtprüfungen) beginnt.
2. **`load_reference("risk_rules.md")`** — MUSS aufgerufen werden, bevor `compliance_check` aufgerufen wird.
3. **`compliance_check(...)`** — MUSS aufgerufen werden, um den Risiko-Score zu berechnen. Niemals manuell schätzen.
4. **`load_reference("examples.md")`** — Aufrufen, wenn ein Ausgabebeispiel für das Entscheidungsformat benötigt wird.

Das Tool-Ergebnis von `compliance_check` ist bindend und darf nicht überschrieben werden.

## Referenzen

Nur über das Tool `load_reference` laden — niemals direkt aus dem Kontext ableiten:

- `checklist.md`: operative Checkliste
- `risk_rules.md`: deterministische Bewertungsregeln
- `examples.md`: Beispielfälle und Ausgabemuster

## Leitplanken

- Nicht behaupten, dass eine echte Datenschutzprüfung stattgefunden hat, wenn dafür keine ausdrückliche Bestätigung des Nutzers vorliegt.
- Darauf hinweisen, dass das Ergebnis eine simulierte Schulungsbewertung ist und keine rechtliche Prüfung ersetzt.
- Das Dokument im Rahmen der Prüfung nicht versenden, es sei denn, der Nutzer fragt ausdrücklich nach einer Aktion nach der Freigabe.
