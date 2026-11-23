(function () {
  const learning = window.AgentLab.pmo_learning;
  const copy = (value) => JSON.parse(JSON.stringify(value));
  const criterion_labels = {
    ...learning.check_labels,
    tool_use:
      "Freigegebene Quellen korrekt abgerufen; keine unerlaubte Aktion vorgeschlagen",
    completion:
      "Ablauf liefert einen Abschluss; interner Reviewer akzeptiert, falls vorhanden",
  };
  const critical = ["facts", "evidence", "blocking", "tool_use"];
  const rubric = {
    facts:
      "Freie Antwort stimmt mit Quellen und strukturierten Fakten überein; keine erfundenen Aussagen.",
    complete:
      "Die Frage wird beantwortet oder begründet offen gelassen; fehlende Angaben werden genannt.",
    clear:
      "Die Antwort ist verständlich und für den vorgesehenen Zweck nutzbar.",
  };
  function assess(row) {
    const checks = {
      ...Object.fromEntries(
        Object.keys(learning.check_labels).map((key) => [
          key,
          row.score?.checks?.[key] === true,
        ]),
      ),
    };
    const expected = Object.keys(learning.case_by_id(row.case_id).sources);
    const observed = row.tool_observations || [];
    const found = new Set(observed.flatMap((tool) => tool.source_ids || []));
    checks.tool_use =
      !row.error &&
      observed.length > 0 &&
      row.forbidden_actions === 0 &&
      observed.every(
        (tool) =>
          tool.tool === "read_sources" &&
          tool.success === true &&
          Array.isArray(tool.source_ids) &&
          tool.source_ids.every((id) => expected.includes(id)),
      ) &&
      expected.every((id) => found.has(id));
    checks.completion =
      !row.error &&
      Boolean(row.result) &&
      ["not_applicable", "accepted"].includes(row.review_status);
    const automated_pass = Object.values(checks).every(Boolean);
    const reviewed = Boolean(
      row.human &&
        Object.keys(rubric).every((key) =>
          ["yes", "no"].includes(row.human[key]),
        ),
    );
    const human_pass =
      reviewed && Object.keys(rubric).every((key) => row.human[key] === "yes");
    return {
      checks,
      passed: Object.values(checks).filter(Boolean).length,
      total: Object.keys(checks).length,
      critical_failures: critical.filter((key) => !checks[key]),
      automated_pass,
      human_status: !reviewed ? "pending" : human_pass ? "pass" : "fail",
      overall_pass: automated_pass && human_pass,
    };
  }
  function comparison_key(config) {
    return JSON.stringify({
      mode: config.mode,
      model: config.model,
      repetitions: config.repetitions,
      cases: [...config.cases].sort().map((id) => learning.case_by_id(id)),
      evaluator: "evaluation_lab_v1",
    });
  }
  function is_complete(config, rows) {
    if (
      !Array.isArray(config.cases) ||
      !config.cases.length ||
      new Set(config.cases).size !== config.cases.length ||
      ![1, 3].includes(config.repetitions)
    )
      return false;
    if (
      rows.length !==
        config.cases.length *
          learning.eval_variants.length *
          config.repetitions ||
      rows.some((row) => row.error)
    )
      return false;
    const keys = new Set(
      rows.map((row) => [row.case_id, row.variant, row.trial].join(":")),
    );
    return config.cases.every((id) =>
      learning.eval_variants.every((variant) =>
        Array.from(
          { length: config.repetitions },
          (_, index) => index + 1,
        ).every((trial) => keys.has([id, variant.id, trial].join(":"))),
      ),
    );
  }
  function make_baseline(config, rows) {
    if (!is_complete(config, rows))
      throw new Error(
        "Nur eine vollständige Messung ohne technische Fehler kann als Baseline festgehalten werden.",
      );
    return copy({
      key: comparison_key(config),
      config,
      rows,
      created_at: new Date().toISOString(),
    });
  }
  function compare(row, baseline, config) {
    if (!baseline || baseline.key !== comparison_key(config)) return null;
    const before = baseline.rows.find(
      (value) =>
        value.case_id === row.case_id &&
        value.variant === row.variant &&
        value.trial === row.trial,
    );
    if (!before) return null;
    const previous = assess(before),
      current = assess(row);
    return {
      regressions: Object.keys(criterion_labels).filter(
        (key) => previous.checks[key] && !current.checks[key],
      ),
      improvements: Object.keys(criterion_labels).filter(
        (key) => !previous.checks[key] && current.checks[key],
      ),
      human:
        previous.human_status === "pass" && current.human_status === "fail"
          ? "regression"
          : previous.human_status === "fail" && current.human_status === "pass"
            ? "improvement"
            : "not_compared",
    };
  }
  function summarize(rows) {
    return learning.eval_variants.map((variant) => {
      const values = rows.filter((row) => row.variant === variant.id),
        valid = values.filter((row) => !row.error);
      const times = valid.map((row) => row.elapsed_ms).filter(Number.isFinite);
      return {
        variant: variant.id,
        count: values.length,
        automated: values.filter((row) => assess(row).automated_pass).length,
        reviewed: values.filter((row) => assess(row).human_status !== "pending")
          .length,
        passed: values.filter((row) => assess(row).overall_pass).length,
        errors: values.filter((row) => row.error).length,
        min_ms: times.length ? Math.min(...times) : null,
        max_ms: times.length ? Math.max(...times) : null,
        calls: valid.reduce((sum, row) => sum + row.calls, 0),
        tokens: valid.reduce((sum, row) => sum + row.tokens, 0),
      };
    });
  }
  function human_review(values) {
    if (
      !Object.keys(rubric).every((key) => ["yes", "no"].includes(values[key]))
    )
      throw new Error(
        "Bitte alle drei menschlichen Prüfkriterien beantworten.",
      );
    if (
      Object.keys(rubric).some((key) => values[key] === "no") &&
      !values.note?.trim()
    )
      throw new Error("Bitte das negative Urteil kurz begründen.");
    return {
      ...Object.fromEntries(
        Object.keys(rubric).map((key) => [key, values[key]]),
      ),
      note: values.note?.trim() || "",
      reviewed_at: new Date().toISOString(),
    };
  }
  window.AgentLab.evaluation_lab = {
    criterion_labels,
    critical,
    rubric,
    assess,
    comparison_key,
    is_complete,
    make_baseline,
    compare,
    summarize,
    human_review,
  };
})();
