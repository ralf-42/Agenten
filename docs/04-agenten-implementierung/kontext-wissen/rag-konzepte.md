---
layout: default
title: RAG-Konzepte
parent: Kontext & Wissen
grand_parent: Agenten-Implementierung
nav_order: 4
description: "RAG-Konzepte für Agenten: Retrieval, Chunking, Embeddings, Reranking und Grounding"
has_toc: true
---

# RAG-Konzepte
{: .no_toc }

> **Retrieval Augmented Generation im Detail – Architektur, Strategien und Best Practices**

> [!NOTE] Bezug zum Kursprojekt<br>
> Der [PMO-Assistent]({{ '/02-orientierung-entscheidung/pmo-assistent.html' | relative_url }}) nutzt RAG, um Aussagen zu Projektständen mit Passagen aus Protokollen und Entscheidungsunterlagen zu belegen. Das Kursprojekt macht damit auch sichtbar, wann die Quellen keine belastbare Antwort liefern.

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Überblick: Was ist RAG?

Ein Sprachmodell kennt weder automatisch aktuelle Informationen noch internes Fachwissen. Auch lange Dokumentbestände passen nicht vollständig in einen Prompt. RAG ruft deshalb zur Laufzeit passende Inhalte aus einer Wissensbasis ab und stellt sie dem Modell für die Antwort bereit.

Die folgende Tabelle bündelt diese Ausgangslage, ersetzt aber nicht die eigentliche Entscheidung. RAG lohnt sich nur dann, wenn fehlendes oder externes Wissen wirklich das Problem ist. Wenn die Aufgabe bereits mit vorhandenem Modellwissen sauber lösbar ist, macht Retrieval den Ablauf oft nur langsamer und fehleranfälliger.

| Limitation | Beschreibung |
|------------|--------------|
| **Wissens-Cutoff** | Das Modell kennt nur Informationen bis zum Trainingszeitpunkt |
| **Kein Domänenwissen** | Firmeninterne Dokumente, Fachrichtlinien oder aktuelle Daten fehlen |
| **Halluzination** | Bei Wissenslücken werden plausible, aber falsche Antworten generiert |
| **Kontextlimit** | Nicht alle relevanten Dokumente passen in einen einzelnen Prompt |

Retrieval Augmented Generation ergänzt das Modell also nicht durch neues Training, sondern durch einen zusätzlichen Arbeitsschritt: Zuerst wird gesucht, dann erst formuliert. In Trainings zeigt sich oft, dass genau diese Trennung Missverständnisse aufdeckt. Ist die Suche schlecht, wird auch die Antwort schlecht. RAG verschiebt das Problem deshalb nicht weg, sondern macht sichtbar, wo die eigentliche Schwäche liegt: im Retrieval, im Chunking oder in der Kontextzusammenstellung.

```
Frage → Suche relevante Dokumente → Füge Kontext zum Prompt → LLM generiert Antwort
```

> [!NOTE] Kernidee RAG<br>
> Das LLM erhält genau die Informationen, die es für die aktuelle Frage benötigt – nicht mehr und nicht weniger. Ohne passenden Kontext halluziniert das Modell stattdessen eine Antwort.

---

## Die RAG-Architektur

Ein RAG-System besteht aus zwei Hauptphasen: **Indexierung** und **Retrieval + Generation**. Diese Trennung ist wichtig, weil Fehler in der ersten Phase später oft wie Modellfehler aussehen. Wenn Chunks unsauber gebildet oder Metadaten schlecht gepflegt sind, hilft auch ein starkes Modell kaum noch.

### Indexierungsphase

```mermaid
flowchart LR
    A[Dokumente] --> B[Laden]
    B --> C[Chunking]
    C --> D[Embedding]
    D --> E[Vektordatenbank]
```

| Schritt | Beschreibung | Typische Tools |
|---------|--------------|----------------|
| **Laden** | Dokumente aus verschiedenen Quellen einlesen | TextLoader, PyPDFLoader, WebBaseLoader |
| **Chunking** | Große Dokumente in kleinere Teile zerlegen | RecursiveCharacterTextSplitter |
| **Embedding** | Textchunks in Vektoren umwandeln | OpenAIEmbeddings, HuggingFaceEmbeddings |
| **Speichern** | Vektoren in Datenbank ablegen | ChromaDB, FAISS, Pinecone |

