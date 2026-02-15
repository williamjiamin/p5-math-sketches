// Interactive decimal counting on a number line
// - Click "Try" to generate two close endpoints and a hidden target a
// - Drag from either endpoint to move the a marker in 0.1 steps
// - Each 0.1 step draws an arch and labels 0.1 / -0.1

// ==============================
// Config
// ==============================
const step = 0.1;
const maxStepsToShow = 40; // safety (prevents too many arches)

// ==============================
// State
// ==============================
let initialized = false;
let axisY;
let axisStartX;
let axisEndX;

let leftValue = 14;
let rightValue = 16;
let targetA = 14.2; // hidden target

let dragFrom = null; // "left" | "right" | null
let isDragging = false;

// The student's current position for a (always snapped to 0.1)
let aValue = 14;

// UI (canvas button)
const tryBtn = { x: 20, y: 20, w: 90, h: 36 };

function setup() {
  createCanvas(900, 900);
  textFont("Arial");
  textAlign(CENTER, CENTER);

  updateLayout();
  newRound();
  initialized = true;
}

function draw() {
  // Some preview runners may not call setup() consistently; make initialization resilient.
  if (!initialized) {
    if (typeof createCanvas === "function") createCanvas(900, 420);
    if (typeof textFont === "function") textFont("Arial");
    if (typeof textAlign === "function") textAlign(CENTER, CENTER);
    updateLayout();
    newRound();
    initialized = true;
  } else {
    updateLayout();
  }

  background(255);

  drawPrompt();
  drawTryButton();
  drawNumberLine();
  drawDynamicFormula();

  // Feedback - draw answer below the line when correct
  const correct = toTenthInt(aValue) === toTenthInt(targetA);
  if (correct) {
    drawAnswer();
  }
}

function drawPrompt() {
  noStroke();
  fill(40);
  textSize(18);
  text("Use the points on the ends of the number line to find the value of a", width / 2, 40);
}

function drawTryButton() {
  const hover =
    mouseX >= tryBtn.x &&
    mouseX <= tryBtn.x + tryBtn.w &&
    mouseY >= tryBtn.y &&
    mouseY <= tryBtn.y + tryBtn.h;

  stroke(40);
  strokeWeight(2);
  fill(hover ? 245 : 255);
  rect(tryBtn.x, tryBtn.y, tryBtn.w, tryBtn.h, 8);

  noStroke();
  fill(30);
  textSize(16);
  text("Try", tryBtn.x + tryBtn.w / 2, tryBtn.y + tryBtn.h / 2);
}

function updateLayout() {
  axisY = height * 0.55;
  axisStartX = 120;
  axisEndX = width - 120;
}

function drawNumberLine() {
  const leftX = valueToX(leftValue);
  const rightX = valueToX(rightValue);

  // Axis with arrows
  stroke(40);
  strokeWeight(3);
  line(axisStartX, axisY, axisEndX, axisY);
  drawArrowHead(axisStartX, axisY, -1);
  drawArrowHead(axisEndX, axisY, 1);

  // Ticks (0.1) + labels at endpoints
  drawTicksAndLabels();

  // Endpoint points
  drawEndpoint(leftX, axisY, leftValue.toString());
  drawEndpoint(rightX, axisY, rightValue.toString());

  // Arches based on dragging start and current aValue
  if (dragFrom) {
    const startValue = dragFrom === "left" ? leftValue : rightValue;
    drawCountingArches(startValue, aValue);
  }

  // a marker
  const ax = valueToX(aValue);
  drawAMarker(ax, axisY, aValue);
}

function drawTicksAndLabels() {
  const total = rightValue - leftValue;
  const n = Math.round(total / step);

  // Tiny ticks every 0.1, bigger at integers, medium at 0.5
  for (let i = 0; i <= n; i++) {
    const v = roundTo(leftValue + i * step, step);
    const x = valueToX(v);

    const isInteger = nearlyEqual(v, Math.round(v), 1e-9);
    const isHalf = nearlyEqual((v * 10) % 10, 5, 1e-9);

    stroke(30);
    strokeWeight(isInteger ? 3 : 2);
    const h = isInteger ? 18 : isHalf ? 12 : 8;
    line(x, axisY - h / 2, x, axisY + h);
  }

  // Endpoint numbers under line
  noStroke();
  fill(60);
  textSize(16);
  text(leftValue.toString(), valueToX(leftValue), axisY + 48);
  text(rightValue.toString(), valueToX(rightValue), axisY + 48);
}

function drawEndpoint(x, y, label) {
  // Outer ring
  noFill();
  stroke(230, 40, 120);
  strokeWeight(4);
  ellipse(x, y, 34, 34);

  // Inner dot
  fill(230, 40, 120);
  noStroke();
  ellipse(x, y, 12, 12);

  // Label above
  fill(230, 40, 120);
  textSize(18);
  text(label, x, y - 34);
}

function drawAMarker(x, y, v) {
  // a dot
  fill(60, 120, 240);
  noStroke();
  ellipse(x, y, 14, 14);

  // "a" label under
  fill(40, 90, 210);
  textSize(18);
  textStyle(ITALIC);
  text("a", x, y + 26);
  textStyle(NORMAL);

  // Always show a = <value> above the line
  fill(230, 40, 120);
  textSize(18);
  textStyle(BOLD);
  text(`a = ${formatOneDecimal(v)}`, x, y - 56);
  textStyle(NORMAL);
}

