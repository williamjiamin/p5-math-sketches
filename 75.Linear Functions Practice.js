/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score = 0, total = 0, prob = {}, userM = 0, userB = 0, answered = false;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); newProblem(); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() { answered = false; userM = 0; userB = 0; prob = { m: Math.floor(Math.random() * 5) - 2, b: Math.floor(Math.random() * 7) - 3 }; }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Linear Functions Practice", width / 2, 25); textStyle(NORMAL);
  var cellPx = Math.min(20, (width - 80) / 20);
  var ox = width / 2, oy = 230;
  stroke(230); strokeWeight(1);
  for (var i = -8; i <= 8; i++) { line(ox + i * cellPx, oy - 8 * cellPx, ox + i * cellPx, oy + 8 * cellPx); line(ox - 8 * cellPx, oy + i * cellPx, ox + 8 * cellPx, oy + i * cellPx); }
  stroke(80); strokeWeight(2); line(ox - 8 * cellPx, oy, ox + 8 * cellPx, oy); line(ox, oy - 8 * cellPx, ox, oy + 8 * cellPx);
  stroke(80, 60, 200); strokeWeight(3);
  var x1 = -10, x2 = 10;
  line(ox + x1 * cellPx, oy - (prob.m * x1 + prob.b) * cellPx, ox + x2 * cellPx, oy - (prob.m * x2 + prob.b) * cellPx);
  fill(80); noStroke(); textSize(14); text("What is the equation? y = mx + b", width / 2, 55);
  var inputY = oy + 8 * cellPx + 20;
  noStroke(); fill(80); textSize(13); text("m=" + userM, width / 2 - 80, inputY + 15); text("b=" + userB, width / 2 + 80, inputY + 15);
  drawBtn(width / 2 - 125, inputY, 30, 26, "-"); drawBtn(width / 2 - 50, inputY, 30, 26, "+");
  drawBtn(width / 2 + 35, inputY, 30, 26, "-"); drawBtn(width / 2 + 110, inputY, 30, 26, "+");
  drawBtn(width / 2 - 35, inputY + 35, 70, 28, "Check");
  if (answered) {
    fill(userM === prob.m && userB === prob.b ? color(40, 160, 80) : color(220, 60, 60));
    textSize(16); textStyle(BOLD);
    text(userM === prob.m && userB === prob.b ? "Correct!" : "Answer: y = " + prob.m + "x + " + prob.b, width / 2, inputY + 75); textStyle(NORMAL);
    drawBtn(width / 2 - 35, inputY + 90, 70, 26, "Next");
  }
  fill(80); textSize(13); text("Score: " + score + "/" + total, width / 2, height - 20);
}
function drawBtn(x, y, w, h, label) { var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6); noStroke(); fill(hov ? 255 : 60); textSize(12); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL); }
function mousePressed() {
  var cellPx = Math.min(20, (width - 80) / 20);
  var inputY = 230 + 8 * cellPx + 20;
  if (!answered) {
    if (hitB(width / 2 - 125, inputY, 30, 26)) userM--;
    if (hitB(width / 2 - 50, inputY, 30, 26)) userM++;
    if (hitB(width / 2 + 35, inputY, 30, 26)) userB--;
    if (hitB(width / 2 + 110, inputY, 30, 26)) userB++;
    if (hitB(width / 2 - 35, inputY + 35, 70, 28)) { answered = true; total++; if (userM === prob.m && userB === prob.b) score++; }
  }
  if (answered && hitB(width / 2 - 35, inputY + 90, 70, 26)) newProblem();
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
