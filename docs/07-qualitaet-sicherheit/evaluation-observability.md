---
layout: default
title: Evaluation & Observability
parent: "Qualität & Sicherheit"
nav_order: 1
description: Bewertung, Qualitätssicherung und Observability von KI-Agenten
has_toc: true
---

# Evaluation & Observability
{: .no_toc }

> [!NOTE] Kernfrage<br>
> Wie wird sichtbar, ob ein Agent fachlich gut arbeitet und warum Ergebnisse kippen?

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Evaluation und Observability: der Unterschied

Evaluation beantwortet die Frage, ob ein Agent unter definierten Bedingungen gute Ergebnisse liefert. Observability beantwortet die Anschlussfrage, warum ein Ergebnis gut, schlecht, teuer oder instabil war. Beides gehört zusammen: Ohne Evaluation fehlt ein belastbarer Maßstab, ohne Observability bleibt unklar, an welcher Stelle der Fehler entstanden ist.

Für Entwickler wirkt beides zunächst ähnlich, weil in beiden Fällen Logs, Antworten und Metriken betrachtet werden. Der Unterschied liegt im Zweck. Evaluation vergleicht erwartetes Verhalten mit tatsächlichem Verhalten. Observability sammelt die Spuren, die diesen Vergleich erklärbar machen.

Typischer Fehler: Nur auf Uptime, Antwortzeit und Statuscodes zu schauen. Ein Agent kann technisch gesund wirken und fachlich seit Tagen falsche Antworten geben.

```mermaid
flowchart TD
    A["<b>Evaluation</b><br>War das Ergebnis gut?"] --> B["<b>Observability</b><br>Warum kam es dazu?"]
    B --> C["<b>Verbesserung</b><br>Prompt, Tool, State<br>oder Policy anpassen"]
    C -- "Optimierter Re-Run" --> A
    
    %% Optisches Highlight für den Loop
    
    style A fill:#f9f9f9,stroke:#01579b,stroke-width:2px 
    style B fill:#e1f5fe,stroke:#01579b,stroke-width:2px 
    style C fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
```

## Das Silent-Failure-Problem

Klassische Software scheitert oft laut: Exceptions, Fehlermeldungen, rote Dashboards. Agentensysteme scheitern häufig leise. Eine Anfrage endet mit HTTP 200, die Laufzeit sieht sauber aus, der Container lebt weiter, und trotzdem wird eine Rückgabe falsch priorisiert, ein ungeeignetes Tool gewählt oder eine Halluzination mit großer Sicherheit formuliert.

Genau hier beginnt Observability für Agenten. Nicht die Frage, ob das System läuft, steht im Mittelpunkt, sondern ob es fachlich das Richtige tut. Das Qualitätssignal liegt im Gespräch, in den Zwischenschritten und in der Nutzung von Tools oder Kontext. Infrastruktur-Monitoring bleibt nötig, reicht aber nicht aus.

In Trainings zeigt sich oft derselbe erste Irrtum: Wenn keine Exception auftritt, wird ein Durchlauf als erfolgreich gewertet. Für Agenten ist diese Gleichsetzung zu grob.

## Ein einfaches Kursbeispiel

Ein Support-Agent soll drei häufige Aufgaben lösen: Lieferstatus nennen, Rechnung erneut senden und Öffnungszeiten beantworten. Für einen Einsteigerkurs reicht dieses kleine Szenario, um Evaluation und Observability konkret zu machen.

Die Evaluation kann mit wenigen Testfällen beginnen. Für jede Anfrage wird festgelegt, was als gute Antwort gilt. Das kann eine exakte Lösung sein, eine erlaubte Liste von Schlüsselinformationen oder ein korrekt ausgelöstes Tool.

```python
examples = [
    {
        "inputs": {"question": "Wo ist meine Bestellung 4711?"},
        "outputs": {"tool_used": "track_order", "must_include": ["unterwegs"]},
    },
    {
        "inputs": {"question": "Bitte schick mir die Rechnung noch einmal."},
        "outputs": {"tool_used": "send_invoice", "must_include": ["E-Mail"]},
    },
    {
        "inputs": {"question": "Habt ihr am Samstag geöffnet?"},
        "outputs": {"must_include": ["Samstag", "9 bis 14 Uhr"]},
    },
]
```

