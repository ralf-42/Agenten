// Dokumentation und Lab müssen dieselben Bereiche und erreichbare Arbeitsreiter bieten.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const docs = path.resolve(__dirname, '../../..');
const lab = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const decode = text => text.replaceAll('&amp;', '&');
const pages = [];
const allPages = [];

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
      allPages.push({file, ...meta});
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
const labLabels = [...directory.matchAll(/<strong>([^<]+)<\/strong>/g)].map(match => decode(match[1]));
assert.deepEqual(labLabels, navLabels);
console.log('PASS Lab und Dokumentation: dieselben sieben Bereiche in gleicher Reihenfolge');

for (const match of lab.matchAll(/<button class="nav-tab[^"\n]*" data-view="([^"]+)">([^<]+)<\/button>/g)) {
  const title = decode(match[2]);
  const page = byTitle.get(title);
  assert.ok(page, `Lab-Reiter fehlt in der Dokumentation: ${title}`);
  assert.equal(page.grand_parent, undefined, `Lab-Reiter liegt unterhalb von Ebene 2: ${title}`);
}
console.log('PASS Alle Lab-Reiter stehen unter identischen Namen auf Ebene 1 oder 2');

const returnLinks = new Map([
  ['Agenten-Architekturen', 'augmented'],
  ['Kontext & Wissen', 'context'],
  ['Loop Engineering', 'loops'],
  ['State & Checkpoints', 'checkpoints'],
  ['Agent Harness', 'harness'],
  ['Evaluation', 'evaluation'],
  ['Skills', 'skills'],
  ['Modellauswahl', 'model_tiers'],
]);
for (const [title, fragment] of returnLinks) {
  const page = byTitle.get(title);
  assert.ok(page, `Pflichtziel fehlt: ${title}`);
  assert.ok(fs.readFileSync(page.file, 'utf8').includes(`/visualisierungen/agent_patterns_lab/#${fragment}`), `Passender Rücklink fehlt: ${title} → #${fragment}`);
}
console.log('PASS Alle sechs Arbeitsreiter sowie Skills und Modellstufen-Routing haben den passenden Rücklink');

let labLinks = 0;
for (const page of allPages) {
  const source = fs.readFileSync(page.file, 'utf8');
  for (const match of source.matchAll(/\]\(\{\{\s*['"]\/visualisierungen\/agent_patterns_lab\/[^}]*\}\}\)(\{:[^}]*\})?/g)) {
    assert.ok(match[1]?.includes('target="_blank"'), `Lab-Link ohne neuen Tab: ${page.file}`);
    assert.ok(match[1]?.includes('rel="noopener"'), `Lab-Link ohne noopener: ${page.file}`);
    labLinks++;
  }
}
assert.ok(labLinks > 0, 'Keine Lab-Verweise geprüft');
console.log(`PASS ${labLinks} Dokumentationsverweise öffnen das Lab einheitlich in einem neuen Tab`);

for (const match of lab.matchAll(/href=["']([^"']+)["']/g)) {
  assert.ok(!match[1].startsWith('https://ralf-42.github.io/Agenten/'), 'Eigene Kursseiten werden im Lab relativ verlinkt');
}
console.log('PASS Lab-Verweise auf eigene Kursseiten verwenden einheitlich relative URLs');

// Auch dynamische Meldungen und vorbereitete Beispielantworten bleiben ohne Anrede.
const languageSources = [path.join(__dirname, '../index.html'), ...fs.readdirSync(path.join(__dirname, '../js')).filter(name => name.endsWith('.js')).map(name => path.join(__dirname, '../js', name))];
for (const file of languageSources) {
  assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /\b(?:[Dd]u|[Dd]ich|[Dd]ir|[Dd]ein[a-z]*|Sie|Ihnen|Ihr[a-z]*)\b/, `Direkte Anrede in ${file}`);
}
console.log('PASS Beschreibungen, Meldungen und vorbereitete Beispieltexte ohne direkte Anrede');
