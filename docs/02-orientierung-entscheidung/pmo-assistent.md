---
layout: default
title: PMO-Assistent
parent: Orientierung & Entscheidung
nav_order: 4
description: "Zielbild und roter Faden: PMO-Assistent für Meeting-Vorbereitung, Aufgabenverfolgung und Statusreporting"
has_toc: true
---

# PMO-Assistent
{: .no_toc }

Der PMO-Assistent unterstützt die Meeting-Vorbereitung, die Aufbereitung von Besprechungs- und Projektdokumenten, die Aufgabenverfolgung sowie die Erstellung quellengebundener Briefings und Statusübersichten. Er hilft, wenn ein Team viele Projektunterlagen durchsuchen muss: Protokolle, Entscheidungen, Risiken, Aufgaben und offene Fragen. Er findet relevante Passagen, fasst sie zusammen und zeigt, worauf sich seine Aussagen stützen.

Wichtig ist die Grenze: Der Agent entscheidet nicht selbst über das Projekt und ersetzt kein vollständiges PMO-System. Er bereitet Meetings, Aufgabenstände und Statusinformationen auf. Retrieval liefert Belege über ein Evidence Tool, Structured Output macht die Antwort prüfbar, Human-in-the-Loop stoppt unsichere Ausgaben. So wird aus einem Chatbot mit Werkzeugen ein kontrolliertes Arbeitssystem.

Drei Fähigkeiten ziehen sich durch den Bauplan: Der Agent muss **planen** (welches Tool, welche Route, welcher Zustand gilt gerade), **handeln** (Tools ausführen, Evidenz abrufen, einen Workflow durchlaufen) und **prüfen** (Freigabe, Security, Evaluation vor jeder folgenreichen Ausgabe). RAG ist dabei kein Selbstzweck. Es ist ein **Evidence Tool**: eine kontrollierte Fähigkeit, die der Agent gezielt nutzt.

Die Leitfrage lautet:

> Wie entsteht ein PMO-Assistent, der Meetings vorbereitet, Aufgabenstände und Statusinformationen aus Protokollen, Entscheidungen und Projektdokumenten aufbereitet, Aussagen nachvollziehbar belegt und bei Unsicherheit kontrolliert eskaliert?

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Ausgangssituation

Mara Vogt leitet das interne Vorhaben "Projekt Kompass" bei der fiktiven Nordlicht Software GmbH. Vor Jour-fixe-Terminen liest sie Meeting-Protokolle, Entscheidungsvorlagen, Risikolisten und Aufgabenlisten. Oft sucht sie nicht ein einzelnes Stichwort, sondern den aktuellen Stand: Was wurde entschieden? Welche Risiken sind offen? Wo widersprechen sich ältere und neuere Unterlagen?

Eine einfache Volltextsuche hilft nur begrenzt. Sie liefert zu viele Treffer, übersieht semantisch passende Stellen oder zeigt nicht, dass zwei Dokumente unterschiedliche Stände beschreiben.

Das Ziel ist kein Agent, der beliebige Antworten erzeugt. Der Nutzen entsteht erst, wenn das System einen begrenzten Korpus nutzt, Quellen sichtbar macht und fehlende Evidenz nicht durch Modellwissen ersetzt. Der Agent muss relevante Passagen finden, Widersprüche erkennen, Antworten strukturieren und Grenzen offenlegen.

<img src="https://raw.githubusercontent.com/ralf-42/Agenten/main/07_image/mara.png" class="logo" width="950"/>
<p><font color='black' size="2">
KI-generiertes Bild
</font></p>

## Anwendungsfälle im Kurs

Beispiele und Aufgaben im Kurs richten sich vor allem auf drei Kernfunktionen eines PMO-Assistenten: Meeting-Vorbereitung, Aufgabenverfolgung und Statusreporting. Ergänzend werden Protokollerstellung, Risikomanagement, Dokumentenmanagement und Stakeholderkommunikation als unterstützende Funktionen behandelt. Alle Beispiele beziehen sich auf die Projektdokumente von Projekt Kompass, nicht auf allgemeine Recherchethemen.

| Aufgabe | KI-Anwendungsfall | Potenzial | Schwerpunkt in Modulen |
|---|---|---|---|
| Meeting-Vorbereitung | Briefing aus Projektstatus, offenen Punkten und bisherigen Entscheidungen | Sehr hoch | M03, M08, M34, M38 |
| Protokollerstellung | Strukturierte Zusammenfassung von Besprechungsnotizen | Sehr hoch | M04, M06, M34 |
| Aufgabenverfolgung | Extraktion von Aufgaben, Verantwortlichen und Terminen | Sehr hoch | M01, M04, M10, M34, M38 |
| Statusreporting | Erstellung eines Managementberichts aus Projektinformationen | Sehr hoch | M19–M21, M27, M38 |
| Risikomanagement | Identifikation möglicher Risiken in Projektberichten | Hoch | M04, M09, M23 |
| Dokumentenmanagement | Semantische Suche in Projektunterlagen mittels RAG | Hoch | M11, M14, M22, M28 |
| Stakeholderkommunikation | Zielgruppenspezifische Formulierung von Projektinformationen | Hoch | M03, M17, M25 |

