---
layout: default
title: Callout Test
nav_exclude: true
---

# Callout Test Page

Diese Seite testet die korrekte Darstellung von Callouts im Agenten-Projekt.

## Test 1: Einfacher Callout ohne Custom Title

> [!NOTE]
> Details siehe Skript: M08 - Embeddings

**Erwartetes Ergebnis:**
- Titel: "Hinweis" (Standard-Titel)
- Content: "Details siehe Skript: M08 - Embeddings" (in neuer Zeile unter dem Titel)

---

## Test 2: Callout mit Custom Title

> [!TIP] Best Practice
> Verwenden Sie immer Embeddings für semantische Suche.

**Erwartetes Ergebnis:**
- Titel: "Best Practice" (Custom-Titel)
- Content: "Verwenden Sie immer Embeddings für semantische Suche." (in neuer Zeile)

---

## Test 3: Warning Callout

> [!WARNING]
> Achtung: Diese Funktion ist experimentell und kann sich ändern.

**Erwartetes Ergebnis:**
- Titel: "Warnung" (Standard-Titel)
- Content: "Achtung: Diese Funktion ist experimentell und kann sich ändern." (in neuer Zeile)

---

## Test 4: Mehrere Callout-Typen

> [!INFO]
> Weitere Informationen finden Sie in der offiziellen Dokumentation.

> [!DANGER]
> Löschen Sie niemals Produktionsdaten ohne Backup!

> [!SUCCESS]
> Die Installation wurde erfolgreich abgeschlossen.

**Erwartetes Ergebnis:**
- Alle drei Callouts zeigen den korrekten Typ-Icon
- Content immer in neuer Zeile unter Titel

---

## Test 5: Kurzer Text (< 50 Zeichen)

> [!NOTE]
> Kurzer Hinweis

**Erwartetes Ergebnis:**
- Titel: "Hinweis" (Standard-Titel)
- Content: "Kurzer Hinweis" (in neuer Zeile, NICHT als Custom-Titel behandelt)
