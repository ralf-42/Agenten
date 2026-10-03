# Jupyter Notebooks – Agenten Kurs

## Modulstruktur

Dieses Verzeichnis enthält aktuell **38 Modul-Notebooks** für den Kurs „KI-Agenten. Planen. Handeln. Prüfen."

Die Nummerierung reicht lückenlos von **M01 bis M38**. Frühere a/b-Teilmodule wurden in die laufende Modulnummerierung überführt.

> **Kursplan-Referenz:** Kursplan v5.0 – `../00_admin/Kursplan_KI-Agenten_5-Tage_v5.0.md`

---

## Snippet-Sammlung

| Datei | Inhalt | Einsatz |
|---|---|---|
| `A00_snippets_agenten.ipynb` | Copy/Paste-Bausteine für LangChain, LangGraph, Checkpointing, HITL, Multi-Agent-Patterns und LangSmith | Referenz für Übungen und eigene Varianten |



---

Der rote Faden der Grundlagen-, Aufbau- und Vertiefungsmodule ist ein **Meeting- & Research-Briefing-Agent**. Die Module M01-M38 bauen vom ersten Agentenverständnis bis zu RAG, Sessions, Memory, Multi-Agent-Patterns, Security, Evaluation, Routing, Kostenkontrolle, Integration, Skills, Deployment und Capstone auf dasselbe Zielsystem hin.

## Phase  1 – Konzepte & erste Agenten (M01–M02)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M01 | `M01_KI_Agenten_und_Tool_Use.ipynb` | Agentenbegriff, Meeting- & Research-Briefing-Zielbild, ReAct/TAO-Prinzip, erste Tools mit `@tool`, Type Hints, Docstrings und Fehlerbehandlung | 🟢 Grundlagen |
| M02 | `M02_Erste_Agenten_LangChain.ipynb` | Erster Meeting- & Research-Briefing-Agent mit `create_agent()` | 🟢 Grundlagen |

---

## Phase  2 – Prompt Engineering, Structured Output, LCEL (M03–M06)

| Modul | Datei                                       | Inhalt                                                     | Prio       |
| ----- | ------------------------------------------- | ---------------------------------------------------------- | ---------- |
| M03   | `M03_Prompt_Engineering_fuer_Agenten.ipynb` | Rollen, Tool-Regeln, Few-Shot-Klassifikation und sichtbare Reasoning-Artefakte für den Briefing-Agent | 🟢 Grundlagen |
| M04   | `M04_Structured_Output.ipynb`               | Antwortschema, Quellenpflicht und strukturierte Prüfbarkeit mit Pydantic und `with_structured_output()` | 🟢 Grundlagen |
| M05   | `M05_Multi_Tool_Agents.ipynb`               | Mehrere Projekt- und Recherche-Tools, Tool-Auswahl, robuste Fehlerbehandlung | 🟢 Grundlagen |
| M06   | `M06_LCEL_Chains.ipynb`                     | Kontrollierte Teilketten für Antwort, Prüfung und Übergang zu LangGraph | 🟢 Grundlagen |

---

## Phase  3 – LangGraph: Agenten-Kontrolle (M07–M10)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M07 | `M07_Warum_LangGraph.ipynb` | Warum der Meeting- & Research-Briefing-Agent kontrollierten State braucht | 🟢 Grundlagen |
| M08 | `M08_StateGraph_Basics.ipynb` | StateGraph, Nodes, Edges und Briefing-State | 🟢 Grundlagen |
| M09 | `M09_Conditional_Routing.ipynb` | Briefing-Routing, Qualitäts-Gate, Security-Basics und Planning-Patterns | 🟢 Grundlagen |
| M10 | `M10_Tool_Loop.ipynb` | Tool-Loop, Tool-Steuerung im Graph | 🟢 Grundlagen |

---

## Phase  4 – Agenten mit Wissen / RAG (M11–M15)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M11 | `M11_RAG_Konzepte_Embeddings.ipynb` | Meeting-Briefing-Korpus, RAG-Architektur, Embeddings, Chunking | 🟢 Grundlagen |
| M12 | `M12_ChromaDB_Indexing.ipynb` | Meeting- und Projekt-PDFs indexieren und testbar abfragen | 🟢 Grundlagen |
| M13 | `M13_RAG_Chain_LangChain.ipynb` | Quellengebundene RAG-Chain mit Retrieval-Treffern | 🟢 Grundlagen |
| M14 | `M14_RAG_Agent.ipynb` | Retrieval als Tool, Quellenpflicht und Out-of-Corpus-Grenze | 🟢 Grundlagen |
| M15 | `M15_LangSmith_Evaluations_Basics.ipynb` | Eval-Set, Retrieval-Score, Antwortqualität, Regression | 🟢 Grundlagen |

---

