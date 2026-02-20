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
  var type = Math.floor(Math.random() * 4);
  var a = Math.floor(Math.random() * 8) + 1, b = Math.floor(Math.random() * 8) + 1, c = Math.floor(Math.random() * 5) + 1;
  if (type === 0) prob = { text: a + " + " + b + " × " + c, ans: a + b * c };
  else if (type === 1) prob = { text: a + " × " + b + " − " + c, ans: a * b - c };
  else if (type === 2) prob = { text: "(" + a + " + " + b + ") × " + c, ans: (a + b) * c };
  else { var d = Math.max(1, Math.floor(Math.random() * 4) + 1); prob = { text: a + " + " + (b * d) + " ÷ " + d, ans: a + b }; }
  if (prob.ans < 0) newProblem();
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("PEMDAS Challenge", width / 2, 25); textStyle(NORMAL);
  fill(30, 50, 120); textSize(28); textStyle(BOLD);
  text(prob.text + " = ?", width / 2, 90); textStyle(NORMAL);
  fill(240); stroke(180); strokeWeight(1); rect(width / 2 - 40, 140, 80, 44, 8);
  noStroke(); fill(30); textSize(24); textStyle(BOLD); text(userAns, width / 2, 162); textStyle(NORMAL);
  drawBtn(width / 2 - 110, 143, 40, 38, "-1"); drawBtn(width / 2 - 155, 143, 40, 38, "-10");
  drawBtn(width / 2 + 70, 143, 40, 38, "+1"); drawBtn(width / 2 + 115, 143, 40, 38, "+10");
  drawBtn(width / 2 - 45, 200, 90, 36, "Check");
  if (answered) {
    fill(userAns === prob.ans ? color(40, 160, 80) : color(220, 60, 60));
    textSize(20); textStyle(BOLD);
    text(userAns === prob.ans ? "Correct!" : "Answer: " + prob.ans, width / 2, 260); textStyle(NORMAL);
    drawBtn(width / 2 - 40, 290, 80, 32, "Next");
  }
  fill(80); textSize(14); text("Score: " + score + "/" + total, width / 2, height - 30);
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(14); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  if (!answered) {
    if (hitB(width / 2 - 110, 143, 40, 38)) userAns--;
    if (hitB(width / 2 - 155, 143, 40, 38)) userAns -= 10;
    if (hitB(width / 2 + 70, 143, 40, 38)) userAns++;
    if (hitB(width / 2 + 115, 143, 40, 38)) userAns += 10;
    if (hitB(width / 2 - 45, 200, 90, 36)) { answered = true; total++; if (userAns === prob.ans) score++; }
  }
  if (answered && hitB(width / 2 - 40, 290, 80, 32)) newProblem();
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
