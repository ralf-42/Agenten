# Projektstatusbericht: Projekt Kompass

**Berichtsstand:** 20.05.2026  
**Berichtszeitraum:** 01.05.–20.05.2026  
**Erstellt von:** Mara Vogt, Projektleitung  
**Adressaten:** Steuerkreis Projekt Kompass  
**Status:** Gelb – MVP in Arbeit, Pilotfreigabe steht aus

## 1. Zusammenfassung

Projekt Kompass entwickelt einen internen Recherche- und Wissensassistenten für Fachabteilungen der Nordlicht Software GmbH. Der Assistent soll Fragen zu Projektunterlagen beantworten, Belege zeigen und bei fehlender Evidenz offen bleiben. Die aktuelle Arbeit konzentriert sich auf den MVP mit einem kuratierten Testkorpus.

Der MVP ist noch nicht abgenommen. Das Team hat die Vektordatenbankentscheidung für einen späteren produktiven Betrieb mit D2 auf eine verwaltete Cloud-Lösung geändert. Der Anbieter ist noch nicht ausgewählt. ChromaDB bleibt für lokale Tests und die Prototyp-Umgebung vorgesehen. Für den Pilot fehlen weiterhin abgestimmte Zugriffsregeln und ein dokumentierter Test, der sicherstellt, dass nur freigegebene Quellen durchsucht werden.

Der Gesamtstatus ist gelb. Die Kostenprognose für Q2 liegt bei 124.500 Euro gegenüber einem Budgetrahmen von 120.000 Euro. Die Abweichung beträgt 4.500 Euro. Der wesentliche Treiber ist die Cloud-Infrastruktur; diese Kostenposition liegt 7.000 Euro über dem Plan. Die Zahlen beschreiben den aktuellen Forecast, nicht die späteren monatlichen Betriebskosten.

## 2. Fortschritt im Berichtszeitraum

Das Team hat den fiktiven Projektkorpus für die Kurs- und Prototyp-Arbeit vervollständigt. Er enthält freigegebene Projektunterlagen, Sitzungsprotokolle, einen Entscheidungsverlauf, eine Risikoliste, einen Follow-up-Tracker sowie Planungs- und Controllingdaten. Rohnotizen sind als Arbeitsmaterial gekennzeichnet und nicht mit freigegebenen Protokollen gleichzusetzen.

Die Retrieval-Arbeit vergleicht zunächst Schlüsselwortsuche und semantische Suche. Danach wird geprüft, ob der Assistent Fragen mit mehreren relevanten Dokumenten beantworten kann. Besonders wichtig ist die zeitliche Einordnung: D1 vom 17.03.2026 hielt ChromaDB für die Prototyp-Evaluation fest. Die spätere Entscheidung D2 vom 14.04.2026 sieht eine verwaltete Cloud-Vektordatenbank für den Produktivbetrieb vor und verwirft ChromaDB für diesen Zweck.

> Im Workshop vom 05.05.2026 wurden Anforderungen des Vertriebs aufgenommen. Dazu gehören schneller Zugriff auf Angebotsvorlagen, Kundenhistorien, Entscheidungsvorlagen und Lessons Learned. Diese Wünsche begründen noch keine Freigabe für reale Kundendaten. Der Testkorpus bleibt synthetisch.

Die Risiken werden weiterverfolgt. Risiko R2 zur Datenschutzfreigabe wurde am 28.04.2026 auf „mitigiert“ gesetzt, weil eine Freigabe für den kuratierten Testkorpus vorliegt. Diese Freigabe erstreckt sich nicht automatisch auf produktive Kundendaten. Risiko R4 zum Budget für den späteren Betrieb bleibt relevant, solange belastbare Betriebskosten und ein Anbieter fehlen.

## 3. Arbeitspakete und Abhängigkeiten

| Arbeitspaket | Stand am 20.05. | Nächster Schritt | Abhängigkeit |
|---|---|---|---|
| Korpus und Dokumentimport | Für den Testbestand vorbereitet | Extraktion und Quellenbezug erneut prüfen | Unterstützte Formate und Metadaten |
| Retrieval und Chunking | Prototypische Suche vorhanden | Trefferqualität mit längeren Dokumenten vergleichen | Chunk-Größe, Overlap und Eval-Fragen |
| Antwort mit Belegen | Entwurf vorhanden | Zitat und Dokumentdatum in jeder Antwort prüfen | Korrekte Zuordnung der Fundstelle |
| Rechte- und Rollensteuerung | Noch nicht entschieden | Optionen dem Steuerkreis zur Entscheidung vorlegen | Rollenmodell und technische Durchsetzung |
| Evaluation | Fragen zu Kernfällen liegen vor | Negativ-, Konflikt- und Fremdprojektfälle ergänzen | Kuratierte Ground Truth |
| Produktivarchitektur | D2 beschlossen, Anbieter offen | Anbieter und Betriebsmodell prüfen | Kosten, Datenschutz und Zugriffsregeln |

