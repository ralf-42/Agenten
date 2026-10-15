// Docker Lern-App v12 - Kompaktes, komponentenbezogenes UI-Layout
// Die Buttons befinden sich nun direkt unterhalb der jeweiligen Einzelschritte

let step = 0; // 0: Bauplan, 1: Build-Vorgang, 2: Artefakt bereit, 3: Instanz läuft
let particles = [];
let progress = 0;
let nextCursor = "arrow";

// Skalierung und feste Dimensionen (Basis 850x540)
const scaleFactor = 1.15;
const baseWidth = 850;
const baseHeight = 540;

// Button-Definitionen (Koordinaten im unskalierten System)
// Die Buttons sind jetzt den X-Achsen der Komponenten zugeordnet auf y=310
let buttons = [
  { id: "BUILD", label: "docker build", x: 155, y: 310, w: 120, h: 32 },
  { id: "RUN", label: "docker run", x: 425, y: 310, w: 120, h: 32 },
  { id: "RESET", label: "Reset", x: 695, y: 310, w: 80, h: 32, isReset: true }
];

function setup() {
  // Canvas erzeugen und exakt im Browser-Fenster einmitten
  let cnv = createCanvas(baseWidth * scaleFactor, baseHeight * scaleFactor);
  cnv.style('display', 'block');
  cnv.style('margin', 'auto');
  cnv.style('position', 'absolute');
  cnv.style('top', '0');
  cnv.style('bottom', '0');
  cnv.style('left', '0');
  cnv.style('right', '0');
  cnv.style('box-shadow', '0 4px 20px rgba(0,0,0,0.12)');
  cnv.style('border-radius', '8px');

  rectMode(CENTER);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(248, 250, 252);
  nextCursor = "arrow"; 
  
  // Matrix transformieren und das gesamte Koordinatensystem skalieren
  push();
  scale(scaleFactor);
  
  // Hauptüberschrift
  fill(15, 23, 42);
  textSize(22);
  textStyle(BOLD);
  text("Docker-Architektur: Vom Bauplan zur isolierten Instanz", baseWidth / 2, 35);
  
  // Infrastruktur / Host-Balken (Tiefer gesetzt auf y=385 für mehr Luft)
  drawEngineInfrastructure(425, 385);
  
  // Statische/Aktive Verbindungspfeile
  drawFlowArrows();
  
  // Die 3 Hauptkomponenten rendern (y=170)
  drawDockerfileComponent(155, 170);
  drawImageComponent(425, 170);
  drawContainerComponent(695, 170);
  
  // Partikelsysteme und Build-Balken verarbeiten
  handleWorkflow();
  
  // UI-Schaltflächen direkt unter den Schritten rendern
  drawCanvasButtons();
  
  // Didaktisch ausführlicher Statustext am unteren Rand
  drawDetailedStatusText();
  
  pop(); // Skalierungs-Matrix zurücksetzen
  
  cursor(nextCursor);
}

function drawEngineInfrastructure(x, y) {
  push();
  stroke(203, 213, 225);
  strokeWeight(1);
  fill(241, 245, 249);
  rect(x, y, 660, 36, 4);
  
  fill(71, 85, 105);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  text("HOST-SYSTEM / HOST-BETRIEBSSYSTEM", x, y);
  pop();
}

function drawDockerfileComponent(x, y) {
  push();
  if (step === 0) drawGlow(x, y, 110, 150, color(0, 119, 182, 40));
  
  stroke(0, 119, 182);
  strokeWeight(step === 0 ? 3 : 1);
  fill(255);
  rect(x, y, 110, 150, 2);
  
  strokeWeight(3);
  let lines = [color(100), color(0, 119, 182), color(100), color(230, 126, 34)];
  for(let i=0; i<4; i++){
    stroke(lines[i]);
    line(x - 35, y - 50 + i*22, x + 30, y - 50 + i*22);
  }
  
  noStroke();
  fill(0, 119, 182);
  textSize(14);
  textStyle(BOLD);
  text("1. BAUPLAN", x, y + 93);
  textSize(11);
  fill(100);
  textStyle(NORMAL);
  text("(Dockerfile)", x, y + 109);
  pop();
}

