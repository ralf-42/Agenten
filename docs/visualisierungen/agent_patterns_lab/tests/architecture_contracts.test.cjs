// Offline-Prüfungen für Planung, Delegation und begrenzte Fehlerpfade.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sandbox = {window:{},performance,console,setTimeout(fn){fn();}};
vm.createContext(sandbox);
for (const name of ['domains.js','engine.js','patterns.js','pmo_learning.js','pattern_extensions.js','architecture_extensions.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js',name),'utf8'),sandbox,{filename:name});
}
const lab = sandbox.window.AgentLab;
const ext = lab.architecture_extensions;
let passed = 0;
async function test(name,run) {await run();passed++;console.log('PASS',name);}
function context(override) {
  const calls=[],tools=[],logs=[];
  return {calls,tools,logs,node(){},log(...args){logs.push(args);},tool(...args){tools.push(args);},async llm(options){
    calls.push(options);
    const replacement = override?.(options,calls.length);
    if (replacement !== undefined) return {text:typeof replacement==='string'?replacement:JSON.stringify(replacement),tokens:1};
    return lab.engine.callLLM(options);
  }};
}
(async()=>{
  await test('Katalog: neue Muster korrekt gruppiert und ausführbar',()=>{
    for (const [id,group] of [['plan_execute','agentic'],['supervisor','multiagent']]) {
      const pattern=lab.PATTERNS.find(p=>p.id===id);
      assert.equal(pattern.group,group);assert.equal(typeof pattern.execute,'function');
      const nodes=new Set(pattern.graph.nodes.map(n=>n.id));
      assert.ok(pattern.graph.edges.every(edge=>edge.every(id=>nodes.has(id))));
    }
    const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
    assert.ok(html.indexOf('js/architecture_extensions.js')<html.indexOf('js/app.js'));
    assert.ok(html.includes('href="#plan_execute"'));assert.ok(html.includes('href="#supervisor"'));
  });
  for (const mode of ['mock-small','mock-strong']) {
    await test('Plan-and-Execute '+mode+': beide Quellen, begrenzte Neuplanung',async()=>{
      lab.engine.setMode(mode);const ctx=context();const result=await ext.run_plan_execute(ctx);
      assert.equal(result.status,'pass');assert.equal(result.score.passed,5);
      assert.deepEqual(ctx.tools.map(t=>t[0]),['read_status','read_budget']);
      assert.equal(ctx.calls.length,mode==='mock-small'?3:2);
      assert.equal(result.history.filter(x=>x.startsWith('Neuplanung:')).length,mode==='mock-small'?1:0);
      const input=JSON.parse(ctx.calls.at(-1).userPrompt);
      assert.ok(!('expected_facts' in input));assert.ok(!('expected_open' in input));
    });
    await test('Supervisor '+mode+': Rückgaben steuern nächste Entscheidung',async()=>{
      lab.engine.setMode(mode);const ctx=context();const result=await ext.run_supervisor(ctx);
      assert.equal(result.status,'pass');assert.equal(ctx.calls.length,6);
      assert.deepEqual(ctx.tools.map(t=>t[0]),mode==='mock-small'?['call_status_agent','call_budget_agent']:['call_budget_agent','call_status_agent']);
      const decisions=ctx.calls.filter(o=>o.systemPrompt.startsWith('You are the supervisor'));
      assert.equal(Object.keys(JSON.parse(decisions[0].userPrompt).reports).length,0);
      assert.equal(Object.keys(JSON.parse(decisions[1].userPrompt).reports).length,1);
      assert.equal(Object.keys(JSON.parse(decisions[2].userPrompt).reports).length,2);
      const specialists=ctx.calls.filter(o=>o.systemPrompt.startsWith('You are a specialist'));
      for(const call of specialists){const data=JSON.parse(call.userPrompt);assert.deepEqual(Object.keys(data).sort(),['source','source_id','task']);assert.equal(data.source,lab.pmo_learning.case_by_id('status').sources[data.source_id]);}
      assert.equal(Object.keys(JSON.parse(ctx.calls.at(-1).userPrompt).specialist_reports).length,2);
    });
  }
  for(const bad of ['not json',{steps:['delete_files','finish']},{steps:['status','status','finish']},{steps:['finish','budget']},{steps:['status','budget','status','finish']}]) {
    await test('Plan: ungültiger oder unerlaubter Plan stoppt vor Tool-Aufruf',async()=>{
      const ctx=context(()=>bad);const result=await ext.run_plan_execute(ctx);
      assert.equal(result.status,'warn');assert.equal(ctx.tools.length,0);assert.equal(ctx.calls.length,1);
    });
  }
  await test('Plan: weiterhin fehlende Belege stoppen nach einer Neuplanung',async()=>{
    const ctx=context(()=>({steps:['finish']}));const result=await ext.run_plan_execute(ctx);
    assert.equal(result.status,'warn');assert.equal(ctx.calls.length,2);assert.equal(ctx.tools.length,0);
  });
  await test('Plan: wiederholte erledigte Arbeit wird blockiert',async()=>{
    const ctx=context(()=>({steps:['status','finish']}));const result=await ext.run_plan_execute(ctx);
    assert.equal(result.status,'warn');assert.equal(ctx.tools.length,1);
  });
  for(const bad of ['not json',{action:'send_email'},{action:'finish'}]) {
    await test('Supervisor: ungültige Aktion oder vorzeitiger Abschluss blockiert',async()=>{
      const ctx=context(()=>bad);const result=await ext.run_supervisor(ctx);
      assert.equal(result.status,'warn');assert.equal(ctx.tools.length,0);assert.equal(ctx.calls.length,1);
    });
  }
  await test('Supervisor: wiederholter Aufruf wird vor zweiter Delegation gestoppt',async()=>{
    const ctx=context(o=>o.systemPrompt.startsWith('You are the supervisor')?{action:'status'}:undefined);
    const result=await ext.run_supervisor(ctx);assert.equal(result.status,'warn');assert.equal(ctx.tools.length,1);assert.equal(ctx.calls.length,3);
  });
  await test('Supervisor: fremde Quelle im Bericht wird verworfen',async()=>{
    const ctx=context(o=>o.systemPrompt.startsWith('You are a specialist')?{summary:'Fremder Bericht',source_id:'DOC-103',quote:'Geheim'}:undefined);
    const result=await ext.run_supervisor(ctx);assert.equal(result.status,'warn');assert.equal(ctx.tools.length,1);assert.equal(ctx.calls.length,2);
  });
  await test('Abschluss: falsche Fakten erhalten keine positive Regelbewertung',async()=>{
    lab.engine.setMode('mock-strong');const ctx=context(o=>o.systemPrompt.startsWith('Return only JSON')?{answer:'Falscher Termin',facts:[],open_questions:[],blocked:false}:undefined);
    const result=await ext.run_plan_execute(ctx);assert.equal(result.status,'warn');assert.ok(result.score.passed<result.score.total);
  });
  await test('Abschluss: JSON null wird als ungültiges Ergebnis behandelt',async()=>{
    lab.engine.setMode('mock-strong');const ctx=context(o=>o.systemPrompt.startsWith('Return only JSON')?'null':undefined);
    const result=await ext.run_plan_execute(ctx);assert.equal(result.status,'warn');assert.equal(result.score.passed,0);
  });
  await test('Abschluss: HTML im Antworttext wird maskiert',async()=>{
    const ctx=context(o=>{if(!o.systemPrompt.startsWith('Return only JSON'))return;const result=lab.pmo_learning.expected_result(lab.pmo_learning.case_by_id('status'));result.answer='<img src=x onerror=alert(1)>';return result;});
    const result=await ext.run_supervisor(ctx);assert.ok(!result.html.includes('<img'));assert.ok(result.html.includes('&lt;img'));
  });
  console.log(passed+' Architektur-Prüfungen bestanden.');
})().catch(error=>{console.error(error);process.exitCode=1;});
