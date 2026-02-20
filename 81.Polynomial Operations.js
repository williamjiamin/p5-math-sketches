/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var polyA = [1, 2, -1], polyB = [2, -1, 3], op = "add";
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function polyStr(p) { var s = ""; for (var i = 0; i < p.length; i++) { var c = p[i], d = p.length - 1 - i; if (c === 0) continue; if (s && c > 0) s += " + "; if (c < 0) s += " − "; var ac = Math.abs(c); if (d === 0) s += ac; else if (d === 1) s += (ac === 1 ? "" : ac) + "x"; else s += (ac === 1 ? "" : ac) + "x²"; } return s || "0"; }
function addPoly(a, b) { var len = Math.max(a.length, b.length); var r = []; for (var i = 0; i < len; i++) { var ai = i < a.length ? a[a.length - 1 - i] : 0; var bi = i < b.length ? b[b.length - 1 - i] : 0; r.unshift(ai + bi); } return r; }
function subPoly(a, b) { var nb = b.map(function(x) { return -x; }); return addPoly(a, nb); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Polynomial Operations", width / 2, 25); textStyle(NORMAL);
  fill(80, 60, 200); textSize(16); textStyle(BOLD); text("A(x) = " + polyStr(polyA), width / 2, 60);
  fill(220, 100, 40); text("B(x) = " + polyStr(polyB), width / 2, 85); textStyle(NORMAL);
  var result = op === "add" ? addPoly(polyA, polyB) : subPoly(polyA, polyB);
  fill(40, 160, 80); textSize(18); textStyle(BOLD);
  text("A " + (op === "add" ? "+" : "−") + " B = " + polyStr(result), width / 2, 130); textStyle(NORMAL);
  var cellPx = 18, ox = width / 2, oy = 340;
  stroke(230); strokeWeight(1);
  for (var i = -8; i <= 8; i++) { line(ox + i * cellPx, oy - 8 * cellPx, ox + i * cellPx, oy + 4 * cellPx); line(ox - 8 * cellPx, oy + i * cellPx, ox + 8 * cellPx, oy + i * cellPx); }
  stroke(80); strokeWeight(2); line(ox - 8 * cellPx, oy, ox + 8 * cellPx, oy); line(ox, oy - 8 * cellPx, ox, oy + 4 * cellPx);
  drawCurve(ox, oy, cellPx, polyA, color(80, 60, 200, 150));
  drawCurve(ox, oy, cellPx, polyB, color(220, 100, 40, 150));
  drawCurve(ox, oy, cellPx, result, color(40, 160, 80));
  var btnY = height - 50;
  drawBtn(width / 2 - 90, btnY, 80, 28, "Add", op === "add");
  drawBtn(width / 2 + 10, btnY, 80, 28, "Subtract", op === "sub");
  drawBtn(width / 2 + 110, btnY, 80, 28, "Random");
}
function drawCurve(ox, oy, cp, poly, col) {
  stroke(col); strokeWeight(2); noFill(); beginShape();
  for (var x = -8; x <= 8; x += 0.1) { var y = 0; for (var i = 0; i < poly.length; i++) y += poly[i] * Math.pow(x, poly.length - 1 - i); if (Math.abs(y) < 10) vertex(ox + x * cp, oy - y * cp); }
  endShape();
}
function drawBtn(x, y, w, h, label, active) { var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; fill(active ? color(80, 60, 200) : (hov ? color(200, 210, 255) : 255)); stroke(180); strokeWeight(1); rect(x, y, w, h, 6); noStroke(); fill(active ? 255 : 60); textSize(11); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL); }
function mousePressed() {
  var btnY = height - 50;
  if (hitB(width / 2 - 90, btnY, 80, 28)) op = "add";
  if (hitB(width / 2 + 10, btnY, 80, 28)) op = "sub";
  if (hitB(width / 2 + 110, btnY, 80, 28)) { polyA = [rI(), rI(), rI()]; polyB = [rI(), rI(), rI()]; }
}
function rI() { return Math.floor(Math.random() * 7) - 3; }
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
