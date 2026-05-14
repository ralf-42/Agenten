---
layout: default
title: "Datenschutz & DSGVO"
parent: "Regulatorik & Verantwortung"
nav_order: 2
description: DSGVO-konforme Nutzung von LLM-APIs, Tracing, Tools, Memory und Agenten-Pipelines
has_toc: true
---

# Datenschutz & DSGVO
{: .no_toc }

> [!IMPORTANT] Personenbezogene Daten in KI-Systemen<br>
> Wer personenbezogene Daten an eine externe KI-API schickt, ist Verantwortlicher im Sinne der DSGVO — unabhängig davon, ob das bewusst passiert oder nicht.

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Warum Datenschutz für KI-Entwickler relevant ist

Die DSGVO gilt seit 2018 in der gesamten EU. Die Verordnung schreibt vor, wie personenbezogene Daten — also Daten, die sich einer natürlichen Person zuordnen lassen — erhoben, verarbeitet und gespeichert werden dürfen. Wer einen Agenten baut, der Kundenfragen beantwortet, E-Mails analysiert oder Bewerbungsunterlagen auswertet, verarbeitet fast zwangsläufig personenbezogene Daten.

Das Besondere bei LLM-basierten Systemen: Datenschutzverstöße entstehen oft nicht absichtlich. Ein Entwickler schickt einen Kundennamen im Prompt mit, weil es das Testen vereinfacht. Ein Agent liest eine E-Mail aus und übergibt den vollständigen Text an die API. Der LangSmith-Trace enthält eine Kundennummer. Keines dieser Szenarien erfordert böse Absicht — es reicht, nicht aktiv darüber nachgedacht zu haben.

**In der Praxis relevant wenn:** Ein Agent auf echte Nutzerdaten zugreift, E-Mails oder Dokumente verarbeitet, Antworten auf der Basis von Profildaten personalisiert oder Ergebnisse in einer Datenbank speichert.

---

## Was darf in den Prompt?

Die einfachste Faustregel lautet: So wenig personenbezogene Daten wie möglich in den Prompt — und nur dann, wenn es für die Aufgabe tatsächlich notwendig ist.

**Personenbezogene Daten** umfassen Namen, E-Mail-Adressen, Telefonnummern, Geburtsdaten, IP-Adressen, Kundennummern und alles, was einer Person direkt oder indirekt zugeordnet werden kann. **Besondere Kategorien** nach Art. 9 DSGVO — Gesundheitsdaten, religiöse Überzeugungen, biometrische Daten — unterliegen noch strengeren Anforderungen.

Bevor Daten in einen Prompt gelangen, sollten drei Fragen beantwortet sein:

1. Ist die Information für die Antwort wirklich nötig, oder reicht eine anonymisierte Version?
2. Hat die betroffene Person der Verarbeitung durch diesen Dienst zugestimmt, oder gibt es eine andere Rechtsgrundlage?
3. Weiß der Anbieter, dass seine API für diese Art von Datenverarbeitung genutzt wird?

**Anonymisieren statt weglassen:** In vielen Fällen genügt es, den echten Namen durch einen Platzhalter zu ersetzen. Statt `Max Müller hat folgendes Problem: ...` lässt sich `Ein Nutzer hat folgendes Problem: ...` oder `[NAME] hat folgendes Problem: ...` verwenden. Die Qualität der Antwort leidet meist nicht.

Für die automatische Erkennung und Maskierung von personenbezogenen Daten gibt es das Open-Source-Werkzeug `presidio` von Microsoft, das Namen, E-Mails, Telefonnummern und andere PII-Typen zuverlässig erkennt.

```python
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

analyzer  = AnalyzerEngine()
anonymizer = AnonymizerEngine()

text = "Prüfung der Anfrage von Max Müller (max@example.com)."
ergebnisse = analyzer.analyze(text=text, language="de")
anonymisiert = anonymizer.anonymize(text=text, analyzer_results=ergebnisse)

print(anonymisiert.text)
# → "Prüfung der Anfrage von <PERSON> (<EMAIL_ADDRESS>)."
```

**Typischer Fehler:** Entwickler testen mit echten Produktionsdaten, weil das bequemer ist als Testdaten zu erstellen. Damit gelangen reale personenbezogene Daten in externe APIs, Logs und Traces — oft ohne dass das in der Datenschutzdokumentation erfasst ist.

---

## Welcher Dienst für welche Daten?

Nicht jeder KI-Dienst eignet sich für jeden Anwendungsfall. Die Entscheidung hängt davon ab, wie sensibel die verarbeiteten Daten sind.

| Datensensitivität | Beispiele | Geeigneter Dienst |
|---|---|---|
| Keine personenbezogenen Daten | Öffentliche Texte, anonymisierte Fragen | Cloud-LLM-API meist vertretbar |
| Interne Unternehmensdaten, kein PII | Technische Dokumentation, anonymisierte Protokolle | Cloud-LLM-API mit geprüften Datenkontrollen |
| Personenbezogene Daten (Standard) | Kundenfragen, interne E-Mails | Dienst mit AVV/DPA, klarer Datenhaltung und dokumentiertem Zweck |
| Besondere Kategorien (Art. 9 DSGVO) | Gesundheitsdaten, Bewerbungsunterlagen | Lokales Modell oder streng kontrollierte Unternehmensumgebung |

