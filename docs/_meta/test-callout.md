---
layout: default
title: Callout Test
nav_exclude: true
---
# Callout Test Page

Diese Seite testet die korrekte Darstellung von Callouts im Agenten-Projekt.

## Test 1: Einfacher Callout ohne Custom Title

> [!NOTE]
> Details siehe Skript: M08 - Embeddings<br>

**Erwartetes Ergebnis:**
- Titel: "Hinweis" (Standard-Titel)
- Content: "Details siehe Skript: M08 - Embeddings" (in neuer Zeile unter dem Titel)

parent: Ressourcen
nav_order: 8
---
## Test 2: Callout mit Custom Title

> [!TIP] Best Practice<br>
> Verwenden Sie immer Embeddings für semantische Suche.

**Erwartetes Ergebnis:**
- Titel: "Best Practice" (Custom-Titel)
- Content: "Verwenden Sie immer Embeddings für semantische Suche." (in neuer Zeile)

parent: Ressourcen
nav_order: 8
---
## Test 3: Warning Callout

> [!WARNING]
> Achtung: Diese Funktion ist experimentell und kann sich ändern.<br>

**Erwartetes Ergebnis:**
- Titel: "Warnung" (Standard-Titel)
- Content: "Achtung: Diese Funktion ist experimentell und kann sich ändern." (in neuer Zeile)

parent: Ressourcen
nav_order: 8
---
## Test 4: Mehrere Callout-Typen

> [!NOTE]
> Weitere Informationen finden Sie in der offiziellen Dokumentation.<br>

> [!DANGER]
> Löschen Sie niemals Produktionsdaten ohne Backup!

> [!SUCCESS]
> Die Installation wurde erfolgreich abgeschlossen.

**Erwartetes Ergebnis:**
- Alle drei Callouts zeigen den korrekten Typ-Icon
- Content immer in neuer Zeile unter Titel

parent: Ressourcen
nav_order: 8
---
## Test 5: Kurzer Text (< 50 Zeichen)

> [!NOTE]
> Kurzer Hinweis<br>

**Erwartetes Ergebnis:**
- Titel: "Hinweis" (Standard-Titel)
- Content: "Kurzer Hinweis" (in neuer Zeile, NICHT als Custom-Titel behandelt)

