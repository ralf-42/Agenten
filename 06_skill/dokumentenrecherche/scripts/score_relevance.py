"""
score_relevance.py — Deterministischer Relevanz-Scorer für den Dokumentenrecherche-Skill.

Bewertet eine Quelle (Projektdokument) anhand von Keyword-Übereinstimmung und Metadaten.
Wird vom Dokumentenrecherche-Skill als Tool aufgerufen.

Verwendung:
    python score_relevance.py '{"query": "Status Risiko R2", "source_text": "...", "source_url": "risikoliste_v1.pdf"}'
"""
from __future__ import annotations

import json
import re
import sys


def tokenize(text: str) -> set[str]:
    """Zerlegt Text in Tokens (Lowercase, nur alphanumerisch)."""
    return set(re.findall(r"[a-züäöß]{3,}", text.lower()))


def score(query: str, source_text: str, source_url: str = "") -> dict:
    """
    Berechnet einen Relevanz-Score [0.0 – 1.0].

    Faktoren:
    - Keyword-Overlap zwischen Query und Source-Text (Hauptfaktor)
    - Dokumenttyp-Bonus für Protokolle, Entscheidungsprotokoll, Risikoliste und Tracker
    - Längenmalus bei sehr kurzen Texten (< 100 Zeichen)
    """
    query_tokens = tokenize(query)
    source_tokens = tokenize(source_text)

    if not query_tokens:
        return {"score": 0.0, "reason": "empty_query"}

    # Keyword-Overlap (Jaccard-ähnlich, Query-zentriert)
    overlap = query_tokens & source_tokens
    keyword_score = len(overlap) / len(query_tokens)

    # Dokumenttyp-Bonus: verbindliche Projektdokumente bevorzugen
    trusted_prefixes = [
        "protokoll_",
        "entscheidungsprotokoll",
        "risikoliste",
        "follow_up_tracker",
        "projektauftrag",
    ]
    url_bonus = 0.1 if any(source_url.lower().startswith(p) for p in trusted_prefixes) else 0.0

    # Längenmalus
    length_penalty = -0.2 if len(source_text.strip()) < 100 else 0.0

    raw_score = keyword_score + url_bonus + length_penalty
    final_score = round(max(0.0, min(1.0, raw_score)), 3)

    level = (
        "high" if final_score >= 0.7
        else "medium" if final_score >= 0.4
        else "low"
    )

    return {
        "score": final_score,
        "level": level,
        "matched_keywords": sorted(overlap),
        "url_bonus": url_bonus > 0,
        "use": final_score >= 0.4,
    }


def main() -> None:
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Kein Input-JSON übergeben"}))
        sys.exit(1)

    try:
        data = json.loads(sys.argv[1])
    except json.JSONDecodeError as exc:
        print(json.dumps({"error": f"JSON-Parse-Fehler: {exc}"}))
        sys.exit(1)

    result = score(
        query=data.get("query", ""),
        source_text=data.get("source_text", ""),
        source_url=data.get("source_url", ""),
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