### Abfragephase

```mermaid
flowchart LR
    A[Frage] --> B[Embedding]
    B --> C[Similarity Search]
    C --> D[Top-k Dokumente]
    D --> E[Prompt + Kontext]
    E --> F[LLM]
    F --> G[Antwort]
```

| Schritt | Beschreibung |
|---------|--------------|
| **Query-Embedding** | Die Frage wird in denselben Vektorraum transformiert |
| **Similarity Search** | Die ähnlichsten Dokumentvektoren werden gefunden |
| **Kontext-Erstellung** | Gefundene Chunks werden zum Prompt hinzugefügt |
| **Generation** | Das LLM generiert eine Antwort basierend auf dem Kontext |

---

## Chunking: Dokumente sinnvoll zerlegen

Chunking teilt Dokumente in Einheiten, die sich indexieren und später abrufen lassen. Größe, Trennstellen und Überlappung beeinflussen, ob ein Treffer genug Zusammenhang für eine belastbare Antwort enthält.

Strategien, Tokenizer, Parameter und dokumenttypspezifische Beispiele stehen im Vertiefungskapitel [Tokenizing & Chunking](./tokenizing-chunking.html). Hier genügt die Einordnung: Chunking ist Teil der Indexierung und sollte anhand der späteren Retrieval-Qualität bewertet werden.

---

## Embeddings: Text als Vektor

Ein Embedding bildet Text als Vektor ab. Dadurch kann semantische Suche auch inhaltlich ähnliche Begriffe finden, selbst wenn Frage und Dokument nicht dieselben Wörter verwenden.

Modelle, Vektordimensionen und Ähnlichkeitsmaße werden im Fachkapitel [Embeddings](./embeddings.html) erklärt. Für den RAG-Ablauf ist hier entscheidend: Dokumente und Anfragen müssen mit kompatiblen Embedding-Modellen repräsentiert werden.

---

## Retrieval: Die richtigen Dokumente finden

Der Retriever ist die eigentliche Arbeitsstelle des Systems. Hier entscheidet sich, ob eine Frage brauchbaren Kontext erhält oder nur ähnlich klingendes Material. Viele frühe RAG-Demos wirken überzeugend, weil die Fragen freundlich gewählt sind. Unter realen Bedingungen zeigt sich dann, ob das Retrieval auch bei unklaren Formulierungen, Synonymen oder Mischanfragen noch trägt.

### Basis-Retrieval: Similarity Search

```mermaid
flowchart LR
    A[Dokumente] --> B[Laden]
    B --> C[Chunking]
    C --> D[Embedding]
    D --> E[Vektordatenbank]
```
### Retrieval-Strategien im Vergleich

| Strategie | Beschreibung | Vorteil | Nachteil |
|-----------|--------------|---------|----------|
| **Similarity** | Ähnlichste Vektoren | Schnell, einfach | Keine Qualitätsgarantie |
| **MMR** | Maximum Marginal Relevance | Diversität der Ergebnisse | Etwas langsamer |
| **Threshold** | Nur Ergebnisse über Schwellenwert | Qualitätskontrolle | Kann leer zurückkommen |
| **Hybrid** | Keyword + Semantisch kombiniert | Beste Abdeckung | Komplexer aufzusetzen |

> [!DANGER] Threshold-Retrieval: leerer Kontext<br>
> Gibt der Threshold-Retriever keine Treffer zurück, erhält das LLM leeren Kontext — und halluziniert eine Antwort, anstatt "keine Information" zu melden. Immer ein Fallback definieren, wenn `similarity_score_threshold` verwendet wird.

### Maximum Marginal Relevance (MMR)

MMR balanciert Relevanz und Diversität. Statt nur die ähnlichsten Dokumente zurückzugeben, werden auch unterschiedliche Perspektiven berücksichtigt.

```mermaid
flowchart LR
    A[Dokumente] --> B[Laden]
    B --> C[Chunking]
    C --> D[Embedding]
    D --> E[Vektordatenbank]
```
### Score-basiertes Filtering

