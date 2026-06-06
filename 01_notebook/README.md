# Jupyter Notebooks – Agenten Kurs

## Modulstruktur

Dieses Verzeichnis enthält **36 Kurs-Notebooks (M01–M36)** für den Kurs „KI-Agenten. Verstehen. Anwenden. Gestalten."

> **Kursplan-Referenz:** Kursplan v5.0 – `../00_admin/Kursplan_KI-Agenten_5-Phase e_v4.7.md`

---

## Snippet-Sammlung

| Datei | Inhalt | Einsatz |
|---|---|---|
| `A00_snippets_agenten.ipynb` | Copy/Paste-Bausteine für LangChain, LangGraph, Checkpointing, HITL, Multi-Agent-Patterns und LangSmith | Referenz für Übungen und eigene Varianten |



---

Der rote Faden der Pflichtmodule ist ein **Research Assistant für Fachartikel**. Die Module M01-M24 bauen vom ersten Agentenverständnis bis zu RAG, Sessions, Memory, Multi-Agent-Patterns, Security und Evaluation auf dasselbe Zielsystem hin.

## Phase  1 – Konzepte & erste Agenten (M01–M03)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M01 | `M01_Was_sind_KI_Agenten.ipynb` | Agentenbegriff, Research-Assistant-Zielbild, ReAct/TAO-Prinzip | 🟢 Pflicht |
| M02 | `M02_Tool_Use_Function_Calling.ipynb` | Research-Tools mit `@tool`, Type Hints, Docstrings und Grenzen | 🟢 Pflicht |
| M03 | `M03_Erste_Agenten_LangChain.ipynb` | Erster Research Assistant mit `create_agent()` | 🟢 Pflicht |

---

## Phase  2 – Prompt Engineering, Structured Output, LCEL (M04–M07)

| Modul | Datei                                       | Inhalt                                                     | Prio       |
| ----- | ------------------------------------------- | ---------------------------------------------------------- | ---------- |
| M04   | `M04_Prompt_Engineering_fuer_Agenten.ipynb` | Research-Rollen, Tool-Regeln, Few-Shot-Klassifikation      | 🟢 Pflicht |
| M05   | `M05_Structured_Output.ipynb`               | Paper-Signale mit Pydantic und `with_structured_output()`  | 🟢 Pflicht |
| M06   | `M06_Multi_Tool_Agents.ipynb`               | Research-Toolset, Tool-Auswahl, robuste Fehlerbehandlung   | 🟢 Pflicht |
| M07   | `M07_LCEL_Chains.ipynb`                     | Research-Chain, Parallelprüfung, Brücke zu LangGraph       | 🟢 Pflicht |

---

## Phase  3 – LangGraph: Agenten-Kontrolle (M08–M10)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M08 | `M08_Warum_LangGraph.ipynb` | Warum der Research Assistant kontrollierten State braucht | 🟢 Pflicht |
| M09 | `M09_StateGraph_Basics.ipynb` | StateGraph, Nodes, Edges und Research-State | 🟢 Pflicht |
| M10 | `M10_Conditional_Routing_Tool_Loop.ipynb` | Research-Routing, Tool-Loop, Security-Gate | 🟢 Pflicht |

---

## Phase  4 – Agenten mit Wissen / RAG (M11–M15)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M11 | `M11_RAG_Konzepte_Embeddings.ipynb` | Research-Korpus, RAG-Architektur, Embeddings, Chunking | 🟢 Pflicht |
| M12 | `M12_ChromaDB_Indexing.ipynb` | Research-PDFs indexieren und testbar abfragen | 🟢 Pflicht |
| M13 | `M13_RAG_Chain_LangChain.ipynb` | Quellengebundene RAG-Chain mit Retrieval-Treffern | 🟢 Pflicht |
| M14 | `M14_RAG_Agent.ipynb` | Retrieval als Tool, Quellenpflicht und Out-of-Corpus-Grenze | 🟢 Pflicht |
| M15 | `M15_LangSmith_Evaluations_Basics.ipynb` | Eval-Set, Retrieval-Score, Antwortqualität, Regression | 🟡 Empfohlen |

