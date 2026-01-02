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

# Prompt-Template erstellen
prompt = ChatPromptTemplate.from_messages([
    ("system", """Du bist ein technischer Dokumentationsassistent.
    Beantworte Fragen präzise, höflich und technisch korrekt.
    Verwende Beispiele wo sinnvoll."""),
    ("user", "{frage}")
])

# Chain erstellen (LCEL-Syntax)
chain = prompt | llm | StrOutputParser()

# Test
antwort = chain.invoke({"frage": "Was ist ein API-Endpunkt?"})
print(antwort)
```

### Aufgabe 1.2: Interaktive Chat-Schleife

```python
# Chat-Funktion für Notebook
def tech_chat():
    """Einfache Chat-Schleife für Jupyter/Colab"""
    print("🤖 Tech-Doku Assistent gestartet!")
    print("   (Schreibe 'exit' zum Beenden)\n")

    while True:
        frage = input("💬 Sie: ")

        if frage.lower() in ['exit', 'quit', 'beenden']:
            print("👋 Auf Wiedersehen!")
            break

        if not frage.strip():
            continue

        antwort = chain.invoke({"frage": frage})
        print(f"\n🤖 Bot: {antwort}\n")

# Starten
tech_chat()
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
    return len(encoding.encode(text))

# Test
test_text = "Was ist Docker?"
tokens = count_tokens(test_text)
print(f"📊 '{test_text}' hat {tokens} Tokens")
```

### Aufgabe 2.2: Chat mit Token-Tracking

```python
def tech_chat_mit_tokens():
    """Chat mit Token-Statistiken"""
    print("🤖 Tech-Doku Assistent (mit Token-Tracking)")
    print("   (Schreibe 'exit' zum Beenden)\n")

    total_input_tokens = 0
    total_output_tokens = 0

    while True:
        frage = input("💬 Sie: ")

        if frage.lower() in ['exit', 'quit', 'beenden']:
            print(f"\n📊 Session-Statistik:")
            print(f"   Gesamt Input:  {total_input_tokens} Tokens")
            print(f"   Gesamt Output: {total_output_tokens} Tokens")
            print(f"   Total:         {total_input_tokens + total_output_tokens} Tokens")
            print("👋 Auf Wiedersehen!")
            break

        if not frage.strip():
            continue

        # Token-Zählung Input
        input_tokens = count_tokens(frage)

        # LLM-Anfrage
        antwort = chain.invoke({"frage": frage})

        # Token-Zählung Output
        output_tokens = count_tokens(antwort)

        # Statistik aktualisieren
        total_input_tokens += input_tokens
        total_output_tokens += output_tokens

        print(f"\n🤖 Bot: {antwort}\n")
        print(f"📊 Token-Statistik:")
        print(f"   Input:  {input_tokens:4d} Tokens")
        print(f"   Output: {output_tokens:4d} Tokens")
        print(f"   Total:  {input_tokens + output_tokens:4d} Tokens")

        # Warnung bei langen Antworten
        if output_tokens > 500:
            print("⚠️  Warnung: Sehr lange Antwort (>500 Tokens)")

        print()

# Starten
tech_chat_mit_tokens()
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
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

# Neues Prompt mit History
prompt_with_history = ChatPromptTemplate.from_messages([
    ("system", """Du bist ein technischer Dokumentationsassistent.
    Beantworte Fragen präzise und technisch korrekt.
    WICHTIG: Beziehe dich auf vorherige Fragen in der Konversation."""),
    MessagesPlaceholder(variable_name="history"),
    ("user", "{frage}")
])

# Chain mit Memory
chain_with_memory = prompt_with_history | llm | StrOutputParser()

# Runnable mit History
chat_with_history = RunnableWithMessageHistory(
    chain_with_memory,
    get_session_history,
    input_messages_key="frage",
    history_messages_key="history"
)
```

### Aufgabe 3.2: Chat mit Kontext-Bewusstsein

```python
def tech_chat_mit_memory():
    """Chat mit Konversationsgedächtnis"""
    session_id = "user_session_1"

    print("🤖 Tech-Doku Assistent (mit Memory)")
    print("   (Schreibe 'exit' zum Beenden, 'reset' für neue Session)\n")

    while True:
        frage = input("💬 Sie: ")

        if frage.lower() in ['exit', 'quit', 'beenden']:
            print("👋 Auf Wiedersehen!")
            break

        if frage.lower() == 'reset':
            store[session_id] = InMemoryChatMessageHistory()
            print("🔄 Chat-History wurde zurückgesetzt\n")
            continue

        if not frage.strip():
            continue

        # Invoke mit Session-Config
        config = {"configurable": {"session_id": session_id}}
        antwort = chat_with_history.invoke({"frage": frage}, config=config)

        print(f"\n🤖 Bot: {antwort}\n")

        # Zeige History-Länge
        history = store[session_id].messages
        print(f"💾 History: {len(history)//2} Austausche gespeichert\n")

