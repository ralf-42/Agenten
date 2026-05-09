---
layout: default
title: Capstone-Briefing
parent: Projekte
nav_order: 3
permalink: /projects/capstone-briefing.html
description: "Abschlussprojekt: Research Assistant mit eigenem Korpus oder eigener Variante"
has_toc: true
---

# Capstone-Briefing

Das Capstone ist das Abschlussprojekt des Kurses. Ziel ist ein lauffähiger **Research Assistant**, der Dokumente durchsucht, Antworten mit Quellen belegt und bei Unsicherheit menschliche Pruefung vorsieht.

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

## Aufgabe

Baue eine eigene Variante des Research Assistants. Du kannst den bereitgestellten RAG-Korpus verwenden oder einen kleinen eigenen Korpus ergänzen.

Der Bauplan bleibt gleich:

1. Dokumente laden
2. Dokumente vorbereiten und chunking-fähig machen
3. Embeddings und Vektorsuche verwenden
4. Eine Frage mit Kontext beantworten
5. Quellen sichtbar machen
6. Unsicherheit oder Grenzen kenntlich machen
7. Optional: HITL, UI, Supervisor oder weitere Tools ergänzen

## Mindestanforderungen

| Bereich | Erwartung |
|---|---|
| Architektur | Kurze Skizze oder Mermaid-Diagramm |
| Korpus | Bereitgestellter Korpus oder eigener kleiner Zusatzkorpus |
| Retrieval | Mindestens eine semantische Suche |
| Antwort | Strukturierte Antwort mit Quellenangabe |
| Evaluation | Mindestens ein einfacher Testfall oder Judge-Check |
| Reflexion | Kurzer Abschnitt: Was funktioniert, was ist noch unsicher? |

## Bewertung

| Kriterium | Punkte |
|---|---:|
| Architektur nachvollziehbar | 2 |
| Retrieval funktioniert | 2 |
| Antwort mit Quellen | 2 |
| Kontrolle, Grenzen oder HITL sichtbar | 2 |
| Reflexion und nächste Verbesserung | 2 |
| **Gesamt** | **10** |

## Gute Varianten

- Research Assistant für einen Teilkorpus aus RAG-Papieren
- Assistant für eine eigene Dokumentensammlung
- Vergleich von zwei Retrieval-Strategien
- RAG-Agent mit Quellenpflicht und Out-of-Corpus-Regel
- Kleine Gradio-Oberflaeche für Fragen an den Korpus

## Nicht erforderlich

- Produktionsreifes Deployment
- Perfekte Benutzeroberflaeche
- Vollstaendige Multi-Agent-Architektur
- Eigenes Modelltraining
- Vollautomatische Entscheidung ohne menschliche Kontrolle

## Abgabe

- Ein Notebook, das von oben nach unten läuft
- Eine kurze Architekturübersicht
- Mindestens eine Beispielantwort mit Quellen
- Eine kurze Reflexion am Ende

**Erledigt, wenn:** Der Assistant eine Frage zum Korpus beantwortet, mindestens eine Quelle nennt und du erklären kannst, welche Grenze oder Unsicherheit noch bleibt.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Einsteiger-Guides](frameworks/einsteiger-guides.html) | Wo starte ich als Einsteiger mit Capstone-Briefing? |
| [Best Practices](frameworks/best-practices.html) | Welche Produktionsstandards gelten für Capstone-Briefing? |

---

**Version:** 1.0<br>
**Stand:** Mai 2026<br>
**Kurs:** KI-Agenten
