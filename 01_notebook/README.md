# Jupyter Notebooks - Agenten Kurs

## 📚 Modulstruktur

Dieses Verzeichnis enthält **33 Jupyter Notebooks** für den 5-Tage-Kurs "KI-Agenten. Verstehen. Anwenden. Gestalten." (22 Kern-Module M00-M21, 9 erweiterte Module M22-M30, 2 Referenz-Tutorials).

**Hinweis Kurs-Reihenfolge:** An Tag 4 wird M21 (LangSmith Evaluations Basics) vorgezogen, M15–M20 folgen erst an Tag 5. Siehe Kursplan v4.5 für die genaue Tagesplanung.

---

## 🎯 Kern-Module (M00-M20) - 5-Tage-Kurs

### **TAG 1: Grundlagen** (M00-M03)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M00 | Kurs-Intro | Kursübersicht, Setup, API-Keys | ✅ Vollständig |
| M01 | Was sind KI-Agenten? | Definition, ReAct-Prinzip, Agent-Typen | ✅ Vollständig |
| M02 | Tool Use & Function Calling | @tool Decorator, eigene Tools | ✅ Vollständig |
| M03 | Erste Agenten mit LangChain | create_agent(), Deprecated Patterns | ✅ Vollständig |

**Kursplan:** Tag 1 - Agent-Grundlagen & erste Tools

---

### **TAG 2: Chains & Strukturierung** (M04-M07)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M04 | Prompt Engineering für Agenten | ChatPromptTemplate, Few-Shot Examples | ✅ Vollständig |
| M05 | LCEL Chains | Pipe-Operator, Runnable Interface | ✅ Vollständig |
| M06 | Structured Output | Pydantic, with_structured_output() | ✅ Vollständig |
| M07 | Multi-Tool Agents | Agent mit 3-4 Tools, Debugging | ✅ Vollständig |

**Kursplan:** Tag 2 - Chains, Structured Output & Agent-Vertiefung

---

### **TAG 3: Gedächtnis & RAG** (M08-M11)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M08 | RAG-Konzepte & Embeddings | RAG-Architektur, Embeddings, Chunking | ✅ Vollständig |
| M09 | ChromaDB & Indexing | ChromaDB Setup, Dokumente indexieren | ✅ Vollständig |
| M10 | RAG-Chain mit LangChain | Retriever, Similarity Search, RAG-Chain | ✅ Vollständig |
| M11 | RAG-Agent | RAG als Tool, RAG-Agent bauen | ✅ Vollständig |

**Kursplan:** Tag 3 - Gedächtnis & RAG

---

### **TAG 4: Kontrolle, Routing & Security** (M12-M14, M21)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M12 | Warum LangGraph? | Limitierungen von create_agent(), State Machines | ✅ Vollständig |
| M13 | StateGraph Basics | StateGraph, Nodes, Edges | ✅ Vollständig |
| M14 | Conditional Routing & Tool-Loop | Conditional Edges, Routing-Funktion | ✅ Vollständig |
| M21 | LangSmith Evaluations Basics | Eval-Dataset, Qualitätskriterien, Regression-Check | ✅ Vollständig |

**Kursplan:** Tag 4 - Kontrolle, Routing & Security

---

### **TAG 5: HITL & Multi-Agent-Projekt** (M15-M20)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M15 | Checkpointing & Sessions | MemorySaver, Sessions fortsetzen | ✅ Vollständig |
| M16 | Human-in-the-Loop | interrupt(), Approval-Pattern | ✅ Vollständig |
| M17 | Multi-Agent Patterns | Supervisor, Hierarchical, Collaborative | ✅ Vollständig |
| M18 | Supervisor Pattern | Worker-Agents, Supervisor-Logik, Graph | ✅ Vollständig |
| M19 | Multi-Agent Projekt | Projekt-Templates, MVP-Definition | ✅ Vollständig |
| M20 | OpenAI Agent Builder | Kurz-Ausblick (10 Min), kein Pflicht-Hands-On | ✅ Vollständig |

**Kursplan:** Tag 5 - HITL, Multi-Agent-Projekt & Ausblick

---

## 📊 Erweiterte Module (M22-M30) - Optional

| Modul | Titel | Inhalt | Priorität |
|-------|-------|--------|-----------|
| M22 | Agentic RAG | RAG als Tool, Multi-Hop, Adaptive Retrieval | 🟡 Empfohlen ✅ Vollständig |
| M23 | Agent Evaluation & Testing | Metriken, Benchmarking, LangSmith Eval, RAGAS | 🟡 Empfohlen |
| M24 | Agent Security & Best Practices | Tool-Whitelisting, PII-Redaktion | 🔵 Optional |
| M25 | Advanced RAG – Pipeline-Patterns | Self-RAG, Reranking, CRAG | 🔵 Optional ⭐ Vertiefung ✅ Vollständig |
| M26 | Gradio UI für Agenten | Chat-Interface, Tool-Visualisierung | 🔵 Optional |
| M27 | MCP Integration | Model Context Protocol, Custom Tools | 🔵 Optional |
| M28 | Production Deployment | Docker, LangServe, Monitoring | 🔵 Optional |
| M29 | Hierarchical Agent Teams | Team-Lead → Specialists | 🔵 Optional |
| M30 | Collaborative Multi-Agent | Peer-to-Peer, Shared State | 🔵 Optional ✅ Vollständig |

