/* jshint esversion: 6 */
// ============================================================
// 20. Place Value Blocks — Visual Base-10 Decomposition
// ============================================================
// Shows ones (blue cubes), tens (green rods), hundreds (orange flats).
// Adjust the number with +/- or slider and watch it decompose.

const ORIG_W = 800;
const ORIG_H = 600;

var currentNumber = 347;
var displayNumber = 347;
var animProgress = 1;

var COL_BG, COL_CARD, COL_BORDER, COL_TEXT, COL_MUTED;
var COL_ONES, COL_TENS, COL_HUNDREDS;

var UNIT = 16;
var BLOCK_AREA_TOP = 180;

var slider = { x: 0, y: 0, w: 300, h: 6, dragging: false };
var plus1   = { x: 0, y: 0, w: 40, h: 36 };
var minus1  = { x: 0, y: 0, w: 40, h: 36 };
var plus10  = { x: 0, y: 0, w: 50, h: 36 };
var minus10 = { x: 0, y: 0, w: 50, h: 36 };

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
  layoutUI();
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  layoutUI();
}

function layoutUI() {
  var cx = width / 2;
  slider.x = cx - 150;
  slider.y = 140;
  slider.w = 300;
  plus1.x  = cx + 95;  plus1.y  = 80;
  minus1.x = cx + 55;  minus1.y = 80;
  plus10.x = cx + 155; plus10.y = 80;
  minus10.x = cx - 215; minus10.y = 80;
  UNIT = constrain(map(width, 400, 800, 10, 16), 10, 16);
}

function draw() {
  background(COL_BG);
  displayNumber = lerp(displayNumber, currentNumber, 0.12);
  var n = round(displayNumber);
  drawTitle();
  drawNumberDisplay(n);
  drawSlider();
  drawControls();
  drawDecompositionLabel(n);
  drawBlocks(n);
  drawLegend();
}

function drawTitle() {
  fill(COL_TEXT);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(22);
  textStyle(BOLD);
  text("Place Value Blocks", width / 2, 28);
  textStyle(NORMAL);
  textSize(13);
  fill(COL_MUTED);
  text("Change the number and see how it splits into hundreds, tens, and ones", width / 2, 52);
}

function drawNumberDisplay(n) {
  var cx = width / 2;
  fill(COL_CARD);
  stroke(COL_BORDER);
  strokeWeight(1.5);
  rect(cx - 50, 70, 100, 44, 12);
  noStroke();
  fill(COL_TEXT);
  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);
  text(n, cx, 92);
  textStyle(NORMAL);
}

function drawSlider() {
  var sx = slider.x;
  var sy = slider.y;
  var sw = slider.w;
  var knobX = map(currentNumber, 0, 999, sx, sx + sw);

  stroke(215, 220, 235);
  strokeWeight(4);
  line(sx, sy, sx + sw, sy);
  stroke(COL_ONES);
  strokeWeight(4);
  line(sx, sy, knobX, sy);
  noStroke();
  fill(COL_ONES);
  ellipse(knobX, sy, 18, 18);
  fill(255);
  ellipse(knobX, sy, 8, 8);
}

function drawControls() {
  drawSmallBtn(minus1, "−1", color(234, 67, 53));
  drawSmallBtn(plus1, "+1", color(52, 168, 83));
  drawSmallBtn(minus10, "−10", color(234, 67, 53));
  drawSmallBtn(plus10, "+10", color(52, 168, 83));
}

function drawSmallBtn(btn, label, col) {
  fill(col);
  noStroke();
  rect(btn.x, btn.y, btn.w, btn.h, 8);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  textStyle(NORMAL);
}

function drawDecompositionLabel(n) {
  var h = floor(n / 100);
  var t = floor((n % 100) / 10);
  var o = n % 10;
  var label = "";
  var parts = [];
  if (h > 0) parts.push(h + " hundred" + (h > 1 ? "s" : ""));
  if (t > 0) parts.push(t + " ten" + (t > 1 ? "s" : ""));
  if (o > 0 || parts.length === 0) parts.push(o + " one" + (o !== 1 ? "s" : ""));
  label = parts.join(" + ") + " = " + n;

  fill(COL_MUTED);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(15);
  text(label, width / 2, BLOCK_AREA_TOP - 16);
}

