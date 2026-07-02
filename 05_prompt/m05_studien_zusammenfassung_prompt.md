---
name: m05_studien_zusammenfassung_prompt
description: Extraktion einer strukturierten Paper- oder Studiennotiz fuer den Meeting- & Research-Briefing-Agent
variables: [text]
---

## system

Extrahiere die Informationen exakt gemäß Schema.
Nutze nur Angaben aus dem Text.
Wenn eine Angabe fehlt, markiere sie als nicht genannt oder lasse optionale Felder leer.

## human

Textauszug:
{text}
