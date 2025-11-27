# Agent-Architekturen

> **Verschiedene Architekturmuster und Design-Prinzipien für KI-Agenten**

---

## Überblick

Ein KI-Agent ist mehr als ein einfacher Chatbot. Während ein Chatbot auf Eingaben reagiert und Antworten generiert, kann ein Agent **selbstständig Entscheidungen treffen**, **Werkzeuge nutzen** und **mehrstufige Aufgaben lösen**. Die Wahl der richtigen Architektur bestimmt maßgeblich, wie leistungsfähig, zuverlässig und wartbar ein Agent-System wird.

Vier grundlegende Architekturmuster haben sich in der Praxis etabliert:

| Architektur | Kernidee | Komplexität |
|-------------|----------|-------------|
| **ReAct** | Denken → Handeln → Beobachten | ⭐⭐ |
| **Tool-Calling** | LLM wählt und nutzt Werkzeuge | ⭐⭐ |
| **Workflow-basiert** | Definierte Schritte mit Verzweigungen | ⭐⭐⭐ |
| **Multi-Agent** | Spezialisierte Agenten arbeiten zusammen | ⭐⭐⭐⭐ |

---

## 1 | ReAct-Architektur

ReAct (Reasoning + Acting) beschreibt einen iterativen Zyklus: Der Agent **denkt nach** (Reasoning), **führt eine Aktion aus** (Acting) und **beobachtet das Ergebnis**. Dieser Zyklus wiederholt sich, bis die Aufgabe gelöst ist.

```mermaid
flowchart LR
    A[Aufgabe] --> B[Denken]
    B --> C[Handeln]
    C --> D[Beobachten]
    D --> E{Ziel erreicht?}
    E -->|Nein| B
    E -->|Ja| F[Antwort]
```

**Charakteristik:**
- Transparenter Denkprozess (nachvollziehbar)
- Gut geeignet für explorative Aufgaben
- Kann bei komplexen Problemen viele Iterationen benötigen

**Typischer Einsatz:** Recherche-Aufgaben, Problemlösung mit unbekanntem Lösungsweg

---

## 2 | Tool-Calling-Architektur

Bei dieser Architektur entscheidet das LLM, **welches Werkzeug** mit **welchen Parametern** aufgerufen werden soll. Das Ergebnis fließt zurück in den Kontext, und der Agent formuliert die finale Antwort.

```mermaid
flowchart TD
    A[Benutzeranfrage] --> B[LLM analysiert]
    B --> C{Tool nötig?}
    C -->|Ja| D[Tool auswählen]
    D --> E[Tool ausführen]
    E --> F[Ergebnis verarbeiten]
    F --> B
    C -->|Nein| G[Antwort generieren]
```

**Charakteristik:**
- LLM als "Orchestrator" der Werkzeuge
- Erweiterbar durch neue Tools ohne Architekturänderung
- Abhängig von der Qualität der Tool-Beschreibungen

**Typischer Einsatz:** Assistenten mit definierten Fähigkeiten (Kalender, E-Mail, Datenbank)

---

## 3 | Workflow-basierte Architektur

Hier werden Arbeitsschritte als **Graph mit Knoten und Kanten** modelliert. Jeder Knoten repräsentiert eine Verarbeitung, Kanten definieren den Ablauf – einschließlich bedingter Verzweigungen.

```mermaid
flowchart TD
    START((Start)) --> A[Eingabe analysieren]
    A --> B{Kategorie?}
    B -->|Technik| C[Technik-Agent]
    B -->|Vertrieb| D[Vertrieb-Agent]
    B -->|Sonstiges| E[Fallback]
    C --> F[Qualitätsprüfung]
    D --> F
    E --> F
    F --> END((Ende))
```

**Charakteristik:**
- Vorhersagbarer, kontrollierbarer Ablauf
- Explizite Fehlerbehandlung möglich
- Komplexität steigt mit Anzahl der Verzweigungen

**Typischer Einsatz:** Mehrstufige Prozesse, Genehmigungsworkflows, RAG-Pipelines

