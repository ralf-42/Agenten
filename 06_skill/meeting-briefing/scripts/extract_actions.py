"""
extract_actions.py — Deterministischer Action-Item-Extraktor für den Meeting-Briefing-Skill.

Extrahiert Action Items aus Meeting-Notizen oder Kontext-Dokumenten anhand
von Signalwörtern und Strukturmustern.
Wird vom Meeting-Briefing-Skill als Tool aufgerufen.

Verwendung:
    python extract_actions.py '{"text": "Anna übernimmt den Report bis Freitag."}'
"""
from __future__ import annotations

import json
import re
import sys
from typing import Optional


# ---------------------------------------------------------------------------
# Signalwörter
# ---------------------------------------------------------------------------

ACTION_VERBS = [
    "übernimmt", "erstellt", "sendet", "schickt", "prüft", "koordiniert",
    "liefert", "implementiert", "dokumentiert", "freigibt", "lädt ein",
    "organisiert", "klärt", "informiert", "präsentiert", "bereitet vor",
    "analysiert", "entwirft", "abstimmt", "terminiert",
    # Imperativformen / Infinitive als Zuweisung
    "soll", "muss", "wird", "ist verantwortlich",
]

# Datumshinweise (relativ und absolut)
DATE_PATTERNS = [
    r"\b(bis\s+(?:Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag))\b",
    r"\b(bis\s+(?:morgen|übermorgen|nächste\s+Woche|Ende\s+(?:der\s+)?Woche))\b",
    r"\b(bis\s+zum?\s+\d{1,2}\.\s*\d{1,2}\.(?:\s*\d{2,4})?)\b",
    r"\b(bis\s+\d{4}-\d{2}-\d{2})\b",
    r"\b(bis\s+(?:Sprint-Ende|Release|Meeting|Abnahme))\b",
    r"\b(\d{1,2}\.\s*\d{1,2}\.(?:\s*\d{2,4})?)\b",
    r"\b(\d{4}-\d{2}-\d{2})\b",
]


def _extract_date(sentence: str) -> Optional[str]:
    """Sucht nach dem ersten Datumshinweis im Satz."""
    for pattern in DATE_PATTERNS:
        match = re.search(pattern, sentence, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None


def _extract_owner(sentence: str) -> Optional[str]:
    """
    Heuristik: Wort direkt vor einem Aktionsverb als Eigentümer-Kandidat.
    Erkennt auch Muster wie 'Aufgabe für Anna' oder 'Anna: ...'.
    """
    # Muster: "Name: Aufgabe"
    colon_match = re.match(r"^([A-ZÄÖÜ][a-zäöüß]+(?:\s[A-ZÄÖÜ][a-zäöüß]+)?):\s", sentence)
    if colon_match:
        return colon_match.group(1)

    # Muster: "für [Name]"
    fuer_match = re.search(r"\bfür\s+([A-ZÄÖÜ][a-zäöüß]+)\b", sentence)
    if fuer_match:
        return fuer_match.group(1)

    # Muster: "[Name] übernimmt/erstellt/..."
    for verb in ACTION_VERBS:
        pattern = rf"\b([A-ZÄÖÜ][a-zäöüß]+(?:\s[A-ZÄÖÜ][a-zäöüß]+)?)\s+{re.escape(verb)}\b"
        match = re.search(pattern, sentence, re.IGNORECASE)
        if match:
            return match.group(1)

    return None


def _clean_task(sentence: str, owner: Optional[str], date: Optional[str]) -> str:
    """Kürzt den Satz auf den Kern der Aufgabe."""
    task = sentence.strip().rstrip(".")

    # Datum entfernen (wird separat ausgegeben)
    if date:
        task = task.replace(date, "").strip().rstrip(",").strip()

    # Eigentümer am Satzanfang entfernen
    if owner and task.lower().startswith(owner.lower()):
        task = task[len(owner):].strip().lstrip(":").strip()

    # Aktionsverb am Anfang als Imperativ behalten, sonst kürzen
    return task if task else sentence.strip()


def extract_actions(text: str) -> list[dict]:
    """
    Analysiert Text und extrahiert Action Items.

    Returns:
        Liste von Dicts mit keys: task, owner, due
    """
    sentences = re.split(r"(?<=[.!?])\s+|\n", text)
    results = []

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence or len(sentence) < 10:
            continue

        # Prüfen ob Aktionsverb vorhanden
        has_action = any(
            re.search(rf"\b{re.escape(verb)}\b", sentence, re.IGNORECASE)
            for verb in ACTION_VERBS
        )
        if not has_action:
            continue

        owner = _extract_owner(sentence)
        due = _extract_date(sentence)
        task = _clean_task(sentence, owner, due)

        results.append({
            "task": task,
            "owner": owner or "[offen]",
            "due": due or "[offen]",
        })

    return results


def prioritize(items: list[dict], max_items: int = 5) -> dict:
    """
    Priorisiert Action Items nach Fälligkeit.
    Gibt Top-N zurück und Rest als Backlog.
    """
    # Items mit konkretem Datum zuerst
    dated = [i for i in items if i["due"] != "[offen]"]
    undated = [i for i in items if i["due"] == "[offen]"]

    sorted_items = dated + undated

    if len(sorted_items) <= max_items:
        return {"top": sorted_items, "backlog": []}

    return {
        "top": sorted_items[:max_items],
        "backlog": sorted_items[max_items:],
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

    text = data.get("text", "")
    if not text:
        print(json.dumps({"action_items": [], "count": 0}))
        return

    items = extract_actions(text)
    result = prioritize(items)

    output = {
        "action_items": result["top"],
        "count": len(result["top"]),
        "backlog_count": len(result["backlog"]),
        "backlog": [i["task"] for i in result["backlog"]],
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
