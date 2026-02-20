/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var pct = 65;
var animPct = 65;
var examples = [
  { text: "75% of 200", base: 200, p: 75 },
  { text: "20% off $80", base: 80, p: 20 },
  { text: "40% of 50 apples", base: 50, p: 40 },
  { text: "90% battery", base: 100, p: 90 }
];
var curEx = 0;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  animPct = lerp(animPct, pct, 0.1);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Percentage Bars", width / 2, 30); textStyle(NORMAL);
  var barW = width * 0.7, barH = 40;
  var bx = (width - barW) / 2, by = 70;
  fill(220); stroke(180); strokeWeight(1); rect(bx, by, barW, barH, 10);
  noStroke(); fill(80, 60, 200);
  rect(bx, by, barW * animPct / 100, barH, animPct > 99 ? 10 : 0, 0, 0, animPct > 99 ? 10 : 0);
  fill(animPct > 50 ? 255 : 60); textSize(18); textStyle(BOLD);
  text(Math.round(animPct) + "%", bx + barW / 2, by + barH / 2); textStyle(NORMAL);
  var gSz = Math.min((width - 80) / 10, 28);
  var gx = width / 2 - gSz * 5, gy = by + barH + 25;
  var filled = Math.round(animPct);
  for (var r = 0; r < 10; r++) {
    for (var c = 0; c < 10; c++) {
      var idx = r * 10 + c;
      fill(idx < filled ? color(80, 60, 200, 180) : color(230, 232, 240));
      stroke(255); strokeWeight(1);
      rect(gx + c * gSz, gy + r * gSz, gSz, gSz, 1);
    }
  }
  var infoY = gy + gSz * 10 + 20;
  noStroke(); fill(60); textSize(14);
  text("Decimal: " + (pct / 100).toFixed(2) + "   |   Fraction: " + pct + "/100" + simpFrac(pct, 100), width / 2, infoY);
  var ex = examples[curEx];
  var result = Math.round(ex.base * ex.p / 100);
  fill(220, 100, 40); textSize(16); textStyle(BOLD);
  text(ex.text + " = " + result, width / 2, infoY + 30); textStyle(NORMAL);
  var btnY = infoY + 55;
  drawBtn(width / 2 - 195, btnY, 55, 34, "-10");
  drawBtn(width / 2 - 130, btnY, 55, 34, "-1");
  drawBtn(width / 2 - 25, btnY, 50, 34, "+1");
  drawBtn(width / 2 + 35, btnY, 55, 34, "+10");
  drawBtn(width / 2 + 110, btnY, 80, 34, "Example");
}
function simpFrac(n, d) {
  var g = gcd(n, d);
  if (g > 1 && n / g !== n) return " = " + (n / g) + "/" + (d / g);
  return "";
}
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(150); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(13); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var infoY = height - 80;
  var btnY = infoY;
  if (hitBtn(width / 2 - 195, btnY, 55, 34)) pct = Math.max(0, pct - 10);
  if (hitBtn(width / 2 - 130, btnY, 55, 34)) pct = Math.max(0, pct - 1);
  if (hitBtn(width / 2 - 25, btnY, 50, 34)) pct = Math.min(100, pct + 1);
  if (hitBtn(width / 2 + 35, btnY, 55, 34)) pct = Math.min(100, pct + 10);
  if (hitBtn(width / 2 + 110, btnY, 80, 34)) { curEx = (curEx + 1) % examples.length; pct = examples[curEx].p; }
}
function hitBtn(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
