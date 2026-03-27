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

## Was ist ein Skill?

Ein Skill ist ein **wiederverwendbarer Ablaufbaustein** für einen Agenten. Er beschreibt nicht nur eine Aufgabe, sondern auch wann ein bestimmtes Vorgehen aktiviert wird, welche Schritte verpflichtend sind, welche Regeln und Hilfsmittel verwendet werden — und was der Agent nicht inferieren oder überspringen darf.

Ein Skill ist damit mehr als ein einzelner Prompt. Er operationalisiert Fachwissen als **strukturierte Handlungslogik**.

---

## Prompt vs. Skill

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

## Skills, Tools, MCP und Subagenten

Skills stehen nicht allein. Im Agentensystem übernehmen sie eine andere Aufgabe als Tools, MCP oder Subagenten. Genau diese Trennung entscheidet oft darüber, ob eine Architektur später robust bleibt oder in schwer wartbare Spezialfälle zerfällt.

| Baustein | Kernfrage | Rolle |
|---|---|---|
| **Skill** | *Wie soll gearbeitet werden?* | Fachlogik, Ablauf, Regeln, Eskalation |
| **Tool** | *Welche Operation kann ausgeführt werden?* | Konkrete Funktion, API, Datenbankabfrage, Skript |
| **MCP** | *Worauf kann zugegriffen werden?* | Verbindung zu externen Systemen und Datenquellen |
| **Subagent** | *Wer bearbeitet diesen Teil isoliert?* | Delegation in ein eigenes Kontextfenster |

Ein Tool kann etwa eine SQL-Abfrage ausführen. Ein MCP-Server stellt die Verbindung zur Datenbank her. Der Skill legt fest, welche Tabelle gelesen wird, welche Kennzahlen relevant sind und welche Prüfregeln gelten. Ein Subagent übernimmt den Teilauftrag dann in einem getrennten Kontext, wenn Isolation, Parallelität oder Spezialisierung nötig sind.

Kurzform: **MCP liefert Zugriff, Tools liefern Operationen, Skills liefern Fachlogik, Subagenten liefern Arbeitsteilung.**

---

## Warum sind Skills für Agenten wichtig?

Agenten arbeiten oft in offenen, mehrstufigen Situationen. Genau dort steigt das Risiko, dass wichtige Schritte ausgelassen, Regeln falsch angewendet oder Ergebnisse uneinheitlich formuliert werden.

Skills helfen, dieses Risiko zu reduzieren:

- **Workflow-Orchestrierung:** Der Agent folgt einem definierten Vorgehen statt nur freiem Reasoning.
- **Guardrails:** Kritische Informationen werden aktiv abgefragt und nicht stillschweigend angenommen.
- **Progressive Disclosure:** Detailwissen wird nur bei Bedarf geladen und überfüllt nicht den Kernkontext.
- **Wiederverwendung:** Fachlogik kann zwischen Projekten, Agenten oder Kursmodulen konsistent genutzt werden.
- **Auditierbarkeit:** Entscheidungen werden nachvollziehbarer, weil Regeln und Schritte dokumentiert sind.

Skills sind deshalb besonders nützlich in Bereichen wie **Compliance, Security, Review, Freigabe, Onboarding oder Support mit festen Prüfschritten**.