Observability ergänzt dieses kleine Evaluationsset um die Spuren pro Anfrage: Welcher Prompt wurde gebaut, welches Tool wurde gewählt, welche Parameter wurden übergeben, wie viele Schritte waren nötig und an welcher Stelle stieg der Token-Verbrauch. Erst diese Sicht macht verständlich, warum zwei Antworten ähnlich klingen, aber nur eine davon belastbar ist.

## Welche Beobachtungsdaten wirklich helfen

Für einen Agenten reichen einige wenige Datentypen, um die meisten Fehler sichtbar zu machen. Am wichtigsten sind vollständige Prompt-Antwort-Paare, die Schrittfolge des Agenten, Kosten- und Tokenwerte pro Durchlauf sowie das Verhalten der Tool-Aufrufe. Diese vier Ebenen decken viele Probleme auf, die in klassischem Monitoring unsichtbar bleiben.

```mermaid
flowchart TB
    L1["1. Prompt und Antwort\nFrage, Kontext, Systeminstruktion, Ausgabe"]
    L2["2. Schrittfolge\nReasoning, Retrieval, Tool Calls, Zwischenergebnisse"]
    L3["3. Kosten und Token\npro Session und pro Schritt"]
    L4["4. Tool-Verhalten\nToolwahl, Parameter, Wiederholungen, Fehler"]

    L1 --> L2 --> L3 --> L4
```

Wer nur die fertige Antwort speichert, sieht häufig nur das Symptom. Wer auch Trajectory und Tool-Verhalten speichert, erkennt meist die eigentliche Ursache: falsches Tool, leerer Retrieval-Kontext, unnötige Schleife oder ein Prompt, der dem Modell zu viel Spielraum lässt.

> [!NOTE] Vier Signale mit hohem Nutzen<br>
> Für einen Kurseinstieg genügen meist diese vier Beobachtungsebenen. Mehr Telemetrie hilft nur dann, wenn daraus auch Entscheidungen für Prompt, Tooling oder Datenbasis abgeleitet werden.

## Was Evaluation konkret misst

Evaluation braucht einen klaren Soll-Ist-Vergleich. Bei Agenten betrifft dieser Vergleich nicht nur den finalen Antworttext, sondern oft auch den Weg dorthin. Ein Agent kann eine inhaltlich brauchbare Antwort liefern und dabei dennoch das falsche Tool verwenden, unnötig teuer arbeiten oder bei leicht veränderten Formulierungen sofort kippen.

Sinnvoll ist deshalb eine Staffelung in drei Ebenen. Auf Komponentenebene wird geprüft, ob einzelne Bausteine sauber arbeiten, etwa Tool-Auswahl, Tool-Parameter, strukturierte Ausgaben oder ein Retriever. Auf Workflow-Ebene zählt, ob die Aufgabe End-to-End gelöst wird. Auf Nutzerebene wird sichtbar, ob das Ergebnis im echten Einsatz tatsächlich hilft.

Grenze: Nicht jede gute Agentenantwort lässt sich mit einer einzigen Kennzahl bewerten. Gerade bei offenen Formulierungen braucht Evaluation mehrere Kriterien gleichzeitig.

## Welche Metriken für Entwickler zuerst genügen

Für den Einstieg ist keine Metrik-Bibliothek nötig. Meist reichen vier Fragen: War die Antwort fachlich korrekt, wurde das richtige Tool verwendet, wie lange dauerte der Durchlauf und wie hoch waren die Kosten. Damit entsteht bereits ein belastbares Grundbild.

Eine einfache Tool-Accuracy lässt sich fast ohne Infrastruktur berechnen:

```python
expected_tool = "track_order"
actual_tool = agent_response.tool_calls[0].name

tool_accuracy = 1.0 if expected_tool == actual_tool else 0.0
```

Für textuelle Antworten helfen häufig drei Bewertungsachsen: Relevanz, Vollständigkeit und Sicherheit. Diese Kriterien sind weniger präzise als exakte Übereinstimmung, dafür aber realistischer für natürliche Sprache.

| Metrik | Zeigt | In der Praxis relevant, wenn |
|---|---|---|
| Accuracy | Antwort oder Tool ist korrekt | klare Soll-Antworten existieren |
| Latenz | Antwort kommt schnell genug | Wartezeit Nutzerfluss stört |
| Kosten pro erfolgreicher Lösung | Effizienz pro gelöstem Fall | Varianten verglichen werden |
| Erfolgsquote pro Aufgabe | Ziel wurde wirklich erreicht | Agent mehrere Schritte ausführt |

