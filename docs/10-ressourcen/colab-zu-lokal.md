---
layout: default
title: Von Colab zu Local
parent: Ressourcen
nav_order: 5
description: Kursnotebooks in einer lokalen Jupyter-Umgebung ausführen
has_toc: true
---

# Von Colab zur lokalen Umgebung
{: .no_toc }

Diese Anleitung beschreibt zwei Wege: Notebooks direkt in lokalem Jupyter ausführen oder die Colab-Oberfläche mit einem lokalen Jupyter-Runtime verbinden.

---

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Weg 1: Notebooks in lokalem Jupyter ausführen

### 1. Repository und Python-Umgebung vorbereiten

Die Kursbibliothek `genai_lib` benötigt Python 3.11 oder neuer. Öffne ein Terminal im geklonten Repository `Agenten`.

**Windows PowerShell:**

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install jupyterlab ipykernel python-dotenv
python -m pip install -e .\04_modul
python -m ipykernel install --user --name agenten --display-name "Python (Agenten)"
jupyter lab
```

**macOS oder Linux:**

```bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install jupyterlab ipykernel python-dotenv
python -m pip install -e ./04_modul
python -m ipykernel install --user --name agenten --display-name "Python (Agenten)"
jupyter lab
```

Die Installation von `genai_lib` lädt die Basisabhängigkeiten aus `04_modul/requirements.txt`. Wähle in Jupyter den Kernel **Python (Agenten)** und öffne ein Notebook aus `01_notebook`.

Starte Jupyter aus dem Repository-Verzeichnis `Agenten`, damit relative Pfade zu `02_daten` und anderen Kursdateien aufgelöst werden.

### 2. API-Schlüssel lokal bereitstellen

`setup_api_keys()` liest Schlüssel aus dem Colab-Secret-Manager und ist für Colab gedacht. Lokal lädt `python-dotenv` die Werte aus einer `.env`-Datei im Repository-Verzeichnis.

Lege lokal eine `.env`-Datei an:

```text
OPENAI_API_KEY=dein-openai-schluessel
LANGSMITH_API_KEY=dein-langsmith-schluessel
```

Lade die Werte in der ersten Setup-Zelle:

```python
import os

from dotenv import load_dotenv

load_dotenv()

from genai_lib.utilities import check_environment

check_environment()
print({
    name: bool(os.getenv(name))
    for name in ("OPENAI_API_KEY", "LANGSMITH_API_KEY")
})
```

Die `.env`-Datei ist im Agenten-Repository durch `.gitignore` ausgeschlossen. Ergänze bei Bedarf weitere Schlüssel, die das jeweilige Notebook verwendet. Die Prüfung zeigt nur, ob die Variablen vorhanden sind; sie gibt ihre Werte nicht aus. `check_environment()` gibt die Python-Version und installierte Framework-Pakete aus.

### 3. Colab-spezifische Setup-Zellen anpassen

| Colab-Element | Lokaler Ablauf |
|---|---|
| `!uv pip install --system ...` | Installiere Pakete in der aktivierten Umgebung mit `python -m pip install <paket>` oder in einer Notebook-Zelle mit `%pip install <paket>`. |
| `install_packages([...])` aus `genai_lib.utilities` | Installiere die aufgeführten Pakete einmalig in der aktiven Umgebung; der Helper nutzt `uv` für Colab. |
| `setup_api_keys([...])` | Lade die Schlüssel mit `load_dotenv()` oder setze sie in der Terminal-Umgebung. |
| `#@title` und `#@markdown` | Die Zeilen bleiben in Python gültige Kommentare. In Jupyter erscheinen sie nicht als Colab-Formulare. |
| `get_ipinfo()` | Die Funktion fragt externe Netzwerkinformationen ab. Führe sie nur aus, wenn du diese Diagnose benötigst. |
| `drive.mount(...)` | Verwende lokale Datenpfade und lokale Persistenz. Colabs Drive-Mount steht lokal nicht zur Verfügung. |

Führe die Zellen nach der Einrichtung in einem frischen Kernel der Reihe nach von oben nach unten aus.

### Notebook-spezifische Pakete

Die Basisabhängigkeiten sind in `04_modul/requirements.txt` enthalten. Einzelne Notebooks benötigen zusätzliche Pakete:

| Notebook | Zusatzpakete |
|---|---|
| `M24_Gradio_UI_fuer_Agenten.ipynb` | `gradio` |
| `M25_MCP_Local.ipynb` | `fastmcp`, `langchain-mcp-adapters` und `mcp<2` |

Installiere die Zusatzpakete in der aktiven Umgebung:

