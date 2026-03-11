#
# utilities.py
#
# Stand: 04.12.2025
#
from IPython.display import display, Markdown, HTML
from IPython import get_ipython
import requests
import sys
import warnings
import subprocess
import importlib
import re
from typing import Tuple, Any
from langchain_core.prompts import ChatPromptTemplate
#
# -- Sammlung von Standard-Funktionen für den Kurs
#

def check_environment():
    """
    Gibt die installierte Python-Version aus, listet installierte LangChain- und LangGraph-Bibliotheken auf
    und unterdrückt typische Deprecation-Warnungen im Zusammenhang mit LangChain.

    Diese Funktion ist hilfreich, um schnell die Entwicklungsumgebung für LangChain-Projekte
    zu überprüfen und störende Warnungen im Notebook oder in der Konsole zu vermeiden.

    Ausgabe:
        - Python-Version
        - Liste installierter Pakete, die mit "langchain" beginnen
        - Liste installierter Pakete, die mit "langgraph" beginnen
    """

    # Python-Version anzeigen
    print(f"Python Version: {sys.version}\n")

    # LangChain- und LangGraph-Pakete anzeigen
    print("Installierte LangChain- und LangGraph-Bibliotheken:")
    try:
        result = subprocess.run(["pip", "list"], stdout=subprocess.PIPE, text=True)
        for line in result.stdout.splitlines():
            if line.lower().startswith("langchain") or line.lower().startswith("langgraph"):
                print(line)
    except Exception as e:
        print("Fehler beim Abrufen der Paketliste:", e)

    # Warnungen unterdrücken
    warnings.filterwarnings("ignore")
    warnings.filterwarnings("ignore", category=DeprecationWarning)
    warnings.filterwarnings("ignore", category=UserWarning, module="langsmith.client")
    warnings.simplefilter("ignore", ImportWarning)


def install_packages(packages):
    """
    Installiert eine Liste von Python-Paketen mit 'uv pip install' in einer Google-Colab-Umgebung,
    wenn sie noch nicht importierbar sind.

    Parameter:
    ----------
    packages : list of str or list of tuple
        Eine Liste von Paketnamen oder Tupeln (install_name, import_name).
        Beispiele:
        - ['numpy', 'pandas']
        - [('markitdown[all]', 'markitdown'), 'langchain_chroma']

    Funktionsweise:
    ---------------
    - Trennt zwischen Installationsname (für pip) und Importname (für Python).
    - Versucht, jedes angegebene Modul mit 'import' zu laden.
    - Falls der Import fehlschlägt: führt 'uv pip install --system -q <paketname>' aus.
    - Gibt für jedes Paket eine Erfolgsmeldung oder eine Fehlermeldung aus.

    Voraussetzungen:
    ----------------
    - Die Funktion ist für die Ausführung in Google Colab gedacht.
    - 'uv' muss bereits installiert sein.
    - Die IPython-Umgebung muss aktiv sein (z. B. in Colab-Notebooks).
    """
    import importlib

    # Zugriff auf das aktuelle IPython-Shell-Objekt
    shell = get_ipython()

    for package in packages:
        # Bestimme Install- und Import-Namen
        if isinstance(package, tuple):
            install_name, import_name = package
        else:
            # Falls nur ein Name gegeben ist, verwende ihn für beide
            install_name = import_name = package

        try:
            # Versuche, das Modul zu importieren
            # Verwende importlib anstatt exec für sicheren Import
            importlib.import_module(import_name)
            print(f"✅ {import_name} bereits verfügbar")

        except ImportError:
            try:
                # Falls ImportError: Installiere das Paket über uv
                print(f"🔄 Installiere {install_name}...")
                shell.run_line_magic("system", f"uv pip install --system -q {install_name}")

                # Versuche erneut zu importieren nach der Installation
                importlib.import_module(import_name)
                print(f"✅ {install_name} erfolgreich installiert und importiert")

            except ImportError as import_error:
                print(f"❌ {install_name} installiert, aber Import von {import_name} fehlgeschlagen: {import_error}")
            except Exception as install_error:
                print(f"⚠️ Fehler bei der Installation von {install_name}: {install_error}")


