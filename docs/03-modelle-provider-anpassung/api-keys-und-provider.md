---
layout: default
title: "API-Keys & Provider"
parent: "Modelle & Provider"
nav_order: 4
description: Übersicht über LLM-Provider, API-Keys und Colab-Integration
has_toc: true
---

# API-Keys & Provider
{: .no_toc }

> [!NOTE] Kernfrage<br>
> Wie bekommen Kursteilnehmende sicher und nachvollziehbar Zugriff auf Modelle?

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Provider im Kurskontext

Für den Kurs zählt zuerst, ob ein Provider zuverlässig im Notebook funktioniert, wie API-Keys verwaltet werden und ob vor der Nutzung Kosten entstehen. Zahlungsarten wie Kreditkarte, Rechnung, Guthaben oder regionale Wallets ändern sich häufig. Sie sind deshalb kein stabiles Kurskriterium.

Die Tabelle zeigt den Stand vom 1. Mai 2026. Vor produktiven Projekten müssen Verfügbarkeit, Preise und Datenschutzbedingungen beim Anbieter geprüft werden.

| Model Provider | Integration Package | Kostenmodell | Kostenlos nutzbar? | Hinweise / Besonderheiten |
|---|---|---|---|---|
| openai | `langchain-openai` | Prepaid API-Credits; Mindestaufladung typischerweise 5 USD | Nein, außer ggf. zeitlich begrenztes Startguthaben | Sehr verbreitet, gute LangChain-Unterstützung. Gekaufte Credits verfallen nach einem Jahr und sind nicht erstattbar. |
| anthropic | `langchain-anthropic` | Prepaid Usage Credits oder Enterprise-Abrechnung | Nein, außer ggf. gewährtes Startguthaben | API- und Workbench-Nutzung laufen über vorab gekaufte Credits; Credit-Verfall nach einem Jahr. |
| azure_openai | `langchain-openai` | Azure Pay-as-you-go, Azure-Abrechnung oder Enterprise-Vertrag | Nein, ggf. Azure-Guthaben | OpenAI-Modelle über Azure-Ressourcen, häufig relevant für Unternehmen mit bestehender Azure-Umgebung. |
| azure_ai | `langchain-azure-ai` | Azure Pay-as-you-go, Azure-Abrechnung oder Enterprise-Vertrag | Modell- und Dienstabhängig | Breiter Azure-AI-Zugang; konkrete Kosten hängen vom Dienst und Modell ab. |
| google_vertexai | `langchain-google-vertexai` | Google-Cloud-Billing, Pay-as-you-go | Nein, ggf. Google-Cloud-Guthaben | Enterprise- und Cloud-Variante für Gemini und weitere Modelle; nicht mit dem kostenlosen Gemini-API-Tier in AI Studio gleichsetzen. |
| google_genai | `langchain-google-genai` | Gemini API Free Tier oder Paid Tier über Google Cloud Billing | Ja, modell- und regionabhängig | Für Kurse besonders geeignet: API-Key über Google AI Studio, Free Tier mit Rate Limits; im Free Tier können Daten zur Produktverbesserung verwendet werden. |
| bedrock | `langchain-aws` | AWS Pay-as-you-go, On-Demand, Batch oder Provisioned Throughput | Nein, ggf. AWS-Guthaben | Zugriff auf Modelle verschiedener Anbieter über AWS Bedrock; Kosten entstehen pro Modellnutzung und Token. |
| bedrock_converse | `langchain-aws` | AWS Pay-as-you-go | Nein, ggf. AWS-Guthaben | Converse-API für einheitlichere Chat-/Conversation-Aufrufe in Bedrock. |
| cohere | `langchain-cohere` | Trial Key oder Production Key | Ja, Trial Key mit Limits | Trial Keys sind kostenlos, aber begrenzt; Production Keys sind für produktive Nutzung vorgesehen. |
| fireworks | `langchain-fireworks` | Pay-as-you-go; freie Startcredits für neue Nutzer möglich | Ja, als Startcredits abhängig vom Account | Serverless Inference, Deployments und Fine-Tuning werden nutzungsabhängig abgerechnet. |
| together | `langchain-together` | Pay-as-you-go / Credits | Ja, abhängig von aktuellen Startcredits | Viele Open-Weight-Modelle und schnelle Inferenz; genaue Free-Credit-Regeln regelmäßig prüfen. |
| mistralai | `langchain-mistralai` | Experiment Plan oder Scale Plan | Ja, Experiment Plan mit restriktiven Limits | Der kostenlose Experiment Plan dient Evaluation und Prototyping; für produktive Nutzung ist Scale vorgesehen. |
| huggingface | `langchain-huggingface` | Hub-Zugang, Inference Provider, eigene Tokens oder lokale Modelle | Ja, abhängig vom Modell und Inference-Anbieter | Sehr große Modellvielfalt; Kosten und Limits hängen stark davon ab, ob Hub, Serverless Inference, Dedicated Endpoint oder lokale Ausführung genutzt wird. |
| groq | `langchain-groq` | Free Tier oder Developer/Production Tier | Ja, Free Tier mit Rate Limits | Sehr schnelle Inferenz für unterstützte Modelle; Free Tier ohne Kreditkarte, aber nicht unbegrenzt. |
| ollama | `langchain-ollama` | Lokalinstallation | Ja | Keine Cloud-API-Kosten; benötigt lokale oder Colab-Ressourcen und passende Modellgröße. |
| google_anthropic_vertex | `langchain-google-vertexai` | Google-Cloud-Billing über Vertex AI | Nein, ggf. Google-Cloud-Guthaben | Anthropic-Modelle über Vertex AI; Abrechnung und Verfügbarkeit richten sich nach Google Cloud und Region. |
| deepseek | `langchain-deepseek` | Guthaben-/Top-up-Modell; Abzug nach Tokenverbrauch | Teilweise, wenn gewährtes Guthaben vorhanden ist | Offizielle Preise werden pro 1M Token ausgewiesen; Nutzung wird vom aufgeladenen oder gewährten Guthaben abgezogen. |
| ibm | `langchain-ibm` | IBM watsonx.ai / Enterprise-Abrechnung | Teilweise, abhängig vom IBM-Plan | Vor allem für Enterprise- und Governance-Szenarien relevant. |
| nvidia | `langchain-nvidia-ai-endpoints` | NVIDIA NIM / API-Endpunkte, Credits oder Enterprise | Teilweise, abhängig vom aktuellen NVIDIA-Angebot | OpenAI-kompatible NIM-Endpunkte; stark für selbst gehostete oder GPU-nahe Szenarien. |
| xai | `langchain-xai` | Free/Promotional Credits, Prepaid Credits oder monatliche Rechnung | Teilweise, wenn Promo- oder Free Credits vorhanden sind | API-Verbrauch wird zuerst gegen Free/Promo-Credits, dann gegen Prepaid Credits und danach ggf. Rechnungslimit gebucht. |
| perplexity | `langchain-perplexity` | API-Preise nach Modell, Token und Such-/Tool-Nutzung | Nein, ggf. Credits abhängig vom Plan | Besonders relevant für Websuche und Sonar/Agent-APIs; Tool-Aufrufe können zusätzlich zu Modellkosten berechnet werden. |

