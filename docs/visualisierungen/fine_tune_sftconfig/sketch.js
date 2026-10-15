// SFTTrainer Visualisierung — p5.js kompatibel
// Breite: 1050px (1,5x), Buttons im Canvas gezeichnet

let state = 'idle';
let currentStep = 0;
let currentEpoch = 0;
let totalEpochs = 3;
let speedFactor = 2;
let activePhase = -1;
let phaseTimer = 0;
let phaseDurations = [];
let stepInEpoch = 0;
let accumCount = 0;

let trainLoss = [];
let evalLoss = [];
let currentLoss = null;
let currentEval = null;
let currentLR = null;
let logLines = [];
let batchTokens = [];

const W = 1050;         // Canvas-Breite
const PAD = 12;         // Rand
const INNER = W - PAD*2; // Nutzbare Breite

const STEPS_PER_EPOCH = 8;
const GRAD_ACCUM = 4;
const BASE = [400, 450, 550, 350, 450, 350, 600];

const PHASE_NAMES = [
  ['Datensatz', 'tokenisieren'],
  ['Mini-Batch', '2 samples'],
  ['Forward', 'Loss ber.'],
  ['Grad.Accum', '÷4 Schritte'],
  ['Backward', 'Gradienten'],
  ['Optimizer', 'AdamW 8bit'],
  ['Eval', 'pro Epoche']
];

const PROMPTS = [
  ['Was', 'ist', 'SFT?'],
  ['Erkläre', 'LoRA'],
  ['Wie', 'Backprop?'],
  ['Was', 'ist', 'LLM?']
];
const RESPONSE = ['Das', 'ist', 'fine-tuning', '[EOS]'];

const PARAM_INFO = [
  { label: 'batch_size × grad_accum', val: '2 × 4 = eff. 8',
    explain: 'Das Modell lernt nicht aus allen Daten auf einmal, sondern aus kleinen Paketen (Batches). Mit Gradient Accumulation werden 4 kleine Batches à 2 Beispiele gesammelt, bevor die Gewichte aktualisiert werden — so als ob man 8 Beispiele gleichzeitig gelernt hätte, ohne mehr Speicher zu brauchen.' },
  { label: 'max_seq_length', val: '512 Tokens',
    explain: 'Maximale Länge eines Textes in Token (Wortteile). Texte, die länger sind, werden abgeschnitten. 512 Tokens entsprechen etwa 350–400 deutschen Wörtern.' },
  { label: 'optimizer: adamw_8bit', val: 'AdamW 8-bit',
    explain: 'Der Optimizer passt die Modellgewichte nach jedem Schritt an. AdamW ist ein bewährter Algorithmus; die 8-bit-Variante spart GPU-Speicher, indem Zahlen komprimiert gespeichert werden — ideal für große Modelle.' },
  { label: 'warmup_steps', val: '10 Schritte',
    explain: 'Am Anfang des Trainings ist die Lernrate sehr klein und steigt langsam an (Warmup). Das verhindert, dass das Modell in den ersten Schritten instabil wird — ähnlich wie ein Auto, das nicht sofort Vollgas gibt.' },
  { label: 'eval_strategy', val: '"epoch"',
    explain: 'Nach jeder Epoche (= einmaliger Durchlauf aller Trainingsdaten) wird das Modell auf dem Validierungsdatensatz getestet. So sieht man, ob das Modell wirklich lernt oder nur die Trainingsdaten auswendig kennt (Overfitting).' },
  { label: 'num_train_epochs', val: 'einstellbar',
    explain: 'Wie oft das Modell den gesamten Datensatz durchläuft. Mehr Epochen = mehr Lernzeit, aber auch höheres Risiko von Overfitting. Typisch: 1–5 Epochen bei SFT.' }
];

// UI-Elemente (im Canvas, kein HTML)
let ui = {};  // speichert Rechtecke für Hit-Detection

let sliderEpochVal = 3;
let sliderSpeedVal = 2;
let dragging = null;  // 'epoch' | 'speed' | null

