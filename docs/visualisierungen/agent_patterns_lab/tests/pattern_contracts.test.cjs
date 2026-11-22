// Ausführen: node tests/pattern_contracts.test.cjs (keine Pakete oder Modell-Downloads).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = { window: {}, performance, console, setTimeout(callback) { callback(); return 0; } };
vm.createContext(context);
for (const name of ['domains.js', 'engine.js', 'patterns.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', name), 'utf8'), context, { filename: name });
}
const lab = context.window.AgentLab;
const controller = Object.create(lab.PatternsController.prototype);
let passed = 0;

function createContext(respond, decide = () => ({ approved: false, feedback: 'Überarbeiten.' })) {
  const calls = [], nodes = [], tools = [], decisions = [];
  return {
    calls, nodes, tools, decisions,
    node(...args) { nodes.push(args); }, log() {}, tool(...args) { tools.push(args); },
    async llm(options) { calls.push(options); return { text: respond(options, calls), tokens: 1 }; },
    async waitForHuman(draft, precheck, options) {
      decisions.push({ draft, precheck, ...options });
      return decide(decisions.length, draft);
    }
  };
}

function briefingResponse(quality, malformed = false, citations = true) {
  return (options) => {
    if (options.systemPrompt.startsWith('Extract')) return 'Notizen [DOC-101] [DOC-102]';
    if (options.systemPrompt.startsWith('Write')) return citations ? 'Entwurf [DOC-101] [DOC-102]' : 'Entwurf ohne IDs';
    const input = JSON.parse(options.userPrompt);
    assert.equal(input.sources['DOC-101'], lab.DOMAINS.pmo.sources['DOC-101']);
    assert.equal(input.sources['DOC-102'], lab.DOMAINS.pmo.sources['DOC-102']);
    assert.equal(input.query, lab.DOMAINS.pmo.query);
    return malformed ? 'ACCEPTED (kein JSON)' : JSON.stringify({ quality, feedback: 'Konkretes Review-Feedback.' });
  };
}

async function test(name, run) {
  await run(); passed++; console.log('PASS', name);
}

