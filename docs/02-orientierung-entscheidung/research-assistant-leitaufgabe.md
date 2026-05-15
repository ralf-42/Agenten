---
layout: default
title: Research Assistant
parent: "Orientierung & Entscheidung"
nav_order: 4
description: "Zielbild und roter Faden: ein quellengebundener Research Assistant für Fachartikel"
has_toc: true
---

# Research Assistant

Der **Research Assistant** ist die übergreifende Leitaufgabe. Er dient als roter Faden, an dem zentrale Agentenkonzepte wiederholt sichtbar werden: Aufgabenanalyse, Tool Use, Routing, RAG, State, Memory, Evaluation, Human-in-the-Loop und Betrieb.

Die Leitfrage lautet:

> Wie entsteht ein Agent, der fachliche Fragen zu Dokumenten beantwortet, relevante Quellen findet, Aussagen nachvollziehbar belegt und bei Unsicherheit kontrolliert eskaliert?

## Ausgangssituation

Die Leitaufgabe orientiert sich an einer typischen Wissensarbeits-Situation:

**Pia** muss regelmäßig neue Fachartikel sichten. Sie sucht relevante Passagen, liest dafür oft ganze Artikel und findet den gesuchten Abschnitt trotzdem nicht schnell genug. Eine einfache Volltext-Suche nach Stichwörtern liefert entweder zu viele Treffer oder gar keine passenden Ergebnisse.

Das Ziel ist deshalb kein vollautomatischer Agent ohne Kontrollmöglichkeit, sondern ein Assistenzsystem, das einen Korpus von Fachartikeln semantisch durchsucht, strukturierte Zusammenfassungen mit Quellenangaben liefert und bei Unsicherheit auf menschliche Freigabe wartet.


**Markdown aus GitHub:** ![My Image](https://raw.githubusercontent.com/ralf-42/Image/main/genai-banner-2.jpg)





## Warum diese Aufgabe?

Der Research Assistant ist didaktisch geeignet, weil er typische Anforderungen realer Agentensysteme in einer überschaubaren Aufgabe bündelt:

- Er braucht eine klare Aufgabenabgrenzung.
- Er muss Wissen aus Dokumenten nutzen, statt frei zu halluzinieren.
- Er muss Quellen und Unsicherheit sichtbar machen.
- Er benötigt State, Sessions und kontrollierte Zwischenschritte.
- Er zeigt, wann Evaluation, Security und menschliche Freigabe notwendig werden.

Damit verbindet die Aufgabe konzeptionelles Verstehen mit praktischer Umsetzung.

## Zielbild

Am Ende entsteht ein Research Assistant, der:

1. Einen PDF-Korpus reproduzierbar lädt.
2. Die Dokumente in eine Vektordatenbank einbettet.
3. Fragen in natürlicher Sprache beantwortet.
4. Jede Antwort mit Quelltitel und Passagen-Zitat belegt.
5. Unsicherheit sichtbar macht und bei Bedarf eine Freigabe einholt.
6. Spezialisierte Teilaufgaben an passende Worker delegieren kann, zum Beispiel Tabellenanalyse und Fließtext-Zusammenfassung.

Eine spätere Variante kann einen eigenen Korpus, eine andere Persona oder eine andere Fachdomäne verwenden. Der Bauplan bleibt gleich: Korpus, Retrieval, strukturierte Antwort, Quellenbindung, Kontrolle und Reflexion.

## Leitplanken

Der Research Assistant ist ein Assistenzsystem, kein autonomes Entscheidungssystem. Daraus folgen feste Leitplanken:

| Leitplanke | Bedeutung |
|---|---|
| Keine personenbezogenen Trainingsdaten | Beispiele nutzen öffentliche Fachtexte oder synthetische Daten, keine echten Teilnehmer-, Kunden- oder Patientendaten. |
| Quellenpflicht | Fachliche Antworten brauchen Quellenangaben oder den Hinweis "Nicht im Korpus". |
| HITL bei Unsicherheit | Unsichere, folgenreiche oder regulierte Ausgaben werden vor der finalen Ausgabe menschlich geprüft. |
| Tool-Grenzen | Tools dürfen nur klar definierte Aufgaben ausführen; offene Seiteneffekte brauchen Freigabe. |
| Bewusstes Logging | Tracing und Evaluation sind hilfreich, sensible Inhalte dürfen aber nicht unbedacht protokolliert werden. |
| Out-of-Corpus-Regel | Fehlendes Wissen wird nicht frei erfunden. |

## Bauplan

Der technische Bauplan entwickelt sich schrittweise:

| Baustein | Was der Research Assistant bekommt |
|---|---|
| Einfacher Agent | Suche-Tool, erster Korpus-Zugriff und Research-System-Prompt. |
| Robuster Agent | Strukturiertes Antwortschema, Citation-Pflicht und Error Handling. |
| Kontrollierter Agent | Approval-Flow, Routing nach Fragetyp und Security-Leitplanken. |
| Wissensfähiger Agent | RAG mit Vektordatenbank, semantische Suche und Eval-Messung. |
| Kooperierendes System | HITL, Memory, Supervisor und spezialisierte Worker. |
| Ausbau | UI, Tool-Integration, Skills, Evaluation, Deployment und Betrieb. |

Das Antwortformat bleibt dabei bewusst strukturiert:

```python
class Quellenangabe(BaseModel):
    dokument: str
    passage: str

class ResearchAntwort(BaseModel):
    antwort: str
    quellen: list[Quellenangabe]
    sicherheit: str
    hinweis: str
```

## Korpus und Evaluation

Der Startpunkt ist ein kuratierter PDF-Korpus aus öffentlichen Fachtexten. Er soll unterschiedliche Perspektiven enthalten, keine duplizierten Texte nutzen und sowohl kurze als auch längere Dokumente abdecken.

Die Evaluation prüft nicht nur, ob eine Antwort gut klingt. Sie fragt gezielt:

- Findet die semantische Suche die relevanten Passagen besser als eine naive Stichwortsuche?
- Werden Quellen nachvollziehbar angegeben?
- Erkennt der Assistant Fragen, die nicht aus dem Korpus beantwortet werden können?
- Bleibt die Antwort im vorgesehenen Schema?
- Wird Unsicherheit sichtbar und kontrollierbar?

## Rolle im Kurs

Die Leitaufgabe ist kein einzelnes Einstiegsthema, sondern begleitet mehrere Kursphasen:

| Kursphase | Bezug zur Leitaufgabe |
|---|---|
| Orientierung | Klären, ob ein Agent überhaupt sinnvoll ist. |
| Modelle und Provider | Entscheiden, welche Modellrollen benötigt werden. |
| Agenten-Implementierung | Architektur, Prompting, Tool Use, RAG, State und HITL umsetzen. |
| Frameworks | LangChain, LangGraph, ChromaDB und LangSmith praktisch einsetzen. |
| Qualität und Sicherheit | Antworten prüfbar, beobachtbar und sicher machen. |
| Deployment und Betrieb | Aus der Uebung ein betreibbares Projekt ableiten. |

## Abgrenzung

Diese Seite beschreibt das **Warum** und das Zielbild der Leitaufgabe.

Die konkrete Umsetzung mit Workshop, Challenge, Notebook-Struktur, Bewertung und Abgabe steht im Dokument [Research Assistant]({{ '/08-deployment-betrieb/research-assistant.html' | relative_url }}).
