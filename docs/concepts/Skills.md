---
layout: default
title: Skills
parent: Konzepte
nav_order: 13
description: "Wiederverwendbare Arbeitsrezepte für verlässlich gesteuerte KI-Agenten"
has_toc: true
---

# Skills
{: .no_toc }

> **Wiederverwendbare Arbeitsrezepte für verlässlich gesteuerte KI-Agenten**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1 Was ist ein Skill?

Ein Skill ist ein **wiederverwendbarer Ablaufbaustein** für einen Agenten. Er beschreibt nicht nur eine Aufgabe, sondern auch:

- wann ein bestimmtes Vorgehen aktiviert wird
- welche Schritte verpflichtend sind
- welche Regeln, Referenzen und Hilfsmittel verwendet werden
- was der Agent nicht inferieren oder überspringen darf

Ein Skill ist damit mehr als ein einzelner Prompt. Er operationalisiert Fachwissen als **strukturierte Handlungslogik**.

---

## 2 Prompt vs. Skill

| | Prompt | Skill |
|---|---|---|
| **Zweck** | Einzelne Antwort oder Aufgabe | Wiederverwendbarer Workflow |
| **Struktur** | Freitext | Definierter Ablauf mit Pflichtschritten |
| **Guardrails** | Ad-hoc oder gar nicht | Explizit festgelegt |
| **Referenzen** | Im Prompt selbst | Ausgelagert und gezielt nachladbar |
| **Hilfslogik** | Meist keine | Optional über Skripte oder Tools |
| **Wiederverwendung** | Copy-Paste | Versionierbar und transportierbar |

**Faustregel:** Sobald ein Prozess Pflichtprüfungen, Eskalationsregeln oder dokumentierte Entscheidungen braucht, ist ein Skill meist geeigneter als ein freier Prompt.

---

## 3 Warum sind Skills für Agenten wichtig?

Agenten arbeiten oft in offenen, mehrstufigen Situationen. Genau dort steigt das Risiko, dass wichtige Schritte ausgelassen, Regeln falsch angewendet oder Ergebnisse uneinheitlich formuliert werden.

Skills helfen, dieses Risiko zu reduzieren:

- **Workflow-Orchestrierung:** Der Agent folgt einem definierten Vorgehen statt nur freiem Reasoning.
- **Guardrails:** Kritische Informationen werden aktiv abgefragt und nicht stillschweigend angenommen.
- **Progressive Disclosure:** Detailwissen wird nur bei Bedarf geladen und überfüllt nicht den Kernkontext.
- **Wiederverwendung:** Fachlogik kann zwischen Projekten, Agenten oder Kursmodulen konsistent genutzt werden.
- **Auditierbarkeit:** Entscheidungen werden nachvollziehbarer, weil Regeln und Schritte dokumentiert sind.

Skills sind deshalb besonders nützlich in Bereichen wie **Compliance, Security, Review, Freigabe, Onboarding oder Support mit festen Prüfschritten**.

---

## 4 Typische Struktur eines Skills

Eine praxistaugliche Skill-Struktur trennt Kernlogik, Referenzwissen und deterministische Hilfslogik.

| Datei / Ordner | Rolle |
|---|---|
| `SKILL.md` | Kernablauf, Trigger, Guardrails, Verweise |
| `references/` | Detailwissen, Checklisten, Regeln, Beispiele |
| `scripts/` | Deterministische Teilaufgaben oder Prüfungen |
| `WRITER.md` | Optional: Format- oder Report-Vorgaben für Ausgaben |

Beispielhafte Struktur:

```text
06_skill/
  compliance/
    SKILL.md
    WRITER.md
    references/
      checklist.md
      risk_rules.md
      examples.md
    scripts/
      assess_risk.py
```

---

## 4.1 SKILL.md in Claude Code (Skills 2.0)

In **Claude Code** werden Skills als eigene Verzeichnisse unter `.claude/skills/<name>/` abgelegt. Die `SKILL.md` ist der Einstiegspunkt; weitere Dateien werden nur bei Bedarf geladen.

```text
.claude/skills/review-pr/
  SKILL.md          # Kernablauf (max. ~500 Zeilen)
  reference.md      # Detailregeln, nachladbar
  examples/
    sample.md
  scripts/
    validate.sh
```

Die `SKILL.md` besteht aus **YAML-Frontmatter** und **Markdown-Inhalt**:

```yaml
---
name: review-pr
description: Prüft Pull Requests auf Code-Qualität und Sicherheit.
             Use when the user asks for a PR review.
context: fork                      # isolierter Subagent-Kontext
agent: general-purpose             # Explore | Plan | general-purpose
disable-model-invocation: true     # nur manuell aufrufbar
allowed-tools: Read, Grep, Glob    # erlaubte Tools
---
```

**Wichtige Frontmatter-Felder:**

| Feld | Bedeutung |
|---|---|
| `description` | Wann Claude den Skill automatisch lädt — präzise formulieren |
| `context: fork` | Skill läuft in eigenem Kontextfenster (Hauptkontext bleibt sauber) |
| `agent` | Subagenten-Typ: `Explore`, `Plan` oder `general-purpose` |
| `disable-model-invocation: true` | Nur manuell per `/skill-name` aufrufbar (nicht durch Claude) |
| `user-invocable: false` | Nur Claude lädt diesen Skill (unsichtbar für Nutzer) |
| `allowed-tools` | Tool-Beschränkung während der Skill aktiv ist |
| `model` | Modell-Override für diesen Skill |

