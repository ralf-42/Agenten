---
layout: default
title: Prompt Engineering
parent: Entwurf
grand_parent: Agenten-Implementierung
nav_order: 4
description: Strategien für effektive Prompts in Agentensystemen
has_toc: true
---

# Prompt Engineering
{: .no_toc }

> **Strategien für effektive Prompts in KI-Agenten-Systemen**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Überblick

Ein Prompt ist die Schnittstelle zwischen Mensch und Sprachmodell. Die Qualität der Antwort hängt maßgeblich davon ab, **wie** eine Aufgabe formuliert wird – nicht nur **was** gefragt wird.

Für KI-Agenten ist Prompt Engineering besonders relevant:

| Kontext | Bedeutung |
|---------|-----------|
| **System-Prompts** | Definieren Rolle, Fähigkeiten und Grenzen des Agenten |
| **Tool-Beschreibungen** | Bestimmen, wann und wie ein Agent Werkzeuge einsetzt |
| **Reasoning-Prompts** | Steuern den Denkprozess bei komplexen Aufgaben |
| **Output-Formatierung** | Garantieren strukturierte, verarbeitbare Antworten |

**Kernprinzip:** Ein gut formulierter Prompt reduziert Fehler, verbessert die Konsistenz und macht das Verhalten eines Agenten vorhersagbar.

> [!NOTE] Kernbotschaft<br>
> Prompt-Qualität ist in Agentensystemen ein zentraler Steuerhebel für Zuverlässigkeit und Reproduzierbarkeit.

---

## Grundlegende Prompt-Strukturen

Effektive Prompts folgen einer klaren Struktur. Drei Grundmuster haben sich etabliert.

Ein robuster Prompt trennt Anweisung, Kontext, Beispiele, Eingabe und Ausgabeformat. Diese Trennung ist wichtiger als eine bestimmte Schablone, weil Agenten bei längeren Aufgaben sonst Regeln, Daten und Nutzereingaben vermischen können.

```text
AUFGABE:
- Was soll gelöst werden?

KONTEXT:
- Welche Informationen sind relevant?

REGELN:
- Was darf nicht passieren?

BEISPIELE:
- Wie sieht eine gute Ausgabe aus?

EINGABE:
- Welche konkrete Anfrage oder welches Dokument soll verarbeitet werden?

AUSGABEFORMAT:
- In welchem Format soll die Antwort erscheinen?
```

Bei komplexen Prompts helfen klare Abschnittsnamen oder XML-ähnliche Tags wie `<instructions>`, `<context>`, `<examples>` und `<input>`. Entscheidend ist nicht das Tag selbst, sondern die eindeutige Trennung der Funktionen.

### Zero-Shot Prompting

Das Modell erhält eine Aufgabe ohne Beispiele und löst sie basierend auf seinem Vorwissen.

```python
from langchain_core.prompts import ChatPromptTemplate

# Zero-Shot: Keine Beispiele, direkte Aufgabe
prompt = ChatPromptTemplate([
    ("system", "Du bist der PMO-Assistent für Projekt Kompass."),
    ("human", "Klassifiziere die folgende E-Mail als 'dringend' oder 'normal': {email}")
])
```

**Geeignet für:**
- Einfache, eindeutige Aufgaben
- Allgemeinwissen-Fragen
- Standardformatierungen

### Few-Shot Prompting

Das Modell erhält Beispiele, die das gewünschte Verhalten demonstrieren.

```python
few_shot_prompt = ChatPromptTemplate([
    ("system", "Klassifiziere E-Mails nach Dringlichkeit."),
    ("human", "Betreff: Server ausgefallen"),
    ("assistant", "dringend"),
    ("human", "Betreff: Quartalsbericht verfügbar"),
    ("assistant", "normal"),
    ("human", "Betreff: {email_subject}")
])
```

**Geeignet für:**
- Spezifische Formatvorgaben
- Domänenspezifische Klassifikationen
- Konsistente Ausgabestrukturen

