---
layout: default
title: "KI-Agenten in regulierten Branchen"
parent: Regulatorik
nav_order: 5
description: "Was Regulierung für Agenten-Architektur bedeutet: HITL, Logging, Tool-Grenzen und Quellenbindung in Medizin, Legal und Finanzwesen"
has_toc: true
---

# KI-Agenten in regulierten Branchen
{: .no_toc }

> [!IMPORTANT] Regulierte Agenten-Systeme<br>
> Ein Agent in einer regulierten Umgebung ist kein Werkzeug, das hilft — er ist ein System, das dokumentiert, begrenzt und freigegeben werden muss.

---

# Inhaltsverzeichnis
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Warum regulierte Branchen andere Anforderungen stellen

Ein Agenten-System, das Reiserouten plant oder E-Mail-Entwürfe erstellt, muss vor allem nützlich und korrekt sein. Wenn es einmal einen Fehler macht, ist das ärgerlich — aber behebbar. In regulierten Branchen gilt das nicht. Eine falsche Diagnoseunterstützung, eine fehlerhafte Rechtsauskunft oder eine diskriminierende Kreditentscheidung können Menschen direkt schaden. Deshalb verlangen Gesetzgeber und Aufsichtsbehörden dort Anforderungen, die über reine Funktionsfähigkeit hinausgehen.

Für Entwickler bedeutet das: Nicht der Code allein entscheidet, ob ein System eingesetzt werden darf — sondern auch wie er dokumentiert, validiert, freigegeben und überwacht wird. Viele dieser Anforderungen lassen sich in Agenten-Architekturen direkt umsetzen. Die Frage ist nicht ob, sondern wo im System.

**In der Praxis relevant wenn:** Ein Agent Entscheidungen vorbereitet oder trifft, die rechtliche, medizinische oder finanzielle Konsequenzen für reale Personen haben können.

---

## Drei exemplarische Bereiche

### Medizin und Medizintechnik

Agenten, die in medizinischen Kontexten eingesetzt werden — etwa zur Unterstützung klinischer Bewertungen, zur Auswertung von Patientendaten oder zur Strukturierung von Studienberichten — können je nach Zweckbestimmung unter das Medizinprodukterecht fallen. In der EU regelt das die MDR (Medical Device Regulation). Software, die eigenständig Diagnosen vorschlägt oder Therapieentscheidungen beeinflusst, kann als Medizinprodukt eingeordnet werden und braucht dann ein entsprechendes Konformitäts- und Zulassungsverfahren.

Was das für einen Agenten konkret bedeutet: Jede Ausgabe, die als medizinische Empfehlung interpretiert werden könnte, braucht eine klare Einschränkung und einen menschlichen Freigabeschritt. Ein RAG-Agent, der klinische Studien zusammenfasst, ist in der Regel unbedenklich — solange er Quellen nennt, keine Diagnosen stellt und explizit auf die Notwendigkeit ärztlicher Prüfung hinweist.

**Typischer Fehler:** Ein Agent, der Studien zusammenfasst, formuliert seine Ausgaben wie Empfehlungen. Der Nutzer liest daraus eine Handlungsanleitung — obwohl der Agent nur zusammengefasst hat.

### Legal und Rechtsdienstleistungen

In rechtlichen Kontexten schützen Verschwiegenheitspflichten, Standesrecht und Haftungsregeln die Qualität der Beratung. Als vereinfachte Kursregel gilt: Ein Agent darf Rechtsinformationen bereitstellen — also erklären, was ein Paragraf sagt — aber keine Rechtsberatung erteilen, also keine Empfehlung für eine konkrete Situation im Einzelfall. Ob eine konkrete Anwendung zulässig ist, muss anhand des Rechtsdienstleistungsgesetzes, des Nutzungskontexts und der organisatorischen Einbettung geprüft werden.

Für Agenten in Kanzleien oder Rechtsabteilungen gelten zusätzlich das Mandantengeheimnis und strenge Dokumentationspflichten. Mandantendaten dürfen nicht unkontrolliert in externe APIs, Logs, Traces oder Evaluation-Datasets fließen. Vor produktiver Nutzung müssen Auftragsverarbeitung, Rechtsgrundlage, Datenflüsse und Informationspflichten geklärt sein. Jede KI-gestützte Analyse muss nachvollziehbar und revidierbar sein.

