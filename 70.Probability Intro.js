/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var mode = 0, flipCount = 0, heads = 0, tails = 0;
var diceRolls = [0,0,0,0,0,0], totalDice = 0, lastRoll = 0, rolling = false, rollTimer = 0;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Probability Intro", width / 2, 25); textStyle(NORMAL);
  if (rolling) { rollTimer++; if (rollTimer > 15) { rolling = false; } else { lastRoll = Math.floor(Math.random() * 6); } }
  if (mode === 0) drawCoinMode(); else drawDiceMode();
  drawBtn(width / 2 - 80, height - 45, 70, 28, "Coins", mode === 0);
  drawBtn(width / 2 + 10, height - 45, 70, 28, "Dice", mode === 1);
}
function drawCoinMode() {
  fill(30, 50, 120); textSize(16); text("Flip a coin! Theoretical: 50% heads, 50% tails", width / 2, 60);
  var cx = width / 2, cy = 180, r = 60;
  fill(255, 215, 0); stroke(200, 170, 0); strokeWeight(3); ellipse(cx, cy, r * 2, r * 2);
  noStroke(); fill(120, 80, 0); textSize(24); textStyle(BOLD);
  text(flipCount === 0 ? "?" : (lastRoll === 1 ? "H" : "T"), cx, cy); textStyle(NORMAL);
  drawBtn(cx - 40, cy + r + 15, 80, 32, "Flip!");
  drawBtn(cx - 50, cy + r + 55, 100, 28, "Flip 100x");
  var infoY = cy + r + 95;
  noStroke(); fill(80); textSize(14);
  text("Flips: " + flipCount + "  |  Heads: " + heads + " (" + (flipCount ? (heads / flipCount * 100).toFixed(1) : 0) + "%)  |  Tails: " + tails + " (" + (flipCount ? (tails / flipCount * 100).toFixed(1) : 0) + "%)", cx, infoY);
  if (flipCount > 10) {
    fill(100); textSize(12);
    text("As flips increase, percentages approach 50%", cx, infoY + 22);
  }
  drawBtn(cx - 35, infoY + 40, 70, 26, "Reset");
}
function drawDiceMode() {
  fill(30, 50, 120); textSize(16); text("Roll a die! Theoretical: each face = 1/6 ≈ 16.7%", width / 2, 60);
  var cx = width / 2, cy = 160;
  fill(255); stroke(80); strokeWeight(2); rect(cx - 30, cy - 30, 60, 60, 8);
  noStroke(); fill(30); textSize(30); textStyle(BOLD);
  text(totalDice === 0 ? "?" : (lastRoll + 1), cx, cy); textStyle(NORMAL);
  drawBtn(cx - 35, cy + 40, 70, 30, "Roll!");
  drawBtn(cx - 45, cy + 78, 90, 26, "Roll 100x");
  var barY = cy + 120, barH = 100, barW = 50;
  var startX = cx - 3 * (barW + 10);
  for (var i = 0; i < 6; i++) {
    var pct = totalDice > 0 ? diceRolls[i] / totalDice : 0;
    var h = pct * barH * 4;
    fill(80, 60, 200, 180); stroke(255); strokeWeight(1);
    rect(startX + i * (barW + 10), barY + barH - h, barW, h, 4, 4, 0, 0);
    noStroke(); fill(60); textSize(12); text(i + 1, startX + i * (barW + 10) + barW / 2, barY + barH + 14);
    textSize(10); text(diceRolls[i], startX + i * (barW + 10) + barW / 2, barY + barH - h - 10);
  }
  noStroke(); fill(80); textSize(13); text("Total rolls: " + totalDice, cx, barY + barH + 35);
  drawBtn(cx - 35, barY + barH + 50, 70, 24, "Reset");
}
function drawBtn(x, y, w, h, label, active) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(active ? color(80, 60, 200) : (hov ? color(200, 210, 255) : 255)); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(active ? 255 : 60); textSize(12); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function doFlip() { flipCount++; lastRoll = Math.random() < 0.5 ? 1 : 0; if (lastRoll) heads++; else tails++; }
function doRoll() { lastRoll = Math.floor(Math.random() * 6); diceRolls[lastRoll]++; totalDice++; }
function mousePressed() {
  if (hitB(width / 2 - 80, height - 45, 70, 28)) mode = 0;
  if (hitB(width / 2 + 10, height - 45, 70, 28)) mode = 1;
  var cx = width / 2;
  if (mode === 0) {
    if (hitB(cx - 40, 255, 80, 32)) doFlip();
    if (hitB(cx - 50, 295, 100, 28)) { for (var i = 0; i < 100; i++) doFlip(); }
    if (hitB(cx - 35, 380, 70, 26)) { flipCount = 0; heads = 0; tails = 0; }
  } else {
    if (hitB(cx - 35, 200, 70, 30)) { doRoll(); rolling = true; rollTimer = 0; }
    if (hitB(cx - 45, 238, 90, 26)) { for (var j = 0; j < 100; j++) doRoll(); }
    if (hitB(cx - 35, height - 95, 70, 24)) { diceRolls = [0,0,0,0,0,0]; totalDice = 0; }
  }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
