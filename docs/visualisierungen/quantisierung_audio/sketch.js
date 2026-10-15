// Quantisierung – Audiosignal
// p5.js Sketch – läuft direkt im p5.js Web Editor (editor.p5js.org)
// Zeigt: Originalsignal, quantisiertes Treppensignal, Quantisierungsfehler
// Steuerung: Bit-Tiefe (1–8), Wellenform, Zoom

// ─── Logische Leinwandgröße ───────────────────────────────────────────────────
const LW = 720, LH = 560;
let sc = 1, ox = 0, oy = 0;

// ─── State ────────────────────────────────────────────────────────────────────
let bits       = 3;        // aktuelle Bit-Tiefe
let waveType   = 'sine';   // 'sine' | 'tri' | 'saw'
let showOrig   = true;
let showQuant  = true;
let showErr    = true;

// Button-Listen
let bitBtns   = [];
let waveBtns  = [];
let toggleBtns = [];

// ─── Farben ───────────────────────────────────────────────────────────────────
let COL_BG, COL_PANEL, COL_TEXT, COL_MUTED, COL_BORDER, COL_GRID;
let COL_ORIG, COL_QUANT, COL_ERR, COL_STEP;

// ─── SETUP ────────────────────────────────────────────────────────────────────
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
  COL_ORIG   = color(29, 158, 117);    // Teal – Original
  COL_QUANT  = color(186, 117, 23);    // Amber – Quantisiert
  COL_ERR    = color(153, 60, 29);     // Coral – Fehler
  COL_STEP   = color(186, 117, 23, 35); // Amber transparent – Stufenlinien
}

// ─── BUTTONS ──────────────────────────────────────────────────────────────────
function buildButtons() {
  // Bit-Tiefe: 1–8
  bitBtns = [];
  let bw = 52, bh = 30, by = 14, gap = 6;
  let totalW = 8 * bw + 7 * gap;
  let bx0 = (LW - totalW) / 2;
  for (let i = 1; i <= 8; i++) {
    bitBtns.push({ x: bx0 + (i-1)*(bw+gap), y: by, w: bw, h: bh, val: i });
  }

  // Wellenform
  waveBtns = [];
  let waves = [
    { label: 'Sinus',     val: 'sine' },
    { label: 'Dreieck',   val: 'tri'  },
    { label: 'Sägezahn',  val: 'saw'  },
  ];
  let ww = 100, wh = 28, wy = 54, wgap = 8;
  let wtotal = waves.length * ww + (waves.length-1) * wgap;
  let wx0 = (LW - wtotal) / 2;
  for (let i = 0; i < waves.length; i++) {
    waveBtns.push({ x: wx0 + i*(ww+wgap), y: wy, w: ww, h: wh, label: waves[i].label, val: waves[i].val });
  }

  // Toggle-Buttons (Sichtbarkeit)
  toggleBtns = [];
  let tLabels = [
    { label: '● Original',     key: 'orig',  col: COL_ORIG  },
    { label: '● Quantisiert',  key: 'quant', col: COL_QUANT },
    { label: '● Fehler',       key: 'err',   col: COL_ERR   },
  ];
  let tw = 120, th = 24, ty = 90, tgap = 8;
  let ttotal = tLabels.length * tw + (tLabels.length-1) * tgap;
  let tx0 = (LW - ttotal) / 2;
  for (let i = 0; i < tLabels.length; i++) {
    toggleBtns.push({ x: tx0 + i*(tw+tgap), y: ty, w: tw, h: th, ...tLabels[i] });
  }
}

// ─── DRAW LOOP ────────────────────────────────────────────────────────────────
function draw() {
  background(230, 228, 222);

  // Canvas-Schatten
  push();
  translate(ox+4, oy+4);
  fill(0, 0, 0, 28); noStroke();
  rect(0, 0, LW*sc, LH*sc, 10);
  pop();

  // Weißer Canvas
  push();
  translate(ox, oy);
  scale(sc);

  fill(COL_BG); noStroke();
  rect(0, 0, LW, LH, 8);

  drawControls();
  drawChart();
  drawStats();
  drawLegend();

  pop();
}

