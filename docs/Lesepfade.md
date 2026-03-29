---
layout: default
title: Lesepfade
nav_order: 2
description: Orientierung, Lesepfade und empfohlene Einstiege durch die Agenten-Dokumentation
has_toc: true
---

# Lesepfade

Diese Dokumentation ist nicht als lineares Handbuch aufgebaut. Der schnellste Einstieg entsteht meist nicht durch vollständiges Lesen, sondern durch einen passenden Pfad: erst das Ziel klären, dann gezielt vertiefen.

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

1. [Lohnt es sich überhaupt?](./concepts/Lohnt_es_sich.html)
2. [Agent-Architekturen](./concepts/Agent_Architekturen.html)
3. [Aufgabenklassen und Lösungswege](./concepts/Aufgabenklassen_und_Loesungswege.html)
4. [Tool Use & Function Calling](./concepts/Tool_Use_Function_Calling.html)

### Erster Agent

Ein erster funktionierender Agent soll entstehen, ohne gleich in zu viele Patterns, Frameworks und Spezialfälle abzudriften.

Empfohlener Einstieg:

1. [Einsteiger LangChain](./frameworks/Einsteiger_LangChain.html)
2. [Prompt Engineering](./concepts/Prompt_Engineering.html)
3. [State Management](./concepts/State_Management.html)
4. [Einsteiger LangGraph](./frameworks/Einsteiger_LangGraph.html)

### RAG und Wissensarbeit

Dokumente, Wissensquellen oder Grounding spielen die Hauptrolle. Meist steht dann nicht das Agenten-Pattern selbst im Vordergrund, sondern die Frage, wie Wissen zuverlässig eingebunden wird.

Empfohlener Einstieg:

1. [RAG-Konzepte](./concepts/RAG_Konzepte.html)
2. [Memory-Systeme](./concepts/Memory_Systeme.html)
3. [Evaluation & Testing](./concepts/Evaluation_Testing.html)
4. [Einsteiger ChromaDB](./frameworks/Einsteiger_ChromaDB.html)

### Robustheit und Kontrolle

Die erste Demo funktioniert, aber es fehlt an Steuerbarkeit, Nachvollziehbarkeit oder Sicherheit. Typische Themen sind Routing, Persistenz, Guardrails und menschliche Freigaben.

Empfohlener Einstieg:

1. [Checkpointing & Persistenz](./concepts/Checkpointing_Persistenz.html)
2. [Human in the Loop](./concepts/Human_in_the_Loop.html)
3. [Agent Security](./concepts/Agent_Security.html)
4. [LangGraph Best Practices](./frameworks/LangGraph_Best_Practices.html)

### Produktion und Betrieb

Ein System soll nicht nur funktionieren, sondern auch unter realen Bedingungen betreibbar werden. Dann verschiebt sich der Fokus von der Demo zur Produktreife.

Empfohlener Einstieg:

1. [Minimum Viable Agent Stack](./deployment/Minimum_Viable_Agent_Stack.html)
2. [Vom Modell zum Produkt: LangChain-Ökosystem](./deployment/Vom_Modell_zum_Produkt_LangChain_Oekosystem.html)
3. [Aus Entwicklung ins Deployment](./deployment/aus-entwicklung-ins-deployment.html)
4. [LangSmith Best Practices](./frameworks/LangSmith_Best_Practices.html)

### Governance und Rahmenbedingungen

Sobald Agentensysteme in Bildung, Verwaltung oder Unternehmen eingesetzt werden, reichen Architektur und Code nicht mehr aus. Rechtliche, organisatorische und ethische Fragen werden dann zum Teil des Entwurfs.

Empfohlener Einstieg:

1. [Digitale Souveränität](./regulatory/Digitale_Souveraenitat.html)
2. [Ethik und GenAI](./regulatory/Ethik_und_GenAI.html)
3. [EU AI Act](./regulatory/EU_AI_Act.html)
4. [Datenschutz](./legal/datenschutz.html)

## Drei Dokumente für fast jeden Start

Wer nicht lange wählen will, kommt mit diesen drei Dokumenten meist am schnellsten ins Thema:

1. [Lohnt es sich überhaupt?](./concepts/Lohnt_es_sich.html)
2. [Agent-Architekturen](./concepts/Agent_Architekturen.html)
3. [Einsteiger LangChain](./frameworks/Einsteiger_LangChain.html)

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

**Version:** 1.0   
**Stand:** März 2026   
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.   
