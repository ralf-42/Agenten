---
name: compliance-skill
description: Führt compliance-orientierte Agenten-Workflows durch — Sanktionsprüfung, Risikobewertung (low/medium/high), Freigabe-Gate und auditierbare Entscheidungsnotiz. Aktivieren wenn Nutzer sagt: "prüfe diesen Lieferanten", "Sanktionsprüfung", "Onboarding prüfen", "Zahlung freigeben", "KYC/KYB-Prüfung", "Risikobewertung", "Compliance-Check", "ist dieser Kunde unbedenklich", "Zahlungsfreigabe", "Go/No-Go-Entscheidung", "due diligence" oder "AML-Prüfung".
---

# Compliance Skill

Dieser Skill definiert einen wiederverwendbaren Compliance-Workflow für Agentenprozesse mit Freigabe- und Dokumentationsanforderungen.

## Schnellstart

Diesen Skill verwenden, wenn eine Anfrage eines oder mehrere dieser Muster enthält:

- Eine Transaktion, ein Lieferant, ein Kunde oder ein Konto muss vor der Ausführung geprüft werden
- Der Agent muss eine feste Prüfsequenz einhalten, bevor er handelt
- Der Nutzer fragt nach Sanktionsprüfungen, KYC/KYB-Prüfungen, Risikobewertung, Freigabe-Gates oder Audit-Logging
- Die Aufgabe erfordert eine dokumentierte Go/No-Go-Entscheidung

Wenn die Anfrage rein informationell ist und keine operative Entscheidung erforderlich ist, eine normale Antwort geben und den vollständigen Workflow überspringen.

## Kernworkflow

Diese Schritte der Reihe nach ausführen. Keinen Schritt überspringen.

1. Alle verfügbaren Informationen aus der Nutzernachricht und dem Gesprächsverlauf extrahieren.
2. Feststellen, welche erforderlichen Eingaben noch fehlen. Nur nach diesen fragen — niemals nach Informationen fragen, die bereits angegeben wurden. **Hier stoppen und auf die Antwort warten, bevor weitergemacht wird.**
3. Pflichtprüfungen durchführen.
4. **Das Tool `compliance_check` aufrufen**, um den Risiko-Score zu berechnen. Risiko-Scores niemals manuell berechnen.
5. Anhand des Tool-Ergebnisses entscheiden, ob der Fall genehmigt, abgelehnt oder eskaliert wird.
6. Eine prüfungsfähige Entscheidungsnotiz erstellen.

Die Schritte 3 bis 6 niemals überspringen, wenn die Aufgabe eine operative Compliance-Entscheidung erfordert.

## Mindestanforderungen an Eingaben

Diese Felder aus der Nutzernachricht oder dem Gesprächsverlauf extrahieren, bevor eine Entscheidung getroffen wird:

- subject_type: Person, Unternehmen, Lieferant, Kunde, Zahlung oder Konto
- subject_name
- country
- transaction_amount (falls relevant)
- business_purpose
- source_of_funds oder Zahlungskontext (falls relevant)
- sanctions_clearance_confirmed: ausdrückliche Bestätigung, dass eine formale Sanktionsprüfung durchgeführt wurde und ob ein Treffer vorlag

Aus natürlicher Sprache extrahieren, wenn möglich. Nur nach Feldern fragen, die tatsächlich fehlen oder unklar sind — eine bereits beantwortete Frage niemals wiederholen.

**Strikte Regel — niemals ableiten, niemals überspringen:** `sanctions_clearance_confirmed` kann nicht aus dem Kontext abgeleitet werden. Den Nutzer MUSS explizit gefragt werden, ob eine formale Sanktionsprüfung durchgeführt wurde und was das Ergebnis war. Nicht mit Schritt 3 fortfahren, bis dies bestätigt ist. Diese Regel überschreibt alles andere.

## Pflichtprüfungen

Diese Prüfungen immer durchführen:

- Sanktionsprüfung
- Geografische Prüfung
- Transaktionsgrößenprüfung (wenn Geld im Spiel ist)
- Prüfung auf negative Indikatoren
- Prüfung der Vollständigkeit der Dokumentation

Die genaue Checkliste steht in [references/checklist.md](references/checklist.md).

## Risikobewertung

**Das Tool `compliance_check` immer aufrufen**, um den Risiko-Score zu berechnen. Das Risikoniveau niemals schätzen oder manuell ableiten — das Tool-Ergebnis ist bindend.

Das Tool gibt eine von drei Stufen zurück: low, medium, high.

## Entscheidungsrichtlinie

Diese Richtlinie anwenden:

- `low` und alle Pflichtangaben vorhanden: genehmigen
- `medium`: zur menschlichen Prüfung eskalieren, es sei denn, der Nutzer hat ausdrücklich nur eine Empfehlung angefragt
- `high`: ablehnen und begründen
- jeder Sanktionstreffer: sofort ablehnen
- fehlende kritische Daten: zurückhalten bis vollständig

## Ausgabeformat

Die abschließende Antwort in dieser Struktur zurückgeben:

### Compliance-Entscheidung

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

- Nicht behaupten, dass eine echte Sanktionsprüfung stattgefunden hat, wenn keine echte Datenquelle oder kein Tool verwendet wurde.
- Wenn keine Live-Datenquelle verfügbar ist, darauf hinweisen, dass das Ergebnis eine simulierte oder Schulungsbewertung ist.
- Die Zahlungs- oder Onboarding-Aktion im Rahmen der Prüfung nicht ausführen, es sei denn, der Nutzer fragt ausdrücklich nach einer Aktion nach der Genehmigung.
