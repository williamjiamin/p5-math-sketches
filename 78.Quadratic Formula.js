/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var a = 1, b = -3, c = 2;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Quadratic Formula", width / 2, 25); textStyle(NORMAL);
  fill(80, 60, 200); textSize(18); textStyle(BOLD);
  text("x = (−b ± √(b²−4ac)) / 2a", width / 2, 55); textStyle(NORMAL);
  fill(30, 50, 120); textSize(16);
  text(a + "x² + (" + b + ")x + (" + c + ") = 0", width / 2, 85);
  var disc = b * b - 4 * a * c;
  fill(100); textSize(14);
  text("Discriminant: b²−4ac = " + b + "²−4(" + a + ")(" + c + ") = " + disc, width / 2, 115);
  if (disc > 0) {
    fill(40, 160, 80); textSize(16); textStyle(BOLD);
    var r1 = (-b + Math.sqrt(disc)) / (2 * a), r2 = (-b - Math.sqrt(disc)) / (2 * a);
    text("Two real roots: x = " + r1.toFixed(3) + ", x = " + r2.toFixed(3), width / 2, 145);
    text("Discriminant > 0: parabola crosses x-axis twice", width / 2, 170); textStyle(NORMAL);
  } else if (disc === 0) {
    fill(220, 160, 40); textSize(16); textStyle(BOLD);
    text("One repeated root: x = " + (-b / (2 * a)).toFixed(3), width / 2, 145);
    text("Discriminant = 0: parabola touches x-axis once", width / 2, 170); textStyle(NORMAL);
  } else {
    fill(220, 60, 60); textSize(16); textStyle(BOLD);
    text("No real roots (complex)", width / 2, 145);
    text("Discriminant < 0: parabola doesn't cross x-axis", width / 2, 170); textStyle(NORMAL);
  }
  var cellPx = 18, ox = width / 2, oy = 350;
  stroke(230); strokeWeight(1);
  for (var i = -10; i <= 10; i++) { line(ox + i * cellPx, oy - 8 * cellPx, ox + i * cellPx, oy + 4 * cellPx); line(ox - 10 * cellPx, oy + i * cellPx, ox + 10 * cellPx, oy + i * cellPx); }
  stroke(80); strokeWeight(2); line(ox - 10 * cellPx, oy, ox + 10 * cellPx, oy); line(ox, oy - 8 * cellPx, ox, oy + 4 * cellPx);
  stroke(disc > 0 ? color(40, 160, 80) : (disc === 0 ? color(220, 160, 40) : color(220, 60, 60))); strokeWeight(2.5); noFill();
  beginShape();
  for (var x = -10; x <= 10; x += 0.1) { var y = a * x * x + b * x + c; if (Math.abs(y) < 10) vertex(ox + x * cellPx, oy - y * cellPx); }
  endShape();
  var btnY = height - 40;
  drawBtn(width / 2 - 170, btnY, 30, 24, "a-"); drawBtn(width / 2 - 135, btnY, 30, 24, "a+");
  drawBtn(width / 2 - 50, btnY, 30, 24, "b-"); drawBtn(width / 2 - 15, btnY, 30, 24, "b+");
  drawBtn(width / 2 + 70, btnY, 30, 24, "c-"); drawBtn(width / 2 + 105, btnY, 30, 24, "c+");
}
function drawBtn(x, y, w, h, label) { var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 5); noStroke(); fill(hov ? 255 : 60); textSize(11); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL); }
function mousePressed() {
  var btnY = height - 40;
  if (hitB(width / 2 - 170, btnY, 30, 24)) { a--; if (a === 0) a = -1; }
  if (hitB(width / 2 - 135, btnY, 30, 24)) { a++; if (a === 0) a = 1; }
  if (hitB(width / 2 - 50, btnY, 30, 24)) b--;
  if (hitB(width / 2 - 15, btnY, 30, 24)) b++;
  if (hitB(width / 2 + 70, btnY, 30, 24)) c--;
  if (hitB(width / 2 + 105, btnY, 30, 24)) c++;
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
