---
layout: default
title: Research Assistant
parent: "Orientierung & Entscheidung"
nav_order: 4
description: "Zielbild und roter Faden des Kurses: ein quellengebundener Research Assistant"
has_toc: true
---

# Research Assistant

Der **Research Assistant** ist die uebergreifende Leitaufgabe des Kurses. Er dient als roter Faden, an dem zentrale Agentenkonzepte wiederholt sichtbar werden: Aufgabenanalyse, Tool Use, Routing, RAG, State, Memory, Evaluation, Human-in-the-Loop und Betrieb.

Die Leitfrage lautet:

> Wie entsteht ein Agent, der fachliche Fragen zu Dokumenten beantwortet, relevante Quellen findet, Aussagen nachvollziehbar belegt und bei Unsicherheit kontrolliert eskaliert?

## Warum diese Aufgabe?

Der Research Assistant ist didaktisch geeignet, weil er typische Anforderungen realer Agentensysteme in einer ueberschaubaren Aufgabe buendelt:

- Er braucht eine klare Aufgabenabgrenzung.
- Er muss Wissen aus Dokumenten nutzen, statt frei zu halluzinieren.
- Er muss Quellen und Unsicherheit sichtbar machen.
- Er benoetigt State, Sessions und kontrollierte Zwischenschritte.
- Er zeigt, wann Evaluation, Security und menschliche Freigabe notwendig werden.

Damit verbindet die Aufgabe konzeptionelles Verstehen mit praktischer Umsetzung.

## Rolle im Kurs

Die Leitaufgabe ist kein einzelnes Einstiegsthema, sondern begleitet mehrere Kursphasen:

| Kursphase | Bezug zur Leitaufgabe |
|---|---|
| Orientierung | Klaeren, ob ein Agent ueberhaupt sinnvoll ist. |
| Modelle und Provider | Entscheiden, welche Modellrollen benoetigt werden. |
| Agenten-Implementierung | Architektur, Prompting, Tool Use, RAG, State und HITL umsetzen. |
| Frameworks | LangChain, LangGraph, ChromaDB und LangSmith praktisch einsetzen. |
| Qualitaet und Sicherheit | Antworten pruefbar, beobachtbar und sicher machen. |
| Deployment und Betrieb | Aus der Uebung ein betreibbares Projekt ableiten. |

## Abgrenzung

Diese Seite beschreibt das **Warum** und das Zielbild der Leitaufgabe.

Die konkrete Umsetzung mit Workshop, Challenge, Notebook-Struktur, Bewertung und Abgabe steht im Dokument [Research Assistant]({{ '/08-deployment-betrieb/research-assistant.html' | relative_url }}).
