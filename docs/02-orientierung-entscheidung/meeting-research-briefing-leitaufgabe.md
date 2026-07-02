---
layout: default
title: Meeting- & Research-Briefing-Agent
parent: "Orientierung & Entscheidung"
nav_order: 4
description: "Zielbild und roter Faden: quellengebundenes Meeting- & Research-Briefing mit RAG, Evaluation und Freigabe"
has_toc: true
---

# Meeting- & Research-Briefing-Agent
{: .no_toc }

Ein Meeting- & Research-Briefing-Agent hilft, wenn ein Team viele Projektunterlagen durchsuchen muss: Protokolle, Entscheidungen, Risiken, offene Fragen und passende Fachartikel. Er findet relevante Passagen, fasst sie zusammen und zeigt, worauf sich seine Aussagen stützen.

Wichtig ist die Grenze: Der Agent entscheidet nicht selbst über das Projekt. Er bereitet ein Briefing vor. Retrieval liefert Belege über ein Evidence Tool, Structured Output macht die Antwort prüfbar, Human-in-the-Loop stoppt unsichere Ausgaben. So wird aus einem Chatbot mit Werkzeugen ein kontrolliertes Arbeitssystem.

Drei Fähigkeiten ziehen sich durch den Bauplan: Der Agent muss **planen** (welches Tool, welche Route, welcher Zustand gilt gerade), **handeln** (Tools ausführen, Evidenz abrufen, einen Workflow durchlaufen) und **prüfen** (Freigabe, Security, Evaluation vor jeder folgenreichen Ausgabe). RAG ist dabei kein Selbstzweck. Es ist ein **Evidence Tool**: eine kontrollierte Fähigkeit, die der Agent gezielt nutzt.

Die Leitfrage lautet:

> Wie entsteht ein Agent, der Fragen zu Protokollen, Entscheidungen, Risiken und Fachartikeln beantwortet, relevante Passagen findet, Aussagen nachvollziehbar belegt und bei Unsicherheit kontrolliert eskaliert?

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Ausgangssituation

Mara Vogt leitet das interne Vorhaben "Projekt Kompass" bei der fiktiven Nordlicht Software GmbH. Vor Jour-fixe-Terminen liest sie Meeting-Protokolle, Entscheidungsvorlagen, Risikolisten und Fachartikel. Oft sucht sie nicht ein einzelnes Stichwort, sondern den aktuellen Stand: Was wurde entschieden? Welche Risiken sind offen? Wo widersprechen sich ältere und neuere Unterlagen?

Eine einfache Volltextsuche hilft nur begrenzt. Sie liefert zu viele Treffer, übersieht semantisch passende Stellen oder zeigt nicht, dass zwei Dokumente unterschiedliche Stände beschreiben.

Das Ziel ist kein Agent, der beliebige Antworten erzeugt. Der Nutzen entsteht erst, wenn das System einen begrenzten Korpus nutzt, Quellen sichtbar macht und fehlende Evidenz nicht durch Modellwissen ersetzt. Der Agent muss relevante Passagen finden, Widersprüche erkennen, Antworten strukturieren und Grenzen offenlegen.

<img src="https://raw.githubusercontent.com/ralf-42/Agenten/main/07_image/mara.png" class="logo" width="950"/>
<p><font color='black' size="2">
KI-generiertes Bild
</font></p>

## Zielbild

Ein brauchbarer Meeting- & Research-Briefing-Agent lädt einen Projektkorpus reproduzierbar, zerlegt PDF-Dokumente in Passagen und verarbeitet Fragen in natürlicher Sprache. Die Antwort enthält eine Zusammenfassung, Quellentitel, zitierte Textpassagen, eine Sicherheitseinschätzung und einen Hinweis, wenn die Frage nicht aus dem Korpus beantwortet werden kann.

In der Praxis relevant, wenn: Projektunterlagen häufig durchsucht werden, Quellenpflicht besteht und plausibel klingende Antworten ohne Beleg ein Risiko wären. Nicht geeignet, wenn: die Aufgabe gar keinen stabilen Dokumentenkorpus hat oder wenn eine finale fachliche Entscheidung ohne menschliche Prüfung erwartet wird.

Das Zielbild lässt sich in fünf Ausbaustufen lesen:

| Stufe | Was der Agent bekommt | Profilbezug |
|---|---|---|
| Einfacher Agent | Such-Tool, erster Korpuszugriff und nachvollziehbare Tool-Entscheidungen | Planen, Handeln |
| Robuster Agent | Antwortschema, Quellenpflicht, Fehlerbehandlung und Multi-Tool-Logik | Planen, Handeln, Prüfen |
| Kontrollierter Agent | StateGraph, Routing nach Fragetyp, Tool-Gating und Security-Leitplanken | Planen, Prüfen |
| Wissensfähiger Agent | RAG als Evidence Tool mit Vektordatenbank, semantische Suche, Eval-Set und Regression-Check | Handeln, Prüfen |
| Kooperierendes System | HITL, Memory, Supervisor und spezialisierte Worker | Planen, Handeln, Prüfen |

