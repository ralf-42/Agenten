---
layout: default
title: Lernpfad
nav_order: 3
description: Orientierung, Lernpfade und empfohlene Einstiege durch die Agenten-Dokumentation
has_toc: true
---

# Lernpfad

Die Dokumentation ist thematisch gegliedert. [Zuerst lesen](./zuerst-lesen.html) bietet eine kurze Orientierung; dieser Lernpfad führt von einer Frage zu passenden Fachartikeln.

Der **PMO-Assistent** dient als durchgehendes Beispiel. Ziele, Tagesstruktur und Module stehen im [Kursüberblick](./02-orientierung-entscheidung/kursueberblick.html).

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

## Umfang und Priorisierung

Die Dokumentation enthält mehr Inhalte als der Grundlagenpfad. Die folgende Einteilung zeigt, welche Texte das gemeinsame Ziel stützen und welche zur Erweiterung oder Vertiefung dienen.

| Einordnung            | Bedeutung                                                                                                         | Typische Dokumente                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Grundlagen / Kern** | Gemeinsame fachliche Basis und zentrale Bausteine des PMO-Assistenten.                                            | Orientierung, Agenten-Architekturen, Tool Use, State Management, LangChain, LangGraph, RAG, Sessions, Memory, HITL, Evaluation |
| **Aufbau**            | *Optionale* Erweiterungen, wenn die Grundlagen stehen und weitere Zeit oder ein passendes Lernziel vorhanden ist. | Agentic RAG, Security, Evaluation & Testing, Routing, Kostenkontrolle, Integration, Advanced RAG                               |
| **Vertiefung**        | Weiterführende Themen, die nach Bedarf ausgewählt werden.                                                         | UI, MCP, Skills, DeepAgents, Deployment, Monitoring, Capstone                                                                  |



### Erste Orientierung

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
6. [Checkliste Agentensystem]({{ '/04-agenten-implementierung/checkliste-agentensystem.html' | relative_url }})

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
4. [Agent Harness]({{ '/07-qualitaet-sicherheit/agent-harness.html' | relative_url }})
5. [Evaluation & Observability]({{ '/07-qualitaet-sicherheit/evaluation-observability.html' | relative_url }})
6. [Checkliste Agentensystem]({{ '/04-agenten-implementierung/checkliste-agentensystem.html' | relative_url }})

### Produktion und Betrieb

Ein System soll nicht nur funktionieren, sondern auch unter realen Bedingungen betreibbar werden. Dann verschiebt sich der Fokus von der Demo zur Produktreife.

Empfohlener Einstieg:

1. [Minimum Viable Agent Stack]({{ '/08-deployment-betrieb/minimum-viable-agent-stack.html' | relative_url }})
2. [Vom Modell zur Anwendung]({{ '/08-deployment-betrieb/vom-modell-zum-produkt-langchain-oekosystem.html' | relative_url }})
3. [Produktionsreife Agentenanwendung]({{ '/08-deployment-betrieb/aus-entwicklung-ins-deployment.html' | relative_url }})
4. [LangSmith Best Practices]({{ '/05-frameworks/langsmith-best-practices.html' | relative_url }})
5. [Modellauswahl]({{ '/03-modelle-provider-anpassung/modellauswahl.html' | relative_url }})
6. [Evaluation & Observability]({{ '/07-qualitaet-sicherheit/evaluation-observability.html' | relative_url }})
7. [Agent Harness]({{ '/07-qualitaet-sicherheit/agent-harness.html' | relative_url }})
8. [Checkliste Agentensystem]({{ '/04-agenten-implementierung/checkliste-agentensystem.html' | relative_url }})

### Governance und Rahmenbedingungen

Sobald Agentensysteme in Bildung, Verwaltung oder Unternehmen eingesetzt werden, reichen Architektur und Code nicht mehr aus. Rechtliche, organisatorische und ethische Fragen werden dann zum Teil des Entwurfs.

Empfohlener Einstieg:

1. [Digitale Souveränität]({{ '/09-regulatorik-verantwortung/digitale-souveraenitaet.html' | relative_url }})
2. [Ethik und KI-Agenten]({{ '/09-regulatorik-verantwortung/ethik-und-ki-agenten.html' | relative_url }})
3. [EU AI Act]({{ '/09-regulatorik-verantwortung/eu-ai-act.html' | relative_url }})
4. [Datenschutz & DSGVO]({{ '/09-regulatorik-verantwortung/datenschutz-dsgvo.html' | relative_url }})

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Orientierung & Entscheidung]({{ '/02-orientierung-entscheidung/' | relative_url }}) | Welche Grundentscheidungen stehen vor dem Bau eines Agenten? |
| [Agenten-Implementierung]({{ '/04-agenten-implementierung/' | relative_url }}) | Welche Grundlagen brauche ich für die erste Umsetzung? |
| [Checkliste Agentensystem]({{ '/04-agenten-implementierung/checkliste-agentensystem.html' | relative_url }}) | Welche Prüfpunkte sichern Entwurf, Review und Freigabe ab? |
| [Deployment & Betrieb]({{ '/08-deployment-betrieb/' | relative_url }}) | Welche Dokumente begleiten den Weg in Betrieb und Projektarbeit? |
| [Regulatorik & Verantwortung]({{ '/09-regulatorik-verantwortung/' | relative_url }}) | Welche inhaltlichen Rahmenbedingungen gelten für Agentensysteme? |
| [Ressourcen]({{ '/10-ressourcen/' | relative_url }}) | Welche Hilfen und Nachschlagepunkte unterstützen die Umsetzung? |

---

**Version:** 1.5<br>
**Stand:** Oktober 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
