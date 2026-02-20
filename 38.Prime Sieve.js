/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var grid = [];
var sieveStep = 0, currentPrime = 2, sieving = false;
var crossIdx = 0, speed = 2;
var PRIMES_COLORS = {};
var colorIdx = 0;
var COLORS = [[220,60,60],[60,60,220],[40,180,80],[220,160,40],[180,60,180],[60,180,180],[220,120,60],[120,60,220]];

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
  resetSieve();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function resetSieve() {
  grid = [];
  for (var i = 0; i <= 100; i++) grid[i] = { val: i, prime: i >= 2, crossed: false, color: null };
  grid[0].prime = false; grid[1].prime = false;
  sieveStep = 0; currentPrime = 2; sieving = false; crossIdx = 0; colorIdx = 0;
  PRIMES_COLORS = {};
}
function draw() {
  background(245, 247, 252);
  if (sieving && frameCount % Math.max(1, 4 - speed) === 0) stepSieve();
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Sieve of Eratosthenes", width / 2, 25); textStyle(NORMAL);
  var cellSz = Math.min((width - 40) / 10, (height - 140) / 10);
  var gx = width / 2 - cellSz * 5, gy = 55;
  for (var r = 0; r < 10; r++) {
    for (var c = 0; c < 10; c++) {
      var n = r * 10 + c + 1;
      if (n > 100) break;
      var g = grid[n];
      var x = gx + c * cellSz, y = gy + r * cellSz;
      if (g.crossed && g.color) {
        fill(g.color[0], g.color[1], g.color[2], 60);
      } else if (g.prime && (sieveStep > 0 || !sieving)) {
        fill(255, 215, 0, sieving ? 80 : 180);
      } else fill(240);
      stroke(200); strokeWeight(1); rect(x, y, cellSz, cellSz, 2);
      noStroke();
      if (g.crossed) { fill(160); textSize(cellSz * 0.35); }
      else if (g.prime) { fill(40, 40, 100); textSize(cellSz * 0.38); textStyle(BOLD); }
      else { fill(100); textSize(cellSz * 0.35); }
      text(n, x + cellSz / 2, y + cellSz / 2); textStyle(NORMAL);
      if (g.crossed) {
        stroke(g.color ? color(g.color[0], g.color[1], g.color[2]) : color(200, 60, 60));
        strokeWeight(2);
        line(x + 4, y + 4, x + cellSz - 4, y + cellSz - 4);
        line(x + cellSz - 4, y + 4, x + 4, y + cellSz - 4);
      }
    }
  }
  var infoY = gy + cellSz * 10 + 10;
  noStroke(); fill(100); textSize(13);
  if (sieving) {
    fill(220, 100, 40); textStyle(BOLD);
    text("Crossing out multiples of " + currentPrime + "...", width / 2, infoY);
    textStyle(NORMAL);
  } else if (sieveStep > 0) {
    var primeCount = 0;
    for (var i = 2; i <= 100; i++) if (grid[i].prime) primeCount++;
    fill(40, 140, 60); textStyle(BOLD);
    text("Done! Found " + primeCount + " primes from 1 to 100", width / 2, infoY);
    textStyle(NORMAL);
  }
  var btnY = infoY + 22;
  drawBtn(width / 2 - 90, btnY, 80, 32, sieving ? "Running..." : (sieveStep > 0 ? "Reset" : "Start"));
  drawBtn(width / 2 + 10, btnY, 80, 32, "Speed: " + speed);
}
function stepSieve() {
  if (currentPrime > 10) { sieving = false; return; }
  var mult = currentPrime * (crossIdx + 2);
  if (mult <= 100) {
    if (!grid[mult].crossed) {
      grid[mult].crossed = true; grid[mult].prime = false;
      if (!PRIMES_COLORS[currentPrime]) { PRIMES_COLORS[currentPrime] = COLORS[colorIdx % COLORS.length]; colorIdx++; }
      grid[mult].color = PRIMES_COLORS[currentPrime];
    }
    crossIdx++;
  } else {
    crossIdx = 0; sieveStep++;
    do { currentPrime++; } while (currentPrime <= 10 && grid[currentPrime].crossed);
    if (currentPrime > 10) sieving = false;
  }
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(12); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var infoY = height - 50;
  var btnY = infoY;
  if (hitB(width / 2 - 90, btnY, 80, 32)) {
    if (sieving) return;
    if (sieveStep > 0) resetSieve();
    else { sieving = true; sieveStep = 1; }
  }
  if (hitB(width / 2 + 10, btnY, 80, 32)) speed = (speed % 3) + 1;
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
