---
layout: default
title: LangSmith Best Practices
parent: LangSmith
grand_parent: Frameworks
nav_order: 2
description: "Tracing, Evaluation und Prompt-Verwaltung mit LangSmith"
has_toc: true
---

# LangSmith Best Practices

LangSmith macht Ausführungen von LangChain- und LangGraph-Anwendungen nachvollziehbar. Traces zeigen einzelne Modell- und Tool-Schritte; Datasets und Evaluatoren helfen, Änderungen systematisch zu beurteilen.

---

## Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Tracing einrichten

Wähle, ob alle unterstützten Aufrufe oder nur einzelne Referenzläufe erfasst werden sollen. Lege API-Schlüssel im Secret Store oder in der lokalen Umgebung ab.

### Globales Tracing

Mit true werden unterstützte LangChain- und LangGraph-Aufrufe erfasst.

~~~python
import os

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_PROJECT"] = "m05_multi_tool_agents"
# LANGSMITH_API_KEY aus einer sicheren Umgebungsvariable laden
~~~

Für Accounts außerhalb der US-Region wird zusätzlich der passende LANGSMITH_ENDPOINT gesetzt. Für EU-Accounts lautet er https://eu.api.smith.langchain.com. Die Konfiguration sollte vor den ersten Modell- oder Agent-Aufrufen verfügbar sein.

### Selektives Tracing

Mit false bleibt das globale Tracing aus. tracing_context aktiviert nur den umschlossenen Lauf.

~~~python
import os
from langsmith import tracing_context

os.environ["LANGSMITH_TRACING"] = "false"
os.environ["LANGSMITH_PROJECT"] = "m05_multi_tool_agents"

with tracing_context(enabled=True):
    result = agent.invoke({"messages": [...]})
~~~

Im Trace lassen sich Eingaben, Ausgaben, verschachtelte Runs, Laufzeiten und Fehlermeldungen untersuchen.

## Namen und Run-Konfiguration

Projekt-, Run-, Experiment-, Dataset- und Prompt-Namen folgen im Kurs dem Muster m##_snake_case. Verwende die Modul-ID des jeweiligen Notebooks. Tags und Metadaten ergänzen fachliche Filter.

~~~python
run_config = {
    "run_name": "m05_support_agent_trace",
    "tags": ["support", "demo"],
    "metadata": {"module": "m05"},
}

result = agent.invoke(
    {"messages": [{"role": "user", "content": "Wie ist der Status meiner Anfrage?"}]},
    config=run_config,
)
~~~

Der Wert von LANGSMITH_PROJECT benennt das Zielprojekt, zum Beispiel m05_multi_tool_agents. Verwende denselben Namen auch dann, wenn ein Notebook mit show_trace(...) auf das Projekt verweist.

## Traces verantwortungsvoll nutzen

Prüfe im Trace den Ablauf vom Eingang bis zur Antwort: Prompt, Modellaufrufe, Tool-Eingaben und -Ergebnisse sowie Laufzeit. Das macht Fehlerfälle nachvollziehbar und zeigt, an welcher Stelle eine Änderung die Qualität oder Geschwindigkeit beeinflusst.

Vor dem Erfassen produktiver Daten sind Datenschutz und Zugriffsrechte festzulegen. Entferne oder maskiere personenbezogene und vertrauliche Inhalte, wenn sie für die Analyse nicht benötigt werden. Tags und Metadaten sollten keine sensiblen Werte enthalten.

## Evaluation mit Datasets

Ein Dataset hält repräsentative Eingaben und, wenn verfügbar, Referenzantworten oder erwartete Aktionen fest. Offline-Evaluationen vergleichen Änderungen vor einer Bereitstellung; Online-Evaluationen beobachten ausgewählte Produktionsläufe.

Ein schlanker Ablauf:

1. Typische und wichtige Grenzfälle als Dataset-Beispiele sammeln.
2. Passende Kriterien festlegen, etwa Korrektheit, Quellenbezug oder erwartete Tool-Aufrufe.
3. Eine Baseline ausführen und Ergebnisse speichern.
4. Änderungen mit denselben Beispielen und Kriterien vergleichen.
5. Aus Produktionsbeobachtungen neue, geprüfte Beispiele ergänzen.

Der Evaluator richtet sich nach der Aufgabe: Regeln eignen sich für überprüfbare Formate und Aktionen; ein LLM-as-judge kann semantische Qualität beurteilen. Ergebnisse sollten zusammen mit dem Dataset und der verwendeten Experimentbezeichnung nachvollziehbar bleiben.

## Prompts verwalten

LangSmith kann Prompts versionieren und über Umgebungen wie Staging und Production bereitstellen. Benenne Prompts nach dem Kursmuster m##_snake_case, prüfe Änderungen mit repräsentativen Beispielen und ordne eine geprüfte Version der passenden Umgebung zu.

## Praxischeck

- Projekt-, Run- und Dataset-Namen folgen m##_snake_case.
- API-Schlüssel kommen aus einer sicheren Umgebung.
- Projekte trennen Module und unterschiedliche Auswertungszwecke.
- Traces enthalten nur Daten, die für Beobachtung und Fehlersuche erforderlich sind.
- Datasets decken typische Eingaben und relevante Grenzfälle ab.
- Vergleiche verwenden dieselben Beispiele und klar beschriebene Kriterien.
- Prompt-Versionen werden geprüft und einer Umgebung zugeordnet.

## Weiterführende Ressourcen

- [LangSmith: Tracing mit LangChain](https://docs.langchain.com/langsmith/trace-with-langchain)
- [LangSmith: Evaluationstypen](https://docs.langchain.com/langsmith/evaluation-types)
- [LangSmith: Prompts verwalten](https://docs.langchain.com/langsmith/manage-prompts)
- [LangSmith Python SDK](https://github.com/langchain-ai/langsmith-sdk)
- [LangChain Best Practices](./langchain-best-practices.html)
- [LangGraph Best Practices](./langgraph-best-practices.html)
- [Vom Modell zur Anwendung](../08-deployment-betrieb/vom-modell-zum-produkt-langchain-oekosystem.html)

---

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [LangChain Best Practices](langchain-best-practices.html) | Wie werden Modelle, Tools und Agenten aufgebaut? |
| [LangGraph Best Practices](langgraph-best-practices.html) | Wie wird der Kontrollfluss eines zustandsbehafteten Workflows definiert? |

---

**Version:** 2.0<br>
**Stand:** Oktober 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
