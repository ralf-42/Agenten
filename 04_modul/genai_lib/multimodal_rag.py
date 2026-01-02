#@title 🛠️ Code M14_Modul { display-mode: "form" }
"""
Multimodales RAG Modul mit Bildbeschreibungen (Version 3.1 - LangChain 1.0+)

Verwendung:
    # System initialisieren
    rag = init_rag_system()

    # Verzeichnis verarbeiten
    process_directory(rag, './files', auto_describe_images=True)

    # Suchen
    result = multimodal_search(rag, "Roboter")

    # NEU: Bild → Bild Suche
    similar_images = search_similar_images(rag, "./query_image.jpg", k=5)

    # NEU: Bild → Text Suche
    text_results = search_text_by_image(rag, "./query_image.jpg", k=3)

Autor: Enhanced by Claude
Datum: Dezember 2025
Version: 3.1 - LangChain 1.0+ Migration (init_chat_model, HumanMessage Content Blocks)
"""

from pathlib import Path
import uuid
import base64
import shutil
from dataclasses import dataclass

from markitdown import MarkItDown
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain.chat_models import init_chat_model
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.messages import HumanMessage
from sentence_transformers import SentenceTransformer
from PIL import Image
import chromadb


# ============================================================================
# KONFIGURATION
# ============================================================================

@dataclass
class RAGConfig:
    """Zentrale Konfiguration für das RAG-System"""
    chunk_size: int = 200
    chunk_overlap: int = 20
    text_threshold: float = 1.2
    image_threshold: float = 0.8
    clip_model: str = 'clip-ViT-B-32'
    text_model: str = 'text-embedding-3-small'
    llm_model: str = 'gpt-4o-mini'
    vision_model: str = 'gpt-4o-mini'
    db_path: str = './multimodal_rag_db'


@dataclass
class RAGComponents:
    """Container für alle RAG-System-Komponenten"""
    text_embeddings: OpenAIEmbeddings
    clip_model: SentenceTransformer
    llm: any  # LangChain 1.0+ ChatModel (via init_chat_model)
    vision_llm: any  # LangChain 1.0+ ChatModel mit Vision-Support (via init_chat_model)
    text_splitter: RecursiveCharacterTextSplitter
    markitdown: MarkItDown
    chroma_client: chromadb.PersistentClient
    text_collection: Chroma
    image_collection: any
    config: RAGConfig


# ============================================================================
# SYSTEM-INITIALISIERUNG
# ============================================================================

def init_rag_system(config=None):
    """
    Initialisiert das vollständige RAG-System mit Vision-LLM

    Args:
        config: Optional - RAGConfig Instanz

    Returns:
        RAGComponents mit allen Komponenten
    """
    if config is None:
        config = RAGConfig()

    print(f"🚀 Initialisiere Enhanced RAG-System in {config.db_path}")

    # KI-Modelle laden
    text_embeddings = OpenAIEmbeddings(model=config.text_model)
    print("✅ OpenAI Text-Embeddings initialisiert")

    print("🖼️ Lade CLIP-Modell...")
    clip_model = SentenceTransformer(config.clip_model)
    print("✅ CLIP-Modell geladen")

    # LangChain 1.0+ API: init_chat_model statt ChatOpenAI direkt
    llm = init_chat_model(f"openai:{config.llm_model}", temperature=0.0)
    vision_llm = init_chat_model(f"openai:{config.vision_model}", temperature=0.0)
    print("✅ LLMs initialisiert (Text + Vision)")

    # Text-Verarbeitung
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=config.chunk_size,
        chunk_overlap=config.chunk_overlap
    )
    markitdown = MarkItDown()

    # Datenbank einrichten
    Path(config.db_path).mkdir(exist_ok=True)
    chroma_client = chromadb.PersistentClient(path=config.db_path)

    # Text-Collection (für Text-Dokumente UND Bildbeschreibungen)
    text_collection = Chroma(
        collection_name="texts",
        embedding_function=text_embeddings,
        persist_directory=config.db_path
    )

    # Bild-Collection (für CLIP-Embeddings)
    collections = [c.name for c in chroma_client.list_collections()]
    if "images" in collections:
        image_collection = chroma_client.get_collection("images")
    else:
        image_collection = chroma_client.create_collection(
            name="images",
            metadata={"hnsw:space": "cosine"}
        )

    print("✅ Collections initialisiert\n")

    return RAGComponents(
        text_embeddings, clip_model, llm, vision_llm, text_splitter,
        markitdown, chroma_client, text_collection, image_collection, config
    )


# ============================================================================
# BILDBESCHREIBUNGS-GENERIERUNG
# ============================================================================

