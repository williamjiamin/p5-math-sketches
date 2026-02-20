/* jshint esversion: 6 */
// ============================================================
// 32. Fraction Operations — Visual addition & subtraction
// ============================================================
const ORIG_W = 800;
const ORIG_H = 600;

var frac1 = { n: 1, d: 3 };
var frac2 = { n: 1, d: 4 };
var opMode = "add";

var animProgress = 0;
var animating = false;
var showSteps = true;

var btnToggleOp, btnNewProblem, btnAnimate;
var particles = [];

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial");
  textAlign(CENTER, CENTER);
  buildButtons();
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  buildButtons();
}

function buildButtons() {
  var bw = 130, bh = 34, y = height * 0.88;
  btnToggleOp  = { x: width * 0.15, y: y, w: bw, h: bh, label: opMode === "add" ? "Switch to −" : "Switch to +" };
  btnNewProblem = { x: width * 0.42, y: y, w: bw, h: bh, label: "New Problem" };
  btnAnimate   = { x: width * 0.69, y: y, w: bw, h: bh, label: "Animate" };
}

function lcm(a, b) { return (a * b) / gcd(a, b); }
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function draw() {
  background(245, 247, 252);

  if (animating) {
    animProgress = Math.min(animProgress + 0.012, 1);
    if (animProgress >= 1) animating = false;
  }

  drawTitle();
  drawFractionBars();
  drawSteps();
  drawResult();
  drawButtonRow();
  updateParticles();
}

function drawTitle() {
  noStroke();
  fill(40, 40, 60);
  textSize(Math.min(22, width * 0.03));
  text("Fraction Operations", width / 2, 28);
}

function drawFractionBars() {
  var barLeft = width * 0.06;
  var barW = width * 0.88;
  var barH = 36;
  var y1 = height * 0.12;
  var y2 = height * 0.22;
  var y3 = height * 0.34;

  var lcd = lcm(frac1.d, frac2.d);
  var conv1 = frac1.n * (lcd / frac1.d);
  var conv2 = frac2.n * (lcd / frac2.d);

  drawBar(barLeft, y1, barW, barH, frac1.n, frac1.d, color(80, 160, 255), "Fraction 1:  " + frac1.n + "/" + frac1.d);
  drawBar(barLeft, y2, barW, barH, frac2.n, frac2.d, color(255, 140, 80), "Fraction 2:  " + frac2.n + "/" + frac2.d);

  if (animProgress > 0.3) {
    var p = constrain((animProgress - 0.3) / 0.4, 0, 1);
    var subH = barH * p;
    drawBar(barLeft, y3, barW, subH, conv1, lcd, color(80, 160, 255, 200), "Converted:  " + conv1 + "/" + lcd);
    drawBar(barLeft, y3 + subH + 8, barW, subH, conv2, lcd, color(255, 140, 80, 200), "Converted:  " + conv2 + "/" + lcd);
  }

  if (animProgress > 0.75) {
    var resultN = opMode === "add" ? conv1 + conv2 : Math.max(conv1 - conv2, 0);
    var resultD = lcd;
    var rp = constrain((animProgress - 0.75) / 0.25, 0, 1);
    var ry = height * 0.56;
    var resultColor = opMode === "add" ? color(100, 200, 120) : color(230, 120, 80);
    drawBar(barLeft, ry, barW, barH * rp, resultN, resultD, resultColor, "Result:  " + resultN + "/" + resultD);
  }
}

function drawBar(x, y, totalW, h, numer, denom, c, label) {
  stroke(200, 205, 220);
  strokeWeight(1);
  fill(240, 242, 248);
  rect(x, y, totalW, h, 4);

  var segW = totalW / denom;
  noStroke();
  for (var i = 0; i < numer; i++) {
    fill(c);
    rect(x + i * segW + 1, y + 1, segW - 2, h - 2, 3);
  }

  stroke(200, 205, 220);
  strokeWeight(1);
  for (var j = 1; j < denom; j++) {
    var lx = x + j * segW;
    line(lx, y, lx, y + h);
  }

  noStroke();
  fill(40, 40, 60);
  textSize(12);
  textAlign(LEFT, CENTER);
  text(label, x, y - 10);
  textAlign(CENTER, CENTER);
}

