---
layout: default
title: Lohnt es sich überhaupt?
parent: Konzepte
nav_order: 0
description: Strukturierte Einschätzung vor dem Start eines KI-Projekts — Machbarkeit, Nutzen, Risiken und Erwartungsmanagement.
has_toc: true
---

# Lohnt es sich überhaupt?
{: .no_toc }

> **Vor dem Bau kommt die Frage.**     
> Ein Agenten-System zu bauen ist keine Antwort — es ist ein Mittel. Dieses Dokument hilft zu klären, ob KI das richtige Mittel ist.

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Ziel dieses Dokuments

Dieses Dokument beantwortet die Frage **vor** der Architekturentscheidung:

> *Ist ein KI-Projekt hier sinnvoll, umsetzbar und verantwortbar?*

Es ergänzt [Welches Werkzeug?](./Aufgabenklassen_und_Loesungswege.html) — das die Frage nach dem *richtigen* Lösungsweg beantwortet, sobald KI grundsätzlich infrage kommt.

**Typische Anwendungsfälle für dieses Dokument:**
- Bewertung eines Projektvorschlags vor der Umsetzung
- Vorbereitung auf Stakeholder-Gespräche
- Entscheidung zwischen KI-Lösung und klassischem Ansatz

---

## 1. Problemklärung

Bevor ein KI-Projekt bewertet werden kann, muss das Problem selbst klar sein.

### Leitfragen

- **Was genau soll gelöst werden?** — Nicht: "Wir wollen KI nutzen", sondern: "Wir wollen X automatisieren / beschleunigen / verbessern"
- **Wie sieht der heutige Prozess aus?** — Wer macht was, wie oft, wie lange?
- **Woran erkennt man Erfolg?** — Gibt es eine messbare Größe (Zeit, Fehlerrate, Volumen, Kosten)?
- **Wer nutzt das System — und wie?** — Endnutzer, Fachbereich, automatisierter Hintergrundprozess?

### Warnsignale

- Das Problem ist noch nicht klar formulierbar → erst Problemanalyse, dann KI
- Erfolg lässt sich nicht messen → Erwartungen können nicht geprüft werden
- "Wir wollen mal schauen, was KI kann" → kein Projekt, sondern ein Experiment (niedrigere Anforderungen, aber anderer Rahmen)

---

## 2. Datengrundlage

KI-Systeme sind nur so gut wie die Daten, auf denen sie arbeiten.

### Leitfragen

- **Welche Daten werden benötigt?** — Texte, Dokumente, strukturierte Daten, Bilder?
- **Sind die Daten vorhanden?** — Intern verfügbar, zugänglich, in nutzbarem Format?
- **Ausreichende Qualität?** — Vollständig, aktuell, konsistent, repräsentativ?
- **Datenschutz und Zugriff?** — Dürfen die Daten ein KI-System passieren? Cloud oder lokal?

### Typische Probleme

| Problem | Konsequenz |
|---|---|
| Daten vorhanden, aber unstrukturiert | Vorverarbeitung nötig — oft unterschätzter Aufwand |
| Daten in verschiedenen Formaten/Quellen | Integrations-Komplexität steigt stark |
| Sensible oder personenbezogene Daten | Cloud-Modelle ggf. ausgeschlossen → lokale Alternativen prüfen |
| Zu wenig Daten für Evaluation | Qualität des Systems nicht nachweisbar |

> Weiterführend: [Evaluation & Testing](./Evaluation_Testing.html) — Abschnitt Dataset-Anforderungen

---

## 3. Nutzeneinschätzung

### Welchen Mehrwert bringt KI konkret?

Mögliche Nutzenkategorien:

| Kategorie | Beispiele |
|---|---|
| **Zeitersparnis** | Recherche, Zusammenfassungen, Erstentwürfe |
| **Qualitätsverbesserung** | Konsistenz, Vollständigkeit, Fehlerreduktion |
| **Skalierung** | Mehr Volumen ohne mehr Personal |
| **Neue Fähigkeiten** | Aufgaben, die vorher nicht möglich waren |

### Grobe Kosten-Einschätzung

Vor dem Start sollte eine realistische Schätzung der laufenden Kosten vorliegen:

- **API-Kosten:** Token-Verbrauch × Modellpreis (abhängig von Modellwahl und Volumen)
- **Infrastruktur:** Hosting, Vektordatenbank, Monitoring
- **Entwicklung und Betrieb:** Initialaufwand + laufende Wartung

**Faustregeln:**
- Einfacher Agent mit GPT-4o-mini: sehr geringe API-Kosten, auch bei hohem Volumen
- Komplexes Multi-Agent-System mit o3: deutlich höhere Kosten pro Anfrage
- Produktionssystem: Monitoring (LangSmith) und Infrastruktur einplanen

### Vergleich mit dem Status quo

> *Wäre ein klassischer Ansatz (regelbasiert, manuell, Standard-Software) genauso gut oder besser?*

KI lohnt sich besonders, wenn:
- Die Aufgabe natürliche Sprache oder unstrukturierte Eingaben verarbeitet
- Der Lösungsweg nicht vollständig im Voraus definierbar ist
- Das Volumen zu hoch für manuelle Bearbeitung ist

KI lohnt sich **nicht**, wenn:
- Eine einfache Regel oder ein Skript die Aufgabe löst
- Der Prozess vollständig deterministisch ist
- Fehler nicht tolerierbar sind und keine Prüfinstanz vorgesehen ist

---

## 4. Risikoeinschätzung

### Technische Risiken