def generate_image_description(vision_llm, image_path):
    """
    Generiert eine detaillierte Beschreibung eines Bildes mit Vision-LLM

    LangChain 1.0+ konform: Verwendet HumanMessage mit Standard Content Blocks

    Args:
        vision_llm: ChatModel mit Vision-Support (via init_chat_model)
        image_path: Pfad zum Bild

    Returns:
        String mit Bildbeschreibung oder Fallback bei Fehler
    """
    try:
        # Bild laden und in Base64 konvertieren
        with open(image_path, "rb") as image_file:
            image_data = base64.b64encode(image_file.read()).decode('utf-8')

        # Dateiendung ermitteln
        image_extension = Path(image_path).suffix.lower().replace('.', '')
        if image_extension == 'jpg':
            image_extension = 'jpeg'

        # LangChain 1.0+ API: HumanMessage mit Standard Content Blocks (provider-agnostisch)
        message = HumanMessage(
            content=[
                {
                    "type": "text",
                    "text": """Analysiere dieses Bild detailliert und erstelle eine präzise Beschreibung auf Deutsch.

Beschreibe:
1. Hauptobjekte und -personen
2. Farben und Stimmung
3. Komposition und Setting
4. Besondere Details oder Merkmale
5. Möglichen Kontext oder Zweck

Halte die Beschreibung prägnant aber informativ (2-4 Sätze)."""
                },
                {
                    "type": "image",
                    "url": f"data:image/{image_extension};base64,{image_data}",
                    "mime_type": f"image/{image_extension}"
                }
            ]
        )

        # Beschreibung generieren
        response = vision_llm.invoke([message])
        description = response.content.strip()

        print(f"📝 Bildbeschreibung generiert: {description[:100]}...")
        return description

    except Exception as e:
        print(f"❌ Fehler bei Bildbeschreibung für {Path(image_path).name}: {e}")
        # Fallback: Dateiname als Beschreibung
        return Path(image_path).stem.replace('_', ' ').replace('-', ' ')


# ============================================================================
# DOKUMENT-VERARBEITUNG
# ============================================================================

def add_text_document(components, file_path):
    """
    Fügt ein Text-Dokument zur Datenbank hinzu

    Args:
        components: RAG-System-Komponenten
        file_path: Pfad zum Dokument

    Returns:
        bool - Erfolg
    """
    path = Path(file_path).absolute()

    # Duplikatsprüfung
    if components.text_collection.get(where={"source": str(path)})['ids']:
        print(f"⚠️ {path.name} bereits vorhanden")
        return False

    try:
        # Dokument mit MarkItDown konvertieren
        result = components.markitdown.convert(str(path))
        if not result or not result.text_content.strip():
            print(f"⚠️ {path.name} enthält keinen Text")
            return False

        # Text in Chunks aufteilen
        chunks = components.text_splitter.split_text(result.text_content)
        documents = [
            Document(
                page_content=chunk.strip(),
                metadata={
                    "source": str(path),
                    "filename": path.name,
                    "chunk_id": i,
                    "doc_type": "text_document"
                }
            ) for i, chunk in enumerate(chunks) if chunk.strip()
        ]

        # Zur Datenbank hinzufügen
        if documents:
            components.text_collection.add_documents(documents)
            print(f"✅ {len(documents)} Chunks von '{path.name}' hinzugefügt")
            return True

    except Exception as e:
        print(f"❌ Fehler bei {path.name}: {e}")

    return False


def add_image_with_description(components, image_path, auto_describe=True):
    """
    Fügt ein Bild mit automatischer Beschreibung zur Datenbank hinzu

    Args:
        components: RAG-System-Komponenten
        image_path: Pfad zum Bild
        auto_describe: Automatische Beschreibung mit GPT-4o-mini

    Returns:
        Tuple (success: bool, text_doc_id: str oder None)
    """
    path = Path(image_path).absolute()

    if not path.exists():
        print(f"❌ Bild nicht gefunden: {path}")
        return False, None

    # Duplikatsprüfung
    if components.image_collection.get(where={"source": str(path)})['ids']:
        print(f"⚠️ Bild bereits vorhanden: {path.name}")
        return False, None

    try:
        # Bild laden und CLIP-Embedding erstellen
        image = Image.open(path).convert('RGB')
        clip_embedding = components.clip_model.encode(image).tolist()
        print(f"🖼️ Bild-Embedding erstellt für {path.name}")

        # Bildbeschreibung generieren
        description = ""
        if auto_describe:
            description = generate_image_description(components.vision_llm, str(path))
        else:
            description = path.stem.replace('_', ' ').replace('-', ' ')

        # IDs generieren
        image_doc_id = f"img_{uuid.uuid4().hex[:8]}_{path.name}"
        text_doc_id = f"img_desc_{uuid.uuid4().hex[:8]}_{path.stem}"

        # 1. Bildbeschreibung in Text-Collection speichern
        text_document = Document(
            page_content=f"Bildbeschreibung für {path.name}: {description}",
            metadata={
                "source": str(path),
                "filename": path.name,
                "doc_type": "image_description",
                "image_doc_id": image_doc_id,
                "description": description,
                "has_clip_embedding": True
            }
        )
        components.text_collection.add_documents([text_document], ids=[text_doc_id])
        print(f"✅ Bildbeschreibung in Text-Collection gespeichert")

        # 2. Bild in Bild-Collection speichern mit Cross-Reference
        components.image_collection.add(
            ids=[image_doc_id],
            embeddings=[clip_embedding],
            documents=[f"Bild: {path.name} - {description}"[:1000]],
            metadatas=[{
                "source": str(path),
                "filename": path.name,
                "description": description[:500],
                "text_doc_id": text_doc_id
            }]
        )

        print(f"✅ Bild '{path.name}' mit Cross-References hinzugefügt\n")
        return True, text_doc_id

    except Exception as e:
        print(f"❌ Fehler bei Bild {path.name}: {e}")
        return False, None


