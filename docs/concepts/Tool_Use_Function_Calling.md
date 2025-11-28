---
layout: default
title: Tool Use & Function Calling
parent: Konzepte
nav_order: 2
description: "Wie KI-Agenten durch Werkzeuge ihre Fähigkeiten erweitern"
has_toc: true
---

# Tool Use & Function Calling
{: .no_toc }

> **Wie KI-Agenten durch Werkzeuge ihre Fähigkeiten erweitern**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1 Warum brauchen LLMs Werkzeuge?

Large Language Models sind beeindruckend in der Textverarbeitung – doch sie haben fundamentale Grenzen:

| Limitation | Beispiel | Lösung durch Tools |
|------------|----------|-------------------|
| **Kein aktuelles Wissen** | "Wie ist das Wetter heute?" | Wetter-API aufrufen |
| **Keine Berechnungen** | "Was ist 17 × 243?" | Taschenrechner-Tool |
| **Kein Dateizugriff** | "Lies die Datei report.pdf" | Datei-Loader-Tool |
| **Keine externen Systeme** | "Buche einen Termin" | Kalender-API |

**Kernidee:** Tools erweitern die Fähigkeiten eines LLMs über reines Textwissen hinaus. Das Modell entscheidet, **wann** und **wie** ein Tool aufgerufen wird – die eigentliche Ausführung übernimmt Python-Code.

---

## 2 Das Konzept: Function Calling

Function Calling ist der Mechanismus, durch den ein LLM strukturiert mitteilt, welches Tool mit welchen Parametern aufgerufen werden soll.

### 2.1 Ablauf im Detail

```mermaid
sequenceDiagram
    participant User
    participant LLM
    participant Tool
    
    User->>LLM: "Multipliziere 7 mit 8"
    LLM->>LLM: Analysiert Anfrage
    LLM-->>Tool: multiply(a=7, b=8)
    Tool-->>LLM: 56
    LLM->>User: "Das Ergebnis ist 56."
```

**Wichtige Erkenntnis:** Das LLM führt das Tool nicht selbst aus – es generiert lediglich einen strukturierten Aufruf (JSON), den die Anwendung interpretiert und ausführt.

### 2.2 Was das LLM "sieht"

Dem Modell werden verfügbare Tools als Schema übergeben:

```json
{
  "name": "multiply",
  "description": "Multipliziert zwei Zahlen.",
  "parameters": {
    "type": "object",
    "properties": {
      "a": {"type": "integer", "description": "Erste Zahl"},
      "b": {"type": "integer", "description": "Zweite Zahl"}
    },
    "required": ["a", "b"]
  }
}
```

Das Modell entscheidet anhand von **Name** und **Beschreibung**, ob und wie es das Tool einsetzt.

---

## 3 Tools definieren mit dem `@tool` Decorator

In LangChain 1.0+ ist der `@tool` Decorator der Standard für Tool-Definitionen. Er generiert automatisch das Schema aus Docstring und Type Hints.

### 3.1 Grundstruktur

```python
from langchain_core.tools import tool

@tool
def tool_name(parameter: type) -> return_type:
    """Kurze Beschreibung des Tools.
    
    Args:
        parameter: Beschreibung des Parameters
    
    Returns:
        Beschreibung des Rückgabewerts
    """
    # Tool-Logik
    return ergebnis
```

### 3.2 Beispiel: Einfaches Rechen-Tool

```python
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multipliziert zwei ganze Zahlen.
    
    Args:
        a: Erste Zahl
        b: Zweite Zahl
    
    Returns:
        Das Produkt von a und b
    """
    return a * b
```

### 3.3 Beispiel: Tool mit Fehlerbehandlung

```python
@tool
def safe_divide(a: float, b: float) -> str:
    """Dividiert a durch b mit Fehlerbehandlung.
    
    Args:
        a: Dividend (Zähler)
        b: Divisor (Nenner)
    
    Returns:
        Das Ergebnis als Text oder eine Fehlermeldung
    """
    try:
        if b == 0:
            return "Fehler: Division durch Null ist nicht erlaubt."
        result = a / b
        return f"Ergebnis: {result:.4f}"
    except Exception as e:
        return f"Fehler bei der Berechnung: {str(e)}"
```

---

## 4 Die Bedeutung guter Docstrings

Der Docstring ist **entscheidend** für die Tool-Nutzung. Das LLM trifft seine Entscheidung ausschließlich auf Basis von Name und Beschreibung.

### 4.1 Schlechter Docstring

```python
@tool
def search(q: str) -> str:
    """Sucht etwas."""  # Zu vage!
    return do_search(q)
```

**Problem:** Das LLM weiß nicht, *was* gesucht wird, *wo* gesucht wird, oder *wann* dieses Tool sinnvoll ist.

### 4.2 Guter Docstring

