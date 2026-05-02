---
layout: default
title: Lesepfade
nav_order: 3
description: Orientierung, Lesepfade und empfohlene Einstiege durch die Agenten-Dokumentation
has_toc: true
---

# Lesepfade

Diese Dokumentation ist nicht als lineares Handbuch aufgebaut. Für den kürzesten Einstieg eignet sich zuerst [Zuerst lesen](./zuerst-lesen.html). Danach helfen die Lesepfade dabei, je nach Ziel gezielt zu vertiefen.

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

## Wofür diese Seite da ist

Die Dokumentation deckt mehrere Ebenen gleichzeitig ab: Grundbegriffe, Framework-Entscheidungen, Architekturfragen, Deployment, Governance und praktische Umsetzung. Ohne Einstiegspunkt wird daraus schnell eine Sammlung guter Einzeltexte ohne klare Leserführung.

Diese Seite bündelt deshalb drei Dinge:

- einen kompakten Überblick über sinnvolle Einstiege
- empfohlene Lesepfade je nach Ziel
- eine kleine Auswahl von Dokumenten, mit denen fast immer begonnen werden kann

## Typische Einstiege

Nicht jede Person startet mit derselben Frage. In der Praxis tauchen meist fünf Ausgangslagen auf.

### Orientierung

Ein Gesamtbild fehlt noch, die Grundbegriffe sind unscharf oder Agenten werden noch stark mit Chatbots verwechselt.

Empfohlener Einstieg:

1. [Lohnt es sich überhaupt?](./concepts/einstieg/lohnt-es-sich.html)
2. [Welche Architektur passt zu diesem Agenten?](./concepts/architektur/agent-architekturen.html)
3. [Welches Werkzeug?](./concepts/einstieg/aufgabenklassen-und-loesungswege.html)
4. [Modellauswahl](./concepts/modell-kontext/modellauswahl.html)
5. [Wie nutzen Agenten Werkzeuge?](./concepts/architektur/tool-use-function-calling.html)

### Erster Agent

Ein erster funktionierender Agent soll entstehen, ohne gleich in zu viele Patterns, Frameworks und Spezialfälle abzudriften.

Empfohlener Einstieg:

1. [Einsteiger LangChain](./frameworks/einsteiger/einsteiger-langchain.html)
2. [Prompt Engineering](./concepts/architektur/prompt-engineering.html)
3. [Context Engineering](./concepts/modell-kontext/context-engineering.html)
4. [State Management](./concepts/workflows-state/state-management.html)
5. [Einsteiger LangGraph](./frameworks/einsteiger/einsteiger-langgraph.html)

### RAG und Wissensarbeit

Dokumente, Wissensquellen oder Grounding spielen die Hauptrolle. Meist steht dann nicht das Agenten-Pattern selbst im Vordergrund, sondern die Frage, wie Wissen zuverlässig eingebunden wird.

Empfohlener Einstieg:

1. [RAG-Konzepte](./concepts/wissensmanagement/rag-konzepte.html)
2. [Tokenizing & Chunking](./concepts/wissensmanagement/tokenizing-chunking.html)
3. [Embeddings](./concepts/wissensmanagement/embeddings.html)
4. [Wie erinnern sich Agenten über mehrere Schritte und Sitzungen hinweg?](./concepts/workflows-state/memory-systeme.html)
5. [Woher zeigt sich, ob ein Agent gut arbeitet?](./concepts/qualitaet-praxis/evaluation-observability.html)
6. [Einsteiger ChromaDB](./frameworks/einsteiger/einsteiger-chromadb.html)

### Robustheit und Kontrolle

Die erste Demo funktioniert, aber es fehlt an Steuerbarkeit, Nachvollziehbarkeit oder Sicherheit. Typische Themen sind Routing, Persistenz, Guardrails und menschliche Freigaben.

Empfohlener Einstieg:

1. [Checkpointing & Persistenz](./concepts/workflows-state/checkpointing-persistenz.html)
2. [Wann sollten Menschen in den Ablauf eingreifen?](./concepts/workflows-state/human-in-the-loop.html)
3. [Wie werden Agenten gegen Missbrauch und Fehlverhalten abgesichert?](./concepts/qualitaet-praxis/agent-security.html)
4. [Agent Evaluation & Observability Best Practices](./frameworks/bestpractices/agent-evaluation-observability-best-practices.html)

### Produktion und Betrieb

