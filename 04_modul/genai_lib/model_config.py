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
        JUDGE, PLANNER, WORKER_PREMIUM,
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

Rollen (Nano → Mini → Standard):
    BASELINE           — Baseline / Demo              (gpt-5.4-nano)
    ROUTER             — Router / leichter Reasoner   (gpt-5.4-nano)
    WORKER             — Worker / Synthese             (gpt-5.4-mini)
    CODING             — Coding-Worker                 (gpt-5.4-mini)
    JUDGE              — Judge / starker Reasoner      (gpt-5.4)
    PLANNER            — Planner / Aufgabenzerlegung   (gpt-5.4)
    WORKER_PREMIUM     — Worker / Synthese hochwertig  (gpt-5.4)
    IMAGE_GENERATION   — Bildgenerierung               (gpt-image-2)
    TRANSCRIPTION      — Audio-Transkription           (gpt-4o-mini-transcribe)
    TRANSCRIPTION_SEGMENTS — Zeitstempel/Segmente      (whisper-1)
    EMBEDDINGS         — Embeddings                    (text-embedding-3-small)

Hinweis: GPT-5.x-Reasoning-Modelle nicht pauschal mit temperature konfigurieren.
Stattdessen reasoning.effort und text.verbosity verwenden.
temperature ist nur in bestimmten Konfigurationen mit reasoning.effort="none" erlaubt.

Die Medien-Rollen (IMAGE_GENERATION, TRANSCRIPTION, TRANSCRIPTION_SEGMENTS) sind
Teil der gemeinsamen Rollen-Struktur mit dem GenAI-Kurs, werden in den aktuellen
Agenten-Notebooks aber nicht verwendet. Diese Modelle würden teils direkt über
die OpenAI-API angesprochen, weil LangChain nicht alle Medien-Endpunkte abbildet.
"""

# --- Nano-Tier: günstig, schnell, einfache Aufgaben ---

# Baseline / Demo — günstigstes GPT-5.x-Modell für einfache Beispiele und Demos.
# reasoning.effort="none" oder "low". Deterministik über Prompts, nicht temperature.
BASELINE = "openai:gpt-5.4-nano"

# Router / leichter Reasoner — einfache Routing- und Auswahlentscheidungen (2-3 Wege).
# reasoning.effort="low" reicht für klare Routing-Entscheidungen.
ROUTER = "openai:gpt-5.4-nano"

# --- Mini-Tier: ausgewogen, Standard-Workhorse ---

# Worker / Synthese — RAG-Synthese, strukturierte Ausgaben, Code.
# reasoning.effort="low" bis "medium" je nach Ausgabe-Komplexität.
WORKER = "openai:gpt-5.4-mini"

# Coding-Worker — Code-Generierung, Refactoring, technische Agenten.
# reasoning.effort="medium" bis "high" je nach Aufgabe.
CODING = "openai:gpt-5.4-mini"

# --- Standard-Tier: starke Reasoning-Qualität ---

# Judge / starker Reasoner — Supervisor, Security, Evaluation, Compliance.
# reasoning.effort="high".
JUDGE = "openai:gpt-5.4"

# Planner — Aufgabenzerlegung, Schritt-Planung, Agentic RAG.
# reasoning.effort="medium" bis "high".
PLANNER = "openai:gpt-5.4"

# Worker / Synthese (hochwertig) — komplexe RAG, finale Reports.
# reasoning.effort="medium" bis "high".
WORKER_PREMIUM = "openai:gpt-5.4"

# --- Multimodal / Medien-Endpunkte ---

# Bildgenerierung — direkte OpenAI Images API, daher ohne Provider-Präfix.
IMAGE_GENERATION = "gpt-image-2"

# Audio-Transkription — direkte OpenAI Audio API.
# Für normale Transkription aktueller und genauer als whisper-1.
TRANSCRIPTION = "gpt-4o-mini-transcribe"

# Audio-Transkription mit Segmenten/Zeitstempeln.
# whisper-1 unterstützt response_format="verbose_json" mit segments.
TRANSCRIPTION_SEGMENTS = "whisper-1"

# --- Embeddings ---

# Embeddings — Retrieval, Chunk-Suche, Vektorindizes
EMBEDDINGS = "text-embedding-3-small"
