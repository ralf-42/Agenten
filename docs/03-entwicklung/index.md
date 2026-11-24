---
layout: default
title: "Entwicklung"
nav_order: 3
has_children: true
description: "Modelle, Prompts, Tools, Kontext, Loops, State und Memory"
has_toc: false
redirect_from: ["/04-agenten-implementierung/"]
---

# Entwicklung

Ein Agentensystem entsteht aus Modellzugriff, Anweisungen, Werkzeugen, Kontext und einem kontrollierten Ablauf. Die folgenden Bereiche erklären diese Bausteine unabhängig vom verwendeten Framework.

| Thema | Einstieg |
|---|---|
| [Modelle & Zugang]({{ '/03-entwicklung/modelle-zugang/' | relative_url }}) | Modell auswählen, Provider anbinden und Modellanpassungen einordnen. |
| [Prompts & Werkzeuge]({{ '/03-entwicklung/prompts-werkzeuge/' | relative_url }}) | Anweisungen formulieren, Tools einbinden und Skills wiederverwenden. |
| [Kontext & Wissen]({{ '/03-entwicklung/kontext-wissen/' | relative_url }}) | Kontext aufbereiten, Dokumente erschließen und Wissen abrufen. |
| [Loop Engineering]({{ '/03-entwicklung/loop-engineering.html' | relative_url }}) | Schleifen mit Abbruchbedingungen, Prüfungen und Eskalation gestalten. |
| [State & Checkpoints]({{ '/03-entwicklung/state-checkpoints/' | relative_url }}) | Zustände, Persistenz, Erinnerung und Freigaben gestalten. |
| [Checkliste Agentensystem]({{ '/03-entwicklung/checkliste-agentensystem.html' | relative_url }}) | Entwurf und Umsetzung anhand gemeinsamer Prüfpunkte durchgehen. |

**Weiterführend:** Die [Framework-Guides]({{ '/04-frameworks/' | relative_url }}) zeigen die konkrete Umsetzung mit LangChain, LangGraph und weiteren Werkzeugen.
