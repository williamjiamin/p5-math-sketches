/* jshint esversion: 6 */
// ============================================================
// 19. Counting Practice — Quiz Module for Counting Skills
// ============================================================
// Shows a random number of objects and asks the student to count them.
// +/- buttons to set answer, Check to verify, score tracking.

const ORIG_W = 800;
const ORIG_H = 600;

var targetCount = 0;
var userAnswer = 0;
var score = 0;
var totalAttempts = 0;
var state = "playing"; // playing | correct | wrong
var shakeTimer = 0;
var celebTimer = 0;
var celebParticles = [];
var objectPositions = [];

var COL_BG, COL_CARD, COL_BORDER, COL_TEXT, COL_MUTED, COL_ACCENT;
var COL_GREEN, COL_RED;
var OBJ_COLORS = [];

var minusBtn = { x: 0, y: 0, w: 50, h: 50 };
var plusBtn  = { x: 0, y: 0, w: 50, h: 50 };
var checkBtn = { x: 0, y: 0, w: 120, h: 44 };
var nextBtn  = { x: 0, y: 0, w: 120, h: 44 };

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial");
  COL_BG = color(245, 247, 252);
  COL_CARD = color(255);
  COL_BORDER = color(215, 220, 235);
  COL_TEXT = color(40, 40, 60);
  COL_MUTED = color(130, 135, 150);
  COL_ACCENT = color(66, 133, 244);
  COL_GREEN = color(52, 168, 83);
  COL_RED = color(234, 67, 53);
  OBJ_COLORS = [
    color(66, 133, 244), color(234, 67, 53), color(52, 168, 83),
    color(251, 188, 4), color(171, 71, 188), color(255, 112, 67)
  ];
  generateProblem();
  layoutUI();
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  layoutUI();
  placeObjects();
}

function layoutUI() {
  var cx = width / 2;
  var answerY = height - 120;
  minusBtn.x = cx - 110;
  minusBtn.y = answerY;
  plusBtn.x = cx + 60;
  plusBtn.y = answerY;
  checkBtn.x = cx - 60;
  checkBtn.y = height - 58;
  nextBtn.x = cx - 60;
  nextBtn.y = height - 58;
}

function generateProblem() {
  targetCount = floor(random(3, 21));
  userAnswer = 0;
  state = "playing";
  shakeTimer = 0;
  celebTimer = 0;
  celebParticles = [];
  placeObjects();
}

function placeObjects() {
  objectPositions = [];
  var margin = 50;
  var areaTop = 100;
  var areaBottom = height - 170;
  var areaLeft = margin;
  var areaRight = width - margin;
  var objR = 20;

  for (var i = 0; i < targetCount; i++) {
    var tries = 0;
    var px, py, valid;
    do {
      px = random(areaLeft + objR, areaRight - objR);
      py = random(areaTop + objR, areaBottom - objR);
      valid = true;
      for (var j = 0; j < objectPositions.length; j++) {
        var d = dist(px, py, objectPositions[j].x, objectPositions[j].y);
        if (d < objR * 2.4) { valid = false; break; }
      }
      tries++;
    } while (!valid && tries < 200);
    objectPositions.push({
      x: px, y: py,
      col: OBJ_COLORS[i % OBJ_COLORS.length],
      phase: random(TWO_PI),
      size: random(0.85, 1.15)
    });
  }
}

function draw() {
  background(COL_BG);

  if (shakeTimer > 0) {
    shakeTimer -= deltaTime / 1000;
    translate(random(-4, 4), random(-4, 4));
  }

  drawTitle();
  drawScore();
  drawObjects();
  drawAnswerArea();

  if (state === "playing") {
    drawButton(checkBtn, "✔ Check", COL_ACCENT, 255);
  } else {
    drawButton(nextBtn, "➡ Next", COL_ACCENT, 255);
  }

  drawFeedback();
  updateCelebParticles();
  drawCelebParticles();
}

function drawTitle() {
  fill(COL_TEXT);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(22);
  textStyle(BOLD);
  text("Counting Practice", width / 2, 30);
  textStyle(NORMAL);
  textSize(14);
  fill(COL_MUTED);
  text("How many objects do you see?", width / 2, 56);
}

function drawScore() {
  fill(COL_CARD);
  stroke(COL_BORDER);
  strokeWeight(1);
  rect(width - 145, 12, 130, 34, 17);
  noStroke();
  fill(COL_TEXT);
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text("Score: " + score + " / " + totalAttempts, width - 80, 29);
  textStyle(NORMAL);
}

