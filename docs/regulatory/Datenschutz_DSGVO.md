---
layout: default
title: Datenschutz & DSGVO
parent: Regulatorisches
nav_order: 4
description: DSGVO-konforme Nutzung von LLM-APIs — was in Prompts darf, welcher Dienst wann passt und wie Agenten datenschutzgerecht gebaut werden
has_toc: true
---

# Datenschutz & DSGVO
{: .no_toc }

> **Wer personenbezogene Daten an eine externe KI-API schickt, ist Verantwortlicher im Sinne der DSGVO — unabhängig davon, ob das bewusst passiert oder nicht.**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Warum Datenschutz für KI-Entwickler relevant ist

Die DSGVO gilt seit 2018 in der gesamten EU. Sie schreibt vor, wie personenbezogene Daten — also Daten, die sich einer natürlichen Person zuordnen lassen — erhoben, verarbeitet und gespeichert werden dürfen. Wer einen Agenten baut, der Kundenfragen beantwortet, E-Mails analysiert oder Bewerbungsunterlagen auswertet, verarbeitet fast zwangsläufig personenbezogene Daten.

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

text = "Bitte prüfe die Anfrage von Max Müller (max@example.com)."
ergebnisse = analyzer.analyze(text=text, language="de")
anonymisiert = anonymizer.anonymize(text=text, analyzer_results=ergebnisse)