def process_directory(components, directory, include_images=True, auto_describe_images=True):
    """
    Verarbeitet alle Dateien in einem Verzeichnis

    Args:
        components: RAG-System-Komponenten
        directory: Verzeichnispfad
        include_images: Bilder verarbeiten
        auto_describe_images: Automatische Bildbeschreibungen

    Returns:
        Dictionary mit Statistiken
    """
    dir_path = Path(directory)
    if not dir_path.exists():
        print(f"❌ Verzeichnis nicht gefunden: {directory}")
        return {"texts": 0, "images": 0, "image_descriptions": 0}

    # Unterstützte Dateitypen
    text_extensions = {'.pdf', '.docx', '.txt', '.md', '.html'}
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp'}

    # Dateien sammeln
    text_files = [f for f in dir_path.rglob("*") if f.suffix.lower() in text_extensions]
    image_files = [f for f in dir_path.rglob("*") if f.suffix.lower() in image_extensions] if include_images else []

    print(f"📊 Gefunden: {len(text_files)} Text-Dateien, {len(image_files)} Bilder\n")

    # Text-Dateien verarbeiten
    text_count = 0
    for file_path in text_files:
        print(f"📄 {file_path.name}")
        if add_text_document(components, str(file_path)):
            text_count += 1

    print()  # Leerzeile

    # Bild-Dateien verarbeiten
    image_count = 0
    image_desc_count = 0
    for img_path in image_files:
        print(f"🖼️ {img_path.name}")
        success, text_doc_id = add_image_with_description(
            components,
            str(img_path),
            auto_describe=auto_describe_images
        )
        if success:
            image_count += 1
            if text_doc_id:
                image_desc_count += 1

    return {
        "texts": text_count,
        "images": image_count,
        "image_descriptions": image_desc_count
    }


# ============================================================================
# SUCHFUNKTIONEN
# ============================================================================

def search_texts(components, query, k=3, include_image_descriptions=True):
    """
    Durchsucht Text-Dokumente inkl. Bildbeschreibungen

    Args:
        components: RAG-System-Komponenten
        query: Suchanfrage
        k: Anzahl Ergebnisse
        include_image_descriptions: Bildbeschreibungen einschließen

    Returns:
        Formatierter String mit Ergebnissen
    """
    if not components.text_collection.get()['ids']:
        return "❌ Keine Text-Dokumente gefunden"

    # Ähnlichkeitssuche durchführen
    docs_with_scores = components.text_collection.similarity_search_with_score(query, k=k*2)
    if not docs_with_scores:
        return "❌ Keine relevanten Dokumente gefunden"

    # FIX 1: Score in Ähnlichkeit umwandeln (ChromaDB liefert L2-Distanz: 0=identisch, 2=maximal entfernt)
    docs_with_similarity = []
    for doc, score in docs_with_scores:
        similarity = max(0, 1 - (score / 2))  # Konvertiere Distanz zu Ähnlichkeit
        docs_with_similarity.append((doc, similarity))

    # Nach Ähnlichkeit sortieren
    docs_with_similarity.sort(key=lambda x: x[1], reverse=True)

    # Filtern nach Mindest-Ähnlichkeit
    min_similarity = 0.3
    relevant_docs = [(doc, sim) for doc, sim in docs_with_similarity[:k]
                     if sim >= min_similarity]

    if not relevant_docs:
        return "❌ Keine ausreichend ähnlichen Dokumente gefunden"

    # Dokumente nach Typ trennen
    text_docs = []
    image_desc_docs = []

    for doc, sim in relevant_docs:
        doc_type = doc.metadata.get("doc_type", "text_document")
        if doc_type == "image_description" and include_image_descriptions:
            image_desc_docs.append((doc, sim))
        elif doc_type == "text_document":
            text_docs.append((doc, sim))

    # Kontext für LLM zusammenstellen
    all_docs = text_docs + image_desc_docs
    context = "\n\n---\n\n".join([doc.page_content for doc, _ in all_docs])

    # Quellen sammeln
    sources = [
        {
            "filename": doc.metadata.get("filename", "Unbekannt"),
            "similarity": round(sim, 3),
            "type": doc.metadata.get("doc_type", "text_document"),
            "image_doc_id": doc.metadata.get("image_doc_id")
        }
        for doc, sim in all_docs
    ]

    # LLM-Antwort generieren
    prompt = f"""Beantworte die Frage präzise basierend auf dem Kontext.

KONTEXT:
{context}

FRAGE: {query}

ANTWORT:"""

    response = components.llm.invoke(prompt).content

    # Ausgabe klar strukturiert
    text_sources = [s for s in sources if s['type'] == 'text_document']
    image_sources = [s for s in sources if s['type'] == 'image_description']

    result = f"### 🤖 LLM-Antwort\n\n{response}\n\n"
    result += f"### 📚 Verwendete Quellen\n"

    if text_sources:
        result += f"\n   📄 Text-Dokumente ({len(text_sources)}):\n"
        for i, src in enumerate(text_sources, 1):
            result += f"      {i}. {src['filename']} (Ähnlichkeit: {src['similarity']})\n"

    if image_sources:
        result += f"\n   🖼️ Bildbeschreibungen ({len(image_sources)}):\n"
        for i, src in enumerate(image_sources, 1):
            result += f"      {i}. {src['filename']} (Ähnlichkeit: {src['similarity']})\n"

    if not text_sources and not image_sources:
        result += "   ℹ️ Keine Quellen gefunden\n"

    return result


