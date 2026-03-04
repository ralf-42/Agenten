# Jupyter Notebooks - Agenten Kurs

## 📚 Modulstruktur

Dieses Verzeichnis enthält **33 Jupyter Notebooks** für den 5-Tage-Kurs "KI-Agenten. Verstehen. Anwenden. Gestalten." (21 Kern-Module M00-M20, 9 erweiterte Module M21-M29, 2 Referenz-Tutorials, 1 Quick-Template).

**Modul M21 existiert in zwei Varianten:**
- `M21_LangSmith_Evaluations_Basics.ipynb` – **Kurs-Variante** (Tag 4, fokussiert auf Eval-Dataset + Regression-Check)
- `M21_LangSmith_Deep_Dive.ipynb` – **Optionale Vertiefung** (Tracing, Datasets, A/B-Testing)

**Hinweis Kurs-Reihenfolge:** Die Modulnummern M00-M29 folgen der inhaltlichen Systematik, nicht der Kurs-Reihenfolge. An Tag 4 wird M21 (Evaluations) vorgezogen, M15/M16 folgen erst an Tag 5. Siehe Kursplan v4.4 für die genaue Tagesplanung.

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

### **TAG 4: Kontrolle, Routing & Security** (M12-M14, M21)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M12 | Warum LangGraph? | Limitierungen von create_agent(), State Machines | ✅ Template |
| M13 | StateGraph Basics | StateGraph, Nodes, Edges | ✅ Template |
| M14 | Conditional Routing & Tool-Loop | Conditional Edges, Routing-Funktion | ✅ Template |
| M21 | LangSmith Evaluations Basics | Eval-Dataset, Qualitätskriterien, Regression-Check | ✅ Template |

**Kursplan:** Tag 4 - Kontrolle, Routing & Security

---

### **TAG 5: HITL & Multi-Agent-Projekt** (M15-M20)

| Modul | Titel | Inhalt | Status |
|-------|-------|--------|--------|
| M15 | Checkpointing & Sessions | MemorySaver, Sessions fortsetzen | ✅ Template |
| M16 | Human-in-the-Loop | interrupt(), Approval-Pattern | ✅ Template |
| M17 | Multi-Agent Patterns | Supervisor, Hierarchical, Collaborative | ✅ Template |
| M18 | Supervisor Pattern | Worker-Agents, Supervisor-Logik, Graph | ✅ **Vollständig** (aus M10c) |
| M19 | Multi-Agent Projekt | Projekt-Templates, MVP-Definition | ✅ Template |
| M20 | OpenAI Agent Builder | Kurz-Ausblick (10 Min), kein Pflicht-Hands-On | ✅ Template |

**Kursplan:** Tag 5 - HITL, Multi-Agent-Projekt & Ausblick

---

## 📊 Erweiterte Module (M21-M29) - Optional

| Modul | Titel | Inhalt | Priorität |
|-------|-------|--------|-----------|
| M21 | LangSmith Deep Dive | Tracing, Datasets, A/B-Testing (optionale Vertiefung zu M21 Evaluations Basics) | 🟡 SHOULD |
| M22 | Advanced RAG | Self-RAG, Corrective RAG, Adaptive RAG | ✅ **Vollständig** |
| M23 | Gradio UI für Agenten | Chat-Interface, Tool-Visualisierung | 🔴 NICE-TO-HAVE |
| M24 | MCP Integration | Model Context Protocol, Custom Tools | 🔴 NICE-TO-HAVE |
| M25 | Agent Security & Best Practices | Tool-Whitelisting, PII-Redaktion | 🔴 NICE-TO-HAVE |
| M26 | Agent Evaluation & Testing | Metriken, Benchmarking | 🟡 SHOULD |
| M27 | Production Deployment | Docker, LangServe, Monitoring | 🔴 NICE-TO-HAVE |
| M28 | Hierarchical Agent Teams | Team-Lead → Specialists | 🔴 NICE-TO-HAVE |
| M29 | Collaborative Multi-Agent | Peer-to-Peer, Shared State | ✅ **Vollständig** (aus M10c) |

**Empfohlene Reihenfolge (optional, bei Restzeit):**
1. M22 - Advanced RAG
2. M23 - Gradio UI für Agenten
3. M24 - MCP Integration
4. M25 - Agent Security & Best Practices
5. M26 - Agent Evaluation & Testing
6. M27 - Production Deployment

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
3. Erweiterte Module M21-M29 für Vertiefung

### **Für Teilnehmer:**
1. Notebooks gemäß Kursplan durcharbeiten (Tag 1: M00-M03, Tag 2: M04-M07, Tag 3: M08-M11, Tag 4: M12-M14 + M21, Tag 5: M15-M20)
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
| **Kern-Module (M00-M20 + M21 Eval)** | 22 | 3 vollständig, 19 Templates |
| **Erweiterte Module (M21 Deep Dive, M22-M29)** | 9 | 2 vollständig, 7 Templates |
| **Referenz-Tutorials** | 2 | 2 vollständig |
| **GESAMT** | 33 | 7 vollständig, 26 Templates |

**Vollständig:** M04a/M04b (Referenz), M18, M22, M29
**Templates:** Struktur vorhanden, Inhalt muss ergänzt werden

---

## 🔗 Weitere Ressourcen

- **Kursplan:** `../00_admin/Kursplan_KI-Agenten_5-Tage_v4.4.md`
- **Projekt-Doku:** `../CLAUDE.md`, `../AGENTS.md`
- **Standards:** `../LangChain_Best_Practices.md`, `../LangGraph_Best_Practices.md`
- **Notebook Template:** `../Notebook_Template_Guide.md`

---

**Version:** 1.1 (angepasst an Kursplan v4.4)
**Stand:** Februar 2026
