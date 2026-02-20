/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var base = 2, cellPx = 20;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Logarithm as Inverse", width / 2, 25); textStyle(NORMAL);
  fill(100); textSize(14); text("log_" + base + "(x) is the inverse of " + base + "^x — they are mirror images over y = x", width / 2, 55);
  cellPx = Math.min(20, (width - 80) / 20);
  var ox = width / 2, oy = height / 2 + 10;
  stroke(230); strokeWeight(1);
  for (var i = -10; i <= 10; i++) { line(ox + i * cellPx, oy - 10 * cellPx, ox + i * cellPx, oy + 10 * cellPx); line(ox - 10 * cellPx, oy + i * cellPx, ox + 10 * cellPx, oy + i * cellPx); }
  stroke(80); strokeWeight(2); line(ox - 10 * cellPx, oy, ox + 10 * cellPx, oy); line(ox, oy - 10 * cellPx, ox, oy + 10 * cellPx);
  stroke(180); strokeWeight(1); drawingContext.setLineDash([6, 4]);
  line(ox - 10 * cellPx, oy + 10 * cellPx, ox + 10 * cellPx, oy - 10 * cellPx);
  drawingContext.setLineDash([]); noStroke(); fill(180); textSize(10); text("y = x", ox + 8 * cellPx, oy - 8 * cellPx - 8);
  stroke(80, 60, 200); strokeWeight(2.5); noFill();
  beginShape();
  for (var x = -8; x <= 8; x += 0.1) { var y = Math.pow(base, x); if (y < 10) vertex(ox + x * cellPx, oy - y * cellPx); }
  endShape();
  stroke(220, 100, 40); strokeWeight(2.5); noFill();
  beginShape();
  for (var x2 = 0.05; x2 <= 10; x2 += 0.05) { var y2 = Math.log(x2) / Math.log(base); if (Math.abs(y2) < 10) vertex(ox + x2 * cellPx, oy - y2 * cellPx); }
  endShape();
  noStroke(); fill(80, 60, 200); textSize(12); textStyle(BOLD); text(base + "^x", ox + 6 * cellPx, oy - 8 * cellPx);
  fill(220, 100, 40); text("log_" + base + "(x)", ox + 8 * cellPx, oy - 2 * cellPx); textStyle(NORMAL);
  fill(40, 160, 80); ellipse(ox, oy - cellPx, 8); ellipse(ox + cellPx, oy, 8);
  var btnY = height - 45;
  drawBtn(width / 2 - 80, btnY, 60, 26, "Base -"); drawBtn(width / 2 + 20, btnY, 60, 26, "Base +");
  noStroke(); fill(80); textSize(12); text("Base: " + base, width / 2, btnY - 10);
}
function drawBtn(x, y, w, h, label) { var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6); noStroke(); fill(hov ? 255 : 60); textSize(11); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL); }
function mousePressed() {
  var btnY = height - 45;
  if (hitB(width / 2 - 80, btnY, 60, 26)) base = Math.max(1.5, +(base - 0.5).toFixed(1));
  if (hitB(width / 2 + 20, btnY, 60, 26)) base = Math.min(10, +(base + 0.5).toFixed(1));
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
