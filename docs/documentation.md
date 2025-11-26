---
layout: default
title: Dokumentation
---

# Dokumentation

Vollständige Übersicht über alle Dokumentations-Ressourcen des Agenten-Projekts.

---

## 📋 Dokumentations-Struktur

Die Dokumentation ist zweistufig aufgebaut:

1. **Quick References** (~200 Zeilen) - Kompakte Übersichten für 90% der Fälle
2. **Full Standards** (~1200 Zeilen) - Vollständige Dokumentation für Deep Dive

**💡 Empfehlung:** Starte mit QuickRef, konsultiere Full Standards nur bei Bedarf!

---

## 🚀 Quick References (Start here!)

Kompakte Übersichten mit Code-Beispielen - optimal für schnellen Einstieg.

### [LangChain QuickRef](../LangChain_QuickRef.html)
**~200 Zeilen | ~2k tokens**

- ✅ 7 MUST-HAVE Patterns mit Code-Beispielen
- ✅ Top 5 Anti-Patterns (Tabelle)
- ✅ Testing & Security (Kurzform)
- ✅ Import-Cheatsheet

**Wann verwenden?**
- Einfache Agents mit Tools
- RAG-Systeme
- Chains und Prompts
- Multimodale Anwendungen

---

### [LangGraph QuickRef](../LangGraph_QuickRef.html)
**~200 Zeilen | ~2k tokens**

- ✅ 7 MUST-HAVE Patterns für Multi-Agent-Systeme
- ✅ Top 5 Anti-Patterns (Tabelle)
- ✅ Testing & Security (Kurzform)
- ✅ Import-Cheatsheet

**Wann verwenden?**
- Multi-Step Workflows mit Verzweigungen
- Multi-Agent-Systeme (>2 Agents)
- Langlebige Sessions mit Checkpointing
- Conditional Routing
- Human-in-the-Loop Features

---

### [LangSmith QuickRef](../LangSmith_QuickRef.html)
**~150 Zeilen | ~1.5k tokens**

- ✅ 7 MUST-HAVE Patterns für Monitoring & Debugging
- ✅ Top 5 Anti-Patterns (Tabelle)
- ✅ Testing & Security (Kurzform)
- ✅ Import-Cheatsheet

**Wann verwenden?**
- Immer in Development (Debugging)
- Essential in Production (Monitoring)
- Für systematische Evaluation

---

## 📖 Full Standards (Deep Dive)

Vollständige Dokumentation mit Erklärungen, Testing, Security - für fortgeschrittene Themen.

### [LangChain Standards Full](../LangChain_Standards_Full.html)
**~1200 Zeilen | ~12k tokens**

**Inhalt:**
- Alle 7 MUST-HAVE Features (detailliert)
- Anti-Patterns mit Lösungsstrategien
- Unit & Integration Testing
- Security Best Practices
- Migration von 0.x → 1.0+
- Production-Ready Patterns

---

### [LangGraph Standards Full](../LangGraph_Standards_Full.html)
**~1200 Zeilen | ~12k tokens**

**Inhalt:**
- Multi-Agent Architecturen (Supervisor, Hierarchical, Collaborative)
- State Management & Checkpointing
- Conditional Routing & Loops
- Human-in-the-Loop Patterns
- Testing & Debugging
- Security & Error Handling

---

### [LangSmith Standards Full](../LangSmith_Standards_Full.html)
**~1200 Zeilen | ~15k tokens**

**Inhalt:**
- Setup & Konfiguration
- Tracing & Monitoring
- Evaluation & Datasets
- Production Deployment
- Security & Privacy
- Cost Optimization

---

## 📓 Guides

### [Notebook Template Guide](../Notebook_Template_Guide.html)
**Standard-Struktur für ALLE neuen Notebooks**

**Inhalt:**
- ✅ Quick Template (Copy & Paste)
- ✅ Standard-Struktur (Header, Setup, Kapitel, Aufgaben)
- ✅ Emoji-Konventionen
- ✅ Code-Patterns (Imports, LLM-Init, Tools, Agents)
- ✅ Didaktische Patterns (Vergleiche, Visualisierungen)
- ✅ Checkliste für neue Notebooks
- ✅ Referenz-Notebooks