```python
@tool
def search_company_documents(query: str) -> str:
    """🔍 FIRMEN-DOKUMENTENSUCHE – Durchsucht interne Dokumente.
    
    Verwende dieses Tool für Fragen zu:
    - Unternehmensrichtlinien und Prozessen
    - Produktinformationen und Handbücher
    - Interne Regelwerke und Compliance
    
    NICHT geeignet für: Allgemeinwissen, aktuelle Nachrichten, Berechnungen.
    
    Args:
        query: Suchbegriff oder Frage in natürlicher Sprache
    
    Returns:
        Relevante Textpassagen aus den Firmendokumenten
    """
    return document_retriever.search(query)
```

**Merkmale eines guten Docstrings:**

| Element | Zweck |
|---------|-------|
| **Emoji** | Visuelle Identifikation im Debug-Output |
| **GROSSBUCHSTABEN-Name** | Schnelles Erkennen der Tool-Kategorie |
| **Anwendungsfälle** | Dem LLM zeigen, wann das Tool passt |
| **Negative Abgrenzung** | Verhindern falscher Tool-Aufrufe |
| **Parameter-Beschreibung** | Korrekte Werteübergabe sicherstellen |

---

## 5 Type Hints: Pflicht, nicht Kür

Type Hints sind **zwingend erforderlich** für die automatische Schema-Generierung.

### 5.1 Unterstützte Typen

```python
from typing import List, Optional, Dict

@tool
def process_data(
    text: str,                          # Einfacher String
    count: int,                         # Ganzzahl
    threshold: float,                   # Dezimalzahl
    enabled: bool,                      # Boolean
    items: List[str],                   # Liste von Strings
    config: Optional[Dict[str, str]] = None  # Optionales Dictionary
) -> str:
    """Verarbeitet Daten mit verschiedenen Parametertypen."""
    pass
```

### 5.2 Häufiger Fehler: Fehlende Type Hints

```python
# ❌ FALSCH: Keine Type Hints
@tool
def add(a, b):
    """Addiert zwei Zahlen."""
    return a + b

# ✅ RICHTIG: Mit Type Hints
@tool
def add(a: int, b: int) -> int:
    """Addiert zwei ganze Zahlen."""
    return a + b
```

**Konsequenz ohne Type Hints:** Das generierte Schema ist unvollständig, das LLM kann die Parameter nicht korrekt füllen.

---

## 6 Tools direkt testen

Vor der Integration in einen Agenten sollten Tools isoliert getestet werden.

```python
# Tool-Objekt inspizieren
print(f"Name: {multiply.name}")
print(f"Beschreibung: {multiply.description}")
print(f"Schema: {multiply.args_schema.schema()}")

# Tool direkt aufrufen
result = multiply.invoke({"a": 7, "b": 8})
print(f"Ergebnis: {result}")
```

**Ausgabe:**

```
Name: multiply
Beschreibung: Multipliziert zwei ganze Zahlen.
Schema: {'properties': {'a': {'type': 'integer'}, 'b': {'type': 'integer'}}, 'required': ['a', 'b']}
Ergebnis: 56
```

---

## 7 Tools an ein LLM binden

Ein LLM mit gebundenen Tools kann selbstständig entscheiden, welches Tool wann aufgerufen wird.

### 7.1 Variante A: `bind_tools()`

```python
from langchain.chat_models import init_chat_model

llm = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0.0)

# Tools an das Modell binden
tools = [multiply, safe_divide]
llm_with_tools = llm.bind_tools(tools)

# Aufruf – LLM entscheidet über Tool-Nutzung
response = llm_with_tools.invoke("Was ist 15 mal 23?")
print(response.tool_calls)
```

**Ausgabe:**

```python
[{'name': 'multiply', 'args': {'a': 15, 'b': 23}, 'id': 'call_abc123'}]
```

**Wichtig:** `bind_tools()` führt das Tool nicht aus – es gibt nur die Absicht des LLMs zurück.

### 7.2 Variante B: Agent mit automatischer Ausführung

```python
from langchain.agents import create_agent

agent = create_agent(
    model=llm,
    tools=[multiply, safe_divide],
    system_prompt="Nutze die verfügbaren Tools für Berechnungen."
)

response = agent.invoke({
    "messages": [{"role": "user", "content": "Berechne 15 mal 23"}]
})

print(response["messages"][-1].content)
# Ausgabe: "Das Ergebnis von 15 × 23 ist 345."
```

---

## 8 Praktische Tool-Beispiele

### 8.1 Beispiel: Aktuelles Datum

```python
from datetime import datetime

@tool
def get_current_date() -> str:
    """📅 DATUM – Gibt das aktuelle Datum zurück.
    
    Verwende dieses Tool, wenn nach dem heutigen Datum,
    Wochentag oder aktuellen Zeitpunkt gefragt wird.
    
    Returns:
        Aktuelles Datum im Format "Wochentag, TT.MM.JJJJ"
    """
    now = datetime.now()
    weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", 
                "Freitag", "Samstag", "Sonntag"]
    weekday = weekdays[now.weekday()]
    return f"{weekday}, {now.strftime('%d.%m.%Y')}"
```

### 8.2 Beispiel: Websuche (Stub)

