// Ausführungs-Engine: Mock-Modus (1.5B-Sim & Strong-Sim) + optionales Live-LLM via WebGPU/WebLLM

const WEBLLM_MODELS = {
  "webllm-1.5b": "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
  "webllm-3b": "Qwen2.5-3B-Instruct-q4f16_1-MLC"
};

class ExecutionEngine {
  constructor() {
    this.mode = "mock-small";
    this.webllmEngine = null;
    this.loadedModelId = null;
    this.model_engines = new Map();
    this.model_load_ms = new Map();
  }

  setMode(mode) {
    this.mode = mode;
    const model_id = WEBLLM_MODELS[mode];
    if (this.model_engines.has(model_id)) {
      this.webllmEngine = this.model_engines.get(model_id);
      this.loadedModelId = model_id;
    }
  }

  isWebLLM() {
    return this.mode.startsWith("webllm-");
  }

  isSmallMock() {
    return this.mode === "mock-small";
  }

  async loadWebLLM(onProgress, mode = this.mode) {
    if (!("gpu" in navigator)) {
      throw new Error("WebGPU ist in diesem Browser nicht verfügbar. Der Mock-Modus mit vorbereiteten Antworten bleibt nutzbar. Für lokale Modellaufrufe ist ein Browser mit WebGPU-Unterstützung erforderlich.");
    }
    const modelId = WEBLLM_MODELS[mode];
    if (!modelId) return;
    if (this.model_engines.has(modelId) || (this.webllmEngine && this.loadedModelId === modelId)) {
      if (mode === this.mode && this.model_engines.has(modelId)) {
        this.webllmEngine = this.model_engines.get(modelId);
        this.loadedModelId = modelId;
      }
      onProgress?.({ progress: 1, text: `Modell ${modelId} bereits geladen.` });
      return;
    }

    const load_start = performance.now();
    onProgress?.({ progress: 0.05, text: "WebLLM-Bibliothek wird geladen…" });
    const webllm = await import("https://esm.run/@mlc-ai/web-llm");
    onProgress?.({ progress: 0.1, text: `Initialisiere ${modelId} (einmaliger Download in den Browser-Cache)…` });

    const model_engine = await webllm.CreateMLCEngine(modelId, {
      initProgressCallback: (report) => {
        onProgress?.({
          progress: report.progress ?? 0.2,
          text: report.text || "Modelldaten werden geladen…"
        });
      }
    });
    this.model_engines.set(modelId, model_engine);
    this.model_load_ms.set(modelId, Math.round(performance.now() - load_start));
    if (mode === this.mode) {
      this.webllmEngine = model_engine;
      this.loadedModelId = modelId;
    }
  }

  /**
   * Führt einen einzelnen LLM-Aufruf aus (entweder echtes WebLLM oder realistische Mock-Antwort).
   * Interne JSON-Keys bleiben englisch für maximale Stabilität bei kleinen Modellen.
   */
  async callLLM({ systemPrompt, userPrompt, mockSmallFn, mockStrongFn, temperature = 0.2, maxTokens = 220, modelMode = this.mode }) {
    const start = performance.now();

    if (modelMode.startsWith("webllm-")) {
      const requested_model = WEBLLM_MODELS[modelMode];
      const backend = this.model_engines.get(requested_model) || (this.loadedModelId === requested_model ? this.webllmEngine : null);
      if (!requested_model || !backend) {
        throw new Error("Das gewählte WebGPU-Modell ist noch nicht geladen. Bitte zuerst „Modell laden“ wählen.");
      }
      const resp = await backend.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature,
        max_tokens: maxTokens
      });
      const text = resp.choices?.[0]?.message?.content?.trim() || "";
      const tokensEstimated = !Number.isFinite(resp.usage?.total_tokens);
      const tokens = tokensEstimated
        ? Math.max(40, Math.round((systemPrompt.length + userPrompt.length + text.length) / 4))
        : resp.usage.total_tokens;
      return {
        text,
        tokens,
        ms: Math.round(performance.now() - start),
        source: requested_model,
        simulated: false,
        tokensEstimated
      };
    }

    // Mock-Modus mit realistischer Schritt-Verzögerung für gute Sichtbarkeit im Flow-Graph
    if (!["mock-small", "mock-strong"].includes(modelMode)) throw new Error("Unbekannter Ausführungsmodus.");
    const delay = modelMode === "mock-small" ? 260 : 210;
    await sleep(delay);
    const fn = modelMode === "mock-small" ? mockSmallFn : (mockStrongFn || mockSmallFn);
    const mock = fn();
    return {
      text: mock.text,
      tokens: mock.tokens || 180,
      ms: Math.round(performance.now() - start) + (mock.extraMs || 0),
      source: modelMode === "mock-small" ? "Mock 1.5B" : "Mock Strong",
      simulated: true,
      tokensEstimated: true
    };
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const engine = new ExecutionEngine();

window.AgentLab = window.AgentLab || {};
window.AgentLab.sleep = sleep;
window.AgentLab.engine = engine;
