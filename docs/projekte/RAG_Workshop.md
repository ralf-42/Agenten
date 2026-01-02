---
layout: default
title: RAG Workshop
parent: Projekte
nav_order: 1
description: "Schrittweise Workshop: Tech-Doku Assistent - vom einfachen Chatbot zur RAG-basierten Anwendung mit UI"
has_toc: true
---

# RAG Workshop
{: .no_toc }

> **Tech-Doku Assistent bauen**
> Schrittweise Entwicklung vom einfachen Chatbot zur intelligenten RAG-Anwendung mit UI (Module M04-M11)

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Projektübersicht

In dieser Übungsaufgabe bauen Sie schrittweise einen **Tech-Doku Assistenten**, der technische Fragen beantwortet und dabei immer intelligenter wird.

**Lernziele:**
- Aufbau einer GenAI-Anwendung von Grund auf
- Schrittweise Integration von LangChain-Features
- Praktische Anwendung der Module M04-M11
- Best Practices für strukturierten Notebook-Code

**Zeitaufwand:** ca. 4-6 Stunden (je nach Vorkenntnissen)

**Arbeitsumgebung:** Google Colab oder Jupyter Notebook

---

## Notebook-Struktur

Sie erstellen **ein Notebook** mit **7 aufbauenden Kapiteln** (oder 7 separate Notebooks):

```
📓 Tech_Doku_Assistent.ipynb
   ├── 🎯 Kapitel 1: Basis-Chatbot (M04)
   ├── 📊 Kapitel 2: Token-Optimierung (M05)
   ├── 💬 Kapitel 3: Chat-History & Memory (M06)
   ├── 🔧 Kapitel 4: Strukturierte Ausgaben (M07)
   ├── 📚 Kapitel 5: RAG-Integration (M08)
   ├── 🤖 Kapitel 6: Agent mit Tools (M10)
   └── 🌐 Kapitel 7: Gradio-UI (M11)
```

**Empfehlung:** Beginnen Sie mit einem Notebook und fügen Sie nach jedem Kapitel eine Markdown-Zelle mit "---" zur Trennung hinzu.

---

## Vorbereitung: Google Colab Setup

Bevor Sie starten, richten Sie Ihre Colab-Umgebung ein:

### API-Key in Colab Secrets speichern

1. Klicken Sie in Colab auf das Schlüssel-Symbol 🔑 (linke Sidebar)
2. Fügen Sie `OPENAI_API_KEY` hinzu
3. Aktivieren Sie "Notebook access"

### Basis-Pakete installieren

Führen Sie zu Beginn des Notebooks aus:

```python
# ═══════════════════════════════════════════════════
# 📦 INSTALLATION (Einmalig ausführen)
# ═══════════════════════════════════════════════════

!pip install -q langchain>=1.0.0 langchain-openai>=0.2.0 langchain-community
!pip install -q chromadb tiktoken gradio
```

### API-Key laden

```python
# ═══════════════════════════════════════════════════
# 🔑 API-KEY SETUP
# ═══════════════════════════════════════════════════

import os
from google.colab import userdata

# API-Key aus Colab Secrets laden
os.environ["OPENAI_API_KEY"] = userdata.get('OPENAI_API_KEY')
```

---

## Kapitel 1: Basis-Chatbot (Modul M04)

**Lernziel:** LangChain-Grundlagen, Prompt-Templates, einfache LLM-Interaktion

### Aufgabe 1.1: LLM initialisieren

```python
# ═══════════════════════════════════════════════════
# 🎯 KAPITEL 1: BASIS-CHATBOT (M04)
# ═══════════════════════════════════════════════════

from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# LLM initialisieren
llm = init_chat_model("openai:gpt-4o-mini", temperature=0.3)
...
```

### Aufgabe 1.2: Interaktive Chat-Schleife

```python
# Chat-Funktion für Notebook
def tech_chat():
    """Einfache Chat-Schleife für Jupyter/Colab"""
    print("🤖 Tech-Doku Assistent gestartet!")
    ...
```