let CANVAS_H = 900;

function setup() {
  let cnv = createCanvas(W, CANVAS_H);
  cnv.mousePressed(onMousePressed);
  textFont('monospace');
  buildPhaseDurations();
}

function buildPhaseDurations() {
  const factors = [4.0, 2.2, 1.3, 0.7, 0.4];
  const f = factors[speedFactor - 1];
  phaseDurations = BASE.map(b => Math.round(b * f));
}

function lrSchedule(step) {
  const warmup = 10, base = 0.0002;
  const total = totalEpochs * STEPS_PER_EPOCH;
  if (step < warmup) return base * (step / warmup);
  return base * Math.max(0.05, 1 - (step - warmup) / total);
}

function fakeLoss(step) {
  return 2.6 * Math.exp(-0.065 * step) + 0.28 + (Math.random() - 0.5) * 0.14;
}

function pickBatch() {
  const p = PROMPTS[floor(random(PROMPTS.length))];
  batchTokens = [];
  p.forEach(t => batchTokens.push({ text: t, type: 'prompt' }));
  RESPONSE.forEach(t => batchTokens.push({ text: t, type: 'response' }));
  for (let i = 0; i < 3; i++) batchTokens.push({ text: '[PAD]', type: 'pad' });
}

function addLog(msg, type) {
  logLines.push({ step: currentStep, msg, type });
  if (logLines.length > 16) logLines.shift();
}

function startTraining() {
  if (state === 'running') return;
  state = 'running';
  activePhase = 0;
  phaseTimer = millis();
  addLog('SFTTrainer initialisiert', 'info');
}

function resetAll() {
  state = 'idle';
  currentStep = 0; currentEpoch = 0;
  stepInEpoch = 0; accumCount = 0;
  activePhase = -1;
  trainLoss = []; evalLoss = [];
  currentLoss = null; currentEval = null; currentLR = null;
  logLines = []; batchTokens = [];
}

function onMousePressed() {
  const mx = mouseX, my = mouseY;

  // Start-Button
  if (ui.btnStart && inRect(mx, my, ui.btnStart) && state !== 'running' && state !== 'done') {
    startTraining();
  }
  // Reset-Button
  if (ui.btnReset && inRect(mx, my, ui.btnReset)) {
    resetAll();
  }
}

function mouseDragged() {
  if (dragging === 'epoch' && ui.sliderEpoch) {
    const s = ui.sliderEpoch;
    const t = constrain((mouseX - s.x) / s.w, 0, 1);
    sliderEpochVal = round(1 + t * 4);
    totalEpochs = sliderEpochVal;
  }
  if (dragging === 'speed' && ui.sliderSpeed) {
    const s = ui.sliderSpeed;
    const t = constrain((mouseX - s.x) / s.w, 0, 1);
    sliderSpeedVal = round(1 + t * 4);
    speedFactor = sliderSpeedVal;
    buildPhaseDurations();
  }
}

function mousePressed() {
  if (ui.sliderEpoch && inRect(mouseX, mouseY, { x: ui.sliderEpoch.x-8, y: ui.sliderEpoch.y-12, w: ui.sliderEpoch.w+16, h: 24 })) dragging = 'epoch';
  if (ui.sliderSpeed && inRect(mouseX, mouseY, { x: ui.sliderSpeed.x-8, y: ui.sliderSpeed.y-12, w: ui.sliderSpeed.w+16, h: 24 })) dragging = 'speed';
}

function mouseReleased() { dragging = null; }

function inRect(mx, my, r) {
  return mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h;
}

