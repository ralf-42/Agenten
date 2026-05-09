---
layout: default
title: GenAI_Lib
parent: Einsteiger-Guides
grand_parent: Frameworks
nav_order: 6
description: "Projektspezifische Bibliothek für den Agenten-Kurs"
has_toc: true
---

# GenAI_Lib - Projektspezifische Bibliothek
{: .no_toc }

> **Projektspezifische Bibliothek für den Kurs KI-Agenten**

---

Die `genai_lib` ist eine projektspezifische Python-Bibliothek, die speziell für die Anforderungen dieses Kurses entwickelt wurde. Sie bündelt wichtige Funktionen für multimodale RAG-Systeme und allgemeine Hilfsfunktionen.

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Installation

Die `genai_lib` kann direkt aus dem GitHub-Repository installiert werden:

```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```

## Module im Überblick

Die Bibliothek besteht aus drei Hauptmodulen:

| Modul | Beschreibung | Hauptfunktionen |
|-------|-------------|----------------|
| **utilities.py** | Hilfsfunktionen für Environment-Setup | Environment-Checks, Paket-Installation, API-Keys, Prompt-Templates, LLM-Response-Parsing, Model-Profile, GitHub-Datei-Download |
| **multimodal_rag.py** | Multimodales RAG-System (v3.1) | Text- und Bildsuche, Bild-zu-Bild-Suche, Cross-Modal-Retrieval, System-Status |
| **model_config.py** | Rollenbasierte Modell-Konfiguration | BASELINE, WORKER, JUDGE, PLANNER, ROUTER, CODING, WORKER_PREMIUM, TRANSLATOR, TRANSLATOR_PREMIUM, EMBEDDINGS |

---

## utilities.py - Hilfsfunktionen

### Überblick

> [!INFO] utilities.py auf einen Blick<br>
> Das `utilities`-Modul stellt grundlegende Hilfsfunktionen bereit, die in vielen Notebooks und Projekten wiederkehrend benötigt werden. Alle Funktionen sind über `from genai_lib.utilities import ...` importierbar.

### Hauptfunktionen

#### . `check_environment()`
Überprüft die Entwicklungsumgebung und zeigt installierte Pakete an.

```python
from genai_lib.utilities import check_environment

check_environment()
```

**Ausgabe:**
- Python-Version
- Alle installierten LangChain-Bibliotheken
- Unterdrückt automatisch Deprecation-Warnungen

#### . `install_packages(packages, upgrade=False)`
Installiert Python-Pakete automatisch, wenn sie noch nicht verfügbar sind.

```python
from genai_lib.utilities import install_packages

# Einfache Installation (überspringt bereits importierbare Pakete)
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])

# Versionspins erzwingen: immer installieren/aktualisieren
install_packages(['langchain-core>=1.3.0'], upgrade=True)
```

**Parameter:**
- `packages` (list): Paketnamen oder Tupel `genai_lib`0
- `genai_lib`1 (bool): `genai_lib`2 (Standard) — Skip wenn bereits importierbar. `genai_lib`3 — immer `genai_lib`4 ausführen, nützlich für Versionspins.

**Features:**
- Prüft, ob Pakete bereits installiert sind
- Verwendet `genai_lib`5 für schnelle Installation in Google Colab
- Gibt klare Statusmeldungen (✅ ❌ ⚠️ 🔄)
- Unterstützt Tupel für verschiedene Install- und Import-Namen

#### . `genai_lib`6
Lädt API-Keys aus Google Colab userdata und setzt sie als Umgebungsvariablen.

`genai_lib`7

**Features:**
- Lädt Keys sicher aus Google Colab Secrets
- Erstellt optional globale Variablen für einfachen Zugriff
- Gibt Statusmeldungen für jeden Key aus
- Verhindert unbeabsichtigte Sichtbarkeit durch Return-Werte

#### . `genai_lib`8
Zeigt Geoinformationen zur aktuellen IP-Adresse an.

`genai_lib`9

**Ausgabe:**
- IP-Adresse
- Stadt, Region, Land
- Provider
- Koordinaten, Postleitzahl, Zeitzone

#### . ```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```0
Gibt Markdown-formatierten Text in Jupyter Notebooks aus.

```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```1

#### . ```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```2
Rendert Mermaid-Diagramme direkt im Notebook mit anpassbarer Größe.

```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```3

**Parameter:**
- ```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```4 (str): Mermaid-Code für das Diagramm
- ```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```5 (int, optional): Breite in Pixeln
- ```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```6 (int, optional): Höhe in Pixeln

