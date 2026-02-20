/* jshint esversion: 6 */
// ============================================================
// 29. Fraction Bars — Visual Tape Diagram Fractions
// ============================================================
// Horizontal bars split into equal parts with shading.
// +/- for numerator/denominator. Shows equivalent fractions
// by aligning bars. Animates splitting when denominator changes.

const ORIG_W = 800;
const ORIG_H = 600;

var numerator = 3;
var denominator = 4;
var animDenom = 4;
var animProgress = 1;
var equivFractions = [];
var showEquiv = false;
var particles = [];

var COL_BG, COL_TEXT, COL_MUTED, COL_ACCENT, COL_BAR_FILL, COL_BAR_EMPTY;
var COL_BAR_BORDER, COL_BTN, COL_BTN_H, COL_CARD, COL_EQUIV;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial");
  initColors();
  computeEquivalents();
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
}

function initColors() {
  COL_BG = color(245, 247, 252);
  COL_TEXT = color(40, 40, 60);
  COL_MUTED = color(130, 135, 150);
  COL_ACCENT = color(66, 133, 244);
  COL_BAR_FILL = color(100, 180, 255);
  COL_BAR_EMPTY = color(235, 240, 248);
  COL_BAR_BORDER = color(150, 165, 200);
  COL_BTN = color(100, 120, 200);
  COL_BTN_H = color(80, 100, 180);
  COL_CARD = color(255);
  COL_EQUIV = color(255, 180, 100);
}

function computeEquivalents() {
  equivFractions = [];
  var g = gcd(numerator, denominator);
  var simpNum = numerator / g;
  var simpDen = denominator / g;

  for (var m = 1; m <= 12; m++) {
    var en = simpNum * m;
    var ed = simpDen * m;
    if (ed <= 12 && ed !== denominator) {
      equivFractions.push({ n: en, d: ed });
    }
  }
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { var t = b; b = a % b; a = t; }
  return a;
}

function draw() {
  background(COL_BG);

  if (animProgress < 1) {
    animProgress += 0.04;
    if (animProgress > 1) animProgress = 1;
  }

  drawTitle();
  drawFractionDisplay();
  drawWholeBar();
  drawFractionBar();
  if (showEquiv) drawEquivalentBars();
  drawControls();
  updateParticles();
  drawParticles();
}

function drawTitle() {
  fill(COL_TEXT);
  noStroke();
  textSize(22);
  textAlign(CENTER, TOP);
  text("Fraction Bars", width / 2, 14);
}

function drawFractionDisplay() {
  var fx = width / 2;
  var fy = 55;

  fill(COL_CARD);
  noStroke();
  rect(fx - 60, fy - 8, 120, 60, 12);

  fill(COL_TEXT);
  textSize(30);
  textAlign(CENTER, CENTER);
  text(numerator, fx, fy + 8);
  stroke(COL_TEXT);
  strokeWeight(2);
  line(fx - 30, fy + 25, fx + 30, fy + 25);
  noStroke();
  text(denominator, fx, fy + 42);

  // Simplified form
  var g = gcd(numerator, denominator);
  if (g > 1 && numerator > 0) {
    fill(COL_ACCENT);
    textSize(16);
    text("= " + (numerator / g) + "/" + (denominator / g), fx + 80, fy + 25);
  }

  // Decimal
  fill(COL_MUTED);
  textSize(13);
  var dec = (numerator / denominator).toFixed(3);
  text("≈ " + dec, fx + 80, fy + 48);
}

function drawWholeBar() {
  var barX = width * 0.1;
  var barW = width * 0.8;
  var barY = 135;
  var barH = 36;

  // Label
  fill(COL_MUTED);
  noStroke();
  textSize(13);
  textAlign(LEFT, CENTER);
  text("1 whole", barX, barY - 12);

  // Bar
  fill(COL_BAR_FILL);
  stroke(COL_BAR_BORDER);
  strokeWeight(1.5);
  rect(barX, barY, barW, barH, 6);

  fill(255, 255, 255, 80);
  noStroke();
  rect(barX + 2, barY + 2, barW - 4, barH / 3, 4);

  fill(COL_TEXT);
  noStroke();
  textSize(15);
  textAlign(CENTER, CENTER);
  text("1", barX + barW / 2, barY + barH / 2);
}

function drawFractionBar() {
  var barX = width * 0.1;
  var barW = width * 0.8;
  var barY = 195;
  var barH = 40;

  // Label
  fill(COL_MUTED);
  noStroke();
  textSize(13);
  textAlign(LEFT, CENTER);
  text(numerator + "/" + denominator, barX, barY - 12);

  // Animate the splitting
  var displayDenom = denominator;
  var partW = barW / displayDenom;
  var animScale = easeOutBack(animProgress);

  for (var i = 0; i < displayDenom; i++) {
    var px = barX + i * partW;
    var isFilled = (i < numerator);

    var gapAnim = (1 - animScale) * partW * 0.3;
    var drawX = px + gapAnim / 2;
    var drawW = partW - gapAnim;

    if (isFilled) {
      fill(lerpColor(color(80, 160, 255), color(50, 120, 220), i / displayDenom));
    } else {
      fill(COL_BAR_EMPTY);
    }

    stroke(COL_BAR_BORDER);
    strokeWeight(1.5);
    var rLeft = (i === 0) ? 6 : 0;
    var rRight = (i === displayDenom - 1) ? 6 : 0;
    rect(drawX, barY, drawW, barH, rLeft, rRight, rRight, rLeft);

    // Shine on filled parts
    if (isFilled) {
      noStroke();
      fill(255, 255, 255, 50);
      rect(drawX + 1, barY + 1, drawW - 2, barH / 3, rLeft, rRight, 0, 0);
    }

    // Part label
    fill(isFilled ? color(255) : COL_MUTED);
    noStroke();
    textSize(Math.min(12, partW * 0.5));
    textAlign(CENTER, CENTER);
    if (partW > 20) {
      text("1/" + displayDenom, drawX + drawW / 2, barY + barH / 2);
    }
  }

  // Percentage
  fill(COL_TEXT);
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  var pct = Math.round((numerator / denominator) * 100);
  text(pct + "%", barX + barW + 10, barY + barH / 2);
}

