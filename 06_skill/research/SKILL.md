---
name: research
description: >-
  Führt strukturierte Recherche-Workflows durch — Quellen identifizieren,
  Relevanz bewerten, Wissen synthetisieren und einen zitierfähigen
  Research-Report erstellen. Aktivieren wenn Nutzer sagt: "recherchiere zu",
  "fasse zusammen", "was weiß man über", "erstelle einen Bericht",
  "analysiere das Thema", "suche Quellen zu", "research report",
  "Literaturüberblick", "Marktrecherche" oder "Hintergrundinformation zu".
---

# Research Skill

Dieser Skill definiert einen wiederverwendbaren Recherche-Workflow für agentische Wissenssynthese.

## Aktivierungsbedingung

Dieser Skill wird aktiv, wenn der Nutzer eine Recherche-Aufgabe formuliert. Typische Trigger-Phrasen sind in der `description` aufgeführt.

## Hard Rules

1. **Immer `compliance_check`-Tool aufrufen** — niemals manuell bewerten.
2. **Immer `load_reference`-Tool für Regelwerke nutzen** — nie aus dem Gedächtnis zitieren.
3. **Quellenbewertung ist bindend** — Relevanz-Score < 0.4 → Quelle verwerfen.
4. **Nie halluzinieren** — fehlende Fakten explizit als "nicht belegt" markieren.
5. **Format strikt einhalten** — keine eigenen Strukturen erfinden.

## Workflow

```
Nutzeranfrage
    │
    ▼
[Gate-Agent: o3]
    ├─ Thema analysieren & Suchstrategie definieren
    ├─ Tool: search_web (Websuche) oder search_docs (Vektordatenbank)
    ├─ Tool: score_relevance (Quellen bewerten)
    └─ Strukturiertes Recherche-Ergebnis ausgeben
    │
    ▼
[Writer-LLM: gpt-5.1]
    └─ Research-Report im definierten Ausgabeformat generieren
```

## Gate-Agent: Aufgaben (o3)

- Thema in 2–3 Suchqueries zerlegen
- Quellen abrufen (Web oder Vektordatenbank)
- Jede Quelle mit `score_relevance` bewerten
- Quellen mit Score < 0.4 ausschließen
- Strukturiertes JSON-Ergebnis an Writer übergeben

## Writer-LLM: Aufgaben (gpt-5.1)

- Erhält Gate-Output (JSON mit bewerteten Quellen + Fakten)
- Erstellt Report exakt im Ausgabeformat (siehe unten)
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
*Erstellt durch Research-Skill | Gate: o3 | Writer: gpt-5.1*
```

## Eskalation

- Weniger als 2 relevante Quellen gefunden → Gate gibt `"status": "insufficient_sources"` zurück
- Widersprüchliche Quellen → Gate markiert explizit als `"conflict": true`
- Thema außerhalb des definierten Suchraums → Gate gibt `"status": "out_of_scope"` zurück

## Verwandte Module

- M22 – Agentic RAG (Retrieval-gesteuerte Recherche)
- M26 – Integration Pipeline (Research als Teilschritt)
- M27 – Advanced RAG Pipeline Patterns (Self-RAG, Reranking)
