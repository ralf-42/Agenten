# Entwurf – Architekturentscheidung für den PMO-Assistenten

**Projekt:** Projekt Kompass  
**Entwurfsdatum:** 10.03.2026  
**Status:** Nicht freigegeben, später überholt  
**Autor:** Jonas Reiter, Arbeitsentwurf

> Dieser Text ist eine verworfene Arbeitsfassung. Er wurde nicht beschlossen und darf nicht als geltende Architekturentscheidung zitiert werden.

## Vorläufige Empfehlung

Für den ersten Aufbau des PMO-Assistenten sollte ChromaDB nicht nur lokal getestet, sondern auch für den späteren Produktivbetrieb vorgesehen werden. Der geringe Einrichtungsaufwand wäre für einen schnellen Start hilfreich. Diese Empfehlung entstand vor dem Belastungstest, der Datenschutzprüfung und der späteren Bewertung des Betriebsmodells.

Die Formulierung „für den Produktivbetrieb vorgesehen“ ist eine Empfehlung des Autors, kein Beschluss des Steuerkreises. Es gab zu diesem Zeitpunkt weder eine Anbieterfreigabe noch eine bestätigte Betriebsentscheidung.

## Noch offene Prüfungen

- Belastung und Verfügbarkeit bei mehreren gleichzeitigen Nutzerinnen und Nutzern
- Zugriffsschutz für unterschiedliche Projektrollen
- Datenschutzanforderungen bei einem späteren Einsatz mit realen Daten
- Betriebs- und Supportaufwand nach Ende der Prototyp-Phase

## Verbindlichkeit

Dieser Arbeitsentwurf wurde nicht zur Freigabe vorgelegt. Die spätere Entscheidung D1 vom 17.03.2026 begrenzte die Evaluation von ChromaDB auf den Prototyp. D2 vom 14.04.2026 legte für einen Produktivbetrieb eine verwaltete Cloud-Vektordatenbank fest und verwarf ChromaDB für diesen Einsatz. Für den aktuellen Beschlussstand sind das freigegebene Protokoll vom 14.04.2026 und das kumulative Entscheidungsprotokoll zu verwenden.
