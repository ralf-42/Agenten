---
layout: default
title: "Modelle & Provider"
nav_order: 5
has_children: true
description: "Strategische Weichenstellung: Modellwahl, Provider, Fine-Tuning und API-Setup"
---

# Modelle & Provider

Diese Orientierungsseite bündelt die Entscheidungen rund um Modellrollen, Anbieter, API-Zugriff und die Frage, wann Modellanpassung statt besserer Systemgestaltung notwendig wird. Sie trennt strategische Modellwahl von der späteren Agenten-Implementierung.

| Frage | Dokument | Bezug |
|---|---|---|
| **Welches** Modell passt zur Aufgabe und wie werden Modellrollen auf Provider übertragen? | [Modellauswahl]({{ '/03-modelle-provider-anpassung/modellauswahl.html' | relative_url }}) | Kriterien für Qualität, Kosten, Latenz, Kontextfenster, Modellrollen und Provider-Mapping (OpenAI, Mistral, Gemini, Anthropic). |
| **Wann** lohnt sich Training? | [Fine-Tuning]({{ '/03-modelle-provider-anpassung/fine-tuning.html' | relative_url }}) | Modellanpassung als spätere Option nach Prompting, RAG, Tools und Evaluation. |
| **Wie** wird Modellzugriff technisch bereitgestellt? | [API-Keys & Provider]({{ '/03-modelle-provider-anpassung/api-keys-und-provider.html' | relative_url }}) | API-Keys, Provider-Setup und Colab-Integration. |

---

**Stand:** Oktober 2026<br>