function drawImageComponent(x, y) {
  push();
  if (step === 1 || step === 2) drawGlow(x, y, 110, 150, color(72, 202, 228, 50));
  
  stroke(72, 202, 228);
  strokeWeight((step === 1 || step === 2) ? 3 : 1);
  fill(255);
  rect(x, y, 110, 150, 2);
  
  let layerCount = step === 1 ? floor(map(progress, 0, 100, 0, 4)) : (step > 1 ? 4 : 0);
  for(let i = 0; i < layerCount; i++) {
    fill(116, 185, 255, 200 - i * 30);
    stroke(0, 119, 182, 80);
    rect(x, (y + 45) - (i * 32), 90, 24, 2);
    fill(255);
    noStroke();
    textSize(8);
    textStyle(NORMAL);
    text("Layer " + (i+1), x, (y + 45) - (i * 32));
  }
  
  noStroke();
  fill(9, 132, 227);
  textSize(14);
  textStyle(BOLD);
  text("2. ARTEFAKT", x, y + 93);
  textSize(11);
  fill(100);
  textStyle(NORMAL);
  text("(Image Snapshot)", x, y + 109);
  pop();
}

function drawContainerComponent(x, y) {
  push();
  if (step === 3) drawGlow(x, y, 120, 150, color(46, 204, 113, 50));
  
  stroke(step === 3 ? color(46, 204, 113) : color(200));
  strokeWeight(step === 3 ? 3 : 1);
  fill(255);
  rect(x, y, 120, 150, 2);
  
  if (step === 3) {
    for(let i = 0; i < 4; i++) {
      fill(116, 185, 255, 80);
      stroke(0, 119, 182, 40);
      rect(x, (y + 48) - (i * 26), 100, 20, 1);
    }
    fill(250, 177, 160);
    stroke(225, 112, 85);
    rect(x, y - 50, 100, 22, 1);
    fill(192, 41, 43);
    noStroke();
    textSize(9);
    textStyle(BOLD);
    text("Beschreibbar (RW)", x, y - 50);
    
    if (frameCount % 30 < 15) {
      fill(46, 204, 113);
      ellipse(x - 45, y - 25, 6, 6);
    }
  } else {
    fill(241, 245, 249);
    noStroke();
    rect(x, y, 100, 130, 2);
    fill(148, 163, 184);
    textSize(13);
    textStyle(NORMAL);
    text("Inaktiv", x, y);
  }
  
  noStroke();
  fill(39, 174, 96);
  textSize(14);
  textStyle(BOLD);
  text("3. INSTANZ", x, y + 93);
  textSize(11);
  fill(100);
  textStyle(NORMAL);
  text("(Container)", x, y + 109);
  pop();
}

function drawFlowArrows() {
  drawVisualArrow(220, 170, 360, 170, step === 1);
  drawVisualArrow(490, 170, 625, 170, step === 3);
}

function drawVisualArrow(x1, y1, x2, y2, active) {
  push();
  stroke(active ? color(9, 132, 227) : color(200));
  strokeWeight(active ? 3 : 2);
  line(x1, y1, x2, y2);
  let angle = atan2(y2 - y1, x2 - x1);
  
  translate(x2, y2);
  rotate(angle);
  fill(active ? color(9, 132, 227) : color(200));
  triangle(0, 0, -10, -6, -10, 6);
  pop();
}

function drawGlow(x, y, w, h, col) {
  push();
  noStroke();
  for (let i = 10; i > 0; i--) {
    fill(red(col), green(col), blue(col), alpha(col) * (1 - i/10));
    rect(x, y, w + i*2, h + i*2, 4);
  }
  pop();
}