Ein besonders nützlicher Wert ist nicht die Kostenhöhe pro Session, sondern die Kosten pro erfolgreicher Lösung. Zwei Varianten können ähnlich teuer erscheinen, obwohl eine davon deutlich öfter scheitert.

```python
def cost_per_successful_completion(sessions: list[dict]) -> float:
    total_cost = sum(s["cost"] for s in sessions)
    successful = sum(1 for s in sessions if s["task_completed"])
    return total_cost / successful if successful else float("inf")
```

## Wie ein kleines Evaluationsset aufgebaut wird

Gute Evaluation beginnt nicht mit Hunderten Beispielen, sondern mit einer kleinen, sauberen Auswahl typischer Fälle. Für einen Kurs genügen oft 20 bis 30 Testfälle, wenn sie nicht nur den Happy Path abdecken. Die Mischung zählt: Standardfälle, Randfälle und bewusst schwierige Eingaben.

Ein häufiger erster Fehler ist ein Testset, das nur aus offensichtlichen Anfragen besteht. Dann wirkt der Agent robuster, als er später im Einsatz ist. Schon wenige Variationen machen einen großen Unterschied: Tippfehler, unvollständige Angaben, mehrdeutige Fragen oder Eingaben außerhalb des vorgesehenen Aufgabenbereichs.

```text
Dataset-Struktur:
- Happy Path: typische Anfragen mit erwartbarem Verlauf
- Edge Cases: unklare Formulierungen, Grenzwerte, fehlende Angaben
- Negative Tests: Out-of-Scope, ungültige Eingaben, adversariale Inputs
```

Wenn im Betrieb ein neuer Fehler auftaucht, gehört genau dieser Fall in das Evaluationsset. So wird Qualität mit jeder Iteration weniger zufällig und stärker reproduzierbar.

## Welche Evaluierungsmethoden sich eignen

Die einfachste Methode ist exakte Übereinstimmung. Dieses Verfahren eignet sich für klar definierte Antworten wie IDs, Zahlenwerte oder Tool-Namen. Für offene Antworten ist es oft zu streng, weil mehrere Formulierungen fachlich korrekt sein können.

```python
def exact_match(predicted: str, expected: str) -> float:
    return 1.0 if predicted.strip().lower() == expected.strip().lower() else 0.0
```

Daneben gibt es weichere Verfahren. Teilübereinstimmung prüft, ob zentrale Informationen enthalten sind. Semantische Ähnlichkeit vergleicht Bedeutungen statt Oberflächenform. LLM-as-Judge nutzt ein Modell als Bewerter. Dieses Verfahren ist flexibel, kostet aber zusätzlich und sollte nicht als unfehlbare Instanz verstanden werden.

```python
def contains_answer(predicted: str, expected_keywords: list[str]) -> float:
    predicted_lower = predicted.lower()
    matches = sum(1 for keyword in expected_keywords if keyword.lower() in predicted_lower)
    return matches / len(expected_keywords)
```

Nicht geeignet, wenn: Das Bewertungsverfahren selbst intransparent bleibt und dadurch nur eine weitere Blackbox erzeugt. Gerade im Kurs sollte immer klar sein, warum eine Antwort als gut oder schlecht zählt.

## Observability erklärt Fehlerursachen

Wenn Evaluation zeigt, dass eine Aufgabe scheitert, beginnt die eigentliche Diagnose. Observability beantwortet dann Fragen wie: War der Kontext leer, obwohl Dokumente vorhanden waren? Hat der Agent das richtige Tool gewählt, aber mit falschen Parametern aufgerufen? Entstand eine teure Schleife durch wiederholtes Nachdenken ohne Fortschritt?

Für die Praxis reicht oft schon ein strukturierter Trace pro Anfrage:

```python
trace = {
    "question": "Bitte sende mir die Rechnung erneut.",
    "tool_calls": [
        {"name": "search_orders", "args": {"customer_id": "123"}},
        {"name": "send_invoice", "args": {"order_id": "4711"}},
    ],
    "latency_ms": 1640,
    "input_tokens": 820,
    "output_tokens": 146,
}
```

Ein solcher Trace ersetzt keine Bewertung, aber er macht Fehler reproduzierbar. Genau deshalb gehören Evaluation und Observability zusammen: Die eine Seite zeigt Abweichungen, die andere macht sie erklärbar.

## Regressionen früh erkennen

