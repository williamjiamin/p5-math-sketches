/* jshint esversion: 6 */
// ============================================================
// 24. Add & Subtract Practice — Interactive Exercise Module
// ============================================================

var ORIG_W = 800;
var ORIG_H = 600;

var canvasW, canvasH;

// Number line
var NL_Y;
var NL_LEFT, NL_RIGHT;
var nlMax = 10;

// Problem
var numA = 0, numB = 0;
var isAddition = true;
var correctAnswer = 0;
var userAnswer = 0;

// State: input | correct | wrong | animating
var gameState = "input";
var feedbackTimer = 0;

// Animation
var hopIndex = 0, hopT = 0;
var HOP_SPEED = 0.05;
var charX = 0;
var completedHops = [];

// Score
var score = 0;
var streak = 0;
var bestStreak = 0;
var totalAttempts = 0;

// Difficulty: 0=Easy(≤10), 1=Medium(≤20), 2=Hard(≤50)
var difficulty = 0;
var DIFF_LABELS = ["Easy", "Medium", "Hard"];
var DIFF_MAX = [10, 20, 50];

// UI Buttons
var checkBtn = { x: 0, y: 0, w: 120, h: 40 };
var newBtn = { x: 0, y: 0, w: 120, h: 40 };
var plusBtn = { x: 0, y: 0, w: 44, h: 44 };
var minusBtn = { x: 0, y: 0, w: 44, h: 44 };
var diffBtns = [];

// Colors
var COL_BG, COL_LINE, COL_TICK, COL_TEXT, COL_ACCENT;
var COL_ADD, COL_SUB, COL_CORRECT, COL_WRONG, COL_RESULT;
var COL_BTN, COL_BTN_HOVER, COL_PANEL;

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
  COL_ADD       = color(80, 180, 120);
  COL_SUB       = color(220, 80, 100);
  COL_CORRECT   = color(40, 180, 80);
  COL_WRONG     = color(220, 60, 60);
  COL_RESULT    = color(255, 175, 40);
  COL_BTN       = color(80, 60, 200);
  COL_BTN_HOVER = color(100, 80, 230);
  COL_PANEL     = color(255, 255, 255, 220);

  for (var d = 0; d < 3; d++) {
    diffBtns.push({ x: 0, y: 0, w: 80, h: 34 });
  }

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
  NL_Y = canvasH * 0.52;
  NL_LEFT = canvasW * 0.08;
  NL_RIGHT = canvasW * 0.92;

  var centerX = canvasW / 2;
  var answerY = canvasH * 0.72;

  minusBtn.x = centerX - 90;
  minusBtn.y = answerY;
  plusBtn.x = centerX + 46;
  plusBtn.y = answerY;

  checkBtn.x = centerX - checkBtn.w / 2;
  checkBtn.y = answerY + 56;
  newBtn.x = centerX - newBtn.w / 2;
  newBtn.y = answerY + 56;

  var totalDiffW = 3 * 80 + 2 * 8;
  var diffStartX = canvasW - totalDiffW - 16;
  for (var d = 0; d < 3; d++) {
    diffBtns[d].x = diffStartX + d * 88;
    diffBtns[d].y = 8;
  }
}

function numToX(n) {
  return map(n, 0, nlMax, NL_LEFT, NL_RIGHT);
}

function generateProblem() {
  nlMax = DIFF_MAX[difficulty];
  isAddition = random() > 0.5;

  if (isAddition) {
    numA = floor(random(0, nlMax - 1));
    numB = floor(random(1, nlMax - numA + 1));
    correctAnswer = numA + numB;
  } else {
    numA = floor(random(1, nlMax + 1));
    numB = floor(random(1, numA + 1));
    correctAnswer = numA - numB;
  }

  userAnswer = 0;
  gameState = "input";
  hopIndex = 0;
  hopT = 0;
  charX = numToX(numA);
  completedHops = [];
  particles = [];
  feedbackTimer = 0;
}

function draw() {
  background(COL_BG);
  drawTitle();
  drawDifficultyBar();
  drawScorePanel();
  drawProblemText();
  drawNumberLine();

  if (gameState === "animating") {
    updateAnimation();
  }
  drawCompletedHops();
  drawCharacter();

  if (gameState === "input") {
    drawAnswerInput();
    drawCheckButton();
  } else if (gameState === "correct") {
    drawFeedback(true);
    drawNewButton();
    feedbackTimer++;
  } else if (gameState === "wrong") {
    drawFeedback(false);
    drawNewButton();
    feedbackTimer++;
  } else if (gameState === "animating") {
    drawAnimatingLabel();
  }

  updateParticles();
  drawParticles();
}

function drawTitle() {
  noStroke();
  fill(COL_ACCENT);
  textSize(Math.min(22, canvasW * 0.035));
  textAlign(CENTER, CENTER);
  text("Add & Subtract Practice", canvasW / 2, 26);
}