---

## 4 | Multi-Agent-Architektur

Mehrere spezialisierte Agenten arbeiten zusammen. Ein **Supervisor** koordiniert die Aufgabenverteilung, oder Agenten kommunizieren **kollaborativ** miteinander.

```mermaid
flowchart TD
    A[Aufgabe] --> S[Supervisor]
    S --> R[Research-Agent]
    S --> W[Writer-Agent]
    S --> C[Code-Agent]
    R --> S
    W --> S
    C --> S
    S --> E[Finale Antwort]
```

**Varianten:**

| Pattern | Beschreibung |
|---------|-------------|
| **Supervisor** | Ein Agent verteilt Aufgaben an Worker-Agenten |
| **Hierarchisch** | Mehrere Ebenen von Supervisors und Workern |
| **Kollaborativ** | Agenten kommunizieren direkt miteinander |

**Charakteristik:**
- Skalierbar für komplexe Aufgaben
- Jeder Agent kann optimiert werden
- Koordination erfordert sorgfältiges Design

**Typischer Einsatz:** Content-Erstellung, komplexe Analysen, autonome Systeme

---

## Design-Prinzipien

Unabhängig von der gewählten Architektur gelten bewährte Prinzipien:

### Single Responsibility
Jede Komponente hat **eine klar definierte Aufgabe**. Ein Tool berechnet, ein anderes sucht – nicht beides gleichzeitig. Das erleichtert Wartung und Fehlersuche.

### Fail-Safe Design
Agenten müssen mit Fehlern umgehen können:
- Was passiert, wenn ein Tool nicht erreichbar ist?
- Was, wenn das LLM eine ungültige Tool-Auswahl trifft?
- Maximale Iterationen verhindern Endlosschleifen.

### Human-in-the-Loop
Bei kritischen Aktionen (Löschen, Senden, Bezahlen) sollte eine **menschliche Bestätigung** eingeholt werden. Das schafft Vertrauen und verhindert kostspielige Fehler.

### Observability
Jede Entscheidung des Agenten sollte **nachvollziehbar** sein. Logging und Tracing ermöglichen Debugging und kontinuierliche Verbesserung.

---

## Entscheidungshilfe

Die Wahl der Architektur hängt vom Anwendungsfall ab:

```mermaid
flowchart TD
    A[Anforderung analysieren] --> B{Mehrere Agenten nötig?}
    B -->|Ja| C[Multi-Agent]
    B -->|Nein| D{Fester Ablauf?}
    D -->|Ja| E[Workflow-basiert]
    D -->|Nein| F{Tools vorhanden?}
    F -->|Ja| G[Tool-Calling]
    F -->|Nein| H[ReAct]
```

| Situation | Empfohlene Architektur |
|-----------|----------------------|
| Einfache Q&A mit Datenbankzugriff | Tool-Calling |
| Mehrstufiger Genehmigungsprozess | Workflow-basiert |
| Recherche mit unbekanntem Umfang | ReAct |
| Content-Pipeline (Research → Write → Review) | Multi-Agent |
| RAG-System mit Nachbearbeitung | Workflow-basiert |

---

## Zusammenfassung

- **ReAct** eignet sich für explorative Aufgaben mit transparentem Denkprozess
- **Tool-Calling** macht Agenten durch Werkzeuge erweiterbar
- **Workflow-basiert** bietet Kontrolle über komplexe Abläufe
- **Multi-Agent** skaliert für anspruchsvolle, arbeitsteilige Aufgaben

Die Architekturmuster schließen sich nicht gegenseitig aus. In der Praxis kombinieren viele Systeme mehrere Ansätze: Ein Workflow kann Tool-Calling-Agenten als Knoten enthalten, oder ein Multi-Agent-System nutzt ReAct-Agenten als Worker.

Im weiteren Kursverlauf werden diese Architekturen praktisch mit LangChain und LangGraph umgesetzt.

---

**Version:** 1.0  
**Stand:** November 2025  
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
