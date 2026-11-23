// Minimaler DOM-Adapter ausschliesslich fuer Controller-Fehlerpfade.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
class Element {
  constructor(id) {
    this.id = id; this.value = ""; this.checked = false; this.disabled = false;
    this.innerHTML = ""; this.textContent = ""; this.listeners = {};
    this.classList = { add() {}, remove() {}, toggle() {} };
  }
  addEventListener(name, listener) { this.listeners[name] = listener; }
  querySelectorAll() { return []; }
}
module.exports = function controllerFixture(name) {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const elements = new Map([...html.matchAll(/id="([^"]+)"/g)].map(match => [match[1], new Element(match[1])]));
  for (const [id, value] of [["loopScenarioSelect", "success"], ["loopLimitKind", "steps"], ["loopRevisionIssue", "format"], ["loopRevisionOutcome", "corrected"], ["loopServiceState", "recovering"], ["harnessFault", "none"], ["harnessCallLimit", "2"]]) elements.get(id).value = value;
  for (const id of ["injectionSeparateData", "injectionBlockConfidential", "injectionAllowSend", "injectionToolPolicy", "injectionHumanApproval"]) elements.get(id).checked = true;
  const errors = [];
  const sandbox = {
    window: { dispatchEvent() {} }, performance, setTimeout, clearTimeout, AbortController, Event: class { constructor(type) { this.type = type; } },
    console: { log() {}, error(...args) { errors.push(args); } },
    document: {
      getElementById(id) { if (!elements.has(id)) throw Error("Missing HTML id: " + id); return elements.get(id); },
      querySelectorAll() { return []; }
    }
  };
  vm.createContext(sandbox);
  for (const source of ["domains.js", "engine.js", "patterns.js", "pmo_learning.js", "pattern_extensions.js"]) vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", source), "utf8"), sandbox);
  sandbox.window.AgentLab.sleep = async () => {};
  for (const source of ["loops.js", "harness.js"]) vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", source), "utf8"), sandbox);
  const controller = new sandbox.window.AgentLab[name]();
  return { controller, elements, errors };
};
