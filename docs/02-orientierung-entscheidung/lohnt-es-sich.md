---
layout: default
title: Lohnt sich KI?
parent: "Orientierung & Entscheidung"
nav_order: 1
description: "Einschätzung vor Projektstart: ob ein KI-Vorhaben sinnvoll, machbar und verantwortbar ist"
has_toc: true
---

# Lohnt sich KI?
{: .no_toc }

> **Vor dem Bau steht die Frage, ob das Projekt überhaupt sinnvoll ist.**

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Warum diese Frage vor der Architektur kommt

Viele KI-Diskussionen starten mit Modellen, Frameworks oder direkt mit Agenten. Das wirkt konkret, ist aber oft zu früh. Zuerst muss klar sein, ob ein KI-System in diesem Fall überhaupt passt: sinnvoll, machbar und verantwortbar.

Diese Seite beantwortet deshalb nicht, welches Werkzeug gebaut werden soll. Sie prüft, ob das Vorhaben als Projektgrundlage tragfähig ist. Danach hilft die Entscheidungsseite [Aufgaben & Lösungswege]({{ '/02-orientierung-entscheidung/aufgabenklassen-und-loesungswege.html' | relative_url }}) bei der Architekturwahl.

Typischer Fehler: `Wir wollen KI einsetzen` als Problemformulierung zu behandeln. Das ist noch kein Ziel, sondern eher eine Idee.

## Problemklärung zuerst

Eine sinnvolle Bewertung beginnt mit dem heutigen Ablauf. Wer macht die Arbeit bisher? Wo entsteht Aufwand? Was ist fehleranfällig? Und woran erkennt das Team später, dass es besser geworden ist?

Wenn sich das Problem nicht sauber beschreiben lässt, wird später auch die Bewertung schwierig. Genau hier kippen Projekte oft: Aus einer konkreten Aufgabe wird ein offenes Experiment. Dann passen Erwartungen und Rahmenbedingungen nicht mehr zueinander.

Warnsignale sind deshalb: ein Ziel, das sich nicht genau festhalten lässt; fehlende Erfolgskriterien; oder Formulierungen wie `Wir wollen mal sehen, was KI kann`.

## Datenlage entscheidet mit

KI funktioniert nicht im luftleeren Raum. Ein System braucht Daten: Texte, Dokumente, strukturierte Informationen, Bilder oder Prozessdaten. Es reicht nicht, dass Daten irgendwo existieren. Sie müssen zugänglich, aktuell genug, konsistent und rechtlich nutzbar sein.

| Typisches Problem | Warum es wichtig ist |
|---|---|
| Daten liegen unstrukturiert vor | Vorverarbeitung kostet oft mehr als gedacht |
| Daten sind über viele Quellen verteilt | Integrationsaufwand steigt stark |
| sensible oder personenbezogene Daten | Cloud-Nutzung kann eingeschränkt oder ausgeschlossen sein |
| zu wenig Daten für Tests und Evaluation | Qualität lässt sich später kaum belastbar nachweisen |

Grenze: Eine gute Modellauswahl kann keine schlechte oder unzugängliche Datengrundlage ausgleichen.

## Der Nutzen muss konkret sein

Ein Vorhaben lohnt sich nicht, weil es nach moderner KI klingt. Es lohnt sich, wenn ein messbarer Mehrwert entsteht: weniger Suchzeit, bessere Qualität, mehr Durchsatz oder eine Fähigkeit, die ohne KI vorher nicht erreichbar war.

Wichtig ist der Vergleich mit dem Status quo. Wenn ein regelbasierter Prozess oder ein kleines Skript die Aufgabe bereits gut löst, ist KI oft nicht die beste Wahl. KI ist besonders dann naheliegend, wenn natürliche Sprache, unstrukturierte Informationen, unscharfe Entscheidungsräume oder ein hohes Volumen eine Rolle spielen.

In der Praxis relevant, wenn: Die Aufgabe stark sprachlich geprägt ist, das Volumen hoch ist oder starrere Regeln die nötige Flexibilität nicht mehr liefern.

## Kosten müssen früh mitgedacht werden

Auch ein kleiner Prototyp kann Kosten verursachen. Dazu gehören Modellnutzung, Infrastruktur, Vektordatenbanken, Monitoring, Entwicklungszeit und später auch der laufende Betrieb. Der Fehler liegt selten nur in zu teuren API-Aufrufen. Oft unterschätzen Teams Aufwand durch Integration, Evaluation, Pflege und Monitoring.

Ein einfacher Agent auf einem kleinen Modell kann pro Anfrage günstig sein. Ein Multi-Agent-Setup mit teureren Modellen, vielen Tool-Aufrufen und mehrstufigem Monitoring hat eine andere Kostenstruktur. Deshalb sollte man früh nicht nur nach technischer Machbarkeit fragen, sondern nach dem laufenden Aufwand.

