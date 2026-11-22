(function () {
const { sleep } = window.AgentLab;

// Die sieben Perspektiven auf Schleifen aus "Loop Engineering" (loop-engineering.md).
// Sie beschreiben Schleifentypen; die zwölf Techniken unten sind Schutzmechanismen für diese Schleifen.
const LOOP_PERSPECTIVES = [
  { id: "orchestration", label: "Orchestration Loop", short: "Orchestration" },
  { id: "agent", label: "Agent Loop", short: "Agent" },
  { id: "verification", label: "Verification Loop", short: "Verification" },
  { id: "safety", label: "Safety / Guardrail Loop", short: "Safety" },
  { id: "hitl", label: "HITL / Collaboration Loop", short: "HITL" },
  { id: "event", label: "Event-Driven Loop", short: "Event-Driven" },
  { id: "learning", label: "Learning Loop", short: "Learning" }
];

// loops: welche Perspektiven die Schutztechnik absichert; die erste Nennung ist die primäre.
const LOOP_TECHNIQUES = [
  { id: "iteration_cap", name: "1. Iterations-Cap", desc: "Harte Obergrenze für Schleifendurchläufe (z. B. max. 3).", loops: ["agent", "orchestration"] },
  { id: "token_budget", name: "2. Token-/Kostenbudget", desc: "Bricht ab, bevor Kosten explodieren.", loops: ["agent", "orchestration"] },
  { id: "schema_check", name: "3. Schema-Validierung", desc: "Prüft JSON-Struktur & Pflichtfelder deterministisch.", loops: ["verification"] },
  { id: "tool_whitelist", name: "4. Tool-Whitelist", desc: "Blockiert halluzinierte oder unerlaubte Tool-Namen.", loops: ["safety"] },
  { id: "loop_detection", name: "5. Wiederholungs-Erkennung", desc: "Erkennt identische Tool-Aufrufe ohne Fortschritt.", loops: ["agent"] },
  { id: "tool_timeout", name: "6. Tool-Timeout", desc: "Begrenzt hängende API-Aufrufe hart.", loops: ["agent"] },
  { id: "circuit_breaker", name: "7. Circuit Breaker", desc: "Stoppt Retry-Stürme nach N Fehlern desselben Tools.", loops: ["agent", "event"] },
  { id: "idempotency", name: "8. Idempotenz-Schutz", desc: "Verhindert doppelte E-Mails oder Zahlungen bei Retries.", loops: ["event", "safety"] },
  { id: "context_compaction", name: "9. Kontext-Kompression", desc: "Hält den aktiven State innerhalb des Token-Budgets.", loops: ["agent"] },
  { id: "hitl_escalation", name: "10. HITL-Eskalation", desc: "Übergibt unklare/riskante Fälle an einen Menschen.", loops: ["hitl"] },
  { id: "graceful_fallback", name: "11. Graceful Fallback", desc: "Liefert einen sicheren Prüfbericht statt Absturz.", loops: ["safety", "verification"] },
  { id: "structured_trace", name: "12. Strukturierter Trace", desc: "Protokolliert jede Entscheidung & Abbruchursache.", loops: ["learning", "verification"] }
];

function perspectiveLabel(id, key = "short") {
  const p = LOOP_PERSPECTIVES.find((x) => x.id === id);
  return p ? p[key] : id;
}

class LoopsController {
  constructor() {
    this.enabled = new Set(LOOP_TECHNIQUES.map((t) => t.id));
    this.gridEl = document.getElementById("techniquesGrid");
    this.traceEl = document.getElementById("loopTraceList");
    this.outcomeEl = document.getElementById("loopOutcomeSummary");
    this.badgeEl = document.getElementById("loopResultBadge");

    this.bindEvents();
    this.renderPerspectiveLegend();
    this.renderTechniques();
  }

  bindEvents() {
    document.getElementById("toggleAllTechBtn").addEventListener("click", () => {
      LOOP_TECHNIQUES.forEach((t) => this.enabled.add(t.id));
      this.renderTechniques();
    });
    document.getElementById("disableAllTechBtn").addEventListener("click", () => {
      this.enabled.clear();
      this.renderTechniques();
    });
    document.getElementById("runLoopBtn").addEventListener("click", () => this.runSimulation());
  }

  renderPerspectiveLegend() {
    const el = document.getElementById("loopPerspectiveLegend");
    if (!el) return;
    el.innerHTML = LOOP_PERSPECTIVES.map((p) => {
      const n = LOOP_TECHNIQUES.filter((t) => t.loops.includes(p.id)).length;
      return `<span class="loop-legend-item${n ? "" : " empty"}">${p.label}<b>${n}</b></span>`;
    }).join("");
  }

  renderTechniques(triggeredIds = new Set()) {
    document.getElementById("activeTechCount").textContent = `${this.enabled.size} / ${LOOP_TECHNIQUES.length} aktiv`;
    this.gridEl.innerHTML = LOOP_TECHNIQUES.map((t) => {
      const on = this.enabled.has(t.id);
      const hit = triggeredIds.has(t.id);
      return `
        <label class="tech-toggle${on ? " enabled" : ""}${hit ? " triggered" : ""}">
          <input type="checkbox" data-tech="${t.id}" ${on ? "checked" : ""} />
          <div>
            <strong>${t.name}${hit ? " ✓" : ""}</strong>
            <span>${t.desc}</span>
            <span class="tech-loop" title="Zugeordnete Perspektiven auf Schleifen">${t.loops.map((l) => perspectiveLabel(l)).join(" · ")}</span>
          </div>
        </label>`;
    }).join("");

    this.gridEl.querySelectorAll("input[type='checkbox']").forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.checked) this.enabled.add(cb.dataset.tech);
        else this.enabled.delete(cb.dataset.tech);
        this.renderTechniques();
      });
    });
  }

  setStage(stage, state) {
    document.querySelectorAll("#loopCycleDiagram .cycle-step").forEach((el) => {
      el.classList.remove("active", "pass", "fail");
      if (el.dataset.stage === stage) el.classList.add(state);
    });
  }

  renderTrace(entries, iterCount) {
    document.getElementById("loopIterCount").textContent = `${iterCount} Iterationen`;
    this.traceEl.innerHTML = entries
      .map(
        (e) => `
      <div class="trace-entry type-${e.type}">
        <span class="trace-time">Iter ${e.iter}</span>
        <span class="trace-kind">${e.kind}</span>
        <div>${e.msg}</div>
      </div>`
      )
      .join("");
    this.traceEl.scrollTop = this.traceEl.scrollHeight;
  }

  async runSimulation() {
    const scenario = document.getElementById("loopScenarioSelect").value;
    const entries = [];
    const triggered = new Set();
    const has = (id) => this.enabled.has(id);

    const log = (iter, type, kind, msg) => {
      entries.push({ iter, type, kind, msg });
      this.renderTrace(entries, iter);
    };

    this.badgeEl.className = "status-badge status-running";
    this.badgeEl.textContent = "Simuliert…";
    this.renderTechniques();

    // SCENARIO 1: Endlosschleife
    if (scenario === "runaway") {
      const maxSteps = has("iteration_cap") ? 3 : 6;
      for (let i = 1; i <= maxSteps; i++) {
        this.setStage("inspect", "active");
        await sleep(170);
        this.setStage("act", "active");
        log(i, "tool", "ACT", `Modell ruft erneut search_docs(query="CLM002") auf (identisches Ergebnis).`);
        await sleep(170);
        this.setStage("verify", "active");

        if (i === 2 && has("loop_detection")) {
          triggered.add("loop_detection");
          if (has("structured_trace")) triggered.add("structured_trace");
          log(i, "gate", "LOOP-DETECT", "Identischer Tool-Aufruf ohne neuen Fortschritt erkannt → Schleife gezielt gestoppt.");
          this.setStage("decide", "pass");
          break;
        }
        if (i === 3 && has("iteration_cap")) {
          triggered.add("iteration_cap");
          if (has("graceful_fallback")) triggered.add("graceful_fallback");
          log(i, "gate", "ITER-CAP", "Hartes Iterations-Cap (3/3) erreicht → sicherer Abbruch.");
          this.setStage("decide", "pass");
          break;
        }
        if (i === 4 && has("token_budget")) {
          triggered.add("token_budget");
          log(i, "gate", "BUDGET", "Token-Budget überschritten → Notbremse ausgelöst.");
          this.setStage("decide", "pass");
          break;
        }
        log(i, "fail", "VERIFY", "Kein Fortschritt — aber kein aktiver Schutz greift.");
      }

      const saved = triggered.size > 0;
      this.renderTechniques(triggered);
      this.badgeEl.className = `status-badge status-${saved ? "pass" : "fail"}`;
      this.badgeEl.textContent = saved ? "Sicher gestoppt" : "Unkontrolliert gelaufen";
      this.outcomeEl.innerHTML = saved
        ? `<p><strong>Endlosschleife erfolgreich abgefangen!</strong> Ausgelöste Techniken: ${[...triggered].map((x) => `<code>${x}</code>`).join(", ")}.</p>`
        : `<p><strong>Fehlschlag:</strong> Ohne <em>Wiederholungs-Erkennung</em>, <em>Iterations-Cap</em> oder <em>Token-Budget</em> lief der Agent 6 Runden lang im Kreis und verbrannte unnötig Tokens.</p>`;
      return;
    }

    // SCENARIO 2: Bad JSON & Hallucinated Tool
    if (scenario === "bad_json") {
      this.setStage("inspect", "active");
      await sleep(180);
      this.setStage("act", "active");
      log(1, "llm", "ACT", `Modell schlägt Tool <code>delete_all_claims()</code> vor und liefert fehlerhaftes JSON.`);
      await sleep(200);
      this.setStage("verify", "active");

      const caughtTool = has("tool_whitelist");
      const caughtSchema = has("schema_check");
      if (caughtTool) {
        triggered.add("tool_whitelist");
        log(1, "gate", "WHITELIST", "Halluziniertes Tool delete_all_claims() blockiert.");
      }
      if (caughtSchema) {
        triggered.add("schema_check");
        log(1, "gate", "SCHEMA", "Ungültiges JSON erkannt — Korrektur-Retry angefordert.");
      }
      if (!caughtTool && !caughtSchema) {
        this.setStage("verify", "fail");
        log(1, "fail", "CRASH", "Ungeprüfter Aufruf führt zu Laufzeitfehler / unsicherer Ausgabe.");
      } else {
        if (has("graceful_fallback")) triggered.add("graceful_fallback");
        this.setStage("decide", "pass");
      }

      const ok = caughtTool && caughtSchema;
      this.renderTechniques(triggered);
      this.badgeEl.className = `status-badge status-${ok ? "pass" : caughtTool || caughtSchema ? "warn" : "fail"}`;
      this.badgeEl.textContent = ok ? "Vollständig abgefangen" : caughtTool || caughtSchema ? "Teilweise geschützt" : "Ungeschützt";
      this.outcomeEl.innerHTML = ok
        ? `<p><strong>Beide Fehler gestoppt:</strong> <code>tool_whitelist</code> blockte das erfundene Tool und <code>schema_check</code> verhinderte defektes JSON.</p>`
        : `<p><strong>Lücke erkannt:</strong> Für vollständigen Schutz werden sowohl <code>tool_whitelist</code> als auch <code>schema_check</code> benötigt.</p>`;
      return;
    }

    // SCENARIO 3: Tool Timeout & Retry Storm
    if (scenario === "tool_failure") {
      for (let i = 1; i <= 4; i++) {
        this.setStage("act", "active");
        await sleep(180);
        if (has("tool_timeout")) {
          triggered.add("tool_timeout");
          log(i, "gate", "TIMEOUT", `Externe API antwortet nicht → nach 3 s sauber abgebrochen (Versuch ${i}).`);
        } else {
          log(i, "fail", "HANG", `Externe API hängt 30 s ohne Timeout (Versuch ${i}).`);
        }
        if (i === 2 && has("circuit_breaker")) {
          triggered.add("circuit_breaker");
          if (has("graceful_fallback")) triggered.add("graceful_fallback");
          log(i, "gate", "CIRCUIT", "Circuit Breaker öffnet nach 2 Fehlern → keine weiteren Retries, sauberer Fallback.");
          this.setStage("decide", "pass");
          break;
        }
      }
      const ok = has("tool_timeout") && has("circuit_breaker");
      this.renderTechniques(triggered);
      this.badgeEl.className = `status-badge status-${ok ? "pass" : "warn"}`;
      this.badgeEl.textContent = ok ? "Resilient" : "Retry-Sturm";
      this.outcomeEl.innerHTML = ok
        ? `<p><strong>Stabil bei API-Ausfall:</strong> <code>tool_timeout</code> + <code>circuit_breaker</code> verhinderten Hänger und Retry-Sturm.</p>`
        : `<p><strong>Risiko:</strong> Ohne <code>tool_timeout</code> und <code>circuit_breaker</code> blockiert eine gestörte API den gesamten Agenten-Loop.</p>`;
      return;
    }

    // SCENARIO 4: Duplicate Side Effect
    if (scenario === "side_effect") {
      this.setStage("act", "active");
      log(1, "tool", "SEND", "Schreibaktion: send_payout(CLM001, 19.500 €, tx_id='TX-101') ausgeführt; Netzwerk-ACK geht verloren.");
      await sleep(220);
      this.setStage("verify", "active");

      if (has("hitl_escalation")) {
        triggered.add("hitl_escalation");
        log(2, "human", "HITL", "Schreibaktion vorab durch Freigabe-Gate abgesichert.");
      }
      if (has("idempotency")) {
        triggered.add("idempotency");
        log(2, "gate", "IDEMPOTENZ", "Retry mit tx_id='TX-101' erkannt → doppelte Auszahlung verhindert!");
        this.setStage("decide", "pass");
      } else {
        this.setStage("verify", "fail");
        log(2, "fail", "DOPPELZAHLUNG", "Retry ohne Idempotency-Key löst send_payout(19.500 €) ein ZWEITES Mal aus!");
      }

      const ok = has("idempotency");
      this.renderTechniques(triggered);
      this.badgeEl.className = `status-badge status-${ok ? "pass" : "fail"}`;
      this.badgeEl.textContent = ok ? "Keine Doppelaktion" : "Doppelte Schreibaktion!";
      this.outcomeEl.innerHTML = ok
        ? `<p><strong>Sicher bei Wiederholungen:</strong> <code>idempotency</code> verhinderte die doppelte Auszahlung trotz Netzwerk-Retry.</p>`
        : `<p><strong>Kritischer Fehler:</strong> Ohne <code>idempotency</code> führte ein einfacher Retry zu einer doppelten Auszahlung von 19.500 €.</p>`;
    }
  }
}

window.AgentLab.LoopsController = LoopsController;
})();
