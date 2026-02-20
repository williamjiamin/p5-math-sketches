/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var numA = 12, numB = 18;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function primeFactors(n) {
  var f = {}; var d = 2;
  while (d * d <= n) { while (n % d === 0) { f[d] = (f[d] || 0) + 1; n /= d; } d++; }
  if (n > 1) f[n] = (f[n] || 0) + 1;
  return f;
}
function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
function lcm(a, b) { return a / gcd(a, b) * b; }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("GCD & LCM Visual", width / 2, 25); textStyle(NORMAL);
  var cx = width / 2, cy = 200, r = 100;
  var fA = primeFactors(numA), fB = primeFactors(numB);
  var allP = {}; var onlyA = {}, onlyB = {}, common = {};
  for (var p in fA) allP[p] = true;
  for (var p2 in fB) allP[p2] = true;
  for (var p3 in allP) {
    var a = fA[p3] || 0, b = fB[p3] || 0;
    var c = Math.min(a, b);
    if (c > 0) common[p3] = c;
    if (a > c) onlyA[p3] = a - c;
    if (b > c) onlyB[p3] = b - c;
  }
  fill(80, 60, 200, 30); noStroke();
  ellipse(cx - 55, cy, r * 2, r * 2);
  fill(220, 100, 40, 30);
  ellipse(cx + 55, cy, r * 2, r * 2);
  noFill(); stroke(80, 60, 200); strokeWeight(2);
  ellipse(cx - 55, cy, r * 2, r * 2);
  stroke(220, 100, 40);
  ellipse(cx + 55, cy, r * 2, r * 2);
  noStroke(); fill(80, 60, 200); textSize(16); textStyle(BOLD);
  text(numA, cx - 55, cy - r - 15); fill(220, 100, 40);
  text(numB, cx + 55, cy - r - 15); textStyle(NORMAL);
  fill(80, 60, 200); textSize(13);
  var oaStr = factorStr(onlyA); text(oaStr || "-", cx - 100, cy);
  fill(220, 100, 40);
  var obStr = factorStr(onlyB); text(obStr || "-", cx + 100, cy);
  fill(40, 140, 60); textStyle(BOLD);
  var cStr = factorStr(common); text(cStr || "1", cx, cy); textStyle(NORMAL);
  var g = gcd(numA, numB), l = lcm(numA, numB);
  var infoY = cy + r + 30;
  fill(40, 140, 60); textSize(18); textStyle(BOLD);
  text("GCD(" + numA + ", " + numB + ") = " + g, cx, infoY);
  fill(180, 60, 60);
  text("LCM(" + numA + ", " + numB + ") = " + l, cx, infoY + 28); textStyle(NORMAL);
  fill(80); textSize(12);
  text("Prime factorization: " + numA + " = " + fullFactorStr(fA) + "   |   " + numB + " = " + fullFactorStr(fB), cx, infoY + 58);
  var mlY = infoY + 90;
  fill(80); textSize(11); text("Multiples:", cx, mlY - 16);
  var mA = [], mB = [];
  for (var i = 1; i <= 12; i++) { mA.push(numA * i); mB.push(numB * i); }
  fill(80, 60, 200); textSize(10);
  text("A: " + mA.slice(0, 8).join(", ") + "...", cx, mlY);
  fill(220, 100, 40);
  text("B: " + mB.slice(0, 8).join(", ") + "...", cx, mlY + 14);
  var btnY = height - 40;
  drawBtn(cx - 200, btnY, 40, 30, "A-"); drawBtn(cx - 155, btnY, 40, 30, "A+");
  drawBtn(cx + 115, btnY, 40, 30, "B-"); drawBtn(cx + 160, btnY, 40, 30, "B+");
  noStroke(); fill(80, 60, 200); textSize(14); textStyle(BOLD);
  text("A=" + numA, cx - 177, btnY - 16); fill(220, 100, 40);
  text("B=" + numB, cx + 138, btnY - 16); textStyle(NORMAL);
}
function factorStr(f) {
  var parts = [];
  for (var p in f) { parts.push(f[p] > 1 ? p + "^" + f[p] : p); }
  return parts.join(" × ");
}
function fullFactorStr(f) {
  var parts = [];
  for (var p in f) { for (var i = 0; i < f[p]; i++) parts.push(p); }
  return parts.length ? parts.join(" × ") : "1";
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(13); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 40;
  if (hitB(width / 2 - 200, btnY, 40, 30)) numA = Math.max(1, numA - 1);
  if (hitB(width / 2 - 155, btnY, 40, 30)) numA = Math.min(100, numA + 1);
  if (hitB(width / 2 + 115, btnY, 40, 30)) numB = Math.max(1, numB - 1);
  if (hitB(width / 2 + 160, btnY, 40, 30)) numB = Math.min(100, numB + 1);
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
