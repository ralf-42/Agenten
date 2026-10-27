"""
model_config.py — Rollenbasierte Modell-Konfiguration

Definiert Modell-IDs als Konstanten. Die Instanziierung erfolgt im Notebook
mit init_chat_model(), sodass API Keys bereits gesetzt sind.

Installation (einmalig):
    pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

Import im Notebook:
    from genai_lib.model_config import (
        BASELINE, ROUTER,
        WORKER, CODING,
        JUDGE, PLANNER, WORKER_PREMIUM, FRONTIER,
        IMAGE_GENERATION,
        TRANSCRIPTION, TRANSCRIPTION_SEGMENTS,
        EMBEDDINGS,
    )

Verwendung:
    from langchain.chat_models import init_chat_model
    llm        = init_chat_model(BASELINE)
    worker_llm = init_chat_model(WORKER)
    judge_llm  = init_chat_model(JUDGE)

    # Qualitätssteuerung über reasoning.effort (nicht temperature):
    llm = init_chat_model(JUDGE, model_kwargs={"reasoning": {"effort": "high"}})

Rollen (Luna → Terra → Sol → Astra):
    BASELINE           — Baseline / Demo              (gpt-6-luna)
    ROUTER             — Router / leichter Reasoner   (gpt-6-luna)
    WORKER             — Worker / Synthese             (gpt-6.1-terra)
    CODING             — Coding-Worker                 (gpt-6.1-terra)
    JUDGE              — Judge / starker Reasoner      (gpt-6.1-sol)
    PLANNER            — Planner / Aufgabenzerlegung   (gpt-6.1-sol)
    WORKER_PREMIUM     — Worker / Synthese hochwertig  (gpt-6.1-sol)
    FRONTIER           — Frontier / maximale Qualität  (gpt-6-astra)
    IMAGE_GENERATION   — Bildgenerierung               (gpt-image-2)
    TRANSCRIPTION      — Audio-Transkription           (gpt-transcribe)
    TRANSCRIPTION_SEGMENTS — Zeitstempel/Segmente      (whisper-1, veraltet)
    EMBEDDINGS         — Embeddings                    (text-embedding-3-small)

Hinweis: GPT-6-Reasoning-Modelle nicht pauschal mit temperature konfigurieren.
Stattdessen reasoning.effort und text.verbosity verwenden.
temperature ist nur in bestimmten Konfigurationen mit reasoning.effort="none" erlaubt.

Die Medien-Rollen (IMAGE_GENERATION, TRANSCRIPTION, TRANSCRIPTION_SEGMENTS) sind
Teil der gemeinsamen Rollen-Struktur mit dem GenAI-Kurs, werden in den aktuellen
Agenten-Notebooks aber nicht verwendet. Diese Modelle würden teils direkt über
die OpenAI-API angesprochen, weil LangChain nicht alle Medien-Endpunkte abbildet.
"""

# --- Luna-Tier: günstig, schnell, einfache Aufgaben ---

# Baseline / Demo — günstiges GPT-6-Modell für einfache Beispiele und Demos.
# reasoning.effort="none" oder "low". Deterministik über Prompts, nicht temperature.
BASELINE = "openai:gpt-6-luna"

# Router / leichter Reasoner — einfache Routing- und Auswahlentscheidungen (2-3 Wege).
# reasoning.effort="low" reicht für klare Routing-Entscheidungen.
ROUTER = "openai:gpt-6-luna"

# --- Terra-Tier: effizientes Workhorse für Standardaufgaben ---

# Worker / Synthese — RAG-Synthese, strukturierte Ausgaben, Code.
# reasoning.effort="low" bis "medium" je nach Ausgabe-Komplexität.
WORKER = "openai:gpt-6.1-terra"

# Coding-Worker — Code-Generierung, Refactoring, technische Agenten.
# reasoning.effort="medium" bis "high" je nach Aufgabe.
CODING = "openai:gpt-6.1-terra"

# --- Sol-Tier: komplexe Aufgaben mit hohem Qualitätsanspruch ---

# Judge / starker Reasoner — Supervisor, Security, Evaluation, Compliance.
# reasoning.effort="high".
JUDGE = "openai:gpt-6.1-sol"

# Planner — Aufgabenzerlegung, Schritt-Planung, Agentic RAG.
# reasoning.effort="medium" bis "high".
PLANNER = "openai:gpt-6.1-sol"

# Worker / Synthese (hochwertig) — komplexe RAG, finale Reports.
# reasoning.effort="medium" bis "high".
WORKER_PREMIUM = "openai:gpt-6.1-sol"

# --- Astra-Tier: maximale Qualität für die schwierigsten Aufgaben ---
# Frontier — schwierige Coding-, Judge- und Agenten-Aufgaben.
# reasoning.effort="high" bis "max" bewusst einsetzen.
FRONTIER = "openai:gpt-6-astra"

# --- Multimodal / Medien-Endpunkte ---

# Bildgenerierung — direkte OpenAI Images API, daher ohne Provider-Präfix.
IMAGE_GENERATION = "gpt-image-2"

# Audio-Transkription — direkte OpenAI Audio API.
# Für normale Transkription aktueller und genauer als whisper-1.
TRANSCRIPTION = "gpt-transcribe"

# Legacy: Audio-Transkription mit Segmenten/Zeitstempeln.
# whisper-1 ist bis 2027-02-26 abgekündigt; Zeitstempel brauchen eine Migration.
TRANSCRIPTION_SEGMENTS = "whisper-1"

# --- Embeddings ---

# Embeddings — Retrieval, Chunk-Suche, Vektorindizes
EMBEDDINGS = "text-embedding-3-small"
