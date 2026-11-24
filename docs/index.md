---
layout: default
title: KI-Agenten
nav_order: 1
description: "Onboarding, Kursziel und Einstieg in die Dokumentation"
permalink: /
nav_exclude: true
---

# KI-Agenten
{: .no_toc }

> **KI-Agenten. Planen. Handeln. Prüfen.**<br>
Planung, Tool-Nutzung und Kontrolle von Agenten mit LangChain, LangGraph und LangSmith

---

> [!TIP] Orientierung<br>
> Der [Kursüberblick]({{ '/01-einstieg/kursueberblick.html' | relative_url }}) beschreibt Ziele und Aufbau. [Zuerst lesen]({{ '/01-einstieg/zuerst-lesen.html' | relative_url }}) führt zu den Einstiegsseiten; der [Lernpfad]({{ '/01-einstieg/lernpfad.html' | relative_url }}) ordnet die Fachartikel nach Themen.

---

Ein KI-Agent verbindet ein Sprachmodell mit Werkzeugen und einer Ablaufsteuerung. Damit kann er Informationen abrufen, Arbeitsschritte ausführen und Ergebnisse anhand festgelegter Regeln prüfen. Sein Handlungsspielraum ergibt sich aus den verfügbaren Tools, Daten und Kontrollschritten.

## Themen

| Thema | Inhalt |
|---|---|
| [Start]({{ '/01-einstieg/' | relative_url }}) | Wie beginnt der Kurs, und welche Aufgabe übernimmt der PMO-Assistent? |
| [Architekturen]({{ '/02-architekturen/' | relative_url }}) | Welcher Lösungsweg und welche Agentenstruktur passen zur Aufgabe? |
| [Entwicklung]({{ '/03-entwicklung/' | relative_url }}) | Wie wirken Modelle, Prompts, Tools, Kontext, Loops und State zusammen? |
| [Frameworks]({{ '/04-frameworks/' | relative_url }}) | Wie werden die Bausteine mit LangChain, LangGraph und weiteren Werkzeugen umgesetzt? |
| [Qualität & Sicherheit]({{ '/05-qualitaet-sicherheit/' | relative_url }}) | Wie lassen sich Agenten kontrollieren, bewerten und absichern? |
| [Praxis & Betrieb]({{ '/06-praxis-betrieb/' | relative_url }}) | Wie wird aus dem Prototyp eine betreibbare Anwendung? |
| [Verantwortung]({{ '/07-verantwortung/' | relative_url }}) | Welche rechtlichen Anforderungen und Abhängigkeiten sind zu beachten? |

## Weiterführend

**Begleitend ausprobieren:** [Agent Lab öffnen]({{ '/visualisierungen/agent_patterns_lab/#docs' | relative_url }}){:target="_blank" rel="noopener"}. Die sechs Arbeitsreiter finden sich mit denselben Namen auf Ebene 2 der Dokumentationsnavigation wieder.

## PMO-Assistent als Anwendungsbeispiel

Der PMO-Assistent arbeitet mit einem Projektkorpus aus Protokollen, Entscheidungen, Risiken und Aufgaben. Er bereitet Informationen für Meetings auf, erstellt quellengebundene Briefings und macht offene Punkte sichtbar. Bei fehlenden Belegen oder kritischen Ausgaben hält er an und fordert eine menschliche Prüfung an. Projektentscheidungen bleiben bei den Verantwortlichen.

> [!NOTE] Roter Faden<br>
> Die Fachartikel erklären einzelne Bausteine. Im [Zielbild des PMO-Assistenten]({{ '/01-einstieg/pmo-assistent.html' | relative_url }}) ist ihr Zusammenspiel beschrieben.

## Planen

Zuerst wird geklärt, welche Aufgabe ansteht, welche Informationen dafür fehlen und welche Tools helfen. Regeln legen fest, wann der Ablauf weitergeht und wann er eine Freigabe benötigt.

## Handeln

Tools führen konkrete Arbeitsschritte aus, etwa Dokumente durchsuchen oder Aufgabenstände abrufen. State und Routing halten den Ablauf zusammen und bestimmen den nächsten Schritt.

## Prüfen

Quellen, Tool-Aufrufe und Zustandswechsel müssen nachvollziehbar bleiben. Tests prüfen typische Fälle und Fehlerpfade; Berechtigungen begrenzen, was ein Agent ausführen darf.

> [!NOTE] Hinweis zur Entstehung<br>
> Bei der Erstellung dieser Unterlagen wurden KI-Werkzeuge unterstützend eingesetzt, unter anderem für Recherche, Strukturierung, Formulierung und einzelne Medien. Die Inhalte wurden anschließend fachlich geprüft, eingeordnet und redaktionell überarbeitet.

---

**Version:** 1.3<br>
**Stand:** November 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