Zwei weitere Eigenschaften sind für den Praxiseinsatz relevant. **Composability:** Mehrere Skills können gleichzeitig aktiv sein — Claude lädt alle relevanten Skills einer Anfrage parallel, ohne dass sie voneinander wissen müssen. **Portability:** Skills folgen dem offenen [Agent Skills Standard](https://agentskills.io) (Apache 2.0), sodass ein Skill für Claude Code ohne Anpassung auch in VS Code mit Copilot, Cursor und anderen kompatiblen Agenten funktioniert.

---

## Typische Einsatzmuster

Skills entfalten ihren Mehrwert dort, wo wiederkehrende Aufgaben nicht nur beantwortet, sondern nach festen Regeln ausgeführt werden müssen. Typische Muster sind Review-Skills, die Prüfkriterien und Freigaberegeln bündeln, Analyse-Skills mit klarer Kennzahlenlogik, Research-Skills mit Quellenbewertung, Stil- oder Brand-Skills mit verbindlichen Formulierungsregeln und Dokumentations-Skills mit festen Ausgabeformaten.

Weniger geeignet sind Skills für einmalige, kreative oder rein explorative Aufgaben ohne stabile Prüfschritte. Dort erzeugt ein normaler Prompt meist weniger Overhead und ist leichter zu pflegen.

---

## Typische Struktur eines Skills

Eine praxistaugliche Skill-Struktur trennt Kernlogik, Referenzwissen und deterministische Hilfslogik.

| Datei / Ordner | Rolle                                                        |
| -------------- | ------------------------------------------------------------ |
| `SKILL.md`     | Kernablauf, Trigger, Guardrails, Verweise — Pflichtdatei     |
| `references/`  | Detailwissen, Checklisten, Regeln, Beispiele — Stufe 3       |
| `scripts/`     | Deterministische Teilaufgaben oder Prüfungen (Py, Bash, JS)  |
| `assets/`      | Statische Ressourcen: Vorlagen, Konfigdateien, Beispielinput |

Beispielhafte Struktur:

```text
skill-name/
  SKILL.md
  references/
    checklist.md
    risk_rules.md
  scripts/
    assess_risk.py
    validate.sh
  assets/
    template.docx
    sample_input.md
```

`references/` eignet sich für Regelwerke, Checklisten und Beispiele, die nicht ständig im Kernkontext liegen sollen. `scripts/` ist der richtige Ort für deterministische Teilaufgaben wie Validierung, Berechnung oder Extraktion. `assets/` trägt statische Vorlagen, Logos, Schemas oder Beispielinput. Gerade bei formatgebundenen Skills ist `assets/` oft der Unterschied zwischen einem allgemeinen Prompt und einem reproduzierbaren Arbeitsablauf.

Wenn Referenzdateien länger werden, empfiehlt sich am Anfang ein kurzes Inhaltsverzeichnis. So bleibt sichtbar, welche Bereiche existieren, ohne die gesamte Datei sofort lesen zu müssen.

### Mini-Beispiel: Skill plus Referenzen plus Skript

Ein Review-Skill für ein Projekt-README könnte in `SKILL.md` festlegen, wann der Skill auslöst, welche Mindestabschnitte geprüft werden und wann ein Ergebnis eskaliert werden muss. `references/style.md` beschreibt Ton, Gliederung und Beispiele. `scripts/validate_links.py` prüft deterministisch, ob interne Links und Dateiverweise existieren. Der Skill selbst bleibt dadurch schlank, während Regeln und technische Prüfungen sauber getrennt bleiben.

---

## Offener Standard und Claude Code

Der offene Agent Skills Standard beschreibt die portable Grundidee: Ein Skill besteht aus `SKILL.md` und optionalen Begleitdateien. Claude Code ergänzt darauf eine konkrete Laufzeitumgebung mit projektlokalen Skill-Pfaden, zusätzlichen Frontmatter-Feldern und einer tieferen Integration in Subagenten und Tool-Berechtigungen.

Damit gilt: **Nicht alles, was in Claude Code möglich ist, gehört zum offenen Standard.** Wer Skills zwischen Plattformen transportieren will, hält den Kern möglichst standardnah und behandelt Claude-Code-spezifische Felder als Erweiterung.

## SKILL.md in Claude Code

In **Claude Code** werden Skills als eigene Verzeichnisse abgelegt. Die `SKILL.md` ist der Einstiegspunkt; weitere Dateien werden nur bei Bedarf geladen.

**Installationspfade:**

| Scope | Pfad | Wann verwenden |
|---|---|---|
| Projektspezifisch | `.claude/skills/<name>/` | Empfohlen — nur für dieses Projekt |
| Global | `~/.claude/skills/<name>/` | Skill in allen Projekten verfügbar |
| Claude.ai | Settings → Features → Skill hochladen (ZIP) | Ohne Claude Code |

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
| `license` | Lizenzangabe (z.B. `Apache-2.0`, `MIT`) — Vertrauenssignal bei geteilten Skills |
| `compatibility` | Umgebungsanforderungen (max. 500 Zeichen), z.B. `"Requires Python 3.10+"` |
| `metadata` | Freie Key-Value-Map — empfohlene Keys: `version`, `author`, `last-updated` |

**Pflichtregeln:**

- `name`: 1–64 Zeichen, nur Kleinbuchstaben, Zahlen und Bindestriche — muss exakt dem Verzeichnisnamen entsprechen
- `description`: max. 1.024 Zeichen, keine XML-Tags (`<` oder `>`) — `claude` und `anthropic` im `name` sind reserviert
- Dateiname muss exakt `SKILL.md` lauten (case-sensitive), keine `README.md` im Skill-Verzeichnis

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

> [!TIP] Praktische Regel
> Wenn ein Skill nicht automatisch auslöst, zuerst die `description` überarbeiten — nicht die Anweisungen darunter.

**Negative Boundaries:** Eine wirksame `description` definiert auch, was der Skill *nicht* behandelt — z.B. `Do NOT use for: cover letters, job searching`. Ohne diese Abgrenzung aktiviert der Agent den Skill bei thematisch ähnlichen, aber unpassenden Anfragen (Overtriggering).

**Undertriggering:** LLM-basiertes Routing neigt dazu, einfache Anfragen nicht weiterzuleiten, wenn das Modell glaubt, sie direkt beantworten zu können. Komplexe, mehrstufige oder fachspezifische Aufgaben triggern zuverlässiger als einfache Einzelfragen.

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

Ein kurzer Praxisfall macht den Unterschied greifbar. Ein Skill `review-pr` soll nur auf ausdrücklichen Befehl laufen, weil er relativ teuer ist und viele Dateien liest. Dann bietet sich `disable-model-invocation: true` an. Ein Skill `python-style-rules` soll dagegen automatisch im Hintergrund wirken, ohne als Befehl aufzutauchen. Dafür ist `user-invocable: false` passend.

### Body Best Practices

Der Markdown-Body ist das Herzstück des Skills. Folgende Prinzipien erhöhen die Wirksamkeit:

| Prinzip | Umsetzung |
|---|---|
| **Quick Reference voran** | Tabelle oder Entscheidungsbaum am Anfang — orientiert den Agenten schnell |
| **Workflows statt Enzyklopädie** | Schritt-für-Schritt-Anleitungen für 90 % der Fälle; Detailwissen in `references/` |
| **Konkrete Beispiele** | ✅/❌-Markierungen für richtige und falsche Muster |
| **Gotchas dokumentieren** | Abschnitt mit bekannten Fallstricken: Symptom + Ursache + Fix |
| **Warum erklären** | LLMs generalisieren besser aus *warum* als aus starren *was*-Regeln |
| **Body unter 500 Zeilen** | Alles weitere in `references/` — wird nur bei Bedarf geladen |

Empfohlene Abschnitte: `## Schnellreferenz` → `## Workflow` (Checkliste) → `## Gotchas` → `## Kritische Regeln`.

> [!NOTE] context: fork nur für Aufgaben-Skills
> `context: fork` ist nur für Aufgaben-Skills sinnvoll (der Subagent braucht eine konkrete Aufgabe). Reine Richtlinien-Skills (z.B. Coding-Konventionen) sollten ohne `fork` laufen.

### Subagenten gezielt einsetzen

`context: fork` verlagert die Ausführung in ein eigenes Kontextfenster. Das eignet sich für Aufgaben-Skills, die Recherche, Analyse oder komplexe Einzelaufträge isoliert abarbeiten sollen. Das Feld `agent:` bestimmt, welcher Subagententyp diese Arbeit übernimmt. In Claude Code kann das ein allgemeiner Subagent sein oder ein spezialisierter Agent wie `Explore` oder `Plan`.

Für Richtlinien-Skills ist diese Isolation meist unnötig. Dort soll die Fachlogik den Hauptagenten während der gesamten Bearbeitung begleiten, statt als abgeschlossener Teilauftrag zu laufen.

---

## Wie ein Agent einen Skill nutzt

Der Weg vom Skill-Ordner auf der Festplatte bis zur aktiven Anleitung im Agenten läuft in vier Phasen ab:

```mermaid
flowchart TD
    subgraph P1["① Installation"]
        A[Skill-Ordner in Skill-Pfad ablegen]
    end
    subgraph P2["② Discovery"]
        B[Session-Start] --> C[YAML-Frontmatter aller Skills lesen]
        C --> D[Skill-Katalog in System-Prompt einbetten]
    end
    subgraph P3["③ Routing"]
        E[Nutzer-Anfrage] --> F{LLM prüft\nSkill-Katalog}
        F -->|Treffer| G[SKILL.md vollständig laden]
        F -->|kein Treffer| H[ohne Skill fortfahren]
    end
    subgraph P4["④ Execution"]
        I[Anweisungen aktiv im Kontext] --> J[Workflow ausführen]
        J --> K[Referenzen und Skripte\nbei Bedarf nachladen]
    end

    P1 --> P2
    P2 --> P3
    G --> P4
```

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

Die `SKILL.md` wird als steuernder Kontext geladen. Referenzdateien folgen nur bei Bedarf. Deterministische Teilaufgaben werden als Tool oder Skript ausgeführt — ihr Quellcode landet nicht im Kontext, nur ihr Ergebnis. Der Agent kombiniert abschließend Skill-Regeln, Tool-Ergebnisse und Nutzereingaben zu einer kontrollierten Entscheidung.

Das LLM ersetzt dabei nicht die Fachlogik vollständig. Fragile oder risikokritische Teilaufgaben sollten, wenn möglich, **deterministisch** umgesetzt werden.

### Debugging: Wenn ein Skill nicht auslöst

| Schritt | Prüfung |
|---|---|
| **1. `description` überarbeiten** | Enthält sie konkrete Trigger-Formulierungen, die zur Nutzeranfrage passen? Ist die Formel `[Was] + [Wann + Trigger-Phrasen]` erfüllt? |
| **2. Dateipfad prüfen** | Liegt `SKILL.md` exakt unter `.claude/skills/<name>/SKILL.md`? |
| **3. YAML-Syntax prüfen** | Beginnt das Frontmatter auf Zeile 1 mit `---`? Keine unescapten `<>` im Frontmatter? |
| **4. Aktivierungsmodus prüfen** | In Claude Code werden Änderungen oft direkt erkannt. In anderen Umgebungen oder bei unklarem Verhalten hilft ein Neustart oder Reload. |
| **5. Debug-Modus** | `claude --debug` zeigt, welche Skills geladen werden. |
| **6. Explizit aufrufen** | `/skill-name` — wenn es explizit funktioniert, aber nicht automatisch, liegt das Problem an der `description`. |

Zwei Fehlerbilder tauchen besonders häufig auf. **Undertriggering** bedeutet, dass der Skill trotz passender Anfrage nicht lädt. Ursache ist meist eine zu vage `description` oder ein zu allgemeiner Nutzenversprechen-Text ohne echte Trigger-Formulierungen. **Overtriggering** bedeutet das Gegenteil: Der Skill aktiviert sich bei thematisch ähnlichen, aber unpassenden Aufgaben. Hier helfen klar formulierte Negativgrenzen wie `Do NOT use for ...`.

---

## Evaluation: Woran sich ein Skill messen lässt

Ein Skill ist nicht deshalb gut, weil `SKILL.md` sauber aussieht. Entscheidend ist, ob er bei realen Aufgaben zuverlässig auslöst, die richtigen Referenzen nutzt, die geforderten Schritte einhält und stabile Ergebnisse erzeugt.

Praktisch bewährt hat sich eine einfache Testmatrix mit vier Spalten: verwendeter Skill, Test-Prompt, Eingabedateien und erwartbares Verhalten. Ein Research-Skill sollte etwa relevante Quellen priorisieren und Konflikte markieren. Ein Format-Skill sollte ein vorgegebenes Layout einhalten. Ein Analyse-Skill sollte definierte Kennzahlen berechnen und nur dort frei formulieren, wo die Regeln es erlauben.

Für echte Kurs- oder Projektarbeit reicht meist eine kleine Sammlung repräsentativer Fälle: ein Standardfall, ein Grenzfall mit fehlenden Informationen, ein Konfliktfall und ein Negativfall, bei dem der Skill gerade **nicht** auslösen sollte. Genau diese Negativfälle fehlen in vielen Skill-Sammlungen und sind oft der Grund für Overtriggering.

---

## Wann Skills sinnvoll sind und wann nicht

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

**Bekannte Grenzen:**

- Kein persistentes Memory — jeder Aufruf startet ohne Erinnerung an frühere Interaktionen
- Kein direkter API-Zugriff — externe Calls nur über Tools oder deterministische Skripte
- Modellabhängig — Skill-Effektivität variiert je nach LLM; kleinere Modelle folgen Anweisungen weniger zuverlässig
- Kontextbudget — viele installierte Skills erhöhen den Token-Verbrauch (Stufe 1: ~100 Token pro Skill)

> [!WARNING] Sicherheit bei Community-Skills
> Skills injizieren Instruktionen direkt in das Kontextfenster des Agenten. Ein bösartig gestalteter Skill kann das Verhalten des Agenten gezielt manipulieren (Prompt Injection). SKILL.md vor der Installation lesen, `allowed-tools` auf benötigte Tools beschränken, projektspezifische Installation (`.claude/skills/`) gegenüber globaler bevorzugen.

### Wann aus einem Prompt ein Skill werden sollte

Nicht jeder gelungene Prompt muss in einen Skill überführt werden. Ein Skill lohnt sich dann, wenn dieselbe Fachlogik wiederholt gebraucht wird, wenn feste Prüfschritte nicht ausgelassen werden dürfen, wenn Referenzmaterial regelmäßig nachgeladen werden muss oder wenn Ergebnisse ein stabiles Format einhalten sollen.

Ein einfacher Prüfblick reicht oft aus:

| Frage | Wenn `ja`, spricht das für einen Skill |
|---|---|
| Wird derselbe Ablauf regelmäßig wiederholt? | Fachlogik aus dem Prompt herauslösen |
| Gibt es Pflichtschritte oder Eskalationen? | Skill mit Guardrails statt Freitext |
| Werden Regeln, Beispiele oder Vorlagen gebraucht? | `references/` oder `assets/` nutzen |
| Gibt es deterministische Teilaufgaben? | `scripts/` oder Tools anbinden |
| Soll das Verhalten projektweit konsistent sein? | Skill statt Copy-Paste-Prompt |

Wenn keine dieser Fragen greift, genügt meist ein normaler Prompt oder ein einfacher Workflow.

### Entscheidungsraster: Skill, Tool, Workflow oder Graph

Ein Skill ist die richtige Wahl, wenn Fachlogik, Regeln und Aktivierungsbedingungen im Vordergrund stehen. Ein Tool ist richtig, wenn nur eine konkrete Operation fehlt. Ein Workflow eignet sich für lineare, vorher festgelegte Abläufe. Ein Graph lohnt sich, wenn Verzweigungen, Zustände oder Schleifen explizit modelliert werden müssen.

In der Praxis werden diese Ebenen oft kombiniert: Ein Workflow ruft einen Skill auf, der wiederum Tools nutzt; ein Graph kann mehrere Skills in verschiedenen Zuständen aktivieren. Wichtig ist nur, die Rollen nicht zu vermischen.

---

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Prompt Engineering](./Prompt_Engineering.html) | Wie werden System-Prompts und Anweisungen aufgebaut? |
| [Tool Use & Function Calling](./Tool_Use_Function_Calling.html) | Wie rufen Agenten externe Werkzeuge auf? |
| [State Management](./State_Management.html) | Wie werden mehrstufige Abläufe kontrolliert ausgeführt? |
| [Multi-Agent-Systeme](./Multi_Agent_Systeme.html) | Wie arbeiten mehrere spezialisierte Agenten zusammen? |

