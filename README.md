# Agent-Systeme mit LangChain, LangGraph & LangSmith

[![LangChain >=1.3.13](https://img.shields.io/badge/LangChain-%3E%3D1.3.13-brightgreen)](./.claude/config/langchain-patterns.yaml) [![LangGraph >=1.2.4](https://img.shields.io/badge/LangGraph-%3E%3D1.2.4-brightgreen)](./04_modul/requirements.txt) [![LangSmith >=0.8](https://img.shields.io/badge/LangSmith-%3E%3D0.8-blue)](https://smith.langchain.com) [![DeepAgents optional >=0.6.12](https://img.shields.io/badge/DeepAgents_optional-%3E%3D0.6.12-brightgreen)](./docs/06-multi-agent-erweiterungen/einsteiger-deepagents.md) [![Last Audit](https://img.shields.io/badge/Last%20Audit-2026--07-blue)](./.claude/config/langchain-patterns.yaml) [![License MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Ein deutschsprachiger, praxisorientierter Kurs zu **Agenten-Systemen** mit Fokus auf LangChain, LangGraph, LangSmith und agentenbasierte KI-Architekturen.

**Leitprofil:** Vom KI-Feature zum kontrollierten Arbeitssystem — Tools, State, Entscheidungen, Freigabe und Evaluation. Der Kurs baut auf GenAI-Grundlagen auf, geht aber über einzelne KI-Features hinaus: Es entsteht ein System, das **plant** (Routing, State, Tool-Auswahl, Supervisor), **handelt** (Tool-Use, RAG als Evidence Tool, Workflows) und **geprüft wird** (Human-in-the-Loop, Security, Evaluation).

Der durchgehende Anwendungsfall ist ein **Meeting- & Research-Briefing-Agent**: Eine fiktive Projektleiterin, Mara Vogt, baut schrittweise ein kontrolliertes Agentensystem, das einen Projektkorpus aus Protokollen, Entscheidungen, Risiken und Fachartikeln semantisch durchsucht, Antworten mit Quellen belegt, Unsicherheit sichtbar macht und kritische Ausgaben per Human-in-the-Loop freigibt. Tool Use, Structured Output, RAG als Evidence Tool, Evaluation und Multi-Agent-Patterns werden dadurch nicht als Einzeltechniken, sondern als Bausteine desselben kontrollierten Arbeitssystems erarbeitet.

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
├── 01_notebook/    # Jupyter Notebooks (M01-M40)
├── 02_daten/       # Datasets (Text, Bild, Audio, Video)
├── 03_skript/      # Kursfolien & Intro-Präsentation
├── 04_modul/       # Python-Module (genai_lib)
├── 05_prompt/      # Prompt-Templates (Markdown-Format)
├── 06_skill/       # Agent Skills (compliance, meeting-briefing, research)
└── docs/           # GitHub-Pages-Dokumentation, Lernpfad, Ressourcen
```

## 🛠️ Technologie-Stack

### Kernframeworks
- **LangChain** (>=1.3.13) - Orchestrierung, Chains, Agents, RAG
- **LangGraph** (>=1.2.4) - Zustandsbasierte Multi-Agent-Workflows, State Machines
- **LangSmith** (>=0.8.0) - Tracing, Debugging, Evaluations
- **OpenAI API** (>=1.0.0) - gpt-5.4-nano, gpt-5.4-mini, gpt-5.4, Embeddings

### Spezialisierte Tools
- **ChromaDB** (>=1.0.0) - Vektordatenbank für RAG-Systeme
- **DeepAgents** (optional, >=0.6.12) - Harness für Planning, Filesystem und Sub-Agenten in M34-M37
- **MCP / langchain-mcp-adapters** - lokale und Hugging-Face-basierte Tool-Server in M31-M32
- **genai_lib** (eigene Module in `04_modul/genai_lib/`) - Projektspezifische Utilities
  - `utilities.py` - `mprint()`, `mermaid()`, `setup_api_keys()`, `check_environment()`, `show_trace()`
  - `model_config.py` - Rollenbasierte Modell-Konstanten (`BASELINE`, `ROUTER`, `JUDGE`, `WORKER`, ...)


## 📚 Kursmodule

### Block 1: Agenten-Grundlagen (M01–M03)
| Modul | Thema                             | Beschreibung                                                    |
| ----- | --------------------------------- | --------------------------------------------------------------- |
| M01   | Kurs-Intro & Was sind KI-Agenten? | Setup, Agent-Definition, ReAct/TAO-Prinzip, Agent-Typen         |
| M02   | Tool Use & Function Calling       | @tool Decorator, Research-Tools bauen                           |
| M03   | Erste Agenten mit LangChain       | create_agent(), Deprecated Patterns (EINMALIG)                  |

### Block 2: Strukturierte Agenten (M04–M07)
| Modul | Thema                             | Beschreibung                                                    |
| ----- | --------------------------------- | --------------------------------------------------------------- |
| M04   | Prompt Engineering                | ChatPromptTemplate, System/Human Messages                       |
| M05   | Structured Output                 | Pydantic, with_structured_output(), Paper-Signale               |
| M06   | Multi-Tool Agents                 | Agent mit 3-4 Tools, Error Handling, Debugging                  |
| M07   | LCEL Chains (Brücke → LangGraph)  | Pipe-Operator, Runnable Interface, Wann reicht LCEL nicht mehr? |

### Block 3: Kontrollierte Workflows (M08–M11)
| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| M08 | Warum LangGraph? | Limitierungen von create_agent(), State Machines |
| M09 | StateGraph Basics | State, Nodes, Edges, compile() |
| M10 | Conditional Routing & Qualitäts-Gate | Routing-Funktionen, Security-Basics integriert |
| M11 | Tool-Loop | Tool-Loop, Tool-Steuerung im Graph |

### Block 4: Wissensbasierte Agenten (M12–M16)
| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| M12 | RAG-Konzepte & Embeddings | RAG-Architektur, Vektoren, Token-Limits |
| M13 | ChromaDB & Indexing | Chunking, Embedding, Vektordatenbank |
| M14 | RAG-Chain mit LangChain | Retriever, Similarity Search, LCEL-Chain |
| M15 | RAG-Agent | RAG als Tool, Agent entscheidet wann RAG |
| M16 | LangSmith Evaluations Basics | Eval-Dataset, Quellen-Treffer, Out-of-Corpus-Checks |

### Block 5: Kontrollierte Zusammenarbeit (M17–M22)

| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| M17 | Checkpointing & Sessions | MemorySaver, Thread-ID, State |
| M18 | Human-in-the-Loop | interrupt(), Review und Freigabe vor finaler Research-Antwort |
| M19 | Memory-Systeme | Konversationsspeicher, Semantic Memory, Per-User Memory |
| M20 | Multi-Agent Patterns | Supervisor, Hierarchical, Collaborative |
| M21 | Supervisor Pattern | Worker-Agents, Supervisor-Logik, Graph |
| M22 | Hierarchical Agent Teams | Team-Lead Patterns, 3-Ebenen-Hierarchie, Tool-Delegation |

### Block 6: Qualität und Betriebsvorbereitung (M23–M26)

| Modul | Thema                                 | Priorität    | Status |
| ----- | ------------------------------------- | ------------ | ------ |
| M23   | Agentic RAG                           | 🟡 Empfohlen | ✅      |
| M24   | Agent Security & Best Practices       | 🟡 Empfohlen | ✅      |
| M25   | Agent Evaluation & Testing            | 🟡 Empfohlen | ✅      |
| M26   | Model Routing & Cost Control          | 🟡 Empfohlen | ✅      |

### Block 7: Integration und Produktion (M27–M40)

| Modul | Thema                                 | Priorität    | Status |
| ----- | ------------------------------------- | ------------ | ------ |
| M27   | Integration Pipeline                  | 🔵 Optional  | ✅      |
| M28   | Projekt-Templates & MVP               | 🔵 Optional  | ✅      |
| M29   | Advanced RAG – Pipeline-Patterns      | 🔵 Optional  | ✅      |
| M30   | Gradio UI für Agenten                 | 🔵 Optional  | ✅      |
| M31   | MCP Local                             | 🔵 Optional  | ✅      |
| M32   | MCP HuggingFace                       | 🔵 Optional  | ✅      |
| M33   | Agent Skill – Compliance              | 🔵 Optional  | ✅      |
| M34   | DeepAgents: Autonomes Harness-Pattern | 🔵 Optional  | ✅      |
| M35   | DeepAgents: Parameter, Sandbox & Einordnung | 🔵 Optional  | ✅      |
| M36   | DeepAgents Skill: Meeting-Briefing    | 🔵 Optional  | ✅      |
| M37   | DeepAgent Multi-Skill                 | 🔵 Optional  | ✅      |
| M38   | Production Deployment                 | 🔵 Optional  | ✅      |
| M39   | Production: API & Monitoring          | 🔵 Optional  | ✅      |
| M40   | Capstone                              | 🔵 Optional  | ✅      |

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

Am Ende steht ein eigener **Meeting- & Research-Briefing-Agent** als Capstone-Variante. Der Bauplan bleibt gleich, der Korpus oder die Persona kann variieren:

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

**Letzte Aktualisierung:** Juli 2026     
**Version:** 5.4     
