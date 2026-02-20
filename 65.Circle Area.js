/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var numSlices = 8, rearrangeProgress = 0, rearranging = false, radius = 80;
function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  if (rearranging) { rearrangeProgress = Math.min(rearrangeProgress + 0.008, 1); if (rearrangeProgress >= 1) rearranging = false; }
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Circle Area — Slice Method", width / 2, 25); textStyle(NORMAL);
  var cx = width / 2 - 120, cy = 200;
  for (var i = 0; i < numSlices; i++) {
    var a1 = TWO_PI * i / numSlices - HALF_PI;
    var a2 = TWO_PI * (i + 1) / numSlices - HALF_PI;
    fill(i % 2 === 0 ? color(80, 60, 200, 150) : color(220, 100, 40, 150));
    stroke(255); strokeWeight(1);
    beginShape(); vertex(cx, cy);
    for (var a = a1; a <= a2; a += 0.05) vertex(cx + radius * cos(a), cy + radius * sin(a));
    vertex(cx + radius * cos(a2), cy + radius * sin(a2));
    endShape(CLOSE);
  }
  if (rearrangeProgress > 0) {
    var rx = width / 2 + 80, ry = cy + 50;
    var sliceW = (Math.PI * radius) / numSlices;
    for (var j = 0; j < numSlices; j++) {
      var isTop = j % 2 === 0;
      var sx = rx - numSlices * sliceW / 2 + j * sliceW;
      fill(isTop ? color(80, 60, 200, 150) : color(220, 100, 40, 150));
      stroke(255); strokeWeight(1);
      var triH = radius * rearrangeProgress;
      if (isTop) triangle(sx, ry, sx + sliceW, ry, sx + sliceW / 2, ry - triH);
      else triangle(sx, ry, sx + sliceW, ry, sx + sliceW / 2, ry + triH * 0.3);
    }
    noStroke(); fill(100); textSize(12);
    text("Width ≈ πr = " + (Math.PI * radius).toFixed(1), rx, ry + radius * 0.5);
    text("Height ≈ r = " + radius, rx + numSlices * sliceW / 2 + 30, ry - radius / 2);
    if (rearrangeProgress > 0.5) {
      fill(220, 60, 60); textSize(14); textStyle(BOLD);
      text("≈ Rectangle: πr × r = πr²", rx, ry + radius * 0.5 + 20);
      textStyle(NORMAL);
    }
  }
  var area = Math.PI * radius * radius;
  var infoY = cy + radius + 60;
  noStroke(); fill(80, 60, 200); textSize(18); textStyle(BOLD);
  text("Area = πr² = π × " + radius + "² = " + area.toFixed(1), width / 2, infoY); textStyle(NORMAL);
  var btnY = height - 55;
  drawBtn(width / 2 - 160, btnY, 70, 28, "Slices -"); drawBtn(width / 2 - 80, btnY, 70, 28, "Slices +");
  drawBtn(width / 2 + 10, btnY, 90, 28, "Rearrange");
  noStroke(); fill(80); textSize(12); text("Slices: " + numSlices, width / 2 - 120, btnY - 10);
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6);
  noStroke(); fill(hov ? 255 : 60); textSize(12); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 55;
  if (hitB(width / 2 - 160, btnY, 70, 28)) { numSlices = Math.max(4, numSlices - 2); rearrangeProgress = 0; }
  if (hitB(width / 2 - 80, btnY, 70, 28)) { numSlices = Math.min(24, numSlices + 2); rearrangeProgress = 0; }
  if (hitB(width / 2 + 10, btnY, 90, 28)) { rearranging = true; rearrangeProgress = 0; }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
