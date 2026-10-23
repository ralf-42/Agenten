# Jupyter Notebooks – Agenten Kurs

## Modulstruktur

Dieses Verzeichnis enthält aktuell **26 reguläre Modul-Notebooks** für den Kurs „KI-Agenten. Planen. Handeln. Prüfen.“

Der aktive Kursweg ist lückenlos nummeriert und umfasst 26 Module. Er gliedert sich in Grundlagen, Aufbau und Vertiefung. Die Referenzimplementierung und das LangSmith-Hilfsnotebook ergänzen den Kursweg.

> **Kursplan-Referenz:** Kursplan v5.0 – `../00_admin/Kursplan_KI-Agenten_5-Tage_v5.0.md`

---

## Snippet-Sammlung

| Datei | Inhalt | Einsatz |
|---|---|---|
| `A00_snippets_agenten.ipynb` | Copy/Paste-Bausteine für LangChain, LangGraph, Checkpointing, HITL, Multi-Agent-Patterns und LangSmith | Referenz für Übungen und eigene Varianten |



---

Der rote Faden der Grundlagen-, Aufbau- und Vertiefungsmodule ist ein **PMO-Assistent** (Meeting-Vorbereitung, Dokumentenaufbereitung, Aufgabenverfolgung, quellengebundene Briefings und Statusübersichten). Die vorhandenen Module bauen vom ersten Agentenverständnis bis zu RAG, Sessions, Memory, Multi-Agent-Patterns, Security, Evaluation, Routing, Kostenkontrolle, Skills und Deployment auf dasselbe Zielsystem hin.

## Phase  1 – Konzepte & erste Agenten

| Nr. | Modul | Datei | Inhalt | Prio |
| ---: |-------|-------|--------|------|
| 1 | KI-Agenten und Tool Use | `M01_KI_Agenten_und_Tool_Use.ipynb` | Agentenbegriff, PMO-Zielbild, ReAct/TAO-Prinzip, erste Tools mit `@tool`, Type Hints, Docstrings und Fehlerbehandlung | 🟢 Grundlagen |
| 2 | LangChain Erste Agenten | `M02_LangChain_Erste_Agenten.ipynb` | Erster PMO-Assistent mit `create_agent()` | 🟢 Grundlagen |

---

## Phase  2 – Prompt Engineering, Structured Output, LCEL

| Nr. | Modul | Datei                                       | Inhalt                                                     | Prio       |
| ---: | ----- | ------------------------------------------- | ---------------------------------------------------------- | ---------- |
| 3 | Prompt Engineering für Agenten   | `M03_Prompt_Engineering_fuer_Agenten.ipynb` | Rollen, Tool-Regeln, Few-Shot-Klassifikation und sichtbare Reasoning-Artefakte für den PMO-Assistenten | 🟢 Grundlagen |
| 4 | Structured Output   | `M04_Structured_Output.ipynb`               | Antwortschema, Quellenpflicht und strukturierte Prüfbarkeit mit Pydantic und `with_structured_output()` | 🟢 Grundlagen |
| 5 | Multi-Tool-Agents   | `M05_Multi_Tool_Agents.ipynb`               | Mehrere Projekt- und Recherche-Tools, Tool-Auswahl, robuste Fehlerbehandlung | 🟢 Grundlagen |
| 6 | LCEL Chains   | `M06_LCEL_Chains.ipynb`                     | Kontrollierte Teilketten für Antwort, Prüfung und Übergang zu LangGraph | 🟢 Grundlagen |

---

## Phase  3 – LangGraph: Agenten-Kontrolle

| Nr. | Modul | Datei | Inhalt | Prio |
| ---: |-------|-------|--------|------|
| 7 | Warum LangGraph | `M07_Warum_LangGraph.ipynb` | Warum der PMO-Assistent kontrollierten State braucht | 🟢 Grundlagen |
| 8 | StateGraph Basics | `M08_StateGraph_Basics.ipynb` | StateGraph, Nodes, Edges und Briefing-State | 🟢 Grundlagen |
| 9 | Conditional Routing | `M09_Conditional_Routing.ipynb` | Briefing-Routing, Qualitäts-Gate, Security-Basics und Planning-Patterns | 🟢 Grundlagen |
| 10 | Tool Loop | `M10_Tool_Loop.ipynb` | Tool-Loop, Tool-Steuerung im Graph | 🟢 Grundlagen |

---

## Phase  4 – Agenten mit Wissen / RAG

| Nr. | Modul | Datei | Inhalt | Prio |
| ---: |-------|-------|--------|------|
| 11 | RAG Grundlagen | `M11_RAG_Grundlagen.ipynb` | PMO-Korpus, RAG-Architektur, Embeddings, Chunking, ChromaDB-Indexierung und RAG-Chain (enthält die früheren Notebooks zu ChromaDB-Indexing und RAG-Chain) | 🟢 Grundlagen |
| 12 | RAG-Agent | `M12_RAG_Agent.ipynb` | Retrieval als Tool, Quellenpflicht und Out-of-Corpus-Grenze | 🟢 Grundlagen |
| 13 | LangSmith Evaluations Basics | `M13_LangSmith_Evaluations_Basics.ipynb` | Eval-Set, Retrieval-Score, Antwortqualität, Regression | 🟢 Grundlagen |

---

## Phase  5 – Sessions, Memory, HITL & Multi-Agent

