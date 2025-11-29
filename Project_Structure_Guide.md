# Project Structure Guide - Agenten Projekte

> **Standard-Verzeichnisstruktur für Agenten/Machine Learning Projekte**

Dieses Dokument beschreibt die standardisierte Verzeichnisstruktur für alle Agenten-Projekte. Diese Struktur hat sich in der Praxis bewährt und sollte als Basis für alle neuen Projekte verwendet werden.

---

## 📋 Quick Reference: Komplette Struktur

```
ProjectName/
├── 01_notebook/              # Jupyter Notebooks
│   ├── .ipynb_checkpoints/   # Auto-generiert (gitignore)
│   ├── .jupyter/             # Jupyter-Konfiguration
│   └── _misc/                # Experimentelle/alte Notebooks
├── 02_daten/                 # Daten und Datasets
│   ├── 01_text/              # Text-Dateien (txt, md, csv, json)
│   ├── 02_bild/              # Bild-Dateien (jpg, png, etc.)
│   ├── 03_audio/             # Audio-Dateien (mp3, wav, etc.)
│   ├── 04_video/             # Video-Dateien (mp4, avi, etc.)
│   ├── 05_sonstiges/         # Andere Datentypen
│   └── _misc/                # Temporäre/Test-Daten
├── 03_skript/                # Dokumentation & Skripte
│   └── _misc/                # Zusätzliche Dokumente
├── 04_modul/                 # Eigene Python-Module
│   ├── project_lib/          # Haupt-Bibliothek (Projektname)
│   │   ├── __init__.py       # Package Initialisierung
│   │   ├── utilities.py      # Hilfsfunktionen
│   │   └── [weitere_module].py
│   └── _misc/                # Experimentelle Module
├── 05_prompt/                # Prompt-Templates (LangChain)
│   └── _misc/                # Test-Prompts
├── 06_podcast/               # Podcast/Medien (optional, gitignore)
│   └── _misc/
├── 09_courses/               # Externe Kurse/Tutorials (gitignore)
│   └── [kurs-verzeichnisse]/
├── .claudeignore             # Claude Code Ignore-Datei
├── .gitignore                # Git Ignore-Datei
├── CLAUDE.md                 # Claude Code Projektinstruktionen
├── LICENSE                   # Lizenz (MIT empfohlen)
├── README.md                 # Projekt-README
└── requirements.txt          # Python-Abhängigkeiten
```

---

## 📂 Detaillierte Verzeichnis-Beschreibungen

### 1️⃣ `01_notebook/` - Jupyter Notebooks

**Zweck:** Alle Jupyter Notebooks für Experimente, Tutorials und Analysen

**Struktur:**
```
01_notebook/
├── M00_Intro.ipynb              # Hauptnotebooks mit Nummerierung
├── M01_Setup.ipynb              # M = Module (Kurs)
├── M02_Basics.ipynb             # X = Experimentell
├── X01_Advanced_Technique.ipynb
├── .ipynb_checkpoints/          # Auto-generiert (gitignore)
├── .jupyter/                    # Jupyter-Konfiguration
└── _misc/                       # Alte/experimentelle Notebooks
    ├── Version_25_11_04/        # Versionierte Backups
    ├── Kopie von M01.ipynb      # Duplikate
    └── _Fundus/                 # Sammlung von Beispielen
```

**Namenskonvention:**
- **M00-M99:** Haupt-Module (Kurs-Notebooks)
- **X00-X99:** Experimentelle/erweiterte Notebooks
- **A00-A99:** Aufgaben/Challenges
- **_misc/:** Alles was nicht in Hauptstruktur passt

**Best Practices:**
- ✅ Nummerierung für logische Reihenfolge
- ✅ Aussagekräftige Namen nach Nummer
- ✅ Prefix für Kategorisierung (M, X, A)
- ✅ Alte Versionen in `_misc/Version_YYYY_MM_DD/`
- ❌ Keine Leerzeichen in Dateinamen
- ❌ Keine Duplikate im Hauptverzeichnis

**Git-Konfiguration:**
```gitignore
01_notebook/.ipynb_checkpoints/
01_notebook/_misc/
```

---

### 2️⃣ `02_daten/` - Daten und Datasets

