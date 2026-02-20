/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var valA = 3, valB = 6, valC = 5, valD = 10;
var tiltAngle = 0;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Proportion Scale", width / 2, 25); textStyle(NORMAL);
  var cross1 = valA * valD, cross2 = valB * valC;
  var balanced = cross1 === cross2;
  var targetTilt = balanced ? 0 : (cross1 > cross2 ? -0.15 : 0.15);
  tiltAngle = lerp(tiltAngle, targetTilt, 0.08);
  var cx = width / 2, cy = 220;
  fill(120, 100, 80); noStroke();
  triangle(cx - 20, cy + 80, cx + 20, cy + 80, cx, cy + 30);
  rect(cx - 3, cy + 80, 6, 40);
  push(); translate(cx, cy + 30); rotate(tiltAngle);
  stroke(80, 60, 40); strokeWeight(4);
  line(-180, 0, 180, 0);
  fill(80, 60, 200, 180); noStroke();
  rect(-190, -40, 60, 40, 6);
  fill(255); textSize(16); textStyle(BOLD);
  text(valA + "/" + valB, -160, -20); textStyle(NORMAL);
  fill(220, 100, 40, 180); noStroke();
  rect(130, -40, 60, 40, 6);
  fill(255); textSize(16); textStyle(BOLD);
  text(valC + "/" + valD, 160, -20); textStyle(NORMAL);
  pop();
  var eqY = cy + 150;
  fill(balanced ? color(40, 160, 80) : color(220, 60, 60));
  textSize(24); textStyle(BOLD);
  text(valA + "/" + valB + (balanced ? " = " : " ≠ ") + valC + "/" + valD, cx, eqY);
  textStyle(NORMAL);
  fill(100); textSize(13);
  text("Cross multiply: " + valA + "×" + valD + " = " + cross1 + "  vs  " + valB + "×" + valC + " = " + cross2, cx, eqY + 28);
  if (balanced) { fill(40, 160, 80); textStyle(BOLD); text("Proportional!", cx, eqY + 52); textStyle(NORMAL); }
  var btnY = eqY + 70;
  noStroke(); fill(80, 60, 200); textSize(12); textStyle(BOLD);
  text("a", cx - 160, btnY - 8); text("b", cx - 80, btnY - 8);
  fill(220, 100, 40);
  text("c", cx + 80, btnY - 8); text("d", cx + 160, btnY - 8); textStyle(NORMAL);
  drawBtn(cx - 185, btnY, 30, 28, "-"); drawBtn(cx - 155, btnY, 30, 28, "+");
  drawBtn(cx - 105, btnY, 30, 28, "-"); drawBtn(cx - 75, btnY, 30, 28, "+");
  drawBtn(cx + 55, btnY, 30, 28, "-"); drawBtn(cx + 85, btnY, 30, 28, "+");
  drawBtn(cx + 135, btnY, 30, 28, "-"); drawBtn(cx + 165, btnY, 30, 28, "+");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6);
  noStroke(); fill(hov ? 255 : 60); textSize(16); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 80;
  var cx = width / 2;
  if (hitB(cx - 185, btnY, 30, 28)) valA = Math.max(1, valA - 1);
  if (hitB(cx - 155, btnY, 30, 28)) valA = Math.min(20, valA + 1);
  if (hitB(cx - 105, btnY, 30, 28)) valB = Math.max(1, valB - 1);
  if (hitB(cx - 75, btnY, 30, 28)) valB = Math.min(20, valB + 1);
  if (hitB(cx + 55, btnY, 30, 28)) valC = Math.max(1, valC - 1);
  if (hitB(cx + 85, btnY, 30, 28)) valC = Math.min(20, valC + 1);
  if (hitB(cx + 135, btnY, 30, 28)) valD = Math.max(1, valD - 1);
  if (hitB(cx + 165, btnY, 30, 28)) valD = Math.min(20, valD + 1);
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