**Erfolgskriterium:**
- ✅ Der Bot beantwortet technische Fragen korrekt
- ✅ Der Chat läuft in einer Schleife (bis "exit")
- ✅ LCEL-Syntax (`|`) wird verwendet

---

## Kapitel 2: Token-Optimierung (Modul M05)

**Lernziel:** Transformer-Konzepte verstehen, Token-Zählung, Kontext-Management

### Aufgabe 2.1: Token-Zählung implementieren

```python
# ═══════════════════════════════════════════════════
# 📊 KAPITEL 2: TOKEN-OPTIMIERUNG (M05)
# ═══════════════════════════════════════════════════

import tiktoken

# Token-Counter Funktion
def count_tokens(text: str, model: str = "gpt-4o-mini") -> int:
    """Zählt Tokens für ein gegebenes Modell"""
    encoding = tiktoken.encoding_for_model(model)
    ...
```

### Aufgabe 2.2: Chat mit Token-Tracking

```python
def tech_chat_mit_tokens():
    """Chat mit Token-Statistiken"""
    print("🤖 Tech-Doku Assistent (mit Token-Tracking)")
    print("   (Schreibe 'exit' zum Beenden)\n")
    ...
```

**Erfolgskriterium:**
- ✅ Token-Zählung funktioniert korrekt
- ✅ Statistiken werden nach jeder Frage angezeigt
- ✅ Warnung bei langen Antworten (>500 Tokens)
- ✅ Session-Gesamtstatistik am Ende

---

## Kapitel 3: Chat-History & Memory (Modul M06)

**Lernziel:** Konversationskontext verwalten, Chat-History nutzen

### Aufgabe 3.1: Memory implementieren

```python
# ═══════════════════════════════════════════════════
# 💬 KAPITEL 3: CHAT-HISTORY & MEMORY (M06)
# ═══════════════════════════════════════════════════

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# Memory-Store (speichert alle Sessions)
store = {}

def get_session_history(session_id: str) -> InMemoryChatMessageHistory:
    """Holt oder erstellt Chat-History für Session"""
    if session_id not in store:
        ...
```

### Aufgabe 3.2: Chat mit Kontext-Bewusstsein

```python
def tech_chat_mit_memory():
    """Chat mit Konversationsgedächtnis"""
    session_id = "user_session_1"
    print("🤖 Tech-Doku Assistent (mit Memory)")
    ...
```

**Erfolgskriterium:**
- ✅ Bot erinnert sich an vorherige Fragen
- ✅ Antworten beziehen sich auf Kontext
- ✅ 'reset' Befehl löscht History
- ✅ History-Länge wird angezeigt

---

## Kapitel 4: Strukturierte Ausgaben (Modul M07)

**Lernziel:** Pydantic-Modelle, `with_structured_output()`, JSON-Schema

### Aufgabe 4.1: Pydantic-Modell definieren

```python
# ═══════════════════════════════════════════════════
# 🔧 KAPITEL 4: STRUKTURIERTE AUSGABEN (M07)
# ═══════════════════════════════════════════════════

from pydantic import BaseModel, Field
from typing import Literal

class FAQEntry(BaseModel):
    """Strukturierte FAQ-Eingabe"""
    frage: str = Field(description="Die ursprüngliche Frage")
    antwort: str = Field(description="Die Antwort (max 200 Zeichen)")
    ...
```

### Aufgabe 4.2: FAQ-Datenbank aufbauen

```python
import json

def create_faq_database():
    """Interaktive FAQ-Erstellung"""
    faq_list = []
    print("🔧 FAQ-Generator")
    ...
```

**Erfolgskriterium:**
- ✅ Strukturierte JSON-Ausgabe
- ✅ Schema-Validierung funktioniert
- ✅ Alle Felder korrekt befüllt
- ✅ Export in JSON-Datei

---

