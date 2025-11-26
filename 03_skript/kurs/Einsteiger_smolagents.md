

# 1 Grundidee

smolagents ist ein leichtgewichtiges Agenten-Framework von Hugging Face. Es bietet einen unkomplizierten Einstieg in agentische Arbeitsweisen, ohne dass eine komplexe Orchestrierungsumgebung erforderlich ist. Der Fokus liegt auf der grundlegenden Mechanik von Agenten: *Ein LLM trifft Entscheidungen, nutzt Tools und verarbeitet deren Ergebnisse in einer Schleife.*

Wesentliche Bausteine:

- ein **LLM** als Entscheidungsinstanz,
- **Tools** als klar definierte Python-Funktionen,
- eine **Agent-Klasse** (z. B. `CodeAgent` oder `ToolCallingAgent`),
- die **Ausführung** über eine zentrale Methode wie `agent.run()`.

Für Einsteiger ist besonders wichtig zu verstehen, dass das LLM nicht nur Text generiert, sondern aktiv versuchen kann, Tools aufzurufen. Genau dieses Zusammenspiel bildet das Grundprinzip von KI-Agenten. smolagents macht dieses Prinzip besonders transparent.

---

# 2 Installation (Colab)

```python
%pip install -q smolagents
```

Zusätzlich sollten API-Keys, Modellparameter und Tools zentral definiert werden, damit die spätere Fehleranalyse im Notebook überschaubar bleibt.

---

# 3 Modell-Initialisierung

Für den Einstieg empfiehlt sich ein OpenAI-kompatibles Modell, da die Konfiguration reduziert bleibt, das Verhalten stabil ist und Modelle bereits aus anderen Kursmodulen bekannt sind.

```python
from smolagents import OpenAIModel
import os

model = OpenAIModel(
    model="gpt-4o-mini",
    api_key=os.environ["OPENAI_API_KEY"],
    temperature=0.0
)
```

Wichtige Hinweise:
- Eine zentrale Modelldefinition erleichtert Wiederverwendbarkeit und Übersicht.
- Eine niedrige Temperatur sorgt für deterministischere Ergebnisse und stabilere Tool-Nutzung.
- Fehlende API-Keys sind eine der häufigsten Fehlerquellen – klare Hinweise im Notebook unterstützen Einsteiger.

---

# 4 Tools definieren

Tools bilden die „Fähigkeiten“ des Agenten ab. Jedes Werkzeug sollte eindeutig benannt und beschrieben sein. smolagents nutzt diese Beschreibung aktiv, um dem LLM zu vermitteln, wann ein Tool anzuwenden ist.

```python
from smolagents import Tool

def get_mean(values: list[float]) -> float:
    """Berechnet den Mittelwert einer Liste von Zahlen."""
    if not values:
        raise ValueError("Liste darf nicht leer sein.")
    return sum(values) / len(values)

mean_tool = Tool(
    name="get_mean",
    description="Berechnet den Mittelwert einer Liste von Zahlen.",
    func=get_mean
)
```

Empfehlungen für Einsteiger:
- Tools sollten klar strukturiert und möglichst nebenwirkungsfrei sein.
- Beschreibungen dürfen nicht zu allgemein ausfallen – Unklarheit führt zu Fehlentscheidungen des LLM.
- Fehlerbehandlung sollte minimal, aber nachvollziehbar sein (z. B. prüfen, ob Listen leer sind).

---

# 5 Agent erstellen

Ein Agent kombiniert LLM, Tools und Steuerlogik. Besonders wichtig ist das Verständnis des Parameters `max_loops`, der verhindert, dass ein Agent endlos im Kreis denkt oder unkontrolliert Tools aufruft.

```python
from smolagents import CodeAgent

tools = [mean_tool]

agent = CodeAgent(
    tools=tools,
    model=model,
    max_loops=4,
    verbosity=2
)
```

Weitere Hinweise:
- Eine zu hohe Anzahl an Schleifendurchläufen kann zu unnötigen Kosten oder Hängern führen.
- `verbosity=2` ist ideal für den Unterricht, weil jeder Schritt transparent wird.
- `CodeAgent` eignet sich für generische Abläufe mit mehr Freiheitsgraden.

---

# 6 Agent ausführen

```python
query = "Berechne den Mittelwert von 1, 2, 3, 10."
result = agent.run(query)
print(result)
```

Didaktisch sinnvoll:
- Die Logs sollten gemeinsam interpretiert werden, um zu verstehen, wann und warum ein Tool aufgerufen wird.
- Das Verhalten sollte mit einer reinen LLM-Antwort verglichen werden.
- Typische Fehlbedienungen (z. B. Zeichenketten statt Listen) lassen sich kontrolliert demonstrieren.

---

# 7 Vergleich zu LangChain und LangGraph

| Thema         | smolagents                      | LangChain               | LangGraph                               |
| ------------- | ------------------------------- | ----------------------- | --------------------------------------- |
| Komplexität   | niedrig                         | mittel                  | hoch                                    |
| Fokus         | einfache Tool-gestützte Agenten | modulare KI-Pipelines   | komplexe Workflows, Multi-Agent-Systeme |
| Tooling       | Python-Funktionen               | strukturierte Tools     | zustandsbehaftete Systeme               |
| Debugging     | übersichtlich                   | umfangreicher           | systematische State-Inspektion          |
| Rolle im Kurs | Einstieg in Agentenmechanik     | produktionsnahe Agenten | skalierbare Architekturen               |

Zusätzliche Orientierung:
- smolagents eignet sich zum Verstehen der grundlegenden Agentenmechanik.
- LangChain fügt Struktur, Typisierung und Workflow-Bausteine hinzu.
- LangGraph erweitert dies um solide Steuerungs- und Multi-Agent-Kapazitäten.


---

# 8 Zusammenfassung

- OpenAI-Key reduziert Einstiegshürden und führt zu stabileren Ergebnissen.
- smolagents ist ideal zur Vermittlung des Grundprinzips „LLM + Tool = Agent“.
- Die Konstruktion der Tools entscheidet wesentlich über die Qualität der Agenteninteraktion.
- Begrenzte Schleifendurchläufe (`max_loops`) verhindern ineffiziente oder unvorhersehbare Ausführungen.
- Für fortgeschrittene Anwendungen sind umfassendere Frameworks wie LangChain und LangGraph geeigneter.

---

# 9 Wichtige Hinweise für Einsteiger

- Unterschied zwischen `CodeAgent` und `ToolCallingAgent`: `CodeAgent` bietet mehr Freiheit und eignet sich für explorative Experimente; `ToolCallingAgent` ist strukturierter und hilft dem LLM stärker bei der Auswahl der richtigen Tools.
- Bedeutung von `max_loops`: Eine klare Begrenzung der Agenten-Schritte verhindert Endlosschleifen, verringert Kosten und macht Debugging deutlich einfacher.
- Tools sollten anfangs klein, fokussiert und gut dokumentiert sein – je klarer ein Tool, desto besser trifft das LLM die Entscheidung.
- Logging ist ein zentrales Lerninstrument: Es macht die Agentenlogik sichtbar und unterstützt Einsteiger beim Verständnis der Abläufe.
- Modelle mit niedriger Temperatur sind für Einsteiger vorteilhaft, da sie reproduzierbarer arbeiten und Tool-Auswahl zuverlässig erfolgt.

Diese erweiterte Anleitung kann direkt als Grundlage für ein ausführliches Notebook im Stil der bestehenden Kurs-Templates verwendet werden.