def _get_images_raw(components, query, k=3):
    """
    Interne Hilfsfunktion: Durchsucht Bilder mit Text-Query über CLIP

    Args:
        components: RAG-System-Komponenten
        query: Suchanfrage
        k: Anzahl Ergebnisse

    Returns:
        Liste von Bild-Dictionaries oder leere Liste
    """
    if components.image_collection.count() == 0:
        return []

    # Text-Query in Bild-Embedding-Raum umwandeln
    query_embedding = components.clip_model.encode(query).tolist()

    # Suche in Bild-Collection
    results = components.image_collection.query(
        query_embeddings=[query_embedding],
        n_results=min(k*2, components.image_collection.count()),
        include=['documents', 'metadatas', 'distances']
    )

    if not results['ids'][0]:
        return []

    # Ergebnisse filtern und formatieren
    image_results = [
        {
            "filename": metadata.get("filename", "Unbekannt"),
            "path": metadata.get("source", ""),
            "description": metadata.get("description", ""),
            "text_doc_id": metadata.get("text_doc_id", ""),
            "similarity": round(max(0, 1 - distance), 3)
        }
        for distance, metadata in zip(results['distances'][0], results['metadatas'][0])
        if distance < components.config.image_threshold
    ]

    return image_results


def search_images(components, query, k=3):
    """
    Durchsucht Bilder mit Text-Query über CLIP und generiert LLM-Antwort

    Args:
        components: RAG-System-Komponenten
        query: Suchanfrage
        k: Anzahl Ergebnisse

    Returns:
        Formatierter String mit LLM-Antwort und Bildquellen
    """
    # Hole rohe Bildergebnisse
    image_results = _get_images_raw(components, query, k)

    if not image_results:
        return "❌ Keine ausreichend ähnlichen Bilder gefunden"

    # Kontext aus Bildbeschreibungen zusammenstellen
    context_parts = []
    for img in image_results:
        if img['description']:
            context_parts.append(
                f"Bild: {img['filename']} (Ähnlichkeit: {img['similarity']})\n"
                f"Beschreibung: {img['description']}"
            )

    context = "\n\n---\n\n".join(context_parts)

    # LLM-Antwort generieren
    prompt = f"""Beantworte die Frage präzise basierend auf den gefundenen Bildbeschreibungen.

BILDBESCHREIBUNGEN:
{context}

FRAGE: {query}

ANTWORT:"""

    llm_response = components.llm.invoke(prompt).content

    # Ausgabe formatieren
    result = f"### 🤖 LLM-Antwort\n\n{llm_response}\n\n"
    result += f"### 🖼️ Gefundene Bilder (via CLIP)\n\n"

    for i, img in enumerate(image_results, 1):
        result += f"   {i}. {img['filename']} (Ähnlichkeit: {img['similarity']})\n"
        if img['description']:
            result += f"      📝 {img['description'][:300]}...\n"

    return result


def find_related_images_from_text(components, text_doc_ids, k=3):
    """
    Findet Bilder über ihre Textbeschreibungen (Cross-Modal-Retrieval)

    Args:
        components: RAG-System-Komponenten
        text_doc_ids: Liste von Text-Dokument-IDs
        k: Maximale Anzahl Bilder

    Returns:
        Liste von verwandten Bildern
    """
    related_images = []

    for text_id in text_doc_ids:
        try:
            doc_data = components.text_collection.get(ids=[text_id])
            if not doc_data['ids']:
                continue

            metadata = doc_data['metadatas'][0]

            # Prüfe ob es eine Bildbeschreibung ist
            if metadata.get('doc_type') == 'image_description':
                image_doc_id = metadata.get('image_doc_id')

                if image_doc_id:
                    # Hole das zugehörige Bild
                    image_data = components.image_collection.get(ids=[image_doc_id])

                    if image_data['ids']:
                        img_metadata = image_data['metadatas'][0]
                        related_images.append({
                            'filename': img_metadata.get('filename', 'Unbekannt'),
                            'path': img_metadata.get('source', ''),
                            'description': img_metadata.get('description', ''),
                            'source': 'cross_modal_retrieval'
                        })
        except Exception as e:
            print(f"⚠️ Fehler beim Cross-Modal-Retrieval: {e}")
            continue

    return related_images[:k]


def search_similar_images(components, query_image_path, k=5):
    """
    Bild → Bild Suche: Findet visuell ähnliche Bilder in der Datenbank

    Args:
        components: RAG-System-Komponenten
        query_image_path: Pfad zum Query-Bild
        k: Anzahl ähnlicher Bilder

    Returns:
        Liste von ähnlichen Bildern mit Metadaten und Ähnlichkeitswerten
    """
    path = Path(query_image_path)

    if not path.exists():
        print(f"❌ Query-Bild nicht gefunden: {query_image_path}")
        return []

    if components.image_collection.count() == 0:
        print("❌ Keine Bilder in der Datenbank")
        return []

    try:
        # Query-Bild laden und CLIP-Embedding erstellen
        image = Image.open(path).convert('RGB')
        query_embedding = components.clip_model.encode(image).tolist()
        print(f"🔍 CLIP-Embedding erstellt für Query-Bild: {path.name}")

        # Suche in Bild-Collection
        results = components.image_collection.query(
            query_embeddings=[query_embedding],
            n_results=min(k, components.image_collection.count()),
            include=['documents', 'metadatas', 'distances']
        )

        if not results['ids'][0]:
            return []

        # Ergebnisse formatieren
        similar_images = [
            {
                "filename": metadata.get("filename", "Unbekannt"),
                "path": metadata.get("source", ""),
                "description": metadata.get("description", ""),
                "similarity": round(max(0, 1 - distance), 3)
            }
            for distance, metadata in zip(results['distances'][0], results['metadatas'][0])
        ]

        print(f"✅ {len(similar_images)} ähnliche Bilder gefunden\n")
        return similar_images

    except Exception as e:
        print(f"❌ Fehler bei Bild-zu-Bild-Suche: {e}")
        return []


