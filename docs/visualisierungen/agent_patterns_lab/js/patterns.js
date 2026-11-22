(function () {
const { DOMAINS, TOOLS, engine, sleep } = window.AgentLab;

const PATTERN_GROUPS = [
  { id: "foundational", label: "1. Grundlegende Single-Agent-Muster" },
  { id: "workflow", label: "2. Deterministische Workflow-Muster" },
  { id: "multiagent", label: "3. Multi-Agent- & Team-Muster" },
  { id: "governance", label: "4. Querschnittskontrolle (für jedes Muster)" }
];

const PATTERNS = [
  {
    id: "augmented",
    group: "foundational",
    name: "Augmented LLM",
    domain: "Versicherung",
    controlFlow: "1 Aufruf + Retrieval + Gate",
    bestUse: "Faktenbasierte Antworten über Datensätze",
    tradeOff: "Nur so gut wie das Retrieval",
    summary: "Ein einzelner Modellaufruf, angereichert mit Datensätzen, Tool-Ergebnissen und Langzeit-Memory — abgeschlossen durch einen deterministischen Grounding-Check.",
    task: "Schadenfall CLM001 (Wasserschaden 22.000 €, Selbstbehalt 2.500 €): Berechne die korrekte Auszahlung unter Berücksichtigung des Policen-Limits und vergangener Sachbearbeiter-Korrekturen.",
    graph: {
      viewBox: "0 0 600 180",
      nodes: [
        { id: "retrieve", x: 20, y: 65, w: 120, h: 52, title: "Retrieval & Memory", sub: "CLM001 + Policy" },
        { id: "llm", x: 195, y: 65, w: 140, h: 52, title: "Augmented LLM", sub: "1 Modellaufruf" },
        { id: "gate", x: 390, y: 65, w: 185, h: 52, title: "Grounding-Check", sub: "Schaden − SB = Betrag" }
      ],
      edges: [["retrieve", "llm"], ["llm", "gate"]]
    },
    lesson: "Starte immer hier: Viele vermeintliche Agenten-Probleme sind in Wahrheit Retrieval-Probleme. Günstigstes und schnellstes Muster."
  },
  {
    id: "react",
    group: "foundational",
    name: "ReAct-Loop",
    domain: "Klinik / Medikation",
    controlFlow: "Dynamischer Loop (Iterations-Cap)",
    bestUse: "Offene Aufgaben mit unbekanntem Lösungsweg",
    tradeOff: "Braucht starkes Modell; teuer bei kleinen Modellen",
    summary: "Der klassische Agent-Loop: Denken → Tool wählen → Beobachten → Wiederholen bis zur Antwort oder bis zum harten Iterations-Cap.",
    task: "Patient P001 (74 J., nimmt Blutdrucksenker Amlodipin & Ramipril) fragt nach einem rezeptfreien Erkältungsmittel. Nutze die Klinik-Tools (vitals, interaction_check).",
    graph: {
      viewBox: "0 0 600 210",
      nodes: [
        { id: "think", x: 30, y: 35, w: 135, h: 50, title: "Denken (LLM)", sub: "Aktion planen" },
        { id: "tool", x: 225, y: 35, w: 145, h: 50, title: "Tool / Observation", sub: "vitals / interaction" },
        { id: "schema", x: 425, y: 35, w: 150, h: 50, title: "Schema & Cap", sub: "JSON + max 3 Runden" },
        { id: "fallback", x: 225, y: 135, w: 200, h: 50, title: "Antwort / Fallback", sub: "Ergebnis oder Review" }
      ],
      edges: [["think", "tool"], ["tool", "schema"], ["schema", "think"], ["schema", "fallback"]]
    },
    lesson: "ReAct gibt dem Modell die größte Freiheit — und braucht deshalb das stärkste Modell. Auf kleinen Modellen (1.5B) schützt nur ein hartes Step-Cap plus Schema-Check vor Endlosschleifen."
  },
  {
    id: "evaluator",
    group: "foundational",
    name: "Evaluator-Optimizer",
    domain: "Karriereberatung",
    controlFlow: "Generator ↔ Validator + Judge",
    bestUse: "Aufgaben mit klar prüfbaren Qualitätskriterien",
    tradeOff: "Kosten & Latenz wachsen mit jeder Runde",
    summary: "Ein Generator erstellt einen Entwurf, ein deterministischer Validator prüft harte Fakten (erlaubte Zertifikate), danach bewertet ein LLM-Judge — bis zu einem festen Rundenlimit.",
    task: "Erstelle einen Lernplan für den Wechsel von Marketing zu UX-Design. Es dürfen ausschließlich Zertifikate aus der geprüften Tool-Liste verwendet werden.",
    graph: {
      viewBox: "0 0 600 205",
      nodes: [
        { id: "gen", x: 25, y: 40, w: 135, h: 52, title: "Generator", sub: "Entwurf erstellen" },
        { id: "val", x: 215, y: 40, w: 155, h: 52, title: "Regel-Validator", sub: "Zertifikat-Whitelist" },
        { id: "judge", x: 425, y: 40, w: 145, h: 52, title: "LLM-Judge", sub: "Qualitätsscore" },
        { id: "out", x: 215, y: 135, w: 185, h: 50, title: "Bestes Ergebnis", sub: "Max. 3 Runden" }
      ],
      edges: [["gen", "val"], ["val", "judge"], ["val", "gen"], ["judge", "out"], ["val", "out"]]
    },
    lesson: "Ein regelbasierter Validator vor dem LLM-Judge ist extrem günstig und fängt Halluzinationen ab (z. B. erfundene Zertifikate), die ein LLM-Judge oft durchwinkt."
  },
  {
    id: "chaining",
    group: "workflow",
    name: "Prompt Chaining",
    domain: "Pharma-Forschung",
    controlFlow: "Feste Pipeline mit Gates",
    bestUse: "Klar zerlegbare Dokument- und Prüfprozesse",
    tradeOff: "Wenig flexibel bei unerwarteten Eingaben",
    summary: "Feste Abfolge aus Teilschritten. Jeder Schritt sieht nur das vorherige Ergebnis; ein programmatisches Gate stoppt den Lauf, wenn Pflichtkriterien fehlen.",
    task: "Wirkstoff QT-9901 (Lebertoxizitätssignal ALT 5.2x ULN): 1) Sicherheitssignale extrahieren → 2) Risiko klassifizieren → 3) Go/No-Go-Memo mit Wirkstoff-ID schreiben.",
    graph: {
      viewBox: "0 0 600 185",
      nodes: [
        { id: "s1", x: 15, y: 65, w: 120, h: 52, title: "1. Extraktion", sub: "Signale + Gate" },
        { id: "s2", x: 170, y: 65, w: 125, h: 52, title: "2. Risiko", sub: "HIGH + Gate" },
        { id: "s3", x: 330, y: 65, w: 120, h: 52, title: "3. Memo", sub: "Go/No-Go" },
        { id: "g3", x: 480, y: 65, w: 105, h: 52, title: "Final-Gate", sub: "ID & Urteil?" }
      ],
      edges: [["s1", "s2"], ["s2", "s3"], ["s3", "g3"]]
    },
    lesson: "Gates zwischen den Schritten sorgen dafür, dass ein vages oder unvollständiges Zwischenergebnis den Ablauf sauber stoppt, statt still in die Endausgabe zu gelangen."
  },
  {
    id: "routing",
    group: "workflow",
    name: "Routing",
    domain: "Multi-Domäne (interaktiv)",
    controlFlow: "Klassifikation → 1 Spezialist",
    bestUse: "Triage auf klar getrennte Fachdomänen",
    tradeOff: "Alles nach dem Router hängt vom Router ab",
    summary: "Ein Router klassifiziert die Anfrage und leitet sie an genau einen Spezialisten (mit eigenen Tools) weiter. Ein günstiger Konsistenzcheck erkennt typische Fehlroutings.",
    task: "Gib eine eigene Anfrage ein oder teste das Standardbeispiel (Patient P004 auf Warfarin) — beobachte den Konsistenzcheck auf Datensatz-IDs!",
    graph: {
      viewBox: "0 0 600 210",
      nodes: [
        { id: "router", x: 20, y: 80, w: 120, h: 52, title: "Router (LLM)", sub: "Domäne wählen" },
        { id: "check", x: 185, y: 80, w: 155, h: 52, title: "Konsistenzcheck", sub: "ID passt zu Domäne?" },
        { id: "spec", x: 395, y: 30, w: 175, h: 52, title: "Spezialist", sub: "Domänen-Tools" },
        { id: "queue", x: 395, y: 125, w: 175, h: 52, title: "Human Queue / Flag", sub: "Fehlrouting / Unbekannt" }
      ],
      edges: [["router", "check"], ["check", "spec"], ["check", "queue"]]
    },
    lesson: "Im Routing entscheidet ein einziger Fehler am Eingang über den ganzen Lauf. Ein einzeiliger Konsistenzcheck auf IDs (z. B. Patient P004 ≠ Pharma-Domäne) kostet nichts und fängt Fehlroutings ab."
  },
  {
    id: "sectioning",
    group: "workflow",
    name: "Parallel Sectioning",
    domain: "Versicherung",
    controlFlow: "Split → Parallel-Worker → Merge",
    bestUse: "Wirklich unabhängige Teilanalysen",
    tradeOff: "Komplexität wandert in den Aggregator",
    summary: "Ein Schadenfall wird in unabhängige Teilaspekte (Deckung, Betrug, Bewertung) zerlegt, parallel bearbeitet und durch einen Aggregator mit Policy-Limit-Check zusammengeführt.",
    task: "Schadenfall CLM003 (Sturmschaden 24.200 €, Selbstbehalt 1.500 €, Limit 23.000 €): Parallel prüfen auf Deckung, Betrugsrisiko und Auszahlungshöhe.",
    graph: {
      viewBox: "0 0 600 220",
      nodes: [
        { id: "split", x: 15, y: 85, w: 100, h: 50, title: "Split", sub: "CLM003" },
        { id: "w1", x: 165, y: 15, w: 135, h: 46, title: "Deckung", sub: "Policy-Check" },
        { id: "w2", x: 165, y: 85, w: 135, h: 46, title: "Betrug", sub: "Score 0.18" },
        { id: "w3", x: 165, y: 155, w: 135, h: 46, title: "Bewertung", sub: "22.700 €" },
        { id: "agg", x: 355, y: 85, w: 115, h: 50, title: "Aggregator", sub: "Merge" },
        { id: "cap", x: 500, y: 85, w: 85, h: 50, title: "Limit-Gate", sub: "≤ 23.000 €" }
      ],
      edges: [["split", "w1"], ["split", "w2"], ["split", "w3"], ["w1", "agg"], ["w2", "agg"], ["w3", "agg"], ["agg", "cap"]]
    },
    lesson: "Fokussierte Teil-Prompts helfen besonders kleineren Modellen. Die eigentliche Herausforderung liegt im Aggregator, der die Teilergebnisse konsistent zusammenführen muss."
  },
  {
    id: "voting",
    group: "workflow",
    name: "Parallel Voting",
    domain: "Klinik / Medikation",
    controlFlow: "N Durchläufe → Mehrheitsvotum",
    bestUse: "Sicherheitskritische Ja/Nein-Entscheidungen",
    tradeOff: "N-fache Modellkosten",
    summary: "Dieselbe sicherheitskritische Frage wird 5-mal bei unterschiedlichen Temperaturen gestellt; das Mehrheitsvotum wird anschließend gegen die Wechselwirkungs-Datenbank geprüft.",
    task: "Patient P004 nimmt Warfarin (Blutverdünner) und fragt, ob Aspirin sicher ist. Ermittle das Mehrheitsvotum aus 5 Durchläufen und prüfe es gegen die Interaktions-Datenbank.",
    graph: {
      viewBox: "0 0 600 225",
      nodes: [
        { id: "q", x: 15, y: 88, w: 105, h: 50, title: "Frage", sub: "Warfarin+Aspirin" },
        { id: "v1", x: 165, y: 10, w: 115, h: 34, title: "Voter 1 (T=0.1)", sub: "" },
        { id: "v2", x: 165, y: 52, w: 115, h: 34, title: "Voter 2 (T=0.3)", sub: "" },
        { id: "v3", x: 165, y: 94, w: 115, h: 34, title: "Voter 3 (T=0.5)", sub: "" },
        { id: "v4", x: 165, y: 136, w: 115, h: 34, title: "Voter 4 (T=0.7)", sub: "" },
        { id: "v5", x: 165, y: 178, w: 115, h: 34, title: "Voter 5 (T=0.9)", sub: "" },
        { id: "tally", x: 330, y: 88, w: 110, h: 50, title: "Mehrheit", sub: "Agreement %" },
        { id: "db", x: 475, y: 88, w: 110, h: 50, title: "Interaktions-DB", sub: "Verifikation" }
      ],
      edges: [
        ["q", "v1"], ["q", "v2"], ["q", "v3"], ["q", "v4"], ["q", "v5"],
        ["v1", "tally"], ["v2", "tally"], ["v3", "tally"], ["v4", "tally"], ["v5", "tally"],
        ["tally", "db"]
      ]
    },
    lesson: "Voting verwandelt eine einzelne Stichprobe in ein messbares Übereinstimmungsniveau (z. B. 80 % UNSAFE). Wichtig: Übereinstimmung ist kein Wahrheitsbeleg — Aufrufe desselben Modells können dieselben Fehler teilen. Mehrheit ersetzt keine Prüfung an Originalquellen oder Datenbanken."
  },
  {
    id: "briefing_team",
    group: "multiagent",
    name: "Briefing-Team (PMO-Kursbeispiel)",
    domain: "PMO-Assistent",
    controlFlow: "Feste Pipeline + begrenzter Review-Loop (attempts ≤ 2)",
    bestUse: "Arbeitsteiliges Briefing mit getrennter Recherche, Schreiben & Prüfung",
    tradeOff: "Quellen-ID-Prüfung allein beweist keine sachliche Richtigkeit; Versand braucht separate Freigabe",
    summary: "Das durchgängige Kursbeispiel aus „Multi-Agent-Systeme umsetzen“: Recherche → Schreiben → Prüfung (deterministische Quellen-ID-Prüfung vor LLM-Review) mit BriefingState und Abbruchgrenze (attempts ≤ 2, blocked).",
    task: "Erstelle ein Steuerkreis-Briefing aus DOC-101 (Statusbericht) und DOC-102 (Protokoll). Vertrauliche Dokumente (DOC-103) sind tabu; bei fehlenden Quellen-IDs folgt höchstens eine Überarbeitung, danach blocked=True.",
    graph: {
      viewBox: "0 0 600 215",
      nodes: [
        { id: "research", x: 15, y: 40, w: 120, h: 50, title: "1. Recherche", sub: "DOC-101, DOC-102" },
        { id: "writer", x: 165, y: 40, w: 120, h: 50, title: "2. Schreiben", sub: "Entwurf + IDs" },
        { id: "review", x: 315, y: 40, w: 135, h: 50, title: "3. Prüfung", sub: "ID-Check + Review" },
        { id: "gate", x: 480, y: 40, w: 105, h: 50, title: "Router-Gate", sub: "attempts ≤ 2" },
        { id: "finish", x: 205, y: 140, w: 235, h: 50, title: "Abschluss / Eskalation", sub: "Geprüft oder blocked=True" }
      ],
      edges: [["research", "writer"], ["writer", "review"], ["review", "gate"], ["gate", "writer"], ["gate", "finish"]]
    },
    lesson: "Feste Ablaufsteuerung im Code reicht oft aus — ein dynamischer Supervisor ist nicht nötig. Deterministische Quellen-ID-Prüfung vor dem LLM-Reviewer spart Kosten, und ein klares Limit (attempts ≤ 2 → blocked=True) verhindert Endlosschleifen."
  },
  {
    id: "orchestrator",
    group: "multiagent",
    name: "Orchestrator-Workers",
    domain: "Pharma-Forschung",
    controlFlow: "Dynamische Planung zur Laufzeit",
    bestUse: "Offene Aufgaben mit vorab unbekannten Teilschritten",
    tradeOff: "Extra Aufrufe für Planung & Synthese",
    summary: "Ein Orchestrator entscheidet erst zur Laufzeit, welche Spezialisten-Worker benötigt werden und was jeder prüfen soll. Ein Synthesizer führt die Tool-Ergebnisse zusammen.",
    task: "Erstelle ein IND-Readiness-Briefing für Wirkstoff DM-3350. Der Orchestrator wählt dynamisch die nötigen Fachrollen (Chemiker, Toxikologe) aus.",
    graph: {
      viewBox: "0 0 600 200",
      nodes: [
        { id: "orch", x: 20, y: 74, w: 135, h: 52, title: "Orchestrator", sub: "Plant Worker" },
        { id: "chem", x: 220, y: 30, w: 145, h: 52, title: "Worker: Chemie", sub: "Synthese & Reinheit" },
        { id: "tox", x: 220, y: 118, w: 145, h: 52, title: "Worker: Toxikologie", sub: "Safety & Repro-Tox" },
        { id: "synth", x: 430, y: 74, w: 145, h: 52, title: "Synthesizer", sub: "IND-Briefing" }
      ],
      edges: [["orch", "chem"], ["orch", "tox"], ["chem", "synth"], ["tox", "synth"]]
    },
    lesson: "Im Gegensatz zum statischen Parallel Sectioning entstehen die Teilaufgaben erst zur Laufzeit — dafür zahlt man je einen zusätzlichen Planungs- und Synthese-Aufruf."
  },
  {
    id: "hierarchical",
    group: "multiagent",
    name: "Hierarchische Zerlegung",
    domain: "Versicherung",
    controlFlow: "Executive → Manager → Executors",
    bestUse: "Große Aufgaben mit vielen Teilpaketen",
    tradeOff: "Viele Aufrufe & Latenz — Hierarchie flach halten",
    summary: "Drei Ebenen: Ein Executive setzt Ziele, zwei Manager verteilen Teilaufgaben an vier spezialisierte Executors mit Tools, danach trifft der Executive die finale Triage.",
    task: "Bearbeite die heutige Schaden-Warteschlange (CLM002 verdächtig, CLM003 nahe Limit) über Risiko- und Deckungsmanager.",
    graph: {
      viewBox: "0 0 600 220",
      nodes: [
        { id: "exec", x: 15, y: 85, w: 110, h: 52, title: "Executive", sub: "Ziel & Urteil" },
        { id: "m1", x: 170, y: 35, w: 120, h: 48, title: "Risiko-Mgr", sub: "Betrug/Plausib." },
        { id: "m2", x: 170, y: 135, w: 120, h: 48, title: "Deckungs-Mgr", sub: "Limit/Policen" },
        { id: "e1", x: 340, y: 15, w: 110, h: 40, title: "Exec 1 (CLM002)", sub: "Betrugs-Tool" },
        { id: "e2", x: 340, y: 65, w: 110, h: 40, title: "Exec 2 (CLM003)", sub: "Betrugs-Tool" },
        { id: "e3", x: 340, y: 120, w: 110, h: 40, title: "Exec 3 (CLM002)", sub: "Policy-Tool" },
        { id: "e4", x: 340, y: 170, w: 110, h: 40, title: "Exec 4 (CLM003)", sub: "Policy-Tool" },
        { id: "final", x: 485, y: 85, w: 100, h: 52, title: "Entscheid", sub: "SIU / Zahlung" }
      ],
      edges: [
        ["exec", "m1"], ["exec", "m2"],
        ["m1", "e1"], ["m1", "e2"], ["m2", "e3"], ["m2", "e4"],
        ["e1", "final"], ["e2", "final"], ["e3", "final"], ["e4", "final"]
      ]
    },
    lesson: "Hierarchie skaliert auf große Warteschlangen, ist aber das aufrufintensivste Muster (8 Calls). Jede Ebene addiert Kosten und Latenz — Hierarchien deshalb so flach wie möglich halten."
  },
  {
    id: "swarm",
    group: "multiagent",
    name: "Swarm / Handoff",
    domain: "Versicherung + Klinik",
    controlFlow: "Dezentrale Übergabe + Shared State",
    bestUse: "Anfragen über mehrere Abteilungen ohne festen Ablauf",
    tradeOff: "Ohne Supervisor besitzt niemand das Gesamtbild",
    summary: "Agenten reichen das Gespräch direkt weiter (Triage → Versicherung → Klinik). Ein kleines, validiertes Shared-State-Objekt verfolgt, welche Teilfragen beantwortet und welche noch offen sind.",
    task: "Kundennachricht über zwei Abteilungen: „Ich habe mir einen Zahn abgebrochen — deckt meine Versicherung das ab, und welches Schmerzmittel ist bei Warfarin sicher?“",
    graph: {
      viewBox: "0 0 600 200",
      nodes: [
        { id: "triage", x: 20, y: 40, w: 120, h: 50, title: "Triage-Agent", sub: "Handoff → Claims" },
        { id: "claims", x: 200, y: 40, w: 140, h: 50, title: "Versicherung", sub: "Handoff → Klinik" },
        { id: "clinical", x: 400, y: 40, w: 165, h: 50, title: "Klinik-Agent", sub: "Interaktions-Tool" },
        { id: "state", x: 165, y: 130, w: 270, h: 50, title: "Shared-State-Check", sub: "Beantwortete vs. offene Fragen" }
      ],
      edges: [["triage", "claims"], ["claims", "clinical"], ["claims", "state"], ["clinical", "state"]]
    },
    lesson: "Swarm ist flexibel und günstig (3 Calls), aber niemand besitzt die gesamte Konversation. Erst das validierte Shared-State-Objekt macht offene Fragen oder Zuständigkeitsüberschreitungen sichtbar."
  },
  {
    id: "hitl",
    group: "governance",
    name: "Human-in-the-Loop",
    domain: "Versicherung",
    controlFlow: "Autonom bis Gate → Menschliche Pause",
    bestUse: "Externe, schreibende oder irreversible Aktionen",
    tradeOff: "Menschliche Latenz — dafür kein Fehlschuss nach außen",
    summary: "Der Agent entwirft eine Kunden-E-Mail für einen verdächtigen Schadenfall (CLM002). Ein Policy-Pre-Check prüft den Entwurf, danach pausiert das System für deine echte Freigabe oder Korrektur.",
    task: "Schadenfall CLM002 (Betrugsscore 0,84): Entwirf eine E-Mail an den Kunden. Prüfe den Entwurf selbst — bei Ablehnung speichert das System dein Feedback im Memory und erstellt Entwurf 2.",
    graph: {
      viewBox: "0 0 600 200",
      nodes: [
        { id: "draft", x: 20, y: 74, w: 125, h: 52, title: "E-Mail-Entwurf", sub: "LLM + Memory" },
        { id: "pre", x: 185, y: 74, w: 130, h: 52, title: "Policy-Pre-Check", sub: "Regelprüfung" },
        { id: "human", x: 355, y: 74, w: 115, h: 52, title: "Mensch (HITL)", sub: "OK / Feedback" },
        { id: "send", x: 505, y: 74, w: 80, h: 52, title: "Versand", sub: "Extern" }
      ],
      edges: [["draft", "pre"], ["pre", "human"], ["human", "send"], ["human", "draft"]]
    },
    lesson: "Vor jeder irreversiblen Aktion (E-Mail, Zahlung, Buchung) pausieren. Der Policy-Pre-Check entlastet den Menschen, und gespeichertes Ablehnungs-Feedback verbessert den nächsten Entwurf."
  },
  {
    id: "deterministic",
    group: "governance",
    name: "Deterministische Kontrolle + Reasoning",
    domain: "Pharma-Forschung",
    controlFlow: "Code entscheidet, LLM erklärt",
    bestUse: "Strenge Compliance- und Sicherheitsvorgaben",
    tradeOff: "Regeln brauchen fachliche Pflege & Owner",
    summary: "Harte Geschäftsregeln im Code treffen die verbindliche Pass/Fail-Entscheidung. Das LLM untersucht und erklärt die Befunde — ein abweichendes Modell-Urteil wird protokolliert und ignoriert.",
    task: "Compliance-Gate für Wirkstoff CMP-7740 (3 von 4 Sicherheitsregeln gescheitert). Die Regel-Engine entscheidet NO-GO; der Agent erstellt die fachliche Analyse.",
    graph: {
      viewBox: "0 0 600 195",
      nodes: [
        { id: "rules", x: 20, y: 70, w: 145, h: 54, title: "Regel-Engine (Code)", sub: "4 Compliance-Checks" },
        { id: "reason", x: 215, y: 70, w: 155, h: 54, title: "Agent-Analyse (LLM)", sub: "Erklärt & schlägt vor" },
        { id: "enforce", x: 420, y: 70, w: 160, h: 54, title: "Override-Schutz", sub: "Urteil bleibt NO-GO" }
      ],
      edges: [["rules", "reason"], ["reason", "enforce"]]
    },
    lesson: "„Rules decide, Agent explains“: Selbst wenn das Modell sinnvoll argumentiert, kann es im Fazit falsch liegen. Verbindliche Entscheidungen gehören in testbaren Code."
  }
];

class PatternsController {
  constructor() {
    this.activeId = "augmented";
    this.results = new Map();
    this.hitlResolver = null;
    this.isRunning = false;

    this.sidebarEl = document.getElementById("patternSidebar");
    this.matrixBodyEl = document.getElementById("matrixBody");
    this.graphEl = document.getElementById("flowGraphContainer");
    this.traceListEl = document.getElementById("traceList");
    this.traceCountEl = document.getElementById("traceCount");
    this.resultBodyEl = document.getElementById("resultBody");
    this.lessonBoxEl = document.getElementById("lessonBox");
    this.statusBadgeEl = document.getElementById("resultStatusBadge");
    this.hitlPanelEl = document.getElementById("hitlPanel");

    this.bindEvents();
    this.renderSidebar();
    this.renderMatrix();
    this.selectPattern("augmented");
  }

  bindEvents() {
    document.getElementById("runPatternBtn").addEventListener("click", () => this.runActivePattern());
    document.getElementById("runAllBtn").addEventListener("click", () => this.runAllBenchmark());
    document.getElementById("resetMatrixBtn").addEventListener("click", () => {
      this.results.clear();
      this.renderSidebar();
      this.renderMatrix();
    });

    document.getElementById("routingPresets").addEventListener("change", (e) => {
      if (e.target.value) {
        document.getElementById("routingInput").value = e.target.value;
        e.target.value = "";
      }
    });

    document.getElementById("hitlApproveBtn").addEventListener("click", () => {
      if (this.hitlResolver) {
        const res = this.hitlResolver;
        this.hitlResolver = null;
        this.hitlPanelEl.classList.add("hidden");
        res({ approved: true, feedback: "" });
      }
    });

    document.getElementById("hitlRejectBtn").addEventListener("click", () => {
      if (this.hitlResolver) {
        const feedback = document.getElementById("hitlFeedbackInput").value.trim() || "Bitte überarbeiten.";
        const res = this.hitlResolver;
        this.hitlResolver = null;
        this.hitlPanelEl.classList.add("hidden");
        res({ approved: false, feedback });
      }
    });
  }

  renderSidebar() {
    this.sidebarEl.innerHTML = "";
    for (const grp of PATTERN_GROUPS) {
      const wrap = document.createElement("div");
      wrap.className = "sidebar-group";
      const title = document.createElement("div");
      title.className = "sidebar-group-title";
      title.textContent = grp.label;
      wrap.appendChild(title);

      for (const p of PATTERNS.filter((x) => x.group === grp.id)) {
        const btn = document.createElement("button");
        btn.className = `pattern-item${p.id === this.activeId ? " active" : ""}`;
        const measured = this.results.get(p.id);
        const dotClass = measured ? measured.status : "";
        btn.innerHTML = `<span>${p.name}</span><i class="item-dot ${dotClass}"></i>`;
        btn.addEventListener("click", () => {
          this.selectPattern(p.id);
          window.location.hash = p.id;
        });
        wrap.appendChild(btn);
      }
      this.sidebarEl.appendChild(wrap);
    }
  }

  selectPattern(id) {
    const pattern = PATTERNS.find((p) => p.id === id) || PATTERNS[0];
    this.activeId = pattern.id;
    this.hitlPanelEl.classList.add("hidden");
    this.hitlResolver = null;

    const grp = PATTERN_GROUPS.find((g) => g.id === pattern.group);
    document.getElementById("patternGroupPill").textContent = grp.label;
    document.getElementById("patternTitle").textContent = pattern.name;
    document.getElementById("patternSummary").textContent = pattern.summary;
    document.getElementById("patternDomainChip").textContent = `Domäne: ${pattern.domain}`;
    document.getElementById("patternControlChip").textContent = `Kontrollfluss: ${pattern.controlFlow}`;
    document.getElementById("patternTaskText").textContent = pattern.task;

    document.getElementById("routingInputWrap").classList.toggle("hidden", pattern.id !== "routing");

    this.renderGraph(pattern);
    this.renderSidebar();

    const prev = this.results.get(pattern.id);
    if (prev) {
      this.applyMetrics(prev);
      this.resultBodyEl.innerHTML = prev.html;
      this.lessonBoxEl.innerHTML = `<strong>Kernlektion:</strong> ${pattern.lesson}`;
      this.lessonBoxEl.classList.remove("hidden");
      this.setStatus(prev.status, prev.statusLabel);
      this.renderTraces(prev.traces);
      for (const [nodeId, st] of Object.entries(prev.nodeStates || {})) {
        this.setNodeState(nodeId, st);
      }
    } else {
      this.applyMetrics({ calls: "–", tools: "–", tokens: "–", timeText: "–" });
      this.resultBodyEl.innerHTML = `<p class="muted">Klicke auf <strong>„Muster ausführen“</strong>, um den Durchlauf zu starten.</p>`;
      this.lessonBoxEl.classList.add("hidden");
      this.setStatus("idle", "Bereit");
      this.renderTraces([]);
    }
  }

  renderGraph(pattern) {
    const { viewBox, nodes, edges } = pattern.graph;
    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

    const edgeSvg = edges
      .map(([fromId, toId]) => {
        const a = nodeMap[fromId];
        const b = nodeMap[toId];
        const x1 = a.x + a.w / 2;
        const y1 = a.y + a.h / 2;
        const x2 = b.x + b.w / 2;
        const y2 = b.y + b.h / 2;
        return `<line class="edge-line" data-edge="${fromId}-${toId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#arrow)" />`;
      })
      .join("");

    const nodeSvg = nodes
      .map(
        (n) => `
      <g class="node-group" data-node="${n.id}">
        <rect class="node-rect" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" />
        <text class="node-title" x="${n.x + n.w / 2}" y="${n.y + (n.sub ? 22 : 21)}">${n.title}</text>
        ${n.sub ? `<text class="node-sub" x="${n.x + n.w / 2}" y="${n.y + 39}">${n.sub}</text>` : ""}
      </g>`
      )
      .join("");

    this.graphEl.innerHTML = `
      <svg class="flow-svg" viewBox="${viewBox}" role="img" aria-label="Flow-Graph für ${pattern.name}">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
          </marker>
        </defs>
        ${edgeSvg}
        ${nodeSvg}
      </svg>`;
  }

  setNodeState(nodeId, state) {
    const el = this.graphEl.querySelector(`[data-node="${nodeId}"]`);
    if (!el) return;
    el.classList.remove("active", "pass", "fail", "wait");
    if (state) el.classList.add(state);
  }

  setStatus(kind, label) {
    this.statusBadgeEl.className = `status-badge status-${kind}`;
    this.statusBadgeEl.textContent = label;
  }

  applyMetrics({ calls, tools, tokens, timeText }) {
    document.getElementById("metricCalls").textContent = calls;
    document.getElementById("metricTools").textContent = tools;
    document.getElementById("metricTokens").textContent = tokens;
    document.getElementById("metricTime").textContent = timeText;
  }

  renderTraces(traces) {
    this.traceCountEl.textContent = `${traces.length} Einträge`;
    if (!traces.length) {
      this.traceListEl.innerHTML = `<div class="trace-empty">Noch keine Trace-Einträge.</div>`;
      return;
    }
    this.traceListEl.innerHTML = traces
      .map(
        (t) => `
      <div class="trace-entry type-${t.type}">
        <span class="trace-time">+${t.ms} ms</span>
        <span class="trace-kind">${t.kind}</span>
        <div>${t.message}</div>
      </div>`
      )
      .join("");
    this.traceListEl.scrollTop = this.traceListEl.scrollHeight;
  }

  renderMatrix() {
    this.matrixBodyEl.innerHTML = PATTERNS.map((p) => {
      const m = this.results.get(p.id);
      const grp = PATTERN_GROUPS.find((g) => g.id === p.group);
      const badge = m
        ? `<span class="status-badge status-${m.status}">${m.statusLabel}</span>`
        : `<span class="muted-sm">–</span>`;
      return `
        <tr data-pattern="${p.id}">
          <td><strong>${p.name}</strong></td>
          <td class="muted-sm">${grp.label.split(".")[0]}</td>
          <td>${p.controlFlow}</td>
          <td>${p.bestUse}</td>
          <td class="muted-sm">${p.tradeOff}</td>
          <td class="mono">${m ? m.calls : "–"}</td>
          <td class="mono">${m ? m.tokens : "–"}</td>
          <td class="mono">${m ? m.timeText : "–"}</td>
          <td>${badge}</td>
        </tr>`;
    }).join("");

    this.matrixBodyEl.querySelectorAll("tr").forEach((tr) => {
      tr.addEventListener("click", () => {
        this.selectPattern(tr.dataset.pattern);
        window.location.hash = tr.dataset.pattern;
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  async runAllBenchmark() {
    if (this.isRunning) return;
    if (engine.isWebLLM()) {
      alert("Der Sammel-Benchmark über alle 12 Muster ist für den schnellen Mock-Modus gedacht. Im WebGPU-Modus bitte Muster einzeln ausführen.");
      return;
    }
    for (const p of PATTERNS) {
      this.selectPattern(p.id);
      await this.runPatternById(p.id, { autoApproveHitl: true });
    }
  }

  async runActivePattern() {
    if (this.isRunning) return;
    await this.runPatternById(this.activeId, { autoApproveHitl: false });
  }

  async runPatternById(id, { autoApproveHitl = false } = {}) {
    const pattern = PATTERNS.find((p) => p.id === id);
    if (!pattern) return;
    this.isRunning = true;
    document.getElementById("runPatternBtn").disabled = true;
    document.getElementById("runAllBtn").disabled = true;

    this.renderGraph(pattern);
    this.setStatus("running", "Läuft…");
    this.resultBodyEl.innerHTML = `<p class="muted">Muster <strong>${pattern.name}</strong> wird ausgeführt…</p>`;
    this.lessonBoxEl.classList.add("hidden");

    const started = performance.now();
    const traces = [];
    const nodeStates = {};
    let calls = 0;
    let tools = 0;
    let tokens = 0;

    const ctx = {
      log: (type, kind, message) => {
        traces.push({ type, kind, message, ms: Math.round(performance.now() - started) });
        this.renderTraces(traces);
      },
      node: (nodeId, state) => {
        nodeStates[nodeId] = state;
        this.setNodeState(nodeId, state);
      },
      llm: async (opts) => {
        calls += 1;
        const r = await engine.callLLM(opts);
        tokens += r.tokens;
        return r;
      },
      tool: (name, detail) => {
        tools += 1;
        ctx.log("tool", `TOOL:${name}`, detail);
      },
      waitForHuman: (draftText, precheckText) => {
        if (autoApproveHitl) {
          return Promise.resolve({
            approved: false,
            feedback: "Keinen internen Betrugsscore nennen; Fall als in Prüfung kennzeichnen."
          });
        }
        return new Promise((resolve) => {
          document.getElementById("hitlPrecheck").textContent = precheckText;
          document.getElementById("hitlDraftText").textContent = draftText;
          this.hitlPanelEl.classList.remove("hidden");
          this.hitlResolver = resolve;
        });
      }
    };

    try {
      const outcome = await this.executePatternLogic(id, ctx);
      const elapsedSec = ((performance.now() - started) / 1000).toFixed(1) + " s";
      const record = {
        calls,
        tools,
        tokens,
        timeText: elapsedSec,
        status: outcome.status,
        statusLabel: outcome.statusLabel,
        html: outcome.html,
        traces,
        nodeStates
      };
      this.results.set(id, record);
      this.applyMetrics(record);
      this.resultBodyEl.innerHTML = outcome.html;
      this.lessonBoxEl.innerHTML = `<strong>Kernlektion:</strong> ${pattern.lesson}`;
      this.lessonBoxEl.classList.remove("hidden");
      this.setStatus(outcome.status, outcome.statusLabel);
      this.renderSidebar();
      this.renderMatrix();
    } catch (err) {
      this.setStatus("fail", "Fehler");
      this.resultBodyEl.innerHTML = `<p><strong>Fehler:</strong> ${err.message}</p>`;
    } finally {
      this.isRunning = false;
      document.getElementById("runPatternBtn").disabled = false;
      document.getElementById("runAllBtn").disabled = false;
    }
  }

  async executePatternLogic(id, ctx) {
    const small = engine.isSmallMock();

    // 1. AUGMENTED LLM
    if (id === "augmented") {
      ctx.node("retrieve", "active");
      const claim = TOOLS.get_claim("CLM001");
      ctx.tool("get_claim", `CLM001 geladen: Wasserschaden ${claim.claim_amount.toLocaleString("de-DE")} €, Selbstbehalt ${claim.deductible.toLocaleString("de-DE")} €, Limit ${claim.policy_limit.toLocaleString("de-DE")} €.`);
      ctx.log("gate", "MEMORY", DOMAINS.insurance.memory[0]);
      await sleep(180);
      ctx.node("retrieve", "pass");

      ctx.node("llm", "active");
      const res = await ctx.llm({
        systemPrompt: "You are an insurance adjuster assistant. Reply in German and include the exact settlement amount in EUR.",
        userPrompt: `Claim CLM001: amount=${claim.claim_amount}, deductible=${claim.deductible}, limit=${claim.policy_limit}. Memory: Always subtract deductible. Calculate payout.`,
        mockSmallFn: () => ({
          text: "Für Schadenfall CLM001 (Wasserschaden) ergibt sich: 22.000 € − 2.500 € Selbstbehalt = 19.500 € Auszahlung (unterhalb des Limits von 50.000 €).",
          tokens: 324
        }),
        mockStrongFn: () => ({
          text: "Schadenfall CLM001: Schadenssumme 22.000 € abzüglich 2.500 € Selbstbehalt = 19.500 € Auszahlung. Das Policen-Limit (50.000 €) wird eingehalten.",
          tokens: 310
        })
      });
      ctx.log("llm", "LLM", res.text);
      ctx.node("llm", "pass");

      ctx.node("gate", "active");
      const expected = TOOLS.calc_settlement(claim.claim_amount, claim.deductible, claim.policy_limit);
      const passed = res.text.includes("19.500") || res.text.includes("19500");
      await sleep(160);
      ctx.node("gate", passed ? "pass" : "fail");
      ctx.log(passed ? "gate" : "fail", "GROUNDING", passed
        ? `Geprüft: Auszahlung ${expected.toLocaleString("de-DE")} € stimmt mit den Datensätzen überein.`
        : `Abweichung: Erwartet wurden ${expected.toLocaleString("de-DE")} €.`);

      return {
        status: passed ? "pass" : "fail",
        statusLabel: passed ? "Bestanden" : "Grounding-Fehler",
        html: `<p>${res.text}</p><p class="muted-sm" style="margin-top:8px"><strong>Grounding-Check:</strong> ${passed ? "✓ Betrag (19.500 €) verifiziert" : "✕ Betrag weicht ab"}.</p>`
      };
    }

    // 2. REACT LOOP
    if (id === "react") {
      if (small && !engine.isWebLLM()) {
        for (let i = 1; i <= 3; i++) {
          ctx.node("think", "active");
          const r = await ctx.llm({
            systemPrompt: "Return valid JSON tool call.",
            userPrompt: `Iteration ${i}`,
            mockSmallFn: () => ({
              text: i < 3
                ? "Ich empfehle einfach ein gängiges Erkältungsmittel mit Pseudoephedrin aus der Apotheke."
                : "Antwort: {empfehlung: 'Nasenspray', sicher: ja // ungültiges JSON",
              tokens: 1180 + i * 40
            })
          });
          ctx.log("llm", `ITER ${i}`, r.text);
          ctx.node("think", "pass");

          ctx.node("tool", "fail");
          ctx.log("fail", "HARNESS", i < 3
            ? "Modell hat kein Tool aufgerufen! Harness weist erneut auf get_patient_vitals & check_drug_interaction hin."
            : "Modell liefert erneut ungültiges JSON ohne Tool-Abfrage.");

          ctx.node("schema", "fail");
          await sleep(180);
        }
        ctx.node("fallback", "wait");
        ctx.log("gate", "STEP-CAP", "Iterations-Cap (3/3) erreicht → Schleife gestoppt, Fallback-Plan zur manuellen Prüfung erstellt.");
        return {
          status: "fail",
          statusLabel: "Cap → Fallback",
          html: `<p><strong>Abbruch nach 3 Iterationen (Kleines Modell):</strong> Das 1.5B-Modell ignorierte die Klinik-Tools und gab ungültiges JSON zurück.</p>
                 <p class="muted-sm" style="margin-top:6px"><strong>Schutzmechanismus:</strong> Step-Cap + Schema-Validator verhinderten eine gefährliche, ungeprüfte Medikamentenempfehlung.</p>`
        };
      }

      // Strong mock or WebLLM
      ctx.node("think", "active");
      const r1 = await ctx.llm({
        systemPrompt: "You are a clinical ReAct agent. Decide which tools to call: get_patient_vitals, check_drug_interaction. Reply concisely in German.",
        userPrompt: "Patient P001 (74, blood pressure meds) asks for a cold remedy. Step 1: pick tools.",
        mockStrongFn: () => ({ text: "Thought: Zuerst Vitaldaten (P001) und Wechselwirkung mit abschwellenden Mitteln prüfen. Action: get_patient_vitals(P001), check_drug_interaction(blutdrucksenker, pseudoephedrin).", tokens: 290 })
      });
      ctx.log("llm", "THOUGHT 1", r1.text);
      ctx.node("think", "pass");

      ctx.node("tool", "active");
      const vitals = TOOLS.get_patient_vitals("P001");
      const inter = TOOLS.check_drug_interaction("blutdrucksenker", "pseudoephedrin");
      ctx.tool("get_patient_vitals", `P001: ${vitals.age} J., RR ${vitals.bp}, Medikation: ${vitals.medications.join(", ")}`);
      ctx.tool("check_drug_interaction", `Schweregrad ${inter.severity}: ${inter.reason}`);
      await sleep(180);
      ctx.node("tool", "pass");

      ctx.node("schema", "active");
      const r2 = await ctx.llm({
        systemPrompt: "Summarize the clinical safety check in German based on tool observations.",
        userPrompt: `Vitals: ${JSON.stringify(vitals)}. Interaction: ${JSON.stringify(inter)}.`,
        mockStrongFn: () => ({ text: "Keine abschwellenden Mittel mit Pseudoephedrin (hohes Blutdruckrisiko bei Amlodipin/Ramipril). Stattdessen kochsalzbasiertes Nasenspray und ärztliche Rücksprache empfehlen.", tokens: 340 })
      });
      ctx.log("llm", "FINAL", r2.text);
      ctx.node("schema", "pass");
      ctx.node("fallback", "pass");

      return {
        status: "pass",
        statusLabel: "Bestanden",
        html: `<p>${r2.text}</p><p class="muted-sm" style="margin-top:6px"><strong>Tool-Grounding:</strong> ✓ Vitaldaten &amp; Wechselwirkungs-DB korrekt genutzt.</p>`
      };
    }

    // 3. EVALUATOR-OPTIMIZER
    if (id === "evaluator") {
      let bestDraft = "";
      let accepted = false;
      for (let round = 1; round <= 3; round++) {
        ctx.node("gen", "active");
        const gen = await ctx.llm({
          systemPrompt: `Create a short UX learning plan in German. Allowed certifications ONLY: ${DOMAINS.career.allowed_certifications.join(", ")}.`,
          userPrompt: `Round ${round}: Marketing graduate -> UX Designer.`,
          mockSmallFn: () => ({
            text: `Runde ${round}: 1) Grundlagen UX-Research, 2) Prototyping, 3) Zertifikat: Figma Certification & Google UX Design Certificate.`,
            tokens: 210
          }),
          mockStrongFn: () => ({
            text: round === 1
              ? "Runde 1: Grundlagen + Zertifikat: Figma Certification."
              : "Runde 2: 1) UX-Grundlagen, 2) Portfolio-Projekte, 3) Zertifikate: Google UX Design Certificate und Nielsen Norman UX Cert.",
            tokens: 220
          })
        });
        bestDraft = gen.text;
        ctx.log("llm", `ENTWURF ${round}`, gen.text);
        ctx.node("gen", "pass");

        ctx.node("val", "active");
        const mentioned = [];
        if (/figma certification/i.test(gen.text)) mentioned.push("Figma Certification");
        for (const c of DOMAINS.career.allowed_certifications) {
          if (gen.text.includes(c)) mentioned.push(c);
        }
        const check = TOOLS.validate_certifications(mentioned);
        ctx.tool("validate_certifications", check.valid
          ? `Alle Zertifikate zulässig: ${mentioned.join(", ")}`
          : `Ungültige/halluzinierte Zertifikate erkannt: ${check.invalid.join(", ") || "keine erlaubten Zertifikate gefunden"}`);
        await sleep(160);

        if (check.valid) {
          ctx.node("val", "pass");
          ctx.node("judge", "active");
          const j = await ctx.llm({
            systemPrompt: "Score the UX plan from 1-10 in one short German sentence.",
            userPrompt: gen.text,
            mockStrongFn: () => ({ text: "LLM-Judge: 9/10 – klar strukturiert, realistischer Zeitplan und geprüfte Zertifikate.", tokens: 120 })
          });
          ctx.log("gate", "LLM-JUDGE", j.text);
          ctx.node("judge", "pass");
          ctx.node("out", "pass");
          accepted = true;
          break;
        } else {
          ctx.node("val", "fail");
          ctx.log("fail", `VALIDATOR R${round}`, `Abgelehnt vor LLM-Judge: „Figma Certification“ steht nicht auf der Whitelist.`);
        }
      }

      if (!accepted) {
        ctx.node("out", "wait");
        return {
          status: "warn",
          statusLabel: "Nicht akzeptiert (3/3)",
          html: `<p><strong>Alle 3 Entwürfe vom deterministischen Validator abgelehnt.</strong> Das kleine Modell erfand wiederholt „Figma Certification“.</p>
                 <p class="muted-sm" style="margin-top:6px">Bester Entwurf wird klar als <em>nicht freigegeben</em> markiert statt still ausgeliefert.</p>`
        };
      }
      return {
        status: "pass",
        statusLabel: "Akzeptiert",
        html: `<p>${bestDraft}</p><p class="muted-sm" style="margin-top:6px"><strong>Prüfkette:</strong> ✓ Deterministischer Whitelist-Validator + LLM-Judge bestanden.</p>`
      };
    }

    // 4. PROMPT CHAINING
    if (id === "chaining") {
      const comp = DOMAINS.drug.compounds["QT-9901"];
      ctx.node("s1", "active");
      const r1 = await ctx.llm({
        systemPrompt: "Extract safety signals in German.",
        userPrompt: `Compound ${comp.id}: hepatotoxicity=${comp.hepatotoxicity}, hERG=${comp.herg_risk}, Ames=${comp.ames_test}.`,
        mockSmallFn: () => ({ text: "Extrahiertes Signal: Positive Hepatotoxizität (ALT 5.2x ULN); hERG niedrig, Ames negativ.", tokens: 170 })
      });
      ctx.log("llm", "SCHRITT 1", r1.text);
      ctx.log("gate", "GATE 1", "✓ Pflichtfeld Sicherheitssignal vorhanden.");
      ctx.node("s1", "pass");

      ctx.node("s2", "active");
      const r2 = await ctx.llm({
        systemPrompt: "Classify risk as LOW, MEDIUM, or HIGH.",
        userPrompt: r1.text,
        mockSmallFn: () => ({ text: "Risikoklassifikation: HIGH (signifikantes Leberschädigungspotenzial).", tokens: 140 })
      });
      ctx.log("llm", "SCHRITT 2", r2.text);
      ctx.log("gate", "GATE 2", "✓ Risikostufe HIGH eindeutig klassifiziert.");
      ctx.node("s2", "pass");

      ctx.node("s3", "active");
      const r3 = await ctx.llm({
        systemPrompt: "Write a short Go/No-Go memo in German. Must explicitly include 'QT-9901' and 'NO-GO'.",
        userPrompt: `Risk: ${r2.text}`,
        mockSmallFn: () => ({ text: "Memo: Aufgrund erhöhter Leberwerte sollte die Entwicklung kritisch hinterfragt und weiter beobachtet werden.", tokens: 165 }),
        mockStrongFn: () => ({ text: "Entscheidungsmemo zu QT-9901: Empfehlung NO-GO wegen positiver Hepatotoxizität (ALT 5.2x ULN).", tokens: 175 })
      });
      ctx.log("llm", "SCHRITT 3", r3.text);
      ctx.node("s3", "pass");

      ctx.node("g3", "active");
      const hasId = r3.text.includes("QT-9901");
      const hasDecision = /NO-GO|GO/i.test(r3.text);
      await sleep(160);
      const ok = hasId && hasDecision;
      ctx.node("g3", ok ? "pass" : "fail");
      ctx.log(ok ? "gate" : "fail", "FINAL-GATE", ok
        ? "✓ Memo nennt Wirkstoff QT-9901 und enthält klares Urteil."
        : "✕ Gate blockiert: Memo nennt weder Wirkstoff-ID QT-9901 noch ein klares GO/NO-GO-Urteil.");

      return {
        status: ok ? "pass" : "fail",
        statusLabel: ok ? "Pipeline OK" : "Am Final-Gate gestoppt",
        html: `<p>${r3.text}</p><p class="muted-sm" style="margin-top:6px"><strong>Final-Gate:</strong> ${ok ? "✓ Alle Pflichtangaben enthalten." : "✕ Vages Memo gestoppt statt weitergeleitet."}</p>`
      };
    }

    // 5. ROUTING
    if (id === "routing") {
      const userQuery = document.getElementById("routingInput").value.trim() || "Patient P004 nimmt Warfarin.";
      ctx.node("router", "active");
      const r = await ctx.llm({
        systemPrompt: "Classify into exactly one category: CLINICAL, CLAIMS, CAREER, DRUG, or UNKNOWN.",
        userPrompt: userQuery,
        mockSmallFn: () => {
          // Simuliert das klassische Fehlrouting aus dem Artikel bei Warfarin/P004
          if (/P004|warfarin/i.test(userQuery)) return { text: "DRUG", tokens: 95 };
          if (/CLM|schaden|versicherung/i.test(userQuery)) return { text: "CLAIMS", tokens: 95 };
          if (/UX|karriere|zertifikat|marketing/i.test(userQuery)) return { text: "CAREER", tokens: 95 };
          if (/DM-3350|QT-9901|wirkstoff|toxiz/i.test(userQuery)) return { text: "DRUG", tokens: 95 };
          return { text: "UNKNOWN", tokens: 90 };
        },
        mockStrongFn: () => {
          if (/P004|patient|warfarin|kopfschmerz/i.test(userQuery)) return { text: "CLINICAL", tokens: 90 };
          if (/CLM|schaden|versicherung/i.test(userQuery)) return { text: "CLAIMS", tokens: 90 };
          if (/UX|karriere|zertifikat|marketing/i.test(userQuery)) return { text: "CAREER", tokens: 90 };
          if (/DM-3350|QT-9901|wirkstoff|toxiz/i.test(userQuery)) return { text: "DRUG", tokens: 90 };
          return { text: "UNKNOWN", tokens: 85 };
        }
      });
      const route = (r.text.match(/CLINICAL|CLAIMS|CAREER|DRUG|UNKNOWN/i)?.[0] || "UNKNOWN").toUpperCase();
      ctx.log("llm", "ROUTER", `Gewählte Ziel-Domäne: ${route}`);
      ctx.node("router", "pass");

      // Günstiger Konsistenzcheck auf Datensatz-IDs
      ctx.node("check", "active");
      await sleep(160);
      const hasPatientId = /\bP0\d\d\b/i.test(userQuery);
      const hasClaimId = /\bCLM\d+\b/i.test(userQuery);
      const misroute = (hasPatientId && route !== "CLINICAL") || (hasClaimId && route !== "CLAIMS");

      if (route === "UNKNOWN") {
        ctx.node("check", "wait");
        ctx.node("queue", "wait");
        ctx.log("human", "HUMAN-QUEUE", "Keine bekannte Domäne → Anfrage an menschliche Triage übergeben.");
        return {
          status: "warn",
          statusLabel: "Human Queue",
          html: `<p><strong>Route: UNKNOWN</strong> — Anfrage passt zu keinem Spezialisten und wurde sicher an die <em>Human Queue</em> übergeben.</p>`
        };
      }

      if (misroute) {
        ctx.node("check", "fail");
        ctx.node("queue", "fail");
        ctx.log("fail", "KONSISTENZCHECK", `Wahrscheinliches Fehlrouting erkannt! Anfrage nennt Datensatz-ID (${hasPatientId ? "Patient P004" : "Claim-ID"}), Router wählte aber ${route}.`);
        return {
          status: "fail",
          statusLabel: "Fehlrouting erkannt",
          html: `<p><strong>Router wählte <code>${route}</code></strong> — der Spezialist hätte keinen Zugriff auf die Patientenakte!</p>
                 <p class="muted-sm" style="margin-top:6px"><strong>Schutz:</strong> Ein einzeiliger Konsistenzcheck auf die ID <code>P004</code> hat das Fehlrouting sofort abgefangen.</p>`
        };
      }

      ctx.node("check", "pass");
      ctx.node("spec", "active");
      ctx.tool(`specialist_${route.toLowerCase()}`, `Spezialist ${route} bearbeitet Anfrage mit eigenen Domänen-Tools.`);
      await sleep(200);
      ctx.node("spec", "pass");
      return {
        status: "pass",
        statusLabel: `Route: ${route}`,
        html: `<p><strong>Korrekt geroutet an Spezialist <code>${route}</code>.</strong> Konsistenzcheck bestanden, Domänen-Tools ausgeführt.</p>`
      };
    }

    // 6. PARALLEL SECTIONING
    if (id === "sectioning") {
      const claim = TOOLS.get_claim("CLM003");
      ctx.node("split", "active");
      ctx.tool("get_claim", `CLM003 aufgeteilt in 3 unabhängige Teilanalysen (Deckung, Betrug, Bewertung).`);
      ctx.node("split", "pass");

      ctx.node("w1", "active");
      ctx.node("w2", "active");
      ctx.node("w3", "active");

      const [r1, r2, r3] = await Promise.all([
        ctx.llm({
          systemPrompt: "Check insurance coverage in 1 German sentence.",
          userPrompt: `CLM003 storm damage, limit ${claim.policy_limit}.`,
          mockSmallFn: () => ({ text: "Deckung: Sturmschaden ist durch Police gedeckt (Limit 23.000 €).", tokens: 120 })
        }),
        ctx.llm({
          systemPrompt: "Assess fraud risk in 1 German sentence.",
          userPrompt: `CLM003 fraud_score=${claim.fraud_score}.`,
          mockSmallFn: () => ({ text: "Betrug: Risiko niedrig (Score 0,18), Wetterdienst bestätigt Sturm.", tokens: 115 })
        }),
        ctx.llm({
          systemPrompt: "Calculate payout in 1 German sentence.",
          userPrompt: `amount=${claim.claim_amount}, deductible=${claim.deductible}, limit=${claim.policy_limit}.`,
          mockSmallFn: () => ({ text: "Bewertung: 24.200 € − 1.500 € Selbstbehalt = 22.700 €.", tokens: 125 })
        })
      ]);

      ctx.log("llm", "WORKER 1", r1.text);
      ctx.log("llm", "WORKER 2", r2.text);
      ctx.log("llm", "WORKER 3", r3.text);
      ctx.node("w1", "pass");
      ctx.node("w2", "pass");
      ctx.node("w3", "pass");

      ctx.node("agg", "active");
      const agg = await ctx.llm({
        systemPrompt: "Merge the 3 analyses into 1 concise German summary.",
        userPrompt: `${r1.text} | ${r2.text} | ${r3.text}`,
        mockSmallFn: () => ({ text: "Gesamturteil CLM003: Gedeckt, geringes Betrugsrisiko, empfohlene Auszahlung 22.700 €.", tokens: 160 })
      });
      ctx.log("llm", "AGGREGATOR", agg.text);
      ctx.node("agg", "pass");

      ctx.node("cap", "active");
      const payout = TOOLS.calc_settlement(claim.claim_amount, claim.deductible, claim.policy_limit);
      const ok = payout <= claim.policy_limit;
      ctx.node("cap", ok ? "pass" : "fail");
      ctx.log("gate", "LIMIT-GATE", `✓ Auszahlung ${payout.toLocaleString("de-DE")} € ≤ Limit ${claim.policy_limit.toLocaleString("de-DE")} €.`);

      return {
        status: "pass",
        statusLabel: "Bestanden",
        html: `<p>${agg.text}</p><p class="muted-sm" style="margin-top:6px"><strong>Policy-Limit-Check:</strong> ✓ 22.700 € liegt im Limit (23.000 €).</p>`
      };
    }

    // 7. PARALLEL VOTING
    if (id === "voting") {
      ctx.node("q", "active");
      ctx.log("llm", "SETUP", "Starte 5 parallele Durchläufe bei Temperaturen 0.1, 0.3, 0.5, 0.7, 0.9.");
      ctx.node("q", "pass");

      const temps = [0.1, 0.3, 0.5, 0.7, 0.9];
      const votes = [];
      for (let i = 0; i < 5; i++) {
        ctx.node(`v${i + 1}`, "active");
        const r = await ctx.llm({
          systemPrompt: "Answer strictly SAFE or UNSAFE for taking Aspirin together with Warfarin.",
          userPrompt: "Is Aspirin safe for a patient taking Warfarin?",
          temperature: temps[i],
          mockSmallFn: () => ({
            text: i === 4 ? "SAFE" : "UNSAFE",
            tokens: 65
          }),
          mockStrongFn: () => ({ text: "UNSAFE", tokens: 65 })
        });
        const vote = /\bUNSAFE\b/i.test(r.text) ? "UNSAFE" : "SAFE";
        votes.push(vote);
        ctx.node(`v${i + 1}`, vote === "UNSAFE" ? "pass" : "fail");
        ctx.log(vote === "UNSAFE" ? "llm" : "fail", `VOTER ${i + 1}`, `T=${temps[i]} → ${vote}`);
      }

      ctx.node("tally", "active");
      const unsafeCount = votes.filter((v) => v === "UNSAFE").length;
      const pct = Math.round((unsafeCount / 5) * 100);
      const consensus = unsafeCount >= 3 ? "UNSAFE" : "SAFE";
      ctx.log("gate", "MEHRHEIT", `Konsens: ${consensus} (${unsafeCount}/5 = ${pct} % Übereinstimmung).`);
      ctx.node("tally", "pass");

      ctx.node("db", "active");
      const db = TOOLS.check_drug_interaction("warfarin", "aspirin");
      ctx.tool("check_drug_interaction", `DB bestätigt: ${db.safe ? "SAFE" : "UNSAFE"} (${db.severity}) – ${db.reason}`);
      ctx.node("db", "pass");

      return {
        status: "pass",
        statusLabel: `${consensus} (${pct} %)`,
        html: `<p><strong>Mehrheitsvotum: ${consensus} (${unsafeCount}/5 Stimmen = ${pct} %)</strong></p>
               <p class="muted-sm" style="margin-top:6px"><strong>Datenbank-Check:</strong> ✓ Bestätigt (${db.severity} – ${db.reason}). Eine einzelne Stichprobe bei T=0.9 hätte ein 20 %-Risiko für die gefährliche Antwort „SAFE“ gehabt.</p>`
      };
    }

    // 7b. BRIEFING-TEAM (PMO-KURSBEISPIEL)
    if (id === "briefing_team") {
      const state = {
        query: DOMAINS.pmo.query,
        sources: { "DOC-101": DOMAINS.pmo.sources["DOC-101"], "DOC-102": DOMAINS.pmo.sources["DOC-102"] },
        research: "",
        draft: "",
        feedback: "",
        quality: "revise",
        attempts: 0,
        blocked: false
      };

      ctx.node("research", "active");
      const res = await ctx.llm({
        systemPrompt: "Extract facts and open questions from DOC-101 and DOC-102 in German. Cite DOC-101 and DOC-102.",
        userPrompt: JSON.stringify(state.sources),
        mockSmallFn: () => ({
          text: "Recherche-Notizen: M3 (API-Go-Live) ist 2 Wochen verzögert wegen Schnittstellenfreigabe [DOC-101]. Externes Audit noch offen, Budget-Puffer 15.000 € [DOC-102].",
          tokens: 185
        })
      });
      state.research = res.text;
      ctx.log("llm", "RECHERCHE", state.research);
      ctx.node("research", "pass");

      while (state.attempts < 2) {
        state.attempts += 1;
        ctx.node("writer", "active");
        const w = await ctx.llm({
          systemPrompt: "Write a concise German executive briefing based on research. Always cite [DOC-101] and [DOC-102].",
          userPrompt: `Attempt ${state.attempts}. Research: ${state.research}. Feedback: ${state.feedback || "none"}`,
          mockSmallFn: () => ({
            text: state.attempts === 1
              ? "Steuerkreis-Briefing: Der API-Go-Live verzögert sich um 2 Wochen. Das externe Audit ist noch offen, der Puffer beträgt 15.000 €."
              : "Steuerkreis-Briefing: Der API-Go-Live verzögert sich um 2 Wochen [DOC-101]. Offene Frage: Freigabe für externes Audit; Budget-Puffer 15.000 € [DOC-102].",
            tokens: 170
          }),
          mockStrongFn: () => ({
            text: "Steuerkreis-Briefing: Meilenstein M3 liegt 2 Wochen hinter Plan [DOC-101]. Offene Entscheidung: externes Audit (Puffer 15.000 €) [DOC-102].",
            tokens: 165
          })
        });
        state.draft = w.text;
        ctx.log("llm", `SCHREIBEN #${state.attempts}`, state.draft);
        ctx.node("writer", "pass");

        ctx.node("review", "active");
        const cited = [...new Set(state.draft.match(/DOC-\d+/g) || [])];
        const idCheck = TOOLS.validate_source_ids(cited);
        ctx.tool("validate_source_ids", idCheck.valid
          ? `Quellen-IDs gültig: ${cited.join(", ")}`
          : `Fehlende/ungültige Quellen-IDs (${cited.join(", ") || "keine gefunden"}) — deterministisch vor LLM-Review abgefangen.`);

        if (!idCheck.valid) {
          state.quality = "revise";
          state.feedback = "Bitte alle Fakten mit den erlaubten Quellen-IDs [DOC-101] und [DOC-102] belegen.";
          ctx.node("review", "fail");
          ctx.log("fail", `PRÜFUNG #${state.attempts}`, state.feedback);
        } else {
          const rev = await ctx.llm({
            systemPrompt: "Review the briefing against DOC-101 and DOC-102. Reply ACCEPTED if complete.",
            userPrompt: state.draft,
            mockSmallFn: () => ({ text: "ACCEPTED: Terminlage, offene Frage und Quellen-IDs vollständig belegt.", tokens: 120 })
          });
          state.quality = "accepted";
          state.feedback = rev.text;
          ctx.node("review", "pass");
          ctx.log("gate", `PRÜFUNG #${state.attempts}`, rev.text);
        }

        ctx.node("gate", "active");
        await sleep(150);
        if (state.quality === "accepted") {
          ctx.node("gate", "pass");
          ctx.log("gate", "ROUTER", `quality=accepted nach ${state.attempts} Versuch(en) → Abschluss.`);
          break;
        }
        if (state.attempts >= 2) {
          state.blocked = true;
          ctx.node("gate", "fail");
          ctx.log("fail", "ROUTER", "attempts=2 erreicht → blocked=True (Übergabe zur manuellen Prüfung).");
          break;
        }
        ctx.node("gate", "wait");
        ctx.log("gate", "ROUTER", `quality=revise, attempts=${state.attempts}/2 → zurück an Schreiben (Recherche wird nicht wiederholt).`);
      }

      ctx.node("finish", state.blocked ? "wait" : "pass");
      return {
        status: state.blocked ? "warn" : "pass",
        statusLabel: state.blocked ? "blocked=True (Review)" : `Akzeptiert (${state.attempts}x)`,
        html: `<p>${state.draft}</p>
               <p class="muted-sm" style="margin-top:8px"><strong>BriefingState:</strong> <code>quality="${state.quality}"</code> · <code>attempts=${state.attempts}</code> · <code>blocked=${state.blocked}</code></p>
               <p class="muted-sm" style="margin-top:4px">Hinweis: Ein akzeptierter Entwurf ist noch keine Versandfreigabe (externe Aktion getrennt prüfen).</p>`
      };
    }

    // 8. ORCHESTRATOR-WORKERS
    if (id === "orchestrator") {
      const comp = DOMAINS.drug.compounds["DM-3350"];
      ctx.node("orch", "active");
      const plan = await ctx.llm({
        systemPrompt: "Decide which two specialists are needed for IND readiness of DM-3350: Chemist and Toxicologist.",
        userPrompt: "Plan specialist workers for DM-3350 IND readiness brief.",
        mockSmallFn: () => ({ text: "Plan zur Laufzeit: 1) Chemiker (Synthese & Reinheit prüfen), 2) Toxikologe (Sicherheitsprofil prüfen).", tokens: 165 })
      });
      ctx.log("llm", "ORCHESTRATOR", plan.text);
      ctx.node("orch", "pass");

      ctx.node("chem", "active");
      ctx.node("tox", "active");
      ctx.tool("compound_db", `DM-3350 Chemie: ${comp.chemistry_status}`);
      ctx.tool("toxicology_db", `DM-3350 Tox: Hepato=${comp.hepatotoxicity}, hERG=${comp.herg_risk}, Repro-Tox=${comp.repro_tox}`);

      const [cRes, tRes] = await Promise.all([
        ctx.llm({
          systemPrompt: "Summarize chemistry readiness in 1 German sentence.",
          userPrompt: comp.chemistry_status,
          mockSmallFn: () => ({ text: "Chemiker: Synthese stabil, Reinheit 99,2 % – bereit für IND.", tokens: 130 })
        }),
        ctx.llm({
          systemPrompt: "Summarize toxicology findings in 1 German sentence.",
          userPrompt: `Hepato=${comp.hepatotoxicity}, Repro=${comp.repro_tox}`,
          mockSmallFn: () => ({ text: "Toxikologe: Hepato/hERG/Ames unauffällig, aber Reproduktionstoxizität fehlt noch.", tokens: 145 })
        })
      ]);
      ctx.log("llm", "CHEMIKER", cRes.text);
      ctx.log("llm", "TOXIKOLOGE", tRes.text);
      ctx.node("chem", "pass");
      ctx.node("tox", "pass");

      ctx.node("synth", "active");
      const synth = await ctx.llm({
        systemPrompt: "Synthesize an IND readiness brief in German.",
        userPrompt: `${cRes.text} ${tRes.text}`,
        mockSmallFn: () => ({ text: "IND-Briefing DM-3350: Vorläufiges GO unter Auflage — fehlende Bewertung der Reproduktionstoxizität muss vor Start nachgereicht werden.", tokens: 195 })
      });
      ctx.log("llm", "SYNTHESIZER", synth.text);
      ctx.node("synth", "pass");

      return {
        status: "pass",
        statusLabel: "GO mit Auflage",
        html: `<p>${synth.text}</p><p class="muted-sm" style="margin-top:6px"><strong>Aufwand:</strong> 4 Modellaufrufe (1 Planung + 2 dynamische Worker + 1 Synthese).</p>`
      };
    }

    // 9. HIERARCHICAL DECOMPOSITION
    if (id === "hierarchical") {
      ctx.node("exec", "active");
      await ctx.llm({
        systemPrompt: "Set triage goal for CLM002 and CLM003.",
        userPrompt: "Triage today's insurance queue.",
        mockSmallFn: () => ({ text: "Executive: Warteschlange (CLM002, CLM003) an Risiko-Manager und Deckungs-Manager delegieren.", tokens: 150 })
      });
      ctx.log("llm", "EXECUTIVE", "Ziele an Risiko-Manager und Deckungs-Manager vergeben.");
      ctx.node("exec", "pass");

      ctx.node("m1", "active");
      ctx.node("m2", "active");
      await Promise.all([
        ctx.llm({ systemPrompt: "Delegate risk checks.", userPrompt: "CLM002, CLM003", mockSmallFn: () => ({ text: "Risiko-Mgr verteilt CLM002 & CLM003 an Exec 1 & 2.", tokens: 140 }) }),
        ctx.llm({ systemPrompt: "Delegate coverage checks.", userPrompt: "CLM002, CLM003", mockSmallFn: () => ({ text: "Deckungs-Mgr verteilt CLM002 & CLM003 an Exec 3 & 4.", tokens: 140 }) })
      ]);
      ctx.log("llm", "MANAGER", "Beide Manager delegieren je 2 Einzelschäden an 4 Executors.");
      ctx.node("m1", "pass");
      ctx.node("m2", "pass");

      const execNodes = ["e1", "e2", "e3", "e4"];
      execNodes.forEach((n) => ctx.node(n, "active"));
      ctx.tool("fraud_scoring", "CLM002 Score 0,84 (kein Polizeibericht) | CLM003 Score 0,18");
      ctx.tool("policy_check", "CLM002 Limit 25.000 € | CLM003 Auszahlung 22.700 € (Limit 23.000 €)");
      await Promise.all(
        execNodes.map((n) =>
          ctx.llm({ systemPrompt: "Report executor check.", userPrompt: n, mockSmallFn: () => ({ text: `${n} abgeschlossen.`, tokens: 155 }) })
        )
      );
      execNodes.forEach((n) => ctx.node(n, "pass"));
      ctx.log("llm", "EXECUTORS", "Alle 4 Worker melden ihre Tool-Ergebnisse zurück.");

      ctx.node("final", "active");
      const fin = await ctx.llm({
        systemPrompt: "Make final executive decision in German for CLM002 and CLM003.",
        userPrompt: "CLM002 fraud=0.84 no police report; CLM003 valid storm claim 22700 EUR.",
        mockSmallFn: () => ({
          text: "Executive-Entscheidung: CLM002 an Sonderermittlung (SIU) übergeben; CLM003 Teilzahlung von 22.700 € freigegeben.",
          tokens: 250
        })
      });
      ctx.log("gate", "FINAL", fin.text);
      ctx.node("final", "pass");

      return {
        status: "pass",
        statusLabel: "Abgeschlossen (8 Calls)",
        html: `<p>${fin.text}</p><p class="muted-sm" style="margin-top:6px"><strong>Beobachtung:</strong> Korrektes Ergebnis, aber höchster Aufruf-Overhead im gesamten Lab (8 Modellaufrufe).</p>`
      };
    }

    // 10. SWARM / HANDOFF
    if (id === "swarm") {
      const sharedState = {
        coverage_answered: false,
        painkiller_answered: false,
        scope_violation: false
      };

      ctx.node("triage", "active");
      await ctx.llm({
        systemPrompt: "Route multi-part question to Claims first.",
        userPrompt: "Tooth claim + safe painkiller with warfarin.",
        mockSmallFn: () => ({ text: "Triage: Übergabe an Versicherungs-Agent (Handoff → Claims).", tokens: 110 })
      });
      ctx.log("llm", "TRIAGE", "Handoff an Versicherungs-Agent.");
      ctx.node("triage", "pass");

      ctx.node("claims", "active");
      const cl = await ctx.llm({
        systemPrompt: "Answer tooth insurance coverage and hand off medical part to Clinical.",
        userPrompt: "Tooth claim + painkiller.",
        mockSmallFn: () => ({
          text: "Versicherung: Zahnbehandlung ist über Zusatzbaustein gedeckt. Tipp: Nehmen Sie einfach Ibuprofen. Handoff → Klinik.",
          tokens: 165
        }),
        mockStrongFn: () => ({
          text: "Versicherung: Zahnbehandlung ist über den Zahn-Zusatzbaustein gedeckt. Für die Schmerzmittelfrage übergebe ich an die Klinik.",
          tokens: 150
        })
      });
      sharedState.coverage_answered = true;
      sharedState.scope_violation = /ibuprofen/i.test(cl.text);
      ctx.log(sharedState.scope_violation ? "fail" : "llm", "CLAIMS", cl.text);
      ctx.node("claims", sharedState.scope_violation ? "fail" : "pass");

      ctx.node("clinical", "active");
      ctx.tool("check_drug_interaction", "Warfarin + NSAR/Aspirin: HOCH (Blutungsrisiko); Paracetamol niedrig dosiert nach Rücksprache.");
      const clin = await ctx.llm({
        systemPrompt: "Answer safe painkiller for warfarin patient in German.",
        userPrompt: "Patient on warfarin asks for tooth painkiller.",
        mockSmallFn: () => ({ text: "Klinik: Tool-Check abgeschlossen. Bitte Rücksprache mit Arzt halten.", tokens: 150 }),
        mockStrongFn: () => ({ text: "Klinik: Kein Aspirin/Ibuprofen wegen Blutungsrisiko bei Warfarin. Paracetamol in niedriger Dosis nur nach ärztlicher Rücksprache.", tokens: 170 })
      });
      sharedState.painkiller_answered = !small || /paracetamol/i.test(clin.text);
      ctx.log("llm", "KLINIK", clin.text);
      ctx.node("clinical", "pass");

      ctx.node("state", "active");
      await sleep(160);
      const allGood = sharedState.coverage_answered && sharedState.painkiller_answered && !sharedState.scope_violation;
      ctx.node("state", allGood ? "pass" : "warn");
      ctx.log(allGood ? "gate" : "fail", "SHARED-STATE", `coverage=${sharedState.coverage_answered}, painkiller=${sharedState.painkiller_answered}, scope_violation=${sharedState.scope_violation}`);

      return {
        status: allGood ? "pass" : "warn",
        statusLabel: allGood ? "Vollständig" : "Lücke im State sichtbar",
        html: `<p>${allGood
          ? "Beide Teilfragen sauber und rollenkonform beantwortet."
          : "<strong>Shared-State-Warnung:</strong> Der Versicherungs-Agent gab ungefragt einen medizinischen Tipp („Ibuprofen“), während die Schmerzmittelfrage noch als offen markiert blieb."}</p>
          <p class="muted-sm" style="margin-top:6px">Ohne Supervisor verhindert erst das validierte State-Objekt, dass offene Teilfragen still verloren gehen.</p>`
      };
    }

    // 11. HUMAN-IN-THE-LOOP
    if (id === "hitl") {
      ctx.node("draft", "active");
      const draft1 = await ctx.llm({
        systemPrompt: "Draft a short German email to claimant CLM002 (fraud score 0.84).",
        userPrompt: "Draft email about claim CLM002.",
        mockSmallFn: () => ({
          text: "Betreff: Ihr Schadenfall CLM002\n\nSehr geehrte(r) Kund(in),\nIhr Antrag wurde wegen eines hohen internen Betrugsscores (0,84) gestoppt.\nMit freundlichen Grüßen\nSchadenabteilung",
          tokens: 180
        })
      });
      ctx.log("llm", "ENTWURF 1", "E-Mail-Entwurf erstellt (enthält internen Betrugsscore 0,84).");
      ctx.node("draft", "pass");

      ctx.node("pre", "active");
      const hasLeak = /betrugsscore|fraud|0,84|0\.84/i.test(draft1.text);
      ctx.log(hasLeak ? "fail" : "gate", "PRE-CHECK", hasLeak
        ? "⚠ Policy-Warnung: Entwurf erwähnt internen Betrugsscore gegenüber dem Kunden!"
        : "✓ Keine internen Kennzahlen im Entwurf gefunden.");
      ctx.node("pre", hasLeak ? "fail" : "pass");

      ctx.node("human", "wait");
      ctx.log("human", "HITL-PAUSE", "Ausführung pausiert — warte auf menschliche Freigabe oder Feedback.");
      const decision = await ctx.waitForHuman(
        draft1.text,
        hasLeak
          ? "⚠ Policy-Pre-Check: Entwurf nennt den internen Betrugsscore (0,84) — das darf nicht nach außen gehen!"
          : "Policy-Pre-Check: Keine Auffälligkeiten."
      );

      if (decision.approved) {
        ctx.node("human", "pass");
        ctx.node("send", "pass");
        ctx.log("human", "FREIGEGEBEN", "Mensch hat Entwurf 1 freigegeben → E-Mail versendet.");
        return {
          status: hasLeak ? "warn" : "pass",
          statusLabel: "Freigegeben & gesendet",
          html: `<p><strong>Entwurf 1 wurde manuell freigegeben und versendet.</strong></p><pre style="margin-top:8px;white-space:pre-wrap;font-size:0.8rem">${draft1.text}</pre>`
        };
      }

      // Abgelehnt → Feedback ins Memory → Entwurf 2
      ctx.log("human", "ABGELEHNT", `Feedback im Memory gespeichert: „${decision.feedback}“`);
      ctx.node("draft", "active");
      const draft2 = await ctx.llm({
        systemPrompt: "Redraft the German email strictly following the human feedback. Never mention fraud scores.",
        userPrompt: `Feedback: ${decision.feedback}`,
        mockSmallFn: () => ({
          text: "Betreff: Rückfrage zu Ihrem Schadenfall CLM002\n\nSehr geehrte(r) Kund(in),\nIhr Schadenfall befindet sich aktuell in der regulären Prüfung (nicht abgelehnt). Bitte reichen Sie noch den Unfallbericht sowie die Werkstattrechnung nach.\nMit freundlichen Grüßen\nSchadenabteilung",
          tokens: 205
        })
      });
      ctx.log("llm", "ENTWURF 2", "Überarbeiteter Entwurf berücksichtigt gespeichertes Feedback.");
      ctx.node("draft", "pass");

      ctx.node("pre", "pass");
      ctx.log("gate", "PRE-CHECK 2", "✓ Kein interner Betrugsscore enthalten.");
      ctx.node("human", "pass");
      ctx.node("send", "pass");
      ctx.log("human", "VERSENDET", "Entwurf 2 freigegeben und sicher versendet.");

      return {
        status: "pass",
        statusLabel: "Nach Korrektur gesendet",
        html: `<p><strong>Entwurf 1 gestoppt, Feedback im Memory gespeichert, Entwurf 2 sicher versendet:</strong></p>
               <pre style="margin-top:8px;white-space:pre-wrap;font-size:0.8rem">${draft2.text}</pre>`
      };
    }

    // 12. DETERMINISTIC CONTROL + AGENTIC REASONING
    if (id === "deterministic") {
      ctx.node("rules", "active");
      const compliance = TOOLS.check_compliance_rules("CMP-7740");
      ctx.tool("check_compliance_rules", `3 von 4 Regeln gescheitert (${compliance.failed_rules.join(", ")}) → Verbindliches Urteil: ${compliance.decision}.`);
      ctx.node("rules", "fail");

      ctx.node("reason", "active");
      const reasoning = await ctx.llm({
        systemPrompt: "Explain why each failed compliance rule matters for CMP-7740 in German, suggest follow-up tests, and state an opinion.",
        userPrompt: `Failed rules: ${compliance.failed_rules.join(", ")}.`,
        mockSmallFn: () => ({
          text: "Analyse: Hepatotoxizität, hERG-Verlängerung und Reproduktionstoxizität erfordern Dosis-Wirkungs-Studien und Strukturmodifikation. Eigene Einschätzung: GO für kleine Pilotstudie.",
          tokens: 215
        }),
        mockStrongFn: () => ({
          text: "Analyse: Drei kritische Sicherheits-Gates (Leber, Herz, Reproduktion) sind gerissen. Empfohlene Folgeexperimente: Struktur-Optimierung und In-vitro-hERG-Assay. Fazit: NO-GO.",
          tokens: 210
        })
      });
      ctx.log("llm", "AGENT-ANALYSE", reasoning.text);
      ctx.node("reason", "pass");

      ctx.node("enforce", "active");
      const overrideAttempt = /\bGO\b/.test(reasoning.text) && !/\bNO-GO\b/.test(reasoning.text);
      await sleep(160);
      ctx.node("enforce", "pass");
      ctx.log(overrideAttempt ? "fail" : "gate", "OVERRIDE-SCHUTZ", overrideAttempt
        ? "⚠ Agent schlug „GO“ vor — Override-Versuch protokolliert und ignoriert! Finales Urteil bleibt NO-GO."
        : "✓ Code-Entscheidung NO-GO verbindlich durchgesetzt.");

      return {
        status: "pass",
        statusLabel: "NO-GO (Code-Hoheit)",
        html: `<p><strong>Verbindliche Entscheidung (Code): <code>${compliance.decision}</code></strong> (3/4 Regeln fehlgeschlagen: ${compliance.failed_rules.join(", ")}).</p>
               <p style="margin-top:6px">${reasoning.text}</p>
               <p class="muted-sm" style="margin-top:6px">${overrideAttempt ? "🛡 Abweichende Modell-Empfehlung („GO“) wurde protokolliert und ignoriert." : "✓ Analyse ergänzt das verbindliche Regelurteil."}</p>`
      };
    }

    return { status: "idle", statusLabel: "Unbekannt", html: "" };
  }
}

window.AgentLab.PATTERN_GROUPS = PATTERN_GROUPS;
window.AgentLab.PATTERNS = PATTERNS;
window.AgentLab.PatternsController = PatternsController;
})();
