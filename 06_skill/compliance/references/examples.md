# Example Cases

## Example 1: Low Risk Vendor

Input:

- subject_type: vendor
- subject_name: Nordlicht Office GmbH
- country: DE
- transaction_amount: 2400
- sanctions_hit: false
- adverse_media_hit: false
- pep_flag: false
- documents_complete: true

Expected outcome:

- risk level: low
- decision: approve

## Example 2: Medium Risk Payment

Input:

- subject_type: payment
- subject_name: Baltic Export OU
- country: EE
- transaction_amount: 18000
- sanctions_hit: false
- adverse_media_hit: false
- pep_flag: false
- documents_complete: true

Expected outcome:

- risk level: medium
- decision: escalate

## Example 3: High Risk Counterparty

Input:

- subject_type: customer
- subject_name: Example Trading LLC
- country: RU
- transaction_amount: 8000
- sanctions_hit: false
- adverse_media_hit: true
- pep_flag: false
- documents_complete: true

Expected outcome:

- risk level: high
- decision: block or escalate according to policy

## Example Output Pattern

### Compliance Decision

- Case: Vendor onboarding for Nordlicht Office GmbH
- Checks performed: sanctions screening, geography review, transaction size review, documentation check
- Risk level: low
- Decision: approve
- Rationale: no high-risk indicators and complete documentation
- Missing information or escalation point: none
- Audit note: simulated training assessment, no live sanctions source connected
