# Mermaid-Diagramme zu SVG konvertieren

## Schritt-für-Schritt Anleitung

### 1. Mermaid Live Editor öffnen
Öffnen Sie: https://mermaid.live/

### 2. Diagramm-Code einfügen
Kopieren Sie den Mermaid-Code aus der jeweiligen Datei und fügen Sie ihn in den Editor ein.

### 3. Als SVG exportieren
1. Klicken Sie auf "Actions" (rechts oben)
2. Wählen Sie "Export SVG"
3. Speichern Sie die Datei mit einem beschreibenden Namen

### 4. SVG in docs/assets/images/diagrams/ speichern

### 5. Markdown aktualisieren
Ersetzen Sie den Mermaid-Block durch:
```markdown
![Diagramm-Beschreibung](/Agenten/assets/images/diagrams/dateiname.svg)
```

---

## Diagramme für Multi_Agent_Systeme.md

### Diagramm 1: Koordinationsmuster
**Dateiname:** `multi-agent-koordination.svg`
**Code:**
```mermaid
graph TD
    S1[Supervisor] --> W1[Worker A]
    S1 --> W2[Worker B]
    S1 --> W3[Worker C]

    M[Manager] --> T1[Team Lead 1]
    M --> T2[Team Lead 2]
    T1 --> WA[Worker]
    T1 --> WB[Worker]
    T2 --> WC[Worker]

    A1[Agent 1] -.-> A2[Agent 2]
    A2 -.-> A3[Agent 3]
    A3 -.-> A1

    style S1 fill:#e7f5ff
    style M fill:#fff4e6
    style A1 fill:#e3fafc
```

### Diagramm 2: Supervisor-Pattern
**Dateiname:** `supervisor-pattern.svg`
**Code:**
```mermaid
graph TD
    A[Aufgabe] --> S[Supervisor]
    S -->|Code-Aufgabe| C[Code-Agent]
    S -->|Recherche| R[Research-Agent]
    S -->|Texterstellung| W[Writer-Agent]
    C --> S
    R --> S
    W --> S
    S --> E[Finale Antwort]
```

### Diagramm 3: Hierarchisches Pattern
**Dateiname:** `hierarchisches-pattern.svg`
**Code:**
```mermaid
graph TD
    A[Komplexe Aufgabe] --> M[Manager]
    M --> TL1[Team Lead: Entwicklung]
    M --> TL2[Team Lead: Content]

    TL1 --> D1[Backend-Dev]
    TL1 --> D2[Frontend-Dev]
    TL1 --> D3[Tester]

    TL2 --> C1[Rechercheur]
    TL2 --> C2[Redakteur]
    TL2 --> C3[Lektor]

    D1 --> TL1
    D2 --> TL1
    D3 --> TL1
    C1 --> TL2
    C2 --> TL2
    C3 --> TL2

    TL1 --> M
    TL2 --> M
    M --> E[Finale Lösung]
```

### Diagramm 4: Kollaboratives Pattern
**Dateiname:** `kollaboratives-pattern.svg`
**Code:**
```mermaid
graph LR
    A[Kritiker] -->|Feedback| B[Autor]
    B -->|Entwurf| C[Faktenchecker]
    C -->|Korrekturen| A

    D[Moderator] -.->|Beobachtet| A
    D -.->|Beobachtet| B
    D -.->|Beobachtet| C
```

### Diagramm 5: Kommunikationsformen
**Dateiname:** `kommunikationsformen.svg`
**Code:**
```mermaid
graph TD
    A1[Agent A] -->|Direkt| A2[Agent B]

    B1[Agent A] -->|Shared| S[(State)]
    B2[Agent B] --> S
    S --> B1
    S --> B2

    C1[Agent A] -->|Queue| Q[Queue]
    Q --> C2[Agent B]
    C2 --> Q
    Q --> C1
```

### Diagramm 6: Fehlerquellen
**Dateiname:** `fehlerquellen.svg`
**Code:**
```mermaid
graph TD
    E[Fehlerquellen] --> E1[Agent-Fehler]
    E --> E2[Kommunikations-Fehler]
    E --> E3[Koordinations-Fehler]

    E1 --> E1a[LLM-Timeout]
    E1 --> E1b[Tool-Fehler]
    E1 --> E1c[Ungültige Ausgabe]

    E2 --> E2a[State-Inkonsistenz]
    E2 --> E2b[Verlorene Nachrichten]

    E3 --> E3a[Deadlock]
    E3 --> E3b[Endlosschleife]
    E3 --> E3c[Falsche Routing-Entscheidung]
```

### Diagramm 7: Entscheidungshilfe
**Dateiname:** `entscheidungshilfe.svg`
**Code:**
```mermaid
graph TD
    A[Anforderung analysieren] --> B{Wie viele Spezialisten?}
    B -->|1-2| C[Einzelner Agent mit Tools]
    B -->|3-5| D{Müssen Agenten kommunizieren?}
    B -->|mehr als 5| E[Hierarchisches Pattern]

    D -->|Nein| F[Supervisor-Pattern]
    D -->|Ja sequenziell| G[Supervisor mit Routing]
    D -->|Ja iterativ| H[Kollaboratives Pattern]
```

---

## Alternative: Kroki.io API (Automatisch)

Statt manuell zu exportieren, können Sie auch die Kroki.io API verwenden:

```markdown
![Diagramm](https://kroki.io/mermaid/svg/eNp... [base64-encoded mermaid code])
```

Tool zum Kodieren: https://www.base64encode.org/
