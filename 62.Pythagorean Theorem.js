/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var sideA = 3, sideB = 4, showProof = false;
function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  var c = Math.sqrt(sideA * sideA + sideB * sideB);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Pythagorean Theorem", width / 2, 25); textStyle(NORMAL);
  fill(80, 60, 200); textSize(20); textStyle(BOLD);
  text("a² + b² = c²", width / 2, 55);
  text(sideA + "² + " + sideB + "² = " + (sideA * sideA) + " + " + (sideB * sideB) + " = " + (sideA * sideA + sideB * sideB), width / 2, 80);
  text("c = √" + (sideA * sideA + sideB * sideB) + " = " + c.toFixed(2), width / 2, 105);
  textStyle(NORMAL);
  var scale = Math.min((width - 100) / (sideA + sideB + c + 4), (height - 280) / Math.max(sideA, sideB, c));
  var triCx = width / 2 - 100, triCy = 280;
  var ax = triCx, ay = triCy;
  var bx = triCx + sideB * scale, by = triCy;
  var cx2 = triCx, cy2 = triCy - sideA * scale;
  fill(80, 60, 200, 30); stroke(80, 60, 200); strokeWeight(3);
  triangle(ax, ay, bx, by, cx2, cy2);
  noStroke(); fill(80, 60, 200); textSize(14); textStyle(BOLD);
  text("a=" + sideA, (ax + cx2) / 2 - 20, (ay + cy2) / 2);
  text("b=" + sideB, (ax + bx) / 2, ay + 18);
  text("c=" + c.toFixed(1), (bx + cx2) / 2 + 15, (by + cy2) / 2 - 5);
  textStyle(NORMAL);
  stroke(220, 60, 60); strokeWeight(1.5); noFill();
  rect(ax - 2, ay - sideA * scale - 2, sideA * scale + 4, sideA * scale + 4);
  noStroke(); fill(220, 60, 60, 40);
  rect(ax, ay - sideA * scale, sideA * scale, sideA * scale);
  fill(220, 60, 60); textSize(11);
  text("a²=" + (sideA * sideA), ax + sideA * scale / 2, ay - sideA * scale / 2);
  stroke(40, 160, 80); strokeWeight(1.5); noFill();
  rect(ax - 2, ay, sideB * scale + 4, sideB * scale);
  noStroke(); fill(40, 160, 80, 40);
  rect(ax, ay, sideB * scale, sideB * scale);
  fill(40, 160, 80); textSize(11);
  text("b²=" + (sideB * sideB), ax + sideB * scale / 2, ay + sideB * scale / 2);
  var btnY = height - 60;
  noStroke(); fill(80); textSize(13);
  text("a=" + sideA, width / 2 - 100, btnY - 12); text("b=" + sideB, width / 2 + 100, btnY - 12);
  drawBtn(width / 2 - 145, btnY, 35, 28, "-"); drawBtn(width / 2 - 70, btnY, 35, 28, "+");
  drawBtn(width / 2 + 55, btnY, 35, 28, "-"); drawBtn(width / 2 + 130, btnY, 35, 28, "+");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6);
  noStroke(); fill(hov ? 255 : 60); textSize(14); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 60;
  if (hitB(width / 2 - 145, btnY, 35, 28)) sideA = Math.max(1, sideA - 1);
  if (hitB(width / 2 - 70, btnY, 35, 28)) sideA = Math.min(12, sideA + 1);
  if (hitB(width / 2 + 55, btnY, 35, 28)) sideB = Math.max(1, sideB - 1);
  if (hitB(width / 2 + 130, btnY, 35, 28)) sideB = Math.min(12, sideB + 1);
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
