---
layout: default
title: EU AI Act
parent: Regulatorische Themen
nav_order: 2
description: Risikoklassen, Fristen und Pflichten der EU-KI-Verordnung
has_toc: true
grand_parent: Regulatorisches
---

# EU AI Act
{: .no_toc }

> **Risikoklassen, Fristen und Pflichten der EU-KI-Verordnung**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

# 1 Einordnung

Der EU AI Act ist die Verordnung (EU) 2024/1689 zur Regulierung von KI-Systemen in der Europäischen Union. Er verbietet bestimmte KI-Praktiken, stellt Anforderungen an Hochrisiko-Systeme und verpflichtet Anbieter ausgewählter KI-Systeme zu Transparenz, Dokumentation und menschlicher Aufsicht. Für den Agenten-Kurs ist daran weniger die juristische Systematik entscheidend als die technische Konsequenz: Ein Agent, der Tools nutzt, Dokumente durchsucht oder Entscheidungen vorbereitet, braucht klare Einsatzgrenzen, nachvollziehbare Zwischenschritte und kontrollierbare Freigaben.

Der AI Act ersetzt weder DSGVO noch branchenspezifische Regulierung. In Medizin, Finanzwesen, Beschäftigung, Bildung oder öffentlicher Verwaltung kommen weitere Regeln hinzu. Der AI Act liefert dafür den horizontalen Rahmen: Welche KI-Praktiken sind unzulässig, welche Anwendungen gelten als hochriskant, und welche Mindestanforderungen gelten für Systeme, die Sicherheit oder Grundrechte berühren.

> [!IMPORTANT] Keine Rechtsberatung<br>
> Diese Seite ordnet den EU AI Act für technische Kursentscheidungen ein. Für konkrete Produkte, Verträge oder behördliche Pflichten ist juristische Prüfung erforderlich.

# 2 Zeitplan und Anwendbarkeit

Der AI Act trat am **1. August 2024** in Kraft. Die Pflichten gelten nicht alle gleichzeitig, sondern werden schrittweise anwendbar. Für Kursmaterialien ist wichtig, die Daten nicht als bloße Zukunftsplanung zu behandeln: Einige Pflichten gelten bereits.

| Datum | Was gilt |
|---|---|
| **2. Februar 2025** | Verbote nach Art. 5, Definitionen und AI-Literacy-Pflichten gelten |
| **2. August 2025** | GPAI-Regeln und Governance-Strukturen gelten; nationale Behörden und Sanktionen müssen vorbereitet sein |
| **2. August 2026** | Der Großteil der Verordnung wird anwendbar, darunter Transparenzpflichten nach Art. 50 und Hochrisiko-Systeme aus Annex III |
| **2. August 2027** | Hochrisiko-KI als Sicherheitskomponente in regulierten Produkten wird anwendbar |
| **31. Dezember 2030** | Sonderfristen für bestimmte bereits bestehende große IT-Systeme und einzelne Bestandssysteme |

Im November 2025 hat die Europäische Kommission im Rahmen des **Digital Omnibus** vorgeschlagen, die Anwendung bestimmter Hochrisiko-Pflichten stärker an verfügbare Unterstützungsinstrumente wie harmonisierte Standards, gemeinsame Spezifikationen oder Leitlinien zu koppeln. Am **13. März 2026** hat der Rat seine Position zu Vereinfachungen bestimmter AI-Act-Regeln festgelegt. Das ist für Planungen relevant, aber kein Ersatz für den geltenden Rechtsstand. Bis eine Änderung beschlossen und wirksam ist, bleibt der ursprüngliche Zeitplan der Verordnung maßgeblich.

Typischer Fehler: Der Zeitplan wird nur mit "2026" beschrieben. Das verwischt, dass Verbote und AI-Literacy bereits seit Februar 2025 gelten und GPAI-Pflichten seit August 2025 relevant sind.

# 3 Risikoklassen

Der AI Act arbeitet risikobasiert. Entscheidend ist nicht, ob ein System modern, agentisch oder generativ ist, sondern wofür es eingesetzt wird und welche Auswirkungen es auf Menschen haben kann.

| Risikoklasse | Bedeutung | Beispiele |
|---|---|---|
| **Unzulässige KI-Praktiken** | Verbotene Anwendungen, weil sie Grundrechte oder Sicherheit in besonders schwerer Weise gefährden | bestimmte manipulative Systeme, Social Scoring, bestimmte biometrische Kategorisierung, Emotionserkennung in Bildung und Beschäftigung, bestimmte Predictive-Policing-Konstellationen |
| **Hochrisiko-KI** | Zulässig, aber nur mit strengen Anforderungen an Risiko­management, Datenqualität, Dokumentation, Logging, menschliche Aufsicht, Robustheit und Cybersicherheit | ausgewählte Systeme in Bildung, Beschäftigung, kritischer Infrastruktur, zentralen privaten/öffentlichen Diensten, Strafverfolgung, Migration/Grenzkontrolle und Rechtsauslegung |
| **Transparenzpflichtige KI** | Nutzer müssen erkennen können, dass sie mit KI interagieren oder KI-generierte Inhalte sehen | Chatbots, Deepfakes, bestimmte synthetische Inhalte und interaktive KI-Systeme |
| **Minimales oder geringes Risiko** | Keine besonderen AI-Act-Pflichten; freiwillige Verhaltenskodizes bleiben möglich | viele interne Hilfswerkzeuge, Spamfilter, einfache Empfehlungssysteme |