Die Spalte „Schwerpunkt in Modulen" nennt, wo ein Anwendungsfall vorrangig geübt wird. Freigabe und Entscheidungsunterstützung ziehen sich als Querschnitt durch alle Fälle. Verbindliche Projektentscheidungen bleiben bei den verantwortlichen Personen.

## Zielbild

Ein brauchbarer PMO-Assistent lädt einen Projektkorpus reproduzierbar, konvertiert unterstützte Dokumentformate in Passagen und verarbeitet Fragen in natürlicher Sprache. Die Antwort kann ein Meeting-Briefing, einen Aufgabenstand oder eine Statusübersicht enthalten und weist Quellentitel, zitierte Textpassagen, eine Sicherheitseinschätzung und einen Hinweis aus, wenn die Frage nicht aus dem Korpus beantwortet werden kann.

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

Der Korpus sollte klein genug sein, um verstanden zu werden, und sauber genug, um Evaluation zu ermöglichen. Zehn bis zwanzig Dokumente in unterstützten Formaten aus einem klaren Themenfeld reichen für einen ersten Prototyp oft aus. Ein größerer, aber unsauberer Bestand verschlechtert die Lern- und Prüfbarkeit: Retrieval-Fehler lassen sich dann schwer von Datenproblemen unterscheiden.

Geeignete Quellen sind Meeting-Protokolle, Entscheidungsvorlagen, Risikolisten, Aufgabenlisten und Rollenlisten. Beispiele und Aufgaben beziehen sich ausschließlich auf diese Projektdokumente. Für den Kurs werden reale Projektdaten durch synthetische, fiktive Beispieldokumente ersetzt — urheberrechtlich geschützte Lehrbücher, echte interne Dokumente oder personenbezogene Daten eignen sich nicht für eine erste Version.

Für jede Passage sollten mindestens diese Metadaten verfügbar sein:

| Feld | Bedeutung |
|---|---|
| `dokument_id` | stabile interne ID |
| `titel` | Titel des Dokuments |
| `autor_oder_organisation` | Autor, Institution oder Herausgeber |
| `datum` | Datum des Dokuments, wichtig für Aktualität und Widersprüche |
| `dokumenttyp` | Protokoll, Entscheidungsprotokoll, Risikoliste, Tracker oder Projektunterlage |
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

### Ergebnisformate des PMO-Assistenten

Der PMO-Assistent liefert vier Produkte. Jedes hat ein eigenes Schema; die technischen Feldnamen sind in den Notebooks und Skripten gleich. Die Erläuterungen bleiben deutsch.

| Produkt | Schema | Notebook | Inhalt |
|---|---|---|---|
| Meeting-Briefing | `GateOutputResult` | M34 | Agenda, offene Fragen, Aufgaben, Risiken, Status (`ok`, `no_context`, `conflict`) |
| Statusbericht | `StatusberichtResult` | M27 (Template A) | Stand, Zusammenfassung, Entscheidungen, Aufgaben, Risiken, offene Punkte, Quellen |
| Offene Aufgaben | `ActionItemResult` | M04, M34 | `task` (Aufgabe), `owner` (Verantwortlich), `due` (Termin) |
| Risikoübersicht | `RiskReviewResult` | M04 | Risiken, Kritikalität, Maßnahmen |

Der Statusbericht wird nicht als eigenes Dokument im Korpus abgelegt, sondern aus Follow-up-Tracker, Risikoliste und Entscheidungsprotokoll zusammengesetzt. Jede Aussage trägt ein Datum und eine Quelle; fehlende Angaben stehen als `[offen]` im Bericht.

