---
layout: default
title: Provider-Modell-Mapping
parent: "Modelle, Provider & Anpassung"
nav_order: 2
description: Rollenbasiertes Mapping der im Kurs verwendeten Modelltypen auf OpenAI, Mistral, Gemini und Anthropic
has_toc: true
---

# Provider-Modell-Mapping
{: .no_toc }

> **Ein Rollenmodell für mehrere Provider**
> Dieses Dokument ordnet die im Kurs verwendeten Modellrollen auf OpenAI, Mistral, Gemini und Anthropic ab.

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Zweck dieses Dokuments

Im Kurs werden konkrete OpenAI-Modelle verwendet, weil die Module, Notebooks und Beispiele darauf abgestimmt sind. Für Architekturentscheidungen ist aber oft nicht der Markenname entscheidend, sondern die **Rolle**, die ein Modell im System übernimmt.

Dieses Dokument trennt deshalb zwei Ebenen:

1. **Kurs-Default:** die tatsächlich in den Modulen verwendeten OpenAI-Modelle
2. **Provider-Mapping:** geeignete Entsprechungen bei Mistral, Gemini und Anthropic

> [!IMPORTANT] Nur zur Einordnung und Planung<br>
> Dieses Mapping dient der Einordnung und Architekturplanung.
> Es ändert nicht automatisch die in den Modulen verwendeten Modelle.

---

## Rollen statt Produktnamen

Für den Kurs sind vor allem diese Modellrollen relevant:

| Rolle                               | Typische Aufgabe                                        |
| ----------------------------------- | ------------------------------------------------------- |
| **Baseline / Demo**                 | günstige, schnelle Läufe für Grundlagen und erste Tests |
| **Router / leichter Reasoner**      | einfache Routing- oder Auswahlentscheidungen            |
| **Judge / starker Reasoner**        | Bewertung, Policy-Checks, Supervisor-Entscheidungen     |
| **Worker / Synthese**               | hochwertige Text-, Code- oder RAG-Ausgabe               |
| **Worker / Synthese (hochwertig)**  | maximale Ausgabequalität, komplexe RAG, finale Reports  |
| **Coding-Worker**                   | Code-nahe Agenten- und Entwicklungsaufgaben             |
| **Embeddings**                      | Vektorrepräsentationen für Retrieval und RAG            |

Der wichtigste Grundsatz lautet:

> **Erst die Rolle definieren, dann den Provider und erst zuletzt den konkreten Modellnamen wählen.**

---

## Zentrales Mapping

| Rolle                              | OpenAI                   | Mistral                                              | Gemini                        | Anthropic                       | Kommentar                                                           |
| ---------------------------------- | ------------------------ | ---------------------------------------------------- | ----------------------------- | ------------------------------- | ------------------------------------------------------------------- |
| **Baseline / Demo**                | `gpt-5.4-nano`           | `mistral-small-latest`                               | `gemini-3-flash-preview`      | `claude-haiku-4-5`     | schnell, günstig, gut für Grundlagen                                |
| **Router / leichter Reasoner**     | `gpt-5.4-nano`                | `mistral-small-latest`                                | `gemini-3-flash-preview`    | `claude-haiku-4-5`              | für Routing und einfache Auswahlentscheidungen                      |
| **Judge / starker Reasoner**       | `gpt-5.4`                     | `magistral-medium-latest` oder `mistral-large-latest` | `gemini-3.1-pro-preview`     | `claude-opus-4-6`               | für Supervisor, Security, Bewertung                                 |
| **Worker / Synthese**              | `gpt-5.4-mini`           | `mistral-medium-latest` oder `mistral-large-latest`  | `gemini-3.1-pro-preview`      | `claude-sonnet-4-6`             | Standard-Worker: starke Ausgabe, kostensensitiv                     |
| **Worker / Synthese (hochwertig)** | `gpt-5.4`                | `mistral-large-latest`                               | `gemini-3.1-pro-preview`      | `claude-opus-4-6`               | maximale Qualität: komplexe RAG, finale Reports                     |
| **Coding-Worker**                  | `gpt-5.4-mini`           | `devstral-latest` oder `codestral-latest`            | `gemini-3.1-pro-preview`      | `claude-sonnet-4-6`             | Mistral mit spezialisierten Coding-Modellen im Vorteil              |
| **Embeddings**                     | `text-embedding-3-small` | `mistral-embed`                                   | `gemini-embedding-2-preview`  | externer Provider nötig         | Anthropic bietet hier im Kurskontext keinen direkten Standardersatz |

