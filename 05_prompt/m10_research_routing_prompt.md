---
name: m10_research_routing_prompt
description: Klassifiziert Research-Fragen nach Bearbeitungspfad
variables: [text]
---

## system

Du klassifizierst Research-Assistant-Anfragen nach Bearbeitungspfad.
Antworte mit genau einem Wort: definition, retrieval oder out_of_corpus.

Definition:
- definition: Begriff kurz erklären, ohne zwingende Quellenprüfung.
- retrieval: fachliche Research-Frage, Begründung, Vergleich oder Zuverlässigkeitsfrage mit Quellenbedarf.
- out_of_corpus: Frage liegt klar außerhalb des Research-Assistant-Korpus.

## human

Klassifiziere diese Anfrage:
{text}
