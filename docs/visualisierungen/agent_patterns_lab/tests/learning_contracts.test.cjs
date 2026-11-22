// Ausführen: node tests/learning_contracts.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = {window: {AgentLab: {}}, performance};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/pmo_learning.js'), 'utf8'), context);
const learning = context.window.AgentLab.pmo_learning;
let passed = 0;
async function test(name, run) { await run(); console.log('PASS', name); passed++; }
function engine(mode = 'mock-strong', override) {
  const calls = [];
  return {mode, calls, isSmallMock() {return this.mode === 'mock-small';}, async callLLM(options) {
    calls.push(options);
    const value = override ? override(options, calls) : (mode === 'mock-small' ? options.mockSmallFn() : options.mockStrongFn());
    return {text: typeof value === 'string' ? value : value.text, tokens: 10, source: mode, simulated: true, tokensEstimated: true};
  }};
}
function storage() { const map = new Map(); return {getItem(key) {return map.get(key) ?? null;}, setItem(key, value) {map.set(key, value);}, removeItem(key) {map.delete(key);}}; }
function to_approval() {let state = learning.new_state('review'); for (let i=0;i<3;i++) state = learning.transition(state, 'step'); return state;}

(async () => {
  for (const item of learning.pmo_cases) {
    for (const variant of learning.eval_variants) {
      await test(`Vergleich ${item.id}/${variant.id}: identische Aufgabe, fester Prüfer`, async () => {
        const backend = engine();
        const result = await learning.run_eval(item, variant.id, 'Gemeinsame Anweisung', backend);
        assert.equal(result.score.passed, 5);
        const input = JSON.parse(backend.calls[0].userPrompt);
        assert.equal(input.query, item.query);
        assert.equal(input.instructions, 'Gemeinsame Anweisung');
        assert.equal(result.simulated, true);
        assert.equal(result.tools, 1);
        assert.ok(result.calls <= (variant.id === 'team' ? 5 : 3));
        for (const call of backend.calls) assert.ok(!Object.hasOwn(JSON.parse(call.userPrompt), 'expected_facts'));
      });
    }
  }
  await test('Vorab festgelegter Mock-Belegfehler und begrenzte Überarbeitung', async () => {
    const item = learning.case_by_id('status');
    const chain = await learning.run_eval(item, 'chaining', '', engine('mock-small'));
    const team = await learning.run_eval(item, 'team', '', engine('mock-small'));
    assert.equal(chain.score.checks.evidence, false);
    assert.equal(team.score.passed, 5); assert.equal(team.calls, 4);
  });
  await test('Falsche Fakten, Zitate und Freigaben bestehen nicht alle Checks', () => {
    const item = learning.case_by_id('status');
    const result = learning.expected_result(item);
    result.facts[0].value = '99'; result.facts[0].quote = 'Ausgedacht'; result.blocked = true;
    const score = learning.score_result(item, result);
    assert.equal(score.checks.facts, false); assert.equal(score.checks.evidence, false); assert.equal(score.checks.blocking, false);
    assert.equal(learning.score_result(item, null).passed, 0);
  });
  await test('ReAct: ungültige Aktionen enden am Schrittbudget', async () => {
    for (const action of ['{"action":"delete_sources"}', 'null', '"Text statt Aktion"']) {
      const backend = engine('mock-strong', () => action);
      const result = await learning.run_eval(learning.case_by_id('status'), 'react', '', backend);
      assert.equal(result.calls, 3); assert.equal(result.score.passed, 0); assert.equal(result.tools, 0);
    }
  });
  await test('Team: negatives und ungültiges Modellreview wird sichtbar', async () => {
    for (const answer of ['{"quality":"revise","feedback":"Negativ"}', 'unlesbar']) {
      const backend = engine('mock-strong', (options) => options.systemPrompt.startsWith('Review') ? answer : options.mockStrongFn());
      const result = await learning.run_eval(learning.case_by_id('status'), 'team', '', backend);
      assert.equal(result.review_status, 'revise'); assert.equal(result.calls, 5);
      const review = backend.calls.find(call => call.systemPrompt.startsWith('Review'));
      assert.equal(JSON.parse(review.userPrompt).sources['DOC-101'], learning.case_by_id('status').sources['DOC-101']);
    }
  });
  await test('State: Freigabepause ist ein tatsächlicher Haltepunkt', () => {
    const state = to_approval();
    assert.equal(state.phase, 'approval'); assert.equal(state.approved, false);
    assert.throws(() => learning.transition(state, 'step'), /Freigabe/);
    assert.throws(() => learning.transition(learning.new_state('review'), 'approve'), /geprüfte/);
    const approved = learning.transition(state, 'approve');
    const done = learning.transition(approved, 'step');
    assert.equal(done.phase, 'finished'); assert.match(done.output, /Simulierte/);
    assert.throws(() => learning.transition(done, 'step'), /beendet/);
    assert.equal(state.phase, 'approval');
  });
  await test('State: Bearbeitung hebt Prüfung auf; zwei Ablehnungen sperren', () => {
    let state = to_approval();
    state = learning.transition(state, 'edit', 'Ein erfundener Termin [DOC-201].');
    assert.equal(state.blocked, true); assert.equal(state.phase, 'review');
    state = learning.transition(state, 'step'); assert.equal(state.phase, 'write');
    state = learning.transition(state, 'step'); state = learning.transition(state, 'step');
    state = learning.transition(state, 'reject'); assert.equal(state.phase, 'blocked');
    assert.equal(state.approved, false);
  });
  await test('State: Belegfehler wird korrigiert, fehlende Information bleibt gesperrt', () => {
    let state = learning.new_state('review', true);
    for (let i=0;i<3;i++) state = learning.transition(state, 'step');
    assert.equal(state.phase, 'write');
    state = learning.transition(state, 'step'); state = learning.transition(state, 'step');
    assert.equal(state.attempts, 2); assert.equal(state.phase, 'approval');
    let missing = learning.new_state('missing');
    for (let i=0;i<3;i++) missing = learning.transition(missing, 'step');
    assert.equal(missing.phase, 'blocked');
  });
  await test('Checkpoint: Speichern, Wiederherstellen und Session-Isolation', () => {
    const memory = storage(); const state = to_approval();
    const saved = learning.save_checkpoint(memory, 'session_a', state);
    const changed = learning.transition(state, 'reject');
    assert.equal(changed.phase, 'write');
    const loaded = learning.load_checkpoint(memory, 'session_a');
    assert.deepEqual(loaded, saved); assert.equal(loaded.state.phase, 'approval');
    assert.equal(loaded.state.approved, false);
    assert.throws(() => learning.load_checkpoint(memory, 'session_b'), /Kein Checkpoint/);
    assert.throws(() => learning.save_checkpoint(memory, '../bad', state), /Session-ID/);
    memory.setItem(learning.checkpoint_key('broken'), '{');
    assert.throws(() => learning.load_checkpoint(memory, 'broken'), /nicht lesbar/);
  });
  await test('Checkpoint: Manipulierte Quellen und Freigaben werden verworfen', () => {
    const memory = storage(); let state = to_approval();
    state.sources['DOC-201'] = 'Manipuliert';
    assert.throws(() => learning.save_checkpoint(memory, 'a', state), /Ungültiger/);
    state = to_approval(); state.phase = 'execute';
    assert.throws(() => learning.save_checkpoint(memory, 'a', state), /keine Freigabe/);
  });
  await test('Checkpoint: Speicherfehler bleibt ein Fehler', () => {
    assert.throws(() => learning.save_checkpoint({setItem() {throw new Error('Speicher voll');}}, 'a', to_approval()), /Speicher voll/);
  });
  console.log(`${passed} Lernansichten-Prüfungen bestanden.`);
})().catch(error => {console.error(error); process.exitCode = 1;});
