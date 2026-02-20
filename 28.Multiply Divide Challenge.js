/* jshint esversion: 6 */
// ============================================================
// 28. Multiply & Divide Challenge — Practice Module
// ============================================================
// Random multiplication/division problems with visual arrays,
// difficulty levels, score/streak tracking, and celebration particles.

const ORIG_W = 800;
const ORIG_H = 600;

var difficulty = "Easy";
var diffRanges = { Easy: 5, Medium: 10, Hard: 12 };
var problemType = "multiply";
var numA = 0, numB = 0, correctAnswer = 0;
var userAnswer = 0;
var feedback = "";
var feedbackTimer = 0;
var score = 0, streak = 0, bestStreak = 0;
var totalAttempts = 0;
var particles = [];
var timerMode = false;
var timeLeft = 60;
var timerRunning = false;
var timerScore = 0;
var lastFrameTime = 0;

var COL_BG, COL_TEXT, COL_MUTED, COL_ACCENT, COL_CORRECT, COL_WRONG;
var COL_BTN, COL_BTN_H, COL_CARD;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial");
  initColors();
  generateProblem();
  lastFrameTime = millis();
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
}

function initColors() {
  COL_BG = color(245, 247, 252);
  COL_TEXT = color(40, 40, 60);
  COL_MUTED = color(130, 135, 150);
  COL_ACCENT = color(66, 133, 244);
  COL_CORRECT = color(76, 175, 80);
  COL_WRONG = color(244, 67, 54);
  COL_BTN = color(100, 120, 200);
  COL_BTN_H = color(80, 100, 180);
  COL_CARD = color(255);
}

function generateProblem() {
  var maxN = diffRanges[difficulty];
  userAnswer = 0;
  feedback = "";
  feedbackTimer = 0;

  if (random() < 0.5) {
    problemType = "multiply";
    numA = Math.floor(random(1, maxN + 1));
    numB = Math.floor(random(1, maxN + 1));
    correctAnswer = numA * numB;
  } else {
    problemType = "divide";
    numB = Math.floor(random(1, maxN + 1));
    correctAnswer = Math.floor(random(1, maxN + 1));
    numA = numB * correctAnswer;
  }
}

function draw() {
  background(COL_BG);
  var now = millis();
  var dt = (now - lastFrameTime) / 1000;
  lastFrameTime = now;

  if (timerMode && timerRunning) {
    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0;
      timerRunning = false;
      feedback = "Time's up! Score: " + timerScore;
      feedbackTimer = 120;
    }
  }

  drawTitle();
  drawDifficulty();
  drawProblem();
  drawVisual();
  drawAnswerInput();
  drawScoreboard();
  drawTimerUI();

  if (feedbackTimer > 0) {
    feedbackTimer--;
    drawFeedback();
  }

  updateParticles();
  drawParticles();
}

function drawTitle() {
  fill(COL_TEXT);
  noStroke();
  textSize(22);
  textAlign(CENTER, TOP);
  text("Multiply & Divide Challenge", width / 2, 12);
}

function drawDifficulty() {
  var diffs = ["Easy", "Medium", "Hard"];
  var bw = 72, bh = 28, gap = 8;
  var sx = width / 2 - (bw * 3 + gap * 2) / 2;
  var dy = 44;

  textSize(12);
  for (var i = 0; i < diffs.length; i++) {
    var x = sx + i * (bw + gap);
    var isActive = (difficulty === diffs[i]);
    var hover = mouseX > x && mouseX < x + bw && mouseY > dy && mouseY < dy + bh;
    fill(isActive ? COL_ACCENT : (hover ? COL_BTN_H : color(180, 190, 210)));
    noStroke();
    rect(x, dy, bw, bh, 8);
    fill(255);
    textAlign(CENTER, CENTER);
    text(diffs[i], x + bw / 2, dy + bh / 2);
  }
}

function drawProblem() {
  var py = 100;
  fill(COL_CARD);
  noStroke();
  rect(width * 0.2, py - 10, width * 0.6, 55, 12);

  fill(COL_TEXT);
  textSize(28);
  textAlign(CENTER, CENTER);
  var sign = problemType === "multiply" ? "×" : "÷";
  text(numA + " " + sign + " " + numB + " = ?", width / 2, py + 17);
}

