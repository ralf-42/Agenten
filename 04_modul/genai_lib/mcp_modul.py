"""
MCP (Model Context Protocol) Modul - Version 1.0

Ein funktionales Modul für die Implementierung von MCP-Servern, -Clients und
AI-Assistenten mit MCP-Integration.

Verwendung:
    # Server erstellen
    from mcp_modul import handle_mcp_request, get_server_info

    # Client nutzen
    from mcp_modul import setup_full_connection, call_server_tool

    # AI-Assistant
    from mcp_modul import process_user_query, setup_assistant_mcp_connection

Autor: Enhanced by Claude
Datum: Oktober 2025
Version: 1.0.0
"""

import asyncio
import json
import os
import re
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional, Callable

# Optional: OpenAI Import (wird nur für Assistant benötigt)
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    OpenAI = None


# ============================================================================
# 1. KONFIGURATION
# ============================================================================

# Server-Konfiguration
server_config = {
    "name": "file-server",
    "version": "1.0.0",
    "protocol_version": "2024-11-05"
}

# Client-Konfiguration
client_config = {
    "name": "demo-client",
    "version": "1.0.0",
    "protocol_version": "2024-11-05"
}

# Assistant-Konfiguration
assistant_config = {
    "name": "Functional-MCP-Assistant",
    "version": "1.0.0",
    "openai_model": "gpt-4o-mini",
    "temperature": 0.7
}

# Tool-Definitionen
tools_registry = {
    "read_file": {
        "description": "Liest den Inhalt einer Datei",
        "parameters": {
            "type": "object",
            "properties": {
                "filepath": {
                    "type": "string",
                    "description": "Pfad zur Datei"
                }
            },
            "required": ["filepath"]
        }
    },
    "list_files": {
        "description": "Listet Dateien in einem Verzeichnis auf",
        "parameters": {
            "type": "object",
            "properties": {
                "directory": {
                    "type": "string",
                    "description": "Verzeichnispfad (Standard: aktuelles Verzeichnis)",
                    "default": "."
                }
            }
        }
    },
    "write_file": {
        "description": "Schreibt Inhalt in eine Datei",
        "parameters": {
            "type": "object",
            "properties": {
                "filepath": {
                    "type": "string",
                    "description": "Pfad zur Datei"
                },
                "content": {
                    "type": "string",
                    "description": "Zu schreibender Inhalt"
                }
            },
            "required": ["filepath", "content"]
        }
    },
    "get_system_info": {
        "description": "Gibt Systeminformationen zurück",
        "parameters": {"type": "object", "properties": {}}
    }
}

# Globaler State (in Produktion: bessere State-Management-Lösung verwenden)
connected_servers = {}
available_tools = {}
assistant_state = {
    "connected_server": None,
    "mcp_enabled": True,
    "conversation_history": []
}

# System-Prompt für AI-Assistant
system_prompt = """
Du bist ein hilfreicher AI-Assistent mit Zugriff auf externe Tools über das Model Context Protocol (MCP).

Verfügbare MCP-Tools:
- get_system_info: Systeminformationen abrufen
- read_file: Dateien lesen
- write_file: Dateien schreiben
- list_files: Verzeichnisse auflisten

Wenn eine Benutzeranfrage externe Daten oder Dateien betrifft, nutze die entsprechenden MCP-Tools.
Beginne deine Tool-Aufrufe mit [MCP_CALL: tool_name(arguments)] und beende sie mit [/MCP_CALL].

Beispiel:
[MCP_CALL: read_file({"filepath": "example.txt"})] [/MCP_CALL]

Antworte immer auf Deutsch und erkläre deine Schritte.
"""


# ============================================================================
# 2. MCP-SERVER FUNKTIONEN
# ============================================================================

# Tool-Implementierungen
# -----------------------

