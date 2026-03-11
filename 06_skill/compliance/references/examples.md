# Beispielfälle

## Beispiel 1: Lieferant mit niedrigem Risiko

Eingabe:

- subject_type: vendor
- subject_name: Nordlicht Office GmbH
- country: DE
- transaction_amount: 2400
- sanctions_hit: false
- adverse_media_hit: false
- pep_flag: false
- documents_complete: true

Erwartetes Ergebnis:

- Risikoniveau: low
- Entscheidung: genehmigen

## Beispiel 2: Zahlung mit mittlerem Risiko

Eingabe:

- subject_type: payment
- subject_name: Baltic Export OU
- country: EE
- transaction_amount: 18000
- sanctions_hit: false
- adverse_media_hit: false
- pep_flag: false
- documents_complete: true

Erwartetes Ergebnis:

- Risikoniveau: medium
- Entscheidung: eskalieren

## Beispiel 3: Gegenpartei mit hohem Risiko

Eingabe:

- subject_type: customer
- subject_name: Example Trading LLC
- country: RU
- transaction_amount: 8000
- sanctions_hit: false
- adverse_media_hit: true
- pep_flag: false
- documents_complete: true

Erwartetes Ergebnis:

- Risikoniveau: high
- Entscheidung: ablehnen oder eskalieren gemäß Richtlinie

## Beispiel-Ausgabemuster

### Compliance-Entscheidung

- Fall: Lieferanten-Onboarding für Nordlicht Office GmbH
- Durchgeführte Prüfungen: Sanktionsprüfung, geografische Prüfung, Transaktionsgrößenprüfung, Dokumentenprüfung
- Risikoniveau: low
- Entscheidung: genehmigen
- Begründung: keine Hochrisikoindikatoren und vollständige Dokumentation
- Fehlende Informationen oder Eskalationspunkt: keine
- Prüfungsnotiz: simulierte Schulungsbewertung, keine Live-Sanktionsquelle angebunden
