from fastmcp import FastMCP
import math

mcp = FastMCP("Crypto Tools")


@mcp.tool()
def caesar(text: str, shift: int, decrypt: bool = False) -> str:
    """Caesar cipher: encrypt or decrypt text by shifting each letter.

    Use this tool whenever the user wants to:
    - encrypt text with Caesar, ROT or a letter shift
    - decrypt a Caesar-encrypted ciphertext
    - apply any fixed alphabet shift to text

    Args:
        text:    Plaintext to encrypt, or ciphertext to decrypt.
        shift:   Positions to shift each letter (1–25).
                 shift=3 maps A→D, B→E, Z→C.
        decrypt: True → reverse shift (decrypt). Default: False (encrypt).

    Returns:
        Shifted text. Non-letter characters pass through unchanged.

    Examples:
        caesar("HELLO WORLD", shift=3)               → "KHOOR ZRUOG"
        caesar("KHOOR ZRUOG", shift=3, decrypt=True) → "HELLO WORLD"
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
def scytale(text: str, columns: int, decrypt: bool = False) -> str:
    """Scytale cipher: encrypt or decrypt text via columnar transposition.

    Use this tool whenever the user wants to:
    - encrypt text with Scytale, rails, columns or a transposition cipher
    - decrypt a Scytale-encrypted ciphertext

    The text is written row-by-row into a grid of `columns` columns,
    then read out column-by-column (encrypt), or vice versa (decrypt).

    Args:
        text:    Plaintext to encrypt, or ciphertext to decrypt.
        columns: Number of columns in the grid (= rod circumference, ≥ 1).
                 columns=3 splits "HELLOWORLD" into rows of 3 letters each.
        decrypt: True → reverse transposition (decrypt). Default: False (encrypt).

    Returns:
        Transposed (encrypted) or restored (decrypted) text.

    Examples:
        scytale("HELLOWORLD", columns=3)               → "HLODELORLW"  (approx.)
        scytale("HLODELORLW", columns=3, decrypt=True) → "HELLOWORLD"
    """
    if columns <= 0:
        raise ValueError("columns must be > 0")
    if not decrypt:
        rows = math.ceil(len(text) / columns)
        grid = [[""] * columns for _ in range(rows)]
        idx = 0
        for r in range(rows):
            for c in range(columns):
                if idx < len(text):
                    grid[r][c] = text[idx]
                    idx += 1
        result = []
        for c in range(columns):
            for r in range(rows):
                if grid[r][c]:
                    result.append(grid[r][c])
        return "".join(result)
    else:
        rows = math.ceil(len(text) / columns)
        grid = [[""] * columns for _ in range(rows)]
        idx = 0
        for c in range(columns):
            for r in range(rows):
                if idx < len(text):
                    grid[r][c] = text[idx]
                    idx += 1
        result = []
        for r in range(rows):
            for c in range(columns):
                if grid[r][c]:
                    result.append(grid[r][c])
        return "".join(result)


@mcp.tool()
def vigenere(text: str, key: str, decrypt: bool = False) -> str:
    """Vigenere cipher: encrypt or decrypt text using a repeating keyword.

    Use this tool whenever the user wants to:
    - encrypt text with Vigenère, a keyword or a polyalphabetic cipher
    - decrypt a Vigenère-encrypted ciphertext
    - apply a keyword-based shift sequence to text

    Each letter is shifted by the corresponding letter of `key` (cycling).
    Key letter A = shift 0, B = shift 1, ..., Z = shift 25.

    Args:
        text:    Plaintext to encrypt, or ciphertext to decrypt.
        key:     Keyword for shifting — only letters used, case-insensitive.
                 key="MCP" applies shifts 12 (M), 2 (C), 15 (P) in rotation.
        decrypt: True → reverse key shifts (decrypt). Default: False (encrypt).

    Returns:
        Keyword-shifted text. Non-letter characters pass through unchanged.

    Examples:
        vigenere("HELLO WORLD", key="MCP")               → "TOBNZ YZCND"
        vigenere("TOBNZ YZCND", key="MCP", decrypt=True) → "HELLO WORLD"
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


mcp.run(
    transport="streamable-http",
    host="0.0.0.0",
    port=7860,
    path="/mcp"
)