**Typischer Fehler:** Ein Agent beantwortet eine konkrete Rechtsfrage mit einer Handlungsempfehlung — ohne den Hinweis, dass dies keine Rechtsberatung ist und ein Anwalt konsultiert werden sollte.

### Finanzwesen und Versicherung

Kreditentscheidungen, Risikobeurteilungen und Anlageempfehlungen sind in der EU durch MiFID II, Kreditwesengesetz und weitere Vorschriften geregelt. Der EU AI Act stuft Systeme zur Kreditwürdigkeitsbewertung und Risikoeinschätzung in der Versicherung explizit als Hochrisiko ein (Anhang III).

Das zentrale Problem bei KI in diesem Bereich ist Diskriminierung: Wenn ein Modell auf historischen Daten trainiert wurde, die bestimmte Gruppen benachteiligen, reproduziert und verstärkt es diese Ungleichheit. Für Agenten bedeutet das: Jede Entscheidung muss erklärbar, überprüfbar und anfechtbar sein. Bei automatisierten Entscheidungen mit erheblicher Wirkung sind die Grenzen aus DSGVO, AI Act und branchenspezifischer Regulierung zusammen zu prüfen.

**Typischer Fehler:** Ein Agent trifft eine Kreditentscheidung automatisch auf Basis von Modellergebnissen, ohne dass eine menschliche Überprüfung vorgesehen ist.

---

## Was regulierte Branchen für die Agenten-Architektur bedeuten

Die folgende Tabelle zeigt, welche Agenten-Komponenten in regulierten Kontexten besondere Anforderungen erhalten. Das sind keine abstrakten Compliance-Anforderungen, sondern direkte Konsequenzen für Architekturentscheidungen.

| Komponente | Standardfall | Regulierter Kontext |
|---|---|---|
| **HITL / Freigabe** | Optional, für kritische Aktionen | Pflicht vor jeder Ausgabe mit Empfehlungscharakter |
| **Logging** | Für Debugging nötig | Vollständiger Audit-Trail: Eingabe, Ausgabe, Modellversion, Zeitstempel — unveränderlich |
| **Tool-Grenzen** | Agent wählt Tools frei | Whitelist: nur explizit erlaubte Tools; keine externen Aufrufe ohne Freigabe |
| **RAG-Quellen** | Beliebige Dokumente | Nur zugelassene, versionierte Quellen; Quellenangabe in jeder Ausgabe Pflicht |
| **Evaluation** | Manuell oder sporadisch | Reproduzierbare Testprotokolle; Regression-Check vor jedem Release |
| **Versionierung** | Code-Versionierung | Code + Modell + Prompt + Daten — alle Komponenten versioniert und dokumentiert |
| **Ausgabe-Formulierung** | Flexibel | Einschränkungshinweis Pflicht: „Diese Ausgabe ersetzt keine [ärztliche/rechtliche/fachliche] Beratung." |

### Human-in-the-Loop als Pflichtbaustein

In regulierten Kontexten ist Human-in-the-Loop keine Komfortfunktion, sondern eine Kontrollinstanz. Der Mensch muss die Möglichkeit haben, eine Agenten-Ausgabe zu prüfen und zu verwerfen, bevor sie Wirkung entfaltet.

Technisch bedeutet das: `interrupt()` in LangGraph oder ein Middleware-Pattern, das die Ausgabe pausiert und auf Freigabe wartet. Nicht optional, nicht überspringbar — auch nicht bei Zeitdruck.

```python
from langgraph.types import interrupt

def freigabe_node(state):
    """Pausiert den Graph und wartet auf menschliche Freigabe."""
    ausgabe = state["agent_ausgabe"]
    freigabe = interrupt({
        "typ": "freigabe_erforderlich",
        "ausgabe": ausgabe,
        "hinweis": "Bitte prüfen und freigeben oder ablehnen."
    })
    return {"freigabe": freigabe, "ausgabe": ausgabe}
```

### Audit-Trail als Architekturanforderung

Ein Audit-Trail dokumentiert, was der Agent wann mit welchen Eingaben und welcher Modellversion produziert hat. Im Streit- oder Haftungsfall ist er der Nachweis, dass das System korrekt funktioniert hat.

