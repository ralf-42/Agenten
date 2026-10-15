/* ================================================================
   P5.JS KI-AGENTEN-SIMULATOR (Didaktisch optimiert - LIGHT MODE)
   Fokus: Maximale Klarheit, korrekte CSS-Klassen & Agenten-Fokus
================================================================ */

// CSS-Styling für den hellen Hintergrund (Light Mode) direkt in die Seite injizieren
const styleSheet = `
  body {
    font-family: 'Space Grotesk', sans-serif !important;
    background: #ffffff !important;
    color: #24292f !important;
    margin: 0; padding: 0; min-height: 100vh; line-height: 1.6;
  }
  .app-container { display: grid; grid-template-rows: auto 1fr; min-height: 100vh; }
  header {
    padding: 1.25rem 2rem; border-bottom: 1px solid #d0d7de;
    display: flex; align-items: center; gap: 1rem; background: #f6f8fa;
  }
  header h1 { font-size: 1.1rem; font-weight: 600; margin: 0; color: #24292f; }
  header p { font-size: 0.8rem; color: #57606a; margin: 2px 0 0 0; }
  .badge {
    font-size: 0.68rem; font-weight: 500; padding: 2px 8px;
    border-radius: 20px; border: 1px solid; font-family: 'JetBrains Mono', monospace;
  }
  .badge-blue { color: #0969da; border-color: #0969da; background: rgba(9,105,218,.06); }
  .badge-green { color: #1a7f37; border-color: #1a7f37; background: rgba(26,127,55,.06); }
  
  .main-layout { display: grid; grid-template-columns: 340px 1fr; height: calc(100vh - 65px); overflow: hidden; }
  .left-panel { border-right: 1px solid #d0d7de; display: flex; flex-direction: column; overflow: hidden; background: #ffffff; }
  .query-box { padding: 1.25rem; border-bottom: 1px solid #d0d7de; }
  .query-box label { font-size: 0.72rem; color: #57606a; text-transform: uppercase; letter-spacing: .08em; display: block; margin-bottom: .5rem; font-weight: 600; }
  .preset-buttons { display: flex; flex-direction: column; gap: .4rem; }
  .preset-btn {
    background: #f6f8fa; border: 1px solid #d0d7de; color: #24292f;
    border-radius: 10px; padding: .5rem .75rem; font-size: 0.8rem;
    cursor: pointer; text-align: left; transition: all 0.2s; display: flex; align-items: center; gap: .5rem;
    font-weight: 500;
  }
  .preset-btn:hover:not(:disabled) { border-color: #0969da; background: rgba(9,105,218,0.06); }
  .preset-btn.active { border-color: #0969da; background: rgba(9,105,218,0.08); font-weight: 600; }
  .preset-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  
  .arch-panel { flex: 1; overflow-y: auto; padding: 1.25rem; background: #fafafa; }
  .arch-panel h2 { font-size: 0.72rem; color: #57606a; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 1rem; }
  .component { border: 1px solid #d0d7de; border-radius: 10px; margin-bottom: .75rem; background: #ffffff; overflow: hidden; }
  .component.active-llm { border-color: #0969da; box-shadow: 0 0 12px rgba(9,105,218,.25); }
  .component.active-weather { border-color: #1a7f37; box-shadow: 0 0 12px rgba(26,127,55,.25); }
  .component.active-calc { border-color: #8250df; box-shadow: 0 0 12px rgba(130,80,223,.25); }
  .component.active-kb { border-color: #bc4c00; box-shadow: 0 0 12px rgba(188,76,0,.25); }
  .comp-header { display: flex; align-items: center; gap: .6rem; padding: .6rem .85rem; background: #f6f8fa; border-bottom: 1px solid #d0d7de; }
  .comp-title { font-weight: 600; font-size: .85rem; color: #24292f; }
  .comp-sub { font-size: .72rem; color: #57606a; }
  .comp-status { margin-left: auto; width: 7px; height: 7px; border-radius: 50%; background: #d0d7de; }
  .comp-status.active-llm { background: #0969da; box-shadow: 0 0 6px #0969da; }
  .comp-status.active-weather { background: #1a7f37; box-shadow: 0 0 6px #1a7f37; }
  .comp-status.active-calc { background: #8250df; box-shadow: 0 0 6px #8250df; }
  .comp-status.active-kb { background: #bc4c00; box-shadow: 0 0 6px #bc4c00; }
  .comp-body { padding: .6rem .85rem; font-size: .75rem; color: #57606a; }
  .live-val { color: #24292f; font-family: 'JetBrains Mono', monospace; font-size: .72rem; margin-top: .3rem; font-weight: 600; }
  
  .right-panel { display: flex; flex-direction: column; overflow: hidden; background: #ffffff; }
  .trace-header { padding: .75rem 1.25rem; border-bottom: 1px solid #d0d7de; display: flex; align-items: center; gap: .75rem; background: #f6f8fa; }
  .trace-header h2 { font-size: .78rem; font-weight: 600; color: #57606a; text-transform: uppercase; letter-spacing: .08em; margin: 0; }
  .run-btn { margin-left: auto; background: #ffffff; border: 1px solid #d0d7de; color: #57606a; border-radius: 10px; padding: .3rem .7rem; font-size: .75rem; cursor: pointer; font-weight: 500; }
  .run-btn:hover { border-color: #1a7f37; color: #1a7f37; background: #f6f8fa; }
  .trace-area { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: .6rem; background: #ffffff; }
  
  .step { display: flex; gap: .75rem; opacity: 1; }
  .step-line { display: flex; flex-direction: column; align-items: center; }
  .step-dot { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #d0d7de; display: flex; align-items: center; justify-content: center; font-size: .7rem; font-weight: bold; }
  
  .step-dot-agent { border-color: #9a6700; color: #9a6700; background: rgba(154,103,0,0.06); }
  .step-dot-weather { border-color: #1a7f37; color: #1a7f37; background: rgba(26,127,55,0.06); }
  .step-dot-calc { border-color: #8250df; color: #8250df; background: rgba(130,80,223,0.06); }
  .step-dot-kb { border-color: #bc4c00; color: #bc4c00; background: rgba(188,76,0,0.06); }
  
  .step-vline { flex: 1; width: 1px; background: #d0d7de; margin-top: 4px; min-height: 25px; }
  .step-content { flex: 1; padding-bottom: .5rem; }
  
  .agent-command { font-size: 0.72rem; font-weight: 700; color: #b07300; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .3rem; display: flex; align-items: center; gap: 0.4rem; }
  .agent-command::before { content: '⚙️ AGENT:'; color: #b07300; }
  
  .step-card { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 10px; padding: .7rem .9rem; font-size: .8rem; color: #24292f; }
  .thinking { font-family: 'JetBrains Mono', monospace; font-size: .72rem; color: #0969da; background: rgba(9,105,218,0.03); border-left: 2px solid #0969da; padding: .4rem .6rem; margin-top: .4rem; white-space: pre-wrap; }
  .token-stream { display: flex; flex-wrap: wrap; gap: 4px; margin-top: .4rem; }
  .token { background: #ffffff; border: 1px solid #d0d7de; border-radius: 4px; padding: 1px 5px; font-family: 'JetBrains Mono', monospace; font-size: .68rem; color: #0969da; font-weight: 500; }
  
  .tool-call { display: flex; align-items: flex-start; gap: .5rem; background: rgba(26,127,55,.04); border: 1px solid rgba(26,127,55,.15); border-radius: 8px; padding: .5rem .7rem; margin-top: .4rem; font-family: 'JetBrains Mono', monospace; font-size: .72rem; }
  .tool-call.calc { background: rgba(130,80,223,.04); border-color: rgba(130,80,223,.15); }
  .tool-call.kb { background: rgba(188,76,0,.04); border-color: rgba(188,76,0,.15); }
  .tool-name.weather { color: #1a7f37; font-weight:700; }
  .tool-name.calc { color: #8250df; font-weight:700; }
  .tool-name.kb { color: #bc4c00; font-weight:700; }
  
  .result-box { margin-top: .5rem; background: #ffffff; border: 1px solid #d0d7de; border-radius: 6px; padding: .5rem .7rem; font-family: 'JetBrains Mono', monospace; font-size: .72rem; color: #1a7f37; font-weight: 600; }
  .result-box.calc { color: #8250df; }
  .result-box.kb { color: #bc4c00; }
  .answer-final { background: rgba(9,105,218,.03); border: 1px solid rgba(9,105,218,.15); border-radius: 8px; padding: .65rem .85rem; font-size: .83rem; color: #24292f; }
  
  .legend { padding: .75rem 1.25rem; border-top: 1px solid #d0d7de; display: flex; gap: 1.25rem; flex-wrap: wrap; background: #f6f8fa; font-size: .7rem; color: #57606a; }
  .leg-item { display: flex; align-items: center; gap: .3rem; font-weight: 500; }
  .leg-dot { width: 8px; height: 8px; border-radius: 50%; }
  .idle-msg { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #57606a; text-align: center; padding: 2rem; }
  .idle-msg .big { font-size: 2.5rem; }
`;

