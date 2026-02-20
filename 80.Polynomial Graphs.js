/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var degree = 3, coeffs = [1, 0, -3, 0], cellPx = 20;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function evalPoly(x) { var y = 0; for (var i = 0; i <= degree; i++) y += (coeffs[i] || 0) * Math.pow(x, degree - i); return y; }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Polynomial Graphs", width / 2, 25); textStyle(NORMAL);
  var eq = ""; for (var i = 0; i <= degree; i++) { var c = coeffs[i] || 0; var p = degree - i; if (c === 0) continue; if (eq && c > 0) eq += " + "; if (c < 0) eq += " − "; var ac = Math.abs(c); if (p === 0) eq += ac; else if (p === 1) eq += (ac === 1 ? "" : ac) + "x"; else eq += (ac === 1 ? "" : ac) + "x^" + p; }
  fill(80, 60, 200); textSize(16); textStyle(BOLD); text("y = " + (eq || "0"), width / 2, 55); textStyle(NORMAL);
  fill(100); textSize(12); text("Degree: " + degree + "  |  Leading coeff: " + (coeffs[0] || 1), width / 2, 78);
  cellPx = Math.min(20, (width - 80) / 20);
  var ox = width / 2, oy = height / 2 + 20;
  stroke(230); strokeWeight(1);
  for (var g = -10; g <= 10; g++) { line(ox + g * cellPx, oy - 10 * cellPx, ox + g * cellPx, oy + 10 * cellPx); line(ox - 10 * cellPx, oy + g * cellPx, ox + 10 * cellPx, oy + g * cellPx); }
  stroke(80); strokeWeight(2); line(ox - 10 * cellPx, oy, ox + 10 * cellPx, oy); line(ox, oy - 10 * cellPx, ox, oy + 10 * cellPx);
  stroke(220, 60, 60); strokeWeight(2.5); noFill();
  beginShape();
  for (var x = -10; x <= 10; x += 0.05) { var y = evalPoly(x); if (Math.abs(y) < 15) vertex(ox + x * cellPx, oy - y * cellPx); }
  endShape();
  var btnY = height - 45;
  drawBtn(width / 2 - 160, btnY, 60, 26, "Deg " + Math.max(1, degree - 1));
  drawBtn(width / 2 - 90, btnY, 60, 26, "Deg " + Math.min(5, degree + 1));
  drawBtn(width / 2 - 10, btnY, 80, 26, "Random");
  drawBtn(width / 2 + 80, btnY, 80, 26, "Flip Lead");
}
function drawBtn(x, y, w, h, label) { var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6); noStroke(); fill(hov ? 255 : 60); textSize(10); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL); }
function mousePressed() {
  var btnY = height - 45;
  if (hitB(width / 2 - 160, btnY, 60, 26)) { degree = Math.max(1, degree - 1); randomCoeffs(); }
  if (hitB(width / 2 - 90, btnY, 60, 26)) { degree = Math.min(5, degree + 1); randomCoeffs(); }
  if (hitB(width / 2 - 10, btnY, 80, 26)) randomCoeffs();
  if (hitB(width / 2 + 80, btnY, 80, 26)) coeffs[0] = -coeffs[0];
}
function randomCoeffs() { coeffs = []; for (var i = 0; i <= degree; i++) coeffs.push(Math.floor(Math.random() * 5) - 2); if (coeffs[0] === 0) coeffs[0] = 1; }
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
