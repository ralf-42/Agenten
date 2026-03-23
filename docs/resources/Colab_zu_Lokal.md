---
layout: default
title: Von Colab zu Local
parent: Ressourcen
nav_order: 5
description: Anleitung zur Ausführung der Kurs-Notebooks in einer lokalen Jupyter-Umgebung
has_toc: true
---

# Von Colab zur lokalen Umgebung
{: .no_toc }

> **Welche Anpassungen sind nötig, um die Kurs-Notebooks lokal auszuführen?**   

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Einmalige Einrichtung

### Python-Umgebung & genai_lib

```bash
# Virtuelle Umgebung erstellen (empfohlen)
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # Mac/Linux

# genai_lib installieren (ersetzt !uv pip install --system in Colab)
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```

### API-Keys einrichten

In Colab übernimmt `setup_api_keys()` die Keys aus dem Colab-Secret-Manager. Lokal müssen die Keys vorab gesetzt werden — am einfachsten über eine `.env`-Datei im Projektverzeichnis:

```bash
# Datei: Agenten/.env
OPENAI_API_KEY=sk-...
LANGSMITH_API_KEY=ls__...
```

```python
# Alternativ: direkt in der ersten Notebook-Zelle setzen
import os
os.environ["OPENAI_API_KEY"]    = "sk-..."
os.environ["LANGSMITH_API_KEY"] = "ls__..."
```

{: .warning }
> `.env`-Datei niemals in Git einchecken — Eintrag in `.gitignore` prüfen.

---

## Anpassungen in der Setup-Zelle

Jedes Notebook enthält eine erste Zelle mit Colab-spezifischem Code. Diese drei Zeilen müssen angepasst werden:

| Colab-Code | Lokal ersetzen durch | Aufwand |
|---|---|---|
| `!uv pip install --system -q <paket>` | Einmalig im Terminal: `pip install <paket>` | Einmalig |
| `#@title 🔧 Umgebung einrichten{ display-mode: "form" }` | Zeile löschen | Kosmetik |
| `#@markdown <p><font ...>...</font></p>` | Zeile löschen | Kosmetik |
| `get_ipinfo()` | Zeile auskommentieren | Optional |

**Beispiel: Colab → Lokal**

```python
# ❌ Colab (original)
#@title 🔧 Umgebung einrichten{ display-mode: "form" }
!uv pip install --system -q git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
from genai_lib.utilities import check_environment, setup_api_keys, mprint, mermaid, show_trace
setup_api_keys(['OPENAI_API_KEY', 'LANGSMITH_API_KEY'])
check_environment()
get_ipinfo()

# ✅ Lokal (angepasst)
from genai_lib.utilities import check_environment, setup_api_keys, mprint, mermaid, show_trace
setup_api_keys(['OPENAI_API_KEY', 'LANGSMITH_API_KEY'])
check_environment()
```

---

## Besonderheiten einzelner Module

| Modul | Besonderheit | Lokale Anpassung |
|---|---|---|
| **M08, M09** (RAG) | `install_packages([...])` für markitdown, unstructured | `pip install markitdown[all] unstructured[all-docs]` |
| **M28** (Gradio) | `demo.launch(quiet=True)` | Bleibt unverändert — öffnet automatisch im Browser |
| **M30** (MCP) | `!uv pip install fastmcp langchain-mcp-adapters` | `pip install fastmcp langchain-mcp-adapters` |
| **M09, M15** (Datenbanken) | Lokale DB-Dateien (`chroma_m09/`, `m15_checkpoints.db`) | Werden im Arbeitsverzeichnis angelegt — funktioniert identisch |

---

## Was sich nicht ändert

{: .note }
> Die Notebooks haben **minimale Colab-Abhängigkeiten** — der Großteil läuft lokal ohne jede Änderung.

- ✅ LangSmith-Umgebungsvariablen (`os.environ["LANGSMITH_TRACING"]` etc.)
- ✅ Alle LangChain / LangGraph / LangSmith Patterns
- ✅ Alle relativen Dateipfade (keine `/content/`-Pfade in den Notebooks)
- ✅ Kein Google Drive Mounting erforderlich (Notebooks sind selbst-contained)
- ✅ `mprint()`, `mermaid()`, `show_trace()` aus genai_lib

---

## Kurzcheck vor dem ersten Start

- [ ] Virtuelle Umgebung aktiv? (`.venv\Scripts\activate`)
- [ ] `genai_lib` installiert? (`pip show genai-lib`)
- [ ] API-Keys gesetzt? (`echo %OPENAI_API_KEY%`)
- [ ] `#@title`- und `get_ipinfo()`-Zeilen entfernt?
- [ ] Notebook-spezifische Zusatzpakete installiert (M08, M09, M28, M30)?

---

**Version:** 1.0    
**Stand:** März 2026    
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.    
