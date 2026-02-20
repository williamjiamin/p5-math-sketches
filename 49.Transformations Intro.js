/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var origPts = [{x:0,y:0},{x:2,y:0},{x:2,y:1},{x:1,y:1},{x:1,y:2},{x:0,y:2}];
var transPts = [];
var tx = 0, ty = 0, rotAngle = 0, reflectX = false, reflectY = false;
var cellPx = 30;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
  resetTransform();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function resetTransform() { tx = 0; ty = 0; rotAngle = 0; reflectX = false; reflectY = false; updateTransform(); }
function updateTransform() {
  transPts = [];
  for (var i = 0; i < origPts.length; i++) {
    var x = origPts[i].x, y = origPts[i].y;
    if (reflectX) x = -x;
    if (reflectY) y = -y;
    var cos_a = Math.cos(rotAngle * Math.PI / 180), sin_a = Math.sin(rotAngle * Math.PI / 180);
    var rx = x * cos_a - y * sin_a, ry = x * sin_a + y * cos_a;
    transPts.push({ x: rx + tx, y: ry + ty });
  }
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Transformations", width / 2, 25); textStyle(NORMAL);
  cellPx = Math.min(30, (width - 100) / 20);
  var ox = width / 2, oy = height / 2 - 20;
  stroke(230); strokeWeight(1);
  for (var i = -10; i <= 10; i++) {
    line(ox + i * cellPx, oy - 10 * cellPx, ox + i * cellPx, oy + 10 * cellPx);
    line(ox - 10 * cellPx, oy + i * cellPx, ox + 10 * cellPx, oy + i * cellPx);
  }
  stroke(100); strokeWeight(2);
  line(ox - 10 * cellPx, oy, ox + 10 * cellPx, oy);
  line(ox, oy - 10 * cellPx, ox, oy + 10 * cellPx);
  fill(80, 60, 200, 40); stroke(80, 60, 200); strokeWeight(2);
  beginShape();
  for (var j = 0; j < origPts.length; j++) vertex(ox + origPts[j].x * cellPx, oy - origPts[j].y * cellPx);
  endShape(CLOSE);
  fill(220, 100, 40, 80); stroke(220, 100, 40); strokeWeight(2);
  beginShape();
  for (var k = 0; k < transPts.length; k++) vertex(ox + transPts[k].x * cellPx, oy - transPts[k].y * cellPx);
  endShape(CLOSE);
  noStroke(); fill(80, 60, 200); textSize(11); text("Original", ox + origPts[1].x * cellPx + 20, oy - origPts[0].y * cellPx);
  fill(220, 100, 40); text("Transformed", ox + transPts[1].x * cellPx + 25, oy - transPts[0].y * cellPx);
  var infoY = height - 130;
  noStroke(); fill(80); textSize(12);
  text("Translate: (" + tx + ", " + ty + ")  |  Rotate: " + rotAngle + "°  |  Reflect: " +
    (reflectX ? "X " : "") + (reflectY ? "Y " : "") + (!reflectX && !reflectY ? "None" : ""), width / 2, infoY);
  var btnY = infoY + 18;
  drawBtn(width / 2 - 250, btnY, 50, 28, "Left"); drawBtn(width / 2 - 195, btnY, 50, 28, "Right");
  drawBtn(width / 2 - 140, btnY, 40, 28, "Up"); drawBtn(width / 2 - 95, btnY, 50, 28, "Down");
  drawBtn(width / 2 - 20, btnY, 60, 28, "Rot -90"); drawBtn(width / 2 + 45, btnY, 60, 28, "Rot +90");
  drawBtn(width / 2 + 115, btnY, 60, 28, "Flip X"); drawBtn(width / 2 + 180, btnY, 60, 28, "Flip Y");
  drawBtn(width / 2 - 35, btnY + 36, 70, 28, "Reset");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6);
  noStroke(); fill(hov ? 255 : 60); textSize(10); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 112;
  if (hitB(width / 2 - 250, btnY, 50, 28)) { tx--; updateTransform(); }
  if (hitB(width / 2 - 195, btnY, 50, 28)) { tx++; updateTransform(); }
  if (hitB(width / 2 - 140, btnY, 40, 28)) { ty++; updateTransform(); }
  if (hitB(width / 2 - 95, btnY, 50, 28)) { ty--; updateTransform(); }
  if (hitB(width / 2 - 20, btnY, 60, 28)) { rotAngle = (rotAngle - 90) % 360; updateTransform(); }
  if (hitB(width / 2 + 45, btnY, 60, 28)) { rotAngle = (rotAngle + 90) % 360; updateTransform(); }
  if (hitB(width / 2 + 115, btnY, 60, 28)) { reflectX = !reflectX; updateTransform(); }
  if (hitB(width / 2 + 180, btnY, 60, 28)) { reflectY = !reflectY; updateTransform(); }
  if (hitB(width / 2 - 35, btnY + 36, 70, 28)) resetTransform();
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
