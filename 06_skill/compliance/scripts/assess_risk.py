from __future__ import annotations

import json
import sys


EXTERNAL_SCOPES = {"extern", "external"}
PRODUCTION_DATA = {"produktivdaten", "production"}


def parse_bool(value: object) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "y", "ja"}
    return bool(value)


def assess(case: dict) -> dict:
    """Bewertet die Freigabe eines Briefings oder Berichts (deterministischer Schulungs-Score)."""
    privacy_clearance_denied = parse_bool(case.get("privacy_clearance_denied", False))
    confidential_content = parse_bool(case.get("confidential_content", False))
    conflict_unresolved = parse_bool(case.get("conflict_unresolved", False))
    sources_complete = parse_bool(case.get("sources_complete", True))
    recipient_scope = str(case.get("recipient_scope", "")).strip().lower()
    data_basis = str(case.get("data_basis", "testkorpus")).strip().lower()

    score = 0
    reasons = []

    if privacy_clearance_denied:
        score += 100
        reasons.append("privacy_clearance_denied")
    if confidential_content:
        score += 40
        reasons.append("confidential_content")
    if conflict_unresolved:
        score += 30
        reasons.append("conflict_unresolved")
    if recipient_scope in EXTERNAL_SCOPES:
        score += 25
        reasons.append("external_recipients")
    if data_basis in PRODUCTION_DATA:
        score += 20
        reasons.append("production_data_needs_separate_review")
    if not sources_complete:
        score += 10
        reasons.append("missing_sources")

    if privacy_clearance_denied or score >= 50:
        level = "high"
    elif score >= 20:
        level = "medium"
    else:
        level = "low"

    if privacy_clearance_denied:
        decision = "block"
    elif level == "high":
        decision = "block"
    elif level == "medium":
        decision = "escalate"
    else:
        decision = "approve"

    return {
        "risk_score": score,
        "risk_level": level,
        "decision": decision,
        "reasons": reasons,
    }


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python assess_risk.py '<json-case>'", file=sys.stderr)
        return 1

    try:
        case = json.loads(sys.argv[1])
    except json.JSONDecodeError as exc:
        print(f"Invalid JSON: {exc}", file=sys.stderr)
        return 2

    result = assess(case)
    print(json.dumps(result, ensure_ascii=True, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
