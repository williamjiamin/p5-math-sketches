/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var a = 1, b = 6, c = 5, step = 0;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Completing the Square", width / 2, 25); textStyle(NORMAL);
  fill(30, 50, 120); textSize(18); text("x² + " + b + "x + " + c + " = 0", width / 2, 60);
  var stepTexts = [
    "Step 1: Move constant: x² + " + b + "x = " + (-c),
    "Step 2: Half of " + b + " is " + (b/2) + ", square it: " + (b*b/4),
    "Step 3: Add to both sides: x² + " + b + "x + " + (b*b/4) + " = " + (-c + b*b/4),
    "Step 4: Factor: (x + " + (b/2) + ")² = " + (-c + b*b/4),
    "Step 5: Solve: x = " + (-b/2) + " ± √" + (-c + b*b/4)
  ];
  for (var i = 0; i <= step && i < stepTexts.length; i++) {
    fill(i === step ? color(80, 60, 200) : color(100)); textSize(14); textStyle(i === step ? BOLD : NORMAL);
    text(stepTexts[i], width / 2, 110 + i * 35);
  }
  textStyle(NORMAL);
  var h = b / 2, k = c - b * b / 4;
  if (step >= 4) {
    var sq = -c + b * b / 4;
    if (sq >= 0) {
      var r1 = -h + Math.sqrt(sq), r2 = -h - Math.sqrt(sq);
      fill(40, 160, 80); textSize(18); textStyle(BOLD);
      text("x = " + r1.toFixed(2) + " or x = " + r2.toFixed(2), width / 2, 300); textStyle(NORMAL);
    } else { fill(220, 60, 60); textSize(16); text("No real solutions (negative under √)", width / 2, 300); }
  }
  var sz = Math.min(15, (width - 200) / Math.max(b + 2, 8));
  var gx = width / 2 - (b + 2) * sz / 2, gy = 340;
  fill(80, 60, 200, 80); noStroke();
  rect(gx, gy, b * sz / 2, b * sz / 2);
  fill(220, 100, 40, 60);
  rect(gx + b * sz / 2, gy, b * sz / 2, b * sz / 4);
  rect(gx, gy + b * sz / 2, b * sz / 4, b * sz / 2);
  if (step >= 2) { fill(40, 180, 120, 60); rect(gx + b * sz / 2, gy + b * sz / 2, b * sz / 4, b * sz / 4); }
  noStroke(); fill(80); textSize(10); text("x²", gx + b * sz / 4, gy + b * sz / 4);
  var btnY = height - 50;
  drawBtn(width / 2 - 110, btnY, 90, 30, step < 4 ? "Next Step" : "Done");
  drawBtn(width / 2 + 20, btnY, 90, 30, "New Problem");
}
function drawBtn(x, y, w, h, label) { var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8); noStroke(); fill(hov ? 255 : 60); textSize(12); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL); }
function mousePressed() {
  var btnY = height - 50;
  if (hitB(width / 2 - 110, btnY, 90, 30) && step < 4) step++;
  if (hitB(width / 2 + 20, btnY, 90, 30)) { b = Math.floor(Math.random() * 8) + 2; if (b % 2 !== 0) b++; c = Math.floor(Math.random() * 10) + 1; step = 0; }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
