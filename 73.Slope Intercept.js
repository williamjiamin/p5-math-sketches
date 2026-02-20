/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var m = 1, b = 0, cellPx = 25;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Slope-Intercept Form", width / 2, 25); textStyle(NORMAL);
  fill(80, 60, 200); textSize(20); textStyle(BOLD);
  text("y = " + (m === 1 ? "" : (m === -1 ? "-" : m)) + "x" + (b >= 0 ? " + " + b : " − " + Math.abs(b)), width / 2, 55); textStyle(NORMAL);
  cellPx = Math.min(25, (width - 80) / 20);
  var ox = width / 2, oy = height / 2;
  stroke(230); strokeWeight(1);
  for (var i = -10; i <= 10; i++) { line(ox + i * cellPx, oy - 10 * cellPx, ox + i * cellPx, oy + 10 * cellPx); line(ox - 10 * cellPx, oy + i * cellPx, ox + 10 * cellPx, oy + i * cellPx); }
  stroke(80); strokeWeight(2); line(ox - 10 * cellPx, oy, ox + 10 * cellPx, oy); line(ox, oy - 10 * cellPx, ox, oy + 10 * cellPx);
  for (var j = -10; j <= 10; j += 2) { noStroke(); fill(80); textSize(9); if (j !== 0) { text(j, ox + j * cellPx, oy + 12); text(j, ox - 14, oy - j * cellPx); } }
  stroke(220, 60, 60); strokeWeight(3);
  var x1 = -12, y1 = m * x1 + b, x2 = 12, y2 = m * x2 + b;
  line(ox + x1 * cellPx, oy - y1 * cellPx, ox + x2 * cellPx, oy - y2 * cellPx);
  fill(40, 160, 80); noStroke(); ellipse(ox, oy - b * cellPx, 12);
  fill(40, 160, 80); textSize(11); textStyle(BOLD); text("(0, " + b + ")", ox + 20, oy - b * cellPx); textStyle(NORMAL);
  if (m !== 0) {
    var rx = 3; var ry = m * rx + b;
    stroke(220, 160, 40); strokeWeight(2);
    drawingContext.setLineDash([4, 4]);
    line(ox, oy - b * cellPx, ox + rx * cellPx, oy - b * cellPx);
    line(ox + rx * cellPx, oy - b * cellPx, ox + rx * cellPx, oy - ry * cellPx);
    drawingContext.setLineDash([]);
    noStroke(); fill(220, 160, 40); textSize(10); textStyle(BOLD);
    text("run=" + rx, ox + rx * cellPx / 2, oy - b * cellPx + 12);
    text("rise=" + (m * rx), ox + rx * cellPx + 20, oy - (b + m * rx / 2) * cellPx); textStyle(NORMAL);
  }
  var btnY = height - 50;
  noStroke(); fill(80); textSize(12); text("m (slope)=" + m, width / 2 - 100, btnY - 10); text("b (intercept)=" + b, width / 2 + 100, btnY - 10);
  drawBtn(width / 2 - 150, btnY, 35, 26, "m-"); drawBtn(width / 2 - 65, btnY, 35, 26, "m+");
  drawBtn(width / 2 + 50, btnY, 35, 26, "b-"); drawBtn(width / 2 + 135, btnY, 35, 26, "b+");
}
function drawBtn(x, y, w, h, label) { var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6); noStroke(); fill(hov ? 255 : 60); textSize(12); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL); }
function mousePressed() {
  var btnY = height - 50;
  if (hitB(width / 2 - 150, btnY, 35, 26)) m = Math.max(-5, +(m - 0.5).toFixed(1));
  if (hitB(width / 2 - 65, btnY, 35, 26)) m = Math.min(5, +(m + 0.5).toFixed(1));
  if (hitB(width / 2 + 50, btnY, 35, 26)) b = Math.max(-8, b - 1);
  if (hitB(width / 2 + 135, btnY, 35, 26)) b = Math.min(8, b + 1);
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
