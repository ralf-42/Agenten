---
layout: default
title: Ablauf & Zustand
parent: Agenten-Implementierung
nav_order: 3
has_children: true
description: "State Management, Checkpointing, Memory und Human-in-the-Loop"
---

# Ablauf & Zustand

Diese Orientierungsseite behandelt die Kontrolle mehrstufiger Agentenläufe: Zustand, Persistenz, Memory und menschliche Eingriffe.

| Frage | Dokument | Bezug |
|---|---|---|
| **Wie** werden Abläufe kontrolliert? | [State Management]({{ '/04-agenten-implementierung/state-management.html' | relative_url }}) | Zustand, Nachrichten, Routing und mehrstufige Verarbeitung. |
| **Wie** bleiben Läufe wiederaufnehmbar? | [Checkpointing & Persistenz]({{ '/04-agenten-implementierung/checkpointing-persistenz.html' | relative_url }}) | Speichern, Fortsetzen und Wiederaufnehmen von Agentenläufen. |
| **Was** sollte ein Agent erinnern? | [Memory-Systeme]({{ '/04-agenten-implementierung/memory-systeme.html' | relative_url }}) | Kurzzeitgedächtnis, Langzeitgedächtnis und nutzerspezifische Persistenz. |
| **Wann** muss ein Mensch eingreifen? | [Human-in-the-Loop]({{ '/04-agenten-implementierung/human-in-the-loop.html' | relative_url }}) | Freigaben, Rückfragen, Eskalationen und kontrollierte Unterbrechungen. |
