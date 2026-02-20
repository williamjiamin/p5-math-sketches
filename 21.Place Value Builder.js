/* jshint esversion: 6 */
// ============================================================
// 21. Place Value Builder — Drag Blocks to Build a Number
// ============================================================
// A target number is shown. The student drags ones, tens, and
// hundreds blocks into the building area to match it.

const ORIG_W = 800;
const ORIG_H = 600;

var targetNumber = 0;
var builtHundreds = 0;
var builtTens = 0;
var builtOnes = 0;
var score = 0;
var totalAttempts = 0;
var state = "playing"; // playing | correct | wrong
var celebParticles = [];
var shakeTimer = 0;

var COL_BG, COL_CARD, COL_BORDER, COL_TEXT, COL_MUTED;
var COL_ONES, COL_TENS, COL_HUNDREDS, COL_GREEN, COL_RED, COL_ACCENT;

var BUILD_TOP = 160;
var BUILD_BOTTOM = 420;
var TRAY_Y = 460;
var UNIT = 12;

var dragging = null; // { type: "ones"|"tens"|"hundreds", x, y }

var checkBtn  = { x: 0, y: 0, w: 120, h: 42 };
var nextBtn   = { x: 0, y: 0, w: 120, h: 42 };
var clearBtn  = { x: 0, y: 0, w: 100, h: 36 };

var hPlusBtn  = { x: 0, y: 0, w: 36, h: 36 };
var hMinBtn   = { x: 0, y: 0, w: 36, h: 36 };
var tPlusBtn  = { x: 0, y: 0, w: 36, h: 36 };
var tMinBtn   = { x: 0, y: 0, w: 36, h: 36 };
var oPlusBtn  = { x: 0, y: 0, w: 36, h: 36 };
var oMinBtn   = { x: 0, y: 0, w: 36, h: 36 };

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial");
  COL_BG = color(245, 247, 252);
  COL_CARD = color(255);
  COL_BORDER = color(215, 220, 235);
  COL_TEXT = color(40, 40, 60);
  COL_MUTED = color(130, 135, 150);
  COL_ONES = color(66, 133, 244);
  COL_TENS = color(52, 168, 83);
  COL_HUNDREDS = color(255, 152, 0);
  COL_GREEN = color(52, 168, 83);
  COL_RED = color(234, 67, 53);
  COL_ACCENT = color(66, 133, 244);
  generateProblem();
  layoutUI();
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  layoutUI();
}

function layoutUI() {
  var cx = width / 2;
  TRAY_Y = height - 130;
  BUILD_TOP = 150;
  BUILD_BOTTOM = TRAY_Y - 50;

  checkBtn.x = cx - 60;
  checkBtn.y = height - 52;
  nextBtn.x = cx - 60;
  nextBtn.y = height - 52;
  clearBtn.x = cx + 80;
  clearBtn.y = height - 48;

  var traySpacing = width / 4;
  hMinBtn.x = traySpacing * 1 - 55; hMinBtn.y = TRAY_Y + 32;
  hPlusBtn.x = traySpacing * 1 + 20; hPlusBtn.y = TRAY_Y + 32;
  tMinBtn.x = traySpacing * 2 - 55; tMinBtn.y = TRAY_Y + 32;
  tPlusBtn.x = traySpacing * 2 + 20; tPlusBtn.y = TRAY_Y + 32;
  oMinBtn.x = traySpacing * 3 - 55; oMinBtn.y = TRAY_Y + 32;
  oPlusBtn.x = traySpacing * 3 + 20; oPlusBtn.y = TRAY_Y + 32;

  UNIT = constrain(map(width, 400, 800, 8, 12), 8, 12);
}

function generateProblem() {
  targetNumber = floor(random(10, 1000));
  builtHundreds = 0;
  builtTens = 0;
  builtOnes = 0;
  state = "playing";
  shakeTimer = 0;
  celebParticles = [];
}

function builtValue() {
  return builtHundreds * 100 + builtTens * 10 + builtOnes;
}

