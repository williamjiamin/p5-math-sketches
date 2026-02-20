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
  var type = Math.floor(Math.random() * 3);
  if (type === 0) { var b = Math.floor(Math.random() * 9) + 2, e = Math.floor(Math.random() * 3) + 2; prob = { text: b + "^" + e + " = ?", ans: Math.pow(b, e) }; }
  else if (type === 1) { var ps = [1,4,9,16,25,36,49,64,81,100]; var v = ps[Math.floor(Math.random() * ps.length)]; prob = { text: "√" + v + " = ?", ans: Math.sqrt(v) }; }
  else { var b2 = Math.floor(Math.random() * 4) + 2, e2 = Math.floor(Math.random() * 3) + 2; var r = Math.pow(b2, e2); prob = { text: "What is " + b2 + " to the power " + e2 + "?", ans: r }; }
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Exponents & Roots Practice", width / 2, 25); textStyle(NORMAL);
  fill(30, 50, 120); textSize(24); textStyle(BOLD);
  text(prob.text, width / 2, 80); textStyle(NORMAL);
  fill(240); stroke(180); strokeWeight(1); rect(width / 2 - 40, 120, 80, 44, 8);
  noStroke(); fill(30); textSize(24); textStyle(BOLD); text(userAns, width / 2, 142); textStyle(NORMAL);
  drawBtn(width / 2 - 100, 123, 40, 38, "-1"); drawBtn(width / 2 - 145, 123, 40, 38, "-10");
  drawBtn(width / 2 + 60, 123, 40, 38, "+1"); drawBtn(width / 2 + 105, 123, 40, 38, "+10");
  drawBtn(width / 2 - 45, 180, 90, 36, "Check");
  if (answered) {
    fill(userAns === prob.ans ? color(40, 160, 80) : color(220, 60, 60));
    textSize(20); textStyle(BOLD);
    text(userAns === prob.ans ? "Correct!" : "Answer: " + prob.ans, width / 2, 240); textStyle(NORMAL);
    drawBtn(width / 2 - 40, 270, 80, 32, "Next");
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
    if (hitB(width / 2 - 100, 123, 40, 38)) userAns = Math.max(0, userAns - 1);
    if (hitB(width / 2 - 145, 123, 40, 38)) userAns = Math.max(0, userAns - 10);
    if (hitB(width / 2 + 60, 123, 40, 38)) userAns++;
    if (hitB(width / 2 + 105, 123, 40, 38)) userAns += 10;
    if (hitB(width / 2 - 45, 180, 90, 36)) { answered = true; total++; if (userAns === prob.ans) score++; }
  }
  if (answered && hitB(width / 2 - 40, 270, 80, 32)) newProblem();
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
