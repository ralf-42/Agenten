---
layout: default
title: Was unterscheidet diesen Kurs von GenAI?
parent: "Orientierung & Entscheidung"
nav_order: 5
description: Abgrenzung des Agenten-Kurses zum GenAI-Kurs — Leitprofil, Leitmotto und Wiederverwendung von Grundlagen
has_toc: true
---

# Was unterscheidet diesen Kurs von GenAI?
{: .no_toc }

> **Abgrenzung des Agenten-Kurses zum GenAI-Kurs — Leitprofil, Leitmotto und Wiederverwendung von Grundlagen**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Warum diese Abgrenzung nötig ist

Prompting, RAG und Chat-Memory kommen in beiden Kursen vor. Wer den GenAI-Kurs bereits kennt, stellt sich zu Recht die Frage, was hier wirklich neu ist. Die kurze Antwort: nicht die einzelnen Bausteine, sondern das, was aus ihnen entsteht. GenAI vermittelt einzelne KI-Features. Dieser Kurs baut daraus ein **kontrolliertes Arbeitssystem** — ein System, das nicht nur auf eine Anfrage antwortet, sondern eigenständig entscheidet, sich über eine Sitzung hinweg erinnert und kontrolliert wird, bevor eine folgenreiche Ausgabe das System verlässt.

## Leitprofil

> Vom KI-Feature zum kontrollierten Arbeitssystem: Tools, State, Entscheidungen, Freigabe und Evaluation.

Drei Fähigkeiten ziehen sich als roter Faden durch den gesamten Kurs:

- **Planen:** Routing, State, Tool-Auswahl, Supervisor und Aufgabenzerlegung
- **Handeln:** Tool-Use, RAG als Evidence Tool, Workflows und Agenten-Ausführung
- **Prüfen:** HITL, Security, Evaluation, Gates, Quellen- und Trace-Prüfung

Diese drei Begriffe sind kein Marketing-Etikett, sondern der praktische Test, ob ein Notebook agentischen Stoff behandelt oder nur eine GenAI-Wiederholung mit LangChain-Syntax ist: Ein Kapitel, das keinen der drei Begriffe berührt, gehört eigentlich in den GenAI-Kurs.

## Wo die Kurse sich überschneiden

Prompt Engineering, RAG-Grundlagen und Chat-Memory werden in beiden Kursen behandelt, weil sie die technische Voraussetzung für Agenten sind — ein Agent, der keinen guten Prompt schreiben oder keine Quelle abrufen kann, kommt gar nicht erst zur Entscheidungslogik. Der Agenten-Kurs wiederholt diese Grundlagen deshalb bewusst, erklärt sie aber nicht neu von Grund auf, sondern setzt sie sofort in einen Kontrolle-Kontext:

| Baustein | In GenAI | Im Agenten-Kurs |
|---|---|---|
| Prompting | Eigenständiges Ziel: bessere Antworten | Mittel zum Zweck: Rolle, Tool-Nutzung und Stop-Bedingungen eines Agenten steuern |
| RAG | Eigenständiges Ziel: Wissen einbinden | Evidence Tool: eine von mehreren Fähigkeiten, die der Agent kontrolliert einsetzt |
| Chat-Memory | Eigenständiges Ziel: Gesprächsverlauf halten | Ein Sonderfall von Kontextmanagement neben State und Checkpointing über einen ganzen Workflow |

## Was wirklich neu ist

State Machines mit LangGraph, explizites Routing über `add_conditional_edges()`, Checkpointing über eine Sitzung hinweg, Human-in-the-Loop als Freigabemechanismus, Multi-Agent-Patterns mit Supervisor und Workern sowie Evaluation, die nicht nur Antwortqualität, sondern Tool-Wahl und Eskalationsverhalten prüft — all das hat im GenAI-Kurs keine Entsprechung. Es setzt voraus, dass die Grundlagen aus GenAI bereits sitzen.

## Wann reicht GenAI, wann braucht es Agenten

GenAI reicht, wenn eine einzelne, klar umrissene Aufgabe mit einem LLM-Aufruf oder einer festen RAG-Chain gelöst werden kann — etwa ein Text zusammenfassen oder eine Frage gegen einen Wissensspeicher beantworten. Der Agenten-Kurs wird relevant, sobald ein System selbst entscheiden muss, welchen Weg es einschlägt, sich über mehrere Schritte hinweg an Zwischenergebnisse erinnern muss oder eine Ausgabe erst nach einer Kontrollinstanz das System verlassen darf. Der [Research Assistant]({{ '/02-orientierung-entscheidung/research-assistant-leitaufgabe.html' | relative_url }}) zeigt genau diesen Übergang: von der einfachen RAG-Chain zum kontrollierten Agentensystem.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Research Assistant]({{ '/02-orientierung-entscheidung/research-assistant-leitaufgabe.html' | relative_url }}) | Wie sieht das kontrollierte Agentensystem konkret aus, das dieser Kurs baut? |
| [Terminologie]({{ '/02-orientierung-entscheidung/terminologie.html' | relative_url }}) | Welche Begriffe — inklusive Evidence Tool, Gate, Agenten-Vertrag — werden im Kurs einheitlich verwendet? |
| [Aufgabenklassen & Lösungswege]({{ '/02-orientierung-entscheidung/aufgabenklassen-und-loesungswege.html' | relative_url }}) | Wann reicht Prompting, wann braucht es RAG, Workflow oder Agent? |
| [Welches Werkzeug?]({{ '/02-orientierung-entscheidung/lohnt-es-sich.html' | relative_url }}) | Wann ist ein KI- oder Agentenvorhaben überhaupt sinnvoll? |

---

**Version:** 1.0<br>
**Stand:** Juli 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
