# Jupyter Notebooks - Agenten Kurs

## 📚 Modulstruktur

Dieses Verzeichnis enthält **30 Jupyter Notebooks** (M00-M29) für den 5-Tage-Kurs "KI-Agenten. Verstehen. Anwenden. Gestalten."

---

## 🎯 Kern-Module (M00-M20) - 5-Tage-Kurs

### **TAG 1: Grundlagen** (M00-M03)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M00 | Kurs-Intro | Kursübersicht, Setup, API-Keys | ✅ Template |
| M01 | Was sind KI-Agenten? | Definition, ReAct-Prinzip, Agent-Typen | ✅ Template |
| M02 | Tool Use & Function Calling | @tool Decorator, eigene Tools | ✅ Template |
| M03 | Erste Agenten mit LangChain | create_agent(), Deprecated Patterns | ✅ Template |

**Kursplan:** Tag 1 - Agent-Grundlagen & erste Tools

---

### **TAG 2: Chains & Strukturierung** (M04-M07)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M04 | Prompt Engineering für Agenten | ChatPromptTemplate, Few-Shot Examples | ✅ Template |
| M05 | LCEL Chains | Pipe-Operator, Runnable Interface | ✅ Template |
| M06 | Structured Output | Pydantic, with_structured_output() | ✅ Template |
| M07 | Multi-Tool Agents | Agent mit 3-4 Tools, Debugging | ✅ Template |

**Kursplan:** Tag 2 - Chains, Structured Output & Agent-Vertiefung

---

### **TAG 3: Gedächtnis & RAG** (M08-M11)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M08 | RAG-Konzepte & Embeddings | RAG-Architektur, Embeddings, Chunking | ✅ Template |
| M09 | ChromaDB & Indexing | ChromaDB Setup, Dokumente indexieren | ✅ Template |
| M10 | RAG-Chain mit LangChain | Retriever, Similarity Search, RAG-Chain | ✅ Template |
| M11 | RAG-Agent | RAG als Tool, RAG-Agent bauen | ✅ Template |

**Kursplan:** Tag 3 - Gedächtnis & RAG

---

### **TAG 4: LangGraph & Kontrolle** (M12-M16)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M12 | Warum LangGraph? | Limitierungen von create_agent(), State Machines | ✅ Template |
| M13 | StateGraph Basics | StateGraph, Nodes, Edges | ✅ Template |
| M14 | Conditional Routing & Tool-Loop | Conditional Edges, Routing-Funktion | ✅ Template |
| M15 | Checkpointing & Sessions | MemorySaver, Sessions fortsetzen | ✅ Template |
| M16 | Human-in-the-Loop | interrupt(), Approval-Pattern | ✅ Template |

**Kursplan:** Tag 4 - Kontrolle mit LangGraph

---

### **TAG 5: Multi-Agent-Systeme** (M17-M20)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M17 | Multi-Agent Patterns | Supervisor, Hierarchical, Collaborative | ✅ Template |
| M18 | Supervisor Pattern | Worker-Agents, Supervisor-Logik, Graph | ✅ **Vollständig** (aus M10c) |
| M19 | Multi-Agent Projekt | Projekt-Templates, MVP-Definition | ✅ Template |
| M20 | OpenAI Agent Builder | No-Code vs. Code, Vergleich | ✅ Template |

**Kursplan:** Tag 5 - Multi-Agent-Systeme

---

## 📊 Erweiterte Module (M21-M29) - Optional

| Modul | Titel | Inhalt | Priorität |
|-------|-------|--------|-----------|
| M21 | LangSmith Deep Dive | Tracing, Datasets, Evaluations | 🟡 SHOULD |
| M22 | Agent Evaluation & Testing | Metriken, Benchmarking | 🟡 SHOULD |
| M23 | Hierarchical Agent Teams | Team-Lead → Specialists | 🔴 NICE-TO-HAVE |
| M24 | Collaborative Multi-Agent | Peer-to-Peer, Shared State | ✅ **Vollständig** (aus M10c) |
| M25 | Agent Security & Best Practices | Tool-Whitelisting, PII-Redaktion | 🔴 NICE-TO-HAVE |
| M26 | Production Deployment | Docker, LangServe, Monitoring | 🔴 NICE-TO-HAVE |
| M27 | MCP Integration | Model Context Protocol, Custom Tools | 🔴 NICE-TO-HAVE |
| M28 | Gradio UI für Agenten | Chat-Interface, Tool-Visualisierung | 🔴 NICE-TO-HAVE |
| M29 | Advanced RAG | Self-RAG, Corrective RAG, Adaptive RAG | ✅ **Vollständig** |

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
- `M08b_Advanced_RAG_LangGraph.ipynb` - Zu M29 umbenannt
- `M10b_Agenten_LangGraph.ipynb` - Inhalte in M13/M14 referenziert
- `M10c_Multi_Agent_Collaboration.ipynb` - Zu M18/M24 kopiert

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
3. Erweiterte Module M21-M29 für Vertiefung

### **Für Teilnehmer:**
1. Notebooks in Reihenfolge durcharbeiten (M00 → M20)
2. Referenz-Tutorials für Deep Dive nutzen
3. Erweiterte Module für Spezialisierung

### **Für Selbststudium:**
1. Start mit M00_Kurs_Intro
2. Alle Module M00-M29 durcharbeiten
3. Referenz-Tutorials für vollständige Erklärungen

---

## 📊 Status-Übersicht

| Kategorie | Anzahl | Status |
|-----------|--------|--------|
| **Kern-Module (M00-M20)** | 21 | 3 vollständig, 18 Templates |
| **Erweiterte Module (M21-M29)** | 9 | 2 vollständig, 7 Templates |
| **Referenz-Tutorials** | 2 | 2 vollständig |
| **GESAMT** | 32 | 7 vollständig, 25 Templates |

**Vollständig:** M04a/M04b (Referenz), M18, M24, M29
**Templates:** Struktur vorhanden, Inhalt muss ergänzt werden

---

## 🔗 Weitere Ressourcen

- **Kursplan:** `../00_admin/Kursplan_KI-Agenten_5-Tage_v4.2.md`
- **Projekt-Doku:** `../CLAUDE.md`, `../AGENTS.md`
- **Standards:** `../LangChain_Best_Practices.md`, `../LangGraph_Best_Practices.md`
- **Notebook Template:** `../Notebook_Template_Guide.md`

---

**Version:** 1.0
**Stand:** Januar 2026
**Erstellt:** Automatische Modulstruktur-Generierung
