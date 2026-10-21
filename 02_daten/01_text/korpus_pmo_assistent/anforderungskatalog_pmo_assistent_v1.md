# Anforderungskatalog: PMO-Assistent, Version 1.0

**Projekt:** Projekt Kompass  
**Stand:** 20.05.2026  
**Status:** Arbeitsgrundlage für den MVP; keine Freigabe für produktive Kundendaten  
**Verantwortlich:** Mara Vogt, Projektleitung

## 1. Zweck und Geltungsbereich

Der PMO-Assistent soll Projektmitglieder dabei unterstützen, Informationen aus freigegebenen Projektunterlagen schneller zu finden und für die Arbeit aufzubereiten. Der erste Anwendungsfall ist die Vorbereitung des Steuerkreises: Eine Person fragt nach Entscheidungen, offenen Aufgaben, Risiken oder dem aktuellen Projektstand. Das System sucht passende Stellen, formuliert eine knappe Antwort und zeigt die Belege.

Dieser Katalog beschreibt Anforderungen an den MVP. Er ist weder eine technische Architekturentscheidung noch eine Freigabe für den späteren Betrieb. Die Entscheidung D2 vom 14.04.2026 gilt weiterhin: Für einen produktiven Betrieb ist eine verwaltete Cloud-Vektordatenbank vorgesehen; ChromaDB bleibt auf Prototyp und lokale Tests beschränkt. Die konkrete Anbieterwahl und die endgültigen Zugriffsregeln sind in diesem Katalog nicht festgelegt.

Der MVP verwendet ausschließlich den kuratierten, fiktiven Projektkorpus. Er verarbeitet keine produktiven Kundendaten und löst keine Aktionen in Projektmanagement-, Mail- oder Kalendersystemen aus. Eine Antwort kann eine Entscheidung vorbereiten, aber nicht anstelle des Steuerkreises treffen.

## 2. Nutzerfragen und Antwortverhalten

Der Assistent soll natürliche Fragen verstehen, auch wenn sie nicht die exakten Begriffe aus den Quelldokumenten verwenden. Beispiele sind: „Was ist bei der Vektordatenbank inzwischen entschieden?“, „Welche Punkte müssen vor dem Pilot noch geklärt werden?“ oder „Wie hat sich Risiko R2 entwickelt?“ Die Suche darf dabei nicht einzelne ähnliche Wörter mit einer belegten Antwort verwechseln.

Jede inhaltliche Antwort nennt mindestens den Dokumenttitel und das Dokumentdatum. Bei einer konkreten Entscheidung, Zahl oder Statusaussage soll zusätzlich eine kurze Textpassage oder eine eindeutige Fundstelle ausgegeben werden. Wenn mehrere Quellen unterschiedliche Zeitstände zeigen, erklärt der Assistent den Verlauf und benennt, welche Quelle den aktuellen Stand trägt. Ein älteres Protokoll bleibt als historischer Beleg erhalten, darf aber nicht ohne zeitliche Einordnung als heutiger Stand erscheinen.

Fehlt ein belastbarer Beleg, antwortet der Assistent mit **„Nicht im Korpus.“** Er darf fehlende Angaben nicht aus allgemeinem Modellwissen ergänzen. Das gilt insbesondere für Anbieter, die nicht entschieden wurden, monatliche Betriebskosten nach dem Rollout und Freigaben, die in den Unterlagen noch offen sind.

## 3. Funktionale Anforderungen

### 3.1 Suche und Quellenbezug

Der Assistent durchsucht nur Dokumente, die zum angefragten Projekt und zum freigegebenen Korpus gehören. Für einen ersten MVP reichen semantische Suche und Metadaten wie Projekt, Dokumenttyp, Datum und Status. Treffer aus einem anderen Projekt sind keine Belege für Projekt Kompass, auch wenn beide Projekte Begriffe wie „Vektordatenbank“, „Pilot“ oder „Risiko“ verwenden.

Die Antwort soll Quellen nicht nur als Liste anhängen. Sie muss erkennen lassen, welche Quelle welchen Teil der Aussage stützt. Für eine Aussage zum aktuellen Entscheidungsstand ist das Entscheidungsprotokoll besonders relevant; ein einzelnes älteres Sitzungsprotokoll belegt zunächst den Stand dieses Sitzungstags. Vorlagen beschreiben einen vorgesehenen Ablauf, aber keine tatsächlich getroffene Entscheidung.

### 3.2 Verlauf und Widersprüche

Der Assistent muss mindestens drei Arten von Beziehungen unterscheiden:

1. **Aktualisierung:** Ein späteres Dokument ändert einen Status, zum Beispiel den Stand eines Risikos.
2. **Ersetzung:** Eine neue Entscheidung löst eine ältere ab. Die frühere Entscheidung bleibt für historische Fragen wichtig.
3. **Abweichende Quelle:** Ein Entwurf, eine Rohnotiz oder ein Dokument eines anderen Projekts verwendet ähnliche Begriffe, hat aber eine andere Verbindlichkeit oder Geltung.