function drawObjects() {
  for (var i = 0; i < objectPositions.length; i++) {
    var obj = objectPositions[i];
    var bob = sin(frameCount * 0.04 + obj.phase) * 2;
    var sz = 18 * obj.size;
    push();
    translate(obj.x, obj.y + bob);
    noStroke();
    fill(obj.col);
    drawStar(0, 0, sz * 0.45, sz, 5);
    fill(255, 255, 255, 70);
    ellipse(-sz * 0.12, -sz * 0.15, sz * 0.35, sz * 0.25);
    pop();
  }
}

function drawStar(x, y, r1, r2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle / 2.0;
  beginShape();
  for (var a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
    vertex(x + cos(a) * r2, y + sin(a) * r2);
    vertex(x + cos(a + halfAngle) * r1, y + sin(a + halfAngle) * r1);
  }
  endShape(CLOSE);
}

function drawAnswerArea() {
  var cx = width / 2;
  var ay = height - 120;

  fill(COL_CARD);
  stroke(COL_BORDER);
  strokeWeight(1);
  rect(cx - 35, ay - 2, 70, 54, 10);
  noStroke();
  fill(COL_TEXT);
  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);
  text(userAnswer, cx, ay + 24);
  textStyle(NORMAL);

  drawRoundBtn(minusBtn, "−", COL_RED);
  drawRoundBtn(plusBtn, "+", COL_GREEN);
}

function drawRoundBtn(btn, label, col) {
  fill(col);
  noStroke();
  ellipse(btn.x + btn.w / 2, btn.y + btn.h / 2, btn.w, btn.h);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  textStyle(BOLD);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2 - 1);
  textStyle(NORMAL);
}

function drawButton(btn, label, bg, fg) {
  fill(bg);
  noStroke();
  rect(btn.x, btn.y, btn.w, btn.h, 22);
  fill(fg);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  textStyle(NORMAL);
}

function drawFeedback() {
  if (state === "correct") {
    fill(52, 168, 83, 200);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    textStyle(BOLD);
    text("🎉 Correct! There are " + targetCount + " objects!", width / 2, height - 160);
    textStyle(NORMAL);
  } else if (state === "wrong") {
    fill(234, 67, 53, 200);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
    textStyle(BOLD);
    text("Try again! That's not quite right.", width / 2, height - 160);
    textStyle(NORMAL);
  }
}

function spawnCelebration() {
  for (var i = 0; i < 30; i++) {
    celebParticles.push({
      x: width / 2, y: height / 2,
      vx: random(-5, 5), vy: random(-7, -1),
      life: 1,
      col: OBJ_COLORS[floor(random(OBJ_COLORS.length))]
    });
  }
}

function updateCelebParticles() {
  for (var i = celebParticles.length - 1; i >= 0; i--) {
    var p = celebParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.life -= 0.015;
    if (p.life <= 0) celebParticles.splice(i, 1);
  }
}

function drawCelebParticles() {
  noStroke();
  for (var i = 0; i < celebParticles.length; i++) {
    var p = celebParticles[i];
    fill(red(p.col), green(p.col), blue(p.col), p.life * 255);
    ellipse(p.x, p.y, 8 * p.life);
  }
}

function insideBtn(btn) {
  return mouseX >= btn.x && mouseX <= btn.x + btn.w &&
         mouseY >= btn.y && mouseY <= btn.y + btn.h;
}

function insideCircBtn(btn) {
  var cx = btn.x + btn.w / 2;
  var cy = btn.y + btn.h / 2;
  return dist(mouseX, mouseY, cx, cy) < btn.w / 2;
}

function mousePressed() {
  if (state === "playing") {
    if (insideCircBtn(plusBtn)) {
      userAnswer = min(userAnswer + 1, 30);
    }
    if (insideCircBtn(minusBtn)) {
      userAnswer = max(userAnswer - 1, 0);
    }
    if (insideBtn(checkBtn)) {
      totalAttempts++;
      if (userAnswer === targetCount) {
        state = "correct";
        score++;
        spawnCelebration();
      } else {
        state = "wrong";
        shakeTimer = 0.4;
      }
    }
  } else {
    if (insideBtn(nextBtn)) {
      generateProblem();
    }
  }
}
