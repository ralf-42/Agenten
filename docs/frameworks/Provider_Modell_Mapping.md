---
layout: default
title: Provider-Modell-Mapping
parent: Frameworks
nav_order: 9
description: Rollenbasiertes Mapping der im Kurs verwendeten Modelltypen auf OpenAI, Mistral und Anthropic
has_toc: true
---

# Provider-Modell-Mapping
{: .no_toc }

> **Ein Rollenmodell für mehrere Provider**       
> Dieses Dokument ordnet die im Kurs verwendeten Modellrollen auf OpenAI, Mistral und Anthropic ab.

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1 Zweck dieses Dokuments

Im Kurs werden konkrete OpenAI-Modelle verwendet, weil die Module, Notebooks und Beispiele darauf abgestimmt sind. Für Architekturentscheidungen ist aber oft nicht der Markenname entscheidend, sondern die **Rolle**, die ein Modell im System übernimmt.

Dieses Dokument trennt deshalb zwei Ebenen:

1. **Kurs-Default:** die tatsächlich in den Modulen verwendeten OpenAI-Modelle
2. **Provider-Mapping:** geeignete Entsprechungen in der Mistral- und Anthropic-Welt

> [!IMPORTANT] Nur zur Einordnung und Planung
> Dieses Mapping dient der Einordnung und Architekturplanung.
> Es ändert nicht automatisch die in den Modulen verwendeten Modelle.

---

## 2 Rollen statt Produktnamen

Für den Kurs sind vor allem diese Modellrollen relevant:

| Rolle                          | Typische Aufgabe                                        |
| ------------------------------ | ------------------------------------------------------- |
| **Baseline / Demo**            | günstige, schnelle Läufe für Grundlagen und erste Tests |
| **Router / leichter Reasoner** | einfache Routing- oder Auswahlentscheidungen            |
| **Judge / starker Reasoner**   | Bewertung, Policy-Checks, Supervisor-Entscheidungen     |
| **Worker / Synthese**          | hochwertige Text-, Code- oder RAG-Ausgabe               |
| **Coding-Worker**              | Code-nahe Agenten- und Entwicklungsaufgaben             |
| **Embeddings**                 | Vektorrepräsentationen für Retrieval und RAG            |

Der wichtigste Grundsatz lautet:

> **Erst die Rolle definieren, dann den Provider und erst zuletzt den konkreten Modellnamen wählen.**

---

## 3 Zentrales Mapping - 3 Beispiele

| Rolle                          | OpenAI                   | Mistral                                                | Anthropic                  | Kommentar                                                           |
| ------------------------------ | ------------------------ | ------------------------------------------------------ | -------------------------- | ------------------------------------------------------------------- |
| **Baseline / Demo**            | `gpt-4o-mini`            | `mistral-small-latest`                                 | `claude-3-5-haiku-latest`  | schnell, günstig, gut für Grundlagen                                |
| **Router / leichter Reasoner** | `o3-mini`                | `magistral-medium-latest` oder `mistral-medium-latest` | `claude-sonnet-4-20250514` | für Routing und einfache Auswahlentscheidungen                      |
| **Judge / starker Reasoner**   | `o3`                     | `magistral-medium-latest` oder `mistral-large-latest`  | `claude-opus-4-20250514`   | für Supervisor, Security, Bewertung                                 |
| **Worker / Synthese**          | `gpt-5.1`                | `mistral-medium-latest` oder `mistral-large-latest`    | `claude-sonnet-4-20250514` | für starke Inhaltserzeugung                                         |
| **Coding-Worker**              | `gpt-5.1`                | `devstral-latest` oder `codestral-latest`              | `claude-sonnet-4-20250514` | für code-nahe Agenten und Entwicklungsaufgaben                      |
| **Embeddings**                 | `text-embedding-3-small` | Mistral Embeddings                                     | externer Provider nötig    | Anthropic bietet hier im Kurskontext keinen direkten Standardersatz |

> [!NOTE] Funktionsorientiert, nicht benchmark-orientiert
> Das Mapping ist bewusst funktionsorientiert, nicht benchmark-orientiert.
> Ziel ist eine tragfähige Architekturentscheidung, kein absoluter Leistungsvergleich.

---

## 4 Wie die Provider im Kurskontext zu lesen sind

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
- Reasoning-Modelle
- Coding-Modelle
- Audio-Modelle
- Embeddings

**Geeignet, wenn**
- ein stärker providerneutraler oder europäischer Stack gewünscht ist
- Audio, Coding und Embeddings möglichst in einer Produktwelt liegen sollen
- man OpenAI nicht als alleinigen Standard setzen möchte

### Anthropic

Anthropic passt oft sehr gut auf die **Rollenlogik** des Kurses:

