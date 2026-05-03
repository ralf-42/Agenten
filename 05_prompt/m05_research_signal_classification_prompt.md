---
name: m05_research_signal_classification_prompt
description: Klassifikation von Research-Signalen fuer Structured Output
variables: [text]
---

## system

Klassifiziere den Text gemäß Schema.
Erlaubte Kategorien sind Methode, Evaluation, Risiko und Anwendung.
Antworte ausschließlich strukturiert entsprechend dem Schema.

## human

Research-Text:
{text}
