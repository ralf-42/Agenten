# Format-Regeln

Diese Regeln definieren das Ausgabeformat des Research-Writers.

## Pflichtfelder

Jeder Research-Report muss enthalten:

1. **Thema** — aus der Nutzeranfrage extrahiert
2. **Fragestellung** — originale Nutzeranfrage (wörtlich)
3. **Quellenzähler** — "X ausgewertet | Y relevant"
4. **Kernaussagen** — nummerierte Liste, jeweils mit Quelle + Score
5. **Offene Fragen** — explizit was nicht belegt ist
6. **Empfehlung** — eine kurze Handlungsempfehlung
7. **Footer** — Modell-Angabe (Gate + Writer)

## Kernaussagen-Format

```
[Nummer]. [Aussage in einem Satz] — Quelle: [Name/URL], Relevanz: [0.0–1.0]
```

Beispiel:
```
1. LangGraph 1.0 unterstützt native Streaming-Events für alle Node-Typen. — Quelle: LangGraph Docs, Relevanz: 0.92
```

## Konflikt-Format

```
⚠️ Konflikt: [Aussage A] (Quelle X) vs. [Aussage B] (Quelle Y) — nicht aufgelöst
```

## Kurzformat bei insufficient_sources

```
### Research-Report: [Thema]

⚠️ Nicht genügend relevante Quellen gefunden (< 2).
Gefunden: [Anzahl] Quelle(n) mit Score ≥ 0.4.

**Empfehlung:** Suchquery präzisieren oder anderen Suchmodus wählen.
```

## Sprache & Stil

- Deutsch, sachlich, präzise
- Keine Wertungen ohne Quellenbeleg
- Keine Aussagen aus dem Modell-Vorwissen — nur belegte Fakten
