---
layout: default
title: Lernpfad
nav_order: 3
description: Orientierung, Lernpfade und empfohlene Einstiege durch die Agenten-Dokumentation
has_toc: true
---

# Lernpfad

Diese Dokumentation ist nicht als lineares Handbuch aufgebaut. Für den kürzesten Einstieg eignet sich zuerst [Zuerst lesen](./zuerst-lesen.html). Danach hilft der Lernpfad dabei, je nach Ziel gezielt zu vertiefen.

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

## Wofür diese Seite da ist

Die Dokumentation deckt mehrere Ebenen gleichzeitig ab: Grundbegriffe, Framework-Entscheidungen, Architekturfragen, Deployment, Governance und praktische Umsetzung. Ohne Einstiegspunkt wird daraus schnell eine Sammlung guter Einzeltexte ohne klare Leserführung.

Diese Seite bündelt deshalb drei Dinge:

- einen kompakten Überblick über sinnvolle Einstiege
- empfohlene Lernpfade je nach Ziel
- eine kleine Auswahl von Dokumenten, mit denen fast immer begonnen werden kann

## Typische Einstiege

Nicht jede Person startet mit derselben Frage. In der Praxis tauchen meist fünf Ausgangslagen auf.

### Orientierung

Ein Gesamtbild fehlt noch, die Grundbegriffe sind unscharf oder Agenten werden noch stark mit Chatbots verwechselt.

Empfohlener Einstieg:

1. [Lohnt es sich überhaupt?]({{ '/02-orientierung-entscheidung/lohnt-es-sich.html' | relative_url }})
2. [Welche Architektur passt zu diesem Agenten?]({{ '/04-agenten-implementierung/entwurf/agent-architekturen.html' | relative_url }})
3. [Welches Werkzeug?]({{ '/02-orientierung-entscheidung/aufgabenklassen-und-loesungswege.html' | relative_url }})
4. [Modellauswahl]({{ '/03-modelle-provider-anpassung/modellauswahl.html' | relative_url }})
5. [Wie nutzen Agenten Werkzeuge?]({{ '/04-agenten-implementierung/entwurf/tool-use-function-calling.html' | relative_url }})

### Erster Agent

Ein erster funktionierender Agent soll entstehen, ohne gleich in zu viele Patterns, Frameworks und Spezialfälle abzudriften.

Empfohlener Einstieg:

1. [LangChain Guide]({{ '/05-frameworks/einsteiger-langchain.html' | relative_url }})
2. [Prompt Engineering]({{ '/04-agenten-implementierung/entwurf/prompt-engineering.html' | relative_url }})
3. [Context Engineering]({{ '/04-agenten-implementierung/kontext-wissen/context-engineering.html' | relative_url }})
4. [State Management]({{ '/04-agenten-implementierung/ablauf-zustand/state-management.html' | relative_url }})
5. [LangGraph Guide]({{ '/05-frameworks/einsteiger-langgraph.html' | relative_url }})

### RAG und Wissensarbeit

Dokumente, Wissensquellen oder Grounding spielen die Hauptrolle. Meist steht dann nicht das Agenten-Pattern selbst im Vordergrund, sondern die Frage, wie Wissen zuverlässig eingebunden wird.

Empfohlener Einstieg:

1. [RAG-Konzepte]({{ '/04-agenten-implementierung/kontext-wissen/rag-konzepte.html' | relative_url }})
2. [Tokenizing & Chunking]({{ '/04-agenten-implementierung/kontext-wissen/tokenizing-chunking.html' | relative_url }})
3. [Embeddings]({{ '/04-agenten-implementierung/kontext-wissen/embeddings.html' | relative_url }})
4. [Wie erinnern sich Agenten über mehrere Schritte und Sitzungen hinweg?]({{ '/04-agenten-implementierung/ablauf-zustand/memory-systeme.html' | relative_url }})
5. [Woher zeigt sich, ob ein Agent gut arbeitet?]({{ '/07-qualitaet-sicherheit/evaluation-observability.html' | relative_url }})
6. [ChromaDB Guide]({{ '/05-frameworks/einsteiger-chromadb.html' | relative_url }})

### Robustheit und Kontrolle

Die erste Demo funktioniert, aber es fehlt an Steuerbarkeit, Nachvollziehbarkeit oder Sicherheit. Typische Themen sind Routing, Persistenz, Guardrails und menschliche Freigaben.

Empfohlener Einstieg:

1. [Checkpointing & Persistenz]({{ '/04-agenten-implementierung/ablauf-zustand/checkpointing-persistenz.html' | relative_url }})
2. [Wann sollten Menschen in den Ablauf eingreifen?]({{ '/04-agenten-implementierung/ablauf-zustand/human-in-the-loop.html' | relative_url }})
3. [Wie werden Agenten gegen Missbrauch und Fehlverhalten abgesichert?]({{ '/07-qualitaet-sicherheit/agent-security.html' | relative_url }})
4. [Agent Evaluation & Observability Best Practices]({{ '/07-qualitaet-sicherheit/agent-evaluation-observability-best-practices.html' | relative_url }})

### Produktion und Betrieb

Ein System soll nicht nur funktionieren, sondern auch unter realen Bedingungen betreibbar werden. Dann verschiebt sich der Fokus von der Demo zur Produktreife.

Empfohlener Einstieg:

