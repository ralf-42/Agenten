---
layout: default
title: API-Keys & Provider
parent: Ressourcen
nav_order: 2
description: Übersicht über LLM-Provider, API-Keys und Colab-Integration
has_toc: true
---

# API-Keys & Provider
{: .no_toc }

> **LLM-Provider im Überblick**
> Kostenlose API-Keys, Zahlungsweisen und Google Colab Integration

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Übersicht der LLM-Provider

Diese Tabelle bietet eine Übersicht (Stand: 12.2025) über LLM-Provider mit ihren Zahlungsweisen, kostenlosen Optionen und der Integration in Google Colab.

| Model Provider          | Integration Package           | Zahlungsweisen                    | PayPal verfügbar? | Kostenloser API-Key?       | Hinweise / Besonderheiten                                                  |
| ----------------------- | ----------------------------- | --------------------------------- | ----------------- | -------------------------- | -------------------------------------------------------------------------- |
| openai                  | langchain-openai              | Kreditkarte, PayPal (ab 2026)     | Ja (zukünftig)    | Nein (begrenztes Freemium) | Weit verbreitet, stabil, offizielle PayPal-Koordination mit Agent Toolkit. |
| anthropic               | langchain-anthropic           | Kreditkarte                       | Nein              | Ja (Freemium)              | Fokus auf Sicherheit und RLHF, PayPal aktuell nicht unterstützt.           |
| azure_openai            | langchain-openai              | Kreditkarte, Microsoft Abrechnung | Nein              | Nein                       | Azure-Wrapper für OpenAI, keine PayPal-Zahlung.                            |
| azure_ai                | langchain-azure-ai            | Kreditkarte, Rechnung             | Nein              | Ja (Freemium)              | Microsoft Azure KI-Dienste, Enterprise-fokussiert.                         |
| google_vertexai         | langchain-google-vertexai     | Kreditkarte, PayPal               | Ja                | Ja (hohe Limits)           | Google Cloud, Gemini Modelle, PayPal möglich.                              |
| google_genai            | langchain-google-genai        | Kreditkarte, PayPal               | Ja                | Ja (hohe Limits)           | Google Generative AI mit nativer Cloud-Integration.                        |
| bedrock                 | langchain-aws                 | Kreditkarte                       | Nein              | Nein                       | AWS Bedrock Modelle, keine PayPal-Unterstützung.                           |
| bedrock_converse        | langchain-aws                 | Kreditkarte                       | Nein              | Nein                       | AWS Conversational Endpoints, kein PayPal.                                 |
| cohere                  | langchain-cohere              | Kreditkarte                       | Nein              | Ja (Freemium)              | Gute Text- und Embedding-Leistung.                                         |
| fireworks               | langchain-fireworks           | Kreditkarte                       | Nein              | Ja                         | Multimodale Anwendungsfälle, kein PayPal.                                  |
| together                | langchain-together            | Kreditkarte                       | Nein              | Ja (Freemium)              | Community-getriebene Modelle.                                              |
| mistralai               | langchain-mistralai           | Kreditkarte                       | Nein              | Ja                         | Effiziente Open-Source-Modelle.                                            |
| huggingface             | langchain-huggingface         | Kreditkarte, Open Source          | Nein              | Ja                         | Zugang zum Huggingface Hub, große Modellvielfalt.                          |
| groq                    | langchain-groq                | Kreditkarte                       | Nein              | Ja (gute Ratenlimits)      | Hochleistungs-Hardwareoptimierte Modelle.                                  |
| ollama                  | langchain-ollama              | Lokalinstallation                 | Nein              | Ja                         | Lokal laufende Modelle, keine Cloudabhängigkeit.                           |
| google_anthropic_vertex | langchain-google-vertexai     | Kreditkarte, PayPal               | Ja                | Ja                         | Google Vertex AI mit Anthropic Modellen.                                   |
| deepseek                | langchain-deepseek            | PayPal (limitierte Länder)        | Ja                | Ja                         | Nur PayPal-Zahlung, API-Key Nutzung via PayPal-Authentifizierung.          |
| ibm                     | langchain-ibm                 | Kreditkarte                       | Nein              | Nein                       | IBM Watson KI, hauptsächlich Enterprise.                                   |
| nvidia                  | langchain-nvidia-ai-endpoints | Kreditkarte                       | Nein              | Nein                       | NVIDIA KI mit Hardwarefokus.                                               |
| xai                     | langchain-xai                 | Kreditkarte                       | Nein              | Nein                       | Fokus auf erklärbare KI.                                                   |
| perplexity              | langchain-perplexity          | Kreditkarte                       | Nein              | Ja                         | Dynamische Wissensextraktion, Websuche-basiert.                            |

