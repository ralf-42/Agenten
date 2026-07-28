# Jupyter Notebooks – Agenten Kurs

## Modulstruktur

Dieses Verzeichnis enthält aktuell **40 Modul-Notebooks** für den Kurs „KI-Agenten. Planen. Handeln. Prüfen."

Die Nummerierung reicht lückenlos von **M01 bis M40**. Frühere a/b-Teilmodule wurden in die laufende Modulnummerierung überführt.

> **Kursplan-Referenz:** Kursplan v5.0 – `../00_admin/Kursplan_KI-Agenten_5-Phase e_v4.7.md`

---

## Snippet-Sammlung

| Datei | Inhalt | Einsatz |
|---|---|---|
| `A00_snippets_agenten.ipynb` | Copy/Paste-Bausteine für LangChain, LangGraph, Checkpointing, HITL, Multi-Agent-Patterns und LangSmith | Referenz für Übungen und eigene Varianten |



---

Der rote Faden der Pflicht- und Empfehlungsmodule ist ein **Meeting- & Research-Briefing-Agent**. Die Module M01-M26 bauen vom ersten Agentenverständnis bis zu RAG, Sessions, Memory, Multi-Agent-Patterns, Security, Evaluation, Routing und Kostenkontrolle auf dasselbe Zielsystem hin.

## Phase  1 – Konzepte & erste Agenten (M01–M03)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M01 | `M01_Was_sind_KI_Agenten.ipynb` | Agentenbegriff, Meeting- & Research-Briefing-Zielbild, ReAct/TAO-Prinzip | 🟢 Pflicht |
| M02 | `M02_Tool_Use_Function_Calling.ipynb` | Erste Tools für Projekt- und Recherchefragen mit `@tool`, Type Hints, Docstrings und Grenzen | 🟢 Pflicht |
| M03 | `M03_Erste_Agenten_LangChain.ipynb` | Erster Meeting- & Research-Briefing-Agent mit `create_agent()` | 🟢 Pflicht |

---

## Phase  2 – Prompt Engineering, Structured Output, LCEL (M04–M07)

| Modul | Datei                                       | Inhalt                                                     | Prio       |
| ----- | ------------------------------------------- | ---------------------------------------------------------- | ---------- |
| M04   | `M04_Prompt_Engineering_fuer_Agenten.ipynb` | Rollen, Tool-Regeln und Few-Shot-Klassifikation für den Briefing-Agent | 🟢 Pflicht |
| M05   | `M05_Structured_Output.ipynb`               | Antwortschema, Quellenpflicht und strukturierte Prüfbarkeit mit Pydantic und `with_structured_output()` | 🟢 Pflicht |
| M06   | `M06_Multi_Tool_Agents.ipynb`               | Mehrere Projekt- und Recherche-Tools, Tool-Auswahl, robuste Fehlerbehandlung | 🟢 Pflicht |
| M07   | `M07_LCEL_Chains.ipynb`                     | Kontrollierte Teilketten für Antwort, Prüfung und Übergang zu LangGraph | 🟢 Pflicht |

---

## Phase  3 – LangGraph: Agenten-Kontrolle (M08–M11)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M08 | `M08_Warum_LangGraph.ipynb` | Warum der Meeting- & Research-Briefing-Agent kontrollierten State braucht | 🟢 Pflicht |
| M09 | `M09_StateGraph_Basics.ipynb` | StateGraph, Nodes, Edges und Briefing-State | 🟢 Pflicht |
| M10 | `M10_Conditional_Routing.ipynb` | Briefing-Routing, Qualitäts-Gate, Security-Basics | 🟢 Pflicht |
| M11 | `M11_Tool_Loop.ipynb` | Tool-Loop, Tool-Steuerung im Graph | 🟢 Pflicht |

---

## Phase  4 – Agenten mit Wissen / RAG (M12–M16)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M12 | `M12_RAG_Konzepte_Embeddings.ipynb` | Meeting-Briefing-Korpus, RAG-Architektur, Embeddings, Chunking | 🟢 Pflicht |
| M13 | `M13_ChromaDB_Indexing.ipynb` | Meeting- und Projekt-PDFs indexieren und testbar abfragen | 🟢 Pflicht |
| M14 | `M14_RAG_Chain_LangChain.ipynb` | Quellengebundene RAG-Chain mit Retrieval-Treffern | 🟢 Pflicht |
| M15 | `M15_RAG_Agent.ipynb` | Retrieval als Tool, Quellenpflicht und Out-of-Corpus-Grenze | 🟢 Pflicht |
| M16 | `M16_LangSmith_Evaluations_Basics.ipynb` | Eval-Set, Retrieval-Score, Antwortqualität, Regression | 🟡 Empfohlen |

