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

Viele KI-Diskussionen starten zu früh: mit Modellen, Frameworks oder direkt mit Agenten. Das ist spannend, aber häufig zu früh. Bevor man über die Architektur nachdenkt, sollte klar sein, ob ein KI-System in diesem Fall überhaupt passt: sinnvoll, machbar und verantwortbar.

Diese Seite beantwortet daher nicht, welches konkrete Werkzeug man nehmen sollte. Sie prüft zuerst, ob das Vorhaben als Projektgrundlage tragfähig ist. Damit ergänzt sie die spätere Entscheidungsseite [Aufgaben & Lösungswege]({{ '/02-orientierung-entscheidung/aufgabenklassen-und-loesungswege.html' | relative_url }}).

Typischer Fehler: `Wir wollen KI einsetzen` als Problemformulierung zu behandeln. Das ist noch kein Ziel, sondern eher eine Idee.

## Problemklärung zuerst

Eine sinnvolle Bewertung geht nur, wenn das zugrunde liegende Problem wirklich klar ist. Dafür braucht es Antworten darauf, was sich konkret verbessern soll: Was wird beschleunigt, vereinfacht oder automatisiert? Wie sieht der heutige Ablauf aus? Und woran soll später klar sein, dass es besser geworden ist?

Wenn sich ein Problem nicht sauber beschreiben lässt, wird später auch eine belastbare Bewertung schwierig. Genau an dieser Stelle kippen Projekte oft: aus einer konkreten Aufgabe wird ein offenes Experiment. Dann passen Erwartungen und Rahmenbedingungen nicht mehr zueinander.

Warnsignale sind deshalb: ein Ziel, das sich nicht genau festhalten lässt; fehlende Erfolgskriterien; oder Formulierungen wie `Wir wollen mal sehen, was KI kann`.

## Datenlage entscheidet mit

KI funktioniert nicht im luftleeren Raum. Ein System braucht Daten – etwa Texte, Dokumente, strukturierte Informationen, Bilder oder Prozessdaten. Entscheidend ist nicht nur, ob es grundsätzlich Daten gibt. Es zählt, ob sie zugänglich sind, wie aktuell sie sind, ob sie konsistent vorliegen und ob die Nutzung rechtlich in Ordnung ist.

| Typisches Problem | Warum es wichtig ist |
|---|---|
| Daten liegen unstrukturiert vor | Vorverarbeitung kostet oft mehr als gedacht |
| Daten sind über viele Quellen verteilt | Integrationsaufwand steigt stark |
| sensible oder personenbezogene Daten | Cloud-Nutzung kann eingeschränkt oder ausgeschlossen sein |
| zu wenig Daten für Tests und Evaluation | Qualität lässt sich später kaum belastbar nachweisen |

Grenze: Eine gute Modellauswahl kann keine schlechte oder unzugängliche Datengrundlage ausgleichen.

## Der Nutzen muss konkret sein

Ein Vorhaben lohnt sich nicht, weil es nach moderner KI klingt. Es lohnt sich, wenn ein echter, messbarer Mehrwert entsteht. Dafür kommen häufig folgende Nutzenformen infrage: Zeitersparnis, bessere Qualität, bessere Skalierung oder Fähigkeiten, die ohne KI vorher so nicht erreichbar wären.

Wichtig ist der Vergleich mit dem Status quo. Wenn ein regelbasierter Prozess oder ein kleines Skript die Aufgabe bereits gut löst, ist KI oft nicht die beste Wahl. KI ist besonders dann naheliegend, wenn natürliche Sprache, unstrukturierte Informationen, unscharfe Entscheidungsräume oder ein hohes Volumen eine Rolle spielen.

In der Praxis relevant, wenn: Die Aufgabe stark sprachlich geprägt ist, das Volumen hoch ist oder starrere Regeln die nötige Flexibilität nicht mehr liefern.

## Kosten müssen früh mitgedacht werden

