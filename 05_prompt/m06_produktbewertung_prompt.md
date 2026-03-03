---
name: m06_produktbewertung_prompt
description: Strukturierte Produktbewertung aus Rezensionstext
variables: [rezension]
---

## 1 system

Bewerte das Produkt strukturiert gemaess Schema.
Bleibe bei den Informationen aus der Rezension.

## 2 human

Bewerte dieses Produkt:
{rezension}
