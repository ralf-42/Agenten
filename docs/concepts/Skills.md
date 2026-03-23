---
layout: default
title: Skills
parent: Konzepte
nav_order: 14
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

### Die `description` als Trigger-Bedingung

Das `description`-Feld ist **kein beschreibender Text für Menschen** — es ist die Bedingung, anhand derer der Agent entscheidet, ob er den Skill überhaupt aktiviert. Der häufigste Fehler: Man überarbeitet die Anweisungen im SKILL.md-Body, während das eigentliche Problem in diesen zwei Zeilen liegt.

**Formel für eine wirksame `description`:**

```
[Was der Skill tut] + [Wann er ausgelöst wird — mit konkreten Trigger-Formulierungen]
```

| | Beispiel |
|---|---|
| ❌ Zu vage | `Hilft mit Dokumenten.` |
| ❌ Was, aber nicht wann | `Erstellt mehrseitige, professionell formatierte Dokumentation.` |
| ✅ Was + konkrete Trigger | `Erstellt README.md-Dateien für Softwareprojekte. Use when user asks to "write a README", "create a readme", "document this project", "generate project documentation".` |

> **Praktische Regel:** Wenn ein Skill nicht automatisch auslöst, zuerst die `description` überarbeiten — nicht die Anweisungen darunter.

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

### Dreistufiges Ladesystem (Progressive Disclosure)

Skills werden nicht auf einmal geladen — der Agent zieht Inhalte nur bei Bedarf in den Kontext. Das hält den Token-Verbrauch gering, auch bei vielen installierten Skills.

| Stufe | Was wird geladen | Wann | Token-Kosten |
|---|---|---|---|
| **Stufe 1 – Metadaten** | Nur `name` + `description` aus dem YAML-Frontmatter | Immer beim Session-Start | ~100 Token pro Skill |
| **Stufe 2 – Body** | Vollständiger `SKILL.md`-Inhalt | Wenn der Agent den Skill für relevant hält | < 5.000 Token |
| **Stufe 3 – Referenzen & Skripte** | Verlinkte Dateien aus `references/`, ausführbare Skripte aus `scripts/` | Nur wenn der Body darauf verweist und sie gebraucht werden | Praktisch unbegrenzt |

**Konsequenz für die Struktur:** Der Body sollte schlank bleiben. Detailwissen (Checklisten, Regelwerke, API-Muster) gehört in `references/` — es wird nur bei tatsächlichem Bedarf geladen.

**Beispiel-Ablauf:**

```
1. Session startet
   → Agent lädt: name + description aller installierten Skills (~100 Token je)

2. Nutzer fragt: "Kannst du ein README für dieses Projekt schreiben?"
   → Agent lädt: readme-writer/SKILL.md vollständig (Stufe 2)

3. SKILL.md verweist auf references/style.md
   → Agent lädt: references/style.md (Stufe 3)

4. SKILL.md enthält ein Validierungsskript
   → Agent führt aus: scripts/validate.sh (ohne es in den Kontext zu lesen)
```

### Einbindung in den Agenten-Workflow

1. `SKILL.md` wird als steuernder Kontext geladen.
2. Referenzdateien werden nur bei Bedarf nachgeladen.
3. Deterministische Teilaufgaben werden als Tool oder Skript ausgeführt.
4. Der Agent kombiniert Skill-Regeln, Tool-Ergebnisse und Nutzereingaben zu einer kontrollierten Entscheidung.

Wichtig dabei: Das LLM ersetzt nicht die Fachlogik vollständig. Gerade fragile oder risikokritische Teilaufgaben sollten, wenn möglich, **deterministisch** umgesetzt werden.

### Debugging: Wenn ein Skill nicht auslöst

| Schritt | Prüfung |
|---|---|
| **1. `description` überarbeiten** | Enthält sie konkrete Trigger-Formulierungen, die zur Nutzeranfrage passen? Ist die Formel `[Was] + [Wann + Trigger-Phrasen]` erfüllt? |
| **2. Dateipfad prüfen** | Liegt `SKILL.md` exakt unter `.claude/skills/<name>/SKILL.md`? |
| **3. YAML-Syntax prüfen** | Beginnt das Frontmatter auf Zeile 1 mit `---`? Keine unescapten `<>` im Frontmatter? |
| **4. Session neu starten** | Skills werden beim Session-Start geladen — Änderungen während einer laufenden Session werden erst nach Neustart aktiv. |
| **5. Debug-Modus** | `claude --debug` zeigt, welche Skills geladen werden. |
| **6. Explizit aufrufen** | `/skill-name` — wenn es explizit funktioniert, aber nicht automatisch, liegt das Problem an der `description`. |

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

Im Projekt liegen drei fertige Skill-Beispiele unter `06_skill/`:

| Skill | Schwerpunkt | Demo-Notebook |
|---|---|---|
| `compliance/` | Risikoprüfung, deterministisches Scoring, Eskalationsregeln | `M31_Agent_Skill_Compliance.ipynb` |
| `research/` | Web-Recherche, Relevanz-Scoring, Report-Synthese | — |
| `meeting-briefing/` | Meeting-Vorbereitung, Agenda-Strukturierung, Action-Item-Extraktion | — |

Alle drei folgen demselben Muster: Gate-Agent (o3) analysiert und strukturiert, Writer-LLM (gpt-5.1) erzeugt die Ausgabe. Die Unterschiede liegen in den `references/`-Regelwerken und den deterministischen Skripten in `scripts/`.

Eine Vorlage für eigene Skills liegt unter `06_skill/README.md`.

---

## 10 Weiterführende Verweise

| Dokument                                                          | Inhalt                                                     |
| ----------------------------------------------------------------- | ---------------------------------------------------------- |
| [Prompt Engineering](https://ralf-42.github.io/Agenten/concepts/Prompt_Engineering.html)                   | Wie System-Prompts und Anweisungen aufgebaut werden        |
| [Tool Use & Function Calling](https://ralf-42.github.io/Agenten/concepts/Tool_Use_Function_Calling.html)   | Wie Agenten deterministische Hilfsfunktionen aufrufen      |
| [State Management](https://ralf-42.github.io/Agenten/concepts/State_Management.html)                       | Wie mehrstufige Agenten kontrolliert ausgeführt werden     |
| [Human-in-the-Loop](https://ralf-42.github.io/Agenten/concepts/Human_in_the_Loop.html)                     | Wie kritische Entscheidungen menschlich abgesichert werden |
| [Aufgaben & Lösungswege](https://ralf-42.github.io/Agenten/concepts/Aufgabenklassen_und_Loesungswege.html) | Wann ein Skill, Workflow oder Agent sinnvoll ist           |

---

**Version:** 1.1     
**Stand:** März 2026    
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.        
