// Transformer-Architektur Visualisierung in p5.js
let words = ["Attention", "is", "all", "you", "need", "for", "deep", "learning"];
let selectedWordIdx = 0;
let viewMode = 'attention'; // 'attention' oder 'architecture'
let attentionMatrix = [];
let animFrame = 0;

function setup() {
  // Erstellt ein großzügiges, gut lesbares Canvas
  let canvas = createCanvas(900, 680);
  
  // --- CSS-ZENTRIERUNG FÜR DEN BROWSER ---
  // Richtet das p5-Canvas mittig im Editorfenster aus und sorgt für ein modernes Interface
  canvas.style('display', 'block');
  canvas.style('margin', '30px auto');
  canvas.style('border-radius', '12px');
  canvas.style('box-shadow', '0 12px 30px rgba(0, 0, 0, 0.4)');
  
  textAlign(CENTER, CENTER);
  textSize(16);
  
  // Generiere pseudo-zufällige, aber feste Attention-Gewichte für den Beispielsatz
  randomSeed(42);
  for (let i = 0; i < words.length; i++) {
    attentionMatrix[i] = [];
    let sum = 0;
    for (let j = 0; j < words.length; j++) {
      let base = random(0.1, 0.4);
      if (i === j) base += 0.5; // Selbstbezug (Self-Attention Bias)
      if ((i === 0 && j === 7) || (i === 7 && j === 0)) base += 0.6; // Attention <-> learning
      if ((i === 6 && j === 7) || (i === 7 && j === 6)) base += 0.7; // deep <-> learning
      attentionMatrix[i][j] = base;
      sum += base;
    }
    // Normalisieren (Softmax-Prinzip), damit die Summe pro Zeile exakt 1.00 ergibt
    for (let j = 0; j < words.length; j++) {
      attentionMatrix[i][j] /= sum;
    }
  }
}

function draw() {
  background(20, 24, 35);
  animFrame += 0.02;

  // Titel & Navigation
  drawHeader();

  if (viewMode === 'attention') {
    drawAttentionView();
  } else {
    drawArchitectureView();
  }
}

// --- UI-KOMPONENTEN ---

function drawHeader() {
  fill(255);
  textSize(24);
  textStyle(BOLD);
  text("Transformer-Architektur Explorer", width / 2, 45);
  
  textSize(14);
  textStyle(NORMAL);
  fill(150, 160, 180);
  text("Demo zum Verständnis von Self-Attention und Datenfluss", width / 2, 75);

  // Zentrierte Ausrichtung der Navigations-Buttons
  let btnWidth = 170;
  let btnHeight = 38;
  let totalBtnWidth = (btnWidth * 2) + 20;
  let startBtnX = (width - totalBtnWidth) / 2;

  drawButton(startBtnX, 110, btnWidth, btnHeight, "Self-Attention", viewMode === 'attention');
  drawButton(startBtnX + btnWidth + 20, 110, btnWidth, btnHeight, "Datenfluss (Layers)", viewMode === 'architecture');
}

function drawButton(x, y, w, h, label, isActive) {
  push();
  if (isActive) {
    fill(66, 135, 245);
    stroke(100, 170, 255);
    strokeWeight(1.5);
  } else {
    fill(35, 42, 58);
    stroke(60, 70, 90);
    strokeWeight(1);
  }
  rect(x, y, w, h, 8);
  
  fill(255);
  noStroke();
  textStyle(isActive ? BOLD : NORMAL);
  text(label, x + w/2, y + h/2);
  pop();
}

// --- ANSICHT 1: SELF-ATTENTION VISUALISIERUNG ---

function drawAttentionView() {
  let startX = 120;
  let spacing = (width - 240) / (words.length - 1); 
  let yWords = 300;

  fill(180, 190, 210);
  textSize(14);
  text("Klicke auf ein Wort, um zu sehen, worauf der Transformer seine Aufmerksamkeit (Attention) richtet:", width / 2, 190);

  // Verbindungen (Attention Lines) zeichnen
  for (let j = 0; j < words.length; j++) {
    let weight = attentionMatrix[selectedWordIdx][j];
    let sourceX = startX + selectedWordIdx * spacing;
    let targetX = startX + j * spacing;
    
    // Dynamische Linienstärke und Deckkraft basierend auf dem echten Gewicht
    stroke(66, 135, 245, weight * 255);
    strokeWeight(weight * 14 + 1.5); 
    
    // Kurve zeichnen für flüssige Optik
    noFill();
    bezier(sourceX, yWords + 20, sourceX, yWords + 130, targetX, yWords + 130, targetX, yWords + 20);
    
    // Gewichte als Text unter den Linien anzeigen
    if (weight > 0.02) {
      fill(100, 200, 255, weight * 255 + 50);
      noStroke();
      textSize(12);
      text(nf(weight, 1, 2), targetX, yWords + 150);
    }
  }

  // Wörter zeichnen
  for (let i = 0; i < words.length; i++) {
    let x = startX + i * spacing;
    let isSelected = (i === selectedWordIdx);

    if (isSelected) {
      fill(66, 135, 245, 40);
      stroke(66, 135, 245);
      strokeWeight(2);
      rect(x - spacing/2 + 8, yWords - 25, spacing - 16, 50, 8);
    }

    noStroke();
    if (isSelected) {
      fill(255, 215, 0); // Gold für das aktive Fokus-Wort
      textStyle(BOLD);
      textSize(17);
    } else {
      let weight = attentionMatrix[selectedWordIdx][i];
      fill(lerpColor(color(130, 140, 160), color(255), weight * 1.5));
      textStyle(NORMAL);
      textSize(15);
    }

    text(words[i], x, yWords);
  }

  drawExplanationBox();
}

