---
layout: default
title: Vom Modell zur Anwendung
parent: "Deployment & Betrieb"
nav_order: 4
description: Wie LangChain, LangGraph und LangSmith aus einem Modell eine betreibbare Agentenanwendung machen
has_toc: true
---

# Vom Modell zur Anwendung
{: .no_toc }

> [!NOTE] Kernfrage<br>
> Welche Bausteine machen aus einem Modell eine produktionsreife Anwendung?

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1. Das Problem: Ein Modell allein ist noch kein Agent

Viele Entwickler beginnen mit einem großen Sprachmodell und einem einfachen Chatbot. Zwischen diesem Prototyp und einer betreibbaren Agentenanwendung liegt aber ein deutlicher Schritt. Ein Modell, das nur Text erzeugt, löst noch keine Anforderungen wie Tool-Nutzung, Zustandsverwaltung, Nachvollziehbarkeit, Freigaben oder Betriebssicherheit.

> [!IMPORTANT] Die zentrale Frage<br>
> Wie lässt sich aus einem KI-Experiment ein steuerbares, überprüfbares und kontinuierlich verbesserbares System entwickeln?

---

## 2. Ein möglicher Ansatz: Drei Frameworks im Zusammenspiel

Das LangChain-Ökosystem bietet dafür ein häufig genutztes Set von Werkzeugen. Es besteht im Wesentlichen aus **LangChain**, **LangGraph** und **LangSmith**. Die drei Bausteine lösen unterschiedliche Probleme: Integration, Ablaufsteuerung und Beobachtbarkeit.

{: .highlight }
**Die drei Säulen des LangChain-Ökosystems:**
- **LangChain** - Struktur und Verknüpfung
- **LangGraph** - Kontrolle und Ablaufsteuerung
- **LangSmith** - Analyse und Optimierung

---

## 3. LangChain: Struktur und Verknüpfung

LangChain verbindet ein Sprachmodell mit externen Ressourcen und Tools. Agenten in LangChain folgen dem Prinzip:

> [!NOTE] Agent = Modell + Tools + Schleife<br>
> Damit kann ein System nicht nur Text erzeugen, sondern auch Informationen abrufen, APIs ansprechen oder Berechnungen ausführen. Chains helfen, wiederkehrende Abläufe reproduzierbar zu machen, statt sie nur über einzelne Prompts zu steuern.

### Kernfunktionen von LangChain

- **Tool-Integration:** Anbindung externer APIs und Datenquellen
- **Chain-Komposition:** Strukturierte Workflows mit LCEL (LangChain Expression Language)
- **Prompt-Management:** Wiederverwendbare Prompt-Templates
- **Memory-Patterns:** Kontext-Verwaltung für Konversationen

---

## 4. LangGraph: Kontrolle und Ablaufsteuerung

Während einfache Agenten teilweise unvorhersehbar handeln, zielt LangGraph auf eine klar definierte Ablaufsteuerung ab.

### Typische Merkmale

**1. Transparente Logik**
- Aktionen werden als Zustände (Nodes) und Übergänge (Edges) beschrieben
- Workflow-Visualisierung möglich
- Deterministisches Verhalten

**2. Human-in-the-Loop**
- Menschliche Eingriffe oder Bestätigungen lassen sich gezielt einbauen
- Approval-Workflows für kritische Entscheidungen
- Breakpoints und Debugging

**3. Flexibilität**
- Anpassung an komplexe Szenarien
- State-Management für mehrstufige Workflows
- explizite Modellierung von Prüfschritten, Rücksprüngen und Abbruchbedingungen

> [!WARNING] LangGraph-Einsatz<br>
> LangGraph lohnt sich besonders für Agenten mit Zustand, Verzweigungen, Freigaben oder mehreren Schritten. Für einfache lineare Chains reicht oft LangChain allein.

---

## 5. LangSmith: Analyse und Verbesserung

LangSmith dient zur Beobachtung und Verbesserung von KI-Anwendungen.

### Hauptfunktionen

**1. Protokollierung**
- Jede Interaktion und Entscheidung des Agenten wird erfasst
- Vollständige Trace-Historie
- Token-Usage-Tracking

**2. Fehleranalyse**
- Auffälliges Verhalten lässt sich gezielt untersuchen
- Error-Tracking mit Stack-Traces
- Analyse von Latenz, Tokenverbrauch und fehlerhaften Tool-Aufrufen

**3. Bewertung**
- Traces und Ergebnisse lassen sich mit Testfällen vergleichen
- A/B-Testing verschiedener Prompts
- Dataset-basierte Evaluierung

> [!NOTE] Für den Betrieb relevant<br>
> - Monitoring und Alerting
> - Kosten-Tracking
> - gemeinsames Debugging
> - Dataset-Management für Tests

---

## 6. Analogie: Komponenten eines Fahrzeugs

Diese Analogie verdeutlicht die Rollen der einzelnen Komponenten im Gesamtsystem:

| Komponente | Funktion | Im Auto |
|------------|----------|---------|
| **KI-Modell** | Liefert die Antriebskraft | Der Motor |
| **LangChain** | Verbindet den Motor mit Tools | Das Fahrwerk |
| **LangGraph** | Ermöglicht Steuerung und Kontrolle | Das Cockpit |
| **LangSmith** | Dokumentiert den Betrieb und liefert Daten für Verbesserungen | Die Telemetrie |