```mermaid
flowchart LR
    A[Dokumente] --> B[Laden]
    B --> C[Chunking]
    C --> D[Embedding]
    D --> E[Vektordatenbank]
```
### Metadaten-Filter

```mermaid
flowchart LR
    A[Dokumente] --> B[Laden]
    B --> C[Chunking]
    C --> D[Embedding]
    D --> E[Vektordatenbank]
```
---

## Reranking: Ergebnisse optimieren

Reranking verbessert die Qualität der gefundenen Dokumente durch einen zweiten Bewertungsschritt.

### Warum Reranking?

Die initiale Vektorsuche ist schnell, aber nicht perfekt. Reranking verwendet ein präziseres (aber langsameres) Modell, um die Top-Ergebnisse neu zu ordnen.

```mermaid
flowchart LR
    A[Dokumente] --> B[Laden]
    B --> C[Chunking]
    C --> D[Embedding]
    D --> E[Vektordatenbank]
```
### Reranking-Ansätze

| Ansatz | Beschreibung | Performance |
|--------|--------------|-------------|
| **Cross-Encoder** | Betrachtet Query + Dokument gemeinsam | Höchste Qualität, langsam |
| **LLM-based** | LLM bewertet Relevanz | Flexibel, teuer |
| **Lightweight** | Schnelle Heuristiken | Schnell, moderate Qualität |

### Beispiel: Cohere Reranker

```mermaid
flowchart LR
    A[Dokumente] --> B[Laden]
    B --> C[Chunking]
    C --> D[Embedding]
    D --> E[Vektordatenbank]
```
---

## Advanced RAG-Techniken

Über die Grundlagen hinaus existieren fortgeschrittene Techniken zur Qualitätsverbesserung.

### Query Transformation

Die ursprüngliche Frage wird umformuliert oder erweitert, um bessere Treffer zu erzielen.

**Multi-Query:** Eine Frage wird in mehrere Varianten umgewandelt:

```mermaid
flowchart LR
    A[Dokumente] --> B[Laden]
    B --> C[Chunking]
    C --> D[Embedding]
    D --> E[Vektordatenbank]
```
**HyDE (Hypothetical Document Embedding):** Das LLM generiert eine hypothetische Antwort, die dann für die Suche verwendet wird:

```mermaid
flowchart LR
    A[Dokumente] --> B[Laden]
    B --> C[Chunking]
    C --> D[Embedding]
    D --> E[Vektordatenbank]
```
### Self-Query

Das LLM extrahiert strukturierte Filter aus natürlichsprachlichen Fragen:

```mermaid
flowchart LR
    A[Frage] --> B[Embedding]
    B --> C[Similarity Search]
    C --> D[Top-k Dokumente]
    D --> E[Prompt + Kontext]
    E --> F[LLM]
    F --> G[Antwort]
```
### Contextual Compression

Gefundene Dokumente werden auf das Wesentliche komprimiert:

```mermaid
flowchart LR
    A[Frage] --> B[Embedding]
    B --> C[Similarity Search]
    C --> D[Top-k Dokumente]
    D --> E[Prompt + Kontext]
    E --> F[LLM]
    F --> G[Antwort]
```
### Parent Document Retriever

Kleine Chunks für präzises Retrieval, aber größere Kontextfenster für die Generierung:

```mermaid
flowchart LR
    A[Frage] --> B[Embedding]
    B --> C[Similarity Search]
    C --> D[Top-k Dokumente]
    D --> E[Prompt + Kontext]
    E --> F[LLM]
    F --> G[Antwort]
```
---

## RAG-Chain mit LangChain

Die Kombination aller Komponenten zu einer funktionierenden Pipeline.

### Minimales Beispiel

```mermaid
flowchart LR
    A[Frage] --> B[Embedding]
    B --> C[Similarity Search]
    C --> D[Top-k Dokumente]
    D --> E[Prompt + Kontext]
    E --> F[LLM]
    F --> G[Antwort]
```
### RAG als Agent-Tool