function handleWorkflow() {
  let compY = 170;
  if (step === 1) {
    if (frameCount % 4 === 0) {
      particles.push({x: 210, y: random(compY - 40, compY + 40), tx: 425, ty: random(compY - 40, compY + 40), s: random(4, 7)});
    }
    progress = min(progress + 1.2, 100);
    
    let barWidth = 90;
    let barX = 290;
    push();
    fill(210);
    noStroke();
    rect(barX, compY - 35, barWidth, 6, 3);
    fill(9, 132, 227);
    let currentBarWidth = map(progress, 0, 100, 0, barWidth);
    rect(barX - (barWidth/2) + (currentBarWidth/2), compY - 35, currentBarWidth, 6, 3);
    pop();
    
    if (progress >= 100) { step = 2; progress = 0; }
  } 
  else if (step === 3) {
    if (frameCount % 6 === 0) {
      particles.push({x: 695 + random(-40, 40), y: compY - 40, s: random(1, 2), type: 'run'});
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    if (p.type === 'run') {
      p.y -= p.s;
      fill(46, 204, 113, map(p.y, compY - 40, compY - 110, 255, 0));
      noStroke();
      ellipse(p.x, p.y, 5);
      if (p.y < compY - 110) particles.splice(i, 1);
    } else {
      p.x += p.s;
      fill(9, 132, 227, 200);
      noStroke();
      ellipse(p.x, p.y, 4);
      if (p.x >= 370) particles.splice(i, 1);
    }
  }
}

function drawCanvasButtons() {
  for (let b of buttons) {
    push();
    let isHovered = (mouseX / scaleFactor) > b.x - b.w/2 && (mouseX / scaleFactor) < b.x + b.w/2 &&
                    (mouseY / scaleFactor) > b.y - b.h/2 && (mouseY / scaleFactor) < b.y + b.h/2;
    
    let active = false;
    if (b.id === "BUILD" && step === 0) active = true;
    if (b.id === "RUN" && step === 2) active = true;
    if (b.isReset) active = true;

    if (!active) {
      fill(241); stroke(226);
    } else {
      if (isHovered) { 
        fill(b.isReset ? color(211, 84, 0) : color(71, 85, 105)); 
        nextCursor = "hand"; 
      } else { 
        fill(b.isReset ? color(230, 126, 34) : color(30, 41, 59)); 
      }
      stroke(b.isReset ? color(211, 84, 0) : color(30, 41, 59));
    }
    
    rect(b.x, b.y, b.w, b.h, 4);
    
    noStroke();
    fill(active ? 255 : 180);
    textSize(13);
    textStyle(BOLD);
    text(b.label, b.x, b.y);
    pop();
  }
}

function drawDetailedStatusText() {
  let titleY = baseHeight - 95;  
  let textY = baseHeight - 48;   
  noStroke();

  switch(step) {
    case 0:
      fill(0, 119, 182);
      textStyle(BOLD); textSize(14);
      text("SCHRITT 1: DER CONFIG-BAUPLAN (Infrastructure as Code)", baseWidth / 2, titleY);
      
      fill(71, 85, 105);
      textStyle(NORMAL); textSize(12.5);
      text("Das Dockerfile ist ein reines Textdokument. Es definiert deklarativ die exakte Umgebung für deine App\n(z.B. OS-Basis, Umgebungsvariablen, Abhängigkeiten und Startbefehle). Dies verhindert das klassische Problem\n'Works on my machine', da der Bauplan absolut deterministisch und plattformunabhängig ausführbar ist.", baseWidth / 2, textY);
      break;
      
    case 1:
      fill(9, 132, 227);
      textStyle(BOLD); textSize(14);
      text("PROZESS: IMAGE-BUILD (Schichtenerzeugung)", baseWidth / 2, titleY);
      
      fill(71, 85, 105);
      textStyle(NORMAL); textSize(12.5);
      text("Die Docker Engine liest das Dockerfile Zeile für Zeile. Jede einzelne Instruktion (wie RUN oder COPY)\nerzeugt eine neue, in sich geschlossene und schreibgeschützte Dateisystemschicht (Layer).\nUnveränderte Schichten werden beim nächsten Mal gecached, was den Build extrem beschleunigt.", baseWidth / 2, textY);
      break;
      
    case 2:
      fill(9, 132, 227);
      textStyle(BOLD); textSize(14);
      text("SCHRITT 2: DAS ARTEFAKT (Immutable Image Snapshot)", baseWidth / 2, titleY);
      
      fill(71, 85, 105);
      textStyle(NORMAL); textSize(12.5);
      text("Das fertige Docker Image ist ein statischer, kompilierter Schnappschuss aller Schichten. Es ist vollkommen\n'immutable' (unveränderlich). Ein Image läuft selbst nicht als Prozess, sondern dient als exakt definierte,\nschreibgeschützte Kopiervorlage, die beliebig oft und überall identisch gestartet werden kann.", baseWidth / 2, textY);
      break;
      
    case 3:
      fill(39, 174, 96);
      textStyle(BOLD); textSize(14);
      text("SCHRITT 3: DIE LAUFZEIT-INSTANZ (Isolierter Container-Prozess)", baseWidth / 2, titleY);
      
      fill(71, 85, 105);
      textStyle(NORMAL); textSize(12.5);
      text("Beim Ausführen ('run') instanziiert die Docker Engine das Image. Sie startet die App als isolierten Prozess\ndirekt auf dem Kernel des Host-Systems. Docker legt eine hauchdünne, beschreibbare Schicht (Writable Layer)\nüber das Image. Nur dort werden Daten zur Laufzeit verändert oder erzeugt.", baseWidth / 2, textY);
      break;
  }
}

function mousePressed() {
  let mX = mouseX / scaleFactor;
  let mY = mouseY / scaleFactor;
  
  for (let b of buttons) {
    if (mX > b.x - b.w/2 && mX < b.x + b.w/2 && mY > b.y - b.h/2 && mY < b.y + b.h/2) {
      if (b.id === "RESET") {
        step = 0; progress = 0; particles = [];
      } else if (b.id === "BUILD" && step === 0) {
        step = 1; progress = 0;
      } else if (b.id === "RUN" && step === 2) {
        step = 3;
      }
      break;
    }
  }
}