> [!NOTE] Das System ist mehr als das Modell<br>
> Wie ein Auto mehr ist als nur ein Motor, ist ein produktionsreifes KI-System mehr als nur ein LLM. Alle Komponenten müssen zusammenspielen, um ein zuverlässiges und wartbares System zu schaffen.

---

## 7. Wann welches Tool verwenden?

### Entscheidungshilfe

| Szenario | Empfohlenes Tool |
|----------|------------------|
| **Einfacher Chatbot** | LangChain allein (Chains + Memory) |
| **RAG-System** | LangChain (Retrieval + Chains) |
| **Agent mit Tools** | LangChain (create_agent) |
| **Multi-Agent-System** | LangGraph (StateGraph) |
| **Bedingte Workflows** | LangGraph (conditional edges) |
| **Human-Approval nötig** | LangGraph (interrupt) |
| **Production-Monitoring** | LangSmith (obligatorisch) |
| **Debugging komplexer Flows** | LangSmith (Traces) |
| **A/B-Testing von Prompts** | LangSmith (Datasets) |

---

## 8. Praktisches Beispiel: Support-Agent

### Ohne Ökosystem: nur Modell
```python
# Einfach, aber nicht produktionsreif
response = llm.invoke("Hilf dem Kunden mit seiner Frage")
```

**Probleme:**
- keine Tool-Integration
- keine Nachvollziehbarkeit
- keine Fehlerbehandlung
- keine Latenz- oder Kostenmessung

### Mit LangChain-Ökosystem

```python
# LangChain: Struktur
from langchain.agents import create_agent
from langchain_core.tools import tool

@tool
def lookup_order(order_id: str) -> dict:
    """Ruft Bestelldetails aus der Datenbank ab"""
    return db.get_order(order_id)

# LangGraph: Kontrolle
from langgraph.graph import StateGraph

workflow = StateGraph()
workflow.add_node("classify", classify_intent)
workflow.add_node("lookup", lookup_order_node)
workflow.add_node("respond", generate_response)
workflow.add_conditional_edges("classify", route_to_action)

# LangSmith: Monitoring (automatisch aktiv)
agent = workflow.compile()
```

**Vorteile:**
- Tool-Integration für Datenbankzugriff
- kontrollierter Workflow
- automatisches Logging
- nachvollziehbare Traces
- Latenz- und Kostenmessung

---

## 9. Alternativen zum LangChain-Ökosystem

Das LangChain-Ökosystem ist nicht die einzige Lösung. Alternativen mit ähnlichen Zielen:

| Framework | Fokus | Besonderheit |
|-----------|-------|--------------|
| **LlamaIndex** | Daten-fokussiert | Optimiert für RAG und Indexierung |
| **Haystack** | Enterprise-Search | Fokus auf Dokumenten-Retrieval |
| **AutoGen** | Multi-Agent | Microsoft-Framework für Agent-Kollaboration |
| **CrewAI** | Spezialisierte Agents | Rollenbasierte Multi-Agent-Systeme |
| **Semantic Kernel** | Microsoft-Integration | .NET und Azure-optimiert |

> [!TIP] Framework-Wahl<br>
> Die Wahl des Frameworks hängt von den spezifischen Anforderungen ab. LangChain bietet ein gutes Gleichgewicht zwischen Flexibilität und Struktur, während spezialisierte Frameworks für bestimmte Use Cases optimiert sind.

---

## 10. Grundregeln für den Betrieb

### 1. Einfach beginnen
- mit LangChain-Chains starten
- erst bei Bedarf zu Agenten erweitern
- LangGraph nutzen, wenn Zustand, Routing oder Freigaben nötig werden

### 2. Von Anfang an beobachten
- LangSmith früh aktivieren
- Traces regelmäßig prüfen
- Kosten-Tracking einbauen

### 3. Iterative Verbesserung
- Dataset-basierte Evaluierung
- A/B-Testing für Prompts
- Feedback-Loops einbauen

### 4. Checkliste für Betriebsreife
- [ ] Error-Handling implementiert
- [ ] Rate-Limiting konfiguriert
- [ ] Monitoring aktiv
- [ ] Kosten-Budget definiert
- [ ] Fallback-Strategien vorhanden
- [ ] Security-Review durchgeführt

---

## 11. Was für Entwickler zuerst wichtig ist

Der Weg von einem Sprachmodell zu einer betreibbaren Agentenanwendung erfordert mehr als gute Antworten. Wichtig sind:

{: .highlight }
- **Strukturierte Workflows** (LangChain)
- **Transparente Steuerung** (LangGraph)
- **Kontinuierliches Feedback** (LangSmith)

LangChain, LangGraph und LangSmith bilden dafür einen pragmatischen Weg: Tools anbinden, Abläufe kontrollieren und Verhalten sichtbar machen. Andere Frameworks können ähnliche Ziele verfolgen; wichtig ist, dass diese drei Aufgaben überhaupt abgedeckt sind.

---

## 12. Weiterführende Ressourcen

### Offizielle Dokumentation
- [LangChain Docs](https://python.langchain.com/)
- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [LangSmith Docs](https://docs.smith.langchain.com/)

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [LangChain Best Practices]({{ '/05-frameworks/langchain-best-practices.html' | relative_url }}) | Welche LangChain-Konventionen gelten für produktionsnahe Anwendungen? |
| [Qualität und Sicherheit]({{ '/07-qualitaet-sicherheit/' | relative_url }}) | Welche Produktionsstandards gelten für LangChain-basierte Anwendungen? |

---

**Version:** 1.2<br>
**Stand:** Juli 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.






