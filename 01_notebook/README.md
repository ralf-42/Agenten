# Jupyter Notebooks – Agenten Kurs

## Modulstruktur

Dieses Verzeichnis enthält aktuell **32 reguläre Modul-Notebooks** für den Kurs „KI-Agenten. Planen. Handeln. Prüfen.“

Die Notebooks reichen von **KI-Agenten und Tool Use bis Production Deployment**, die Nummern im Dateinamen sind aber nicht lückenlos: Frühere Module wurden teilweise zusammengelegt. RAG Grundlagen umfasst beispielsweise die früheren Notebooks zu ChromaDB-Indexing und RAG-Chain; Sessions, Checkpointing und Memory vereint die früheren Notebooks zu Checkpointing & Sessions und Memory-Systemen. Die Übersicht unten bildet die Dateien ab, die aktuell in diesem Verzeichnis liegen.

> **Kursplan-Referenz:** Kursplan v5.0 – `../00_admin/Kursplan_KI-Agenten_5-Tage_v5.0.md`

---

## Snippet-Sammlung

| Datei | Inhalt | Einsatz |
|---|---|---|
| `A00_snippets_agenten.ipynb` | Copy/Paste-Bausteine für LangChain, LangGraph, Checkpointing, HITL, Multi-Agent-Patterns und LangSmith | Referenz für Übungen und eigene Varianten |



---

Der rote Faden der Grundlagen-, Aufbau- und Vertiefungsmodule ist ein **PMO-Assistent** (Meeting-Vorbereitung, Dokumentenaufbereitung, Aufgabenverfolgung, quellengebundene Briefings und Statusübersichten). Die vorhandenen Module bauen vom ersten Agentenverständnis bis zu RAG, Sessions, Memory, Multi-Agent-Patterns, Security, Evaluation, Routing, Kostenkontrolle, Integration, Skills und Deployment auf dasselbe Zielsystem hin.

## Phase  1 – Konzepte & erste Agenten

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| KI-Agenten und Tool Use | `M01_KI_Agenten_und_Tool_Use.ipynb` | Agentenbegriff, PMO-Zielbild, ReAct/TAO-Prinzip, erste Tools mit `@tool`, Type Hints, Docstrings und Fehlerbehandlung | 🟢 Grundlagen |
| LangChain Erste Agenten | `M02_LangChain_Erste_Agenten.ipynb` | Erster PMO-Assistent mit `create_agent()` | 🟢 Grundlagen |

---

## Phase  2 – Prompt Engineering, Structured Output, LCEL

| Modul | Datei                                       | Inhalt                                                     | Prio       |
| ----- | ------------------------------------------- | ---------------------------------------------------------- | ---------- |
| Prompt Engineering für Agenten   | `M03_Prompt_Engineering_fuer_Agenten.ipynb` | Rollen, Tool-Regeln, Few-Shot-Klassifikation und sichtbare Reasoning-Artefakte für den PMO-Assistenten | 🟢 Grundlagen |
| Structured Output   | `M04_Structured_Output.ipynb`               | Antwortschema, Quellenpflicht und strukturierte Prüfbarkeit mit Pydantic und `with_structured_output()` | 🟢 Grundlagen |
| Multi-Tool-Agents   | `M05_Multi_Tool_Agents.ipynb`               | Mehrere Projekt- und Recherche-Tools, Tool-Auswahl, robuste Fehlerbehandlung | 🟢 Grundlagen |
| LCEL Chains   | `M06_LCEL_Chains.ipynb`                     | Kontrollierte Teilketten für Antwort, Prüfung und Übergang zu LangGraph | 🟢 Grundlagen |

---

## Phase  3 – LangGraph: Agenten-Kontrolle

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| Warum LangGraph | `M07_Warum_LangGraph.ipynb` | Warum der PMO-Assistent kontrollierten State braucht | 🟢 Grundlagen |
| StateGraph Basics | `M08_StateGraph_Basics.ipynb` | StateGraph, Nodes, Edges und Briefing-State | 🟢 Grundlagen |
| Conditional Routing | `M09_Conditional_Routing.ipynb` | Briefing-Routing, Qualitäts-Gate, Security-Basics und Planning-Patterns | 🟢 Grundlagen |
| Tool Loop | `M10_Tool_Loop.ipynb` | Tool-Loop, Tool-Steuerung im Graph | 🟢 Grundlagen |

---

## Phase  4 – Agenten mit Wissen / RAG

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| RAG Grundlagen | `M11_RAG_Grundlagen.ipynb` | PMO-Korpus, RAG-Architektur, Embeddings, Chunking, ChromaDB-Indexierung und RAG-Chain (enthält die früheren Notebooks zu ChromaDB-Indexing und RAG-Chain) | 🟢 Grundlagen |
| RAG-Agent | `M14_RAG_Agent.ipynb` | Retrieval als Tool, Quellenpflicht und Out-of-Corpus-Grenze | 🟢 Grundlagen |
| LangSmith Evaluations Basics | `M15_LangSmith_Evaluations_Basics.ipynb` | Eval-Set, Retrieval-Score, Antwortqualität, Regression | 🟢 Grundlagen |

---

