/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var ratioA = 2, ratioB = 3;
var animA = 2, animB = 3;
var showEquiv = false;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  animA = lerp(animA, ratioA, 0.12); animB = lerp(animB, ratioB, 0.12);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Ratio Tape Diagrams", width / 2, 25); textStyle(NORMAL);
  fill(30, 50, 120); textSize(28); textStyle(BOLD);
  text(ratioA + " : " + ratioB, width / 2, 60); textStyle(NORMAL);
  var maxU = Math.max(ratioA, ratioB);
  var barW = (width - 120) * 0.7, unitW = barW / maxU;
  var barH = 40, bx = (width - barW) / 2, by = 100;
  fill(80); textSize(13); textAlign(LEFT, CENTER);
  text("A", bx - 25, by + barH / 2);
  for (var i = 0; i < Math.ceil(animA); i++) {
    var w = (i < Math.floor(animA)) ? unitW : unitW * (animA - Math.floor(animA));
    fill(80, 60, 200, 180); stroke(255); strokeWeight(2);
    rect(bx + i * unitW, by, Math.min(w, unitW) - 2, barH, 4);
  }
  by += 60;
  textAlign(LEFT, CENTER); fill(80); noStroke(); textSize(13);
  text("B", bx - 25, by + barH / 2);
  for (var j = 0; j < Math.ceil(animB); j++) {
    var w2 = (j < Math.floor(animB)) ? unitW : unitW * (animB - Math.floor(animB));
    fill(220, 100, 40, 180); stroke(255); strokeWeight(2);
    rect(bx + j * unitW, by, Math.min(w2, unitW) - 2, barH, 4);
  }
  textAlign(CENTER, CENTER);
  var exY = by + 60;
  fill(100); textSize(14);
  text("\"For every " + ratioA + " blue, there are " + ratioB + " orange\"", width / 2, exY);
  if (showEquiv) {
    exY += 30;
    fill(80); textSize(13); textStyle(BOLD); text("Equivalent ratios:", width / 2, exY); textStyle(NORMAL);
    for (var k = 1; k <= 4; k++) {
      text((ratioA * k) + " : " + (ratioB * k), width / 2, exY + k * 22);
    }
    exY += 110;
  } else { exY += 30; }
  var btnY = exY + 10;
  drawBtn(width / 2 - 180, btnY, 45, 32, "A-"); drawBtn(width / 2 - 130, btnY, 45, 32, "A+");
  drawBtn(width / 2 + 85, btnY, 45, 32, "B-"); drawBtn(width / 2 + 135, btnY, 45, 32, "B+");
  drawBtn(width / 2 - 60, btnY + 44, 120, 32, showEquiv ? "Hide Equiv" : "Equivalents");
  noStroke(); fill(80, 60, 200); textSize(15); textStyle(BOLD);
  text("A=" + ratioA, width / 2 - 50, btnY + 16); fill(220, 100, 40);
  text("B=" + ratioB, width / 2 + 50, btnY + 16); textStyle(NORMAL);
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(12); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var exY = (showEquiv ? 350 : 250);
  var btnY = exY;
  if (hitB(width / 2 - 180, btnY, 45, 32)) ratioA = Math.max(1, ratioA - 1);
  if (hitB(width / 2 - 130, btnY, 45, 32)) ratioA = Math.min(10, ratioA + 1);
  if (hitB(width / 2 + 85, btnY, 45, 32)) ratioB = Math.max(1, ratioB - 1);
  if (hitB(width / 2 + 135, btnY, 45, 32)) ratioB = Math.min(10, ratioB + 1);
  if (hitB(width / 2 - 60, btnY + 44, 120, 32)) showEquiv = !showEquiv;
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
