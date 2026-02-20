/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var m1 = 1, b1 = 0, m2 = -0.5, b2 = 3, cellPx = 25;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Linear Systems", width / 2, 25); textStyle(NORMAL);
  cellPx = Math.min(25, (width - 80) / 20);
  var ox = width / 2, oy = height / 2 - 10;
  stroke(230); strokeWeight(1);
  for (var i = -10; i <= 10; i++) { line(ox + i * cellPx, oy - 10 * cellPx, ox + i * cellPx, oy + 10 * cellPx); line(ox - 10 * cellPx, oy + i * cellPx, ox + 10 * cellPx, oy + i * cellPx); }
  stroke(80); strokeWeight(2); line(ox - 10 * cellPx, oy, ox + 10 * cellPx, oy); line(ox, oy - 10 * cellPx, ox, oy + 10 * cellPx);
  stroke(80, 60, 200); strokeWeight(3);
  drawLine(ox, oy, m1, b1);
  stroke(220, 100, 40); strokeWeight(3);
  drawLine(ox, oy, m2, b2);
  var parallel = Math.abs(m1 - m2) < 0.001;
  var same = parallel && Math.abs(b1 - b2) < 0.001;
  if (!parallel) {
    var ix = (b2 - b1) / (m1 - m2), iy = m1 * ix + b1;
    fill(220, 60, 60); noStroke(); ellipse(ox + ix * cellPx, oy - iy * cellPx, 14);
    fill(220, 60, 60); textSize(12); textStyle(BOLD);
    text("(" + ix.toFixed(1) + ", " + iy.toFixed(1) + ")", ox + ix * cellPx + 30, oy - iy * cellPx - 10); textStyle(NORMAL);
  }
  noStroke(); fill(80, 60, 200); textSize(14); textStyle(BOLD);
  text("y = " + m1 + "x + " + b1, width / 2 - 140, 55);
  fill(220, 100, 40); text("y = " + m2 + "x + " + b2, width / 2 + 140, 55); textStyle(NORMAL);
  fill(same ? color(40, 160, 80) : (parallel ? color(220, 60, 60) : color(40, 160, 80)));
  textSize(16); textStyle(BOLD);
  text(same ? "Infinite solutions (same line)" : (parallel ? "No solution (parallel)" : "One solution (intersection)"), width / 2, 78); textStyle(NORMAL);
  var btnY = height - 45;
  drawBtn(width / 2 - 200, btnY, 38, 24, "m1-"); drawBtn(width / 2 - 155, btnY, 38, 24, "m1+");
  drawBtn(width / 2 - 100, btnY, 38, 24, "b1-"); drawBtn(width / 2 - 55, btnY, 38, 24, "b1+");
  drawBtn(width / 2 + 20, btnY, 38, 24, "m2-"); drawBtn(width / 2 + 65, btnY, 38, 24, "m2+");
  drawBtn(width / 2 + 120, btnY, 38, 24, "b2-"); drawBtn(width / 2 + 165, btnY, 38, 24, "b2+");
}
function drawLine(ox, oy, m, b) { var x1 = -12, x2 = 12; line(ox + x1 * cellPx, oy - (m * x1 + b) * cellPx, ox + x2 * cellPx, oy - (m * x2 + b) * cellPx); }
function drawBtn(x, y, w, h, label) { var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 5); noStroke(); fill(hov ? 255 : 60); textSize(10); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL); }
function mousePressed() {
  var btnY = height - 45;
  if (hitB(width / 2 - 200, btnY, 38, 24)) m1 = +(m1 - 0.5).toFixed(1);
  if (hitB(width / 2 - 155, btnY, 38, 24)) m1 = +(m1 + 0.5).toFixed(1);
  if (hitB(width / 2 - 100, btnY, 38, 24)) b1--;
  if (hitB(width / 2 - 55, btnY, 38, 24)) b1++;
  if (hitB(width / 2 + 20, btnY, 38, 24)) m2 = +(m2 - 0.5).toFixed(1);
  if (hitB(width / 2 + 65, btnY, 38, 24)) m2 = +(m2 + 0.5).toFixed(1);
  if (hitB(width / 2 + 120, btnY, 38, 24)) b2--;
  if (hitB(width / 2 + 165, btnY, 38, 24)) b2++;
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
