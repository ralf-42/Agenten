# Jupyter Notebooks – Agenten Kurs

## 📚 Modulstruktur

Dieses Verzeichnis enthält **33 Kurs-Notebooks (M01–M33)** sowie **3 Projekt-Templates (T_A–T_C)** für den Kurs „KI-Agenten. Verstehen. Anwenden. Gestalten."

> **Kursplan-Referenz:** Kursplan v4.7 (Phasen 1–7) – `../00_admin/Kursplan_KI-Agenten_5-Tage_v4.7.md`

---

## 🗂️ Phasen-Übersicht (Kursplan v4.7)

| Phase | Notebooks | Kernthema | Tag |
|-------|-----------|-----------|-----|
| **Phase 1** | M01–M05 | Konzepte & erste Agenten | Tag 1 |
| **Phase 2** | M06–M07 | Multi-Tool & LCEL Chains | Tag 2 (Anfang) |
| **Phase 3** | M08–M11 | RAG mit ChromaDB | Tag 2 (Ende) / Tag 3 |
| **Phase 4** | M12–M14, M18 | LangGraph & LangSmith Eval | Tag 4 |
| **Phase 5** | M15–M17, M19–M20 | HITL, Memory, Security | Tag 5 (Anfang) |
| **Phase 6** | M21–M25 | Multi-Agent-Systeme | Tag 5 (Ende) |
| **Phase 7** | M26–M33 | Spezialisierung *(nur optional)* | Nach dem Kurs |

---

## 🎯 Phase 1 – Konzepte & erste Schritte (M01–M05)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M01 | `M01_Was_sind_KI_Agenten.ipynb` | Definition, 4 Eigenschaften, ReAct/TAO-Prinzip, Agent-Typen | 🟢 Pflicht |
| M02 | `M02_Tool_Use_Function_Calling.ipynb` | `@tool`-Decorator, Type Hints, Docstrings, eigene Tools | 🟢 Pflicht |
| M03 | `M03_Erste_Agenten_LangChain.ipynb` | `create_react_agent()`, Deprecated-Patterns einmalig klären | 🟢 Pflicht |
| M04 | `M04_Prompt_Engineering_fuer_Agenten.ipynb` | ChatPromptTemplate, System/Human Messages, Few-Shot | 🟢 Pflicht |
| M05 | `M05_Structured_Output.ipynb` | Pydantic BaseModel, `with_structured_output()` | 🟢 Pflicht |

---

## 🎯 Phase 2 – Multi-Tool & Chains (M06–M07)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M06 | `M06_Multi_Tool_Agents.ipynb` | Agent mit 3–4 Tools, Tool-Auswahl, Debugging | 🟢 Pflicht |
| M07 | `M07_LCEL_Chains.ipynb` | Pipe-Operator `\|`, Runnable Interface, Streaming | 🟢 Pflicht |

---

## 🎯 Phase 3 – RAG mit ChromaDB (M08–M11)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M08 | `M08_RAG_Konzepte_Embeddings.ipynb` | RAG-Architektur, Embeddings, Chunking-Strategien | 🟢 Pflicht |
| M09 | `M09_ChromaDB_Indexing.ipynb` | ChromaDB Setup, Dokumente indexieren, Persistenz | 🟢 Pflicht |
| M10 | `M10_RAG_Chain_LangChain.ipynb` | Retriever, Similarity Search, RAG-Chain (LCEL) | 🟢 Pflicht |
| M11 | `M11_RAG_Agent.ipynb` | RAG als Tool, Agent entscheidet: RAG vs. eigenes Wissen | 🟢 Pflicht |

---

## 🎯 Phase 4 – LangGraph & Evaluation (M12–M14, M18)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M12 | `M12_Warum_LangGraph.ipynb` | Limitierungen von `create_react_agent()`, State Machine Konzept | 🟢 Pflicht |
| M13 | `M13_StateGraph_Basics.ipynb` | StateGraph, Nodes, Edges, Graph kompilieren | 🟢 Pflicht |
| M14 | `M14_Conditional_Routing_Tool_Loop.ipynb` | Conditional Edges, Routing-Funktion, Tool-Loop | 🟢 Pflicht |
| M18 | `M18_LangSmith_Evaluations_Basics.ipynb` | Eval-Dataset, Qualitätskriterien, Regression-Check | 🟡 Empfohlen |

---

## 🎯 Phase 5 – Memory, HITL & Security (M15–M17, M19–M20)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M15 | `M15_Checkpointing_Sessions.ipynb` | MemorySaver, Sessions persistieren & fortsetzen | 🟢 Pflicht |
| M16 | `M16_Memory_Systeme.ipynb` | InMemoryStore, Conversation Buffer, Per-User Memory | 🟢 Pflicht |
| M17 | `M17_Human_in_the_Loop.ipynb` | `interrupt()`, Approve/Reject, HITL-Patterns | 🟢 Pflicht |
| M19 | `M19_Agent_Evaluation_Testing.ipynb` | Metriken, systematisches Benchmarking, RAGAS | 🟡 Empfohlen |
| M20 | `M20_Agent_Security_Best_Practices.ipynb` | Prompt Injection, Tool-Gating, PII-Redaktion | 🟡 Empfohlen |

