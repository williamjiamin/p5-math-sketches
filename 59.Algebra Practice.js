/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score = 0, total = 0, prob = {}, userAns = 0, answered = false;
function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER); newProblem();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() {
  answered = false; userAns = 0;
  var a = Math.floor(Math.random() * 5) + 1, b = Math.floor(Math.random() * 15) + 1;
  var x = Math.floor(Math.random() * 10) + 1;
  var rhs = a * x + b;
  prob = { text: a + "x + " + b + " = " + rhs, ans: x, hint: "x + " + b + " = " + rhs + " → x = " + x };
  if (a === 1) prob.text = "x + " + b + " = " + rhs;
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Algebra Practice", width / 2, 25); textStyle(NORMAL);
  fill(30, 50, 120); textSize(24); textStyle(BOLD);
  text("Solve: " + prob.text, width / 2, 80); textStyle(NORMAL);
  fill(100); textSize(14); text("Find x:", width / 2, 115);
  fill(240); stroke(180); strokeWeight(1); rect(width / 2 - 35, 135, 70, 42, 8);
  noStroke(); fill(30); textSize(22); textStyle(BOLD); text(userAns, width / 2, 156); textStyle(NORMAL);
  drawBtn(width / 2 - 95, 138, 40, 36, "-"); drawBtn(width / 2 + 55, 138, 40, 36, "+");
  drawBtn(width / 2 - 40, 190, 80, 34, "Check");
  if (answered) {
    fill(userAns === prob.ans ? color(40, 160, 80) : color(220, 60, 60));
    textSize(20); textStyle(BOLD);
    text(userAns === prob.ans ? "Correct! x = " + prob.ans : "x = " + prob.ans, width / 2, 250); textStyle(NORMAL);
    drawBtn(width / 2 - 40, 280, 80, 32, "Next");
  }
  fill(80); textSize(14); text("Score: " + score + "/" + total, width / 2, height - 30);
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(15); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  if (!answered) {
    if (hitB(width / 2 - 95, 138, 40, 36)) userAns = Math.max(0, userAns - 1);
    if (hitB(width / 2 + 55, 138, 40, 36)) userAns++;
    if (hitB(width / 2 - 40, 190, 80, 34)) { answered = true; total++; if (userAns === prob.ans) score++; }
  }
  if (answered && hitB(width / 2 - 40, 280, 80, 32)) newProblem();
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