function drawDifficultyBar() {
  for (var d = 0; d < 3; d++) {
    var b = diffBtns[d];
    var active = (d === difficulty);
    noStroke();
    fill(active ? COL_ACCENT : color(220, 222, 230));
    rect(b.x, b.y, b.w, b.h, 8);

    fill(active ? 255 : COL_TEXT);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(DIFF_LABELS[d], b.x + b.w / 2, b.y + b.h / 2);
  }
}

function drawScorePanel() {
  var px = 14, py = 8, pw = 150, ph = 50;
  noStroke();
  fill(COL_PANEL);
  rect(px, py, pw, ph, 10);

  fill(COL_TEXT);
  textAlign(LEFT, TOP);
  textSize(13);
  text("Score: " + score + " / " + totalAttempts, px + 10, py + 8);

  fill(streak >= 3 ? COL_CORRECT : COL_TEXT);
  text("Streak: " + streak + (bestStreak > 0 ? " (best: " + bestStreak + ")" : ""), px + 10, py + 28);
}

function drawProblemText() {
  textAlign(CENTER, CENTER);
  noStroke();

  var y = canvasH * 0.14;
  var sz = Math.min(34, canvasW * 0.05);
  var opColor = isAddition ? COL_ADD : COL_SUB;
  var opSymbol = isAddition ? "+" : "−";

  fill(COL_ACCENT);
  textSize(sz);
  text(numA, canvasW / 2 - sz * 1.4, y);

  fill(opColor);
  textSize(sz * 0.9);
  text(opSymbol, canvasW / 2 - sz * 0.2, y);

  fill(opColor);
  textSize(sz);
  text(numB, canvasW / 2 + sz * 1, y);

  fill(COL_TEXT);
  textSize(sz * 0.9);
  text("= ?", canvasW / 2 + sz * 2.4, y);
}

function drawNumberLine() {
  stroke(COL_LINE);
  strokeWeight(3);
  line(NL_LEFT - 10, NL_Y, NL_RIGHT + 10, NL_Y);

  fill(COL_LINE);
  noStroke();
  triangle(NL_RIGHT + 10, NL_Y, NL_RIGHT + 2, NL_Y - 6, NL_RIGHT + 2, NL_Y + 6);

  var step = 1;
  if (nlMax > 30) step = 5;
  else if (nlMax > 15) step = 2;

  for (var i = 0; i <= nlMax; i += step) {
    var x = numToX(i);
    stroke(COL_TICK);
    strokeWeight(2);
    var tickH = (i % (step * 5) === 0 || i === 0) ? 12 : 7;
    line(x, NL_Y - tickH, x, NL_Y + tickH);

    noStroke();
    fill(COL_TEXT);
    textAlign(CENTER, TOP);
    textSize(Math.min(12, canvasW * 0.018));
    text(i, x, NL_Y + 15);
  }

  // Highlight start
  var startX = numToX(numA);
  noStroke();
  fill(COL_ACCENT);
  ellipse(startX, NL_Y, 8, 8);
}

function updateAnimation() {
  hopT += HOP_SPEED;
  if (hopT >= 1) {
    completedHops.push(hopIndex);
    hopIndex++;
    hopT = 0;

    if (hopIndex >= numB) {
      gameState = "correct";
      charX = numToX(correctAnswer);
      spawnCelebration(charX, NL_Y - 30);
      return;
    }
  }

  var dir = isAddition ? 1 : -1;
  var startN = numA + dir * hopIndex;
  var endN = startN + dir;
  charX = map(hopT, 0, 1, numToX(startN), numToX(endN));
}

