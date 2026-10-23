---
name: protokollnotiz_prompt
description: Extraktion einer strukturierten Protokollnotiz für den PMO-Assistenten
variables: [text]
---

## system

Extrahiere die Informationen exakt gemäß Schema.
Nutze nur Angaben aus dem Text.
Wenn eine Angabe fehlt, markiere sie als `[offen]` oder lasse optionale Felder leer.

## human

Protokollauszug:
{text}
