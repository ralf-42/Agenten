let currentPhase = 0;
let particles = [];
let optimizeProgress = 0;
let promptQuality = 20;
let modulePulse = 0;

let appW;
let appX;

const CANVAS_H = 760;

const phases = [
  { title: "Signature", subtitle: "Was soll rein und raus?" },
  { title: "Module", subtitle: "Wie wird es gelöst?" },
  { title: "Optimizer", subtitle: "Wie wird es besser?" }
];

function setup() {
  createCanvas(windowWidth, CANVAS_H);
  textAlign(CENTER, CENTER);
  rectMode(CORNER);
}

function windowResized() {
  resizeCanvas(windowWidth, CANVAS_H);
}

function draw() {
  background(245, 247, 250);
  updateLayout();

  drawTitle();
  drawWorkflowSteps();
  drawDivider();

  if (currentPhase === 0) drawStartScreen();
  if (currentPhase === 1) drawSignaturePhase();
  if (currentPhase === 2) drawModulePhase();
  if (currentPhase === 3) drawOptimizationPhase();

  updateParticles();
}

function updateLayout() {
  appW = min(980, width - 40);
  appX = (width - appW) / 2;
}

function drawTitle() {
  fill(30);
  noStroke();

  textStyle(BOLD);
  textSize(28);
  text("DSPy: Vom Ziel zur optimierten LLM-Pipeline", width / 2, 38);

  textStyle(NORMAL);
  textSize(14);
  fill(90);
  text("Interaktive Demo: Klicke die Schritte oben an", width / 2, 70);
}

function drawWorkflowSteps() {
  let top = 102;
  let gap = 24;
  let cardW = (appW - gap * 2) / 3;
  let cardH = 64;

  for (let i = 0; i < phases.length; i++) {
    let x = appX + i * (cardW + gap);
    let y = top - 20;
    let centerX = x + cardW / 2;

    let active = currentPhase === i + 1;
    let hover = mouseX > x && mouseX < x + cardW && mouseY > y && mouseY < y + cardH;

    fill(active ? color(0, 123, 255) : hover ? color(232, 241, 255) : color(235));
    stroke(active ? color(0, 95, 200) : color(205));
    strokeWeight(active ? 2 : 1);
    rect(x, y, cardW, cardH, 14);

    noStroke();

    fill(active ? 255 : 60);
    textStyle(BOLD);
    textSize(15);
    text((i + 1) + ". " + phases[i].title, centerX, top);

    fill(active ? 235 : 105);
    textStyle(NORMAL);
    textSize(12);
    text(phases[i].subtitle, centerX, top + 24);
  }

  textStyle(NORMAL);
}

function drawDivider() {
  stroke(218);
  strokeWeight(1);
  line(0, 182, width, 182);
  noStroke();
}

function drawStartScreen() {
  let y = 230;

  fill(33);
  textStyle(BOLD);
  textSize(26);
  text("Die Grundidee", width / 2, y);

  textStyle(NORMAL);
  textSize(18);
  fill(75);
  text(
    "DSPy beschreibt nicht zuerst den perfekten Prompt,\n" +
      "sondern die Aufgabe, die getestet und optimiert werden soll.",
    width / 2,
    y + 68
  );

  drawExampleFlow(width / 2, y + 185);

  drawExampleCard(width / 2 - 350, y + 250, 700, 128);

  drawInfoCard(
    width / 2 - 280,
    y + 405,
    560,
    76,
    "Merksatz",
    "DSPy macht LLM-Anwendungen programmierbar: definieren, ausführen, messen, optimieren."
  );
}

function drawExampleFlow(cx, cy) {
  let boxW = 180;
  let boxH = 48;

  drawMiniBox(cx - 260, cy, boxW, boxH, "context + question", color(0, 123, 255));
  drawArrow(cx - 165, cy, cx - 95, cy);

  drawMiniBox(cx, cy, 130, boxH, "DSPy", color(108, 92, 231));
  drawArrow(cx + 75, cy, cx + 155, cy);

  drawMiniBox(cx + 260, cy, boxW, boxH, "answer", color(40, 167, 69));
}

