// Ausführen: node tests/loops_contracts.test.cjs. Ausschließlich lokale Lernsimulation.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const sandbox={window:{},performance,console,setTimeout(fn){fn();}};
vm.createContext(sandbox);
for(const name of ['domains.js','engine.js','patterns.js','pmo_learning.js','pattern_extensions.js','loops.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js',name),'utf8'),sandbox,{filename:name});
const {questions,simulate_loop}=sandbox.window.AgentLab.loop_learning;
const all=Array.from(questions,item=>item.id);
const without=(...ids)=>all.filter(id=>!ids.includes(id));
let count=0;
async function test(name,run){await run();count++;console.log('PASS',name);}
(async()=>{
  await test('Sechs eindeutige Leitfragen; Trace und Kompression sind keine Schalter',()=>{
    assert.equal(questions.length,6);assert.equal(new Set(all).size,6);assert.ok(!all.includes('structured_trace'));assert.ok(!all.includes('context_compaction'));
  });
  await test('Erfolgskriterium beendet die Recherche nach zwei neuen Quellen',()=>{
    const result=simulate_loop();assert.equal(result.status,'completed');assert.equal(result.state.calls,2);assert.equal(result.state.evidence.length,2);assert.ok(result.triggered.includes('progress'));
  });
  await test('Ohne Erfolgskriterium wird unnötig bis zur Laufgrenze weitergesucht',()=>{
    const result=simulate_loop({enabled:without('progress')});assert.equal(result.status,'stopped');assert.equal(result.state.calls,3);assert.equal(result.state.evidence.length,2);assert.ok(result.triggered.includes('limits'));
  });
  await test('Stillstand wird trotz wechselnder Tool-Anfragen erkannt',()=>{
    const result=simulate_loop({scenario:'runaway'});assert.equal(result.status,'stopped');assert.equal(result.state.calls,2);assert.equal(result.state.evidence.length,0);assert.ok(result.reason.includes('wechselnder'));assert.ok(result.events.filter(event=>event.kind==='SUCHE').every((event,index)=>event.message.includes('Variante '+(index+1))));
  });
  for(const kind of ['steps','tokens','time'])await test('Laufgrenze '+kind+' wird vor dem nächsten Schritt geprüft',()=>{
    const result=simulate_loop({scenario:'runaway',enabled:without('progress'),limit_kind:kind});assert.equal(result.status,'stopped');assert.ok(result.triggered.includes('limits'));
    if(kind==='steps')assert.equal(result.state.calls,3);if(kind==='tokens')assert.ok(result.state.tokens<=500);if(kind==='time')assert.ok(result.state.time_ms<=8000);
  });
  for(const revision_issue of ['format','facts']) {
    await test('Gezielte Überarbeitung korrigiert '+revision_issue+' ohne technischen Retry',()=>{
      const result=simulate_loop({scenario:'revision',revision_issue,enabled:without('retry_policy')});
      assert.equal(result.status,'completed');assert.equal(result.state.calls,2);assert.equal(result.state.tools,0);
      assert.ok(result.triggered.includes('verification'));assert.ok(!result.triggered.includes('retry_policy'));
      assert.ok(result.events.some(event=>event.kind==='PRÜFBERICHT'));assert.ok(result.events.some(event=>event.kind==='ÜBERARBEITUNG'));
    });
    await test('Fehlgeschlagene Überarbeitung endet begrenzt: '+revision_issue,()=>{
      const result=simulate_loop({scenario:'revision',revision_issue,revision_outcome:'persistent'});
      assert.equal(result.status,'stopped');assert.equal(result.state.calls,2);assert.ok(result.report);
    });
  }
  await test('Ohne Ergebnisprüfung wird der Fehler nicht korrigiert',()=>{
    const result=simulate_loop({scenario:'revision',enabled:without('verification')});assert.equal(result.status,'unsafe');assert.equal(result.state.calls,1);
  });
  await test('Retries erholen sich beim dritten Versuch; Pausen wachsen',()=>{
    const result=simulate_loop({scenario:'tool_failure'});assert.equal(result.status,'completed');assert.equal(result.state.tools,3);const delays=result.events.filter(event=>event.kind==='BACKOFF');assert.equal(delays.length,2);assert.ok(delays[0].message.includes('1.1'));assert.ok(delays[1].message.includes('2.2'));
  });
  await test('Dauerhafter Fehler endet nach drei Versuchen mit Prüfbericht',()=>{
    const result=simulate_loop({scenario:'tool_failure',service:'failed'});assert.equal(result.status,'error');assert.equal(result.state.tools,3);assert.ok(result.report.open.length>0);assert.ok(result.reason.includes('Retry-Budget'));
  });
  await test('Ohne Retry-Regel bleibt es bei einem Versuch',()=>{
    const result=simulate_loop({scenario:'tool_failure',enabled:without('retry_policy')});assert.equal(result.state.tools,1);assert.equal(result.status,'error');
  });
  await test('Tool-Wartezeit und Gesamtlaufzeit sind unterscheidbar',()=>{
    const limited=simulate_loop({scenario:'tool_failure',limit_kind:'time'});const unlimited=simulate_loop({scenario:'tool_failure',enabled:without('limits')});assert.equal(limited.status,'completed');assert.ok(limited.state.time_ms<unlimited.state.time_ms);assert.ok(limited.events.some(event=>event.kind==='TIMEOUT'));
  });
  await test('Circuit Breaker öffnet, prüft halb offen und schließt bei Erholung',()=>{
    const result=simulate_loop({scenario:'tool_failure',circuit_breaker:true});assert.equal(result.status,'completed');assert.equal(result.state.breaker,'closed');assert.equal(result.state.tools,3);const messages=result.events.filter(event=>event.kind==='CIRCUIT').map(event=>event.message).join(' ');assert.ok(messages.includes('offen'));assert.ok(messages.includes('halb offen'));assert.ok(messages.includes('geschlossen'));assert.ok(result.triggered.includes('circuit_breaker'));
  });
  await test('Misslungener Test öffnet den Circuit Breaker wieder',()=>{
    const result=simulate_loop({scenario:'tool_failure',service:'failed',circuit_breaker:true});assert.equal(result.status,'error');assert.equal(result.state.breaker,'open');assert.equal(result.state.tools,3);assert.ok(result.reason.includes('Testaufruf'));
  });
  await test('Gesamtlaufzeit kann vor dem Circuit-Test ausgeschöpft sein',()=>{
    const result=simulate_loop({scenario:'tool_failure',circuit_breaker:true,limit_kind:'time'});assert.equal(result.status,'stopped');assert.equal(result.state.tools,2);assert.ok(result.state.time_ms<=8000);
  });
  await test('Idempotenz verhindert doppelte Wirkung bei wiederholtem Auftrag',()=>{
    const result=simulate_loop({scenario:'side_effect'});assert.equal(result.status,'completed');assert.equal(result.state.tools,2);assert.equal(result.state.effects,1);assert.ok(result.triggered.includes('idempotency'));
  });
  await test('Unklarer Seiteneffekt ohne Idempotenz wird menschlich geklärt',()=>{
    const result=simulate_loop({scenario:'side_effect',enabled:without('idempotency')});assert.equal(result.status,'review_required');assert.equal(result.state.tools,1);assert.equal(result.state.effects,1);assert.ok(result.report);
  });
  await test('Blindes Retry ohne Idempotenz und Eskalation wirkt doppelt',()=>{
    const result=simulate_loop({scenario:'side_effect',enabled:without('idempotency','safe_exit')});assert.equal(result.status,'unsafe');assert.equal(result.state.effects,2);
  });
  await test('Ohne Retry keine Doppelaktion, aber ungeklärter Zustand',()=>{
    const result=simulate_loop({scenario:'side_effect',enabled:without('retry_policy')});assert.equal(result.status,'stopped');assert.equal(result.state.effects,1);assert.equal(result.state.tools,1);
  });
  await test('Prüfbericht hängt von Frage 6 ab; Trace bleibt immer verfügbar',()=>{
    const with_report=simulate_loop({scenario:'runaway'});const without_report=simulate_loop({scenario:'runaway',enabled:without('safe_exit')});assert.ok(with_report.report);assert.equal(without_report.report,null);assert.equal(with_report.status,without_report.status);assert.ok(without_report.events.length>0);
  });
  await test('Alle 64 Schalterkombinationen enden in jedem Lernfall begrenzt',()=>{
    for(let mask=0;mask<64;mask++)for(const scenario of ['success','runaway','revision','tool_failure','side_effect']){
      const enabled=all.filter((_,index)=>mask&(1<<index));const result=simulate_loop({scenario,enabled});assert.ok(['completed','blocked','stopped','error','unsafe','review_required','approval_required'].includes(result.status));assert.ok(result.events.length>0);assert.ok(result.state.calls<=6);assert.ok(result.state.time_ms<=30000);
    }
  });
  await test('Unerwarteter Loop-UI-Fehler beendet den Lauf sichtbar und entsperrt Controls', async () => {
    const {controller,elements,errors}=require('./controller_fixture.cjs')('LoopsController');
    controller.renderTrace=()=>{throw Error('Erzwungener Tracefehler');};
    await controller.runSimulation();
    assert.equal(controller.running,false);
    assert.ok(elements.get('loopResultBadge').textContent.includes('Technischer Fehler'));
    assert.ok(elements.get('loopOutcomeSummary').textContent.includes('Erzwungener Tracefehler'));
    assert.equal(elements.get('runLoopBtn').disabled,false);
    assert.ok(errors.length>0);
  });
  console.log(count+' Loop-Prüfungen bestanden.');
})().catch(error=>{console.error(error);process.exitCode=1;});
