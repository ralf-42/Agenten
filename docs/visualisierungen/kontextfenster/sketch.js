// Chatbot Kontext-Verlust Demo – p5.js
// Einfach den gesamten Inhalt in sketch.js im p5.js Web Editor einfügen und auf Play klicken.
// Keine Bibliotheken, keine Änderungen an index.html nötig.

const W = 1100, H = 740;
const CHAT = { x: 30, y: 130, w: 730, h: 520 };
const MON = { x: 790, y: 130, w: 280, h: 600 };
const OVERHEAD = 20;            // Zeichen-Overhead pro Nachricht (Metadaten)
const BUBBLE_MAX_W = CHAT.w - 30 - 80;

let messages = [];
let pending = [];               // geplante Bot-Antworten
let scrollY = 0, maxScroll = 0, stickBottom = true;
let sMax, sThr, sSpeed, inp, btnSend, btnReset;

const REPLIES = [
  u => `Ich verstehe, Sie haben "${u}" gesagt. Wie kann ich weiterhelfen?`,
  u => `Interessant! Zu "${u}" kann ich sagen, dass es darauf ankommt.`,
  u => `Danke für Ihre Nachricht zu "${u}". Hier meine Antwort:`,
  u => `Zu "${u}" möchte ich ergänzen, dass ich nur sehe, was in meinem Kontext steht.`,
  u => `Basierend auf dem Gespräch und "${u}" schlage ich vor, weiterzumachen.`
];

function setup() {
  createCanvas(W, H);
  textFont('Verdana');

  sMax = createSlider(100, 2000, 300, 50);
  sThr = createSlider(50, 100, 80, 5);
  sSpeed = createSlider(300, 3000, 1000, 100);
  [sMax, sThr, sSpeed].forEach((s, i) => {
    s.position(40 + i * 340, 98);
    s.size(260);
  });

  inp = createInput('');
  inp.position(CHAT.x, 668);
  inp.size(CHAT.w - 130, 24);
  inp.attribute('maxlength', '200');
  inp.attribute('placeholder', 'Nachricht schreiben und Enter drücken …');

  btnSend = createButton('Senden');
  btnSend.position(CHAT.x + CHAT.w - 110, 667);
  btnSend.size(110, 32);
  btnSend.mousePressed(sendMessage);

  btnReset = createButton('Chat zurücksetzen');
  btnReset.position(MON.x + 20, MON.y + MON.h - 55);
  btnReset.size(240, 40);
  btnReset.mousePressed(resetChat);

  resetChat();
}

// ---------- Logik ----------

function maxCtx() { return sMax.value(); }
function threshold() { return maxCtx() * sThr.value() / 100; }
function ctxSize() {
  return messages.reduce((s, m) => s + (m.forgotten ? 0 : m.size), 0);
}

function addMessage(sender, text) {
  const lines = wrapText(text, BUBBLE_MAX_W - 24);
  let widest = 0;
  for (const l of lines) widest = max(widest, textWidth(l));
  messages.push({
    sender, text, lines,
    size: text.length + OVERHEAD,
    bw: widest + 24,
    bh: lines.length * 20 + 18,
    forgotten: false,
    alpha: 0
  });
  stickBottom = true;
}

// Vergessen erst bei echtem Überlauf (Größe > Max. Kontext).
// Dann werden die ältesten Nachrichten entfernt, bis der Zielwert erreicht ist.
// Die neueste aktive Nachricht bleibt immer erhalten.
function enforceLimit() {
  if (ctxSize() <= maxCtx()) return;
  const active = messages.filter(m => !m.forgotten);
  while (ctxSize() > threshold() && active.length > 1) {
    active.shift().forgotten = true;
  }
}

function sendMessage() {
  const t = inp.value().trim();
  if (!t) return;
  addMessage('user', t);
  inp.value('');
  pending.push({ at: millis() + sSpeed.value(), user: t });
}

function botReply(u) {
  const users = messages.filter(m => m.sender === 'user');
  if (/erste|anfang|zuerst/i.test(u)) {
    const first = users[0];
    if (users.length === 1) return 'Das ist bisher Ihre erste Nachricht.';
    if (first.forgotten) return 'Das weiß ich nicht mehr. Diese Nachricht liegt außerhalb meines Kontexts.';
    return `Ihre erste Nachricht war: "${first.text}"`;
  }
  let r = random(REPLIES)(u.length > 40 ? u.slice(0, 40) + '…' : u);
  const prev = users.filter(m => !m.forgotten).slice(0, -1).slice(-2);
  if (prev.length) {
    r += ' Ich erinnere mich noch an: ' +
      prev.map(m => m.text.length > 30 ? m.text.slice(0, 30) + '…' : m.text).join('; ') + '.';
  }
  return r;
}

