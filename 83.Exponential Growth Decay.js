/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var base = 2, isGrowth = true, cellPx = 20;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Exponential Growth & Decay", width / 2, 25); textStyle(NORMAL);
  var b = isGrowth ? base : 1 / base;
  fill(80, 60, 200); textSize(18); textStyle(BOLD);
  text("y = " + b.toFixed(2) + "^x" + (isGrowth ? " (Growth)" : " (Decay)"), width / 2, 55); textStyle(NORMAL);
  cellPx = Math.min(20, (width - 80) / 20);
  var ox = width / 2, oy = height / 2 + 40;
  stroke(230); strokeWeight(1);
  for (var i = -10; i <= 10; i++) { line(ox + i * cellPx, oy - 10 * cellPx, ox + i * cellPx, oy + 4 * cellPx); line(ox - 10 * cellPx, oy + i * cellPx, ox + 10 * cellPx, oy + i * cellPx); }
  stroke(80); strokeWeight(2); line(ox - 10 * cellPx, oy, ox + 10 * cellPx, oy); line(ox, oy - 10 * cellPx, ox, oy + 4 * cellPx);
  stroke(220, 60, 60); strokeWeight(2.5); noFill();
  beginShape();
  for (var x = -10; x <= 10; x += 0.1) { var y = Math.pow(b, x); if (y < 12 && y > -1) vertex(ox + x * cellPx, oy - y * cellPx); }
  endShape();
  stroke(100, 100, 200, 100); strokeWeight(1.5);
  var lx1 = -10, lx2 = 10;
  line(ox + lx1 * cellPx, oy - (lx1 + 1) * cellPx, ox + lx2 * cellPx, oy - (lx2 + 1) * cellPx);
  noStroke(); fill(100); textSize(11); text("(linear y=x+1 for comparison)", width / 2, oy + 5 * cellPx);
  fill(40, 160, 80); ellipse(ox, oy - cellPx, 8);
  fill(40, 160, 80); textSize(10); text("(0,1)", ox + 15, oy - cellPx);
  var btnY = height - 50;
  drawBtn(width / 2 - 130, btnY, 60, 26, "Base -");
  drawBtn(width / 2 - 60, btnY, 60, 26, "Base +");
  drawBtn(width / 2 + 20, btnY, 70, 26, "Growth", isGrowth);
  drawBtn(width / 2 + 100, btnY, 70, 26, "Decay", !isGrowth);
  noStroke(); fill(80); textSize(12); text("Base: " + base, width / 2 - 95, btnY - 10);
}
function drawBtn(x, y, w, h, label, active) { var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; fill(active ? color(80, 60, 200) : (hov ? color(200, 210, 255) : 255)); stroke(180); strokeWeight(1); rect(x, y, w, h, 6); noStroke(); fill(active ? 255 : 60); textSize(11); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL); }
function mousePressed() {
  var btnY = height - 50;
  if (hitB(width / 2 - 130, btnY, 60, 26)) base = Math.max(1.1, +(base - 0.5).toFixed(1));
  if (hitB(width / 2 - 60, btnY, 60, 26)) base = Math.min(5, +(base + 0.5).toFixed(1));
  if (hitB(width / 2 + 20, btnY, 70, 26)) isGrowth = true;
  if (hitB(width / 2 + 100, btnY, 70, 26)) isGrowth = false;
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
