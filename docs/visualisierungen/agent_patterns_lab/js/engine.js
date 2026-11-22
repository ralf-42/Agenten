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
  }

  setMode(mode) {
    this.mode = mode;
  }

  isWebLLM() {
    return this.mode.startsWith("webllm-");
  }

  isSmallMock() {
    return this.mode === "mock-small";
  }

  async loadWebLLM(onProgress) {
    if (!("gpu" in navigator)) {
      throw new Error("Dein Browser unterstützt kein WebGPU. Bitte Desktop-Chrome/Edge nutzen oder im Mock-Modus bleiben.");
    }
    const modelId = WEBLLM_MODELS[this.mode];
    if (!modelId) return;
    if (this.webllmEngine && this.loadedModelId === modelId) {
      onProgress?.({ progress: 1, text: `Modell ${modelId} bereits geladen.` });
      return;
    }

    onProgress?.({ progress: 0.05, text: "Lade WebLLM-Bibliothek…" });
    const webllm = await import("https://esm.run/@mlc-ai/web-llm");
    onProgress?.({ progress: 0.1, text: `Initialisiere ${modelId} (einmaliger Download in den Browser-Cache)…` });

    this.webllmEngine = await webllm.CreateMLCEngine(modelId, {
      initProgressCallback: (report) => {
        onProgress?.({
          progress: report.progress ?? 0.2,
          text: report.text || "Lade Modellgewichte…"
        });
      }
    });
    this.loadedModelId = modelId;
  }

  /**
   * Führt einen einzelnen LLM-Aufruf aus (entweder echtes WebLLM oder realistische Mock-Antwort).
   * Interne JSON-Keys bleiben englisch für maximale Stabilität bei kleinen Modellen.
   */
  async callLLM({ systemPrompt, userPrompt, mockSmallFn, mockStrongFn, temperature = 0.2, maxTokens = 220 }) {
    const start = performance.now();

    if (this.isWebLLM() && this.webllmEngine) {
      const resp = await this.webllmEngine.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature,
        max_tokens: maxTokens
      });
      const text = resp.choices?.[0]?.message?.content?.trim() || "";
      const tokens = resp.usage?.total_tokens || Math.max(40, Math.round((systemPrompt.length + userPrompt.length + text.length) / 4));
      return {
        text,
        tokens,
        ms: Math.round(performance.now() - start),
        source: this.loadedModelId
      };
    }

    // Mock-Modus mit realistischer Schritt-Verzögerung für gute Sichtbarkeit im Flow-Graph
    const delay = this.mode === "mock-small" ? 260 : 210;
    await sleep(delay);
    const fn = this.mode === "mock-small" ? mockSmallFn : (mockStrongFn || mockSmallFn);
    const mock = fn();
    return {
      text: mock.text,
      tokens: mock.tokens || 180,
      ms: Math.round(performance.now() - start) + (mock.extraMs || 0),
      source: this.mode === "mock-small" ? "Mock 1.5B" : "Mock Strong"
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
