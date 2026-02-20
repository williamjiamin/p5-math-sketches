/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score = 0, total = 0, prob = {}, userAns = 0, answered = false;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); newProblem(); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() {
  answered = false; userAns = 0;
  var r = Math.floor(Math.random() * 10) + 2;
  var type = Math.floor(Math.random() * 2);
  if (type === 0) prob = { text: "Circumference of circle r=" + r + "? (round)", r: r, ans: Math.round(2 * Math.PI * r), formula: "2πr" };
  else prob = { text: "Area of circle r=" + r + "? (round)", r: r, ans: Math.round(Math.PI * r * r), formula: "πr²" };
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Circle Practice", width / 2, 25); textStyle(NORMAL);
  fill(30, 50, 120); textSize(18); text(prob.text, width / 2, 65);
  var cx = width / 2, cy = 180, r = Math.min(prob.r * 8, 80);
  stroke(80, 60, 200); strokeWeight(2); noFill(); ellipse(cx, cy, r * 2, r * 2);
  stroke(220, 60, 60); line(cx, cy, cx + r, cy);
  noStroke(); fill(220, 60, 60); textSize(12); text("r=" + prob.r, cx + r / 2, cy - 10);
  fill(240); stroke(180); strokeWeight(1); rect(cx - 40, 260, 80, 40, 8);
  noStroke(); fill(30); textSize(20); textStyle(BOLD); text(userAns, cx, 280); textStyle(NORMAL);
  drawBtn(cx - 100, 263, 40, 34, "-1"); drawBtn(cx - 145, 263, 40, 34, "-10");
  drawBtn(cx + 60, 263, 40, 34, "+1"); drawBtn(cx + 105, 263, 40, 34, "+10");
  drawBtn(cx - 40, 310, 80, 32, "Check");
  if (answered) {
    fill(userAns === prob.ans ? color(40, 160, 80) : color(220, 60, 60));
    textSize(18); textStyle(BOLD);
    text(userAns === prob.ans ? "Correct!" : "Answer: " + prob.ans + " (" + prob.formula + ")", cx, 365); textStyle(NORMAL);
    drawBtn(cx - 40, 390, 80, 32, "Next");
  }
  fill(80); textSize(14); text("Score: " + score + "/" + total, cx, height - 25);
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(13); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  if (!answered) {
    if (hitB(width / 2 - 100, 263, 40, 34)) userAns = Math.max(0, userAns - 1);
    if (hitB(width / 2 - 145, 263, 40, 34)) userAns = Math.max(0, userAns - 10);
    if (hitB(width / 2 + 60, 263, 40, 34)) userAns++;
    if (hitB(width / 2 + 105, 263, 40, 34)) userAns += 10;
    if (hitB(width / 2 - 40, 310, 80, 32)) { answered = true; total++; if (userAns === prob.ans) score++; }
  }
  if (answered && hitB(width / 2 - 40, 390, 80, 32)) newProblem();
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
