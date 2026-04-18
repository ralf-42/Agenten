---
layout: default
title: Lohnt sich KI?
parent: Konzepte
nav_order: 0
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

Viele Diskussionen über KI-Projekte springen zu früh in Modelle, Frameworks oder Agentenarchitekturen. Das ist verlockend, aber oft zu früh. Zuerst muss geklärt werden, ob ein KI-System hier überhaupt sinnvoll, machbar und verantwortbar ist. Erst danach stellt sich die Frage nach dem richtigen Lösungsweg.

Diese Seite bewertet deshalb nicht, welches konkrete Werkzeug gewählt werden sollte, sondern ob ein Vorhaben überhaupt tragfähig wirkt. Sie ergänzt damit die spätere Entscheidungsseite [Welches Werkzeug?](./Aufgabenklassen_und_Loesungswege.html).

Typischer Fehler: `Wir wollen KI einsetzen` als Problemformulierung zu behandeln. Das ist noch kein Projektziel, sondern höchstens eine Lösungsfantasie.

## Problemklärung zuerst

Ein KI-Projekt kann nur dann sinnvoll bewertet werden, wenn das zugrunde liegende Problem klar formuliert ist. Gefragt werden muss, was konkret verbessert, beschleunigt oder automatisiert werden soll, wie der heutige Ablauf aussieht und woran später Erfolg erkannt werden soll.

Wenn ein Problem nicht präzise beschrieben werden kann, ist meist auch keine tragfähige Evaluation möglich. Genau dort kippt ein Projekt schnell in ein offenes Experiment, das andere Erwartungen und einen anderen Rahmen braucht.

Warnsignale sind deshalb ein unklar formuliertes Ziel, fehlende Erfolgskriterien oder Sätze wie `Wir wollen mal sehen, was KI kann`.

## Datenlage entscheidet mit

KI-Systeme arbeiten nie im luftleeren Raum. Sie brauchen Daten: Texte, Dokumente, strukturierte Informationen, Bilder oder Prozessdaten. Entscheidend ist nicht nur, ob solche Daten grundsätzlich existieren, sondern ob sie zugänglich, aktuell, konsistent und rechtlich nutzbar sind.

| Typisches Problem | Warum es wichtig ist |
|---|---|
| Daten liegen unstrukturiert vor | Vorverarbeitung kostet oft mehr als gedacht |
| Daten sind über viele Quellen verteilt | Integrationsaufwand steigt stark |
| sensible oder personenbezogene Daten | Cloud-Nutzung kann eingeschränkt oder ausgeschlossen sein |
| zu wenig Daten für Tests und Evaluation | Qualität lässt sich später kaum belastbar nachweisen |

Grenze: Gute Modellauswahl kompensiert keine schlechte oder unzugängliche Datengrundlage.

## Der Nutzen muss konkret sein

Ein Vorhaben lohnt sich nicht, weil KI modern wirkt, sondern weil ein messbarer Mehrwert entsteht. Typische Nutzenformen sind Zeitersparnis, Qualitätsverbesserung, bessere Skalierung oder Fähigkeiten, die ohne KI vorher kaum möglich waren.

Wichtig ist der Vergleich mit dem Status quo. Wenn ein klarer regelbasierter Prozess oder ein kleines Skript die Aufgabe genauso gut löst, ist KI oft nicht die beste Wahl. KI wird besonders dann plausibel, wenn natürliche Sprache, unstrukturierte Informationen, unscharfe Entscheidungsräume oder hohes Volumen eine Rolle spielen.

In der Praxis relevant, wenn: Die Aufgabe sprachlich geprägt ist, das Volumen hoch ist oder eine starre Regelbasis die nötige Flexibilität nicht mehr liefert.

## Kosten müssen früh mitgedacht werden

Auch kleine Prototypen haben Kosten. Dazu gehören Modellnutzung, Infrastruktur, Vektordatenbanken, Monitoring, Entwicklungszeit und späterer Betrieb. Der Fehler liegt selten nur in zu hohen API-Kosten. Häufiger werden Integration, Evaluation, Pflege und Monitoring unterschätzt.

Ein einfacher Agent auf einem kleinen Modell kann pro Anfrage günstig sein. Ein komplexes Multi-Agent-System mit teureren Modellen, vielen Tool-Aufrufen und mehrstufigem Monitoring entwickelt schnell eine ganz andere Kostenstruktur. Genau deshalb sollte nicht nur nach technischer Machbarkeit, sondern nach nachhaltigem Aufwand gefragt werden.

