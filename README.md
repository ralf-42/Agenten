# Agenten – Multi-Agent-Systeme mit LangChain, LangGraph & LangSmith

![LangChain 1.0+](https://img.shields.io/badge/LangChain-1.0%2B-brightgreen)
![LangGraph 1.0.9](https://img.shields.io/badge/LangGraph-1.0.9-brightgreen)
![LangSmith 0.4.41](https://img.shields.io/badge/LangSmith-0.4.41-brightgreen)
![Last Audit](https://img.shields.io/badge/Last%20Audit-2026--03--05-blue)

Ein deutschsprachiger, praxisorientierter Kurs zu **Agenten-Systemen** mit Fokus auf LangChain 1.0+, LangGraph 1.0.9, LangSmith 0.4.41 und agentenbasierte KI-Architekturen.

## 🌐 Kurs-Website

**[→ Agenten Kurs-Website (GitHub Pages)](https://ralf-42.github.io/Agenten/)**

Die Kursdokumentation mit Konzepten, Frameworks-Guides und Ressourcen zu Multi-Agent-Systemen ist als interaktive Website verfügbar.

## 🎯 Zielgruppe

Teilnehmer mit **soliden Python-Kenntnissen** und ersten **AI/API-Basics**.

**Konkrete Voraussetzungen:**
- Python: Klassen, Decorators, Type Hints, try/except, Grundverständnis von async/await
- AI/API-Basics: Was ist ein LLM, Token, Kontextfenster; API-Aufrufprinzip (Key, Request, Response)
- Arbeitsumgebung: Erfahrung mit Jupyter/Colab (Notebooks ausführen, Runtime neu starten)


## 📁 Projektstruktur

```
Agenten/
├── 01_notebook/    # Jupyter Notebooks (M00-M30)
├── 02_daten/       # Datasets (Text, Bild, Audio, Video)
├── 03_skript/      # Kursmaterialien (PDF)
├── 04_modul/       # Python-Module (genai_lib)
├── 05_prompt/      # Prompt-Templates (Markdown-Format)
├── 07_image/       # Bildmaterialien
└── docs/           # GitHub Pages Dokumentation
```

## 🛠️ Technologie-Stack

### Kernframeworks
- **LangChain** (1.0+) - Orchestrierung, Chains, Agents, RAG
- **LangGraph** (1.0.x) - Zustandsbasierte Multi-Agent-Workflows, State Machines
- **LangSmith** (0.x+) - Tracing, Debugging, Evaluations
- **OpenAI API** (>=1.0.0) - GPT-4o-mini, Embeddings

### Spezialisierte Tools
- **ChromaDB** (>=1.0.0) - Vektordatenbank für RAG-Systeme
- **genai_lib** (eigene Module in `04_modul/genai_lib/`) - Projektspezifische Utilities
  - `utilities.py` - `mprint()`, `mermaid()`, `setup_api_keys()`, `check_environment()`
  - `multimodal_rag.py` - Multimodales RAG-System


## 📚 Kursmodule (Kursplan v4.5)

### Block 1: Vom LLM zum denkenden Agenten (M00-M03)
| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| M00 | Kurs-Intro | Kursübersicht, Setup, API-Keys, LangSmith |
| M01 | Was sind KI-Agenten? | Definition, ReAct/TAO-Prinzip, Agent-Typen |
| M02 | Tool Use & Function Calling | @tool Decorator, eigene Tools bauen |
| M03 | Erste Agenten mit LangChain | create_agent(), Deprecated Patterns (EINMALIG) |

### Block 2: Chains & Workflow-Struktur (M04-M07)
| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| M04 | Prompt Engineering | ChatPromptTemplate, System/Human Messages |
| M05 | LCEL Chains | Pipe-Operator, Runnable Interface, Streaming |
| M06 | Structured Output | Pydantic, with_structured_output() |
| M07 | Multi-Tool Agents | Agent mit 3-4 Tools, Error Handling, Debugging |

### Block 3: Gedächtnis & RAG (M08-M11)
| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| M08 | RAG-Konzepte & Embeddings | RAG-Architektur, Vektoren, Token-Limits |
| M09 | ChromaDB & Indexing | Chunking, Embedding, Vektordatenbank |
| M10 | RAG-Chain mit LangChain | Retriever, Similarity Search, LCEL-Chain |
| M11 | RAG-Agent | RAG als Tool, Agent entscheidet wann RAG |

### Block 4: Kontrolle mit LangGraph (M12-M14, M21)
| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| M12 | Warum LangGraph? | Limitierungen von create_agent(), State Machines |
| M13 | StateGraph Basics | State, Nodes, Edges, compile() |
| M14 | Conditional Routing & Tool-Loop | Routing-Funktionen, Security-Basics |
| M21 | LangSmith Evaluations Basics | Eval-Dataset, Regression-Check |

### Block 5: HITL & Multi-Agent-Projekt (M15-M20)
| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| M15 | Checkpointing & Sessions | MemorySaver, Thread-ID, State |
| M16 | Human-in-the-Loop | interrupt(), Approval-Pattern |
| M17 | Multi-Agent Patterns | Supervisor, Hierarchical, Collaborative |
| M18 | Supervisor Pattern | Worker-Agents, Supervisor-Logik, Graph |
| M19 | Multi-Agent Projekt | Projekt-Templates (Research/Content/Support) |
| M20 | OpenAI Agent Builder | Kurz-Ausblick (10 Min), Vergleich |

### Erweiterte Module (M22-M30, optional)
| Modul | Thema                           | Priorität       |
| ----- | ------------------------------- | --------------- |
| M22   | Agentic RAG                      | 🟡 Empfohlen ✅ |
| M23   | Agent Evaluation & Testing       | 🟡 Empfohlen |
| M24   | Agent Security & Best Practices  | 🔵 Optional |
| M25   | Advanced RAG – Pipeline-Patterns | 🔵 Optional ✅ |
| M26   | Gradio UI für Agenten            | 🔵 Optional |
| M27   | MCP Integration                  | 🔵 Optional |
| M28   | Production Deployment            | 🔵 Optional |
| M29   | Hierarchical Agent Teams         | 🔵 Optional |
| M30   | Collaborative Multi-Agent        | 🔵 Optional ✅ |

## 🔑 Voraussetzungen

- Python 3.10+ (Klassen, Decorators, Type Hints sicher beherrschen)
- Google Colab Account (primär) oder lokale Jupyter-Installation
- OpenAI API Key (ca. 5 EUR für gesamten Kurs)
- LangSmith Account (kostenlos, für Tracing/Debugging)

## 📦 Installation

Das `genai_lib` Modul kann direkt aus diesem Repository installiert werden:

```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```

## 💡 Nutzung

Alle Notebooks sind eigenständig lauffähig und für Google Colab optimiert. Das `genai_lib` Utility-Paket übernimmt das automatische Setup der Umgebung.

## 🎓 Projekte & Übungen

Der Kurs bietet zwei praxisorientierte Lernformate:


### [Agenten Workshop](https://ralf-42.github.io/Agenten/projekte/Agenten_Workshop.html)
**Workshop-Format** | Begleitete Schritt-für-Schritt-Übung (Zusatzmaterial)

### [KI-Challenge](https://ralf-42.github.io/Agenten/projekte/Agenten_Challenges.html)
**End-to-End Projekt** | Eigenständige Implementierung (Zusatzmaterial)

## 📖 Dokumentation

- **Kurs-Website:** [https://ralf-42.github.io/Agenten/](https://ralf-42.github.io/Agenten/)


## ⚖️ Lizenzen

Der **Quellcode** steht unter der [MIT License](./LICENSE).       
Die **Kursmaterialien** (z. B. Folien, Texte, Grafiken) sind unter der [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) veröffentlicht.     
Bilder und Videos erstellt mit **Hedra AI** – Nutzung gemäß [Hedra Terms](https://www.hedra.com/terms).     

© 2025–2026 Ralf-42

---

**Letzte Aktualisierung:** März 2026
**Version:** 3.3 