**Zweck:** Alle Trainingsdaten, Testdaten und Datasets organisiert nach Typ

**Struktur:**
```
02_daten/
├── 01_text/                     # Text-basierte Daten
│   ├── biografien_1.txt
│   ├── dokumentation.md
│   ├── data.csv
│   └── config.json
├── 02_bild/                     # Bild-Dateien
│   ├── training/
│   ├── validation/
│   └── test/
├── 03_audio/                    # Audio-Dateien
│   └── samples/
├── 04_video/                    # Video-Dateien
├── 05_sonstiges/                # PDF, DOCX, XLSX, etc.
│   ├── documents.pdf
│   └── spreadsheet.xlsx
└── _misc/                       # Temporäre Downloads
```

**Unterstützte Formate:**
- **Text:** `.txt`, `.md`, `.csv`, `.json`, `.xml`, `.html`
- **Bild:** `.jpg`, `.png`, `.gif`, `.bmp`, `.svg`
- **Audio:** `.mp3`, `.wav`, `.ogg`, `.flac`
- **Video:** `.mp4`, `.avi`, `.mov`, `.mkv`
- **Sonstiges:** `.pdf`, `.docx`, `.xlsx`, `.pptx`

**Best Practices:**
- ✅ Daten nach Typ organisieren
- ✅ Unterordner für train/val/test bei ML-Projekten
- ✅ Beschreibende Dateinamen
- ✅ README.md in jedem Unterordner mit Beschreibung
- ⚠️ Große Dateien in `.gitignore` (>10MB)
- ⚠️ Sensible Daten NIEMALS committen

**Git-Konfiguration:**
```gitignore
# Große Daten-Dateien
02_daten/**/*.pdf
02_daten/**/*.mp4
02_daten/**/*.mp3
02_daten/_misc/

# Sensible Daten
02_daten/**/credentials.*
02_daten/**/*_secret.*
```

---

### 3️⃣ `03_skript/` - Dokumentation & Skripte

**Zweck:** Dokumentation, Präsentationen, Skripte und Kursmaterialien

**Struktur:**
```
03_skript/
├── GenAI_all_in_one.pdf         # Vollständiges Kursskript
├── presentation.pptx             # Präsentationen
├── setup_guide.md                # Setup-Anleitungen
├── troubleshooting.md            # Fehlerbehebung
└── _misc/                        # Zusätzliche Dokumente
    ├── old_versions/
    └── drafts/
```

**Typische Inhalte:**
- Kursskripte (PDF, DOCX)
- Präsentationen (PPTX, PDF)
- Setup-Anleitungen
- Troubleshooting-Guides
- API-Dokumentation
- Architektur-Diagramme

**Best Practices:**
- ✅ PDF für finale Dokumente
- ✅ Markdown für lebende Dokumentation
- ✅ Versionierung für wichtige Dokumente
- ❌ Keine Auto-generierten Docs (nutze Sphinx/MkDocs)

---

### 4️⃣ `04_modul/` - Python-Module & Bibliotheken

**Zweck:** Wiederverwendbare Python-Module und Packages

**Struktur:**
```
04_modul/
├── project_lib/                  # Haupt-Package (Projektname)
│   ├── __init__.py               # Package Initialisierung
│   ├── utilities.py              # Hilfsfunktionen
│   ├── multimodal_rag.py         # RAG-System
│   ├── mcp_modul.py              # MCP-Integration
│   ├── config.py                 # Konfigurationen
│   └── constants.py              # Konstanten
├── setup.py                      # Package Installation
├── README.md                     # Package Dokumentation
└── _misc/                        # Experimentelle Module
```

**utilities.py - Standard-Funktionen:**
```python
# 04_modul/genai_lib/utilities.py
# Enthält wiederverwendbare Hilfsfunktionen für Notebooks

# Visualisierung
- mprint(text)         # Markdown-Ausgabe in Notebooks
- mermaid(code)        # Mermaid-Diagramme rendern (kroki.io)

# Environment
- check_environment()              # Python-Version & LangChain-Pakete
- install_packages(packages)       # Pakete installieren (Colab)
- get_ipinfo()                     # Geoinformationen zur IP
- setup_api_keys(keys, globals)    # API-Keys aus Colab userdata

# Prompt-Loading
- load_chat_prompt_template(path)  # Lädt .py Prompt-Templates
```