function drawSteps() {
  if (!showSteps || animProgress < 0.1) return;

  var lcd = lcm(frac1.d, frac2.d);
  var conv1 = frac1.n * (lcd / frac1.d);
  var conv2 = frac2.n * (lcd / frac2.d);
  var resultN = opMode === "add" ? conv1 + conv2 : Math.max(conv1 - conv2, 0);
  var g = gcd(resultN, lcd);
  var simpN = resultN / g;
  var simpD = lcd / g;

  var sx = width * 0.06;
  var sy = height * 0.68;

  fill(255, 255, 255, 220);
  stroke(215, 220, 235);
  strokeWeight(1);
  rect(sx, sy, width * 0.88, 90, 10);

  noStroke();
  fill(40, 40, 60);
  textSize(13);
  textAlign(LEFT, CENTER);

  var step1visible = animProgress > 0.1;
  var step2visible = animProgress > 0.4;
  var step3visible = animProgress > 0.75;

  if (step1visible) {
    text("Step 1: LCD of " + frac1.d + " and " + frac2.d + " = " + lcd, sx + 14, sy + 18);
  }
  if (step2visible) {
    var op = opMode === "add" ? "+" : "−";
    text("Step 2: Convert → " + conv1 + "/" + lcd + "  " + op + "  " + conv2 + "/" + lcd, sx + 14, sy + 42);
  }
  if (step3visible) {
    var opSymbol = opMode === "add" ? "+" : "−";
    var line3 = "Step 3: " + conv1 + " " + opSymbol + " " + conv2 + " = " + resultN + "/" + lcd;
    if (g > 1) line3 += "  =  " + simpN + "/" + simpD + "  (simplified)";
    text(line3, sx + 14, sy + 66);
  }

  textAlign(CENTER, CENTER);
}

function drawResult() {
  if (animProgress < 1) return;

  var lcd = lcm(frac1.d, frac2.d);
  var conv1 = frac1.n * (lcd / frac1.d);
  var conv2 = frac2.n * (lcd / frac2.d);
  var resultN = opMode === "add" ? conv1 + conv2 : Math.max(conv1 - conv2, 0);
  var g = gcd(resultN, lcd);
  var simpN = resultN / g;
  var simpD = lcd / g;
  var op = opMode === "add" ? " + " : " − ";

  fill(80, 60, 200);
  textSize(18);
  text(frac1.n + "/" + frac1.d + op + frac2.n + "/" + frac2.d + "  =  " + simpN + "/" + simpD, width / 2, height * 0.64);
}

function drawButtonRow() {
  var btns = [btnToggleOp, btnNewProblem, btnAnimate];
  for (var i = 0; i < btns.length; i++) {
    var b = btns[i];
    var hover = mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h;
    fill(hover ? color(80, 60, 200) : color(100, 110, 240));
    noStroke();
    rect(b.x, b.y, b.w, b.h, 8);
    fill(255);
    textSize(13);
    text(b.label, b.x + b.w / 2, b.y + b.h / 2);
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
  for (var k = 0; k < 10; k++) {
    particles.push({
      x: x, y: y, vx: random(-3, 3), vy: random(-4, -1),
      life: 220, s: random(4, 8),
      r: random(80, 255), g: random(80, 200), b: random(100, 255)
    });
  }
}

function mousePressed() {
  var btns = [btnToggleOp, btnNewProblem, btnAnimate];
  for (var i = 0; i < btns.length; i++) {
    var b = btns[i];
    if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
      if (b === btnToggleOp) {
        opMode = opMode === "add" ? "sub" : "add";
        btnToggleOp.label = opMode === "add" ? "Switch to −" : "Switch to +";
        animProgress = 0;
        animating = true;
      } else if (b === btnNewProblem) {
        generateProblem();
      } else if (b === btnAnimate) {
        animProgress = 0;
        animating = true;
      }
      spawnParticles(b.x + b.w / 2, b.y + b.h / 2);
      return;
    }
  }
}

function generateProblem() {
  var denoms = [2, 3, 4, 5, 6, 8, 10, 12];
  frac1.d = denoms[Math.floor(random(denoms.length))];
  frac2.d = denoms[Math.floor(random(denoms.length))];
  frac1.n = Math.floor(random(1, frac1.d));
  frac2.n = Math.floor(random(1, frac2.d));
  if (opMode === "sub" && (frac1.n / frac1.d) < (frac2.n / frac2.d)) {
    var tmp = { n: frac1.n, d: frac1.d };
    frac1.n = frac2.n; frac1.d = frac2.d;
    frac2.n = tmp.n; frac2.d = tmp.d;
  }
  animProgress = 0;
  animating = true;
}
