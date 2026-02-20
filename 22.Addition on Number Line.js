/* jshint esversion: 6 */
// ============================================================
// 22. Addition on the Number Line — Animated Hop Visualization
// ============================================================

var ORIG_W = 800;
var ORIG_H = 600;

var canvasW, canvasH;

// Number line
var NL_Y;
var NL_LEFT, NL_RIGHT;
var NL_MIN = 0, NL_MAX = 20;

// Problem
var numA = 3, numB = 5;

// Animation
var animState = "idle"; // idle | hopping | done
var hopIndex = 0;
var hopT = 0;
var HOP_SPEED = 0.04;
var charX = 0;
var completedHops = [];

// Button
var newBtn = { x: 0, y: 0, w: 160, h: 44 };

// Colors
var COL_BG, COL_LINE, COL_TICK, COL_TEXT, COL_ACCENT;
var COL_CHAR, COL_HOP, COL_RESULT, COL_BTN, COL_BTN_HOVER;

// Particles
var particles = [];

function setup() {
  canvasW = Math.min(ORIG_W, windowWidth);
  canvasH = Math.min(ORIG_H, windowHeight);
  createCanvas(canvasW, canvasH);
  textFont("Arial");

  COL_BG        = color(245, 247, 252);
  COL_LINE      = color(60, 60, 80);
  COL_TICK      = color(80, 80, 100);
  COL_TEXT       = color(40, 40, 60);
  COL_ACCENT    = color(80, 60, 200);
  COL_CHAR      = color(255, 100, 80);
  COL_HOP       = color(80, 180, 120);
  COL_RESULT    = color(255, 175, 40);
  COL_BTN       = color(80, 60, 200);
  COL_BTN_HOVER = color(100, 80, 230);

  updateLayout();
  generateProblem();
}

function windowResized() {
  canvasW = Math.min(ORIG_W, windowWidth);
  canvasH = Math.min(ORIG_H, windowHeight);
  resizeCanvas(canvasW, canvasH);
  updateLayout();
}

function updateLayout() {
  NL_Y = canvasH * 0.55;
  NL_LEFT = canvasW * 0.08;
  NL_RIGHT = canvasW * 0.92;
  newBtn.x = canvasW / 2 - newBtn.w / 2;
  newBtn.y = canvasH - 60;
}

function numToX(n) {
  return map(n, NL_MIN, NL_MAX, NL_LEFT, NL_RIGHT);
}

function generateProblem() {
  numA = floor(random(1, 15));
  numB = floor(random(1, 21 - numA));
  animState = "idle";
  hopIndex = 0;
  hopT = 0;
  charX = numToX(numA);
  completedHops = [];
  particles = [];
}

function startAnimation() {
  if (animState === "idle") {
    animState = "hopping";
    hopIndex = 0;
    hopT = 0;
    completedHops = [];
  }
}

function draw() {
  background(COL_BG);
  drawTitle();
  drawProblem();
  drawNumberLine();
  updateAnimation();
  drawHops();
  drawCharacter();
  drawResult();
  drawButton();
  updateParticles();
  drawParticles();
}

function drawTitle() {
  noStroke();
  fill(COL_ACCENT);
  textSize(Math.min(24, canvasW * 0.04));
  textAlign(CENTER, CENTER);
  text("Addition on the Number Line", canvasW / 2, 30);
}

function drawProblem() {
  textAlign(CENTER, CENTER);
  noStroke();

  var y = canvasH * 0.15;
  var sz = Math.min(36, canvasW * 0.055);

  fill(COL_CHAR);
  textSize(sz);
  text(numA, canvasW / 2 - sz * 1.6, y);

  fill(COL_TEXT);
  textSize(sz * 0.9);
  text("+", canvasW / 2 - sz * 0.5, y);

  fill(COL_HOP);
  textSize(sz);
  text(numB, canvasW / 2 + sz * 0.6, y);

  fill(COL_TEXT);
  textSize(sz * 0.9);
  text("=", canvasW / 2 + sz * 1.8, y);

  if (animState === "done") {
    fill(COL_RESULT);
    textSize(sz);
    text(numA + numB, canvasW / 2 + sz * 3, y);
  } else {
    fill(180);
    textSize(sz);
    text("?", canvasW / 2 + sz * 3, y);
  }
}

function drawNumberLine() {
  stroke(COL_LINE);
  strokeWeight(3);
  line(NL_LEFT - 10, NL_Y, NL_RIGHT + 10, NL_Y);

  // Arrow tips
  fill(COL_LINE);
  noStroke();
  triangle(NL_RIGHT + 10, NL_Y, NL_RIGHT + 2, NL_Y - 6, NL_RIGHT + 2, NL_Y + 6);

  for (var i = NL_MIN; i <= NL_MAX; i++) {
    var x = numToX(i);
    stroke(COL_TICK);
    strokeWeight(2);
    var tickH = (i % 5 === 0) ? 12 : 7;
    line(x, NL_Y - tickH, x, NL_Y + tickH);

    noStroke();
    fill(COL_TEXT);
    textAlign(CENTER, TOP);
    textSize(Math.min(13, canvasW * 0.02));
    text(i, x, NL_Y + 16);
  }
}

