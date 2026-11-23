(function () {
  const { sleep } = window.AgentLab;
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const questions = [
    {
      id: "progress",
      name: "1. Wann ist die Aufgabe erledigt?",
      desc: "Erfolgskriterien prüfen und fehlenden Fortschritt erkennen. Hier: Beide benötigten Quellen sind gefunden; zwei Suchen ohne neue Quelle bedeuten Stillstand.",
    },
    {
      id: "limits",
      name: "2. Wann muss der Lauf stoppen?",
      desc: "Die gewählte Grenze für Schritte, simulierte Tokens oder Laufzeit prüfen. Zusätzlich begrenzt dieser Schalter im Fehlerfall die Wartezeit auf eine Tool-Antwort.",
    },
    {
      id: "verification",
      name: "3. Wie prüfen und überarbeiten wir Ergebnisse?",
      desc: "Ein Ergebnis gegen feste Kriterien prüfen und bei Fehlern gezielt überarbeiten. Hier: Antwortformat und belegter Terminverzug; höchstens zwei Entwürfe. Tool- und Datenrechte vertieft Agent Harness.",
    },
    {
      id: "retry_policy",
      name: "4. Wie reagieren wir auf technische Fehler?",
      desc: "Nur vorübergehende Fehler erneut versuchen: höchstens drei Versuche insgesamt, mit wachsenden Wartezeiten und kleinen Zeitversätzen. Einen fehlerhaften Auftrag nicht unverändert wiederholen.",
    },
    {
      id: "idempotency",
      name: "5. Wie verhindern wir doppelte Aktionen?",
      desc: "Eine feste Vorgangs-ID sorgt dafür, dass derselbe Auftrag bei Wiederholung nur einmal wirkt. Eine verlorene Bestätigung beweist nicht, dass die Aktion fehlgeschlagen ist.",
    },
    {
      id: "safe_exit",
      name: "6. Wie endet ein erfolgloser Lauf sinnvoll?",
      desc: "Erledigte und offene Schritte mit einer Begründung zur menschlichen Prüfung vorlegen. Bei unklarer Ausführung einer Schreibaktion erst klären, statt blind erneut zu senden.",
    },
  ];
  const labels = {
    completed: "Ziel erreicht",
    blocked: "Aufruf blockiert",
    stopped: "Kontrolliert gestoppt",
    error: "Technischer Fehler",
    unsafe: "Unsicherer Simulationsverlauf",
    review_required: "Menschliche Klärung nötig",
    approval_required: "Wartet auf Entscheidung",
  };

  // Reine Lernsimulation: keine Modellaufrufe, Netzwerkanfragen oder Schreibaktionen.
  function simulate_loop({
    scenario = "success",
    enabled = questions.map((item) => item.id),
    limit_kind = "steps",
    revision_issue = "format",
    revision_outcome = "corrected",
    service = "recovering",
    circuit_breaker = false,
  } = {}) {
    const active = new Set(enabled),
      triggered = new Set(),
      events = [];
    const state = {
      calls: 0,
      tokens: 0,
      time_ms: 0,
      tools: 0,
      effects: 0,
      evidence: [],
      breaker: "closed",
    };
    const has = (id) => active.has(id);
    const log = (stage, kind, message) =>
      events.push({
        stage,
        kind,
        message,
        iter: state.calls,
        time_ms: state.time_ms,
      });
    const done = (status, reason, open = []) => {
      log("decide", "ENDE", reason);
      let report = null;
      if (
        has("safe_exit") &&
        !["completed", "unsafe", "approval_required"].includes(status)
      ) {
        triggered.add("safe_exit");
        report = {
          completed: state.evidence.length
            ? "Gefundene Quellen: " + state.evidence.join(", ")
            : state.effects
              ? "Eine Aktion wurde simuliert ausgeführt; ihr Zustand ist vor einem neuen Auftrag zu prüfen."
              : "Kein abschließendes Arbeitsergebnis.",
          open: open.length
            ? open
            : ["Aufgabe fachlich prüfen und das weitere Vorgehen festlegen."],
          reason,
        };
        log(
          "decide",
          "PRÜFBERICHT",
          "Teilergebnis, offene Schritte und Abbruchgrund werden zur menschlichen Prüfung vorgelegt.",
        );
      }
      return {
        status,
        reason,
        report,
        state,
        events,
        triggered: [...triggered],
      };
    };
    const spend = (milliseconds) => {
      if (
        has("limits") &&
        limit_kind === "time" &&
        state.time_ms + milliseconds > 8000
      ) {
        triggered.add("limits");
        return false;
      }
      state.time_ms += milliseconds;
      return true;
    };
    const next = (duration = 1500) => {
      if (has("limits")) {
        if (
          (limit_kind === "steps" && state.calls >= 3) ||
          (limit_kind === "tokens" && state.tokens + 180 > 500)
        ) {
          triggered.add("limits");
          return false;
        }
      }
      if (!spend(duration)) return false;
      state.calls++;
      state.tokens += 180;
      log(
        "inspect",
        "SCHRITT",
        "Schritt " + state.calls + ": Zustand und verbleibende Grenzen prüfen.",
      );
      return true;
    };
    const limited = () =>
      done(
        "stopped",
        "Laufgrenze erreicht: " +
          ({
            steps: "höchstens drei Schritte",
            tokens: "höchstens 500 simulierte Tokens",
            time: "höchstens acht simulierte Sekunden",
          }[limit_kind] || limit_kind),
        ["Fehlende Arbeit erst mit neuem Auftrag und Budget fortsetzen."],
      );
    log(
      "inspect",
      "SIMULATION",
      "Vorgegebener Lernfall; Zeit, Tokenverbrauch und Aktionen sind simuliert. Das Protokoll bleibt immer aktiv.",
    );

    if (scenario === "success" || scenario === "runaway") {
      let stagnant = 0;
      for (let turn = 0; turn < 6; turn++) {
        if (!next()) return limited();
        state.tools++;
        const source =
          scenario === "success" ? (turn === 0 ? "DOC-101" : "DOC-102") : null;
        const added = source && !state.evidence.includes(source);
        if (added) {
          state.evidence.push(source);
          stagnant = 0;
        } else stagnant++;
        log(
          "act",
          "SUCHE",
          "search_docs(query='Projektstatus Variante " +
            (turn + 1) +
            "') → " +
            (added ? "neue Quelle " + source : "keine neue Quelle"),
        );
        log(
          "verify",
          "FORTSCHRITT",
          state.evidence.length +
            "/2 benötigte Quellen; " +
            stagnant +
            " Schritte ohne neue Information.",
        );
        if (has("progress") && state.evidence.length === 2) {
          triggered.add("progress");
          return done(
            "completed",
            "Erfolgskriterium erfüllt: Beide benötigten Quellen liegen vor. Weitere Suchen sind unnötig.",
          );
        }
        if (has("progress") && stagnant >= 2) {
          triggered.add("progress");
          return done(
            "stopped",
            "Zwei Suchschritte ohne neue Quelle: Stillstand trotz wechselnder Suchanfragen.",
            [
              "Suchstrategie ändern oder fehlende Quelle beim Menschen erfragen.",
            ],
          );
        }
      }
      return done(
        "unsafe",
        "Die Demonstration endet nach sechs Schritten. Diese Vorführgrenze ist keine aktive Schutzmaßnahme des Agenten.",
      );
    }

    if (scenario === "revision") {
      const expected = {
        answer: "Der Terminverzug beträgt zwei Wochen.",
        delay_weeks: 2,
        source_id: "DOC-101",
      };
      for (let attempt = 1; attempt <= 2; attempt++) {
        if (!next()) return limited();
        const corrected = attempt === 2 && revision_outcome === "corrected";
        const draft = corrected
          ? JSON.stringify(expected)
          : revision_issue === "format"
            ? '{"answer":'
            : JSON.stringify({ ...expected, delay_weeks: 99 });
        log("act", "ENTWURF", "Entwurf " + attempt + ": " + draft);
        if (!has("verification"))
          return done(
            "unsafe",
            "Ohne Ergebnisprüfung wird der fehlerhafte Entwurf ungeprüft übernommen.",
          );
        triggered.add("verification");
        let result = null;
        try {
          result = JSON.parse(draft);
        } catch (_) {}
        const format = Boolean(
          result &&
            typeof result.answer === "string" &&
            Number.isInteger(result.delay_weeks) &&
            typeof result.source_id === "string",
        );
        const supported =
          format && result.delay_weeks === 2 && result.source_id === "DOC-101";
        if (supported) {
          state.evidence.push("DOC-101");
          log(
            "verify",
            "PRÜFUNG",
            "Format und belegter Faktenwert stimmen mit der vorgegebenen Quelle überein.",
          );
          return done(
            "completed",
            "Der zweite Entwurf erfüllt die festen Kriterien. Die gezielte Überarbeitung hat den Fehler korrigiert.",
          );
        }
        const feedback = !format
          ? "Erzeuge vollständiges JSON mit answer, delay_weeks und source_id."
          : "Korrigiere delay_weeks auf den in DOC-101 belegten Wert 2; erfinde keinen Terminverzug.";
        log("verify", "PRÜFBERICHT", feedback);
        if (attempt === 2)
          return done(
            "stopped",
            "Überarbeitungslimit erreicht: Auch der zweite Entwurf erfüllt die Kriterien nicht.",
            ["Fehlerbericht und Entwurf fachlich prüfen lassen."],
          );
        log(
          "decide",
          "ÜBERARBEITUNG",
          "Ein neuer Entwurf erhält den konkreten Prüfhinweis. Das ist inhaltliche Korrektur, kein Retry einer technischen Anfrage.",
        );
      }
    }

    if (scenario === "tool_failure") {
      let failures = 0;
      for (let attempt = 1; attempt <= 3; attempt++) {
        const successful = service === "recovering" && attempt === 3;
        const duration = successful ? 500 : has("limits") ? 1000 : 3000;
        if (!next(duration)) return limited();
        state.tools++;
        if (successful) {
          log(
            "act",
            "TOOL",
            "Der vorübergehend gestörte Dienst antwortet wieder.",
          );
          if (state.breaker === "half_open") {
            state.breaker = "closed";
            log(
              "verify",
              "CIRCUIT",
              "Test erfolgreich: Circuit Breaker wieder geschlossen.",
            );
          }
          return done(
            "completed",
            "Tool erfolgreich nach " +
              attempt +
              " Versuchen; die erwarteten Daten liegen vor.",
          );
        }
        failures++;
        log(
          "act",
          has("limits") ? "TIMEOUT" : "FEHLER",
          has("limits")
            ? "Tool-Wartezeit nach einer simulierten Sekunde beendet. Vorübergehender Fehler; Seiteneffekt ist in diesem reinen Lesefall ausgeschlossen."
            : "Dienst antwortet drei simulierte Sekunden lang nicht; danach wird eine vorgegebene Fehlerrückgabe angenommen.",
        );
        if (state.breaker === "half_open") {
          state.breaker = "open";
          triggered.add("circuit_breaker");
          return done(
            "error",
            "Kontrollierter Testaufruf ebenfalls fehlgeschlagen: Circuit Breaker wieder offen.",
          );
        }
        if (!has("retry_policy"))
          return done(
            "error",
            "Kein automatischer Wiederholungsversuch konfiguriert.",
            ["Dienstzustand prüfen oder später einen neuen Lauf starten."],
          );
        triggered.add("retry_policy");
        if (attempt === 3)
          return done(
            "error",
            "Retry-Budget ausgeschöpft: drei Versuche insgesamt.",
            ["Dienst prüfen; keine weiteren automatischen Versuche."],
          );
        if (circuit_breaker && failures >= 2) {
          triggered.add("circuit_breaker");
          state.breaker = "open";
          log(
            "decide",
            "CIRCUIT",
            "Nach zwei Fehlern offen: Weitere Aufrufe werden während der Ruhezeit unterdrückt.",
          );
          if (!spend(5000)) return limited();
          state.breaker = "half_open";
          log(
            "inspect",
            "CIRCUIT",
            "Nach fünf simulierten Sekunden ein einzelner Testaufruf (halb offen).",
          );
        } else {
          const delay = attempt === 1 ? 1100 : 2200;
          if (!spend(delay)) return limited();
          log(
            "decide",
            "BACKOFF",
            "Vor nächstem Versuch " +
              (delay / 1000).toFixed(1) +
              " simulierte Sekunden warten; wachsender Abstand plus vorgegebener kleiner Zeitversatz (Jitter).",
          );
        }
      }
    }

    if (scenario === "side_effect") {
      if (!next()) return limited();
      state.tools++;
      state.effects = 1;
      log(
        "act",
        "SCHREIBAKTION",
        "send_document mit Vorgangs-ID TX-101 simuliert ausgeführt; die Bestätigung geht verloren.",
      );
      log(
        "verify",
        "UNGEWISS",
        "Keine Bestätigung bedeutet nicht, dass die Aktion ausgeblieben ist.",
      );
      if (!has("idempotency") && has("safe_exit")) {
        triggered.add("safe_exit");
        return done(
          "review_required",
          "Ausführungszustand unklar und kein Idempotenz-Schutz: Keine automatische Wiederholung.",
          [
            "Vor erneutem Senden prüfen lassen, ob TX-101 bereits ausgeführt wurde.",
          ],
        );
      }
      if (!has("retry_policy"))
        return done(
          "stopped",
          "Ohne Retry-Regel wird kein zweiter Versuch gestartet. Der Ausführungszustand bleibt ungeklärt.",
        );
      triggered.add("retry_policy");
      if (!spend(1100) || !next()) return limited();
      state.tools++;
      if (has("idempotency")) {
        triggered.add("idempotency");
        log(
          "act",
          "IDEMPOTENZ",
          "TX-101 ist bekannt: Bestätigung des ersten Auftrags zurückgeben, keine zweite Ausführung.",
        );
        return done(
          "completed",
          "Wiederholung bestätigt; die Aktion wirkt genau einmal in diesem simulierten Vorgangsregister.",
        );
      }
      state.effects++;
      log(
        "act",
        "DOPPELAKTION",
        "Ungeprüfter Retry löst dieselbe Aktion ein zweites Mal aus.",
      );
      return done("unsafe", "Zwei simulierte Ausführungen desselben Auftrags.");
    }

    return done("error", "Unbekanntes Szenario.");
  }

  class LoopsController {
    constructor() {
      this.enabled = new Set(questions.map((item) => item.id));
      this.running = false;
      this.gridEl = document.getElementById("techniquesGrid");
      this.traceEl = document.getElementById("loopTraceList");
      this.outcomeEl = document.getElementById("loopOutcomeSummary");
      this.badgeEl = document.getElementById("loopResultBadge");
      document
        .getElementById("toggleAllTechBtn")
        .addEventListener("click", () => {
          if (!this.running) {
            this.enabled = new Set(questions.map((item) => item.id));
            this.renderTechniques();
          }
        });
      document
        .getElementById("disableAllTechBtn")
        .addEventListener("click", () => {
          if (!this.running) {
            this.enabled.clear();
            this.renderTechniques();
          }
        });
      document
        .getElementById("runLoopBtn")
        .addEventListener("click", () => this.runSimulation());
      document
        .getElementById("loopScenarioSelect")
        .addEventListener("change", () => this.renderScenario());
      this.renderTechniques();
      this.renderScenario();
    }
    renderScenario() {
      const scenario = document.getElementById("loopScenarioSelect").value;
      document
        .getElementById("loopRevisionControls")
        .classList.toggle("hidden", scenario !== "revision");
      document
        .getElementById("loopServiceControls")
        .classList.toggle("hidden", scenario !== "tool_failure");
    }
    renderTechniques(triggered = []) {
      document.getElementById("activeTechCount").textContent =
        this.enabled.size + " / 6 aktiv";
      this.gridEl.innerHTML = questions
        .map(
          (item) =>
            '<label class="tech-toggle' +
            (this.enabled.has(item.id) ? " enabled" : "") +
            (triggered.includes(item.id) ? " triggered" : "") +
            '"><input type="checkbox" data-tech="' +
            item.id +
            '" ' +
            (this.enabled.has(item.id) ? "checked" : "") +
            " " +
            (this.running ? "disabled" : "") +
            " /><div><strong>" +
            item.name +
            "</strong><span>" +
            item.desc +
            "</span></div></label>",
        )
        .join("");
      this.gridEl.querySelectorAll("input[data-tech]").forEach((input) =>
        input.addEventListener("change", () => {
          if (this.running) return;
          if (input.checked) this.enabled.add(input.dataset.tech);
          else this.enabled.delete(input.dataset.tech);
          this.renderTechniques();
        }),
      );
    }
    renderTrace(events) {
      this.traceEl.innerHTML = events
        .map(
          (event) =>
            '<div class="trace-entry"><span class="trace-time">' +
            (event.time_ms / 1000).toFixed(1) +
            " s · Schritt " +
            event.iter +
            '</span><span class="trace-kind">' +
            escape(event.kind) +
            "</span><div>" +
            escape(event.message) +
            "</div></div>",
        )
        .join("");
      this.traceEl.scrollTop = this.traceEl.scrollHeight;
    }
    renderResult(result) {
      this.renderTrace(result.events);
      this.renderTechniques(result.triggered);
      this.badgeEl.className =
        "status-badge status-" +
        (result.status === "completed"
          ? "pass"
          : result.status === "unsafe"
            ? "fail"
            : "warn");
      this.badgeEl.textContent = labels[result.status];
      document.getElementById("loopIterCount").textContent =
        result.state.calls +
        " Schritte · " +
        result.state.tokens +
        " simulierte Tokens · " +
        (result.state.time_ms / 1000).toFixed(1) +
        " simulierte Sekunden";
      let report = "";
      if (result.report)
        report =
          '<div class="precheck-alert"><strong>Prüfbericht für einen Menschen</strong><p>' +
          escape(result.report.completed) +
          "</p><p>Offen: " +
          result.report.open.map(escape).join(" ") +
          "</p></div>";
      this.outcomeEl.innerHTML =
        "<p>" +
        escape(result.reason) +
        "</p>" +
        report +
        '<p class="muted-sm">Dies ist eine deterministische Lernsimulation. Kein Modell, kein Netzwerkzugriff und keine tatsächliche Schreibaktion. Ein sicherer Stopp ist noch kein fachlich gelöster Auftrag.</p>';
      document
        .querySelectorAll("#loopCycleDiagram .cycle-step")
        .forEach((element) => {
          element.classList.remove("active", "pass", "fail");
          if (element.dataset.stage === "decide")
            element.classList.add(
              result.status === "completed"
                ? "pass"
                : result.status === "unsafe"
                  ? "fail"
                  : "active",
            );
        });
    }
    reportControllerError(error) {
      console.error("Loop-Controller:", error);
      if (this.badgeEl) {
        this.badgeEl.className = "status-badge status-fail";
        this.badgeEl.textContent = "Technischer Fehler in der Oberfläche";
      }
      if (this.outcomeEl)
        this.outcomeEl.textContent =
          "Die Simulation konnte nicht angezeigt werden: " +
          String(error.message || error);
    }
    async runSimulation() {
      if (this.running) return;
      this.running = true;
      this.last_triggered = [];
      const ids = [
        "runLoopBtn",
        "loopScenarioSelect",
        "toggleAllTechBtn",
        "disableAllTechBtn",
        "loopLimitKind",
        "loopRevisionIssue",
        "loopRevisionOutcome",
        "loopServiceState",
        "loopCircuitBreaker",
      ];
      const previous = ids.map(
        (id) => document.getElementById(id)?.disabled || false,
      );
      const setDisabled = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.disabled = value;
      };
      try {
        ids.forEach((id) => setDisabled(id, true));
        this.renderTechniques();
        this.badgeEl.textContent = "Simuliert…";
        const result = simulate_loop({
          scenario: document.getElementById("loopScenarioSelect").value,
          enabled: [...this.enabled],
          limit_kind: document.getElementById("loopLimitKind").value,
          revision_issue: document.getElementById("loopRevisionIssue").value,
          revision_outcome: document.getElementById("loopRevisionOutcome")
            .value,
          service: document.getElementById("loopServiceState").value,
          circuit_breaker:
            document.getElementById("loopCircuitBreaker").checked,
        });
        for (let index = 0; index < result.events.length; index++) {
          this.renderTrace(result.events.slice(0, index + 1));
          await sleep(55);
        }
        this.last_triggered = result.triggered;
        this.renderResult(result);
      } catch (error) {
        this.reportControllerError(error);
      } finally {
        this.running = false;
        ids.forEach((id, index) => setDisabled(id, previous[index]));
        try {
          this.renderTechniques(this.last_triggered);
        } catch (error) {
          this.reportControllerError(error);
        }
      }
    }
  }
  window.AgentLab.loop_learning = { questions, simulate_loop };
  window.AgentLab.LoopsController = LoopsController;
})();
