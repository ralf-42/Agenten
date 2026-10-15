// Zentrierte interaktive Visualisierung mit mittig angeordneten Schaltflächen
// Bereit für https://p5js.org/

let messages = [];
let currentStrategy = 'trimming'; 
let maxMessages = 5;            // Maximal erlaubte Nachrichten im LLM-Kontext
let keepRecent = 2;             // Wie viele Nachrichten nach der Summary direkt live bleiben
let summaryText = "";
let archiveCount = 0;           // Wie viele Nachrichten in die Summary geflossen sind

// UI-Layout-Variablen zur Zentrierung
let appW;
let appX;
const CANVAS_H = 660;

// UI Elemente
let btnAddMessage;
let btnToggleStrategy;
let btnReset;

const poolInput = [
  { role: 'user', text: "Mein Name ist Max." },
  { role: 'ai', text: "Hey Max! 😄 Freut mich, dich kennenzulernen." },
  { role: 'user', text: "Ich bin 30 Jahre alt." },
  { role: 'ai', text: "Nice, Max! 30 ist ein ziemlich solides Level." },
  { role: 'user', text: "Ich komme aus München." }, 
  { role: 'ai', text: "Ohhh München! 🇩🇪🌻 Respekt." }, 
  { role: 'user', text: "Ich arbeite als Data Scientist." }, 
  { role: 'ai', text: "Geil, Max! Data Scientist klingt spannend." }, 
  { role: 'user', text: "Mein Hobby ist Fotografie." },
  { role: 'ai', text: "Nice, Max! 📸 Welt im Pixelbereich messen." },
  { role: 'user', text: "Ich mag italienisches Essen." },
  { role: 'ai', text: "Aha! Italienisches Essen ist also dein zweiter Datensatz. 🍝" }
];
let poolIndex = 0;

function setup() {
  createCanvas(windowWidth, CANVAS_H);
  
  // Buttons initialisieren (Position wird dynamisch in draw() gesetzt)
  btnAddMessage = createButton('➕ Nachricht hinzufügen');
  btnAddMessage.mousePressed(addNextMessage);
  
  btnToggleStrategy = createButton('🔄 Strategie wechseln');
  btnToggleStrategy.position(190, 20);
  btnToggleStrategy.mousePressed(toggleStrategy);
  
  btnReset = createButton('🧹 Reset');
  btnReset.mousePressed(resetSimulation);
  
  // Start mit 2 Nachrichten
  addNextMessage();
  addNextMessage();
}

function windowResized() {
  resizeCanvas(windowWidth, CANVAS_H);
}

function draw() {
  background(245, 247, 250);
  updateLayout(); // Berechnet appW und appX neu
  
  // NEU: Buttons dynamisch in gleicher Höhe zentrieren
  let buttonY = 20;
  let btnW1 = 160;
  let btnW2 = 150;
  let btnW3 = 80;
  let buttonGap = 15;
  
  // Berechne die Gesamtbreite der Button-Gruppe, um den Startpunkt zu finden
  let totalButtonsW = btnW1 + btnW2 + btnW3 + (buttonGap * 2);
  let startBtnX = (width - totalButtonsW) / 2;
  
  // Zuweisung der dynamischen Positionen
  btnAddMessage.position(startBtnX, buttonY);
  btnToggleStrategy.position(startBtnX + btnW1 + buttonGap, buttonY);
  btnReset.position(startBtnX + btnW1 + btnW2 + (buttonGap * 2), buttonY);
  
  // Header: Strategie-Titel (zentriert)
  fill(44, 62, 80);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  textStyle(BOLD);
  let strategyName = currentStrategy === 'trimming' ? "Trimming (Sliding Window)" : "Summary (Rolling Summary)";
  text(`Aktive Strategie: ${strategyName}`, width / 2, 65);
  
  // Erklärungstext (zentriert)
  textSize(13);
  textStyle(NORMAL);
  fill(127, 140, 141);
  if (currentStrategy === 'trimming') {
    text(`Limit: Max. ${maxMessages} Nachrichten im Kontext. Ältere Nachrichten fallen hart raus (❌).`, width / 2, 95);
  } else {
    text(`Rolling Summary: Limit = ${maxMessages} (es werden ${keepRecent} Nachrichten gehalten). Erst wenn wieder mehr als ${maxMessages} Nachrichten im Kontext liegen, wird nachverdichtet.`, width / 2, 95);
  }
  
  // Fixierte Legende (zentriert)
  drawLegend(width / 2);
  
  // Trennlinie
  stroke(220, 224, 230);
  strokeWeight(1);
  line(appX, 150, appX + appW, 150);
  
  let startY = 190;
  let boxWidth = (appW - 40) / 2;
  
  // Spalten-Titel
  fill(52, 73, 94);
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("Vollständiger Verlauf", appX, startY - 25);
  text("Effektives LLM-Kontextfenster", appX + boxWidth + 40, startY - 25);
  textStyle(NORMAL);
  
  let currentRightY = startY;
  
  // Rechten Kontext aufbauen (Summary Box)
  if (currentStrategy === 'summary' && summaryText !== "") {
    drawSummaryBox(appX + boxWidth + 40, currentRightY, boxWidth);
    currentRightY += 75;
  }
  
  // Berechne das Trimming-Fenster
  let trimmingCutoff = messages.length - maxMessages;
  
  for (let i = 0; i < messages.length; i++) {
    let msg = messages[i];
    let isInWindow = true;
    
    if (currentStrategy === 'trimming') {
      isInWindow = (i >= trimmingCutoff);
    } else { // Summary
      isInWindow = (i >= archiveCount);
    }
    
    // Links zeichnen
    drawMessageBox(appX, startY + (i * 40), boxWidth, msg, true, isInWindow);
    
    // Rechts zeichnen
    if (isInWindow) {
      drawMessageBox(appX + boxWidth + 40, currentRightY, boxWidth, msg, false, true);
      currentRightY += 40;
    }
  }
}

