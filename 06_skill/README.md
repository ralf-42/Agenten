# 06_skill — Skill-Bibliothek

Fertige Skill-Beispiele für den Kurs **KI-Agenten. Verstehen. Anwenden. Gestalten.**

Jeder Skill folgt dem Gate-Writer-Muster: ein Gate-Agent (o3) analysiert und strukturiert, ein Writer-LLM (gpt-5.1) erstellt die Ausgabe.

---

## Vorhandene Skills

| Skill | Beschreibung | Demo-Notebook |
|---|---|---|
| `compliance/` | Risikoprüfung mit deterministischem Scoring und Eskalationsregeln | `M31_Agent_Skill_Compliance.ipynb` |
| `research/` | Web-Recherche mit Relevanz-Scoring und Report-Synthese | — |
| `meeting-briefing/` | Meeting-Vorbereitung und Nachbereitung mit Agenda und Action Items | — |

---

## Struktur eines Skills

```text
06_skill/
  mein-skill/
    SKILL.md           ← Kernablauf, Trigger, Hard Rules, Eskalation
    WRITER.md          ← Ausgabeformat und Stil für das Writer-LLM
    references/
      regeln.md        ← Fachregeln, Checklisten (nur bei Bedarf geladen)
      examples.md      ← Beispielfälle für Gate und Writer
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

[Gate-Agent] → [Writer-LLM]

Gate-Aufgaben:
- [Aufgabe 1]
- [Aufgabe 2]
- Tool: [tool_name] aufrufen

## Ausgabeformat

[Format-Vorlage oder Verweis auf WRITER.md]

## Eskalation

- [Sonderfall 1] → [Verhalten]
- [Sonderfall 2] → [Verhalten]
```

---

## Minimal-Template: WRITER.md

```markdown
---
name: mein-skill-writer
description: Writer-Prompt für [Skill-Name].
---

Du bist [Rolle].
Du erhältst den strukturierten Output des Gate-Agenten (o3)
und erstellst daraus [Ausgabetyp] im definierten Format.

## Stil-Regeln

- Sachlich, direkt — keine Füllwörter
- Stichpunkte bevorzugen
- Offene Punkte explizit benennen

## Sonderfälle

- `"status": "no_context"` → leeres Template ausgeben mit Hinweis auf fehlenden Kontext

## Sprache

Deutsch — außer der Kontext ist explizit englischsprachig.
```

---

## Checkliste: Neuen Skill anlegen

- [ ] Ordner `06_skill/<name>/` anlegen
- [ ] `SKILL.md` mit YAML-Frontmatter (`name`, `description`)
- [ ] `WRITER.md` mit Stil-Regeln und Sonderfällen
- [ ] `references/` mit mindestens einer Regeldatei und `examples.md`
- [ ] `scripts/` mit deterministischem Tool, falls benötigt
- [ ] Hard Rules imperativ formuliert (`always`, `never`, `must`)
- [ ] Eskalationsfälle definiert (`no_context`, `conflict`, Mengengrenze)
- [ ] Sprache festgelegt (Deutsch / Englisch)

---

## Weiterführend

- Konzeptdokumentation: [docs/concepts/Skills.md](../docs/concepts/Skills.md)     
- Theorie zum Gate-Writer-Muster: `SKILL.md` in `compliance/` als vollständiges Referenzbeispiel     
- PDF-Leitfaden: `_misc/The-Complete-Guide-to-Building-Skill-for-Claude.pdf`    