Bei Cloud-LLM-APIs müssen Datenkontrollen konkret geprüft werden: Werden Eingaben zum Training verwendet? Welche Logs entstehen? Wie lange werden Inhalte gespeichert? Gibt es einen Auftragsverarbeitungsvertrag, Datenresidenzoptionen oder regionale Verarbeitung? Für OpenAI API-Daten gilt beispielsweise: API-Daten werden standardmäßig nicht zum Training genutzt, sofern nicht aktiv zugestimmt wird; Abuse-Monitoring-Logs und Application State können aber je nach Endpoint und Konfiguration entstehen. Solche Details gehören in die technische und organisatorische Bewertung.

Azure OpenAI, OpenAI-Datenresidenzoptionen, Enterprise-Verträge oder andere Anbieterangebote können für personenbezogene Daten geeignet sein, müssen aber konkret geprüft werden: Region, Subprozessoren, Vertragsgrundlage, Logging, Löschfristen und tatsächliche Datenflüsse zählen mehr als der Produktname.

Lokale Modelle über Ollama oder vLLM laufen vollständig auf eigener Infrastruktur. Kein Byte muss das eigene System verlassen. Das ist für hochsensible Daten oft die kontrollierbarste Option — allerdings mit dem Nachteil, dass lokale Modelle in Qualität, Geschwindigkeit oder Betriebsaufwand hinter großen Cloudmodellen zurückbleiben können.

**Grenze:** Auch der Einsatz eines lokalen Modells befreit nicht von der DSGVO. Die Daten werden weiterhin verarbeitet, und alle anderen Anforderungen — Zweckbindung, Speicherbegrenzung, Betroffenenrechte — gelten unverändert.

---

## Tracing, Logging und Evaluation — die vergessene Datenschutzfrage

Agenten erzeugen oft mehr personenbezogene Spuren als erwartet: Prompts, Modellantworten, Tool-Aufrufe, State, Memory, Retrieval-Ergebnisse, Notebook-Ausgaben, Fehlerlogs, Evaluation-Datasets und Traces. LangSmith kann Inputs, Outputs, Tool-Aufrufe, Metadaten und Datasets speichern, abhängig von Konfiguration und Nutzung. Das ist für Debugging und Qualitätssicherung wertvoll, aber auch eine Datenschutzfrage.

Im Kurs wird bereits der EU-Endpunkt verwendet (`eu.api.smith.langchain.com`). Das ist ein wichtiger Baustein, ersetzt aber keine Datenklassifikation. Entscheidend bleibt, welche Inhalte überhaupt in Traces, Metadaten, Feedback und Evaluationsdaten gelangen.

Darüber hinaus lohnt es sich, vor dem Logging sensible Felder zu maskieren oder gar nicht erst in die Trace-Metadaten aufzunehmen:

```python
run_cfg = {
    "run_name": "M13_RAG_Query",
    "tags": ["rag", "m13"],
    "metadata": {
        "modul": "M13",
        "anfrage_typ": "fachfrage",
        # Kein echter Nutzername, keine E-Mail in Metadaten
    }
}
```

**Typischer Fehler:** Nutzerdaten direkt als `metadata`-Felder übergeben, weil das bequem für spätere Filterung in LangSmith ist. Besser: anonymisierte Bezeichner oder IDs statt Klardaten.

---

## Auftragsverarbeitungsvertrag — was Entwickler wissen müssen

Wer personenbezogene Daten an einen externen Dienstleister übergibt, der sie im Auftrag verarbeitet, braucht einen **Auftragsverarbeitungsvertrag** (AVV, englisch: Data Processing Agreement, DPA). Das gilt auch für LLM-APIs.

Für die Praxis bedeutet das: Bevor ein Unternehmen einen LLM-API-Dienst produktiv für die Verarbeitung personenbezogener Daten einsetzt, muss geprüft werden, ob ein AVV mit dem Anbieter besteht.

| Anbieter | AVV verfügbar? | Wo |
|---|---|---|
| OpenAI API | Ja | Data Processing Addendum / Business Terms prüfen |
| Azure OpenAI | Ja | Microsoft-Kundenvertrag und Auftragsverarbeitungsbedingungen prüfen |
| Anthropic Claude API | Ja | Anbieterbedingungen bzw. Enterprise-Vertrag prüfen |
| Hugging Face Inference | Je nach Dienst und Vertrag | Nutzungsbedingungen und Enterprise-Optionen prüfen |

Entwickler müssen das nicht selbst aushandeln — aber sie sollten wissen, dass diese Verträge existieren müssen, und im Zweifel die Rechtsabteilung oder den Datenschutzbeauftragten einschalten, bevor ein System produktiv geht.

