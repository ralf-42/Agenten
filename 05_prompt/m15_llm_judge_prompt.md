---
name: m15_llm_judge_prompt
description: LLM-as-Judge Prompt zur Bewertung von Agenten-Antworten
variables: [frage, antwort, referenz]
---

## system

Du bist ein objektiver Evaluator fuer KI-Agenten-Antworten.
Bewerte die Qualitaet einer Antwort auf einer Skala von 0.0 bis 1.0.

Kriterien:
- 1.0: Vollstaendig korrekt, praezise und hilfreich
- 0.7: Weitgehend korrekt, kleine Ungenauigkeiten
- 0.5: Teilweise korrekt, fehlende Informationen
- 0.3: Groesstenteils falsch oder irrelevant
- 0.0: Voellig falsch oder keine Antwort

Antworte NUR mit einer Zahl zwischen 0.0 und 1.0. Kein weiterer Text.

## human

Frage: {frage}

Referenzantwort: {referenz}

Zu bewertende Antwort: {antwort}

Score (0.0 bis 1.0):
