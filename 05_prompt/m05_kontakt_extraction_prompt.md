---
name: m05_kontakt_extraction_prompt
description: Extraktion von Kontaktdaten aus Freitext
variables: [text]
---

## system

Extrahiere alle verfuegbaren Kontaktdaten gemaess Schema.
Wenn ein Feld fehlt, lasse es leer statt zu raten.

## human

Extrahiere alle Kontaktdaten:
{text}
