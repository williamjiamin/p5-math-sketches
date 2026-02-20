/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var data = [], score = 0, total = 0, prob = {}, options = [], correctIdx = 0, answered = -1;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); newProblem(); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() {
  answered = -1; data = [];
  for (var i = 0; i < 7; i++) data.push(Math.floor(Math.random() * 20) + 1);
  data.sort(function(a,b){return a-b;});
  var type = Math.floor(Math.random() * 3);
  var sum = 0; for (var j = 0; j < data.length; j++) sum += data[j];
  var mean = Math.round(sum / data.length * 10) / 10;
  var median = data[Math.floor(data.length / 2)];
  var range = data[data.length - 1] - data[0];
  if (type === 0) { prob = { q: "What is the mean?", ans: "" + mean }; }
  else if (type === 1) { prob = { q: "What is the median?", ans: "" + median }; }
  else { prob = { q: "What is the range?", ans: "" + range }; }
  var w1 = "" + (parseFloat(prob.ans) + Math.floor(Math.random() * 3) + 1);
  var w2 = "" + Math.max(0, parseFloat(prob.ans) - Math.floor(Math.random() * 3) - 1);
  options = [prob.ans, w1, w2];
  for (var k = options.length - 1; k > 0; k--) { var l = Math.floor(Math.random() * (k + 1)); var t = options[k]; options[k] = options[l]; options[l] = t; }
  correctIdx = options.indexOf(prob.ans);
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Statistics Practice", width / 2, 25); textStyle(NORMAL);
  fill(80); textSize(14); text("Data: [" + data.join(", ") + "]", width / 2, 55);
  fill(30, 50, 120); textSize(18); text(prob.q, width / 2, 85);
  var optW = 120, optH = 42, gap = 20, startX = width / 2 - (options.length * optW + (options.length - 1) * gap) / 2;
  for (var i = 0; i < options.length; i++) {
    var ox = startX + i * (optW + gap), oy = 120;
    var hov = mouseX > ox && mouseX < ox + optW && mouseY > oy && mouseY < oy + optH;
    if (answered >= 0) { if (i === correctIdx) fill(60, 200, 100); else if (i === answered) fill(220, 80, 80); else fill(220); }
    else fill(hov ? color(200, 210, 255) : 255);
    stroke(180); strokeWeight(2); rect(ox, oy, optW, optH, 10);
    noStroke(); fill(answered >= 0 && (i === correctIdx || i === answered) ? 255 : 60);
    textSize(18); textStyle(BOLD); text(options[i], ox + optW / 2, oy + optH / 2); textStyle(NORMAL);
  }
  if (answered >= 0) {
    fill(answered === correctIdx ? color(40, 160, 80) : color(220, 60, 60)); textSize(16); textStyle(BOLD);
    text(answered === correctIdx ? "Correct!" : "Answer: " + prob.ans, width / 2, 195); textStyle(NORMAL);
    drawBtn(width / 2 - 40, 220, 80, 30, "Next");
  }
  fill(80); textSize(14); text("Score: " + score + "/" + total, width / 2, height - 25);
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : color(100, 80, 220)); noStroke(); rect(x, y, w, h, 10);
  fill(255); textSize(13); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  if (answered >= 0) { if (hitB(width / 2 - 40, 220, 80, 30)) newProblem(); return; }
  var optW = 120, optH = 42, gap = 20, startX = width / 2 - (options.length * optW + (options.length - 1) * gap) / 2;
  for (var i = 0; i < options.length; i++) {
    var ox = startX + i * (optW + gap);
    if (mouseX > ox && mouseX < ox + optW && mouseY > 120 && mouseY < 162) { answered = i; total++; if (i === correctIdx) score++; }
  }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
