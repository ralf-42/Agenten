---
layout: default
title: "Qualität & Sicherheit"
nav_order: 5
has_children: true
description: "Evaluation, Observability und Sicherheit für KI-Agenten"
has_toc: false
redirect_from: ["/07-qualitaet-sicherheit/"]
---

# Qualität & Sicherheit
{: .no_toc }

Diese Orientierungsseite macht Agenten messbar, beobachtbar und kontrollierbar. Im Mittelpunkt stehen Evaluation, Sicherheitsgrenzen und produktionsnahe Qualitätsarbeit. Konkrete LangSmith-Anleitungen liegen im Bereich [Frameworks]({{ '/04-frameworks/' | relative_url }}).

## Themen

| Thema | Inhalt |
|---|---|
| [Agent Harness]({{ '/05-qualitaet-sicherheit/agent-harness.html' | relative_url }}) | *Welche Kontrollschicht verbindet State, Tools, Kontext, Sicherheit und Evaluation?* Architektur- und Review-Modell für kontrollierbare Agentenläufe. |
| [Evaluation & Observability]({{ '/05-qualitaet-sicherheit/evaluation-observability.html' | relative_url }}) | *Woran erkennt man gute Ergebnisse und wie werden Evaluationen belastbar?* Metriken, Testsets, Baselines, Regressionen, Fehlersuche und Produktionssicht. |
| [Agenten-Sicherheit]({{ '/05-qualitaet-sicherheit/agent-security.html' | relative_url }}) | *Wie werden Agenten abgesichert?* Prompt Injection, Tool-Rechte, Least Privilege und Vertrauensgrenzen. |
| [Checkliste Agentensystem]({{ '/03-entwicklung/checkliste-agentensystem.html' | relative_url }}) | *Was muss vor Review oder Freigabe geprüft werden?* Querschnittscheck für Architektur, Tools, Kontext, Evaluation, Observability, Sicherheit und Betrieb. |

## Weiterführend

Die Reiter [Agent Harness]({{ '/visualisierungen/agent_patterns_lab/#harness' | relative_url }}) und [Evaluation]({{ '/visualisierungen/agent_patterns_lab/#evaluation' | relative_url }}) im Agent Lab ergänzen die Fachartikel. Die technische Umsetzung behandelt [LangSmith]({{ '/04-frameworks/langsmith/' | relative_url }}).
