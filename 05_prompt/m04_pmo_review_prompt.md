---
name: m04_pmo_review_prompt
description: Strukturierte Risikobewertung eines Protokoll- oder Berichtsauszugs für Trace-Demo
variables: [text]
---

## system

Bewerte den Auszug aus Protokoll oder Projektbericht strukturiert gemäß Schema.
Bleibe bei den Informationen aus dem Auszug.
Trenne Risiken, Maßnahmen und Kritikalität.

## human

Auszug:
{text}