async def read_file_tool(filepath: str) -> Dict[str, Any]:
    """
    Liest eine Datei

    Args:
        filepath: Pfad zur Datei

    Returns:
        Dict mit Dateiinhalt oder Fehlermeldung
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        return {
            "success": True,
            "filepath": filepath,
            "content": content,
            "size": len(content),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "filepath": filepath
        }


async def list_files_tool(directory: str = ".") -> Dict[str, Any]:
    """
    Listet Dateien in einem Verzeichnis auf

    Args:
        directory: Verzeichnispfad

    Returns:
        Dict mit Dateiliste oder Fehlermeldung
    """
    try:
        files = []
        for item in os.listdir(directory):
            item_path = os.path.join(directory, item)
            files.append({
                "name": item,
                "path": item_path,
                "is_file": os.path.isfile(item_path),
                "is_directory": os.path.isdir(item_path),
                "size": os.path.getsize(item_path) if os.path.isfile(item_path) else 0
            })

        return {
            "success": True,
            "directory": directory,
            "files": files,
            "count": len(files),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "directory": directory
        }


async def write_file_tool(filepath: str, content: str) -> Dict[str, Any]:
    """
    Schreibt Inhalt in eine Datei

    Args:
        filepath: Pfad zur Datei
        content: Zu schreibender Inhalt

    Returns:
        Dict mit Erfolgs-Status oder Fehlermeldung
    """
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        return {
            "success": True,
            "filepath": filepath,
            "bytes_written": len(content.encode('utf-8')),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "filepath": filepath
        }


async def get_system_info_tool() -> Dict[str, Any]:
    """
    Gibt Systeminformationen zurück

    Returns:
        Dict mit System-Informationen
    """
    import platform

    return {
        "system": platform.system(),
        "platform": platform.platform(),
        "python_version": platform.python_version(),
        "current_directory": os.getcwd(),
        "timestamp": datetime.now().isoformat(),
        "server_info": {
            "name": server_config["name"],
            "version": server_config["version"]
        }
    }


# Tool-Mapping
# -------------

tool_functions = {
    "read_file": read_file_tool,
    "list_files": list_files_tool,
    "write_file": write_file_tool,
    "get_system_info": get_system_info_tool
}


# Server Core-Funktionen
# -----------------------

def create_success_response(request_id: str, content: Any) -> Dict[str, Any]:
    """
    Erstellt eine erfolgreiche MCP-Antwort

    Args:
        request_id: ID der Anfrage
        content: Antwort-Inhalt

    Returns:
        Formatierte MCP-Erfolgsantwort
    """
    return {
        "jsonrpc": "2.0",
        "id": request_id,
        "result": {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps(content, indent=2, ensure_ascii=False)
                }
            ]
        }
    }


def create_error_response(request_id: str, message: str) -> Dict[str, Any]:
    """
    Erstellt eine MCP-Fehlerantwort

    Args:
        request_id: ID der Anfrage
        message: Fehlermeldung

    Returns:
        Formatierte MCP-Fehlerantwort
    """
    return {
        "jsonrpc": "2.0",
        "id": request_id,
        "error": {
            "code": -1,
            "message": message
        }
    }


def handle_initialize(request_id: str) -> Dict[str, Any]:
    """
    Behandelt Initialisierungs-Anfrage

    Args:
        request_id: ID der Anfrage

    Returns:
        Initialisierungs-Antwort
    """
    return {
        "jsonrpc": "2.0",
        "id": request_id,
        "result": {
            "protocolVersion": server_config["protocol_version"],
            "capabilities": {
                "tools": {}
            },
            "serverInfo": {
                "name": server_config["name"],
                "version": server_config["version"]
            }
        }
    }


def handle_tools_list(request_id: str) -> Dict[str, Any]:
    """
    Gibt Liste verfügbarer Tools zurück

    Args:
        request_id: ID der Anfrage

    Returns:
        Tool-Liste
    """
    return {
        "jsonrpc": "2.0",
        "id": request_id,
        "result": {
            "tools": [
                {"name": name, **details}
                for name, details in tools_registry.items()
            ]
        }
    }


async def handle_tool_call(request_id: str, tool_name: str,
                          arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Führt ein Tool aus

    Args:
        request_id: ID der Anfrage
        tool_name: Name des Tools
        arguments: Tool-Argumente

    Returns:
        Tool-Ausführungsergebnis
    """
    try:
        if tool_name not in tool_functions:
            return create_error_response(request_id, f"Unbekanntes Tool: {tool_name}")

        tool_function = tool_functions[tool_name]

        # Dynamischer Funktionsaufruf mit Argumenten
        if tool_name == "read_file":
            result = await tool_function(arguments.get("filepath"))
        elif tool_name == "list_files":
            result = await tool_function(arguments.get("directory", "."))
        elif tool_name == "write_file":
            result = await tool_function(
                arguments.get("filepath"),
                arguments.get("content")
            )
        elif tool_name == "get_system_info":
            result = await tool_function()
        else:
            return create_error_response(request_id, f"Tool-Implementierung fehlt: {tool_name}")

        return create_success_response(request_id, result)

    except Exception as e:
        return create_error_response(request_id, str(e))


