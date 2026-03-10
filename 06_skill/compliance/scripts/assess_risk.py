from __future__ import annotations

import json
import sys


HIGH_RISK_COUNTRIES = {"IR", "KP", "SY", "RU"}


def parse_bool(value: object) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "y"}
    return bool(value)


def assess(case: dict) -> dict:
    sanctions_hit = parse_bool(case.get("sanctions_hit", False))
    adverse_media_hit = parse_bool(case.get("adverse_media_hit", False))
    pep_flag = parse_bool(case.get("pep_flag", False))
    documents_complete = parse_bool(case.get("documents_complete", True))
    country = str(case.get("country", "")).upper()
    amount = float(case.get("transaction_amount", 0) or 0)

    score = 0
    reasons = []

    if sanctions_hit:
        score += 100
        reasons.append("sanctions_hit")
    if pep_flag:
        score += 40
        reasons.append("pep_flag")
    if adverse_media_hit:
        score += 30
        reasons.append("adverse_media_hit")
    if country in HIGH_RISK_COUNTRIES:
        score += 25
        reasons.append(f"high_risk_country:{country}")
    if amount >= 10000:
        score += 15
        reasons.append("large_transaction")
    if not documents_complete:
        score += 10
        reasons.append("missing_documents")

    if sanctions_hit or score >= 50:
        level = "high"
    elif score >= 20:
        level = "medium"
    else:
        level = "low"

    if sanctions_hit:
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
