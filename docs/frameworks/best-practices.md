---
layout: default
title: Best Practices
parent: Frameworks
nav_order: 3
has_children: true
description: "Empfohlene Patterns und Anti-Patterns für LangChain, LangGraph, LangSmith und Agenten-Evaluation"
---

# Best Practices

**Version:** 1.0<br>
**Stand:** Mai 2026<br>
**Kurs:** KI-Agenten

Empfohlene Patterns und Anti-Patterns für die im Kurs zentralen Frameworks.

- **[LangChain Best Practices](best-practices/langchain-best-practices.html)** – *Was sind die 7 MUST-HAVE Features?* `init_chat_model()`, `with_structured_output()`, `@tool`, `create_agent()`, LCEL `|` Chains, Middleware, Standard Content Blocks.
- **[LangGraph Best Practices](best-practices/langgraph-best-practices.html)** – *Wann LangGraph statt `create_agent()`?* StateGraph, Nodes & Edges, Conditional Routing, Checkpointing, Human-in-the-Loop.
- **[LangSmith Best Practices](best-practices/langsmith-best-practices.html)** – *Wie observiere ich Agenten richtig?* `LANGSMITH_*` Umgebungsvariablen, `.with_config()`, Troubleshooting.
- **[Agent Evaluation & Observability Best Practices](best-practices/agent-evaluation-observability-best-practices.html)** – *Wie werden Agenten mit Baselines, Traces und Regressionen belastbar?*

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Einsteiger-Guides](einsteiger-guides.html) | Wo starte ich als Einsteiger mit Best Practices? |
| [Best Practices](best-practices.html) | Welche Produktionsstandards gelten für Best Practices? |
