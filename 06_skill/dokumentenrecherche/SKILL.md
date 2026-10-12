---
name: dokumentenrecherche
description: >-
  Führt strukturierte Dokumentenrecherchen in den Projektunterlagen durch —
  Fundstellen identifizieren, Relevanz bewerten, Aussagen mit Quellen belegen,
  Out-of-Corpus-Fragen stoppen und einen zitierfähigen Recherchebericht
  erstellen. Aktivieren wenn Nutzer sagt: "suche in den Projektunterlagen",
  "wo steht das", "welche Quelle belegt", "was wurde entschieden",
  "Fundstellen zu", "fasse die Unterlagen zusammen", "Dokumentenrecherche",
  "Hintergrundinformation aus den Protokollen" oder "erstelle einen
  Recherchebericht".
---

# Dokumentenrecherche Skill

Dieser Skill deckt die Dokumentenrecherche (Evidence Tool) des PMO-Assistenten ab: quellengebundene Suche in Projektunterlagen als ein Baustein neben Protokoll-, Aufgaben- und Risikoauswertung. Standard-Suchraum sind die Projektartefakte im Korpus `02_daten/01_text/korpus_pmo_assistent/` (Protokolle, Entscheidungsprotokoll, Risikoliste, Follow-up-Tracker, Projektauftrag).

## Aktivierungsbedingung

Dieser Skill wird aktiv, wenn der Nutzer eine Rechercheaufgabe in den Projektunterlagen formuliert. Typische Trigger-Phrasen sind in der `description` aufgeführt.

## Hard Rules

1. **Immer Korpusgrenze prüfen** — Standard ist `search_docs` in den Projektartefakten des Korpus.
2. **Out-of-Corpus stoppen** — wenn keine passende Quelle gefunden wird, `"Nicht im Korpus"` ausgeben.
3. **Quellenbewertung ist bindend** — Relevanz-Score < 0.4 → Quelle verwerfen.
4. **Nie halluzinieren** — fehlende Fakten explizit als "nicht belegt" markieren.
5. **Datum nennen** — bei Entscheidungen und Risikostatus immer das Datum der Quelle angeben; bei Widersprüchen die neuere Quelle kennzeichnen.
6. **Format strikt einhalten** — keine eigenen Strukturen erfinden.
7. **Eval-Set beachten** — typische Prüf- und Grenzfragen stehen in `02_daten/05_sonstiges/eval_meeting_briefing.json` und `eval_meeting_briefing_edge.json`.

## Workflow

```
Nutzeranfrage
    │
    ▼
[Dokumentenrecherche-Skill]
    ├─ Thema analysieren & Suchstrategie definieren
    ├─ Tool: search_docs (Projektartefakte im Korpus)
    ├─ Tool: score_relevance (Quellen bewerten)
    ├─ Gate: Out-of-Corpus, wenn keine Quelle Score ≥ 0.4 erreicht
    └─ Recherchebericht im definierten Ausgabeformat generieren
```

## Aufgaben

- Thema in 2–3 Suchqueries zerlegen
- Quellen aus den Projektartefakten des Korpus abrufen
- Jede Quelle mit `score_relevance` bewerten
- Quellen mit Score < 0.4 ausschließen
- Bei fehlender Korpusabdeckung stoppen statt zu raten
- Strukturierten Recherche-Output erzeugen
- Keine eigenen Interpretationen — nur belegte Aussagen

## Ausgabeformat

```
### Recherchebericht: [Thema]

**Fragestellung:** [Originale Nutzeranfrage]
**Quellen ausgewertet:** [Anzahl] | **Relevante Quellen:** [Anzahl nach Filter]

---

#### Kernaussagen

1. [Aussage] — Quelle: [Dokument, Datum], Relevanz: [Score]
2. [Aussage] — Quelle: [Dokument, Datum], Relevanz: [Score]
...

#### Offene Fragen / Nicht belegte Aspekte

- [Aspekt, der nicht gefunden wurde]

#### Empfehlung

[Kurze Handlungsempfehlung oder nächster Schritt]

---
*Erstellt durch Dokumentenrecherche-Skill*
```

## Eskalation

- Weniger als 2 relevante Quellen gefunden → `"status": "insufficient_sources"`
- Widersprüchliche Quellen → `"conflict": true`
- Thema außerhalb des definierten Suchraums → `"status": "out_of_scope"`
- Keine Quelle mit Score ≥ 0.4 → Antwort: `"Nicht im Korpus"`

## Verwandte Module

- M22 – Agentic RAG (Retrieval-gesteuerte Dokumentensuche)
- M26 – Integration Pipeline (Recherche als Teilschritt)
- M28 – Advanced RAG Pipeline Patterns (Self-RAG, Reranking)
