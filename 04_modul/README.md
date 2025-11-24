# 🤖 Kursbibliothek Agenten und ML

Diese Bibliothek stellt Hilfsmittel und Funktionen für den Kurs **"Agenten"** bereit. Sie erleichtert Teilnehmer:innen den Einstieg und die praktische Anwendung generativer KI-Technologien in Google Colab-Umgebungen.

## 1. 📦 Installation

Die Bibliothek ist für die Installation in Google Colab-Umgebungen optimiert:

```bash
!uv pip install -q git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```

Nach der Installation können die Module importiert werden:

```python
from genai_lib.utilities import setup_api_keys, install_packages
from genai_lib.show_md import show_title, show_info
from genai_lib.prepare_prompt import prepare
```

## 2. 🏗️ Architektur und Module

Die Bibliothek besteht aus modularen Hilfsdateien im `genai_lib/` Verzeichnis:

- **`utilities.py`** - Kernfunktionen für Umgebungssetup, API-Schlüssel-Verwaltung, Paketinstallation und Antwortverarbeitung
- **`prepare_prompt.py`** - PREPARE-Framework-Implementierung für strukturierte Prompt-Entwicklung
- **`show_md.py`** - Jupyter Notebook Display-Utilities für formatierte Markdown-Ausgabe

## 3. 📋 Abhängigkeiten

Die Bibliothek benötigt folgende LangChain- und KI-bezogene Pakete:

- `langchain_openai`
- `langchain-community` 
- `langchain-text-splitters`
- `langchain_experimental`
- `langchain-ollama`
- `chromadb`

Eine vollständige Liste der Abhängigkeiten finden Sie in der `requirements.txt`.

## 4. 🚀 Wichtige Funktionen

### API-Schlüssel-Verwaltung (`utilities.py`)
- `setup_api_keys()` - Richtet API-Schlüssel aus Google Colab userdata für OpenAI, Anthropic, Hugging Face ein
- `install_packages()` - Installiert automatisch benötigte Pakete, falls nicht verfügbar
- `process_response()` - Strukturierte Informationen aus LLM-Antworten extrahieren inkl. Token-Verwendung

### PREPARE-Framework (`prepare_prompt.py`)
- `prepare()` - Strukturierte Prompt-Entwicklung nach dem PREPARE-Framework
  - **P**arameter definieren
  - **R**olle festlegen
  - **E**rgebnis beschreiben
  - **P**rozess strukturieren
  - **A**usgabeformat definieren
  - **R**egeln und Einschränkungen
  - **E**xempel bereitstellen

### Display-Utilities (`show_md.py`)
- `mprint()` / `show_md()` - Markdown-Anzeige in Notebooks
- `show_title()`, `show_info()`, `show_warning()`, `show_success()` - Formatierte Benachrichtigungsfunktionen

## 5. 💡 Verwendung

Typische Verwendung in Google Colab-Lernumgebungen:

```python
# 1. Installation über uv pip in Colab
!uv pip install -q git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# 2. Import der Utilities
from genai_lib.utilities import setup_api_keys, install_packages
from genai_lib.show_md import show_title, show_info
from genai_lib.prepare_prompt import prepare

# 3. Umgebungssetup
setup_api_keys(["OPENAI_API_KEY", "ANTHROPIC_API_KEY"])

# 4. Verwendung der Module
show_title("Mein GenAI Projekt")
show_info("Dies ist eine Beispielinfo")
```

## 6. 🛠️ Entwicklung

### Build und Installation
```bash
# Installation im Entwicklungsmodus
pip install -e .

# Paket erstellen
python setup.py sdist bdist_wheel
```

### Modulausführung
Module können einzeln getestet werden:
```bash
python -m genai_lib.utilities     # Utilities testen
```

## 7. 📁 Dateiorganisation

```
04_modul/
├── genai_lib/               # Hauptpaket für Generative KI
│   ├── __init__.py          # Package-Exports und API
│   ├── utilities.py         # Hilfsfunktionen (API-Keys, Paketinstallation, Prompt-Loader)
│   └── multimodal_rag.py    # Multimodales RAG-System mit CLIP & Vision-LLM
├── README.md                # Diese Datei
└── setup.py                 # Setup-Konfiguration für pip-Installation
```

### Ignorierte Dateien und Verzeichnisse

Die folgenden Dateien und Verzeichnisse werden durch `.gitignore` und `.claudeignore` von der Versionskontrolle und Claude Code ausgeschlossen:

**Python-Build-Artefakte:**
- `__pycache__/`, `*.pyc` - Python-Bytecode-Dateien
- `*.egg-info/` - Python-Paket-Metadaten
- `.pytest_cache/` - Test-Cache
- `.ipynb_checkpoints/` - Jupyter Notebook Checkpoints

**Entwicklungsumgebung:**
- `.venv/`, `venv/` - Virtuelle Python-Umgebungen
- `.obsidian/` - Obsidian-Notizen-Konfiguration

**Projektspezifisch:**
- `_misc/` - Verschiedene Hilfsdateien und temporäre Dateien
- `.tmp.drivedownload`, `.tmp.driveupload` - Temporäre Google Drive Dateien
- `*.pptx`, `*.png`, `*.jpeg` - Binäre Präsentations- und Bilddateien

**Konfiguration und Dokumentation:**
- `.gitignore`, `.claudeignore` - Ignore-Konfigurationen selbst
- `CLAUDE.md` - Claude Code Projektanweisungen (nur für Claude Code sichtbar)

## 8. 📄 Lizenz

Dieses Projekt steht unter der **MIT-Lizenz**. Die Kursmaterialien können frei verwendet, modifiziert und weiterverbreitet werden.

**MIT License - Copyright (c) 2025 Ralf**

Weitere Details finden Sie in der `LICENSE`-Datei.

