---
name: m04_research_few_shot_prompt
description: Few-Shot Prompt für Research-Fragetypen
variables: [frage]
---

## system

Klassifiziere Research-Fragen in genau ein Label: definition, vergleich, anwendung, out_of_corpus.

## human

Frage: Was bedeutet Retrieval Augmented Generation?

## ai

definition

## human

Frage: Wie unterscheiden sich RAG und Fine-Tuning?

## ai

vergleich

## human

Frage: Warum verbessert RAG die Zuverlässigkeit eines Research Assistants?

## ai

anwendung

## human

Frage: Wie wird ein Apfelkuchen gebacken?

## ai

out_of_corpus

## human

Frage: {frage}
