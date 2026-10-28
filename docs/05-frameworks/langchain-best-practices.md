---
layout: default
title: LangChain Best Practices
parent: LangChain
grand_parent: Frameworks
nav_order: 2
description: Kompakte Muster für Modellaufrufe, strukturierte Ausgaben, Tools, Agents und robuste Chains
has_toc: true
---

# LangChain Best Practices
{: .no_toc }

> Dieser Leitfaden bündelt die bevorzugten LangChain-Muster für Kursnotebooks und Module.

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Einordnung

LangChain eignet sich für Modellaufrufe, Chains und Agenten mit einem klar begrenzten Aufgabenbereich. Für explizite Zustandsübergänge, komplexes Routing und längere Workflows wird LangGraph eingesetzt.

| Aufgabe | Passendes Muster |
|---|---|
| Chatmodell initialisieren | `init_chat_model()` |
| Ausgabe an ein Schema binden | `with_structured_output()` |
| Tool definieren | `@tool` |
| Tool-fähigen Agenten erstellen | `create_agent()` |
| Lineare Verarbeitung verbinden | LCEL mit `|` |
| Laufzeitverhalten eines Agents steuern | Middleware |
| Vorübergehende Fehler abfangen | `with_retry()` und `with_fallbacks()` |

---

## Modell initialisieren

`init_chat_model()` bietet eine einheitliche Schnittstelle zu unterstützten Chatmodell-Providern. Die Schreibweise `provider:model` hält die Auswahl im Aufruf sichtbar.

~~~python
from langchain.chat_models import init_chat_model

llm = init_chat_model("openai:gpt-5.6-luna")
~~~

Provider-spezifische Parameter lassen sich bei der Initialisierung ergänzen:

~~~python
llm = init_chat_model(
    "openai:gpt-5.6-luna",
    max_tokens=1_000,
)
~~~

---

## Strukturierte Ausgaben

Mit `with_structured_output()` erhält die Anwendung ein Ergebnis, das an ein Pydantic-Schema gebunden ist.

~~~python
from pydantic import BaseModel, Field

class AnswerResult(BaseModel):
    """Eine knappe, nachvollziehbare Antwort."""

    answer: str = Field(description="Antwort auf die Frage")
    confidence: float = Field(ge=0, le=1, description="Einschätzung zwischen 0 und 1")

structured_llm = llm.with_structured_output(AnswerResult)
result = structured_llm.invoke("Nenne die Hauptstadt von Frankreich.")
~~~

Für Agenten kann das Schema direkt über `response_format` angegeben werden. Die strukturierte Antwort steht im Ergebnis unter `structured_response`.

~~~python
from langchain.agents import create_agent

agent = create_agent(
    model=llm,
    tools=[],
    response_format=AnswerResult,
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "Nenne die Hauptstadt von Frankreich."}]
})
answer = result["structured_response"]
~~~

---

## Tools und Agents

Tools sind typisierte Funktionen mit einer präzisen Beschreibung. Die Funktionssignatur bildet das Eingabeschema; der Docstring erklärt dem Modell, wann das Tool passt.

~~~python
from langchain.tools import tool

@tool
def get_order_status(order_id: str) -> str:
    """Liefert den Bearbeitungsstand einer Bestellung."""
    return f"Bestellung {order_id}: in Bearbeitung"
~~~

Ein Agent verbindet Modell, Tools und Systemanweisung zu einem Werkzeug-Loop.

~~~python
from langchain.agents import create_agent

agent = create_agent(
    model=llm,
    tools=[get_order_status],
    system_prompt="Beantworte Bestellfragen mithilfe des passenden Tools.",
)

result = agent.invoke({
    "messages": [
        {"role": "user", "content": "Wie ist der Stand der Bestellung A-1042?"}
    ]
})
antwort = result["messages"][-1].content
~~~

---

## Chains mit LCEL

LCEL verbindet Prompt, Modell und Parser über den Pipe-Operator. Jeder Schritt bleibt separat erkennbar und kann einzeln aufgerufen werden.