function drawExampleCard(x, y, w, h) {
  fill(255);
  stroke(220);
  strokeWeight(1);
  rect(x, y, w, h, 14);

  noStroke();

  fill(33);
  textStyle(BOLD);
  textSize(16);
  text("Konkretes Beispiel", x + w / 2, y + 24);

  textStyle(NORMAL);
  textSize(14);
  fill(70);
  text(
    "Aufgabe: Beantworte Fragen zu einem Dokument.\n" +
      "Klassisch: langen Prompt formulieren und manuell verbessern.\n" +
      "DSPy: Signature definieren → Modul wählen → Optimizer findet bessere Prompts und Beispiele.",
    x + w / 2,
    y + 78
  );
}

function drawSignaturePhase() {
  drawSectionHeading("1. Signature: Deklarativ beschreiben, was passieren soll");

  let leftX = width / 2 - 330;
  let rightX = width / 2 + 120;
  let y = 260;

  drawBox(leftX, y, 210, 95, "INPUT", "context\nquestion", color(0, 123, 255));
  drawArrow(leftX + 245, y + 48, rightX - 35, y + 48);
  drawBox(rightX, y, 210, 95, "OUTPUT", "answer", color(40, 167, 69));

  drawCodeCard(
    "signature = \"context, question -> answer\"",
    "Die Signature sagt: Welche Felder kommen rein? Welche Antwort wird erwartet?"
  );

  drawInfoCard(
    width / 2 - 310,
    485,
    620,
    76,
    "Wichtig",
    "Noch kein finaler Prompt. Die Struktur der Aufgabe steht im Vordergrund."
  );
}

function drawModulePhase() {
  drawSectionHeading("2. Module: Die Signature bekommt eine Lösungsstrategie");

  modulePulse += 0.04;
  let pulse = sin(modulePulse) * 4;

  let boxW = 320;
  let boxH = 122;
  let x = width / 2 - boxW / 2 - pulse / 2;
  let y = 245 - pulse / 2;

  fill(230, 242, 255);
  stroke(0, 123, 255);
  strokeWeight(2);
  rect(x, y, boxW + pulse, boxH + pulse, 16);

  noStroke();
  fill(0, 65, 130);
  textStyle(BOLD);
  textSize(19);
  text("dspy.ChainOfThought", width / 2, 282);

  textStyle(NORMAL);
  textSize(13);
  fill(80);
  text("Modul erzeugt eine Antwortstruktur\ninklusive internem Zwischenschritt", width / 2, 325);

  fill(60);
  textSize(14);
  text("Klicke auf das Modul, um Testdaten hindurchzuschicken.", width / 2, 420);

  drawMiniPipeline();
}

function drawOptimizationPhase() {
  drawSectionHeading("3. Optimizer: Prompts und Beispiele werden verbessert");

  optimizeProgress = min(optimizeProgress + 0.45, 100);
  promptQuality = min(promptQuality + 0.32, 95);

  drawProgressBar(width / 2 - 230, 270, 460, 24, optimizeProgress, "Kompilierung");
  drawProgressBar(width / 2 - 230, 340, 460, 24, promptQuality, "Prompt-/Example-Qualität");

  if (frameCount % 8 === 0 && optimizeProgress < 100) {
    particles.push(new Particle(random(width / 2 - 220, width / 2 + 220), 282, true));
  }

  if (optimizeProgress >= 100) {
    fill(40, 167, 69);
    textStyle(BOLD);
    textSize(17);
    text("Fertig: Optimierte Instruktionen und Few-Shot-Beispiele gefunden", width / 2, 445);

    textStyle(NORMAL);
    fill(80);
    textSize(14);
    text("Bei neuem Modell oder neuen Daten kann erneut kompiliert werden.", width / 2, 482);
  }
}

function drawSectionHeading(t) {
  fill(35);
  noStroke();
  textStyle(BOLD);
  textSize(20);
  text(t, width / 2, 220);
  textStyle(NORMAL);
}

function drawBox(x, y, w, h, label, body, c) {
  fill(255);
  stroke(c);
  strokeWeight(2);
  rect(x, y, w, h, 12);

  noStroke();
  fill(c);
  textStyle(BOLD);
  textSize(13);
  text(label, x + w / 2, y + 24);

  fill(40);
  textStyle(NORMAL);
  textSize(16);
  text(body, x + w / 2, y + 64);
}