function updateLayout() {
  appW = min(960, width - 40); 
  appX = (width - appW) / 2;   
}

function drawMessageBox(x, y, w, msg, showStatus, isInWindow) {
  let isUser = msg.role === 'user';
  
  if (!isInWindow && showStatus) {
    fill(230, 233, 237, 140); 
    stroke(180, 188, 200, 80);
  } else {
    if (isUser) {
      fill(214, 234, 248); 
      stroke(127, 179, 213);
    } else {
      fill(232, 248, 245); 
      stroke(163, 228, 215);
    }
  }
  
  rect(x, y, w, 32, 6);
  
  if (showStatus) {
    textSize(12);
    textAlign(CENTER, CENTER);
    if (isInWindow) {
      fill(46, 204, 113);
      text("✅", x + 18, y + 16);
    } else {
      fill(231, 76, 60);
      text(currentStrategy === 'trimming' ? "❌" : "📋", x + 18, y + 16); 
    }
  }
  
  fill(44, 62, 80);
  textSize(11);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  let prefix = isUser ? "Mensch: " : "KI: ";
  let textStartX = showStatus ? x + 38 : x + 12;
  text(prefix, textStartX, y + 16);
  
  textStyle(NORMAL);
  let maxChar = floor(w / 8); 
  let displayStr = msg.text.length > maxChar ? msg.text.substring(0, maxChar - 2) + "..." : msg.text;
  text(displayStr, textStartX + 52, y + 16);
}

function drawSummaryBox(x, y, w) {
  fill(252, 243, 207); 
  stroke(247, 220, 111);
  rect(x, y, w, 64, 6);
  
  fill(183, 149, 11);
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("📋 System-Prompt (Bisherige Zusammenfassung):", x + 12, y + 10);
  
  fill(44, 62, 80);
  textStyle(ITALIC);
  textSize(11);
  
  if(summaryText.length > 45) {
    text(summaryText.substring(0, 45), x + 12, y + 28);
    text(summaryText.substring(45), x + 12, y + 44);
  } else {
    text(summaryText, x + 12, y + 32);
  }
  textStyle(NORMAL);
}

function drawLegend(centerX) {
  textSize(11);
  textAlign(CENTER, TOP);
  fill(44, 62, 80);
  textStyle(BOLD);
  text("Status im Speicher:", centerX - 260, 122);
  
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  text("✅ Aktiver LLM-Kontext", centerX - 140, 122);
  text("❌ Gelöscht (Trimming)", centerX + 20, 122);
  text("📋 In Summary komprimiert", centerX + 180, 122);
}

function addNextMessage() {
  if (poolIndex < poolInput.length) {
    messages.push(poolInput[poolIndex]);
    poolIndex++;
    
    let activeMessagesInContext = messages.length - archiveCount;
    
    if (currentStrategy === 'summary' && activeMessagesInContext > maxMessages) {
      archiveCount = messages.length - keepRecent;
      updateSummary(archiveCount);
    }
  }
}

function toggleStrategy() {
  currentStrategy = currentStrategy === 'summary' ? 'trimming' : 'summary';
  if (currentStrategy === 'summary' && messages.length > maxMessages) {
    archiveCount = messages.length - keepRecent;
    updateSummary(archiveCount);
  } else if (currentStrategy === 'trimming') {
    summaryText = "";
    archiveCount = 0;
  }
}

function updateSummary(toIndex) {
  let facts = [];
  for (let i = 0; i < toIndex; i++) {
    let t = messages[i].text;
    if (t.includes("Max")) facts.push("Name: Max");
    if (t.includes("30 Jahre")) facts.push("Alter: 30");
    if (t.includes("München")) facts.push("Herkunft: München");
    if (t.includes("Data Scientist")) facts.push("Beruf: Data Scientist");
    if (t.includes("Fotografie")) facts.push("Hobby: Fotografie");
  }
  
  facts = [...new Set(facts)];
  
  if (facts.length > 0) {
    summaryText = "Fakten: " + facts.join(" | ");
  } else {
    summaryText = "Konversation gestartet...";
  }
}

function resetSimulation() {
  messages = [];
  poolIndex = 0;
  summaryText = "";
  archiveCount = 0;
  addNextMessage();
  addNextMessage();
}