~~~python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate.from_template(
    "Fasse den folgenden Text in zwei Sätzen zusammen:\n{document}"
)

summary_chain = prompt | llm | StrOutputParser()
summary = summary_chain.invoke({
    "document": "LangChain verbindet Prompts, Modelle und Parser zu einer Chain."
})
~~~

---

## Middleware für Agenten

Middleware ergänzt einen Agenten um kontrollierte Schritte während seiner Ausführung. Human-in-the-Loop pausiert Tool-Aufrufe zur Freigabe; SummarizationMiddleware fasst längere Verläufe anhand eines konfigurierten Triggers zusammen.

~~~python
from langchain.agents import create_agent
from langchain.agents.middleware import (
    HumanInTheLoopMiddleware,
    SummarizationMiddleware,
)

agent = create_agent(
    model=llm,
    tools=[get_order_status],
    middleware=[
        HumanInTheLoopMiddleware(
            interrupt_on={"get_order_status": True}
        ),
        SummarizationMiddleware(
            model=llm,
            trigger=("messages", 20),
        ),
    ],
)
~~~

Für wiederaufnehmbare Freigaben wird der Agent mit einem Checkpointer ausgeführt. Tool-Namen in `interrupt_on` entsprechen den Namen der registrierten Tools.

---

## Multimodale Nachrichten

Standardisierte Content Blocks halten Nachrichten unabhängig vom jeweiligen Provider lesbar.

~~~python
from langchain_core.messages import HumanMessage

message = HumanMessage(content=[
    {"type": "text", "text": "Beschreibe dieses Bild."},
    {"type": "image", "url": "https://example.com/bild.png"},
])

response = llm.invoke([message])
~~~

Weitere Content-Block-Typen und Provider-Einschränkungen stehen in der Modell- und Integrationsdokumentation.

---

## Robuste Ausführung

Wiederholungen eignen sich für vorübergehende Fehler. Ein Fallback-Modell übernimmt, wenn die primäre Ausführung nach den Wiederholungen weiterhin fehlschlägt.

~~~python
primary_llm = init_chat_model("openai:gpt-5.6-luna")
fallback_llm = init_chat_model("anthropic:claude-sonnet-4-6")

robust_llm = primary_llm.with_retry(
    retry_if_exception_type=(TimeoutError, ConnectionError),
    stop_after_attempt=3,
).with_fallbacks([fallback_llm])
~~~

Die Fehlerklassen und Wiederholungszahl sollten zum jeweiligen Provider und zur Aufgabe passen. Bei strukturierten Antworten sollte auch das Fallback dasselbe Schema unterstützen.

---

## Praxischeck

- Modell über `init_chat_model()` auswählen und Provider-Parameter bewusst setzen.
- Strukturierte Ergebnisse über ein Pydantic-Schema beschreiben.
- Tools mit Typannotationen und aussagekräftigen Docstrings definieren.
- Agenten mit den benötigten Tools und einer klaren Systemanweisung erstellen.
- Kontrollfluss, Freigaben und Zusammenfassungen durch passende Middleware abbilden.
- Chains mit LCEL zusammensetzen und Fehlerbehandlung an der Aufrufgrenze festlegen.
- Reale Beispiele mit Tracing und Evaluation nachvollziehbar auswerten.

---

## Weiterführende Ressourcen

- [LangChain: Models](https://docs.langchain.com/oss/python/langchain/models)
- [LangChain: Agents](https://docs.langchain.com/oss/python/langchain/agents)
- [LangChain: Structured output](https://docs.langchain.com/oss/python/langchain/structured-output)
- [LangChain: Tools](https://docs.langchain.com/oss/python/langchain/tools)
- [LangChain: Middleware](https://docs.langchain.com/oss/python/langchain/middleware/overview)
- [LangGraph Best Practices](langgraph-best-practices.html)
- [LangSmith Best Practices](langsmith-best-practices.html)

---

**Version:** 2.0<br>
**Stand:** Oktober 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
