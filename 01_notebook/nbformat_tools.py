"""Gemeinsame Hilfsfunktionen für sichere Notebook-Bearbeitungen.

Die Funktionen validieren Notebooks vor und nach Änderungen. Schreibvorgänge
erfolgen nur durch einen ausdrücklichen Aufruf von ``write_notebook``.
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Callable, Iterable

import nbformat


def read_notebook(path: str | Path) -> nbformat.NotebookNode:
    """Liest ein Notebook im Format 4 und validiert seine Struktur."""
    notebook_path = Path(path)
    with notebook_path.open(encoding="utf-8") as handle:
        notebook = nbformat.read(handle, as_version=4)
    nbformat.validate(notebook, relax_add_props=True)
    return notebook


def write_notebook(
    notebook: nbformat.NotebookNode,
    path: str | Path,
) -> None:
    """Validiert und schreibt ein Notebook an den ausdrücklich angegebenen Pfad."""
    nbformat.validate(notebook, relax_add_props=True)
    notebook_path = Path(path)
    with notebook_path.open("w", encoding="utf-8", newline="\n") as handle:
        nbformat.write(notebook, handle)


def replace_cell_source(
    notebook: nbformat.NotebookNode,
    predicate: Callable[[nbformat.NotebookNode], bool],
    source: str,
    *,
    clear_output: bool = True,
) -> int:
    """Ersetzt gezielt Zellinhalt und gibt die Anzahl der Treffer zurück."""
    matches = 0
    for cell in notebook.cells:
        if not predicate(cell):
            continue
        cell.source = source
        if clear_output and cell.cell_type == "code":
            cell.outputs = []
            cell.execution_count = None
        matches += 1
    return matches


def clear_code_outputs(notebook: nbformat.NotebookNode) -> None:
    """Entfernt veraltete Ausgaben aus allen Codezellen."""
    for cell in notebook.cells:
        if cell.cell_type == "code":
            cell.outputs = []
            cell.execution_count = None


def validate_paths(paths: Iterable[str | Path]) -> None:
    """Validiert mehrere Notebook-Pfade und meldet sie übersichtlich."""
    for path in paths:
        read_notebook(path)
        print(f"OK: {Path(path)}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Validiert Jupyter-Notebooks mit nbformat.")
    parser.add_argument("paths", nargs="+", type=Path, help="Notebook-Dateien")
    args = parser.parse_args()
    validate_paths(args.paths)


if __name__ == "__main__":
    main()