> **Pflicht-Lernpfad RAG:** M08–M11 → M22 (Agentic RAG)
> **M25** nur für Teilnehmer, die RAG-Qualitäts-Patterns vertiefen möchten.

**Empfohlene Reihenfolge (optional, bei Restzeit):**
1. M22 - Agentic RAG 🟡
2. M23 - Agent Evaluation & Testing 🟡
3. M24 - Agent Security & Best Practices 🔵
4. M26 - Gradio UI für Agenten 🔵
5. M27 - MCP Integration 🔵
6. M25 - Advanced RAG Pipeline-Patterns 🔵 ⭐ Vertiefung

---

## 📖 Referenz-Tutorials

Diese Notebooks sind **vollständige Deep-Dive Tutorials** für Selbststudium:

| Tutorial | Titel | Größe | Beschreibung |
|----------|-------|-------|--------------|
| **M04a_REFERENZ** | LangChain 101 | 55 KB | Vollständiges LangChain Tutorial (7 Kapitel) |
| **M04b_REFERENZ** | LangGraph 101 | 84 KB | Vollständiges LangGraph Tutorial (9 Kapitel) |

**Verwendung:**
- ✅ Als Nachschlagewerk für Trainer
- ✅ Für Teilnehmer zum Vertiefen
- ✅ Nicht Teil des 5-Tage-Kurses (zu umfangreich)

---

## 🗂️ Archivierte Notebooks (_misc/)

Folgende Notebooks wurden in `_misc/` verschoben:

- `M06_Chat_Memory.ipynb` - Inhalte in M15 integriert
- `M06_Chat_Memory_LangGraph.ipynb` - Inhalte in M15 integriert
- `M08b_Advanced_RAG_LangGraph.ipynb` - Zu M22 umbenannt
- `M10b_Agenten_LangGraph.ipynb` - Inhalte in M13/M14 referenziert
- `M10c_Multi_Agent_Collaboration.ipynb` - Zu M18/M29 kopiert

---

## 📋 Notebook-Struktur (Template)

Alle Notebooks folgen dem **Notebook Template Guide**:

```
1. Banner-Bild
2. Titel (HTML, grau, "KI-Agenten. Verstehen. Anwenden. Gestalten.")
3. 🔧 Umgebung einrichten (collapsed)
4. Kapitel 1-N (# [Nummer] | Titel)
5. # A | Aufgabe
```

**Wichtig:**
- Konsistentes Styling
- LangChain 1.0+ Patterns
- Mermaid-Diagramme (statt statische Bilder)
- `mprint()` für Ausgaben

---

## 🚀 Verwendung

### **Für Trainer:**
1. Kern-Module M00-M20 für 5-Tage-Kurs verwenden
2. Referenz-Tutorials M04a/M04b als Bonus-Material
3. Erweiterte Module M22-M30 für Vertiefung

### **Für Teilnehmer:**
1. Notebooks gemäß Kursplan durcharbeiten (Tag 1: M00-M03, Tag 2: M04-M07, Tag 3: M08-M11, Tag 4: M12-M14 + M21, Tag 5: M15-M20)
2. Referenz-Tutorials für Deep Dive nutzen
3. Erweiterte Module für Spezialisierung

### **Für Selbststudium:**
1. Start mit M00_Kurs_Intro
2. Alle Module M00-M30 durcharbeiten
3. Referenz-Tutorials für vollständige Erklärungen

---

## 📊 Status-Übersicht

| Kategorie | Anzahl | Status |
|-----------|--------|--------|
| **Kern-Module (M00-M21)** | 22 | 22 vollständig |
| **Erweiterte Module (M22-M30)** | 9 | 3 vollständig, 6 Templates |
| **Referenz-Tutorials** | 2 | 2 vollständig |
| **GESAMT** | 33 | 27 vollständig, 6 Templates |

**Vollständig:** M00–M22, M25, M30, M04a/M04b (Referenz)
**Templates (Inhalt ausstehend):** M23, M24, M26, M27, M28, M29

---

## 🔗 Weitere Ressourcen

- **Kursplan:** `../00_admin/Kursplan_KI-Agenten_5-Tage_v4.4.md` (v4.5)
- **Projekt-Doku:** `../CLAUDE.md`, `../AGENTS.md`
- **Standards:** `../LangChain_Best_Practices.md`, `../LangGraph_Best_Practices.md`
- **Notebook Template:** `../Notebook_Template_Guide.md`

---

**Version:** 1.3 (Framework-Versionen aktualisiert, Status-Übersicht korrigiert, M22-M30 konsolidiert)
**Stand:** März 2026