Ein System soll nicht nur funktionieren, sondern auch unter realen Bedingungen betreibbar werden. Dann verschiebt sich der Fokus von der Demo zur Produktreife.

Empfohlener Einstieg:

1. [Minimum Viable Agent Stack](./deployment/minimum-viable-agent-stack.html)
2. [Vom Modell zum Produkt: LangChain-Ökosystem](./deployment/vom-modell-zum-produkt-langchain-oekosystem.html)
3. [Aus Entwicklung ins Deployment](./deployment/aus-entwicklung-ins-deployment.html)
4. [LangSmith Best Practices](./frameworks/bestpractices/langsmith-best-practices.html)
5. [Modellauswahl](./concepts/modell-kontext/modellauswahl.html)
6. [Agent Evaluation & Observability Best Practices](./frameworks/bestpractices/agent-evaluation-observability-best-practices.html)

### Governance und Rahmenbedingungen

Sobald Agentensysteme in Bildung, Verwaltung oder Unternehmen eingesetzt werden, reichen Architektur und Code nicht mehr aus. Rechtliche, organisatorische und ethische Fragen werden dann zum Teil des Entwurfs.

Empfohlener Einstieg:

1. [Digitale Souveränität](./regulatory/digitale-souveraenitaet.html)
2. [Ethik und GenAI](./regulatory/ethik-und-genai.html)
3. [EU AI Act](./regulatory/eu-ai-act.html)
4. [Datenschutz](./legal/datenschutz.html)

## Drei Dokumente für fast jeden Start

Wer nicht lange wählen will, kommt mit diesen drei Dokumenten meist am schnellsten ins Thema:

1. [Lohnt es sich überhaupt?](./concepts/einstieg/lohnt-es-sich.html)
2. [Welche Architektur passt zu diesem Agenten?](./concepts/architektur/agent-architekturen.html)
3. [Einsteiger LangChain](./frameworks/einsteiger/einsteiger-langchain.html)

Diese Kombination klärt erst die Einsatzfrage, dann die Struktur und erst danach die Umsetzung. Genau diese Reihenfolge verhindert viele frühe Fehlstarts.

## Wie die Bereiche zusammenhängen

Die Dokumentation ist in Bereiche gegliedert, die unterschiedliche Funktionen haben.

| Bereich | Rolle in der Navigation | Typische Frage |
|---|---|---|
| `concepts/` | Begriffe, Modelle, Entscheidungslogik | Wie lässt sich das Thema einordnen? |
| `frameworks/` | Einstieg und Arbeitsweise mit Tools | Wie wird es konkret umgesetzt? |
| `deployment/` | Betrieb, Produktisierung, Übergang in reale Systeme | Wie wird aus einer Demo ein System? |
| `regulatory/` | rechtliche und organisatorische Einordnung | Welche Rahmenbedingungen gelten? |
| `resources/` | Hilfen, Setup, Nachschlagepunkte | Was hilft bei der praktischen Arbeit? |
| `projects/` | projektnahe Aufgaben und Kursformate | Wie lässt sich das Gelernte anwenden? |

## Leselogik statt Vollständigkeit

Die Dokumentation muss nicht vollständig von oben nach unten gelesen werden. Sinnvoller ist ein selektiver Ablauf:

1. mit einer Leitfrage beginnen
2. einen passenden Pfad aus dieser Seite wählen
3. nur dann in angrenzende Themen springen, wenn die eigene Aufgabe das verlangt

Gerade bei Agentensystemen führt Vollständigkeit schnell in Sackgassen. Ein zu früher Sprung in Deployment, Multi-Agent-Patterns oder Governance erzeugt oft mehr Komplexität als Erkenntnis.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [concepts](./concepts.html) | Welche Konzeptdokumente stehen zur Verfügung? |
| [frameworks](./frameworks.html) | Welche Frameworks und Best Practices werden behandelt? |
| [deployment](./deployment.html) | Welche Dokumente begleiten den Weg in den Betrieb? |
| [regulatory](./regulatory.html) | Welche rechtlichen und organisatorischen Rahmenbedingungen gelten? |
| [resources](./resources.html) | Welche Hilfen und Nachschlagepunkte unterstützen die Umsetzung? |
| [projects](./projects.html) | Welche projektnahen Aufgaben und Kursformate stehen bereit? |

**Version:** 1.0<br>
**Stand:** März 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