**Unterstützte Diagrammtypen:**
- Flowcharts (```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```7, ```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```8)
- Sequenzdiagramme (```bash
# Mit pip
pip install git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# Mit uv (empfohlen für Google Colab)
uv pip install --system git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul
```9)
- Gantt-Charts (`utilities`0)
- State Machines (`utilities`1)

**Features:**
- Automatische oder manuelle Größenkontrolle
- Clientseitiges Rendering im Browser via Mermaid CDN (Emojis werden korrekt dargestellt)
- Robuste Fehlerbehandlung mit aussagekräftigen Fehlermeldungen
- Funktioniert in Google Colab und JupyterLab; nicht in VS Code Notebooks

#### . `utilities`2
Lädt Prompt-Templates aus Markdown-Dateien (.md) als ChatPromptTemplate oder String.

`utilities`3

**Parameter:**
- `utilities`4: Gibt ein `utilities`5 zurück (benötigt `utilities`6 / `utilities`7 Sections)
- `utilities`8: Gibt den Inhalt als reinen String zurück. Ein vorhandenes YAML-Frontmatter (Metadaten-Block zwischen `utilities`9 am Dateianfang) wird dabei automatisch entfernt und das Ergebnis mit `from genai_lib.utilities import ...`0 von führenden/folgenden Leerzeichen bereinigt.

**Template-Format (Markdown):**
`from genai_lib.utilities import ...`1

**Format-Konvention:**
- YAML-Frontmatter: Metadaten (name, description, variables)
- `from genai_lib.utilities import ...`2 / `from genai_lib.utilities import ...`3: Message-Rollen als H2-Headings
- `from genai_lib.utilities import ...`4: Platzhalter wie bei ChatPromptTemplate

#### . `from genai_lib.utilities import ...`5 🆕
Universeller Parser für verschiedene Thinking-Formate von LLMs. Extrahiert den Denkprozess und die eigentliche Antwort aus unterschiedlichen Response-Strukturen.

`from genai_lib.utilities import ...`6

**Unterstützte Formate:**

| Provider/Modell | Format | Beispiel |
|-----------------|--------|----------|
| Claude (Extended Thinking) | Liste mit `from genai_lib.utilities import ...`7 Blöcken | `from genai_lib.utilities import ...`8 |
| Gemini | Liste mit `from genai_lib.utilities import ...`9 Blöcken | `check_environment()`0 |
| Qwen3, DeepSeek R1 | String mit `check_environment()`1 Tags | `check_environment()`2 |
| DeepSeek | `check_environment()`3 | Separates Feld im Response |

**Rückgabe:**
- `check_environment()`4 (str): Extrahierter Denkprozess (leer, wenn nicht vorhanden)
- `check_environment()`5 (str): Eigentliche Antwort

**Features:**
- Provider-agnostisch: Ein Parser für alle LLMs
- Fallback-Logik: Prüft automatisch alle bekannten Formate
- Robust: Gibt leeren Thinking-String zurück, wenn kein Denkprozess vorhanden

#### . `check_environment()`6 🆕
Ruft Model-Profile von models.dev ab und zeigt die wichtigsten Capabilities eines LLM-Modells. Nutzt intern `check_environment()`7 und gibt detaillierte Informationen über Structured Output, Function Calling, Vision, Token-Limits, etc. zurück.

`check_environment()`8

**Parameter:**
- `check_environment()`9 (str): Model-Name im Format "provider:model"
- ```python
from genai_lib.utilities import check_environment

check_environment()
```0 (bool): Formatierte Ausgabe aktivieren (Standard: True)
- ```python
from genai_lib.utilities import check_environment

check_environment()
```1: Zusätzliche Parameter für ```python
from genai_lib.utilities import check_environment

check_environment()
```2 (z.B. max_tokens)

**Rückgabe:**
- ```python
from genai_lib.utilities import check_environment

check_environment()
```3: Vollständiges Model-Profile mit allen Capabilities

**Profile-Attribute (Auswahl):**

**Core Capabilities:**
- ```python
from genai_lib.utilities import check_environment

check_environment()
```4: Native Structured Output API
- ```python
from genai_lib.utilities import check_environment

check_environment()
```5: Function Calling Support
- ```python
from genai_lib.utilities import check_environment

check_environment()
```6: JSON Mode Support
- ```python
from genai_lib.utilities import check_environment

check_environment()
```7: Extended Thinking/Reasoning Support

**Multimodal Input:**
- ```python
from genai_lib.utilities import check_environment

check_environment()
```8: Text Input (Standard) - Anzeige: 📝 Text
- ```python
from genai_lib.utilities import check_environment

check_environment()
```9: Bild Input (Vision) - Anzeige: 🖼️ Image
- `install_packages(packages, upgrade=False)`0: Audio Input Support - Anzeige: 🎵 Audio
- `install_packages(packages, upgrade=False)`1: Video Input Support - Anzeige: 🎬 Video

