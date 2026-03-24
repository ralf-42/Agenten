---
layout: default
title: DeepAgents Architekturleitlinie
parent: Frameworks
nav_order: 11
description: Architekturentscheidungen für M31, M33 und M34 — wann Skills, wann Subagents, wann orchestrierte Workflows
has_toc: true
---

# DeepAgents Architekturleitlinie
{: .no_toc }

> **Entscheidungsreferenz für M31, M33 und M34 — wann Skills, wann Subagents, wann explizite Orchestrierung**    

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Leitfrage

Die zentrale Entwurfsfrage lautet nicht „welche Datei legen wir an?", sondern:

> **Welche Information soll immer sichtbar sein, welche nur bei Bedarf, und welche Rolle braucht ein eigenes Modell oder einen eigenen Kontext?**

Quellen: [Context engineering](https://docs.langchain.com/oss/python/langchain/context-engineering), [Multi-agent](https://docs.langchain.com/oss/python/langchain/multi-agent)

---

## Architektur-Landkarte nach Entwurfsfrage

### 1. Wann überhaupt Deep Agents?

Quelle: [Deep Agents overview](https://docs.langchain.com/oss/python/deepagents/overview)

Einsatz wenn:
- Planung, Filesystem, Subagents oder längere Workflows Teil des Lehrziels sind
- Das Notebook ein „agent harness"-Beispiel zeigt, nicht nur einen einfachen React-Loop
- Kontextgrenzen, Rollenarchitektur oder Progressive Disclosure explizit demonstriert werden sollen

Kurs-Zuordnung:
- **M31/M33:** sinnvoll für komplexe, mehrstufige Agenten-Patterns
- **M34:** klar passend — Multi-Skill + Routing fällt direkt in dieses Raster

### 2. Welches Abstraktionsniveau wird gelehrt?

Quelle: [Frameworks, runtimes, and harnesses](https://docs.langchain.com/oss/javascript/concepts/products)

- M31/M33 sollten sauber benennen, dass sie nicht nur „einen Agenten bauen", sondern mit einem *opinionated harness* arbeiten
- Das verhindert, dass eigene Konventionen (wie `references/writer-format.md`) mit nativen Deep-Agents-Konzepten verwechselt werden

### 3. Wann Skills, wann Subagents, wann Router, wann Handoffs?

Quelle: [Multi-agent](https://docs.langchain.com/oss/python/langchain/multi-agent) — für Architekturfragen die wichtigste Einzelquelle

| Muster | Einsatz | Kurs-Kontext |
|--------|---------|--------------|
| **Skills** | Ein Agent bleibt die Hauptsteuerung, lädt Regeln on-demand | M34: Progressive Disclosure |
| **Subagents** | Starke Rollentrennung, Modelltrennung, Kontext-Isolation | M31/M33: Gate-Writer-Split |
| **Router** | Vorab klassifizieren, dann gezielt delegieren | eher M34+ |
| **Handoffs** | Zustandsabhängige Rollenwechsel als eigenes Thema | eher nicht M31/M33 |

### 4. Context Engineering — die theoretische Basis

Quelle: [Context engineering](https://docs.langchain.com/oss/python/langchain/context-engineering)

| Ebene | Inhalt | Technisches Mittel |
|-------|--------|--------------------|
| Globaler Kontext | Immer gültige Anweisungen | `system_prompt` des Koordinators |
| Skills | Situativ nötiges Fachwissen | `SKILL.md`, `skills=[...]` |
| Subagents | Eigene Rollen mit eigenen Grenzen | `subagents=[...]` |

### 5. Skills im Detail

Quelle: [Skills](https://docs.langchain.com/oss/python/deepagents/skills)

- Skills = bedarfsweise Regel- und Wissensladung, kein Ersatz für Rollenarchitektur
- Natives Skill-System arbeitet mit **lokalen Verzeichnissen**
- GitHub dient als versionierte Herkunftsquelle; die Runtime arbeitet mit lokal gecachten Ordnern (M34-Muster)
- Manuelles GitHub-Loading (M33) ist eine didaktische Eigenkonvention, kein natives Default

### 6. Subagents im Detail

Quelle: [Subagents](https://docs.langchain.com/oss/python/deepagents/subagents)

- Bevorzugte native Architektur für Gate/Writer-, Research/Writer- oder Analyzer/Writer-Splits
- Ermöglicht verschiedene Modelle pro Rolle (`model`-Feld im Subagent-Dict)
- Skill-Vererbung: Subagents können eigene Skills erhalten, unabhängig vom Koordinator

---

## Entscheidungs-Matrix

| Entwurfsfrage | Empfohlene Architektur | Notebook | Primärquelle |
|---|---|---|---|
| Brauche ich überhaupt Deep Agents? | Deep Agents wenn Planung, Filesystem, Subagents oder längere Workflows Lernziel sind | M31, M33, M34 | [Deep Agents overview](https://docs.langchain.com/oss/python/deepagents/overview) |
| Skill-Thema oder Multi-Agent-Thema? | Skills wenn ein Agent bleibt und Regeln on-demand lädt; Subagents wenn Rollen/Modelle/Kontext getrennt werden | M33, M34 | [Multi-agent](https://docs.langchain.com/oss/python/langchain/multi-agent) |
| Soll `references/writer-format.md` bleiben? | Nur als didaktische Eigenkonvention; nativ sauberer ist Subagent + `system_prompt` + ggf. Writer-Skills | M33 | [Subagents](https://docs.langchain.com/oss/python/deepagents/subagents), [Skills](https://docs.langchain.com/oss/python/deepagents/skills) |
| Wie Gate und Writer mit zwei Modellen trennen? | Dedizierter Writer-Subagent mit eigenem `model`-Feld | M31, M33 | [Subagents](https://docs.langchain.com/oss/python/deepagents/subagents) |
| Was in globalen Kontext, was in Skills? | Globales Regelwerk persistent; spezialisierte Regeln in `SKILL.md` | M33, M34 | [Context engineering](https://docs.langchain.com/oss/python/langchain/context-engineering) |
| Ist manuelles GitHub-Loading okay? | Ja wenn Transparenz/Versionierung gelehrt werden soll; kein natives Skills-Muster | M33 | [Skills](https://docs.langchain.com/oss/python/deepagents/skills) |
| Kann ein Multi-Skill-Notebook GitHub nutzen? | Ja — GitHub als Quelle, lokal gecacht; `skills=[...]` zeigt auf lokales Verzeichnis | M34 | [Skills](https://docs.langchain.com/oss/python/deepagents/skills) |
| Wann mehrere Skills in einem Notebook? | Wenn Progressive Disclosure und dynamische Auswahl explizit gezeigt werden sollen | M34 | [Skills](https://docs.langchain.com/oss/python/deepagents/skills), [Blog](https://www.blog.langchain.com/using-skills-with-deep-agents/) |
| Wann Router statt Skills? | Router wenn vorab klassifiziert und gezielt delegiert werden soll; Skills wenn situativ Wissen geladen wird | eher M34+ | [Multi-agent](https://docs.langchain.com/oss/python/langchain/multi-agent) |
| Wann Handoffs statt Subagents? | Nur wenn zustandsabhängige Rollenwechsel selbst das Thema sind | eher nicht M31/M33 | [Multi-agent](https://docs.langchain.com/oss/python/langchain/multi-agent) |
| Soll M33 die native Skills-API zeigen? | Eher nein — Schwerpunkt bleibt Gate-Writer und kontrollierte Orchestrierung | M33 | [Skills](https://docs.langchain.com/oss/python/deepagents/skills) |
| Wo gehört natives Multi-Skill-Routing hin? | In ein separates Notebook mit mehreren Skill-Ordnern und mehrdeutigen Aufgaben | M34 | [Skills](https://docs.langchain.com/oss/python/deepagents/skills), [Subagents](https://docs.langchain.com/oss/python/deepagents/subagents) |

---

## Architekturleitlinie für M31–M34

### Grundregel

Persistente, immer gültige Anweisungen gehören in den globalen Agent-Kontext.
Spezialisierte, nur situativ nötige Regeln gehören in Skills.
Rollen mit eigenem Modell, eigener Verantwortung oder starker Kontexttrennung gehören in Subagents.

Quellen: [Skills](https://docs.langchain.com/oss/python/deepagents/skills), [Subagents](https://docs.langchain.com/oss/python/deepagents/subagents)

### Einsatz von Skills

Skills sind das richtige Mittel, wenn ein Agent die Hauptsteuerung behält und nur bei Bedarf zusätzliches Regel- oder Fachwissen laden soll — besonders geeignet für Progressive Disclosure, wiederverwendbare Fachmodule und Multi-Skill-Demos. Skills sind kein Ersatz für Rollenarchitektur.

Quelle: [Skills](https://docs.langchain.com/oss/python/deepagents/skills)

### Einsatz von Subagents

Subagents sind das richtige Mittel, wenn Rollen fachlich oder technisch getrennt werden müssen — wegen unterschiedlicher Modelle, unterschiedlicher Systemprompts oder isolierter Kontexte. Für Gate/Writer-, Research/Writer- oder Analyzer/Writer-Splits ist dies die bevorzugte native Architektur.

Quelle: [Subagents](https://docs.langchain.com/oss/python/deepagents/subagents)

### Umgang mit `references/writer-format.md`

Eine `references/writer-format.md` (oder früher `WRITER.md`) ist keine native Deep-Agents-Konvention. Sie kann als didaktische Eigenkonvention verwendet werden, wenn ein Notebook ein explizites Gate-Writer-Muster besonders transparent machen soll. Wo möglich, sollte die Writer-Rolle nativ über Subagent + Systemprompt + optionale Writer-Skills modelliert werden.

> **Kursstand:** M33 nutzt `references/writer-format.md` bereits als selbstständige Referenzdatei (kein Top-Level-`WRITER.md` mehr) — konform mit dem offiziellen Skills-Standard.

Quellen: [Subagents](https://docs.langchain.com/oss/python/deepagents/subagents), [Skills](https://docs.langchain.com/oss/python/deepagents/skills)

### GitHub als Skill-Quelle

GitHub ist für die Kursreihe eine gute versionierte Quelle für Skills, Referenzen und Regelwerke. Das native Deep-Agents-Skill-System arbeitet jedoch mit lokalen Verzeichnissen. Daher gilt:

- **GitHub** = Herkunft und Versionsanker
- **Runtime** = lokal gecachte Skill-Ordner (`skills=["/skills/"]`)

Quelle: [Skills](https://docs.langchain.com/oss/python/deepagents/skills)

### Didaktische Zuordnung der Notebooks

| Notebook | Fokus | Architekturmuster |
|----------|-------|-------------------|
| **M31** | Native Architekturbausteine, Compliance-Skill | Skills + `references/` (standard-konform) |
| **M33** | Kontrollierte Orchestrierung, Gate-Writer-Pattern | Explizite Orchestrierung, `references/writer-format.md` als didaktische Konvention |
| **M34** | Natives Multi-Skill-Routing, Progressive Disclosure | `skills=[...]`-API, GitHub-Cache, dynamische Auswahl |

---

## Faustregel

| Situation | Mittel |
|-----------|--------|
| Soll immer gelten | Globaler Kontext (`system_prompt`) |
| Soll situativ zugeladen werden | Skill (`SKILL.md`) |
| Braucht eigene Rolle oder eigenes Modell | Subagent |
| Lehrwert liegt in expliziter Steuerung | Orchestrierung im Code — auch wenn nicht das nativste Muster |

Quellen: [Context engineering](https://docs.langchain.com/oss/python/langchain/context-engineering), [Multi-agent](https://docs.langchain.com/oss/python/langchain/multi-agent)

---

## Leitentscheidung für M31–M34

Die Kursreihe sollte nicht alles auf ein einziges natives Muster vereinheitlichen. Stattdessen zeigt jedes Notebook genau die Architekturform, die seinem Lernziel entspricht:

- **M31** — eher nativ und komponentenorientiert
- **M33** — bewusst orchestriert und didaktisch explizit
- **M34** — sauberes Multi-Skill-Notebook mit nativer `skills=[...]`-API

---

## Weiterführende Quellen

| Frage | Quelle |
|-------|--------|
| Ist `references/writer-format.md` nativ? | [Skills](https://docs.langchain.com/oss/python/deepagents/skills), [Subagents](https://docs.langchain.com/oss/python/deepagents/subagents) |
| Wie trenne ich zwei Modelle sauber? | [Subagents](https://docs.langchain.com/oss/python/deepagents/subagents) |
| Wann Skill statt Subagent? | [Multi-agent](https://docs.langchain.com/oss/python/langchain/multi-agent) |
| Was gehört global, was progressiv? | [Context engineering](https://docs.langchain.com/oss/python/langchain/context-engineering) |
| Ist GitHub als Skill-Repo okay? | [Skills](https://docs.langchain.com/oss/python/deepagents/skills) |
| Wann ist Deep Agents der richtige Rahmen? | [Deep Agents overview](https://docs.langchain.com/oss/python/deepagents/overview) |
| Skills in der Praxis (anschaulich) | [Blog: Using skills with deep agents](https://www.blog.langchain.com/using-skills-with-deep-agents/) |

---

**Version:** 1.0    
**Stand:** März 2026    
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.     
