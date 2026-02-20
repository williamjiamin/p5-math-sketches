/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var num = 16;
function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Square Roots", width / 2, 25); textStyle(NORMAL);
  var root = Math.sqrt(num);
  var isPerf = root === Math.floor(root);
  fill(30, 50, 120); textSize(16);
  text("If a square has area " + num + ", what is its side length?", width / 2, 60);
  fill(80, 60, 200); textSize(28); textStyle(BOLD);
  text("√" + num + " = " + (isPerf ? root : root.toFixed(3)), width / 2, 95); textStyle(NORMAL);
  if (isPerf && root <= 12) {
    var sz = Math.min(25, (width - 100) / root, (height - 280) / root);
    var gx = width / 2 - root * sz / 2, gy = 130;
    for (var r = 0; r < root; r++) {
      for (var c = 0; c < root; c++) {
        fill(80, 60, 200, 100 + (r + c) * 8); stroke(255); strokeWeight(1);
        rect(gx + c * sz, gy + r * sz, sz - 2, sz - 2, 2);
      }
    }
    fill(220, 100, 40); textSize(14); textStyle(BOLD);
    text("Side = " + root, gx + root * sz / 2, gy + root * sz + 18);
    text("Area = " + root + " × " + root + " = " + num, width / 2, gy + root * sz + 38);
    textStyle(NORMAL);
  }
  var nlY = height - 160;
  stroke(80); strokeWeight(2);
  line(80, nlY, width - 80, nlY);
  for (var i = 0; i <= 10; i++) {
    var tx = map(i, 0, 10, 80, width - 80);
    line(tx, nlY - 6, tx, nlY + 6);
    noStroke(); fill(80); textSize(11); text(i, tx, nlY + 18); stroke(80); strokeWeight(2);
  }
  var rootX = map(root, 0, 10, 80, width - 80);
  fill(220, 60, 60); noStroke(); ellipse(rootX, nlY, 12);
  fill(220, 60, 60); textSize(12); textStyle(BOLD);
  text("√" + num + " ≈ " + root.toFixed(2), rootX, nlY - 18); textStyle(NORMAL);
  if (!isPerf) {
    var lo = Math.floor(root), hi = lo + 1;
    fill(100); textSize(12);
    text(lo + "² = " + (lo * lo) + " < " + num + " < " + (hi * hi) + " = " + hi + "²", width / 2, nlY + 40);
    text("So √" + num + " is between " + lo + " and " + hi, width / 2, nlY + 58);
  }
  var btnY = height - 40;
  drawBtn(width / 2 - 130, btnY, 50, 30, "-10"); drawBtn(width / 2 - 75, btnY, 40, 30, "-1");
  drawBtn(width / 2 + 35, btnY, 40, 30, "+1"); drawBtn(width / 2 + 80, btnY, 50, 30, "+10");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6);
  noStroke(); fill(hov ? 255 : 60); textSize(13); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 40;
  if (hitB(width / 2 - 130, btnY, 50, 30)) num = Math.max(1, num - 10);
  if (hitB(width / 2 - 75, btnY, 40, 30)) num = Math.max(1, num - 1);
  if (hitB(width / 2 + 35, btnY, 40, 30)) num = Math.min(144, num + 1);
  if (hitB(width / 2 + 80, btnY, 50, 30)) num = Math.min(144, num + 10);
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
