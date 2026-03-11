# Risikoregeln

Diese Regeln verwenden, um einen einfachen deterministischen Schulungs-Score zu berechnen.

## Eingaben

- `country`
- `transaction_amount`
- `sanctions_hit`
- `adverse_media_hit`
- `pep_flag`
- `documents_complete`

## Regeln

Mit Score `0` beginnen.

Punkte addieren:

- `+100` wenn `sanctions_hit = true`
- `+40` wenn `pep_flag = true`
- `+30` wenn `adverse_media_hit = true`
- `+25` wenn Land in `{IR, KP, SY, RU}`
- `+15` wenn transaction_amount >= `10000`
- `+10` wenn documents_complete = false

Score auf Stufe abbilden:

- `0-19` -> `low`
- `20-49` -> `medium`
- `50+` -> `high`

Sonderregel:

- Jeder Sanktionstreffer überschreibt alle anderen Regeln und ergibt `high` plus Entscheidung `block`.

## Interpretation

- `low`: Routinefall, grundsätzlich genehmigungsfähig
- `medium`: menschliche Prüfung erforderlich
- `high`: nicht fortfahren ohne formale Eskalation