```python
class StatusEintrag(BaseModel):
    kennung: str = Field(description="D1, D2, R2 oder Kurzname der Aufgabe")
    text: str = Field(description="Aussage in einem Satz")
    status: str = Field(description="aktiv, überholt, erledigt, offen, vertagt oder mitigiert")
    stand: str = Field(description="Datum der Quelle (TT.MM.JJJJ) oder [offen]")
    quelle: str = Field(description="Dokumentname")


class StatusberichtResult(BaseModel):
    stand: str = Field(description="Datum des Berichts")
    zusammenfassung: str = Field(description="Zwei Sätze zum Gesamtstand")
    entscheidungen: list[StatusEintrag]
    aufgaben: list[StatusEintrag]
    risiken: list[StatusEintrag]
    offene_punkte: list[str] = Field(description="Was nicht entschieden oder nicht belegt ist")
    sicherheit: str = Field(description="hoch / mittel / niedrig")


class ActionItemResult(BaseModel):
    task: str = Field(description="Aufgabenbeschreibung — kurz, aktionsorientiert")
    owner: str = Field(description="Verantwortliche Person laut Protokoll oder '[offen]'")
    due: str = Field(description="Fälligkeitsdatum im Format TT.MM.JJJJ oder '[offen]'")
```

## Leitplanken

Der PMO-Assistent bleibt ein Assistenzsystem für PMO-nahe Informationsaufbereitung und Recherche. Diese Grenze ist wichtiger als die konkrete Modellwahl. Wenn das System fehlende Evidenz frei ergänzt oder verbindliche Projektentscheidungen erfindet, ist es auch mit guter Architektur unbrauchbar.

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
| PMO-Abgrenzung | Der Assistent unterstützt Informationsaufbereitung und Nachverfolgung, ersetzt aber kein vollständiges PMO-System. |
| Entscheidungsverantwortung | Verbindliche Projektentscheidungen und Freigaben bleiben bei verantwortlichen Personen. |

## Evaluation

Evaluation prüft, ob relevante Passagen gefunden werden und Antworten im belegbaren Rahmen bleiben. Das Eval-Set sollte Meeting-Briefings, Aufgabenstände und Statussynthesen ebenso wie Konflikt- und Out-of-Corpus-Fragen abdecken. Eine plausibel klingende Antwort zählt nicht als Erfolg, wenn sie die falsche Quelle nutzt oder eine Korpusgrenze überschreitet.

Ein erstes Eval-Set sollte verschiedene Fragetypen enthalten:

| Fragetyp | Erwartung |
|---|---|
| Faktische Frage | richtige Quelle und passende Passage |
| Konfliktfrage | aktuelle Entscheidung mit Datum und Quelle (zum Beispiel D2 statt D1) |
| Vergleichsfrage | zwei Quellen sauber gegenübergestellt |
| Inferenzfrage | begründete Zusammenführung mehrerer Passagen |
| Negativbeispiel | Antwort "Nicht im Korpus" |

Für eine erste Version ist eine pragmatische Schwelle sinnvoll: Die semantische Suche findet bei mindestens 70 Prozent der Testfragen die relevante Passage unter den Top-3-Treffern. Zusätzlich enthält jede finale Antwort mindestens eine Quelle oder verweigert kontrolliert.

## Vom Einzelagenten zum Multi-Agent-System

Der PMO-Assistent beginnt nicht als Multi-Agent-System. Zuerst muss der einfache Pfad funktionieren: Korpus laden, Passage finden, Antwort strukturieren, Quelle belegen. Erst danach lohnt sich Rollenaufteilung.

Eine sinnvolle Multi-Agent-Variante trennt nicht künstlich ähnliche Aufgaben, sondern unterschiedliche Dokument- oder Fragetypen:

```text
Supervisor
├── Tabellen-Worker   -> verarbeitet Daten, Tabellen und strukturierte Abschnitte
└── Fließtext-Worker  -> verarbeitet Prosa, Argumentationen und Zusammenfassungen
```

Der Supervisor entscheidet nach Fragetyp, welche Rolle gebraucht wird. Bei Unsicherheit oder fehlender Evidenz geht die Antwort vor der Ausgabe in eine menschliche Prüfung.

## Capstone und Transfer

Ein vollständiger Prototyp ist erreicht, wenn ein eigener oder bereitgestellter Korpus reproduzierbar geladen wird und der PMO-Assistent Meeting-Briefings, Aufgabenstände oder Statusübersichten mit relevanten Quellen erzeugen kann. Die Antworten nutzen ein strukturiertes Schema mit Quellen, Sicherheit und Hinweis. Der Prototyp bildet kein vollständiges PMO-System und trifft keine verbindlichen Projektentscheidungen.

Das Capstone deckt mindestens eine der drei Kernfunktionen ab: Meeting-Vorbereitung, Aufgabenverfolgung oder Statusreporting. Das Ergebnis erscheint im passenden Schema aus „Ergebnisformate des PMO-Assistenten", mit Datum und Quelle je Aussage.