# Starten
tech_chat_mit_memory()
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
    kategorie: Literal["Grundlagen", "Installation", "Konzepte", "Troubleshooting"] = \
        Field(description="Thematische Kategorie")
    schwierigkeit: int = Field(description="Schwierigkeitsgrad: 1=Anfänger, 5=Experte", ge=1, le=5)
    tags: list[str] = Field(description="3-5 relevante Schlagwörter")

# LLM mit strukturierter Ausgabe
structured_llm = llm.with_structured_output(FAQEntry)

# Test
test_frage = "Was ist Docker und wofür wird es verwendet?"
faq = structured_llm.invoke(f"Erstelle einen FAQ-Eintrag für: {test_frage}")

print("📋 FAQ-Eintrag:")
print(f"   Frage: {faq.frage}")
print(f"   Antwort: {faq.antwort}")
print(f"   Kategorie: {faq.kategorie}")
print(f"   Schwierigkeit: {faq.schwierigkeit}/5")
print(f"   Tags: {', '.join(faq.tags)}")
```

### Aufgabe 4.2: FAQ-Datenbank aufbauen

```python
import json

def create_faq_database():
    """Interaktive FAQ-Erstellung"""
    faq_list = []

    print("🔧 FAQ-Generator")
    print("   (Schreibe 'exit' zum Beenden und Exportieren)\n")

    while True:
        frage = input("💬 Frage: ")

        if frage.lower() in ['exit', 'quit', 'beenden']:
            break

        if not frage.strip():
            continue

        # FAQ-Eintrag generieren
        faq = structured_llm.invoke(f"Erstelle einen FAQ-Eintrag für: {frage}")

        print(f"\n✅ FAQ erstellt:")
        print(f"   Kategorie: {faq.kategorie}")
        print(f"   Schwierigkeit: {faq.schwierigkeit}/5")
        print(f"   Tags: {', '.join(faq.tags)}\n")

        faq_list.append(faq.model_dump())

    # Export als JSON
    if faq_list:
        with open('faq_database.json', 'w', encoding='utf-8') as f:
            json.dump(faq_list, f, ensure_ascii=False, indent=2)

        print(f"\n📁 {len(faq_list)} FAQ-Einträge exportiert nach 'faq_database.json'")

# Starten
create_faq_database()
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

# File Upload Widget
print("📁 Bitte laden Sie 3-5 Markdown-Dateien (.md) hoch")
print("   Beispiel: Docker-Doku, Kubernetes-Intro, REST-API-Guide\n")

uploaded = files.upload()

# Dateien speichern
for filename, content in uploaded.items():
    filepath = f'docs/{filename}'
    with open(filepath, 'wb') as f:
        f.write(content)
    print(f"✅ Gespeichert: {filepath}")

print(f"\n📊 {len(uploaded)} Dokumente hochgeladen")
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

print(f"📄 {len(documents)} Dokumente geladen")

# Text-Splitting
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
splits = text_splitter.split_documents(documents)

print(f"✂️  {len(splits)} Chunks erstellt")

# Embeddings & Vektordatenbank
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

print("✅ Vektordatenbank erstellt")

# Retriever
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}
)
```

### Aufgabe 5.3: RAG-Chain implementieren

```python
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# Hilfsfunktion: Dokumente formatieren
def format_docs(docs):
    """Formatiert Retrieved Docs für Prompt"""
    return "\n\n".join([f"Quelle: {doc.metadata.get('source', 'Unbekannt')}\n{doc.page_content}" for doc in docs])

# RAG-Prompt
rag_prompt = ChatPromptTemplate.from_messages([
    ("system", """Du bist ein technischer Dokumentationsassistent.
    Beantworte die Frage NUR basierend auf dem folgenden Kontext.
    Wenn der Kontext keine Antwort liefert, sage das ehrlich.

    Kontext:
    {context}"""),
    ("user", "{frage}")
])

# RAG-Chain (LCEL)
rag_chain = (
    {
        "context": retriever | format_docs,
        "frage": RunnablePassthrough()
    }
    | rag_prompt
    | llm
    | StrOutputParser()
)

