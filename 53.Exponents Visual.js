/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var base = 3, exponent = 2;
function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Exponents Visual", width / 2, 25); textStyle(NORMAL);
  var result = Math.pow(base, exponent);
  fill(30, 50, 120); textSize(14);
  text(base + " to the power of " + exponent + " means:", width / 2, 60);
  var mulStr = "";
  for (var i = 0; i < exponent; i++) { mulStr += (i > 0 ? " × " : "") + base; }
  fill(80, 60, 200); textSize(24); textStyle(BOLD);
  text(base + "^" + exponent + " = " + mulStr + " = " + result, width / 2, 95); textStyle(NORMAL);
  if (exponent === 2) {
    var sz = Math.min(25, (width - 100) / base, (height - 280) / base);
    var gx = width / 2 - base * sz / 2, gy = 140;
    for (var r = 0; r < base; r++) {
      for (var c = 0; c < base; c++) {
        fill(80, 60, 200, 120 + c * 20); stroke(255); strokeWeight(1);
        rect(gx + c * sz, gy + r * sz, sz - 2, sz - 2, 3);
      }
    }
    noStroke(); fill(100); textSize(13);
    text("Area = " + base + " × " + base + " = " + result + " square units", width / 2, gy + base * sz + 18);
  } else if (exponent === 3) {
    var cubeSz = Math.min(18, (width - 100) / (base * 2), (height - 300) / (base * 2));
    var gx2 = width / 2 - base * cubeSz, gy2 = 160;
    for (var layer = 0; layer < base; layer++) {
      for (var r2 = 0; r2 < base; r2++) {
        for (var c2 = 0; c2 < base; c2++) {
          var px = gx2 + c2 * cubeSz + layer * cubeSz * 0.4;
          var py = gy2 + r2 * cubeSz - layer * cubeSz * 0.3;
          fill(80 + layer * 30, 60, 200 - layer * 30, 150); stroke(255); strokeWeight(0.5);
          rect(px, py, cubeSz - 1, cubeSz - 1, 1);
        }
      }
    }
    noStroke(); fill(100); textSize(13);
    text("Volume = " + base + "³ = " + result + " cubic units", width / 2, gy2 + base * cubeSz + 30);
  } else {
    var barW = Math.min(40, (width - 100) / exponent);
    var maxH = height - 350;
    var logMax = Math.log(result + 1);
    var bx = width / 2 - exponent * barW / 2, by = 350;
    for (var b = 0; b < exponent; b++) {
      var val = Math.pow(base, b + 1);
      var h = (Math.log(val + 1) / logMax) * maxH;
      fill(80 + b * 20, 60, 200 - b * 10, 180); stroke(255); strokeWeight(1);
      rect(bx + b * barW, by - h, barW - 4, h, 3);
      noStroke(); fill(60); textSize(10);
      text(base + "^" + (b + 1) + "=" + val, bx + b * barW + barW / 2, by + 14);
    }
  }
  var btnY = height - 50;
  noStroke(); fill(80); textSize(13);
  text("Base: " + base, width / 2 - 100, btnY - 10); text("Exponent: " + exponent, width / 2 + 100, btnY - 10);
  drawBtn(width / 2 - 150, btnY, 40, 30, "b-"); drawBtn(width / 2 - 70, btnY, 40, 30, "b+");
  drawBtn(width / 2 + 50, btnY, 40, 30, "e-"); drawBtn(width / 2 + 130, btnY, 40, 30, "e+");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6);
  noStroke(); fill(hov ? 255 : 60); textSize(13); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 50;
  if (hitB(width / 2 - 150, btnY, 40, 30)) base = Math.max(1, base - 1);
  if (hitB(width / 2 - 70, btnY, 40, 30)) base = Math.min(10, base + 1);
  if (hitB(width / 2 + 50, btnY, 40, 30)) exponent = Math.max(1, exponent - 1);
  if (hitB(width / 2 + 130, btnY, 40, 30)) exponent = Math.min(6, exponent + 1);
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