/* ================================================================
   SZENARIEN DATENSTRUKTUR
================================================================ */
const SCENARIOS = {
  weather: {
    steps: [
      { type: 'user', content: 'Wie ist das Wetter in Berlin und wie warm in °F?' },
      { 
        type: 'llm', 
        agentCmd: 'Agent fragt das Sprachmodell nach dem nächsten logischen Schritt', 
        label: 'Musterbasierte Textgenerierung', 
        thinking: 'Aus Prompt-Kontext abgeleitete Struktur:\n- Kontext-Lücke: Echtzeitdaten für Berlin fehlen.\n- Vorschlag der Textvervollständigung: Werkzeug get_weather aufrufen.', 
        tokens: ['Aktion:', 'Abruf', 'get_weather', 'Parameter:', 'city="Berlin"'], 
        liveVal: 'Hole LLM-Vorschlag ein…' 
      },
      { 
        type: 'weather', 
        agentCmd: 'Agent wertet Textstruktur aus und führt die API-Aktion autonom durch', 
        label: 'Tool-Schnittstelle: Wetter-API', 
        toolName: 'get_weather', 
        toolClass: 'weather', 
        args: 'city="Berlin"', 
        result: 'Temp: 17 °C | Bedingung: Leicht bewölkt | Luftfeuchtigkeit: 62%', 
        liveVal: 'Führe API-Call aus…' 
      },
      { 
        type: 'llm', 
        agentCmd: 'Agent spiegelt API-Ergebnisse zurück in das Kontextfenster und bittet um Synthese', 
        label: 'Musterbasierte Textgenerierung', 
        thinking: 'Aus Prompt-Kontext abgeleitete Struktur:\n- API-Daten liegen im Kontext vor (17 °C).\n- Wahrscheinlichkeitsmuster verknüpft Fahrenheit-Formel: (17 × 9/5) + 32 = 62,6 °F.\n- Erzeuge finalen Fließtext.', 
        tokens: ['Synthese:', 'In', 'Berlin', 'beträgt', 'die', 'Temperatur', '17°C', 'bzw.', '62,6°F.'], 
        liveVal: 'Hole LLM-Vorschlag ein…' 
      },
      { 
        type: 'answer', 
        agentCmd: 'Agent nimmt den finalen Text entgegen, beendet die Schleife und gibt die Antwort aus', 
        label: 'Ausgabe des Endresultats', 
        content: '🌤 In <strong>Berlin</strong> wird aktuell eine Temperatur von <strong>17 °C</strong> (= <strong>62,6 °F</strong>) gemessen. Die Bedingung ist leicht bewölkt bei einer Luftfeuchtigkeit von 62 %.' 
      }
    ]
  },
  calc: {
    steps: [
      { type: 'user', content: 'Berechnung von 1.250 € × 12 Monate abzüglich 15% Großkunden-Rabatt.' },
      { 
        type: 'llm', 
        agentCmd: 'Agent fragt das Sprachmodell nach der passenden Lösungsstrategie', 
        label: 'Musterbasierte Textgenerierung', 
        thinking: 'Aus Prompt-Kontext abgeleitete Struktur:\n- Mathematischer Text erkannt.\n- Statistische Trefferquote für Arithmetik ist fehleranfällig.\n- Vorschlag der Textvervollständigung: Rechner-Tool nutzen.', 
        tokens: ['Aktion:', 'calculate', 'Ausdruck:', '"(1250 * 12) * 0.85"'], 
        liveVal: 'Hole LLM-Vorschlag ein…' 
      },
      { 
        type: 'calc', 
        agentCmd: 'Agent liest Textstruktur aus und delegiert die Rechenoperation an das Tool', 
        label: 'Tool-Schnittstelle: Kalkulator', 
        toolName: 'calculate', 
        toolClass: 'calc', 
        args: 'expression="(1250 * 12) * 0.85"', 
        result: '(1250 × 12) = 15.000 € ➔ abzüglich 15% Rabatt (× 0,85) = 12.750,00 €', 
        liveVal: 'Führe Berechnung aus…' 
      },
      { 
        type: 'llm', 
        agentCmd: 'Agent bettet das mathematisch exakte Ergebnis in den Prompt ein', 
        label: 'Musterbasierte Textgenerierung', 
        thinking: 'Aus Prompt-Kontext abgeleitete Struktur:\n- Verifizierter Wert liegt im Kontext vor (12.750,00 €).\n- Erzeuge verständlichen Antwortsatz.', 
        tokens: ['Ergebnis:', 'Der', 'Netto-Jahresbetrag', 'nach', 'Abzug', 'beträgt', '12.750,00', 'Euro.'], 
        liveVal: 'Hole LLM-Vorschlag ein…' 
      },
      { 
        type: 'answer', 
        agentCmd: 'Agent schließt die Kontrollschleife und gibt den Text aus', 
        label: 'Ausgabe des Endresultats', 
        content: '💶 Der Jahresbetrag vor Rabatt beläuft sich auf <strong>15.000 €</strong> (1.250 € × 12 Monate). Nach Abzug von 15 % Großkunden-Rabatt ergibt sich ein finaler Betrag von <strong>12.750,00 €</strong>.' 
      }
    ]
  },
  knowledge: {
    steps: [
      { type: 'user', content: 'Welche Datenschutzrichtlinien gelten für firmeninterne KI-Modelle laut Handbuch?' },
      { 
        type: 'llm', 
        agentCmd: 'Agent fragt Sprachmodell nach benötigtem Kontext (Iterativer Aufruf #1)', 
        label: 'Musterbasierte Textgenerierung', 
        thinking: 'Aus Prompt-Kontext abgeleitete Struktur:\n- Interne Firmenklausel abgefragt. Nicht in allgemeinen Trainingsdaten vorhanden.\n- Vorschlag der Textvervollständigung: Lokalen Dokumenten-Index durchsuchen.', 
        tokens: ['Aktion:', 'query_knowledge_base', 'Query:', '"Datenschutz KI Modelle"'], 
        liveVal: 'Hole LLM-Vorschlag ein…' 
      },
      { 
        type: 'kb', 
        agentCmd: 'Agent triggert die semantische Suche (RAG) im lokalen Dokumenten-Speicher', 
        label: 'Tool-Schnittstelle: Wissensbasis', 
        toolName: 'query_knowledge_base', 
        toolClass: 'kb', 
        args: 'topic="Datenschutz KI"', 
        result: 'Dokument Ref-412: Lokales Hosting zwingend erforderlich. Keine Datenübertragung an Dritte.', 
        liveVal: 'Durchsuche Datenbank…' 
      },
      { 
        type: 'llm', 
        agentCmd: 'Agent spiegelt Teil-Ergebnis zurück und holt Bewertung ein (Iterativer Aufruf #2)', 
        label: 'Musterbasierte Textgenerierung', 
        thinking: 'Aus Prompt-Kontext abgeleitete Struktur:\n- Dokument Ref-412 liefert Hosting-Regeln. Es fehlen Angaben zu Fristen.\n- Vorschlag der Textvervollständigung: Folge-Abruf für Speicherfristen starten.', 
        tokens: ['Aktion:', 'query_knowledge_base', 'Query:', '"Speicherfrist Prompts"'], 
        liveVal: 'Hole LLM-Vorschlag ein…' 
      },
      { 
        type: 'kb', 
        agentCmd: 'Agent führt den zweiten, präzisierten Datenbank-Abruf aus', 
        label: 'Tool-Schnittstelle: Wissensbasis', 
        toolName: 'query_knowledge_base', 
        toolClass: 'kb', 
        args: 'topic="Speicherfrist Prompts"', 
        result: 'Zusatzklausel Handbuch S. 12: Eingegebene Prompts werden nach maximal 30 Tagen gelöscht.', 
        liveVal: 'Durchsuche Datenbank…' 
      },
      { 
        type: 'llm', 
        agentCmd: 'Agent führt alle Fragmente im Kontextfenster zusammen (Iterativer Aufruf #3)', 
        label: 'Musterbasierte Textgenerierung', 
        thinking: 'Aus Prompt-Kontext abgeleitete Struktur:\n- Alle notwendigen Fakten (Hosting + Fristen) liegen validiert vor.\n- Synthetisiere finale Zusammenfassung.', 
        tokens: ['Synthese:', 'Lokales', 'Hosting', 'und', 'Löschung', 'nach', '30', 'Tagen', 'vorgeschrieben.'], 
        liveVal: 'Hole LLM-Vorschlag ein…' 
      },
      { 
        type: 'answer', 
        agentCmd: 'Agent bricht die Iteration ab und gibt die generierte Antwort aus', 
        label: 'Ausgabe des Endresultats', 
        content: '📚 Gemäß dem internen Mitarbeiterhandbuch (Referenz <strong>Ref-412</strong>) gelten folgende Kernvorgaben:<br><br>1. <strong>Lokales Hosting</strong>: Sämtliche Modelle müssen auf firmeneigener Infrastruktur betrieben werden.<br>2. <strong>Speicherfristen</strong>: Eingegebene Prompts werden nach maximal 30 Tagen automatisiert gelöscht.' 
      }
    ]
  }
};