## Risiken realistisch einordnen

Ein sinnvolles KI-Projekt braucht nicht nur eine Nutzenperspektive, sondern auch ein realistisches Risikobild. Technische Risiken sind etwa Halluzinationen, Qualitätsdrift, hohe Latenz oder Kostenexplosion bei schlechten Schleifen und unklaren Prompts. Organisatorische Risiken reichen von überhöhten Erwartungen bis zu fehlender Akzeptanz im Team.

Hinzu kommen regulatorische Fragen. In sensiblen Bereichen wie HR, Gesundheit, Finanzen oder Kreditvergabe kann die Risikoeinstufung so hoch sein, dass zusätzliche Anforderungen nicht optional, sondern verpflichtend werden.

| Risikotyp | Typisches Beispiel |
|---|---|
| technisch | plausible, aber falsche Antworten |
| organisatorisch | Stakeholder erwarten 100 Prozent Genauigkeit |
| regulatorisch | sensible Daten oder Hochrisiko-Anwendung |

## Erwartungen müssen vor dem Start korrigiert werden

Viele Projekte scheitern nicht an der Technik, sondern an falschen Erwartungen. Ein Prototyp ist nicht automatisch produktionsreif. Ein Agent ersetzt nicht plötzlich ein ganzes Team. Und ein KI-System verbessert sich nicht von selbst, nur weil es im Betrieb mehr Anfragen sieht.

Gute Projektkommunikation benennt deshalb von Anfang an, was das System leisten kann und wo Grenzen bleiben. Fehlerreduktion ist etwas anderes als Fehlerfreiheit. Unterstützung ist etwas anderes als vollständiger Ersatz.

Typischer Fehler: Den ersten funktionierenden Demo-Flow als belastbare Produktionsreife zu missverstehen.

## Eine einfache Go- oder No-Go-Logik

Wenn Problem, Daten, Nutzen, Risiken und Erwartungen halbwegs klar sind, lässt sich eine erste Einschätzung treffen. Ein Projekt wirkt tragfähig, wenn das Ziel konkret ist, Daten verfügbar sind, der Mehrwert gegenüber dem Status quo erkennbar bleibt und zentrale Risiken zumindest benannt und planbar sind.

Umgekehrt ist Vorsicht geboten, wenn die Fragestellung unscharf bleibt, keine sinnvolle Evaluation möglich ist, keine brauchbare Datengrundlage existiert oder der Nutzen nur vage behauptet wird.

```text
Kurzcheck:
- Ist das Problem klar formuliert?
- Gibt es brauchbare und rechtlich nutzbare Daten?
- Entsteht ein messbarer Mehrwert gegenüber einfacheren Lösungen?
- Sind Risiken, Erwartungen und Verantwortung realistisch eingeordnet?
```

## Was für Einsteiger zuerst wichtig ist

Für Einsteiger reicht oft schon eine nüchterne Vorprüfung. Wenn ein Projekt nur auf Begeisterung für KI basiert, aber weder Problem noch Daten noch Erfolgskriterien sauber benannt werden können, ist der richtige nächste Schritt meist nicht Architekturarbeit, sondern Problemklärung.

Teilnehmende unterschätzen oft, dass ein gutes No-Go genauso wertvoll sein kann wie ein Go. Ein nicht gestartetes, aber sauber verworfenes Projekt spart oft mehr Zeit und Geld als ein vorschnell gebauter Prototyp.

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [Welches Werkzeug?](./Aufgabenklassen_und_Loesungswege.html) | Welcher Lösungsweg ist passend, wenn ein KI-Vorhaben grundsätzlich sinnvoll erscheint? |
| [Evaluation & Observability](./Evaluation_Observability.html) | Wie wird die Qualität eines späteren Systems belastbar gemessen? |
| [Wie werden Agenten gegen Missbrauch und Fehlverhalten abgesichert?](./Agent_Security.html) | Welche Sicherheitsfragen müssen in kritischen Projekten zusätzlich berücksichtigt werden? |
| [EU AI Act](../regulatory/EU_AI_Act.html) | Welche regulatorischen Anforderungen können ein Vorhaben einschränken oder prägen? |
| [Digitale Souveränität](../regulatory/Digitale_Souveraenitat.html) | Welche Abhängigkeiten und Cloud-Fragen entstehen durch Modell- und Infrastrukturwahl? |

---

**Version:** 1.1<br>
**Stand:** April 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.