Auch ein kleiner Prototyp kann Kosten verursachen. Dazu gehören Modellnutzung, Infrastruktur, Vektordatenbanken, Monitoring, Entwicklungszeit und später auch der laufende Betrieb. Der Fehler liegt selten nur in zu teuren API-Aufrufen. Oft unterschätzen Teams Aufwand durch Integration, Evaluation, Pflege und Monitoring.

Ein einfacher Agent auf einem kleinen Modell kann pro Anfrage günstig sein. Sobald es aber ein komplexeres Multi-Agent-Setup wird – mit teureren Modellen, vielen Tool-Aufrufen und mehrstufigem Monitoring – entsteht schnell eine andere Kostenstruktur. Genau deshalb sollte man früh nicht nur nach technischer Machbarkeit schauen, sondern nach dem nachhaltigen Aufwand.

## Risiken realistisch einordnen

Ein sinnvolles KI-Projekt braucht nicht nur einen Nutzen, sondern auch ein realistisches Bild der Risiken. Technische Risiken sind zum Beispiel Halluzinationen, Qualitätsdrift, hohe Latenz oder unerwartet hohe Kosten durch Schleifen und unklare Prompts. Organisatorisch können überhöhte Erwartungen oder fehlende Akzeptanz im Team problematisch sein.

Zusätzlich gibt es regulatorische Fragen. In sensiblen Bereichen wie HR, Gesundheit, Finanzen oder Kreditvergabe kann die Risikoeinstufung so hoch sein, dass zusätzliche Anforderungen nicht “optional”, sondern verpflichtend werden.

| Risikotyp | Typisches Beispiel |
|---|---|
| technisch | plausible, aber falsche Antworten |
| organisatorisch | Stakeholder erwarten 100 Prozent Genauigkeit |
| regulatorisch | sensible Daten oder Hochrisiko-Anwendung |

## Erwartungen müssen vor dem Start korrigiert werden

Viele Projekte scheitern nicht primär an der Technik, sondern daran, was vorher versprochen oder erwartet wird. Ein Prototyp ist nicht automatisch produktionsreif. Ein Agent ersetzt nicht einfach “von heute auf morgen” ein ganzes Team. Und ein KI-System wird nicht automatisch besser, nur weil es im Betrieb mehr Anfragen sieht.

Gute Kommunikation klärt deshalb früh, was das System leisten kann – und was nicht. Weniger Fehler zu machen ist nicht dasselbe wie fehlerfrei zu sein. Unterstützung ist nicht dasselbe wie vollständiger Ersatz.

Typischer Fehler: Den ersten funktionierenden Demo-Flow als ausreichende Grundlage für den produktiven Betrieb zu interpretieren.

## Eine einfache Go- oder No-Go-Logik

Wenn Problem, Daten, Nutzen, Risiken und Erwartungen halbwegs klar sind, kann man zu Beginn eine erste Einschätzung treffen. Ein Projekt wirkt tragfähig, wenn das Ziel konkret ist, die Daten verfügbar und rechtlich nutzbar sind, der Mehrwert gegenüber dem Status quo nachvollziehbar bleibt und die zentralen Risiken wenigstens benannt und planbar sind.

Wenn die Fragestellung unscharf bleibt, keine sinnvolle Evaluation möglich ist, die Datenlage nicht reicht oder der Nutzen nur allgemein behauptet wird, ist Vorsicht sinnvoll.

```text
Kurzcheck:
- Ist das Problem klar formuliert?
- Gibt es brauchbare und rechtlich nutzbare Daten?
- Entsteht ein messbarer Mehrwert gegenüber einfacheren Lösungen?
- Sind Risiken, Erwartungen und Verantwortung realistisch eingeordnet?
```

## Was für Entwickler zuerst wichtig ist

Für Entwickler reicht oft bereits eine nüchterne Vorprüfung. Wenn ein Vorhaben vor allem auf Begeisterung für KI basiert, aber Problem, Daten und Erfolgskriterien nicht sauber benannt werden können, liegt der beste nächste Schritt in der Regel nicht bei Architekturarbeit, sondern bei der Problemklärung.

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

**Version:** 1.1<br>
**Stand:** Mai 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.