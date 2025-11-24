"""
genai_lib - Generative AI Bibliothek für Agenten-Kurs

Dieses Package stellt wiederverwendbare Funktionen und Module für den
Agenten-Kurs bereit, mit Fokus auf LangChain 1.0+ und Multi-Agent-Systeme.

Module:
-------
- utilities: Hilfsfunktionen für Setup, Installation, Prompt-Loading
- multimodal_rag: Multimodales RAG-System mit CLIP und Vision-LLMs

Version: 1.0.0
Stand: 23.11.2025
"""

__version__ = "1.0.0"

# ============================================================================
# UTILITIES - Hilfsfunktionen
# ============================================================================

from .utilities import (
    check_environment,
    install_packages,
    get_ipinfo,
    setup_api_keys,
    mprint,
    load_chat_prompt_template,
)

# ============================================================================
# MULTIMODAL RAG - RAG-System mit Vision-Support
# ============================================================================

from .multimodal_rag import (
    # Konfiguration
    RAGConfig,
    RAGComponents,

    # System-Initialisierung
    init_rag_system,

    # Dokument-Verarbeitung
    add_text_document,
    add_image_with_description,
    process_directory,

    # Bildbeschreibung
    generate_image_description,

    # Suchfunktionen
    search_texts,
    search_images,
    search_similar_images,
    search_text_by_image,
    multimodal_search,
    find_related_images_from_text,

    # Hilfsfunktionen
    get_system_status,
    cleanup_database,
)

# ============================================================================
# PUBLIC API - Was wird beim "from genai_lib import *" exportiert
# ============================================================================

__all__ = [
    # Metadata
    "__version__",

    # Utilities
    "check_environment",
    "install_packages",
    "get_ipinfo",
    "setup_api_keys",
    "mprint",
    "load_chat_prompt_template",

    # Multimodal RAG - Konfiguration
    "RAGConfig",
    "RAGComponents",

    # Multimodal RAG - System
    "init_rag_system",

    # Multimodal RAG - Dokumente
    "add_text_document",
    "add_image_with_description",
    "process_directory",
    "generate_image_description",

    # Multimodal RAG - Suche
    "search_texts",
    "search_images",
    "search_similar_images",
    "search_text_by_image",
    "multimodal_search",
    "find_related_images_from_text",

    # Multimodal RAG - Verwaltung
    "get_system_status",
    "cleanup_database",
]
