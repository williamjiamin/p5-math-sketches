/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score = 0, total = 0, prob = {}, options = [], correctIdx = 0, answered = -1;
function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER); newProblem();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() {
  answered = -1;
  var a = Math.floor(Math.random() * 5) + 1, b = Math.floor(Math.random() * 10) + 1;
  var x = Math.floor(Math.random() * 15) + 1;
  var rhs = a * x + b;
  var ops = [">", "<", "≥", "≤"];
  var op = ops[Math.floor(Math.random() * 4)];
  prob = { text: a + "x + " + b + " " + op + " " + rhs, ans: "x " + op + " " + x };
  if (a === 1) prob.text = "x + " + b + " " + op + " " + rhs;
  var w1 = "x " + ops[(ops.indexOf(op) + 1) % 4] + " " + x;
  var w2 = "x " + op + " " + (x + 2);
  options = [prob.ans, w1, w2];
  for (var i = options.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = options[i]; options[i] = options[j]; options[j] = t; }
  correctIdx = options.indexOf(prob.ans);
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Inequality Practice", width / 2, 25); textStyle(NORMAL);
  fill(30, 50, 120); textSize(22); text("Solve: " + prob.text, width / 2, 75);
  var optW = 150, optH = 45, gap = 20;
  var startX = width / 2 - (options.length * optW + (options.length - 1) * gap) / 2;
  for (var i = 0; i < options.length; i++) {
    var ox = startX + i * (optW + gap), optY = 130;
    var hov = mouseX > ox && mouseX < ox + optW && mouseY > optY && mouseY < optY + optH;
    if (answered >= 0) {
      if (i === correctIdx) fill(60, 200, 100);
      else if (i === answered) fill(220, 80, 80);
      else fill(220);
    } else fill(hov ? color(200, 210, 255) : 255);
    stroke(180); strokeWeight(2); rect(ox, optY, optW, optH, 12);
    noStroke(); fill(answered >= 0 && (i === correctIdx || i === answered) ? 255 : 60);
    textSize(18); textStyle(BOLD); text(options[i], ox + optW / 2, optY + optH / 2); textStyle(NORMAL);
  }
  if (answered >= 0) {
    fill(answered === correctIdx ? color(40, 160, 80) : color(220, 60, 60));
    textSize(18); textStyle(BOLD);
    text(answered === correctIdx ? "Correct!" : "Answer: " + prob.ans, width / 2, 210); textStyle(NORMAL);
    drawBtn(width / 2 - 40, 240, 80, 32, "Next");
  }
  fill(80); textSize(14); text("Score: " + score + "/" + total, width / 2, height - 30);
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : color(100, 80, 220)); noStroke();
  rect(x, y, w, h, 10); fill(255); textSize(14); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  if (answered >= 0) { if (hitB(width / 2 - 40, 240, 80, 32)) newProblem(); return; }
  var optW = 150, optH = 45, gap = 20;
  var startX = width / 2 - (options.length * optW + (options.length - 1) * gap) / 2;
  for (var i = 0; i < options.length; i++) {
    var ox = startX + i * (optW + gap);
    if (mouseX > ox && mouseX < ox + optW && mouseY > 130 && mouseY < 175) {
      answered = i; total++; if (i === correctIdx) score++;
    }
  }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
