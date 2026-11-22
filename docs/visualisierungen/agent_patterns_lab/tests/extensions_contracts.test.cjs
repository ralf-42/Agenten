// Offline-Verträge: keine Modell-Downloads und keine externen Schreibaktionen.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sandbox = { window: {}, performance, console, setTimeout(fn) { fn(); }, navigator: {gpu:{}} };
vm.createContext(sandbox);
for (const name of ['domains.js','engine.js','patterns.js','pmo_learning.js','pattern_extensions.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js',name),'utf8'),sandbox,{filename:name});
}
const lab = sandbox.window.AgentLab;
const ext = lab.pattern_extensions;
let count = 0;
async function test(name, action) { await action(); count++; console.log('PASS',name); }
function context(override) {
  const calls = [], tools = [];
  return {calls,tools,log(){},node(){},tool(...args){tools.push(args);},async llm(opts){
    calls.push(opts);
    if (override) return {text:override(opts,calls.length),tokens:10,tokensEstimated:true};
    return lab.engine.callLLM(opts);
  }};
}
(async()=>{
  await test('Katalog: 15 Muster plus ein Kursbeispiel, eindeutige IDs',()=>{
    assert.equal(lab.PATTERNS.length,16);
    assert.equal(new Set(lab.PATTERNS.map(p=>p.id)).size,16);
    assert.equal(lab.PATTERNS.at(-2).id,'model_tiers');
    assert.equal(lab.PATTERNS.at(-1).id,'skills');
  });
  await test('Routing: offengelegte Bedarfsregel und Quellenstopp',()=>{
    assert.equal(ext.tier_decision(lab.pmo_learning.case_by_id('status')).tier,'small');
    assert.equal(ext.tier_decision(lab.pmo_learning.case_by_id('review')).tier,'strong');
    assert.equal(ext.tier_decision(lab.pmo_learning.case_by_id('missing')).tier,null);
  });
  await test('Routing: gleiche Fälle und Prompts, einmaliger Fallback, kein Gold im Prompt',async()=>{
    const ctx=context(); const result=await ext.run_tier_comparison(ctx);
    assert.equal(result.rows.length,9);
    assert.equal(result.rows.filter(row=>row.calls===0).length,3);
    assert.equal(result.rows.find(row=>row.strategy==='Regelbasiertes Routing' && row.case_id==='status').calls,2);
    assert.equal(result.rows.find(row=>row.strategy==='Regelbasiertes Routing' && row.case_id==='status').score.passed,5);
    const prompts=new Set(ctx.calls.map(call=>call.userPrompt));
    assert.equal(prompts.size,2);
    for(const prompt of prompts) {
      assert.ok(!prompt.includes('expected_facts') && !prompt.includes('example_answer'));
      assert.ok(JSON.parse(prompt).sources);
    }
  });
  await test('Routing: Budget je Strategie wird hart eingehalten',async()=>{
    const ctx=context(); const result=await ext.run_tier_comparison(ctx,{budget:1});
    assert.equal(ctx.calls.length,3);
    assert.equal(result.rows.filter(row=>row.status==='Budget erschöpft').length,3);
    for(const budget of [0,13,1.5,NaN]) await assert.rejects(ext.run_tier_comparison(context(),{budget}),/Aufrufbudget/);
  });
  for(const skill_id of ['briefing','budget']) {
    await test(`Skills ${skill_id}: gleicher Agent, drei Schritte, begrenzte Quellen`,async()=>{
      const ctx=context(); const result=await ext.run_skill(ctx,{skill_id});
      assert.equal(result.status,'pass'); assert.equal(ctx.calls.length,3); assert.equal(ctx.tools.length,1);
      assert.ok(ctx.calls.every(call=>call.systemPrompt.includes('single responsible PMO agent')));
      assert.ok(!ctx.calls[0].systemPrompt.includes('Ein Audit-Puffer'));
      const sources=JSON.parse(ctx.calls[2].userPrompt).sources;
      assert.equal(Object.keys(sources).length,skill_id==='budget'?1:2);
      assert.ok(!ctx.calls[2].userPrompt.includes('expected_facts'));
    });
  }
  await test('Skills: deaktiviertes Laden bindet kein Tool',async()=>{
    const ctx=context(); const result=await ext.run_skill(ctx,{allow_loading:false});
    assert.equal(result.status,'warn'); assert.equal(ctx.calls.length,1); assert.equal(ctx.tools.length,0);
  });
  await test('Skills: fremde Registry-Einträge werden abgelehnt',async()=>{
    const ctx=context(()=>'{"skill":"remote_install"}');
    assert.equal((await ext.run_skill(ctx)).status,'fail'); assert.equal(ctx.calls.length,1);
  });
  for(const action of ['{"tool":"send_document","arguments":{}}','{"tool":"read_sources","arguments":{"source_id":"DOC-103"}}']) {
    await test('Skills: unerlaubtes Tool oder Argument stoppt vor Ausführung',async()=>{
      const ctx=context((_,n)=>n===1?'{"skill":"budget"}':action);
      assert.equal((await ext.run_skill(ctx)).status,'fail'); assert.equal(ctx.tools.length,0);
    });
  }
  await test('Skills: defektes Endergebnis wird sichtbar, kein Absturz',async()=>{
    const ctx=context((_,n)=>['{"skill":"budget"}','{"tool":"read_sources","arguments":{}}','{}'][n-1]);
    assert.equal((await ext.run_skill(ctx,{skill_id:'budget'})).status,'warn');
  });
  const base={separate_data:false,confidential_policy:false,whitelist:true,allow_send:true,hitl:true};
  for(const [name,settings,decision,outcome,stage] of [
    ['Datentrennung',{...base,separate_data:true},null,'blocked','data'],
    ['Tool nicht erlaubt',{...base,allow_send:false},null,'blocked','tool'],
    ['Erlaubtes Tool, aber Daten gesperrt',{...base,confidential_policy:true},true,'blocked','policy'],
    ['Wartet tatsächlich auf Menschen',base,null,'approval_required','human'],
    ['Mensch lehnt ab',base,false,'blocked','human'],
    ['Falsche Freigabe ohne Datenregel',base,true,'simulated_leak','send'],
    ['Keine Kontrollen',{...base,whitelist:false,hitl:false},null,'simulated_leak','send']
  ]) {
    await test(`Injection: ${name}`,()=>{
      const result=ext.simulate_injection(settings,decision);
      assert.equal(result.outcome,outcome); assert.equal(result.stage,stage);
    });
  }
  await test('Live-Routing: fehlende Modellstufe führt zu Fehler, kein Mock-Fallback',async()=>{
    lab.engine.setMode('webllm-1.5b');
    await assert.rejects(ext.run_tier_comparison(context()),/beide Modellstufen/);
  });
  await test('Engine: angeforderte Modellstufe bestimmt tatsächlich das Backend',async()=>{
    const used=[];
    for(const [tier,id] of Object.entries(ext.model_ids)) {
      lab.engine.model_engines.set(id,{chat:{completions:{create:async()=>{
        used.push(tier);return {choices:[{message:{content:tier}}],usage:{total_tokens:7}};
      }}}});
    }
    for(const [mode,tier] of [['webllm-3b','strong'],['webllm-1.5b','small']]) {
      const result=await lab.engine.callLLM({systemPrompt:'x',userPrompt:'y',modelMode:mode});
      assert.equal(result.text,tier);assert.equal(result.simulated,false);assert.equal(result.tokens,7);
    }
    assert.equal(used.join(','),'strong,small'); assert.equal(lab.engine.mode,'webllm-1.5b');
    await lab.engine.loadWebLLM(()=>{},'webllm-3b'); // Cache: kein Import/Download.
    lab.engine.setMode('webllm-3b'); assert.equal(lab.engine.loadedModelId,ext.model_ids.strong);
  });
  console.log(`${count} Erweiterungs-Prüfungen bestanden.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
