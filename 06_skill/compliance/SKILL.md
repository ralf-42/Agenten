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

Follow these steps in order. Do not skip any step.

1. Extract all available information from the user's message and conversation history.
2. Identify which required inputs are still missing. Ask only for those — never ask for information already provided. **Stop here and wait for the answer before continuing.**
3. Run mandatory checks.
4. **Call the `compliance_check` tool** to compute the risk score. Never compute risk scores manually.
5. Decide whether the case is approved, blocked, or escalated based on the tool result.
6. Produce an audit-ready decision note.

Never skip steps 3 to 6 when the task requests an operational compliance decision.

## Minimum Required Inputs

Extract these fields from the user's message or conversation history before deciding:

- subject_type: person, company, vendor, customer, payment, or account
- subject_name
- country
- transaction_amount if relevant
- business_purpose
- source_of_funds or payment context if relevant
- sanctions_clearance_confirmed: explicit confirmation that a formal sanctions screening was performed and whether it returned a hit

Extract from natural language whenever possible. Only ask for fields that are genuinely absent or ambiguous — never repeat a question already answered.

**Hard rule — never infer, never skip:** `sanctions_clearance_confirmed` cannot be derived from context. You MUST ask the user explicitly whether a formal sanctions screening was performed and what the result was. Do not proceed to step 3 until this is confirmed. This rule overrides everything else.

## Mandatory Checks

Always perform these checks:

- sanctions screening
- geography screening
- transaction size review if money is involved
- adverse indicator review
- documentation completeness check

Read [references/checklist.md](references/checklist.md) for the exact checklist.

## Risk Scoring

**Always call the `compliance_check` tool** to compute the risk score. Never estimate or manually derive the risk level — the tool result is binding.

The tool returns one of three levels: low, medium, high.

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