> [!NOTE] Funktionsorientiert, nicht benchmark-orientiert<br>
> Das Mapping ist bewusst funktionsorientiert, nicht benchmark-orientiert.
> Ziel ist eine tragfähige Architekturentscheidung, kein absoluter Leistungsvergleich.

---

## Wie die Provider im Kurskontext zu lesen sind

### OpenAI

OpenAI ist im Projekt derzeit der **Kurs-Default**:

- starkes Rollenmodell im bestehenden Kurs
- konkrete Zuordnung in den Notebooks bereits umgesetzt
- Agent Builder als OpenAI-spezifisches Zusatzmodul
- Embeddings direkt im bestehenden RAG-Pfad verankert

**Geeignet, wenn**
- bestehende Kurslogik unverändert bleiben soll
- Notebooks 1:1 weiterlaufen sollen
- die Modellunterscheidung im Unterricht explizit gezeigt wird

### Mistral

Mistral ist besonders interessant, wenn ein **breiter Single-Provider-Pfad** angestrebt wird:

- Generalmodelle
- Reasoning-Modelle (`magistral-*`)
- Coding-Modelle (`devstral`, `codestral`)
- Audio-Modelle
- Embeddings

**Geeignet, wenn**
- ein stärker providerneutraler oder europäischer Stack gewünscht ist
- Audio, Coding und Embeddings möglichst in einer Produktwelt liegen sollen
- man OpenAI nicht als alleinigen Standard setzen möchte

### Gemini

Google Gemini eignet sich gut für **multimodale und skalierbare Workloads**:

- Flash-Modelle für günstige, schnelle Läufe (`gemini-3-flash-preview`)
- Pro-Modelle für starke Reasoning- und Synthese-Aufgaben (`gemini-3.1-pro-preview`)
- Eigene Embedding-Modelle (`gemini-embedding-2-preview`)
- Sehr langer Kontext (bis 2 Mio. Tokens) für Dokument-Handoffs

**Geeignet, wenn**
- multimodale Inhalte (Bild, Video, Audio) im Agenten-System verarbeitet werden
- ein langer Kontextpfad für große Dokumente benötigt wird
- Google Cloud / Vertex AI als Deployment-Plattform geplant ist

**Einschränkung**
- kein spezialisiertes Coding-Modell (Mistral `devstral` hat hier einen Vorteil)
- Preview-Modelle können sich ohne Vorankündigung ändern

### Anthropic

Anthropic passt oft sehr gut auf die **Rollenlogik** des Kurses:

- Haiku als schnelle Baseline (`claude-haiku-4-5`)
- Sonnet als starker Standard-Worker (`claude-sonnet-4-6`)
- Opus als Judge / Supervisor / hochwertiger Worker (`claude-opus-4-6`)

**Geeignet, wenn**
- die Modellrollen aus dem OpenAI-Setup möglichst klar nachgebildet werden sollen
- Tool Use und Reasoning im Vordergrund stehen

**Einschränkung**
- kein gleichwertiger Kurs-Standardpfad für Embeddings im bestehenden Projekt

---

## Provider-spezifische Empfehlungen je Rolle

### Baseline / Demo

Schnell, stabil, kostengünstig, didaktisch gut steuerbar — die Anforderung ist bei allen Providern dieselbe. Geeignet für Grundlagenmodule, erste Tests und kostensensitive Standardläufe mit einfacher Klassifikation, Formatierung oder Tool-Demos. OpenAI `gpt-4o-mini`, Mistral `mistral-small-latest`, Gemini `gemini-3-flash-preview`, Anthropic `claude-haiku-4-5`.

### Router / leichter Reasoner

Für einfache Conditional Edges, Tool-Auswahl mit begrenzter Komplexität oder Routing-Experimente in Demo-Szenarien. Gefragt sind robuste Entscheidungen zwischen wenigen Optionen ohne übertriebene Kostenlast. OpenAI `gpt-5.4-nano`, Mistral `mistral-small-latest`, Gemini `gemini-3-flash-preview`, Anthropic `claude-haiku-4-5`.

