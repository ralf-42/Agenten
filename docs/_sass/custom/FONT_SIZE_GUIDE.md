# Schriftgröße anpassen - Anleitung

## Wo anpassen?
Datei: `docs/_sass/custom/custom.scss`

## Schriftgrößen-Empfehlungen:

### Haupttext (body / .main-content)
- **14px** = Klein (mehr Zeichen pro Zeile)
- **15px** = Mittel-Klein
- **16px** = Normal (Standard)
- **17px** = Groß
- **18px** = Sehr groß

### Zeilenabstand (line-height)
- **1.4** = Sehr eng
- **1.5** = Eng
- **1.6** = Normal (empfohlen)
- **1.8** = Weit
- **2.0** = Sehr weit

## Beispiel-Konfigurationen:

### Kompakt (mehr Inhalt, kleine Schrift)
```scss
body {
  font-size: 14px !important;
}
.main-content {
  font-size: 14px !important;
  line-height: 1.5 !important;
}
```

### Standard (ausgewogen)
```scss
body {
  font-size: 16px !important;
}
.main-content {
  font-size: 16px !important;
  line-height: 1.6 !important;
}
```

### Große Schrift (bessere Lesbarkeit)
```scss
body {
  font-size: 18px !important;
}
.main-content {
  font-size: 18px !important;
  line-height: 1.8 !important;
}
```

## Änderungen aktivieren:
1. Datei speichern
2. Git commit + push
3. GitHub Pages aktualisiert automatisch (2-3 Minuten)