---

## 🎯 Phase 6 – Multi-Agent-Systeme (M21–M25)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M21 | `M21_Multi_Agent_Patterns.ipynb` | Supervisor, Hierarchical, Collaborative – Überblick | 🟢 Pflicht |
| M22 | `M22_Supervisor_Pattern.ipynb` | Supervisor Deep Dive, Worker mit Tools, Iterations-Schutz | 🟢 Pflicht |
| M23 | `M23_Multi_Agent_Projekt.ipynb` | Kurs-Abschlussprojekt mit Template-Auswahl (→ T_A/B/C) | 🟢 Pflicht |
| M24 | `M24_Hierarchical_Agent_Teams.ipynb` | 3-Ebenen-Hierarchie, Sub-Supervisor, Tool-Delegation | 🔵 Optional |
| M25 | `M25_Collaborative_Multi_Agent.ipynb` | Peer-to-Peer, Diskussion, Research-Report-System | 🔵 Optional |

---

## 🎯 Phase 7 – Spezialisierung & Produktion (M26–M33) – nur optional

> Diese Module sind **nicht Teil des 5-Tages-Kurses**. Sie eignen sich als Follow-up-Material nach dem Kurs.

| Modul | Datei | Inhalt | Priorität |
|-------|-------|--------|-----------|
| M26 | `M26_Agentic_RAG.ipynb` | Agenten steuern Retrieval aktiv, Query-Rephrasing | 🟡 Empfohlen |
| M27 | `M27_Advanced_RAG_Pipeline_Patterns.ipynb` | Self-RAG, Reranking, Multi-Vector, CRAG | 🔵 Optional |
| M28 | `M28_Gradio_UI_fuer_Agenten.ipynb` | ChatInterface, Blocks, Streaming, HITL-UI | 🔵 Optional |
| M29 | `M29_OpenAI_Agent_Builder.ipynb` | No-Code-Alternative, Vergleich mit LangGraph | 🔵 Optional |
| M30 | `M30_MCP_Integration.ipynb` | Model Context Protocol, Multi-Server-Setup | 🔵 Optional |
| M31 | `M31_Production_Deployment.ipynb` | Docker, FastAPI, LangServe, Monitoring | 🔵 Optional |
| M32 | `M32_DeepAgents_Harness.ipynb` | Planning, Sub-Agent Spawning, Filesystem-Harness | 🔵 Optional |
| M33 | `M33_Agent_Skill_Compliance.ipynb` | SKILL.md-Struktur, Guardrails, Mixed-Model-Pattern | 🔵 Optional |

---

## 📋 Projekt-Templates (T_A–T_C) – für M23

Diese Templates werden in **Tag 5, Einheit 2** verwendet. Teilnehmer wählen eines und passen die `# ⚠️ TODO`-Stellen an ihr Thema an.

| Datei | Team | Worker 1 | Worker 2 | Routing |
|-------|------|----------|----------|---------|
| `M23_T_A_Research_Team.ipynb` | 🔍 Research | Web-Researcher | Analyst | sequenziell |
| `M23_T_B_Content_Team.ipynb` | ✍️ Content | Writer | Editor | mit Feedback-Schleife |
| `M23_T_C_Support_Team.ipynb` | 🙋 Support | FAQ-Agent | Specialist | bedarfsgesteuert |

**Alle Templates enthalten:**
- ✅ Vollständiger, lauffähiger StateGraph
- ✅ 2 vorgefertigte Worker-Agents mit eigenen Tools
- ✅ Supervisor-Stub mit `# ⚠️ TODO`-Kommentaren
- ✅ Fehlerbehandlung in allen Worker-Nodes
- ✅ LangSmith-Tracing vorkonfiguriert
- ✅ MVP-Checkliste

---

## ⚠️ Hinweise zur Modul-Nummerierung

Die Modul-Nummerierung M01–M33 entspricht exakt den Dateinamen. Folgende Zuordnungen sind **nicht intuitiv** und daher explizit aufgeführt:

| Dateiname | Kursplan-Phase | Kurstag |
|-----------|---------------|---------|
| `M17_Human_in_the_Loop.ipynb` | Phase 5 | Tag 5 |
| `M18_LangSmith_Evaluations_Basics.ipynb` | Phase 4 | Tag 4 |
| `M19_Agent_Evaluation_Testing.ipynb` | Phase 5 | Tag 5 (optional) |
| `M20_Agent_Security_Best_Practices.ipynb` | Phase 5 | Tag 5 (optional) |

---

**Version:** 1.5
**Stand:** März 2026
**Kursplan-Referenz:** v4.7