function draw() {
  background(COL_BG);
  if (shakeTimer > 0) {
    shakeTimer -= deltaTime / 1000;
    translate(random(-4, 4), random(-3, 3));
  }
  drawTitle();
  drawTarget();
  drawScore();
  drawBuildArea();
  drawBuiltBlocks();
  drawBuiltValue();
  drawTray();
  drawActionButtons();
  drawFeedback();
  updateParticles();
  drawParticles();
}

function drawTitle() {
  fill(COL_TEXT);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(22);
  textStyle(BOLD);
  text("Place Value Builder", width / 2, 26);
  textStyle(NORMAL);
  textSize(13);
  fill(COL_MUTED);
  text("Use the + / − buttons to build the target number with blocks", width / 2, 50);
}

function drawTarget() {
  var cx = width / 2;
  fill(COL_CARD);
  stroke(COL_BORDER);
  strokeWeight(1.5);
  rect(cx - 100, 66, 200, 44, 12);
  noStroke();
  fill(COL_MUTED);
  textAlign(CENTER, CENTER);
  textSize(13);
  text("Target", cx, 76);
  fill(COL_TEXT);
  textSize(24);
  textStyle(BOLD);
  text(targetNumber, cx, 96);
  textStyle(NORMAL);
}

function drawScore() {
  fill(COL_CARD);
  stroke(COL_BORDER);
  strokeWeight(1);
  rect(width - 145, 10, 130, 34, 17);
  noStroke();
  fill(COL_TEXT);
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text("Score: " + score + " / " + totalAttempts, width - 80, 27);
  textStyle(NORMAL);
}

function drawBuildArea() {
  fill(255, 255, 255, 120);
  stroke(COL_BORDER);
  strokeWeight(1);
  var areaX = 30;
  var areaW = width - 60;
  rect(areaX, BUILD_TOP - 20, areaW, BUILD_BOTTOM - BUILD_TOP + 30, 12);
  noStroke();
  fill(COL_MUTED);
  textAlign(LEFT, TOP);
  textSize(11);
  text("Building Area", areaX + 10, BUILD_TOP - 16);
}

function drawBuiltBlocks() {
  var x = 50;
  var y = BUILD_TOP + 10;
  var maxH = BUILD_BOTTOM - BUILD_TOP - 10;

  for (var i = 0; i < builtHundreds; i++) {
    drawMiniHundred(x, y);
    x += UNIT * 10 + 8;
    if (x + UNIT * 10 > width - 50) { x = 50; y += UNIT * 10 + 8; }
  }

  for (var j = 0; j < builtTens; j++) {
    drawMiniTen(x, y);
    x += UNIT + 8;
    if (x + UNIT > width - 50) { x = 50; y += UNIT * 10 + 8; }
  }

  for (var k = 0; k < builtOnes; k++) {
    drawMiniOne(x, y + UNIT * 9);
    x += UNIT + 4;
    if (x + UNIT > width - 50) { x = 50; y += UNIT * 10 + 8; }
  }
}

function drawMiniHundred(x, y) {
  for (var r = 0; r < 10; r++) {
    for (var c = 0; c < 10; c++) {
      fill(COL_HUNDREDS);
      stroke(200, 120, 0, 80);
      strokeWeight(0.4);
      rect(x + c * UNIT, y + r * UNIT, UNIT - 1, UNIT - 1, 1);
    }
  }
  noFill();
  stroke(200, 120, 0, 150);
  strokeWeight(1.5);
  rect(x - 1, y - 1, UNIT * 10 + 1, UNIT * 10 + 1, 2);
}

function drawMiniTen(x, y) {
  for (var r = 0; r < 10; r++) {
    fill(COL_TENS);
    stroke(0, 130, 50, 80);
    strokeWeight(0.4);
    rect(x, y + r * UNIT, UNIT - 1, UNIT - 1, 1);
  }
  noFill();
  stroke(0, 130, 50, 150);
  strokeWeight(1.5);
  rect(x - 1, y - 1, UNIT + 1, UNIT * 10 + 1, 2);
}

function drawMiniOne(x, y) {
  fill(COL_ONES);
  stroke(30, 80, 200, 80);
  strokeWeight(0.4);
  rect(x, y, UNIT - 1, UNIT - 1, 1);
}