function drawExplanationBox() {
  push();
  fill(30, 37, 53);
  stroke(50, 60, 80);
  rect(60, 510, width - 120, 120, 8); 
  
  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text("Was passiert hier?", 85, 525);
  
  textStyle(NORMAL);
  textSize(13.5);
  fill(190, 200, 220);
  
  let activeW = words[selectedWordIdx];
  let explanation = "";
  
  // LIVE-WERTE AUS DER MATRIX AUSLESEN
  let weightToLearning = nf(attentionMatrix[selectedWordIdx][7], 1, 2); 
  let weightToDeep = nf(attentionMatrix[selectedWordIdx][6], 1, 2);
  let selfWeight = nf(attentionMatrix[selectedWordIdx][selectedWordIdx], 1, 2);
  
  // Komplett dynamisierte Kommentierung ohne feste Blindwerte
  if (activeW === "Attention") {
    explanation = "Das Modell verknüpft das Wort 'Attention' aktuell mit einem mathematischen Wert von " + weightToLearning + " mit dem Wort 'learning'. Es hat gelernt, dass im Kontext dieses Satzes 'Attention' das Kernkonzept für das anschließende 'learning' beschreibt.";
  } else if (activeW === "deep" || activeW === "learning") {
    explanation = "Hier siehst du die direkte Verbindung zwischen 'deep' (" + weightToDeep + ") und 'learning' (" + weightToLearning + "). Der Transformer erkennt durch diese Gewichte, dass die beiden Wörter zusammen einen festen, zusammenhängenden Begriff ('Deep Learning') bilden.";
  } else {
    explanation = "Wenn das Modell das Wort '" + activeW + "' verarbeitet, behält es sich selbst zu " + selfWeight + " im Fokus (Self-Attention). Die restliche Aufmerksamkeit verteilt sich simultan auf alle anderen Wörter im Satz, um den grammatikalischen Kontext zu erfassen.";
  }
  
  text(explanation, 85, 555, width - 170, 70);
  pop();
}

// --- ANSICHT 2: STRUKTUR / DATENFLUSS ---

function drawArchitectureView() {
  let layers = [
    { name: "1. Input Tokens", desc: "Satz wird in Zahlen zerlegt", y: 190 },
    { name: "2. Embedding + Positional Encoding", desc: "Wörter werden zu Vektoren + Positionsdaten", y: 275 },
    { name: "3. Multi-Head Attention Layer", desc: "Parallelisierte Kontext-Berechnung (wichtigster Schritt!)", y: 360, highlight: true },
    { name: "4. Feed Forward Network", desc: "Mustererkennung & Transformation pro Wort", y: 445 },
    { name: "5. Linear & Softmax (Output)", desc: "Wahrscheinlichkeiten für das nächste Wort", y: 530 }
  ];

  // Verbindungsbänder im Hintergrund zeichnen
  for (let i = 0; i < layers.length - 1; i++) {
    stroke(40, 50, 75);
    strokeWeight(12);
    line(width/2, layers[i].y + 25, width/2, layers[i+1].y - 25);
    
    let pulseY = map((animFrame + i*0.5) % 1, 0, 1, layers[i].y + 25, layers[i+1].y - 25);
    noStroke();
    fill(100, 200, 255, 150);
    ellipse(width/2, pulseY, 10, 10);
  }

  // Layer-Boxen zeichnen
  for (let l of layers) {
    push();
    if (l.highlight) {
      fill(35, 60, 110);
      stroke(66, 135, 245);
      strokeWeight(2);
    } else {
      fill(30, 37, 53);
      stroke(50, 60, 80);
      strokeWeight(1);
    }
    
    rect(width/2 - 210, l.y - 25, 420, 52, 8);
    
    noStroke();
    fill(l.highlight ? color(100, 210, 255) : color(255));
    textStyle(BOLD);
    textSize(14);
    text(l.name, width/2, l.y - 4);
    
    fill(160, 175, 195);
    textStyle(NORMAL);
    textSize(11.5);
    text(l.desc, width/2, l.y + 15);
    pop();
  }
}

// --- MAUS-INTERAKTION ---

function mousePressed() {
  let btnWidth = 170;
  let btnHeight = 38;
  let totalBtnWidth = (btnWidth * 2) + 20;
  let startBtnX = (width - totalBtnWidth) / 2;

  // Klick-Abfrage für Navigations-Buttons
  if (mouseY >= 110 && mouseY <= 110 + btnHeight) {
    if (mouseX >= startBtnX && mouseX <= startBtnX + btnWidth) {
      viewMode = 'attention';
    } else if (mouseX >= startBtnX + btnWidth + 20 && mouseX <= startBtnX + totalBtnWidth) {
      viewMode = 'architecture';
    }
  }

  // Klick-Abfrage für Wort-Auswahl im zentrierten Layout
  if (viewMode === 'attention') {
    let startX = 120;
    let spacing = (width - 240) / (words.length - 1);
    let yWords = 300;

    for (let i = 0; i < words.length; i++) {
      let x = startX + i * spacing;
      if (mouseX >= x - spacing/2 && mouseX <= x + spacing/2 && mouseY >= yWords - 30 && mouseY <= yWords + 30) {
        selectedWordIdx = i;
        break;
      }
    }
  }
}