**Dynamische Kontextinjektion:** Shell-Befehle mit `!` werden vor dem Laden ausgeführt und ersetzen den Platzhalter:

```markdown
## Aktueller Kontext
- Geänderte Dateien: !`git diff --name-only HEAD~1`
- Installierte Version: !`pip show langchain | grep Version`
```

**String-Substitution:** Argumente aus dem Aufruf werden injiziert:

```markdown
/migrate-component SearchBar React Vue
→ $0 = SearchBar, $1 = React, $2 = Vue
```

**Invocation-Matrix:**

| Einstellung | Wer ruft auf? | Im Kontext geladen? |
|---|---|---|
| Standard | Nutzer + Claude | immer |
| `disable-model-invocation: true` | nur Nutzer | nur bei manuellem Aufruf |
| `user-invocable: false` | nur Claude | immer (Hintergrundwissen) |

{: .note }
> `context: fork` ist nur für Aufgaben-Skills sinnvoll (der Subagent braucht eine konkrete Aufgabe). Reine Richtlinien-Skills (z.B. Coding-Konventionen) sollten ohne `fork` laufen.

---

## 5 Wie ein Agent einen Skill nutzt

Ein Skill kann auf verschiedene Arten in ein Agentensystem eingebunden werden:

1. `SKILL.md` wird als steuernder System-Kontext geladen.
2. Referenzdateien werden nur bei Bedarf nachgeladen.
3. Deterministische Teilaufgaben werden als Tool oder Skript ausgeführt.
4. Der Agent kombiniert Skill-Regeln, Tool-Ergebnisse und Nutzereingaben zu einer kontrollierten Entscheidung.

Wichtig dabei: Das LLM ersetzt nicht die Fachlogik vollständig. Gerade fragile oder risikokritische Teilaufgaben sollten, wenn möglich, **deterministisch** umgesetzt werden.

---

## 6 Wann Skills sinnvoll sind und wann nicht

### Skills sind sinnvoll, wenn

- ein Vorgehen wiederholt in ähnlicher Form vorkommt
- Pflichtschritte nicht ausgelassen werden dürfen
- Regeln, Checklisten oder Eskalationen eingehalten werden müssen
- ein Agent auf Fachreferenzen zugreifen soll, ohne alles im System-Prompt zu tragen
- Entscheidungen dokumentierbar und nachvollziehbar sein sollen

### Skills sind meist nicht nötig, wenn

- nur eine einzelne, freie Antwort erzeugt werden soll
- keine festen Prüfschritte existieren
- die Aufgabe rein explorativ und nicht standardisierbar ist
- ein normaler System-Prompt oder Workflow bereits ausreicht

---

## 7 Abgrenzung zu verwandten Konzepten

| Konzept | Fokus | Unterschied zu Skills |
|---|---|---|
| Prompt Engineering | Gute Anweisungen formulieren | Skills beschreiben einen wiederverwendbaren Ablauf, nicht nur eine Anweisung |
| Tool Use | Externe Funktionen aufrufen | Skills legen fest, wann und unter welchen Regeln Tools verwendet werden |
| LangGraph Workflow | Kontrollierter Ablauf als Graph | Skills beschreiben Fachlogik; ein Workflow ist die technische Orchestrierung |
| Multi-Agent | Arbeitsteilung zwischen Spezialisten | Skills können innerhalb einzelner Agenten oder Rollen eingesetzt werden |

Skills sind damit kein Ersatz für Tools, Workflows oder Graphen. Sie sind eine **fachliche Steuerungsschicht** darüber.

---

## 8 Einordnung im Kurs

Im Kurs wird das Thema als **erweiterndes Muster** behandelt, nicht als Kernvoraussetzung für den Einstieg.

Für Einsteiger sind zunächst wichtiger:

- Tool Use & Function Calling
- Prompt Engineering
- State Management und Checkpointing
- Human-in-the-Loop

Skills werden dann relevant, wenn aus einem allgemeinen Agenten ein **verlässlicher, wiederverwendbarer Prozess** werden soll.

---

## 9 Praxisbezug im Projekt

Im Projekt liegt ein konkretes Beispiel unter `06_skill/compliance/`. Dort zeigt der Compliance-Skill:

- wie `SKILL.md` den Agenten steuert
- wie Referenzen gezielt nachgeladen werden
- wie ein Skript eine Risikoprüfung deterministisch berechnet
- wie daraus ein kontrollierter Agenten-Workflow mit dokumentierbarer Entscheidung entsteht

Das zugehörige Demo-Notebook ist `M33_Agent_Skill_Compliance.ipynb`.

---

## 10 Weiterführende Verweise

| Dokument | Inhalt |
|---|---|
| [Prompt Engineering](./Prompt_Engineering.html) | Wie System-Prompts und Anweisungen aufgebaut werden |
| [Tool Use & Function Calling](./Tool_Use_Function_Calling.html) | Wie Agenten deterministische Hilfsfunktionen aufrufen |
| [State Management](./State_Management.html) | Wie mehrstufige Agenten kontrolliert ausgeführt werden |
| [Human-in-the-Loop](./Human_in_the_Loop.html) | Wie kritische Entscheidungen menschlich abgesichert werden |
| [Aufgaben & Lösungswege](./Aufgabenklassen_und_Loesungswege.html) | Wann ein Skill, Workflow oder Agent sinnvoll ist |

---

**Version:** 1.1 (Skills 2.0 Frontmatter ergänzt)
**Stand:** März 2026
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.     