# Test
test_frage = "Wie starte ich einen Docker-Container?"
antwort = rag_chain.invoke(test_frage)
print(f"🤖 {antwort}")
```

### Aufgabe 5.4: RAG-Chat mit Quellenangaben

```python
def rag_chat():
    """RAG-Chat mit Quellenangaben"""
    print("🤖 Tech-Doku Assistent (RAG-Modus)")
    print("   (Schreibe 'exit' zum Beenden)\n")

    while True:
        frage = input("💬 Sie: ")

        if frage.lower() in ['exit', 'quit', 'beenden']:
            print("👋 Auf Wiedersehen!")
            break

        if not frage.strip():
            continue

        # Retrieved Docs holen (für Quellenangaben)
        docs = retriever.get_relevant_documents(frage)

        # RAG-Antwort
        antwort = rag_chain.invoke(frage)

        print(f"\n🤖 Bot: {antwort}\n")

        # Quellenangaben
        print("📚 Quellen:")
        for i, doc in enumerate(docs, 1):
            source = doc.metadata.get('source', 'Unbekannt').split('/')[-1]
            # Berechne Relevanz (Cosine Similarity würde mehr Aufwand bedeuten)
            print(f"   {i}. {source}")

        print()

# Starten
rag_chat()
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
    if not docs:
        return "Keine relevanten Dokumente gefunden."

    # Formatiere Ergebnisse
    results = []
    for i, doc in enumerate(docs[:2], 1):  # Top 2
        source = doc.metadata.get('source', 'Unbekannt').split('/')[-1]
        results.append(f"[{source}]: {doc.page_content[:200]}...")

    return "\n\n".join(results)

@tool
def calculate_token_cost(text: str, model: str = "gpt-4o-mini") -> str:
    """Berechnet Token-Anzahl und geschätzte Kosten für einen Text."""
    # Token zählen
    tokens = count_tokens(text, model)

    # Kosten berechnen (gpt-4o-mini Preise)
    cost_per_1m_input = 0.15  # USD
    cost_per_1m_output = 0.60  # USD

    # Vereinfachung: Nehme Durchschnitt
    avg_cost = (cost_per_1m_input + cost_per_1m_output) / 2
    cost = (tokens / 1_000_000) * avg_cost

    return f"""Token-Analyse:
    - Modell: {model}
    - Tokens: {tokens}
    - Geschätzte Kosten: ${cost:.6f} USD"""

@tool
def validate_python_code(code: str) -> str:
    """Validiert Python-Code auf Syntax-Fehler."""
    try:
        ast.parse(code)
        return "✅ Code ist syntaktisch korrekt!"
    except SyntaxError as e:
        return f"❌ Syntax-Fehler in Zeile {e.lineno}: {e.msg}"

# Tool-Liste
tools = [search_documentation, calculate_token_cost, validate_python_code]

# Test einzelner Tools
print(search_documentation.invoke({"query": "Docker Container"}))
```

### Aufgabe 6.2: Agent erstellen

```python
from langchain.agents import create_agent

# Agent erstellen (benötigt gpt-4o oder gpt-4o-mini für Function Calling)
agent = create_agent(
    model="openai:gpt-4o-mini",  # Wichtig: Function Calling Support!
    tools=tools,
    system_prompt="""Du bist ein technischer Assistent mit Zugriff auf:
    1. Dokumenten-Suche (search_documentation)
    2. Token-Kosten-Rechner (calculate_token_cost)
    3. Python-Code-Validator (validate_python_code)

    Nutze die Tools intelligent und erkläre deine Entscheidungen.""",
    debug=True  # Zeigt Tool-Aufrufe
)

# Test-Anfrage
response = agent.invoke({
    "messages": [{"role": "user", "content": "Suche Infos zu Docker"}]
})

print(response["messages"][-1].content)
```

### Aufgabe 6.3: Agent-Chat

```python
def agent_chat():
    """Interactive Agent Chat"""
    print("🤖 Tech-Doku Assistent (Agent-Modus)")
    print("   Tools: 📚 Doku-Suche | 📊 Token-Rechner | ✅ Code-Validator")
    print("   (Schreibe 'exit' zum Beenden)\n")

    while True:
        user_input = input("💬 Sie: ")

        if user_input.lower() in ['exit', 'quit', 'beenden']:
            print("👋 Auf Wiedersehen!")
            break

        if not user_input.strip():
            continue

        # Agent invoke
        response = agent.invoke({
            "messages": [{"role": "user", "content": user_input}]
        })

        # Antwort extrahieren
        bot_message = response["messages"][-1].content

        print(f"\n🤖 Agent: {bot_message}\n")