---

## Google Colab Integration

### Sichere API-Key Verwaltung in Colab

Verwende in Colab Secrets statt API-Keys direkt in Codezellen. So bleiben Notebooks teilbar, ohne dass Zugangsdaten versehentlich mitwandern.

{: .warning }
> **LangSmith (EU/US-Endpunkte):** Wenn Sie LangSmith nutzen, legen Sie Account und API-Key im **EU-Workspace** an (`https://eu.smith.langchain.com/`) und verwenden Sie als `LANGSMITH_ENDPOINT` den EU-API-Endpoint `https://eu.api.smith.langchain.com`.

```python
# Installiere benötigte Bibliothek
!pip install langchain-{provider}
```

So speicherst du Keys in Colab Secrets:

1. Öffne in Colab die Secrets-Seitenleiste.
2. Lege den Key mit dem passenden Namen an, zum Beispiel `OPENAI_API_KEY`.
3. Gib den Key nur für das Notebook frei, das ihn wirklich braucht.

### Provider-spezifische Installation

**OpenAI:**
```python
!pip install langchain-openai
from langchain.chat_models import init_chat_model
llm = init_chat_model("openai:gpt-5.4-nano")
```

**Google Gemini:**
```python
!pip install langchain-google-genai
from langchain.chat_models import init_chat_model
llm = init_chat_model("google:gemini-3-flash-preview")
```