### Chain-of-Thought (CoT)

Beim Chain-of-Thought-Prompting wird das Modell zu Zwischenschritten aufgefordert. Das kann bei mehrstufigen Aufgaben helfen, garantiert aber keine korrekte Lösung. Für Agenten sind prüfbare Ergebnisse meist hilfreicher als eine ausführliche Wiedergabe des Denkprozesses: etwa Quellen, strukturierte Zwischenergebnisse oder klar benannte Entscheidungskriterien.

> [!WARNING] Sorgfältig einsetzen<br>
> Eine Aufforderung, den vollständigen Denkprozess auszugeben, ist weder eine Korrektheitsprüfung noch ein Sicherheitsmechanismus. Benötigte Zwischenschritte sollten als konkrete, überprüfbare Ergebnisse definiert werden.

**Möglicher Einsatz:** mehrstufige Aufgaben, wenn klar definierte Zwischenergebnisse anschließend geprüft werden.

---

## System-Prompts für Agenten

Der System-Prompt definiert die Identität und das Verhalten eines Agenten. Er ist der wichtigste Hebel für konsistentes Agentenverhalten.

> [!TIP] Priorisierung im Prompt<br>
> Kritische Regeln zuerst platzieren (Sicherheit, Grenzen, Eskalation), danach Stil und Tonalität.

### Struktur eines effektiven System-Prompts

Ein guter System-Prompt beantwortet vier Fragen:

| Frage | Inhalt |
|-------|--------|
| **Wer?** | Rolle und Expertise des Agenten |
| **Was?** | Aufgabenbereich und Fähigkeiten |
| **Wie?** | Verhaltensregeln und Tonalität |
| **Was nicht?** | Explizite Einschränkungen |

Bei längeren System-Prompts helfen XML-ähnliche Tags, diese Bereiche sichtbar voneinander zu trennen. Verwende einheitliche, aussagekräftige Namen wie `<role>`, `<instructions>`, `<tools>`, `<examples>` oder `<constraints>`. Die Tags markieren die Funktion eines Abschnitts; sie sind keine besondere Syntax und machen eine Anweisung nicht automatisch verbindlicher. Kurze Prompts brauchen diese zusätzliche Gliederung meist nicht.

### Beispiel: Vollständiger Agent-System-Prompt

```python
system_prompt = """<role>
Du bist der PMO-Assistent für Projekt Kompass.
- Unterstützt die Projektleitung bei Briefings, Entscheidungen und Risiken
- Erste Anlaufstelle für Fragen zum Projektstand
- Eskalation an die Projektleitung bei kritischen Fällen
</role>

<capabilities>
- Zugriff auf die Projektdokumente (Tool: search_project_documents)
- Aufgaben-Erstellung im Projektboard (Tool: create_task)
- Prüfung des Risikostatus (Tool: check_risk_status)
</capabilities>

<behavior_rules>
- Antworte präzise und belege jede Aussage mit einer Quelle
- Frage nach, wenn Informationen fehlen
- Mache Unsicherheit sichtbar, statt zu raten
- Verwende Fachbegriffe nur mit Erklärung
</behavior_rules>

<constraints>
- Keine Budgetzusagen oder Vertragsänderungen
- Keine Entscheidungen ohne Freigabe der Projektleitung
- Bei Datenschutzfragen immer an die Datenschutzbeauftragten eskalieren
</constraints>
"""
```

### Typische Fehler bei System-Prompts

| Fehler | Problem | Lösung |
|--------|---------|--------|
| Zu vage | Agent verhält sich inkonsistent | Konkrete Beispiele und Regeln |
| Zu lang | Wichtige Anweisungen gehen unter | Priorisieren, strukturieren |
| Widersprüchlich | Agent "halluziniert" Kompromisse | Eindeutige Hierarchie |
| Keine Grenzen | Agent überschreitet Kompetenz | Explizite Einschränkungen |