**Package-Struktur (Beispiel `genai_lib`):**
```python
# 04_modul/genai_lib/__init__.py
"""GenAI Library - Wiederverwendbare KI-Komponenten"""

__version__ = "1.0.0"

from .utilities import (
    setup_api_keys,
    check_environment,
    get_ipinfo,
    mprint,
    mermaid,  # NEU: Mermaid-Diagramme
    install_packages,
    load_chat_prompt_template
)

from .multimodal_rag import MultimodalRAG
from .mcp_modul import MCPClient

__all__ = [
    'setup_api_keys',
    'check_environment',
    'mprint',
    'mermaid',
    'MultimodalRAG',
    'MCPClient',
]
```

**setup.py für Installation:**
```python
from setuptools import setup, find_packages

setup(
    name="project_lib",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        'langchain>=1.0.0',
        'langchain-openai>=0.2.0',
        # weitere Abhängigkeiten
    ],
    python_requires='>=3.10',
)
```

**Installation (für Notebooks):**
```python
# Von GitHub (empfohlen für Google Colab)
!uv pip install --system -q git+https://github.com/user/project.git#subdirectory=04_modul

# Lokal (Development)
!pip install -e 04_modul/
```

**Best Practices:**
- ✅ Ein Package pro Projekt (`project_lib/`)
- ✅ `__init__.py` mit klaren Exports
- ✅ `setup.py` für pip-Installation
- ✅ Type Hints in allen Funktionen
- ✅ Docstrings im Google-Style
- ✅ Tests in `tests/` Unterordner
- ❌ Keine Notebook-spezifische Logik

---

### 5️⃣ `05_prompt/` - Prompt-Templates

**Zweck:** Wiederverwendbare Prompt-Templates für LangChain

**Struktur:**
```
05_prompt/
├── rag_prompt.txt                # RAG System Prompt
├── agent_prompt.txt              # Agent System Prompt
├── summary_prompt.txt            # Zusammenfassungs-Prompt
├── templates/
│   ├── chat_template.json        # ChatPromptTemplate
│   └── structured_prompt.yaml    # Strukturierte Prompts
└── _misc/                        # Test-Prompts
```

**Prompt-Format:**
```python
# 05_prompt/rag_prompt.txt
Du bist ein hilfreicher Assistent für Frage-Antwort-Aufgaben.
Nutze den folgenden Kontext, um die Frage zu beantworten.
Wenn du die Antwort nicht weißt, sage das einfach.
Halte die Antwort präzise (maximal 3 Sätze).

Kontext: {context}

Frage: {question}
```

**Verwendung:**
```python
from pathlib import Path
from langchain_core.prompts import PromptTemplate

# Prompt aus Datei laden
prompt_text = Path("05_prompt/rag_prompt.txt").read_text()
prompt = PromptTemplate.from_template(prompt_text)
```