function drawBlocks(n) {
  var h = floor(n / 100);
  var t = floor((n % 100) / 10);
  var o = n % 10;

  var totalW = h * (UNIT * 10 + 8) + t * (UNIT + 8) + o * (UNIT + 4);
  var startX = max(20, (width - totalW) / 2);
  var baseY = BLOCK_AREA_TOP + 20;

  var x = startX;

  for (var i = 0; i < h; i++) {
    drawHundredBlock(x, baseY);
    x += UNIT * 10 + 10;
  }

  for (var j = 0; j < t; j++) {
    drawTenRod(x, baseY);
    x += UNIT + 10;
  }

  for (var k = 0; k < o; k++) {
    drawOneUnit(x, baseY + UNIT * 9);
    x += UNIT + 5;
  }
}

function drawHundredBlock(x, y) {
  for (var r = 0; r < 10; r++) {
    for (var c = 0; c < 10; c++) {
      var bx = x + c * UNIT;
      var by = y + r * UNIT;
      fill(COL_HUNDREDS);
      stroke(red(COL_HUNDREDS) - 30, green(COL_HUNDREDS) - 30, blue(COL_HUNDREDS) - 30);
      strokeWeight(0.5);
      rect(bx, by, UNIT - 1, UNIT - 1, 2);
    }
  }
  noFill();
  stroke(red(COL_HUNDREDS) - 50, green(COL_HUNDREDS) - 20, 0, 120);
  strokeWeight(2);
  rect(x - 1, y - 1, UNIT * 10 + 1, UNIT * 10 + 1, 3);
}

function drawTenRod(x, y) {
  for (var r = 0; r < 10; r++) {
    var by = y + r * UNIT;
    fill(COL_TENS);
    stroke(red(COL_TENS) - 30, green(COL_TENS) - 30, blue(COL_TENS) - 30);
    strokeWeight(0.5);
    rect(x, by, UNIT - 1, UNIT - 1, 2);
  }
  noFill();
  stroke(0, green(COL_TENS) - 50, 0, 120);
  strokeWeight(2);
  rect(x - 1, y - 1, UNIT + 1, UNIT * 10 + 1, 3);
}

function drawOneUnit(x, y) {
  fill(COL_ONES);
  stroke(red(COL_ONES) - 30, green(COL_ONES) - 30, blue(COL_ONES) - 30);
  strokeWeight(0.5);
  rect(x, y, UNIT - 1, UNIT - 1, 2);
  noFill();
  stroke(0, 0, blue(COL_ONES) - 50, 120);
  strokeWeight(1.5);
  rect(x - 0.5, y - 0.5, UNIT, UNIT, 2);
}

function drawLegend() {
  var ly = height - 45;
  var items = [
    { col: COL_HUNDREDS, label: "Hundreds" },
    { col: COL_TENS, label: "Tens" },
    { col: COL_ONES, label: "Ones" }
  ];
  var totalW = 0;
  textSize(13);
  for (var i = 0; i < items.length; i++) {
    totalW += textWidth(items[i].label) + 30;
  }
  var x = (width - totalW) / 2;

  for (var j = 0; j < items.length; j++) {
    fill(items[j].col);
    noStroke();
    rect(x, ly, 14, 14, 3);
    fill(COL_TEXT);
    textAlign(LEFT, CENTER);
    textSize(13);
    text(items[j].label, x + 20, ly + 7);
    x += textWidth(items[j].label) + 34;
  }
}

function setNumber(n) {
  currentNumber = constrain(n, 0, 999);
}

function insideBtn(btn) {
  return mouseX >= btn.x && mouseX <= btn.x + btn.w &&
         mouseY >= btn.y && mouseY <= btn.y + btn.h;
}

function mousePressed() {
  var knobX = map(currentNumber, 0, 999, slider.x, slider.x + slider.w);
  if (dist(mouseX, mouseY, knobX, slider.y) < 16) {
    slider.dragging = true;
  }
  if (insideBtn(plus1))  setNumber(currentNumber + 1);
  if (insideBtn(minus1)) setNumber(currentNumber - 1);
  if (insideBtn(plus10)) setNumber(currentNumber + 10);
  if (insideBtn(minus10)) setNumber(currentNumber - 10);
}

function mouseDragged() {
  if (slider.dragging) {
    var val = map(mouseX, slider.x, slider.x + slider.w, 0, 999);
    setNumber(round(constrain(val, 0, 999)));
  }
}

function mouseReleased() {
  slider.dragging = false;
}
