import json
from pathlib import Path


path = Path(__file__).parent / "M02_Erste_Agenten_LangChain.ipynb"
notebook = json.loads(path.read_text(encoding="utf-8"))
original_cells = notebook["cells"]
by_id = {cell["id"]: cell for cell in original_cells}
assert len(by_id) == len(original_cells)
assert len(original_cells) == 78


def source(cell_id, text):
    text = text.strip("\n") + "\n"
    by_id[cell_id]["source"] = text.splitlines(keepends=True)


def new_cell(cell_id, cell_type, text):
    text = text.strip("\n") + "\n"
    cell = {
        "cell_type": cell_type,
        "id": cell_id,
        "metadata": {},
        "source": text.splitlines(keepends=True),
    }
    if cell_type == "code":
        cell["execution_count"] = None
        cell["outputs"] = []
    assert cell_id not in by_id
    by_id[cell_id] = cell


source("m03-2", '''
#@title 🛠️ Umgebung einrichten{ display-mode: "form" }
!uv pip install --system -q git+https://github.com/ralf-42/Agenten.git#subdirectory=04_modul

# LangSmith erst im Trace-Abschnitt verwenden.
import os
os.environ["LANGSMITH_TRACING"] = "false"
os.environ["LANGSMITH_PROJECT"] = "M02-Erste-Agenten"
os.environ["LANGSMITH_ENDPOINT"] = "https://eu.api.smith.langchain.com"

from genai_lib.utilities import setup_api_keys, mprint, show_trace
from genai_lib.model_config import WORKER

setup_api_keys(["OPENAI_API_KEY", "LANGSMITH_API_KEY"], create_globals=False)
''')

source("kqxpVOvd32tK", '''
In M01 wurden Werkzeuge als normale Python-Funktionen definiert und direkt getestet. Jetzt lernt der Meeting- & Research-Briefing-Agent, selbst eines dieser Werkzeuge auszuwählen.

Der Weg durch M02:
1. Ein Chatmodell vorbereiten.
2. Eine Python-Funktion mit `@tool` für den Agenten bereitstellen.
3. Einen Agenten mit einem Tool ausführen.
4. Ein zweites Tool ergänzen und die Entscheidungen beobachten.
5. Den Nachrichtenverlauf und einen LangSmith-Trace lesen.

Für den ersten Agenten reichen **Modell, Tools und System-Prompt**. Prompt-Templates folgen in M03, strukturierte Ausgaben in M04 und Chains in M06.
''')

source("hl1Pym9rN6t_", '''
# 2 | LangChain: die Bausteine für den ersten Agenten
---
''')

source("b5004f8c", '''
LangChain verbindet ein Chatmodell mit Python-Funktionen und verwaltet den Ablauf eines Agenten. Für dieses Notebook genügen vier Begriffe:

| Begriff | Bedeutung hier |
|---|---|
| **Chatmodell** | Erzeugt Antworten und kann einen Tool-Aufruf vorschlagen. |
| **Nachricht** | Enthält eine Rolle und einen Text, zum Beispiel eine Nutzerfrage. |
| **Tool** | Eine beschriebene Python-Funktion, die der Agent ausführen kann. |
| **Agent** | Übergibt Nachrichten an das Modell, führt gewählte Tools aus und liefert eine Antwort. |

Das Modell wird einmal initialisiert. Erst ein späterer Aufruf mit `.invoke(...)` sendet eine Anfrage.
''')

source("m03-4", '''
from langchain.chat_models import init_chat_model

llm = init_chat_model(WORKER)
''')

source("m03-5", '''
# 3 | Von der Python-Funktion zum Tool
---
''')

source("m02-tool-intro", '''
M01 hat Funktionen direkt aufgerufen. Mit `@tool` erhält eine Python-Funktion einen Namen, eine Beschreibung aus dem Docstring und ein Argument-Schema aus den Typannotationen. Der Agent kann sie dadurch einem Chatmodell anbieten und bei Bedarf ausführen.

Wir beginnen mit **einem** Tool und testen es erst ohne Agentenaufruf.
''')

source("m03-7", '''
from langchain_core.tools import tool
from langchain.agents import create_agent
''')

source("V0pKH6G0xa3X", '''
@tool
def begriffe_extrahieren(text: str) -> str:
    """Extrahiert bis zu fünf Schlüsselbegriffe aus einem kurzen Fachtext."""
    stopwoerter = {"und", "oder", "der", "die", "das", "ein", "eine", "mit", "für", "von", "im", "in"}
    woerter = [wort.strip(".,:;!?()[]").lower() for wort in text.split()]
    kandidaten = []
    for wort in woerter:
        if len(wort) >= 5 and wort not in stopwoerter and wort not in kandidaten:
            kandidaten.append(wort)
    return ", ".join(kandidaten[:5]) or "Keine Schlüsselbegriffe gefunden."
''')