**Wann verwenden?**
- Vor dem Erstellen eines neuen Notebooks
- Beim Refactoring bestehender Notebooks
- Als Referenz für konsistente Formatierung

---

### [Project Structure Guide](../Project_Structure_Guide.html)
**Standard-Verzeichnisstruktur für ALLE neuen Projekte**

**Inhalt:**
- ✅ Komplette Verzeichnisstruktur (01_notebook, 02_daten, etc.)
- ✅ Detaillierte Beschreibung jedes Verzeichnisses
- ✅ Namenskonventionen und Best Practices
- ✅ .gitignore Template
- ✅ Setup-Anleitung
- ✅ Migration bestehender Projekte
- ✅ Checkliste für neue Projekte

**Wann verwenden?**
- Beim Erstellen eines neuen Projekts
- Beim Umstrukturieren bestehender Projekte
- Als Referenz für Ordnerorganisation

---

## 🎯 Entscheidungshilfe

**Welches Dokument soll ich konsultieren?**

| Task | Dokument |
|------|----------|
| Einfacher Agent mit Tools | [LangChain QuickRef](../LangChain_QuickRef.html) |
| RAG-System bauen | [LangChain QuickRef](../LangChain_QuickRef.html) |
| Multi-Agent-System (>2 Agents) | [LangGraph QuickRef](../LangGraph_QuickRef.html) |
| Workflow mit Verzweigungen | [LangGraph QuickRef](../LangGraph_QuickRef.html) |
| Debugging & Monitoring | [LangSmith QuickRef](../LangSmith_QuickRef.html) |
| Production Deployment | [LangSmith Standards Full](../LangSmith_Standards_Full.html) |
| Neues Notebook erstellen | [Notebook Template Guide](../Notebook_Template_Guide.html) |
| Neues Projekt aufsetzen | [Project Structure Guide](../Project_Structure_Guide.html) |
| Migration 0.x → 1.0+ | [LangChain Standards Full](../LangChain_Standards_Full.html) |

---

## 📚 Verwendungsrichtlinien

### Für neue Implementierungen

1. **Projekt-Setup:** [Project Structure Guide](../Project_Structure_Guide.html)
2. **Notebook erstellen:** [Notebook Template Guide](../Notebook_Template_Guide.html)
3. **Code schreiben:**
   - LangChain: [LangChain QuickRef](../LangChain_QuickRef.html)
   - LangGraph: [LangGraph QuickRef](../LangGraph_QuickRef.html)
   - LangSmith: [LangSmith QuickRef](../LangSmith_QuickRef.html)
4. **Bei Detailfragen:** Full Standards konsultieren

### Für bestehende Projekte

1. **Migration:** [LangChain Standards Full](../LangChain_Standards_Full.html) (ALT/NEU-Vergleiche)
2. **Refactoring:** Quick Refs für moderne Patterns
3. **Testing:** Full Standards für Unit & Integration Tests
4. **Security:** Full Standards für Production-Ready Code

---

## ⚡ Performance-Optimierung

**Quick Refs vs Full Standards:**

| Metrik | Quick Refs | Full Standards |
|--------|------------|----------------|
| **Tokens gesamt** | ~5.5k | ~39k |
| **Einsparung** | 86% weniger! | - |
| **Lesezeit** | ~5 Min | ~30 Min |
| **Anwendungsfälle** | 90% der Fälle | 10% (Deep Dive) |

**💡 Best Practice:** Nutze Quick Refs für schnelle Lookups, Full Standards für tiefes Verständnis!

---

## 🔗 Externe Ressourcen

- [LangChain Documentation](https://python.langchain.com/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangSmith Documentation](https://docs.smith.langchain.com/)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [LangChain v1.0 Migration Guide](https://docs.langchain.com/oss/python/migrate/langchain-v1)

---

## 📞 Support

- **Quick Start:** [docs/quickstart.html](quickstart.html)
- **Code Standards:** [docs/standards.html](standards.html)
- **GitHub Issues:** [github.com/ralf-42/Agenten/issues](https://github.com/ralf-42/Agenten/issues)

---

> 💡 **Tipp:** Nutze die Quick References für maximale Produktivität!
