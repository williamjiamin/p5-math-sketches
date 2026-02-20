/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score = 0, total = 0, prob = {}, options = [], correctIdx = 0, answered = -1;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); newProblem(); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() {
  answered = -1;
  var type = Math.floor(Math.random() * 4);
  if (type === 0) { prob = { q: "Probability of heads on a fair coin?", ans: "1/2" }; options = ["1/2", "1/3", "1/4"]; }
  else if (type === 1) { var n = Math.floor(Math.random() * 4) + 2; prob = { q: "P(rolling " + n + " on a fair die)?", ans: "1/6" }; options = ["1/6", "1/3", "1/2"]; }
  else if (type === 2) { prob = { q: "P(rolling even on a fair die)?", ans: "1/2" }; options = ["1/2", "1/3", "2/3"]; }
  else { var r = Math.floor(Math.random() * 5) + 3, b = Math.floor(Math.random() * 5) + 1; var t = r + b; prob = { q: r + " red and " + b + " blue marbles. P(red)?", ans: r + "/" + t }; options = [r + "/" + t, b + "/" + t, "1/" + t]; }
  for (var i = options.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = options[i]; options[i] = options[j]; options[j] = tmp; }
  correctIdx = options.indexOf(prob.ans);
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Probability Practice", width / 2, 25); textStyle(NORMAL);
  fill(30, 50, 120); textSize(18); text(prob.q, width / 2, 70);
  var optW = 120, optH = 44, gap = 20, startX = width / 2 - (options.length * optW + (options.length - 1) * gap) / 2;
  for (var i = 0; i < options.length; i++) {
    var ox = startX + i * (optW + gap), oy = 110;
    var hov = mouseX > ox && mouseX < ox + optW && mouseY > oy && mouseY < oy + optH;
    if (answered >= 0) { if (i === correctIdx) fill(60, 200, 100); else if (i === answered) fill(220, 80, 80); else fill(220); }
    else fill(hov ? color(200, 210, 255) : 255);
    stroke(180); strokeWeight(2); rect(ox, oy, optW, optH, 10);
    noStroke(); fill(answered >= 0 && (i === correctIdx || i === answered) ? 255 : 60);
    textSize(18); textStyle(BOLD); text(options[i], ox + optW / 2, oy + optH / 2); textStyle(NORMAL);
  }
  if (answered >= 0) {
    fill(answered === correctIdx ? color(40, 160, 80) : color(220, 60, 60)); textSize(18); textStyle(BOLD);
    text(answered === correctIdx ? "Correct!" : "Answer: " + prob.ans, width / 2, 190); textStyle(NORMAL);
    drawBtn(width / 2 - 40, 215, 80, 30, "Next");
  }
  fill(80); textSize(14); text("Score: " + score + "/" + total, width / 2, height - 25);
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : color(100, 80, 220)); noStroke(); rect(x, y, w, h, 10);
  fill(255); textSize(13); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  if (answered >= 0) { if (hitB(width / 2 - 40, 215, 80, 30)) newProblem(); return; }
  var optW = 120, optH = 44, gap = 20, startX = width / 2 - (options.length * optW + (options.length - 1) * gap) / 2;
  for (var i = 0; i < options.length; i++) {
    var ox = startX + i * (optW + gap);
    if (mouseX > ox && mouseX < ox + optW && mouseY > 110 && mouseY < 154) { answered = i; total++; if (i === correctIdx) score++; }
  }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
