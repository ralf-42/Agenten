# Risikoregeln

Diese Regeln verwenden, um einen einfachen deterministischen Schulungs-Score zu berechnen.

## Eingaben

- `recipient_scope`
- `data_basis`
- `privacy_clearance_denied`
- `confidential_content`
- `conflict_unresolved`
- `sources_complete`

## Regeln

Mit Score `0` beginnen.

Punkte addieren:

- `+100` wenn `privacy_clearance_denied = true`
- `+40` wenn `confidential_content = true`
- `+30` wenn `conflict_unresolved = true`
- `+25` wenn `recipient_scope = extern`
- `+20` wenn `data_basis = produktivdaten`
- `+10` wenn `sources_complete = false`

Score auf Stufe abbilden:

- `0-19` -> `low`
- `20-49` -> `medium`
- `50+` -> `high`

Sonderregel:

- Jede verweigerte Datenschutzfreigabe überschreibt alle anderen Regeln und ergibt `high` plus Entscheidung `block`.

## Interpretation

- `low`: Routinefall, grundsätzlich freigabefähig
- `medium`: menschliche Prüfung erforderlich
- `high`: nicht freigeben ohne formale Eskalation
