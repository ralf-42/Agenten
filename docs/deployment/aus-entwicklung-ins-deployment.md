---
layout: default
title: Produktionsreife Anwendung
parent: Deployment
nav_order: 2
description: Praktische Anleitung für den Weg vom Jupyter Notebook zur produktionsreifen GenAI-Anwendung
has_toc: true
---

# Aus der Entwicklung ins Deployment
{: .no_toc }

> **Vom Notebook zur Produktion**     
> Eine praktische Anleitung für den Weg vom Jupyter Notebook zur produktionsreifen GenAI-Anwendung

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Überblick

Die GenAI-Anwendung wurde in einem Jupyter Notebook entwickelt und getestet. Jetzt soll sie in den Produktivbetrieb. Diese Anleitung zeigt Schritt für Schritt, wie dieser Übergang gelingt.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Entwicklung   │ ──► │   Vorbereitung  │ ──► │   Deployment    │
│    (.ipynb)     │     │    (.py + ...)  │     │   (Container)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Deployment-Strategie zuerst festlegen

Bevor die Umsetzung startet, sollte das Ziel-Betriebsmodell festgelegt werden. So werden Architektur, Build-Prozess und Betriebsaufwand von Anfang an passend geplant.

> [!NOTE] Architektur-Entscheidung     
> Die gewählte Deployment-Variante beeinflusst frühzeitig Projektstruktur, CI/CD und Betriebsverantwortung.

### Übersicht Deploymentvarianten für Python (2026)

Die folgende Marktübersicht hilft bei der Einordnung, welche Betriebsmodelle in der Praxis dominieren:

| Variante                         | Beschreibung                          | Geschätzter Nutzungsanteil | Typische Tools                              |
| -------------------------------- | ------------------------------------- | -------------------------- | ------------------------------------------- |
| **Containerisiert (Docker/K8s)** | Images mit Python + App, orchestriert | ~65-75% (wachsend)         | Docker, Podman, Kubernetes, Helm            |
| **PaaS/Cloud (managed)**         | Provider-managed Runtime              | ~15-20%                    | Heroku, Render, Railway, Vercel, AWS Lambda |
| **Virtuelle Umgebung (venv)**    | Server + venv + Process Manager       | ~10-15%                    | systemd, Supervisor, Gunicorn, NGINX        |
| **Standalone-Pakete**            | PyInstaller/shiv für EXEs/Archive     | ~3-5%                      | PyInstaller, cx_Freeze, Nuitka              |
| **Bare-Metal/System**            | System-Python + pip                   | ~2-5% (Legacy)             | apt/yum + cron/systemd                      |

**Praktische Einordnung:**
- Container sind heute der Standard für Team-Setups, reproduzierbare Builds und CI/CD.
- Managed Plattformen sind stark für schnelle Time-to-Market bei kleinen bis mittleren Anwendungen.
- venv-Deployments bleiben relevant für bestehende Serverlandschaften und interne Tools.
- Standalone- und Bare-Metal-Varianten sind eher Spezial- oder Legacy-Szenarien.

> [!TIP] Für Einsteiger     
> Für den ersten produktiven Rollout ist meist "managed" schneller. Container lohnen sich besonders bei Team-Betrieb und Portabilität.

---

## Phase 1: Notebook aufräumen

Bevor Code extrahiert wird, sollte das Notebook in Ordnung gebracht werden.

**Checkliste:**
- Alle Zellen in logischer Reihenfolge ausführbar?
- Experimenteller Code und Sackgassen entfernt?
- Hardcodierte Werte (API-Keys, Pfade) identifiziert?
- Funktionen und Klassen sauber definiert?

**Tipp:** Den Kernel neu starten und alle Zellen von oben nach unten ausführen. Funktioniert alles fehlerfrei?

---

## Phase 2: Projektstruktur anlegen

Eine saubere Ordnerstruktur für das Projekt:

```
mein-genai-projekt/
├── src/
│   ├── __init__.py
│   ├── main.py           # Hauptanwendung
│   ├── llm_client.py     # LLM-Interaktion
│   └── utils.py          # Hilfsfunktionen
├── tests/
│   └── test_llm_client.py
├── .env.example          # Vorlage für Umgebungsvariablen
├── .gitignore
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## Phase 3: Code aus dem Notebook extrahieren

Der Code wird aus dem Notebook in Python-Module übertragen.

**Vorher (im Notebook):**
```python
# Zelle 1
import openai
client = openai.OpenAI(api_key="sk-abc123...")

# Zelle 5
def frage_llm(prompt):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
```

**Nachher (llm_client.py):**
```python
import os
from openai import OpenAI

class LLMClient:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = os.getenv("MODEL_NAME", "gpt-4")
    
    def frage(self, prompt: str) -> str:
        """Stellt eine Frage an das LLM und gibt die Antwort zurück."""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
```

**Was hat sich geändert?**
- API-Key kommt aus Umgebungsvariable statt hardcodiert
- Code ist in einer Klasse organisiert
- Konfiguration (Model-Name) ist externalisiert
- Docstring dokumentiert die Funktion

---

## Phase 4: Konfiguration externalisieren

Eine `.env.example` als Vorlage:

```bash
# .env.example - Zu .env kopieren und Werte eintragen
OPENAI_API_KEY=dein-api-key-hier
MODEL_NAME=gpt-4
LOG_LEVEL=INFO
```

Die Variablen werden in der Anwendung geladen:

```python
# main.py
from dotenv import load_dotenv
load_dotenv()  # Lädt .env automatisch

from llm_client import LLMClient

def main():
    client = LLMClient()
    antwort = client.frage("Was ist GenAI?")
    print(antwort)

if __name__ == "__main__":
    main()
```

**Wichtig:** `.env` muss in `.gitignore` eingetragen werden – API-Keys gehören nicht ins Repository!

> [!WARNING] Security-Baseline     
> Secrets niemals in Code, Notebooks oder Commit-Historie speichern. Im Zweifel Key sofort rotieren.

---

## Phase 5: Abhängigkeiten dokumentieren

Die `requirements.txt` enthält alle benötigten Pakete:

```txt
openai>=1.0.0
python-dotenv>=1.0.0
fastapi>=0.100.0
uvicorn>=0.23.0
```

**Tipp:** `pip freeze > requirements.txt` liefert einen Ausgangspunkt, aber die Liste sollte aufgeräumt und auf wirklich benötigte Pakete reduziert werden.

---

## Phase 6: Einfache Tests hinzufügen

Auch ohne tiefe Testing-Erfahrung lassen sich grundlegende Tests schreiben:

> [!SUCCESS] Mindeststandard     
> Schon wenige Smoke-Tests verhindern viele regressionsbedingte Ausfälle im Deployment.

```python
# tests/test_llm_client.py
import pytest
from unittest.mock import Mock, patch

def test_llm_client_initialisiert():
    """Testet, ob der Client ohne Fehler erstellt wird."""
    with patch.dict('os.environ', {'OPENAI_API_KEY': 'test-key'}):
        from src.llm_client import LLMClient
        client = LLMClient()
        assert client is not None

def test_frage_gibt_string_zurueck():
    """Testet, ob die Antwort ein String ist."""
    # Mock das API-Response
    with patch('src.llm_client.OpenAI') as mock_openai:
        mock_response = Mock()
        mock_response.choices[0].message.content = "Test-Antwort"
        mock_openai.return_value.chat.completions.create.return_value = mock_response
        
        from src.llm_client import LLMClient
        client = LLMClient()
        antwort = client.frage("Test")
        
        assert isinstance(antwort, str)
```

Tests ausführen mit: `pytest tests/`

---

## Phase 7: API-Endpunkt erstellen (optional)

Wenn die App als Webservice laufen soll, bietet sich FastAPI an:

```python
# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
from llm_client import LLMClient

app = FastAPI(title="Meine GenAI App")
client = LLMClient()

class Anfrage(BaseModel):
    prompt: str