def get_ipinfo():
    """
    Ruft Geoinformationen zur aktuellen öffentlichen IP-Adresse von ipinfo.io ab
    und gibt diese direkt in der Konsole aus.

    Die Ausgabe umfasst:
        - Öffentliche IP-Adresse
        - Hostname
        - Stadt
        - Region
        - Land (ISO-Code)
        - Koordinaten
        - Internetanbieter (Organisation)
        - Postleitzahl
        - Zeitzone

    Beispiel:
        >>> get_ipinfo()
        IP-Adresse: 8.8.8.8
        Stadt: Mountain View
        ...
    """
    try:
        response = requests.get("https://ipinfo.io")
        data = response.json()

        print("IP-Adresse:", data.get("ip"))
        print("Hostname:", data.get("hostname"))
        print("Stadt:", data.get("city"))
        print("Region:", data.get("region"))
        print("Land:", data.get("country"))
        print("Koordinaten:", data.get("loc"))
        print("Provider:", data.get("org"))
        print("Postleitzahl:", data.get("postal"))
        print("Zeitzone:", data.get("timezone"))

    except requests.RequestException as e:
        print("Fehler beim Abrufen der IP-Informationen:", e)


def setup_api_keys(key_names, create_globals=True):
    """
    Setzt angegebene API-Keys aus Google Colab userdata als Umgebungsvariablen
    und optional als globale Variablen.

    Args:
        key_names (list[str]): Liste der Namen der API-Keys (z.B. ["OPENAI_API_KEY", "HF_TOKEN"]).
        create_globals (bool): Wenn True, werden auch globale Variablen erstellt (Standard: True).

    Hinweis:
        Die API-Keys werden direkt in die Umgebungsvariablen geschrieben,
        aber NICHT zurückgegeben, um unbeabsichtigte Sichtbarkeit zu vermeiden.
        Bei create_globals=True werden zusätzlich globale Variablen mit den Key-Namen erstellt.
    """
    from google.colab import userdata
    from os import environ
    import inspect

    # Zugriff auf den globalen Namespace des aufrufenden Moduls
    caller_frame = inspect.currentframe().f_back
    caller_globals = caller_frame.f_globals

    for key in key_names:
        try:
            value = userdata.get(key)
            if value:
                # Umgebungsvariable setzen
                environ[key] = value

                # Optional: Globale Variable im aufrufenden Modul erstellen
                if create_globals:
                    caller_globals[key] = value

                print(f"✓ {key} erfolgreich gesetzt")
            else:
                print(f"⚠ {key} nicht in userdata gefunden")

        except Exception as e:
            print(f"✗ Fehler beim Setzen von {key}: {e}")


def mprint(text):
    """
    Gibt den übergebenen Text als Markdown in Jupyter-Notebooks aus.

    Diese Funktion nutzt IPythons `display()` zusammen mit `Markdown()`,
    um formatierte Markdown-Ausgabe in einem Jupyter-Notebook zu ermöglichen.

    Parameter:
    ----------
    text : str
        Der anzuzeigende Markdown-Text.

    Beispiel:
    ---------
    >>> mprint("# Überschrift\n**fett** und *kursiv*")
    """
    display(Markdown(text))


