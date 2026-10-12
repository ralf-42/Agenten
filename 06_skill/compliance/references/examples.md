# Beispielfälle

## Beispiel 1: Interner Statusbericht mit niedrigem Risiko

Eingabe:

- subject_type: statusbericht
- subject_name: Statusbericht Projekt Kompass (KW 21)
- recipient_scope: projektteam
- data_basis: testkorpus
- privacy_clearance_denied: false
- confidential_content: false
- conflict_unresolved: false
- sources_complete: true

Erwartetes Ergebnis:

- Risikoniveau: low
- Entscheidung: freigeben

## Beispiel 2: Briefing mit ungelöstem Widerspruch

Eingabe:

- subject_type: briefing
- subject_name: Briefing zur Vektordatenbank-Entscheidung
- recipient_scope: steuerkreis
- data_basis: testkorpus
- privacy_clearance_denied: false
- confidential_content: false
- conflict_unresolved: true
- sources_complete: true

Erwartetes Ergebnis:

- Risikoniveau: medium
- Entscheidung: eskalieren (Entscheidungen D1 und D2 widersprechen sich; der aktuelle Stand muss geklärt werden)

## Beispiel 3: Statusbericht an externe Empfänger mit Produktivdaten

Eingabe:

- subject_type: statusbericht
- subject_name: Statusbericht Projekt Kompass an externen Dienstleister
- recipient_scope: extern
- data_basis: produktivdaten
- privacy_clearance_denied: false
- confidential_content: true
- conflict_unresolved: false
- sources_complete: true

Erwartetes Ergebnis:

- Risikoniveau: high
- Entscheidung: nicht freigeben (die Datenschutzfreigabe gilt nur für den Testkorpus)

## Beispiel-Ausgabemuster

### Freigabe-Entscheidung

- Fall: Statusbericht Projekt Kompass (KW 21) an das Projektteam
- Durchgeführte Prüfungen: Datenschutzprüfung, Empfängerkreisprüfung, Datenbasisprüfung, Quellenprüfung
- Risikoniveau: low
- Entscheidung: freigeben
- Begründung: interner Empfängerkreis, Testkorpus, keine vertraulichen Inhalte, alle Quellen belegt
- Fehlende Informationen oder Eskalationspunkt: keine
- Prüfungsnotiz: simulierte Schulungsbewertung, keine rechtliche Prüfung
