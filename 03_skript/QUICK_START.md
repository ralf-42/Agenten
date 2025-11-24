# Quick Start: Obsidian Integration

Schnelleinstieg zur Integration deiner Obsidian-Dokumentation in die neue Projektstruktur.

---

## ✅ Was bereits erledigt ist

- ✅ Verzeichnisstruktur angelegt (`kurs/`, `dokumentation/`, `notizen/`)
- ✅ Templates erstellt (siehe `_TEMPLATE_*.md`)
- ✅ .gitignore aktualisiert (`.obsidian/` wird ignoriert)
- ✅ README.md mit vollständiger Dokumentation

---

## 🚀 Nächste Schritte

### Schritt 1: Obsidian-Integration wählen

Entscheide dich für eine der beiden Optionen:

#### Option A: 03_skript/ als Obsidian-Vault (Empfohlen)
✅ **Vorteile:** Alles in einem Projekt, Git-versioniert, portabel

**Setup:**
1. Obsidian öffnen
2. **File → Open Vault → Open folder as vault**
3. Wähle: `C:\Users\ralfb\OneDrive\Desktop\Kurse\Agenten\03_skript`
4. Fertig! 🎉

**Obsidian-Einstellungen anpassen:**
- Settings → Files & Links → Use [[Wikilinks]]: **OFF** (besser für Git)
- Settings → Editor → Strict line breaks: **ON**

#### Option B: Symlink von Haupt-Vault
✅ **Vorteile:** Zentrale Obsidian-Oberfläche für alle Projekte

**Setup (Windows als Administrator):**
```cmd
cd C:\Users\ralfb\Documents\ObsidianVault
mklink /D "Agenten_Kurs" "C:\Users\ralfb\OneDrive\Desktop\Kurse\Agenten\03_skript\kurs"
mklink /D "Agenten_Docs" "C:\Users\ralfb\OneDrive\Desktop\Kurse\Agenten\03_skript\dokumentation"
```

---

### Schritt 2: Bestehende Dateien migrieren (optional)

Falls du bereits Obsidian-Dateien für dieses Projekt hast:

**Checkliste:**
1. [ ] Liste aller zu migrierenden Dateien erstellt
2. [ ] Backup deines Obsidian-Vaults erstellt
3. [ ] Dateien kategorisiert:
   - Kursmaterialien → `kurs/`
   - Technische Docs → `dokumentation/`
   - Persönliche Notizen → `notizen/` (oder im Haupt-Vault lassen)

**Siehe:** [Obsidian_Migration_Plan.md](../Obsidian_Migration_Plan.md) für detaillierte Anleitung

---

### Schritt 3: Templates verwenden

Du findest Templates für verschiedene Dokumenttypen:

#### Neues Kurs-Modul erstellen
```bash
# Template kopieren
cp 03_skript/kurs/_TEMPLATE_Modul.md 03_skript/kurs/M07_Neues_Thema.md

# In Obsidian bearbeiten
# Platzhalter ersetzen: {NR}, {Modulname}, etc.
```

#### Technische Dokumentation erstellen
```bash
cp 03_skript/dokumentation/_TEMPLATE_Technical.md 03_skript/dokumentation/multimodal_rag.md
```

#### Persönliche Notizen erstellen
```bash
cp 03_skript/notizen/_TEMPLATE_Notes.md 03_skript/notizen/Ideas_2025.md
```

---

### Schritt 4: Workflow etablieren

#### Neues Modul erstellen (vollständiger Workflow)

1. **Notebook erstellen:**
   ```bash
   cd 01_notebook
   # Erstelle M07_New_Topic.ipynb
   ```

2. **Kurs-Dokumentation in Obsidian schreiben:**
   - Öffne `03_skript/kurs/`
   - Neue Datei: `M07_New_Topic.md`
   - Nutze Template als Basis
   - Bilder in `02_daten/02_bild/` ablegen (optional)

3. **Verknüpfung im Notebook:**
   ```python
   # Im Notebook-Header:
   # M07: New Topic
   # Dokumentation: [M07_New_Topic.md](../03_skript/kurs/M07_New_Topic.md)
   ```

4. **Git Commit:**
   ```bash
   git add 01_notebook/M07_New_Topic.ipynb
   git add 03_skript/kurs/M07_New_Topic.md
   git add 02_daten/02_bild/m07_*.png  # Falls Bilder vorhanden
   git commit -m "Add M07: New Topic with documentation"
   ```

---

## 🎯 Bestehende Dateien

Du hast bereits folgende Dateien in `03_skript/kurs/`:
- ✅ Einsteiger_LangChain.md
- ✅ Einsteiger_LangGraph.md
- ✅ Einsteiger_LangSmith.md
- ✅ Einsteiger_smolagents.md

**Empfehlung:** Öffne diese Dateien in Obsidian und prüfe:
1. Sind die Bild-Pfade korrekt? (z.B. `../02_daten/02_bild/...`)
2. Sind interne Links vorhanden? (sollten `./...` Format haben)
3. Fehlen Assets? → Nach `02_daten/02_bild/` kopieren

---

## 📚 Weitere Dokumentation

- **Vollständige Anleitung:** [README.md](./README.md)
- **Migrations-Plan:** [../Obsidian_Migration_Plan.md](../Obsidian_Migration_Plan.md)
- **Projekt-Struktur:** [../Project_Structure_Guide.md](../Project_Structure_Guide.md)

---

## 🆘 Hilfe

### Problem: Obsidian findet Bilder nicht
**Lösung:**
```markdown
<!-- Falsch -->
![Bild](assets/image.png)

<!-- Richtig -->
![Bild](../02_daten/02_bild/image.png)
```

### Problem: Links funktionieren nicht
**Lösung:**
```markdown
<!-- Falsch (Wikilinks) -->
[[andere_datei]]

<!-- Richtig (Markdown-Links) -->
[Andere Datei](./andere_datei.md)
```

### Problem: Git zeigt .obsidian/ als geändert
**Lösung:**
```bash
# Bereits erledigt! .obsidian/ ist in .gitignore
# Falls Problem besteht:
git rm -r --cached 03_skript/.obsidian/
git commit -m "Ignore Obsidian config"
```

---

## ✨ Pro-Tipps

### Obsidian-Plugins empfohlen:
- **Templater** - Erweiterte Template-Funktionen
- **Dataview** - Query-System für Notizen
- **Git** - Git-Integration direkt in Obsidian
- **Advanced Tables** - Bessere Tabellen-Bearbeitung

### Cross-Referenzen nutzen:
```markdown
<!-- In M07_New_Topic.md -->
**Voraussetzungen:** [M06: RAG Systems](./M06_RAG_Systems.md)
**Siehe auch:** [API Reference](../dokumentation/API_Reference.md)
```

### Bilder optimieren:
```bash
# Screenshots komprimieren (Linux/Mac)
convert image.png -quality 85 image_optimized.png

# Alternativ: TinyPNG (https://tinypng.com/)
```

---

**Viel Erfolg! 🚀**

Bei Fragen: Siehe [README.md](./README.md) oder [Obsidian_Migration_Plan.md](../Obsidian_Migration_Plan.md)

---

**Letzte Aktualisierung:** November 2025