| Risiko | Beschreibung | Gegenmaßnahme |
|---|---|---|
| **Halluzination** | LLM gibt plausibel klingende, aber falsche Antworten | Evaluation, Human-in-the-Loop bei kritischen Entscheidungen |
| **Qualitätsdrift** | System funktioniert initial gut, verschlechtert sich mit neuen Daten | Regression Testing, Monitoring |
| **Latenz** | Komplexe Agenten-Pipelines können langsam sein | Modellwahl, Caching, asynchrone Verarbeitung |
| **Kostenexplosion** | Unkontrollierter Token-Verbrauch bei schlechten Prompts oder Loops | `recursion_limit`, LangSmith Kosten-Tracking |

### Organisatorische Risiken

| Risiko | Beschreibung |
|---|---|
| **Überhöhte Erwartungen** | Stakeholder erwarten 100 % Genauigkeit — Enttäuschung vorprogrammiert |
| **Fehlende Akzeptanz** | Nutzer vertrauen dem System nicht oder umgehen es |
| **Abhängigkeit von Anbietern** | Modell-Updates oder API-Änderungen können das System brechen |
| **Wissensverlust** | KI übernimmt Aufgaben, ohne dass das Wissen im Team bleibt |

### Regulatorische Risiken

Die EU KI-Verordnung (AI Act) klassifiziert KI-Systeme nach Risikostufe. Hochrisiko-Systeme (z. B. im HR-, Kredit- oder Gesundheitsbereich) unterliegen strengen Anforderungen.

> Weiterführend: [EU AI Act](../regulatory/EU_AI_Act.html), [Ethik & GenAI](../regulatory/Ethik_und_GenAI.html), [Digitale Souveränität](../regulatory/Digitale_Souveraenitat.html)

---

## 5. Erwartungen realistisch einordnen

### Was KI-Agenten können

- Texte verstehen, zusammenfassen, übersetzen, generieren
- Informationen aus großen Dokumentenmengen extrahieren (RAG)
- Mehrschrittige Aufgaben mit Tools ausführen (Suche, APIs, Code)
- Entscheidungen in Routinefällen vorbereiten oder treffen

### Was KI-Agenten nicht können

- Garantierte, reproduzierbare Ergebnisse (keine deterministische Logik)
- Selbstständig lernen aus Nutzerfeedback (ohne explizites Fine-Tuning)
- Verantwortung übernehmen — rechtlich und ethisch bleibt der Mensch verantwortlich
- Domänenwissen ersetzen — Expertenprüfung bei kritischen Outputs bleibt nötig

### Kommunikation gegenüber Stakeholdern

| Erwartung (unrealistisch) | Realistische Einordnung |
|---|---|
| "Das System macht keine Fehler" | Fehlerrate messbar reduzieren — nicht auf null |
| "Das System ist sofort fertig" | Prototyp schnell — Production-Ready braucht Zeit |
| "KI ersetzt das Team" | KI unterstützt das Team — Expertise bleibt nötig |
| "Das System verbessert sich von selbst" | Nur mit aktivem Monitoring und Pflege |

---

## 6. Go / No-Go Checkliste

### Problemklärung
- [ ] Das Problem ist klar und konkret formuliert
- [ ] Erfolg ist messbar (KPI oder Akzeptanzkriterium definiert)
- [ ] Nutzende und Nutzungskontext sind bekannt

### Datengrundlage
- [ ] Benötigte Daten sind vorhanden und zugänglich
- [ ] Datenqualität ist ausreichend (vollständig, aktuell, repräsentativ)
- [ ] Datenschutzanforderungen sind geprüft (Cloud vs. lokal)

### Nutzen
- [ ] Der Mehrwert gegenüber dem Status quo ist konkret benennbar
- [ ] Kosten (API, Infrastruktur, Entwicklung) sind grob abgeschätzt
- [ ] KI ist die richtige Wahl — kein einfacherer Ansatz löst das Problem besser

### Risiken
- [ ] Technische Risiken identifiziert und Gegenmaßnahmen geplant
- [ ] Organisatorische Risiken bekannt (Akzeptanz, Abhängigkeiten)
- [ ] Regulatorische Einordnung geprüft (AI Act Risikostufe)

### Erwartungen
- [ ] Stakeholder haben realistische Erwartungen (kein 100 %-Versprechen)
- [ ] Human-in-the-Loop für kritische Entscheidungen eingeplant
- [ ] Plan für Monitoring und laufende Pflege vorhanden

### Ergebnis

| Offene Punkte | Empfehlung |
|---|---|
| 0–2 | 🟢 Go — Projekt starten |
| 3–5 | 🟡 Bedingt — offene Punkte klären, dann starten |
| 6+ | 🔴 No-Go — Grundlagen fehlen, erst Voraussetzungen schaffen |

---

## Abgrenzung zu verwandten Dokumenten

| Dokument                                                           | Frage                                                             |
| ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Welches Werkzeug?](./Aufgabenklassen_und_Loesungswege.html)       | Chat, Workflow, RAG oder Agent — was ist der richtige Lösungsweg? |
| [Evaluation & Testing](./Evaluation_Testing.html)                  | Wie wird die Qualität eines fertigen Systems gemessen?            |
| [Agent Security](./Agent_Security.html)                            | Wie wird ein Agenten-System gegen Angriffe abgesichert?           |
| [EU AI Act](../regulatory/EU_AI_Act.html)                          | Welche regulatorischen Anforderungen gelten?                      |
| [Digitale Souveränität](../regulatory/Digitale_Souveraenitat.html) | Welche Abhängigkeiten entstehen durch Cloud-Modelle?              |

---

**Version:** 1.0
**Stand:** März 2026
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