Hochrisiko bedeutet nicht: "Alles in einem sensiblen Bereich ist automatisch Hochrisiko." Maßgeblich sind die konkreten Regeln in Art. 6, Annex I und Annex III. Ein KI-System für Terminplanung in einer Klinik ist anders einzuordnen als ein System, das diagnostische Hinweise gibt oder eine sicherheitsrelevante Entscheidung vorbereitet.

# 4 Hochrisiko-Systeme

Hochrisiko-Systeme entstehen im AI Act vor allem auf zwei Wegen. Erstens können KI-Systeme Teil regulierter Produkte oder Sicherheitskomponenten sein, etwa bei Maschinen, Medizinprodukten, Fahrzeugen oder Aufzügen. Zweitens nennt Annex III konkrete Anwendungsfelder, in denen KI besonders stark in Grundrechte oder Lebensentscheidungen eingreifen kann.

Für den Kurs sind Annex-III-Fälle besonders anschaulich: Bewerberauswahl, Leistungsbewertung am Arbeitsplatz, Zugang zu Bildung, Bewertung in Prüfungen, Kreditwürdigkeitsprüfung, Zugang zu öffentlichen Leistungen, bestimmte Formen der Strafverfolgung, Migration und Unterstützung bei der Rechtsauslegung. In solchen Fällen reicht ein funktionierender Prompt nicht aus. Erforderlich werden nachvollziehbare Datenflüsse, dokumentierte Modell- und Prompt-Versionen, Logs, menschliche Aufsicht und ein belastbares Fehlerkonzept.

Grenze: Ein Agent, der eine Entscheidung vorbereitet, ist nicht automatisch verboten. Problematisch wird es, wenn das System faktisch entscheidet, Betroffene keine echte menschliche Prüfung erhalten oder die Entscheidungsgrundlage nicht nachvollziehbar bleibt.

# 5 General Purpose AI

General Purpose AI (GPAI) betrifft Modelle, die für viele unterschiedliche Zwecke eingesetzt werden können. Anbieter solcher Modelle unterliegen seit **2. August 2025** eigenen Pflichten. Bei Modellen mit systemischem Risiko kommen weitergehende Anforderungen hinzu, etwa Risikobewertung, Sicherheitsmaßnahmen und Dokumentation.

Für Anwender im Kurs ist der Unterschied wichtig: Wer ein externes Modell über eine API nutzt, ist nicht automatisch Anbieter dieses GPAI-Modells. Trotzdem entstehen eigene Pflichten, sobald daraus ein konkretes KI-System gebaut und in einem sensiblen Kontext eingesetzt wird. Der Betreiber eines Research- oder Entscheidungsassistenten kann also Pflichten haben, auch wenn das zugrunde liegende Basismodell von einem anderen Anbieter stammt.

# 6 Bedeutung für KI-Agenten

KI-Agenten verschärfen einige Fragen des AI Act, weil sie nicht nur Text generieren, sondern Zwischenschritte ausführen können: Tools aufrufen, externe Daten abfragen, Dateien erzeugen, Workflows starten oder Vorschläge an andere Systeme übergeben. Je mehr Autonomie ein Agent erhält, desto wichtiger werden Begrenzung und Nachvollziehbarkeit.

In Trainings zeigt sich häufig, dass Teilnehmende Agenten zuerst nach Funktionsumfang beurteilen: Kann das System suchen, zusammenfassen, entscheiden und handeln? Aus regulatorischer Sicht ist die bessere Frage: Welche Handlung darf der Agent ohne Freigabe ausführen, welche Daten darf er sehen, welche Zwischenergebnisse werden gespeichert, und wo ist eine menschliche Entscheidung zwingend?

Für technische Kursbeispiele ergeben sich daraus fünf Mindestmuster:

| Muster | Bedeutung im Agenten-System |
|---|---|
| **Human-in-the-Loop** | Kritische Entscheidungen bleiben freigabepflichtig |
| **Logging und Traceability** | Tool-Aufrufe, Quellen, Prompts und Modellversionen bleiben nachvollziehbar |
| **Quellenbindung bei RAG** | Antworten zu Dokumenten müssen auf zitierbare Quellen zurückführbar sein |
| **Tool-Grenzen** | Agenten erhalten nur die Werkzeuge, die für die Aufgabe erforderlich sind |
| **Evaluation vor Einsatz** | Fehlerfälle, Out-of-Corpus-Fragen und Regressionen werden vor Nutzung geprüft |