# Starten
agent_chat()
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
    history.append((message, antwort))
    return "", history

def rag_handler(message, history):
    """Verarbeitet RAG-basierte Anfragen"""
    antwort = rag_chain.invoke(message)
    # Hole Quellen
    docs = retriever.get_relevant_documents(message)
    sources = [doc.metadata.get('source', 'Unbekannt').split('/')[-1] for doc in docs[:2]]

    full_response = f"{antwort}\n\n📚 Quellen: {', '.join(sources)}"
    history.append((message, full_response))
    return "", history

def agent_handler(message, history):
    """Verarbeitet Agent-Anfragen"""
    response = agent.invoke({
        "messages": [{"role": "user", "content": message}]
    })
    antwort = response["messages"][-1].content
    history.append((message, antwort))
    return "", history

# Token-Statistik berechnen
def calculate_stats(history):
    """Berechnet Token-Statistik aus Chat-History"""
    if not history:
        return "📊 Tokens: 0 | Kosten: $0.00"

    total_tokens = sum([
        count_tokens(msg) + count_tokens(reply)
        for msg, reply in history
    ])

    # Kosten (Durchschnitt)
    cost = (total_tokens / 1_000_000) * 0.375

    return f"📊 Tokens: {total_tokens} | Kosten: ${cost:.4f}"
```

### Aufgabe 7.2: Gradio-App implementieren

```python
# Gradio Interface
with gr.Blocks(title="Tech-Doku Assistent") as demo:
    gr.Markdown("# 🤖 Tech-Doku Assistent")
    gr.Markdown("*Powered by LangChain & OpenAI*")

    with gr.Tabs():
        # Tab 1: Einfacher Chat
        with gr.Tab("💬 Chat"):
            chatbot1 = gr.Chatbot(height=400, label="Chat-Verlauf")
            msg1 = gr.Textbox(placeholder="Frage hier eingeben...", label="Ihre Frage")
            stats1 = gr.Markdown("📊 Tokens: 0 | Kosten: $0.00")

            msg1.submit(chat_handler, [msg1, chatbot1], [msg1, chatbot1]).then(
                lambda h: calculate_stats(h), chatbot1, stats1
            )

            gr.Button("Chat löschen").click(lambda: ([], "📊 Tokens: 0 | Kosten: $0.00"),
                                             None, [chatbot1, stats1])

        # Tab 2: RAG-Suche
        with gr.Tab("📚 RAG-Suche"):
            chatbot2 = gr.Chatbot(height=400, label="RAG-Verlauf")
            msg2 = gr.Textbox(placeholder="Frage zur Dokumentation...", label="Ihre Frage")
            stats2 = gr.Markdown("📊 Tokens: 0 | Kosten: $0.00")

            msg2.submit(rag_handler, [msg2, chatbot2], [msg2, chatbot2]).then(
                lambda h: calculate_stats(h), chatbot2, stats2
            )

            gr.Button("Chat löschen").click(lambda: ([], "📊 Tokens: 0 | Kosten: $0.00"),
                                             None, [chatbot2, stats2])

        # Tab 3: Agent
        with gr.Tab("🤖 Agent"):
            chatbot3 = gr.Chatbot(height=400, label="Agent-Verlauf")
            msg3 = gr.Textbox(placeholder="Komplexe Anfrage an Agent...", label="Ihre Frage")
            stats3 = gr.Markdown("📊 Tokens: 0 | Kosten: $0.00")
            gr.Markdown("**Tools:** 📚 Doku-Suche | 📊 Token-Rechner | ✅ Code-Validator")

            msg3.submit(agent_handler, [msg3, chatbot3], [msg3, chatbot3]).then(
                lambda h: calculate_stats(h), chatbot3, stats3
            )

            gr.Button("Chat löschen").click(lambda: ([], "📊 Tokens: 0 | Kosten: $0.00"),
                                             None, [chatbot3, stats3])

# Starten (WICHTIG: share=True für Colab!)
demo.launch(share=True, debug=True)
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

**Version:** 1.1 (Colab/Jupyter-optimiert)
**Letzte Aktualisierung:** Dezember 2025
**Kurs:** Generative KI. Verstehen. Anwenden. Gestalten.
**Module:** M04, M05, M06, M07, M08, M10, M11
**Arbeitsumgebung:** Google Colab oder Jupyter Notebook
