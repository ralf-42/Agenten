(function () {
const { DOMAINS, TOOLS, engine, sleep } = window.AgentLab;

const HARNESS_SCENARIOS = {
  pmo: {
    label: "PMO-Assistent (Briefing)",
    task: "Steuerkreis-Briefing aus DOC-101 & DOC-102 erstellen. Das Harness erzwingt Quellen-ID-Prüfung und blockiert vertrauliche Dateien (DOC-103) unabhängig von der Modellmeinung.",
    tools: ["validate_source_ids", "check_confidentiality"],
    records: () => ({ "DOC-101": DOMAINS.pmo.sources["DOC-101"], "DOC-102": DOMAINS.pmo.sources["DOC-102"] }),
    defaultMemory: [
      "Quellenpflicht: Jede Aussage im Briefing muss mit [DOC-101] oder [DOC-102] belegt sein.",
      "Vertraulichkeit: Dokumente mit Markierung [VERTRAULICH] (z. B. DOC-103) niemals einbinden oder versenden."
    ],
    guardrailCheck: (mem) => {
      const hasConf = mem.some((m) => /vertraulich|DOC-103/i.test(m));
      const hasSrc = mem.some((m) => /quellen|DOC-101/i.test(m));
      return {
        passed: hasConf && hasSrc,
        note: hasConf && hasSrc
          ? "Guardrail OK: Quellen-IDs [DOC-101]/[DOC-102] validiert; DOC-103 bleibt technisch gesperrt."
          : "Guardrail-Warnung: Ohne Quellen- und Vertraulichkeitsregel im Memory drohen unbelegte Aussagen oder Datenlecks!"
      };
    },
    suggestedFeedback: "Offene Entscheidungen (z. B. externes Audit) immer als eigenen Abschnitt ‚Offene Fragen‘ mit Verantwortlichem ausweisen."
  },
  insurance: {
    label: "Versicherung (CLM002)",
    task: "Schadenfall CLM002 (Auffahrunfall, Betrugsscore 0,84): Prüfe Deckung, Policy-Grenzen und erstelle eine sichere Kundenrückmeldung.",
    tools: ["get_claim", "calc_settlement", "policy_precheck"],
    records: () => DOMAINS.insurance.claims.CLM002,
    defaultMemory: [
      "Policy: Interne Betrugsscores niemals in Kundenkommunikation erwähnen.",
      "Prüfregel: Bei fehlendem Polizeibericht und Score > 0,70 immer menschliche Prüfung auslösen."
    ],
    guardrailCheck: (mem) => {
      const hasPolicy = mem.some((m) => /betrugsscore|score/i.test(m));
      return {
        passed: hasPolicy,
        note: hasPolicy
          ? "Guardrail OK: Entwurf hält Policy-Memory ein (kein Score geleakt, Status ‚in Prüfung‘)."
          : "Guardrail-Warnung: Ohne Policy-Eintrag im Memory droht Leaking des internen Betrugsscores!"
      };
    },
    suggestedFeedback: "Fehlende Unterlagen (Unfallbericht, Werkstattrechnung) immer als nummerierte Checkliste aufführen."
  },
  clinical: {
    label: "Klinik (Patient P004)",
    task: "Patient P004 (Warfarin 5mg) fragt nach Aspirin gegen Kopfschmerzen. Das Harness erzwingt den Aufruf der Wechselwirkungs-Datenbank.",
    tools: ["get_patient_vitals", "check_drug_interaction"],
    records: () => DOMAINS.clinical.patients.P004,
    defaultMemory: [
      "Klinik-Regel: Bei Blutverdünnern (Warfarin) niemals ohne Interaktions-Tool antworten."
    ],
    guardrailCheck: () => {
      const inter = TOOLS.check_drug_interaction("warfarin", "aspirin");
      return {
        passed: true,
        note: `Guardrail blockiert gefährliche Empfehlung: ${inter.severity} – ${inter.reason}`
      };
    },
    suggestedFeedback: "Bei abgelehntem Wirkstoff immer auf ärztliche Rücksprache hinweisen."
  },
  career: {
    label: "Karriereberatung (UX)",
    task: "Bewerberin Anna M. (Marketing → UX-Design): Lernplan erstellen; Zertifikate müssen aus der geprüften Tool-Whitelist stammen.",
    tools: ["validate_certifications"],
    records: () => DOMAINS.career.applicant,
    defaultMemory: [
      "Whitelist-Regel: Nur Google UX Design Certificate, Nielsen Norman UX Cert oder CareerFoundry UX Bootcamp vorschlagen."
    ],
    guardrailCheck: (mem) => {
      const hasRule = mem.some((m) => /whitelist|google ux|nielsen/i.test(m));
      return {
        passed: hasRule,
        note: hasRule
          ? "Schema- & Whitelist-Gate: Alle vorgeschlagenen Zertifikate wurden deterministisch verifiziert."
          : "Whitelist-Gate schlägt an: Modell halluzinierte ‚Figma Certification‘ und wurde korrigiert."
      };
    },
    suggestedFeedback: "Zeitaufwand pro Woche (max. 8 Std. berufsbegleitend) im Lernplan berücksichtigen."
  },
  drug: {
    label: "Pharma-Forschung (DM-3350)",
    task: "IND-Readiness für Wirkstoff DM-3350 prüfen. Fehlende Reproduktionstoxizität muss im Abschlussbericht verpflichtend markiert werden.",
    tools: ["check_compliance_rules"],
    records: () => DOMAINS.drug.compounds["DM-3350"],
    defaultMemory: [
      "Regulatorik: Fehlende Toxizitätsstudien als offene Auflage (Blocker) kennzeichnen."
    ],
    guardrailCheck: () => ({
      passed: true,
      note: "Compliance-Gate aktiv: Fehlende Reproduktionstoxizität wurde automatisch als offene Auflage markiert."
    }),
    suggestedFeedback: "Bei fehlender Reproduktionstoxizität automatisch ein Review-Ticket für das Tox-Team erzeugen."
  }
};

class HarnessController {
  constructor() {
    this.domain = "pmo";
    this.memoryByDomain = Object.fromEntries(
      Object.entries(HARNESS_SCENARIOS).map(([k, v]) => [k, [...v.defaultMemory]])
    );
    this.bindEvents();
    this.selectDomain("pmo");
  }

  bindEvents() {
    document.getElementById("harnessDomainTabs").addEventListener("click", (e) => {
      const btn = e.target.closest(".domain-btn");
      if (!btn) return;
      this.selectDomain(btn.dataset.domain);
    });

    document.getElementById("runHarnessBtn").addEventListener("click", () => this.runHarness());
    document.getElementById("clearMemoryBtn").addEventListener("click", () => {
      this.memoryByDomain[this.domain] = [];
      this.renderMemory();
    });

    document.getElementById("addMemoryBtn").addEventListener("click", () => {
      const input = document.getElementById("customMemoryInput");
      const val = input.value.trim();
      if (!val) return;
      this.memoryByDomain[this.domain].push(val);
      input.value = "";
      this.renderMemory();
    });
  }

  selectDomain(domain) {
    this.domain = domain;
    document.querySelectorAll("#harnessDomainTabs .domain-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.domain === domain);
    });
    document.getElementById("harnessTaskDesc").textContent = HARNESS_SCENARIOS[domain].task;
    this.resetLayers();
    this.renderMemory();
  }

  resetLayers() {
    ["layerInfoBody", "layerExecBody", "layerFeedbackBody"].forEach((id) => {
      document.getElementById(id).innerHTML = `<p class="muted-sm">Bereit für den Durchlauf.</p>`;
    });
    ["layerInfoBadge", "layerExecBadge", "layerFeedbackBadge"].forEach((id) => {
      const el = document.getElementById(id);
      el.className = "status-badge status-idle";
      el.textContent = "Bereit";
    });
  }

  renderMemory() {
    const list = this.memoryByDomain[this.domain];
    document.getElementById("memoryCount").textContent = `${list.length} Einträge`;
    const container = document.getElementById("harnessMemoryList");
    if (!list.length) {
      container.innerHTML = `<p class="muted-sm">Memory ist leer — starte jetzt einen Lauf, um zu sehen, wie das Harness ohne Vorwissen reagiert!</p>`;
      return;
    }
    container.innerHTML = list
      .map(
        (item, idx) => `
      <div class="memory-item">
        <span>${item}</span>
        <button class="btn btn-ghost btn-sm" data-del="${idx}">Entfernen</button>
      </div>`
      )
      .join("");

    container.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        list.splice(Number(btn.dataset.del), 1);
        this.renderMemory();
      });
    });
  }

  async runHarness() {
    const sc = HARNESS_SCENARIOS[this.domain];
    const mem = this.memoryByDomain[this.domain];
    this.resetLayers();

    // SCHICHT 1: INFORMATION LAYER
    const infoBadge = document.getElementById("layerInfoBadge");
    const infoBody = document.getElementById("layerInfoBody");
    infoBadge.className = "status-badge status-running";
    infoBadge.textContent = "Lädt…";
    infoBody.innerHTML = "";

    const rec = sc.records();
    infoBody.innerHTML += `<div class="layer-step"><strong>1. Datensatz-Abruf:</strong><br/><code>${JSON.stringify(rec).slice(0, 140)}…</code></div>`;
    await sleep(240);
    infoBody.innerHTML += `<div class="layer-step"><strong>2. Progressive Tool-Schemas:</strong><br/>Freigegebene Tools: ${sc.tools.map((t) => `<code>${t}</code>`).join(" ")}</div>`;
    await sleep(240);
    infoBody.innerHTML += `<div class="layer-step ${mem.length ? "ok" : "warn"}"><strong>3. Memory-Injektion (${mem.length}):</strong><br/>${
      mem.length ? mem.map((m) => `• ${m}`).join("<br/>") : "Kein Memory vorhanden (Kaltstart)."
    }</div>`;
    infoBadge.className = "status-badge status-pass";
    infoBadge.textContent = "Bereitgestellt";

    // SCHICHT 2: EXECUTION LAYER
    const execBadge = document.getElementById("layerExecBadge");
    const execBody = document.getElementById("layerExecBody");
    execBadge.className = "status-badge status-running";
    execBadge.textContent = "Läuft…";
    execBody.innerHTML = "";

    execBody.innerHTML += `<div class="layer-step"><strong>1. Plan:</strong> Relevante Daten prüfen, Tools ausführen, Antwort im Schema erzeugen.</div>`;
    await sleep(260);

    const llmRes = await engine.callLLM({
      systemPrompt: `You are running inside a 3-layer Agent Harness. Follow memory rules: ${mem.join(" | ")}. Reply in 1-2 German sentences.`,
      userPrompt: sc.task,
      mockSmallFn: () => ({
        text: `Entwurf für ${sc.label} auf Basis von ${sc.tools.join(", ")} und ${mem.length} Memory-Regel(n) erstellt.`,
        tokens: 210
      })
    });

    execBody.innerHTML += `<div class="layer-step"><strong>2. Modell &amp; Tools (${llmRes.tokens} Tokens):</strong><br/>${llmRes.text}</div>`;
    await sleep(240);

    const guard = sc.guardrailCheck(mem);
    execBody.innerHTML += `<div class="layer-step ${guard.passed ? "ok" : "fail"}"><strong>3. Policy-/Guardrail-Gate:</strong><br/>${guard.note}</div>`;
    execBadge.className = `status-badge status-${guard.passed ? "pass" : "fail"}`;
    execBadge.textContent = guard.passed ? "Gate OK" : "Gate blockiert";

    // SCHICHT 3: FEEDBACK LAYER
    const fbBadge = document.getElementById("layerFeedbackBadge");
    const fbBody = document.getElementById("layerFeedbackBody");
    fbBadge.className = "status-badge status-running";
    fbBadge.textContent = "Prüft…";
    fbBody.innerHTML = "";
    await sleep(240);

    fbBody.innerHTML += `<div class="layer-step ok"><strong>1. Schema-Verifikation:</strong> Pflichtfelder, Datensatz-Referenz und Status-Flags vollständig.</div>`;
    fbBody.innerHTML += `<div class="layer-step warn"><strong>2. HITL-Lernpunkt:</strong><br/>Vorschlag für künftige Läufe: <em>„${sc.suggestedFeedback}“</em><br/><button id="saveSuggestedFbBtn" class="btn btn-secondary btn-sm" style="margin-top:6px">+ Als Regel ins Memory übernehmen</button></div>`;
    fbBadge.className = "status-badge status-pass";
    fbBadge.textContent = "Abgeschlossen";

    document.getElementById("saveSuggestedFbBtn")?.addEventListener("click", (e) => {
      if (!mem.includes(sc.suggestedFeedback)) {
        mem.push(sc.suggestedFeedback);
        this.renderMemory();
      }
      e.target.disabled = true;
      e.target.textContent = "✓ Im Memory gespeichert (wirkt im nächsten Lauf)";
    });
  }
}

window.AgentLab.HarnessController = HarnessController;
})();