source("m02-tool-schema", '''
mprint(f"**Tool-Name:** `{begriffe_extrahieren.name}`")
mprint(f"**Beschreibung:** {begriffe_extrahieren.description}")
mprint(f"**Parameter:** `{begriffe_extrahieren.args}`")
mprint(f"**Direkter Test:** {begriffe_extrahieren.invoke({'text': 'RAG verbindet Retrieval und Antworten.'})}")
''')

source("m03-10", '''
# 4 | Erster Agent mit einem Tool
---
''')

source("Op0VS2CD34B2", '''
`create_agent()` verbindet drei Teile:

| Parameter | Aufgabe |
|---|---|
| `model` | Das zuvor initialisierte Chatmodell. |
| `tools` | Die Funktionen, die der Agent verwenden darf. |
| `system_prompt` | Die Regel, wann und wie der Agent antworten soll. |

Der System-Prompt bleibt zunächst kurz. Die gezielte Prompt-Steuerung folgt in M03.
''')

source("T5AuxkUBxUdu", '''
system_prompt = (
    "Du unterstützt Meeting- und Research-Briefings. "
    "Nutze das Tool, wenn du Schlüsselbegriffe aus einem Fachtext bestimmen sollst. "
    "Antworte knapp und erfinde keine Rechercheergebnisse."
)

agent = create_agent(
    model=llm,
    tools=[begriffe_extrahieren],
    system_prompt=system_prompt,
)

mprint(f"**Agent bereit:** `{begriffe_extrahieren.name}` ist verfügbar.")
''')

source("XSsjhwyCU48Z", '''
Die erste Anfrage verlangt genau die Fähigkeit des verfügbaren Tools. Die Eingabe besteht aus einer Liste von Nachrichten; `role: user` kennzeichnet die Nutzerfrage. Das Ergebnis enthält die Antwort und den Nachrichtenverlauf.
''')

source("m03-11", '''
ergebnis = agent.invoke({
    "messages": [{
        "role": "user",
        "content": "Extrahiere Schlüsselbegriffe aus: Retrieval Augmented Generation verbindet Suche, Kontext und Antwortgenerierung.",
    }]
})

mprint("## Agent-Antwort")
mprint(ergebnis["messages"][-1].content)
''')

source("m03-12", '''
mprint("## Tool-Auswahl im ersten Lauf")
tool_aufrufe = [
    aufruf["name"]
    for nachricht in ergebnis["messages"]
    for aufruf in getattr(nachricht, "tool_calls", [])
]
mprint(f"**Aufgerufene Tools:** `{tool_aufrufe}`")
''')

source("m03-13", '''
# 5 | Zweites Tool und Verhalten testen
---
''')

source("x2wI3rgpVD6D", '''
Jetzt kommt eine zweite Fähigkeit hinzu: eine einfache Prüfung der Korpusabdeckung. Danach erstellen wir den Agenten mit **beiden** Tools und vergleichen Anfragen, die ein Tool, beide Tools oder keines benötigen.
''')

new_cell("m02-korpus-tool", "code", '''
@tool
def korpus_check(thema: str) -> str:
    """Prüft grob, ob ein Thema im Kurs-Wissenskorpus erwartet wird."""
    bekannte_themen = {
        "rag": "RAG ist im Wissenskorpus vertreten.",
        "retrieval": "Retrieval ist im Wissenskorpus vertreten.",
        "evaluation": "Evaluation ist im Wissenskorpus vertreten.",
        "agent": "Agenten sind im Wissenskorpus vertreten.",
        "langgraph": "LangGraph ist im Wissenskorpus voraussichtlich nur indirekt vertreten.",
    }
    thema_normalisiert = thema.lower()
    for schluessel, antwort in bekannte_themen.items():
        if schluessel in thema_normalisiert:
            return antwort
    return "Keine sichere Korpusabdeckung erkennbar."
''')

new_cell("m02-two-tool-agent", "code", '''
agent = create_agent(
    model=llm,
    tools=[begriffe_extrahieren, korpus_check],
    system_prompt=system_prompt,
)

mprint("**Agent bereit** mit `begriffe_extrahieren` und `korpus_check`.")
''')

source("o2_CvGGMyN7o", '''
for erwartung, frage in test_fragen:
    result = agent.invoke({"messages": [{"role": "user", "content": frage}]})
    tools_genutzt = [
        aufruf["name"]
        for nachricht in result["messages"]
        for aufruf in getattr(nachricht, "tool_calls", [])
    ]

    mprint(f"\n---\n**Frage [{erwartung}]:** {frage}")
    mprint(f"**Antwort:** {result['messages'][-1].content}")
    mprint(f"**Tools genutzt:** `{tools_genutzt}`")
''')

