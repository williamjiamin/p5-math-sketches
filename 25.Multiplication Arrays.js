/* jshint esversion: 6 */
// ============================================================
// 25. Multiplication Arrays — Visual Grid & Area Model
// ============================================================

var ORIG_W = 800;
var ORIG_H = 600;

var canvasW, canvasH;

// Grid
var numRows = 3, numCols = 4;
var MAX_DIM = 10;

// Animation
var revealedRows = 0;
var revealT = 0;
var REVEAL_SPEED = 0.03;
var animState = "idle"; // idle | revealing | done
var runningCount = 0;
var countDisplay = 0;

// Layout
var GRID_CX, GRID_CY, GRID_MAX_W, GRID_MAX_H;
var DOT_SIZE;

// UI Buttons
var rowPlusBtn = { x: 0, y: 0, w: 40, h: 40 };
var rowMinusBtn = { x: 0, y: 0, w: 40, h: 40 };
var colPlusBtn = { x: 0, y: 0, w: 40, h: 40 };
var colMinusBtn = { x: 0, y: 0, w: 40, h: 40 };
var animateBtn = { x: 0, y: 0, w: 140, h: 40 };

// Colors
var COL_BG, COL_TEXT, COL_ACCENT, COL_MUTED;
var COL_BTN, COL_BTN_HOVER, COL_PANEL;
var DOT_COLORS;

// Area model
var AREA_X, AREA_Y, AREA_MAX_W, AREA_MAX_H;

function setup() {
  canvasW = Math.min(ORIG_W, windowWidth);
  canvasH = Math.min(ORIG_H, windowHeight);
  createCanvas(canvasW, canvasH);
  textFont("Arial");

  COL_BG        = color(245, 247, 252);
  COL_TEXT       = color(40, 40, 60);
  COL_ACCENT    = color(80, 60, 200);
  COL_MUTED     = color(140, 145, 160);
  COL_BTN       = color(80, 60, 200);
  COL_BTN_HOVER = color(100, 80, 230);
  COL_PANEL     = color(255, 255, 255, 220);

  DOT_COLORS = [
    color(255, 100, 80),
    color(80, 180, 120),
    color(60, 140, 220),
    color(255, 175, 40),
    color(180, 80, 200),
    color(40, 200, 200),
    color(220, 120, 60),
    color(120, 200, 80),
    color(200, 80, 140),
    color(100, 120, 220)
  ];

  updateLayout();
  resetAnimation();
}

function windowResized() {
  canvasW = Math.min(ORIG_W, windowWidth);
  canvasH = Math.min(ORIG_H, windowHeight);
  resizeCanvas(canvasW, canvasH);
  updateLayout();
}

function updateLayout() {
  GRID_CX = canvasW * 0.32;
  GRID_CY = canvasH * 0.48;
  GRID_MAX_W = canvasW * 0.38;
  GRID_MAX_H = canvasH * 0.45;

  var maxDotW = GRID_MAX_W / MAX_DIM;
  var maxDotH = GRID_MAX_H / MAX_DIM;
  DOT_SIZE = Math.min(maxDotW, maxDotH, 36) * 0.75;

  AREA_X = canvasW * 0.62;
  AREA_Y = canvasH * 0.26;
  AREA_MAX_W = canvasW * 0.28;
  AREA_MAX_H = canvasH * 0.40;

  var ctrlX = canvasW * 0.32;
  var ctrlY = canvasH * 0.82;
  rowMinusBtn.x = ctrlX - 130;
  rowMinusBtn.y = ctrlY;
  rowPlusBtn.x = ctrlX - 50;
  rowPlusBtn.y = ctrlY;
  colMinusBtn.x = ctrlX + 20;
  colMinusBtn.y = ctrlY;
  colPlusBtn.x = ctrlX + 100;
  colPlusBtn.y = ctrlY;

  animateBtn.x = canvasW * 0.62 + AREA_MAX_W / 2 - animateBtn.w / 2;
  animateBtn.y = canvasH - 70;
}

function resetAnimation() {
  animState = "idle";
  revealedRows = 0;
  revealT = 0;
  runningCount = 0;
  countDisplay = 0;
}

function startReveal() {
  if (animState !== "idle") return;
  animState = "revealing";
  revealedRows = 0;
  revealT = 0;
  runningCount = 0;
  countDisplay = 0;
}

function draw() {
  background(COL_BG);
  drawTitle();
  drawEquation();
  updateRevealAnimation();
  drawDotGrid();
  drawAreaModel();
  drawControls();
  drawAnimateButton();
  drawRunningCount();
}

function drawTitle() {
  noStroke();
  fill(COL_ACCENT);
  textSize(Math.min(24, canvasW * 0.04));
  textAlign(CENTER, CENTER);
  text("Multiplication Arrays", canvasW / 2, 28);
}