def mermaid(code: str, width=None, height=None):
    """
    Rendert Mermaid-Diagramme clientseitig via Mermaid CDN im Browser.

    Diese Funktion erzeugt HTML mit eingebettetem Mermaid-Code und lädt
    die Mermaid-Bibliothek vom CDN, sodass das Diagramm direkt im Browser
    gerendert wird. Emojis werden korrekt dargestellt.

    Mermaid ist eine JavaScript-basierte Diagramm- und Charting-Tool,
    das aus Text-Definitionen Diagramme generiert (z.B. Flowcharts,
    Sequenzdiagramme, Gantt-Diagramme, etc.).

    Parameter:
    ----------
    code : str
        Mermaid-Code, der das gewünschte Diagramm beschreibt.
    width : int, optional
        Breite des Diagramms in Pixeln (Standard: None = automatische Größe).
    height : int, optional
        Höhe des Diagramms in Pixeln (Standard: None = automatische Größe).

    Beispiel:
    ---------
    >>> mermaid('''
    ... graph TD
    ...     A[Start] --> B[Process]
    ...     B --> C[End]
    ... ''')

    >>> mermaid('''
    ... sequenceDiagram
    ...     User->>Agent: Frage stellen
    ...     Agent->>LLM: Query senden
    ...     LLM-->>Agent: Antwort
    ...     Agent-->>User: Ergebnis
    ... ''', width=800, height=600)

    Hinweise:
    ---------
    - Benötigt eine aktive Internetverbindung zum Mermaid CDN
    - Unterstützt alle Mermaid-Diagrammtypen (graph, sequenceDiagram, gantt, etc.)
    - Emojis werden korrekt dargestellt (Browser-Rendering)
    - Funktioniert in Google Colab und JupyterLab; nicht in VS Code Notebooks
    - Width und Height sind optional für bessere Kontrolle über die Darstellung
    """
    import uuid
    div_id = f"mermaid-{uuid.uuid4().hex[:8]}"

    style_parts = []
    if width is not None:
        style_parts.append(f"width:{width}px")
    if height is not None:
        style_parts.append(f"height:{height}px")
    style = "; ".join(style_parts)

    html = f"""<div id="{div_id}" style="{style}"><pre class="mermaid">{code}</pre></div>
<script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({{ startOnLoad: false }});
    await mermaid.run({{ nodes: [document.querySelector('#{div_id} .mermaid')] }});
</script>"""

    try:
        display(HTML(html))
    except Exception as e:
        print(f"Ein unerwarteter Fehler ist aufgetreten: {e}")


# ============================================================================
# MODEL PROFILE UTILITIES
# ============================================================================

