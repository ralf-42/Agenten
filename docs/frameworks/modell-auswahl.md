---
layout: default
title: Modell-Auswahl
parent: Frameworks
nav_order: 2
has_children: true
description: "Modell- und Provider-Auswahl: Designregeln, Kosten, Latenz und rollenbasiertes Mapping"
---

# Modell-Auswahl

**Version:** 1.0<br>
**Stand:** Mai 2026<br>
**Kurs:** KI-Agenten

Modellauswahl ist selten nur eine Qualitätsfrage. Häufiger geht es um Kosten, Latenz, Modalitäten und die Frage, ob ein stärkeres Modell den Mehraufwand überhaupt rechtfertigt.

- **[Modell-Auswahl Guide](modell-auswahl/modell-auswahl-guide.html)** – *Welches Modell für welche Aufgabe?* Designregeln: Router/Supervisor → `o3`, Worker → `gpt-5.4-mini`, Demos → `gpt-5.4-nano`.
- **[Provider-Modell-Mapping](modell-auswahl/provider-modell-mapping.html)** – *Wie bilde ich Modellrollen auf verschiedene Provider ab?* Rollenbasiertes Mapping für OpenAI, Mistral und Anthropic.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Einsteiger-Guides](einsteiger-guides.html) | Wo starte ich als Einsteiger mit Modell-Auswahl? |
| [Best Practices](best-practices.html) | Welche Produktionsstandards gelten für Modell-Auswahl? |
