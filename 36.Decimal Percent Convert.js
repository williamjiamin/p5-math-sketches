/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score = 0, total = 0, streak = 0;
var question = {}, options = [], correctIdx = 0, answered = -1;
var feedback = "", feedbackTimer = 0;
var COMMON = [
  { d: 0.5, f: "1/2", p: "50%" }, { d: 0.25, f: "1/4", p: "25%" }, { d: 0.75, f: "3/4", p: "75%" },
  { d: 0.1, f: "1/10", p: "10%" }, { d: 0.2, f: "1/5", p: "20%" }, { d: 0.4, f: "2/5", p: "40%" },
  { d: 0.6, f: "3/5", p: "60%" }, { d: 0.8, f: "4/5", p: "80%" }, { d: 0.125, f: "1/8", p: "12.5%" },
  { d: 0.333, f: "1/3", p: "33.3%" }, { d: 0.667, f: "2/3", p: "66.7%" }, { d: 0.15, f: "3/20", p: "15%" },
  { d: 0.375, f: "3/8", p: "37.5%" }, { d: 0.625, f: "5/8", p: "62.5%" }, { d: 0.05, f: "1/20", p: "5%" }
];

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
  newProblem();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() {
  answered = -1; feedback = "";
  var item = COMMON[Math.floor(Math.random() * COMMON.length)];
  var forms = ["d", "f", "p"];
  var fromF = forms[Math.floor(Math.random() * 3)];
  var toF = forms[(forms.indexOf(fromF) + 1 + Math.floor(Math.random() * 2)) % 3];
  var qVal = fromF === "d" ? item.d.toString() : (fromF === "f" ? item.f : item.p);
  var aVal = toF === "d" ? item.d.toString() : (toF === "f" ? item.f : item.p);
  question = { text: qVal, fromType: fromF, toType: toF };
  var wrong1 = COMMON[(COMMON.indexOf(item) + 1 + Math.floor(Math.random() * 5)) % COMMON.length];
  var wrong2 = COMMON[(COMMON.indexOf(item) + 6 + Math.floor(Math.random() * 5)) % COMMON.length];
  while (wrong2 === wrong1) wrong2 = COMMON[Math.floor(Math.random() * COMMON.length)];
  var w1 = toF === "d" ? wrong1.d.toString() : (toF === "f" ? wrong1.f : wrong1.p);
  var w2 = toF === "d" ? wrong2.d.toString() : (toF === "f" ? wrong2.f : wrong2.p);
  options = [aVal, w1, w2];
  correctIdx = 0;
  for (var i = options.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = options[i]; options[i] = options[j]; options[j] = t;
    if (t === aVal && j === i) correctIdx = i;
    else if (options[j] === aVal) correctIdx = j;
  }
  correctIdx = options.indexOf(aVal);
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Decimal, Fraction, Percent Converter", width / 2, 30); textStyle(NORMAL);
  fill(100); textSize(14);
  var typeNames = { d: "decimal", f: "fraction", p: "percentage" };
  text("Convert the " + typeNames[question.fromType] + " to a " + typeNames[question.toType], width / 2, 60);
  fill(30, 50, 120); textSize(36); textStyle(BOLD);
  text(question.text, width / 2, 120); textStyle(NORMAL);
  var optW = 180, optH = 50, gap = 20;
  var startX = width / 2 - (options.length * optW + (options.length - 1) * gap) / 2;
  var optY = 180;
  for (var i = 0; i < options.length; i++) {
    var ox = startX + i * (optW + gap);
    var hov = mouseX > ox && mouseX < ox + optW && mouseY > optY && mouseY < optY + optH;
    if (answered >= 0) {
      if (i === correctIdx) fill(60, 200, 100);
      else if (i === answered && answered !== correctIdx) fill(220, 80, 80);
      else fill(220);
    } else fill(hov ? color(200, 210, 255) : 255);
    stroke(answered >= 0 && i === correctIdx ? color(40, 160, 80) : color(180)); strokeWeight(2);
    rect(ox, optY, optW, optH, 12);
    noStroke(); fill(answered >= 0 && (i === correctIdx || i === answered) ? 255 : 60);
    textSize(20); textStyle(BOLD);
    text(options[i], ox + optW / 2, optY + optH / 2); textStyle(NORMAL);
  }
  if (feedback) {
    fill(feedback === "Correct!" ? color(40, 160, 80) : color(220, 60, 60));
    textSize(24); textStyle(BOLD);
    text(feedback, width / 2, 270); textStyle(NORMAL);
  }
  if (answered >= 0) {
    drawBtnC(width / 2, 320, 120, 40, "Next");
  }
  fill(80); textSize(14);
  text("Score: " + score + "/" + total + "  |  Streak: " + streak, width / 2, height - 30);
}
function drawBtnC(cx, cy, w, h, label) {
  var hov = mouseX > cx - w / 2 && mouseX < cx + w / 2 && mouseY > cy - h / 2 && mouseY < cy + h / 2;
  fill(hov ? color(80, 60, 200) : color(100, 80, 220)); noStroke();
  rect(cx - w / 2, cy - h / 2, w, h, 10);
  fill(255); textSize(16); textStyle(BOLD);
  text(label, cx, cy); textStyle(NORMAL);
}
function mousePressed() {
  if (answered >= 0) {
    if (mouseX > width / 2 - 60 && mouseX < width / 2 + 60 && mouseY > 300 && mouseY < 340) newProblem();
    return;
  }
  var optW = 180, optH = 50, gap = 20;
  var startX = width / 2 - (options.length * optW + (options.length - 1) * gap) / 2;
  var optY = 180;
  for (var i = 0; i < options.length; i++) {
    var ox = startX + i * (optW + gap);
    if (mouseX > ox && mouseX < ox + optW && mouseY > optY && mouseY < optY + optH) {
      answered = i; total++;
      if (i === correctIdx) { score++; streak++; feedback = "Correct!"; }
      else { streak = 0; feedback = "Wrong! Answer: " + options[correctIdx]; }
    }
  }
}
