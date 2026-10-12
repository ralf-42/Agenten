# Beispielfälle

## Beispiel 1: Recherche mit ausreichend Quellen

Eingabe:
- query: "Wie hat sich der Status von Risiko R2 zwischen 17.03. und 28.04.2026 verändert?"
- mode: search_docs

Strukturierter Skill-Output (vereinfacht):
```json
{
  "topic": "Status Risiko R2",
  "sources_evaluated": 4,
  "sources_relevant": 2,
  "findings": [
    {"fact": "R2 (Datenschutzfreigabe) war am 17.03.2026 offen und hoch eingestuft", "source": "risikoliste_v1.pdf, 17.03.2026", "score": 0.91},
    {"fact": "R2 wurde am 28.04.2026 auf mitigiert gesetzt, Freigabe von Dr. Thomas Brandt liegt vor", "source": "protokoll_steuerkreis_2026-04-28.pdf", "score": 0.88}
  ],
  "open_questions": ["Für produktive Daten ist eine separate Prüfung erforderlich"],
  "status": "ok"
}
```

Erwartetes Ergebnis: vollständiger Bericht, 2 Kernaussagen mit Datum

---

## Beispiel 2: Zu wenig Quellen

Eingabe:
- query: "Wie hoch ist das exakte Projektbudget in Euro?"
- mode: search_docs

Strukturierter Skill-Output:
```json
{
  "topic": "Projektbudget",
  "sources_evaluated": 5,
  "sources_relevant": 0,
  "status": "out_of_scope"
}
```

Erwartetes Ergebnis: "Nicht im Korpus", keine Kernaussagen

---

## Beispiel 3: Konflikt zwischen Quellen

Eingabe:
- query: "Welche Entscheidung zur Vektordatenbank gilt aktuell?"

Strukturierter Skill-Output (Auszug):
```json
{
  "findings": [
    {"fact": "D1 (17.03.2026): ChromaDB wird für den Prototyp evaluiert", "source": "protokoll_steuerkreis_2026-03-17.pdf", "score": 0.89},
    {"fact": "D2 (14.04.2026): Eine verwaltete Cloud-Vektordatenbank wird für den produktiven Einsatz genutzt", "source": "protokoll_steuerkreis_2026-04-14.pdf", "score": 0.93}
  ],
  "conflict": true
}
```

Erwartetes Ergebnis: Konflikt-Markierung im Bericht, beide Aussagen mit Datum genannt, D2 als neuere Entscheidung gekennzeichnet