def get_model_profile(model: str, print_profile: bool = True, **kwargs):
    """
    Ruft Model-Profile von models.dev ab und zeigt die wichtigsten Capabilities.

    Diese Funktion initialisiert ein LLM mit init_chat_model() und gibt dessen
    Profile zurück. Das Profile enthält wichtige Informationen über die Fähigkeiten
    des Modells (Structured Output, Function Calling, Vision, etc.), die von
    https://models.dev abgerufen werden.

    Parameter:
    ----------
    model : str
        Model-Name im Format "provider:model" (z.B. "openai:gpt-4o-mini")
        oder als separater String (dann muss provider über kwargs übergeben werden)
    print_profile : bool, optional
        Wenn True, werden die wichtigsten Profile-Informationen ausgegeben (Standard: True)
    **kwargs : dict
        Zusätzliche Parameter für init_chat_model() (z.B. max_tokens, top_p, etc.)

    Returns:
    --------
    dict
        Das vollständige Model-Profile mit allen Capabilities

    Beispiel:
    ---------
    >>> from genai_lib.utilities import get_model_profile
    >>>
    >>> # Kurznotation (empfohlen)
    >>> profile = get_model_profile("openai:gpt-4o-mini")
    >>>
    >>> # Mit zusätzlichen Parametern
    >>> profile = get_model_profile("anthropic:claude-3-sonnet", max_tokens=1000)
    >>>
    >>> # Ohne Ausgabe (nur Rückgabe)
    >>> profile = get_model_profile("google:gemini-pro", print_profile=False)
    >>>
    >>> # Zugriff auf spezifische Capabilities
    >>> if profile['image_inputs']:
    >>>     print("Modell unterstützt Vision!")

    Hinweise:
    ---------
    - Die Model-Profile werden von models.dev abgerufen
    - Nutzt intern init_chat_model() für konsistente Model-Initialisierung
    - Profile werden automatisch gecacht für schnellere Zugriffe
    - Nicht alle Models haben alle Profile-Attribute (Fallback auf None/False)

    Profile-Attribute (Auswahl):
    ----------------------------
    **Core Capabilities:**
    - structured_output: Native Structured Output API
    - tool_calling: Function Calling Support
    - supports_json_mode: JSON Mode Support
    - reasoning: Extended Thinking/Reasoning Support

    **Multimodal Input:**
    - text_inputs: Text Input (Standard)
    - image_inputs: Bild Input (Vision)
    - audio_inputs: Audio Input Support
    - video_inputs: Video Input Support

    **Multimodal Output:**
    - text_outputs: Text Output (Standard)
    - image_outputs: Bild-Generierung
    - audio_outputs: Audio-Generierung (TTS)
    - video_outputs: Video-Generierung

    **Token Limits:**
    - max_input_tokens: Context Window Größe
    - max_output_tokens: Max. Output-Länge

    **Model Configuration:**
    - temperature: Temperature-Parameter Support
    - knowledge_cutoff: Knowledge Cutoff Date

    **Additional Features:**
    - streaming: Streaming Support
    - async_capable: Async Support
    """
    from langchain.chat_models import init_chat_model

    # Model initialisieren
    try:
        llm = init_chat_model(model, **kwargs)
    except Exception as e:
        print(f"❌ Fehler beim Initialisieren des Modells: {e}")
        return None

    # Profile abrufen
    try:
        profile = llm.profile
    except AttributeError:
        print(f"⚠️  Modell hat kein .profile Attribut (möglicherweise veraltete LangChain-Version)")
        return None

    # Profile ausgeben (wenn gewünscht)
    if print_profile:
        print(f"🔍 Model Profile: {model}")
        print("=" * 60)

        # Core Capabilities
        print("\n📋 Core Capabilities:")
        print(f"  ✓ Structured Output:  {profile.get('structured_output', False)}")
        print(f"  ✓ Function Calling:   {profile.get('tool_calling', False)}")
        print(f"  ✓ JSON Mode:          {profile.get('supports_json_mode', False)}")
        print(f"  ✓ Reasoning:          {profile.get('reasoning', False)}")

        # Multimodal Capabilities (vereinfacht mit Symbolen)
        print("\n🎨 Multimodal Capabilities:")

        # Input Capabilities
        input_symbols = []
        if profile.get('text_inputs', True):  # Text ist Standard
            input_symbols.append('📝 Text')
        if profile.get('image_inputs', False):
            input_symbols.append('🖼️ Image')
        if profile.get('audio_inputs', False):
            input_symbols.append('🎵 Audio')
        if profile.get('video_inputs', False):
            input_symbols.append('🎬 Video')
        print(f"  ✓ Input:  {', '.join(input_symbols) if input_symbols else 'N/A'}")

        # Output Capabilities
        output_symbols = []
        if profile.get('text_outputs', True):  # Text ist Standard
            output_symbols.append('📝 Text')
        if profile.get('image_outputs', False):
            output_symbols.append('🖼️ Image')
        if profile.get('audio_outputs', False):
            output_symbols.append('🎵 Audio')
        if profile.get('video_outputs', False):
            output_symbols.append('🎬 Video')
        print(f"  ✓ Output: {', '.join(output_symbols) if output_symbols else 'N/A'}")

        # Token Limits
        print("\n📊 Token Limits:")
        max_input = profile.get('max_input_tokens')
        max_output = profile.get('max_output_tokens')
        print(f"  ✓ Max Input Tokens:   {max_input if max_input else 'N/A'}")
        print(f"  ✓ Max Output Tokens:  {max_output if max_output else 'N/A'}")

        # Model Configuration
        print("\n⚙️ Model Configuration:")
        temperature_support = profile.get('temperature', 'N/A')
        if temperature_support is True:
            temperature_support = 'Yes'
        elif temperature_support is False:
            temperature_support = 'No'
        print(f"  ✓ Temperature:        {temperature_support}")
        knowledge = profile.get('knowledge_cutoff', 'N/A')
        print(f"  ✓ Knowledge Cutoff:   {knowledge}")

        # Additional Info
        print("\n🔧 Additional Features:")
        print(f"  ✓ Streaming:          {profile.get('streaming', False)}")
        print(f"  ✓ Async:              {profile.get('async_capable', False)}")

        print("=" * 60)
        print(f"📚 Vollständiges Profile: llm.profile (dict mit allen Attributen)")

    return profile


# ============================================================================
# LLM RESPONSE PARSING
# ============================================================================