Skills sind damit kein Ersatz für Tools, Workflows oder Graphen. Sie sind eine **fachliche Steuerungsschicht** darüber.

---

## Einordnung im Kurs

Im Kurs wird das Thema als **erweiterndes Muster** behandelt, nicht als Kernvoraussetzung für den Einstieg.

Für Einsteiger sind zunächst wichtiger:

- Tool Use & Function Calling
- Prompt Engineering
- State Management und Checkpointing
- Human-in-the-Loop

Skills werden dann relevant, wenn aus einem allgemeinen Agenten ein **verlässlicher, wiederverwendbarer Prozess** werden soll.

---

## Praxisbezug im Projekt

Im Projekt liegen drei fertige Skill-Beispiele unter `06_skill/`:

| Skill | Schwerpunkt | Demo-Notebook |
|---|---|---|
| `compliance/` | Risikoprüfung, deterministisches Scoring, Eskalationsregeln | `M31_Agent_Skill_Compliance.ipynb` |
| `research/` | Web-Recherche, Relevanz-Scoring, Report-Synthese | — |
| `meeting-briefing/` | Meeting-Vorbereitung, Agenda-Strukturierung, Action-Item-Extraktion | — |

Alle drei zeigen denselben Grundgedanken: Die Kernlogik liegt in `SKILL.md`, Detailwissen in `references/`, deterministische Teilaufgaben in `scripts/`. Die Unterschiede liegen nicht in einem festen Architekturzwang, sondern in der jeweiligen Fachlogik.

Eine Vorlage für eigene Skills liegt lokal unter `06_skill/README.md`. Die vorhandenen Beispiele unter `06_skill/compliance/`, `06_skill/research/` und `06_skill/meeting-briefing/` eignen sich als direkte Referenz für den Projektkontext.

---

## Weiterführende Verweise

| Dokument                                                          | Inhalt                                                     |
| ----------------------------------------------------------------- | ---------------------------------------------------------- |
| [Prompt Engineering](./Prompt_Engineering.html) | Wie System-Prompts und Anweisungen aufgebaut werden |
| [Tool Use & Function Calling](./Tool_Use_Function_Calling.html) | Wie Agenten deterministische Hilfsfunktionen aufrufen |
| [State Management](./State_Management.html) | Wie mehrstufige Agenten kontrolliert ausgeführt werden |
| [Human-in-the-Loop](./Human_in_the_Loop.html) | Wie kritische Entscheidungen menschlich abgesichert werden |
| [Aufgaben & Lösungswege](./Aufgabenklassen_und_Loesungswege.html) | Wann ein Skill, Workflow oder Agent sinnvoll ist |

---

**Version:** 1.3    
**Stand:** März 2026      
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.          
