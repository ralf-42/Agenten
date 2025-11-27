---
layout: default
title: Troubleshooting
parent: Guides
nav_order: 4
description: "Lösungen für häufige Probleme"
has_toc: true
---

# Troubleshooting
{: .no_toc }

> **Lösungen für häufige Probleme**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1 LangChain Expression Language & Chains


| **Problem**                    | **Ursache**                                                                                                                                                                                                                        | **Symptom**                                                                                          | **Lösung/Intervention**                                                                                                                                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Falsches Input-Schema**      | Der Output eines `Runnable` **`<Pipe>`** passt nicht zum erwarteten Input des nächsten `Runnable`. Dies passiert oft, wenn ein LLM einen String liefert, aber das nächste Modul einen Dictionary-Key erwartet (z.B. `"messages"`). | `InputError: Key 'messages' not found` oder der Fehler `Expecting a single string input...`          | **Mappierung mit LCEL:** Nutzen Sie **`RunnablePassthrough`** oder **`RunnableParallel`** (`{...}`) explizit, um die Input-Keys zu mappen und die Datenstruktur zu transformieren.                                                    |
| **Pipe-Operator (\|) Fehler**  | Es wird versucht, eine reine Python-Funktion, die **nicht das `Runnable` Interface implementiert**, mit dem Pipe-Operator zu verbinden.                                                                                            | `TypeError: unsupported operand type(s) for <Pipe>: 'X' and 'Y'`                                     | **Kapselung:** Kapseln Sie jede reine Python-Funktion, die Teil der Chain sein soll, explizit mit **`RunnableLambda(...)`**.                                                                                                          |
| **Output-Formatierung fehlt**  | Die Chain endet mit dem LLM, aber der erwartete Output ist ein einfacher String oder ein Pydantic-Objekt, nicht das rohe `AIMessage`-Objekt.                                                                                       | Der Output ist ein komplexes `AIMessage`-Objekt anstatt des gewünschten formatierten Textes/Objekts. | **Parser ergänzen:** Fügen Sie am Ende der Chain einen Parser hinzu: **`StrOutputParser()`** für einfachen Text oder den korrekten Pydantic Parser (`with_structured_output` oder `PydanticOutputParser`) für strukturierte Daten.    |
| **Input-Handling bei Prompts** | Ein Prompt-Template erwartet mehrere Variablen (z.B. `{context}` und `{question}`), erhält aber nur einen einzigen Wert (String) vom vorherigen Schritt.                                                                           | Die Prompt-Variablen werden nicht korrekt ersetzt (z.B. `{context}` bleibt im Prompt stehen).        | **Dictionary-Input:** Verwenden Sie **`RunnableParallel`** (`{...}`) oder **`RunnablePassthrough.assign(...)`**, um die einzelnen Variablen vor dem Prompt in ein Dictionary zu verpacken, das alle erforderlichen Schlüssel enthält. |
| **Asynchronität/Batching**     | Es wird versucht, `chain.batch()` oder `chain.stream()` zu verwenden, aber einer der Nodes ist nicht dafür ausgelegt.                                                                                                              | `NotImplementedError` oder die erwartete parallele Verarbeitung findet nicht statt.                  | **Interface-Check:** Prüfen Sie, ob alle Komponenten in der Kette die asynchronen Methoden (z.B. `ainvoke`, `abatch`) unterstützen. Nutzen Sie **LangSmith** zur Performance-Analyse und Validierung der Batch-Calls .                |
| **Chain-Debugging**            | Es ist unklar, an welcher Stelle in der Chain der Fehler auftritt oder welche Zwischenergebnisse falsch sind.                                                                                                                      | Die Fehlermeldung ist unpräzise und verweist auf die Kompilierung.                                   | **Trace-Analyse:** Führen Sie die Chain über `invoke()` aus und inspizieren Sie den **LangSmith Trace** . LangSmith zeigt den Input und Output **jedes einzelnen `Runnable`** in der Kette.                                           |


## 2 Structured Output & Pydantic


| **Problem**                         | **Ursache**                                                                                                                                                | **Symptom**                                                                                       | **Lösung/Intervention**                                                                                                                                                                                                                                |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Schema-Validierung schlägt fehl** | Das LLM ignoriert das Anweisungs-Prompt und liefert ein Format, das nicht zum `PydanticBaseModel` passt, oder das Schema enthält ungültige Typen.          | `ValidationError` wird ausgelöst, da die JSON-Struktur nicht mit dem Python-Objekt übereinstimmt. | **Prompt-Verstärkung:** Verbessern Sie den **System-Prompt** des Agenten, indem Sie die Wichtigkeit der JSON-Ausgabe betonen ("Du **musst** strikt das bereitgestellte Schema verwenden!"). Nutzen Sie `Field(description="...")` im Pydantic-Modell.  |
| **`with_structured_output` Fehler** | Die verwendete LLM-Instanz unterstützt das native Function Calling nicht (z.B. ein älteres oder lokales Modell), oder das falsche Format wird angefordert. | `ValueError: The model X does not support JSON output...`                                         | **Modell-Check:** Stellen Sie sicher, dass Sie ein Modell verwenden, das **native Tool/Function Calling** unterstützt (z.B. `gpt-4o`, `gpt-4-turbo`, `claude-3-sonnet`).                                                                               |
| **Falsche Typ-Generierung**         | Das LLM generiert inkonsistente Typen (z.B. eine Zahl als String), obwohl der Pydantic-Typ `int` ist.                                                      | Validierung schlägt fehl oder die Logik bricht ab.                                                | **Typ-Definition:** Verwenden Sie **Python Type Hints** in Pydantic präzise (`int`, `str`, `List[str]`). Bei komplexen Listen oder verschachtelten Objekten die **Beschreibung** (`description=...`) im `Field` des Pydantic-Modells klar formulieren. |