---

## Tool-Beschreibungen optimieren

Die Beschreibung eines Tools bestimmt, ob und wann ein Agent es korrekt einsetzt. Eine präzise Beschreibung ist entscheidender als der Code dahinter.

### Anatomie einer guten Tool-Beschreibung

```python
from langchain_core.tools import tool

@tool
def search_project_documents(query: str, max_results: int = 5) -> str:
    """Durchsucht die Projektdokumente nach relevanten Passagen.
    
    WANN VERWENDEN:
    - Bei Fragen zu Entscheidungen des Steuerkreises
    - Bei Fragen zu Risiken und Maßnahmen
    - Bei Fragen zu Aufgaben und Verantwortlichkeiten
    
    WANN NICHT VERWENDEN:
    - Bei Fragen zu Budgets oder Verträgen
    - Bei personenbezogenen Daten
    - Wenn die Antwort bereits bekannt ist
    
    Args:
        query: Suchbegriff oder Frage in natürlicher Sprache
        max_results: Maximale Anzahl zurückgegebener Passagen (1-10)
    
    Returns:
        Formatierte Liste relevanter Passagen mit Quelle und Zusammenfassung
    """
    # Implementation...
```

### Checkliste für Tool-Beschreibungen

> [!SUCCESS] Qualitätskriterium<br>
> Wenn ein Tool klar beschreibt, wann es verwendet werden soll und wann nicht, sinken Fehlaufrufe und Halluzinationen deutlich.

- [ ] **Zweck klar benannt** – Was macht das Tool?
- [ ] **Anwendungsfälle** – Wann soll es verwendet werden?
- [ ] **Gegenanzeigen** – Wann soll es NICHT verwendet werden?
- [ ] **Parameter erklärt** – Was bedeuten die Eingaben?
- [ ] **Rückgabewert beschrieben** – Was kommt zurück?

---

## Ausgabeformatierung

Strukturierte Ausgaben machen Agentenantworten verarbeitbar und konsistent.

### Explizite Formatvorgaben

```python
format_prompt = ChatPromptTemplate.from_template(
    """Analysiere den folgenden Text und extrahiere die Kernaussagen.

Text: {text}

Antworte EXAKT in diesem Format:
HAUPTTHEMA: [Ein Satz]
KERNAUSSAGEN:
- [Punkt 1]
- [Punkt 2]
- [Punkt 3]
STIMMUNG: [positiv/neutral/negativ]
KONFIDENZ: [hoch/mittel/niedrig]
"""
)
```

### Strukturierte Ausgaben mit Pydantic

Für maschinelle Weiterverarbeitung bietet LangChain typsichere Ausgaben:

> [!TIP] Für Produktion bevorzugen<br>
> Bei Weiterverarbeitung durch Code sind strukturierte Ausgaben mit Schema-Validierung robuster als freie Textantworten.

```python
from pydantic import BaseModel, Field

class Analyse(BaseModel):
    hauptthema: str = Field(description="Zentrales Thema in einem Satz")
    kernaussagen: list[str] = Field(description="Liste der wichtigsten Punkte")
    stimmung: str = Field(description="positiv, neutral oder negativ")
    konfidenz: float = Field(description="Sicherheit der Analyse (0.0-1.0)")

# LLM mit strukturierter Ausgabe
structured_llm = llm.with_structured_output(Analyse)
result = structured_llm.invoke("Analysiere: " + text)

# result ist ein typisiertes Analyse-Objekt
print(result.hauptthema)
print(result.konfidenz)
```

---

## Fortgeschrittene Strategien

### Role-Prompting

Die Zuweisung einer spezifischen Rolle verbessert domänenspezifische Antworten.

