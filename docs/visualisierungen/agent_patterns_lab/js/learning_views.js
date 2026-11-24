(function () {
  const { engine, pmo_learning: learning } = window.AgentLab;
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
  const by_id = (id) => document.getElementById(id);
  const pretty = (value) => JSON.stringify(value, null, 2);
  const phase_labels = {
    research: "Recherche",
    write: "Schreiben",
    review: "Prüfung",
    approval: "Unterbrochen: Freigabe nötig",
    execute: "Freigegeben: Weitergabe simulieren",
    finished: "Beendet",
    blocked: "Gesperrt: manuelle Prüfung",
  };

  class PmoEvaluationController {
    constructor() {
      this.rows = [];
      this.baseline = null;
      this.config = null;
      this.complete = false;
      this.running = false;
      this.selected = 0;
      this.lab = window.AgentLab.evaluation_lab;
      by_id("evalCase").innerHTML =
        learning.pmo_cases
          .map(
            (item) =>
              '<option value="' +
              item.id +
              '">' +
              escape(item.label) +
              "</option>",
          )
          .join("") + '<option value="all">Alle drei Fälle</option>';
      by_id("evalCase").addEventListener("change", () => {
        this.render_cases();
        this.render_baseline();
      });
      by_id("engineMode").addEventListener("change", () => this.render_mode());
      by_id("evalRunBtn").addEventListener("click", () => this.run());
      by_id("evalCandidateRunBtn").addEventListener("click", () =>
        this.run(true),
      );
      by_id("evalCandidateCancelBtn").addEventListener("click", () => {
        this.cancelled = true;
        by_id("evalProgress").textContent =
          "Stopp angefordert; der aktuelle Modellaufruf läuft noch zu Ende.";
      });
      by_id("evalCancelBtn").addEventListener("click", () => {
        this.cancelled = true;
        by_id("evalProgress").textContent =
          "Stopp angefordert; der aktuelle Modellaufruf läuft noch zu Ende.";
      });
      by_id("evalPinBaselineBtn").addEventListener("click", () => {
        if (this.running || !this.complete) return;
        this.baseline = this.lab.make_baseline(this.config, this.rows);
        this.render_rows();
        this.render_baseline();
      });
      by_id("evalClearBaselineBtn").addEventListener("click", () => {
        if (this.running) return;
        this.baseline = null;
        this.render_rows();
        this.render_baseline();
      });
      by_id("evalSaveReviewBtn").addEventListener("click", () =>
        this.save_review(),
      );
      this.render_cases();
      this.render_mode();
      this.render_rows();
      this.render_baseline();
    }
    selected_cases() {
      return learning.pmo_cases.filter(
        (item) =>
          by_id("evalCase").value === "all" ||
          item.id === by_id("evalCase").value,
      );
    }
    render_mode() {
      const live = engine.isWebLLM();
      by_id("evalMockProfile").disabled = live || this.running;
      by_id("evalMode").textContent = live
        ? "WebGPU: echte Modellaufrufe. Die Zusatzanweisung wird verwendet; Fehlerprofile sind deaktiviert."
        : "Mock: Antworten und Fehlerprofile sind vorgegeben. Änderungen an der Zusatzanweisung werden dokumentiert, verändern die Mock-Antworten aber nicht. Wiederholungen zeigen hier keine Modellstreuung.";
    }
    render_cases() {
      by_id("evalCriteria").innerHTML = this.selected_cases()
        .map(
          (item) =>
            "<details open><summary>" +
            escape(item.label) +
            "</summary><p><strong>Aufgabe:</strong> " +
            escape(item.query) +
            "</p><ul>" +
            item.expected_facts
              .map(
                (fact) =>
                  "<li>" +
                  escape(item.field_help[fact.key]) +
                  ": <strong>" +
                  escape(fact.value) +
                  "</strong>; Beleg aus " +
                  escape(fact.source_id) +
                  ".</li>",
              )
              .join("") +
            "<li>Offen bleiben: " +
            escape(
              item.expected_open
                .map((key) => item.question_help[key] || key)
                .join(", "),
            ) +
            ".</li><li>" +
            escape(
              item.expected_blocked
                ? "Erwartet: Die angefragte Antwort bleibt mangels Beleg gesperrt. Das ist hier korrektes Verhalten."
                : "Erwartet: Belegte Angaben beantworten; offene Punkte bleiben ausdrücklich offen.",
            ) +
            "</li></ul><details><summary>Quellen und genaue Referenzwerte ansehen</summary><pre>" +
            escape(pretty(item.sources)) +
            "</pre><pre>" +
            escape(pretty(item.expected_facts)) +
            "</pre></details></details>",
        )
        .join("");
    }
    render_baseline() {
      const value = this.baseline;
      by_id("evalBaseline").textContent = value
        ? "Festgehalten: " +
          value.config.version +
          " · " +
          value.config.mode +
          " · " +
          value.config.cases.length +
          " Fälle · " +
          value.config.repetitions +
          " Wiederholung(en). Weitere Messungen ersetzen diese Baseline nicht."
        : "Noch keine Baseline. Messe zuerst die Ausgangsversion und halte die vollständige Messung ausdrücklich fest.";
      by_id("evalPinBaselineBtn").disabled = this.running || !this.complete;
      by_id("evalPinBaselineBtn").textContent = value
        ? "Baseline ausdrücklich durch letzte Messung ersetzen"
        : "Letzte vollständige Messung als Baseline festhalten";
      by_id("evalClearBaselineBtn").disabled = this.running || !value;
      by_id("evalRunBtn").textContent = value
        ? "Version aus Schritt 4 messen"
        : "Ausgangsversion messen";
      by_id("evalCandidateRunBtn").disabled = this.running || !value;
      by_id("evalComparisonNotice").textContent = !value
        ? "Ein Vergleich wird nach dem Festhalten einer Baseline möglich."
        : !this.config
          ? "Die Baseline bleibt bis zum ausdrücklichen Ersetzen unverändert."
          : value.key !== this.lab.comparison_key(this.config)
            ? "Kein direkter Vergleich: Modellmodus, Testfälle, Wiederholungszahl oder Bewertungsdefinition passen nicht zur Baseline. Gleiche Bedingungen wählen oder bewusst eine neue Baseline festlegen."
            : "Vergleich gegen die feste Baseline pro Fall, Variante und Wiederholung. Verbesserungen und Rückschritte werden pro Kriterium getrennt ausgewiesen.";
      by_id("evalBaselineConfig").textContent = value
        ? pretty(value.config)
        : "Noch keine Konfiguration festgehalten.";
    }
    async run(candidate = false) {
      if (this.running) return;
      if (candidate && !this.baseline) {
        by_id("evalProgress").textContent =
          "Bitte zuerst eine Baseline messen und ausdrücklich festhalten.";
        return;
      }
      if (
        by_id("runPatternBtn").disabled ||
        by_id("runHarnessBtn").disabled ||
        (engine.isWebLLM() && by_id("loadModelBtn").disabled)
      ) {
        by_id("evalProgress").textContent =
          "Bitte laufende Modell- oder Musteraufrufe zuerst beenden.";
        return;
      }
      const cases = this.selected_cases(),
        repetitions = Number(by_id("evalRepetitions").value);
      if (!cases.length || ![1, 3].includes(repetitions)) {
        by_id("evalProgress").textContent =
          "Bitte mindestens einen Fall und eine erlaubte Wiederholungszahl wählen.";
        return;
      }
      this.config = {
        version:
          by_id(
            candidate ? "evalCandidateVersion" : "evalVersion",
          ).value.trim() || "unbenannt",
        mode: engine.mode,
        model: engine.isWebLLM() ? engine.loadedModelId : engine.mode,
        cases: cases.map((item) => item.id),
        repetitions,
        instructions: by_id("evalInstructions").value.trim(),
        mock_profile: engine.isWebLLM()
          ? "none"
          : by_id("evalMockProfile").value,
      };
      this.rows = [];
      this.selected = 0;
      this.running = true;
      this.complete = false;
      this.cancelled = false;
      const controls = [
        "engineMode",
        "loadModelBtn",
        "runPatternBtn",
        "runAllBtn",
        "runHarnessBtn",
        "evalRunBtn",
        "evalCandidateRunBtn",
        "evalCandidateVersion",
        "evalCase",
        "evalInstructions",
        "evalVersion",
        "evalRepetitions",
        "evalMockProfile",
      ];
      const previous = controls.map((id) => by_id(id).disabled);
      controls.forEach((id) => (by_id(id).disabled = true));
      by_id("evalCancelBtn").disabled = false;
      by_id("evalCandidateCancelBtn").disabled = false;
      this.render_rows();
      this.render_baseline();
      try {
        for (let trial = 1; trial <= repetitions; trial++) {
          for (const item of cases) {
            for (const variant of learning.eval_variants) {
              if (this.cancelled) break;
              const label =
                item.label + " · " + variant.label + " · Wiederholung " + trial;
              by_id("evalProgress").textContent = label;
              try {
                const row = await learning.run_eval(
                  item,
                  variant.id,
                  this.config.instructions,
                  engine,
                  (message) => {
                    by_id("evalProgress").textContent = label + ": " + message;
                    if (this.cancelled) throw new Error("Messung angehalten.");
                  },
                  { mock_profile: this.config.mock_profile },
                );
                this.rows.push({ ...row, trial });
              } catch (error) {
                this.rows.push({
                  case_id: item.id,
                  variant: variant.id,
                  trial,
                  error: error.message,
                });
              }
              this.selected = this.rows.length - 1;
              this.render_rows();
            }
            if (this.cancelled) break;
          }
          if (this.cancelled) break;
        }
        this.complete =
          !this.cancelled && this.lab.is_complete(this.config, this.rows);
        by_id("evalProgress").textContent = this.cancelled
          ? "Angehalten. Teilergebnisse ersetzen keine Baseline."
          : this.complete
            ? "Messung abgeschlossen. Die Einzelkriterien liegen vor; die fachliche Bewertung der freien Antwort steht noch aus."
            : "Mit technischen Fehlern beendet. Diese Messung kann keine Baseline ersetzen.";
      } finally {
        this.running = false;
        controls.forEach((id, index) => (by_id(id).disabled = previous[index]));
        by_id("evalCancelBtn").disabled = true;
        by_id("evalCandidateCancelBtn").disabled = true;
        this.render_mode();
        this.render_rows();
        this.render_baseline();
      }
    }
    change_text(row) {
      const change = this.lab.compare(row, this.baseline, this.config);
      if (!change) return "Kein vergleichbarer Referenzlauf";
      const parts = [];
      if (change.regressions.length)
        parts.push(
          "Rückschritt: " +
            change.regressions
              .map((key) => this.lab.criterion_labels[key])
              .join("; "),
        );
      if (change.improvements.length)
        parts.push(
          "Verbessert: " +
            change.improvements
              .map((key) => this.lab.criterion_labels[key])
              .join("; "),
        );
      if (change.human === "regression")
        parts.push("Menschliches Urteil verschlechtert");
      if (change.human === "improvement")
        parts.push("Menschliches Urteil verbessert");
      return (
        parts.join(" | ") ||
        "Automatische Kriterien unverändert; menschliche Urteile nur bei beidseitiger Bewertung vergleichbar"
      );
    }
    render_rows() {
      by_id("evalResults").innerHTML = this.rows
        .map((row, index) => {
          const assessment = this.lab.assess(row);
          const state = row.error
            ? "Technischer Fehler"
            : assessment.overall_pass
              ? "Vollständig bestanden"
              : !assessment.automated_pass
                ? "Automatisch nicht bestanden"
                : assessment.human_status === "fail"
                  ? "Fachlich nicht bestanden"
                  : "Fachliche Prüfung offen";
          return (
            "<tr><td>" +
            escape(learning.case_by_id(row.case_id).label) +
            "<br/>Versuch " +
            row.trial +
            "</td><td>" +
            escape(
              learning.eval_variants.find((value) => value.id === row.variant)
                .label,
            ) +
            "</td><td>" +
            escape(state) +
            "<br/>" +
            assessment.passed +
            "/" +
            assessment.total +
            " automatische Kriterien</td><td>" +
            escape(this.change_text(row)) +
            "</td><td>" +
            escape(row.calls ?? "–") +
            " / " +
            escape(row.tools ?? "–") +
            "</td><td>" +
            escape(
              row.tokens === undefined
                ? "–"
                : (row.simulated ? "sim. " : row.tokens_estimated ? "≈ " : "") +
                    row.tokens,
            ) +
            "</td><td>" +
            (row.elapsed_ms === undefined
              ? "–"
              : (row.elapsed_ms / 1000).toFixed(2) + " s") +
            '</td><td><button class="btn btn-ghost btn-sm" data-eval-row="' +
            index +
            '">Prüfen</button></td></tr>'
          );
        })
        .join("");
      by_id("evalResults")
        .querySelectorAll("[data-eval-row]")
        .forEach((button) =>
          button.addEventListener("click", () => {
            if (this.running) return;
            this.selected = Number(button.dataset.evalRow);
            this.render_detail();
          }),
        );
      by_id("evalMeasuredConfig").textContent = this.config
        ? pretty(this.config)
        : "Noch keine Messung.";
      const summaries = this.lab.summarize(this.rows);
      by_id("evalSummary").innerHTML = this.rows.length
        ? summaries
            .map(
              (summary) =>
                "<p><strong>" +
                escape(
                  learning.eval_variants.find(
                    (value) => value.id === summary.variant,
                  ).label,
                ) +
                ":</strong> " +
                summary.automated +
                "/" +
                summary.count +
                " automatisch bestanden; " +
                summary.passed +
                "/" +
                summary.count +
                " vollständig bestanden; " +
                summary.reviewed +
                " menschlich bewertet; " +
                summary.errors +
                " technische Fehler. Zeitspanne: " +
                (summary.min_ms === null
                  ? "–"
                  : (summary.min_ms / 1000).toFixed(2) +
                    "–" +
                    (summary.max_ms / 1000).toFixed(2) +
                    " s") +
                ".</p>",
            )
            .join("")
        : "Noch keine Messwerte.";
      this.render_detail();
    }
    render_detail() {
      const row = this.rows[this.selected];
      by_id("evalSaveReviewBtn").disabled =
        this.running || !row || Boolean(row.error);
      by_id("evalReviewStatus").textContent = row?.human
        ? "Gespeichertes Urteil für diese konkrete Ausgabe. Änderungen müssen erneut gespeichert werden."
        : "Noch kein menschliches Urteil für diese Ausgabe.";
      for (const key of Object.keys(this.lab.rubric)) {
        by_id("evalHuman_" + key).value = row?.human?.[key] || "pending";
        by_id("evalHuman_" + key).disabled =
          this.running || !row || Boolean(row.error);
      }
      by_id("evalHumanNote").disabled =
        this.running || !row || Boolean(row.error);
      by_id("evalHumanNote").value = row?.human?.note || "";
      if (!row) {
        by_id("evalDetail").textContent =
          "Nach einer Messung eine Ausgabe über „Prüfen“ auswählen.";
        return;
      }
      if (row.error) {
        by_id("evalDetail").textContent = row.error;
        return;
      }
      const assessment = this.lab.assess(row);
      by_id("evalDetail").innerHTML =
        "<p><strong>" +
        escape(learning.case_by_id(row.case_id).label) +
        " · " +
        escape(
          learning.eval_variants.find((value) => value.id === row.variant)
            .label,
        ) +
        " · Versuch " +
        row.trial +
        "</strong></p><ul>" +
        Object.entries(assessment.checks)
          .map(
            ([key, passed]) =>
              "<li>" +
              (passed ? "Bestanden: " : "Nicht bestanden: ") +
              escape(this.lab.criterion_labels[key]) +
              (this.lab.critical.includes(key)
                ? " <strong>(kritisch)</strong>"
                : "") +
              "</li>",
          )
          .join("") +
        "</ul><p>" +
        escape(this.change_text(row)) +
        "</p><p><strong>Freie Antwort – gegen die Quellen prüfen:</strong></p><pre>" +
        escape(row.result?.answer || row.raw) +
        "</pre><p><strong>Interner Modell-Reviewer:</strong> " +
        escape(
          row.review_status === "not_applicable"
            ? "In dieser Architektur nicht vorhanden"
            : row.review_status === "accepted"
              ? "Akzeptiert"
              : "Negativ oder ungültig",
        ) +
        ". Dieses Urteil gehört zum erzeugenden System; es ersetzt nicht die externe Evaluation.</p><details><summary>Quellen für die menschliche Prüfung</summary><pre>" +
        escape(pretty(learning.case_by_id(row.case_id).sources)) +
        "</pre></details><details><summary>Strukturierte Ausgabe, Tool-Beobachtungen und Ablauf</summary><pre>" +
        escape(pretty(row.result)) +
        "</pre><pre>" +
        escape(pretty(row.tool_observations)) +
        "</pre><pre>" +
        escape(row.trace.join("\n")) +
        "</pre></details>";
    }
    save_review() {
      const row = this.rows[this.selected];
      if (this.running || !row || row.error) return;
      try {
        row.human = this.lab.human_review({
          ...Object.fromEntries(
            Object.keys(this.lab.rubric).map((key) => [
              key,
              by_id("evalHuman_" + key).value,
            ]),
          ),
          note: by_id("evalHumanNote").value,
        });
        this.render_rows();
        by_id("evalReviewStatus").textContent =
          "Menschliches Urteil für diese Ausgabe gespeichert. Die festgehaltene Baseline bleibt unverändert.";
      } catch (error) {
        by_id("evalReviewStatus").textContent = error.message;
      }
    }
  }

  class CheckpointController {
    constructor() {
      this.state = null;
      this.before = null;
      this.history = [];
      this.saved = null;
      this.session_id = null;
      this.loaded_from_checkpoint = false;
      by_id("stateCase").innerHTML = learning.pmo_cases
        .map(
          (item) =>
            '<option value="' +
            item.id +
            '">' +
            escape(item.label) +
            "</option>",
        )
        .join("");
      by_id("stateSession").addEventListener("input", () => this.render());
      by_id("stateCase").addEventListener("change", () => this.render());
      by_id("stateNewBtn").addEventListener("click", () =>
        this.perform(() => {
          const id = by_id("stateSession").value.trim();
          learning.checkpoint_key(id);
          const next = learning.new_state(
            by_id("stateCase").value,
            by_id("stateInjectError").checked,
          );
          this.session_id = id;
          this.state = next;
          this.before = null;
          this.loaded_from_checkpoint = false;
          this.history = [
            "Neuer Arbeitsstand angelegt. Ein vorhandener gespeicherter Checkpoint wird dabei nicht verändert.",
          ];
        }, "Neuer Lauf gestartet. Recherche, Entwurf und Prüfung führen schrittweise bis zur Freigabepause."),
      );
      for (const [id, action] of [
        ["stateStepBtn", "step"],
        ["stateFinishBtn", "step"],
        ["stateApproveBtn", "approve"],
        ["stateRejectBtn", "reject"],
        ["stateEditBtn", "edit"],
      ])
        by_id(id).addEventListener("click", () =>
          this.perform(() => {
            const next = learning.transition(
              this.state,
              action,
              by_id("stateDraft").value,
            );
            this.before = this.state;
            this.state = next;
            const label = {
              step: "Arbeitsschritt",
              approve: "Freigabe",
              reject: "Ablehnung",
              edit: "Entwurf geändert",
            }[action];
            this.history.push(label + ": " + phase_labels[next.phase]);
            this.history = this.history.slice(-30);
          }, "Arbeitsstand aktualisiert. Änderungen sind erst nach ausdrücklichem Speichern im Checkpoint enthalten."),
        );
      by_id("stateSaveBtn").addEventListener("click", () =>
        this.perform(() => {
          if (by_id("stateSession").value.trim() !== this.session_id)
            throw new Error(
              "Zum Speichern die Session-ID des aktiven Laufs verwenden.",
            );
          this.saved = learning.save_checkpoint(
            window.localStorage,
            this.session_id,
            this.state,
          );
          this.before = this.state;
          this.history.push(
            "Checkpoint gespeichert; der bisherige Speicherstand derselben Session wurde ersetzt. Der Arbeitsstand bleibt unverändert.",
          );
        }, "Checkpoint gespeichert. Nach dem Neuladen stellen dieselbe Session-ID und „Checkpoint laden“ den gespeicherten Arbeitsstand wieder her."),
      );
      by_id("stateLoadBtn").addEventListener("click", () =>
        this.perform(() => {
          const id = by_id("stateSession").value.trim();
          const checkpoint = learning.load_checkpoint(window.localStorage, id);
          this.before = this.state;
          this.state = checkpoint.state;
          this.saved = checkpoint;
          this.session_id = id;
          this.loaded_from_checkpoint = true;
          this.history = [
            "Checkpoint geladen. Der zuvor aktive Arbeitsstand wurde ersetzt. Kein Arbeitsschritt und keine Weitergabe wurden ausgeführt.",
          ];
        }, "Checkpoint geladen. Das Laden stellt nur den Arbeitsstand wieder her. Ein weiterer Schritt oder die ausstehende Freigabe muss ausdrücklich ausgelöst werden."),
      );
      by_id("stateReloadBtn").addEventListener("click", () =>
        window.location.reload(),
      );
      by_id("stateDeleteBtn").addEventListener("click", () =>
        this.perform(() => {
          window.localStorage.removeItem(
            learning.checkpoint_key(by_id("stateSession").value.trim()),
          );
          this.before = this.state;
        }, "Gespeicherter Checkpoint gelöscht. Der aktuelle Arbeitsstand bleibt erhalten und kann erneut gespeichert werden."),
      );
      this.render();
    }
    perform(action, message) {
      try {
        action();
        this.render();
        by_id("stateMessage").textContent = message;
      } catch (error) {
        by_id("stateMessage").textContent = error.message;
      }
    }
    inspect_checkpoint(id) {
      this.storage_error = "";
      this.stored_exists = false;
      try {
        const key = learning.checkpoint_key(id);
        this.stored_exists = window.localStorage.getItem(key) !== null;
        return this.stored_exists
          ? learning.load_checkpoint(window.localStorage, id)
          : null;
      } catch (error) {
        this.storage_error = error.message;
        return null;
      }
    }
    render() {
      const state = this.state,
        id = by_id("stateSession").value.trim();
      this.saved = this.inspect_checkpoint(id);
      const same = Boolean(state && this.session_id === id);
      const clean = Boolean(
        same &&
          this.saved &&
          JSON.stringify(state) === JSON.stringify(this.saved.state),
      );
      by_id("stateStatus").textContent = state
        ? this.session_id + " · " + phase_labels[state.phase]
        : "Kein aktiver Arbeitsstand";
      by_id("stateSessionHint").textContent =
        state && !same
          ? "Aktiver Lauf: " +
            this.session_id +
            ". Ausgewählt: " +
            (id || "keine ID") +
            ". Speichern ist gesperrt, bis beide IDs übereinstimmen. Laden würde den aktiven Arbeitsstand ersetzen."
          : this.storage_error
            ? "Speicherhinweis: " + this.storage_error
            : this.saved
              ? "Unter dieser ID liegt bereits ein Checkpoint. Er ist sichtbar, wird aber erst durch „Checkpoint laden“ als Arbeitsstand übernommen."
              : "Unter dieser ID liegt noch kein gespeicherter Checkpoint.";
      by_id("stateTask").textContent = state
        ? state.query
        : learning.case_by_id(by_id("stateCase").value).query;
      by_id("statePhase").textContent = state
        ? phase_labels[state.phase]
        : "Noch kein Lauf";
      by_id("stateDraftStatus").textContent = !state?.draft
        ? "Noch kein Entwurf"
        : state.quality === "accepted"
          ? "Automatisch geprüft – entspricht der festen Musterantwort"
          : "Noch nicht akzeptiert oder zur Überarbeitung";
      by_id("stateApprovalStatus").textContent = !state
        ? "Noch keine Freigabe"
        : state.approved
          ? "Freigabe für diesen Entwurf erteilt"
          : state.phase === "approval"
            ? "Freigabe ausstehend"
            : "Freigabe noch nicht erteilt";
      by_id("stateDirtyStatus").textContent = !state
        ? "Kein aktueller Arbeitsstand"
        : !same
          ? "Andere Session-ID ausgewählt – Speicherstand nicht vergleichbar"
          : this.storage_error
            ? "Speicherstand kann nicht verlässlich geprüft werden"
            : !this.saved
              ? "Noch nicht gespeichert"
              : clean
                ? "Keine ungespeicherten Änderungen"
                : "Ungespeicherte Änderungen vorhanden";
      by_id("stateCheckpointSummary").textContent = this.saved
        ? "Gespeicherte Session: " +
          this.saved.session_id +
          " · Phase: " +
          phase_labels[this.saved.state.phase] +
          " · gespeichert am " +
          this.saved.saved_at +
          ". Ein neuer Speichervorgang ersetzt diesen Checkpoint."
        : this.storage_error
          ? "Checkpoint nicht verfügbar: " + this.storage_error
          : "Für die ausgewählte ID ist kein Checkpoint gespeichert.";
      const next = !state
        ? this.saved
          ? "Schritt 4: Checkpoint laden und danach ausdrücklich fortsetzen."
          : "Schritt 1: Einen neuen Lauf starten."
        : state.phase === "approval"
          ? this.loaded_from_checkpoint
            ? "Wiederhergestellt: Aktuellen Entwurf freigeben und danach die Weitergabe simulieren."
            : clean
              ? "Schritt 4: Session-ID notieren, Seite neu laden und den Checkpoint unter derselben ID laden."
              : "Schritt 3: Jetzt den Arbeitsstand an der Freigabepause speichern."
          : {
              research: "Schritt 2: Recherche durchführen.",
              write: "Schritt 2: Entwurf erstellen.",
              review: "Schritt 2: Entwurf prüfen.",
              execute:
                "Schritt 4: Die freigegebene Weitergabe direkt dort simulieren.",
              finished:
                "Der Lauf ist beendet. Der letzte Arbeitsstand lässt sich speichern; ein neuer Lauf ist ebenfalls möglich.",
              blocked:
                "Der Lauf ist gesperrt. Eine Fortsetzung braucht einen neuen oder korrigierten Auftrag.",
            }[state.phase];
      by_id("stateNextAction").textContent = next;
      by_id("stateDraftPreview").textContent =
        state?.draft ||
        "Ein Entwurf erscheint nach dem Schritt „Entwurf erstellen“.";
      by_id("stateRuntime").textContent = state
        ? pretty(state)
        : "Noch kein Arbeitsstand.";
      by_id("stateSaved").textContent = this.saved
        ? pretty(this.saved)
        : "Kein lesbarer Checkpoint für die ausgewählte ID.";
      const changes =
        state && this.before ? learning.state_diff(this.before, state) : [];
      const field_names = {
        phase: "Arbeitsphase",
        research: "Rechercheergebnis",
        draft: "Entwurf",
        attempts: "Entwurfsversuche",
        quality: "Automatischer Prüfstatus",
        approved: "Menschliche Freigabe",
        blocked: "Weitergabe gesperrt",
        feedback: "Prüfhinweis",
        output: "Simulierte Ausgabe",
      };
      const value = (key, item) =>
        key === "phase"
          ? phase_labels[item]
          : typeof item === "boolean"
            ? item
              ? "Ja"
              : "Nein"
            : typeof item === "string"
              ? item.length > 100
                ? item.slice(0, 100) + "…"
                : item || "leer"
              : pretty(item);
      by_id("stateChangeSummary").innerHTML = changes.length
        ? "<ul>" +
          changes
            .map(
              (change) =>
                "<li><strong>" +
                escape(field_names[change.key] || change.key) +
                ":</strong> " +
                escape(value(change.key, change.before)) +
                " → " +
                escape(value(change.key, change.after)) +
                "</li>",
            )
            .join("") +
          "</ul>"
        : this.before
          ? "<p>Der Arbeitsstand wurde durch die letzte Aktion nicht verändert. Speichern und Löschen eines Checkpoints verändern nur den Speicherstand.</p>"
          : "<p>Nach dem ersten Arbeitsschritt werden die Änderungen hier sichtbar.</p>";
      by_id("stateDiff").innerHTML =
        changes
          .map(
            (change) =>
              "<details><summary>" +
              escape(change.key) +
              '</summary><div class="state-change"><pre>' +
              escape(pretty(change.before)) +
              "</pre><pre>" +
              escape(pretty(change.after)) +
              "</pre></div></details>",
          )
          .join("") || "<p>Keine Feldänderung.</p>";
      by_id("stateHistory").textContent = this.history.join("\n");
      by_id("stateDraft").value = state?.draft || "";
      by_id("stateStepBtn").disabled =
        !state || ["approval", "finished", "blocked"].includes(state.phase);
      by_id("stateStepBtn").textContent = state
        ? {
            research: "Recherche durchführen",
            write: "Entwurf erstellen",
            review: "Entwurf prüfen",
            execute: "Freigegebene Weitergabe simulieren",
          }[state.phase] || "Nächster Arbeitsschritt"
        : "Nächster Arbeitsschritt";
      by_id("stateSaveBtn").disabled = !state || !same;
      by_id("stateLoadBtn").disabled = !this.saved;
      by_id("stateDeleteBtn").disabled = !this.stored_exists;
      by_id("stateApproveBtn").disabled = !state || state.phase !== "approval";
      by_id("stateFinishBtn").disabled = !state || state.phase !== "execute";
      by_id("stateRejectBtn").disabled = by_id("stateApproveBtn").disabled;
      by_id("stateEditBtn").disabled =
        !state || !["review", "approval"].includes(state.phase);
      by_id("stateDraft").disabled = by_id("stateEditBtn").disabled;
    }
  }
  window.AgentLab.PmoEvaluationController = PmoEvaluationController;
  window.AgentLab.CheckpointController = CheckpointController;
})();
