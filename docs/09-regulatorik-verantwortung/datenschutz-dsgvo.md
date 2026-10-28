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

Das Besondere bei LLM-basierten Systemen: Datenschutzverstöße entstehen oft nebenbei. Ein Entwickler schickt einen Kundennamen im Prompt mit, weil es das Testen vereinfacht. Ein Agent liest eine E-Mail aus und übergibt den vollständigen Text an die API. Der LangSmith-Trace enthält eine Kundennummer. Dafür braucht es keine böse Absicht. Es reicht, Datenflüsse nicht bewusst zu planen.

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

Für die automatische Erkennung und Maskierung von personenbezogenen Daten gibt es Werkzeuge wie `presidio` von Microsoft. Solche Werkzeuge helfen bei Namen, E-Mails, Telefonnummern und anderen PII-Typen. Sie ersetzen aber keine fachliche Prüfung der Datenflüsse.

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

Bei Cloud-LLM-APIs müssen Datenkontrollen konkret geprüft werden: Werden Eingaben zum Training verwendet? Welche Logs entstehen? Wie lange werden Inhalte gespeichert? Gibt es einen Auftragsverarbeitungsvertrag, Datenresidenzoptionen oder regionale Verarbeitung? Solche Details gehören in die technische und organisatorische Bewertung, nicht nur in eine Produktauswahl nach Anbietername.

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
    "run_name": "m20_rag_query",
    "tags": ["rag"],
    "metadata": {
        "modul": "modul",
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

## Drittlandübermittlung — wenn Daten die EU verlassen

Die meisten großen LLM-APIs werden von Unternehmen mit Sitz in den USA betrieben. Sobald personenbezogene Daten dorthin übertragen oder von dort aus abgerufen werden können, handelt es sich um eine **Übermittlung in ein Drittland** (Kapitel V DSGVO). Sie braucht zusätzlich zum AVV eine eigene Rechtsgrundlage. Das gilt auch, wenn der Anbieter einen EU-Server anbietet, aber aus dem Drittland auf die Daten zugreifen kann (z. B. Support, Wartung).

| Grundlage | Kurzbeschreibung | Was Entwickler prüfen |
|---|---|---|
| **Angemessenheitsbeschluss** (Art. 45) | Die EU-Kommission stellt fest, dass das Zielland ein angemessenes Schutzniveau bietet. Für die USA gilt das **EU-US Data Privacy Framework** (DPF) nur für Anbieter, die sich darunter zertifiziert haben. | Ist der Anbieter DPF-zertifiziert? |
| **Standardvertragsklauseln** (Art. 46) | Vom Anbieter und Kunden vereinbarte EU-Standardklauseln, in der Regel Teil des AVV/DPA. | Sind sie im Vertrag enthalten? Wurde das Risiko des Drittlandzugriffs bewertet? |
| **Keine Übermittlung** | Verarbeitung in der EU, lokales Modell oder EU-Anbieter ohne Zugriff aus Drittländern. | Ist der Zugriff aus Drittländern ausgeschlossen? |

**Aktuelle Rechtslage (Stand Oktober 2026):** Das DPF gilt. Das Gericht der EU hat die Klage dagegen im September 2025 abgewiesen, die Berufung (C-703/25 P) ist beim EuGH anhängig. Frühere Abkommen (Safe Harbor, Privacy Shield) sind vom EuGH gekippt worden. Eine Aufhebung des DPF ist daher nicht ausgeschlossen.

**Konsequenz für die Praxis:** Die Architektur sollte so gebaut sein, dass ein Wechsel möglich bleibt: Modellzugriff über Adapter, Region und Anbieter in der Konfiguration, keine Klardaten in Traces. Mehr dazu steht in [Digitale Souveränität]({{ '/09-regulatorik-verantwortung/digitale-souveraenitaet.html' | relative_url }}).

**Typischer Fehler:** „Der Server steht in der EU, also gibt es keine Übermittlung." Entscheidend ist, wer auf die Daten zugreifen kann, nicht nur, wo sie gespeichert sind.

Entwickler müssen die Rechtsgrundlage nicht selbst bewerten. Vor dem produktiven Einsatz mit personenbezogenen Daten sollten sie aber die Rechtsabteilung oder den Datenschutzbeauftragten einbeziehen. Diese Seite ersetzt keine Rechtsberatung.

---

## Datenschutz by Design

Datenschutz by Design bedeutet: Datenschutz nicht nachträglich einbauen, sondern von Anfang an in die Architektur einplanen. Bei Agenten-Systemen heißt das konkret: personenbezogene Daten möglichst früh im Datenfluss filtern oder anonymisieren, bevor sie in Prompt, RAG-Index, Tool-Aufruf, Notebook-Ausgabe oder Trace landen.

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
| [Human-in-the-Loop]({{ '/04-agenten-implementierung/ablauf-zustand/human-in-the-loop.html' | relative_url }}) | Wann und wie werden Menschen als Kontrollinstanz eingebunden — auch als Datenschutzmaßnahme bei sensiblen Entscheidungen? |
| [Lohnt sich KI?]({{ '/02-orientierung-entscheidung/lohnt-es-sich.html' | relative_url }}) | Welche organisatorischen und rechtlichen Rahmenbedingungen sollten vor Projektstart geprüft werden? |
| [Digitale Souveränität]({{ '/09-regulatorik-verantwortung/digitale-souveraenitaet.html' | relative_url }}) | Wie werden Anbieterabhängigkeiten, Datenflüsse und Exit-Strategien gestaltet? |

---

**Version:** 1.3<br>
**Stand:** Oktober 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.






