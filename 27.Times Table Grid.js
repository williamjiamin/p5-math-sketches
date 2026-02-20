/* jshint esversion: 6 */
// ============================================================
// 27. Times Table Grid — Interactive Multiplication Table Explorer
// ============================================================
// 12×12 grid with hover highlights, click to select, color gradient,
// quiz mode, and pattern highlighting (squares, specific table).

const ORIG_W = 800;
const ORIG_H = 600;

var GRID_SIZE = 12;
var cellW, cellH;
var gridX, gridY;
var hoverR = -1, hoverC = -1;
var selR = -1, selC = -1;
var quizMode = false;
var hiddenCells = [];
var quizInput = -1;
var quizTarget = null;
var quizFeedback = "";
var feedbackTimer = 0;
var highlightTable = 0;
var showSquares = false;
var score = 0;

var COL_BG, COL_TEXT, COL_MUTED, COL_ACCENT, COL_HEADER;
var COL_HOVER_ROW, COL_HOVER_COL, COL_SELECT, COL_BTN, COL_BTN_H;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial");
  initColors();
  computeLayout();
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  computeLayout();
}

function initColors() {
  COL_BG = color(245, 247, 252);
  COL_TEXT = color(40, 40, 60);
  COL_MUTED = color(130, 135, 150);
  COL_ACCENT = color(66, 133, 244);
  COL_HEADER = color(70, 90, 160);
  COL_HOVER_ROW = color(66, 133, 244, 40);
  COL_HOVER_COL = color(66, 133, 244, 40);
  COL_SELECT = color(255, 213, 79);
  COL_BTN = color(100, 120, 200);
  COL_BTN_H = color(80, 100, 180);
}

function computeLayout() {
  var margin = 10;
  var topSpace = 50;
  var bottomSpace = 70;
  var availW = width - margin * 2;
  var availH = height - topSpace - bottomSpace;
  cellW = Math.floor(availW / (GRID_SIZE + 1));
  cellH = Math.floor(availH / (GRID_SIZE + 1));
  var sz = Math.min(cellW, cellH, 42);
  cellW = sz;
  cellH = sz;
  gridX = (width - cellW * (GRID_SIZE + 1)) / 2;
  gridY = topSpace;
}

function draw() {
  background(COL_BG);
  drawTitle();
  findHover();
  drawGrid();
  drawSelection();
  drawButtons();
  drawFeedback();
}

function drawTitle() {
  fill(COL_TEXT);
  noStroke();
  textSize(20);
  textAlign(CENTER, TOP);
  text("Times Table Grid", width / 2, 10);
  if (quizMode) {
    textSize(12);
    fill(COL_ACCENT);
    text("Quiz Mode — Click a ? cell to answer  |  Score: " + score, width / 2, 34);
  }
}

function findHover() {
  var mx = mouseX - gridX;
  var my = mouseY - gridY;
  var c = Math.floor(mx / cellW) - 1;
  var r = Math.floor(my / cellH) - 1;
  if (c >= 0 && c < GRID_SIZE && r >= 0 && r < GRID_SIZE) {
    hoverR = r;
    hoverC = c;
  } else {
    hoverR = -1;
    hoverC = -1;
  }
}

function drawGrid() {
  textAlign(CENTER, CENTER);
  var maxVal = GRID_SIZE * GRID_SIZE;

  // × symbol in corner
  fill(COL_HEADER);
  noStroke();
  textSize(Math.min(16, cellW * 0.45));
  text("×", gridX + cellW * 0.5, gridY + cellH * 0.5);

  // Column headers
  for (var c = 0; c < GRID_SIZE; c++) {
    var cx = gridX + (c + 1) * cellW;
    var cy = gridY;
    var isHL = (hoverC === c) || (highlightTable === c + 1);
    fill(isHL ? COL_ACCENT : COL_HEADER);
    noStroke();
    rect(cx, cy, cellW, cellH, 3);
    fill(255);
    textSize(Math.min(14, cellW * 0.4));
    text(c + 1, cx + cellW / 2, cy + cellH / 2);
  }

  // Row headers
  for (var r = 0; r < GRID_SIZE; r++) {
    var rx = gridX;
    var ry = gridY + (r + 1) * cellH;
    var isHL2 = (hoverR === r) || (highlightTable === r + 1);
    fill(isHL2 ? COL_ACCENT : COL_HEADER);
    noStroke();
    rect(rx, ry, cellW, cellH, 3);
    fill(255);
    textSize(Math.min(14, cellW * 0.4));
    text(r + 1, rx + cellW / 2, ry + cellH / 2);
  }

  // Cells
  for (var r2 = 0; r2 < GRID_SIZE; r2++) {
    for (var c2 = 0; c2 < GRID_SIZE; c2++) {
      var x = gridX + (c2 + 1) * cellW;
      var y = gridY + (r2 + 1) * cellH;
      var val = (r2 + 1) * (c2 + 1);
      var isHidden = isCellHidden(r2, c2);
      var isHoverCell = (hoverR === r2 && hoverC === c2);
      var isSelected = (selR === r2 && selC === c2);
      var isSquare = (r2 === c2);
      var isInHL = (highlightTable > 0 && (r2 + 1 === highlightTable || c2 + 1 === highlightTable));

      // Background
      if (isSelected) {
        fill(COL_SELECT);
      } else if (isHoverCell) {
        fill(220, 230, 255);
      } else if (hoverR === r2 || hoverC === c2) {
        fill(235, 240, 255);
      } else if (showSquares && isSquare) {
        fill(255, 243, 200);
      } else if (isInHL) {
        fill(230, 240, 255);
      } else {
        var t = val / maxVal;
        fill(lerpColor(color(240, 245, 255), color(180, 200, 240), t));
      }

      stroke(210, 215, 230);
      strokeWeight(0.5);
      rect(x, y, cellW, cellH, 2);

      // Value
      fill(COL_TEXT);
      noStroke();
      textSize(Math.min(13, cellW * 0.38));
      if (isHidden) {
        fill(COL_ACCENT);
        textSize(Math.min(16, cellW * 0.45));
        text("?", x + cellW / 2, y + cellH / 2);
      } else {
        text(val, x + cellW / 2, y + cellH / 2);
      }
    }
  }
}