function drawEquation() {
  var y = canvasH * 0.1;
  var sz = Math.min(28, canvasW * 0.04);

  textAlign(CENTER, CENTER);
  noStroke();

  fill(COL_ACCENT);
  textSize(sz);
  text(numRows + " rows", canvasW / 2 - sz * 3, y);

  fill(COL_MUTED);
  textSize(sz * 0.9);
  text("×", canvasW / 2 - sz * 0.8, y);

  fill(COL_ACCENT);
  textSize(sz);
  text(numCols + " columns", canvasW / 2 + sz * 2, y);

  fill(COL_TEXT);
  textSize(sz * 0.9);
  text("=", canvasW / 2 + sz * 5.5, y);

  if (animState === "done") {
    fill(color(255, 175, 40));
  } else {
    fill(COL_TEXT);
  }
  textSize(sz * 1.1);
  text(numRows * numCols, canvasW / 2 + sz * 7, y);
}

function updateRevealAnimation() {
  if (animState !== "revealing") return;

  revealT += REVEAL_SPEED;
  if (revealT >= 1) {
    revealedRows++;
    runningCount = revealedRows * numCols;
    revealT = 0;

    if (revealedRows >= numRows) {
      animState = "done";
      return;
    }
  }

  countDisplay = revealedRows * numCols + floor(revealT * numCols);
}

function drawDotGrid() {
  var totalW = numCols * DOT_SIZE * 1.6;
  var totalH = numRows * DOT_SIZE * 1.6;
  var startX = GRID_CX - totalW / 2 + DOT_SIZE * 0.8;
  var startY = GRID_CY - totalH / 2 + DOT_SIZE * 0.8;

  // Grid background
  noStroke();
  fill(255, 255, 255, 120);
  rect(GRID_CX - totalW / 2 - 10, GRID_CY - totalH / 2 - 10, totalW + 20, totalH + 20, 12);

  for (var r = 0; r < numRows; r++) {
    var rowVisible = false;
    var rowAlpha = 255;

    if (animState === "idle") {
      rowVisible = false;
    } else if (animState === "done") {
      rowVisible = true;
    } else {
      if (r < revealedRows) {
        rowVisible = true;
      } else if (r === revealedRows) {
        rowVisible = true;
        rowAlpha = map(revealT, 0, 1, 80, 255);
      }
    }

    if (!rowVisible) continue;

    var rowCol = DOT_COLORS[r % DOT_COLORS.length];

    for (var c = 0; c < numCols; c++) {
      var dx = startX + c * DOT_SIZE * 1.6;
      var dy = startY + r * DOT_SIZE * 1.6;

      var dotAlpha = rowAlpha;
      if (animState === "revealing" && r === revealedRows) {
        var colProgress = revealT * numCols;
        if (c > colProgress) {
          dotAlpha = 40;
        } else {
          dotAlpha = map(constrain(colProgress - c, 0, 1), 0, 1, 80, 255);
        }
      }

      noStroke();
      fill(red(rowCol), green(rowCol), blue(rowCol), dotAlpha);
      ellipse(dx, dy, DOT_SIZE, DOT_SIZE);

      if (dotAlpha > 150) {
        fill(255, 255, 255, dotAlpha * 0.6);
        ellipse(dx - DOT_SIZE * 0.15, dy - DOT_SIZE * 0.15, DOT_SIZE * 0.3, DOT_SIZE * 0.3);
      }
    }

    // Row label
    if (rowAlpha > 150) {
      fill(red(rowCol), green(rowCol), blue(rowCol), rowAlpha);
      textAlign(RIGHT, CENTER);
      textSize(Math.min(13, canvasW * 0.02));
      noStroke();
      text(numCols, startX - DOT_SIZE, startY + r * DOT_SIZE * 1.6);
    }
  }

  // Row count labels on the right
  if (animState === "done" || animState === "revealing") {
    var visibleRows = animState === "done" ? numRows : revealedRows + (revealT > 0.5 ? 1 : 0);
    for (var rv = 0; rv < Math.min(visibleRows, numRows); rv++) {
      var ry = startY + rv * DOT_SIZE * 1.6;
      fill(COL_MUTED);
      textAlign(LEFT, CENTER);
      textSize(Math.min(11, canvasW * 0.016));
      noStroke();
      text("+" + numCols, startX + numCols * DOT_SIZE * 1.6 - DOT_SIZE * 0.4, ry);
    }
  }
}