```python
@tool
def web_search(query: str, num_results: int = 3) -> str:
    """🌐 WEBSUCHE – Durchsucht das Internet nach aktuellen Informationen.
    
    Verwende dieses Tool für:
    - Aktuelle Nachrichten und Ereignisse
    - Fakten, die sich ändern können (Aktienkurse, Wetter)
    - Informationen nach dem Wissens-Cutoff des Modells
    
    Args:
        query: Suchbegriff oder Frage
        num_results: Anzahl der gewünschten Ergebnisse (Standard: 3)
    
    Returns:
        Zusammenfassung der Suchergebnisse
    """
    # Hier würde die tatsächliche Suche implementiert
    return f"Suchergebnisse für '{query}': [Platzhalter für echte Ergebnisse]"
```

### 8.3 Beispiel: Dateioperationen

```python
from pathlib import Path

@tool
def read_file(filepath: str) -> str:
    """📄 DATEI LESEN – Liest den Inhalt einer Textdatei.
    
    Args:
        filepath: Pfad zur Datei (relativ oder absolut)
    
    Returns:
        Dateiinhalt als Text oder Fehlermeldung
    """
    try:
        path = Path(filepath)
        if not path.exists():
            return f"Fehler: Datei '{filepath}' nicht gefunden."
        if not path.is_file():
            return f"Fehler: '{filepath}' ist keine Datei."
        
        content = path.read_text(encoding="utf-8")
        if len(content) > 5000:
            return content[:5000] + "\n\n[... Datei gekürzt ...]"
        return content
    except Exception as e:
        return f"Fehler beim Lesen: {str(e)}"
```

---

## 9 Fehlerbehandlung in Tools

Robuste Tools müssen mit Fehlern umgehen können. Ein Tool-Absturz kann den gesamten Agenten blockieren.

### 9.1 Muster: Try-Except mit informativer Rückgabe

```python
@tool
def query_database(sql: str) -> str:
    """🗄️ DATENBANK – Führt eine SQL-Abfrage aus.
    
    Args:
        sql: SQL SELECT-Anweisung
    
    Returns:
        Abfrageergebnis oder Fehlermeldung
    """
    try:
        # Sicherheitsprüfung
        if not sql.strip().upper().startswith("SELECT"):
            return "Fehler: Nur SELECT-Anweisungen sind erlaubt."
        
        # Datenbankabfrage (Pseudocode)
        result = database.execute(sql)
        return f"Ergebnis: {result}"
    
    except ConnectionError:
        return "Fehler: Keine Verbindung zur Datenbank. Bitte später erneut versuchen."
    except TimeoutError:
        return "Fehler: Abfrage hat zu lange gedauert. Bitte die Anfrage vereinfachen."
    except Exception as e:
        return f"Unerwarteter Fehler: {str(e)}"
```

### 9.2 Warum informative Fehlermeldungen?

Das LLM erhält die Rückgabe des Tools als Kontext. Eine gute Fehlermeldung ermöglicht dem Agenten:

- Den Fehler zu verstehen und dem Nutzer zu erklären
- Alternative Strategien zu versuchen
- Sinnvolle Rückfragen zu stellen

**Schlecht:** `return "Error"`
**Gut:** `return "Fehler: Die Datei 'report.pdf' existiert nicht. Verfügbare Dateien: budget.xlsx, notes.txt"`

---

## 10 Best Practices

### 10.1 Do's ✅

| Praxis | Begründung |
|--------|------------|
| **Docstrings mit Anwendungsfällen** | LLM trifft bessere Entscheidungen |
| **Type Hints für alle Parameter** | Automatische Schema-Generierung |
| **Fehlerbehandlung mit Try-Except** | Robuster Agent-Betrieb |
| **Informative Rückgabewerte** | LLM kann Fehler interpretieren |
| **Isolierte Tests vor Integration** | Frühzeitige Fehlererkennung |
| **Emojis für visuelle Identifikation** | Besseres Debugging |

### 10.2 Don'ts ❌

| Anti-Pattern | Problem |
|--------------|---------|
| **Vage Docstrings** | LLM wählt falsche Tools |
| **Fehlende Type Hints** | Schema unvollständig |
| **Unbehandelte Exceptions** | Agent-Absturz |
| **Seiteneffekte ohne Warnung** | Unerwartetes Verhalten |
| **Zu viele Tools auf einmal** | Entscheidungsüberlastung |
| **Sensible Operationen ohne Schutz** | Sicherheitsrisiko |

---

## 11 Zusammenfassung

**Tool Use** ermöglicht KI-Agenten, über reines Textwissen hinauszugehen:

- **Function Calling** ist der Mechanismus, durch den LLMs strukturiert Tools aufrufen
- Der **`@tool` Decorator** generiert automatisch das benötigte Schema
- **Docstrings** sind entscheidend – sie bestimmen, wann das LLM ein Tool wählt
- **Type Hints** sind Pflicht für korrekte Parameter-Übergabe
- **Fehlerbehandlung** macht Tools robust und Agent-freundlich

Im nächsten Schritt werden diese Tools in vollständige Agenten integriert, die selbstständig entscheiden, welche Werkzeuge sie für eine Aufgabe benötigen.

---

**Version:** 1.0  
**Stand:** November 2025  
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