## Phase  5 – Sessions, Memory, HITL & Multi-Agent

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| Sessions, Checkpointing und Memory | `M16_Sessions_Checkpointing_und_Memory.ipynb` | Sessions, Checkpointing, Kurzzeit-Memory, semantisches Memory und Per-User-Memory | 🟢 Grundlagen |
| Human in the Loop | `M17_Human_in_the_Loop.ipynb` | `interrupt()`, Approve/Reject, HITL-Patterns | 🟢 Grundlagen |
| Multi-Agent Patterns | `M19_Multi_Agent_Patterns.ipynb` | Supervisor, Reflection und Pipeline für Briefing- und Rechercheaufgaben | 🟢 Grundlagen |
| Supervisor Pattern | `M20_Supervisor_Pattern.ipynb` | Briefing-Supervisor mit Quellen-, Kritik- und Guardrail-Gates | 🟢 Grundlagen |
| Reflection, Parallel, Hierarchy | `M21_Reflection_Parallel_Hierarchy.ipynb` | Reflection-Schleife, Parallelisierung mit `Send` und Teams als Hierarchie | 🟢 Grundlagen |

> Sessions, Checkpointing und Memory vereint die früheren Notebooks Checkpointing & Sessions und Memory-Systeme. Die ursprünglichen Notebooks liegen zur Nachvollziehbarkeit unter `01_notebook/_backups/`.

---

## Aufbau- und Vertiefungsmodule – Spezialisierung & Produktion

> Diese Module sind **nicht Teil des Grundlagenpfads**. Sie eignen sich als Aufbau- und Vertiefungsmaterial im Kurs oder als Follow-up nach dem Kurs.

| Modul | Datei | Inhalt | Priorität |
|-------|-------|--------|-----------|
| Agentic RAG | `M22_Agentic_RAG.ipynb` | Agentic RAG mit Retrieval-Budget, Grounding und OOC-Stopp | 🔵 Aufbau |
| Agent Security Best Practices | `M23_Agent_Security_Best_Practices.ipynb` | Prompt Injection, Tool-Gating, Audit-Log, PII-Redaktion | 🔵 Aufbau |
| Agent Evaluation und Testing | `M24_Agent_Evaluation_Testing.ipynb` | Reproduzierbare Evaluation, Regression, Tool-Choice-Scoring, Mara-Vogt- und Adversarial Benchmark, RAGAS-Live-Lauf | 🔵 Aufbau |
| Model Routing und Cost Control | `M25_Model_Routing_Cost_Control.ipynb` | Model Routing, Fallback, Circuit Breaker, Token-/Kostenkontrolle und Budget Gate | 🔵 Aufbau |
| Integration Pipeline | `M26_Integration_Pipeline.ipynb` | Integration: PMO-Assistent als End-to-End-Pipeline | 🔵 Aufbau |
| Advanced RAG Pipeline Patterns | `M28_Advanced_RAG_Pipeline_Patterns.ipynb` | Self-RAG, Reranking, Multi-Vector, CRAG | 🔵 Aufbau |
| Gradio UI für Agenten | `M29_Gradio_UI_fuer_Agenten.ipynb` | ChatInterface, Blocks, Streaming, HITL-UI | 🟣 Vertiefung |
| MCP Local | `M30_MCP_Local.ipynb` | Model Context Protocol, lokale MCP-Server | 🟣 Vertiefung |
| Agent Skill Compliance | `M31_Agent_Skill_Compliance.ipynb` | SKILL.md-Struktur, Guardrails, Mixed-Model-Pattern | 🟣 Vertiefung |
| DeepAgents Harness | `M32_DeepAgents_Harness.ipynb` | Planning, Tools, Sub-Agent Spawning (DeepAgents-Kern) | 🟣 Vertiefung |
| DeepAgents Vertiefung | `M33_DeepAgents_Vertiefung.ipynb` | Weitere Parameter, Sandbox-Backends, Vergleich zu LangGraph | 🟣 Vertiefung |
| DeepAgents Skill PMO-Assistent | `M34_DeepAgents_Skill_PMO_Assistent.ipynb` | PMO-Briefing-Skill mit DeepAgents, GitHub-Skill-Dateien, MarkItDown | 🟣 Vertiefung |
| DeepAgent Multi-Skill | `M35_DeepAgent_Multi_Skill.ipynb` | DeepAgents native skills=[...]-API, Progressive Disclosure, Multi-Skill-Routing | 🟣 Vertiefung |
| Production Deployment | `M36_Production_Deployment.ipynb` | Notebook → Production, zentrale Modell-Konfiguration, Docker | 🟣 Vertiefung |

## Weitere Notebooks

Diese Dateien ergänzen den Modulpfad und zählen nicht zu den 32 regulären Modulen.

| Datei | Zweck |
|---|---|
| `M88_LangSmith_Project_loeschen.ipynb` | Hilfsnotebook zum Löschen eines LangSmith-Projekts |
| `M99_PMO_Assistent_Referenzimplementierung.ipynb` | Referenzimplementierung des PMO-Assistenten |
| `quick_template.ipynb` | Notebook-Vorlage |
| `X99_kombi_chain_graph.ipynb` | Experimentelles Notebook zur Kombination von Chain und Graph |


**Version:** 3.2    
**Stand:** Oktober 2026    
**Kursplan-Referenz:** v5.0    
