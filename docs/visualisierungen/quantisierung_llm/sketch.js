// LLM-Quantisierung – p5.js Sketch
// Läuft direkt im p5.js Web Editor (editor.p5js.org)
// Drei Ansichten: Bit-Formate | Modellgröße | Qualitäts-Tradeoff

// ─── Logische Leinwandgröße (unveränderlich) ─────────────────────────────────
const LW = 720, LH = 620;   // logical canvas size
let sc = 1, ox = 0, oy = 0; // scale + offset for centering

let currentTab = 0;
let tabs = ['Bit-Formate', 'Modellgröße', 'Qualitäts-Tradeoff'];

let FORMATS = [
  { id:'fp32', name:'FP32', bits:32, sign:1, exp:8,  mant:23, bytes:4,    quality:100, speed:100, badge:'Baseline',           use:'Training, Finetuning' },
  { id:'bf16', name:'BF16', bits:16, sign:1, exp:8,  mant:7,  bytes:2,    quality:99,  speed:185, badge:'Empfohlen',           use:'Training, GPU-Inference' },
  { id:'fp16', name:'FP16', bits:16, sign:1, exp:5,  mant:10, bytes:2,    quality:99,  speed:185, badge:'Weit verbreitet',     use:'GPU-Inference' },
  { id:'int8', name:'INT8', bits:8,  sign:1, exp:0,  mant:7,  bytes:1,    quality:97,  speed:220, badge:'Guter Kompromiss',    use:'CPU & GPU Inference' },
  { id:'int4', name:'INT4', bits:4,  sign:1, exp:0,  mant:3,  bytes:0.5,  quality:91,  speed:300, badge:'Populär (llama.cpp)', use:'Consumer Hardware' },
  { id:'int2', name:'INT2', bits:2,  sign:1, exp:0,  mant:1,  bytes:0.25, quality:72,  speed:380, badge:'Qualitätsverlust!',   use:'Edge-Geräte (riskant)' },
];

let PARAM_OPTIONS = [
  { label:'1B', value:1 }, { label:'7B', value:7 }, { label:'13B', value:13 },
  { label:'70B', value:70 }, { label:'405B', value:405 },
];

let selFmtIdx = 4, selParamIdx = 1, selQtIdx = 4;
let tabButtons = [], fmtButtons = [], paramButtons = [], qtButtons = [];

let COL_BG, COL_PANEL, COL_TEXT, COL_MUTED, COL_BORDER, COL_GRID;
let COL_SIGN, COL_EXP, COL_MANT, COL_ZERO;
let COL_TEAL, COL_AMBER, COL_CORAL, COL_BLUE, COL_PURPLE;
let PALETTE;

// ─── SETUP ───────────────────────────────────────────────────────────────────

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  noStroke();
  initColors();
  calcTransform();
  buildButtons();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calcTransform();
}

function calcTransform() {
  // Scale to fit window, capped at 80% of available space
  let margin = 24;
  let availW = windowWidth  - margin * 2;
  let availH = windowHeight - margin * 2;
  sc = min(availW / LW, availH / LH) * 0.8;
  ox = (windowWidth  - LW * sc) / 2;
  oy = (windowHeight - LH * sc) / 2;
}

function initColors() {
  COL_BG     = color(255);
  COL_PANEL  = color(246, 245, 240);
  COL_TEXT   = color(30, 30, 28);
  COL_MUTED  = color(100, 99, 95);
  COL_BORDER = color(180, 178, 169);
  COL_GRID   = color(0, 0, 0, 18);
  COL_SIGN   = color(240, 153, 123);
  COL_EXP    = color(133, 183, 235);
  COL_MANT   = color(93, 202, 165);
  COL_ZERO   = color(220, 218, 210);
  COL_TEAL   = color(29, 158, 117);
  COL_AMBER  = color(186, 117, 23);
  COL_CORAL  = color(153, 60, 29);
  COL_BLUE   = color(24, 95, 165);
  COL_PURPLE = color(83, 74, 183);
  PALETTE    = [COL_BLUE, COL_PURPLE, COL_PURPLE, COL_TEAL, COL_AMBER, COL_CORAL];
}

// ─── BUTTON LAYOUT (in logical coords) ───────────────────────────────────────

