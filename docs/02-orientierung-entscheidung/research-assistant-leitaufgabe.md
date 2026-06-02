---
layout: default
title: Research Assistant
parent: "Orientierung & Entscheidung"
nav_order: 4
description: "Zielbild und roter Faden: ein quellengebundener Research Assistant für Fachartikel"
has_toc: true
---

# Research Assistant

Der **Research Assistant** ist die übergreifende Leitaufgabe. Er bildet den roten Faden, an dem zentrale Agentenideen immer wieder auftauchen: Aufgabenanalyse, Tool Use, Routing, RAG, State, Memory, Evaluation, Human-in-the-Loop und Betrieb.

Die Leitfrage lautet:

> Wie entsteht ein Agent, der fachliche Fragen zu Dokumenten beantwortet, relevante Quellen findet, Aussagen nachvollziehbar belegt und bei Unsicherheit kontrolliert eskaliert?

## Ausgangssituation

Die Leitaufgabe orientiert sich an einer typischen Arbeitssituation aus dem Wissensbereich:

> **Pia** muss regelmäßig neue Fachartikel sichten. Sie sucht nach relevanten Passagen, liest dafür oft ganze Artikel und findet den gesuchten Abschnitt trotzdem nicht schnell genug. Eine einfache Volltext-Suche nach Stichwörtern liefert entweder zu viele Treffer oder gar keine passenden Ergebnisse.

Ziel ist kein komplett autonomer Agent ohne Kontrollmöglichkeit. Stattdessen geht es um ein Assistenzsystem, das einen Korpus von Fachartikeln semantisch durchsucht, strukturierte Zusammenfassungen mit Quellenangaben liefert und bei Unsicherheit erst einmal auf menschliche Freigabe wartet.

 
<img src="https://raw.githubusercontent.com/ralf-42/Agenten/main/07_image/pia_2.png" class="logo" width="950"/>
<p><font color='black' size="2">
KI-generiertes Bild
</font></p>


## Warum diese Aufgabe?

Der Research Assistant passt besonders gut, weil er viele typische Anforderungen realer Agentensysteme in einer klar überschaubaren Aufgabe bündelt:

- Es braucht eine verständliche Aufgabenabgrenzung.
- Das System soll Wissen aus Dokumenten nutzen—nicht einfach frei formulieren.
- Quellen und Unsicherheit müssen sichtbar werden.
- State, Sessions und kontrollierte Zwischenschritte spielen eine zentrale Rolle.
- Evaluation, Security und menschliche Freigabe werden dann wichtig, wenn es wirklich nötig ist.

So verbindet die Leitaufgabe konzeptionelles Verstehen mit einer praktischen Umsetzung.

## Zielbild

Am Ende steht ein Research Assistant, der:

1. Einen PDF-Korpus reproduzierbar lädt.
2. Die Dokumente in eine Vektordatenbank einbettet.
3. Fragen in natürlicher Sprache beantwortet.
4. Jede Antwort mit Quelltitel und Passagen-Zitat belegt.
5. Unsicherheit sichtbar macht und bei Bedarf eine Freigabe einholt.
6. Spezialisierte Teilaufgaben an passende Worker delegiert—zum Beispiel Tabellenanalyse und Fließtext-Zusammenfassung.

Eine spätere Variante kann dann einen eigenen Korpus nutzen, mit anderer Persona arbeiten oder in einer anderen Fachdomäne stattfinden. Der Bauplan bleibt gleich: Korpus, Retrieval, strukturierte Antwort, Quellenbindung, Kontrolle und Reflexion.

## Leitplanken

Der Research Assistant ist ein Assistenzsystem—kein autonomes Entscheidungssystem. Genau das bestimmt die Leitplanken:

| Leitplanke | Bedeutung |
|---|---|
| Keine personenbezogenen Trainingsdaten | Beispiele nutzen öffentliche Fachtexte oder synthetische Daten, keine echten Teilnehmer-, Kunden- oder Patientendaten. |
| Quellenpflicht | Fachliche Antworten brauchen Quellenangaben oder den Hinweis "Nicht im Korpus". |
| HITL bei Unsicherheit | Unsichere, folgenreiche oder regulierte Ausgaben werden vor der finalen Ausgabe menschlich geprüft. |
| Tool-Grenzen | Tools dürfen nur klar definierte Aufgaben ausführen; offene Seiteneffekte brauchen Freigabe. |
| Bewusstes Logging | Tracing und Evaluation sind hilfreich, sensible Inhalte dürfen aber nicht unbedacht protokolliert werden. |
| Out-of-Corpus-Regel | Fehlendes Wissen wird nicht frei erfunden. |

## Bauplan

Der technische Bauplan wächst Schritt für Schritt:

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

Startpunkt ist ein kuratierter PDF-Korpus aus öffentlichen Fachtexten. Er soll unterschiedliche Perspektiven enthalten, keine duplizierten Texte nutzen und sowohl kurze als auch längere Dokumente abdecken.

Die Evaluation schaut nicht nur auf die „Klingt gut“-Ebene. Sie prüft gezielt:

- Findet die semantische Suche die relevanten Passagen besser als eine naive Stichwortsuche?
- Werden Quellen nachvollziehbar angegeben?
- Erkennt der Assistant Fragen, die nicht aus dem Korpus beantwortet werden können?
- Bleibt die Antwort im vorgesehenen Schema?
- Wird Unsicherheit sichtbar und kontrollierbar?

## Rolle im Kurs

Die Leitaufgabe begleitet mehrere Kursphasen—nicht nur ein einzelnes Einstiegsthema:

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