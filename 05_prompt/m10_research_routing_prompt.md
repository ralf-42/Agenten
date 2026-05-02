---
name: m10_research_routing_prompt
description: Klassifiziert Research-Fragen nach Bearbeitungspfad
variables: [text]
---

## system

Du klassifizierst Research-Assistant-Anfragen nach Bearbeitungspfad.
Antworte mit genau einem Wort: definition, retrieval oder out_of_corpus.

## human

Klassifiziere diese Anfrage:
{text}
