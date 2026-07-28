---
layout: default
title: Hugging Face MCP-Server
parent: Ressourcen
nav_order: 7
description: "Anleitung: MCP-fähigen Hugging Face Space erstellen und aus Python mit LangChain aufrufen"
has_toc: true
---

# Hugging Face MCP-Server einrichten und aus Python aufrufen

Ein MCP-Server ist wie eine genormte Steckdose für Agenten-Tools: Der Agent muss nicht wissen, ob dahinter Python, eine API oder ein Space läuft. Er fragt den Server, welche Tools verfügbar sind, und ruft sie mit strukturierten Parametern auf.

Technisch stellt ein MCP-Server Tools, Ressourcen oder Prompts über das Model Context Protocol bereit. Hugging Face Spaces können solche Tools besonders einfach veröffentlichen, wenn sie als Gradio Space laufen und MCP aktiviert ist. Ein Python-Programm verbindet sich danach per MCP-Client mit dem Space und nutzt die Tools wie normale LangChain-Tools.

## Zielbild

```text
Python-Programm
  -> MultiServerMCPClient
  -> https://<user>-<space>.hf.space/mcp
  -> Gradio Space mit mcp_server=True
  -> Python-Funktion als Tool
```

## Kursbeispiel aus M32

Das Notebook `M32_MCP_HuggingFace.ipynb` nutzt einen bereits veröffentlichten Hugging-Face-Space:

| Feld | Wert |
|---|---|
| Space | `ralf42/simple_mcp` |
| Space-URL | `https://ralf42-simple-mcp.hf.space` |
| MCP-Endpunkt | `https://ralf42-simple-mcp.hf.space/mcp` |
| Transport | `streamable_http` |

Der Server stellt drei historische Crypto-Tools bereit:

| Tool | Parameter | Aufgabe |
|---|---|---|
| `caesar` | `text`, `shift`, `decrypt` | Caesar-Substitution mit festem Buchstaben-Shift |
| `vigenere` | `text`, `key`, `decrypt` | Vigenere-Chiffre mit Schluesselwort |
| `scytale` | `text`, `rails`, `decrypt` | Transpositions-Chiffre nach dem Scytale-Prinzip |

Alle drei Tools sind didaktische Beispiele. Sie sind nicht fuer echte Verschluesselung geeignet.

## Voraussetzungen

- Hugging-Face-Account
- Hugging-Face-Access-Token mit mindestens Read-Rechten
- Python 3.11 oder neuer
- lokales Projekt mit virtueller Umgebung
- optional: OpenAI-API-Key, wenn der MCP-Toolaufruf über einen LangChain-Agenten erfolgen soll

## 1. Hugging-Face-Token erstellen

1. In Hugging Face anmelden.
2. In die Access-Token-Einstellungen wechseln.
3. Einen neuen Token mit Read-Rechten erstellen.
4. Den Token lokal als Umgebungsvariable speichern:

```bash
HF_TOKEN=hf_...
```

Unter Windows PowerShell:

```powershell
$env:HF_TOKEN="hf_..."
```

Für öffentliche Spaces ist der direkte HTTP-Zugriff oft ohne Token möglich. Für viele MCP-Client-Setups und für private oder hub-integrierte Nutzung ist ein Token trotzdem der sauberere Standard.

## 2. Neuen Hugging-Face-Space anlegen

1. Auf Hugging Face einen neuen Space erstellen.
2. SDK: `Gradio` wählen.
3. Sichtbarkeit festlegen:
   - `Public` für Kurs- und Demo-Zwecke
   - `Private` nur, wenn Zugriff und Authentifizierung geklärt sind
4. Hardware für einfache Tools auf `CPU basic` lassen.

Für ein erstes MCP-Beispiel reicht ein sehr kleines Gradio-Tool. Entscheidend sind klare Type Hints und ein guter Docstring, weil daraus die Tool-Beschreibung für den Agenten entsteht.

## 3. Eigenen einfachen Space anlegen

### `requirements.txt`

```text
gradio[mcp]
```

### `app.py`