print(anonymisiert.text)
# → "Bitte prüfe die Anfrage von <PERSON> (<EMAIL_ADDRESS>)."
```

**Typischer Fehler:** Entwickler testen mit echten Produktionsdaten, weil das bequemer ist als Testdaten zu erstellen. Damit gelangen reale personenbezogene Daten in externe APIs, Logs und Traces — oft ohne dass das in der Datenschutzdokumentation erfasst ist.

---

## Welcher Dienst für welche Daten?

Nicht jeder KI-Dienst eignet sich für jeden Anwendungsfall. Die Entscheidung hängt davon ab, wie sensibel die verarbeiteten Daten sind.

| Datensensitivität | Beispiele | Geeigneter Dienst |
|---|---|---|
| Keine personenbezogenen Daten | Öffentliche Texte, anonymisierte Fragen | OpenAI API (Standard) |
| Interne Unternehmensdaten, kein PII | Technische Dokumentation, anonymisierte Protokolle | OpenAI API mit Opt-out from Training |
| Personenbezogene Daten (Standard) | Kundenfragen, interne E-Mails | Azure OpenAI mit Auftragsverarbeitungsvertrag |
| Besondere Kategorien (Art. 9 DSGVO) | Gesundheitsdaten, Bewerbungsunterlagen | Lokales Modell (Ollama, vLLM) |

Der wesentliche Unterschied zwischen OpenAI (Standard) und Azure OpenAI: Azure bietet ein europäisches Rechenzentrum und einen standardisierten Auftragsverarbeitungsvertrag. Daten verlassen dabei nicht die EU-Region, und Microsoft verpflichtet sich vertraglich zur DSGVO-konformen Verarbeitung.

Lokale Modelle über Ollama oder vLLM laufen vollständig auf eigener Infrastruktur. Kein Byte verlässt das eigene System. Das ist die sicherste Option für hochsensible Daten — allerdings mit dem Nachteil, dass lokale Modelle in Qualität und Leistung hinter den großen Cloudmodellen zurückbleiben.

**Grenze:** Auch der Einsatz eines lokalen Modells befreit nicht von der DSGVO. Die Daten werden weiterhin verarbeitet, und alle anderen Anforderungen — Zweckbindung, Speicherbegrenzung, Betroffenenrechte — gelten unverändert.

---

## Tracing und Logging — die vergessene Datenschutzfrage

LangSmith speichert jeden Prompt und jede Ausgabe des Agenten. Das ist für Debugging und Qualitätssicherung wertvoll, aber auch eine Datenschutzfrage: Wenn ein Prompt personenbezogene Daten enthält, liegen diese Daten anschließend im LangSmith-System.

Im Kurs wird bereits der EU-Endpunkt verwendet (`eu.api.smith.langchain.com`), was bedeutet, dass die Daten in einer EU-Region gespeichert werden. Das ist ein erster wichtiger Schritt.

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
| OpenAI (API) | Ja | In den API-Nutzungsbedingungen, auf Anfrage auch angepasst |
| Azure OpenAI | Ja, standardisiert | Im Microsoft-Kundenvertrag enthalten |
| Anthropic (Claude API) | Ja | Auf Anfrage |
| Hugging Face (Inference API) | Ja | In den Nutzungsbedingungen |

Entwickler müssen das nicht selbst aushandeln — aber sie sollten wissen, dass diese Verträge existieren müssen, und im Zweifel die Rechtsabteilung oder den Datenschutzbeauftragten einschalten, bevor ein System produktiv geht.

**In der Praxis relevant wenn:** Ein Unternehmen einen Agenten baut, der echte Nutzerdaten verarbeitet, und dieser Agent in einer produktiven Umgebung eingesetzt wird — nicht nur für interne Tests.

---

## Datenschutz by Design

Datenschutz by Design bedeutet: Datenschutz nicht nachträglich einbauen, sondern von Anfang an in die Architektur einplanen. Bei Agenten-Systemen heißt das konkret, dass personenbezogene Daten möglichst früh im Datenfluss gefiltert oder anonymisiert werden — nicht erst bevor die Antwort ausgegeben wird.

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

Der Prüfschritt findet statt, bevor die Daten den Agenten überhaupt erreichen — nicht nachdem sie bereits in einem Prompt oder Trace gelandet sind.

Darüber hinaus gilt das Prinzip der **Datensparsamkeit**: Nur die Daten erheben und verarbeiten, die für den konkreten Zweck tatsächlich nötig sind. Ein Agent, der Bestellstatus abruft, braucht keinen Zugriff auf die vollständige Bestellhistorie eines Nutzers.

---

## Wann ist eine Datenschutzfolgenabschätzung nötig?

Eine **Datenschutzfolgenabschätzung** (DSFA, englisch: Data Protection Impact Assessment, DPIA) ist nach Art. 35 DSGVO Pflicht, wenn eine Verarbeitung voraussichtlich ein hohes Risiko für Betroffene darstellt.

Für LLM-basierte Systeme ist eine DSFA wahrscheinlich erforderlich, wenn mindestens zwei der folgenden Bedingungen zutreffen:

- Das System verarbeitet systematisch besondere Kategorien personenbezogener Daten (Gesundheit, Biometrie, Religion, politische Überzeugung)
- Das System trifft oder bereitet automatisierte Entscheidungen mit Rechtswirkung vor (Kreditvergabe, Stellenbesetzung, medizinische Empfehlung)
- Das System verarbeitet Daten von schutzbedürftigen Gruppen (Minderjährige, Patienten, Beschäftigte)
- Es handelt sich um eine neue Technologie, deren Risiken noch nicht vollständig bekannt sind

Ein Chatbot für FAQs zu Produkten erfüllt in der Regel keine dieser Bedingungen. Ein Agent, der Bewerbungsunterlagen auswertet und eine Vorauswahl trifft, erfüllt mindestens zwei.

**Grenze:** Die Entscheidung, ob eine DSFA erforderlich ist, liegt beim Datenschutzbeauftragten des Unternehmens — nicht beim Entwickler. Die Aufgabe des Entwicklers ist es, die relevanten Informationen bereitstellen zu können: welche Daten verarbeitet werden, wie lange sie gespeichert bleiben und welche Drittanbieter beteiligt sind.

---

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [EU AI Act](./EU_AI_Act.html) | Welche Risikostufen und Anforderungen definiert das europäische KI-Recht? |
| [Agenten-Sicherheit](../concepts/Agent_Security.html) | Wie werden Agenten gegen technische Angriffe wie Prompt Injection und Tool-Missbrauch abgesichert? |
| [Human-in-the-Loop](../concepts/Human_in_the_Loop.html) | Wann und wie werden Menschen als Kontrollinstanz eingebunden — auch als Datenschutzmaßnahme bei sensiblen Entscheidungen? |
| [Lohnt es sich überhaupt?](../concepts/Lohnt_es_sich.html) | Welche organisatorischen und rechtlichen Rahmenbedingungen sollten vor Projektstart geprüft werden? |

---

**Version:** 1.0<br>
**Stand:** April 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