function buildButtons() {
  tabButtons = [];
  let tw = 160, th = 34, ty = 14;
  let totalTabW = 3 * tw + 2 * 8;
  let tx0 = (LW - totalTabW) / 2;
  for (let i = 0; i < 3; i++)
    tabButtons.push({ x: tx0 + i * (tw + 8), y: ty, w: tw, h: th, label: tabs[i], idx: i });

  fmtButtons = [];
  let fw = 108, fh = 62, fy0 = 76;
  let totalFW = 6 * fw + 5 * 8;
  let fx0 = (LW - totalFW) / 2;
  for (let i = 0; i < FORMATS.length; i++) {
    let col = i % 6, row = floor(i / 6);
    fmtButtons.push({ x: fx0 + col * (fw + 8), y: fy0 + row * (fh + 8), w: fw, h: fh, idx: i });
  }

  paramButtons = [];
  let pw = 90, ph = 30, py0 = 76;
  let totalPW = PARAM_OPTIONS.length * pw + (PARAM_OPTIONS.length - 1) * 8;
  let px0 = (LW - totalPW) / 2;
  for (let i = 0; i < PARAM_OPTIONS.length; i++)
    paramButtons.push({ x: px0 + i * (pw + 8), y: py0, w: pw, h: ph, idx: i });

  qtButtons = [];
  let qw = 108, qh = 30, qy0 = 76;
  let totalQW = FORMATS.length * qw + (FORMATS.length - 1) * 8;
  let qx0 = (LW - totalQW) / 2;
  for (let i = 0; i < FORMATS.length; i++)
    qtButtons.push({ x: qx0 + i * (qw + 8), y: qy0, w: qw, h: qh, idx: i });
}

// ─── DRAW LOOP ────────────────────────────────────────────────────────────────

function draw() {
  // Gray page background
  background(230, 228, 222);

  // Draw canvas shadow simulation
  push();
  translate(ox + 4, oy + 4);
  fill(0, 0, 0, 30);
  noStroke();
  rect(0, 0, LW * sc, LH * sc, 10);
  pop();

  // Scale + center everything
  push();
  translate(ox, oy);
  scale(sc);

  // White canvas
  fill(COL_BG);
  noStroke();
  rect(0, 0, LW, LH, 8);

  drawTabs();
  if      (currentTab === 0) drawFormatPanel();
  else if (currentTab === 1) drawSizePanel();
  else                       drawTradeoffPanel();

  pop();
}

// ─── TABS ─────────────────────────────────────────────────────────────────────

function drawTabs() {
  for (let b of tabButtons) {
    let active = b.idx === currentTab;
    fill(active ? COL_PANEL : COL_BG);
    stroke(active ? COL_BORDER : color(210, 208, 200));
    strokeWeight(active ? 1 : 0.5);
    rect(b.x, b.y, b.w, b.h, 6);
    noStroke();
    fill(active ? COL_TEXT : COL_MUTED);
    textSize(13);
    textAlign(CENTER, CENTER);
    text(b.label, b.x + b.w / 2, b.y + b.h / 2);
  }
}

// ─── PANEL 0: BIT-FORMATE ─────────────────────────────────────────────────────

