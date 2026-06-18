# Agenten – Multi-Agent-Systeme mit LangChain, LangGraph & LangSmith

![LangChain 1.3.0](https://img.shields.io/badge/LangChain-1.3.0-brightgreen) ![LangGraph 1.2.0](https://img.shields.io/badge/LangGraph-1.2.0-brightgreen) ![LangSmith 0.8.3](https://img.shields.io/badge/LangSmith-0.8.3-brightgreen) ![DeepAgents 0.6.8](https://img.shields.io/badge/DeepAgents-0.6.8-brightgreen) ![Last Audit](https://img.shields.io/badge/Last%20Audit-2026--06--05-blue) ![License MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Ein deutschsprachiger, praxisorientierter Kurs zu **Agenten-Systemen** mit Fokus auf LangChain, LangGraph, LangSmith und agentenbasierte KI-Architekturen.

Der durchgehende Anwendungsfall ist ein **Research Assistant für Fachartikel**: Eine fiktive Wissensarbeiterin, Pia, baut schrittweise ein System, das einen PDF-Korpus semantisch durchsucht, Antworten mit Quellen belegt, Unsicherheit sichtbar macht und kritische Ausgaben per Human-in-the-Loop freigibt. Tool Use, Structured Output, RAG, Evaluation und Multi-Agent-Patterns werden dadurch nicht als Einzeltechniken, sondern als Bausteine desselben Endprodukts erarbeitet.

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
├── 01_notebook/    # Jupyter Notebooks (M01-M36)
├── 02_daten/       # Datasets (Text, Bild, Audio, Video)
├── 03_skript/      # Kursfolien & Intro-Präsentation
├── 04_modul/       # Python-Module (genai_lib)
├── 05_prompt/      # Prompt-Templates (Markdown-Format)
└── 06_skill/       # Agent Skills (compliance, meeting-briefing, research)
```

## 🛠️ Technologie-Stack

### Kernframeworks
- **LangChain** (1.3.0) - Orchestrierung, Chains, Agents, RAG
- **LangGraph** (1.2.x) - Zustandsbasierte Multi-Agent-Workflows, State Machines
- **LangSmith** (0.8.x) - Tracing, Debugging, Evaluations
- **OpenAI API** (>=1.0.0) - gpt-4o-mini, o3, o3-mini, gpt-5.4-mini, gpt-5.4, Embeddings

### Spezialisierte Tools
- **ChromaDB** (>=1.0.0) - Vektordatenbank für RAG-Systeme
- **genai_lib** (eigene Module in `04_modul/genai_lib/`) - Projektspezifische Utilities
  - `utilities.py` - `mprint()`, `mermaid()`, `setup_api_keys()`, `check_environment()`, `show_trace()`
  - `model_config.py` - Rollenbasierte Modell-Konstanten (`BASELINE`, `ROUTER`, `JUDGE`, `WORKER`, ...)


## 📚 Kursmodule

### Block 1: Agenten-Basics (M01–M07)
| Modul | Thema                             | Beschreibung                                                    |
| ----- | --------------------------------- | --------------------------------------------------------------- |
| M01   | Kurs-Intro & Was sind KI-Agenten? | Setup, Agent-Definition, ReAct/TAO-Prinzip, Agent-Typen         |
| M02   | Tool Use & Function Calling       | @tool Decorator, Research-Tools bauen                           |
| M03   | Erste Agenten mit LangChain       | create_agent(), Deprecated Patterns (EINMALIG)                  |
| M04   | Prompt Engineering                | ChatPromptTemplate, System/Human Messages                       |
| M05   | Structured Output                 | Pydantic, with_structured_output(), Paper-Signale               |
| M06   | Multi-Tool Agents                 | Agent mit 3-4 Tools, Error Handling, Debugging                  |
| M07   | LCEL Chains (Brücke → LangGraph)  | Pipe-Operator, Runnable Interface, Wann reicht LCEL nicht mehr? |

### Block 2: Agenten-Kontrolle / LangGraph (M08–M10)
| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| M08 | Warum LangGraph? | Limitierungen von create_agent(), State Machines |
| M09 | StateGraph Basics | State, Nodes, Edges, compile() |
| M10 | Conditional Routing & Tool-Loop (+ Security) | Routing-Funktionen, Security-Basics integriert |

### Block 3: Agenten mit Wissen / RAG (M11–M15)
| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| M11 | RAG-Konzepte & Embeddings | RAG-Architektur, Vektoren, Token-Limits |
| M12 | ChromaDB & Indexing | Chunking, Embedding, Vektordatenbank |
| M13 | RAG-Chain mit LangChain | Retriever, Similarity Search, LCEL-Chain |
| M14 | RAG-Agent | RAG als Tool, Agent entscheidet wann RAG |
| M15 | LangSmith Evaluations Basics | Eval-Dataset, Quellen-Treffer, Out-of-Corpus-Checks |

### Block 4: HITL & Multi-Agent (M16–M21)

| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| M16 | Checkpointing & Sessions | MemorySaver, Thread-ID, State |
| M17 | Human-in-the-Loop | interrupt(), Review und Freigabe vor finaler Research-Antwort |
| M18 | Memory-Systeme | Konversationsspeicher (Buffer/Sliding Window/Summarization), Semantic Memory, Per-User Memory |
| M19 | Multi-Agent Patterns | Supervisor, Hierarchical, Collaborative |
| M20 | Supervisor Pattern | Worker-Agents, Supervisor-Logik, Graph |
| M21 | Hierarchical Agent Teams | Team-Lead Patterns, 3-Ebenen-Hierarchie, Sub-Supervisor, Tool-Delegation |

### Empfohlene Lernpfade

**RAG-Vertiefung:** M11 → M12 → M13 → M14 → M22 → M27
**Security:** M10 → M23 (direkt empfohlen nach Block 2)
**Evaluation:** M15 → M24 (natürliche Fortsetzung)

### Erweiterte Module (M22–M36, optional)

| Modul | Thema                                 | Priorität    | Status |
| ----- | ------------------------------------- | ------------ | ------ |
| M22   | Agentic RAG                           | 🟡 Empfohlen | ✅      |
| M23   | Agent Security & Best Practices       | 🟡 Empfohlen | ✅      |
| M24   | Agent Evaluation & Testing            | 🟡 Empfohlen | ✅      |
| M26   | Integration Pipeline                  | 🔵 Optional  | ✅      |
| M27   | Advanced RAG – Pipeline-Patterns      | 🔵 Optional  | ✅      |
| M28   | Gradio UI für Agenten                 | 🔵 Optional  | ✅      |
| M30a  | MCP Local                             | 🔵 Optional  | ✅      |
| M30b  | MCP HuggingFace                       | 🔵 Optional  | ✅      |
| M31   | Agent Skill – Compliance              | 🔵 Optional  | ✅      |
| M32   | DeepAgents: Autonomes Harness-Pattern | 🔵 Optional  | ✅      |
| M33   | DeepAgents Skill: Meeting-Briefing    | 🔵 Optional  | ✅      |
| M34   | DeepAgent Multi-Skill                 | 🔵 Optional  | ✅      |
| M35   | Production Deployment                 | 🔵 Optional  | ✅      |
| M36   | Capstone                              | 🔵 Optional  | ✅      |

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

## 🎓 Projektziel

Am Ende steht ein eigener **Research Assistant** als Capstone-Variante. Der Bauplan bleibt gleich, der Korpus oder die Persona kann variieren:

- PDF-Korpus reproduzierbar laden
- semantische Suche mit ChromaDB nutzen
- Antworten mit Quellen und Sicherheitshinweis strukturieren
- Out-of-Corpus-Fragen klar abgrenzen
- Human-in-the-Loop für kritische Ausgaben einsetzen
- optional Supervisor- und Worker-Rollen ergänzen


## 📖 Dokumentation

- **Kurs-Website:** [https://ralf-42.github.io/Agenten/](https://ralf-42.github.io/Agenten/)


## ⚖️ Lizenzen

Der **Quellcode** steht unter der [MIT License](./LICENSE).       
Die **Kursmaterialien** (z. B. Folien, Texte, Grafiken) sind unter der [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) veröffentlicht.     

© 2025–2026 Ralf-42     

> [!NOTE]
> Bei der Erstellung dieser Unterlagen kamen KI-Werkzeuge zum Einsatz. Die Inhalte wurden anschließend fachlich geprüft und überarbeitet.

---

**Letzte Aktualisierung:** Juni 2026     
**Version:** 5.1     
