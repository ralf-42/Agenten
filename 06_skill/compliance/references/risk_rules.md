# Risk Rules

Use these rules to derive a simple deterministic training score.

## Inputs

- `country`
- `transaction_amount`
- `sanctions_hit`
- `adverse_media_hit`
- `pep_flag`
- `documents_complete`

## Rules

Start with score `0`.

Add points:

- `+100` if `sanctions_hit = true`
- `+40` if `pep_flag = true`
- `+30` if `adverse_media_hit = true`
- `+25` if country is in `{IR, KP, SY, RU}`
- `+15` if transaction_amount >= `10000`
- `+10` if documents_complete = false

Map score to level:

- `0-19` -> `low`
- `20-49` -> `medium`
- `50+` -> `high`

Special rule:

- Any sanctions hit overrides all other logic and results in `high` plus decision `block`.

## Interpretation

- `low`: routine case, generally approvable
- `medium`: needs human review
- `high`: do not proceed without formal escalation
