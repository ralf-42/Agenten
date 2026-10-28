# Agent-Systeme mit LangChain, LangGraph & LangSmith

<table>
  <tr>
    <td><a href="./04_modul/requirements.txt"><img src="https://img.shields.io/badge/LangGraph-%3E%3D1.2.16-brightgreen" alt="LangGraph &gt;=1.2.16"></a></td>
    <td><a href="https://smith.langchain.com"><img src="https://img.shields.io/badge/LangSmith-%3E%3D0.14.11-blue" alt="LangSmith &gt;=0.14.11"></a></td>
    <td><a href="./docs/05-frameworks/einsteiger-deepagents.md"><img src="https://img.shields.io/badge/DeepAgents_optional-%3E%3D0.7.29-brightgreen" alt="DeepAgents optional &gt;=0.7.29"></a></td>
    <td><a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License MIT"></a></td>
  </tr>
</table>

Ein deutschsprachiger, praxisorientierter Kurs zu **Agenten-Systemen** mit Fokus auf LangChain, LangGraph, LangSmith und agentenbasierte KI-Architekturen.

**Leitprofil:** Vom KI-Feature zum kontrollierten Arbeitssystem — Tools, State, Entscheidungen, Freigabe und Evaluation. Der Kurs baut auf GenAI-Grundlagen auf, geht aber über einzelne KI-Features hinaus: Es entsteht ein System, das **plant** (Routing, State, Tool-Auswahl, Supervisor), **handelt** (Tool-Use, RAG als Evidence Tool, Workflows) und **geprüft wird** (Human-in-the-Loop, Security, Evaluation).

