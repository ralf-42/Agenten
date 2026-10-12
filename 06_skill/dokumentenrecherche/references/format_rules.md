# Format-Regeln

Diese Regeln definieren das Ausgabeformat des Recherche-Writers.

## Pflichtfelder

Jeder Recherchebericht muss enthalten:

1. **Thema** — aus der Nutzeranfrage extrahiert
2. **Fragestellung** — originale Nutzeranfrage (wörtlich)
3. **Quellenzähler** — "X ausgewertet | Y relevant"
4. **Kernaussagen** — nummerierte Liste, jeweils mit Quelle, Datum + Score
5. **Offene Fragen** — explizit was nicht belegt ist
6. **Empfehlung** — eine kurze Handlungsempfehlung
7. **Footer** — Modell-Angabe (Gate + Writer)

## Kernaussagen-Format

```
[Nummer]. [Aussage in einem Satz] — Quelle: [Dokument, Datum], Relevanz: [0.0–1.0]
```

Beispiel:
```
1. R2 wurde am 28.04.2026 auf mitigiert gesetzt. — Quelle: protokoll_steuerkreis_2026-04-28.pdf, Relevanz: 0.88
```

## Konflikt-Format

```
⚠️ Konflikt: [Aussage A] (Quelle X) vs. [Aussage B] (Quelle Y) — nicht aufgelöst
```

Bei Entscheidungen die neuere Quelle kennzeichnen (zum Beispiel "D2 vom 14.04.2026 ist neuer als D1 vom 17.03.2026").

## Kurzformat bei insufficient_sources

```
### Recherchebericht: [Thema]

⚠️ Nicht genügend relevante Quellen gefunden (< 2).
Gefunden: [Anzahl] Quelle(n) mit Score ≥ 0.4.

**Empfehlung:** Suchquery präzisieren oder fehlende Unterlagen ergänzen.
```

## Kurzformat bei out_of_scope

```
Nicht im Korpus.

Geprüfter Suchraum: Projektunterlagen im Korpus.
Begründung: Keine Quelle mit Relevanz-Score ≥ 0.4 gefunden.
```

## Sprache & Stil

- Deutsch, sachlich, präzise
- Keine Wertungen ohne Quellenbeleg
- Keine Aussagen aus dem Modell-Vorwissen — nur belegte Fakten
