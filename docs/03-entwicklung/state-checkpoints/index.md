---
layout: default
title: "State & Checkpoints"
parent: "Entwicklung"
nav_order: 5
has_children: true
has_toc: false
description: "State Management, Checkpoints, Persistenz, Memory und menschliche Freigaben"
redirect_from: ["/04-agenten-implementierung/ablauf-zustand/"]
---

# State & Checkpoints

Ein nachvollziehbarer Zustand hält die Arbeitsdaten eines Agenten zusammen. Checkpoints speichern den Lauf; Memory und menschliche Freigaben ergänzen die Zustandsführung. Die Gestaltung der Schleife behandelt der benachbarte Bereich [Loop Engineering]({{ '/03-entwicklung/loop-engineering.html' | relative_url }}).

| Thema | Einstieg |
|---|---|
| [State Management]({{ '/03-entwicklung/state-checkpoints/state-management.html' | relative_url }}) | Zustandsfelder und Übergänge festlegen. |
| [Checkpointing & Persistenz]({{ '/03-entwicklung/state-checkpoints/checkpointing-persistenz.html' | relative_url }}) | Läufe speichern und fortsetzen. |
| [Memory-Systeme]({{ '/03-entwicklung/state-checkpoints/memory-systeme.html' | relative_url }}) | Informationen innerhalb und zwischen Sitzungen behalten. |
| [Human-in-the-Loop]({{ '/03-entwicklung/state-checkpoints/human-in-the-loop.html' | relative_url }}) | Freigaben, Unterbrechungen und Korrekturen einbinden. |

**Ausprobieren:** [Loop Engineering]({{ '/visualisierungen/agent_patterns_lab/#loops' | relative_url }}) und [State & Checkpoints]({{ '/visualisierungen/agent_patterns_lab/#checkpoints' | relative_url }}) im Agent Lab.
