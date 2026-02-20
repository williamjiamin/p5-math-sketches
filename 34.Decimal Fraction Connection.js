/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var val = 0.35;
var gridX, gridY, cellSz;
var animVal = 0.35;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
  updateLayout();
}
function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  updateLayout();
}
function updateLayout() {
  cellSz = Math.min((width - 160) / 10, (height - 200) / 10);
  gridX = width / 2 - cellSz * 5;
  gridY = 100;
}
function draw() {
  background(245, 247, 252);
  animVal = lerp(animVal, val, 0.12);
  noStroke(); fill(60, 40, 120);
  textSize(22); textStyle(BOLD);
  text("Decimals, Fractions & Grids", width / 2, 30);
  textStyle(NORMAL);
  var count = Math.round(animVal * 100);
  var tens = Math.floor(count / 10);
  var ones = count % 10;
  for (var r = 0; r < 10; r++) {
    for (var c = 0; c < 10; c++) {
      var idx = r * 10 + c;
      var x = gridX + c * cellSz, y = gridY + r * cellSz;
      if (idx < tens * 10) {
        fill(80, 60, 200, 180);
      } else if (idx < count) {
        fill(40, 180, 120, 180);
      } else {
        fill(230, 232, 240);
      }
      stroke(255); strokeWeight(1.5);
      rect(x, y, cellSz, cellSz, 2);
    }
  }
  var dispY = gridY + cellSz * 10 + 30;
  noStroke(); fill(60, 40, 120); textSize(18); textStyle(BOLD);
  text("Decimal: " + animVal.toFixed(2), width / 2 - 180, dispY);
  fill(40, 120, 200);
  text("Fraction: " + count + "/100", width / 2, dispY);
  fill(220, 100, 40);
  text("Percent: " + count + "%", width / 2 + 180, dispY);
  textStyle(NORMAL);
  fill(100); textSize(12);
  text(tens + " tenths (purple) + " + ones + " hundredths (green)", width / 2, dispY + 28);
  var btnY = dispY + 55;
  drawBtn(width / 2 - 160, btnY, 60, 36, "-0.10", val > 0.005);
  drawBtn(width / 2 - 90, btnY, 60, 36, "-0.01", val > 0.005);
  drawBtn(width / 2 + 30, btnY, 60, 36, "+0.01", val < 0.995);
  drawBtn(width / 2 + 100, btnY, 60, 36, "+0.10", val < 0.995);
}
function drawBtn(x, y, w, h, label, enabled) {
  var hov = enabled && mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : (enabled ? 255 : 220));
  stroke(150); strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : (enabled ? 60 : 180));
  textSize(14); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2);
  textStyle(NORMAL);
}
function mousePressed() {
  var btnY = gridY + cellSz * 10 + 85;
  if (hitBtn(width / 2 - 160, btnY, 60, 36)) val = Math.max(0, +(val - 0.10).toFixed(2));
  if (hitBtn(width / 2 - 90, btnY, 60, 36)) val = Math.max(0, +(val - 0.01).toFixed(2));
  if (hitBtn(width / 2 + 30, btnY, 60, 36)) val = Math.min(1, +(val + 0.01).toFixed(2));
  if (hitBtn(width / 2 + 100, btnY, 60, 36)) val = Math.min(1, +(val + 0.10).toFixed(2));
}
function hitBtn(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}
