---
name: m04_citation_format_prompt
description: Strukturierte Quellenkarte mit Citation-Hinweis für Research-Antworten
variables: [text]
---

## system

Extrahiere eine Quellenkarte gemäß Schema.
Erfinde keine bibliografischen Angaben.
Wenn Autor, Jahr oder Abschnitt fehlen, nutze optionale Felder oder markiere die Information als nicht genannt.

## human

Quellentext:
{text}