```python
import gradio as gr


def letter_counter(word: str, letter: str) -> int:
    """Count how often one letter occurs in a word.

    Args:
        word: Word or short text to inspect.
        letter: Single letter to count.

    Returns:
        Number of occurrences of the letter in the word.
    """
    if len(letter) != 1:
        raise ValueError("letter must contain exactly one character")
    return word.lower().count(letter.lower())


demo = gr.Interface(
    fn=letter_counter,
    inputs=[
        gr.Textbox(label="Word"),
        gr.Textbox(label="Letter"),
    ],
    outputs=gr.Number(label="Count"),
    title="Letter Counter MCP Tool",
)

demo.launch(mcp_server=True)
```

Nach dem Start stellt Gradio das Tool zusaetzlich ueber MCP bereit. Der typische Endpunkt lautet:

```text
https://<user>-<space-name>.hf.space/mcp
```

Beispiel aus M32:

```text
https://ralf42-simple-mcp.hf.space/mcp
```

## 4. Space testen

Nach dem Push auf Hugging Face:

1. Warten, bis der Space erfolgreich gebaut wurde.
2. Die normale Space-Weboberfläche öffnen.
3. Prüfen, ob die Funktion direkt in Gradio funktioniert.
4. Den MCP-Endpunkt notieren:

```text
https://<user>-<space-name>.hf.space/mcp
```

Wenn der Space MCP-kompatibel ist, zeigt Hugging Face bei passenden Spaces ein MCP-Badge an. Alternativ kann der Endpunkt direkt aus einem MCP-Client getestet werden.

## 5. Lokales Python-Projekt vorbereiten

```bash
python -m venv .venv
source .venv/bin/activate
pip install langchain langchain-openai langchain-mcp-adapters
```

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install langchain langchain-openai langchain-mcp-adapters
```

Für LangChain 1.0+ wird das Modell über `init_chat_model()` initialisiert:

```bash
OPENAI_API_KEY=sk-...
```

PowerShell:

```powershell
$env:OPENAI_API_KEY="sk-..."
```

## 6. M32-Crypto-Tools aus Python laden

Speichere die folgende Datei als `call_hf_mcp.py`.

```python
import asyncio
import os

from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage
from langchain_mcp_adapters.client import MultiServerMCPClient


SPACE_ID = "ralf42/simple_mcp"
SPACE_URL = "https://ralf42-simple-mcp.hf.space"
MCP_URL = f"{SPACE_URL}/mcp"


async def main() -> None:
    headers = {}
    if os.getenv("HF_TOKEN"):
        headers["Authorization"] = f"Bearer {os.environ['HF_TOKEN']}"

    client = MultiServerMCPClient(
        {
            "crypto": {
                "transport": "streamable_http",
                "url": MCP_URL,
                "headers": headers,
            }
        }
    )

    tools = await client.get_tools()
    print("Geladene Tools:", [tool.name for tool in tools])

    model = init_chat_model("openai:gpt-5.4-nano")
    agent = create_agent(model, tools)

    result = await agent.ainvoke(
        {
            "messages": [
                HumanMessage(
                    content=(
                        "Ich habe den Text 'KHOOR' erhalten. "
                        "Er wurde mit Caesar um 3 Positionen verschoben. "
                        "Nutze das passende Tool und sage mir den Klartext."
                    )
                )
            ]
        },
        config={"run_name": "HF-MCP-Caesar-Demo", "tags": ["m32", "crypto", "caesar"]},
    )

    print(result["messages"][-1].content)


if __name__ == "__main__":
    asyncio.run(main())
```

Start:

```bash
python call_hf_mcp.py
```

## 7. Direkter Tool-Test ohne Agent

Für Debugging ist es oft besser, zuerst nur die Tools zu laden und direkt aufzurufen. So trennt man MCP-Probleme von Modell- oder Agentenproblemen.

```python
import asyncio

from langchain_mcp_adapters.client import MultiServerMCPClient


MCP_URL = "https://ralf42-simple-mcp.hf.space/mcp"


async def main() -> None:
    client = MultiServerMCPClient(
        {
            "crypto": {
                "transport": "streamable_http",
                "url": MCP_URL,
            }
        }
    )

    tools = await client.get_tools()
    for tool in tools:
        print(tool.name, "-", tool.description)

    caesar = next(tool for tool in tools if "caesar" in tool.name.lower())
    result = await caesar.ainvoke({"text": "KHOOR", "shift": 3, "decrypt": True})
    print(result)