function drawCompletedHops() {
  var hopArcH = Math.min(45, canvasH * 0.08);
  var hopCol = isAddition ? COL_ADD : COL_SUB;
  var dir = isAddition ? 1 : -1;

  for (var i = 0; i < completedHops.length; i++) {
    var sn = numA + dir * i;
    var en = sn + dir;
    drawArcBetween(numToX(sn), numToX(en), NL_Y, hopArcH, hopCol, i + 1);
  }

  if (gameState === "animating" && hopT > 0) {
    var sn2 = numA + dir * hopIndex;
    var sx = numToX(sn2);
    var ex = numToX(sn2 + dir);
    noFill();
    stroke(hopCol);
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

function drawArcBetween(sx, ex, baseY, h, col, label) {
  noFill();
  stroke(red(col), green(col), blue(col), 180);
  strokeWeight(2);
  beginShape();
  for (var t = 0; t <= 1; t += 0.02) {
    vertex(map(t, 0, 1, sx, ex), baseY - sin(t * PI) * h);
  }
  endShape();

  noStroke();
  fill(col);
  textAlign(CENTER, CENTER);
  textSize(Math.min(11, canvasW * 0.016));
  text(label, (sx + ex) / 2, baseY - h - 8);
}

function drawCharacter() {
  var cy = NL_Y;
  if (gameState === "animating" && hopT > 0) {
    cy = NL_Y - sin(hopT * PI) * Math.min(45, canvasH * 0.08);
  }

  var r = Math.min(18, canvasW * 0.028);
  var charCol = isAddition ? COL_ADD : COL_SUB;

  noStroke();
  fill(0, 0, 0, 25);
  ellipse(charX, NL_Y + 3, r * 2, 6);

  fill(charCol);
  stroke(255);
  strokeWeight(2);
  ellipse(charX, cy - r - 3, r * 2, r * 2);

  fill(255);
  noStroke();
  ellipse(charX - r * 0.3, cy - r - 5, 6, 6);
  ellipse(charX + r * 0.3, cy - r - 5, 6, 6);
  fill(40);
  ellipse(charX - r * 0.3, cy - r - 4, 3, 3);
  ellipse(charX + r * 0.3, cy - r - 4, 3, 3);
}

function drawAnswerInput() {
  var cx = canvasW / 2;
  var ay = minusBtn.y + minusBtn.h / 2;

  // Answer display
  noStroke();
  fill(255);
  stroke(COL_ACCENT);
  strokeWeight(2);
  rect(cx - 30, ay - 22, 60, 44, 8);

  noStroke();
  fill(COL_TEXT);
  textAlign(CENTER, CENTER);
  textSize(22);
  text(userAnswer, cx, ay);

  // Minus button
  drawRoundBtn(minusBtn, "−", isInsideBtn(minusBtn, mouseX, mouseY));
  // Plus button
  drawRoundBtn(plusBtn, "+", isInsideBtn(plusBtn, mouseX, mouseY));
}

function drawRoundBtn(btn, label, hover) {
  noStroke();
  fill(hover ? COL_BTN_HOVER : COL_BTN);
  rect(btn.x, btn.y, btn.w, btn.h, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
}

function drawCheckButton() {
  var hover = isInsideBtn(checkBtn, mouseX, mouseY);
  noStroke();
  fill(hover ? color(50, 190, 100) : COL_CORRECT);
  rect(checkBtn.x, checkBtn.y, checkBtn.w, checkBtn.h, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(15);
  text("Check", checkBtn.x + checkBtn.w / 2, checkBtn.y + checkBtn.h / 2);
}

function drawNewButton() {
  var hover = isInsideBtn(newBtn, mouseX, mouseY);
  noStroke();
  fill(hover ? COL_BTN_HOVER : COL_BTN);
  rect(newBtn.x, newBtn.y, newBtn.w, newBtn.h, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(15);
  text("Next", newBtn.x + newBtn.w / 2, newBtn.y + newBtn.h / 2);
}

function drawFeedback(isCorrectFB) {
  var cx = canvasW / 2;
  var fy = canvasH * 0.72;

  noStroke();
  if (isCorrectFB) {
    fill(COL_CORRECT);
    textSize(Math.min(26, canvasW * 0.04));
    textAlign(CENTER, CENTER);
    text("Correct! " + correctAnswer, cx, fy);
  } else {
    fill(COL_WRONG);
    textSize(Math.min(22, canvasW * 0.035));
    textAlign(CENTER, CENTER);
    text("Not quite! Answer: " + correctAnswer, cx, fy);

    fill(150);
    textSize(Math.min(14, canvasW * 0.022));
    text("Watch the hops to see why", cx, fy + 28);
  }
}

function drawAnimatingLabel() {
  fill(150);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(Math.min(14, canvasW * 0.022));
  text("Watch the hops...", canvasW / 2, canvasH * 0.72);
}

function checkAnswer() {
  totalAttempts++;
  if (userAnswer === correctAnswer) {
    score++;
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    gameState = "animating";
    hopIndex = 0;
    hopT = 0;
    completedHops = [];
  } else {
    streak = 0;
    gameState = "wrong";
    // Show correct animation anyway
    completedHops = [];
    var dir = isAddition ? 1 : -1;
    for (var i = 0; i < numB; i++) {
      completedHops.push(i);
    }
    charX = numToX(correctAnswer);
  }
}

function isInsideBtn(btn, mx, my) {
  return mx > btn.x && mx < btn.x + btn.w && my > btn.y && my < btn.y + btn.h;
}

function mousePressed() {
  // Difficulty buttons
  for (var d = 0; d < 3; d++) {
    if (isInsideBtn(diffBtns[d], mouseX, mouseY)) {
      difficulty = d;
      generateProblem();
      return;
    }
  }

  if (gameState === "input") {
    if (isInsideBtn(plusBtn, mouseX, mouseY)) {
      userAnswer = Math.min(userAnswer + 1, nlMax);
      return;
    }
    if (isInsideBtn(minusBtn, mouseX, mouseY)) {
      userAnswer = Math.max(userAnswer - 1, 0);
      return;
    }
    if (isInsideBtn(checkBtn, mouseX, mouseY)) {
      checkAnswer();
      return;
    }
  }

  if (gameState === "correct" || gameState === "wrong") {
    if (isInsideBtn(newBtn, mouseX, mouseY)) {
      generateProblem();
      return;
    }
  }
}

function spawnCelebration(cx, cy) {
  for (var i = 0; i < 25; i++) {
    particles.push({
      x: cx, y: cy,
      vx: random(-4, 4),
      vy: random(-6, -1),
      life: 1,
      decay: random(0.01, 0.03),
      col: color(random([255, 80, 40]), random([175, 200, 100]), random([40, 120, 255])),
      size: random(4, 9)
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