---

## Google Colab Integration

### Sichere API-Key Verwaltung in Colab

**Best Practice: Colab Secrets verwenden**

{: .warning }
> **LangSmith (EU/US-Endpunkte):** Wenn Sie LangSmith nutzen, legen Sie Account und API-Key im **EU-Workspace** an (`https://eu.smith.langchain.com/`) und verwenden Sie als `LANGCHAIN_ENDPOINT` den EU-API-Endpoint `https://eu.api.smith.langchain.com`.

```python
# Installiere benötigte Bibliothek
!pip install langchain-{provider}
```

**So speichern Sie Keys in Colab Secrets:**
1. Klicken Sie auf das Schlüssel-Symbol 🔑 in der linken Sidebar
2. Fügen Sie Ihren API-Key hinzu (z.B. `OPENAI_API_KEY`)


### Provider-spezifische Installation

**OpenAI:**
```python
!pip install langchain-openai
from langchain.chat_models import init_chat_model
llm = init_chat_model("openai:gpt-4o-mini", temperature=0.0)
```

**Google Gemini:**
```python
!pip install langchain-google-genai
from langchain.chat_models import init_chat_model
llm = init_chat_model("google:gemini-pro", temperature=0.0)
```

**Groq:**
```python
!pip install langchain-groq
from langchain.chat_models import init_chat_model
llm = init_chat_model("groq:mixtral-8x7b-32768", temperature=0.0)
```

---

## Kostenlose Provider-Empfehlungen

### Für Anfänger & Studenten

**1. Google AI Studio (Gemini)**
- ✅ **Komplett kostenlos** mit hohen Limits
- ✅ **PayPal-Zahlung** möglich
- ✅ **Native Colab-Integration**
- ✅ **Multimodal** (Text, Bild, Audio)

**2. Groq**
- ✅ **Sehr schnell** (Hardware-beschleunigt)
- ✅ **Großzügige kostenlose Limits**
- ✅ **Open-Source-Modelle** (Llama, Mixtral)

**3. Cloudflare Workers AI**
- ✅ **Vollständig kostenlos** (mit Limits)
- ✅ **Keine Kreditkarte nötig**
- ✅ **Mehrere Modelle verfügbar**

### Für Produktivnutzung

**OpenAI (GPT-4)**
- 💰 **Pay-as-you-go** (ab 5$)
- ✅ **Beste Qualität** für komplexe Aufgaben
- ✅ **PayPal ab 2026**

**Together AI**
- 💰 **Freemium** mit kostenlosen Credits
- ✅ **Open-Source-Modelle** zu günstigen Preisen

---

## Lokale Modelle ohne API-Keys

### Ollama in Google Colab

Für vollständige Kontrolle und keine API-Kosten:

```python
# Ollama in Colab installieren (mit GPU-Unterstützung)
!curl -fsSL https://ollama.com/install.sh | sh
!ollama serve &
!ollama pull llama3

# Mit LangChain verwenden
from langchain_community.llms import Ollama
llm = Ollama(model="llama3")
```

**Vorteile:**
- ✅ Keine API-Kosten
- ✅ Vollständige Datenkontrolle
- ✅ Offline-fähig
- ✅ GPU-beschleunigt in Colab

**Nachteile:**
- ⚠️ Langsamere Performance als Cloud-APIs
- ⚠️ Begrenzte Modellgröße (RAM-Limits)

---

## Sicherheitshinweise

### ❌ NIEMALS:
- API-Keys in Code oder Notebooks committen
- Keys in öffentlichen Repositories veröffentlichen
- Keys unverschlüsselt in Dateien speichern

### ✅ IMMER:
- `.env`-Dateien für lokale Entwicklung verwenden
- Colab Secrets für Notebooks nutzen
- API-Keys regelmäßig rotieren
- Nutzungslimits überwachen

---

## Weiterführende Links

- [OpenAI Platform](https://platform.openai.com/)
- [Google AI Studio](https://makersuite.google.com/)
- [Groq Cloud](https://console.groq.com/)
- [Together AI](https://www.together.ai/)
- [Ollama](https://ollama.com/)
- [LangChain Provider Documentation](https://python.langchain.com/docs/integrations/chat/)

---

**Version:** 1.0
**Letzte Aktualisierung:** Dezember 2025

