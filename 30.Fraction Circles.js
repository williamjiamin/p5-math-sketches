/* jshint esversion: 6 */
// ============================================================
// 30. Fraction Circles — Pie-chart style fraction visualization
// ============================================================
const ORIG_W = 800;
const ORIG_H = 600;

var numerator = 3;
var denominator = 8;
var equivNumer = 0;
var equivDenom = 0;
var showEquiv = false;

var sectorAngles = [];
var rotationOffset = 0;
var targetRotation = 0;

var COLORS;
var btnPlus_n, btnMinus_n, btnPlus_d, btnMinus_d, btnEquiv;
var particles = [];

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial");
  textAlign(CENTER, CENTER);
  COLORS = [
    color(80, 160, 255), color(255, 120, 80), color(100, 210, 140),
    color(255, 200, 60), color(180, 100, 240), color(255, 140, 180),
    color(60, 200, 200), color(200, 160, 100), color(120, 130, 255),
    color(230, 100, 120), color(80, 200, 160), color(200, 200, 80)
  ];
  buildButtons();
  computeEquiv();
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  buildButtons();
}

function buildButtons() {
  var bw = 36, bh = 32, gap = 6;
  var panelX = width * 0.72;
  var baseY = height * 0.22;
  btnPlus_n  = { x: panelX + 80, y: baseY,      w: bw, h: bh, label: "+", action: "n+" };
  btnMinus_n = { x: panelX + 80 + bw + gap, y: baseY, w: bw, h: bh, label: "−", action: "n-" };
  btnPlus_d  = { x: panelX + 80, y: baseY + 50, w: bw, h: bh, label: "+", action: "d+" };
  btnMinus_d = { x: panelX + 80 + bw + gap, y: baseY + 50, w: bw, h: bh, label: "−", action: "d-" };
  btnEquiv   = { x: panelX, y: baseY + 120, w: 170, h: 36, label: showEquiv ? "Hide Equivalent" : "Show Equivalent", action: "eq" };
}