Nicht geeignet ist ein freier Agenten-Loop für Entscheidungen mit Außenwirkung, wenn keine menschliche Freigabe, keine Dokumentation und keine überprüfbaren Kriterien vorgesehen sind. Gerade in Legal, Medizin, HR und Finanzwesen sollte ein Agent zunächst als Assistenzsystem entworfen werden, nicht als autonomer Entscheider.

# 7 Umsetzung im Kurskontext

Für den Agenten-Kurs ist der AI Act kein isoliertes Rechtskapitel. Er berührt mehrere technische Module: Tool Use, RAG, Human-in-the-Loop, Evaluation, Security, Observability und Deployment. Die regulatorische Perspektive erklärt, warum diese Module nicht nur Architekturthemen sind, sondern Kontrollmechanismen.

Ein Research Assistant für Fachartikel ist in vielen Kurskontexten zunächst ein niedriges oder begrenztes Risiko: Er durchsucht bereitgestellte Dokumente, fasst Quellen zusammen und verweist auf Citations. Das ändert sich, wenn er in regulierten Branchen eingesetzt wird, etwa zur medizinischen Einschätzung, rechtlichen Bewertung, Kreditentscheidung oder Bewerberauswahl. Dann reicht der gleiche technische Bauplan nicht mehr aus. Es braucht zusätzliche Validierung, Rollenklärung, Freigaben und Dokumentation.

Typischer Fehler: Ein Kursbeispiel wird später in einen produktiven Kontext übertragen, ohne die Risikoklasse neu zu prüfen. Die gleiche Architektur kann harmlos, transparenzpflichtig oder hochriskant sein, abhängig vom Einsatzkontext.

# 8 Herausforderungen

Die praktische Umsetzung bleibt anspruchsvoll. Begriffe wie "KI-System", "systemisches Risiko" oder "wesentliche Änderung" müssen im Einzelfall ausgelegt werden. Dazu kommt, dass technische Standards, Leitlinien und nationale Zuständigkeiten weiterhin konkretisiert werden. Für Unternehmen entsteht dadurch kein Freibrief zum Warten, sondern die Notwendigkeit, Inventar, Risikoklassifizierung und Dokumentation früh aufzubauen.

Besonders schwierig ist die Grenze zwischen Unterstützung und Entscheidung. Ein Agent, der eine Zusammenfassung erstellt, ist anders zu bewerten als ein Agent, dessen Ergebnis faktisch über Zugang zu Arbeit, Kredit, Bildung oder medizinischer Behandlung entscheidet. In der Praxis liegt die Gefahr oft nicht im Modell selbst, sondern in der organisatorischen Einbettung: Wer prüft das Ergebnis, wer trägt Verantwortung, und wie kann eine betroffene Person eine Entscheidung nachvollziehen oder anfechten?

# 9 Empfehlungen

Vor dem Einsatz eines KI-Agenten sollte zuerst der konkrete Anwendungsfall beschrieben werden: Nutzergruppe, Datenarten, Entscheidungskontext, mögliche Betroffene und erwartete Handlung des Systems. Danach folgt die Risikoklassifizierung. Erst dann ist sinnvoll zu entscheiden, ob einfache Transparenzhinweise reichen oder ob Hochrisiko-Anforderungen wie Risikomanagement, technische Dokumentation, Logging, menschliche Aufsicht und Qualitätsmanagement benötigt werden.

Für Kurs- und Prototypensysteme empfiehlt sich ein Mindeststandard, auch wenn der AI Act im konkreten Beispiel noch keine Hochrisiko-Pflichten auslöst: keine sensiblen Echtdaten, klare Kennzeichnung als Lernsystem, nachvollziehbare Quellen, reproduzierbare Tests und Freigaben vor kritischen Ausgaben. Diese Muster sind didaktisch wertvoll, weil sie später in regulierten Kontexten nicht neu erfunden werden müssen.

# Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Ethik und GenAI](./ethik-und-genai.html) | Welche Verantwortung entsteht jenseits rechtlicher Mindestpflichten? |
| [Digitale Souveränität](./digitale-souveraenitaet.html) | Wie abhängig ist ein KI-System von Cloud, Plattformen und außereuropäischer Infrastruktur? |
| [Agent Security](../concepts/qualitaet-praxis/agent-security.html) | Welche technischen Risiken entstehen durch Tools, Prompts, Daten und Agenten-Verhalten? |
| [Human-in-the-Loop](../concepts/workflows-state/human-in-the-loop.html) | Wie werden menschliche Freigaben technisch in Agenten-Workflows eingebaut? |
| [Evaluation & Observability](../concepts/qualitaet-praxis/evaluation-observability.html) | Wie werden Qualität, Fehler und Drift in KI-Systemen messbar? |

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Einsteiger-Guides](../frameworks/einsteiger-guides.html) | Wo starte ich als Einsteiger mit EU AI Act? |
| [Best Practices](../frameworks/best-practices.html) | Welche Produktionsstandards gelten für EU AI Act? |

---

**Version:** 1.1<br>
**Stand:** April 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
