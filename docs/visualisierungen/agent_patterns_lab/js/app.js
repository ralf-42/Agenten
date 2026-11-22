(function () {
const { engine, PATTERNS, PatternsController, HarnessController, LoopsController } = window.AgentLab;

const patternsCtrl = new PatternsController();
new HarnessController();
new LoopsController();

function switchView(viewName) {
  document.querySelectorAll(".nav-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.view === viewName);
  });
  document.querySelectorAll(".view").forEach((v) => {
    v.classList.toggle("active", v.id === `view-${viewName}`);
  });
}

document.querySelectorAll(".nav-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const view = tab.dataset.view;
    switchView(view);
    if (view === "harness") window.location.hash = "harness";
    else if (view === "loops") window.location.hash = "loops";
    else window.location.hash = patternsCtrl.activeId;
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
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(current === "light" ? "dark" : "light");
});

// Engine-Modus & WebLLM Loader
const modeSelect = document.getElementById("engineMode");
const loadModelBtn = document.getElementById("loadModelBtn");
const webllmStatus = document.getElementById("webllmStatus");
const webllmStatusText = document.getElementById("webllmStatusText");
const webllmProgressWrap = document.getElementById("webllmProgressWrap");
const webllmProgressFill = document.getElementById("webllmProgressFill");

modeSelect.addEventListener("change", () => {
  engine.setMode(modeSelect.value);
  const isWeb = engine.isWebLLM();
  loadModelBtn.classList.toggle("hidden", !isWeb);
  webllmStatus.classList.toggle("hidden", !isWeb);
  if (isWeb) {
    webllmStatusText.textContent = "WebGPU-Modus gewählt. Klicke auf „Modell laden“, um das LLM lokal im Browser zu initialisieren (kein API-Key).";
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
    webllmStatusText.textContent = "✓ Lokales WebGPU-Modell geladen und einsatzbereit!";
  } catch (err) {
    webllmStatusText.textContent = `Fehler: ${err.message} (Wechsle zurück in den Mock-Modus oder nutze Chrome/Edge mit WebGPU.)`;
  } finally {
    loadModelBtn.disabled = false;
  }
});

// Hash-Routing (#augmented, #react, ..., #harness, #loops)
function handleHash() {
  const hash = window.location.hash.replace(/^#/, "").trim();
  if (!hash) return;
  if (hash === "harness") {
    switchView("harness");
  } else if (hash === "loops") {
    switchView("loops");
  } else if (PATTERNS.some((p) => p.id === hash)) {
    switchView("patterns");
    patternsCtrl.selectPattern(hash);
  }
}

window.addEventListener("hashchange", handleHash);
handleHash();
})();