function drawMiniBox(cx, cy, w, h, label, c) {
  fill(255);
  stroke(c);
  strokeWeight(2);
  rect(cx - w / 2, cy - h / 2, w, h, 12);

  noStroke();
  fill(c);
  textStyle(BOLD);
  textSize(14);
  text(label, cx, cy);
}

function drawArrow(x1, y1, x2, y2) {
  stroke(110);
  strokeWeight(3);
  line(x1, y1, x2, y2);

  fill(110);
  noStroke();
  triangle(x2, y2, x2 - 12, y2 - 7, x2 - 12, y2 + 7);
}

function drawCodeCard(code, explanation) {
  fill(30);
  noStroke();
  rect(width / 2 - 310, 390, 620, 62, 10);

  fill(120, 220, 160);
  textStyle(BOLD);
  textSize(15);
  text(code, width / 2, 410);

  fill(230);
  textStyle(NORMAL);
  textSize(12);
  text(explanation, width / 2, 436);
}

function drawInfoCard(x, y, w, h, title, body) {
  fill(255);
  stroke(225);
  strokeWeight(1);
  rect(x, y, w, h, 12);

  noStroke();
  fill(33);
  textStyle(BOLD);
  textSize(14);
  text(title, x + w / 2, y + 24);

  fill(85);
  textStyle(NORMAL);
  textSize(13);
  text(body, x + w / 2, y + 54);
}

function drawMiniPipeline() {
  let y = 515;
  let spacing = min(180, appW / 5);
  let startX = width / 2 - spacing * 1.5;

  drawSmallNode(startX, y, "Daten");
  drawSmallNode(startX + spacing, y, "Signature");
  drawSmallNode(startX + spacing * 2, y, "Modul");
  drawSmallNode(startX + spacing * 3, y, "Antwort");

  drawArrow(startX + 50, y, startX + spacing - 50, y);
  drawArrow(startX + spacing + 50, y, startX + spacing * 2 - 50, y);
  drawArrow(startX + spacing * 2 + 50, y, startX + spacing * 3 - 50, y);
}

function drawSmallNode(x, y, label) {
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x - 50, y - 22, 100, 44, 10);

  noStroke();
  fill(70);
  textSize(13);
  text(label, x, y);
}

function drawProgressBar(x, y, w, h, value, label) {
  fill(220);
  noStroke();
  rect(x, y, w, h, h / 2);

  fill(40, 167, 69);
  rect(x, y, map(value, 0, 100, 0, w), h, h / 2);

  fill(40);
  textSize(13);
  text(label + ": " + floor(value) + "%", width / 2, y - 20);
}

function mousePressed() {
  let top = 102;
  let gap = 24;
  let cardW = (appW - gap * 2) / 3;
  let cardH = 64;

  for (let i = 0; i < 3; i++) {
    let x = appX + i * (cardW + gap);
    let y = top - 20;

    if (mouseX > x && mouseX < x + cardW && mouseY > y && mouseY < y + cardH) {
      currentPhase = i + 1;
      particles = [];

      if (currentPhase === 3) {
        optimizeProgress = 0;
        promptQuality = 20;
      }
    }
  }

  if (
    currentPhase === 2 &&
    mouseX > width / 2 - 160 &&
    mouseX < width / 2 + 160 &&
    mouseY > 245 &&
    mouseY < 367
  ) {
    for (let i = 0; i < 12; i++) {
      particles.push(new Particle(width / 2 - 155, 307 + random(-25, 25), false));
    }
  }
}

class Particle {
  constructor(x, y, upward) {
    this.x = x;
    this.y = y;
    this.upward = upward;
    this.vx = upward ? random(-1.2, 1.2) : random(3.5, 6.5);
    this.vy = upward ? random(-4.5, -1.5) : random(-1.5, 1.5);
    this.alpha = 255;
    this.size = upward ? 6 : random(6, 10);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 4.5;
  }

  draw() {
    noStroke();
    fill(this.upward ? color(40, 167, 69, this.alpha) : color(0, 123, 255, this.alpha));
    ellipse(this.x, this.y, this.size);
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].alpha <= 0 || particles[i].x > width + 30 || particles[i].y < 180) {
      particles.splice(i, 1);
    }
  }
}