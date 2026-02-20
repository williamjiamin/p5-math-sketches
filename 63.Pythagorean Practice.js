/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score = 0, total = 0, prob = {}, userAns = 0, answered = false;
var TRIPLES = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15],[20,21,29]];
function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER); newProblem();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() {
  answered = false; userAns = 0;
  var t = TRIPLES[Math.floor(Math.random() * TRIPLES.length)];
  var missing = Math.floor(Math.random() * 3);
  if (missing === 0) prob = { a: "?", b: t[1], c: t[2], ans: t[0], text: "a=? b=" + t[1] + " c=" + t[2] };
  else if (missing === 1) prob = { a: t[0], b: "?", c: t[2], ans: t[1], text: "a=" + t[0] + " b=? c=" + t[2] };
  else prob = { a: t[0], b: t[1], c: "?", ans: t[2], text: "a=" + t[0] + " b=" + t[1] + " c=?" };
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Pythagorean Practice", width / 2, 25); textStyle(NORMAL);
  fill(30, 50, 120); textSize(18);
  text("Find the missing side: " + prob.text, width / 2, 65);
  fill(80, 60, 200); textSize(14);
  text("a² + b² = c²", width / 2, 95);
  var scale = 12;
  var cx = width / 2, cy = 230;
  var a = prob.a === "?" ? prob.ans : prob.a, b = prob.b === "?" ? prob.ans : prob.b;
  fill(80, 60, 200, 40); stroke(80, 60, 200); strokeWeight(2);
  triangle(cx - b * scale / 2, cy + a * scale / 2, cx + b * scale / 2, cy + a * scale / 2, cx - b * scale / 2, cy - a * scale / 2);
  noStroke(); fill(80); textSize(13);
  text("a=" + prob.a, cx - b * scale / 2 - 25, cy);
  text("b=" + prob.b, cx, cy + a * scale / 2 + 16);
  text("c=" + prob.c, cx + 15, cy - 10);
  fill(240); stroke(180); strokeWeight(1); rect(cx - 30, 310, 60, 38, 8);
  noStroke(); fill(30); textSize(20); textStyle(BOLD); text(userAns, cx, 329); textStyle(NORMAL);
  drawBtn(cx - 80, 313, 35, 32, "-"); drawBtn(cx + 45, 313, 35, 32, "+");
  drawBtn(cx - 40, 360, 80, 32, "Check");
  if (answered) {
    fill(userAns === prob.ans ? color(40, 160, 80) : color(220, 60, 60));
    textSize(18); textStyle(BOLD);
    text(userAns === prob.ans ? "Correct!" : "Answer: " + prob.ans, cx, 410); textStyle(NORMAL);
    drawBtn(cx - 40, 435, 80, 32, "Next");
  }
  fill(80); textSize(14); text("Score: " + score + "/" + total, cx, height - 25);
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(14); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  if (!answered) {
    if (hitB(width / 2 - 80, 313, 35, 32)) userAns = Math.max(0, userAns - 1);
    if (hitB(width / 2 + 45, 313, 35, 32)) userAns++;
    if (hitB(width / 2 - 40, 360, 80, 32)) { answered = true; total++; if (userAns === prob.ans) score++; }
  }
  if (answered && hitB(width / 2 - 40, 435, 80, 32)) newProblem();
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