function drawVisual() {
  var vy = 170;
  var maxDots = 60;

  if (problemType === "multiply" && numA * numB <= maxDots) {
    var rows = numA;
    var cols = numB;
    var dotR = Math.min(16, (width * 0.6) / cols, 120 / rows);
    var startX = width / 2 - (cols * dotR) / 2;
    var startY = vy;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        fill(lerpColor(color(100, 180, 255), color(66, 133, 244), r / Math.max(rows - 1, 1)));
        noStroke();
        ellipse(startX + c * dotR + dotR / 2, startY + r * dotR + dotR / 2, dotR * 0.75, dotR * 0.75);
      }
    }

    fill(COL_MUTED);
    textSize(11);
    textAlign(CENTER, TOP);
    text(rows + " rows × " + cols + " columns", width / 2, startY + rows * dotR + 6);
  } else if (problemType === "divide" && numA <= maxDots) {
    var groups = numB;
    var perG = correctAnswer;
    var dotR2 = Math.min(14, (width * 0.8) / (groups * (perG + 1)));
    var totalW = groups * (perG * dotR2 + 16);
    var sx = width / 2 - totalW / 2;

    for (var g = 0; g < groups; g++) {
      var gx = sx + g * (perG * dotR2 + 16);
      stroke(200, 205, 220);
      strokeWeight(1);
      noFill();
      rect(gx - 4, vy - 4, perG * dotR2 + 8, dotR2 + 8, 6);

      for (var d = 0; d < perG; d++) {
        fill(lerpColor(color(255, 180, 100), color(244, 133, 66), g / Math.max(groups - 1, 1)));
        noStroke();
        ellipse(gx + d * dotR2 + dotR2 / 2, vy + dotR2 / 2, dotR2 * 0.7, dotR2 * 0.7);
      }
    }

    fill(COL_MUTED);
    textSize(11);
    textAlign(CENTER, TOP);
    text(numA + " split into " + groups + " groups", width / 2, vy + dotR2 + 16);
  }
}

function drawAnswerInput() {
  var iy = height - 200;

  // Answer display
  fill(COL_CARD);
  stroke(COL_ACCENT);
  strokeWeight(2);
  rect(width / 2 - 60, iy, 120, 44, 10);
  fill(COL_TEXT);
  noStroke();
  textSize(24);
  textAlign(CENTER, CENTER);
  text(userAnswer, width / 2, iy + 22);

  // +/- buttons
  var bw = 50, bh = 40;
  drawButton(width / 2 - 130, iy + 2, bw, bh, "−", "minus");
  drawButton(width / 2 + 80, iy + 2, bw, bh, "+", "plus");

  // +10 / -10
  drawButton(width / 2 - 190, iy + 2, bw, bh, "−10", "minus10");
  drawButton(width / 2 + 140, iy + 2, bw, bh, "+10", "plus10");

  // Check and Skip
  var cy = iy + 56;
  drawButton(width / 2 - 110, cy, 100, 36, "Check ✓", "check");
  drawButton(width / 2 + 10, cy, 100, 36, "Skip →", "skip");
}

function drawButton(x, y, w, h, label, id) {
  var hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  var isCheck = (id === "check");
  var baseCol = isCheck ? COL_CORRECT : COL_BTN;
  fill(hover ? lerpColor(baseCol, color(0), 0.15) : baseCol);
  noStroke();
  rect(x, y, w, h, 8);
  fill(255);
  textSize(h > 36 ? 18 : 13);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
}

function drawScoreboard() {
  var sx = 15, sy = height - 80;
  fill(COL_CARD);
  noStroke();
  rect(sx, sy, 160, 65, 10);

  fill(COL_TEXT);
  textSize(13);
  textAlign(LEFT, TOP);
  text("Score: " + score + " / " + totalAttempts, sx + 12, sy + 8);
  text("Streak: " + streak + "  (Best: " + bestStreak + ")", sx + 12, sy + 26);

  if (streak >= 3) {
    fill(COL_CORRECT);
    textSize(11);
    text("🔥 Streak bonus active!", sx + 12, sy + 44);
  }
}