```mermaid
flowchart LR
    A[Frage] --> B[Embedding]
    B --> C[Similarity Search]
    C --> D[Top-k Dokumente]
    D --> E[Prompt + Kontext]
    E --> F[LLM]
    F --> G[Antwort]
```
---

## Evaluierung von RAG-Systemen

Die Qualität eines RAG-Systems muss systematisch gemessen werden, weil eine einzelne gelungene Antwort wenig beweist. RAG kann auf zwei Ebenen scheitern: Der Retriever findet den falschen Kontext, oder das Modell verarbeitet den richtigen Kontext falsch. Deshalb wird nicht nur die finale Antwort bewertet, sondern auch der Weg dorthin.

Für Entwickler reicht zuerst ein kleines, wiederholbares Testset. Nach jeder Änderung an Chunking, Embedding-Modell, Retriever, Prompt oder Quellenbestand wird dasselbe Set erneut ausgeführt. So wird sichtbar, ob eine Änderung wirklich verbessert oder nur andere Fehler erzeugt.

| Ebene | Leitfrage | Einfache Bewertung |
|---|---|---|
| Retrieval | Wurden die passenden Chunks gefunden? | relevant / teilweise / falsch |
| Grounding | Ist die Antwort durch Quellen gedeckt? | belegt / teilweise / nicht belegt |
| Antwort | Wird die Frage fachlich beantwortet? | korrekt / teilweise / falsch |

### Metriken

| Metrik | Misst | Berechnung |
|--------|-------|------------|
| **Retrieval Precision** | Anteil relevanter Dokumente | Relevante / Gefundene |
| **Retrieval Recall** | Abdeckung aller relevanten Dokumente | Gefundene Relevante / Alle Relevanten |
| **Answer Relevance** | Passt Antwort zur Frage? | LLM-Bewertung |
| **Faithfulness** | Ist Antwort durch Kontext gestützt? | LLM-Bewertung |
| **Context Relevance** | Ist der Kontext relevant? | LLM-Bewertung |

### RAGAS Framework

RAGAS (Retrieval Augmented Generation Assessment) bietet standardisierte Metriken:

```mermaid
flowchart LR
    A[Frage] --> B[Embedding]
    B --> C[Similarity Search]
    C --> D[Top-k Dokumente]
    D --> E[Prompt + Kontext]
    E --> F[LLM]
    F --> G[Antwort]
```
### Manuelles Testen

Für erste Iterationen ist manuelles Testen effektiver als ein großes Evaluationsframework. Wichtig ist, die Testfragen nicht nachträglich an die Stärken des Systems anzupassen, sondern typische Nutzerfragen, Randfälle und erwartete Quellen festzuhalten.

```mermaid
flowchart LR
    A[Frage] --> B[Embedding]
    B --> C[Similarity Search]
    C --> D[Top-k Dokumente]
    D --> E[Prompt + Kontext]
    E --> F[LLM]
    F --> G[Antwort]
```
> [!TIP] Vertiefung<br>
> Die einsteigerfreundliche Einordnung steht in [Evaluation & Observability]({{ '/07-qualitaet-sicherheit/evaluation-observability.html' | relative_url }}). Die technische Umsetzung mit Tracing, Datasets und Monitoring ist in [LangSmith Best Practices]({{ '/05-frameworks/langsmith-best-practices.html' | relative_url }}) beschrieben.

---

## Troubleshooting

Häufige Probleme und deren Lösungen.

### Problem: Keine relevanten Dokumente gefunden

| Ursache | Diagnose | Lösung |
|---------|----------|--------|
| Collection leer | Anzahl Dokumente prüfen | Dokumente indexieren |
| Falsches Embedding-Modell | Dimensionen vergleichen | Gleiches Modell für Index und Query |
| Query zu spezifisch | Mit breiterem Begriff testen | Query umformulieren |
| k zu klein | k erhöhen | `k` erhöhen |

### Problem: Falsche Antworten trotz korrektem Kontext

| Ursache | Lösung |
|---------|--------|
| Prompt unklar | Anweisungen präzisieren |
| Zu viel Kontext | Weniger Chunks, Compression nutzen |
| Widersprüchliche Dokumente | Metadaten-Filter für Aktualität |
| Halluzination | Explizite Anweisung: "Nur basierend auf Kontext" |

