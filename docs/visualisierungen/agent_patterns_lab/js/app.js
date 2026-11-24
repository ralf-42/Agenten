(function () {
  const {
    engine,
    PATTERNS,
    PatternsController,
    HarnessController,
    LoopsController,
    PmoEvaluationController,
    CheckpointController,
  } = window.AgentLab;

  const patternsCtrl = new PatternsController();
  new HarnessController();
  new window.AgentLab.InjectionController();
  let activeView = "docs";
  new LoopsController();
  new PmoEvaluationController();
  new CheckpointController();

  function switchView(viewName) {
    if (viewName === "patterns" && !patternsCtrl.isRunning) {
      const active = PATTERNS.find(
        (pattern) => pattern.id === patternsCtrl.activeId,
      );
      if (active?.group === "governance")
        patternsCtrl.selectPattern("augmented");
    }
    activeView = viewName;
    document
      .querySelectorAll(".nav-tab")
      .forEach((tab) =>
        tab.classList.toggle("active", tab.dataset.view === viewName),
      );
    document
      .querySelectorAll(".view")
      .forEach((view) =>
        view.classList.toggle("active", view.id === "view-" + viewName),
      );
    if (viewName === "harness")
      window.AgentLab.show_harness_panel("components");
    updateModeNote();
  }

  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const view = tab.dataset.view;
      switchView(view);
      window.location.hash = view === "patterns" ? patternsCtrl.activeId : view;
    });
  });

  document
    .querySelectorAll('[data-harness-panel="controls"]')
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (!patternsCtrl.isRunning) {
          const active = PATTERNS.find(
            (pattern) => pattern.id === patternsCtrl.activeId,
          );
          patternsCtrl.selectPattern(
            active?.group === "governance" ? active.id : "hitl",
          );
        }
      });
    });

  // Hell-/Dunkelmodus mit localStorage-Persistenz
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggleBtn.textContent = theme === "light" ? "☾ Dunkel" : "☀ Hell";
    try {
      localStorage.setItem("agent_patterns_lab_theme", theme);
    } catch (_) {}
  }

  const savedTheme = (() => {
    try {
      return localStorage.getItem("agent_patterns_lab_theme");
    } catch (_) {
      return null;
    }
  })();
  applyTheme(savedTheme === "light" ? "light" : "dark");

  themeToggleBtn.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "light" ? "dark" : "light");
  });

  // Engine-Modus & WebLLM Loader
  const modeSelect = document.getElementById("engineMode");
  const loadModelBtn = document.getElementById("loadModelBtn");
  const webllmStatus = document.getElementById("webllmStatus");
  const webllmStatusText = document.getElementById("webllmStatusText");
  const webllmProgressWrap = document.getElementById("webllmProgressWrap");
  const webllmProgressFill = document.getElementById("webllmProgressFill");

  function updateModeNote() {
    const securityPanel =
      activeView === "harness" &&
      !document
        .getElementById("harnessSecurityPanel")
        .classList.contains("hidden");
    const deterministic =
      ["loops", "checkpoints"].includes(activeView) || securityPanel;
    const orientation = ["docs", "context"].includes(activeView);
    const orientationNote = activeView === "context"
      ? "Kontext & Wissen: Die verlinkten Visualisierungen öffnen in einem neuen Tab. Modellwahl und Modellladen werden in den Modell-Demos verfügbar."
      : "Die Reiter öffnen die einzelnen Themen. Für die ersten Übungen genügen die vorbereiteten Beispielantworten.";
    document.getElementById("modelModeControls").disabled =
      deterministic || orientation;
    document.getElementById("executionModeNote").textContent = deterministic
      ? "Deterministische Lernsimulation ohne Modellaufrufe. Die Modellwahl hat in dieser Ansicht keine Wirkung; sie bleibt für die Modell-Demos erhalten."
      : orientation
        ? orientationNote
        : engine.isWebLLM()
          ? "WebGPU-Modus: Echte lokale Modellaufrufe nach dem Laden des gewählten Modells. Geschätzte Tokenzahlen sind markiert; die Demo-Zeit enthält Animationen und menschliche Pausen."
          : "Mock-Modus: Antworten und Tokenzahlen sind vorgegeben. Die Demo-Zeit enthält künstliche Wartezeiten; das ist keine Messung der Modellleistung.";
    webllmStatus.classList.toggle(
      "hidden",
      deterministic || orientation || !engine.isWebLLM(),
    );
  }
  window.addEventListener("agentlab:contextchange", updateModeNote);
  updateModeNote();

  modeSelect.addEventListener("change", () => {
    engine.setMode(modeSelect.value);
    patternsCtrl.selectPattern(patternsCtrl.activeId);
    patternsCtrl.renderMatrix();
    const isWeb = engine.isWebLLM();
    loadModelBtn.classList.toggle("hidden", !isWeb);
    updateModeNote();
    if (isWeb) {
      webllmStatusText.textContent =
        "WebGPU-Modus gewählt. „Modell laden“ startet das lokale Sprachmodell im Browser. Ein API-Key ist nicht erforderlich.";
      webllmProgressWrap.classList.add("hidden");
    }
  });

  loadModelBtn.addEventListener("click", async () => {
    loadModelBtn.disabled = true;
    webllmProgressWrap.classList.remove("hidden");
    try {
      await engine.loadWebLLM(({ progress, text }) => {
        webllmProgressFill.style.width = `${Math.min(100, Math.round(progress * 100))}%`;
        webllmStatusText.textContent = text;
      });
      webllmStatusText.textContent =
        "✓ Lokales WebGPU-Modell geladen und einsatzbereit!";
    } catch (err) {
      webllmStatusText.textContent = `Fehler: ${err.message} (Der Mock-Modus bleibt als Alternative verfügbar. Lokale Modellaufrufe benötigen WebGPU-Unterstützung.)`;
    } finally {
      loadModelBtn.disabled = false;
    }
  });

  document
    .getElementById("loadTierModelsBtn")
    .addEventListener("click", async () => {
      const buttons = [
        "loadTierModelsBtn",
        "runPatternBtn",
        "runAllBtn",
        "engineMode",
        "loadModelBtn",
      ];
      buttons.forEach((id) => {
        document.getElementById(id).disabled = true;
      });
      const status = document.getElementById("tierModelStatus");
      try {
        for (const mode of ["webllm-1.5b", "webllm-3b"]) {
          await engine.loadWebLLM(({ text }) => {
            status.textContent = text;
          }, mode);
        }
        status.textContent =
          "Beide Modellstufen geladen. Einmalige Ladezeiten werden getrennt vom Vergleich ausgewiesen.";
      } catch (error) {
        status.textContent = `Laden fehlgeschlagen: ${error.message}. Kein stiller Mock-Fallback.`;
      } finally {
        buttons.forEach((id) => {
          document.getElementById(id).disabled = false;
        });
      }
    });

  // Hash-Routing (#augmented, #react, ..., #harness, #loops)
  function handleHash() {
    const hash = window.location.hash.replace(/^#/, "").trim();
    if (!hash) {
      switchView("docs");
      return;
    }
    if (hash === "prompt_injection") {
      switchView("harness");
      window.AgentLab.show_harness_panel("security");
    } else if (
      ["harness", "loops", "evaluation", "checkpoints", "context", "docs"].includes(hash)
    ) {
      switchView(hash);
    } else if (PATTERNS.some((p) => p.id === hash)) {
      const pattern = PATTERNS.find((p) => p.id === hash);
      switchView(pattern.group === "governance" ? "harness" : "patterns");
      patternsCtrl.selectPattern(hash);
    }
  }

  window.addEventListener("hashchange", handleHash);
  handleHash();
})();