def extract_thinking(response: Any) -> Tuple[str, str]:
    """
    Universeller Parser für verschiedene Thinking-Formate von LLMs.

    Diese Funktion extrahiert den "Thinking"-Teil (Denkprozess) und die eigentliche
    Antwort aus verschiedenen LLM-Response-Formaten. Sie unterstützt mehrere
    Provider und Modelle mit unterschiedlichen Ausgabestrukturen.

    Unterstützte Formate:
        1. Liste von Blöcken (Claude, Gemini): content = [{"type": "thinking", ...}, {"type": "text", ...}]
        2. String mit <think> Tags (Qwen3, DeepSeek R1): "<think>...</think>Antwort"
        3. DeepSeek reasoning_content Feld: response.additional_kwargs["reasoning_content"]

    Parameter:
    ----------
    response : Any
        Ein LLM-Response-Objekt (z.B. AIMessage) mit einem `content` Attribut.
        Optional kann es auch `additional_kwargs` enthalten.

    Returns:
    --------
    Tuple[str, str]
        Ein Tuple bestehend aus:
        - thinking (str): Der extrahierte Denkprozess (leer, wenn nicht vorhanden)
        - answer (str): Die eigentliche Antwort

    Beispiel:
    ---------
    >>> from langchain.chat_models import init_chat_model
    >>> llm = init_chat_model("anthropic:claude-3-5-sonnet", temperature=0)
    >>> response = llm.invoke("Erkläre kurz, was 2+2 ist.")
    >>> thinking, answer = extract_thinking(response)
    >>> print(f"Thinking: {thinking[:100]}...")
    >>> print(f"Answer: {answer}")

    Hinweise:
    ---------
    - Bei Modellen ohne Thinking-Feature wird thinking als leerer String zurückgegeben
    - Die Funktion ist provider-agnostisch und passt sich automatisch an
    - Für Claude muss extended thinking aktiviert sein (Beta-Feature)
    """
    thinking = ""
    answer = ""
    content = response.content

    # Fall 1: Liste von Blöcken (Claude, Gemini)
    if isinstance(content, list):
        for block in content:
            if isinstance(block, dict):
                block_type = block.get("type", "")
                if block_type == "thinking":
                    thinking += block.get("thinking", "")
                elif block_type == "text":
                    answer += block.get("text", "")

    # Fall 2: String mit <think> Tags (Qwen3, DeepSeek R1)
    elif isinstance(content, str):
        think_match = re.search(r"<think>(.*?)</think>", content, re.DOTALL)
        if think_match:
            thinking = think_match.group(1).strip()
            answer = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()
        else:
            answer = content

    # Fall 3: DeepSeek reasoning_content Feld
    if not thinking and hasattr(response, "additional_kwargs"):
        thinking = response.additional_kwargs.get("reasoning_content", "")

    return thinking, answer


# ============================================================================
# LANGSMITH TRACE UTILITIES
# ============================================================================

