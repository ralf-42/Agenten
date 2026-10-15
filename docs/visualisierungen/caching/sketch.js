// Interaktive Visualisierung: Prompt Caching vs. Response Caching (Native Canvas-Buttons)
// Entwickelt für den p5.js Web Editor

let cacheMode = "NONE"; 
let isProcessing = false;
let processingProgress = 0;
let messageLog = [];

const systemPrompt = "System: Du bist ein Physik-Bot mit 1000 Seiten Vorwissen...";
const userPrompt = "User: Erkläre mir die Schrödinger-Gleichung.";

// Skalierung und Dimensionen
const scaleFactor = 1.2;
const baseWidth = 850;
const baseHeight = 520;

// Button-Definitionen (Koordinaten basieren auf dem unskalierten 850x520 System)
let buttons = [
  { id: "NONE", label: "1. Kein Cache", x: 50, y: 450, w: 120, h: 35 },
  { id: "PROMPT", label: "2. Prompt Cache", x: 185, y: 450, w: 135, h: 35 },
  { id: "RESPONSE", label: "3. Response Cache", x: 335, y: 450, w: 150, h: 35 },
  { id: "SEND", label: "Prompt senden 🚀", x: 510, y: 450, w: 170, h: 35, isAction: true },
  { id: "RESET", label: "Reset", x: 695, y: 450, w: 95, h: 35, isReset: true }
];

function setup() {
  // Canvas-Größe exakt auf die skalierte Grafik anpassen
  let cnv = createCanvas(baseWidth * scaleFactor, baseHeight * scaleFactor);
  
  // Zentriert das Canvas-Element im Browser-Fenster
  cnv.style('display', 'block');
  cnv.style('margin', 'auto');
  cnv.style('position', 'absolute');
  cnv.style('top', '0');
  cnv.style('bottom', '0');
  cnv.style('left', '0');
  cnv.style('right', '0');
  cnv.style('box-shadow', '0 4px 15px rgba(0,0,0,0.15)');
  cnv.style('border-radius', '8px');

  setCacheMode("NONE");
  logMessage("Simulator geladen. Wähle einen Modus.");
}

function draw() {
  background(245, 247, 250);
  
  // Skaliere das gesamte Koordinatensystem für die Grafik inklusive Buttons
  push();
  scale(scaleFactor);
  
  // Titel & Modus-Beschreibung
  fill(33, 37, 41);
  textSize(22);
  textAlign(LEFT, TOP);
  text("Prompt Caching vs. Response Caching", 50, 25);
  
  textSize(11);
  fill(80);
  let modeDesc = "";
  if (cacheMode === "NONE") modeDesc = "Szenario: Jeder Token (System + User) wird komplett neu berechnet. Langsam & teuer.";
  if (cacheMode === "PROMPT") modeDesc = "Szenario: System-Prompt ist im Cache. KI muss nur die User-Frage lesen und denkt neu nach.";
  if (cacheMode === "RESPONSE") modeDesc = "Szenario: Exakt diese Frage wurde schon mal beantwortet. Antwort kommt sofort ohne KI-Berechnung.";
  text(modeDesc, 50, 55);
  
  // Boxen zeichnen
  drawPromptBox();
  drawCacheBoxes();
  drawLLMBox();
  
  // Datenfluss-Animation
  if (isProcessing) {
    if (cacheMode === "NONE") processingProgress += 1.5;
    if (cacheMode === "PROMPT") processingProgress += 3.5;
    if (cacheMode === "RESPONSE") processingProgress += 8;
    
    let x = map(processingProgress, 0, 100, 250, 550);
    noStroke();
    
    if (processingProgress < 100) {
      if (cacheMode === "NONE") {
        fill(0, 123, 255); circle(x, 145, 12);
        fill(255, 193, 7); circle(x, 205, 12);
      } 
      else if (cacheMode === "PROMPT") {
        fill(255, 193, 7); circle(x, 205, 12);
        fill(40, 167, 69, 150); rect(310, 110, 160, 40, 5); 
      } 
      else if (cacheMode === "RESPONSE") {
        fill(40, 167, 69); circle(x, 205, 15);
      }
    }
    
    if (processingProgress >= 100) {
      isProcessing = false;
      processingProgress = 0;
      
      if (cacheMode === "NONE") {
        logMessage("Ergebnis: 100% Rechenleistung genutzt. Zeit: ~1.8s | Kosten: 100%");
      } else if (cacheMode === "PROMPT") {
        logMessage("Ergebnis: Prompt Cache HIT! KI dachte nur über User-Frage nach. Zeit: ~0.6s | Kosten: ~35%");
      } else if (cacheMode === "RESPONSE") {
        logMessage("Ergebnis: Response Cache MATCH! Fertige Antwort ausgegeben. Zeit: <0.05s | Kosten: ~0%");
      }
    }
  }
  
  drawTerminal();
  drawCanvasButtons();
  
  pop(); 
}

function drawPromptBox() {
  fill(255); stroke(200); strokeWeight(1);
  rect(50, 90, 200, 160, 8);
  fill(33, 37, 41); textSize(14); textAlign(LEFT, TOP); noStroke();
  text("Eingehender Prompt:", 60, 100);
  
  fill(220, 230, 242); rect(55, 125, 190, 50, 4);
  fill(50, 100, 150); textSize(11); text(systemPrompt, 60, 130, 180, 45);
  
  fill(255, 243, 205); rect(55, 185, 190, 50, 4);
  fill(133, 100, 4); text(userPrompt, 60, 190, 180, 45);
}

