# Jupyter Notebooks – Agenten Kurs

## Modulstruktur

Dieses Verzeichnis enthält **33 Kurs-Notebooks (M01–M33)** für den Kurs „KI-Agenten. Verstehen. Anwenden. Gestalten."

> **Kursplan-Referenz:** Kursplan v5.0 – `../00_admin/Kursplan_KI-Agenten_5-Tage_v4.7.md`

---

## Tagesübersicht

| Tag | Notebooks | Kernthema |
|-----|-----------|-----------|
| **Tag 1** | M01–M03 | Konzepte & erste Agenten |
| **Tag 2** | M04–M07 | Prompt Engineering, Structured Output, LCEL |
| **Tag 3** | M08–M10 | LangGraph – Agenten-Kontrolle |
| **Tag 4** | M11–M15 | RAG – Agenten mit Wissen |
| **Tag 5** | M16–M21 | HITL, Memory & Multi-Agent |
| **Erweiterung** | M22–M33 | Spezialisierung *(nur optional)* |

---

## Tag 1 – Konzepte & erste Agenten (M01–M03)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M01 | `M01_Was_sind_KI_Agenten.ipynb` | Definition, 4 Eigenschaften, ReAct/TAO-Prinzip, Agent-Typen | 🟢 Pflicht |
| M02 | `M02_Tool_Use_Function_Calling.ipynb` | `@tool`-Decorator, Type Hints, Docstrings, eigene Tools | 🟢 Pflicht |
| M03 | `M03_Erste_Agenten_LangChain.ipynb` | `create_react_agent()`, Deprecated-Patterns einmalig klären | 🟢 Pflicht |

---

## Tag 2 – Prompt Engineering, Structured Output, LCEL (M04–M07)

| Modul | Datei                                       | Inhalt                                                     | Prio       |
| ----- | ------------------------------------------- | ---------------------------------------------------------- | ---------- |
| M04   | `M04_Prompt_Engineering_fuer_Agenten.ipynb` | ChatPromptTemplate, System/Human Messages, Few-Shot        | 🟢 Pflicht |
| M05   | `M05_Structured_Output.ipynb`               | Pydantic BaseModel, `with_structured_output()`             | 🟢 Pflicht |
| M06   | `M06_Multi_Tool_Agents.ipynb`               | Agent mit 3–4 Tools, Tool-Auswahl, Debugging               | 🟢 Pflicht |
| M07   | `M07_LCEL_Chains.ipynb`                     | Pipe-Operator \| , Runnable Interface, Brücke zu LangGraph | 🟢 Pflicht |

---

## Tag 3 – LangGraph: Agenten-Kontrolle (M08–M10)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M08 | `M08_Warum_LangGraph.ipynb` | Limitierungen von `create_react_agent()`, State Machine Konzept | 🟢 Pflicht |
| M09 | `M09_StateGraph_Basics.ipynb` | StateGraph, Nodes, Edges, Graph kompilieren | 🟢 Pflicht |
| M10 | `M10_Conditional_Routing_Tool_Loop.ipynb` | Conditional Edges, Routing-Funktion, Tool-Loop, Security-Basics | 🟢 Pflicht |

---

## Tag 4 – Agenten mit Wissen / RAG (M11–M15)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M11 | `M11_RAG_Konzepte_Embeddings.ipynb` | RAG-Architektur, Embeddings, Chunking-Strategien | 🟢 Pflicht |
| M12 | `M12_ChromaDB_Indexing.ipynb` | ChromaDB Setup, Dokumente indexieren, Persistenz | 🟢 Pflicht |
| M13 | `M13_RAG_Chain_LangChain.ipynb` | Retriever, Similarity Search, RAG-Chain (LCEL) | 🟢 Pflicht |
| M14 | `M14_RAG_Agent.ipynb` | RAG als Tool, Agent entscheidet: RAG vs. eigenes Wissen | 🟢 Pflicht |
| M15 | `M15_LangSmith_Evaluations_Basics.ipynb` | Eval-Dataset, Qualitätskriterien, Regression-Check | 🟡 Empfohlen |

---

## Tag 5 – HITL, Memory & Multi-Agent (M16–M21)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M16 | `M16_Checkpointing_Sessions.ipynb` | MemorySaver, Sessions persistieren & fortsetzen | 🟢 Pflicht |
| M17 | `M17_Human_in_the_Loop.ipynb` | `interrupt()`, Approve/Reject, HITL-Patterns | 🟢 Pflicht |
| M18 | `M18_Memory_Systeme.ipynb` | InMemoryStore, Conversation Buffer, Per-User Memory | 🟢 Pflicht |
| M19 | `M19_Multi_Agent_Patterns.ipynb` | Supervisor, Hierarchical, Collaborative – Überblick | 🟢 Pflicht |
| M20 | `M20_Supervisor_Pattern.ipynb` | Supervisor Deep Dive, Worker mit Tools, Iterations-Schutz | 🟢 Pflicht |
| M21 | `M21_Hierarchical_Pattern.ipynb` | Hierarchical Teams – 3-Ebenen-Hierarchie, Sub-Supervisor, Tool-Delegation | 🟢 Pflicht |

---

## Erweiterte Module – Spezialisierung & Produktion (M22–M33)

> Diese Module sind **nicht Teil des 5-Tages-Kurses**. Sie eignen sich als Follow-up-Material nach dem Kurs.

| Modul | Datei | Inhalt | Priorität |
|-------|-------|--------|-----------|
| M22 | `M22_Agentic_RAG.ipynb` | Agenten steuern Retrieval aktiv, Query-Rephrasing | 🟡 Empfohlen |
| M23 | `M23_Agent_Security_Best_Practices.ipynb` | Prompt Injection, Tool-Gating, PII-Redaktion | 🟡 Empfohlen |
| M24 | `M24_Agent_Evaluation_Testing.ipynb` | Metriken, systematisches Benchmarking, RAGAS | 🟡 Empfohlen |
| M26 | `M26_Collaborative_Multi_Agent.ipynb` | Integration: Research-Report-System, Projekt-Templates A/B/C, MVP-Definition | 🔵 Optional |
| M27 | `M27_Advanced_RAG_Pipeline_Patterns.ipynb` | Self-RAG, Reranking, Multi-Vector, CRAG | 🔵 Optional |
| M28 | `M28_Gradio_UI_fuer_Agenten.ipynb` | ChatInterface, Blocks, Streaming, HITL-UI | 🔵 Optional |
| M29 | `M29_OpenAI_Agent_Builder.ipynb` | No-Code-Alternative, Vergleich mit LangGraph | 🔵 Optional |
| M30 | `M30_MCP_Integration.ipynb` | Model Context Protocol, Multi-Server-Setup | 🔵 Optional |
| M31 | `M31_Production_Deployment.ipynb` | Docker, FastAPI, LangServe, Monitoring | 🔵 Optional |
| M32 | `M32_DeepAgents_Harness.ipynb` | Planning, Sub-Agent Spawning, Filesystem-Harness | 🔵 Optional |
| M33 | `M33_Agent_Skill_Compliance.ipynb` | SKILL.md-Struktur, Guardrails, Mixed-Model-Pattern | 🔵 Optional |


**Version:** 2.0
**Stand:** März 2026
**Kursplan-Referenz:** v5.0
