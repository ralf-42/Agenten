# 06_skill — Skill-Bibliothek

Fertige Skill-Beispiele für den Kurs **KI-Agenten. Verstehen. Anwenden. Gestalten.**

---

## Vorhandene Skills

| Skill               | Beschreibung                                                       | Demo-Notebook                                         |
| ------------------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| `compliance/`       | Risikoprüfung mit deterministischem Scoring und Eskalationsregeln  | `M31_Agent_Skill_Compliance.ipynb`, `M34_DeepAgent_Multi_Skill.ipynb` |
| `meeting-briefing/` | Meeting-Vorbereitung und Nachbereitung mit Agenda und Action Items | `M33_DeepAgents_Skill_Meeting_Briefing.ipynb`, `M34_DeepAgent_Multi_Skill.ipynb` |
| `research/`         | Strukturierte Recherche mit Relevanz-Scoring und Report-Synthese   | `M34_DeepAgent_Multi_Skill.ipynb`                     |

### Skill-Details

#### `compliance/`
Risikoprüfung für Lieferanten- und Transaktions-Compliance.

| Datei | Inhalt |
|-------|--------|
| `SKILL.md` | Pflichtschritte, Guardrails, Eskalationsregeln |
| `references/checklist.md` | Prüfkriterien nach Risikoklassen |
| `references/risk_rules.md` | Schwellenwerte und Eskalationsstufen |
| `references/examples.md` | Musterentscheidungen mit Begründung |
| `scripts/risk_score.py` | Deterministisches Scoring-Tool |

Verwendet in: **M31** (Single-Skill), **M34** (Multi-Skill-Routing)

---

#### `meeting-briefing/`
Meeting-Vorbereitung und Nachbereitung mit festen Abschnitten, Quellenpflicht und Action-Item-Extraktion.

| Datei | Inhalt |
|-------|--------|
| `SKILL.md` | Ablauf, Hard Rules, Ausgabeformat |
| `references/agenda_rules.md` | Pflichtabschnitte und Reihenfolge |
| `references/action_rules.md` | Regeln für Action-Item-Extraktion |
| `references/writer-format.md` | Formatvorgaben für den Writer-Subagenten |
| `references/examples.md` | Beispiel-Briefings (Sprint-Review, Kundengespräch) |
| `scripts/extract_actions.py` | Tool: Action Items aus Kontext-Dokumenten extrahieren |

Verwendet in: **M33** (vollständiger Skill-Workflow mit Sub-Agent), **M34** (Multi-Skill-Routing)

---

#### `research/`
Strukturierte Recherche mit Relevanz-Bewertung, Quellen-Synthese und zitierfähigem Report.

| Datei | Inhalt |
|-------|--------|
| `SKILL.md` | Recherche-Workflow, Quellen-Regeln, Ausgabeformat |
| `references/` | Bewertungskriterien und Beispiel-Reports |
| `scripts/` | Scoring-Tool für Quellen-Relevanz |

Verwendet in: **M34** (Multi-Skill-Routing, Demo 3: gemischte Anfrage)

---

## Struktur eines Skills

```text
06_skill/
  mein-skill/
    SKILL.md           ← Kernablauf, Trigger, Hard Rules, Eskalation
    references/
      regeln.md        ← Fachregeln, Checklisten und Formatvorgaben
      examples.md      ← Beispielfälle und Musterantworten
    scripts/
      mein_tool.py     ← Deterministisches Tool (Scoring, Extraktion, …)
```

---

## Minimal-Template: SKILL.md

```markdown
---
name: mein-skill
description: [Was der Skill tut]. Aktivieren wenn Nutzer sagt: "[Trigger-Phrase 1]", "[Trigger-Phrase 2]".
---

# [Skill-Name]

## Aktivierungsbedingung

[Wann wird dieser Skill aktiv? Typische Trigger-Phrasen.]

## Hard Rules

1. [Pflicht-Regel 1 — imperativ formulieren]
2. [Pflicht-Regel 2]
3. [Keine Annahmen bei fehlenden Informationen — Lücken als „offen" markieren]

## Workflow

[Analyse und Regelanwendung]

Aufgaben:
- [Aufgabe 1]
- [Aufgabe 2]
- Tool: [tool_name] aufrufen

## Ausgabeformat

[Format-Vorlage oder Verweis auf eine Referenzdatei]

## Eskalation

- [Sonderfall 1] → [Verhalten]
- [Sonderfall 2] → [Verhalten]
```

## Checkliste: Neuen Skill anlegen

- [ ] Ordner `06_skill/<name>/` anlegen
- [ ] `SKILL.md` mit YAML-Frontmatter (`name`, `description`)
- [ ] `references/` mit mindestens einer Regeldatei und `examples.md`
- [ ] `scripts/` mit deterministischem Tool, falls benötigt
- [ ] Hard Rules imperativ formuliert (`always`, `never`, `must`)
- [ ] Eskalationsfälle definiert (`no_context`, `conflict`, Mengengrenze)
- [ ] Sprache festgelegt (Deutsch / Englisch)

---

## Weiterführend

- Konzeptdokumentation: [docs/concepts/Skills.md](../docs/concepts/Skills.md)     
- Referenzbeispiel: `SKILL.md` in `compliance/` als vollständiges Beispiel     
