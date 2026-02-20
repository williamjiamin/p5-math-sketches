/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var terms = [], simplified = "", probIdx = 0;
var PROBS = [
  { expr: "3x + 2x + 4", terms: [{c:3,v:"x"},{c:2,v:"x"},{c:4,v:""}], result: "5x + 4" },
  { expr: "2x + 3y + x + 5y", terms: [{c:2,v:"x"},{c:3,v:"y"},{c:1,v:"x"},{c:5,v:"y"}], result: "3x + 8y" },
  { expr: "4a − 2a + 7", terms: [{c:4,v:"a"},{c:-2,v:"a"},{c:7,v:""}], result: "2a + 7" },
  { expr: "5x + 3 − 2x + 1", terms: [{c:5,v:"x"},{c:3,v:""},{c:-2,v:"x"},{c:1,v:""}], result: "3x + 4" }
];
var showResult = false, step = 0;
function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER); loadProb();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function loadProb() { showResult = false; step = 0; }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Simplify Expressions", width / 2, 25); textStyle(NORMAL);
  var p = PROBS[probIdx];
  fill(30, 50, 120); textSize(20); text("Simplify: " + p.expr, width / 2, 65);
  var tileY = 110, tileH = 50, tileW = 60, gap = 10;
  var startX = width / 2 - (p.terms.length * (tileW + gap) - gap) / 2;
  var COLORS = { x: [80,60,200], y: [220,100,40], a: [40,160,80], "": [150,150,150] };
  for (var i = 0; i < p.terms.length; i++) {
    var t = p.terms[i];
    var col = COLORS[t.v] || [100,100,100];
    fill(col[0], col[1], col[2], 160); stroke(col[0], col[1], col[2]); strokeWeight(2);
    rect(startX + i * (tileW + gap), tileY, tileW, tileH, 8);
    noStroke(); fill(255); textSize(16); textStyle(BOLD);
    text((t.c > 0 && i > 0 ? "+" : "") + t.c + t.v, startX + i * (tileW + gap) + tileW / 2, tileY + tileH / 2);
    textStyle(NORMAL);
  }
  if (step >= 1) {
    var groups = {};
    for (var j = 0; j < p.terms.length; j++) {
      var key = p.terms[j].v || "const";
      if (!groups[key]) groups[key] = 0;
      groups[key] += p.terms[j].c;
    }
    var grpY = tileY + tileH + 30;
    fill(100); textSize(14); text("Group like terms:", width / 2, grpY);
    var grpStr = "";
    for (var k in groups) {
      if (grpStr) grpStr += " + ";
      grpStr += groups[k] + (k === "const" ? "" : k);
    }
    fill(80, 60, 200); textSize(18); textStyle(BOLD);
    text(grpStr, width / 2, grpY + 25); textStyle(NORMAL);
  }
  if (step >= 2) {
    fill(40, 160, 80); textSize(24); textStyle(BOLD);
    text("= " + p.result, width / 2, tileY + tileH + 90); textStyle(NORMAL);
  }
  var btnY = height - 70;
  drawBtn(width / 2 - 120, btnY, 100, 34, step < 2 ? "Next Step" : "Done!");
  drawBtn(width / 2 + 20, btnY, 100, 34, "New Problem");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(13); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 70;
  if (hitB(width / 2 - 120, btnY, 100, 34) && step < 2) step++;
  if (hitB(width / 2 + 20, btnY, 100, 34)) { probIdx = (probIdx + 1) % PROBS.length; loadProb(); }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
