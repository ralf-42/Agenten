---
name: compliance-skill
description: Use this skill when the user wants a compliance-oriented agent workflow, including sanctions checks, risk scoring, approval gates, documentation duties, or controlled multi-step onboarding and payment release processes.
---

# Compliance Skill

This skill defines a reusable compliance workflow for agentic processes with approval and documentation requirements.

## Quick Start

Use this skill when a request involves one or more of these patterns:

- A transaction, supplier, customer, or account must be checked before execution
- The agent must follow a fixed review sequence before taking action
- The user asks for sanctions checks, KYC/KYB checks, risk scoring, approval gates, or audit logging
- The task needs a documented go/no-go decision

If the request is purely informational and no operational decision is needed, give a normal answer and skip the full workflow.

## Core Workflow

Follow these steps in order unless the user explicitly narrows the scope:

1. Clarify the case type and target entity.
2. Collect minimum required inputs.
3. Run mandatory checks.
4. Score the risk.
5. Decide whether the case is approved, blocked, or escalated.
6. Produce an audit-ready decision note.

Never skip steps 2 to 5 when the task requests an operational compliance decision.

## Minimum Required Inputs

Capture these fields before deciding:

- subject_type: person, company, vendor, customer, payment, or account
- subject_name
- country
- transaction_amount if relevant
- business_purpose
- source_of_funds or payment context if relevant

If critical inputs are missing, stop and request them instead of guessing.

## Mandatory Checks

Always perform these checks:

- sanctions screening
- geography screening
- transaction size review if money is involved
- adverse indicator review
- documentation completeness check

Read [references/checklist.md](references/checklist.md) for the exact checklist.

## Risk Scoring

Assign one of three outcomes:

- low
- medium
- high

Use the rule set in [references/risk_rules.md](references/risk_rules.md).

If deterministic scoring is useful, run `scripts/assess_risk.py` with the case data.

## Decision Policy

Apply this policy:

- `low` and all mandatory inputs present: approve
- `medium`: escalate for human review unless the user explicitly asked for a draft recommendation only
- `high`: block and explain why
- any sanctions hit: block immediately
- missing critical data: hold until completed

## Output Format

Return the final answer in this structure:

### Compliance Decision

- Case
- Checks performed
- Risk level
- Decision
- Rationale
- Missing information or escalation point
- Audit note

## References

Load only what is needed:

- [references/checklist.md](references/checklist.md): operational checklist
- [references/risk_rules.md](references/risk_rules.md): deterministic scoring rules
- [references/examples.md](references/examples.md): example cases and output patterns

## Guardrails

- Do not claim a real sanctions screening happened unless an actual data source or tool was used.
- If no live data source is available, state that the result is a simulated or training assessment.
- Do not execute the payment or onboarding action as part of the review unless the user explicitly asks for action after approval.
