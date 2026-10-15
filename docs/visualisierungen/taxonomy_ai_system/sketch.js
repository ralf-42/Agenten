// AI System Design Taxonomy Simulator
// Zentriertes Layout analog zur Docker-Lern-App

let currentStage = 0;
let particles = [];
let nextCursor = "arrow";

const baseWidth = 950;
const baseHeight = 620;
const scaleFactor = 1.0;

const boxW = 120;
const boxH = 135;
const gap = 30;
const stageY = 155;

const stages = [
  {
    title: "1. USE CASE",
    subtitle: "Business-Problem",
    label: "Geschäftskontext",
    color: [231, 76, 60],
    definition: "Ein konkreter Anwendungsfall innerhalb eines Geschäftsprozesses. Er beschreibt den geschäftlichen Wert, aber noch keine technische Lösung.",
    example: "Kundenservice-Mitarbeiter sind montags durch viele Support-Tickets überlastet. Die KI soll helfen, Tickets schneller zu verstehen, zu priorisieren und weiterzuleiten."
  },
  {
    title: "2. AI TASKS",
    subtitle: "Primitive Fähigkeiten",
    label: "Technische Übersetzung",
    color: [230, 126, 34],
    definition: "Der Use Case wird in konkrete KI-Aufgaben zerlegt. Diese Aufgaben beschreiben Eingaben, Ausgaben und messbare Zielgrößen.",
    example: "Das Ticket-System benötigt Klassifikation der Dringlichkeit, Retrieval passender Hilfeartikel und Generierung eines Antwortentwurfs."
  },
  {
    title: "3. DATA LAYER",
    subtitle: "Daten & Wissen",
    label: "Evidenz & Kontext",
    color: [241, 196, 15],
    definition: "Diese Ebene beschreibt, welche Daten benötigt werden und wie Wissen für Modelle nutzbar gemacht wird.",
    example: "Eingehende E-Mails, historische Tickets und interne Dokumentation werden als Textdaten verarbeitet. Embeddings ermöglichen semantische Suche."
  },
  {
    title: "4. MODELS",
    subtitle: "Algorithmen",
    label: "Intelligenz-Kern",
    color: [52, 152, 219],
    definition: "Hier werden passende Modelle ausgewählt. Die Auswahl hängt von Aufgabe, Datenqualität, Kosten, Geschwindigkeit und Genauigkeit ab.",
    example: "Ein kleines Modell klassifiziert Dringlichkeit. Ein Embedding-Modell sucht relevante Dokumente. Ein LLM erstellt den Antwortentwurf."
  },
  {
    title: "5. ARCHITECTURE",
    subtitle: "Systemdesign",
    label: "Engineering",
    color: [155, 89, 182],
    definition: "Einzelne Modelle werden zu einem nutzbaren System verbunden. Dazu gehören Schnittstellen, Monitoring, Fallbacks und Sicherheitsmechanismen.",
    example: "RAG verbindet Suche und Sprachmodell. Guardrails prüfen Ausgaben. Monitoring erkennt Fehler, Kostenprobleme und Qualitätsverluste."
  },
  {
    title: "6. INTERACTION",
    subtitle: "UX & Kontrolle",
    label: "Wertschöpfung",
    color: [46, 204, 113],
    definition: "Diese Ebene bestimmt, wie Menschen mit der KI arbeiten. Gute Interaktion macht Ergebnisse prüfbar, korrigierbar und nützlich.",
    example: "Die KI schlägt Kategorie, Priorität und Antwort vor. Der Service-Agent prüft den Vorschlag und gibt die E-Mail final frei."
  }
];

function setup() {
  let cnv = createCanvas(baseWidth * scaleFactor, baseHeight * scaleFactor);

  cnv.style("display", "block");
  cnv.style("margin", "auto");
  cnv.style("position", "absolute");
  cnv.style("top", "0");
  cnv.style("bottom", "0");
  cnv.style("left", "0");
  cnv.style("right", "0");
  cnv.style("box-shadow", "0 4px 20px rgba(0,0,0,0.12)");
  cnv.style("border-radius", "8px");

  textFont("Arial");
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(248, 250, 252);
  nextCursor = "arrow";

  push();
  scale(scaleFactor);

  drawHeader();
  drawFlowLine();
  drawStages();
  handleParticles();
  drawInfoPanel();

  pop();

  cursor(nextCursor);
}

function drawHeader() {
  noStroke();

  fill(15, 23, 42);
  textStyle(BOLD);
  textSize(23);
  text("System-Taxonomie für AI-Architekturen", baseWidth / 2, 35);

  fill(100, 116, 139);
  textStyle(NORMAL);
  textSize(13);
  text("Klicke auf eine Stufe, um den Dekompositions-Prozess eines AI-Produkts zu durchlaufen.", baseWidth / 2, 62);
}

function getStageX(index) {
  let totalWidth = stages.length * boxW + (stages.length - 1) * gap;
  let startX = (baseWidth - totalWidth) / 2 + boxW / 2;
  return startX + index * (boxW + gap);
}

function drawFlowLine() {
  let firstX = getStageX(0);
  let lastX = getStageX(stages.length - 1);

  stroke(226, 232, 240);
  strokeWeight(4);
  line(firstX, stageY, lastX, stageY);
}

function drawStages() {
  for (let i = 0; i < stages.length; i++) {
    drawStageBox(i);
  }

  for (let i = 0; i < stages.length - 1; i++) {
    drawArrowBetweenStages(i, i + 1);
  }
}

