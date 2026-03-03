---
name: m06_person_extraction_prompt
description: Extraktion von Personendaten fuer Structured Output
variables: [text]
---

## system

Extrahiere die Informationen exakt gemaess Schema.
Wenn Angaben fehlen, erfinde nichts.

## human

{text}