function drawFormatPanel() {
  for (let i = 0; i < FORMATS.length; i++) {
    let b = fmtButtons[i], f = FORMATS[i], sel = i === selFmtIdx;
    fill(sel ? color(red(PALETTE[i]), green(PALETTE[i]), blue(PALETTE[i]), 35) : COL_PANEL);
    stroke(sel ? PALETTE[i] : COL_BORDER);
    strokeWeight(sel ? 2 : 0.5);
    rect(b.x, b.y, b.w, b.h, 6);
    noStroke();
    fill(COL_TEXT); textSize(13); textAlign(LEFT, TOP);
    text(f.name, b.x + 8, b.y + 8);
    fill(COL_MUTED); textSize(10);
    text(f.bits + ' bit', b.x + 8, b.y + 26);
    fill(PALETTE[i]);
    ellipse(b.x + b.w - 10, b.y + 10, 7, 7);
  }

  let f = FORMATS[selFmtIdx];
  let by = 160;

  fill(COL_TEXT); textSize(12); textAlign(LEFT, TOP);
  text('Bit-Struktur: ' + f.name + ' (' + f.bits + ' bit)', 20, by);

  by += 20;
  let legendItems = [
    { label: 'Sign (1 bit)',              col: COL_SIGN },
    { label: 'Exponent (' + f.exp + ' bit)', col: COL_EXP },
    { label: 'Mantisse (' + f.mant + ' bit)', col: COL_MANT },
    { label: 'Eingespart (' + (32 - f.bits) + ' bit)', col: COL_ZERO },
  ];
  let lx = 20;
  for (let item of legendItems) {
    fill(item.col); noStroke(); rect(lx, by + 2, 10, 10, 2);
    fill(COL_MUTED); textSize(11); textAlign(LEFT, TOP);
    text(item.label, lx + 14, by);
    lx += textWidth(item.label) + 30;
  }

  // 32 bit boxes in 2 rows of 16
  let bits = [{ cls:'sign' }];
  for (let i = 0; i < f.exp; i++)  bits.push({ cls:'exp' });
  for (let i = 0; i < f.mant; i++) bits.push({ cls:'mant' });
  while (bits.length < 32) bits.push({ cls:'zero' });

  by += 22;
  let bw = 20, bh = 24, gap = 3, cols32 = 16;
  let totalBW = cols32 * bw + (cols32 - 1) * gap;
  let bx = (LW - totalBW) / 2;
  for (let i = 0; i < 32; i++) {
    let col = i % cols32, row = floor(i / cols32);
    let px = bx + col * (bw + gap), py = by + row * (bh + gap);
    let cls = bits[i].cls;
    fill(cls==='sign' ? COL_SIGN : cls==='exp' ? COL_EXP : cls==='mant' ? COL_MANT : COL_ZERO);
    noStroke(); rect(px, py, bw, bh, 3);
    fill(cls==='zero' ? COL_MUTED : color(30, 30, 28));
    textSize(8); textAlign(CENTER, CENTER);
    text(cls==='sign' ? 'S' : cls==='exp' ? 'E' : cls==='mant' ? 'M' : '–', px + bw/2, py + bh/2);
  }

  let sy = by + 2 * (bh + gap) + 12;
  let stats = [
    { label:'Bits/Gewicht',    val:'' + f.bits },
    { label:'Bytes/Parameter', val: f.bytes < 1 ? '0.5' : '' + f.bytes },
    { label:'Größe vs FP32',   val: Math.round(f.bytes / 4 * 100) + '%' },
    { label:'Einsatz',         val: f.use },
  ];
  drawStatCards(stats, 20, sy, LW - 40, 68);

  // Format-Erklärung
  fill(COL_MUTED); textSize(11); textAlign(LEFT, TOP);
  textWrap(WORD);
  text(getExplanation(f), 20, sy + 78, LW - 40);

  // Sign / Exponent / Mantisse Erläuterung
  let ey = sy + 118;
  let defs = [
    { col: COL_SIGN,   label: 'Sign (S)',     desc: '1 bit — Vorzeichen: 0 = positiv, 1 = negativ.' },
    { col: COL_EXP,    label: 'Exponent (E)', desc: 'Bestimmt die Größenordnung (Wertebereich). Mehr Bits → größerer Zahlenbereich.' },
    { col: COL_MANT,   label: 'Mantisse (M)', desc: 'Bestimmt die Präzision (Nachkommastellen). Mehr Bits → feinere Unterscheidung.' },
  ];
  for (let d of defs) {
    // farbiger Balken links
    fill(d.col); noStroke();
    rect(20, ey, 4, 32, 2);
    // Label
    fill(d.col); textSize(11); textAlign(LEFT, TOP); textWrap(WORD);
    text(d.label, 32, ey);
    // Beschreibung
    fill(COL_MUTED); textSize(11);
    text(d.desc, 32, ey + 14, LW - 52);
    ey += 42;
  }
}

// ─── PANEL 1: MODELLGRÖSSE ────────────────────────────────────────────────────

