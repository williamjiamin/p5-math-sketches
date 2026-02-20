/* jshint esversion: 6 */
// ============================================================
// 31. Fractions on the Number Line — Interactive fraction placement
// ============================================================
const ORIG_W = 800;
const ORIG_H = 600;

var numerator = 3;
var denominator = 4;
var maxVal = 2;
var dragging = false;
var markerX = 0;

var lineY, lineLeft, lineRight, lineLen;
var btnPlusN, btnMinusN, btnPlusD, btnMinusD;
var particles = [];

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial");
  textAlign(CENTER, CENTER);
  computeLayout();
  buildButtons();
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  computeLayout();
  buildButtons();
}

function computeLayout() {
  lineY = height * 0.45;
  lineLeft = width * 0.08;
  lineRight = width * 0.92;
  lineLen = lineRight - lineLeft;
}

function buildButtons() {
  var bw = 36, bh = 30, panelX = width * 0.15, panelY = height * 0.72;
  btnPlusN  = { x: panelX,          y: panelY, w: bw, h: bh, label: "+", act: "n+" };
  btnMinusN = { x: panelX + bw + 6, y: panelY, w: bw, h: bh, label: "−", act: "n-" };
  btnPlusD  = { x: panelX + 140,    y: panelY, w: bw, h: bh, label: "+", act: "d+" };
  btnMinusD = { x: panelX + 140 + bw + 6, y: panelY, w: bw, h: bh, label: "−", act: "d-" };
}

function valToX(v) { return lineLeft + (v / maxVal) * lineLen; }
function xToVal(x) { return ((x - lineLeft) / lineLen) * maxVal; }

function draw() {
  background(245, 247, 252);
  drawTitle();
  drawNumberLine();
  drawSubdivisions();
  drawMarker();
  drawFractionInfo();
  drawControls();
  drawMixedNumber();
  updateParticles();
}

function drawTitle() {
  noStroke();
  fill(40, 40, 60);
  textSize(Math.min(22, width * 0.03));
  text("Fractions on the Number Line", width / 2, 28);
}

function drawNumberLine() {
  stroke(80, 85, 100);
  strokeWeight(3);
  line(lineLeft, lineY, lineRight, lineY);

  for (var i = 0; i <= maxVal; i++) {
    var x = valToX(i);
    strokeWeight(3);
    line(x, lineY - 14, x, lineY + 14);
    noStroke();
    fill(40, 40, 60);
    textSize(16);
    text(i, x, lineY + 32);
  }

  strokeWeight(2);
  stroke(80, 85, 100);
  var arrowSize = 8;
  line(lineRight, lineY, lineRight - arrowSize, lineY - arrowSize / 2);
  line(lineRight, lineY, lineRight - arrowSize, lineY + arrowSize / 2);
}

function drawSubdivisions() {
  stroke(160, 170, 200);
  strokeWeight(1);
  for (var i = 0; i <= maxVal * denominator; i++) {
    var v = i / denominator;
    var x = valToX(v);
    var isInteger = (i % denominator === 0);
    if (!isInteger) {
      line(x, lineY - 8, x, lineY + 8);
      noStroke();
      fill(130, 135, 155);
      textSize(10);
      text(i + "/" + denominator, x, lineY + 50);
      stroke(160, 170, 200);
      strokeWeight(1);
    }
  }
}

function drawMarker() {
  var fracVal = numerator / denominator;
  var targetX = valToX(Math.min(fracVal, maxVal));
  if (!dragging) {
    markerX += (targetX - markerX) * 0.12;
  }

  var my = lineY;
  stroke(220, 60, 100);
  strokeWeight(3);
  line(markerX, my - 22, markerX, my + 22);

  noStroke();
  fill(220, 60, 100);
  triangle(markerX - 10, my - 22, markerX + 10, my - 22, markerX, my - 10);

  fill(255);
  stroke(220, 60, 100);
  strokeWeight(2);
  ellipse(markerX, my - 32, 40, 26);
  noStroke();
  fill(220, 60, 100);
  textSize(13);
  text(numerator + "/" + denominator, markerX, my - 32);
}