```python
role_prompts = {
    "jurist": "Du bist ein erfahrener Rechtsanwalt mit Spezialisierung auf IT-Recht.",
    "mediziner": "Du bist ein Facharzt für Innere Medizin mit 20 Jahren Berufserfahrung.",
    "entwickler": "Du bist ein Senior Software Engineer mit Expertise in Python und Cloud-Architekturen."
}

prompt = ChatPromptTemplate([
    ("system", role_prompts["entwickler"]),
    ("human", "{frage}")
])
```

### Self-Consistency

Mehrere Antworten generieren und die häufigste oder konsistenteste wählen.

```python
def self_consistent_answer(question: str, n: int = 3) -> str:
    """Generiert mehrere Antworten und wählt die konsistenteste."""
    responses = []
    for _ in range(n):
        response = llm.invoke(question)
        responses.append(response.content)
    
    # Häufigste Antwort oder Zusammenfassung
    return aggregate_responses(responses)
```

### Retrieval-Augmented Prompting

Kontext aus externen Quellen in den Prompt integrieren:

```python
rag_prompt = ChatPromptTemplate.from_template(
    """Beantworte die Frage basierend auf dem bereitgestellten Kontext.
Wenn die Antwort nicht im Kontext steht, sage das ehrlich.

KONTEXT:
{context}

FRAGE: {question}

ANTWORT:"""
)
```

### Long-Context Prompting

Bei langen Dokumenten oder vielen Tool-Ergebnissen reicht eine gute Aufgabenformulierung nicht aus. Der Prompt muss Daten so anordnen, dass das Modell sie zuverlässig zuordnen kann. Lange Dokumente gehören in einen klar markierten Kontextbereich; die eigentliche Frage und die Ausgabeanforderung stehen danach.

```text
<context>
Dokumente, Auszüge oder Tool-Ergebnisse
</context>

<instructions>
Beantworte die Frage nur auf Basis des Kontextes.
Wenn der Kontext keine Antwort enthält, gib "Nicht im Kontext" aus.
</instructions>

<question>
Konkrete Frage
</question>
```

In der Praxis relevant, wenn Dokumente, Tabellen, Tool-Ergebnisse und Beispiele im selben Prompt stehen. Ohne saubere Trennung steigt die Wahrscheinlichkeit, dass das Modell ein Beispiel als echten Inhalt behandelt oder eine Regel nur auf den ersten Abschnitt anwendet.

Interaktive Demo: [Programmatische Prompt-Optimierung mit DSPy]({{ '/visualisierungen/prompt_dspy/' | relative_url }}){:target="_blank" rel="noopener"} – zeigt als weiterführenden Ausblick, wie Prompts systematisch kompiliert und optimiert werden können.

---

## Best Practices

### Die CLEAR-Methode

| Buchstabe | Prinzip | Umsetzung |
|-----------|---------|-----------|
| **C** | Concise | Präzise formulieren, Füllwörter vermeiden |
| **L** | Logical | Logische Struktur, klare Reihenfolge |
| **E** | Explicit | Erwartungen explizit benennen |
| **A** | Adaptive | An Aufgabe und Modell anpassen |
| **R** | Reproducible | Konsistente Ergebnisse ermöglichen |

### Iteratives Prompt-Design

```python
few_shot_prompt = ChatPromptTemplate([
    ("system", "Klassifiziere E-Mails nach Dringlichkeit."),
    ("human", "Betreff: Server ausgefallen"),
    ("assistant", "dringend"),
    ("human", "Betreff: Quartalsbericht verfügbar"),
    ("assistant", "normal"),
    ("human", "Betreff: {email_subject}")
])
```
**Empfohlener Workflow:**

1. **Baseline erstellen** – Einfachster funktionierender Prompt
2. **Schwachstellen identifizieren** – Wo versagt der Prompt?
3. **Gezielt verbessern** – Eine Änderung pro Iteration
4. **Testen mit Varianten** – Verschiedene Eingaben prüfen
5. **Dokumentieren** – Warum funktioniert diese Version?

### Prompt-Versionierung

