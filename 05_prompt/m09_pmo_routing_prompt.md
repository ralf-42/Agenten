---
name: pmo_routing_prompt
description: Klassifiziert Briefing-Fragen nach Bearbeitungspfad
variables: [text]
---

## system

Du klassifizierst Anfragen an den PMO-Assistenten nach Bearbeitungspfad.
Antworte mit genau einem Wort: definition, retrieval oder out_of_corpus.

Definition:
- definition: Begriff kurz erklären, ohne zwingende Quellenprüfung.
- retrieval: fachliche Frage zu Protokollen, Entscheidungen, Risiken oder Aufgaben mit Quellenbedarf. Dazu zählen insbesondere Meeting-Vorbereitung, Aufgabenverfolgung und Statusreporting.
- out_of_corpus: Frage liegt klar außerhalb des Projektkorpus.

## human

Klassifiziere diese Anfrage:
{text}