(async () => {
  for (const text of [
    'The final payout for Claim CLM001 is **19,500 EUR**.',
    'Auszahlung: 19.500 €.', 'Auszahlung: 19500 EUR.',
    'Payout: 19,500.00 EUR.', 'Auszahlung: 19.500,00 €.', 'Auszahlung: 19\u202f500 €.'
  ]) {
    await test(`Augmented: Zahlenformat erkannt: ${text}`, async () => {
      const result = await controller.executePatternLogic('augmented', createContext(() => text));
      assert.equal(result.status, 'pass');
    });
  }
  for (const text of ['119,500 EUR', '195,000 EUR', '19500.99 EUR', '19.50 EUR', 'CLM19500']) {
    await test(`Augmented: falscher Betrag abgelehnt: ${text}`, async () => {
      const result = await controller.executePatternLogic('augmented', createContext(() => text));
      assert.equal(result.status, 'fail');
    });
  }
  for (const [quality, expected, count] of [['accepted', 'pass', 3], ['revise', 'warn', 5]]) {
    await test(`Briefing: ${quality} steuert den Abschluss`, async () => {
      const ctx = createContext(briefingResponse(quality));
      const result = await controller.executePatternLogic('briefing_team', ctx);
      assert.equal(result.status, expected); assert.equal(ctx.calls.length, count);
      assert.match(result.html, quality === 'accepted' ? /blocked=false/ : /blocked=true/);
      if (quality === 'revise') assert.match(ctx.calls[3].userPrompt, /Konkretes Review-Feedback/);
    });
  }
  await test('Briefing: ungültiges Review wird nicht akzeptiert', async () => {
    const result = await controller.executePatternLogic('briefing_team', createContext(briefingResponse('accepted', true)));
    assert.equal(result.status, 'warn'); assert.match(result.html, /blocked=true/);
  });
  await test('Briefing: IDs fehlen, Reviewer wird nicht aufgerufen', async () => {
    const ctx = createContext(briefingResponse('accepted', false, false));
    const result = await controller.executePatternLogic('briefing_team', ctx);
    assert.equal(ctx.calls.length, 3); assert.equal(result.status, 'warn');
  });
  await test('HITL: zweiter Entwurf benötigt eine eigene Freigabe', async () => {
    const ctx = createContext((options) => options.systemPrompt.startsWith('Draft') ? 'Betrugsscore 0.84' : 'Ihr Fall wird geprüft.',
      (round) => ({ approved: round === 2, feedback: 'Vertrauliches entfernen.' }));
    const result = await controller.executePatternLogic('hitl', ctx);
    assert.equal(ctx.decisions.length, 2); assert.equal(ctx.decisions[0].allowApproval, false);
    assert.equal(ctx.decisions[1].allowApproval, true); assert.equal(result.status, 'pass');
    assert.match(result.statusLabel, /simuliert/); assert.match(ctx.calls[1].userPrompt, /Vertrauliches entfernen/);
  });
  await test('HITL: Zustimmung kann Policy-Verstoß nicht übergehen', async () => {
    const ctx = createContext(() => 'Interner Betrugsscore 0.84', () => ({ approved: true }));
    const result = await controller.executePatternLogic('hitl', ctx);
    assert.equal(result.status, 'fail'); assert.ok(!ctx.nodes.some(([id, state]) => id === 'send' && state === 'pass'));
  });
  await test('HITL: wiederholte Ablehnung stoppt ohne Versand', async () => {
    const ctx = createContext(() => 'Sauberer Entwurf.');
    const result = await controller.executePatternLogic('hitl', ctx);
    assert.equal(ctx.decisions.length, 3); assert.equal(result.status, 'warn');
    assert.ok(!ctx.nodes.some(([id, state]) => id === 'send' && state === 'pass'));
  });
  await test('HITL: Sammellauf erfindet keine menschliche Freigabe', async () => {
    const ctx = createContext(() => 'Entwurf', () => ({ approved: false, skipped: true }));
    const result = await controller.executePatternLogic('hitl', ctx);
    assert.match(result.statusLabel, /ausstehend/); assert.equal(ctx.calls.length, 1);
  });
  for (const selected of [['reg'], ['tox', 'reg']]) {
    await test(`Orchestrator: nur geplante Rollen ${selected.join(', ')}`, async () => {
      const tasks = selected.map(worker => ({ worker, task: `Auftrag für ${worker}` }));
      const ctx = createContext((options, calls) => calls.length === 1 ? JSON.stringify({ tasks }) : 'Fachbefund');
      const result = await controller.executePatternLogic('orchestrator', ctx);
      assert.equal(result.status, 'pass'); assert.equal(ctx.calls.length, selected.length + 2);
      assert.equal(ctx.tools.length, selected.length);
      assert.ok(!ctx.nodes.some(([id, state]) => id === 'chem' && state === 'active'));
      selected.forEach((id, i) => assert.equal(JSON.parse(ctx.calls[i+1].userPrompt).task, `Auftrag für ${id}`));
      const findings = JSON.parse(ctx.calls.at(-1).userPrompt);
      assert.deepEqual(findings.map(item => item.worker), selected);
    });
  }
  for (const plan of ['kein JSON', '{"tasks":[]}', '{"tasks":[{"worker":"unknown","task":"x"}]}', '{"tasks":[{"worker":"chem","task":"x"},{"worker":"chem","task":"y"}]}']) {
    await test('Orchestrator: ungültiger Plan startet keine Worker', async () => {
      const ctx = createContext(() => plan);
      const result = await controller.executePatternLogic('orchestrator', ctx);
      assert.equal(result.status, 'fail'); assert.equal(ctx.calls.length, 1); assert.equal(ctx.tools.length, 0);
    });
  }
  await test('Engine: Mock-Werte sind explizit simuliert', async () => {
    const result = await lab.engine.callLLM({ systemPrompt: 'x', userPrompt: 'y', mockSmallFn: () => ({ text: 'z', tokens: 12 }) });
    assert.equal(result.simulated, true); assert.equal(result.tokensEstimated, true);
  });
  await test('Engine: kein stiller Mock-Fallback im Live-Modus', async () => {
    lab.engine.setMode('webllm-1.5b');
    await assert.rejects(lab.engine.callLLM({}), /noch nicht geladen/);
    lab.engine.webllmEngine = { chat: { completions: { create: async () => ({ choices: [{ message: { content: 'Antwort' } }], usage: { total_tokens: 7 } }) } } };
    lab.engine.loadedModelId = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC';
    const result = await lab.engine.callLLM({ systemPrompt: 'x', userPrompt: 'y' });
    assert.equal(result.simulated, false); assert.equal(result.tokensEstimated, false); assert.equal(result.tokens, 7);
    lab.engine.setMode('webllm-3b');
    await assert.rejects(lab.engine.callLLM({}), /noch nicht geladen/);
  });
  await test('Engine: fehlende Live-Tokenzählung wird als Schätzung markiert', async () => {
    lab.engine.setMode('webllm-1.5b');
    lab.engine.webllmEngine.chat.completions.create = async () => ({ choices: [{ message: { content: 'Antwort' } }] });
    const result = await lab.engine.callLLM({ systemPrompt: 'x', userPrompt: 'y' });
    assert.equal(result.simulated, false); assert.equal(result.tokensEstimated, true);
  });
  console.log(`${passed} Prüfungen bestanden.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
