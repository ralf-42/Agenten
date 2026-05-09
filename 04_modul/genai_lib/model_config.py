"""
model_config.py — Rollenbasierte Modell-Konfiguration

Definiert Modell-IDs als Konstanten. Die Instanziierung erfolgt im Notebook
mit init_chat_model(), sodass API Keys bereits gesetzt sind.

Installation (einmalig):
    pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

Import im Notebook:
    from genai_lib.model_config import (
        BASELINE, ROUTER, TRANSLATOR_FAST, TRANSLATOR,
        WORKER, CODING, TRANSLATOR_PREMIUM,
        JUDGE, PLANNER, WORKER_PREMIUM,
        JUDGE_PREMIUM, PLANNER_PREMIUM,
        EMBEDDINGS,
    )

Verwendung:
    from langchain.chat_models import init_chat_model
    llm        = init_chat_model(BASELINE)
    worker_llm = init_chat_model(WORKER)
    judge_llm  = init_chat_model(JUDGE)

    # Qualitätssteuerung über reasoning.effort (nicht temperature):
    llm = init_chat_model(JUDGE, model_kwargs={"reasoning": {"effort": "high"}})

Rollen (Nano → Mini → Standard → Premium):
    BASELINE           — Baseline / Demo              (gpt-5.4-nano)
    ROUTER             — Router / leichter Reasoner   (gpt-5.4-nano)
    TRANSLATOR_FAST    — Übersetzer / Rohübersetzung   (gpt-5.4-nano)
    TRANSLATOR         — Übersetzer / Kursmaterial     (gpt-5.4-mini)
    WORKER             — Worker / Synthese             (gpt-5.4-mini)
    CODING             — Coding-Worker                 (gpt-5.4-mini)
    TRANSLATOR_PREMIUM — Übersetzer / hochwertig       (gpt-5.5)
    JUDGE              — Judge / starker Reasoner      (gpt-5.4)
    PLANNER            — Planner / Aufgabenzerlegung   (gpt-5.4)
    WORKER_PREMIUM     — Worker / Synthese hochwertig  (gpt-5.4)
    JUDGE_PREMIUM      — Judge / maximale Qualität     (gpt-5.5)
    PLANNER_PREMIUM    — Planner / maximale Qualität   (gpt-5.5)
    EMBEDDINGS         — Embeddings                    (text-embedding-3-small)

Hinweis: GPT-5.x-Reasoning-Modelle nicht pauschal mit temperature konfigurieren.
Stattdessen reasoning.effort und text.verbosity verwenden.
temperature ist nur in bestimmten Konfigurationen mit reasoning.effort="none" erlaubt.
"""

# --- Nano-Tier: günstig, schnell, einfache Aufgaben ---

# Baseline / Demo — günstigstes GPT-5.x-Modell für einfache Beispiele und Demos.
# reasoning.effort="none" oder "low". Deterministik über Prompts, nicht temperature.
BASELINE = "openai:gpt-5.4-nano"

# Router / leichter Reasoner — einfache Routing- und Auswahlentscheidungen (2-3 Wege).
# reasoning.effort="low" reicht für klare Routing-Entscheidungen.
ROUTER = "openai:gpt-5.4-nano"

# Übersetzer (schnell) — Rohübersetzung, kurze nicht-kritische Texte.
# reasoning.effort="none" oder "low", text.verbosity="low".
TRANSLATOR_FAST = "openai:gpt-5.4-nano"

# --- Mini-Tier: ausgewogen, Standard-Workhorse ---

# Worker / Synthese — RAG-Synthese, strukturierte Ausgaben, Code.
# reasoning.effort="low" bis "medium" je nach Ausgabe-Komplexität.
WORKER = "openai:gpt-5.4-mini"

# Coding-Worker — Code-Generierung, Refactoring, technische Agenten.
# reasoning.effort="medium" bis "high" je nach Aufgabe.
CODING = "openai:gpt-5.4-mini"

# Übersetzer — Kursmaterial, Markdown, Dokumentation.
# reasoning.effort="low", text.verbosity="medium".
TRANSLATOR = "openai:gpt-5.4-mini"

# Übersetzer (hochwertig) — stilistisch anspruchsvoll, finale Veröffentlichung.
# reasoning.effort="medium", text.verbosity="medium".
TRANSLATOR_PREMIUM = "openai:gpt-5.5"

# --- Standard-Tier: starke Reasoning-Qualität ---

# Judge / starker Reasoner — Supervisor, Security, Evaluation, Compliance.
# reasoning.effort="high". Für maximale Qualität: JUDGE_PREMIUM.
JUDGE = "openai:gpt-5.4"

# Planner — Aufgabenzerlegung, Schritt-Planung, Agentic RAG.
# reasoning.effort="medium" bis "high".
PLANNER = "openai:gpt-5.4"

# Worker / Synthese (hochwertig) — komplexe RAG, finale Reports.
# reasoning.effort="medium" bis "high".
WORKER_PREMIUM = "openai:gpt-5.4"

# --- Premium-Tier: maximale Qualität (nur wenn Standard nicht reicht) ---

# Judge (Premium) — kritische Sicherheitsentscheidungen, finale Evaluation.
# reasoning.effort="high" oder "xhigh".
JUDGE_PREMIUM = "openai:gpt-5.5"

# Planner (Premium) — hochkomplexe Aufgabenzerlegung, multi-step Planung.
# reasoning.effort="high".
PLANNER_PREMIUM = "openai:gpt-5.5"

# --- Embeddings ---

# Embeddings — Retrieval, Chunk-Suche, Vektorindizes
EMBEDDINGS = "text-embedding-3-small"
