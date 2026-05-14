---
layout: default
title: RAG und Kontext
nav_order: 7
has_children: true
description: "RAG, Tokenizing, Chunking und Embeddings: Wissensanbindung für KI-Agenten"
---

# Kontext, Grounding und RAG

Diese Seiten erklären, wie Agenten den richtigen Kontext erhalten, wie externes Wissen angebunden wird und wie Text für Retrieval und Kontextfenster vorbereitet wird.

| Frage | Dokument | Bezug |
|---|---|---|
| **Was** gehört in den Kontext eines Agenten? | [Context Engineering]({{ '/rag-kontext/context-engineering.html' | relative_url }}) | Auswahl, Struktur und Zeitpunkt relevanter Informationen. |
| **Wann** reicht Prompting nicht mehr aus? | [RAG-Konzepte]({{ '/rag-kontext/rag-konzepte.html' | relative_url }}) | Grundidee von Retrieval, Quellenbindung, Reranking und Grounding. |
| **Wie** wird Text retrievalfähig vorbereitet? | [Tokenizing & Chunking]({{ '/rag-kontext/tokenizing-chunking.html' | relative_url }}) | Tokenisierung, Chunk-Größen, Overlap und Dokumentstruktur. |
| **Wie** wird Bedeutung suchbar? | [Embeddings]({{ '/rag-kontext/embeddings.html' | relative_url }}) | Vektoren, Ähnlichkeit, semantische Suche und Grenzen von Embeddings. |
| **Wie** werden Vektoren praktisch gespeichert? | [Einsteiger ChromaDB]({{ '/rag-kontext/einsteiger-chromadb.html' | relative_url }}) | Collections, Similarity Search und LangChain-Integration. |