### Judge / starker Reasoner

Überall dort, wo Fehlentscheidungen teuer sind: LLM-as-Judge, Security- oder Compliance-Gates, Supervisor-Routing, Fact-Check oder Konfliktbewertung. Die stärksten verfügbaren Reasoning-Modelle — OpenAI `gpt-5.4`, Mistral `magistral-medium-latest` oder `mistral-large-latest`, Gemini `gemini-3.1-pro-preview`, Anthropic `claude-opus-4-6`.

### Worker / Synthese

Für RAG-Antwortsynthese, hochwertige strukturierte Ausgaben und finale Berichte. Gefragt ist starke Ausgabequalität bei Text, Struktur und Zusammenfassung — nicht maximale Reasoning-Tiefe. **Standard:** OpenAI `gpt-5.4-mini`, Mistral `mistral-medium-latest` oder `mistral-large-latest`, Gemini `gemini-3.1-pro-preview`, Anthropic `claude-sonnet-4-6`. **Hochwertig (wenn maximale Qualität gefordert):** OpenAI `gpt-5.4`, Mistral `mistral-large-latest`, Anthropic `claude-opus-4-6`.

### Coding-Worker

Für Code-Generierung, Refactoring, Entwicklungsagenten und technische Workflow-Knoten. Mistral bietet hier spezialisierte Modelle (`devstral-latest`, `codestral-latest`) und hat damit einen klaren Vorteil. OpenAI `gpt-5.4-mini`, Gemini `gemini-3.1-pro-preview` (kein spezialisiertes Coding-Modell), Anthropic `claude-sonnet-4-6`.

### Embeddings

Stabile semantische Repräsentationen für Retrieval, Chunk-Suche und Vektorindizes. OpenAI bietet `text-embedding-3-small`, Mistral `mistral-embed`, Gemini `gemini-embedding-2-preview`, Anthropic keinen direkten Standardpfad im Kurskontext. Wichtig: Bei Providerwechseln sind Chat-Modell und Embedding-Modell **zwei getrennte Entscheidungen** — ein Wechsel des einen zieht nicht automatisch den anderen nach sich.

---

## Minimalregel für providerneutrale Dokumentation

Wenn Modultexte, Architekturtexte oder Deployment-Dokumente providerneutral formuliert werden sollen, ist dieses Muster robust:

1. **Rolle benennen**
2. **Anforderung beschreiben**
3. **Provider-Mapping angeben**
4. **Kurs-Default explizit nennen**

**Beispiel**

```md
### Modellrolle: Judge / Evaluator

Für diese Rolle wird ein starkes Reasoning-Modell benötigt.
Es bewertet Antworten, prüft Regelkonformität oder entscheidet zwischen Alternativen.

**Geeignete Modelle je Provider:**
- OpenAI: `gpt-5.4`
- Mistral: `magistral-medium-latest`
- Gemini: `gemini-3.1-pro-preview`
- Anthropic: `claude-opus-4-6`

**Kurs-Default:**
Im Kurs wird hierfür aktuell `gpt-5.4` verwendet.
```

Das erlaubt eine allgemeine Beschreibung, ohne die konkreten OpenAI-Implementierungen im Kurs umzuschreiben.

---

## Verhältnis zur Modellauswahl

Dieses Dokument ergänzt die zentrale Modellauswahl.

- Die **Modellauswahl** erklärt, welche Modellrollen im Kurs verwendet werden und warum.
- Das **Provider-Modell-Mapping** vertieft, wie dieselben Rollen auf Mistral, Gemini und Anthropic übertragen werden können.

Beide Dokumente zusammen ergeben:

1. **konkrete Kursrealität**
2. **providerübergreifende Architekturperspektive**

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Erste Agenten]({{ '/04-agenten-implementierung/' | relative_url }}) | Wo starte ich als Einsteiger mit Provider-Modell-Mapping? |
| [Qualität und Sicherheit]({{ '/07-qualitaet-sicherheit/' | relative_url }}) | Welche Produktionsstandards gelten für Provider-Modell-Mapping? |

---

**Version:** 2.0<br>
**Stand:** März 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.