// ─── STEUERUNGSLEISTE ─────────────────────────────────────────────────────────
function drawControls() {
  // Überschrift Bit-Tiefe
  fill(COL_MUTED); textSize(11); textAlign(RIGHT, CENTER); noStroke();
  text('Bit-Tiefe:', bitBtns[0].x - 8, bitBtns[0].y + bitBtns[0].h / 2);

  // Bit-Buttons
  for (let b of bitBtns) {
    let sel = b.val === bits;
    fill(sel ? COL_ORIG : COL_PANEL);
    stroke(sel ? COL_ORIG : COL_BORDER);
    strokeWeight(sel ? 1.5 : 0.5);
    rect(b.x, b.y, b.w, b.h, 5);
    noStroke();
    fill(sel ? color(255) : COL_TEXT);
    textSize(12); textAlign(CENTER, CENTER);
    text(b.val, b.x + b.w/2, b.y + b.h/2);
  }

  // Wellenform-Buttons
  fill(COL_MUTED); textSize(11); textAlign(RIGHT, CENTER); noStroke();
  text('Wellenform:', waveBtns[0].x - 8, waveBtns[0].y + waveBtns[0].h/2);
  for (let b of waveBtns) {
    let sel = b.val === waveType;
    fill(sel ? COL_AMBER_LIGHT() : COL_PANEL);
    stroke(sel ? COL_QUANT : COL_BORDER);
    strokeWeight(sel ? 1.5 : 0.5);
    rect(b.x, b.y, b.w, b.h, 5);
    noStroke();
    fill(sel ? COL_QUANT : COL_TEXT);
    textSize(11); textAlign(CENTER, CENTER);
    text(b.label, b.x + b.w/2, b.y + b.h/2);
  }

  // Toggle-Buttons
  for (let b of toggleBtns) {
    let active = getToggle(b.key);
    fill(active ? color(red(b.col), green(b.col), blue(b.col), 30) : COL_PANEL);
    stroke(active ? b.col : COL_BORDER);
    strokeWeight(active ? 1.5 : 0.5);
    rect(b.x, b.y, b.w, b.h, 5);
    noStroke();
    fill(active ? b.col : COL_MUTED);
    textSize(11); textAlign(CENTER, CENTER);
    text(b.label, b.x + b.w/2, b.y + b.h/2);
  }
}

function COL_AMBER_LIGHT() { return color(186, 117, 23, 35); }

function getToggle(key) {
  if (key === 'orig')  return showOrig;
  if (key === 'quant') return showQuant;
  if (key === 'err')   return showErr;
}

// ─── HAUPT-DIAGRAMM ───────────────────────────────────────────────────────────
function drawChart() {
  let PAD = { top: 126, bot: 56, left: 44, right: 20 };
  let iW = LW - PAD.left - PAD.right;
  let iH = LH - PAD.top  - PAD.bot;

  let levels = pow(2, bits);
  let step   = 2.0 / levels;

  // Diagramm-Hintergrund
  fill(COL_PANEL); noStroke();
  rect(PAD.left, PAD.top, iW, iH, 4);

  // Stufenlinien (Quantisierungsgitter)
  stroke(COL_STEP); strokeWeight(0.5);
  for (let i = 0; i <= levels; i++) {
    let v = -1 + i * step;
    let y = toY(v, PAD, iH);
    line(PAD.left, y, PAD.left + iW, y);
  }

  // Mittellinie
  stroke(color(0, 0, 0, 30)); strokeWeight(0.8);
  let midY = toY(0, PAD, iH);
  line(PAD.left, midY, PAD.left + iW, midY);

  // Y-Achse Labels
  noStroke();
  fill(COL_MUTED); textSize(10); textAlign(RIGHT, CENTER);
  for (let v of [1, 0.5, 0, -0.5, -1]) {
    text(nf(v, 1, 1), PAD.left - 5, toY(v, PAD, iH));
  }

  // X-Achse Label
  fill(COL_MUTED); textSize(10); textAlign(CENTER, TOP);
  text('Zeit  →', PAD.left + iW/2, PAD.top + iH + 6);

  // Signale berechnen
  let N = iW;
  let origVals  = [];
  let quantVals = [];
  for (let x = 0; x < N; x++) {
    let t = (x / N) * 2;   // 2 Zyklen
    let v = getWave(t);
    origVals.push(v);
    quantVals.push(quantize(v, step));
  }

  // Fehler-Fläche
  if (showErr) {
    fill(red(COL_ERR), green(COL_ERR), blue(COL_ERR), 40);
    noStroke();
    beginShape();
    for (let x = 0; x < N; x++)
      vertex(PAD.left + x, toY(origVals[x], PAD, iH));
    for (let x = N-1; x >= 0; x--)
      vertex(PAD.left + x, toY(quantVals[x], PAD, iH));
    endShape(CLOSE);
  }

  // Original (glatte Kurve)
  if (showOrig) {
    stroke(COL_ORIG); strokeWeight(2); noFill();
    beginShape();
    for (let x = 0; x < N; x++)
      vertex(PAD.left + x, toY(origVals[x], PAD, iH));
    endShape();
  }

  // Quantisiert (Treppenstufen)
  if (showQuant) {
    stroke(COL_QUANT); strokeWeight(2); noFill();
    beginShape();
    for (let x = 0; x < N; x++) {
      // Horizontale Linie auf aktuellem Wert, dann senkrechter Sprung
      let y = toY(quantVals[x], PAD, iH);
      if (x > 0 && quantVals[x] !== quantVals[x-1]) {
        // Sprung: vertikale Linie erst zeichnen
        vertex(PAD.left + x, toY(quantVals[x-1], PAD, iH));
      }
      vertex(PAD.left + x, y);
    }
    endShape();
  }

  noStroke();
}