async def handle_mcp_request(request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Hauptfunktion zur Verarbeitung von MCP-Anfragen

    Args:
        request: MCP-Anfrage

    Returns:
        MCP-Antwort
    """
    request_type = request.get("method")
    request_id = request.get("id", "unknown")

    try:
        if request_type == "initialize":
            return handle_initialize(request_id)

        elif request_type == "tools/list":
            return handle_tools_list(request_id)

        elif request_type == "tools/call":
            params = request.get("params", {})
            tool_name = params.get("name")
            arguments = params.get("arguments", {})
            return await handle_tool_call(request_id, tool_name, arguments)

        else:
            return create_error_response(request_id, f"Unbekannte Methode: {request_type}")

    except Exception as e:
        return create_error_response(request_id, str(e))


# Server Management-Funktionen
# -----------------------------

def get_server_info() -> Dict[str, Any]:
    """
    Gibt Server-Informationen zurück

    Returns:
        Dict mit Server-Info
    """
    return {
        "name": server_config["name"],
        "version": server_config["version"],
        "available_tools": list(tools_registry.keys()),
        "tool_count": len(tools_registry)
    }


def register_new_tool(name: str, description: str, parameters: Dict[str, Any],
                     function: Callable) -> bool:
    """
    Registriert ein neues Tool

    Args:
        name: Tool-Name
        description: Tool-Beschreibung
        parameters: Parameter-Schema
        function: Tool-Funktion

    Returns:
        Erfolgs-Status
    """
    try:
        tools_registry[name] = {
            "description": description,
            "parameters": parameters
        }
        tool_functions[name] = function
        return True
    except Exception:
        return False


# ============================================================================
# 3. MCP-CLIENT FUNKTIONEN
# ============================================================================

def create_mcp_request(method: str, params: Dict[str, Any] = None,
                      request_id: str = None) -> Dict[str, Any]:
    """
    Erstellt eine standardisierte MCP-Anfrage

    Args:
        method: MCP-Methode
        params: Methoden-Parameter
        request_id: Optionale Request-ID

    Returns:
        MCP-Request-Dict
    """
    if request_id is None:
        request_id = str(uuid.uuid4())

    request = {
        "jsonrpc": "2.0",
        "id": request_id,
        "method": method
    }

    if params:
        request["params"] = params

    return request


def connect_to_server(server_name: str, server_handler: Callable) -> bool:
    """
    Verbindet mit einem MCP-Server

    Args:
        server_name: Name des Servers
        server_handler: Handler-Funktion

    Returns:
        Erfolgs-Status
    """
    try:
        connected_servers[server_name] = server_handler
        print(f"✅ Verbunden mit Server: {server_name}")
        return True
    except Exception as e:
        print(f"❌ Verbindung zu {server_name} fehlgeschlagen: {e}")
        return False


async def initialize_server_connection(server_name: str) -> Dict[str, Any]:
    """
    Initialisiert eine Server-Verbindung

    Args:
        server_name: Name des Servers

    Returns:
        Initialisierungs-Antwort
    """
    if server_name not in connected_servers:
        raise ValueError(f"Server {server_name} nicht verbunden")

    server_handler = connected_servers[server_name]
    request = create_mcp_request(
        method="initialize",
        params={
            "protocolVersion": client_config["protocol_version"],
            "capabilities": {"tools": {}},
            "clientInfo": {
                "name": client_config["name"],
                "version": client_config["version"]
            }
        }
    )

    response = await server_handler(request)

    if "error" not in response:
        print(f"📄 Server {server_name} erfolgreich initialisiert")
    else:
        print(f"❌ Initialisierung von {server_name} fehlgeschlagen")

    return response


async def discover_server_tools(server_name: str) -> List[Dict[str, Any]]:
    """
    Entdeckt verfügbare Tools auf einem Server

    Args:
        server_name: Name des Servers

    Returns:
        Liste der Tools
    """
    if server_name not in connected_servers:
        raise ValueError(f"Server {server_name} nicht verbunden")

    server_handler = connected_servers[server_name]
    request = create_mcp_request(method="tools/list")

    response = await server_handler(request)

    if "error" not in response and "result" in response:
        tools = response["result"].get("tools", [])
        available_tools[server_name] = tools

        print(f"🔍 {len(tools)} Tools auf {server_name} entdeckt:")
        for tool in tools:
            print(f"   - {tool['name']}: {tool['description']}")

        return tools
    else:
        print(f"❌ Tool-Discovery auf {server_name} fehlgeschlagen")
        return []


async def call_server_tool(server_name: str, tool_name: str,
                          arguments: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Ruft ein Tool auf einem Server auf

    Args:
        server_name: Name des Servers
        tool_name: Name des Tools
        arguments: Tool-Argumente

    Returns:
        Tool-Antwort
    """
    if server_name not in connected_servers:
        raise ValueError(f"Server {server_name} nicht verbunden")

    if arguments is None:
        arguments = {}

    server_handler = connected_servers[server_name]
    request = create_mcp_request(
        method="tools/call",
        params={
            "name": tool_name,
            "arguments": arguments
        }
    )

    response = await server_handler(request)

    if "error" not in response:
        print(f"✅ Tool '{tool_name}' erfolgreich ausgeführt")
    else:
        print(f"❌ Tool '{tool_name}' fehlgeschlagen: {response['error']['message']}")

    return response


# Client Management-Funktionen
# -----------------------------

def get_available_tools() -> Dict[str, List[str]]:
    """
    Listet alle verfügbaren Tools nach Server auf

    Returns:
        Dict mit Server → Tools Mapping
    """
    tools_by_server = {}

    for server_name, tools in available_tools.items():
        tools_by_server[server_name] = [tool["name"] for tool in tools]

    return tools_by_server


def get_tool_details(server_name: str, tool_name: str) -> Optional[Dict[str, Any]]:
    """
    Gibt detaillierte Informationen zu einem Tool zurück

    Args:
        server_name: Name des Servers
        tool_name: Name des Tools

    Returns:
        Tool-Details oder None
    """
    if server_name not in available_tools:
        return None

    for tool in available_tools[server_name]:
        if tool["name"] == tool_name:
            return tool

    return None


def list_connected_servers() -> List[str]:
    """
    Gibt eine Liste aller verbundenen Server zurück

    Returns:
        Liste von Server-Namen
    """
    return list(connected_servers.keys())


def get_client_status() -> Dict[str, Any]:
    """
    Gibt den aktuellen Client-Status zurück

    Returns:
        Dict mit Client-Status
    """
    return {
        "client_info": client_config,
        "connected_servers": list(connected_servers.keys()),
        "total_tools": sum(len(tools) for tools in available_tools.values()),
        "tools_by_server": {
            server: len(tools)
            for server, tools in available_tools.items()
        }
    }


async def setup_full_connection(server_name: str, server_handler: Callable) -> bool:
    """
    Komplette Server-Verbindung: Connect + Initialize + Discover

    Args:
        server_name: Name des Servers
        server_handler: Handler-Funktion

    Returns:
        Erfolgs-Status
    """
    try:
        # 1. Verbinden
        if not connect_to_server(server_name, server_handler):
            return False

        # 2. Initialisieren
        await initialize_server_connection(server_name)

        # 3. Tools entdecken
        await discover_server_tools(server_name)

        print(f"🎯 Vollständige Verbindung zu {server_name} hergestellt")
        return True

    except Exception as e:
        print(f"❌ Setup-Fehler für {server_name}: {e}")
        return False


def disconnect_server(server_name: str) -> bool:
    """
    Trennt die Verbindung zu einem Server

    Args:
        server_name: Name des Servers

    Returns:
        Erfolgs-Status
    """
    try:
        if server_name in connected_servers:
            del connected_servers[server_name]
        if server_name in available_tools:
            del available_tools[server_name]

        print(f"🔌 Verbindung zu {server_name} getrennt")
        return True
    except Exception as e:
        print(f"❌ Fehler beim Trennen von {server_name}: {e}")
        return False


# ============================================================================
# 4. AI-ASSISTANT FUNKTIONEN
# ============================================================================

# OpenAI-Client (Lazy Initialization)
_openai_client = None


def get_openai_client():
    """
    Gibt OpenAI-Client zurück (Lazy Initialization)

    Returns:
        OpenAI Client-Instanz
    """
    global _openai_client

    if not OPENAI_AVAILABLE:
        raise ImportError("OpenAI package nicht installiert. Installiere mit: pip install openai")

    if _openai_client is None:
        _openai_client = OpenAI()

    return _openai_client


def setup_assistant_mcp_connection(server_name: str) -> bool:
    """
    Richtet die MCP-Verbindung für den Assistenten ein

    Args:
        server_name: Name des Servers

    Returns:
        Erfolgs-Status
    """
    try:
        if server_name not in connected_servers:
            print(f"❌ Server {server_name} nicht verfügbar")
            return False

        assistant_state["connected_server"] = server_name
        print(f"✅ Assistant mit MCP-Server {server_name} verbunden")
        return True
    except Exception as e:
        print(f"❌ Fehler bei Assistant-MCP-Setup: {e}")
        return False


def extract_mcp_calls_from_text(text: str) -> List[Dict[str, Any]]:
    """
    Extrahiert MCP-Aufrufe aus dem Text

    Args:
        text: Text mit MCP-Aufrufen

    Returns:
        Liste von MCP-Aufrufen
    """
    pattern = r'\[MCP_CALL:\s*(\w+)\(([^)]*)\)\]\s*\[/MCP_CALL\]'
    matches = re.findall(pattern, text)

    calls = []
    for tool_name, args_str in matches:
        try:
            if args_str.strip():
                args = eval(args_str)  # Achtung: In Produktion sicherer parsen!
            else:
                args = {}

            calls.append({
                "tool": tool_name,
                "arguments": args
            })
        except Exception as e:
            print(f"⚠️ Fehler beim Parsen von MCP-Aufruf: {e}")

    return calls


async def execute_mcp_calls_for_assistant(calls: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Führt MCP-Aufrufe für den Assistenten aus

    Args:
        calls: Liste von MCP-Aufrufen

    Returns:
        Dict mit Ergebnissen
    """
    if not assistant_state["connected_server"]:
        return {"error": "Kein MCP-Server verbunden"}

    server_name = assistant_state["connected_server"]
    results = {}

    for i, call in enumerate(calls):
        tool_name = call["tool"]
        arguments = call["arguments"]

        try:
            print(f"🔧 Führe aus: {tool_name}({arguments})")
            response = await call_server_tool(server_name, tool_name, arguments)

            if "result" in response:
                result_text = response["result"]["content"][0]["text"]
                result_data = json.loads(result_text)
                results[f"call_{i}_{tool_name}"] = result_data
            else:
                results[f"call_{i}_{tool_name}"] = {
                    "error": response.get("error", "Unbekannter Fehler")
                }

        except Exception as e:
            results[f"call_{i}_{tool_name}"] = {"error": str(e)}

    return results


def create_openai_messages(system_content: str, user_query: str,
                          context_data: Dict[str, Any] = None) -> List[Dict[str, str]]:
    """
    Erstellt OpenAI-Nachrichten für die Chat-Completion

    Args:
        system_content: System-Prompt
        user_query: User-Anfrage
        context_data: Optionale Kontext-Daten

    Returns:
        Liste von Nachrichten
    """
    messages = [{"role": "system", "content": system_content}]

    if context_data:
        context_prompt = f"""
Der Benutzer fragte: {user_query}

Du hast folgende MCP-Tools verwendet und Ergebnisse erhalten:
{json.dumps(context_data, indent=2, ensure_ascii=False)}

Erstelle eine hilfreiche Antwort basierend auf diesen Daten. Erwähne nicht die technischen Details der MCP-Aufrufe, sondern präsentiere die Informationen natürlich.
"""
        messages.append({"role": "user", "content": context_prompt})
    else:
        messages.append({"role": "user", "content": user_query})

    return messages


async def process_user_query(user_query: str, use_mcp: bool = True) -> str:
    """
    Verarbeitet eine Benutzeranfrage mit oder ohne MCP

    Args:
        user_query: User-Anfrage
        use_mcp: MCP verwenden

    Returns:
        AI-Antwort
    """
    print(f"💭 Verarbeite Anfrage: '{user_query}'")

    # Anfrage zur Historie hinzufügen
    assistant_state["conversation_history"].append({
        "timestamp": datetime.now().isoformat(),
        "user_query": user_query,
        "mcp_enabled": use_mcp and assistant_state["mcp_enabled"]
    })

    openai_client = get_openai_client()

    if not use_mcp or not assistant_state["mcp_enabled"]:
        # Direkte AI-Antwort ohne MCP
        messages = create_openai_messages(
            "Du bist ein hilfreicher AI-Assistent. Antworte auf Deutsch.",
            user_query
        )

        response = openai_client.chat.completions.create(
            model=assistant_config["openai_model"],
            messages=messages,
            temperature=assistant_config["temperature"]
        )

        return response.choices[0].message.content

    # Erste AI-Antwort mit potentiellen MCP-Aufrufen
    messages = create_openai_messages(system_prompt, user_query)

    initial_response = openai_client.chat.completions.create(
        model=assistant_config["openai_model"],
        messages=messages,
        temperature=assistant_config["temperature"]
    )

    ai_response = initial_response.choices[0].message.content
    print(f"🤖 AI-Antwort: {ai_response[:100]}...")

    # MCP-Aufrufe extrahieren und ausführen
    mcp_calls = extract_mcp_calls_from_text(ai_response)

    if mcp_calls:
        print(f"🔍 {len(mcp_calls)} MCP-Aufrufe gefunden")

        # MCP-Tools ausführen
        mcp_results = await execute_mcp_calls_for_assistant(mcp_calls)

        # Zweite AI-Antwort mit MCP-Ergebnissen
        final_messages = create_openai_messages(
            "Du bist ein hilfreicher AI-Assistent. Antworte auf Deutsch und präsentiere die erhaltenen Daten klar und verständlich.",
            user_query,
            mcp_results
        )

        final_response = openai_client.chat.completions.create(
            model=assistant_config["openai_model"],
            messages=final_messages,
            temperature=assistant_config["temperature"]
        )

        return final_response.choices[0].message.content

    else:
        # Keine MCP-Aufrufe nötig - Antwort bereinigen
        clean_response = re.sub(r'\[MCP_CALL:[^\]]*\]\s*\[/MCP_CALL\]', '', ai_response)
        return clean_response.strip()


# Assistant Management-Funktionen
# --------------------------------

def toggle_mcp_mode(enabled: bool) -> str:
    """
    Schaltet MCP-Modus ein/aus

    Args:
        enabled: MCP aktivieren

    Returns:
        Status-Nachricht
    """
    assistant_state["mcp_enabled"] = enabled
    status = "aktiviert" if enabled else "deaktiviert"
    return f"🔧 MCP-Modus {status}"


def get_assistant_status() -> Dict[str, Any]:
    """
    Gibt den aktuellen Assistant-Status zurück

    Returns:
        Dict mit Assistant-Status
    """
    return {
        "config": assistant_config,
        "mcp_enabled": assistant_state["mcp_enabled"],
        "connected_server": assistant_state["connected_server"],
        "conversation_count": len(assistant_state["conversation_history"]),
        "available_servers": list(connected_servers.keys()),
        "available_tools": get_available_tools()
    }


def clear_conversation_history() -> str:
    """
    Löscht die Gesprächshistorie

    Returns:
        Bestätigungs-Nachricht
    """
    assistant_state["conversation_history"] = []
    return "🗑️ Gesprächshistorie geleert"


# ============================================================================
# MODUL-INFO
# ============================================================================

def get_module_info() -> Dict[str, Any]:
    """
    Gibt Modul-Informationen zurück

    Returns:
        Dict mit Modul-Info
    """
    return {
        "name": "mcp_modul",
        "version": "1.0.0",
        "description": "Model Context Protocol - Funktionales Modul",
        "components": {
            "server": {
                "config": server_config,
                "tools": list(tools_registry.keys())
            },
            "client": {
                "config": client_config,
                "connected_servers": list(connected_servers.keys())
            },
            "assistant": {
                "config": assistant_config,
                "mcp_enabled": assistant_state["mcp_enabled"],
                "openai_available": OPENAI_AVAILABLE
            }
        }
    }


# Modul-Initialisierung
if __name__ == "__main__":
    print("✅ MCP-Modul geladen")
    print(f"📊 Modul-Info: {get_module_info()}")