```powershell
python -m pip install gradio
python -m pip install fastmcp langchain-mcp-adapters "mcp<2"
```

Führe jeweils nur die Installation für das Notebook aus, das du verwendest. Für den optionalen MCP Inspector wird zusätzlich Node.js mit `npx` benötigt. Der optionale Cloudflare-Tunnel verwendet `cloudflared`.

Die Gradio-Notebooks starten einen lokalen Webserver. Öffne die lokale URL, die `demo.launch(...)` in der Zellausgabe anzeigt. Der Server bleibt aktiv, solange die Zelle läuft.

### Lokale RAG-Daten und Google Drive

`M12_RAG_Agent.ipynb` und `M13_LangSmith_Evaluations_Basics.ipynb` verwenden standardmäßig eine Chroma-Collection im Google-Drive-Pfad. Für eine lokale Ausführung verwenden beide Notebooks denselben lokalen Persistenzpfad:

```python
local_chroma_path = "./chroma_pmo_local"
vectorstore = get_pmo_vectorstore(persist_directory=local_chroma_path)
```

Setze den Pfad sowohl beim Erstellen der Collection im RAG-Agenten als auch beim Öffnen in den Evaluationen. Der Pfad ist relativ zum aktuellen Arbeitsverzeichnis. Starte Jupyter deshalb aus dem Repository-Verzeichnis.

Lokale Chroma-Daten bleiben in `chroma_pmo_local` erhalten. Verwende dieselbe Collection und dieselbe Embedding-Konfiguration, wenn du sie in einem weiteren Notebook öffnest.

## Weg 2: Colab-Oberfläche mit lokalem Jupyter verbinden

Bei diesem Weg bleibt die Colab-Oberfläche geöffnet, während der Code auf dem eigenen Rechner ausgeführt wird. Installiere zusätzlich `notebook` in der aktivierten Umgebung:

```powershell
python -m pip install notebook
jupyter notebook --NotebookApp.allow_origin="https://colab.research.google.com" --port=8888 --NotebookApp.port_retries=0 --NotebookApp.allow_credentials=True
```

Kopiere die beim Start ausgegebene Runtime-URL. Wähle in Colab **Connect** → **Connect to local runtime...** und füge die URL ein. Die genaue Oberfläche kann sich ändern; die aktuelle Anleitung steht bei [Google Colab: Local runtimes](https://research.google.com/colaboratory/local-runtimes.html).

Eine lokale Runtime gibt Notebook-Code Zugriff auf die Ressourcen und Dateien des Rechners. Führe dort nur Notebooks aus, deren Inhalte du geprüft hast. Bei diesem Verbindungsweg werden Notebook-Ausgaben standardmäßig in Google Drive gespeichert. Die lokale Runtime selbst wird nicht mit dem Notebook geteilt. [Google Colab FAQ](https://research.google.com/colaboratory/faq.html)

Für die Kursnotebooks, die Google Drive als Datenquelle voraussetzen, ist die direkte lokale Jupyter-Umgebung aus Weg 1 einfacher: Nutze dafür den lokalen Chroma-Pfad aus dem vorherigen Abschnitt.

## GPU und lokale Modelle

Die in den Kursnotebooks verwendeten API-Modelle und OpenAI-Embeddings benötigen keine lokale GPU. Ein lokales Modell benötigt ein passendes Backend wie Ollama; Hardwareanforderungen hängen vom gewählten Modell ab. Colab-GPU-Auswahl und lokale GPU-Konfiguration sind getrennte Einstellungen.

## Kurzcheck

- Python 3.11 oder neuer ist aktiv.
- Das Repository wurde geöffnet und `genai_lib` ist in der virtuellen Umgebung installiert.
- Jupyter verwendet den Kernel **Python (Agenten)**.
- API-Schlüssel sind als Umgebungsvariablen geladen.
- Zusätzliche Pakete des ausgewählten Notebooks sind installiert.
- Das Notebook wird aus dem Repository-Verzeichnis ausgeführt.
- RAG-Erstellung und Evaluation verwenden denselben Chroma-Persistenzpfad.

## Weiterführende Dokumente

- [Weitere Tools: MCP und Integration]({{ '/05-frameworks/weitere-tools.html' | relative_url }})
- [LangSmith Best Practices]({{ '/05-frameworks/langsmith-best-practices.html' | relative_url }})
- [Google Colab: lokale Runtimes](https://research.google.com/colaboratory/local-runtimes.html)
- [JupyterLab installieren](https://jupyter.org/install)
- [IPython-Kernel in Jupyter installieren](https://ipython.readthedocs.io/en/stable/install/kernel_install.html)

---

**Version:** 1.2<br>
**Stand:** Oktober 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
