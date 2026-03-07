# Jupyter Notebooks - Agenten Kurs

## 📚 Modulstruktur

Dieses Verzeichnis enthält **32 Jupyter Notebooks** für den Kurs "KI-Agenten. Verstehen. Anwenden. Gestalten." (22 Kern-Module M01-M22, 10 erweiterte Module M23-M32).

**Hinweis Reihenfolge:** M17 (LangSmith Evaluations Basics) gehört inhaltlich zu Block 4, M15–M16 zu Block 5. Siehe Kursplan v4.5 für Details.
**Hinweis M00:** Kurs-Intro-Materialien sind separat verfügbar und nicht als Notebook in diesem Verzeichnis enthalten.

---

## 🎯 Kern-Module (M01-M22)

### **BLOCK 1: Grundlagen** (M01-M03)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
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

### **BLOCK 4: Kontrolle, Routing & Security** (M12-M14, M17)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M12 | Warum LangGraph? | Limitierungen von create_agent(), State Machines | ✅ Vollständig |
| M13 | StateGraph Basics | StateGraph, Nodes, Edges | ✅ Vollständig |
| M14 | Conditional Routing & Tool-Loop | Conditional Edges, Routing-Funktion | ✅ Vollständig |
| M17 | LangSmith Evaluations Basics | Eval-Dataset, Qualitätskriterien, Regression-Check | ✅ Vollständig |

**Block 4** – Kontrolle, Routing & Security

---

### **BLOCK 5: HITL & Multi-Agent-Projekt** (M15–M16, M18–M22)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M15 | Checkpointing & Sessions | MemorySaver, Sessions fortsetzen | ✅ Vollständig |
| M16 | Memory-Systeme | Konversationsspeicher, Semantic Memory, Per-User Memory | ✅ Vollständig |
| M18 | Human-in-the-Loop | interrupt(), Approval-Pattern | ✅ Vollständig |
| M19 | Multi-Agent Patterns | Supervisor, Hierarchical, Collaborative | ✅ Vollständig |
| M20 | Supervisor Pattern | Worker-Agents, Supervisor-Logik, Graph | ✅ Vollständig |
| M21 | Multi-Agent Projekt | Projekt-Templates, MVP-Definition | ✅ Vollständig |
| M22 | OpenAI Agent Builder | Kurz-Ausblick (10 Min), kein Pflicht-Hands-On | ✅ Vollständig |

**Block 5** – HITL, Multi-Agent-Projekt & Ausblick

---

## 📊 Erweiterte Module (M23-M32) - Optional

> Alle Notebooks fertiggestellt ✅

| Modul | Titel | Inhalt | Priorität |
|-------|-------|--------|-----------|
| M23 | Agentic RAG | RAG als Tool, Multi-Hop, Adaptive Retrieval | 🟡 Empfohlen ✅ |
| M24 | Agent Evaluation & Testing | Metriken, LangSmith Eval, RAGAS, Regressions-Tests | 🟡 Empfohlen ✅ |
| M25 | Agent Security & Best Practices | Prompt Injection, Tool-Whitelisting, PII-Redaktion | 🔵 Optional ✅ |
| M26 | Advanced RAG – Pipeline-Patterns | Self-RAG, Reranking, CRAG | 🔵 Optional ✅ |
| M27 | Gradio UI für Agenten | ChatInterface, Blocks, Streaming, HITL | 🔵 Optional ✅ |
| M28 | MCP Integration | Model Context Protocol, Multi-Server | 🔵 Optional ✅ |
| M29 | Production Deployment | Docker, FastAPI, Monitoring, LangSmith | 🔵 Optional ✅ |
| M30 | Hierarchical Agent Teams | 3-Ebenen-Hierarchie, Tool-Delegation, Parallelisierung | 🔵 Optional ✅ |
| M31 | Collaborative Multi-Agent | Peer-Review, Diskussion, direkter Agenten-Austausch | 🔵 Optional ✅ |
| M32 | DeepAgents Harness | Planning, Sub-Agent Spawning, Filesystem-Harness | 🔵 Optional ✅ |


**Empfohlene Reihenfolge (optional, bei Restzeit):**
1. M23 - Agentic RAG 🟡
2. M24 - Agent Evaluation & Testing 🟡
3. M25 - Agent Security & Best Practices 🔵
4. M27 - Gradio UI für Agenten 🔵
5. M28 - MCP Integration 🔵
6. M26 - Advanced RAG Pipeline-Patterns 🔵
7. M29 - Production Deployment 🔵
8. M30 - Hierarchical Agent Teams 🔵
9. M31 - Collaborative Multi-Agent 🔵
10. M32 - DeepAgents Harness 🔵


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