function draw() {
  background(245, 245, 243);

  let y = PAD;
  y = drawControlBar(y);
  y += 8;
  y = drawHyperCards(y);
  y += 6;
  y = drawPipeline(y);
  y += 6;
  y = drawMetrics(y);
  y += 6;
  y = drawChart(y);
  y += 6;
  y = drawBatch(y);
  y += 6;
  y = drawLog(y);
  y += 10;
  y = drawExplanations(y);
  y += 16;

  if (abs(y - CANVAS_H) > 5) {
    CANVAS_H = y;
    resizeCanvas(W, CANVAS_H);
  }

  if (state === 'running') {
    const elapsed = millis() - phaseTimer;
    if (elapsed >= (phaseDurations[activePhase] || 400)) {
      advancePhase();
      phaseTimer = millis();
    }
  }
}

// ─── State Machine ─────────────────────────────────────────────

function advancePhase() {
  switch (activePhase) {
    case 0: activePhase = 1; break;
    case 1: pickBatch(); activePhase = 2; break;
    case 2: currentLoss = fakeLoss(currentStep + 1); activePhase = 3; break;
    case 3:
      accumCount++;
      if (accumCount >= GRAD_ACCUM) { activePhase = 4; }
      else { finishMiniStep(false); activePhase = 0; }
      break;
    case 4: activePhase = 5; break;
    case 5:
      currentLR = lrSchedule(currentStep + 1);
      accumCount = 0;
      finishMiniStep(true);
      activePhase = stepInEpoch >= STEPS_PER_EPOCH ? 6 : 0;
      break;
    case 6:
      currentEval = currentLoss * (1 + random(0.08));
      if (evalLoss.length > 0) evalLoss[evalLoss.length - 1] = currentEval;
      addLog('eval_loss: ' + nf(currentEval, 1, 3) + ' ✓', 'eval');
      currentEpoch++;
      stepInEpoch = 0;
      if (currentEpoch >= totalEpochs) {
        state = 'done'; activePhase = -1;
        addLog('Training abgeschlossen ✓', 'eval');
      } else {
        activePhase = 0;
        addLog('=== Epoche ' + (currentEpoch + 1) + '/' + totalEpochs + ' ===', 'info');
      }
      break;
  }
}

function finishMiniStep(withOptimizer) {
  currentStep++;
  stepInEpoch++;
  trainLoss.push(currentLoss);
  evalLoss.push(null);
  if (currentStep > 1 && withOptimizer)
    addLog('loss: ' + nf(currentLoss, 1, 3) + '  lr: ' + (currentLR || 0).toExponential(1), 'loss');
}

// ─── Zeichenfunktionen ─────────────────────────────────────────

function sectionTitle(label, x, y) {
  fill(120); noStroke(); textSize(12); textAlign(LEFT);
  text(label, x, y);
}

// Slider zeichnen und Rect speichern
function drawSlider(x, y, w, val, min, max, key) {
  const t = (val - min) / (max - min);
  const thumbX = x + t * w;

  // Track
  stroke(200); strokeWeight(1); fill(220);
  rect(x, y - 3, w, 6, 3);

  // Fill links
  fill(83, 74, 183); noStroke();
  rect(x, y - 3, t * w, 6, 3);

  // Thumb
  const hover = inRect(mouseX, mouseY, { x: thumbX-10, y: y-10, w: 20, h: 20 });
  fill(hover || dragging === key ? color(60,52,137) : color(83,74,183));
  stroke(255); strokeWeight(1.5);
  ellipse(thumbX, y, 16, 16);

  ui['slider' + key.charAt(0).toUpperCase() + key.slice(1)] = { x, y, w };
  return thumbX;
}

function drawButton(x, y, w, h, label, active, accent) {
  const hover = inRect(mouseX, mouseY, { x, y, w, h });
  if (accent) {
    fill(hover ? color(60,52,137) : active ? color(150,150,150) : color(83,74,183));
    stroke(60,52,137);
  } else {
    fill(hover ? color(220,218,210) : color(234,232,224));
    stroke(180);
  }
  strokeWeight(0.5);
  rect(x, y, w, h, 8);
  fill(accent ? 255 : 60); noStroke();
  textSize(12); textAlign(CENTER, CENTER);
  text(label, x + w/2, y + h/2);
  return { x, y, w, h };
}

