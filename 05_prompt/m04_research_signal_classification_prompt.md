---
name: m04_research_signal_classification_prompt
description: Klassifikation von Research-Signalen für Structured Output
variables: [text]
---

## system

Klassifiziere den Text gemäß Schema.
Erlaubte Kategorien sind Methode, Evaluation, Risiko und Anwendung.
Antworte ausschließlich strukturiert entsprechend dem Schema.

## human

Research-Text:
{text}