## Risiken realistisch einordnen

Ein sinnvolles KI-Projekt braucht einen Nutzen und ein realistisches Bild der Risiken. Technische Risiken sind zum Beispiel Halluzinationen, Qualitätsdrift, hohe Latenz oder unerwartet hohe Kosten durch Schleifen und unklare Prompts. Im Team können überhöhte Erwartungen oder fehlende Akzeptanz zum Problem werden.

Zusätzlich gibt es regulatorische Fragen. In sensiblen Bereichen wie HR, Gesundheit, Finanzen oder Kreditvergabe kann die Risikoeinstufung so hoch sein, dass zusätzliche Anforderungen nicht “optional”, sondern verpflichtend werden.

| Risikotyp | Typisches Beispiel |
|---|---|
| technisch | plausible, aber falsche Antworten |
| organisatorisch | Stakeholder erwarten 100 Prozent Genauigkeit |
| regulatorisch | sensible Daten oder Hochrisiko-Anwendung |

## Erwartungen müssen vor dem Start korrigiert werden

Viele Projekte scheitern nicht zuerst an der Technik, sondern an falschen Erwartungen. Ein Prototyp ist nicht automatisch produktionsreif. Ein Agent ersetzt nicht von heute auf morgen ein ganzes Team. Und ein KI-System wird nicht automatisch besser, nur weil es im Betrieb mehr Anfragen sieht.

Gute Kommunikation klärt deshalb früh, was das System leisten kann – und was nicht. Weniger Fehler zu machen ist nicht dasselbe wie fehlerfrei zu sein. Unterstützung ist nicht dasselbe wie vollständiger Ersatz.

Typischer Fehler: Den ersten funktionierenden Demo-Flow als ausreichende Grundlage für den produktiven Betrieb zu interpretieren.

## Eine einfache Go- oder No-Go-Logik

Wenn Problem, Daten, Nutzen, Risiken und Erwartungen klar genug sind, lässt sich eine erste Einschätzung treffen. Ein Projekt wirkt tragfähig, wenn das Ziel konkret ist, die Daten verfügbar und rechtlich nutzbar sind, der Mehrwert gegenüber dem Status quo nachvollziehbar bleibt und die zentralen Risiken benannt sind.

Wenn die Fragestellung unscharf bleibt, keine sinnvolle Evaluation möglich ist, die Datenlage nicht reicht oder der Nutzen nur allgemein behauptet wird, ist Vorsicht sinnvoll.

```text
Kurzcheck:
- Ist das Problem klar formuliert?
- Gibt es brauchbare und rechtlich nutzbare Daten?
- Entsteht ein messbarer Mehrwert gegenüber einfacheren Lösungen?
- Sind Risiken, Erwartungen und Verantwortung realistisch eingeordnet?
```

## Was für Entwickler zuerst wichtig ist

Für Entwickler reicht oft eine nüchterne Vorprüfung. Wenn ein Vorhaben vor allem auf Begeisterung für KI basiert, aber Problem, Daten und Erfolgskriterien unklar bleiben, ist Architekturarbeit zu früh. Der nächste Schritt ist dann Problemklärung.

Außerdem unterschätzen viele, wie viel Wert ein klares No-Go haben kann. Ein nicht gestartetes Projekt, das sauber verworfen wurde, spart oft mehr Zeit und Geld als ein vorschnell gebauter Prototyp.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Aufgaben & Lösungswege]({{ '/02-orientierung-entscheidung/aufgabenklassen-und-loesungswege.html' | relative_url }}) | Welcher Lösungsweg ist passend, wenn ein KI-Vorhaben grundsätzlich sinnvoll erscheint? |
| [Evaluation & Observability]({{ '/07-qualitaet-sicherheit/evaluation-observability.html' | relative_url }}) | Wie wird die Qualität eines späteren Systems belastbar gemessen? |
| [Agenten-Sicherheit]({{ '/07-qualitaet-sicherheit/agent-security.html' | relative_url }}) | Welche Sicherheitsfragen müssen in kritischen Projekten zusätzlich berücksichtigt werden? |
| [EU AI Act]({{ '/09-regulatorik-verantwortung/eu-ai-act.html' | relative_url }}) | Welche regulatorischen Anforderungen können ein Vorhaben einschränken oder prägen? |
| [Digitale Souveränität]({{ '/09-regulatorik-verantwortung/digitale-souveraenitaet.html' | relative_url }}) | Welche Abhängigkeiten und Cloud-Fragen entstehen durch Modell- und Infrastrukturwahl? |

---

**Version:** 1.2<br>
**Stand:** Juli 2026<br>
**Kurs:** KI-Agenten. Planen. Handeln. Prüfen.