## Kapitel 5: RAG-Integration (Modul M08)

**Lernziel:** Retrieval-Augmented Generation, Vektordatenbank, Embeddings

### Aufgabe 5.1: Dokumente hochladen (Colab File Upload)

```python
# ═══════════════════════════════════════════════════
# 📚 KAPITEL 5: RAG-INTEGRATION (M08)
# ═══════════════════════════════════════════════════

from google.colab import files
import os

# Verzeichnis für Dokumente erstellen
os.makedirs('docs', exist_ok=True)
...
```

### Aufgabe 5.2: Vektordatenbank erstellen

```python
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

# Dokumente laden
loader = DirectoryLoader('docs/', glob="**/*.md", loader_cls=TextLoader)
documents = loader.load()
...
```

### Aufgabe 5.3: RAG-Chain implementieren

```python
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# Hilfsfunktion: Dokumente formatieren
def format_docs(docs):
    """Formatiert Retrieved Docs für Prompt"""
    return "\n\n".join([f"Quelle: {doc.metadata.get('source', 'Unbekannt')}\n{doc.page_content}" for doc in docs])
...
```

### Aufgabe 5.4: RAG-Chat mit Quellenangaben

```python
def rag_chat():
    """RAG-Chat mit Quellenangaben"""
    print("🤖 Tech-Doku Assistent (RAG-Modus)")
    print("   (Schreibe 'exit' zum Beenden)\n")
    ...
```

**Erfolgskriterium:**
- ✅ Dokumente werden hochgeladen und indiziert
- ✅ Retrieval findet relevante Chunks
- ✅ Antworten basieren auf Dokumenten
- ✅ Quellenangaben werden angezeigt

---

## Kapitel 6: Agent mit Tools (Modul M10)

**Lernziel:** LangChain Agents, Tool-Definition, Function Calling

### Aufgabe 6.1: Tools definieren

```python
# ═══════════════════════════════════════════════════
# 🤖 KAPITEL 6: AGENT MIT TOOLS (M10)
# ═══════════════════════════════════════════════════

from langchain_core.tools import tool
import ast

@tool
def search_documentation(query: str) -> str:
    """Durchsucht die technische Dokumentation nach relevanten Informationen."""
    # Nutze Retriever aus Kapitel 5
    docs = retriever.get_relevant_documents(query)
    ...

@tool
def calculate_token_cost(text: str, model: str = "gpt-4o-mini") -> str:
    """Berechnet Token-Anzahl und geschätzte Kosten für einen Text."""
    # Token zählen
    tokens = count_tokens(text, model)
    ...

@tool
def validate_python_code(code: str) -> str:
    """Validiert Python-Code auf Syntax-Fehler."""
    try:
        ast.parse(code)
        ...
```

### Aufgabe 6.2: Agent erstellen

```python
from langchain.agents import create_agent

# Agent erstellen (benötigt gpt-4o oder gpt-4o-mini für Function Calling)
agent = create_agent(
    model="openai:gpt-4o-mini",  # Wichtig: Function Calling Support!
    tools=tools,
    ...
)
```

### Aufgabe 6.3: Agent-Chat

```python
def agent_chat():
    """Interactive Agent Chat"""
    print("🤖 Tech-Doku Assistent (Agent-Modus)")
    print("   Tools: 📚 Doku-Suche | 📊 Token-Rechner | ✅ Code-Validator")
    ...
```

**Erfolgskriterium:**
- ✅ Alle 3 Tools funktionieren einzeln
- ✅ Agent nutzt Tools korrekt
- ✅ Entscheidungslogik ist nachvollziehbar
- ✅ Debug-Modus zeigt Tool-Aufrufe

---

## Kapitel 7: Gradio-UI (Modul M11)

**Lernziel:** Web-Interface mit Gradio, State-Management, Event-Handling

### Aufgabe 7.1: Basis-UI erstellen