function drawCacheBoxes() {
  let pActive = (cacheMode === "PROMPT");
  fill(pActive ? 230 : 245, pActive ? 247 : 245, pActive ? 236 : 245);
  stroke(pActive ? 40 : 200, pActive ? 167 : 200, 69);
  strokeWeight(pActive ? 2 : 1);
  rect(300, 110, 180, 50, 6);
  
  let rActive = (cacheMode === "RESPONSE");
  fill(rActive ? 230 : 245, rActive ? 247 : 245, rActive ? 236 : 245);
  stroke(rActive ? 40 : 200, rActive ? 167 : 200, 69);
  strokeWeight(rActive ? 2 : 1);
  rect(300, 185, 180, 50, 6);
  
  textAlign(CENTER, CENTER); textSize(12); noStroke();
  fill(pActive ? 40 : 120); text("💾 Prompt Cache\n" + (pActive ? "[System-Prompt drin]" : "[Leer / Inaktiv]"), 390, 135);
  fill(rActive ? 40 : 120); text("📥 Response Cache\n" + (rActive ? "[Antwort hinterlegt]" : "[Leer / Inaktiv]"), 390, 210);
}

function drawLLMBox() {
  let llmDisabled = (cacheMode === "RESPONSE" && isProcessing);
  
  stroke(100); strokeWeight(1);
  fill(llmDisabled ? 80 : 33, 37, 41);
  rect(550, 90, 240, 160, 8);
  
  fill(255); textSize(15); textAlign(CENTER, CENTER); noStroke();
  text(llmDisabled ? "KI schläft 💤\n(Wird nicht gebraucht)" : "KI / LLM Rechenkern\n(Generiert Antwort)", 670, 140);
  
  if (isProcessing && !llmDisabled) {
    fill(100); rect(575, 195, 190, 12, 4);
    fill(0, 123, 255); rect(575, 195, map(processingProgress, 0, 100, 0, 190), 12, 4);
  }
}

function drawTerminal() {
  fill(20, 24, 30); rect(50, 280, 740, 140, 5);
  fill(0, 255, 0); textFont('Courier New'); textSize(12); textAlign(LEFT, TOP);
  text("> System-Analyse-Konsole:", 65, 295);
  for (let i = 0; i < messageLog.length; i++) {
    text(messageLog[i], 65, 325 + (i * 20));
  }
  textFont('sans-serif');
}

// Zeichnet die Buttons nativ auf das Canvas
function drawCanvasButtons() {
  textSize(12);
  textAlign(CENTER, CENTER);
  strokeWeight(1);
  
  for (let b of buttons) {
    // Bestimme die Farbe basierend auf dem Status
    if (b.isAction) {
      fill(0, 123, 255);
      stroke(0, 100, 200);
    } else if (b.isReset) {
      fill(108, 117, 125);
      stroke(90, 98, 104);
    } else {
      // Modus-Auswahl-Buttons
      if (cacheMode === b.id) {
        fill(b.id === "NONE" ? 220 : 40, b.id === "NONE" ? 53 : 167, 69); // Rot für Kein Cache, Grün für Caches
        stroke(0);
      } else {
        fill(220);
        stroke(180);
      }
    }
    
    rect(b.x, b.y, b.w, b.h, 5);
    
    // Textfarbe
    if (b.isAction || b.isReset || cacheMode === b.id) {
      fill(255);
    } else {
      fill(0);
    }
    noStroke();
    text(b.label, b.x + b.w/2, b.y + b.h/2);
  }
}

// Verarbeitet Klicks auf die nativen Canvas-Buttons
function mousePressed() {
  // Da das Canvas skaliert ist, müssen wir die Mauskoordinaten zurückrechnen
  let mX = mouseX / scaleFactor;
  let mY = mouseY / scaleFactor;
  
  for (let b of buttons) {
    if (mX >= b.x && mX <= b.x + b.w && mY >= b.y && mY <= b.y + b.h) {
      if (b.isAction) {
        sendPrompt();
      } else if (b.isReset) {
        resetSimulation();
      } else {
        setCacheMode(b.id);
      }
      break;
    }
  }
}

function setCacheMode(mode) {
  cacheMode = mode;
  isProcessing = false;
  processingProgress = 0;
  
  if (mode === "NONE") {
    logMessage("Modus gewechselt: KEIN CACHE. Volle Berechnung für alles.");
  } else if (mode === "PROMPT") {
    logMessage("Modus gewechselt: PROMPT CACHING. Der lange System-Kontext wird wiederverwendet.");
  } else if (mode === "RESPONSE") {
    logMessage("Modus gewechselt: RESPONSE CACHING. Exakte Frage-Antwort-Paare werden abgefangen.");
  }
}

function sendPrompt() {
  if (isProcessing) return;
  isProcessing = true;
  processingProgress = 0;
  logMessage(`Sende Prompt im Modus [${cacheMode}]...`);
}

function resetSimulation() {
  isProcessing = false;
  processingProgress = 0;
  messageLog = [];
  setCacheMode("NONE");
}

function logMessage(msg) {
  messageLog.push(msg);
  if (messageLog.length > 4) messageLog.shift();
}