**Multimodal Output:**
- `install_packages(packages, upgrade=False)`2: Text Output (Standard) - Anzeige: 📝 Text
- `install_packages(packages, upgrade=False)`3: Bild-Generierung - Anzeige: 🖼️ Image
- `install_packages(packages, upgrade=False)`4: Audio-Generierung (TTS) - Anzeige: 🎵 Audio
- `install_packages(packages, upgrade=False)`5: Video-Generierung - Anzeige: 🎬 Video

**Token Limits:**
- `install_packages(packages, upgrade=False)`6: Context Window Größe
- `install_packages(packages, upgrade=False)`7: Max. Output-Länge

**Model Configuration:**
- `install_packages(packages, upgrade=False)`8: Temperature-Parameter Support
- `install_packages(packages, upgrade=False)`9: Knowledge Cutoff Date

**Additional Features:**
- ```python
from genai_lib.utilities import install_packages

# Einfache Installation (überspringt bereits importierbare Pakete)
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])

# Versionspins erzwingen: immer installieren/aktualisieren
install_packages(['langchain-core>=1.3.0'], upgrade=True)
```0: Streaming Support
- ```python
from genai_lib.utilities import install_packages

# Einfache Installation (überspringt bereits importierbare Pakete)
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])

# Versionspins erzwingen: immer installieren/aktualisieren
install_packages(['langchain-core>=1.3.0'], upgrade=True)
```1: Async Support

**Features:**
- Quelle: models.dev (Open-Source Model-Index)
- Automatische Capability-Detection
- Formatierte Übersicht mit Symbolen (📝🖼️🎵🎬) oder Raw-Dict
- Reasoning/Thinking Support Detection
- Temperature-Support-Check
- Knowledge Cutoff Date
- Perfekt für Modellvergleiche in Notebooks

**Use Cases:**
- Modell-Fähigkeiten vor Verwendung prüfen (Reasoning, Vision, Audio, etc.)
- Verschiedene LLMs vergleichen (Context Window, Multimodal, Knowledge)
- Feature-Gates in Code (z.B. "nur wenn Vision verfügbar")
- Reasoning-Modelle identifizieren (Claude Extended Thinking, DeepSeek R1)
- Temperature-Unterstützung prüfen
- Debugging und Dokumentation

#### . ```python
from genai_lib.utilities import install_packages

# Einfache Installation (überspringt bereits importierbare Pakete)
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])

# Versionspins erzwingen: immer installieren/aktualisieren
install_packages(['langchain-core>=1.3.0'], upgrade=True)
```2 🆕
Kopiert Dateien aus einem GitHub-Repository (oder Unterverzeichnis) in ein lokales Verzeichnis — ohne vollständigen Clone.

```python
from genai_lib.utilities import install_packages

# Einfache Installation (überspringt bereits importierbare Pakete)
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])

# Versionspins erzwingen: immer installieren/aktualisieren
install_packages(['langchain-core>=1.3.0'], upgrade=True)
```3

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| ```python
from genai_lib.utilities import install_packages

# Einfache Installation (überspringt bereits importierbare Pakete)
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])

# Versionspins erzwingen: immer installieren/aktualisieren
install_packages(['langchain-core>=1.3.0'], upgrade=True)
```4 | str | ```python
from genai_lib.utilities import install_packages

# Einfache Installation (überspringt bereits importierbare Pakete)
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])

# Versionspins erzwingen: immer installieren/aktualisieren
install_packages(['langchain-core>=1.3.0'], upgrade=True)
```5 oder ```python
from genai_lib.utilities import install_packages

# Einfache Installation (überspringt bereits importierbare Pakete)
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])

# Versionspins erzwingen: immer installieren/aktualisieren
install_packages(['langchain-core>=1.3.0'], upgrade=True)
```6 (auch GitHub-URL) |
| ```python
from genai_lib.utilities import install_packages

# Einfache Installation (überspringt bereits importierbare Pakete)
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])

# Versionspins erzwingen: immer installieren/aktualisieren
install_packages(['langchain-core>=1.3.0'], upgrade=True)
```7 | str | Lokales Zielverzeichnis (wird erstellt) |
| ```python
from genai_lib.utilities import install_packages

# Einfache Installation (überspringt bereits importierbare Pakete)
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])

# Versionspins erzwingen: immer installieren/aktualisieren
install_packages(['langchain-core>=1.3.0'], upgrade=True)
```8 | str | Dateimaske, z.B. ```python
from genai_lib.utilities import install_packages

