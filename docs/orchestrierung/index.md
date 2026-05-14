---
layout: default
title: Orchestrierung
nav_order: 6
has_children: true
description: State Management, LangGraph und steuerbare mehrstufige Agentenabläufe
---

# Orchestrierung, State und LangGraph

Sobald Agenten mehrere Schritte durchlaufen, werden State, Routing und kontrollierte Ausführung entscheidend. Dieser Bereich konzentriert sich auf Orchestrierung und LangGraph als Grundlage für robuste Agentenabläufe.

| Frage | Dokument | Bezug |
|---|---|---|
| **Was** muss ein Agent zwischen Schritten behalten? | [State Management]({{ '/orchestrierung/state-management.html' | relative_url }}) | Zustand, Nachrichten, Zwischenergebnisse und Kontrollvariablen in mehrstufigen Abläufen. |
| **Wie** wird ein Agent als Graph modelliert? | [Einsteiger LangGraph]({{ '/orchestrierung/einsteiger-langgraph.html' | relative_url }}) | Nodes, Edges, Routing, Bedingungen und erste LangGraph-Workflows. |
| **Wie** bleiben Graphen wartbar und kontrollierbar? | [LangGraph Best Practices]({{ '/orchestrierung/langgraph-best-practices.html' | relative_url }}) | Patterns für StateGraph, Conditional Routing, Checkpointing und Human-in-the-Loop. |





