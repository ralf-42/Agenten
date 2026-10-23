# Agent-Systeme mit LangChain, LangGraph & LangSmith

<table>
  <tr>
    <td><a href="./.claude/config/langchain-patterns.yaml"><img src="https://img.shields.io/badge/LangChain-%3E%3D1.4.6-brightgreen" alt="LangChain &gt;=1.4.6"></a></td>
    <td><a href="./04_modul/requirements.txt"><img src="https://img.shields.io/badge/LangGraph-%3E%3D1.2.16-brightgreen" alt="LangGraph &gt;=1.2.16"></a></td>
    <td><a href="https://smith.langchain.com"><img src="https://img.shields.io/badge/LangSmith-%3E%3D0.14.11-blue" alt="LangSmith &gt;=0.14.11"></a></td>
    <td><a href="./docs/06-multi-agent-erweiterungen/einsteiger-deepagents.md"><img src="https://img.shields.io/badge/DeepAgents_optional-%3E%3D0.7.29-brightgreen" alt="DeepAgents optional &gt;=0.7.29"></a></td>
    <td><a href="../_docs/LangChain_Audit_Report_2026-10-21.md"><img src="https://img.shields.io/badge/Last%20Audit-2026--10-blue" alt="Last Audit 2026-10"></a></td>
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
└── docs/           # GitHub-Pages-Dokumentation, Lernpfad, Ressourcen
```

## 🛠️ Technologie-Stack

### Kernframeworks
- **LangChain** (>=1.4.6) - Orchestrierung, Chains, Agents, RAG
- **LangGraph** (>=1.2.16) - Zustandsbasierte Multi-Agent-Workflows, State Machines
- **LangSmith** (>=0.14.11) - Tracing, Debugging, Evaluations
- **OpenAI API** (>=1.0.0) - gpt-5.6-luna, gpt-5.4-mini, gpt-5.4, gpt-5.6-terra, gpt-5.6-sol, Embeddings

### Spezialisierte Tools
- **ChromaDB** (>=1.0.0) - Vektordatenbank für RAG-Systeme
- **DeepAgents** (optional, >=0.7.29) - Harness für Planning, Filesystem und Sub-Agenten in DeepAgents Harness bis DeepAgent Multi-Skill
- **MCP / langchain-mcp-adapters** - lokale Tool-Server in MCP Local
- **genai_lib** (eigene Module in `04_modul/genai_lib/`) - Projektspezifische Utilities
  - `utilities.py` - `mprint()`, `mermaid()`, `setup_api_keys()`, `check_environment()`, `show_trace()`
  - `model_config.py` - Rollenbasierte Modell-Konstanten (`BASELINE`, `ROUTER`, `WORKER`, `CODING`, `JUDGE`, `PLANNER`, `WORKER_PREMIUM`, `FRONTIER`, `EMBEDDINGS`, ...)


## 📚 Kursmodule

### Block 1: Agenten-Grundlagen
| Modul | Thema                             | Beschreibung                                                    |
| ----- | --------------------------------- | --------------------------------------------------------------- |
| KI-Agenten und Tool Use   | Kurs-Intro, Was sind KI-Agenten? & Tool Use | Setup, Agent-Definition, ReAct/TAO-Prinzip, Agent-Typen, @tool Decorator, Research-Tools bauen |
| LangChain Erste Agenten   | Erste Agenten mit LangChain       | create_agent(), Deprecated Patterns (EINMALIG)                  |

### Block 2: Strukturierte Agenten
| Modul | Thema                             | Beschreibung                                                    |
| ----- | --------------------------------- | --------------------------------------------------------------- |
| Prompt Engineering für Agenten   | Prompt Engineering                | ChatPromptTemplate, System/Human Messages                       |
| Structured Output   | Structured Output                 | Pydantic, with_structured_output(), Paper-Signale               |
| Multi-Tool-Agents   | Multi-Tool Agents                 | Agent mit 3-4 Tools, Error Handling, Debugging                  |
| LCEL Chains   | LCEL Chains (Brücke → LangGraph)  | Pipe-Operator, Runnable Interface, Wann reicht LCEL nicht mehr? |

### Block 3: Kontrollierte Workflows
| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| Warum LangGraph | Warum LangGraph? | Limitierungen von create_agent(), State Machines |
| StateGraph Basics | StateGraph Basics | State, Nodes, Edges, compile() |
| Conditional Routing | Conditional Routing & Qualitäts-Gate | Routing-Funktionen, Security-Basics integriert |
| Tool Loop | Tool-Loop | Tool-Loop, Tool-Steuerung im Graph |

### Block 4: Wissensbasierte Agenten
| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| RAG Grundlagen | RAG-Konzepte, ChromaDB & RAG-Chain | RAG-Architektur, Vektoren, Token-Limits, Chunking, Embedding, Vektordatenbank, Retriever, LCEL-Chain |
| RAG-Agent | RAG-Agent | RAG als Tool, Agent entscheidet wann RAG |
| LangSmith Evaluations Basics | LangSmith Evaluations Basics | Eval-Dataset, Quellen-Treffer, Out-of-Corpus-Checks |

### Block 5: Kontrollierte Zusammenarbeit

| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| Sessions, Checkpointing und Memory | Sessions, Checkpointing & Memory | Thread-ID, State, InMemorySaver/SQLite, Kurzzeit-, semantisches und Per-User-Memory |
| Human in the Loop | Human-in-the-Loop | interrupt(), Review und Freigabe vor finaler Research-Antwort |
| Multi-Agent Patterns | Multi-Agent Patterns | Supervisor, Hierarchical, Collaborative |
| Supervisor Pattern | Supervisor Pattern | Worker-Agents, Supervisor-Logik, Graph |
| Reflection, Parallel, Hierarchy | Hierarchical Agent Teams | Team-Lead Patterns, 3-Ebenen-Hierarchie, Tool-Delegation |

Sessions, Checkpointing und Memory vereint die früheren Notebooks Checkpointing & Sessions und Memory-Systeme. Die alten Notebooks liegen in `01_notebook/_backups/`.

### Block 6: Qualität und Betriebsvorbereitung

| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| Agentic RAG | Agentic RAG | Retrieval-Budget, Grounding und Out-of-Corpus-Stopp |
| Agent Security Best Practices | Agent Security & Best Practices | Prompt Injection, Tool-Gating, Audit-Log und PII-Redaktion |
| Agent Evaluation und Testing | Agent Evaluation & Testing | Reproduzierbare Evaluation, Regression und RAGAS-Live-Lauf |
| Model Routing und Cost Control | Model Routing & Cost Control | Fallback, Circuit Breaker, Token-/Kostenkontrolle und Budget Gate |

### Block 7: Integration und Produktion

| Modul | Thema | Beschreibung |
|-------|-------|-------------|
| Optionales Integrationsbeispiel | `01_notebook/Integration_Pipeline_optional.ipynb` | PMO-Assistentensystem als End-to-End-Pipeline |
| Advanced RAG Pipeline Patterns | Advanced RAG – Pipeline-Patterns | Self-RAG, Reranking, Multi-Vector und CRAG |
| Gradio UI für Agenten | Gradio UI für Agenten | ChatInterface, Blocks, Streaming und HITL-UI |
| MCP Local | MCP Local | Lokale MCP-Server und standardisierte Tool-Integration |
| Agent Skill Compliance | Agent Skill – Compliance | SKILL.md-Struktur, Guardrails und Mixed-Model-Pattern |
| DeepAgents Harness | DeepAgents: Autonomes Harness-Pattern | Planning, Tools und Sub-Agent Spawning |
| DeepAgents Vertiefung | DeepAgents: Parameter, Sandbox & Einordnung | Weitere Parameter, Sandbox-Backends und Vergleich zu LangGraph |
| DeepAgents Skill PMO-Assistent | DeepAgents Skill: PMO-Briefing | PMO-Briefing als Skill für den PMO-Assistenten |
| DeepAgent Multi-Skill | DeepAgent Multi-Skill | Native Skills-API, Progressive Disclosure und Multi-Skill-Routing |
| Production Deployment | Production Deployment | Notebook zu Production, zentrale Modell-Konfiguration und Docker |

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