function drawBuiltValue() {
  var val = builtValue();
  var cx = width / 2;
  var y = BUILD_TOP - 36;
  fill(COL_TEXT);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text("Built: " + val, cx, y);
  textStyle(NORMAL);
}

function drawTray() {
  var traySpacing = width / 4;
  fill(COL_CARD);
  stroke(COL_BORDER);
  strokeWeight(1);
  rect(15, TRAY_Y - 10, width - 30, 80, 12);

  drawTrayItem(traySpacing * 1, TRAY_Y, COL_HUNDREDS, "100s", builtHundreds, hMinBtn, hPlusBtn);
  drawTrayItem(traySpacing * 2, TRAY_Y, COL_TENS, "10s", builtTens, tMinBtn, tPlusBtn);
  drawTrayItem(traySpacing * 3, TRAY_Y, COL_ONES, "1s", builtOnes, oMinBtn, oPlusBtn);
}

function drawTrayItem(cx, ty, col, label, count, minBtn, plusBtn) {
  fill(col);
  noStroke();
  rect(cx - 18, ty + 2, 36, 20, 4);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text(label, cx, ty + 12);
  textStyle(NORMAL);

  fill(COL_TEXT);
  textSize(18);
  textStyle(BOLD);
  text(count, cx, ty + 48);
  textStyle(NORMAL);

  drawTinyBtn(minBtn, "−", COL_RED);
  drawTinyBtn(plusBtn, "+", COL_GREEN);
}

function drawTinyBtn(btn, label, col) {
  fill(col);
  noStroke();
  rect(btn.x, btn.y, btn.w, btn.h, 8);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  textStyle(NORMAL);
}

function drawActionButtons() {
  if (state === "playing") {
    drawBtn(checkBtn, "✔ Check", COL_ACCENT);
  } else {
    drawBtn(nextBtn, "➡ Next", COL_ACCENT);
  }
  if (state === "playing") {
    drawBtn(clearBtn, "Clear", color(180));
  }
}

function drawBtn(btn, label, col) {
  fill(col);
  noStroke();
  rect(btn.x, btn.y, btn.w, btn.h, 21);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  textStyle(NORMAL);
}

function drawFeedback() {
  if (state === "correct") {
    fill(52, 168, 83, 220);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    textStyle(BOLD);
    text("🎉 Correct! " + targetNumber + " = " + builtValue(), width / 2, BUILD_TOP - 56);
    textStyle(NORMAL);
  } else if (state === "wrong") {
    fill(234, 67, 53, 220);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(17);
    textStyle(BOLD);
    text("Not quite — you built " + builtValue() + ", target is " + targetNumber, width / 2, BUILD_TOP - 56);
    textStyle(NORMAL);
  }
}

function spawnCelebration() {
  for (var i = 0; i < 35; i++) {
    celebParticles.push({
      x: width / 2, y: height / 3,
      vx: random(-5, 5), vy: random(-7, -1),
      life: 1,
      col: [COL_ONES, COL_TENS, COL_HUNDREDS][floor(random(3))]
    });
  }
}

function updateParticles() {
  for (var i = celebParticles.length - 1; i >= 0; i--) {
    var p = celebParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.life -= 0.015;
    if (p.life <= 0) celebParticles.splice(i, 1);
  }
}

function drawParticles() {
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

function mousePressed() {
  if (state === "playing") {
    if (insideBtn(hPlusBtn)) builtHundreds = min(builtHundreds + 1, 9);
    if (insideBtn(hMinBtn))  builtHundreds = max(builtHundreds - 1, 0);
    if (insideBtn(tPlusBtn)) builtTens = min(builtTens + 1, 9);
    if (insideBtn(tMinBtn))  builtTens = max(builtTens - 1, 0);
    if (insideBtn(oPlusBtn)) builtOnes = min(builtOnes + 1, 9);
    if (insideBtn(oMinBtn))  builtOnes = max(builtOnes - 1, 0);
    if (insideBtn(clearBtn)) {
      builtHundreds = 0;
      builtTens = 0;
      builtOnes = 0;
    }
    if (insideBtn(checkBtn)) {
      totalAttempts++;
      if (builtValue() === targetNumber) {
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