def search_text_by_image(components, query_image_path, k=3, k_text=3):
    """
    Bild → Text Suche: Findet ähnliche Bilder und relevante Text-Dokumente

    Kombiniert:
    1. Visuelle Ähnlichkeitssuche (Bild → Bild via CLIP)
    2. Semantische Textsuche basierend auf Bildbeschreibungen

    Args:
        components: RAG-System-Komponenten
        query_image_path: Pfad zum Query-Bild
        k: Anzahl ähnlicher Bilder
        k_text: Anzahl relevanter Text-Dokumente

    Returns:
        Formatierter String mit Bildern und Text-Dokumenten
    """
    path = Path(query_image_path)

    if not path.exists():
        return f"❌ Query-Bild nicht gefunden: {query_image_path}"

    # 1. Ähnliche Bilder finden
    similar_images = search_similar_images(components, query_image_path, k)

    if not similar_images:
        return "❌ Keine ähnlichen Bilder gefunden"

    # 2. Bildbeschreibungen aus text_collection holen
    image_descriptions = []
    for img in similar_images:
        img_path = img.get('path', '')
        if img_path:
            try:
                text_docs = components.text_collection.get(
                    where={
                        "$and": [
                            {"source": img_path},
                            {"doc_type": "image_description"}
                        ]
                    }
                )
                if text_docs['ids']:
                    image_descriptions.append({
                        'content': text_docs['documents'][0],
                        'metadata': text_docs['metadatas'][0],
                        'similarity': img['similarity']
                    })
            except Exception as e:
                print(f"⚠️ Fehler beim Abrufen der Beschreibung für {img.get('filename', 'Unbekannt')}: {e}")
                continue

    if not image_descriptions:
        return "❌ Keine Textbeschreibungen für ähnliche Bilder gefunden"

    # 3. Semantische Textsuche basierend auf Bildbeschreibungen
    # Erstelle Suchquery aus den Bildbeschreibungen
    search_query = " ".join([desc['content'] for desc in image_descriptions[:2]])

    print(f"🔍 Suche nach relevanten Text-Dokumenten basierend auf Bildbeschreibungen...")

    # Suche Text-Dokumente (nicht Bildbeschreibungen)
    try:
        docs_with_scores = components.text_collection.similarity_search_with_score(
            search_query,
            k=k_text * 2
        )

        # Filtere nur echte Text-Dokumente (keine Bildbeschreibungen)
        text_documents = []
        for doc, score in docs_with_scores:
            if doc.metadata.get('doc_type') == 'text_document':
                similarity = max(0, 1 - (score / 2))
                if similarity >= 0.3:  # Mindest-Ähnlichkeit
                    text_documents.append({
                        'content': doc.page_content,
                        'filename': doc.metadata.get('filename', 'Unbekannt'),
                        'similarity': round(similarity, 3)
                    })
                    if len(text_documents) >= k_text:
                        break

        print(f"✅ {len(text_documents)} relevante Text-Dokumente gefunden\n")

    except Exception as e:
        print(f"⚠️ Fehler bei Textsuche: {e}")
        text_documents = []

    # 4. LLM-Zusammenfassung generieren
    try:
        # Kontext für Bilder
        image_context_parts = []
        for desc in image_descriptions:
            image_context_parts.append(
                f"Bild: {desc['metadata'].get('filename', 'Unbekannt')} "
                f"(Ähnlichkeit: {desc['similarity']})\n{desc['content']}"
            )

        image_context = "\n\n---\n\n".join(image_context_parts)

        # Kontext für Text-Dokumente
        text_context = ""
        if text_documents:
            text_context_parts = [
                f"Dokument: {doc['filename']} (Ähnlichkeit: {doc['similarity']})\n{doc['content'][:500]}"
                for doc in text_documents
            ]
            text_context = "\n\n---\n\n".join(text_context_parts)

        # Prompt für LLM
        prompt = f"""Du hast ein Query-Bild erhalten. Basierend auf visueller Ähnlichkeit und semantischer Suche wurden folgende Informationen gefunden.

Visuell ähnliche Bilder und ihre Beschreibungen:
{image_context}

{'Relevante Text-Dokumente:' if text_documents else '(Keine relevanten Text-Dokumente gefunden)'}
{text_context if text_documents else ''}

Aufgabe:
Erstelle eine prägnante Zusammenfassung der wichtigsten Informationen, die zum Query-Bild passen.
Beschreibe Gemeinsamkeiten, wichtige Merkmale und relevante Kontextinformationen aus den Texten."""

        response = components.llm.invoke(prompt).content

        # Klar strukturierte Ausgabe
        result = f"### 🤖 LLM-Antwort\n\n{response}\n\n"

        # Bild-Quellen (visuell ähnlich via CLIP)
        result += f"### 🔍 Verwendete Quellen (visuell ähnliche Bilder via CLIP)\n"
        for i, img in enumerate(similar_images, 1):
            result += f"   {i}. {img['filename']} (Ähnlichkeit: {img['similarity']})\n"
            if img['description']:
                result += f"      📝 {img['description'][:300]}...\n"

        # Text-Dokumente (via semantische Suche basierend auf Bildbeschreibungen)
        result += f"\n### 📚 Relevante Text-Dokumente (via semantische Suche)\n"
        if text_documents:
            for i, doc in enumerate(text_documents, 1):
                result += f"   {i}. {doc['filename']} (Ähnlichkeit: {doc['similarity']})\n"
                result += f"      📄 {doc['content'][:200]}...\n"
        else:
            result += f"   ℹ️ Keine relevanten Text-Dokumente gefunden\n"

        return result

    except Exception as e:
        print(f"❌ Fehler bei Textgenerierung: {e}")
        return f"❌ Fehler bei der Verarbeitung: {e}"


