/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var shapeType = 0;
var shapeNames = ["Rectangle", "Triangle", "Parallelogram", "Trapezoid"];
var gridW = 8, gridH = 5;
var cellSz = 40;
var countAnim = 0, counting = false;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function getArea() {
  if (shapeType === 0) return gridW * gridH;
  if (shapeType === 1) return gridW * gridH / 2;
  if (shapeType === 2) return gridW * gridH;
  return (gridW + Math.max(2, gridW - 2)) * gridH / 2;
}
function draw() {
  background(245, 247, 252);
  if (counting) { countAnim = Math.min(countAnim + 0.03, 1); if (countAnim >= 1) counting = false; }
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Area on a Grid", width / 2, 25); textStyle(NORMAL);
  cellSz = Math.min((width - 80) / (gridW + 2), (height - 200) / (gridH + 2));
  var ox = width / 2 - gridW * cellSz / 2, oy = 70;
  for (var r = 0; r < gridH; r++) {
    for (var c = 0; c < gridW; c++) {
      var x = ox + c * cellSz, y = oy + r * cellSz;
      var inside = isInside(c, r);
      var idx = r * gridW + c;
      var shown = counting ? (idx < countAnim * gridW * gridH) : true;
      fill(inside && shown ? color(80, 60, 200, 60) : color(245));
      stroke(200); strokeWeight(1); rect(x, y, cellSz, cellSz);
      if (inside && shown) { noStroke(); fill(80, 60, 200, 40); textSize(cellSz * 0.3); }
    }
  }
  stroke(80, 60, 200); strokeWeight(3); noFill();
  drawShape(ox, oy);
  var area = getArea();
  var formula = getFormula();
  var infoY = oy + gridH * cellSz + 20;
  noStroke(); fill(80, 60, 200); textSize(18); textStyle(BOLD);
  text(shapeNames[shapeType] + ": " + formula + " = " + area + " sq units", width / 2, infoY);
  textStyle(NORMAL);
  fill(100); textSize(12);
  text("Base=" + gridW + ", Height=" + gridH, width / 2, infoY + 24);
  var btnY = infoY + 50;
  for (var i = 0; i < shapeNames.length; i++) {
    drawBtn(width / 2 + (i - shapeNames.length / 2) * 115, btnY, 105, 30, shapeNames[i], i === shapeType);
  }
  drawBtn(width / 2 - 120, btnY + 38, 45, 28, "W-"); drawBtn(width / 2 - 70, btnY + 38, 45, 28, "W+");
  drawBtn(width / 2 + 25, btnY + 38, 45, 28, "H-"); drawBtn(width / 2 + 75, btnY + 38, 45, 28, "H+");
  drawBtn(width / 2 - 40, btnY + 72, 80, 28, "Count!");
}
function isInside(c, r) {
  if (shapeType === 0) return true;
  if (shapeType === 1) return c <= gridW * (gridH - r - 1) / gridH;
  if (shapeType === 2) return true;
  var topW = Math.max(2, gridW - 2);
  var offset = (gridW - topW) / 2;
  var leftEdge = offset * r / gridH;
  var rightEdge = gridW - offset * r / gridH;
  return c >= leftEdge && c < rightEdge;
}
function drawShape(ox, oy) {
  var w = gridW * cellSz, h = gridH * cellSz;
  if (shapeType === 0) rect(ox, oy, w, h);
  else if (shapeType === 1) triangle(ox, oy + h, ox + w, oy + h, ox, oy);
  else if (shapeType === 2) {
    var off = cellSz * 1.5;
    quad(ox + off, oy, ox + w + off, oy, ox + w, oy + h, ox, oy + h);
  } else {
    var topW = Math.max(2, gridW - 2) * cellSz;
    var offset = (w - topW) / 2;
    quad(ox + offset, oy, ox + offset + topW, oy, ox + w, oy + h, ox, oy + h);
  }
}
function getFormula() {
  if (shapeType === 0) return gridW + " × " + gridH;
  if (shapeType === 1) return "½ × " + gridW + " × " + gridH;
  if (shapeType === 2) return gridW + " × " + gridH;
  var topW = Math.max(2, gridW - 2);
  return "½ × (" + topW + " + " + gridW + ") × " + gridH;
}
function drawBtn(x, y, w, h, label, active) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(active ? color(80, 60, 200) : (hov ? color(200, 210, 255) : 255));
  stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(active ? 255 : 60); textSize(11); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var infoY = 70 + gridH * cellSz + 70;
  var btnY = infoY;
  for (var i = 0; i < shapeNames.length; i++) {
    if (hitB(width / 2 + (i - shapeNames.length / 2) * 115, btnY, 105, 30)) { shapeType = i; countAnim = 0; counting = false; }
  }
  if (hitB(width / 2 - 120, btnY + 38, 45, 28)) gridW = Math.max(2, gridW - 1);
  if (hitB(width / 2 - 70, btnY + 38, 45, 28)) gridW = Math.min(12, gridW + 1);
  if (hitB(width / 2 + 25, btnY + 38, 45, 28)) gridH = Math.max(2, gridH - 1);
  if (hitB(width / 2 + 75, btnY + 38, 45, 28)) gridH = Math.min(10, gridH + 1);
  if (hitB(width / 2 - 40, btnY + 72, 80, 28)) { counting = true; countAnim = 0; }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