## Korpus und Metadaten

Der Korpus sollte klein genug sein, um verstanden zu werden, und sauber genug, um Evaluation zu ermöglichen. Zehn bis zwanzig PDF-Dokumente aus einem klaren Themenfeld reichen für einen ersten Prototyp oft aus. Ein größerer, aber unsauberer Bestand verschlechtert die Lern- und Prüfbarkeit: Retrieval-Fehler lassen sich dann schwer von Datenproblemen unterscheiden.

Geeignete Quellen sind Meeting-Protokolle, Entscheidungsvorlagen, Risikolisten, Rollenlisten sowie öffentlich zugängliche Fachartikel als Recherche-Hintergrund. Für den Kurs werden reale Projektdaten durch synthetische, fiktive Beispieldokumente ersetzt — urheberrechtlich geschützte Lehrbücher, echte interne Dokumente oder personenbezogene Daten eignen sich nicht für eine erste Version.

Für jede Passage sollten mindestens diese Metadaten verfügbar sein:

| Feld | Bedeutung |
|---|---|
| `dokument_id` | stabile interne ID |
| `titel` | Titel des Dokuments |
| `autor_oder_organisation` | Autor, Institution oder Herausgeber |
| `jahr` | Veröffentlichungsjahr, soweit vorhanden |
| `dokumenttyp` | Paper, Bericht, Guidance oder Kurztext |
| `dateiname` | Datei im Korpus |
| `quelle_url` | reproduzierbare Abrufquelle |
| `seite` | Seite oder Seitenbereich, soweit verfügbar |
| `passage` | zitierfähiger Textausschnitt |
| `thema` | grobe fachliche Einordnung |

## Antwortschema

Freitext reicht für diesen Agenten nicht aus. Ohne Schema bleibt unklar, ob eine Antwort belegt ist, wie sicher sie ist und ob sie eine Korpusgrenze überschreitet. Ein minimales Antwortformat trennt deshalb Antwort, Quellen, Sicherheit und Hinweis.

```python
from pydantic import BaseModel, Field


class Quellenangabe(BaseModel):
    dokument: str = Field(description="Dateiname oder Titel der Quelle")
    passage: str = Field(description="Zitierter Textausschnitt, maximal 2 Sätze")


class BriefingAntwort(BaseModel):
    antwort: str = Field(description="Synthese-Antwort auf die Frage")
    quellen: list[Quellenangabe] = Field(description="Mindestens eine Quellenangabe")
    sicherheit: str = Field(description="hoch / mittel / niedrig")
    hinweis: str = Field(description="'Nicht im Korpus' wenn out-of-scope")
```

Typischer Fehler: Das Modell wird nur gebeten, „mit Quellen zu antworten". Das klingt plausibel, erzwingt aber keine prüfbare Struktur. Erst ein Schema macht sichtbar, ob eine Antwort ohne Quelle, mit niedriger Sicherheit oder außerhalb des Korpus entstanden ist.

## Leitplanken

Der Meeting- & Research-Briefing-Agent bleibt ein Assistenzsystem für Briefing und Recherche. Diese Grenze ist wichtiger als die konkrete Modellwahl. Wenn das System fehlende Evidenz frei ergänzt oder Entscheidungen erfindet, ist es auch mit guter Architektur unbrauchbar.

Die Leitplanken setzen **Prüfen** praktisch um. Sie legen fest, wann der Agent stoppt, eskaliert oder eine Ausgabe verweigert, statt eine plausible Antwort zu erzwingen.

| Leitplanke | Bedeutung |
|---|---|
| Quellenpflicht | Jede fachliche Aussage braucht eine nachvollziehbare Quelle oder den Hinweis "Nicht im Korpus". |
| Out-of-Corpus-Regel | Fehlendes Wissen wird nicht frei ergänzt. |
| HITL bei Unsicherheit | Unsichere, folgenreiche oder regulierte Aussagen werden vor der finalen Ausgabe geprüft. |
| Tool-Grenzen | Tools haben klar definierte Aufgaben und keine offenen Seiteneffekte ohne Freigabe. |
| Datenschutz | Keine personenbezogenen, vertraulichen oder regulierten Echtdaten im Korpus. |
| Bewusstes Logging | Traces und Eval-Daten dürfen keine vertraulichen Inhalte unbedacht speichern. |
| Evaluation vor Optimierung | Verbesserungen werden gegen ein Eval-Set geprüft, nicht nur nach Bauchgefühl bewertet. |

## Evaluation