```python
# ═══════════════════════════════════════════════════
# 🌐 KAPITEL 7: GRADIO-UI (M11)
# ═══════════════════════════════════════════════════

import gradio as gr

# Chat-Handler-Funktionen
def chat_handler(message, history):
    """Verarbeitet normale Chat-Anfragen"""
    antwort = chain.invoke({"frage": message})
    ...

def rag_handler(message, history):
    """Verarbeitet RAG-basierte Anfragen"""
    antwort = rag_chain.invoke(message)
    ...

def agent_handler(message, history):
    """Verarbeitet Agent-Anfragen"""
    response = agent.invoke({
        "messages": [{"role": "user", "content": message}]
    })
    ...
```

### Aufgabe 7.2: Gradio-App implementieren

```python
# Gradio Interface
with gr.Blocks(title="Tech-Doku Assistent") as demo:
    gr.Markdown("# 🤖 Tech-Doku Assistent")
    gr.Markdown("*Powered by LangChain & OpenAI*")
    ...
```

**Colab-spezifische Hinweise:**
- `share=True` erstellt einen öffentlichen Link (für 72h gültig)
- Der Link kann mit anderen geteilt werden
- Gradio läuft direkt in Colab ohne separaten Server

**Erfolgskriterium:**
- ✅ UI läuft in Colab mit öffentlichem Link
- ✅ Alle 3 Tabs funktionieren
- ✅ Token-Tracking wird live aktualisiert
- ✅ "Chat löschen" Button funktioniert

---

## Bonusaufgaben (Optional)

### Bonus 1: Persistenz
- Speichern Sie Chat-History in JSON
- Laden Sie vorherige Sessions beim Start
- Implementieren Sie Session-Management

### Bonus 2: Erweiterte RAG-Features
- Hybrid-Search (Keyword + Semantic)
- Re-Ranking der Retrieval-Ergebnisse
- Chunk-Overlap-Visualisierung

### Bonus 3: Multi-Agenten-System mit LangGraph
- Spezialisierte Agents (Docker-Expert, Kubernetes-Expert)
- Supervisor-Agent zur Koordination
- State Machine für komplexe Workflows

### Bonus 4: Notebook dokumentieren
- Erstellen Sie ein Inhaltsverzeichnis mit Markdown-Zellen
- Fügen Sie Emoji-Header für jedes Kapitel hinzu
- Dokumentieren Sie Lernziele und Erfolgskriterien

---

## Bewertungskriterien

| Phase | Punkte | Kriterien |
|-------|--------|-----------|
| 1: Basis-Chatbot | 10 | Funktionalität, Code-Qualität, LCEL-Nutzung |
| 2: Token-Optimierung | 10 | Korrekte Zählung, Statistiken, Warnungen |
| 3: Chat-Memory | 15 | Context-Awareness, Memory-Management |
| 4: Strukturierte Ausgaben | 15 | Pydantic-Modelle, Validierung |
| 5: RAG-Integration | 20 | Retrieval-Qualität, Quellenangaben |
| 6: Agent mit Tools | 20 | Tool-Implementation, Agent-Logik |
| 7: Gradio-UI | 10 | Usability, Features, Design |
| **Gesamt** | **100** | |

**Bestanden:** ≥ 60 Punkte

---

## Hilfreiche Ressourcen

