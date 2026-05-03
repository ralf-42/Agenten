---
name: research
description: >-
  Führt strukturierte Recherche-Workflows im Fachartikel-Korpus durch — Quellen
  identifizieren, Relevanz bewerten, Wissen synthetisieren, Out-of-Corpus-Fragen
  stoppen und einen zitierfähigen Research-Report erstellen. Aktivieren wenn Nutzer sagt: "recherchiere zu",
  "fasse zusammen", "was weiß man über", "erstelle einen Bericht",
  "analysiere das Thema", "suche Quellen zu", "research report",
  "Literaturüberblick", "Marktrecherche" oder "Hintergrundinformation zu".
---

# Research Skill

Dieser Skill definiert den Hauptworkflow des Kurses: einen quellengebundenen Research Assistant für Fachartikel. Standard-Suchraum ist der lokale Research-Korpus aus `02_daten/01_text/korpus_research/`; Websuche ist nur eine explizite Transfer- oder Aktualitätsvariante.

## Aktivierungsbedingung

Dieser Skill wird aktiv, wenn der Nutzer eine Recherche-Aufgabe formuliert. Typische Trigger-Phrasen sind in der `description` aufgeführt.

## Hard Rules

1. **Immer Korpusgrenze prüfen** — Standard ist `search_docs` im lokalen Fachartikel-Korpus.
2. **Out-of-Corpus stoppen** — wenn keine passende Quelle gefunden wird, `"Nicht im Korpus"` ausgeben.
3. **Quellenbewertung ist bindend** — Relevanz-Score < 0.4 → Quelle verwerfen.
4. **Nie halluzinieren** — fehlende Fakten explizit als "nicht belegt" markieren.
5. **Format strikt einhalten** — keine eigenen Strukturen erfinden.
6. **Eval-Set beachten** — typische Prüf- und Grenzfragen stehen in `02_daten/05_sonstiges/eval_research.json` und `eval_research_edge.json`.

## Workflow

```
Nutzeranfrage
    │
    ▼
[Research-Skill]
    ├─ Thema analysieren & Suchstrategie definieren
    ├─ Tool: search_docs (lokaler Fachartikel-Korpus)
    ├─ Tool: score_relevance (Quellen bewerten)
    ├─ Gate: Out-of-Corpus, wenn keine Quelle Score ≥ 0.4 erreicht
    └─ Research-Report im definierten Ausgabeformat generieren
```

## Aufgaben

- Thema in 2–3 Suchqueries zerlegen
- Quellen aus dem lokalen Fachartikel-Korpus abrufen
- Jede Quelle mit `score_relevance` bewerten
- Quellen mit Score < 0.4 ausschließen
- Bei fehlender Korpusabdeckung stoppen statt zu raten
- Strukturierten Research-Output erzeugen
- Keine eigenen Interpretationen — nur belegte Aussagen

## Ausgabeformat

```
### Research-Report: [Thema]

**Fragestellung:** [Originale Nutzeranfrage]
**Quellen ausgewertet:** [Anzahl] | **Relevante Quellen:** [Anzahl nach Filter]

---

#### Kernaussagen

1. [Aussage] — Quelle: [Quelle], Relevanz: [Score]
2. [Aussage] — Quelle: [Quelle], Relevanz: [Score]
...

#### Offene Fragen / Nicht belegte Aspekte

- [Aspekt, der nicht gefunden wurde]

#### Empfehlung

[Kurze Handlungsempfehlung oder nächster Schritt]

---
*Erstellt durch Research-Skill*
```

## Eskalation

- Weniger als 2 relevante Quellen gefunden → `"status": "insufficient_sources"`
- Widersprüchliche Quellen → `"conflict": true`
- Thema außerhalb des definierten Suchraums → `"status": "out_of_scope"`
- Keine Quelle mit Score ≥ 0.4 → Antwort: `"Nicht im Korpus"`

## Verwandte Module

- M22 – Agentic RAG (Retrieval-gesteuerte Recherche)
- M26 – Integration Pipeline (Research als Teilschritt)
- M27 – Advanced RAG Pipeline Patterns (Self-RAG, Reranking)
