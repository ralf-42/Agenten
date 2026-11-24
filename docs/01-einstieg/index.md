---
layout: default
title: "Start"
nav_order: 1
has_children: true
description: "Kursüberblick, Lernpfad, Nutzen, Grundbegriffe und PMO-Assistent"
has_toc: false
redirect_from: ["/02-orientierung-entscheidung/"]
---

# KI-Agenten
{: .no_toc }

> **KI-Agenten. Planen. Handeln. Prüfen.**<br>
> Planung, Tool-Nutzung und Kontrolle von Agenten mit LangChain, LangGraph und LangSmith

---

> [!TIP] Einstieg in die Dokumentation<br>
> [Zuerst lesen]({{ '/01-einstieg/zuerst-lesen.html' | relative_url }}) bietet den kürzesten Einstieg. Der [Kursüberblick]({{ '/01-einstieg/kursueberblick.html' | relative_url }}) beschreibt Ziele und Aufbau; der [Lernpfad]({{ '/01-einstieg/lernpfad.html' | relative_url }}) führt anschließend zu den passenden Fachartikeln.

---

Ein KI-Agent verbindet ein Sprachmodell mit Werkzeugen und einer Ablaufsteuerung. Damit kann er Informationen abrufen, Arbeitsschritte ausführen und Ergebnisse anhand festgelegter Regeln prüfen. Sein Handlungsspielraum ergibt sich aus den verfügbaren Tools, Daten und Kontrollschritten.

Im Kurs dient der PMO-Assistent als durchgehendes Anwendungsbeispiel. Er bereitet Projektinformationen für Meetings auf, erstellt quellengebundene Briefings und macht offene Punkte sichtbar. Bei fehlenden Belegen oder kritischen Ausgaben fordert er eine menschliche Prüfung an. Projektentscheidungen bleiben bei den Verantwortlichen.

Der Kurs betrachtet KI-Agenten aus drei **Perspektiven**:

## Planen

Zuerst wird geklärt, welche Aufgabe ansteht, welche Informationen dafür fehlen und welche Tools helfen. Regeln legen fest, wann der Ablauf weitergeht und wann er eine Freigabe benötigt.

## Handeln

Tools führen konkrete Arbeitsschritte aus, etwa Dokumente durchsuchen oder Aufgabenstände abrufen. Der gespeicherte Arbeitsstand (State) und die Ablaufsteuerung halten die Schritte zusammen und bestimmen den nächsten Schritt.

## Prüfen

Quellen, Tool-Aufrufe und Zustandswechsel müssen nachvollziehbar bleiben. Tests prüfen typische Fälle und Fehlerpfade; Berechtigungen begrenzen, was ein Agent ausführen darf.

## Themen

| Thema | Inhalt |
|---|---|
| [Zuerst lesen]({{ '/01-einstieg/zuerst-lesen.html' | relative_url }}) | Die wichtigsten Seiten vor dem ersten Agentenprojekt. |
| [Kursüberblick]({{ '/01-einstieg/kursueberblick.html' | relative_url }}) | Ziele, Module und Ablauf des Kurses. |
| [Lernpfad]({{ '/01-einstieg/lernpfad.html' | relative_url }}) | Von einer konkreten Frage zu passenden Artikeln und Vertiefungen. |
| [Lohnt sich KI?]({{ '/01-einstieg/lohnt-es-sich.html' | relative_url }}) | Nutzen, Datenlage, Aufwand und Risiken eines Vorhabens prüfen. |
| [Grundbegriffe]({{ '/01-einstieg/terminologie.html' | relative_url }}) | Gemeinsame Begriffe für Tools, State, Memory und Kontrollschritte. |
| [Unser Kursprojekt: PMO-Assistent]({{ '/01-einstieg/pmo-assistent.html' | relative_url }}) | Aufgaben, Daten und Grenzen des durchgehenden Beispiels. |

## Weiterführend

Unter [Architekturen]({{ '/02-architekturen/' | relative_url }}) wird die passende Lösung für eine Aufgabe ausgewählt. Im [Agent Lab]({{ '/visualisierungen/agent_patterns_lab/#docs' | relative_url }}){:target="_blank" rel="noopener"} lassen sich die Themen begleitend erkunden.

> [!NOTE] Hinweis zur Entstehung<br>
> Bei der Erstellung dieser Unterlagen wurden KI-Werkzeuge unterstützend eingesetzt, unter anderem für Recherche, Strukturierung, Formulierung und einzelne Medien. Die Inhalte wurden anschließend fachlich geprüft, eingeordnet und redaktionell überarbeitet.