function drawControlBar(startY) {
  const barH = 48;
  fill(234, 232, 224); noStroke(); rect(PAD, startY, INNER, barH, 10);

  const slW = 110;
  let cx = PAD + 16;
  const midY = startY + barH/2;

  // Epochen-Slider
  fill(80); noStroke(); textSize(11); textAlign(LEFT);
  text('Epochen:', cx, midY - 10);
  drawSlider(cx, midY + 6, slW, sliderEpochVal, 1, 5, 'epoch');
  fill(50); textSize(11); textAlign(LEFT);
  text(sliderEpochVal, cx + slW + 8, midY + 10);
  cx += slW + 40;

  // Speed-Slider
  fill(80); noStroke(); textSize(11); textAlign(LEFT);
  text('Geschwindigkeit:', cx, midY - 10);
  drawSlider(cx, midY + 6, slW, sliderSpeedVal, 1, 5, 'speed');
  fill(50); textSize(11);
  const speedNames = ['sehr langsam','langsam','mittel','schnell','sehr schnell'];
  text(speedNames[sliderSpeedVal - 1], cx + slW + 8, midY + 10);
  cx += slW + 160;

  // Buttons
  const btnW = 120, btnH = 30;
  const btnY = midY - btnH/2;
  const startLabel = state === 'running' ? '⏸ läuft...' : state === 'done' ? '✓ Fertig' : '▶ Starten';
  ui.btnStart = drawButton(PAD + INNER - btnW*2 - 16, btnY, btnW, btnH, startLabel, state === 'running' || state === 'done', false);
  ui.btnReset = drawButton(PAD + INNER - btnW - 4,    btnY, btnW, btnH, '↺ Reset', false, false);

  return startY + barH;
}

function drawHyperCards(startY) {
  sectionTitle('SFTConfig — Hyperparameter', PAD, startY + 13);
  const y = startY + 20;
  const labels = ['batch_size × grad_accum', 'max_seq_length', 'optimizer', 'warmup_steps'];
  const vals   = ['2 × 4 = eff. 8', '512 Tokens', 'adamw_8bit', '10 Schritte'];
  const n = 4;
  const gap = 8;
  const cardW = (INNER - gap*(n-1)) / n;
  const cardH = 50;

  for (let i = 0; i < n; i++) {
    const x = PAD + i*(cardW+gap);
    fill(234,232,224); noStroke(); rect(x, y, cardW, cardH, 8);
    fill(140); textSize(10); textAlign(LEFT); text(labels[i], x+10, y+15);
    fill(30); textSize(13); text(vals[i], x+10, y+37);
  }
  return y + cardH;
}

function drawPipeline(startY) {
  sectionTitle('Training-Pipeline', PAD, startY + 13);
  const y = startY + 20;
  const n = 7, gap = 8;
  const boxW = (INNER - gap*(n-1)) / n;
  const boxH = 54;

  for (let i = 0; i < n; i++) {
    const x = PAD + i*(boxW+gap);
    const isActive = activePhase === i;
    const isDone = state === 'done' || (currentStep > 0 && activePhase > i && i < 6);

    if (isActive)    { fill(238,237,254); stroke(83,74,183); strokeWeight(1.5); }
    else if (isDone) { fill(225,245,238); stroke(15,110,86);  strokeWeight(0.5); }
    else             { fill(255); stroke(180); strokeWeight(0.5); }
    rect(x, y, boxW, boxH, 8);

    noStroke();
    fill(isActive ? color(60,52,137) : isDone ? color(8,80,65) : color(40));
    textSize(11); textAlign(CENTER, CENTER);
    text(PHASE_NAMES[i][0], x + boxW/2, y + boxH/2 - 8);
    fill(isActive ? color(83,74,183) : isDone ? color(15,110,86) : color(150));
    textSize(10);
    text(PHASE_NAMES[i][1], x + boxW/2, y + boxH/2 + 9);
  }

  // Epochen-Dots
  const dotY = y + boxH + 14;
  fill(100); noStroke(); textSize(11); textAlign(LEFT);
  text('Epochen:', PAD, dotY + 8);
  for (let e = 1; e <= totalEpochs; e++) {
    const dx = PAD + 78 + e * 30;
    if (e <= currentEpoch)                              { fill(29,158,117); stroke(15,110,86); }
    else if (e === currentEpoch+1 && state==='running') { fill(83,74,183); stroke(60,52,137); }
    else                                                { fill(255); stroke(180); }
    strokeWeight(0.5); ellipse(dx, dotY+6, 22, 22);
    noStroke();
    fill(e <= currentEpoch || (e===currentEpoch+1 && state==='running') ? 255 : 80);
    textSize(10); textAlign(CENTER,CENTER); text(e, dx, dotY+6);
  }
  return dotY + 26;
}