Außerdem müssen mindestens drei Tools, ein StateGraph oder klarer Agenten-Workflow sowie mindestens ein Gate oder HITL-Schritt erkennbar sein. Die Evaluation prüft Positivfälle und mindestens einen Negativfall, bei dem das System korrekt ablehnt oder eskaliert. Ebenso wichtig ist die Reflexion: Welche Grenze wurde sichtbar, welche Quelle fehlte, welcher Eval-Fall scheiterte — und wann darf der Agent nicht autonom handeln?

Der Bauplan lässt sich auf andere Domänen übertragen. Eine Legal-Research-Variante ergänzt Aktenzeichen, Fundstellen und strengere Freigaberegeln. Eine Compliance-Variante braucht Audit-Trail und Rollenklärung. Ein Wissens-Assistent für Handbücher und Richtlinien verschiebt den Schwerpunkt auf klassische RAG-Auskunft ohne Projektbezug. Die Architektur bleibt ähnlich, aber Korpus, Metadaten und Risiken ändern sich.

| Transferfall | Rolle |
|---|---|
| Wissens-Assistent | RAG-Auskunft zu Handbüchern und Richtlinien ohne Projektkontext |
| Legal-Recherche-Assistent | regulierte Recherche, Fundstellenpflicht, HITL und Quellenqualität |
| Compliance-Prüfung | regulierte Branchen, Audit-Trail und Out-of-Corpus-Regel |
| Support-Triage | Klassifikation, Tool-Use, HITL und Routing |
| Code-Review-Agent | strukturierte Analyse, Quellen-/Diff-Bezug und Security |

## Ausbaustufen: Vom Prototyp zum Einsatz

Der Kurs-Prototyp arbeitet bewusst mit einem kleinen, fiktiven und kuratierten Korpus. Das macht Fehler sichtbar und Ergebnisse überprüfbar. Jede Vereinfachung des Prototyps benennt zugleich die nächste Ausbaustufe: Das Grundmuster aus Quellenpflicht, Evaluation und Freigabe bleibt gleich, während Datenbasis, Zugriffsschutz und Betrieb wachsen.

| Ausbaustufe | Im Kurs-Prototyp | Nächster Schritt | Kursbezug |
|---|---|---|---|
| Datenbasis | Ein fiktives Projekt mit PDF-, Markdown- und CSV-Dateien in einem Ordner | Anbindung der realen Ablagen, etwa Dokumentenablage, Aufgaben-Tracker und Wiki, mit regelmäßiger Aktualisierung des Index | M26 |
| Zugriffsrechte | Alle sehen den gesamten Korpus; die Rechte- und Rollensteuerung ist im Projekt Kompass als offener Punkt dokumentiert | Berechtigungsfilter bereits beim Retrieval, ergänzt durch eine Quellenprüfung nach der Antwort | M23 |
| Datenschutz | Ausschließlich fiktive Daten | Datenschutzfreigabe für produktive Daten, Logging-Konzept und Regeln für Aufbewahrung | M23, M37 |
| Nutzenmessung | Das Eval-Set misst Antwortqualität und Quellentreue | Pilot mit einer Projektgruppe: Zeitaufwand der Meeting-Vorbereitung vorher und nachher, Rückmeldungen der Nutzenden | M24, M37 |
| Betrieb | Notebook in Colab | Bereitstellung als Dienst mit Monitoring, Kostenkontrolle und versionierten Prompts | M36, M37 |
| Aktionen | Der Assistent liest und schlägt vor | Kontrollierte Schreibaktionen wie das Anlegen einer Aufgabe, jeweils hinter einem Freigabe-Gate | M23, M26 |

> [!TIP] Empfohlene Reihenfolge<br>
> Zugriffsrechte und Datenschutz sollten vor der Anbindung echter Datenquellen geklärt sein. Danach liefert ein kleiner Pilot mit messbarem Nutzen die Grundlage für jede weitere Ausbaustufe.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Lohnt sich KI?]({{ '/02-orientierung-entscheidung/lohnt-es-sich.html' | relative_url }}) | Wann ist ein KI- oder Agentenvorhaben überhaupt sinnvoll? |
| [Aufgabenklassen & Lösungswege]({{ '/02-orientierung-entscheidung/aufgabenklassen-und-loesungswege.html' | relative_url }}) | Wann reicht Prompting, wann braucht es RAG, Workflow oder Agent? |
| [Terminologie]({{ '/02-orientierung-entscheidung/terminologie.html' | relative_url }}) | Welche Begriffe werden für Tools, State, Memory und Guardrails verwendet? |
| [PMO-Assistent – Praxisworkshop]({{ '/08-deployment-betrieb/pmo-assistent-praxis.html' | relative_url }}) | Wie wird das Zielbild als zusammenhängendes Praxisprojekt umgesetzt? |

---

**Version:** 2.3<br>
**Stand:** Oktober 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
