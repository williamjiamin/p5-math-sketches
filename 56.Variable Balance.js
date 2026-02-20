/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var eqLeft = 5, eqRight = 5, xCoeff = 1, xVal = 0, step = 0;
var problems = [
  { eq: "x + 3 = 7", xc: 1, add: 3, ans: 4 },
  { eq: "2x = 10", xc: 2, add: 0, ans: 5 },
  { eq: "x - 2 = 6", xc: 1, add: -2, ans: 8 },
  { eq: "3x + 1 = 10", xc: 3, add: 1, ans: 3 }
];
var probIdx = 0, solved = false, tiltAngle = 0;
function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER); loadProb();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function loadProb() {
  var p = problems[probIdx]; solved = false; step = 0;
  eqLeft = p.xc * p.ans + p.add; eqRight = eqLeft; xCoeff = p.xc; xVal = 0;
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Variable Balance", width / 2, 25); textStyle(NORMAL);
  var p = problems[probIdx];
  fill(30, 50, 120); textSize(20); textStyle(BOLD);
  text(p.eq, width / 2, 60); textStyle(NORMAL);
  var cx = width / 2, cy = 220;
  var diff = eqLeft - eqRight;
  var targetTilt = diff === 0 ? 0 : (diff > 0 ? -0.12 : 0.12);
  tiltAngle = lerp(tiltAngle, targetTilt, 0.1);
  fill(120, 100, 80); noStroke();
  triangle(cx - 15, cy + 60, cx + 15, cy + 60, cx, cy + 20);
  rect(cx - 3, cy + 60, 6, 30);
  push(); translate(cx, cy + 20); rotate(tiltAngle);
  stroke(80, 60, 40); strokeWeight(4); line(-160, 0, 160, 0);
  noStroke(); fill(80, 60, 200); rect(-170, -35, 80, 35, 6);
  fill(255); textSize(14); textStyle(BOLD); text("Left", -130, -17);
  fill(220, 100, 40); rect(90, -35, 80, 35, 6);
  fill(255); text("Right", 130, -17); textStyle(NORMAL);
  pop();
  fill(80, 60, 200); textSize(16); textStyle(BOLD); text("Left = " + eqLeft, cx - 130, cy + 110);
  fill(220, 100, 40); text("Right = " + eqRight, cx + 130, cy + 110); textStyle(NORMAL);
  if (diff === 0) { fill(40, 160, 80); textSize(16); textStyle(BOLD); text("Balanced!", cx, cy + 110); textStyle(NORMAL); }
  var instrY = cy + 140;
  fill(100); textSize(13);
  text("Subtract/add to both sides to isolate x", cx, instrY);
  var btnY = instrY + 25;
  drawBtn(cx - 200, btnY, 80, 30, "Both -1"); drawBtn(cx - 110, btnY, 80, 30, "Both +1");
  drawBtn(cx + 30, btnY, 80, 30, "Both ÷2"); drawBtn(cx + 120, btnY, 80, 30, "Both ×2");
  if (solved) {
    fill(40, 160, 80); textSize(20); textStyle(BOLD);
    text("x = " + p.ans, cx, btnY + 50); textStyle(NORMAL);
  }
  drawBtn(cx - 55, btnY + 80, 110, 30, "Next Problem");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(12); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = 385;
  var cx = width / 2;
  if (hitB(cx - 200, btnY, 80, 30)) { eqLeft--; eqRight--; }
  if (hitB(cx - 110, btnY, 80, 30)) { eqLeft++; eqRight++; }
  if (hitB(cx + 30, btnY, 80, 30) && eqLeft % 2 === 0 && eqRight % 2 === 0) { eqLeft /= 2; eqRight /= 2; }
  if (hitB(cx + 120, btnY, 80, 30)) { eqLeft *= 2; eqRight *= 2; }
  if (eqLeft === problems[probIdx].ans && eqRight === problems[probIdx].ans) solved = true;
  if (hitB(cx - 55, btnY + 80, 110, 30)) { probIdx = (probIdx + 1) % problems.length; loadProb(); }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