function drawMetrics(startY) {
  sectionTitle('Metriken', PAD, startY + 13);
  const y = startY + 20;
  const labels = ['Train Loss','Eval Loss','Lernrate','Schritt'];
  const vals = [
    currentLoss !== null ? nf(currentLoss,1,3) : '—',
    currentEval !== null ? nf(currentEval,1,3) : '—',
    currentLR   !== null ? currentLR.toExponential(1) : '—',
    str(currentStep)
  ];
  const cols = [color(216,90,48), color(29,158,117), color(83,74,183), color(40)];
  const n = 4, gap = 8;
  const cardW = (INNER - gap*(n-1)) / n;
  const cardH = 54;

  for (let i = 0; i < n; i++) {
    const x = PAD + i*(cardW+gap);
    fill(234,232,224); noStroke(); rect(x, y, cardW, cardH, 8);
    fill(150); textSize(10); textAlign(LEFT); text(labels[i], x+12, y+16);
    fill(cols[i]); textSize(22); text(vals[i], x+12, y+42);
  }
  return y + cardH;
}

function drawChart(startY) {
  sectionTitle('Loss-Verlauf', PAD, startY + 13);
  const cx=PAD, cy=startY+20, cw=INNER, ch=140;
  fill(234,232,224); noStroke(); rect(cx,cy,cw,ch,8);

  if (trainLoss.length < 2) {
    fill(170); textSize(12); textAlign(CENTER,CENTER);
    text('Loss-Chart erscheint nach dem ersten Schritt', cx+cw/2, cy+ch/2);
    return cy+ch;
  }

  const pad=36;
  const maxL = Math.max(...trainLoss.filter(v=>v!==null), 3);

  function px(i) { return cx+pad+(i/(trainLoss.length-1))*(cw-pad*2); }
  function py(v) { return cy+ch-pad-(v/maxL)*(ch-pad*2); }

  stroke(185); strokeWeight(0.5);
  for (let g=0; g<=3; g++) {
    const gv=maxL*g/3, gy=py(gv);
    line(cx+pad,gy,cx+cw-pad,gy);
    fill(140); noStroke(); textSize(10); textAlign(RIGHT); text(nf(gv,1,1), cx+pad-4, gy+4);
  }
  fill(140); textSize(10); textAlign(CENTER);
  const step = max(1,floor(trainLoss.length/10));
  for (let i=0; i<trainLoss.length; i+=step) text(i+1, px(i), cy+ch-5);

  stroke(216,90,48); strokeWeight(2); noFill();
  beginShape();
  for (let i=0;i<trainLoss.length;i++) if(trainLoss[i]!==null) vertex(px(i),py(trainLoss[i]));
  endShape();
  fill(216,90,48); noStroke();
  for (let i=0;i<trainLoss.length;i++) if(trainLoss[i]!==null) ellipse(px(i),py(trainLoss[i]),5,5);

  fill(29,158,117); stroke(15,110,86); strokeWeight(1);
  for (let i=0;i<evalLoss.length;i++) if(evalLoss[i]!==null) ellipse(px(i),py(evalLoss[i]),10,10);

  noStroke(); fill(216,90,48); rect(cx+pad,cy+9,12,12,2);
  fill(50); textSize(11); textAlign(LEFT); text('Train Loss',cx+pad+16,cy+19);
  fill(29,158,117); ellipse(cx+pad+104,cy+15,10,10);
  fill(50); text('Eval Loss',cx+pad+112,cy+19);

  return cy+ch;
}

