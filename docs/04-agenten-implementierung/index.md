---
layout: default
title: Agenten-Implementierung
nav_order: 6
has_children: true
description: "Architektur, Prompting, Tool Use, Kontext, RAG, State, Memory und Human-in-the-Loop"
---

# Agenten-Implementierung

Diese Orientierungsseite beschreibt die fachlichen und technischen Bausteine eines Agentensystems unabhängig vom konkreten Framework. Die Dokumente sind in drei Sidebar-Gruppen gegliedert und führen von Entwurf über Kontextarbeit bis zu kontrollierbaren Abläufen.

| Frage | Dokument | Bezug |
|---|---|---|
| **Wie** wird ein Agent grundlegend entworfen? | [Entwurf]({{ '/04-agenten-implementierung/entwurf.html' | relative_url }}) | Architekturen, Prompting, Prompt-Templates und Tool Use. |
| **Wie** arbeitet ein Agent mit Kontext und Wissen? | [Kontext & Wissen]({{ '/04-agenten-implementierung/kontext-wissen.html' | relative_url }}) | Context Engineering, Tokenizing, Chunking, Embeddings und RAG. |
| **Wie** bleiben Abläufe kontrollierbar? | [Ablauf & Zustand]({{ '/04-agenten-implementierung/ablauf-zustand.html' | relative_url }}) | State Management, Checkpointing, Memory und Human-in-the-Loop. |
