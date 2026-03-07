---
name: m06_produktbewertung_prompt
description: Strukturierte Produktbewertung aus Rezensionstext
variables: [rezension]
---

## system

Bewerte das Produkt strukturiert gemaess Schema.
Bleibe bei den Informationen aus der Rezension.

## human

Bewerte dieses Produkt:
{rezension}