**In der Praxis relevant wenn:** Ein Unternehmen einen Agenten baut, der echte Nutzerdaten verarbeitet, und dieser Agent in einer produktiven Umgebung eingesetzt wird — nicht nur für interne Tests.

---

## Datenschutz by Design

Datenschutz by Design bedeutet: Datenschutz nicht nachträglich einbauen, sondern von Anfang an in die Architektur einplanen. Bei Agenten-Systemen heißt das konkret, dass personenbezogene Daten möglichst früh im Datenfluss gefiltert oder anonymisiert werden — bevor sie in Prompt, RAG-Index, Tool-Aufruf, Notebook-Ausgabe oder Trace landen.

Datenschutz by Default ergänzt dieses Prinzip: Die voreingestellte Konfiguration sollte möglichst datensparsam sein. Tracing sollte keine Klardaten in Metadaten schreiben, RAG-Indizes sollten keine unnötigen personenbezogenen Daten enthalten, Memory sollte nicht automatisch alles dauerhaft speichern, Tool-Zugriffe sollten minimal berechtigt sein und Logs sollten kurze, begründete Aufbewahrungsfristen haben.

Ein einfaches Prinzip lässt sich als Tool-Prüfung umsetzen:

```python
from langchain_core.tools import tool

@tool
def verarbeite_anfrage(text: str) -> str:
    """Verarbeitet eine Nutzeranfrage — prüft zuerst auf PII."""
    if enthält_pii(text):
        return "Anfrage enthält personenbezogene Daten und kann nicht verarbeitet werden."
    return weiterleiten_an_llm(text)
```

Der Prüfschritt findet statt, bevor die Daten den Agenten, ein Tool, einen RAG-Index oder einen Trace erreichen — nicht nachdem sie bereits in einem Prompt oder Trace gelandet sind.

Darüber hinaus gilt das Prinzip der **Datensparsamkeit**: Nur die Daten erheben und verarbeiten, die für den konkreten Zweck tatsächlich nötig sind. Ein Agent, der Bestellstatus abruft, braucht keinen Zugriff auf die vollständige Bestellhistorie eines Nutzers.

---

## Wann ist eine Datenschutzfolgenabschätzung nötig?

Eine **Datenschutzfolgenabschätzung** (DSFA, englisch: Data Protection Impact Assessment, DPIA) ist nach Art. 35 DSGVO Pflicht, wenn eine Verarbeitung voraussichtlich ein hohes Risiko für Betroffene darstellt.

Für LLM-basierte Systeme sollte eine DSFA spätestens geprüft werden, wenn eine oder mehrere der folgenden Bedingungen zutreffen:

- Das System verarbeitet systematisch besondere Kategorien personenbezogener Daten (Gesundheit, Biometrie, Religion, politische Überzeugung)
- Das System trifft oder bereitet automatisierte Entscheidungen mit Rechtswirkung vor (Kreditvergabe, Stellenbesetzung, medizinische Empfehlung)
- Das System verarbeitet Daten von schutzbedürftigen Gruppen (Minderjährige, Patienten, Beschäftigte)
- Das System nutzt neue, schwer vorhersehbare Agenten- oder Automatisierungsmuster mit Zugriff auf sensible Daten oder wirkungsrelevante Tools

Ein Chatbot für FAQs zu Produkten erfüllt in der Regel keine dieser Bedingungen. Ein Agent, der Bewerbungsunterlagen auswertet und eine Vorauswahl vorbereitet, berührt dagegen schnell mehrere Risikokriterien.

**Grenze:** Die Entscheidung, ob eine DSFA erforderlich ist, liegt beim Datenschutzbeauftragten des Unternehmens — nicht beim Entwickler. Die Aufgabe des Entwicklers ist es, die relevanten Informationen bereitstellen zu können: welche Daten verarbeitet werden, welche Tools Zugriff erhalten, wie lange Daten gespeichert bleiben, welche Logs entstehen und welche Drittanbieter beteiligt sind.

---

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [EU AI Act]({{ '/09-regulatorik-verantwortung/eu-ai-act.html' | relative_url }}) | Welche Risikostufen und Anforderungen definiert das europäische KI-Recht? |
| [Agenten-Sicherheit]({{ '/07-qualitaet-sicherheit/agent-security.html' | relative_url }}) | Wie werden Agenten gegen technische Angriffe wie Prompt Injection und Tool-Missbrauch abgesichert? |
| [Human-in-the-Loop]({{ '/04-agenten-implementierung/human-in-the-loop.html' | relative_url }}) | Wann und wie werden Menschen als Kontrollinstanz eingebunden — auch als Datenschutzmaßnahme bei sensiblen Entscheidungen? |
| [Lohnt sich KI?]({{ '/02-orientierung-entscheidung/lohnt-es-sich.html' | relative_url }}) | Welche organisatorischen und rechtlichen Rahmenbedingungen sollten vor Projektstart geprüft werden? |

---

**Version:** 1.0<br>
**Stand:** Mai 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.