Sobald ein Agent produktiv weiterentwickelt wird, reicht eine Einmalbewertung nicht mehr aus. Jede Änderung an Prompt, Modell, Tooling oder Wissensbasis kann frühere Verbesserungen wieder zerstören. Regression Testing vergleicht daher neue Varianten immer mit einer bekannten Baseline auf demselben Datensatz.

```python
baseline_results = evaluate(
    my_agent_v1,
    data="Agent-Evaluation-v1",
    evaluators=[accuracy_evaluator],
    experiment_prefix="baseline-v1"
)

candidate_results = evaluate(
    my_agent_v2,
    data="Agent-Evaluation-v1",
    evaluators=[accuracy_evaluator],
    experiment_prefix="candidate-v2"
)
```

Der didaktische Kern ist einfach: Erst messen, dann ändern, dann erneut messen. Ohne diesen Vergleich bleiben Verbesserungen oft Behauptungen.

> [!WARNING] Baseline vor jeder Optimierung<br>
> Eine einzelne gute Demo ist keine belastbare Evidenz. Aussagekräftig wird Qualität erst im Vergleich mit einer vorherigen Version auf denselben Fällen.

## Feedback aus dem Betrieb nutzen

Evaluation endet nicht mit dem ersten Release. In vielen Projekten zeigt sich erst im echten Einsatz, welche Formulierungen, Sonderfälle oder Missverständnisse im Kurslabor noch nicht sichtbar waren. Nutzerfeedback und Produktions-Traces sind deshalb keine Nebensache, sondern Rohmaterial für das nächste Evaluationsset.

Der sinnvolle Kreislauf ist klein und konkret: Fehler im Betrieb beobachten, ausgewählte Fälle annotieren, dem Testset hinzufügen, Verbesserungen gegen dieses Set prüfen und erst danach erneut ausrollen. Teams, die diesen Schritt überspringen, reparieren häufig nur lokal und wiederholen denselben Fehler in anderer Form.

```mermaid
flowchart TD
    A["<b>Produktionsfall</b><br>Echtes Nutzerszenario"] --> B["<b>Trace prüfen</b><br>Schritte des Agenten analysieren"]
    B --> C["<b>Fehlerklasse bestimmen</b><br>Logik-, Tool- oder Promptfehler?"]
    C --> D["<b>Eval-Fall ergänzen</b><br>Szenario in Testset aufnehmen"]
    D --> E["<b>Fix umsetzen</b><br>Code oder Prompt anpassen"]
    E --> F["<b>Baseline-Test</b><br>Regressionen ausschließen"]
    F --> G["<b>Deployment</b><br>Erneut ausrollen"]
    
    %% Der Kreislauf zum nächsten Produktionsfall
    G -.-> A
```

## Konkrete Umsetzung mit LangSmith

Werkzeuge wie LangSmith sind für das Grundprinzip nicht notwendig, aber sie machen reproduzierbare Evaluation und Trace-Analyse deutlich einfacher. Für einen Kurs ist der Mehrwert vor allem didaktisch: Testfälle, Experimente und Feedback lassen sich an einem Ort sammeln.

Ein einfaches Dataset kann direkt per SDK angelegt werden:

```python
from langsmith import Client

client = Client()

dataset = client.create_dataset(
    dataset_name="Agent-Evaluation-v1",
    description="Testfälle für den Support-Agenten"
)

for example in examples:
    client.create_example(
        dataset_id=dataset.id,
        inputs=example["inputs"],
        outputs=example["outputs"],
    )
```

Darauf kann eine einfache Evaluation aufsetzen:

```python
from langsmith.evaluation import evaluate

def accuracy_evaluator(inputs: dict, outputs: dict, reference_outputs: dict) -> dict:
    predicted = outputs["answer"].lower()
    expected = reference_outputs["answer"].lower()
    score = 1.0 if expected in predicted else 0.0
    return {"key": "contains_answer", "score": score}

results = evaluate(
    my_agent,
    data="Agent-Evaluation-v1",
    evaluators=[accuracy_evaluator],
    experiment_prefix="v1-course-demo"
)
```

In der Praxis relevant, wenn: Varianten systematisch verglichen, Regressionen dokumentiert oder Nutzerfeedback später mit denselben Fällen verbunden werden soll.

## Was bei RAG-Systemen zusätzlich geprüft wird

