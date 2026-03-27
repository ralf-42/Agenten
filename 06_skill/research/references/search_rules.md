# Suchregeln

Diese Regeln definieren die Suchstrategie des Research-Skills.

## Suchmodus-Auswahl

| Situation | Modus |
|-----------|-------|
| Aktuelle Ereignisse, News, aktuelle Daten | `search_web` |
| Kurs-eigene Dokumente, interne Wissensbasis | `search_docs` |
| Kombination aus beidem | Beide Tools nacheinander |

## Query-Konstruktion

- Thema in **2–3 unabhängige Suchqueries** zerlegen
- Queries so formulieren, dass unterschiedliche Aspekte abgedeckt werden
- Englisch bevorzugen bei technischen Themen

## Relevanz-Schwellwert

- Score ≥ 0.7 → hoch relevant, direkt verwenden
- Score 0.4–0.69 → bedingt relevant, mit Einschränkung verwenden
- Score < 0.4 → verwerfen

## Mindestanforderungen

- Mindestens **2 relevante Quellen** für einen vollständigen Report
- Bei < 2 Quellen: Status `"insufficient_sources"` zurückgeben
- Maximal **8 Quellen** verarbeiten (Kontext-Budget)

## Konflikt-Erkennung

Wenn zwei Quellen eine Kernaussage gegensätzlich darstellen:
- Beide Quellen behalten
- `"conflict": true` im Output markieren
- Writer kennzeichnet den Konflikt im Report explizit
