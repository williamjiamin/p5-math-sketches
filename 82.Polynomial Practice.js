/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score = 0, total = 0, prob = {}, options = [], correctIdx = 0, answered = -1;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); newProblem(); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() {
  answered = -1;
  var d = Math.floor(Math.random() * 3) + 2;
  var coeffs = []; for (var i = 0; i <= d; i++) coeffs.push(Math.floor(Math.random() * 5) - 2);
  if (coeffs[0] === 0) coeffs[0] = 1;
  prob = { degree: d, coeffs: coeffs, q: "What is the degree of this polynomial?" };
  options = ["" + d, "" + (d + 1), "" + (d - 1)];
  for (var j = options.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var t = options[j]; options[j] = options[k]; options[k] = t; }
  correctIdx = options.indexOf("" + d);
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Polynomial Practice", width / 2, 25); textStyle(NORMAL);
  var eq = ""; for (var i = 0; i <= prob.degree; i++) { var c = prob.coeffs[i], p = prob.degree - i; if (c === 0 && p > 0) continue; if (eq && c > 0) eq += "+"; eq += c + (p > 1 ? "x^" + p : (p === 1 ? "x" : "")); }
  fill(80, 60, 200); textSize(18); textStyle(BOLD); text("f(x) = " + eq, width / 2, 65); textStyle(NORMAL);
  fill(30, 50, 120); textSize(16); text(prob.q, width / 2, 95);
  var optW = 100, optH = 40, gap = 20, startX = width / 2 - (options.length * optW + (options.length - 1) * gap) / 2;
  for (var j = 0; j < options.length; j++) {
    var ox = startX + j * (optW + gap), oy = 125;
    if (answered >= 0) { if (j === correctIdx) fill(60, 200, 100); else if (j === answered) fill(220, 80, 80); else fill(220); }
    else fill(mouseX > ox && mouseX < ox + optW && mouseY > oy && mouseY < oy + optH ? color(200, 210, 255) : 255);
    stroke(180); strokeWeight(2); rect(ox, oy, optW, optH, 10);
    noStroke(); fill(60); textSize(18); textStyle(BOLD); text(options[j], ox + optW / 2, oy + optH / 2); textStyle(NORMAL);
  }
  if (answered >= 0) drawBtn(width / 2 - 40, 200, 80, 30, "Next");
  fill(80); textSize(14); text("Score: " + score + "/" + total, width / 2, height - 25);
}
function drawBtn(x, y, w, h, label) { fill(color(80, 60, 200)); noStroke(); rect(x, y, w, h, 10); fill(255); textSize(13); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL); }
function mousePressed() {
  if (answered >= 0) { if (hitB(width / 2 - 40, 200, 80, 30)) newProblem(); return; }
  var optW = 100, optH = 40, gap = 20, startX = width / 2 - (options.length * optW + (options.length - 1) * gap) / 2;
  for (var j = 0; j < options.length; j++) { var ox = startX + j * (optW + gap); if (mouseX > ox && mouseX < ox + optW && mouseY > 125 && mouseY < 165) { answered = j; total++; if (j === correctIdx) score++; } }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
