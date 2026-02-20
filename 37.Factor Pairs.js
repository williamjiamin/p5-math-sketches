/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var num = 12;
var pairs = [];
var animProgress = 0;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
  computePairs();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function computePairs() {
  pairs = [];
  for (var i = 1; i <= Math.sqrt(num); i++) {
    if (num % i === 0) pairs.push([i, num / i]);
  }
  animProgress = 0;
}
function isPrime(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) { if (n % i === 0) return false; } return true; }
function draw() {
  background(245, 247, 252);
  animProgress = Math.min(animProgress + 0.02, pairs.length);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Factor Pairs", width / 2, 28); textStyle(NORMAL);
  fill(30, 50, 120); textSize(32); textStyle(BOLD);
  text(num, width / 2, 65); textStyle(NORMAL);
  if (isPrime(num)) { fill(220, 160, 40); textSize(14); text("(Prime Number!)", width / 2, 90); }
  var maxCols = Math.min(4, pairs.length);
  var cellW = Math.min(160, (width - 40) / maxCols);
  var startY = 115;
  for (var p = 0; p < pairs.length; p++) {
    if (p >= animProgress) break;
    var fade = Math.min(1, animProgress - p);
    var col = Math.floor(p % maxCols);
    var row = Math.floor(p / maxCols);
    var cx = width / 2 + (col - (Math.min(pairs.length, maxCols) - 1) / 2) * cellW;
    var cy = startY + row * 200;
    push(); translate(cx, cy);
    var a = pairs[p][0], b = pairs[p][1];
    var dotSz = Math.min(12, 100 / Math.max(a, b));
    var gw = b * dotSz, gh = a * dotSz;
    fill(80, 60, 200, fade * 40); noStroke();
    rect(-gw / 2, 10, gw, gh, 4);
    for (var r = 0; r < a; r++) {
      for (var c = 0; c < b; c++) {
        fill(80, 60, 200, fade * 200); noStroke();
        ellipse(-gw / 2 + c * dotSz + dotSz / 2, 10 + r * dotSz + dotSz / 2, dotSz * 0.7);
      }
    }
    noStroke(); fill(60, 40, 120, fade * 255); textSize(14); textStyle(BOLD);
    text(a + " × " + b, 0, gh + 28); textStyle(NORMAL);
    pop();
  }
  noStroke(); fill(80); textSize(13);
  var factorList = "Factors of " + num + ": ";
  var allF = [];
  for (var i = 1; i <= num; i++) { if (num % i === 0) allF.push(i); }
  text(factorList + allF.join(", "), width / 2, height - 70);
  text(pairs.length + " factor pair(s)", width / 2, height - 50);
  var btnY = height - 35;
  drawBtn(width / 2 - 130, btnY, 55, 30, "-10"); drawBtn(width / 2 - 70, btnY, 45, 30, "-1");
  drawBtn(width / 2 + 25, btnY, 45, 30, "+1"); drawBtn(width / 2 + 75, btnY, 55, 30, "+10");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(13); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 35;
  if (hitB(width / 2 - 130, btnY, 55, 30)) { num = Math.max(1, num - 10); computePairs(); }
  if (hitB(width / 2 - 70, btnY, 45, 30)) { num = Math.max(1, num - 1); computePairs(); }
  if (hitB(width / 2 + 25, btnY, 45, 30)) { num = Math.min(100, num + 1); computePairs(); }
  if (hitB(width / 2 + 75, btnY, 55, 30)) { num = Math.min(100, num + 10); computePairs(); }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