**Groq:**
```python
!pip install langchain-groq
from langchain.chat_models import init_chat_model
llm = init_chat_model("groq:llama-3.3-70b-versatile")
```

---

## Provider für erste Übungen

Für erste Kursübungen sind Anbieter hilfreich, die ohne große Einrichtung starten und klare Limits haben. Die folgenden Optionen sind keine allgemeine Marktberatung, sondern typische Einstiegspfade für Übungen.

**1. Google AI Studio (Gemini)**
- Free Tier für die Gemini API, modell- und regionabhängig
- Oberfläche über Google AI Studio
- einfache Colab-Nutzung
- multimodale Eingaben je nach Modell

**2. Groq**
- sehr schnelle Inferenz für unterstützte Modelle
- Free Tier mit Rate Limits
- geeignet für Llama- und andere Open-Weight-Modelle

**3. Cloudflare Workers AI**
- Einstieg mit Limits
- häufig ohne Kreditkarte nutzbar
- mehrere Modelle in einer Plattform

### Für produktionsnahe Tests

**OpenAI API**
- Prepaid API-Credits mit Mindestaufladung typischerweise 5 USD
- im Kurs als Standardpfad für viele Beispiele verwendet
- breite LangChain-Unterstützung

**Together AI**
- Credits oder Pay-as-you-go je nach aktuellem Angebot
- interessant für Open-Weight-Modelle

---

## Lokale Modelle ohne API-Keys

---

## Lokale Modelle ohne API-Keys

### Ollama in Google Colab

Lokale Modelle sind sinnvoll, wenn keine Cloud-API genutzt werden soll oder Daten die Umgebung nicht verlassen dürfen. In Colab hängt die Nutzbarkeit stark von GPU, RAM und Modellgröße ab.

```python
# Ollama in Colab installieren (mit GPU-Unterstützung)
!curl -fsSL https://ollama.com/install.sh | sh
!ollama serve &
!ollama pull llama3

# Mit LangChain verwenden
from langchain.chat_models import init_chat_model
llm = init_chat_model("ollama:llama3")
```

**Vorteile:**
- keine API-Kosten
- mehr Kontrolle über Daten
- auch offline nutzbar
- GPU-beschleunigt in Colab, wenn passende Ressourcen verfügbar sind

**Nachteile:**
- meist langsamer als Cloud-APIs
- begrenzte Modellgröße durch RAM- und GPU-Limits

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
- [Google AI Studio](https://aistudio.google.com/)
- [Groq Cloud](https://console.groq.com/)
- [Together AI](https://www.together.ai/)
- [Ollama](https://ollama.com/)
- [LangChain Provider Documentation](https://python.langchain.com/docs/integrations/chat/)

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Erste Agenten]({{ '/04-agenten-implementierung/' | relative_url }}) | Wo starte ich als Entwickler mit API-Keys & Provider? |
| [Qualität und Sicherheit]({{ '/07-qualitaet-sicherheit/' | relative_url }}) | Welche Produktionsstandards gelten für API-Keys & Provider? |

---

**Version:** 1.2<br>
**Stand:** Juli 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.