function drawAreaModel() {
  var maxW = AREA_MAX_W;
  var maxH = AREA_MAX_H;
  var unitW = maxW / MAX_DIM;
  var unitH = maxH / MAX_DIM;
  var rectW = numCols * unitW;
  var rectH = numRows * unitH;
  var rx = AREA_X;
  var ry = AREA_Y;

  // Colored rectangle
  var areaAlpha = (animState === "done") ? 220 : (animState === "revealing" ? map(revealedRows, 0, numRows, 60, 200) : 80);
  noStroke();
  fill(80, 60, 200, areaAlpha);
  rect(rx, ry, rectW, rectH, 4);

  // Grid lines
  stroke(255, 255, 255, 80);
  strokeWeight(1);
  for (var c = 1; c < numCols; c++) {
    line(rx + c * unitW, ry, rx + c * unitW, ry + rectH);
  }
  for (var r = 1; r < numRows; r++) {
    line(rx, ry + r * unitH, rx + rectW, ry + r * unitH);
  }

  // Dimension labels
  noStroke();
  fill(COL_TEXT);
  textAlign(CENTER, BOTTOM);
  textSize(Math.min(14, canvasW * 0.022));
  text(numCols, rx + rectW / 2, ry - 6);

  textAlign(RIGHT, CENTER);
  text(numRows, rx - 8, ry + rectH / 2);

  // Area label in center
  if (animState === "done") {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(Math.min(22, canvasW * 0.035));
    text(numRows * numCols, rx + rectW / 2, ry + rectH / 2);
  }

  // Area model title
  fill(COL_MUTED);
  textAlign(CENTER, TOP);
  textSize(Math.min(13, canvasW * 0.02));
  text("Area Model", rx + rectW / 2, ry + rectH + 12);
}

function drawRunningCount() {
  if (animState === "idle") return;

  var cx = AREA_X + AREA_MAX_W / 2;
  var cy = canvasH * 0.78;
  var displayVal = (animState === "done") ? numRows * numCols : countDisplay;

  noStroke();
  fill(COL_PANEL);
  rect(cx - 60, cy - 20, 120, 44, 10);

  fill(animState === "done" ? color(255, 175, 40) : COL_ACCENT);
  textAlign(CENTER, CENTER);
  textSize(Math.min(24, canvasW * 0.038));
  text("Count: " + displayVal, cx, cy);
}

function drawControls() {
  var labelSz = Math.min(14, canvasW * 0.022);

  // Row controls
  noStroke();
  fill(COL_TEXT);
  textAlign(CENTER, BOTTOM);
  textSize(labelSz);
  text("Rows: " + numRows, (rowMinusBtn.x + rowPlusBtn.x + rowPlusBtn.w) / 2, rowMinusBtn.y - 6);

  drawSmallBtn(rowMinusBtn, "−", isInsideBtn(rowMinusBtn, mouseX, mouseY));
  drawSmallBtn(rowPlusBtn, "+", isInsideBtn(rowPlusBtn, mouseX, mouseY));

  // Column controls
  fill(COL_TEXT);
  textAlign(CENTER, BOTTOM);
  textSize(labelSz);
  text("Cols: " + numCols, (colMinusBtn.x + colPlusBtn.x + colPlusBtn.w) / 2, colMinusBtn.y - 6);

  drawSmallBtn(colMinusBtn, "−", isInsideBtn(colMinusBtn, mouseX, mouseY));
  drawSmallBtn(colPlusBtn, "+", isInsideBtn(colPlusBtn, mouseX, mouseY));
}

function drawSmallBtn(btn, label, hover) {
  noStroke();
  fill(hover ? COL_BTN_HOVER : COL_BTN);
  rect(btn.x, btn.y, btn.w, btn.h, 8);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
}

function drawAnimateButton() {
  var hover = isInsideBtn(animateBtn, mouseX, mouseY);
  var label = (animState === "done") ? "Reset" : "Animate!";

  noStroke();
  fill(hover ? COL_BTN_HOVER : COL_BTN);
  rect(animateBtn.x, animateBtn.y, animateBtn.w, animateBtn.h, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(Math.min(15, canvasW * 0.025));
  text(label, animateBtn.x + animateBtn.w / 2, animateBtn.y + animateBtn.h / 2);
}

function isInsideBtn(btn, mx, my) {
  return mx > btn.x && mx < btn.x + btn.w && my > btn.y && my < btn.y + btn.h;
}

function mousePressed() {
  if (isInsideBtn(rowPlusBtn, mouseX, mouseY)) {
    numRows = Math.min(numRows + 1, MAX_DIM);
    resetAnimation();
    return;
  }
  if (isInsideBtn(rowMinusBtn, mouseX, mouseY)) {
    numRows = Math.max(numRows - 1, 1);
    resetAnimation();
    return;
  }
  if (isInsideBtn(colPlusBtn, mouseX, mouseY)) {
    numCols = Math.min(numCols + 1, MAX_DIM);
    resetAnimation();
    return;
  }
  if (isInsideBtn(colMinusBtn, mouseX, mouseY)) {
    numCols = Math.max(numCols - 1, 1);
    resetAnimation();
    return;
  }
  if (isInsideBtn(animateBtn, mouseX, mouseY)) {
    if (animState === "done") {
      resetAnimation();
    } else {
      startReveal();
    }
    return;
  }
}