Bei RAG-Systemen reicht es nicht, nur die Endantwort zu betrachten. Es muss zusätzlich geprüft werden, ob die richtigen Dokumente gefunden wurden und ob die Antwort tatsächlich auf dem gefundenen Kontext basiert. Sonst bleibt unklar, ob ein Fehler im Retrieval, in der Kontextauswahl oder in der Generierung liegt.

Eine einfache Retrieval-Evaluation prüft, ob relevante Dokumente in den Top-k Treffern liegen:

```python
def evaluate_retrieval(query: str, relevant_doc_ids: list[str], k: int = 5):
    results = retriever.invoke(query)
    retrieved_ids = [doc.metadata.get("id") for doc in results[:k]]

    relevant_retrieved = len(set(retrieved_ids) & set(relevant_doc_ids))
    precision = relevant_retrieved / k
    recall = relevant_retrieved / len(relevant_doc_ids)

    return {"precision": precision, "recall": recall}
```

Grenze: Gute Retrieval-Werte garantieren noch keine gute Antwort. Auch mit passenden Dokumenten kann die Generierung halluzinieren, auslassen oder falsch zitieren.

## Generierung und Bewertung entkoppeln

Eine häufig übersehene Designfrage betrifft die Rollenverteilung innerhalb des Evaluierungssystems: Wer bewertet eine Ausgabe, und darf das derselbe Agent sein, der sie erzeugt hat?

In vielen einfachen Setups bewertet das Modell seine eigene Ausgabe — oft durch einen nachgelagerten Selbstprüf-Prompt. Das Problem ist strukturell: Ein Modell, das soeben eine Ausgabe produziert hat, neigt dazu, diese konsistent positiv zu bewerten. Nicht weil es unehrlich ist, sondern weil beide Schritte aus demselben Zustand heraus entstehen. Dieses Muster wird als **optimistischer Selbstbewertungs-Bias** bezeichnet.

Die Gegenmaßnahme ist eine saubere Entkopplung: Der **Planer** zerlegt die Aufgabe und definiert, was als gutes Ergebnis gilt. Der **Generator** produziert die Ausgabe, ohne die Bewertungslogik zu kennen. Der **Evaluator** — idealerweise ein eigenes Modell oder ein explizit separierter Aufruf — prüft das Ergebnis gegen die Planvorgaben, ohne am Entstehungsprozess beteiligt gewesen zu sein.

In der Praxis relevant wenn: Der Agent eine Antwort erzeugt, die anschließend von einem weiteren LLM-Aufruf bewertet wird. Eine technische Trennung zwischen Generator- und Evaluator-Aufruf — unterschiedliche Prompts, getrennte Ketten, kein geteilter Zustand — ist dafür ausreichend. Eine physisch separate Modellinstanz ist erst in hochkritischen Systemen notwendig.

Grenze: Entkopplung allein löst keine Qualitätsprobleme. Wenn Planer und Evaluator schlechte Kriterien definieren oder das Referenzset nicht repräsentativ ist, bleibt die Bewertung trotz struktureller Trennung unzuverlässig.

## Was in Entwicklerprojekten zuerst wichtig ist

Für einen ersten Agenten ist keine vollständige Observability-Plattform nötig. Ein sauberes Minimum reicht: ein kleines Testset, klare Erfolgskriterien, gespeicherte Prompts und Antworten, sichtbare Tool-Aufrufe und ein Vergleich zwischen alter und neuer Version. Damit lassen sich viele typische Fehler bereits finden.

Entwickler unterschätzen oft, wie schnell ein scheinbar guter Agent bei kleinen Formulierungsänderungen kippt. Genau deshalb sollte der Kurs nicht nur erfolgreiche Demos zeigen, sondern auch bewusst misslingende Fälle. Erst dort wird sichtbar, warum Evaluation und Observability keine Zusatzaufgabe, sondern Teil der Agentenentwicklung sind.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Lohnt sich KI?]({{ '/02-orientierung-entscheidung/lohnt-es-sich.html' | relative_url }}) | Wann lohnt sich ein Agentenprojekt, bevor gebaut wird? |
| [RAG-Konzepte]({{ '/04-agenten-implementierung/kontext-wissen/rag-konzepte.html' | relative_url }}) | Wie funktioniert Retrieval Augmented Generation grundsätzlich? |
| [Agenten-Sicherheit]({{ '/07-qualitaet-sicherheit/agent-security.html' | relative_url }}) | Welche Sicherheitsrisiken und Schutzmaßnahmen sind bei Agenten relevant? |

---

**Version:** 1.5<br>
**Stand:** Juli 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.