function drawCountingArches(startV, endV) {
  const delta = endV - startV;
  const steps = Math.round(delta / step);
  const count = clampValue(Math.abs(steps), 0, maxStepsToShow);
  if (count === 0) return;

  const dir = steps >= 0 ? 1 : -1;
  const stepPx = Math.abs(valueToX(startV + step) - valueToX(startV));
  const archDiam = stepPx;

  const startX = valueToX(startV);

  stroke(230, 40, 120);
  strokeWeight(3);
  noFill();

  textSize(14);
  fill(230, 40, 120);
  noStroke();

  for (let i = 0; i < count; i++) {
    const x1 = startX + dir * i * stepPx;
    const x2 = startX + dir * (i + 1) * stepPx;
    const midX = (x1 + x2) / 2;

    // Arch (semi-circle above line)
    noFill();
    stroke(230, 40, 120);
    strokeWeight(3);
    arc(midX, axisY, archDiam, archDiam, PI, TWO_PI);

    // label above each arch
    noStroke();
    fill(230, 40, 120);
    const stepLabel = dir > 0 ? "0.1" : "-0.1";
    text(stepLabel, midX, axisY - archDiam * 0.55);
  }
}

function drawArrowHead(x, y, dir) {
  push();
  translate(x, y);
  noStroke();
  fill(40);
  const size = 10;
  triangle(dir * 0, 0, dir * -size, -size / 1.2, dir * -size, size / 1.2);
  pop();
}

function drawAnswer() {
  // Draw "correct" confirmation below the number line
  noStroke();
  fill(40, 90, 210);
  textSize(22);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  // Position it clearly below the line and labels
  const answerY = axisY + 120;
  text(`Correct!  a = ${formatOneDecimal(targetA)}`, width / 2, answerY);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
}

function newRound() {
  // Endpoints: close together (length 1 or 2)
  const base = Math.floor(random(5, 21)); // 5..20
  const span = random() < 0.6 ? 2 : 1;
  leftValue = base;
  rightValue = base + span;

  // target is a 0.1 multiple strictly inside [left, right]
  const minStepIndex = 1;
  const maxStepIndex = Math.round((rightValue - leftValue) / step) - 1;
  const k = Math.floor(random(minStepIndex, maxStepIndex + 1));
  targetA = roundTo(leftValue + k * step, step);

  // reset student marker
  dragFrom = null;
  isDragging = false;
  aValue = leftValue;
}

function drawDynamicFormula() {
  // Show a live formula while/after the student chooses an endpoint to count from.
  // Example (left): 14 + 0.1 × 2 = 14.2
  // Example (right): 16 - 0.1 × 3 = 15.7
  if (!dragFrom) return;

  const startValue = dragFrom === "left" ? leftValue : rightValue;
  const steps = dragFrom === "left" ? Math.max(0, toTenthInt(aValue) - toTenthInt(startValue)) : Math.max(0, toTenthInt(startValue) - toTenthInt(aValue));

  const op = dragFrom === "left" ? "+" : "-";
  const formula = `${startValue} ${op} 0.1 × ${steps} = ${formatOneDecimal(aValue)}`;

  noStroke();
  fill(30, 60, 140);
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(NORMAL);
  text(formula, width / 2, axisY + 88);
}

function mousePressed() {
  // Try button
  if (
    mouseX >= tryBtn.x &&
    mouseX <= tryBtn.x + tryBtn.w &&
    mouseY >= tryBtn.y &&
    mouseY <= tryBtn.y + tryBtn.h
  ) {
    newRound();
    return;
  }

  const leftX = valueToX(leftValue);
  const rightX = valueToX(rightValue);

  // Click near endpoints to start counting from that side
  if (dist(mouseX, mouseY, leftX, axisY) < 22) {
    dragFrom = "left";
    isDragging = true;
    aValue = leftValue;
    return;
  }
  if (dist(mouseX, mouseY, rightX, axisY) < 22) {
    dragFrom = "right";
    isDragging = true;
    aValue = rightValue;
    return;
  }
}

function mouseDragged() {
  if (!isDragging || !dragFrom) return;

  const v = xToValue(mouseX);
  aValue = snapToStep(clampValue(v, leftValue, rightValue), step);
}

function mouseReleased() {
  isDragging = false;
}

// ==============================
// Helpers
// ==============================
function clampValue(v, lo, hi) {
  return Math.min(Math.max(v, lo), hi);
}

function valueToX(v) {
  return map(v, leftValue, rightValue, axisStartX, axisEndX);
}

function xToValue(x) {
  return map(x, axisStartX, axisEndX, leftValue, rightValue);
}

function snapToStep(v, s) {
  return roundTo(v, s);
}

function roundTo(v, s) {
  return Math.round(v / s) * s;
}

function nearlyEqual(a, b, eps) {
  return Math.abs(a - b) <= eps;
}

function formatOneDecimal(v) {
  // Avoid "-0.0"
  const s = (Math.abs(v) < 1e-9 ? 0 : v).toFixed(1);
  return s;
}

function toTenthInt(v) {
  // Represent numbers in tenths to avoid floating-point comparison issues
  return Math.round(v * 10);
}