1. [Minimum Viable Agent Stack]({{ '/08-deployment-betrieb/minimum-viable-agent-stack.html' | relative_url }})
2. [Vom Modell zum Produkt: LangChain-Ökosystem]({{ '/08-deployment-betrieb/vom-modell-zum-produkt-langchain-oekosystem.html' | relative_url }})
3. [Aus Entwicklung ins Deployment]({{ '/08-deployment-betrieb/aus-entwicklung-ins-deployment.html' | relative_url }})
4. [LangSmith Best Practices]({{ '/05-frameworks/langsmith-best-practices.html' | relative_url }})
5. [Modellauswahl]({{ '/03-modelle-provider-anpassung/modellauswahl.html' | relative_url }})
6. [Agent Evaluation & Observability Best Practices]({{ '/07-qualitaet-sicherheit/agent-evaluation-observability-best-practices.html' | relative_url }})

### Governance und Rahmenbedingungen

Sobald Agentensysteme in Bildung, Verwaltung oder Unternehmen eingesetzt werden, reichen Architektur und Code nicht mehr aus. Rechtliche, organisatorische und ethische Fragen werden dann zum Teil des Entwurfs.

Empfohlener Einstieg:

1. [Digitale Souveränität]({{ '/09-regulatorik-verantwortung/digitale-souveraenitaet.html' | relative_url }})
2. [Ethik und GenAI]({{ '/09-regulatorik-verantwortung/ethik-und-genai.html' | relative_url }})
3. [EU AI Act]({{ '/09-regulatorik-verantwortung/eu-ai-act.html' | relative_url }})
4. [Datenschutz & DSGVO]({{ '/09-regulatorik-verantwortung/datenschutz-dsgvo.html' | relative_url }})

## Drei Dokumente für fast jeden Start

Wer nicht lange wählen will, kommt mit diesen drei Dokumenten meist am schnellsten ins Thema:

1. [Lohnt es sich überhaupt?]({{ '/02-orientierung-entscheidung/lohnt-es-sich.html' | relative_url }})
2. [Welche Architektur passt zu diesem Agenten?]({{ '/04-agenten-implementierung/entwurf/agent-architekturen.html' | relative_url }})
3. [LangChain Guide]({{ '/05-frameworks/einsteiger-langchain.html' | relative_url }})

Diese Kombination klärt erst die Einsatzfrage, dann die Struktur und erst danach die Umsetzung. Genau diese Reihenfolge verhindert viele frühe Fehlstarts.

## Wie die Bereiche zusammenhängen

Die Dokumentation ist in Bereiche gegliedert, die unterschiedliche Funktionen haben.

| Bereich | Rolle in der Navigation | Typische Frage |
|---|---|---|
| Orientierung und Agentenverständnis | Begriffe, Einsatzentscheidung, Modellwahl | Ist ein Agent hier sinnvoll? |
| Tool Use, Prompting und erste Agenten | Architektur, Tools, Prompts, LangChain | Wie entsteht ein erster Agent? |
| Orchestrierung, State und LangGraph | Zustandsführung und mehrstufige Abläufe | Wie wird ein Agent steuerbar? |
| Kontext, Grounding und RAG | Kontextstrategie, Retrieval, Embeddings | Wie wird Wissen zuverlässig eingebunden? |
| Sessions, Memory und HITL | Persistenz, Erinnerung, menschliche Freigaben | Wie bleibt ein Ablauf kontrollierbar? |
| Multi-Agent, Skills und Protokolle | Arbeitsteilung, Skills, Schnittstellen | Wie arbeiten Agenten zusammen? |
| Evaluation, Security und Reliability | Qualität, Sicherheit, Beobachtbarkeit | Wie wird ein Agent belastbar? |
| Deployment und Betrieb | Betrieb, Produktisierung, Projektarbeit | Wie wird aus einer Demo ein System? |
| Regulatorik, Datenschutz und Verantwortung | EU AI Act, DSGVO, Ethik, Souveränität | Welche Rahmenbedingungen prägen den Einsatz? |
| Ressourcen | Setup, Standards, Troubleshooting, Links | Was hilft bei der praktischen Arbeit? |

## Leselogik statt Vollständigkeit

Die Dokumentation muss nicht vollständig von oben nach unten gelesen werden. Sinnvoller ist ein selektiver Ablauf:

1. mit einer Leitfrage beginnen
2. einen passenden Pfad aus dieser Seite wählen
3. nur dann in angrenzende Themen springen, wenn die eigene Aufgabe das verlangt

Gerade bei Agentensystemen führt Vollständigkeit schnell in Sackgassen. Ein zu früher Sprung in Deployment, Multi-Agent-Patterns oder Governance erzeugt oft mehr Komplexität als Erkenntnis.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Orientierung & Entscheidung]({{ '/02-orientierung-entscheidung/' | relative_url }}) | Welche Grundentscheidungen stehen vor dem Bau eines Agenten? |
| [Agenten-Implementierung]({{ '/04-agenten-implementierung/' | relative_url }}) | Welche Grundlagen brauche ich für die erste Umsetzung? |
| [Deployment & Betrieb]({{ '/08-deployment-betrieb/' | relative_url }}) | Welche Dokumente begleiten den Weg in Betrieb und Projektarbeit? |
| [Regulatorik & Verantwortung]({{ '/09-regulatorik-verantwortung/' | relative_url }}) | Welche inhaltlichen Rahmenbedingungen gelten für Agentensysteme? |
| [Ressourcen]({{ '/10-ressourcen/' | relative_url }}) | Welche Hilfen und Nachschlagepunkte unterstützen die Umsetzung? |

---

**Version:** 1.0<br>
**Stand:** Mai 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.