Die Arbeitspakete hängen voneinander ab. Ein guter Antwortprompt kompensiert keine falschen oder ungefilterten Quellen. Vor einem Pilot müssen daher Dokumentzugriff, Retrieval-Filter und nachgelagerte Quellenprüfung zusammen betrachtet werden. Die finale Rollenentscheidung wurde im Steuerkreis vom 19.05.2026 vertagt.

## 4. Termin- und Entscheidungslage

Der Meilensteinplan führt den MVP weiterhin als „in Arbeit“. Ein Ist-Abschlussdatum ist nicht dokumentiert. Der nächste größere Meilenstein ist der Pilotbetrieb im Juni/Juli. Er setzt eine MVP-Abnahme und freigegebene Zugriffsregeln voraus. Der im Kickoff skizzierte August-Termin für eine Rollout-Entscheidung bleibt eine Planung, keine bestätigte Zusage.

Die wichtigsten Beschlüsse und offenen Punkte sind:

| Thema | Aktueller Stand | Einordnung |
|---|---|---|
| Vektordatenbank im Prototyp | ChromaDB für lokale Tests | Gilt nicht als Produktiventscheidung |
| Vektordatenbank im Produktivbetrieb | Verwaltete Cloud-Lösung vorgesehen | Anbieter noch offen |
| Datenschutz | Testkorpus freigegeben | Keine Freigabe für produktive Kundendaten |
| Rechte und Rollen | Entscheidung vertagt | Voraussetzung für einen kontrollierten Pilot |
| MVP | In Arbeit | Kein dokumentiertes Abnahmedatum |
| Rollout | Entscheidung für August geplant | Noch nicht beschlossen |

Die Tabelle fasst den Stand zum Berichtsdatum zusammen. Für eine historische Frage sind die jeweiligen Sitzungsprotokolle maßgeblich; für den kumulierten Beschlussstand ist das Entscheidungsprotokoll heranzuziehen.

## 5. Budget und Ressourcen

Der Budgetrahmen beträgt 120.000 Euro. Der Forecast für Q2 liegt bei 124.500 Euro und damit 4.500 Euro über dem Rahmen. Die Cloud-Infrastruktur ist mit einer Abweichung von 7.000 Euro die größte auffällige Position. Der Gesamtstatus bleibt gelb; die rote Einzelposition führt nicht automatisch zu einem roten Projektstatus.

Die Kapazitätsmatrix weist Jonas Reiter im Mai mit 80 Prozent Projektallokation und hoher Auslastung aus. Das kann die Abstimmung zur Cloud-Architektur verzögern. Für Mara Vogt sind im Mai 60 Prozent eingeplant. Die Werte beziehen sich auf den dokumentierten Monat Mai; sie erlauben keine Aussage zur Besetzung im April oder zum späteren Betrieb.

Eine belastbare Prognose der monatlichen Betriebskosten nach dem Rollout liegt nicht vor. Ebenso ist kein verbindlicher Personalbedarf für den Produktivbetrieb dokumentiert. Diese Punkte bleiben offen und sollen nicht aus dem Q2-Forecast abgeleitet werden.

## 6. Qualitäts- und Abnahmekriterien für den nächsten Schritt

Vor einer Pilotfreigabe müssen mindestens folgende Nachweise vorliegen:

1. Bei einer beantwortbaren Frage nennt der Assistent die richtige Quelle und unterscheidet Dokumentdatum und Berichtsstand.
2. Bei einer Frage ohne Beleg antwortet er „Nicht im Korpus“ und ergänzt keine plausiblen Werte aus Modellwissen.
3. Bei widersprüchlichen oder veralteten Fundstellen erklärt er, welche Quelle den aktuellen Stand trägt.
4. Dokumente eines anderen Projekts werden nicht als Beleg für Projekt Kompass verwendet.
5. Der Assistent gibt keine Inhalte aus Quellen aus, deren Berechtigung nicht feststeht.

Die nächste Evaluation soll deshalb nicht nur zusätzliche Fragen enthalten. Sie soll auch längere Dokumente mit Informationen an verschiedenen Stellen, einen alten Entwurf und ein ähnlich formuliertes Fremdprojekt-Protokoll einbeziehen. So kann das Team Chunking, Metadatenfilter, Quellenrangfolge und Abstention getrennt beurteilen.

## 7. Beschlüsse und nächste Schritte

Der Steuerkreis bestätigt für diesen Bericht keine neue Produktivfreigabe. Mara Vogt bereitet eine Entscheidungsvorlage zu Rollen und Zugriffsregeln vor. Jonas Reiter konkretisiert die Cloud-Optionen und deren Kosten; Dr. Thomas Brandt prüft die Anforderungen an Datenzugriff und Datenschutz. Das Projektteam erweitert anschließend das Eval-Set und dokumentiert, welche Fälle mit Quellenfiltern gelöst werden müssen.

Der Pilot bleibt abhängig von MVP-Abnahme und freigegebenen Zugriffsregeln. Bis dahin gelten der kuratierte Testkorpus und die bestehenden Grenzen: keine produktiven Kundendaten, keine automatischen Projektentscheidungen und keine eigenständige Freigabe durch den Assistenten.