function updateAnimation() {
  if (animState !== "hopping") return;

  hopT += HOP_SPEED;
  if (hopT >= 1) {
    completedHops.push(hopIndex);
    hopIndex++;
    hopT = 0;

    if (hopIndex >= numB) {
      animState = "done";
      charX = numToX(numA + numB);
      spawnCelebration(charX, NL_Y - 30);
      return;
    }
  }

  var startN = numA + hopIndex;
  var endN = startN + 1;
  charX = map(hopT, 0, 1, numToX(startN), numToX(endN));
}

function drawHops() {
  var hopArcH = Math.min(50, canvasH * 0.1);

  for (var i = 0; i < completedHops.length; i++) {
    var sn = numA + i;
    drawArc(numToX(sn), numToX(sn + 1), NL_Y, hopArcH, COL_HOP, 180, i + 1);
  }

  if (animState === "hopping" && hopT > 0) {
    var sn2 = numA + hopIndex;
    var sx = numToX(sn2);
    var ex = numToX(sn2 + 1);
    var cx = map(hopT, 0, 1, sx, ex);

    noFill();
    stroke(COL_HOP);
    strokeWeight(2);
    beginShape();
    for (var t = 0; t <= hopT; t += 0.02) {
      var px = map(t, 0, 1, sx, ex);
      var py = NL_Y - sin(t * PI) * hopArcH;
      vertex(px, py);
    }
    endShape();
  }
}

function drawArc(sx, ex, baseY, h, col, alphaVal, label) {
  noFill();
  stroke(red(col), green(col), blue(col), alphaVal);
  strokeWeight(2.5);
  beginShape();
  for (var t = 0; t <= 1; t += 0.02) {
    var px = map(t, 0, 1, sx, ex);
    var py = baseY - sin(t * PI) * h;
    vertex(px, py);
  }
  endShape();

  noStroke();
  fill(col);
  textAlign(CENTER, CENTER);
  textSize(Math.min(12, canvasW * 0.018));
  text(label, (sx + ex) / 2, baseY - h - 8);
}

function drawCharacter() {
  var cy = NL_Y;
  if (animState === "hopping" && hopT > 0) {
    var hopArcH = Math.min(50, canvasH * 0.1);
    cy = NL_Y - sin(hopT * PI) * hopArcH;
  }

  var r = Math.min(22, canvasW * 0.035);

  // Shadow
  noStroke();
  fill(0, 0, 0, 30);
  ellipse(charX, NL_Y + 4, r * 2 + 4, 8);

  // Circle
  fill(COL_CHAR);
  stroke(255);
  strokeWeight(2);
  ellipse(charX, cy - r - 4, r * 2, r * 2);

  // Eyes
  fill(255);
  noStroke();
  ellipse(charX - r * 0.3, cy - r - 7, 8, 8);
  ellipse(charX + r * 0.3, cy - r - 7, 8, 8);
  fill(40);
  ellipse(charX - r * 0.3, cy - r - 6, 4, 4);
  ellipse(charX + r * 0.3, cy - r - 6, 4, 4);

  // Smile
  if (animState === "done") {
    noFill();
    stroke(40);
    strokeWeight(1.5);
    arc(charX, cy - r - 2, r * 0.6, r * 0.4, 0, PI);
  }
}

function drawResult() {
  if (animState !== "done") return;

  var rx = numToX(numA + numB);
  var pulse = sin(frameCount * 0.08) * 4;

  noStroke();
  fill(255, 175, 40, 60);
  ellipse(rx, NL_Y, 30 + pulse, 30 + pulse);

  fill(COL_RESULT);
  textAlign(CENTER, BOTTOM);
  textSize(Math.min(20, canvasW * 0.03));
  text(numA + numB, rx, NL_Y + 52);
}

function drawButton() {
  var hovering = isInsideBtn(newBtn, mouseX, mouseY);
  var bx = newBtn.x, by = newBtn.y, bw = newBtn.w, bh = newBtn.h;

  noStroke();
  fill(hovering ? COL_BTN_HOVER : COL_BTN);
  rect(bx, by, bw, bh, 10);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(Math.min(15, canvasW * 0.025));
  text("New Problem", bx + bw / 2, by + bh / 2);
}

function isInsideBtn(btn, mx, my) {
  return mx > btn.x && mx < btn.x + btn.w && my > btn.y && my < btn.y + btn.h;
}

function mousePressed() {
  if (isInsideBtn(newBtn, mouseX, mouseY)) {
    generateProblem();
    return;
  }

  if (animState === "idle") {
    startAnimation();
  }
}

function spawnCelebration(cx, cy) {
  for (var i = 0; i < 30; i++) {
    particles.push({
      x: cx, y: cy,
      vx: random(-4, 4),
      vy: random(-6, -1),
      life: 1,
      decay: random(0.01, 0.03),
      col: color(random([255, 80, 40]), random([175, 200, 100]), random([40, 120, 255])),
      size: random(4, 10)
    });
  }
}

function updateParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life -= p.decay;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  noStroke();
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    fill(red(p.col), green(p.col), blue(p.col), p.life * 255);
    ellipse(p.x, p.y, p.size * p.life, p.size * p.life);
  }
}