source("c15ea7d4b8f74a039b8d0b95bc94f2a7", '''
# 6 | Nachrichten und Entscheidungen verstehen
---

Im gespeicherten ersten Lauf `ergebnis` stehen die einzelnen Schritte unter `messages`:

- **`HumanMessage`**: die Nutzerfrage.
- **`AIMessage`**: eine Tool-Entscheidung oder die abschließende Antwort des Modells.
- **`ToolMessage`**: das Ergebnis eines ausgeführten Tools.

Bei einer festen Python-Abfolge wären die Aufrufe vorher festgelegt. Hier entscheidet der Agent anhand der Anfrage, welches Tool er nutzt. Chains als feste LangChain-Abläufe werden in M06 behandelt.
''')

source("ad5b46ef", '''
nachrichten = ergebnis["messages"]
mprint(f"**Nachrichten im ersten Lauf:** {len(nachrichten)}")
for nachricht in nachrichten:
    typ = type(nachricht).__name__
    tool_namen = [aufruf["name"] for aufruf in getattr(nachricht, "tool_calls", [])]
    inhalt = str(nachricht.content)[:160] or "(kein Text)"
    mprint(f"- **{typ}**: {inhalt} – Tool-Aufrufe: `{tool_namen}`")
''')

source("m03-15", '''
# 7 | LangSmith: Agent-Trace
---
''')

source("4b2836c3c2c541149c8cb552d9091d13", '''
Ein Trace zeigt die sichtbaren Schritte eines Agentenlaufs: Modellentscheidung, Tool-Aufruf mit Parametern, Tool-Ergebnis und Antwort. Er ergänzt den Nachrichtenverlauf um eine gut lesbare Ablaufansicht.

Für diesen Referenzlauf wird LangSmith einmal gezielt aktiviert. Versteckte Modellgedanken sind dabei nicht sichtbar.
''')

source("m03-16", '''
from langchain_core.tracers.context import tracing_v2_enabled

run_cfg = {
    "run_name": "M02_Kap7_AgentTrace",
    "tags": ["M02", "agent", "langsmith", "meeting-research-briefing"],
}

with tracing_v2_enabled(project_name="M02-Erste-Agenten", tags=run_cfg["tags"]):
    trace_result = agent.with_config(**run_cfg).invoke({
        "messages": [{
            "role": "user",
            "content": "Ist Retrieval im Wissenskorpus vertreten, und welche Schlüsselbegriffe enthält: Retrieval verbessert Antworten durch dokumentnahen Kontext?",
        }]
    })

mprint("## Trace-Ergebnis")
mprint(trace_result["messages"][-1].content)
''')

source("5772b0938dd54e14a5d6b83e1052bf40", '''
## Übergang zu M03
---

M02 hat gezeigt, wie ein Agent zwischen direkter Antwort und Tool-Aufruf entscheidet. M03 untersucht als Nächstes, wie System-Prompts diese Entscheidungen und die Antwortform gezielt steuern.
''')

ordered_ids = [
    "m03-1", "zXRftW5BUBm6", "d5e5a5a4", "m03-2",
    "m03-3", "kqxpVOvd32tK", "-84tQhPOtAiw",
    "hl1Pym9rN6t_", "b5004f8c", "m03-4",
    "m03-5", "m02-tool-intro", "m03-7", "V0pKH6G0xa3X", "m02-tool-schema",
    "m03-10", "Op0VS2CD34B2", "T5AuxkUBxUdu", "XSsjhwyCU48Z", "m03-11", "m03-12",
    "m03-13", "x2wI3rgpVD6D", "m02-korpus-tool", "m02-two-tool-agent", "m03-14", "o2_CvGGMyN7o",
    "c15ea7d4b8f74a039b8d0b95bc94f2a7", "ad5b46ef",
    "m03-15", "4b2836c3c2c541149c8cb552d9091d13", "m03-16", "show_trace_m03",
    "5772b0938dd54e14a5d6b83e1052bf40",
    "m03-17", "3m10hnadem3", "ZibAVgycVL1P", "31b1ad8a", "44fb3e03", "fccebab2",
    "68f03b4f", "0829a484", "37b86295", "eb7bc088", "tqVgSWpGsrwQ",
]
assert len(ordered_ids) == len(set(ordered_ids))
notebook["cells"] = [by_id[cell_id] for cell_id in ordered_ids]
path.write_text(json.dumps(notebook, ensure_ascii=False, separators=(",", ":")), encoding="utf-8", newline="")
print(f"Streamlined M02 from {len(original_cells)} to {len(notebook['cells'])} cells.")
