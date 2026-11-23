// Alle Contract-Suiten automatisch entdecken; kein Paket und kein Modell erforderlich.
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const suites = fs.readdirSync(__dirname).filter(name => name.endsWith(".test.cjs")).sort();
if (!suites.length) {
  console.error("Keine Contract-Suite gefunden; die Pruefung ist unvollstaendig.");
  process.exit(2);
}
let failed = 0;
for (const suite of suites) {
  console.log("\nSuite:", suite);
  const result = spawnSync(process.execPath, [path.join(__dirname, suite)], {
    cwd: path.dirname(__dirname), stdio: "inherit", windowsHide: true
  });
  if (result.error || result.status !== 0) {
    failed++;
    console.error("Suite fehlgeschlagen:", suite, result.error?.message || result.signal || result.status);
  }
}
console.log("\n" + suites.length + " Suiten ausgefuehrt; " + failed + " fehlgeschlagen.");
process.exitCode = failed ? 1 : 0;