# Einfache Installation (überspringt bereits importierbare Pakete)
install_packages(['numpy', 'pandas'])

# Mit separaten Install- und Import-Namen
install_packages([
    ('markitdown[all]', 'markitdown'),
    'langchain_chroma'
])

# Versionspins erzwingen: immer installieren/aktualisieren
install_packages(['langchain-core>=1.3.0'], upgrade=True)
```9, `packages`0 (Default: `packages`1) |
| `packages`2 | str | GitHub-Token (alternativ: Env-Var `packages`3) |
| `packages`4 | bool | Unterordner einschließen (Default: `packages`5) |
| `packages`6 | str | Branch-Name (Default: wird automatisch ermittelt) |
| `packages`7 | bool | Nur anzeigen, nichts kopieren |

**Rückgabe:**
- `packages`8: Liste der kopierten (oder bei `packages`9: gefundenen) Dateipfade

**Features:**
- Nutzt GitHub Contents API — kein `genai_lib`00 nötig
- Unterstützt Unterverzeichnisse großer Repos direkt
- Erhält die Verzeichnisstruktur im Zielverzeichnis
- Automatische Branch-Erkennung (`genai_lib`01, `genai_lib`02, etc.)

---

#### . `genai_lib`03 🆕
Zeigt die letzten LangSmith-Runs eines Projekts als formatierte Markdown-Tabelle direkt im Notebook.

`genai_lib`04

**Parameter:**
- `genai_lib`05 (str): Name des LangSmith-Projekts (z.B. `genai_lib`06)
- `genai_lib`07 (int): Anzahl der anzuzeigenden Runs (Standard: 5)
- `genai_lib`08 (bool): Child-Runs (Tool-Calls, LLM-Calls) des letzten Runs anzeigen (Standard: False)

**Ausgabe (Haupttabelle):**

| Run | Status | Dauer | Child-Runs |
|-----|--------|-------|------------|
| `genai_lib`09 | ✅ success | 2.3s | 4 |
| `genai_lib`10 | ❌ error | 1.1s | 2 |

**Ausgabe mit `genai_lib`11 (Step-Analyse):**

| # | Typ | Name | Status | Dauer |
|---|-----|------|--------|-------|
| 1 | `genai_lib`12 | `genai_lib`13 | ✅ | 1.8s |
| 2 | `genai_lib`14 | `genai_lib`15 | ✅ | 0.4s |

**Erkannte Anti-Patterns (`genai_lib`16):**
- **Retry-Loops:** Wiederholter Tool-Call mit gleichen Argumenten nach Fehler
- **Over-Planning:** Viele interne Steps, wenig Ergebnis-Output
- **Missing Tool Use:** Agent antwortet ohne Tool-Call trotz verfügbarer Tools
- **Hohe Child-Run-Anzahl:** Deutet auf interne Loops oder Middleware hin

**Voraussetzung:** LangSmith muss konfiguriert sein (`genai_lib`17, `genai_lib`18).

---

## multimodal_rag.py - Multimodales RAG

### Überblick

Das `genai_lib`19-Modul implementiert ein vollständiges RAG-System mit Unterstützung für Text- und Bilddokumente. Es kombiniert OpenAI-Embeddings für Text und CLIP-Embeddings für Bilder.

### Architektur

`genai_lib`20

> [!INFO] LangChain 1.0+ Integration (v3.1)<br>
> Das `genai_lib`21-Modul verwendet moderne LangChain 1.0+ Patterns:
> - Nutzt `genai_lib`22 für LLM-Initialisierung
> - Vision-Analysen mit `genai_lib`23 und Standard Content Blocks
> - Provider-agnostische Multimodal-Verarbeitung

### Hauptfunktionen

#### . `genai_lib`24
Initialisiert das vollständige RAG-System.

`genai_lib`25

**Was wird initialisiert:**
- OpenAI Text-Embeddings
- CLIP-Modell für Bild-Embeddings
- GPT-4o-mini für Text und Vision (via `genai_lib`26 - LangChain 1.0+)
- ChromaDB mit zwei Collections (texts, images)
- MarkItDown für Dokumentenkonvertierung

**Interne LangChain 1.0+ Patterns:**
`genai_lib`27

#### . `genai_lib`28
Verarbeitet ein Verzeichnis mit Text- und Bilddateien.

`genai_lib`29

**Unterstützte Dateitypen:**
- **Text:** `genai_lib`30, `genai_lib`31, `genai_lib`32, `genai_lib`33, `genai_lib`34, `genai_lib`35
- **Bilder:** `genai_lib`36, `genai_lib`37, `genai_lib`38, `genai_lib`39, `genai_lib`40

**Features:**
- Automatische Dokumentenkonvertierung mit MarkItDown
- Text-Chunking mit RecursiveCharacterTextSplitter
- Automatische Bildbeschreibung mit GPT-4o-mini
- CLIP-Embeddings für Bilder
- Fortschrittsanzeige

#### . `genai_lib`41
Durchsucht Text und Bilder gleichzeitig.

`genai_lib`42

**Rückgabe:**
- `genai_lib`43: Liste von LangChain Documents mit Text-Chunks
- `genai_lib`44: Liste von Dictionaries mit Bildpfaden und Metadaten

#### . `genai_lib`45
Findet ähnliche Bilder zu einem Query-Bild (Bild → Bild Suche).

`genai_lib`46

**Use Cases:**
- Duplikate finden
- Ähnliche Produkte vorschlagen
- Bildkategorisierung

#### . `genai_lib`47
Findet Textdokumente, die zum Bildinhalt passen (Bild → Text Suche).

`genai_lib`48

**Use Cases:**
- Produktbeschreibungen zu Bildern finden
- Dokumentation zu Screenshots suchen
- Bild-Text-Verknüpfung in Datenbanken

#### . `genai_lib`49
Gibt Statistiken über das RAG-System zurück.

`genai_lib`50

**Rückgabe:**
- `genai_lib`51: Anzahl der Text-Dokument-Chunks
- `genai_lib`52: Anzahl der Bilder in der Datenbank
- `genai_lib`53: Anzahl der Bildbeschreibungen
- `genai_lib`54: Gesamtanzahl aller Einträge

#### . `genai_lib`55
Löscht die Datenbank komplett für einen Neustart.

`genai_lib`56

### Vollständiges Beispiel

`genai_lib`57

---

## Best Practices

### . Environment-Setup in Notebooks
`genai_lib`58

### . LangSmith Trace-Analyse
`genai_lib`59

### . Multimodales RAG-System
`genai_lib`60

---

## Abhängigkeiten

### Kern-Abhängigkeiten
`genai_lib`61

---

## model_config.py - Rollenbasierte Modell-Konfiguration

### Überblick

> [!INFO] model_config.py auf einen Blick
> Das `genai_lib`62-Modul definiert Modell-IDs als benannte Konstanten nach Rolle. Die Instanziierung erfolgt im Notebook mit `genai_lib`63, sodass API-Keys bereits gesetzt sind.

`genai_lib`64

### Konstanten

| Konstante | Modell | Typischer Einsatz |
|-----------|--------|------------------|
| `genai_lib`65 | `genai_lib`66 | Grundlagen, Demos, Lernbeispiele mit `genai_lib`67 |
| `genai_lib`68 | `genai_lib`69 | Einfache Routing- und Auswahlentscheidungen |
| `genai_lib`70 | `genai_lib`71 | Supervisor, Evaluation, LLM-as-Judge, Security |
| `genai_lib`72 | `genai_lib`73 | Aufgabenzerlegung, Schritt-Planung, Agentic RAG |
| `genai_lib`74 | `genai_lib`75 | RAG-Synthese, strukturierte Ausgaben, Subagenten |
| `genai_lib`76 | `genai_lib`77 | Komplexe RAG, finale Reports, kritische Synthese |
| `genai_lib`78 | `genai_lib`79 | Code-Generierung, Refactoring, technische Agenten |
| `genai_lib`80 | `genai_lib`81 | Rohübersetzung, UI-Texte, Kursmaterial |
| `genai_lib`82 | `genai_lib`83 | Stilistisch hochwertige Übersetzungen |
| `genai_lib`84 | `genai_lib`85 | Retrieval, Chunk-Suche, Vektorindizes |

> [!DANGER] Kein temperature bei GPT-5.x und o3<br>
> Alle Konstanten außer `genai_lib`86 basieren auf Modellen ohne `genai_lib`87-Support. Parameter einfach weglassen — bei Bedarf über `genai_lib`88 steuern.

### Verwendung

`genai_lib`89

---

## Lizenz

MIT License - Copyright (c) 2025 Ralf

Die Module stehen unter der MIT-Lizenz und können frei für eigene Projekte verwendet werden.


---

**Version:**    3.2<br>
**Stand:**    März 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Einsteiger-Guides](../einsteiger-guides.html) | Wo starte ich als Einsteiger mit GenAI_Lib? |
| [Best Practices](../best-practices.html) | Welche Produktionsstandards gelten für GenAI_Lib? |