function computeEquiv() {
  var g = gcd(numerator, denominator);
  equivNumer = numerator / g;
  equivDenom = denominator / g;
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function draw() {
  background(245, 247, 252);
  rotationOffset += (targetRotation - rotationOffset) * 0.08;

  drawTitle();
  drawMainCircle();
  if (showEquiv) drawEquivCircle();
  drawControls();
  drawFractionLabel();
  updateParticles();
}

function drawTitle() {
  noStroke();
  fill(40, 40, 60);
  textSize(Math.min(22, width * 0.03));
  textAlign(CENTER, CENTER);
  text("Fraction Circles", width / 2, 28);
}

function drawMainCircle() {
  var cx = showEquiv ? width * 0.28 : width * 0.38;
  var cy = height * 0.52;
  var r = Math.min(width, height) * 0.28;

  push();
  translate(cx, cy);
  rotate(rotationOffset);

  for (var i = 0; i < denominator; i++) {
    var a1 = (TWO_PI / denominator) * i - HALF_PI;
    var a2 = (TWO_PI / denominator) * (i + 1) - HALF_PI;
    if (i < numerator) {
      fill(COLORS[i % COLORS.length]);
    } else {
      fill(240, 242, 248);
    }
    stroke(255);
    strokeWeight(2);
    arc(0, 0, r * 2, r * 2, a1, a2, PIE);
  }

  noFill();
  stroke(180, 185, 200);
  strokeWeight(2);
  ellipse(0, 0, r * 2, r * 2);
  pop();

  noStroke();
  fill(40, 40, 60);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Main: " + numerator + "/" + denominator, cx, cy + r + 24);
}

function drawEquivCircle() {
  var cx = width * 0.58;
  var cy = height * 0.52;
  var r = Math.min(width, height) * 0.22;

  push();
  translate(cx, cy);

  for (var i = 0; i < equivDenom; i++) {
    var a1 = (TWO_PI / equivDenom) * i - HALF_PI;
    var a2 = (TWO_PI / equivDenom) * (i + 1) - HALF_PI;
    if (i < equivNumer) {
      fill(COLORS[i % COLORS.length]);
    } else {
      fill(240, 242, 248);
    }
    stroke(255);
    strokeWeight(2);
    arc(0, 0, r * 2, r * 2, a1, a2, PIE);
  }

  noFill();
  stroke(180, 185, 200);
  strokeWeight(2);
  ellipse(0, 0, r * 2, r * 2);
  pop();

  noStroke();
  fill(40, 40, 60);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Simplified: " + equivNumer + "/" + equivDenom, cx, cy + r + 24);

  if (equivNumer !== numerator || equivDenom !== denominator) {
    fill(100, 60, 200);
    textSize(13);
    text(numerator + "/" + denominator + "  =  " + equivNumer + "/" + equivDenom, width * 0.43, height * 0.92);
  }
}

function drawControls() {
  var panelX = width * 0.72;
  var baseY = height * 0.18;

  fill(255, 255, 255, 220);
  stroke(215, 220, 235);
  strokeWeight(1);
  rect(panelX - 16, baseY - 10, 200, 200, 12);

  noStroke();
  fill(40, 40, 60);
  textSize(15);
  textAlign(LEFT, CENTER);
  text("Numerator: " + numerator, panelX, baseY + 16);
  text("Denominator: " + denominator, panelX, baseY + 66);

  var btns = [btnPlus_n, btnMinus_n, btnPlus_d, btnMinus_d, btnEquiv];
  for (var i = 0; i < btns.length; i++) {
    var b = btns[i];
    var hover = mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h;
    fill(hover ? color(80, 60, 200) : color(100, 110, 240));
    noStroke();
    rect(b.x, b.y, b.w, b.h, 8);
    fill(255);
    textSize(b === btnEquiv ? 12 : 16);
    textAlign(CENTER, CENTER);
    text(b.label, b.x + b.w / 2, b.y + b.h / 2);
  }
}

function drawFractionLabel() {
  var cx = showEquiv ? width * 0.28 : width * 0.38;
  var cy = height * 0.52;

  fill(255, 255, 255, 200);
  noStroke();
  ellipse(cx, cy, 60, 60);

  fill(40, 40, 60);
  textSize(22);
  textAlign(CENTER, CENTER);
  text(numerator, cx, cy - 10);
  stroke(40, 40, 60);
  strokeWeight(2);
  line(cx - 14, cy, cx + 14, cy);
  noStroke();
  text(denominator, cx, cy + 12);
}

function updateParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life -= 2;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    noStroke();
    fill(p.c[0], p.c[1], p.c[2], p.life);
    ellipse(p.x, p.y, p.s, p.s);
  }
}

function spawnParticles(x, y) {
  for (var i = 0; i < 12; i++) {
    particles.push({
      x: x, y: y,
      vx: random(-3, 3), vy: random(-4, -1),
      life: 255, s: random(4, 8),
      c: [random(80, 255), random(80, 255), random(100, 255)]
    });
  }
}

function mousePressed() {
  var btns = [btnPlus_n, btnMinus_n, btnPlus_d, btnMinus_d, btnEquiv];
  for (var i = 0; i < btns.length; i++) {
    var b = btns[i];
    if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
      handleButton(b.action);
      spawnParticles(b.x + b.w / 2, b.y + b.h / 2);
      return;
    }
  }
}

function handleButton(action) {
  if (action === "n+" && numerator < denominator) { numerator++; targetRotation += TWO_PI / denominator; }
  if (action === "n-" && numerator > 0) { numerator--; targetRotation -= TWO_PI / denominator; }
  if (action === "d+" && denominator < 12) {
    denominator++;
    if (numerator > denominator) numerator = denominator;
    targetRotation += 0.3;
  }
  if (action === "d-" && denominator > 1) {
    denominator--;
    if (numerator > denominator) numerator = denominator;
    targetRotation -= 0.3;
  }
  if (action === "eq") {
    showEquiv = !showEquiv;
    btnEquiv.label = showEquiv ? "Hide Equivalent" : "Show Equivalent";
  }
  computeEquiv();
}
