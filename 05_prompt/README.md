# 05_prompt – Prompt-Templates

Wiederverwendbare Prompt-Dateien für alle Kursmodule.

## Namenskonvention

```
m##_beschreibung.md
```

- Präfix `m##` entspricht dem Modul, das den Prompt zuerst verwendet (z.B. `m04_` → M04)
- Kleinbuchstaben, Unterstriche statt Leerzeichen
- Kein `M##` (Großbuchstaben) — das ist die Notebook-Konvention

### Hinweis zu `research_*` nach dem Move-B-Pivot

Einige Prompt-Dateien behalten aus Kompatibilitätsgründen `research` im Dateinamen (`m04_research_*`, `m10_research_routing_prompt.md`, `m21_research_lead_prompt.md`). Das ist bewusst keine Rückkehr zum alten Research-Assistant-Leitprojekt. In diesen Prompts bezeichnet `research` den Recherche- und Evidence-Anteil des aktuellen **Meeting- & Research-Briefing-Agenten**.

Dateinamen werden nur geändert, wenn alle Notebook-Referenzen im selben Schritt mitgezogen werden. Inhaltlich müssen die Prompts auf Projekt Kompass, Quellenpflicht, offene Fragen, Risiken, Entscheidungen und Eskalation ausgerichtet sein.

## Dateiformat

Jede Prompt-Datei besteht aus YAML-Frontmatter und optionalen Sections:

```markdown
---
name: m04_mein_prompt
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

| Typ | Sections | Wann |
|-----|----------|------|
| **System-only** | `## system` | Einfache Agenten-Systemanweisungen |
| **Template** | `## system` + `## human` mit `{variablen}` | Strukturierte Prompts mit Eingaben |
| **Few-Shot** | `## system` + mehrere `## human` / `## ai` | Klassifikation, Extraktion mit Beispielen |

## Laden mit `load_prompt()`

```python
from genai_lib.utilities import load_prompt

# System-only oder Template → mode="S" (Standard)
prompt = load_prompt("05_prompt/m04_mein_prompt.md")

# Few-Shot mit ## system / ## human Sections → mode="T"
prompt = load_prompt("05_prompt/m04_research_few_shot_prompt.md", mode="T")

# Mit Variablen befüllen
chain = prompt | llm
result = chain.invoke({"variable1": "Wert"})
```

`load_prompt()` entfernt automatisch das YAML-Frontmatter.

## Prompts nach Modul

| Modul | Dateien |
|-------|---------|
| M03 | `m03_agent_system_prompt.md` |
| M04 | `m04_research_template_prompt.md`, `m04_research_query_prompt.md`, `m04_research_system_prompt.md`, `m04_research_few_shot_prompt.md`, `m04_research_zero_shot_prompt.md` |
| M05 | `m05_studien_zusammenfassung_prompt.md`, `m05_research_signal_classification_prompt.md`, `m05_citation_format_prompt.md`, `m05_research_review_prompt.md` |
| M06 | `m06_multi_tool_system_prompt.md`, `m06_robust_research_system_prompt.md`, `m06_format_check_prompt.md` |
| M09 | `m09_entwurf_prompt.md`, `m09_korrektorat_prompt.md` |
| M10 | `m10_research_routing_prompt.md` |
| M12 | `m12_query_rewrite_prompt.md` |
| M13 | `m13_rag_prompt.md` |
| M14 | `m14_rag_agent_system_prompt.md` |
| M15 | `m15_llm_judge_prompt.md` |
| M20 | `m20_supervisor_system_prompt.md` |
| M21 | `m21_research_lead_prompt.md`, `m21_supervisor_prompt.md`, `m21_writing_lead_prompt.md` |
| M22 | `m22_multi_hop_agent_prompt.md`, `m22_rag_agent_prompt.md` |
| M23 | `m23_risk_classifier_prompt.md` |
| M26 | `m26_quality_judge_prompt.md`, `m26_security_gate_prompt.md` |
| M30 | `m30_crypto_agent_prompt.md`, `m30_math_agent_prompt.md`, `m30_multi_agent_prompt.md`, `m30_notiz_agent_prompt.md` |

## Weiterführend

- Vollständige Format-Referenz: `docs/frameworks/Einsteiger_Prompts.md`
- Prompt Standard: `../_docs/Prompt_Standard.md`

---

**Letzte Aktualisierung:** Mai 2026
**Maintainer:** Ralf