- Haiku als schnelle Baseline
- Sonnet als starker Standard-Worker
- Opus als Judge / Supervisor

**Geeignet, wenn**
- die Modellrollen aus dem OpenAI-Setup möglichst klar nachgebildet werden sollen
- Tool Use und Reasoning im Vordergrund stehen

**Einschränkung**
- kein gleichwertiger Kurs-Standardpfad für Embeddings im bestehenden Projekt

---

## 5 Provider-spezifische Empfehlungen je Rolle

### 5.1 Baseline / Demo

**Anforderung:**  
Schnell, stabil, kostengünstig, didaktisch gut steuerbar.

**Geeignete Modelle:**

- OpenAI: `gpt-4o-mini`
- Mistral: `mistral-small-latest`
- Anthropic: `claude-3-5-haiku-latest`

**Wann verwenden?**

- Grundlagenmodule
- erste Tests
- kostensensitive Standardläufe
- einfache Klassifikation, Formatierung, Tool-Demos

### 5.2 Router / leichter Reasoner

**Anforderung:**  
Saubere Auswahl zwischen wenigen Optionen, robuste Routing-Entscheidungen, keine übertriebene Kostenlast.

**Geeignete Modelle:**

- OpenAI: `o3-mini`
- Mistral: `magistral-medium-latest` oder `mistral-medium-latest`
- Anthropic: `claude-sonnet-4-20250514`

**Wann verwenden?**

- einfache Conditional Edges
- Tool-Auswahl mit begrenzter Komplexität
- Routing-Experimente in Demo- oder Prototyp-Szenarien

### 5.3 Judge / starker Reasoner

**Anforderung:**  
Bewertung, Policy-Check, Urteilsfähigkeit, Konflikterkennung, Supervisor-Entscheidungen.

**Geeignete Modelle:**

- OpenAI: `o3`
- Mistral: `magistral-medium-latest` oder `mistral-large-latest`
- Anthropic: `claude-opus-4-20250514`

**Wann verwenden?**

- LLM-as-Judge
- Security- oder Compliance-Gates
- Supervisor-Routing
- Fact-Check oder Konfliktbewertung

### 5.4 Worker / Synthese

**Anforderung:**  
Starke finale Ausgabequalität bei Text, Struktur, Zusammenfassung oder RAG-Synthese.

**Geeignete Modelle:**

- OpenAI: `gpt-5.1`
- Mistral: `mistral-medium-latest` oder `mistral-large-latest`
- Anthropic: `claude-sonnet-4-20250514`

**Wann verwenden?**

- RAG-Antwortsynthese
- hochwertige strukturierte Ausgaben
- finale Berichte und Longform-Text

### 5.5 Coding-Worker

**Anforderung:**  
Stark in Code, Tool-Kontext, Entwicklungsaufgaben und Agentic Workflows.

**Geeignete Modelle:**

- OpenAI: `gpt-5.1`
- Mistral: `devstral-latest` oder `codestral-latest`
- Anthropic: `claude-sonnet-4-20250514`

**Wann verwenden?**

- Code-Generierung
- Refactoring
- Entwicklungsagenten
- technische Workflow-Knoten

### 5.6 Embeddings

**Anforderung:**  
Stabile semantische Repräsentationen für Retrieval, Chunk-Suche und Vektorindizes.

**Geeignete Pfade:**

- OpenAI: `text-embedding-3-small`
- Mistral: Mistral Embeddings
- Anthropic: externer Embedding-Provider

**Wichtig:**  
Bei Providerwechseln sind Chat-Modell und Embedding-Modell **zwei getrennte Entscheidungen**.

---

## 6 Minimalregel für providerneutrale Dokumentation

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
- OpenAI: `o3`
- Mistral: `magistral-medium-latest`
- Anthropic: `claude-opus-4-20250514`

**Kurs-Default:**
Im Kurs wird hierfür aktuell `o3` verwendet.
```

Das erlaubt eine allgemeine Beschreibung, ohne die konkreten OpenAI-Implementierungen im Kurs umzuschreiben.

---

## 7 Verhältnis zum Modell-Auswahl Guide

Dieses Dokument ersetzt den Modell-Auswahl Guide **nicht**.

- Der **Modell-Auswahl Guide** erklärt, welche OpenAI-Modelle im Kurs aktuell verwendet werden und warum.
- Das **Provider-Modell-Mapping** zeigt, wie dieselben Rollen auf Mistral und Anthropic übertragen werden können.

Beide Dokumente zusammen ergeben:

1. **konkrete Kursrealität**
2. **providerübergreifende Architekturperspektive**

---

**Version:** 1.0       
**Stand:** März 2026    
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.    