**LangChain Dokumentation:**
- [init_chat_model()](https://python.langchain.com/docs/concepts/chat_models/)
- [RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/)
- [Agents](https://python.langchain.com/docs/concepts/agents/)

**Code-Vorlagen:**
- [LangChain 1.0 Must-Haves](/GenAI/LangChain_1.0_Must_Haves.html)
- [Notebook Template Guide](/GenAI/Notebook_Template_Guide.html)

**Projekt-Beispiele:**
- `01_notebook/M04_LangChain101.ipynb`
- `01_notebook/M08_RAG_LangChain.ipynb`
- `01_notebook/M10_Agenten_LangChain.ipynb`

---

## Abgabe

**Format:**
- **Jupyter Notebook** (`Tech_Doku_Assistent.ipynb`)
  - Mit allen 7 Kapiteln ausführbar
  - Saubere Markdown-Strukturierung
  - Code-Zellen mit Kommentaren
- **Dokumentations-Dateien** (3-5 .md Dateien für RAG)
- **README.md** mit:
  - Kurzbeschreibung des Projekts
  - Setup-Anleitung (API-Keys, Colab-Link)
  - Screenshot des Gradio-UI
- Optional: **Demo-Video** (max. 5 Min.) oder **Colab-Link**

**Deadline:** [Wird vom Dozenten festgelegt]

**Einreichung:**
- Als **Colab-Link** (öffentlich freigegeben)
- ODER als **ZIP-Archiv** mit .ipynb + docs/
- ODER als **Git-Repository-Link**

### Checkliste vor Abgabe
- [ ] Notebook läuft von oben bis unten fehlerfrei durch
- [ ] Alle API-Keys sind über Colab Secrets eingebunden (nicht hardcodiert!)
- [ ] Alle 7 Kapitel sind implementiert
- [ ] Mindestens 3 Markdown-Dateien für RAG vorhanden
- [ ] Gradio-UI läuft und erstellt share-Link
- [ ] Erfolgskriterien aus allen Kapiteln erfüllt
- [ ] README.md erklärt das Projekt

---

## FAQ

**Q: Muss ich alle Kapitel implementieren?**
A: Kapitel 1-5 sind Pflicht (70 Punkte). Kapitel 6-7 sind optional für Bonuspunkte (30 Punkte).

**Q: Kann ich separate Notebooks erstellen statt einem großen?**
A: Ja! Sie können 7 separate Notebooks erstellen (z.B. `Kapitel_1_Chat.ipynb` bis `Kapitel_7_Gradio.ipynb`). Achten Sie dann darauf, dass Kapitel 6-7 auf vorherige Kapitelergebnisse zugreifen können.

**Q: Welches LLM-Modell soll ich verwenden?**
A: `gpt-4o-mini` ist ausreichend und kosteneffizient. Für Kapitel 6 (Agent) funktioniert `gpt-4o-mini` ebenfalls, da es Function Calling unterstützt.

**Q: Kann ich andere Vektordatenbanken nutzen?**
A: Ja, FAISS ist in Colab sogar etwas schneller als ChromaDB. Qdrant ist ebenfalls möglich.

**Q: Wo bekomme ich Markdown-Dateien für RAG?**
A: Optionen:
  - Erstellen Sie eigene .md Dateien mit technischen Infos
  - Laden Sie offizielle Docs herunter (z.B. Docker, Kubernetes)
  - Nutzen Sie `markitdown` für PDF→Markdown Konvertierung
  - Kopieren Sie Wikipedia-Artikel als Markdown

**Q: Mein Colab-Notebook stürzt beim Gradio-Launch ab**
A: Häufigste Ursachen:
  - RAM-Limit erreicht → Runtime → Factory reset runtime
  - Firewall blockiert share-Link → Versuchen Sie `share=False` für lokalen Zugriff
  - Alte Gradio-Version → `!pip install --upgrade gradio`

**Q: Kann ich die Übung auch lokal (ohne Colab) machen?**
A: Ja! Verwenden Sie dann Jupyter Notebook/Lab lokal und ersetzen Sie:
  - `from google.colab import userdata` → `from dotenv import load_dotenv`
  - `files.upload()` → Lokale File-Pfade
  - `share=True` → Optional für Gradio

---

**Version:** 1.2 (Ohne Lösungen - nur Aufgabenstellung)
**Letzte Aktualisierung:** Januar 2026
**Kurs:** Generative KI. Verstehen. Anwenden. Gestalten.
**Module:** M04, M05, M06, M07, M08, M10, M11
**Arbeitsumgebung:** Google Colab oder Jupyter Notebook
