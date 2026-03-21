# Beispielfälle

## Beispiel 1: Technische Recherche (ausreichend Quellen)

Eingabe:
- query: "Was sind die Neuerungen in LangGraph 1.0?"
- mode: search_web

Gate-Output (vereinfacht):
```json
{
  "topic": "LangGraph 1.0 Neuerungen",
  "sources_evaluated": 4,
  "sources_relevant": 3,
  "findings": [
    {"fact": "Streaming-Events für alle Node-Typen", "source": "LangGraph Docs", "score": 0.92},
    {"fact": "Native Checkpointer-API vereinfacht", "source": "LangGraph Blog", "score": 0.85},
    {"fact": "Interrupt-Mechanismus für HITL überarbeitet", "source": "GitHub Changelog", "score": 0.78}
  ],
  "open_questions": ["Migrationspfad von 0.x noch unklar"],
  "status": "ok"
}
```

Erwartetes Ergebnis: vollständiger Report, 3 Kernaussagen

---

## Beispiel 2: Zu wenig Quellen

Eingabe:
- query: "Vergleich proprietärer Agent-Frameworks 2027"
- mode: search_web

Gate-Output:
```json
{
  "topic": "Agent-Framework-Vergleich 2027",
  "sources_evaluated": 5,
  "sources_relevant": 1,
  "status": "insufficient_sources"
}
```

Erwartetes Ergebnis: Kurzformat mit Hinweis, keine vollständigen Kernaussagen

---

## Beispiel 3: Konflikt zwischen Quellen

Eingabe:
- query: "Kostenvergleich GPT-5.1 vs. o3"

Gate-Output (Auszug):
```json
{
  "findings": [
    {"fact": "GPT-5.1 günstiger pro Token als o3", "source": "OpenAI Pricing Page", "score": 0.88},
    {"fact": "o3 effizienter bei komplexen Tasks trotz höherem Preis", "source": "AI Benchmark Blog", "score": 0.75}
  ],
  "conflict": true
}
```

Erwartetes Ergebnis: Konflikt-Markierung im Report, beide Aussagen genannt