let simState = {
  running: false, currentScenario: null, stepIndex: 0, subStep: 0, tokenIndex: 0, timer: 0, traceArea: null
};

function setup() {
  noCanvas();
  createElement('link').attribute('rel', 'preconnect').attribute('href', 'https://fonts.googleapis.com');
  createElement('link').attribute('rel', 'stylesheet').attribute('href', 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  createElement('style', styleSheet);
  buildDOM();
}

function draw() {
  if (!simState.running) return;

  if (millis() > simState.timer) {
    let scenario = SCENARIOS[simState.currentScenario];
    let step = scenario.steps[simState.stepIndex];

    if (step.type === 'user') {
      appendUserStep(step);
      advanceStep(scenario);
    } 
    else if (step.type === 'llm') {
      if (simState.subStep === 0) {
        initLLMStep(step);
      } else if (simState.subStep === 1) {
        streamNextToken(step, scenario);
      }
    } 
    else if (['weather', 'calc', 'kb'].includes(step.type)) {
      if (simState.subStep === 0) {
        initToolStep(step);
      } else if (simState.subStep === 1) {
        finalizeToolStep(step);
        advanceStep(scenario);
      }
    } 
    else if (step.type === 'answer') {
      appendAnswerStep(step);
      endSimulation();
    }
  }
}

function buildDOM() {
  let app = createDiv().class('app-container');
  let header = createElement('header').parent(app);
  let headerDiv = createDiv().parent(header);
  createElement('h1', '🤖 KI-Agenten-Architektur – Interaktive Visualisierung').parent(headerDiv);
  createElement('p', 'Didaktischer Fokus: Der Agent steuert den Ablauf. Das Sprachmodell erzeugt Textbausteine auf Basis statistischer Wahrscheinlichkeiten.').parent(headerDiv);
  
  createSpan('Steuerungsebene (Agent)').class('badge badge-green').parent(header);
  createSpan('Statistische Generierung (LLM)').class('badge badge-blue').parent(header);

  let main = createDiv().class('main-layout').parent(app);
  
  let left = createDiv().class('left-panel').parent(main);
  let qBox = createDiv().class('query-box').parent(left);
  createElement('label', 'Szenario-Auswahl').parent(qBox);
  let pBtns = createDiv().class('preset-buttons').id('presets').parent(qBox);
  
  createBtn('🌤 Wetter-Szenario (Linearer Ablauf)', 'weather', pBtns);
  createBtn('🔢 Rechner-Szenario (Mathematisch neutral)', 'calc', pBtns);
  createBtn('📚 Wissensbasis-Szenario (mehrstufig)', 'knowledge', pBtns);

  let arch = createDiv().class('arch-panel').parent(left);
  createElement('h2', 'Architektur-Komponenten').parent(arch);
  buildComponentCard('llm', '🧠', 'LLM (Sprachmodell)', 'Wird vom Agenten abgefragt', 'Besitzt keine eigene Handlungslogik. Erzeugt Textbausteine auf Basis statistischer Wahrscheinlichkeiten (Token-Prädiktor).', arch);
  buildComponentCard('weather', '🌤', 'Tool: Wetter-API', 'Wird vom Agenten ausgeführt', 'Liefert dem System verifizierte Echtzeit-Wetterdaten der Außenwelt.', arch);
  buildComponentCard('calc', '🔢', 'Tool: Kalkulator', 'Wird vom Agenten ausgeführt', 'Führt mathematisch exakte Operationen aus, um Rechenfehler des LLMs zu verhindern.', arch);
  buildComponentCard('kb', '📚', 'Wissensbasis (RAG)', 'Wird vom Agenten durchsucht', 'Ermöglicht den gezielten Abruf interner Dokumentenfragmente.', arch);

  let right = createDiv().class('right-panel').parent(main);
  let tHeader = createDiv().class('trace-header').parent(right);
  createElement('h2', 'Agenten-Protokoll (Kontrollfluss)').parent(tHeader);
  createSpan('').id('run-status').parent(tHeader);
  
  let rBtn = createButton('↺ Zurücksetzen').class('run-btn').parent(tHeader);
  rBtn.mousePressed(resetAll);

  simState.traceArea = createDiv().class('trace-area').id('trace').parent(right);
  resetAll();

  let legend = createDiv().class('legend').parent(right);
  buildLegendItem('#9a6700', 'Aktion der Steuerungsebene (Agent)', legend);
  buildLegendItem('#0969da', 'Statistischer Vorschlag (LLM)', legend);
  buildLegendItem('#1a7f37', 'Resultat der Werkzeug-Ausführung', legend);
}

function buildComponentCard(id, icon, title, sub, body, parent) {
  let comp = createDiv().class('component').id('comp-' + id).parent(parent);
  let header = createDiv().class('comp-header').parent(comp);
  createSpan(icon).class('comp-icon').parent(header);
  let textDiv = createDiv().parent(header);
  createDiv(title).class('comp-title').parent(textDiv);
  createDiv(sub).class('comp-sub').parent(textDiv);
  createDiv().class('comp-status').id('status-' + id).parent(header);
  let bodyDiv = createDiv(body).class('comp-body').parent(comp);
  createDiv('–').class('live-val').id('live-' + id).parent(bodyDiv);
}

function buildLegendItem(color, label, parent) {
  let item = createDiv().class('leg-item').parent(parent);
  createDiv().class('leg-dot').style('background', color).parent(item);
  createSpan(label).parent(item);
}

function createBtn(txt, id, parent) {
  let b = createButton(txt).class('preset-btn').parent(parent);
  b.attribute('data-id', id);
  b.mousePressed(() => selectPreset(id, b));
}

function selectPreset(id, btn) {
  if (simState.running) return;
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  btn.class('preset-btn active');
  simState.traceArea.html('');
  clearAllActiveVisuals();
  
  simState.currentScenario = id;
  simState.running = true;
  simState.stepIndex = 0;
  simState.subStep = 0;
  simState.timer = millis() + 100;
  select('#run-status').html('⏳ Ausführung läuft…');
  toggleButtons(true);
}

function toggleButtons(disabled) {
  document.querySelectorAll('.preset-btn').forEach(b => b.disabled = disabled);
}

function advanceStep(scenario) {
  simState.stepIndex++;
  simState.subStep = 0;
  simState.timer = millis() + 1000;
  simState.traceArea.elt.scrollTop = simState.traceArea.elt.scrollHeight;
}

function endSimulation() {
  simState.running = false;
  clearAllActiveVisuals();
  select('#run-status').html('✓ Bereit');
  toggleButtons(false);
}

function resetAll() {
  simState.running = false;
  simState.currentScenario = null;
  simState.stepIndex = 0;
  simState.subStep = 0;
  clearAllActiveVisuals();
  toggleButtons(false);
  simState.traceArea.html(`
    <div class="idle-msg" id="idle-msg">
      <div class="big">⚙️</div>
      <p>Warten auf Aktivierung eines Szenarios. Der Agent übernimmt anschließend die schrittweise Kontrolle über alle Komponenten.</p>
    </div>
  `);
  select('#run-status').html('');
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
}

function setComponentVisualState(id, activeClass) {
  let target = id === 'kb' ? 'kb' : (id === 'weather' ? 'weather' : (id === 'calc' ? 'calc' : 'llm'));
  let comp = select('#comp-' + target);
  let status = select('#status-' + target);
  if (!comp || !status) return;
  ['llm','weather','calc','kb'].forEach(c => {
    comp.removeClass('active-' + c);
    status.removeClass('active-' + c);
  });
  if (activeClass) {
    comp.addClass('active-' + activeClass);
    status.addClass('active-' + activeClass);
  }
}

function clearAllActiveVisuals() {
  ['llm','weather','calc','kb'].forEach(id => {
    setComponentVisualState(id, null);
    select('#live-' + id).html('–');
  });
}

function appendUserStep(step) {
  let html = `
    <div class="step-line"><div class="step-dot step-dot-agent">▶</div><div class="step-vline"></div></div>
    <div class="step-content">
      <div class="agent-command">Eingabe registriert – Kontrollschleife initialisiert</div>
      <div class="step-card"><span style="color:#57606a">Anweisung an das System:</span> ${step.content}</div>
    </div>`;
  createDiv(html).class('step').parent(simState.traceArea);
}

function initLLMStep(step) {
  setComponentVisualState('llm', 'llm');
  select('#live-llm').html(step.liveVal);

  let id = 'ts-' + millis();
  let html = `
    <div class="step-line"><div class="step-dot step-dot-agent">⚙️</div><div class="step-vline"></div></div>
    <div class="step-content">
      <div class="agent-command">${step.agentCmd}</div>
      <div class="step-card">
        <div style="font-size:0.68rem; text-transform:uppercase; color:#0969da; font-weight:bold; margin-bottom:4px;">📥 Vom Sprachmodell extrahierte Struktur:</div>
        <div class="thinking">${step.thinking}</div>
        <div class="token-stream" id="${id}"></div>
      </div>
    </div>`;
  createDiv(html).class('step').parent(simState.traceArea);
  
  simState.subStep = 1;
  simState.tokenIndex = 0;
  simState.timer = millis() + 300;
  simState.traceArea.elt.scrollTop = simState.traceArea.elt.scrollHeight;
}

function streamNextToken(step, scenario) {
  let streams = document.getElementsByClassName('token-stream');
  if (streams.length > 0) {
    let currentStream = streams[streams.length - 1];
    let span = document.createElement('span');
    span.className = 'token';
    span.textContent = step.tokens[simState.tokenIndex];
    currentStream.appendChild(span);
  }

  simState.tokenIndex++;
  if (simState.tokenIndex >= step.tokens.length) {
    simState.subStep = 2;
    simState.timer = millis() + 200;
    setComponentVisualState('llm', null);
    select('#live-llm').html('–');
    advanceStep(scenario);
  } else {
    simState.timer = millis() + 60;
  }
}

function initToolStep(step) {
  setComponentVisualState(step.type, step.type);
  select('#live-' + step.type).html(step.liveVal);

  let html = `
    <div class="step-line"><div class="step-dot step-dot-${step.type}">⚙️</div><div class="step-vline"></div></div>
    <div class="step-content">
      <div class="agent-command">${step.agentCmd}</div>
      <div class="step-card">
        <div style="font-size:0.68rem; text-transform:uppercase; color:#1a7f37; font-weight:bold; margin-bottom:4px;">💻 Externe Funktionsausführung:</div>
        <div class="tool-call ${step.toolClass}">
          <div><span class="tool-name ${step.toolClass}">${step.toolName}</span>(<span class="tool-args">${step.args}</span>)</div>
        </div>
        <div class="res-container"></div>
      </div>
    </div>`;
  createDiv(html).class('step').parent(simState.traceArea);

  simState.subStep = 1;
  simState.timer = millis() + (step.delay || 600);
  simState.traceArea.elt.scrollTop = simState.traceArea.elt.scrollHeight;
}

function finalizeToolStep(step) {
  let containers = document.getElementsByClassName('res-container');
  if (containers.length > 0) {
    let currentContainer = containers[containers.length - 1];
    let resDiv = document.createElement('div');
    resDiv.className = `result-box ${step.type}`;
    resDiv.innerHTML = `⚙️ Agent verbucht API-Antwort: ${step.result}`;
    currentContainer.appendChild(resDiv);
  }
  select('#live-' + step.type).html(step.result.substring(0, 40) + '…');
  setComponentVisualState(step.type, null);
}

function appendAnswerStep(step) {
  let html = `
    <div class="step-line"><div class="step-dot step-dot-agent">■</div></div>
    <div class="step-content">
      <div class="agent-command">${step.agentCmd}</div>
      <div class="step-card"><div class="answer-final">${step.content}</div></div>
    </div>`;
  createDiv(html).class('step').parent(simState.traceArea);
  simState.traceArea.elt.scrollTop = simState.traceArea.elt.scrollHeight;
}