function drawBatch(startY) {
  sectionTitle('Mini-Batch — Prompt (lila)  ·  Response (grün)  ·  Padding (grau)', PAD, startY+13);
  const y = startY+20;
  let x = PAD;
  for (let t of batchTokens) {
    textSize(11);
    const tw = max(textWidth(t.text)+14, 32);
    if (t.type==='prompt')        { fill(238,237,254); stroke(175,169,236); }
    else if (t.type==='response') { fill(225,245,238); stroke(93,202,165); }
    else                          { fill(234,232,224); stroke(200); }
    strokeWeight(0.5); rect(x, y, tw, 22, 5);
    noStroke();
    fill(t.type==='prompt'?color(60,52,137):t.type==='response'?color(8,80,65):color(150));
    textSize(11); textAlign(LEFT); text(t.text, x+7, y+15);
    x += tw+5;
  }
  return y+30;
}

function drawLog(startY) {
  sectionTitle('Log', PAD, startY+13);
  const y=startY+20, logH=90;
  fill(234,232,224); noStroke(); rect(PAD,y,INNER,logH,8);
  const show = logLines.slice(-6);
  textSize(11); textAlign(LEFT);
  for (let i=0;i<show.length;i++) {
    const l=show[i], ly=y+16+i*13;
    fill(160); text('step '+l.step, PAD+12, ly);
    fill(l.type==='loss'?color(216,90,48):l.type==='eval'?color(29,158,117):color(83,74,183));
    text(l.msg, PAD+80, ly);
  }
  return y+logH;
}

function drawExplanations(startY) {
  sectionTitle('Hyperparameter einfach erklärt', PAD, startY+13);
  let y = startY+22;
  const cols = 2, gap = 10;
  const cardW = (INNER - gap*(cols-1)) / cols;

  // Zeilenweise je 2 Karten; Zeilenhöhe = Max der beiden Karten-Höhen
  for (let row=0; row < Math.ceil(PARAM_INFO.length/cols); row++) {
    // Höhen der beiden Karten in dieser Zeile vorberechnen
    let rowH = 0;
    for (let col=0; col<cols; col++) {
      const i = row*cols + col;
      if (i >= PARAM_INFO.length) continue;
      textSize(11);
      const lines = wrapText(PARAM_INFO[i].explain, cardW - 28);
      const h = 50 + lines.length*16 + 12;
      if (h > rowH) rowH = h;
    }

    // Beide Karten mit einheitlicher Zeilenhöhe zeichnen
    for (let col=0; col<cols; col++) {
      const i = row*cols + col;
      if (i >= PARAM_INFO.length) continue;
      const p = PARAM_INFO[i];
      const x = PAD + col*(cardW+gap);
      textSize(11);
      const lines = wrapText(p.explain, cardW - 28);

      fill(255); stroke(210); strokeWeight(0.5);
      rect(x, y, cardW, rowH, 8);

      fill(83,74,183); noStroke(); textSize(11); textAlign(LEFT);
      text(p.label, x+12, y+15);
      fill(30); textSize(12);
      text(p.val, x+12, y+32);
      fill(80); textSize(11);
      for (let li=0; li<lines.length; li++) text(lines[li], x+12, y+50+li*16);
    }
    y += rowH + gap;
  }
  return y + 8;
}

function wrapText(txt, maxW) {
  const words = txt.split(' ');
  const lines = [];
  let cur = '';
  for (let w of words) {
    const test = cur ? cur+' '+w : w;
    if (textWidth(test) > maxW && cur !== '') { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}