Prompt-Version, Beispieldaten und Testfälle sollten gemeinsam dokumentiert werden. So lässt sich eine Änderung mit denselben Anfragen gegen die vorherige Version vergleichen. Festgehalten werden Zweck der Änderung, erwartetes Verhalten und das Ergebnis der Prüfung.

---

## Häufige Fehler und Lösungen

> [!WARNING] Häufigster Praxisfehler<br>
> Unklare oder widersprüchliche Anweisungen erschweren die Fehlersuche. Erst die Aufgabenbeschreibung prüfen, bevor das Modell gewechselt wird.

### Fehler: Ambige Anweisungen

**Problem:**
„Fasse das Dokument gut zusammen.“ lässt offen, wie lang die Zusammenfassung sein und welche Informationen sie enthalten soll.

**Lösung:**
„Fasse die Entscheidung, ihre Begründung und offene Punkte in je einem Abschnitt zusammen. Verwende nur Angaben aus dem Dokument und nenne die Fundstelle.“

### Fehler: Fehlende Beispiele bei komplexen Formaten

**Problem:**
Die Anweisung „Gib die Ergebnisse als Tabelle aus“ legt weder Spalten noch den Umgang mit fehlenden Werten fest.

**Lösung:**
Ein kurzes Muster mit den gewünschten Spalten und einem Platzhalter zeigt das erwartete Format. Für maschinelle Weiterverarbeitung sollte stattdessen ein strukturiertes Schema verwendet werden.

### Fehler: Widersprüchliche Anweisungen

**Problem:**
„Antworte in einem Satz“ und „Belege jede Aussage ausführlich“ setzen unterschiedliche Erwartungen an die Antwortlänge.

**Lösung:**
Prioritäten festlegen, zum Beispiel: kurze Antwort mit höchstens zwei Belegen. Widersprüchliche Vorgaben nicht an mehreren Stellen des Prompts wiederholen.
---

## Prompts als Verhaltensvertrag prüfen
Prompt Engineering ist bei Agenten kein Schreibtrick, sondern ein Verhaltensvertrag zwischen Modell, Werkzeugen und Anwendungscode. Drei Aspekte tragen diesen Vertrag:

| Säule | Kernaspekt |
|-------|------------|
| **Klarheit** | Eindeutige, strukturierte Anweisungen |
| **Kontext** | Relevante Informationen und Beispiele |
| **Kontrolle** | Explizite Formatvorgaben und Grenzen |

Für KI-Agenten besonders wichtig sind System-Prompts, Tool-Beschreibungen, strukturierte Ausgaben und iteratives Testen. System-Prompts definieren das Gesamtverhalten, Tool-Beschreibungen steuern die Werkzeugnutzung, strukturierte Ausgaben ermöglichen Weiterverarbeitung, und Tests zeigen, ob das gewünschte Verhalten auch bei Grenzfällen stabil bleibt.

**Typischer Fehler:** Prompts werden wie reine Textanweisungen behandelt. In Agentensystemen sind sie Teil der Architektur. Was zuverlässig gelten muss, gehört entweder in strukturierte Ausgaben, Tool-Schemas, Validierung oder Code — nicht nur in eine gut klingende Formulierung.

---

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Context Engineering]({{ '/04-agenten-implementierung/kontext-wissen/context-engineering.html' | relative_url }}) | Wie wird aus einzelnen Prompts ein belastbarer Gesamtkontext? |
| [RAG-Konzepte]({{ '/04-agenten-implementierung/kontext-wissen/rag-konzepte.html' | relative_url }}) | Wann reicht bessere Promptformulierung nicht mehr ohne Retrieval? |
| [Fine-Tuning]({{ '/03-modelle-provider-anpassung/fine-tuning.html' | relative_url }}) | Wann stößt Prompting an Grenzen, die Training besser löst? |

---

**Version:** 1.1<br>
**Stand:** Oktober 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.