class Antwort(BaseModel):
    antwort: str

@app.post("/frage", response_model=Antwort)
def stelle_frage(anfrage: Anfrage):
    ergebnis = client.frage(anfrage.prompt)
    return Antwort(antwort=ergebnis)

@app.get("/health")
def health_check():
    return {"status": "ok"}
```

Lokal testen mit: `uvicorn main:app --reload`

---

## Phase 8: Containerisierung mit Docker (optional)

Wenn die gewählte Deployment-Strategie containerisiert ist, wird ein `Dockerfile` benötigt:

> [!NOTE] Nur bei Container-Strategie      
> Diese Phase ist optional und nur relevant, wenn als Zielplattform Container genutzt werden.

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Abhängigkeiten installieren
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Anwendungscode kopieren
COPY src/ ./src/

# Port freigeben
EXPOSE 8000

# Anwendung starten
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Container bauen und starten:**

```bash
# Image bauen
docker build -t meine-genai-app .

# Container starten (mit Umgebungsvariablen)
docker run -p 8000:8000 \
  -e OPENAI_API_KEY="dein-key" \
  -e MODEL_NAME="gpt-4" \
  meine-genai-app
```

---

## Phase 9: Deployment auf der Zielplattform

Je nach Anforderung gibt es verschiedene Wege ins Deployment:

| Option | Gut für | Komplexität |
|--------|---------|-------------|
| **Hugging Face Spaces** | Demos, Prototypen | ⭐ Einfach |
| **Railway / Render** | Kleine Apps, APIs | ⭐⭐ Mittel |
| **Google Cloud Run** | Skalierbare APIs | ⭐⭐ Mittel |
| **AWS Lambda** | Event-basierte Apps | ⭐⭐⭐ Fortgeschritten |
| **Kubernetes** | Enterprise, Multi-Service | ⭐⭐⭐⭐ Komplex |

**Für Einsteiger empfohlen:** Hugging Face Spaces oder Railway bieten einfache Git-basierte Deployments.

---

## Zusammenfassung: Die Checkliste

Vor dem Go-Live sollten diese Punkte geprüft werden:

> [!WARNING] Go-Live-Regel     
> Kein Produktionsstart, wenn Security-, Health-Check- oder Basis-Testpunkte offen sind.

- [ ] Code aus Notebook in Module extrahiert
- [ ] Keine Secrets im Code (API-Keys in Umgebungsvariablen)
- [ ] `requirements.txt` vollständig und aufgeräumt
- [ ] `.gitignore` enthält `.env`, `__pycache__`, etc.
- [ ] Grundlegende Tests vorhanden
- [ ] README erklärt Setup und Nutzung
- [ ] Docker-Image baut erfolgreich
- [ ] Health-Check-Endpunkt vorhanden
- [ ] Logging konfiguriert

---

## Typische Fehler vermeiden

**❌ API-Keys im Code**
→ Immer Umgebungsvariablen verwenden

**❌ Alle Notebook-Zellen 1:1 übernommen**
→ Zu sauberen Funktionen und Klassen refaktorieren

**❌ `pip freeze` ohne Aufräumen**
→ Nur benötigte Pakete behalten

**❌ Keine Fehlerbehandlung**
→ API-Fehler abfangen und sinnvolle Meldungen ausgeben

**❌ Kein Health-Check**
→ Deployment-Plattformen brauchen diesen Endpunkt

---

## Weiterführende Ressourcen

- [FastAPI Dokumentation](https://fastapi.tiangolo.com/)
- [Docker für Python-Entwickler](https://docs.docker.com/language/python/)
- [12-Factor App Prinzipien](https://12factor.net/de/)
- [LangServe für LangChain-Apps](https://python.langchain.com/docs/langserve)

---

**Version:** 1.0      
**Letzte Aktualisierung:** Februar 2026      
**Kurs:** Generative KI. Verstehen. Anwenden. Gestalten.      
**Quelle:** *Powered by Anthropic Claude Opus 4.5*      