function drawTimerUI() {
  var tx = width - 175, ty = height - 80;
  fill(COL_CARD);
  noStroke();
  rect(tx, ty, 160, 65, 10);

  fill(COL_TEXT);
  textSize(13);
  textAlign(LEFT, TOP);

  if (timerMode) {
    var col = timeLeft < 10 ? COL_WRONG : COL_TEXT;
    fill(col);
    text("Time: " + Math.ceil(timeLeft) + "s", tx + 12, ty + 8);
    text("Timer Score: " + timerScore, tx + 12, ty + 26);
  }

  var bw = 136, bh = 24;
  if (!timerMode) {
    drawButton(tx + 12, ty + 34, bw, bh, "Start Timer (60s)", "timer");
  } else {
    drawButton(tx + 12, ty + 34, bw, bh, "Stop Timer", "timer");
  }
}

function drawFeedback() {
  var fy = height - 130;
  var alpha = Math.min(255, feedbackTimer * 6);
  var isCorrect = feedback.indexOf("Correct") >= 0 || feedback.indexOf("Time") >= 0;
  fill(isCorrect ? color(76, 175, 80, alpha) : color(244, 67, 54, alpha));
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text(feedback, width / 2, fy);
}

function checkAnswer() {
  totalAttempts++;
  if (userAnswer === correctAnswer) {
    feedback = "Correct!";
    score++;
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    if (streak >= 3) score++;
    if (timerMode && timerRunning) timerScore++;
    spawnParticles();
    feedbackTimer = 40;
    setTimeout(function() { generateProblem(); }, 600);
  } else {
    feedback = "Not quite. Answer: " + correctAnswer;
    streak = 0;
    feedbackTimer = 60;
  }
}

function spawnParticles() {
  for (var i = 0; i < 30; i++) {
    particles.push({
      x: width / 2, y: height / 2,
      vx: random(-6, 6), vy: random(-8, -1),
      life: 1,
      c: color(random(80, 255), random(80, 255), random(80, 255))
    });
  }
}

function updateParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life -= 0.018;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  noStroke();
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    fill(red(p.c), green(p.c), blue(p.c), p.life * 255);
    ellipse(p.x, p.y, 8 * p.life, 8 * p.life);
  }
}

function mousePressed() {
  // Difficulty
  var diffs = ["Easy", "Medium", "Hard"];
  var bw = 72, bh = 28, gap = 8;
  var sx = width / 2 - (bw * 3 + gap * 2) / 2;
  var dy = 44;
  for (var i = 0; i < diffs.length; i++) {
    var x = sx + i * (bw + gap);
    if (hitTest(x, dy, bw, bh)) {
      difficulty = diffs[i];
      generateProblem();
      return;
    }
  }

  var iy = height - 200;
  var btnW = 50, btnH = 40;

  // −10
  if (hitTest(width / 2 - 190, iy + 2, btnW, btnH)) {
    userAnswer = Math.max(0, userAnswer - 10);
    return;
  }
  // −
  if (hitTest(width / 2 - 130, iy + 2, btnW, btnH)) {
    userAnswer = Math.max(0, userAnswer - 1);
    return;
  }
  // +
  if (hitTest(width / 2 + 80, iy + 2, btnW, btnH)) {
    userAnswer++;
    return;
  }
  // +10
  if (hitTest(width / 2 + 140, iy + 2, btnW, btnH)) {
    userAnswer += 10;
    return;
  }

  // Check
  var cy = iy + 56;
  if (hitTest(width / 2 - 110, cy, 100, 36)) {
    checkAnswer();
    return;
  }
  // Skip
  if (hitTest(width / 2 + 10, cy, 100, 36)) {
    generateProblem();
    return;
  }

  // Timer
  var tx = width - 175, ty = height - 80;
  if (hitTest(tx + 12, ty + 34, 136, 24)) {
    if (!timerMode) {
      timerMode = true;
      timerRunning = true;
      timeLeft = 60;
      timerScore = 0;
    } else {
      timerMode = false;
      timerRunning = false;
    }
    return;
  }
}

function hitTest(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}
