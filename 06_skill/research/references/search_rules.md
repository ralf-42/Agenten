# Suchregeln

Diese Regeln definieren die Suchstrategie des Research-Skills.

## Suchmodus-Auswahl

| Situation | Modus |
|-----------|-------|
| Fachartikel aus dem Kurskorpus | `search_docs` |
| Out-of-Corpus-Verdacht | `search_docs`, danach Stopp-Gate |
| Aktuelle Ereignisse, News, aktuelle Daten | `search_web` nur als explizite Transfer- oder Aktualitätsvariante |
| Kombination aus Korpus und Aktualität | Erst `search_docs`, dann Web nur mit klarer Kennzeichnung |

## Query-Konstruktion

- Thema in **2–3 unabhängige Suchqueries** zerlegen
- Queries so formulieren, dass unterschiedliche Aspekte abgedeckt werden
- Begriffe aus `eval_research.json` und `eval_research_edge.json` als Prüfanker nutzen
- Englisch nur bevorzugen, wenn die Quelle oder der Fachbegriff englisch ist

## Relevanz-Schwellwert

- Score ≥ 0.7 → hoch relevant, direkt verwenden
- Score 0.4–0.69 → bedingt relevant, mit Einschränkung verwenden
- Score < 0.4 → verwerfen

## Mindestanforderungen

- Mindestens **2 relevante Quellen** für einen vollständigen Report
- Bei < 2 Quellen: Status `"insufficient_sources"` zurückgeben
- Bei 0 Quellen mit Score ≥ 0.4: `"Nicht im Korpus"` zurückgeben
- Maximal **8 Quellen** verarbeiten (Kontext-Budget)

## Konflikt-Erkennung

Wenn zwei Quellen eine Kernaussage gegensätzlich darstellen:
- Beide Quellen behalten
- `"conflict": true` im Output markieren
- Writer kennzeichnet den Konflikt im Report explizit