| Nr. | Modul | Datei | Inhalt | Prio |
| ---: |-------|-------|--------|------|
| 14 | Sessions, Checkpointing und Memory | `M14_Sessions_Checkpointing_und_Memory.ipynb` | Sessions, Checkpointing, Kurzzeit-Memory, semantisches Memory und Per-User-Memory | 🟢 Grundlagen |
| 15 | Human in the Loop | `M15_Human_in_the_Loop.ipynb` | `interrupt()`, Approve/Reject, HITL-Patterns | 🟢 Grundlagen |
| 16 | Multi-Agent Patterns | `M16_Multi_Agent_Patterns.ipynb` | Supervisor, Reflection und Pipeline für Briefing- und Rechercheaufgaben | 🟢 Grundlagen |
| 17 | Supervisor Pattern | `M17_Supervisor_Pattern.ipynb` | Briefing-Supervisor mit Quellen-, Kritik- und Guardrail-Gates | 🟢 Grundlagen |
| 18 | Reflection, Parallel, Hierarchy | `M18_Reflection_Parallel_Hierarchy.ipynb` | Reflection-Schleife, Parallelisierung mit `Send` und Teams als Hierarchie | 🟢 Grundlagen |

> Sessions, Checkpointing und Memory vereint Checkpointing, Sessions und Memory in einem Kursmodul.

---

## Aufbau- und Vertiefungsmodule – Spezialisierung & Produktion

> Diese Module sind **nicht Teil des Grundlagenpfads**. Sie eignen sich als Aufbau- und Vertiefungsmaterial im Kurs oder als Follow-up nach dem Kurs.

| Nr. | Modul | Datei | Inhalt | Priorität |
| ---: |-------|-------|--------|-----------|
| 19 | Agentic RAG | `M19_Agentic_RAG.ipynb` | Agentic RAG mit Retrieval-Budget, Grounding und OOC-Stopp | 🔵 Aufbau |
| 20 | Agent Security Best Practices | `M20_Agent_Security_Best_Practices.ipynb` | Prompt Injection, Tool-Gating, Audit-Log, PII-Redaktion | 🔵 Aufbau |
| 21 | Agent Evaluation und Testing | `M21_Agent_Evaluation_Testing.ipynb` | Reproduzierbare Evaluation, Regression, Tool-Choice-Scoring, Mara-Vogt- und Adversarial Benchmark, RAGAS-Live-Lauf | 🔵 Aufbau |
| 22 | Model Routing und Cost Control | `M22_Model_Routing_Cost_Control.ipynb` | Model Routing, Fallback, Circuit Breaker, Token-/Kostenkontrolle und Budget Gate | 🔵 Aufbau |
| 23 | Advanced RAG Pipeline Patterns | `M23_Advanced_RAG_Pipeline_Patterns.ipynb` | Self-RAG, Reranking, Multi-Vector, CRAG | 🔵 Aufbau |
| 24 | Gradio UI für Agenten | `M24_Gradio_UI_fuer_Agenten.ipynb` | ChatInterface, Blocks, Streaming, HITL-UI | 🟣 Vertiefung |
| 25 | MCP Local | `M25_MCP_Local.ipynb` | Model Context Protocol, lokale MCP-Server | 🟣 Vertiefung |
| 26 | Agent Skill Compliance | `M26_Agent_Skill_Compliance.ipynb` | SKILL.md-Struktur, Guardrails, Mixed-Model-Pattern | 🟣 Vertiefung |
| 27 | DeepAgents Harness | `M50_DeepAgents_Harness.ipynb` | Planning, Tools, Sub-Agent Spawning (DeepAgents-Kern) | 🟣 Vertiefung |
| 28 | DeepAgents Vertiefung | `M51_DeepAgents_Vertiefung.ipynb` | Weitere Parameter, Sandbox-Backends, Vergleich zu LangGraph | 🟣 Vertiefung |
| 29 | DeepAgents Skill PMO-Assistent | `M52_DeepAgents_Skill_PMO_Assistent.ipynb` | PMO-Briefing-Skill mit DeepAgents, GitHub-Skill-Dateien, MarkItDown | 🟣 Vertiefung |
| 30 | DeepAgent Multi-Skill | `M53_DeepAgent_Multi_Skill.ipynb` | DeepAgents native skills=[...]-API, Progressive Disclosure, Multi-Skill-Routing | 🟣 Vertiefung |
| 31 | Production Deployment | `M54_Production_Deployment.ipynb` | Notebook → Production, zentrale Modell-Konfiguration, Docker | 🟣 Vertiefung |

## Weitere Notebooks

Diese Dateien ergänzen den Kursweg und zählen nicht zu den regulären Modulen.

| Datei | Zweck |
|---|---|
| `Integration_Pipeline_optional.ipynb` | Optionales End-to-End-Beispiel zur Zusammensetzung des PMO-Assistenten |
| `M90_LangSmith_Project_loeschen.ipynb` | Hilfsnotebook zum Löschen eines LangSmith-Projekts |
| `M40_PMO_Assistent_Referenzimplementierung.ipynb` | Referenzimplementierung des PMO-Assistenten |
| `quick_template.ipynb` | Notebook-Vorlage |
| `X99_kombi_chain_graph.ipynb` | Experimentelles Notebook zur Kombination von Chain und Graph |


**Version:** 3.2    
**Stand:** Oktober 2026    
**Kursplan-Referenz:** v5.0    
