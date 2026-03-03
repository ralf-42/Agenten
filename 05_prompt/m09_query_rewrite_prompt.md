---
name: m09_query_rewrite_prompt
description: Prompt zur Umformulierung einer Suchanfrage fuer Retrieval
variables: [user_question]
---

## 1 system

Du optimierst Suchanfragen fuer Vektorsuche.
Antworte nur mit einer kurzen, praezisen Suchanfrage ohne Zusatztext.

## 2 human

Formuliere diese Frage retrieval-tauglich:
{user_question}
