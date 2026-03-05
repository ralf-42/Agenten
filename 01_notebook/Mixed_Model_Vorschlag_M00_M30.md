# Vorschlag: Mixed-Model-Ansatz fuer M00-M30 (nur Analyse, keine Umsetzung)

## Ziel

Bewerten, in welchen Modulen ein Mixed-Model-Setup (z. B. `gpt-5.1` + `o3`) didaktisch und technisch sinnvoll ist.

## Kurzfazit

- **Nicht ueberall mischen.** In Grundlagenmodulen ist ein einzelnes Modell didaktisch klarer.
- **Mixed-Model lohnt sich vor allem ab Routing/Orchestrierung und bei Multi-Agent.**
- **Groesster Hebel:** Supervisor/Router/Judge auf `o3`, Worker auf `gpt-5.1`.

## Profil-Vorschlag (einheitlich)

- `fast`: alles auf kleinem Modell (z. B. `gpt-4o-mini`) fuer Demo-Tempo
- `balanced`: Worker `gpt-5.1`, kritische Steuerknoten `o3`
- `quality`: Recherche/Planner/Supervisor/Judge `o3`, Writer/Code je nach Task `gpt-5.1` oder `o3`

## Modulweise Empfehlung

| Module | Mixed-Model sinnvoll? | Vorschlag |
|---|---|---|
| M00-M03 (Intro, Agentenbasis, Tool Use, erste Agenten) | Niedrig | Ein Modell beibehalten. Fokus auf Konzepte statt Modellvergleich. |
| M04-M06 (Prompt, LCEL, Structured Output) | Niedrig-Mittel | Primar ein Modell. Optional Mini-Exkurs: `gpt-5.1` fuer Generierung, `o3` als strukturierter Pruefer/Judge in M06. |
| M07 (Multi-Tool Agents) | Mittel | Agent auf `gpt-5.1`; optional zweiter Lauf mit `o3` nur fuer schwierige Tool-Wahl-Faelle. |
| M08-M10 (RAG-Konzepte, Indexing, RAG-Chain) | Mittel | Query-Rewrite/Planung auf `o3`, Antwortsynthese auf `gpt-5.1`. Retrieval selbst bleibt modellunabhaengig. |
| M11 (RAG-Agent) | Hoch | Router/Entscheidung `o3`, Antwort-Agent `gpt-5.1`. Bei Halluzinationssensitivitaet: Abschluss-Check durch `o3`. |
| M12-M14 (Warum LangGraph, StateGraph, Routing/Loops) | Hoch | Routing- und Conditional-Entscheidungen auf `o3`; Worker/Tool-Aufrufe auf `gpt-5.1`. |
| M15-M16 (Checkpointing, HITL) | Mittel-Hoch | Laufende Agent-Operationen `gpt-5.1`; kritische Approval-/Escalation-Entscheide optional `o3`. |
| M17-M19 (Multi-Agent Patterns, Supervisor, Projekt) | Sehr hoch | Supervisor `o3`, Worker-Agenten `gpt-5.1` (Research bei Bedarf `o3`). |
| M20 (OpenAI Agent Builder) | Mittel | Fuer Vergleichslauf: Builder-Standardmodell vs. Code-Variante mit Supervisor `o3`, Worker `gpt-5.1`. |
| M21 (LangSmith Evaluations) | Sehr hoch | Candidate-Agent `gpt-5.1`, Eval/Judge `o3` fuer robustere qualitative Bewertung. |
| M22 (Agentic RAG) | Sehr hoch | Planner/Adaptive-Routing `o3`, Generator `gpt-5.1`, optional finaler Fact-Check `o3`. |
| M23 (Evaluation & Testing, Template) | Sehr hoch | Architekturvorschlag: SUT `gpt-5.1`, Judge/Evaluator `o3`, Regression-Baseline fixiert. |
| M24 (Security, Template) | Hoch | Policy-/Risk-Classifier `o3`, Ausfuehrender Agent `gpt-5.1`. |
| M25 (Advanced RAG Patterns) | Sehr hoch | Query-Rewrite/Grading/Reranking-Steuerung `o3`, Antwortgenerierung `gpt-5.1`. |
| M26 (Gradio UI, Template) | Mittel | Backend-orchestrierung wie M17/M22; UI selbst modellagnostisch. |
| M27 (MCP, Template) | Hoch | Tool-Selection/Permission-Gates `o3`, fachliche Worker `gpt-5.1`. |
| M28 (Production Deployment, Template) | Mittel-Hoch | Betriebsprofil: `balanced` als Default; `quality` nur fuer kritische Pfade, sonst Kosten/Latenz hoch. |
| M29 (Hierarchical Teams, Template) | Sehr hoch | Chief + Team-Supervisors `o3`; Specialists `gpt-5.1` (oder kleiner je Task). |
| M30 (Collaborative Multi-Agent) | Sehr hoch | Supervisor `o3`, Research `o3`, Writer/Code `gpt-5.1`; optional `o3` fuer schwieriges Debugging und finalen Qualitaetscheck. |

## Umgesetzt in

→ **[docs/frameworks/Modell_Auswahl_Guide.md](../docs/frameworks/Modell_Auswahl_Guide.md)**

## Priorisierte Umsetzung (wenn spaeter umgesetzt wird)

1. **Phase 1 (hoher Nutzen, wenig Risiko):** M17-M19, M21, M22, M25, M30
2. **Phase 2:** M11-M16
3. **Phase 3:** M23, M24, M27, M29 (beim Ausfuellen der Templates direkt richtig designen)
4. **Phase 4:** M00-M10 nur punktuelle Vergleichs-Exkurse

## Designregeln fuer alle Module

- Router/Supervisor/Judge bevorzugt `o3`.
- Content-/Code-Worker standardmaessig `gpt-5.1`.
- Einfache Extraktions- oder Formatierungsjobs nicht auf Premium-Modell heben.
- Immer mindestens einen Baseline-Run mit Ein-Model dokumentieren.
- Vergleich standardisieren: Qualitaet, Schritte bis `FINISH`, Laufzeit, Kosten.

## Konkreter Minimalstandard pro Multi-Agent-Modul

- 1x Baseline-Run (Single-Model)
- 1x Mixed-Model-Run (`o3` Steuerung + `gpt-5.1` Worker)
- Kurzer Vergleich in Tabelle mit 4 Kennzahlen: Ergebnisqualitaet, Schritte, Latenz, Kosten

