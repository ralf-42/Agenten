# Freigabe-Checkliste

Diese Checkliste verwenden, wenn der Skill eine operative Freigabeentscheidung erfordert.

## 1. Aufnahme

- Dokument und Dokumenttyp identifizieren (Briefing, Protokoll, Statusbericht).
- Empfängerkreis und Datenbasis erfassen.
- Prüfen, ob die Aufgabe informationell, beratend oder operativ ist.

## 2. Kontext

- Name und Zweck des Dokuments bestätigen.
- Bestätigen, ob das Dokument vertrauliche Inhalte enthält (zum Beispiel Budget- oder Personalangaben).
- Bekannte Quellen und deren Stand (Datum) erfassen.
- Prüfen, ob Aussagen aus verschiedenen Terminen sich widersprechen.

**Bestätigung ist nicht Zustimmung:** `privacy_clearance_confirmed=True` bedeutet, dass Durchführung und Ergebnis der formalen Prüfung ausdrücklich bekannt sind; es bedeutet nicht, dass die Freigabe erteilt wurde. Bei ausdrücklich verweigerter Freigabe wird zusätzlich `privacy_clearance_denied=True` übergeben. Die Verweigerung ist ein bekannter Blockadegrund und kein Fall fehlender Information. Eine bereits ausdrücklich mitgeteilte Prüfung samt Ergebnis wird nicht erneut erfragt. Nur wenn Durchführung, Ergebnis oder Geltungsbereich ungeklärt sind, wird gezielt nachgefragt und ohne Score gewartet. Eine ausdrücklich verweigerte Freigabe darf keinesfalls durch andere Angaben zu einer positiven Freigabe werden.

## 3. Erforderliche Prüfungen

- Datenschutzprüfung (Durchführung und Ergebnis ausdrücklich bekannt, Geltungsbereich beachtet)
- Empfängerkreisprüfung
- Datenbasisprüfung (Testkorpus oder Produktivdaten)
- Prüfung auf vertrauliche Inhalte
- Prüfung auf ungelöste Widersprüche und fehlende Quellen

## 4. Eskalationsauslöser

Keine automatische Freigabe, wenn einer der folgenden Befunde vorliegt. Die Reaktion richtet sich nach dem bekannten Ergebnis und dem Tool-Score:

- Durchführung oder Ergebnis ungeklärt: gezielt nachfragen, ohne Score warten (`hold`)
- Datenschutzfreigabe ausdrücklich verweigert: als bekannten Blockadegrund an das Prüftool übergeben, Entscheidung `block`
- externe Empfänger
- Freigabe gilt nur für den Testkorpus, das Dokument nutzt aber Produktivdaten
- vertrauliche Inhalte
- ungelöster Widerspruch zwischen Quellen
- Aussagen ohne Quellenbeleg

## 5. Dokumentation

Die abschließende Notiz sollte enthalten:

- Fallzusammenfassung
- durchgeführte Prüfungen
- festgestellte Indikatoren
- abschließendes Risikoniveau
- Entscheidung
- Begründung für Freigabe, Blockade oder Eskalation

## Hinweis für Schulungszwecke

Im Kursmaterial ist diese Checkliste ein didaktisches Muster. Sie ersetzt keine rechtliche oder datenschutzrechtliche Prüfung.
