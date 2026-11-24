// Dokumentation und Lab müssen dieselben Bereiche und erreichbare Arbeitsreiter bieten.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const docs = path.resolve(__dirname, '../../..');
const lab = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const decode = text => text.replaceAll('&amp;', '&');
const pages = [];

function collect(folder) {
  for (const entry of fs.readdirSync(folder, {withFileTypes: true})) {
    if (entry.name.startsWith('_') || entry.name === 'visualisierungen') continue;
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) collect(file);
    else if (entry.name.endsWith('.md')) {
      const source = fs.readFileSync(file, 'utf8');
      const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!front) continue;
      const meta = {};
      for (const line of front[1].split(/\r?\n/)) {
        const match = line.match(/^(title|parent|grand_parent|nav_exclude|has_children):\s*(.+)$/);
        if (match) meta[match[1]] = match[2].replace(/^"|"$/g, '');
      }
      if (meta.nav_exclude !== 'true') pages.push({file, ...meta});
    }
  }
}
collect(docs);
const byTitle = new Map(pages.map(page => [page.title, page]));
assert.equal(byTitle.size, pages.length, 'Sichtbare Navigationstitel müssen eindeutig sein');
for (const page of pages) {
  if (!page.parent) continue;
  const parent = byTitle.get(page.parent);
  assert.ok(parent, `Elternseite fehlt: ${page.title}`);
  assert.equal(parent.has_children, 'true', `Elternseite ohne Kinderkennzeichnung: ${parent.title}`);
  assert.equal(page.grand_parent, parent.parent, `Falsche Hierarchie: ${page.title}`);
}
console.log('PASS Dokumentationshierarchie: eindeutige Titel und vollständige Elternketten');

const navLabels = [...fs.readFileSync(path.join(docs, '_data/course_navigation.yml'), 'utf8').matchAll(/^- title: (.+)$/gm)].map(match => match[1]);
const directory = lab.match(/<nav class="course-directory-links"[\s\S]*?<\/nav>/)[0];
const labLabels = [...directory.matchAll(/<a [^>]*>([^<]+)<\/a>/g)].map(match => decode(match[1]));
assert.deepEqual(labLabels, navLabels);
console.log('PASS Lab und Dokumentation: dieselben sieben Bereiche in gleicher Reihenfolge');

for (const match of lab.matchAll(/<button class="nav-tab[^"\n]*" data-view="([^"]+)">([^<]+)<\/button>/g)) {
  const title = decode(match[2]);
  const page = byTitle.get(title);
  assert.ok(page, `Lab-Reiter fehlt in der Dokumentation: ${title}`);
  assert.equal(page.grand_parent, undefined, `Lab-Reiter liegt unterhalb von Ebene 2: ${title}`);
}
console.log('PASS Alle Lab-Reiter stehen unter identischen Namen auf Ebene 1 oder 2');

for (const page of pages.filter(page => ['Agenten-Architekturen', 'Kontext & Wissen', 'Loop Engineering', 'Agent Harness', 'Evaluation'].includes(page.title))) {
  assert.match(fs.readFileSync(page.file, 'utf8'), /agent_patterns_lab\/#(?:augmented|context|loops|harness|evaluation)/, page.title);
}
console.log('PASS Arbeitsreiter: direkte Rücklinks von den Fachartikeln ins Lab');