function resetChat() {
  messages = [];
  pending = [];
  scrollY = 0;
  addMessage('bot', 'Willkommen! Mein Kontext ist begrenzt. Tipp: Fragen Sie später nach Ihrer ersten Nachricht.');
}

function wrapText(str, maxW) {
  textSize(15);
  const lines = [];
  let line = '';
  for (const word of str.split(' ')) {
    let w = word;
    while (textWidth(w) > maxW) {
      let i = w.length - 1;
      while (i > 1 && textWidth(w.slice(0, i)) > maxW) i--;
      if (line) { lines.push(line); line = ''; }
      lines.push(w.slice(0, i));
      w = w.slice(i);
    }
    const test = line ? line + ' ' + w : w;
    if (textWidth(test) <= maxW) line = test;
    else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}

// ---------- Zeichnen ----------

function draw() {
  if (pending.length && millis() >= pending[0].at) {
    addMessage('bot', botReply(pending.shift().user));
  }
  enforceLimit();

  drawBackground();
  drawHeader();
  drawChat();
  drawMonitor();
}

function drawBackground() {
  const g = drawingContext.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#667eea');
  g.addColorStop(1, '#764ba2');
  drawingContext.fillStyle = g;
  drawingContext.fillRect(0, 0, W, H);
  noStroke();
  fill(255, 245);
  rect(10, 10, W - 20, H - 20, 20);
}

function drawHeader() {
  noStroke();
  textAlign(CENTER, TOP);
  fill('#4b4ba8');
  textSize(26);
  textStyle(BOLD);
  text('Chatbot Kontext-Verlust Demo', W / 2, 24);
  textStyle(NORMAL);
  fill(100);
  textSize(13);
  text('Bei begrenzter Kontextkapazität vergisst der Chatbot ältere Nachrichten', W / 2, 60);

  textAlign(LEFT, TOP);
  fill(70);
  textSize(13);
  text(`Max. Kontext: ${sMax.value()} Zeichen`, 40, 78);
  text(`Nach Überlauf bereinigen auf: ${sThr.value()} %`, 380, 78);
  text(`Antwortverzögerung: ${sSpeed.value()} ms`, 720, 78);
}

function drawChat() {
  noStroke();
  fill('#f4f5f7');
  rect(CHAT.x, CHAT.y, CHAT.w, CHAT.h, 14);

  // Höhe berechnen
  let total = 10;
  for (const m of messages) total += m.bh + 12;
  maxScroll = max(0, total - CHAT.h);
  if (stickBottom) scrollY = maxScroll;
  scrollY = constrain(scrollY, 0, maxScroll);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(CHAT.x + 2, CHAT.y + 2, CHAT.w - 4, CHAT.h - 4);
  drawingContext.clip();

  let y = CHAT.y + 10 - scrollY;
  for (const m of messages) {
    m.alpha = lerp(m.alpha, m.forgotten ? 0.3 : 1, 0.12);
    const a = 255 * m.alpha;
    const x = m.sender === 'user' ? CHAT.x + CHAT.w - 15 - m.bw : CHAT.x + 15;
    if (y + m.bh > CHAT.y && y < CHAT.y + CHAT.h) {
      if (m.forgotten) {
        stroke(220, 53, 69, a);
        strokeWeight(1.5);
        drawingContext.setLineDash([5, 4]);
      } else {
        noStroke();
      }
      if (m.sender === 'user') fill(102, 126, 234, a);
      else fill(222, 226, 230, a);
      rect(x, y, m.bw, m.bh, 10);
      drawingContext.setLineDash([]);

      noStroke();
      if (m.sender === 'user') fill(255, a);
      else fill(51, a);
      textAlign(LEFT, TOP);
      textSize(15);
      m.lines.forEach((l, i) => text(l, x + 12, y + 9 + i * 20));
    }
    y += m.bh + 12;
  }
  drawingContext.restore();

  if (pending.length) {
    noStroke();
    fill(120);
    textSize(12);
    textAlign(LEFT, BOTTOM);
    const dots = '.'.repeat(1 + floor(millis() / 350) % 3);
    text('Bot tippt' + dots, CHAT.x + 16, CHAT.y + CHAT.h - 6);
  }
}

function drawMonitor() {
  noStroke();
  fill('#f4f5f7');
  rect(MON.x, MON.y, MON.w, MON.h, 14);

  textAlign(CENTER, TOP);
  fill(51);
  textSize(16);
  textStyle(BOLD);
  text('Kontext-Monitor', MON.x + MON.w / 2, MON.y + 18);
  textStyle(NORMAL);

  // Füllstand
  const size = ctxSize();
  const pct = constrain(size / maxCtx(), 0, 1);
  const bx = MON.x + 20, by = MON.y + 55, bw = MON.w - 40, bh = 30;
  fill('#e1e4e8');
  rect(bx, by, bw, bh, 15);
  const c = pct < 0.5
    ? lerpColor(color('#28a745'), color('#ffc107'), pct * 2)
    : lerpColor(color('#ffc107'), color('#dc3545'), (pct - 0.5) * 2);
  fill(c);
  if (pct > 0) rect(bx, by, max(bw * pct, 2 * 15 * min(1, pct * 8)), bh, 15);
  // Schwellwert-Markierung
  const tx = bx + bw * sThr.value() / 100;
  stroke(51);
  strokeWeight(2);
  line(tx, by - 4, tx, by + bh + 4);
  noStroke();
  fill(pct > 0.45 ? 255 : 51);
  textSize(13);
  textStyle(BOLD);
  text(`${round(pct * 100)}%`, bx + bw / 2, by + 8);
  textStyle(NORMAL);

  // Kennzahlen
  const forgotten = messages.filter(m => m.forgotten).length;
  const stats = [
    ['Aktuelle Größe', size],
    ['Verfügbar', max(0, maxCtx() - size)],
    ['Nachrichten', messages.length],
    ['Vergessen', forgotten]
  ];
  const sw = (MON.w - 50) / 2;
  stats.forEach(([label, val], i) => {
    const sx = MON.x + 20 + (i % 2) * (sw + 10);
    const sy = MON.y + 105 + floor(i / 2) * 60;
    fill(255);
    stroke('#dee2e6');
    strokeWeight(1);
    rect(sx, sy, sw, 50, 8);
    noStroke();
    fill(110);
    textSize(11);
    text(label, sx + sw / 2, sy + 8);
    fill(51);
    textSize(18);
    textStyle(BOLD);
    text(val, sx + sw / 2, sy + 24);
    textStyle(NORMAL);
  });

  // Speicher-Status (letzte 8 Nachrichten)
  fill(51);
  textSize(13);
  textStyle(BOLD);
  text('Speicher-Status', MON.x + MON.w / 2, MON.y + 238);
  textStyle(NORMAL);
  const fading = size > maxCtx() * 0.7;
  messages.slice(-8).forEach((m, i) => {
    const sy = MON.y + 262 + i * 28;
    const col = m.forgotten ? '#dc3545' : fading ? '#ffc107' : '#28a745';
    noStroke();
    fill(255);
    rect(MON.x + 20, sy, MON.w - 40, 24, 5);
    fill(col);
    rect(MON.x + 20, sy, 4, 24, 3, 0, 0, 3);
    const label = `${m.sender === 'user' ? 'USER' : 'BOT'}: ` +
      (m.text.length > 22 ? m.text.slice(0, 22) + '…' : m.text);
    fill(m.forgotten ? 'rgba(80,80,80,0.45)' : 60);
    textAlign(LEFT, CENTER);
    textSize(11);
    text(label, MON.x + 32, sy + 12);
    if (m.forgotten) {
      stroke(120, 120, 120, 150);
      strokeWeight(1);
      line(MON.x + 32, sy + 12, MON.x + 32 + min(textWidth(label), MON.w - 70), sy + 12);
    }
    textAlign(CENTER, TOP);
  });
}

// ---------- Eingaben ----------

function keyPressed() {
  if (keyCode === ENTER && document.activeElement === inp.elt) {
    sendMessage();
    return false;
  }
}

function mouseWheel(e) {
  if (mouseX > CHAT.x && mouseX < CHAT.x + CHAT.w &&
      mouseY > CHAT.y && mouseY < CHAT.y + CHAT.h) {
    scrollY += e.delta;
    stickBottom = scrollY >= maxScroll - 2;
    return false;
  }
}