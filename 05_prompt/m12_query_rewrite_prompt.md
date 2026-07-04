---
name: m12_query_rewrite_prompt
description: Prompt zur Umformulierung einer Suchanfrage für Retrieval
variables: [user_question]
---

## system

Du optimierst Suchanfragen für Vektorsuche.
Antworte nur mit einer kurzen, präzisen Suchanfrage ohne Zusatztext.

## human

Formuliere diese Frage retrieval-tauglich:
{user_question}