Bei D1 und D2 soll eine Antwort deshalb nicht nur das Wort „ChromaDB“ finden. Sie muss erklären, dass D1 vom 17.03.2026 die Evaluation für den Prototyp betraf und D2 vom 14.04.2026 die verwaltete Cloud-Vektordatenbank für den produktiven Einsatz beschloss. Die Rohfassung einer Architekturüberlegung vom 10.03.2026 darf diese späteren freigegebenen Quellen nicht überstimmen.

### 3.3 Darstellung und menschliche Kontrolle

Eine Antwort wird als Entwurf angezeigt. Bei unklarer Quellenlage, widersprüchlichen Zeitständen oder fehlenden Berechtigungen soll das System auf die Unsicherheit hinweisen und eine menschliche Prüfung vorschlagen. Der MVP darf weder eine Freigabe vortäuschen noch aus einem offenen Punkt einen Beschluss machen.

Für Briefings soll die Ausgabe mindestens diese Abschnitte unterstützen: Kurzantwort, Belege, offene Punkte und nächster Prüfschritt. Eine Person muss erkennen können, welche Aussage sicher belegt ist und welche noch bestätigt werden muss.

## 4. Nicht-funktionale Anforderungen und Abnahmekriterien

Die Suche muss auf einem kontrollierten Testbestand reproduzierbar sein. In einem Lasttest mit 25 gleichzeitigen Anfragen soll die Antwortzeit im 95. Perzentil unter acht Sekunden liegen. Dieser Grenzwert gilt für den Kurs-MVP und ist keine Zusage für den späteren Produktivbetrieb.

Für die fachliche Abnahme wird ein Eval-Set mit direkten Faktenfragen, Vergleichen, negativen Fragen und Konfliktfällen verwendet. Bei belegbaren Testfragen sollen mindestens 90 Prozent der Antworten die richtige Quelldatei nennen. Bei Negativfragen darf keine unbelegte Zahl oder Freigabe erfunden werden. Die Abnahme prüft die Belegqualität getrennt von der sprachlichen Flüssigkeit.

Die folgenden Prüffälle sind verbindlich für den MVP:

| Prüffall | Erwartetes Verhalten |
|---|---|
| Aktueller Beschluss zur Vektordatenbank | D2 und das Entscheidungsprotokoll als aktuellen Stand nennen; D1 historisch einordnen |
| Frage nach einem nicht dokumentierten Anbieter | „Nicht im Korpus“ antworten |
| Frage nach Risiko R2 | Datum und Statusänderung aus den passenden Quellen zusammenführen |
| Frage nach einer Fremdprojekt-Quelle | Projektzugehörigkeit beachten und nicht auf Projekt Kompass übertragen |
| Frage nach einer überholten Rohfassung | Entwurfsstatus und spätere freigegebene Quelle kenntlich machen |

## 5. Daten- und Berechtigungsgrenzen

Im Kursbestand sind alle Personen, Unternehmen und Projektdaten fiktiv. Diese Eigenschaft ist bei selbst eingebrachten Korpora nicht automatisch gegeben. Vor einem Import müssen Herkunft, Nutzungsrecht, Personenbezug und Freigabe geprüft werden. Der Zugriff auf Dokumente soll später rollenbezogen begrenzt werden. Die konkrete technische Umsetzung dieser Rollensteuerung bleibt offen, weil der Steuerkreis sie am 19.05.2026 vertagt hat.

Ein fehlender Berechtigungsnachweis ist kein Retrieval-Problem, das durch eine bessere Antwort ausgeglichen werden darf. Der MVP soll bei nicht freigegebenen Quellen keine Inhalte ausgeben. Die technische Durchsetzung dieser Regel ist Voraussetzung für einen Einsatz mit realen Unternehmensdaten.

## 6. Abgrenzung und offene Punkte

Nicht Bestandteil dieser Version sind automatische Projektentscheidungen, das Versenden von Nachrichten, Änderungen an Aufgabenlisten, der Zugriff auf Kundensysteme und eine allgemeine Unternehmenssuche. Auch der produktive Cloud-Anbieter ist noch nicht benannt. Diese Punkte dürfen in Antworten nicht als bereits umgesetzt dargestellt werden.

Offen bleiben die endgültige Rollen- und Rechtearchitektur, ein verbindlicher Betriebskostenrahmen und die Übergabe in einen Pilotbetrieb. Der nächste fachliche Prüfschritt besteht darin, das Eval-Set um längere Dokumente und ähnlich formulierte Fremdquellen zu ergänzen. Erst danach lässt sich beurteilen, ob Chunking, Metadatenfilter und Quellenrangfolge die Anforderungen erfüllen.