def multimodal_search_by_image(components, query_image_path, k_similar_images=5, k_text=5, k_related_images=3):
    """
    Erweiterte multimodale Suche mit Bild als Query

    Kombiniert:
    - Visuelle Ähnlichkeitssuche (Bild → Bild via CLIP)
    - Semantische Textsuche basierend auf Bildbeschreibungen
    - Cross-Modal-Retrieval (Bild → verwandte Bilder über Text)

    Args:
        components: RAG-System-Komponenten
        query_image_path: Pfad zum Query-Bild
        k_similar_images: Anzahl visuell ähnlicher Bilder (via CLIP)
        k_text: Anzahl relevanter Text-Dokumente
        k_related_images: Anzahl verwandter Bilder (via Cross-Modal)

    Returns:
        Formatierter String mit allen Ergebnissen und LLM-Antwort
    """
    path = Path(query_image_path)

    if not path.exists():
        return f"❌ Query-Bild nicht gefunden: {query_image_path}"

    # 1. Visuell ähnliche Bilder finden (via CLIP)
    similar_images = search_similar_images(components, query_image_path, k_similar_images)

    if not similar_images:
        return "❌ Keine ähnlichen Bilder gefunden"

    # 2. Bildbeschreibungen sammeln
    image_descriptions = []
    for img in similar_images:
        img_path = img.get('path', '')
        if img_path:
            try:
                text_docs = components.text_collection.get(
                    where={
                        "$and": [
                            {"source": img_path},
                            {"doc_type": "image_description"}
                        ]
                    }
                )
                if text_docs['ids']:
                    image_descriptions.append({
                        'content': text_docs['documents'][0],
                        'metadata': text_docs['metadatas'][0],
                        'similarity': img['similarity'],
                        'filename': img['filename']
                    })
            except Exception as e:
                continue

    if not image_descriptions:
        return "❌ Keine Bildbeschreibungen gefunden"

    # 3. Semantische Suche basierend auf Bildbeschreibungen
    search_query = " ".join([desc['content'] for desc in image_descriptions[:3]])

    try:
        docs_with_scores = components.text_collection.similarity_search_with_score(
            search_query,
            k=k_text * 2
        )

        # Text-Dokumente und Bildbeschreibungen trennen
        text_documents = []
        related_image_descriptions = []

        for doc, score in docs_with_scores:
            similarity = max(0, 1 - (score / 2))
            if similarity >= 0.3:
                doc_type = doc.metadata.get('doc_type', 'text_document')

                if doc_type == 'text_document':
                    text_documents.append({
                        'content': doc.page_content,
                        'filename': doc.metadata.get('filename', 'Unbekannt'),
                        'similarity': round(similarity, 3)
                    })
                elif doc_type == 'image_description':
                    # Verhindere Duplikate von bereits gefundenen visuell ähnlichen Bildern
                    img_filename = doc.metadata.get('filename', '')
                    if img_filename not in [img['filename'] for img in similar_images]:
                        related_image_descriptions.append({
                            'content': doc.page_content,
                            'filename': img_filename,
                            'similarity': round(similarity, 3),
                            'image_doc_id': doc.metadata.get('image_doc_id')
                        })

                if len(text_documents) >= k_text and len(related_image_descriptions) >= k_related_images:
                    break

        text_documents = text_documents[:k_text]
        related_image_descriptions = related_image_descriptions[:k_related_images]

    except Exception as e:
        print(f"⚠️ Fehler bei semantischer Suche: {e}")
        text_documents = []
        related_image_descriptions = []

    # 4. Hole Bild-Metadaten für verwandte Bilder (via Cross-Modal)
    cross_modal_images = []
    if related_image_descriptions:
        for desc in related_image_descriptions:
            img_doc_id = desc.get('image_doc_id')
            if img_doc_id:
                try:
                    image_data = components.image_collection.get(ids=[img_doc_id])
                    if image_data['ids']:
                        img_metadata = image_data['metadatas'][0]
                        cross_modal_images.append({
                            'filename': img_metadata.get('filename', 'Unbekannt'),
                            'path': img_metadata.get('source', ''),
                            'description': img_metadata.get('description', ''),
                            'similarity': desc['similarity']
                        })
                except Exception:
                    continue

    # 5. LLM-Antwort generieren
    try:
        # Kontext zusammenstellen
        context_parts = []

        # Visuell ähnliche Bilder
        if image_descriptions:
            context_parts.append("VISUELL ÄHNLICHE BILDER:")
            for desc in image_descriptions[:3]:
                context_parts.append(
                    f"- {desc['filename']} (Ähnlichkeit: {desc['similarity']})\n  {desc['content']}"
                )

        # Text-Dokumente
        if text_documents:
            context_parts.append("\nRELEVANTE TEXT-DOKUMENTE:")
            for doc in text_documents:
                context_parts.append(
                    f"- {doc['filename']} (Ähnlichkeit: {doc['similarity']})\n  {doc['content'][:400]}"
                )

        # Verwandte Bilder (Cross-Modal)
        if cross_modal_images:
            context_parts.append("\nVERWANDTE BILDER (via semantische Ähnlichkeit):")
            for img in cross_modal_images:
                context_parts.append(
                    f"- {img['filename']} (Ähnlichkeit: {img['similarity']})\n  {img['description'][:300]}"
                )

        context = "\n\n".join(context_parts)

        # LLM-Prompt
        prompt = f"""Du analysierst ein Query-Bild. Basierend auf visueller Ähnlichkeit (CLIP) und semantischer Suche wurden folgende Informationen gefunden.

{context}

Aufgabe:
Erstelle eine prägnante, strukturierte Antwort über die wichtigsten Informationen zum Query-Bild.
Beschreibe:
1. Was das Query-Bild wahrscheinlich zeigt (basierend auf visuell ähnlichen Bildern)
2. Relevante Kontextinformationen aus den Text-Dokumenten
3. Zusammenhänge und wichtige Erkenntnisse

Antworte präzise und informativ."""

        llm_response = components.llm.invoke(prompt).content

        # Formatierte Ausgabe
        result = f"### 🤖 LLM-Antwort (Query-Bild: {path.name})\n\n{llm_response}\n\n"

        # Visuell ähnliche Bilder (via CLIP)
        result += f"### 🔍 Visuell ähnliche Bilder (via CLIP)\n"
        for i, img in enumerate(similar_images, 1):
            result += f"   {i}. {img['filename']} (Ähnlichkeit: {img['similarity']})\n"
            if img.get('description'):
                result += f"      📝 {img['description'][:250]}...\n"

        # Text-Dokumente
        result += f"\n### 📚 Relevante Text-Dokumente (via semantische Suche)\n"
        if text_documents:
            for i, doc in enumerate(text_documents, 1):
                result += f"   {i}. {doc['filename']} (Ähnlichkeit: {doc['similarity']})\n"
                result += f"      📄 {doc['content'][:200]}...\n"
        else:
            result += "   ℹ️ Keine relevanten Text-Dokumente gefunden\n"

        # Verwandte Bilder (Cross-Modal)
        if cross_modal_images:
            result += f"\n### 🖼️ Verwandte Bilder (via Cross-Modal-Retrieval)\n"
            for i, img in enumerate(cross_modal_images, 1):
                result += f"   {i}. {img['filename']} (Ähnlichkeit: {img['similarity']})\n"
                if img.get('description'):
                    result += f"      📝 {img['description'][:250]}...\n"

        return result

    except Exception as e:
        return f"❌ Fehler bei der Verarbeitung: {e}"


