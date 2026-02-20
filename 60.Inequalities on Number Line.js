/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var ineqType = 0, ineqVal = 3;
var TYPES = ["x > ", "x < ", "x ≥ ", "x ≤ ", " < x < "];
var rangeA = 1, rangeB = 5;
function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Inequalities on the Number Line", width / 2, 25); textStyle(NORMAL);
  var ineqStr;
  if (ineqType === 4) ineqStr = rangeA + " < x < " + rangeB;
  else ineqStr = "x " + [">" , "<", "≥", "≤"][ineqType] + " " + ineqVal;
  fill(30, 50, 120); textSize(28); textStyle(BOLD);
  text(ineqStr, width / 2, 70); textStyle(NORMAL);
  var nlY = height / 2, nlLeft = 60, nlRight = width - 60;
  var minV = -10, maxV = 10;
  stroke(80); strokeWeight(3); line(nlLeft, nlY, nlRight, nlY);
  for (var i = minV; i <= maxV; i++) {
    var tx = map(i, minV, maxV, nlLeft, nlRight);
    strokeWeight(i % 5 === 0 ? 2 : 1); line(tx, nlY - 8, tx, nlY + 8);
    noStroke(); fill(80); textSize(12); text(i, tx, nlY + 22); stroke(80);
  }
  if (ineqType < 4) {
    var px = map(ineqVal, minV, maxV, nlLeft, nlRight);
    var open = ineqType < 2;
    if (ineqType === 0 || ineqType === 2) {
      noStroke(); fill(80, 60, 200, 80);
      rect(px, nlY - 15, nlRight - px, 30);
      stroke(80, 60, 200); strokeWeight(3); line(px, nlY, nlRight, nlY);
    } else {
      noStroke(); fill(220, 100, 40, 80);
      rect(nlLeft, nlY - 15, px - nlLeft, 30);
      stroke(220, 100, 40); strokeWeight(3); line(nlLeft, nlY, px, nlY);
    }
    stroke(open ? color(255) : color(80, 60, 200)); strokeWeight(2);
    fill(open ? color(255) : color(80, 60, 200));
    ellipse(px, nlY, 14);
    if (open) { fill(245, 247, 252); noStroke(); ellipse(px, nlY, 8); }
  } else {
    var pa = map(rangeA, minV, maxV, nlLeft, nlRight);
    var pb = map(rangeB, minV, maxV, nlLeft, nlRight);
    noStroke(); fill(40, 180, 120, 80);
    rect(pa, nlY - 15, pb - pa, 30);
    stroke(40, 180, 120); strokeWeight(3); line(pa, nlY, pb, nlY);
    fill(255); stroke(40, 180, 120); strokeWeight(2);
    ellipse(pa, nlY, 14); ellipse(pb, nlY, 14);
    fill(245, 247, 252); noStroke(); ellipse(pa, nlY, 8); ellipse(pb, nlY, 8);
  }
  var open2 = ineqType < 2;
  noStroke(); fill(100); textSize(13);
  if (ineqType < 4) text(open2 ? "Open circle (not included)" : "Closed circle (included)", width / 2, nlY + 55);
  else text("Open circles = endpoints not included", width / 2, nlY + 55);
  var btnY = nlY + 80;
  for (var t = 0; t < TYPES.length; t++) {
    drawBtn(width / 2 + (t - 2) * 80, btnY, 70, 28, TYPES[t], t === ineqType);
  }
  drawBtn(width / 2 - 80, btnY + 36, 40, 28, "-");
  drawBtn(width / 2 + 40, btnY + 36, 40, 28, "+");
  noStroke(); fill(80); textSize(14); text("Value: " + ineqVal, width / 2, btnY + 50);
}
function drawBtn(x, y, w, h, label, active) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(active ? color(80, 60, 200) : (hov ? color(200, 210, 255) : 255));
  stroke(180); strokeWeight(1); rect(x, y, w, h, 6);
  noStroke(); fill(active ? 255 : 60); textSize(11); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height / 2 + 80;
  for (var t = 0; t < TYPES.length; t++) {
    if (hitB(width / 2 + (t - 2) * 80, btnY, 70, 28)) ineqType = t;
  }
  if (hitB(width / 2 - 80, btnY + 36, 40, 28)) { ineqVal = Math.max(-9, ineqVal - 1); rangeA = Math.max(-9, rangeA - 1); }
  if (hitB(width / 2 + 40, btnY + 36, 40, 28)) { ineqVal = Math.min(9, ineqVal + 1); rangeB = Math.min(9, rangeB + 1); }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