---

## Phase  5 – HITL, Memory & Multi-Agent (M17–M22)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M17 | `M17_Checkpointing_Sessions.ipynb` | Briefing-Sessions mit InMemorySaver und SQLite fortsetzen | 🟢 Pflicht |
| M18 | `M18_Human_in_the_Loop.ipynb` | `interrupt()`, Approve/Reject, HITL-Patterns | 🟢 Pflicht |
| M19 | `M19_Memory_Systeme.ipynb` | Kuratiertes Briefing-Memory und Per-User-Präferenzen | 🟢 Pflicht |
| M20 | `M20_Multi_Agent_Patterns.ipynb` | Supervisor, Hierarchie und Pipeline für Briefing- und Rechercheaufgaben | 🟢 Pflicht |
| M21 | `M21_Supervisor_Pattern.ipynb` | Briefing-Supervisor mit Quellen-, Kritik- und Guardrail-Gates | 🟢 Pflicht |
| M22 | `M22_Hierarchical_Pattern.ipynb` | Quellen-, Synthese- und Qualitäts-Team als Hierarchie | 🟢 Pflicht |

---

## Erweiterte Module – Spezialisierung & Produktion (M23–M40)

> Diese Module sind **nicht Teil des 5-Phasen-Kurses**. Sie eignen sich als Follow-up-Material nach dem Kurs.

| Modul | Datei | Inhalt | Priorität |
|-------|-------|--------|-----------|
| M23 | `M23_Agentic_RAG.ipynb` | Agentic RAG mit Retrieval-Budget, Grounding und OOC-Stopp | 🟡 Empfohlen |
| M24 | `M24_Agent_Security_Best_Practices.ipynb` | Prompt Injection, Tool-Gating, Audit-Log, PII-Redaktion | 🟡 Empfohlen |
| M25 | `M25_Agent_Evaluation_Testing.ipynb` | Reproduzierbare Evaluation, Regression, RAGAS-Live-Lauf | 🟡 Empfohlen |
| M26 | `M26_Model_Routing_Cost_Control.ipynb` | Model Routing, Fallback, Circuit Breaker, Token-/Kostenkontrolle und Budget Gate | 🟡 Empfohlen |
| M27 | `M27_Integration_Pipeline.ipynb` | Integration: Meeting- & Research-Briefing-System als End-to-End-Pipeline | 🔵 Optional |
| M28 | `M28_Projekt_Templates.ipynb` | Eigene Projekt-Templates A/B/C, MVP-Definition | 🔵 Optional |
| M29 | `M29_Advanced_RAG_Pipeline_Patterns.ipynb` | Self-RAG, Reranking, Multi-Vector, CRAG | 🔵 Optional |
| M30 | `M30_Gradio_UI_fuer_Agenten.ipynb` | ChatInterface, Blocks, Streaming, HITL-UI | 🔵 Optional |
| M31 | `M31_MCP_Local.ipynb` | Model Context Protocol, lokale MCP-Server | 🔵 Optional |
| M32 | `M32_MCP_HuggingFace.ipynb` | MCP mit HuggingFace-Integration | 🔵 Optional |
| M33 | `M33_Agent_Skill_Compliance.ipynb` | SKILL.md-Struktur, Guardrails, Mixed-Model-Pattern | 🔵 Optional |
| M34 | `M34_DeepAgents_Harness.ipynb` | Planning, Tools, Sub-Agent Spawning (DeepAgents-Kern) | 🔵 Optional |
| M35 | `M35_DeepAgents_Vertiefung.ipynb` | Weitere Parameter, Sandbox-Backends, Vergleich zu LangGraph | 🔵 Optional |
| M36 | `M36_DeepAgents_Skill_Meeting_Briefing.ipynb` | Meeting-Briefing Skill, DeepAgents, GitHub-Skill-Dateien, MarkItDown | 🔵 Optional |
| M37 | `M37_DeepAgent_Multi_Skill.ipynb` | DeepAgents native skills=[...]-API, Progressive Disclosure, Multi-Skill-Routing | 🔵 Optional |
| M38 | `M38_Production_Deployment.ipynb` | Notebook → Production, zentrale Modell-Konfiguration, Docker | 🔵 Optional |
| M39 | `M39_API_Monitoring.ipynb` | FastAPI-Endpoints, Production Monitoring, Kursrückblick | 🔵 Optional |
| M40 | `M40_Capstone.ipynb` | Capstone-Projekt | 🔵 Optional |


**Version:** 3.0    
**Stand:** Juli 2026    
**Kursplan-Referenz:** v5.0    
