# 05_prompt – Prompt-Templates

Wiederverwendbare Prompt-Dateien für alle Kursmodule.

## Namenskonvention

```
m##_beschreibung_prompt.md
```

- Modul-ID als Präfix: `m##` ist das Modul, in dem der Prompt zuerst eingeführt wird (z.B. `m12_rag_agent_system_prompt.md`). Wird ein Prompt in mehreren Modulen genutzt, gilt das erste Modul (`m11_rag_prompt.md`, auch im Folgemodul verwendet)
- Ausschließlich Kleinbuchstaben und Unterstriche (`snake_case`), keine Bindestriche oder Leerzeichen
- Das Präfix gilt auch für die GitHub-URLs in `load_prompt(...)`; Platzhalter in Beispielen heißen `mXX_...`
- Wird ein Notebook neu nummeriert, müssen Dateiname und alle Referenzen im selben Schritt angepasst werden

### Hinweis zu `pmo_*`

Prompt-Dateien, die den PMO-Assistenten betreffen, tragen `pmo` im Dateinamen (`m##_pmo_*`, `m05_robust_pmo_system_prompt.md`, `m09_pmo_routing_prompt.md`). Der Name `research` wird nicht mehr verwendet.

Dateinamen werden nur geändert, wenn alle Notebook-Referenzen im selben Schritt mitgezogen werden. Inhaltlich müssen die Prompts auf Projekt Kompass, Quellenpflicht, offene Fragen, Risiken, Entscheidungen und Eskalation ausgerichtet sein.

## Dateiformat

Jede Prompt-Datei besteht aus YAML-Frontmatter und optionalen Sections:

```markdown
---
name: mein_prompt
description: Kurze Beschreibung des Zwecks
variables: [variable1, variable2]   # [] wenn keine Variablen
---

## system

Systemanweisung hier.

## human

Nutzeranfrage mit optionalen {variable1}-Platzhaltern.

## ai

Beispielantwort (nur bei Few-Shot nötig).
```

### Drei Typen

| Typ | Struktur | Loader | Wann |
|-----|----------|--------|------|
| **System-only** | direkt nach Frontmatter oder `## system` | `mode="S"` | Einfache Agenten-Systemanweisungen |
| **Template** | `## system` + `## human` mit `{variablen}` | `mode="T"` | Strukturierte Prompts mit Eingaben |
| **Few-Shot** | `## system` + mehrere `## human` / `## ai` | `mode="T"` | Klassifikation, Extraktion mit Beispielen |

### Struktur-Tags für komplexe System-Prompts

Komplexe System-Prompts für Agentensteuerung, Supervisor-Pattern, Tool-Budgets oder Sicherheitsgrenzen dürfen XML-artige Abschnittstags verwenden. Sie werden als reiner System-Prompt mit `mode="S"` geladen.

Empfohlene Tags:

| Tag | Zweck |
|-----|-------|
| `<Role>` | Rolle und Hauptauftrag des Agenten |
| `<Team>` | verfügbare Agenten, Teams oder Tools |
| `<Task>` | konkrete Kernaufgabe |
| `<Workflow>` | erwarteter Ablauf oder Routing-Logik |
| `<Instructions>` | operative Arbeitsregeln |
| `<HardLimits>` | harte Grenzen, Budgets und Abbruchregeln |
| `<OutputRules>` | Ausgabeformat und Antwortgrenzen |

Regeln:

- Tags werden nur in System-only Prompts verwendet.
- Tag-Namen enthalten keine Leerzeichen.
- Budget-Regeln nennen immer, was gezählt wird und pro welchem Scope sie gelten, zum Beispiel: `Tool-Budget: maximal 2 Tool-Aufrufe pro Nutzeranfrage.`
- Harte Grenzen gehören in `<HardLimits>`, nicht verstreut in Fließtext.

## Laden mit `load_prompt()`

```python
from genai_lib.utilities import load_prompt

# System-only → mode="S"
system_prompt = load_prompt("05_prompt/m03_pmo_system_prompt.md", mode="S")

# Template mit ## system / ## human Sections → mode="T"
prompt = load_prompt("05_prompt/m03_pmo_template_prompt.md", mode="T")

# Mit Variablen befüllen
chain = prompt | llm
result = chain.invoke({"variable1": "Wert"})
```

`load_prompt()` entfernt automatisch das YAML-Frontmatter.

## Prompts nach Modul

| Modul | Dateien |
|-------|---------|
| Prompt Engineering für Agenten | `m03_pmo_template_prompt.md`, `m03_pmo_system_prompt.md` |
| Structured Output | `m04_protokollnotiz_prompt.md`, `m04_pmo_signal_classification_prompt.md`, `m04_citation_format_prompt.md`, `m04_pmo_review_prompt.md` |
| Multi-Tool-Agents | `m05_multi_tool_system_prompt.md`, `m05_robust_pmo_system_prompt.md` |
| Conditional Routing | `m09_pmo_routing_prompt.md` |
| RAG Grundlagen | `m11_query_rewrite_prompt.md`, `m11_rag_prompt.md` |
| RAG-Agent | `m12_rag_agent_system_prompt.md` |
| MCP Local | `m25_math_agent_prompt.md`, `m25_multi_agent_prompt.md`, `m25_notiz_agent_prompt.md` |

`_backup/` enthält nicht mehr genutzte Prompts (kein Notebook lädt sie per `load_prompt`; Stand 2026-10-23: `quality_judge_prompt`, `security_gate_prompt` (früher Integration Pipeline); Stand 2026-10-06: StateGraph Basics, LangSmith Evaluations Basics, Supervisor Pattern bis Agent Security Best Practices, `agent_system`, `research_few_shot`, `research_zero_shot`, `research_query`, `format_check`, `crypto_agent` sowie ältere Varianten). Rückfall-Sicherung, nicht löschen.

## Weiterführend

- Vollständige Format-Referenz: `../docs/04-agenten-implementierung/entwurf/prompt-engineering.md`
- Prompt Standard: `../_docs/Prompt_Standard.md`

---

**Stand:** Juli 2026
**Maintainer:** Ralf