---

## Phase  5 – HITL, Memory & Multi-Agent (M16–M21)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M16 | `M16_Checkpointing_Sessions.ipynb` | Research-Sessions mit MemorySaver und SQLite fortsetzen | 🟢 Pflicht |
| M17 | `M17_Human_in_the_Loop.ipynb` | `interrupt()`, Approve/Reject, HITL-Patterns | 🟢 Pflicht |
| M18 | `M18_Memory_Systeme.ipynb` | Kuratiertes Research-Memory und Per-User-Präferenzen | 🟢 Pflicht |
| M19 | `M19_Multi_Agent_Patterns.ipynb` | Supervisor, Hierarchie und Pipeline für Research-Aufgaben | 🟢 Pflicht |
| M20 | `M20_Supervisor_Pattern.ipynb` | Research-Supervisor mit Quellen-, Kritik- und Guardrail-Gates | 🟢 Pflicht |
| M21 | `M21_Hierarchical_Pattern.ipynb` | Quellen-, Synthese- und Qualitäts-Team als Hierarchie | 🟢 Pflicht |

---

## Erweiterte Module – Spezialisierung & Produktion (M22–M36)

> Diese Module sind **nicht Teil des 5-Phasen-Kurses**. Sie eignen sich als Follow-up-Material nach dem Kurs.

| Modul | Datei | Inhalt | Priorität |
|-------|-------|--------|-----------|
| M22 | `M22_Agentic_RAG.ipynb` | Agentic RAG mit Retrieval-Budget, Grounding und OOC-Stopp | 🟡 Empfohlen |
| M23 | `M23_Agent_Security_Best_Practices.ipynb` | Prompt Injection, Tool-Gating, Audit-Log, PII-Redaktion | 🟡 Empfohlen |
| M24 | `M24_Agent_Evaluation_Testing.ipynb` | Reproduzierbare Evaluation, Regression, RAGAS-Live-Lauf | 🟡 Empfohlen |
| M25 | — | Reserveplatz | ⬜ |
| M26 | `M26_Integration_Pipeline.ipynb` | Integration: Research-Report-System, Projekt-Templates A/B/C, MVP-Definition | 🔵 Optional |
| M27 | `M27_Advanced_RAG_Pipeline_Patterns.ipynb` | Self-RAG, Reranking, Multi-Vector, CRAG | 🔵 Optional |
| M28 | `M28_Gradio_UI_fuer_Agenten.ipynb` | ChatInterface, Blocks, Streaming, HITL-UI | 🔵 Optional |
| M30a | `M30_MCP_Local.ipynb` | Model Context Protocol, lokale MCP-Server | 🔵 Optional |
| M30b | `M30_MCP_HuggingFace.ipynb` | MCP mit HuggingFace-Integration | 🔵 Optional |
| M31 | `M31_Agent_Skill_Compliance.ipynb` | SKILL.md-Struktur, Guardrails, Mixed-Model-Pattern | 🔵 Optional |
| M32 | `M32_DeepAgents_Harness.ipynb` | Planning, Sub-Agent Spawning, Filesystem-Harness | 🔵 Optional |
| M33 | `M33_DeepAgents_Skill_Meeting_Briefing.ipynb` | Meeting-Briefing Skill, DeepAgents, GitHub-Skill-Dateien, MarkItDown | 🔵 Optional |
| M34 | `M34_DeepAgent_Multi_Skill.ipynb` | DeepAgents native skills=[...]-API, Progressive Disclosure, Multi-Skill-Routing | 🔵 Optional |
| M35 | `M35_Production_Deployment.ipynb` | Docker, FastAPI, Monitoring | 🔵 Optional |
| M36 | `M36_Capstone.ipynb` | Capstone-Projekt | 🔵 Optional |


**Version:** 2.0    
**Stand:** Mai 2026    
**Kursplan-Referenz:** v5.0    
