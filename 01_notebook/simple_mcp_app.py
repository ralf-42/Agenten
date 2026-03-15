from fastmcp import FastMCP
from fastapi import FastAPI
import gradio as gr
import uvicorn

# ── FastMCP Server ────────────────────────────────────────────────────────────
mcp = FastMCP("Crypto Tools")

# ── Tools ─────────────────────────────────────────────────────────────────────
@mcp.tool()
def caesar(text: str, shift: int, decrypt: bool = False) -> str:
    """Encrypts or decrypts text using the Caesar cipher.

    Args:
        text: The text to process.
        shift: Number of positions to shift each letter (1–25).
        decrypt: If True, decrypts instead of encrypts.
    Returns:
        The processed text.
    """
    if decrypt:
        shift = -shift
    result = []
    for char in text:
        if char.isalpha():
            base = ord("A") if char.isupper() else ord("a")
            result.append(chr((ord(char) - base + shift) % 26 + base))
        else:
            result.append(char)
    return "".join(result)


@mcp.tool()
def vigenere(text: str, key: str, decrypt: bool = False) -> str:
    """Encrypts or decrypts text using the Vigenère cipher.

    Args:
        text: The text to process.
        key: The keyword (letters only, case-insensitive).
        decrypt: If True, decrypts instead of encrypts.
    Returns:
        The processed text.
    """
    key = "".join(c for c in key.upper() if c.isalpha()) or "A"
    result = []
    key_index = 0
    for char in text:
        if char.isalpha():
            shift = ord(key[key_index % len(key)]) - ord("A")
            if decrypt:
                shift = -shift
            base = ord("A") if char.isupper() else ord("a")
            result.append(chr((ord(char) - base + shift) % 26 + base))
            key_index += 1
        else:
            result.append(char)
    return "".join(result)


# ── Gradio UI ─────────────────────────────────────────────────────────────────
with gr.Blocks(title="Crypto Tools MCP Server") as demo:
    gr.Markdown("""
    # 🔐 Crypto Tools MCP Server
    Caesar- und Vigenère-Verschlüsselung als MCP-Tools.

    **MCP-Endpoint:** `https://ralf42-simple-mcp.hf.space/mcp`
    """)

    with gr.Tab("Caesar"):
        with gr.Row():
            with gr.Column():
                c_text    = gr.Textbox(label="Text")
                c_shift   = gr.Slider(1, 25, value=3, step=1, label="Shift")
                c_decrypt = gr.Checkbox(label="Entschlüsseln")
                c_btn     = gr.Button("Ausführen")
            c_out = gr.Textbox(label="Ergebnis")
        c_btn.click(caesar, [c_text, c_shift, c_decrypt], c_out)

    with gr.Tab("Vigenère"):
        with gr.Row():
            with gr.Column():
                v_text    = gr.Textbox(label="Text")
                v_key     = gr.Textbox(label="Schlüsselwort", value="GEHEIM")
                v_decrypt = gr.Checkbox(label="Entschlüsseln")
                v_btn     = gr.Button("Ausführen")
            v_out = gr.Textbox(label="Ergebnis")
        v_btn.click(vigenere, [v_text, v_key, v_decrypt], v_out)

# ── FastAPI App — MCP + Gradio auf Port 7860 ─────────────────────────────────
app = FastAPI()
app.mount("/mcp", mcp.http_app())
app = gr.mount_gradio_app(app, demo, path="/")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
