# 05_prompt – Prompt-Templates

Wiederverwendbare Prompt-Dateien für alle Kursmodule.

## Namenskonvention

```
m##_beschreibung.md
```

- Präfix `m##` entspricht dem Modul, das den Prompt zuerst verwendet (z.B. `m03_` → M03)
- Kleinbuchstaben, Unterstriche statt Leerzeichen
- Kein `M##` (Großbuchstaben) — das ist die Notebook-Konvention

### Hinweis zu `research_*` nach dem Move-B-Pivot

Einige Prompt-Dateien behalten `research` im Dateinamen (`m03_research_*`, `m09_research_routing_prompt.md`, `m20_research_lead_prompt.md`). Das bezeichnet hier den Recherche- und Evidence-Anteil des aktuellen **Meeting- & Research-Briefing-Agenten**, nicht ein eigenes Leitprojekt.

Dateinamen werden nur geändert, wenn alle Notebook-Referenzen im selben Schritt mitgezogen werden. Inhaltlich müssen die Prompts auf Projekt Kompass, Quellenpflicht, offene Fragen, Risiken, Entscheidungen und Eskalation ausgerichtet sein.

## Dateiformat

Jede Prompt-Datei besteht aus YAML-Frontmatter und optionalen Sections:

```markdown
---
name: m03_mein_prompt
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
system_prompt = load_prompt("05_prompt/m02_agent_system_prompt.md", mode="S")

# Template oder Few-Shot mit ## system / ## human Sections → mode="T"
prompt = load_prompt("05_prompt/m03_research_few_shot_prompt.md", mode="T")

# Mit Variablen befüllen
chain = prompt | llm
result = chain.invoke({"variable1": "Wert"})
```

`load_prompt()` entfernt automatisch das YAML-Frontmatter.

## Prompts nach Modul

| Modul | Dateien |
|-------|---------|
| M02 | `m02_agent_system_prompt.md` |
| M03 | `m03_research_template_prompt.md`, `m03_research_query_prompt.md`, `m03_research_system_prompt.md`, `m03_research_few_shot_prompt.md`, `m03_research_zero_shot_prompt.md` |
| M04 | `m04_studien_zusammenfassung_prompt.md`, `m04_research_signal_classification_prompt.md`, `m04_citation_format_prompt.md`, `m04_research_review_prompt.md` |
| M05 | `m05_multi_tool_system_prompt.md`, `m05_robust_research_system_prompt.md`, `m05_format_check_prompt.md` |
| M08 | `m08_entwurf_prompt.md`, `m08_korrektorat_prompt.md` |
| M09 | `m09_research_routing_prompt.md` |
| M11 | `m11_query_rewrite_prompt.md` |
| M12 | `m12_rag_prompt.md` |
| M13 | `m13_rag_agent_system_prompt.md` |
| M14 | `m14_llm_judge_prompt.md` |
| M19 | `m19_supervisor_system_prompt.md` |
| M20 | `m20_research_lead_prompt.md`, `m20_supervisor_prompt.md`, `m20_writing_lead_prompt.md` |
| M21 | `m21_multi_hop_agent_prompt.md`, `m21_rag_agent_prompt.md` |
| M22 | `m22_risk_classifier_prompt.md` |
| M25 | `m25_quality_judge_prompt.md`, `m25_security_gate_prompt.md` |
| M29 | `m29_crypto_agent_prompt.md`, `m29_math_agent_prompt.md`, `m29_multi_agent_prompt.md`, `m29_notiz_agent_prompt.md` |

## Weiterführend

- Vollständige Format-Referenz: `../docs/04-agenten-implementierung/entwurf/prompt-engineering.md`
- Prompt Standard: `../_docs/Prompt_Standard.md`

---

**Letzte Aktualisierung:** Juli 2026
**Maintainer:** Ralf
