# Vorschlag: Single-Model-Ansatz pro Modul (M00-M30)

## Ziel

Festlegen, in welchen Notebooks `gpt-4o-mini` beibehalten werden soll und in welchen ein Wechsel auf `gpt-5.1` oder `o3` sinnvoll ist.

## Beibehalten: `gpt-4o-mini`

Didaktik, Tempo und Kosten stehen hier im Vordergrund.

- `M00`
- `M01`
- `M02`
- `M03`
- `M04`
- `M05`
- `M06`
- `M07`
- `M08`
- `M09`
- `M10`
- `M20`
- `M26` (wenn Fokus auf UI liegt)

## Umstellen auf: `gpt-5.1`

Sinnvoll, wenn die Qualitaet der finalen Text-/Code-Ausgabe wichtiger ist als maximale Geschwindigkeit.

- `M11` (RAG-Agent Antworten)
- `M15` (Session/Checkpoint Dialogqualitaet)
- `M16` (Human-in-the-Loop Interaktion)
- `M23` (Evaluation/Testing als SUT, sobald ausgebaut)
- `M28` (Production-Demos mit hochwertiger Antwortqualitaet)

## Umstellen auf: `o3`

Sinnvoll fuer starke Entscheidungslogik, Routing, Supervisor-Verhalten, Evaluierung und Security.

- `M12`
- `M13`
- `M14`
- `M17`
- `M18`
- `M19`
- `M21`
- `M22`
- `M24`
- `M25`
- `M27`
- `M29`
- `M30`

## Entscheidungsregel (einfach)

- `gpt-4o-mini`: Grundlagen, schnelle Demos, Tool-Basics
- `gpt-5.1`: bessere Endausgabe (Text/Code)
- `o3`: Orchestrierung, Routing, Evaluierung, Security

## Umgesetzt in

→ **[docs/frameworks/Modell_Auswahl_Guide.md](../docs/frameworks/Modell_Auswahl_Guide.md)**

## Hinweis zur Reihenfolge

- Zuerst den bisherigen `gpt-4o-mini` Stand als Baseline behalten.
- Modellwechsel danach modulweise durchfuehren und kurz mit Qualitaet/Laufzeit/Kosten gegenpruefen.
