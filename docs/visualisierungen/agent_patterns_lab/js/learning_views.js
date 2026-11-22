(function () {
  const { engine, pmo_learning: learning } = window.AgentLab;
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const by_id = (id) => document.getElementById(id);
  const pretty = (value) => JSON.stringify(value, null, 2);
  const phase_labels = { research: "Recherche", write: "Schreiben", review: "Prüfung", approval: "Unterbrochen: Freigabe nötig", execute: "Freigegeben: Weitergabe simulieren", finished: "Beendet", blocked: "Gesperrt: manuelle Prüfung" };

  class PmoEvaluationController {
    constructor() {
      this.rows = [];
      this.last_run = null;
      this.running = false;
      by_id("evalCase").innerHTML = learning.pmo_cases.map((item) => `<option value="${item.id}">${escape(item.label)}</option>`).join("") + '<option value="all">Alle drei Fälle</option>';
      by_id("evalCase").addEventListener("change", () => this.render_cases());
      by_id("evalRunBtn").addEventListener("click", () => this.run());
      by_id("evalCancelBtn").addEventListener("click", () => { this.cancelled = true; by_id("evalProgress").textContent = "Stopp angefordert; ein laufender Modellaufruf wird noch beendet."; });
      this.render_cases();
    }
    selected_cases() {
      return learning.pmo_cases.filter((item) => by_id("evalCase").value === "all" || item.id === by_id("evalCase").value);
    }
    render_cases() {
      by_id("evalCriteria").innerHTML = this.selected_cases().map((item) => `<details><summary>${escape(item.label)} – Quellen und erwartete Kriterien</summary><p>${escape(item.query)}</p><pre>${escape(pretty(item.sources))}</pre><p><strong>Erwartete Fakten:</strong></p><pre>${escape(pretty(item.expected_facts))}</pre><p><strong>Offene Angaben:</strong> ${escape(item.expected_open.join(", "))} · <strong>blocked:</strong> ${item.expected_blocked}</p></details>`).join("");
    }
    async run() {
      if (this.running) return;
      if (by_id("runPatternBtn").disabled || by_id("runHarnessBtn").disabled || (engine.isWebLLM() && by_id("loadModelBtn").disabled)) {
        by_id("evalProgress").textContent = "Bitte den laufenden Modell- oder Musterlauf zuerst beenden.";
        return;
      }
      const cases = this.selected_cases();
      const instructions = by_id("evalInstructions").value.trim();
      const key = JSON.stringify({ mode: engine.mode, model: engine.isWebLLM() ? engine.loadedModelId : engine.mode, cases: cases.map((item) => item.id) });
      const baseline = this.last_run?.key === key ? this.last_run : null;
      this.rows = []; this.running = true; this.cancelled = false;
      const controls = ["engineMode", "loadModelBtn", "runPatternBtn", "runAllBtn", "runHarnessBtn", "evalRunBtn", "evalCase", "evalInstructions"];
      const disabled_before = controls.map((id) => by_id(id).disabled);
      controls.forEach((id) => { by_id(id).disabled = true; });
      by_id("evalCancelBtn").disabled = false;
      by_id("evalBaseline").textContent = baseline
        ? "Vergleich mit dem vorherigen vollständigen Lauf: gleicher Modus und gleiche Fälle. Δ zählt bestandene Regelprüfungen; keine allgemeine Qualitätsrangfolge."
        : "Noch kein vergleichbarer vorheriger Lauf. Nach einem vollständigen Lauf kannst du die gemeinsame Zusatzanweisung ändern und erneut prüfen.";
      by_id("evalMode").textContent = engine.isWebLLM() ? `WebGPU · ${engine.loadedModelId || "Modell noch nicht geladen"}` : `${engine.mode} · Simulation mit vorgegebenen Fehlern und Tokenzahlen`;
      this.render_rows();
      try {
        for (const item of cases) {
          for (const variant of learning.eval_variants) {
            if (this.cancelled) break;
            by_id("evalProgress").textContent = `${item.label} · ${variant.label}`;
            try {
              const row = await learning.run_eval(item, variant.id, instructions, engine, (message) => {
                by_id("evalProgress").textContent = `${item.label} · ${variant.label}: ${message}`;
                if (this.cancelled) throw new Error("Vergleich angehalten.");
              });
              const before = baseline?.rows.find((value) => value.case_id === item.id && value.variant === variant.id);
              row.delta = before?.score ? row.score.passed - before.score.passed : null;
              this.rows.push(row);
            } catch (error) {
              this.rows.push({ case_id: item.id, variant: variant.id, error: error.message });
            }
            this.render_rows();
          }
          if (this.cancelled) break;
        }
        const complete = !this.cancelled && this.rows.length === cases.length * learning.eval_variants.length && this.rows.every((row) => !row.error);
        if (complete) this.last_run = { key, rows: this.rows.map((row) => ({ ...row })) };
        by_id("evalProgress").textContent = this.cancelled ? "Angehalten. Teilergebnisse bleiben sichtbar; sie ersetzen keine vollständige Baseline." : complete ? "Vergleich abgeschlossen. Prüfe zusätzlich den freien Antworttext fachlich." : "Vergleich mit technischen Fehlern beendet; keine neue Baseline gespeichert.";
      } finally {
        this.running = false;
        controls.forEach((id, i) => { by_id(id).disabled = disabled_before[i]; });
        by_id("evalCancelBtn").disabled = true;
      }
    }
    render_rows() {
      by_id("evalResults").innerHTML = this.rows.map((row, i) => {
        const item = learning.case_by_id(row.case_id);
        const variant = learning.eval_variants.find((value) => value.id === row.variant);
        const score = row.error ? escape(row.error) : `${row.score.passed}/${row.score.total}`;
        return `<tr><td>${escape(item.label)}</td><td>${escape(variant.label)}</td><td>${score}</td><td>${row.delta === null || row.delta === undefined ? "–" : (row.delta > 0 ? "+" : "") + row.delta}</td><td>${row.calls ?? "–"}</td><td>${row.tools ?? "–"}</td><td>${row.tokens === undefined ? "–" : (row.simulated ? "sim. " : row.tokens_estimated ? "≈ " : "") + row.tokens}</td><td>${row.elapsed_ms === undefined ? "–" : (row.elapsed_ms / 1000).toFixed(2) + " s"}</td><td><button class="btn btn-ghost btn-sm" data-eval-row="${i}">Details</button></td></tr>`;
      }).join("");
      by_id("evalResults").querySelectorAll("[data-eval-row]").forEach((button) => button.addEventListener("click", () => this.render_detail(this.rows[Number(button.dataset.evalRow)])));
      if (this.rows.length) this.render_detail(this.rows[this.rows.length - 1]);
      else by_id("evalDetail").textContent = "Noch kein Ergebnis. Die erwarteten Kriterien stehen bereits vor dem Lauf fest.";
    }
    render_detail(row) {
      by_id("evalDetail").innerHTML = row.error ? `<p>${escape(row.error)}</p>`
        : `<p><strong>${escape(learning.case_by_id(row.case_id).label)} · ${escape(learning.eval_variants.find((value) => value.id === row.variant).label)}</strong></p><ul>${Object.entries(row.score.checks).map(([key, passed]) => `<li>${passed ? "✓" : "✕"} ${escape(learning.check_labels[key])}</li>`).join("")}</ul><p><strong>Interner Modell-Reviewer:</strong> ${row.review_status === "not_applicable" ? "In dieser Variante nicht vorhanden" : row.review_status === "accepted" ? "Akzeptiert" : "Weiterhin negativ oder ungültig; keine interne Akzeptanz"}. Die Tabellenwerte zählen unabhängig davon die festen Regelchecks am letzten Entwurf.</p><p><strong>Modell / Simulation:</strong> ${escape(row.source)} · <strong>Gemeinsame Zusatzanweisung:</strong> ${escape(row.instructions || "keine")}</p><p><strong>Antwort – fachlich gegenlesen:</strong></p><pre>${escape(row.result?.answer || row.raw)}</pre><details><summary>Strukturierte Ausgabe und Ablauf</summary><pre>${escape(pretty(row.result))}</pre><pre>${escape(row.trace.join("\n"))}</pre></details>`;
    }
  }

  class CheckpointController {
    constructor() {
      this.state = null; this.before = null; this.history = []; this.saved = null;
      by_id("stateCase").innerHTML = learning.pmo_cases.map((item) => `<option value="${item.id}">${escape(item.label)}</option>`).join("");
      by_id("stateNewBtn").addEventListener("click", () => this.perform(() => {
        learning.checkpoint_key(by_id("stateSession").value.trim());
        this.session_id = by_id("stateSession").value.trim();
        this.state = learning.new_state(by_id("stateCase").value, by_id("stateInjectError").checked);
        this.before = null; this.history = ["Neuer Lauf; noch kein Checkpoint gespeichert."]; this.saved = null;
      }, "Neuer Lauf bereit. Nächster Schritt: Recherche."));
      for (const [id, action] of [["stateStepBtn", "step"], ["stateApproveBtn", "approve"], ["stateRejectBtn", "reject"], ["stateEditBtn", "edit"]]) {
        by_id(id).addEventListener("click", () => this.perform(() => {
          const next = learning.transition(this.state, action, by_id("stateDraft").value);
          this.before = this.state; this.state = next;
          this.history.push(`${action}: ${phase_labels[next.phase]}`);
          this.history = this.history.slice(-30);
        }, "State aktualisiert. Änderungen sind erst nach „Checkpoint speichern“ dauerhaft im Browser gesichert."));
      }
      by_id("stateSaveBtn").addEventListener("click", () => this.perform(() => {
        if (by_id("stateSession").value.trim() !== this.session_id) throw new Error("Die Session-ID wurde geändert. Zum Speichern die ID des aktiven Laufs verwenden oder einen neuen Lauf starten.");
        this.saved = learning.save_checkpoint(window.localStorage, this.session_id, this.state);
      }, "Checkpoint gespeichert. Nach Neuladen dieselbe Session-ID eingeben und ausdrücklich laden."));
      by_id("stateLoadBtn").addEventListener("click", () => this.perform(() => {
        const id = by_id("stateSession").value.trim();
        const checkpoint = learning.load_checkpoint(window.localStorage, id);
        this.before = this.state; this.state = checkpoint.state; this.saved = checkpoint; this.session_id = id;
        this.history = ["Checkpoint ausdrücklich geladen. Kein Schritt wurde automatisch ausgeführt."];
      }, "Checkpoint geladen. Zum Fortsetzen den nächsten Schritt oder die ausstehende Freigabe wählen."));
      by_id("stateDeleteBtn").addEventListener("click", () => this.perform(() => {
        const id = by_id("stateSession").value.trim();
        window.localStorage.removeItem(learning.checkpoint_key(id));
        if (this.session_id === id) this.saved = null;
      }, "Gespeicherten Checkpoint dieser Session gelöscht. Ein laufender State bleibt erhalten."));
      this.render();
    }
    perform(action, message) {
      try { action(); this.render(); by_id("stateMessage").textContent = message; }
      catch (error) { by_id("stateMessage").textContent = error.message; }
    }
    render() {
      const state = this.state;
      by_id("stateStatus").textContent = state ? `${this.session_id} · ${phase_labels[state.phase]}` : "Kein aktiver Lauf. Neuen Lauf starten oder gespeicherten Checkpoint laden.";
      by_id("stateRuntime").textContent = state ? pretty(state) : "Noch kein Laufzeit-State.";
      by_id("stateSaved").textContent = this.saved ? pretty(this.saved) : "Noch kein Checkpoint geladen oder in dieser Ansicht gespeichert. Gespeicherte Sessions werden nicht automatisch geladen.";
      by_id("stateDiff").innerHTML = !state || !this.before ? '<p class="muted-sm">Noch kein Zustandswechsel.</p>' : learning.state_diff(this.before, state).map((change) => `<details open><summary>${escape(change.key)}</summary><div class="state-change"><pre>${escape(pretty(change.before))}</pre><pre>${escape(pretty(change.after))}</pre></div></details>`).join("") || '<p>Keine Feldänderung.</p>';
      by_id("stateHistory").textContent = this.history.join("\n");
      by_id("stateDraft").value = state?.draft || "";
      by_id("stateStepBtn").disabled = !state || ["approval", "finished", "blocked"].includes(state.phase);
      by_id("stateStepBtn").textContent = state?.phase === "execute" ? "Freigegebene Weitergabe simulieren" : "Fortsetzen: einen Schritt ausführen";
      by_id("stateSaveBtn").disabled = !state;
      by_id("stateApproveBtn").disabled = !state || state.phase !== "approval";
      by_id("stateRejectBtn").disabled = !state || state.phase !== "approval";
      by_id("stateEditBtn").disabled = !state || !["review", "approval"].includes(state.phase);
      by_id("stateDraft").disabled = by_id("stateEditBtn").disabled;
    }
  }
  window.AgentLab.PmoEvaluationController = PmoEvaluationController;
  window.AgentLab.CheckpointController = CheckpointController;
})();