Wichtig: LangSmith allein reicht für regulierte Umgebungen nicht aus — LangSmith ist ein Entwicklungswerkzeug, kein revisionssicheres Protokollierungssystem. Für produktive regulierte Systeme braucht es eine unveränderliche Protokollierung (z. B. append-only Datenbank, signierte Logeinträge).

---

## Gemeinsame Prinzipien über alle Branchen

Drei Prinzipien gelten branchenübergreifend in regulierten Kontexten:

**Nachvollziehbarkeit:** Jede Agenten-Ausgabe muss auf ihre Grundlagen zurückführbar sein — welche Quellen wurden genutzt, welches Modell wurde verwendet, welche Eingaben lagen vor. Schwarze-Box-Ausgaben ohne Quellennachweis sind in regulierten Umgebungen nicht akzeptabel.

**Grenzen automatisierter Entscheidungen:** Kein Agent trifft in regulierten Kontexten eine finale Entscheidung allein. Er bereitet vor, schlägt vor, strukturiert — aber die letzte Entscheidung liegt beim Menschen. Art. 22 DSGVO verankert das als Recht der betroffenen Personen.

**Dokumentierter Wandel:** Wenn sich das System ändert — neues Modell, neuer Prompt, neue Datenquellen — muss das dokumentiert und erneut validiert werden. Kein stiller Update im Hintergrund. Das gilt auch für Prompts: Ein geänderter System-Prompt in einer klinischen Anwendung ist eine Änderung am System, nicht nur an einem Textfeld.

---

## Wann ist ein Agent kein Medizinprodukt, keine Rechtsberatung, keine Finanzberatung?

Die Grenzen sind fließend, aber einige Faustregeln helfen:

| Frage | Indikator für unkritisch | Indikator für reguliert |
|---|---|---|
| Was tut der Agent? | Zusammenfassen, strukturieren, recherchieren | Empfehlen, entscheiden, bewerten im Einzelfall |
| Wer sind die Betroffenen? | Entwickler, interne Nutzer ohne direkten Schaden | Patienten, Mandanten, Kreditnehmer mit möglichem Schaden |
| Wie wird die Ausgabe genutzt? | Als Ausgangspunkt für weitere Prüfung | Als direkte Handlungsgrundlage |
| Gibt es einen menschlichen Entscheid danach? | Ja, immer | Nein oder unklar |

**Grenze:** Diese Tabelle ersetzt keine Rechts- oder Compliance-Beratung. In Zweifelsfällen — insbesondere wenn das System in einem Unternehmen produktiv eingesetzt werden soll — sollte immer ein Datenschutzbeauftragter oder Compliance-Verantwortlicher einbezogen werden.

---

## Abgrenzung zu verwandten Dokumenten

| Dokument | Frage |
|---|---|
| [EU AI Act]({{ '/regulatorik-datenschutz-verantwortung/eu-ai-act.html' | relative_url }}) | Welche Risikostufen und gesetzlichen Anforderungen definiert das europäische KI-Recht für Hochrisikosysteme? |
| [Datenschutz & DSGVO]({{ '/regulatorik-datenschutz-verantwortung/datenschutz-dsgvo.html' | relative_url }}) | Was gilt für die Verarbeitung personenbezogener Daten durch LLM-APIs — unabhängig von der Branche? |
| [Human-in-the-Loop]({{ '/sessions-memory-hitl/human-in-the-loop.html' | relative_url }}) | Wie wird der Freigabeschritt technisch umgesetzt — Interrupt-Pattern, Approval-Flow, Eskalation? |
| [Evaluation & Observability]({{ '/evaluation-security-reliability/evaluation-observability.html' | relative_url }}) | Wie werden reproduzierbare Testprotokolle und Regression-Checks implementiert? |
| [Agenten-Sicherheit]({{ '/evaluation-security-reliability/agent-security.html' | relative_url }}) | Wie werden Tool-Grenzen, Whitelisting und Vertrauensgrenzen technisch abgesichert? |

---

**Version:** 1.0<br>
**Stand:** Mai 2026<br>
**Kurs:** KI-Agenten. Verstehen. Anwenden. Gestalten.