function drawSizePanel() {
  // Param selector centered
  fill(COL_TEXT); textSize(12); textAlign(CENTER, CENTER); noStroke();
  text('Modell-Parameter:', LW / 2 - (PARAM_OPTIONS.length * 98) / 2 - 10, paramButtons[0].y + 15);

  for (let b of paramButtons) {
    let sel = b.idx === selParamIdx;
    fill(sel ? COL_TEAL : COL_PANEL);
    stroke(sel ? COL_TEAL : COL_BORDER); strokeWeight(sel ? 1.5 : 0.5);
    rect(b.x, b.y, b.w, b.h, 5);
    noStroke();
    fill(sel ? color(255) : COL_TEXT); textSize(12); textAlign(CENTER, CENTER);
    text(PARAM_OPTIONS[b.idx].label, b.x + b.w / 2, b.y + b.h / 2);
  }

  let params = PARAM_OPTIONS[selParamIdx].value;
  let sizes  = FORMATS.map((f, i) => ({ name:f.name, gb: params * f.bytes, col:PALETTE[i] }));
  let maxGB  = sizes[0].gb * 1.15;

  let PAD = { top:116, bot:46, left:68, right:20 };
  let iW = LW - PAD.left - PAD.right;
  let iH = LH - PAD.top  - PAD.bot;
  let rowH = iH / sizes.length;
  let barH = min(26, rowH - 10);

  // Grid
  let refs = [4, 8, 16, 24, 48, 80, 120, 200, 400, 800, 1620];
  for (let r of refs) {
    if (r > maxGB) continue;
    let x = PAD.left + (r / maxGB) * iW;
    stroke(COL_GRID); strokeWeight(0.5);
    line(x, PAD.top, x, PAD.top + iH);
    noStroke();
    fill(COL_MUTED); textSize(9); textAlign(CENTER, TOP);
    text(r >= 1000 ? (r/1000).toFixed(1)+'TB' : r+' GB', x, PAD.top + iH + 4);
  }

  // Hardware reference lines
  let hw = [
    { gb:6,  lbl:'RTX 3060\n(6 GB)' },
    { gb:24, lbl:'RTX 4090\n(24 GB)' },
    { gb:80, lbl:'A100\n(80 GB)' },
  ];
  for (let h of hw) {
    if (h.gb > maxGB) continue;
    let x = PAD.left + (h.gb / maxGB) * iW;
    stroke(color(180, 60, 30, 100)); strokeWeight(1);
    drawingContext.setLineDash([4, 3]);
    line(x, PAD.top - 22, x, PAD.top + iH);
    drawingContext.setLineDash([]);
    noStroke();
    fill(color(180, 60, 30, 160)); textSize(9); textAlign(CENTER, BASELINE);
    let lines = h.lbl.split('\n');
    text(lines[0], x, PAD.top - 22);
    text(lines[1], x, PAD.top - 11);
  }

  // Bars
  for (let i = 0; i < sizes.length; i++) {
    let s = sizes[i];
    let y  = PAD.top + i * rowH + (rowH - barH) / 2;
    let bw = max(4, (s.gb / maxGB) * iW);

    fill(red(s.col), green(s.col), blue(s.col), 55); noStroke();
    rect(PAD.left, y, bw, barH, 4);
    stroke(s.col); strokeWeight(1); noFill();
    rect(PAD.left, y, bw, barH, 4); noStroke();

    fill(COL_TEXT); textSize(12); textAlign(RIGHT, CENTER);
    text(s.name, PAD.left - 6, y + barH / 2);
    fill(s.col); textSize(11); textAlign(LEFT, CENTER);
    let gbText = s.gb >= 1 ? s.gb.toFixed(1)+' GB' : (s.gb*1024).toFixed(0)+' MB';
    text(gbText, PAD.left + bw + 6, y + barH / 2);
  }
}

// ─── PANEL 2: QUALITÄTS-TRADEOFF ──────────────────────────────────────────────