def show_trace(project_name: str, limit: int = 5, show_steps: bool = False) -> None:
    """
    Zeigt die letzten LangSmith-Runs eines Projekts als formatierte Tabelle.

    Mit show_steps=True werden die Child-Runs (Tool-Calls, LLM-Calls) des letzten
    Runs aufgelistet — nützlich zur Analyse von Agenten-Verhalten:

    Wichtige Trace-Patterns:
        - Unexpected Tool Calls: Agent ruft Tools auf, die für die Aufgabe nicht
          sinnvoll sind (z.B. grep-Calls bei reinen Wissensfragen)
        - Retry-Loops: Wiederholte Tool-Calls mit gleichen Args nach Fehler
        - Over-Planning: Viele write_todos-Steps, wenig tatsächliche Arbeit
        - Missing Tool Use: Agent antwortet ohne Tools trotz verfügbarer Tools
        - Hohe Child-Run-Anzahl: Deutet auf interne Loops oder Middleware hin

    Parameter:
    ----------
    project_name : str
        Name des LangSmith-Projekts (z.B. "M32-DeepAgents-Harness")
    limit : int, optional
        Anzahl der anzuzeigenden Runs (Standard: 5)
    show_steps : bool, optional
        Wenn True, werden die Child-Runs (Tool-Calls, LLM-Calls) des letzten
        Runs aufgelistet — ideal für Pattern-Analyse (Standard: False)

    Beispiel:
    ---------
    >>> from genai_lib.utilities import show_trace
    >>> show_trace("M32-DeepAgents-Harness", limit=3)
    >>> show_trace("M32-DeepAgents-Harness", show_steps=True)
    """
    try:
        from langsmith import Client
    except ImportError:
        mprint("> ❌ `langsmith` nicht installiert: `pip install langsmith`")
        return

    try:
        client = Client()
        runs = list(client.list_runs(
            project_name=project_name,
            run_type="chain",
            is_root=True,
            limit=limit,
        ))
        runs.sort(key=lambda r: r.start_time, reverse=True)
    except Exception as e:
        mprint(f"> ❌ LangSmith-Verbindung fehlgeschlagen: `{e}`")
        return

    if not runs:
        mprint(f"> Keine Runs gefunden für Projekt `{project_name}`")
        return

    # Haupttabelle
    zeilen = [
        f"## LangSmith Trace — `{project_name}`", "",
        "| Run | Status | Dauer | Child-Runs |",
        "|-----|--------|-------|------------|",
    ]
    for run in runs:
        dauer = (
            f"{(run.end_time - run.start_time).total_seconds():.1f}s"
            if run.end_time and run.start_time else "—"
        )
        children = len(run.child_run_ids) if run.child_run_ids else 0
        status = "✅" if run.status == "success" else "❌"
        zeilen.append(f"| `{run.name or '—'}` | {status} {run.status} | {dauer} | {children} |")

    mprint("\n".join(zeilen))

    # Step-Analyse des letzten Runs
    if show_steps:
        last_run = runs[0]
        try:
            children = list(client.list_runs(
                project_name=project_name,
                filter=f'eq(parent_run_id, "{str(last_run.id)}")',
            ))
        except Exception as e:
            mprint(f"> ❌ Child-Runs konnten nicht abgerufen werden: `{e}`")
            return

        if not children:
            mprint("> Keine Child-Runs gefunden.")
            return

        step_zeilen = [
            f"\n### Steps — letzter Run: `{last_run.name or '—'}`", "",
            "| # | Typ | Name | Status | Dauer |",
            "|---|-----|------|--------|-------|",
        ]
        for i, child in enumerate(children, 1):
            dauer = (
                f"{(child.end_time - child.start_time).total_seconds():.1f}s"
                if child.end_time and child.start_time else "—"
            )
            status = "✅" if child.status == "success" else "❌"
            step_zeilen.append(
                f"| {i} | `{child.run_type}` | `{child.name}` | {status} | {dauer} |"
            )
            # Bei tool-Nodes: eine Ebene tiefer für individuelle Tool-Namen
            if child.name == "tools" and child.child_run_ids:
                try:
                    tool_runs = list(client.list_runs(
                        project_name=project_name,
                        filter=f'eq(parent_run_id, "{str(child.id)}")',
                    ))
                    for tool_run in tool_runs:
                        tool_dauer = (
                            f"{(tool_run.end_time - tool_run.start_time).total_seconds():.1f}s"
                            if tool_run.end_time and tool_run.start_time else "—"
                        )
                        tool_status = "✅" if tool_run.status == "success" else "❌"
                        step_zeilen.append(
                            f"| ↳ | `{tool_run.run_type}` | `{tool_run.name}` | {tool_status} | {tool_dauer} |"
                        )
                except Exception:
                    pass

        mprint("\n".join(step_zeilen))


# ============================================================================
# PROMPT TEMPLATE LOADER
# ============================================================================

def _convert_github_tree_to_raw(url):
    """
    Wandelt einen GitHub-Tree- oder Blob-Link in einen Raw-Link um.

    Beispiele:
        Input:
            https://github.com/user/repo/tree/main/path/to/file.py
            https://github.com/user/repo/blob/main/path/to/file.py
        Output:
            https://raw.githubusercontent.com/user/repo/main/path/to/file.py

    Wird intern von load_prompt verwendet, um GitHub-Links
    automatisch in ladbare Raw-Datei-URLs umzuwandeln.
    """
    if "github.com" in url:
        if "/tree/" in url:
            return url.replace("github.com", "raw.githubusercontent.com").replace("/tree/", "/")
        elif "/blob/" in url:
            return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")
    return url