## 3 LangGraph

LangGraph ermöglicht komplexe Agenten-**Workflows**, birgt aber durch seine State-Machine-Logik spezifische Fehlerquellen, insbesondere bei Zyklen, State-Übergängen und Checkpointing.

| **Problem**                         | **Ursache**                                                                                                                                                                                               | **Symptom**                                                                                                | **Lösung/Intervention**                                                                                                                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Endloser Zyklus (Infinite Loop)** | Die **Conditional Edge** (`route_supervisor` oder `should_continue`) entscheidet fälschlicherweise immer für einen weiteren Node anstatt für die Terminierung (`__end__`).                                | Hohe Token-Nutzung, das Programm terminiert nicht, LangSmith zeigt viele Wiederholungen im Trace.          | **Logik-Check:** Stellen Sie sicher, dass die Routing-Funktion eine klare **Abbruchbedingung** hat und **explizit** den Wert `"__end__"` zurückgibt.                                                                      |
| **State-Schema-Fehler**             | Ein Node versucht, ein Feld im `AgentState` zu überschreiben, das **keinen Reducer** (`operator.add`) hat, oder der Node gibt eine **falsche Typisierung** zurück (z.B. `str` statt `List[BaseMessage]`). | `TypeError: 'dict' object is not callable` oder `LangGraph could not update state...`                      | **Typ-Check:** Prüfen Sie das `TypedDict` (`AgentState`). Jeder Node-Rückgabewert muss **exakt** dem im State definierten Typ entsprechen. Bei Listen **immer** `operator.add` verwenden.                                 |
| **Fehlendes Tool-Ergebnis**         | Der **Tool-Node** erhält einen `ToolCall` vom Agenten, aber sendet das Ergebnis **nicht als `ToolMessage`** korrekt zurück in den State.                                                                  | Der Agent versucht, dieselbe Tool-Aktion erneut auszuführen, da das Ergebnis des vorherigen Calls fehlt.   | **Nachrichtentyp-Check:** Das Ergebnis des Tool-Aufrufs muss als **`ToolMessage`** in die `messages` Liste des `AgentState` zurückgeführt werden, damit der Agent es verarbeiten kann.                                    |
| **Checkpointing-Fallen**            | Der Graph wird ohne `config={"configurable": {"thread_id": "..."}}` aufgerufen, obwohl `MemorySaver()` aktiviert ist, oder es wird keine `thread_id` übergeben.                                           | Nach Beendigung ist der State des Graphen verloren und kann nicht über `app.get_state()` abgerufen werden. | **Konfiguration:** Stellen Sie sicher, dass **`config`** bei **jedem** Aufruf von `app.invoke()` übergeben wird, um den State zu speichern und zu laden (z.B. für **Human-in-the-Loop**).                                 |
| **Falsche Node-Verbindung**         | Eine Edge wurde nicht definiert (z.B. ein Worker-Node ist ein _Dead End_), oder die Kante zeigt auf einen nicht existierenden Node-Namen.                                                                 | `ValueError: Node 'X' is not defined.` oder der Graph stoppt unerwartet.                                   | **Visualisierung:** **Visualisieren** Sie den Graphen sofort nach der Kompilierung (z.B. mit `app.get_graph().print_ascii()` oder **LangSmith Trace** ) und prüfen Sie alle Kanten (`add_edge`, `add_conditional_edges`). |
| **Routingschleife beim Supervisor** | Der Supervisor wählt nach einem Worker-Durchlauf **immer** denselben Worker erneut, weil die Nachrichtenhistorie nicht korrekt ausgewertet wird.                                                          | Die Aufgabe kommt nicht voran (z.B. `Worker A` $\to$ `Supervisor` $\to$ `Worker A` $\to$ ...).             | **Prompt-Check:** Stellen Sie sicher, dass der **Supervisor-Prompt** explizit anweist, die **gesamte Nachrichten-Historie** (`state["messages"]`) zu berücksichtigen, um unnötige Wiederholungen zu vermeiden.            |


## 4 ChromaDB

| Problem                    | Ursache                     | Lösung                                              |
| -------------------------- | --------------------------- | --------------------------------------------------- |
| `sqlite3.OperationalError` | Falsche SQLite-Version      | `!pip install pysqlite3-binary` + sys.modules Patch |
| Collection existiert schon | Doppelter Name              | `get_or_create_collection()` verwenden              |
| Keine Ergebnisse           | Falsche Embedding-Dimension | Embedding-Modell prüfen                             |
| Langsame Queries           | Zu viele Dokumente          | Batch-Size anpassen                                 |



