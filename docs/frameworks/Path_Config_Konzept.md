---
layout: default
title: path_config — Konzept
parent: Frameworks
nav_order: 10
description: Konzept für zentrale Pfad- und URL-Konfiguration (Entscheidung offen)
---

# path_config — Konzept
{: .no_toc }

> **Status: Entscheidung offen**
> Dieses Dokument hält das Konzept für eine spätere Entscheidung fest.

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Motivation

Mehrere Notebooks verwenden hardcodierte GitHub-Raw-URLs für Datei-Downloads und Skill-Dateien.
Ändert sich Repo-Name, Branch oder Verzeichnisstruktur, sind mehrere Stellen manuell anzupassen.

**Betroffene Notebooks:**

| Typ | Notebooks | Vorkommen |
|-----|-----------|-----------|
| `!curl` Datei-Downloads (`02_daten/`) | M12, M13, M14, M22, M27 | ~20 |
| Skill-URLs (`06_skill/`) | M31, M33 | ~8 |
| Bilder in Markdown (`07_image/`) | M01, M11, M12 | 4 — nicht relevant |

---

## Analogie zu model_config.py

Dasselbe Prinzip wie `model_config.py`: **Primitive bereitstellen, Komposition im Notebook.**

`path_config.py` liefert nur:
- `IS_COLAB` / `IS_LOCAL` — Umgebungserkennung
- `GITHUB_RAW` — Basis-URL für alle Raw-Dateien
- `_BASE` — Basis-Pfad (lokal: Repo-Root, Colab: `os.getcwd()`)

Das Notebook baut daraus eigene Pfade:
```python
from genai_lib.path_config import GITHUB_RAW, _BASE, IS_COLAB
import os

DATA_TEXT  = os.path.join(_BASE, "02_daten", "01_text")
SKILL_BASE = os.path.join(_BASE, "06_skill", "meeting-briefing")
```

---

## Inhalt path_config.py

```python
import os

try:
    import google.colab
    IS_COLAB = True
except ImportError:
    IS_COLAB = False

IS_LOCAL = not IS_COLAB

GITHUB_RAW  = "https://raw.githubusercontent.com/ralf-42/Agenten/main"
_LOCAL_BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
_BASE       = os.getcwd() if IS_COLAB else _LOCAL_BASE
```

---

## Pfadstruktur in Colab

Statt `/content/files/` (flache Struktur) dieselbe Unterverzeichnisstruktur wie im Repo verwenden:

```bash
# Bisher (flach, Colab-spezifisch)
!curl -L {URL}/biografien_1.txt -o /content/files/biografien_1.txt

# Neu (strukturiert, environment-agnostisch)
os.makedirs(DATA_TEXT, exist_ok=True)
!curl -L {GITHUB_RAW}/02_daten/01_text/biografien_1.txt -o {DATA_TEXT}/biografien_1.txt
```

**Vorteil:** Datei-Zugriff nach dem Download ist in Colab und Local identisch — kein `if IS_LOCAL` beim Lesen.

| Umgebung | `DATA_TEXT` |
|----------|-------------|
| Colab | `/content/02_daten/01_text` (via `getcwd()`, kein Hardcode) |
| Local | `C:/.../Agenten/02_daten/01_text` (via `__file__`) |

---

## Skill-URLs (M31, M33)

```python
# Im Notebook
_MB = os.path.join(_BASE, "06_skill", "meeting-briefing") if IS_LOCAL \
      else f"{GITHUB_RAW}/06_skill/meeting-briefing"

SKILL_URLS = {
    "skill":        f"{_MB}/SKILL.md",
    "writer":       f"{_MB}/WRITER.md",
    "agenda_rules": f"{_MB}/references/agenda_rules.md",
    "action_rules": f"{_MB}/references/action_rules.md",
    "examples":     f"{_MB}/references/examples.md",
    "script":       f"{_MB}/scripts/extract_actions.py",
}
```

---

## Offene Punkte vor Entscheidung

1. **curl-Zellen** müssen in M12, M13, M14, M22, M27 angepasst werden (Ausgabepfad + `makedirs`)
2. **Skill-Lade-Logik** in M31, M33 muss auf lokales `open()` vs. `requests.get()` umgestellt werden
3. **Import in "Umgebung einrichten"** analog `model_config`: `from genai_lib.path_config import ...`
4. **Bilder in Markdown-Zellen** — nicht sinnvoll zu zentralisieren, bleiben als GitHub-Raw-URLs

---

**Version:** 1.0 (Konzept)
**Stand:** März 2026
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