def _parse_md_prompt(content):
    """
    Parst eine Markdown-Prompt-Datei und extrahiert die Messages.

    Erwartetes Format:
        ---
        name: template_name
        description: Beschreibung
        variables: [var1, var2]
        ---

        ## system

        System-Prompt-Text mit {var1} Platzhaltern...

        ## human

        Human-Prompt-Text mit {var2} Platzhaltern...

    Args:
        content (str): Inhalt der Markdown-Datei

    Returns:
        list[tuple]: Liste von (role, content) Tuples für ChatPromptTemplate
    """
    # Frontmatter entfernen (optional)
    body = re.sub(r'^---\s*\n.*?\n---\s*\n', '', content, count=1, flags=re.DOTALL)

    # Messages anhand von ## Headings splitten
    sections = re.split(r'^##\s+', body, flags=re.MULTILINE)

    messages = []
    for section in sections:
        section = section.strip()
        if not section:
            continue

        # Erste Zeile = Rollenname, Rest = Inhalt
        lines = section.split('\n', 1)
        role = lines[0].strip().lower()

        # Optionales Nummern-Präfix tolerieren: "1 system" → "system", "2 human" → "human"
        role = re.sub(r'^\d+\s+', '', role)

        if role not in ('system', 'human', 'ai', 'assistant'):
            continue

        # 'assistant' → 'ai' für LangChain Kompatibilität
        if role == 'assistant':
            role = 'ai'

        msg_content = lines[1].strip() if len(lines) > 1 else ''
        messages.append((role, msg_content))

    if not messages:
        raise KeyError("Markdown prompt file must contain at least one ## system or ## human section.")

    return messages


def load_prompt(path, mode="T"):
    """
    Lädt ein Markdown-Prompt-Template als ChatPromptTemplate oder String.

    Erwartetes Format: Markdown (.md) mit optionalem YAML-Frontmatter und ## Headings.

    Beispiel:
        ---
        name: text_zusammenfassung
        description: Erstellt prägnante Textzusammenfassungen
        variables: [text]
        ---

        ## system

        Du bist ein Experte für Textzusammenfassungen.

        ## human

        Bitte fasse folgenden Text zusammen: {text}

    Unterstützt:
      - lokale Pfade (z. B. '05_prompt/sql_prompt.md')
      - GitHub-Tree-Links (automatische Umwandlung in Raw-Link)
      - GitHub-Blob-Links (automatische Umwandlung in Raw-Link)
      - direkte Raw-Links

    Args:
        path (str): Pfad zur .md-Datei (lokal oder URL)
        mode (str): "T" für ChatPromptTemplate (default), "S" für String
                    Bei "S" wird der Inhalt als reinen String zurückgegeben. Ein vorhandenes
                    YAML-Frontmatter wird dabei automatisch entfernt und das Ergebnis bereinigt (strip).

    Returns:
        ChatPromptTemplate (mode="T") oder str (mode="S")

    Raises:
        ValueError: Wenn die Datei keine .md-Datei ist oder mode ungültig
        KeyError: Wenn bei mode="T" keine gültigen Message-Sections vorhanden sind
    """
    if mode not in ("T", "S"):
        raise ValueError(f"mode must be 'T' or 'S', got '{mode}'.")

    if not path.rstrip('/').endswith('.md'):
        raise ValueError("Only .md prompt files are supported.")

    # GitHub-Tree-URL automatisch umwandeln
    url = _convert_github_tree_to_raw(path)

    # Inhalt laden (URL oder lokale Datei)
    if url.startswith("http"):
        response = requests.get(url)
        response.raise_for_status()
        content = response.text
    else:
        with open(url, 'r', encoding='utf-8') as f:
            content = f.read()

    # String-Modus: Inhalt ohne Frontmatter zurückgeben
    if mode == "S":
        return re.sub(r'^---\s*\n.*?\n---\s*\n', '', content, count=1, flags=re.DOTALL).strip()

    # Template-Modus: ChatPromptTemplate erzeugen
    messages = _parse_md_prompt(content)
    return ChatPromptTemplate.from_messages(messages)


# Abwärtskompatibilität
load_chat_prompt_template = load_prompt


# ============================================================================
# BEISPIEL-VERWENDUNG
# ============================================================================

if __name__ == "__main__":
    # API-Keys setzen (mit globalen Variablen)
    # setup_api_keys([
    #     "OPENAI_API_KEY",
    #     "HF_TOKEN",
    #     "ANTHROPIC_API_KEY"
    # ])

    # Jetzt können die Keys sowohl als Umgebungsvariable als auch als globale Variable verwendet werden:
    # print(OPENAI_API_KEY)  # Globale Variable
    # print(os.environ["OPENAI_API_KEY"])  # Umgebungsvariable

    # Ohne globale Variablen (nur Umgebungsvariablen):
    # setup_api_keys(["ANOTHER_KEY"], create_globals=False)

    print("✅ utilities.py geladen")