Evaluation prüft, ob relevante Passagen gefunden werden und Antworten im belegbaren Rahmen bleiben. Eine plausibel klingende Antwort zählt nicht als Erfolg, wenn sie die falsche Quelle nutzt oder eine Korpusgrenze überschreitet.

Ein erstes Eval-Set sollte verschiedene Fragetypen enthalten:

| Fragetyp | Erwartung |
|---|---|
| Faktische Frage | richtige Quelle und passende Passage |
| Methodenfrage | korrekt erkannte Methode oder Empfehlung |
| Vergleichsfrage | zwei Quellen sauber gegenübergestellt |
| Inferenzfrage | begründete Zusammenführung mehrerer Passagen |
| Negativbeispiel | Antwort "Nicht im Korpus" |

Für eine erste Version ist eine pragmatische Schwelle sinnvoll: Die semantische Suche findet bei mindestens 70 Prozent der Testfragen die relevante Passage unter den Top-3-Treffern. Zusätzlich enthält jede finale Antwort mindestens eine Quelle oder verweigert kontrolliert.

## Vom Einzelagenten zum Multi-Agent-System

Der Meeting- & Research-Briefing-Agent beginnt nicht als Multi-Agent-System. Zuerst muss der einfache Pfad funktionieren: Korpus laden, Passage finden, Antwort strukturieren, Quelle belegen. Erst danach lohnt sich Rollenaufteilung.

Eine sinnvolle Multi-Agent-Variante trennt nicht künstlich ähnliche Aufgaben, sondern unterschiedliche Dokument- oder Fragetypen:

```text
Supervisor
├── Tabellen-Worker   -> verarbeitet Daten, Tabellen und strukturierte Abschnitte
└── Fließtext-Worker  -> verarbeitet Prosa, Argumentationen und Zusammenfassungen
```

Der Supervisor entscheidet nach Fragetyp, welche Rolle gebraucht wird. Bei Unsicherheit oder fehlender Evidenz geht die Antwort vor der Ausgabe in eine menschliche Prüfung.

## Capstone und Transfer

Ein vollständiger Prototyp ist erreicht, wenn ein eigener oder bereitgestellter Korpus reproduzierbar geladen wird und die semantische Suche relevante Passagen besser findet als eine naive Stichwortsuche. Antworten nutzen ein strukturiertes Schema mit Quellen, Sicherheit und Hinweis.

Außerdem müssen mindestens drei Tools, ein StateGraph oder klarer Agenten-Workflow sowie mindestens ein Gate oder HITL-Schritt erkennbar sein. Die Evaluation prüft Positivfälle und mindestens einen Negativfall, bei dem das System korrekt ablehnt oder eskaliert. Ebenso wichtig ist die Reflexion: Welche Grenze wurde sichtbar, welche Quelle fehlte, welcher Eval-Fall scheiterte — und wann darf der Agent nicht autonom handeln?

Der Bauplan lässt sich auf andere Domänen übertragen. Eine Legal-Research-Variante ergänzt Aktenzeichen, Fundstellen und strengere Freigaberegeln. Eine Compliance-Variante braucht Audit-Trail und Rollenklärung. Ein reiner Fachartikel-Assistent verschiebt den Schwerpunkt zurück auf klassische RAG-Recherche ohne Projektkorpus. Die Architektur bleibt ähnlich, aber Korpus, Metadaten und Risiken ändern sich.

| Transferfall | Rolle |
|---|---|
| Fachartikel-Assistent | reine RAG-Recherche ohne Projektkontext, frühere Kursversion als Transferbeispiel |
| Legal-Recherche-Assistent | regulierte Recherche, Fundstellenpflicht, HITL und Quellenqualität |
| Compliance-Prüfung | regulierte Branchen, Audit-Trail und Out-of-Corpus-Regel |
| Support-Triage | Klassifikation, Tool-Use, HITL und Routing |
| Code-Review-Agent | strukturierte Analyse, Quellen-/Diff-Bezug und Security |

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Lohnt sich KI?]({{ '/02-orientierung-entscheidung/lohnt-es-sich.html' | relative_url }}) | Wann ist ein KI- oder Agentenvorhaben überhaupt sinnvoll? |
| [Aufgabenklassen & Lösungswege]({{ '/02-orientierung-entscheidung/aufgabenklassen-und-loesungswege.html' | relative_url }}) | Wann reicht Prompting, wann braucht es RAG, Workflow oder Agent? |
| [Terminologie]({{ '/02-orientierung-entscheidung/terminologie.html' | relative_url }}) | Welche Begriffe werden für Tools, State, Memory und Guardrails verwendet? |
| [Meeting- & Research-Briefing-Agent Workshop]({{ '/08-deployment-betrieb/meeting-research-briefing-agent.html' | relative_url }}) | Wie wird das Zielbild als zusammenhängendes Praxisprojekt umgesetzt? |

---

**Version:** 2.1<br>
**Stand:** Juli 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
