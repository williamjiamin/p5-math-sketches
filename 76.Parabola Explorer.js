/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var a = 1, bCoeff = 0, c = 0, cellPx = 20;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Parabola Explorer", width / 2, 25); textStyle(NORMAL);
  var eq = "y = " + (a === 1 ? "" : (a === -1 ? "-" : a)) + "x²" + (bCoeff >= 0 ? " + " + bCoeff : " − " + Math.abs(bCoeff)) + "x" + (c >= 0 ? " + " + c : " − " + Math.abs(c));
  fill(80, 60, 200); textSize(18); textStyle(BOLD); text(eq, width / 2, 55); textStyle(NORMAL);
  cellPx = Math.min(20, (width - 80) / 20);
  var ox = width / 2, oy = height / 2;
  stroke(230); strokeWeight(1);
  for (var i = -10; i <= 10; i++) { line(ox + i * cellPx, oy - 10 * cellPx, ox + i * cellPx, oy + 10 * cellPx); line(ox - 10 * cellPx, oy + i * cellPx, ox + 10 * cellPx, oy + i * cellPx); }
  stroke(80); strokeWeight(2); line(ox - 10 * cellPx, oy, ox + 10 * cellPx, oy); line(ox, oy - 10 * cellPx, ox, oy + 10 * cellPx);
  stroke(220, 60, 60); strokeWeight(2.5); noFill();
  beginShape();
  for (var x = -10; x <= 10; x += 0.1) {
    var y = a * x * x + bCoeff * x + c;
    if (Math.abs(y) < 12) vertex(ox + x * cellPx, oy - y * cellPx);
  }
  endShape();
  var vx = -bCoeff / (2 * a), vy = a * vx * vx + bCoeff * vx + c;
  fill(40, 160, 80); noStroke(); ellipse(ox + vx * cellPx, oy - vy * cellPx, 10);
  fill(40, 160, 80); textSize(10); textStyle(BOLD);
  text("vertex(" + vx.toFixed(1) + "," + vy.toFixed(1) + ")", ox + vx * cellPx, oy - vy * cellPx - 12); textStyle(NORMAL);
  stroke(40, 160, 80); strokeWeight(1); drawingContext.setLineDash([4, 4]);
  line(ox + vx * cellPx, oy - 10 * cellPx, ox + vx * cellPx, oy + 10 * cellPx);
  drawingContext.setLineDash([]);
  var disc = bCoeff * bCoeff - 4 * a * c;
  noStroke(); fill(100); textSize(12);
  if (disc > 0) {
    var r1 = (-bCoeff + Math.sqrt(disc)) / (2 * a), r2 = (-bCoeff - Math.sqrt(disc)) / (2 * a);
    text("Roots: x=" + r1.toFixed(2) + ", x=" + r2.toFixed(2) + "  |  Discriminant=" + disc.toFixed(1), width / 2, oy + 10 * cellPx + 15);
    fill(220, 160, 40); ellipse(ox + r1 * cellPx, oy, 8); ellipse(ox + r2 * cellPx, oy, 8);
  } else if (disc === 0) { text("One root: x=" + (-bCoeff / (2 * a)).toFixed(2) + "  |  Discriminant=0", width / 2, oy + 10 * cellPx + 15);
  } else { text("No real roots  |  Discriminant=" + disc.toFixed(1), width / 2, oy + 10 * cellPx + 15); }
  var btnY = height - 40;
  drawBtn(width / 2 - 200, btnY, 30, 24, "a-"); drawBtn(width / 2 - 165, btnY, 30, 24, "a+");
  drawBtn(width / 2 - 80, btnY, 30, 24, "b-"); drawBtn(width / 2 - 45, btnY, 30, 24, "b+");
  drawBtn(width / 2 + 40, btnY, 30, 24, "c-"); drawBtn(width / 2 + 75, btnY, 30, 24, "c+");
  noStroke(); fill(80); textSize(10); text("a=" + a, width / 2 - 182, btnY - 8); text("b=" + bCoeff, width / 2 - 62, btnY - 8); text("c=" + c, width / 2 + 58, btnY - 8);
}
function drawBtn(x, y, w, h, label) { var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 5); noStroke(); fill(hov ? 255 : 60); textSize(12); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL); }
function mousePressed() {
  var btnY = height - 40;
  if (hitB(width / 2 - 200, btnY, 30, 24)) { a = +(a - 0.5).toFixed(1); if (a === 0) a = -0.5; }
  if (hitB(width / 2 - 165, btnY, 30, 24)) { a = +(a + 0.5).toFixed(1); if (a === 0) a = 0.5; }
  if (hitB(width / 2 - 80, btnY, 30, 24)) bCoeff--;
  if (hitB(width / 2 - 45, btnY, 30, 24)) bCoeff++;
  if (hitB(width / 2 + 40, btnY, 30, 24)) c--;
  if (hitB(width / 2 + 75, btnY, 30, 24)) c++;
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