function drawFractionInfo() {
  var fracVal = numerator / denominator;
  var decStr = nf(fracVal, 1, 3);

  fill(255, 255, 255, 220);
  stroke(215, 220, 235);
  strokeWeight(1);
  rect(width * 0.62, height * 0.68, width * 0.34, 100, 12);

  noStroke();
  fill(40, 40, 60);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(numerator + " / " + denominator + "  =  " + decStr, width * 0.79, height * 0.73);

  if (fracVal > 1) {
    var whole = Math.floor(fracVal);
    var remN = numerator - whole * denominator;
    fill(100, 60, 200);
    textSize(16);
    text("= " + whole + "  " + remN + "/" + denominator, width * 0.79, height * 0.8);
  }
}

function drawControls() {
  noStroke();
  fill(40, 40, 60);
  textSize(14);
  textAlign(LEFT, CENTER);
  text("Numerator: " + numerator, width * 0.08, height * 0.7);
  text("Denominator: " + denominator, width * 0.08 + 140, height * 0.7);

  var btns = [btnPlusN, btnMinusN, btnPlusD, btnMinusD];
  for (var i = 0; i < btns.length; i++) {
    var b = btns[i];
    var hover = mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h;
    fill(hover ? color(80, 60, 200) : color(100, 110, 240));
    noStroke();
    rect(b.x, b.y, b.w, b.h, 8);
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(b.label, b.x + b.w / 2, b.y + b.h / 2);
  }
}

function drawMixedNumber() {
  var fracVal = numerator / denominator;
  if (fracVal <= 1) return;

  var whole = Math.floor(fracVal);
  var remN = numerator - whole * denominator;

  fill(100, 60, 200, 40);
  noStroke();
  var x0 = valToX(0);
  var x1 = valToX(whole);
  rect(x0, lineY - 5, x1 - x0, 10, 3);

  if (remN > 0) {
    fill(220, 60, 100, 40);
    var x2 = valToX(fracVal);
    rect(x1, lineY - 5, x2 - x1, 10, 3);
  }
}

function updateParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.life -= 3;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    noStroke();
    fill(p.r, p.g, p.b, p.life);
    ellipse(p.x, p.y, p.s, p.s);
  }
}

function spawnParticles(x, y) {
  for (var k = 0; k < 8; k++) {
    particles.push({
      x: x, y: y, vx: random(-2, 2), vy: random(-3, -0.5),
      life: 200, s: random(3, 7),
      r: random(80, 240), g: random(80, 200), b: random(120, 255)
    });
  }
}

function mousePressed() {
  var btns = [btnPlusN, btnMinusN, btnPlusD, btnMinusD];
  for (var i = 0; i < btns.length; i++) {
    var b = btns[i];
    if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
      doAction(b.act);
      spawnParticles(b.x + b.w / 2, b.y + b.h / 2);
      return;
    }
  }

  if (Math.abs(mouseY - lineY) < 30 && mouseX > lineLeft && mouseX < lineRight) {
    dragging = true;
    snapMarker();
  }
}

function mouseDragged() {
  if (dragging) snapMarker();
}

function mouseReleased() {
  dragging = false;
}

function snapMarker() {
  var v = xToVal(constrain(mouseX, lineLeft, lineRight));
  var bestDist = 999;
  var bestN = numerator;
  for (var i = 0; i <= maxVal * denominator; i++) {
    var fv = i / denominator;
    var d = Math.abs(v - fv);
    if (d < bestDist) { bestDist = d; bestN = i; }
  }
  numerator = bestN;
  markerX = valToX(numerator / denominator);
}

function doAction(act) {
  if (act === "n+" && numerator < maxVal * denominator) numerator++;
  if (act === "n-" && numerator > 0) numerator--;
  if (act === "d+" && denominator < 12) {
    denominator++;
    if (numerator > maxVal * denominator) numerator = maxVal * denominator;
  }
  if (act === "d-" && denominator > 2) {
    denominator--;
    if (numerator > maxVal * denominator) numerator = maxVal * denominator;
  }
}