Der durchgehende Anwendungsfall ist ein **PMO-Assistent**: Eine fiktive Projektleiterin, Mara Vogt, baut schrittweise ein kontrolliertes Agentensystem, das einen Projektkorpus aus Protokollen, Entscheidungen, Risiken und Aufgaben semantisch durchsucht, Antworten mit Quellen belegt, Unsicherheit sichtbar macht und kritische Ausgaben per Human-in-the-Loop freigibt. Tool Use, Structured Output, RAG als Evidence Tool, Evaluation und Multi-Agent-Patterns werden dadurch nicht als Einzeltechniken, sondern als Bausteine desselben kontrollierten Arbeitssystems erarbeitet.

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
├── 01_notebook/    # Jupyter Notebooks (KI-Agenten und Tool Use bis Production Deployment)
├── 02_daten/       # Datasets (Text, Bild, Audio, Video)
├── 03_skript/      # Kursfolien & Intro-Präsentation
├── 04_modul/       # Python-Module (genai_lib)
├── 05_prompt/      # Prompt-Templates (Markdown-Format)
├── 06_skill/       # Agent Skills (compliance, pmo-briefing, research)
├── 07_image/       # Bilder und Visualisierungen
└── docs/           # GitHub-Pages-Dokumentation, Lernpfad, Ressourcen
```

## 🛠️ Technologie-Stack

### Kernframeworks
- **LangChain** (>=1.4.6) - Orchestrierung, Chains, Agents, RAG
- **LangGraph** (>=1.2.16) - Zustandsbasierte Multi-Agent-Workflows, State Machines
- **LangSmith** (>=0.14.11) - Tracing, Debugging, Evaluations
- **OpenAI API** (>=2.0.0) - GPT-6 Luna, GPT-6.1 Terra, GPT-6.1 Sol, GPT-6 Astra, Embeddings

### Spezialisierte Tools
- **ChromaDB** (>=1.0.0) - Vektordatenbank für RAG-Systeme
- **DeepAgents** (optional, >=0.7.29) - Harness für Planning, Filesystem und Sub-Agenten in DeepAgents Harness bis DeepAgent Multi-Skill
- **MCP / langchain-mcp-adapters** - lokale Tool-Server in MCP Local
- **genai_lib** (eigene Module in `04_modul/genai_lib/`) - Projektspezifische Utilities
  - `utilities.py` - `mprint()`, `mermaid()`, `setup_api_keys()`, `check_environment()`, `show_trace()`
  - `model_config.py` - Rollenbasierte Modell-Konstanten (`BASELINE`, `ROUTER`, `WORKER`, `CODING`, `JUDGE`, `PLANNER`, `WORKER_PREMIUM`, `FRONTIER`, `EMBEDDINGS`, `IMAGE_GENERATION`, `TRANSCRIPTION`, `TRANSCRIPTION_SEGMENTS`)

### Modell-Auswahl

Die Modellwahl richtet sich nach der Rolle im Workflow. Die Tabelle dient als Orientierung; maßgeblich ist die Konfiguration in [`model_config.py`](./04_modul/genai_lib/model_config.py).

| Rolle (Konstante in `model_config.py`) | Modell | Einsatz |
|-------|----------------|---------|
| Baseline / Demo (`BASELINE`) | `gpt-6-luna` | kein `temperature`; Konzept vor Ausgabequalität |
| Router (`ROUTER`) | `gpt-6-luna` | einfache Routing-Entscheidungen |
| Worker / Synthese (`WORKER`) | `gpt-6.1-terra` | RAG-Synthese, strukturierte Ausgaben; `reasoning.effort` low–medium |
| Coding-Worker (`CODING`) | `gpt-6.1-terra` | begrenzte Code-Generierung und Refactorings |
| Judge / starker Reasoner (`JUDGE`) | `gpt-6.1-sol` | Supervisor, Security, Evaluation; `reasoning.effort` high–xhigh |
| Planner (`PLANNER`) | `gpt-6.1-sol` | Aufgabenzerlegung, Schritt-Planung, Agentic RAG |
| Worker Premium (`WORKER_PREMIUM`) | `gpt-6.1-sol` | komplexe RAG, finale Reports |
| Frontier (`FRONTIER`) | `gpt-6-astra` | maximale Qualität für besonders schwierige Aufgaben |
| Embeddings (`EMBEDDINGS`) | `text-embedding-3-small` | RAG, ChromaDB, Vektorindizes |
| Bildgenerierung (`IMAGE_GENERATION`) | `gpt-image-2` | direkte OpenAI Images API, ohne Provider-Präfix |
| Transkription (`TRANSCRIPTION`) | `gpt-transcribe` | Datei-Audiotranskription |
| Transkription mit Segmenten (`TRANSCRIPTION_SEGMENTS`) | `whisper-1` | Legacy: Zeitstempel/Segmente; Ablösung bis 26.02.2027 erforderlich |

GPT-6-Modelle mit Tool-Aufrufen werden mit `langchain-openai` ab Version 1.7.2 über die Responses API geroutet. Bei einer eigenen `ChatOpenAI`-Konfiguration kann `use_responses_api=True` explizit gesetzt werden. `whisper-1` wird am 26. Februar 2027 abgeschaltet; die Segment-Zeitstempel benötigen eine gesonderte Migration.


## 📚 Kursmodule

### Kursweg und Verbindlichkeit

Der Kurs unterscheidet die Notebook-Stufe vom Anspruch einzelner Aufgaben. In den Kern-Notebooks sind die Grundlagenaufgaben das gemeinsame Mindestziel. Aufbau- und Vertiefungsaufgaben sind Wahlangebote; ab Tag 3 wird nach Checkpoints differenziert. Die vollständige Bearbeitung aller Notebook-Zellen ist keine Voraussetzung für die gemeinsamen Kursziele.

| Stufe | Modul-IDs | Einsatz |
| --- | --- | --- |
| **Grundlagen / Kern** | M01–M18 | Gemeinsame Mindestlernziele für alle Teilnehmenden. |
| **Aufbau** | M19–M23 | Optionale Erweiterungen im Kurs, wenn die Grundlagenziele erreicht sind und Zeit bleibt. |
| **Vertiefung** | M24–M26 und M50–M54 | Optionale Impulse, Wahlaufgaben oder Nachbereitung. M50 ist der Einstieg in das Vertiefungsthema DeepAgents. |

Die Modul-IDs verweisen auf die Notebook-Dateien. Details stehen in der [Notebook-Übersicht](./01_notebook/README.md); Tagesablauf und optionale Module sind im [Kursplan](./docs/02-orientierung-entscheidung/kursueberblick.md) beschrieben.

### Block 1: Agenten-Grundlagen
| Nr. | Modul | Thema                             | Beschreibung                                                    |
| ---: | ----- | --------------------------------- | --------------------------------------------------------------- |
| 1 | KI-Agenten und Tool Use   | Kurs-Intro, Was sind KI-Agenten? & Tool Use | Setup, Agent-Definition, ReAct/TAO-Prinzip, Agent-Typen, @tool Decorator, Research-Tools bauen |
| 2 | LangChain Erste Agenten   | Erste Agenten mit LangChain       | create_agent(), Deprecated Patterns (EINMALIG)                  |

### Block 2: Strukturierte Agenten
| Nr. | Modul | Thema                             | Beschreibung                                                    |
| ---: | ----- | --------------------------------- | --------------------------------------------------------------- |
| 3 | Prompt Engineering für Agenten   | Prompt Engineering                | ChatPromptTemplate, System/Human Messages                       |
| 4 | Structured Output   | Structured Output                 | Pydantic, with_structured_output(), Paper-Signale               |
| 5 | Multi-Tool-Agents   | Multi-Tool Agents                 | Agent mit 3-4 Tools, Error Handling, Debugging                  |
| 6 | LCEL Chains   | LCEL Chains (Brücke → LangGraph)  | Pipe-Operator, Runnable Interface, Wann reicht LCEL nicht mehr? |

### Block 3: Kontrollierte Workflows
| Nr. | Modul | Thema | Beschreibung |
| ---: |-------|-------|-------------|
| 7 | Warum LangGraph | Warum LangGraph? | Limitierungen von create_agent(), State Machines |
| 8 | StateGraph Basics | StateGraph Basics | State, Nodes, Edges, compile() |
| 9 | Conditional Routing | Conditional Routing & Qualitäts-Gate | Routing-Funktionen, Security-Basics integriert |
| 10 | Tool Loop | Tool-Loop | Tool-Loop, Tool-Steuerung im Graph |

### Block 4: Wissensbasierte Agenten
| Nr. | Modul | Thema | Beschreibung |
| ---: |-------|-------|-------------|
| 11 | RAG Grundlagen | RAG-Konzepte, ChromaDB & RAG-Chain | RAG-Architektur, Vektoren, Token-Limits, Chunking, Embedding, Vektordatenbank, Retriever, LCEL-Chain |
| 12 | RAG-Agent | RAG-Agent | RAG als Tool, Agent entscheidet wann RAG |
| 13 | LangSmith Evaluations Basics | LangSmith Evaluations Basics | Eval-Dataset, Quellen-Treffer, Out-of-Corpus-Checks |

### Block 5: Kontrollierte Zusammenarbeit

| Nr. | Modul | Thema | Beschreibung |
| ---: |-------|-------|-------------|
| 14 | Sessions, Checkpointing und Memory | Sessions, Checkpointing & Memory | Thread-ID, State, InMemorySaver/SQLite, Kurzzeit-, semantisches und Per-User-Memory |
| 15 | Human in the Loop | Human-in-the-Loop | interrupt(), Review und Freigabe vor finaler Research-Antwort |
| 16 | Multi-Agent Patterns | Multi-Agent Patterns | Supervisor, Hierarchical, Collaborative |
| 17 | Supervisor Pattern | Supervisor Pattern | Worker-Agents, Supervisor-Logik, Graph |
| 18 | Reflection, Parallel, Hierarchy | Hierarchical Agent Teams | Team-Lead Patterns, 3-Ebenen-Hierarchie, Tool-Delegation |

Sessions, Checkpointing und Memory sind in einem gemeinsamen Notebook zusammengeführt.

### Block 6: Qualität und Betriebsvorbereitung

| Nr. | Modul | Thema | Beschreibung |
| ---: |-------|-------|-------------|
| 19 | Agentic RAG | Agentic RAG | Retrieval-Budget, Grounding und Out-of-Corpus-Stopp |
| 20 | Agent Security Best Practices | Agent Security & Best Practices | Prompt Injection, Tool-Gating, Audit-Log und PII-Redaktion |
| 21 | Agent Evaluation und Testing | Agent Evaluation & Testing | Reproduzierbare Evaluation, Regression und RAGAS-Live-Lauf |
| 22 | Model Routing und Cost Control | Model Routing & Cost Control | Fallback, Circuit Breaker, Token-/Kostenkontrolle und Budget Gate |

### Block 7: Integration und Produktion

| Nr. | Modul | Thema | Beschreibung |
| ---: |-------|-------|-------------|
| 23 | Advanced RAG Pipeline Patterns | Advanced RAG – Pipeline-Patterns | Self-RAG, Reranking, Multi-Vector und CRAG |
| 24 | Gradio UI für Agenten | Gradio UI für Agenten | ChatInterface, Blocks, Streaming und HITL-UI |
| 25 | MCP Local | MCP Local | Lokale MCP-Server und standardisierte Tool-Integration |
| 26 | Agent Skill Compliance | Agent Skill – Compliance | SKILL.md-Struktur, Guardrails und Mixed-Model-Pattern |
| 50 | DeepAgents Harness | DeepAgents: Autonomes Harness-Pattern | Planning, Tools und Sub-Agent Spawning |
| 51 | DeepAgents Vertiefung | DeepAgents: Parameter, Sandbox & Einordnung | Weitere Parameter, Sandbox-Backends und Vergleich zu LangGraph |
| 52 | DeepAgents Skill PMO-Assistent | DeepAgents Skill: PMO-Briefing | PMO-Briefing als Skill für den PMO-Assistenten |
| 53 | DeepAgent Multi-Skill | DeepAgent Multi-Skill | Native Skills-API, Progressive Disclosure und Multi-Skill-Routing |
| 54 | Production Deployment | Production Deployment | Notebook zu Production, zentrale Modell-Konfiguration und Docker |

## 🔑 Voraussetzungen

- Python 3.11+ (Klassen, Decorators, Type Hints sicher beherrschen)
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

Am Ende steht ein eigener **PMO-Assistent** als Capstone-Variante. Der Bauplan bleibt gleich, der Korpus oder die Persona kann variieren:

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

Die ausführliche Lizenzzuordnung für die Kurs-Website steht unter [Rechtliches → Lizenzen](./docs/11-rechtliches/lizenzen.md).

© 2025–2026 Ralf-42     

> [!NOTE]
> **Hinweis zur Entstehung:** Bei der Erstellung dieser Unterlagen wurden KI-Werkzeuge unterstützend eingesetzt, unter anderem für Recherche, Strukturierung, Formulierung und einzelne Medien. Die Inhalte wurden anschließend fachlich geprüft, eingeordnet und redaktionell überarbeitet.

---

**Stand:** Oktober 2026     
**Version:** 5.7     
