# Jupyter Notebooks - Agenten Kurs

## 📚 Modulstruktur

Dieses Verzeichnis enthält **31 Jupyter Notebooks** für den Kurs "KI-Agenten. Verstehen. Anwenden. Gestalten." (22 Kern-Module M00-M21, 9 erweiterte Module M22-M30).

**Hinweis Reihenfolge:** M21 (LangSmith Evaluations Basics) gehört inhaltlich zu Block 4, M15–M20 zu Block 5. Siehe Kursplan v4.5 für Details.

---

## 🎯 Kern-Module (M00-M21)

### **BLOCK 1: Grundlagen** (M00-M03)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M00 | Kurs-Intro | Kursübersicht, Setup, API-Keys | ✅ Vollständig |
| M01 | Was sind KI-Agenten? | Definition, ReAct-Prinzip, Agent-Typen | ✅ Vollständig |
| M02 | Tool Use & Function Calling | @tool Decorator, eigene Tools | ✅ Vollständig |
| M03 | Erste Agenten mit LangChain | create_agent(), Deprecated Patterns | ✅ Vollständig |

**Block 1** – Agent-Grundlagen & erste Tools

---

### **BLOCK 2: Chains & Strukturierung** (M04-M07)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M04 | Prompt Engineering für Agenten | ChatPromptTemplate, Few-Shot Examples | ✅ Vollständig |
| M05 | LCEL Chains | Pipe-Operator, Runnable Interface | ✅ Vollständig |
| M06 | Structured Output | Pydantic, with_structured_output() | ✅ Vollständig |
| M07 | Multi-Tool Agents | Agent mit 3-4 Tools, Debugging | ✅ Vollständig |

**Block 2** – Chains, Structured Output & Agent-Vertiefung

---

### **BLOCK 3: Gedächtnis & RAG** (M08-M11)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M08 | RAG-Konzepte & Embeddings | RAG-Architektur, Embeddings, Chunking | ✅ Vollständig |
| M09 | ChromaDB & Indexing | ChromaDB Setup, Dokumente indexieren | ✅ Vollständig |
| M10 | RAG-Chain mit LangChain | Retriever, Similarity Search, RAG-Chain | ✅ Vollständig |
| M11 | RAG-Agent | RAG als Tool, RAG-Agent bauen | ✅ Vollständig |

**Block 3** – Gedächtnis & RAG

---

### **BLOCK 4: Kontrolle, Routing & Security** (M12-M14, M21)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M12 | Warum LangGraph? | Limitierungen von create_agent(), State Machines | ✅ Vollständig |
| M13 | StateGraph Basics | StateGraph, Nodes, Edges | ✅ Vollständig |
| M14 | Conditional Routing & Tool-Loop | Conditional Edges, Routing-Funktion | ✅ Vollständig |
| M21 | LangSmith Evaluations Basics | Eval-Dataset, Qualitätskriterien, Regression-Check | ✅ Vollständig |

**Block 4** – Kontrolle, Routing & Security

---

### **BLOCK 5: HITL & Multi-Agent-Projekt** (M15-M20)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M15 | Checkpointing & Sessions | MemorySaver, Sessions fortsetzen | ✅ Vollständig |
| M16 | Human-in-the-Loop | interrupt(), Approval-Pattern | ✅ Vollständig |
| M17 | Multi-Agent Patterns | Supervisor, Hierarchical, Collaborative | ✅ Vollständig |
| M18 | Supervisor Pattern | Worker-Agents, Supervisor-Logik, Graph | ✅ Vollständig |
| M19 | Multi-Agent Projekt | Projekt-Templates, MVP-Definition | ✅ Vollständig |
| M20 | OpenAI Agent Builder | Kurz-Ausblick (10 Min), kein Pflicht-Hands-On | ✅ Vollständig |

**Block 5** – HITL, Multi-Agent-Projekt & Ausblick

---

## 📊 Erweiterte Module (M22-M30) - Optional

> Alle Notebooks fertiggestellt ✅

| Modul | Titel | Inhalt | Priorität |
|-------|-------|--------|-----------|
| M22 | Agentic RAG | RAG als Tool, Multi-Hop, Adaptive Retrieval | 🟡 Empfohlen ✅ |
| M23 | Agent Evaluation & Testing | Metriken, LangSmith Eval, RAGAS, Regressions-Tests | 🟡 Empfohlen ✅ |
| M24 | Agent Security & Best Practices | Prompt Injection, Tool-Whitelisting, PII-Redaktion | 🔵 Optional ✅ |
| M25 | Advanced RAG – Pipeline-Patterns | Self-RAG, Reranking, CRAG | 🔵 Optional ✅ |
| M26 | Gradio UI für Agenten | ChatInterface, Blocks, Streaming, HITL | 🔵 Optional ✅ |
| M27 | MCP Integration | Model Context Protocol, Multi-Server | 🔵 Optional ✅ |
| M28 | Production Deployment | Docker, FastAPI, Monitoring, LangSmith | 🔵 Optional ✅ |
| M29 | Hierarchical Agent Teams | 3-Ebenen-Hierarchie, Tool-Delegation, Parallelisierung | 🔵 Optional ✅ |
| M30 | Capstone: End-to-End Research-Report-System | Security Gate, Research/Writing Teams, Quality Judge, StateGraph | 🔵 Optional ✅ |


**Empfohlene Reihenfolge (optional, bei Restzeit):**
1. M22 - Agentic RAG 🟡
2. M23 - Agent Evaluation & Testing 🟡
3. M24 - Agent Security & Best Practices 🔵
4. M26 - Gradio UI für Agenten 🔵
5. M27 - MCP Integration 🔵
6. M25 - Advanced RAG Pipeline-Patterns 🔵
7. M28 - Production Deployment 🔵
8. M29 - Hierarchical Agent Teams 🔵
9. M30 - Capstone (Abschlussprojekt) 🔵


---

## 📋 Notebook-Struktur (Template)

Alle Notebooks folgen dem **Notebook Template Guide**:

```
1. Titel (HTML, grau, "KI-Agenten. Verstehen. Anwenden. Gestalten.")
2. 🔧 Umgebung einrichten (collapsed)
3. Kapitel 1-N (# [Nummer] | Titel)
4. # A | Aufgabe
```

**Wichtig:**
- Konsistentes Styling
- LangChain 1.0+ Patterns
- Mermaid-Diagramme (statt statische Bilder)
- `mprint()` für Ausgaben



---

**Version:** 1.4
**Stand:** März 2026
