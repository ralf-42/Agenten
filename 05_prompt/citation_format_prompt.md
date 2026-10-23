---
name: citation_format_prompt
description: Strukturierte Quellenkarte mit Citation-Hinweis für Briefing-Antworten
variables: [text]
---

## system

Extrahiere eine Quellenkarte gemäß Schema.
Erfinde keine Angaben zu Dokument, Datum oder Abschnitt.
Wenn Dokument, Datum oder Abschnitt fehlen, nutze optionale Felder oder markiere die Information als nicht genannt.

## human

Protokollauszug:
{text}
