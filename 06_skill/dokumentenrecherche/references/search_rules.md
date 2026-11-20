# Suchregeln

Diese Regeln definieren die Suchstrategie des Dokumentenrecherche-Skills.

## Suchmodus-Auswahl

| Situation | Modus |
|-----------|-------|
| Protokolle, Entscheidungen, Risiken, Aufgaben aus dem Projektkorpus | `search_docs` |
| Out-of-Corpus-Verdacht | `search_docs`, danach Stopp-Gate |
| Aktuelle Ereignisse oder externe Daten | `search_web` nur als explizite Transfer- oder Aktualitätsvariante |
| Kombination aus Korpus und Aktualität | Erst `search_docs`, dann Web nur mit klarer Kennzeichnung |

## Query-Konstruktion

- Thema in **2–3 unabhängige Suchqueries** zerlegen
- Queries so formulieren, dass unterschiedliche Aspekte abgedeckt werden
- Begriffe aus `eval_pmo.json` und `eval_pmo_edge.json` als Prüfanker nutzen
- Entscheidungs-IDs (D1, D2) und Risiko-IDs (R1–R4) als Suchbegriffe verwenden, wenn bekannt

## Relevanz-Schwellwert

- Score ≥ 0.7 → hoch relevant, direkt verwenden
- Score 0.4–0.69 → bedingt relevant, mit Einschränkung verwenden
- Score < 0.4 → verwerfen

## Mindestanforderungen

- Mindestens **2 relevante Quellen** für einen vollständigen Bericht
- Bei < 2 Quellen: Status `"insufficient_sources"` zurückgeben
- Bei 0 Quellen mit Score ≥ 0.4: `"Nicht im Korpus"` zurückgeben
- Maximal **8 Quellen** verarbeiten (Kontext-Budget)

## Quellenzählung und Nachweise

`Quellen ausgewertet` zählt unterschiedliche Quelldateien, deren Fundstellen tatsächlich gelesen und mit `score_relevance` bewertet wurden. `Relevante Quellen` zählt davon die Dateien mit mindestens einer passenden Fundstelle und Score ≥ 0.4. Mehrere Chunks oder wiederholte Bewertungen derselben Datei zählen nicht als zusätzliche Quelle. Beide Anzahlen werden aus den tatsächlichen Tool-Ergebnissen ermittelt, nicht geschätzt. Die Zahl relevanter Quellen darf die Zahl ausgewerteter Quellen nicht überschreiten.

Jede Kernaussage nennt den exakten Quelldateinamen, das Dokumentdatum und den tatsächlich zurückgegebenen Relevanz-Score. Ein hoher Score ist kein Beweis für die fachliche Richtigkeit. Fehlende Datumsangaben werden als `[offen]` markiert. Der vollständige Recherchebericht enthält Fragestellung, beide Quellenanzahlen, Kernaussagen, offene oder nicht belegte Aspekte und eine Empfehlung für den nächsten Schritt. Wenn nichts offen ist, wird das ausdrücklich vermerkt. Auch bei einer kombinierten Recherche- und Freigabeanfrage bleiben Recherchebericht und anschließender Prüf-/Rückfrageteil getrennt erkennbar.

## Konflikt-Erkennung

Wenn zwei Quellen eine Kernaussage gegensätzlich darstellen (zum Beispiel D1 und D2):
- Beide Quellen behalten
- `"conflict": true` im Output markieren
- Datum der Quellen nennen und die neuere kennzeichnen
- Writer kennzeichnet den Konflikt im Bericht explizit
