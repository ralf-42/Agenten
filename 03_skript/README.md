# 03_skript - Dokumentation & Kursmaterialien

Dieses Verzeichnis enthält alle Markdown-Dokumentationen, Kursmaterialien und Notizen für das Projekt.

## Verzeichnisstruktur

```
03_skript/
├── kurs/                   # Kursmaterialien & Lektionen
│   ├── Einsteiger_LangChain.md
│   ├── Einsteiger_LangGraph.md
│   ├── Einsteiger_LangSmith.md
│   ├── Einsteiger_smolagents.md
│   └── ...
│
├── dokumentation/         # Technische Projekt-Dokumentation
│   ├── Architecture.md   # System-Architektur
│   ├── API_Reference.md  # API-Dokumentation
│   └── Troubleshooting.md
│
├── notizen/              # Persönliche Notizen & Ideen
│   ├── Ideas.md          # Feature-Ideen
│   ├── Research.md       # Recherche-Notizen
│   └── TODO.md           # Offene Aufgaben
│
├── _misc/                # Sonstige Dateien
│
└── README.md             # Diese Datei
```

## Verwendungszweck

### 📚 `kurs/` - Kursmaterialien
**Zweck:** Lektionen, Übungen, Erklärungen für Kursteilnehmer

**Inhalt:**
- Modul-Dateien (Einsteiger_LangChain.md, Einsteiger_LangGraph.md, etc.)
- Übungsaufgaben und Lösungen
- Zusammenfassungen und Cheatsheets
- Bilder/Diagramme (eingebettet oder in `02_daten/02_bild/`)

**Namenskonvention:**
- `M{Nr}_{Thema}.md` (z.B. `M04_Agents.md`)
- Orientiert sich an Notebook-Nummern (M04 → M04a_Tool_Calling.ipynb)

**Versionskontrolle:** ✅ Git-tracked (wichtig für Kurs-Versionen)

---

### 🔧 `dokumentation/` - Technische Dokumentation
**Zweck:** Technische Details, Architektur, API-Referenzen

**Inhalt:**
- Architecture.md - System-Design, Komponenten
- API_Reference.md - Dokumentation der `04_modul/genai_lib/`
- Troubleshooting.md - Häufige Fehler und Lösungen
- Setup_Guides.md - Installation, Konfiguration

**Versionskontrolle:** ✅ Git-tracked (entwickelt sich mit Code)

---

### 💡 `notizen/` - Persönliche Notizen
**Zweck:** Ideensammlung, Forschung, temporäre Notizen

**Inhalt:**
- Ideas.md - Feature-Ideen, Verbesserungsvorschläge
- Research.md - Recherche zu neuen Technologien
- TODO.md - Offene Aufgaben und Backlog
- Meeting_Notes.md - Besprechungsnotizen

**Versionskontrolle:** ⚠️ Optional (siehe .gitignore)
- Kann ignoriert werden, wenn rein persönlich
- Kann getrackt werden, wenn team-relevant

---

## Integration mit Obsidian

### Option 1: Obsidian-Vault im Projekt (Empfohlen)
```
Obsidian Vault: C:\Users\ralfb\OneDrive\Desktop\Kurse\Agenten\03_skript\
```
- Vorteil: Alles in einem Projekt
- Nachteil: Pro Projekt ein eigenes Vault

### Option 2: Symlink von zentralem Vault
```bash
# In deinem Haupt-Obsidian-Vault:
mklink /D "Agenten" "C:\Users\ralfb\OneDrive\Desktop\Kurse\Agenten\03_skript"
```
- Vorteil: Zentrale Obsidian-Oberfläche
- Nachteil: Komplexere Setup

### Option 3: Hybrid (Empfehlung für dich)
- `kurs/` und `dokumentation/` → im Projekt (Git-tracked)
- Persönliche Notizen → im Haupt-Obsidian-Vault
- Symlink für schnellen Zugriff

---

## Workflow-Empfehlungen

### Beim Erstellen eines neuen Moduls:
1. Notebook erstellen: `01_notebook/M{Nr}_{Thema}.ipynb`
2. Kurs-Doku erstellen: `03_skript/kurs/M{Nr}_{Thema}.md`
3. Verknüpfung in Notebook: Link zur MD-Datei im Header

### Beim Dokumentieren von Code:
1. Code schreiben: `04_modul/genai_lib/{modul}.py`
2. API-Doku aktualisieren: `03_skript/dokumentation/API_Reference.md`
3. Docstrings im Code selbst schreiben

### Bei Kurs-Materialien:
1. Entwurf in `notizen/` (optional)
2. Finalisierung in `kurs/`
3. Bilder/Assets in `02_daten/02_bild/` ablegen (optional)
4. Git commit für Versionierung

---

## Best Practices

### Markdown-Konventionen
- Heading-Hierarchie: # → ## → ### (nicht überspringen)
- Code-Blöcke: Mit Sprach-Identifier (\`\`\`python)
- Bilder: Relative oder absolute Pfade (`![](../02_daten/02_bild/image.png)`)
- Interne Links: `[Link](./andere_datei.md)`

### Asset-Verwaltung
- Bilder zentral in `02_daten/02_bild/` ablegen
- Format: PNG für Screenshots, SVG für Diagramme
- Namenskonvention: `{modul}_{beschreibung}.png`
- Beispiel: `langchain_agent_workflow.png`
- Max. Dateigröße: 2 MB (sonst komprimieren)

### Git-Workflow
```bash
# Kurs-Material aktualisiert
git add 03_skript/kurs/Einsteiger_LangChain.md
git add 02_daten/02_bild/langchain_workflow.png
git commit -m "Update: Add LangChain workflow diagram"

# Dokumentation erweitert
git add 03_skript/dokumentation/API_Reference.md
git commit -m "Docs: Add multimodal_rag.py API reference"
```

---

## Migration von bestehendem Obsidian-Vault

Siehe **`Obsidian_Migration_Plan.md`** für detaillierte Anleitung.

---

**Letzte Aktualisierung:** November 2025
**Maintainer:** Ralf