### Problem: Langsame Antwortzeiten

| Komponente | Optimierung |
|------------|-------------|
| Embedding | Batch-Verarbeitung, Caching |
| Retrieval | Index optimieren, k reduzieren |
| Reranking | Weniger Kandidaten, leichteres Modell |
| LLM | Streaming aktivieren, schnelleres Modell |

---

## Best Practices

### Indexierung

- **Konsistentes Embedding-Modell:** Dasselbe Modell für Indexierung und Queries verwenden
- **Sinnvolles Chunking:** Parameter anhand der [Dokumenttypen und Strategien](./tokenizing-chunking.html) wählen
- **Metadaten anreichern:** Quelle, Datum, Kategorie für späteres Filtern
- **Inkrementelle Updates:** Nur geänderte Dokumente neu indexieren

### Retrieval

- **k sinnvoll wählen:** Zu wenig = fehlender Kontext, zu viel = Rauschen
- **MMR für Diversität:** Bei breiten Themen verschiedene Perspektiven einbeziehen
- **Threshold für Qualität:** Lieber keine Antwort als eine falsche

### Prompt Design

- **Klare Anweisungen:** "Antworte NUR basierend auf dem Kontext"
- **Fallback definieren:** Was tun bei fehlendem Wissen?
- **Quellenangaben:** Antwort mit Dokumentreferenzen anreichern

### Evaluation

- **Test-Dataset erstellen:** Repräsentative Fragen mit erwarteten Antworten
- **Regelmäßig evaluieren:** Nach jedem Update der Wissensbasis
- **Feedback sammeln:** Nutzer-Bewertungen für kontinuierliche Verbesserung
- **Trace prüfen:** Bei falschen Antworten zuerst Retrieval und Prompt-Kontext inspizieren

---

## Zusammenfassung

Eine RAG-Pipeline lädt und indexiert Dokumente, sucht zur Anfrage passende Passagen und übergibt diese als Kontext an das Modell. Die Qualität hängt vom Zusammenspiel der Schritte ab: Indexierung und Chunking beeinflussen die Treffer, Retrieval bestimmt den Kontext, die Generierung muss sich an den gelieferten Quellen orientieren.

| Schritt | Aufgabe | Vertiefung |
|---|---|---|
| Dokumente vorbereiten | Struktur erhalten und passende Chunks bilden | [Tokenizing & Chunking](./tokenizing-chunking.html) |
| Vektoren erzeugen | Dokumente und Anfragen semantisch repräsentieren | [Embeddings](./embeddings.html) |
| Treffer suchen und ordnen | Relevante Passagen auswählen und gegebenenfalls neu sortieren | Dieses Kapitel: Retrieval und Reranking |
| Antwort erstellen und prüfen | Kontext gezielt einsetzen und Qualität messen | [Evaluation & Observability]({{ '/07-qualitaet-sicherheit/evaluation-observability.html' | relative_url }}) |

RAG ergänzt zur Laufzeit eine Wissensquelle. Es macht deren Qualität sichtbar, behebt aber keine Lücken, veralteten Inhalte oder misslungenen Suchanfragen automatisch.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Tokenizing & Chunking]({{ '/04-agenten-implementierung/kontext-wissen/tokenizing-chunking.html' | relative_url }}) | Wie beeinflusst die Aufbereitung der Dokumente die Retrieval-Qualität? |
| [Embeddings]({{ '/04-agenten-implementierung/kontext-wissen/embeddings.html' | relative_url }}) | Wie werden Dokumente und Fragen semantisch vergleichbar gemacht? |
| [Context Engineering]({{ '/04-agenten-implementierung/kontext-wissen/context-engineering.html' | relative_url }}) | Wie fügt sich Retrieval in die größere Kontextlogik eines Systems ein? |
| [Evaluation & Observability]({{ '/07-qualitaet-sicherheit/evaluation-observability.html' | relative_url }}) | Wie wird geprüft, ob Retrieval und Antwortqualität belastbar sind? |

---

**Version:**    1.1<br>
**Stand:** Juli 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.


