---
layout: default
title: LangGraph
parent: Frameworks
nav_order: 3
has_children: true
description: "LangGraph-Einstieg und Best Practices"
redirect_from: ["/05-frameworks/langgraph.html"]
has_toc: false
---

# LangGraph
{: .no_toc }

Diese Orientierungsseite bündelt die LangGraph-Dokumente: StateGraph-Grundlagen, Routing, State, Checkpointing und robuste Graph-Patterns.

## Themen

| Thema | Inhalt |
|---|---|
| [Einsteiger LangGraph]({{ '/04-frameworks/langgraph/einsteiger-langgraph.html' | relative_url }}) | *Wie starte ich mit LangGraph?* Nodes, Edges, Routing und erste StateGraph-Workflows. |
| [Graphen mit LangGraph aufbauen]({{ '/04-frameworks/langgraph/graphen-aufbauen.html' | relative_url }}) | *Wie baue ich Nodes und Edges sauber auf?* Bauplan, Conditional Maps, Rückkanten und Abbruchschutz. |
| [LangGraph Best Practices]({{ '/04-frameworks/langgraph/langgraph-best-practices.html' | relative_url }}) | *Welche Patterns halten Graphen wartbar?* StateGraph, Conditional Routing, Checkpointing und HITL. |
| [Cheatsheet]({{ '/04-frameworks/langchain-langgraph-cheatsheet.html' | relative_url }}) | *Welche Code-Bausteine brauche ich schnell im Notebook?* State, Routing, Tool-Loop, Checkpointing, Memory, HITL und LangSmith. |

## Weiterführend

Die [Framework-Übersicht]({{ '/04-frameworks/' | relative_url }}) ordnet die Werkzeuge ein. [State & Checkpoints]({{ '/03-entwicklung/state-checkpoints/' | relative_url }}) erklärt die fachlichen Grundlagen; das [Agent Lab]({{ '/visualisierungen/agent_patterns_lab/#checkpoints' | relative_url }}){:target="_blank" rel="noopener"} macht den Ablauf sichtbar.
