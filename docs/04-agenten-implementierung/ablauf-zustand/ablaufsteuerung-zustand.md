---
layout: default
title: Ablaufsteuerung & Zustand
parent: Ablauf & Zustand
grand_parent: Agenten-Implementierung
nav_order: 1
description: "State Management, Checkpointing, Memory und Human-in-the-Loop"
---

# Ablaufsteuerung & Zustand

Diese Orientierungsseite behandelt die Kontrolle mehrstufiger Agentenläufe: Zustand, Persistenz, Memory und menschliche Eingriffe.

| Frage | Dokument | Bezug |
|---|---|---|
| **Wie** werden Abläufe kontrolliert? | [State Management]({{ '/04-agenten-implementierung/ablauf-zustand/state-management.html' | relative_url }}) | Zustand, Nachrichten, Routing und mehrstufige Verarbeitung. |
| **Wie** bleiben Läufe wiederaufnehmbar? | [Checkpointing & Persistenz]({{ '/04-agenten-implementierung/ablauf-zustand/checkpointing-persistenz.html' | relative_url }}) | Speichern, Fortsetzen und Wiederaufnehmen von Agentenläufen. |
| **Was** sollte ein Agent erinnern? | [Memory-Systeme]({{ '/04-agenten-implementierung/ablauf-zustand/memory-systeme.html' | relative_url }}) | Kurzzeitgedächtnis, Langzeitgedächtnis und nutzerspezifische Persistenz. |
| **Wann** muss ein Mensch eingreifen? | [Human-in-the-Loop]({{ '/04-agenten-implementierung/ablauf-zustand/human-in-the-loop.html' | relative_url }}) | Freigaben, Rückfragen, Eskalationen und kontrollierte Unterbrechungen. |