if __name__ == "__main__":
    asyncio.run(main())
```

## 8. HF-Space aufwecken und Status pruefen

Hugging-Face-Spaces koennen nach Inaktivitaet schlafen. Der erste Request dauert dann laenger. Fuer das M32-Beispiel kann der Status so geprueft werden:

```python
import os
import time

import requests


SPACE_ID = "ralf42/simple_mcp"
SPACE_URL = "https://ralf42-simple-mcp.hf.space"
MCP_URL = f"{SPACE_URL}/mcp"
API_URL = f"https://huggingface.co/api/spaces/{SPACE_ID}"

hf_token = os.getenv("HF_TOKEN", "").strip()
headers = {"Authorization": f"Bearer {hf_token}"} if hf_token else {}

response = requests.get(API_URL, headers=headers, timeout=10)
response.raise_for_status()

stage = response.json().get("runtime", {}).get("stage", "UNKNOWN")
print("Status:", stage)

if stage != "RUNNING":
    print("Wecke Space auf ...")
    try:
        requests.get(SPACE_URL, timeout=10)
    except requests.RequestException:
        pass

    for _ in range(12):
        time.sleep(5)
        response = requests.get(API_URL, headers=headers, timeout=10)
        stage = response.json().get("runtime", {}).get("stage", "UNKNOWN")
        print("Status:", stage)
        if stage == "RUNNING":
            break

print("MCP-Endpunkt:", MCP_URL)
```

## 9. MCP Inspector nutzen

Der MCP Inspector ist hilfreich, wenn man pruefen will, welche Tools ein Server wirklich anbietet.

```bash
npx @modelcontextprotocol/inspector https://ralf42-simple-mcp.hf.space/mcp --transport http
```

Wenn der Inspector Tools wie `caesar`, `vigenere` und `scytale` anzeigt, ist der Server grundsaetzlich erreichbar. Danach liegen Fehler meist im Python-Client, in der Authentifizierung oder im Agentenprompt.

## Typische Stolperfallen

| Problem | Ursache | Lösung |
|---|---|---|
| Kein Tool wird geladen | Space ist noch nicht fertig gebaut oder MCP nicht aktiviert | Build-Log prüfen, `demo.launch(mcp_server=True)` setzen |
| Toolbeschreibung ist schlecht | Funktion hat keine Type Hints oder keinen Docstring | Parameter und Rückgabewert typisieren, Docstring präzisieren |
| Agent ruft falsches Tool auf | Toolname oder Beschreibung sind mehrdeutig | Funktionsnamen spezifischer machen, Docstring mit Einsatzgrenzen ergänzen |
| HTTP-Fehler beim Laden | falsche URL oder privater Space ohne Auth | `/mcp`-Endpunkt prüfen, `HF_TOKEN` als Bearer Token senden |
| Direkter Tool-Test klappt, Agent nicht | Modell versteht Toolzweck nicht oder Prompt ist unklar | Toolbeschreibung verbessern, Systemprompt enger formulieren |

## Best Practices

- Ein Tool sollte genau eine klar beschriebene Fähigkeit haben.
- Type Hints sind Pflicht, nicht Dekoration.
- Docstrings müssen erklären, wann das Tool genutzt werden soll und welche Parameter erwartet werden.
- Keine Secrets im Space-Code speichern. Tokens über Hugging-Face-Secrets oder lokale Umgebungsvariablen setzen.
- Für riskante Aktionen keine offenen Schreibtools veröffentlichen. Freigabe, Logging und Scope-Begrenzung einplanen.
- Erst direkten Tool-Aufruf testen, dann Agentenlogik ergänzen.

## Quellen

- [Hugging Face Docs: Spaces as MCP servers](https://huggingface.co/docs/hub/spaces-mcp-servers)
- [LangChain Docs: Model Context Protocol](https://docs.langchain.com/oss/python/langchain/mcp)
- [LangChain Reference: MultiServerMCPClient](https://reference.langchain.com/python/langchain-mcp-adapters/client/MultiServerMCPClient)