function drawEquivalentBars() {
  var barX = width * 0.1;
  var barW = width * 0.8;
  var startY = 260;
  var barH = 30;
  var gap = 10;

  fill(COL_TEXT);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text("Equivalent fractions:", barX, startY - 18);

  var maxShow = Math.min(equivFractions.length, 5);
  for (var e = 0; e < maxShow; e++) {
    var eq = equivFractions[e];
    var ey = startY + e * (barH + gap);
    var partW = barW / eq.d;

    // Label
    fill(COL_MUTED);
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);
    text(eq.n + "/" + eq.d, barX - 2, ey - 10);

    for (var i = 0; i < eq.d; i++) {
      var px = barX + i * partW;
      var isFilled = (i < eq.n);

      fill(isFilled ? COL_EQUIV : COL_BAR_EMPTY);
      stroke(COL_BAR_BORDER);
      strokeWeight(1);
      var rL = (i === 0) ? 4 : 0;
      var rR = (i === eq.d - 1) ? 4 : 0;
      rect(px, ey, partW, barH, rL, rR, rR, rL);
    }

    // Equal sign
    if (e === 0) {
      fill(COL_ACCENT);
      noStroke();
      textSize(16);
      textAlign(LEFT, CENTER);
      text("=", barX + barW + 10, ey + barH / 2);
    }
  }
}

function easeOutBack(t) {
  var c = 1.4;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

function drawControls() {
  var cy = height - 100;
  var bw = 38, bh = 34, gap = 10;
  var cx = width / 2;

  // Numerator controls
  fill(COL_TEXT);
  noStroke();
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Numerator", cx - 100, cy - 18);

  drawBtn(cx - 140, cy, bw, bh, "−", "numMinus");
  fill(COL_TEXT);
  noStroke();
  textSize(20);
  textAlign(CENTER, CENTER);
  text(numerator, cx - 100, cy + bh / 2);
  drawBtn(cx - 60 - bw, cy, bw, bh, "+", "numPlus");

  // Denominator controls
  fill(COL_TEXT);
  noStroke();
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Denominator", cx + 100, cy - 18);

  drawBtn(cx + 60, cy, bw, bh, "−", "denMinus");
  fill(COL_TEXT);
  noStroke();
  textSize(20);
  textAlign(CENTER, CENTER);
  text(denominator, cx + 100, cy + bh / 2);
  drawBtn(cx + 140 - bw, cy, bw, bh, "+", "denPlus");

  // Equivalent fractions toggle
  var ew = 160, eh = 32;
  var ex = cx - ew / 2;
  var ey = cy + 50;
  var hover = mouseX > ex && mouseX < ex + ew && mouseY > ey && mouseY < ey + eh;
  fill(showEquiv ? COL_ACCENT : (hover ? COL_BTN_H : COL_BTN));
  noStroke();
  rect(ex, ey, ew, eh, 8);
  fill(255);
  textSize(13);
  textAlign(CENTER, CENTER);
  text(showEquiv ? "Hide Equivalents" : "Show Equivalents", ex + ew / 2, ey + eh / 2);
}

function drawBtn(x, y, w, h, label, id) {
  var hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hover ? COL_BTN_H : COL_BTN);
  noStroke();
  rect(x, y, w, h, 8);
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
}

function updateParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.life -= 0.02;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  noStroke();
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    fill(red(p.c), green(p.c), blue(p.c), p.life * 255);
    ellipse(p.x, p.y, 7 * p.life, 7 * p.life);
  }
}

function spawnParticles(px, py) {
  for (var i = 0; i < 15; i++) {
    particles.push({
      x: px, y: py,
      vx: random(-3, 3), vy: random(-5, -1),
      life: 1,
      c: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
}

function mousePressed() {
  var cy = height - 100;
  var bw = 38, bh = 34;
  var cx = width / 2;

  // Numerator −
  if (hitTest(cx - 140, cy, bw, bh)) {
    numerator = Math.max(0, numerator - 1);
    computeEquivalents();
    return;
  }
  // Numerator +
  if (hitTest(cx - 60 - bw, cy, bw, bh)) {
    numerator = Math.min(denominator, numerator + 1);
    computeEquivalents();
    return;
  }
  // Denominator −
  if (hitTest(cx + 60, cy, bw, bh)) {
    var newD = Math.max(1, denominator - 1);
    if (newD !== denominator) {
      denominator = newD;
      numerator = Math.min(numerator, denominator);
      animProgress = 0;
      computeEquivalents();
      spawnParticles(width / 2, 215);
    }
    return;
  }
  // Denominator +
  if (hitTest(cx + 140 - bw, cy, bw, bh)) {
    var newD2 = Math.min(12, denominator + 1);
    if (newD2 !== denominator) {
      denominator = newD2;
      animProgress = 0;
      computeEquivalents();
      spawnParticles(width / 2, 215);
    }
    return;
  }

  // Equivalents toggle
  var ew = 160, eh = 32;
  var ex = cx - ew / 2;
  var ey = cy + 50;
  if (hitTest(ex, ey, ew, eh)) {
    showEquiv = !showEquiv;
    return;
  }
}

function hitTest(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}
