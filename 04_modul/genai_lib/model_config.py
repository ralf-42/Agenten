"""
model_config.py — Rollenbasierte Modell-Konfiguration

Definiert Modell-IDs als Konstanten. Die Instanziierung erfolgt im Notebook
mit init_chat_model(), sodass API Keys bereits gesetzt sind.

Installation (einmalig):
    pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

Import im Notebook:
    from genai_lib.model_config import WORKER, JUDGE, BASELINE

Verwendung:
    from langchain.chat_models import init_chat_model
    llm        = init_chat_model(BASELINE, temperature=0.0)
    worker_llm = init_chat_model(WORKER)
    judge_llm  = init_chat_model(JUDGE)

Rollen:
    BASELINE        — Baseline / Demo              (gpt-4o-mini)
    ROUTER          — Router / leichter Reasoner   (o3-mini)
    JUDGE           — Judge / starker Reasoner     (o3)
    PLANNER         — Planner / Aufgabenzerlegung  (o3)
    WORKER          — Worker / Synthese             (gpt-5.4-mini)
    WORKER_PREMIUM  — Worker / Synthese hochwertig  (gpt-5.4)
    CODING          — Coding-Worker                 (gpt-5.4-mini)
    EMBEDDINGS      — Embeddings                    (text-embedding-3-small)

Hinweis: o3, o3-mini und gpt-5.4-* unterstützen keinen temperature-Parameter.
"""

# Baseline / Demo — schnell, günstig, didaktisch steuerbar
BASELINE = "openai:gpt-4o-mini"

# Router / leichter Reasoner — einfache Routing- und Auswahlentscheidungen
ROUTER = "openai:o3-mini"

# Judge / starker Reasoner — Supervisor, Security, Evaluation
JUDGE = "openai:o3"

# Planner — Aufgabenzerlegung, Schritt-Planung, Agentic RAG
PLANNER = "openai:o3"

# Worker / Synthese — RAG-Synthese, strukturierte Ausgaben, Code
WORKER = "openai:gpt-5.4-mini"

# Worker / Synthese (hochwertig) — komplexe RAG, finale Reports
WORKER_PREMIUM = "openai:gpt-5.4"

# Coding-Worker — Code-Generierung, Refactoring, technische Agenten
CODING = "openai:gpt-5.4-mini"

# Embeddings — Retrieval, Chunk-Suche, Vektorindizes
EMBEDDINGS = "text-embedding-3-small"