def multimodal_search(components, query, k_text=3, k_images=3, enable_cross_modal=True):
    """
    Führt erweiterte multimodale Suche durch

    Kombiniert:
    - Text-Suche (inkl. Bildbeschreibungen)
    - CLIP-basierte Bildsuche
    - Cross-Modal-Retrieval (Text → Bild über Beschreibungen)

    Args:
        components: RAG-System-Komponenten
        query: Suchanfrage
        k_text: Anzahl Text-Ergebnisse
        k_images: Anzahl Bild-Ergebnisse
        enable_cross_modal: Cross-Modal-Retrieval aktivieren

    Returns:
        Formatierter String mit allen Ergebnissen
    """
    # FIX 3: Text-Suche nur EINMAL durchführen und Ergebnisse wiederverwenden
    docs_with_scores = components.text_collection.similarity_search_with_score(query, k=k_text*2)

    # Konvertiere Scores zu Ähnlichkeiten
    docs_with_similarity = []
    for doc, score in docs_with_scores:
        similarity = max(0, 1 - (score / 2))
        docs_with_similarity.append((doc, similarity))

    docs_with_similarity.sort(key=lambda x: x[1], reverse=True)

    # Filtern nach Mindest-Ähnlichkeit
    min_similarity = 0.3
    relevant_docs = [(doc, sim) for doc, sim in docs_with_similarity[:k_text]
                     if sim >= min_similarity]

    # 1. Text-Ergebnisse formatieren (ohne nochmalige Suche)
    if not relevant_docs:
        text_results = "❌ Keine ausreichend ähnlichen Dokumente gefunden"
    else:
        # Dokumente nach Typ trennen
        text_docs = []
        image_desc_docs = []

        for doc, sim in relevant_docs:
            doc_type = doc.metadata.get("doc_type", "text_document")
            if doc_type == "image_description":
                image_desc_docs.append((doc, sim))
            elif doc_type == "text_document":
                text_docs.append((doc, sim))

        # Kontext für LLM zusammenstellen
        all_docs = text_docs + image_desc_docs
        context = "\n\n---\n\n".join([doc.page_content for doc, _ in all_docs])

        # Quellen sammeln
        sources = [
            {
                "filename": doc.metadata.get("filename", "Unbekannt"),
                "similarity": round(sim, 3),
                "type": doc.metadata.get("doc_type", "text_document"),
                "image_doc_id": doc.metadata.get("image_doc_id")
            }
            for doc, sim in all_docs
        ]

        # LLM-Antwort generieren
        prompt = f"""Beantworte die Frage präzise basierend auf dem Kontext.

KONTEXT:
{context}

FRAGE: {query}

ANTWORT:"""

        llm_response = components.llm.invoke(prompt).content

        # Quellen nach Typ trennen
        text_sources = [s for s in sources if s['type'] == 'text_document']
        image_desc_sources = [s for s in sources if s['type'] == 'image_description']

        # Strukturiere Ergebnisse für spätere Ausgabe
        text_results = {
            'llm_response': llm_response,
            'text_sources': text_sources,
            'image_desc_sources': image_desc_sources
        }

    # 2. Direkte Bild-Suche über CLIP (nutzt interne Funktion für raw data)
    image_results = _get_images_raw(components, query, k_images)

    # 3. Cross-Modal-Retrieval (FIX 2: N+1 Query Problem behoben)
    cross_modal_images = []
    if enable_cross_modal and docs_with_scores:
        # FIX 2: IDs direkt aus docs_with_scores extrahieren statt zusätzliche get() Calls
        image_desc_docs_for_retrieval = [
            (doc, sim) for doc, sim in docs_with_similarity
            if doc.metadata.get('doc_type') == 'image_description'
        ]

        if image_desc_docs_for_retrieval:
            # Extrahiere image_doc_ids direkt aus den Metadaten
            image_doc_ids = [
                doc.metadata.get('image_doc_id')
                for doc, _ in image_desc_docs_for_retrieval
                if doc.metadata.get('image_doc_id')
            ]

            # Hole Bilder für diese IDs (ein einziger Batch-Call statt N einzelne)
            if image_doc_ids:
                try:
                    image_data = components.image_collection.get(ids=image_doc_ids)

                    for img_id, img_metadata in zip(image_data['ids'], image_data['metadatas']):
                        cross_modal_images.append({
                            'filename': img_metadata.get('filename', 'Unbekannt'),
                            'path': img_metadata.get('source', ''),
                            'description': img_metadata.get('description', ''),
                            'source': 'cross_modal_retrieval'
                        })
                except Exception as e:
                    print(f"⚠️ Fehler beim Cross-Modal-Retrieval: {e}")

            # Limitiere auf k_images
            cross_modal_images = cross_modal_images[:k_images]

    # Ergebnisse klar strukturiert ausgeben
    result = ""

    # 1. LLM-ANTWORT
    if isinstance(text_results, dict):
        result += f"### 🤖 LLM-Antwort\n\n"
        result += f"{text_results['llm_response']}\n\n"

        # 2. QUELLEN AUS TEXTSUCHE
        result += f"### 📚 Verwendete Quellen (via semantische Textsuche)\n"

        if text_results['text_sources']:
            result += f"\n   📄 Text-Dokumente ({len(text_results['text_sources'])}):\n"
            for i, src in enumerate(text_results['text_sources'], 1):
                result += f"      {i}. {src['filename']} (Ähnlichkeit: {src['similarity']})\n"

        if text_results['image_desc_sources']:
            result += f"\n   🖼️ Bildbeschreibungen ({len(text_results['image_desc_sources'])}):\n"
            for i, src in enumerate(text_results['image_desc_sources'], 1):
                result += f"      {i}. {src['filename']} (Ähnlichkeit: {src['similarity']})\n"

        if not text_results['text_sources'] and not text_results['image_desc_sources']:
            result += "   ℹ️ Keine Quellen gefunden\n"

        result += "\n"
    else:
        # Falls keine relevanten Dokumente gefunden wurden
        result += f"### 📚 Text-Suche\n\n{text_results}\n\n"

    # 3. BILDER VIA CLIP (direkte visuelle Suche)
    result += f"### 🔍 Bilder via CLIP (direkte visuelle Ähnlichkeitssuche)\n"
    if image_results:
        for i, img in enumerate(image_results, 1):
            result += f"   {i}. {img['filename']} (Ähnlichkeit: {img['similarity']})\n"
            if img['description']:
                result += f"      📝 {img['description'][:300]}...\n"
    else:
        result += "   ℹ️ Keine visuell ähnlichen Bilder via CLIP gefunden\n"

    result += "\n"

    # 4. CROSS-MODAL RETRIEVAL (Text → Bild Verknüpfung)
    result += f"### 🔗 Bilder via Cross-Modal Retrieval (Text → Bild Verknüpfung)\n"
    if cross_modal_images:
        for i, img in enumerate(cross_modal_images, 1):
            result += f"   {i}. {img['filename']}\n"
            if img['description']:
                result += f"      📝 {img['description'][:300]}...\n"
    else:
        result += "   ℹ️ Keine Bilder via Cross-Modal-Retrieval gefunden\n"

    return result


# ============================================================================
# HILFSFUNKTIONEN
# ============================================================================

def get_system_status(components):
    """Gibt System-Status zurück"""
    text_data = components.text_collection.get()
    all_text_count = len(text_data['ids'])

    text_docs_count = sum(1 for meta in text_data['metadatas']
                         if meta.get('doc_type') == 'text_document')
    image_desc_count = sum(1 for meta in text_data['metadatas']
                          if meta.get('doc_type') == 'image_description')

    image_count = components.image_collection.count()

    return {
        "text_chunks": text_docs_count,
        "image_descriptions": image_desc_count,
        "images": image_count,
        "total_text_entries": all_text_count,
        "total_documents": all_text_count + image_count
    }


def cleanup_database(db_path='./multimodal_rag_db'):
    """Löscht die Datenbank komplett"""
    if Path(db_path).exists():
        shutil.rmtree(db_path)
        print(f"🗑️ Datenbank gelöscht: {db_path}")