function drawStageBox(index) {
  let s = stages[index];
  let x = getStageX(index);

  let mx = mouseX / scaleFactor;
  let my = mouseY / scaleFactor;

  let hovered =
    mx > x - boxW / 2 &&
    mx < x + boxW / 2 &&
    my > stageY - boxH / 2 &&
    my < stageY + boxH / 2;

  let selected = currentStage === index;

  if (hovered) nextCursor = "hand";

  push();

  if (selected) {
    drawGlow(x, stageY, boxW, boxH, color(s.color[0], s.color[1], s.color[2], 45));
  }

  stroke(selected ? color(s.color) : color(203, 213, 225));
  strokeWeight(selected ? 3 : 1);
  fill(255);
  rect(x, stageY, boxW, boxH, 8);

  noStroke();
  fill(s.color[0], s.color[1], s.color[2], selected ? 255 : 140);
  rect(x, stageY - boxH / 2 + 7, boxW - 2, 14, 6);

  fill(15, 23, 42);
  textStyle(BOLD);
  textSize(11.5);
  text(s.title, x, stageY - 28);

  fill(71, 85, 105);
  textStyle(NORMAL);
  textSize(10.5);
  text(s.subtitle, x, stageY);

  fill(s.color[0], s.color[1], s.color[2]);
  textStyle(BOLD);
  textSize(9.5);
  text(s.label, x, stageY + 32);

  pop();
}

function drawArrowBetweenStages(fromIndex, toIndex) {
  let x1 = getStageX(fromIndex) + boxW / 2 + 5;
  let x2 = getStageX(toIndex) - boxW / 2 - 5;
  let y = stageY;

  let active = currentStage === fromIndex;

  push();
  stroke(active ? color(30, 41, 59) : color(203, 213, 225));
  strokeWeight(active ? 3 : 2);
  line(x1, y, x2, y);

  noStroke();
  fill(active ? color(30, 41, 59) : color(203, 213, 225));
  triangle(x2, y, x2 - 9, y - 6, x2 - 9, y + 6);
  pop();
}

function drawGlow(x, y, w, h, col) {
  push();
  noStroke();
  for (let i = 12; i > 0; i--) {
    fill(red(col), green(col), blue(col), alpha(col) * (1 - i / 12));
    rect(x, y, w + i * 2, h + i * 2, 10);
  }
  pop();
}

function handleParticles() {
  if (frameCount % 12 === 0 && currentStage < stages.length - 1) {
    let s = stages[currentStage];

    particles.push({
      x: getStageX(currentStage) + boxW / 2,
      y: stageY + random(-22, 22),
      targetX: getStageX(currentStage + 1) - boxW / 2,
      speed: random(2.5, 4.5),
      col: s.color
    });
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.speed;

    noStroke();
    fill(p.col[0], p.col[1], p.col[2], 190);
    ellipse(p.x, p.y + sin(frameCount * 0.08) * 4, 5, 5);

    if (p.x >= p.targetX) {
      particles.splice(i, 1);
    }
  }
}

function drawInfoPanel() {
  let s = stages[currentStage];

  let panelW = 820;
  let panelH = 235;
  let panelX = baseWidth / 2;
  let panelY = 430;

  let leftX = panelX - panelW / 2 + 35;
  let topY = panelY - panelH / 2 + 26;
  let textW = panelW - 70;

  push();

  stroke(226, 232, 240);
  strokeWeight(1.5);
  fill(255);
  rect(panelX, panelY, panelW, panelH, 10);

  noStroke();
  fill(s.color[0], s.color[1], s.color[2]);
  rect(panelX - panelW / 2 + 8, panelY, 7, panelH - 16, 4);

  textAlign(LEFT, TOP);

  fill(s.color[0], s.color[1], s.color[2]);
  textStyle(BOLD);
  textSize(16);
  text(s.title + ": " + s.subtitle.toUpperCase(), leftX, topY);

  let y = topY + 36;

  fill(51, 65, 85);
  textStyle(NORMAL);
  textSize(14);
  y = drawWrappedText(s.definition, leftX, y, textW, 20, 3);

  y += 18;

  stroke(241, 245, 249);
  strokeWeight(2);
  line(leftX, y, leftX + textW, y);

  y += 18;

  noStroke();
  fill(100, 116, 139);
  textStyle(BOLD);
  textSize(12);
  text("PRAXIS-BEISPIEL: KUNDENSERVICE-AUTOMATISIERUNG", leftX, y);

  y += 24;

  fill(15, 23, 42);
  textStyle(NORMAL);
  textSize(14);
  drawWrappedText(s.example, leftX, y, textW, 20, 4);

  pop();
}

function drawWrappedText(txt, x, y, maxW, lineH, maxLines) {
  let words = txt.split(" ");
  let line = "";
  let lines = 0;

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + " ";

    if (textWidth(testLine) > maxW && line.length > 0) {
      text(line, x, y);
      y += lineH;
      lines++;

      if (lines >= maxLines) {
        return y;
      }

      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }

  if (line.length > 0 && lines < maxLines) {
    text(line, x, y);
    y += lineH;
  }

  return y;
}

function mousePressed() {
  let mx = mouseX / scaleFactor;
  let my = mouseY / scaleFactor;

  for (let i = 0; i < stages.length; i++) {
    let x = getStageX(i);

    if (
      mx > x - boxW / 2 &&
      mx < x + boxW / 2 &&
      my > stageY - boxH / 2 &&
      my < stageY + boxH / 2
    ) {
      currentStage = i;
      particles = [];
      break;
    }
  }
}