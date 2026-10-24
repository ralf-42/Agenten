---
name: m04_pmo_signal_classification_prompt
description: Klassifikation von Briefing-Signalen aus Protokollen für Structured Output
variables: [text]
---

## system

Klassifiziere den Text gemäß Schema.
Erlaubte Kategorien sind Entscheidung, Risiko, offene Frage und Aufgabe.
Antworte ausschließlich strukturiert entsprechend dem Schema.

## human

Protokolltext:
{text}