function drawTradeoffPanel() {
  for (let b of qtButtons) {
    let f = FORMATS[b.idx], sel = b.idx === selQtIdx;
    fill(sel ? color(red(PALETTE[b.idx]), green(PALETTE[b.idx]), blue(PALETTE[b.idx]), 45) : COL_PANEL);
    stroke(sel ? PALETTE[b.idx] : COL_BORDER); strokeWeight(sel ? 1.5 : 0.5);
    rect(b.x, b.y, b.w, b.h, 5);
    noStroke();
    fill(sel ? PALETTE[b.idx] : COL_TEXT); textSize(11); textAlign(CENTER, CENTER);
    text(f.name, b.x + b.w / 2, b.y + b.h / 2);
  }

  let PAD = { top:116, bot:76, left:56, right:20 };
  let iW = LW - PAD.left - PAD.right;
  let iH = LH - PAD.top  - PAD.bot;

  let toX = v => PAD.left + ((v - 80) / 320) * iW;
  let toY = v => PAD.top  + iH - ((v - 65) / 40) * iH;

  // Grid
  for (let q of [70, 80, 90, 100]) {
    let y = toY(q);
    stroke(COL_GRID); strokeWeight(0.5); line(PAD.left, y, PAD.left+iW, y);
    noStroke(); fill(COL_MUTED); textSize(10); textAlign(RIGHT, CENTER);
    text(q+'%', PAD.left - 5, y);
  }
  for (let s of [100, 200, 300, 400]) {
    let x = toX(s);
    stroke(COL_GRID); strokeWeight(0.5); line(x, PAD.top, x, PAD.top+iH);
    noStroke(); fill(COL_MUTED); textSize(10); textAlign(CENTER, TOP);
    text(s+'%', x, PAD.top+iH+5);
  }

  // Axis labels
  fill(COL_MUTED); textSize(11); textAlign(CENTER, BOTTOM);
  text('Inferenz-Geschwindigkeit (relativ zu FP32)', PAD.left+iW/2, LH - 4);
  push(); translate(13, PAD.top+iH/2); rotate(-HALF_PI);
  textAlign(CENTER, CENTER); text('Qualität (%)', 0, 0); pop();

  // Sweet spot
  fill(29, 158, 117, 18); noStroke();
  let zx1=toX(170), zx2=toX(340), zy1=toY(99), zy2=toY(88);
  rect(zx1, zy1, zx2-zx1, zy2-zy1, 4);
  fill(29, 158, 117, 130); textSize(10); textAlign(CENTER, CENTER);
  text('Sweet Spot', (zx1+zx2)/2, zy1+10);

  // Dots
  for (let i = 0; i < FORMATS.length; i++) {
    let f = FORMATS[i], sel = i === selQtIdx;
    let x = toX(f.speed), y = toY(f.quality);
    let r = sel ? 10 : 7;
    let c = PALETTE[i];
    fill(red(c), green(c), blue(c), sel ? 230 : 140); noStroke();
    ellipse(x, y, r*2, r*2);
    if (sel) { stroke(c); strokeWeight(2); noFill(); ellipse(x, y, r*2+7, r*2+7); noStroke(); }
    fill(COL_TEXT); textSize(sel ? 12 : 10); textAlign(LEFT, CENTER);
    text(f.name, x+r+5, y);
  }

  let f = FORMATS[selQtIdx];
  let stats = [
    { label:'Qualität',         val: f.quality+'%' },
    { label:'Geschwindigkeit',  val: f.speed+'%' },
    { label:'RAM (7B-Modell)',  val: (7*f.bytes).toFixed(1)+' GB' },
    { label:'Einsatz',          val: f.use },
  ];
  drawStatCards(stats, 20, PAD.top+iH+18, LW-40, 58);
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function drawStatCards(stats, x, y, totalW, h) {
  let n = stats.length;
  let cardW = (totalW - (n-1)*8) / n;
  for (let i = 0; i < n; i++) {
    let cx = x + i*(cardW+8);
    fill(COL_PANEL); noStroke(); rect(cx, y, cardW, h, 6);
    fill(COL_MUTED); textSize(10); textAlign(LEFT, TOP);
    text(stats[i].label, cx+8, y+8);
    fill(COL_TEXT); textSize(stats[i].val.length > 8 ? 11 : 16); textAlign(LEFT, BOTTOM);
    text(stats[i].val, cx+8, y+h-8);
  }
}

function getExplanation(f) {
  if (f.id==='fp32') return 'Standard beim Training — hohe Präzision, aber 4 Byte pro Parameter. Ein 7B-Modell braucht ~28 GB RAM.';
  if (f.id==='bf16') return 'BFloat16: Gleicher Exponent-Bereich wie FP32 (8 bit), weniger Mantisse. Bevorzugt für Mixed-Precision-Training auf modernen GPUs.';
  if (f.id==='fp16') return 'Half Precision: 16 bit, kleinerer Exponent-Bereich als BF16, mehr Mantisse-Präzision. Standard auf NVIDIA A100/H100.';
  if (f.id==='int8') return 'Gewichte auf 256 diskrete Ganzzahlwerte gerundet. Pro Schicht ein Skalierungsfaktor (Dequantisierung). Kleiner Qualitätsverlust, halbierter RAM.';
  if (f.id==='int4') return 'Nur 16 mögliche Werte pro Gewicht. Populär durch llama.cpp / GGUF. Ein 7B-Modell passt mit ~4 GB auf Consumer-Hardware.';
  if (f.id==='int2') return 'Nur 4 mögliche Werte. Extremer Qualitätsverlust — Modell vergisst subtile semantische Unterschiede. Nur auf Edge-Geräten sinnvoll.';
  return '';
}

// ─── MOUSE (muss in logische Koordinaten umrechnen) ───────────────────────────

function mousePressed() {
  // Fensterkoordinaten → logische Koordinaten
  let lx = (mouseX - ox) / sc;
  let ly = (mouseY - oy) / sc;

  for (let b of tabButtons) {
    if (inBtn(b, lx, ly)) { currentTab = b.idx; return; }
  }
  if (currentTab === 0) {
    for (let b of fmtButtons)   if (inBtn(b, lx, ly)) { selFmtIdx   = b.idx; return; }
  }
  if (currentTab === 1) {
    for (let b of paramButtons) if (inBtn(b, lx, ly)) { selParamIdx = b.idx; return; }
  }
  if (currentTab === 2) {
    for (let b of qtButtons)    if (inBtn(b, lx, ly)) { selQtIdx    = b.idx; return; }
  }
}

function inBtn(b, lx, ly) {
  return lx >= b.x && lx <= b.x+b.w && ly >= b.y && ly <= b.y+b.h;
}