// ─── STAT-CARDS ───────────────────────────────────────────────────────────────
function drawStats() {
  let levels   = pow(2, bits);
  let maxErr   = (100 / (2 * levels));
  let snrDB    = 6.02 * bits + 1.76;  // SQNR-Formel

  let stats = [
    { label: 'Bit-Tiefe',    val: bits + ' bit' },
    { label: 'Stufen',       val: '' + int(levels) },
    { label: 'Max. Fehler',  val: nf(maxErr, 1, 2) + '%' },
    { label: 'SQNR',         val: nf(snrDB, 2, 1) + ' dB' },
  ];

  let sy = LH - 46;
  let n = stats.length;
  let totalW = LW - 40;
  let cardW = (totalW - (n-1)*8) / n;
  for (let i = 0; i < n; i++) {
    let cx = 20 + i*(cardW+8);
    fill(COL_PANEL); noStroke(); rect(cx, sy, cardW, 36, 5);
    fill(COL_MUTED); textSize(9); textAlign(LEFT, TOP);
    text(stats[i].label, cx+8, sy+6);
    fill(COL_TEXT); textSize(14); textAlign(LEFT, BOTTOM);
    text(stats[i].val, cx+8, sy+34);
  }
}

// ─── LEGENDE & ERKLÄRUNG ──────────────────────────────────────────────────────
function drawLegend() {
  // Kleine Farb-Legende oben rechts im Chart-Bereich
  let items = [
    { col: COL_ORIG,  label: 'Original (kontinuierlich)' },
    { col: COL_QUANT, label: 'Quantisiert (Stufen)' },
    { col: COL_ERR,   label: 'Fehler (Differenz)' },
  ];
  let lx = LW - 20;
  let ly = 128;
  for (let item of items) {
    // Linie als Farbindikator
    stroke(item.col); strokeWeight(2);
    line(lx - 22, ly + 5, lx - 8, ly + 5);
    noStroke();
    fill(COL_MUTED); textSize(10); textAlign(RIGHT, TOP);
    text(item.label, lx - 26, ly);
    ly += 16;
  }
}

// ─── HILFSFUNKTIONEN ──────────────────────────────────────────────────────────
function toY(v, PAD, iH) {
  return PAD.top + iH/2 - v * iH/2;
}

function getWave(t) {
  let phase = t % 1;
  if (waveType === 'sine') return sin(phase * TWO_PI);
  if (waveType === 'tri')  return phase < 0.5 ? 4*phase - 1 : 3 - 4*phase;
  if (waveType === 'saw')  return 2*phase - 1;
  return 0;
}

function quantize(v, step) {
  return round((v + 1) / step) * step - 1;
}

// ─── MAUS-EVENTS ──────────────────────────────────────────────────────────────
function mousePressed() {
  let lx = (mouseX - ox) / sc;
  let ly = (mouseY - oy) / sc;

  for (let b of bitBtns) {
    if (inBtn(b, lx, ly)) { bits = b.val; return; }
  }
  for (let b of waveBtns) {
    if (inBtn(b, lx, ly)) { waveType = b.val; return; }
  }
  for (let b of toggleBtns) {
    if (inBtn(b, lx, ly)) {
      if (b.key === 'orig')  showOrig  = !showOrig;
      if (b.key === 'quant') showQuant = !showQuant;
      if (b.key === 'err')   showErr   = !showErr;
      return;
    }
  }
}

function inBtn(b, lx, ly) {
  return lx >= b.x && lx <= b.x+b.w && ly >= b.y && ly <= b.y+b.h;
}