## Phase  5 – HITL, Memory & Multi-Agent (M16–M21)

| Modul | Datei | Inhalt | Prio |
|-------|-------|--------|------|
| M16 | `M16_Checkpointing_Sessions.ipynb` | Briefing-Sessions mit InMemorySaver und SQLite fortsetzen | 🟢 Grundlagen |
| M17 | `M17_Human_in_the_Loop.ipynb` | `interrupt()`, Approve/Reject, HITL-Patterns | 🟢 Grundlagen |
| M18 | `M18_Memory_Systeme.ipynb` | Kuratiertes Briefing-Memory und Per-User-Präferenzen | 🟢 Grundlagen |
| M19 | `M19_Multi_Agent_Patterns.ipynb` | Supervisor, Hierarchie und Pipeline für Briefing- und Rechercheaufgaben | 🟢 Grundlagen |
| M20 | `M20_Supervisor_Pattern.ipynb` | Briefing-Supervisor mit Quellen-, Kritik- und Guardrail-Gates | 🟢 Grundlagen |
| M21 | `M21_Hierarchical_Pattern.ipynb` | Quellen-, Synthese- und Qualitäts-Team als Hierarchie | 🟢 Grundlagen |

---

## Aufbau- und Vertiefungsmodule – Spezialisierung & Produktion (M22–M38)

> Diese Module sind **nicht Teil des Grundlagenpfads**. Sie eignen sich als Aufbau- und Vertiefungsmaterial im Kurs oder als Follow-up nach dem Kurs.

| Modul | Datei | Inhalt | Priorität |
|-------|-------|--------|-----------|
| M22 | `M22_Agentic_RAG.ipynb` | Agentic RAG mit Retrieval-Budget, Grounding und OOC-Stopp | 🔵 Aufbau |
| M23 | `M23_Agent_Security_Best_Practices.ipynb` | Prompt Injection, Tool-Gating, Audit-Log, PII-Redaktion | 🔵 Aufbau |
| M24 | `M24_Agent_Evaluation_Testing.ipynb` | Reproduzierbare Evaluation, Regression, Tool-Choice-Scoring, Mara-Vogt- und Adversarial Benchmark, RAGAS-Live-Lauf | 🔵 Aufbau |
| M25 | `M25_Model_Routing_Cost_Control.ipynb` | Model Routing, Fallback, Circuit Breaker, Token-/Kostenkontrolle und Budget Gate | 🔵 Aufbau |
| M26 | `M26_Integration_Pipeline.ipynb` | Integration: Meeting- & Research-Briefing-System als End-to-End-Pipeline | 🔵 Aufbau |
| M27 | `M27_Projekt_Templates.ipynb` | Eigene Projekt-Templates A/B/C, MVP-Definition | 🔵 Aufbau |
| M28 | `M28_Advanced_RAG_Pipeline_Patterns.ipynb` | Self-RAG, Reranking, Multi-Vector, CRAG | 🔵 Aufbau |
| M29 | `M29_Gradio_UI_fuer_Agenten.ipynb` | ChatInterface, Blocks, Streaming, HITL-UI | 🟣 Vertiefung |
| M30 | `M30_MCP_Local.ipynb` | Model Context Protocol, lokale MCP-Server | 🟣 Vertiefung |
| M31 | `M31_Agent_Skill_Compliance.ipynb` | SKILL.md-Struktur, Guardrails, Mixed-Model-Pattern | 🟣 Vertiefung |
| M32 | `M32_DeepAgents_Harness.ipynb` | Planning, Tools, Sub-Agent Spawning (DeepAgents-Kern) | 🟣 Vertiefung |
| M33 | `M33_DeepAgents_Vertiefung.ipynb` | Weitere Parameter, Sandbox-Backends, Vergleich zu LangGraph | 🟣 Vertiefung |
| M34 | `M34_DeepAgents_Skill_Meeting_Briefing.ipynb` | Meeting-Briefing Skill, DeepAgents, GitHub-Skill-Dateien, MarkItDown | 🟣 Vertiefung |
| M35 | `M35_DeepAgent_Multi_Skill.ipynb` | DeepAgents native skills=[...]-API, Progressive Disclosure, Multi-Skill-Routing | 🟣 Vertiefung |
| M36 | `M36_Production_Deployment.ipynb` | Notebook → Production, zentrale Modell-Konfiguration, Docker | 🟣 Vertiefung |
| M37 | `M37_API_Monitoring.ipynb` | FastAPI-Endpoints, Production Monitoring, Kursrückblick | 🟣 Vertiefung |
| M38 | `M38_Capstone.ipynb` | Capstone-Projekt mit Architekturcheck und minimalem End-to-End-Smoke-Test | 🟣 Vertiefung |


**Version:** 3.2    
**Stand:** Oktober 2026    
**Kursplan-Referenz:** v5.0    
