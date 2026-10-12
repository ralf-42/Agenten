# Change Request CR-02 – Managed Cloud Vector DB

**Antrag:** CR-02  
**Antragsteller:** Jonas Reiter  
**Antragsdatum:** 07.04.2026  
**Entscheidung:** genehmigt am 14.04.2026 durch den Steuerkreis  
**Bezug:** Entscheidung D1 vom 17.03.2026 und Entscheidung D2 vom 14.04.2026

## Änderung

Die für die Prototyp-Evaluation eingesetzte ChromaDB wird nicht als produktive Vektordatenbank weitergeführt. Für den produktiven Einsatz soll eine verwaltete Cloud-Vektordatenbank verwendet werden.

## Begründung

- Betrieb und Skalierung sollen nicht dauerhaft durch das Projektteam selbst erfolgen.
- Der produktive Zugriff soll kontrolliert und für spätere Rollen- und Rechteprüfungen vorbereitet werden.
- ChromaDB bleibt als technische Option für lokale Tests und die Prototyp-Umgebung erhalten.

## Auswirkungen

| Bereich | Auswirkung |
|---|---|
| Architektur | Austausch der produktiven Vektorspeicher-Komponente |
| Zeitplan | Zusätzliche Prüfung von Migration, Zugriff und Belastbarkeit |
| Kosten | Cloud-Infrastruktur wird im Kostenstatus als eigener Budgetposten geführt |
| Datenschutz | Freigabe gilt weiterhin nur für den kuratierten Testkorpus bzw. die ausdrücklich freigegebenen Daten |
| Betrieb | Für produktive Nutzung sind Monitoring, Zugriffsregeln und Freigaben erforderlich |

## Entscheidungsstatus

Der Change Request ist mit D2 genehmigt. D1 bleibt als historischer Prototyp-Beschluss dokumentiert und gilt nicht als aktuelle Entscheidung für den produktiven Betrieb.
