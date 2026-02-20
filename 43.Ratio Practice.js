/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score = 0, total = 0, streak = 0;
var question = "", correctAns = "", options = [], answered = -1, correctIdx = 0;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
  newProblem();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() {
  answered = -1;
  var type = Math.floor(Math.random() * 3);
  if (type === 0) {
    var a = Math.floor(Math.random() * 8) + 2, b = Math.floor(Math.random() * 8) + 2;
    var g = gcd(a, b);
    question = "Simplify the ratio " + a + ":" + b;
    correctAns = (a / g) + ":" + (b / g);
    var w1 = a + ":" + (b + 1), w2 = (a + 1) + ":" + b;
    options = [correctAns, w1, w2];
  } else if (type === 1) {
    var a2 = Math.floor(Math.random() * 5) + 1, b2 = Math.floor(Math.random() * 5) + 1;
    var m = Math.floor(Math.random() * 4) + 2;
    question = "Find equivalent: " + a2 + ":" + b2 + " = " + (a2 * m) + ":?";
    correctAns = "" + (b2 * m);
    var w3 = "" + (b2 * m + 1), w4 = "" + (b2 * (m + 1));
    options = [correctAns, w3, w4];
  } else {
    var a3 = Math.floor(Math.random() * 6) + 2, b3 = Math.floor(Math.random() * 6) + 2;
    var c3 = Math.floor(Math.random() * 6) + 2;
    var d3 = Math.round(b3 * c3 / a3 * 10) / 10;
    if (d3 === Math.round(d3)) {
      question = a3 + "/" + b3 + " = " + c3 + "/x. Find x.";
      correctAns = "" + Math.round(d3);
      options = [correctAns, "" + (Math.round(d3) + 1), "" + (Math.round(d3) - 1)];
    } else { newProblem(); return; }
  }
  for (var i = options.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = options[i]; options[i] = options[j]; options[j] = t;
  }
  correctIdx = options.indexOf(correctAns);
}
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Ratio & Proportion Practice", width / 2, 25); textStyle(NORMAL);
  fill(30, 50, 120); textSize(20);
  text(question, width / 2, 80);
  var optW = 140, optH = 48, gap = 20;
  var startX = width / 2 - (options.length * optW + (options.length - 1) * gap) / 2;
  var optY = 140;
  for (var i = 0; i < options.length; i++) {
    var ox = startX + i * (optW + gap);
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
    textSize(20); textStyle(BOLD);
    text(answered === correctIdx ? "Correct!" : "Answer: " + correctAns, width / 2, 230);
    textStyle(NORMAL);
    drawBtnC(width / 2, 280, 100, 36, "Next");
  }
  fill(80); textSize(14);
  text("Score: " + score + "/" + total + "  |  Streak: " + streak, width / 2, height - 30);
}
function drawBtnC(cx, cy, w, h, label) {
  var hov = mouseX > cx - w / 2 && mouseX < cx + w / 2 && mouseY > cy - h / 2 && mouseY < cy + h / 2;
  fill(hov ? color(80, 60, 200) : color(100, 80, 220)); noStroke();
  rect(cx - w / 2, cy - h / 2, w, h, 10);
  fill(255); textSize(14); textStyle(BOLD); text(label, cx, cy); textStyle(NORMAL);
}
function mousePressed() {
  if (answered >= 0) {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > 262 && mouseY < 298) newProblem();
    return;
  }
  var optW = 140, optH = 48, gap = 20;
  var startX = width / 2 - (options.length * optW + (options.length - 1) * gap) / 2;
  for (var i = 0; i < options.length; i++) {
    var ox = startX + i * (optW + gap);
    if (mouseX > ox && mouseX < ox + optW && mouseY > 140 && mouseY < 188) {
      answered = i; total++;
      if (i === correctIdx) { score++; streak++; } else streak = 0;
    }
  }
}
