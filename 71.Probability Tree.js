/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var depth = 2, eventType = 0;
var EVENTS = [
  { name: "Coin Flip", branches: ["H(1/2)", "T(1/2)"], probs: [0.5, 0.5] },
  { name: "Die Roll (even/odd)", branches: ["Even(1/2)", "Odd(1/2)"], probs: [0.5, 0.5] },
  { name: "Spinner (R/G/B)", branches: ["R(1/3)", "G(1/3)", "B(1/3)"], probs: [0.333, 0.333, 0.334] }
];
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Probability Tree", width / 2, 25); textStyle(NORMAL);
  var ev = EVENTS[eventType];
  fill(80); textSize(14); text("Event: " + ev.name + "  |  Trials: " + depth, width / 2, 55);
  var startX = width / 2, startY = 85;
  drawTree(startX, startY, ev, depth, 0, width * 0.45);
  var btnY = height - 50;
  for (var i = 0; i < EVENTS.length; i++) {
    drawBtn(width / 2 + (i - 1) * 130 - 55, btnY, 110, 28, EVENTS[i].name, i === eventType);
  }
  drawBtn(width / 2 - 170, btnY - 35, 70, 26, "Depth -");
  drawBtn(width / 2 + 100, btnY - 35, 70, 26, "Depth +");
  noStroke(); fill(80); textSize(12); text("Depth: " + depth, width / 2, btnY - 22);
}
function drawTree(x, y, ev, d, level, spread) {
  if (d === 0) return;
  var n = ev.branches.length;
  var yStep = Math.min(80, (height - 180) / depth);
  for (var i = 0; i < n; i++) {
    var childX = x + (i - (n - 1) / 2) * spread;
    var childY = y + yStep;
    stroke(80, 60, 200, 150); strokeWeight(2);
    line(x, y, childX, childY);
    noStroke(); fill(80, 60, 200); textSize(Math.max(8, 12 - level));
    text(ev.branches[i], (x + childX) / 2 + (i < n / 2 ? -15 : 15), (y + childY) / 2 - 8);
    fill(80, 60, 200); noStroke(); ellipse(childX, childY, 8);
    drawTree(childX, childY, ev, d - 1, level + 1, spread / n);
  }
}
function drawBtn(x, y, w, h, label, active) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(active ? color(80, 60, 200) : (hov ? color(200, 210, 255) : 255)); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(active ? 255 : 60); textSize(10); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 50;
  for (var i = 0; i < EVENTS.length; i++) {
    if (hitB(width / 2 + (i - 1) * 130 - 55, btnY, 110, 28)) eventType = i;
  }
  if (hitB(width / 2 - 170, btnY - 35, 70, 26)) depth = Math.max(1, depth - 1);
  if (hitB(width / 2 + 100, btnY - 35, 70, 26)) depth = Math.min(4, depth + 1);
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