**Best Practices:**
- ✅ Ein Prompt pro Datei
- ✅ Klare Namensgebung (zweck_prompt.txt)
- ✅ Versionierung für wichtige Prompts
- ✅ Kommentare in Prompts (# Kommentar)
- ✅ Variablen mit {variable} markieren

---

### 6️⃣ `06_podcast/` - Medien (Optional)

**Zweck:** Podcast-Episoden, Interviews, Aufnahmen

**Struktur:**
```
06_podcast/
├── episode_001.mp3
├── episode_002.mp3
├── transcripts/
│   ├── episode_001.txt
│   └── episode_002.txt
└── _misc/
```

**Best Practices:**
- ✅ Nummerierung für Episoden
- ✅ Transkripte separat speichern
- ⚠️ IMMER in `.gitignore` (große Dateien)

**Git-Konfiguration:**
```gitignore
06_podcast/
```

---

### 7️⃣ `09_courses/` - Externe Kurse/Tutorials

**Zweck:** Externe Kursmaterialien, Tutorials, Beispiel-Code

**Struktur:**
```
09_courses/
├── DeepLearning_RAG_Course/
│   ├── notebooks/
│   └── datasets/
├── LangChain_Tutorial/
└── Google_GenAI_Course/
```

**Best Practices:**
- ✅ Ein Unterordner pro Kurs
- ✅ Originale Struktur beibehalten
- ⚠️ IMMER in `.gitignore` (Copyright)

**Git-Konfiguration:**
```gitignore
09_courses/
```

---

## 📄 Root-Level Dateien

### `.gitignore`

**Standard Agenten `.gitignore`:**
```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
*.egg-info/

# Jupyter
.ipynb_checkpoints/
01_notebook/_misc/

# Daten
02_daten/_misc/
02_daten/**/*.pdf
02_daten/**/*.mp4
02_daten/**/*.mp3

# Große Dateien
06_podcast/
09_courses/

# Secrets
.env
*.key
credentials.json

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

---

### `CLAUDE.md`

**Zweck:** Projekt-spezifische Instruktionen für Claude Code

**Inhalt:**
- Projektübersicht
- Technologie-Stack
- Code-Konventionen
- Links zu Must-Have Dokumenten
- Spezielle Projekt-Anforderungen

**Erstellen:**
```bash
# Kopiere Template von bestehendem Projekt
cp GenAI/CLAUDE.md NewProject/CLAUDE.md

# Anpassen für neues Projekt
# - Projekttitel
# - Technologie-Stack
# - Spezifische Patterns
```

---

### `README.md`

**Standard-Struktur:**
```markdown
# Project Name

> Kurzbeschreibung des Projekts

## 🎯 Übersicht
[Projektbeschreibung]

## 🚀 Quick Start
```bash
# Installation
pip install -r requirements.txt

# Projekt starten
jupyter lab
```

## 📂 Projektstruktur
Siehe [Project_Structure_Guide.md](./Project_Structure_Guide.md)

## 📚 Dokumentation
- [LangChain Must-Haves](./LangChain_1.0_Must_Haves.md)
- [Notebook Template](./Notebook_Template_Guide.md)

## 📝 Lizenz
MIT License
```

---

### `requirements.txt`

**Standard Agenten Requirements:**
```txt
# LangChain Stack
langchain>=1.0.0
langchain-core>=1.0.0
langchain-openai>=0.2.0
langchain-community>=0.3.0
langgraph>=0.2.0

# LLM APIs
openai>=1.0.0

# Vektordatenbanken
chromadb>=0.4.0

# Data Science
numpy>=1.24.0
pandas>=2.0.0

# Visualisierung
plotly>=5.18.0

# Development
jupyter>=1.0.0
ipython>=8.0.0
python-dotenv>=1.0.0
```

**Erstellen:**
```bash
# Von bestehendem Environment
pip freeze > requirements.txt

# Oder manuell pflegen (empfohlen)
```

---

## 🛠️ Projekt-Setup (Schritt-für-Schritt)

### 1. Neues Projekt erstellen

```bash
# Projektverzeichnis erstellen
mkdir NewProject
cd NewProject

# Verzeichnisstruktur anlegen
mkdir -p 01_notebook/{.jupyter,_misc}
mkdir -p 02_daten/{01_text,02_bild,03_audio,04_video,05_sonstiges,_misc}
mkdir -p 03_skript/_misc
mkdir -p 04_modul/project_lib
mkdir -p 05_prompt/_misc
mkdir -p 06_podcast/_misc
mkdir -p 09_courses

# Python Package initialisieren
touch 04_modul/project_lib/__init__.py
touch 04_modul/project_lib/utilities.py
touch 04_modul/setup.py
```

### 2. Git initialisieren

```bash
# Git Repository
git init

# .gitignore erstellen (siehe oben)
curl https://raw.githubusercontent.com/ralf-42/Agenten/main/.gitignore -o .gitignore

# Erste Files
git add .
git commit -m "Initial project structure"
```

### 3. Dokumentation anlegen

```bash
# README erstellen
echo "# NewProject" > README.md

# CLAUDE.md von Template kopieren
cp ../Agenten/CLAUDE.md ./CLAUDE.md
# Anpassen für neues Projekt

# Must-Have Dokumente kopieren
cp ../Agenten/LangChain_1.0_Must_Haves.md ./
cp ../Agenten/LangGraph_1.0_Must_Haves.md ./
cp ../Agenten/Notebook_Template_Guide.md ./
cp ../Agenten/Project_Structure_Guide.md ./
```

### 4. Python Environment

```bash
# Virtual Environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Requirements
pip install langchain langchain-openai jupyter
pip freeze > requirements.txt
```

### 5. Erstes Notebook

```bash
jupyter lab

# In Jupyter: New Notebook
# → Kopiere Template aus Notebook_Template_Guide.md
```

---

## ✅ Checkliste: Neue Projektstruktur

### Verzeichnisse
- [ ] `01_notebook/` mit `.jupyter/` und `_misc/`
- [ ] `02_daten/` mit allen 5 Unterordnern + `_misc/`
- [ ] `03_skript/` mit `_misc/`
- [ ] `04_modul/project_lib/` mit `__init__.py`
- [ ] `05_prompt/` mit `_misc/`
- [ ] `06_podcast/` (optional)
- [ ] `09_courses/` (optional)

### Root-Files
- [ ] `.gitignore` (GenAI Template)
- [ ] `CLAUDE.md` (angepasst)
- [ ] `README.md`
- [ ] `LICENSE` (MIT empfohlen)
- [ ] `requirements.txt`
- [ ] `LangChain_1.0_Must_Haves.md`
- [ ] `LangGraph_1.0_Must_Haves.md`
- [ ] `Notebook_Template_Guide.md`
- [ ] `Project_Structure_Guide.md`

### Git
- [ ] Repository initialisiert (`git init`)
- [ ] `.gitignore` konfiguriert
- [ ] Initial commit erstellt

### Python
- [ ] Virtual Environment erstellt
- [ ] Requirements installiert
- [ ] Package-Struktur in `04_modul/`

---

## 🎯 Best Practices Zusammenfassung

### Do's ✅
1. **Konsistente Nummerierung:** `01_`, `02_`, etc.
2. **`_misc/` für Experimente:** Nicht im Hauptverzeichnis
3. **Dokumentation pflegen:** README, CLAUDE.md aktuell halten
4. **Git-Hygiene:** .gitignore für große/sensible Dateien
5. **Package-Struktur:** Wiederverwendbare Module in `04_modul/`
6. **Type-Organisation:** Daten nach Typ trennen (`01_text/`, `02_bild/`)

### Don'ts ❌
1. **Keine flache Struktur:** Alles im Root-Verzeichnis
2. **Keine großen Dateien in Git:** >10MB in .gitignore
3. **Keine Secrets committen:** .env, credentials.json
4. **Keine inkonsistente Nummerierung:** Mal `01_`, mal `1_`
5. **Keine Duplikate:** Alte Versionen in `_misc/`
6. **Keine langen Pfade:** Max. 3-4 Ebenen Tiefe

---

## 📚 Verwandte Dokumente

- [Notebook Template Guide](./Notebook_Template_Guide.md) - Notebook-Struktur
- [LangChain 1.0 Must-Haves](./LangChain_1.0_Must_Haves.md) - Code-Patterns
- [LangGraph 1.0 Must-Haves](./LangGraph_1.0_Must_Haves.md) - Advanced Workflows

---

## 🔄 Migration bestehender Projekte

Falls du ein bestehendes Projekt an diese Struktur anpassen willst:

```bash
# 1. Backup erstellen
cp -r OldProject OldProject_backup

# 2. Neue Struktur anlegen
cd OldProject
mkdir -p 01_notebook 02_daten/01_text 03_skript 04_modul 05_prompt

# 3. Files verschieben
mv *.ipynb 01_notebook/
mv data/* 02_daten/01_text/
mv docs/* 03_skript/
mv src/* 04_modul/

# 4. Git bereinigen
git add .
git commit -m "Restructure project to standard layout"
```

---

**Version:** 1.0
**Letzte Aktualisierung:** November 2025
**Autor:** Agenten Projekt Team

---

> 💡 **Tipp:** Verwende diese Struktur als Template für alle neuen Agenten-Projekte. Konsistenz über Projekte hinweg spart Zeit und erleichtert die Zusammenarbeit!