function drawSelection() {
  if (selR < 0 || selC < 0 || quizMode) return;
  var val = (selR + 1) * (selC + 1);
  var msg = (selR + 1) + " × " + (selC + 1) + " = " + val;

  var bw = textWidth(msg) + 40;
  var bh = 36;
  var bx = width / 2 - bw / 2;
  var by = gridY + (GRID_SIZE + 1) * cellH + 8;

  fill(255);
  stroke(COL_ACCENT);
  strokeWeight(2);
  rect(bx, by, bw, bh, 10);

  fill(COL_TEXT);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text(msg, width / 2, by + bh / 2);
}

function drawButtons() {
  var by = height - 50;
  var bw = 100, bh = 32, gap = 12;
  var totalW = bw * 4 + gap * 3;
  var sx = (width - totalW) / 2;

  drawBtn(sx, by, bw, bh, quizMode ? "Grid Mode" : "Quiz Mode", "quiz");
  drawBtn(sx + bw + gap, by, bw, bh, showSquares ? "Hide □" : "Show □", "squares");
  drawBtn(sx + (bw + gap) * 2, by, bw, bh, highlightTable > 0 ? "Clear HL" : "HL Table", "highlight");
  if (highlightTable > 0) {
    drawBtn(sx + (bw + gap) * 3, by, bw, bh, "Next (" + (highlightTable % GRID_SIZE + 1) + ")", "nextHL");
  }
}

function drawBtn(x, y, w, h, label, id) {
  var hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hover ? COL_BTN_H : COL_BTN);
  noStroke();
  rect(x, y, w, h, 8);
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
}

function drawFeedback() {
  if (feedbackTimer <= 0) return;
  feedbackTimer--;
  var alpha = Math.min(255, feedbackTimer * 8);
  fill(quizFeedback === "Correct!" ? color(76, 175, 80, alpha) : color(244, 67, 54, alpha));
  noStroke();
  textSize(20);
  textAlign(CENTER, CENTER);
  text(quizFeedback, width / 2, gridY + (GRID_SIZE + 1) * cellH + 16);
}

function isCellHidden(r, c) {
  if (!quizMode) return false;
  for (var i = 0; i < hiddenCells.length; i++) {
    if (hiddenCells[i][0] === r && hiddenCells[i][1] === c) return true;
  }
  return false;
}

function generateQuiz() {
  hiddenCells = [];
  var count = Math.min(20, Math.floor(GRID_SIZE * GRID_SIZE * 0.15));
  while (hiddenCells.length < count) {
    var r = Math.floor(random(GRID_SIZE));
    var c = Math.floor(random(GRID_SIZE));
    if (!isCellHidden(r, c)) {
      hiddenCells.push([r, c]);
    }
  }
}

function mousePressed() {
  var by = height - 50;
  var bw = 100, bh = 32, gap = 12;
  var totalW = bw * 4 + gap * 3;
  var sx = (width - totalW) / 2;

  // Quiz mode toggle
  if (hitTest(sx, by, bw, bh)) {
    quizMode = !quizMode;
    if (quizMode) {
      generateQuiz();
      score = 0;
    } else {
      hiddenCells = [];
    }
    selR = -1; selC = -1;
    return;
  }

  // Squares toggle
  if (hitTest(sx + bw + gap, by, bw, bh)) {
    showSquares = !showSquares;
    return;
  }

  // Highlight toggle
  if (hitTest(sx + (bw + gap) * 2, by, bw, bh)) {
    highlightTable = highlightTable > 0 ? 0 : 1;
    return;
  }

  // Next highlight
  if (highlightTable > 0 && hitTest(sx + (bw + gap) * 3, by, bw, bh)) {
    highlightTable = (highlightTable % GRID_SIZE) + 1;
    return;
  }

  // Grid click
  if (hoverR >= 0 && hoverC >= 0) {
    if (quizMode && isCellHidden(hoverR, hoverC)) {
      var answer = prompt("What is " + (hoverR + 1) + " × " + (hoverC + 1) + "?");
      if (answer !== null) {
        var val = (hoverR + 1) * (hoverC + 1);
        if (parseInt(answer) === val) {
          quizFeedback = "Correct!";
          score++;
          for (var i = hiddenCells.length - 1; i >= 0; i--) {
            if (hiddenCells[i][0] === hoverR && hiddenCells[i][1] === hoverC) {
              hiddenCells.splice(i, 1);
              break;
            }
          }
        } else {
          quizFeedback = "Try again! " + (hoverR + 1) + "×" + (hoverC + 1) + "=" + val;
        }
        feedbackTimer = 60;
      }
    } else {
      selR = hoverR;
      selC = hoverC;
    }
  }
}

function hitTest(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}
