/* jshint esversion: 6 */
// ============================================================
// 15. Complementary & Supplementary Angles — Interactive Teaching Tool
// ============================================================
// Layout: LEFT panel (complementary) | CENTER (angle viz) | RIGHT panel (supplementary)
//         BOTTOM bar (random generator + quick-jump buttons)

// ═══════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════
var canvasW, canvasH;
var centerX, centerY;
var rayLength = 180;
var arcRadius = 60;
var compArcRadius = 80;
var suppArcRadius = 100;
var handleRadius = 16;

// Layout regions
var LEFT_W, RIGHT_W, VIZ_LEFT, VIZ_RIGHT, VIZ_CX, VIZ_CY;
var TOP_H = 56;
var BOTTOM_H = 90;

// Colors
var COL_BG, COL_PANEL_BG, COL_CARD_BG, COL_CARD_BORDER;
var COL_RAY, COL_ARC, COL_VERTEX, COL_HANDLE, COL_TEXT, COL_MUTED;
var COL_SPECIAL, COL_SNAP_ON, COL_ACCENT;
var COL_COMP, COL_SUPP, COL_RIGHT_ANGLE;

// State
var currentAngle = 35;
var targetAngle = 35;
var isDragging = false;
var snapMode = false;
var animSpeed = 0.12;

// Point labels
var pointA = "A";
var pointB = "B";
var pointC = "C";

// Buttons
var quickBtns = [];
var QUICK_ANGLES = [15, 30, 45, 60, 75, 90, 120, 150];
var randomBtn = { x: 0, y: 0, w: 160, h: 44 };
var snapBtn = { x: 0, y: 0, w: 110, h: 44 };
var SNAP_ANGLES = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];

// Animation
var glowPhase = 0;
var particles = [];
var lastSpecialHit = -1;

// ═══════════════════════════════════════════
// Setup
// ═══════════════════════════════════════════
function setup() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  createCanvas(canvasW, canvasH);
  textFont("Arial");

  COL_BG           = color(245, 247, 252);
  COL_PANEL_BG     = color(255, 255, 255, 230);
  COL_CARD_BG      = color(255);
  COL_CARD_BORDER  = color(215, 220, 235);
  COL_RAY          = color(220, 60, 140);
  COL_ARC          = color(120, 80, 220, 160);
  COL_VERTEX       = color(220, 60, 140);
  COL_HANDLE       = color(100, 60, 200);
  COL_TEXT         = color(40, 40, 60);
  COL_MUTED        = color(130, 135, 150);
  COL_SPECIAL      = color(255, 175, 40);
  COL_SNAP_ON      = color(50, 180, 90);
  COL_ACCENT       = color(80, 60, 200);
  COL_COMP         = color(40, 180, 120);
  COL_SUPP         = color(230, 130, 40);
  COL_RIGHT_ANGLE  = color(50, 120, 220);

  updateLayout();
}

function windowResized() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  resizeCanvas(canvasW, canvasH);
  updateLayout();
}

function updateLayout() {
  LEFT_W  = constrain(canvasW * 0.22, 200, 280);
  RIGHT_W = constrain(canvasW * 0.22, 200, 280);
  VIZ_LEFT  = LEFT_W;
  VIZ_RIGHT = canvasW - RIGHT_W;

  VIZ_CX = (VIZ_LEFT + VIZ_RIGHT) / 2;
  VIZ_CY = TOP_H + (canvasH - TOP_H - BOTTOM_H) / 2 + 15;
  centerX = VIZ_CX;
  centerY = VIZ_CY;

  var vizW = VIZ_RIGHT - VIZ_LEFT;
  var vizH = canvasH - TOP_H - BOTTOM_H;
  rayLength = Math.min(vizW, vizH) * 0.26;
  rayLength = constrain(rayLength, 80, 200);
  arcRadius = rayLength * 0.30;
  compArcRadius = rayLength * 0.44;
  suppArcRadius = rayLength * 0.58;
  handleRadius = Math.max(10, rayLength * 0.08);

  // Bottom bar layout
  var barY = canvasH - BOTTOM_H + 14;
  var btnW = 50, btnH = 44, btnGap = 5;
  var totalBtnW = QUICK_ANGLES.length * (btnW + btnGap) - btnGap;
  var groupW = randomBtn.w + 14 + totalBtnW + 14 + snapBtn.w;
  var startX = (canvasW - groupW) / 2;

  randomBtn.x = startX;
  randomBtn.y = barY;
  randomBtn.h = btnH;

  quickBtns = [];
  var qStartX = startX + randomBtn.w + 14;
  for (var i = 0; i < QUICK_ANGLES.length; i++) {
    quickBtns.push({
      x: qStartX + i * (btnW + btnGap),
      y: barY, w: btnW, h: btnH,
      angle: QUICK_ANGLES[i]
    });
  }

  snapBtn.x = qStartX + totalBtnW + 14;
  snapBtn.y = barY;
  snapBtn.h = btnH;
}

// ═══════════════════════════════════════════
// Main Draw
// ═══════════════════════════════════════════
function draw() {
  background(COL_BG);
  glowPhase += 0.03;

  // Smooth angle interpolation
  var diff = targetAngle - currentAngle;
  if (Math.abs(diff) > 0.1) {
    currentAngle += diff * animSpeed;
  } else {
    currentAngle = targetAngle;
  }
  currentAngle = constrain(currentAngle, 0, 180);

  drawTitleBar();
  drawLeftPanel();
  drawRightPanel();
  drawBottomBar();

  drawReferenceLines();
  drawAngleArcs();
  drawAngleRays();
  drawPointLabels();
  drawEquationBanner();

  updateParticles();
  drawParticles();
}

// ═══════════════════════════════════════════
// Title Bar
// ═══════════════════════════════════════════
function drawTitleBar() {
  fill(255, 255, 255, 200);
  noStroke();
  rect(0, 0, canvasW, TOP_H);
  stroke(215, 220, 235);
  strokeWeight(1);
  line(0, TOP_H, canvasW, TOP_H);

  noStroke();
  fill(COL_TEXT);
  textSize(20);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Complementary & Supplementary Angles", canvasW / 2, TOP_H / 2 - 2);
  textStyle(NORMAL);
}

// ═══════════════════════════════════════════
// LEFT PANEL — Complementary Angles
// ═══════════════════════════════════════════
function drawLeftPanel() {
  fill(COL_PANEL_BG);
  noStroke();
  rect(0, TOP_H, LEFT_W, canvasH - TOP_H - BOTTOM_H);
  stroke(215, 220, 235);
  strokeWeight(1);
  line(LEFT_W, TOP_H, LEFT_W, canvasH - BOTTOM_H);

  var cx = LEFT_W / 2;
  var py = TOP_H + 14;
  var pad = 14;
  var cardW = LEFT_W - pad * 2;

  // Title
  noStroke();
  fill(COL_COMP);
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Complementary Angles", cx, py);
  textStyle(NORMAL);

  // Definition card
  var defY = py + 26;
  var defH = 62;
  fill(red(COL_COMP), green(COL_COMP), blue(COL_COMP), 15);
  stroke(COL_COMP);
  strokeWeight(1.5);
  rect(pad, defY, cardW, defH, 10);

  noStroke();
  fill(COL_TEXT);
  textSize(11);
  textAlign(CENTER, CENTER);
  text("Two angles are complementary", cx, defY + 14);
  text("when they add up to", cx, defY + 30);
  fill(COL_COMP);
  textStyle(BOLD);
  textSize(16);
  text("90\u00B0", cx, defY + 50);
  textStyle(NORMAL);

  // Formula card
  var fY = defY + defH + 10;
  var fH = 42;
  fill(COL_CARD_BG);
  stroke(COL_CARD_BORDER);
  strokeWeight(1);
  rect(pad, fY, cardW, fH, 10);

  noStroke();
  fill(COL_ACCENT);
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("\u03B1 + \u03B2 = 90\u00B0", cx, fY + fH / 2);
  textStyle(NORMAL);

  // Current calculation
  var calcY = fY + fH + 12;
  var deg = Math.round(currentAngle * 10) / 10;
  var complement = Math.round((90 - deg) * 10) / 10;
  var hasComp = deg > 0 && deg < 90;

  noStroke();
  fill(COL_TEXT);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Current Calculation", cx, calcY);
  textStyle(NORMAL);

  var cY = calcY + 18;
  var cH = 60;
  if (hasComp) {
    fill(red(COL_COMP), green(COL_COMP), blue(COL_COMP), 12);
    stroke(COL_COMP);
    strokeWeight(2);
  } else {
    fill(245, 245, 250);
    stroke(COL_CARD_BORDER);
    strokeWeight(1);
  }
  rect(pad, cY, cardW, cH, 10);

  noStroke();
  if (hasComp) {
    fill(COL_TEXT);
    textSize(18);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(deg + "\u00B0 + " + complement + "\u00B0", cx, cY + 20);
    fill(COL_COMP);
    textSize(15);
    text("= 90\u00B0 \u2713", cx, cY + 43);
    textStyle(NORMAL);
  } else if (Math.abs(deg - 90) < 0.5) {
    fill(COL_MUTED);
    textSize(11);
    textAlign(CENTER, CENTER);
    text("90\u00B0 has no positive", cx, cY + 18);
    text("complement (would be 0\u00B0)", cx, cY + 34);
  } else {
    fill(COL_MUTED);
    textSize(11);
    textAlign(CENTER, CENTER);
    text(deg + "\u00B0 > 90\u00B0", cx, cY + 18);
    text("No complement exists", cx, cY + 34);
    textSize(9);
    text("(would need " + complement + "\u00B0)", cx, cY + 50);
  }

  // Mini bar: angle + complement = 90°
  var barY = cY + cH + 12;
  drawMiniBar(pad, barY, cardW, deg, 90, COL_ARC, COL_COMP, hasComp);

  // Special case highlight
  var noteY = barY + 32;
  noStroke();
  if (Math.abs(deg - 45) < 1) {
    fill(COL_SPECIAL);
    textSize(10);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text("\u2605 Self-Complementary!", cx, noteY);
    text("45\u00B0 + 45\u00B0 = 90\u00B0", cx, noteY + 14);
    textStyle(NORMAL);
    noteY += 32;
  }

  // Examples
  var exY = noteY + 6;
  fill(COL_TEXT);
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("Examples:", pad + 4, exY);
  textStyle(NORMAL);

  fill(COL_MUTED);
  textSize(10);
  var examples = [
    "30\u00B0 + 60\u00B0 = 90\u00B0",
    "45\u00B0 + 45\u00B0 = 90\u00B0",
    "20\u00B0 + 70\u00B0 = 90\u00B0",
    "15\u00B0 + 75\u00B0 = 90\u00B0"
  ];
  for (var i = 0; i < examples.length; i++) {
    text(examples[i], pad + 4, exY + 18 + i * 15);
  }

  // Real-world note
  var rwY = exY + 18 + examples.length * 15 + 10;
  fill(COL_COMP);
  textSize(9);
  textStyle(ITALIC);
  textAlign(CENTER, TOP);
  text("Think of a right-angle corner \u2014", cx, rwY);
  text("two complementary angles", cx, rwY + 13);
  text("fill it perfectly!", cx, rwY + 26);
  textStyle(NORMAL);
}

// ═══════════════════════════════════════════
// Mini Bar — Shows two angle portions
// ═══════════════════════════════════════════
function drawMiniBar(x, y, w, angle1, total, col1, col2, valid) {
  var barH = 14;

  noStroke();
  fill(COL_MUTED);
  textSize(8);
  textAlign(LEFT, TOP);
  text("0\u00B0", x, y + barH + 2);
  textAlign(RIGHT, TOP);
  text(total + "\u00B0", x + w, y + barH + 2);

  fill(235, 238, 245);
  noStroke();
  rect(x, y, w, barH, 4);

  if (!valid) {
    fill(210, 215, 225);
    rect(x, y, w, barH, 4);
    return;
  }

  var w1 = map(angle1, 0, total, 0, w);
  fill(red(col1), green(col1), blue(col1), 140);
  noStroke();
  if (w1 > 2) rect(x, y, w1, barH, 4, 0, 0, 4);

  fill(red(col2), green(col2), blue(col2), 140);
  if (w - w1 > 2) rect(x + w1, y, w - w1, barH, 0, 4, 4, 0);

  stroke(255);
  strokeWeight(2);
  line(x + w1, y, x + w1, y + barH);
}

// ═══════════════════════════════════════════
// RIGHT PANEL — Supplementary Angles
// ═══════════════════════════════════════════
function drawRightPanel() {
  var px = canvasW - RIGHT_W;

  fill(COL_PANEL_BG);
  noStroke();
  rect(px, TOP_H, RIGHT_W, canvasH - TOP_H - BOTTOM_H);
  stroke(215, 220, 235);
  strokeWeight(1);
  line(px, TOP_H, px, canvasH - BOTTOM_H);

  var cx = px + RIGHT_W / 2;
  var py = TOP_H + 14;
  var pad = 14;
  var cardW = RIGHT_W - pad * 2;

  // Title
  noStroke();
  fill(COL_SUPP);
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Supplementary Angles", cx, py);
  textStyle(NORMAL);

  // Definition card
  var defY = py + 26;
  var defH = 62;
  fill(red(COL_SUPP), green(COL_SUPP), blue(COL_SUPP), 15);
  stroke(COL_SUPP);
  strokeWeight(1.5);
  rect(px + pad, defY, cardW, defH, 10);

  noStroke();
  fill(COL_TEXT);
  textSize(11);
  textAlign(CENTER, CENTER);
  text("Two angles are supplementary", cx, defY + 14);
  text("when they add up to", cx, defY + 30);
  fill(COL_SUPP);
  textStyle(BOLD);
  textSize(16);
  text("180\u00B0", cx, defY + 50);
  textStyle(NORMAL);

  // Formula card
  var fY = defY + defH + 10;
  var fH = 42;
  fill(COL_CARD_BG);
  stroke(COL_CARD_BORDER);
  strokeWeight(1);
  rect(px + pad, fY, cardW, fH, 10);

  noStroke();
  fill(COL_ACCENT);
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("\u03B1 + \u03B2 = 180\u00B0", cx, fY + fH / 2);
  textStyle(NORMAL);

  // Current calculation
  var calcY = fY + fH + 12;
  var deg = Math.round(currentAngle * 10) / 10;
  var supplement = Math.round((180 - deg) * 10) / 10;
  var hasSupp = deg > 0 && deg < 180;

  noStroke();
  fill(COL_TEXT);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Current Calculation", cx, calcY);
  textStyle(NORMAL);

  var sY = calcY + 18;
  var sH = 60;
  if (hasSupp) {
    fill(red(COL_SUPP), green(COL_SUPP), blue(COL_SUPP), 12);
    stroke(COL_SUPP);
    strokeWeight(2);
  } else {
    fill(245, 245, 250);
    stroke(COL_CARD_BORDER);
    strokeWeight(1);
  }
  rect(px + pad, sY, cardW, sH, 10);

  noStroke();
  if (hasSupp) {
    fill(COL_TEXT);
    textSize(18);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(deg + "\u00B0 + " + supplement + "\u00B0", cx, sY + 20);
    fill(COL_SUPP);
    textSize(15);
    text("= 180\u00B0 \u2713", cx, sY + 43);
    textStyle(NORMAL);
  } else if (Math.abs(deg) < 0.5) {
    fill(COL_MUTED);
    textSize(11);
    textAlign(CENTER, CENTER);
    text("0\u00B0 \u2014 supplement", cx, sY + 18);
    text("would be 180\u00B0", cx, sY + 34);
  } else {
    fill(COL_MUTED);
    textSize(11);
    textAlign(CENTER, CENTER);
    text("180\u00B0 is a straight angle", cx, sY + 18);
    text("Supplement would be 0\u00B0", cx, sY + 34);
  }

  // Mini bar: angle + supplement = 180°
  var barY = sY + sH + 12;
  drawMiniBar(px + pad, barY, cardW, deg, 180, COL_ARC, COL_SUPP, hasSupp);

  // Special case highlight
  var noteY = barY + 32;
  noStroke();
  if (Math.abs(deg - 90) < 1) {
    fill(COL_SPECIAL);
    textSize(10);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text("\u2605 Self-Supplementary!", cx, noteY);
    text("90\u00B0 + 90\u00B0 = 180\u00B0", cx, noteY + 14);
    textStyle(NORMAL);
    noteY += 32;
  }

  // Examples
  var exY = noteY + 6;
  fill(COL_TEXT);
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("Examples:", px + pad + 4, exY);
  textStyle(NORMAL);

  fill(COL_MUTED);
  textSize(10);
  var examples = [
    "60\u00B0 + 120\u00B0 = 180\u00B0",
    "90\u00B0 + 90\u00B0 = 180\u00B0",
    "45\u00B0 + 135\u00B0 = 180\u00B0",
    "30\u00B0 + 150\u00B0 = 180\u00B0"
  ];
  for (var i = 0; i < examples.length; i++) {
    text(examples[i], px + pad + 4, exY + 18 + i * 15);
  }

  // Real-world note
  var rwY = exY + 18 + examples.length * 15 + 10;
  fill(COL_SUPP);
  textSize(9);
  textStyle(ITALIC);
  textAlign(CENTER, TOP);
  text("Think of a straight line \u2014", cx, rwY);
  text("two supplementary angles", cx, rwY + 13);
  text("fill it perfectly!", cx, rwY + 26);
  textStyle(NORMAL);

  // Key Difference section
  var kdY = rwY + 48;
  fill(COL_ACCENT);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Quick Comparison", cx, kdY);
  textStyle(NORMAL);

  var kdCardY = kdY + 18;
  var kdH = 50;
  fill(COL_CARD_BG);
  stroke(COL_CARD_BORDER);
  strokeWeight(1);
  rect(px + pad, kdCardY, cardW, kdH, 8);

  noStroke();
  textSize(10);
  textAlign(CENTER, CENTER);
  fill(COL_COMP);
  textStyle(BOLD);
  text("Comp = 90\u00B0 (right angle)", cx, kdCardY + 16);
  fill(COL_SUPP);
  text("Supp = 180\u00B0 (straight line)", cx, kdCardY + 34);
  textStyle(NORMAL);
}

// ═══════════════════════════════════════════
// BOTTOM BAR — Random + Quick Jump + Snap
// ═══════════════════════════════════════════
function drawBottomBar() {
  var barTop = canvasH - BOTTOM_H;

  fill(255, 255, 255, 220);
  noStroke();
  rect(0, barTop, canvasW, BOTTOM_H);
  stroke(215, 220, 235);
  strokeWeight(1);
  line(0, barTop, canvasW, barTop);

  noStroke();
  fill(COL_MUTED);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Choose an Angle to Explore", canvasW / 2, barTop + 10);
  textStyle(NORMAL);

  var deg = Math.round(currentAngle * 10) / 10;

  // Random Angle button
  var rHov = insideBtnRect(randomBtn);
  if (rHov) {
    fill(COL_ACCENT);
    stroke(color(60, 40, 180));
    strokeWeight(2);
  } else {
    fill(red(COL_ACCENT), green(COL_ACCENT), blue(COL_ACCENT), 22);
    stroke(COL_ACCENT);
    strokeWeight(1.5);
  }
  rect(randomBtn.x, randomBtn.y, randomBtn.w, randomBtn.h, 8);

  noStroke();
  fill(rHov ? 255 : COL_ACCENT);
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("\uD83C\uDFB2 Random Angle", randomBtn.x + randomBtn.w / 2, randomBtn.y + randomBtn.h / 2);
  textStyle(NORMAL);

  // Quick-jump buttons
  for (var i = 0; i < quickBtns.length; i++) {
    var btn = quickBtns[i];
    var active = Math.abs(deg - btn.angle) < 1;
    var hov = insideBtnRect(btn);

    if (active) {
      fill(COL_SPECIAL);
      stroke(color(210, 150, 30));
      strokeWeight(2);
    } else if (hov) {
      fill(240, 238, 255);
      stroke(COL_ACCENT);
      strokeWeight(2);
    } else {
      fill(COL_CARD_BG);
      stroke(COL_CARD_BORDER);
      strokeWeight(1);
    }
    rect(btn.x, btn.y, btn.w, btn.h, 8);

    noStroke();
    fill(active ? 255 : COL_TEXT);
    textSize(12);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(btn.angle + "\u00B0", btn.x + btn.w / 2, btn.y + btn.h / 2);
    textStyle(NORMAL);
  }

  // Snap toggle
  var sHov = insideBtnRect(snapBtn);
  if (snapMode) {
    fill(red(COL_SNAP_ON), green(COL_SNAP_ON), blue(COL_SNAP_ON), 30);
    stroke(COL_SNAP_ON);
    strokeWeight(2);
  } else if (sHov) {
    fill(240, 245, 255);
    stroke(COL_ACCENT);
    strokeWeight(1.5);
  } else {
    fill(COL_CARD_BG);
    stroke(COL_CARD_BORDER);
    strokeWeight(1);
  }
  rect(snapBtn.x, snapBtn.y, snapBtn.w, snapBtn.h, 8);

  noStroke();
  fill(snapMode ? COL_SNAP_ON : COL_TEXT);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(snapMode ? "\u2713 Snap" : "Snap", snapBtn.x + snapBtn.w / 2, snapBtn.y + snapBtn.h / 2);
  textStyle(NORMAL);

  // Footer hint
  noStroke();
  fill(185);
  textSize(9);
  textAlign(CENTER, CENTER);
  text("Drag the handle  \u2022  Click \uD83C\uDFB2 for random  \u2022  Complementary = 90\u00B0  \u2022  Supplementary = 180\u00B0",
    canvasW / 2, canvasH - 10);
}

// ═══════════════════════════════════════════
// CENTER — Reference Lines at 90° and 180°
// ═══════════════════════════════════════════
function drawReferenceLines() {
  var refLen = rayLength + 18;

  // 90° reference line (vertical up)
  stroke(red(COL_COMP), green(COL_COMP), blue(COL_COMP), 90);
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 6]);
  line(centerX, centerY, centerX, centerY - refLen);
  drawingContext.setLineDash([]);

  noStroke();
  fill(red(COL_COMP), green(COL_COMP), blue(COL_COMP), 160);
  textSize(10);
  textAlign(CENTER, CENTER);
  text("90\u00B0", centerX, centerY - refLen - 12);

  // 180° reference line (horizontal left)
  stroke(red(COL_SUPP), green(COL_SUPP), blue(COL_SUPP), 90);
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 6]);
  line(centerX, centerY, centerX - refLen, centerY);
  drawingContext.setLineDash([]);

  noStroke();
  fill(red(COL_SUPP), green(COL_SUPP), blue(COL_SUPP), 160);
  textSize(10);
  text("180\u00B0", centerX - refLen - 18, centerY);

  // Right-angle square between 0° and 90°
  var sq = Math.min(14, arcRadius * 0.35);
  stroke(COL_RIGHT_ANGLE);
  strokeWeight(1.5);
  noFill();
  line(centerX + sq, centerY, centerX + sq, centerY - sq);
  line(centerX + sq, centerY - sq, centerX, centerY - sq);
}

// ═══════════════════════════════════════════
// CENTER — Angle Arcs (main + comp + supp)
// ═══════════════════════════════════════════
function drawAngleArcs() {
  var deg = currentAngle;
  if (deg < 0.3) return;

  var mainEnd = -radians(deg);

  // ── Supplementary arc (largest radius, orange) ──
  if (deg > 0 && deg < 180) {
    var suppDeg = Math.round(180 - deg);

    // Filled wedge from current angle to 180°
    fill(red(COL_SUPP), green(COL_SUPP), blue(COL_SUPP), 18);
    noStroke();
    beginShape();
    vertex(centerX, centerY);
    for (var sa = mainEnd; sa >= -PI; sa -= 0.04) {
      vertex(centerX + cos(sa) * suppArcRadius, centerY + sin(sa) * suppArcRadius);
    }
    vertex(centerX + cos(-PI) * suppArcRadius, centerY + sin(-PI) * suppArcRadius);
    endShape(CLOSE);

    // Arc stroke
    noFill();
    stroke(COL_SUPP);
    strokeWeight(2);
    arc(centerX, centerY, suppArcRadius * 2, suppArcRadius * 2, -PI, mainEnd);

    // Label
    var suppMid = -radians((deg + 180) / 2);
    var slr = suppArcRadius + 16;
    noStroke();
    fill(COL_SUPP);
    textSize(12);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(suppDeg + "\u00B0", centerX + cos(suppMid) * slr, centerY + sin(suppMid) * slr);
    textStyle(NORMAL);
  }

  // ── Complementary arc (medium radius, green) ──
  if (deg > 0 && deg < 90) {
    var compDeg = Math.round(90 - deg);

    // Filled wedge from current angle to 90°
    fill(red(COL_COMP), green(COL_COMP), blue(COL_COMP), 25);
    noStroke();
    beginShape();
    vertex(centerX, centerY);
    for (var ca = mainEnd; ca >= -HALF_PI; ca -= 0.04) {
      vertex(centerX + cos(ca) * compArcRadius, centerY + sin(ca) * compArcRadius);
    }
    vertex(centerX + cos(-HALF_PI) * compArcRadius, centerY + sin(-HALF_PI) * compArcRadius);
    endShape(CLOSE);

    // Arc stroke
    noFill();
    stroke(COL_COMP);
    strokeWeight(2.5);
    arc(centerX, centerY, compArcRadius * 2, compArcRadius * 2, -HALF_PI, mainEnd);

    // Label
    var compMid = -radians((deg + 90) / 2);
    var clr = compArcRadius + 16;
    noStroke();
    fill(COL_COMP);
    textSize(12);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(compDeg + "\u00B0", centerX + cos(compMid) * clr, centerY + sin(compMid) * clr);
    textStyle(NORMAL);
  }

  // ── Main angle arc (smallest radius, purple) ──
  // Filled wedge from 0° to current angle
  fill(red(COL_ARC), green(COL_ARC), blue(COL_ARC), 32);
  noStroke();
  beginShape();
  vertex(centerX, centerY);
  for (var ma = 0; ma >= mainEnd; ma -= 0.04) {
    vertex(centerX + cos(ma) * arcRadius, centerY + sin(ma) * arcRadius);
  }
  vertex(centerX + cos(mainEnd) * arcRadius, centerY + sin(mainEnd) * arcRadius);
  endShape(CLOSE);

  // Arc stroke
  noFill();
  stroke(COL_ARC);
  strokeWeight(3);
  arc(centerX, centerY, arcRadius * 2, arcRadius * 2, mainEnd, 0);

  // Degree label
  var midRad = -radians(deg / 2);
  var lr = arcRadius + 18;
  noStroke();
  fill(COL_ACCENT);
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(Math.round(deg * 10) / 10 + "\u00B0", centerX + cos(midRad) * lr, centerY + sin(midRad) * lr);
  textStyle(NORMAL);

  // Right-angle marker when currentAngle ≈ 90°
  if (Math.abs(deg - 90) < 1) {
    var rsq = Math.min(18, arcRadius * 0.4);
    stroke(COL_RIGHT_ANGLE);
    strokeWeight(2.5);
    noFill();
    line(centerX + rsq, centerY, centerX + rsq, centerY - rsq);
    line(centerX + rsq, centerY - rsq, centerX, centerY - rsq);
  }
}

// ═══════════════════════════════════════════
// CENTER — Angle Rays
// ═══════════════════════════════════════════
function drawAngleRays() {
  var aRad = -radians(currentAngle);
  var fex = centerX + rayLength, fey = centerY;
  var mex = centerX + cos(aRad) * rayLength;
  var mey = centerY + sin(aRad) * rayLength;

  // Rays
  stroke(COL_RAY);
  strokeWeight(3.5);
  line(centerX, centerY, fex, fey);
  drawArrowHead(fex, fey, 0);
  line(centerX, centerY, mex, mey);
  drawArrowHead(mex, mey, aRad);

  // Vertex dot
  noStroke();
  fill(COL_VERTEX);
  circle(centerX, centerY, 13);
  fill(255);
  circle(centerX, centerY, 5);

  // Drag handle with hover/drag feedback
  var hov = dist(mouseX, mouseY, mex, mey) < handleRadius + 10;
  if (isDragging || hov) {
    noFill();
    stroke(COL_HANDLE);
    strokeWeight(2.5);
    circle(mex, mey, handleRadius * 2 + 14);
  }
  noStroke();
  fill(COL_HANDLE);
  circle(mex, mey, handleRadius * 2);
  fill(255, 255, 255, 200);
  circle(mex, mey, handleRadius);
  fill(COL_HANDLE);
  circle(mex, mey, 4);
}

function drawArrowHead(x, y, angleRad) {
  push();
  translate(x, y);
  rotate(angleRad);
  noStroke();
  fill(COL_RAY);
  triangle(0, 0, -13, -6, -13, 6);
  pop();
}

// ═══════════════════════════════════════════
// CENTER — Point Labels (A, B, C)
// ═══════════════════════════════════════════
function drawPointLabels() {
  var aRad = -radians(currentAngle);
  var off = 26;

  noStroke();
  textSize(17);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  // C — fixed ray end (right)
  fill(COL_RAY);
  text(pointC, centerX + rayLength + off, centerY);

  // A — movable ray end
  fill(COL_HANDLE);
  text(pointA,
    centerX + cos(aRad) * (rayLength + off),
    centerY + sin(aRad) * (rayLength + off));

  // B — vertex
  fill(COL_VERTEX);
  text(pointB, centerX - 20, centerY + 20);
  textStyle(NORMAL);
}

// ═══════════════════════════════════════════
// CENTER — Equation Banner (above visualization)
// ═══════════════════════════════════════════
function drawEquationBanner() {
  var deg = Math.round(currentAngle);
  var complement = 90 - deg;
  var supplement = 180 - deg;
  var hasComp = deg > 0 && deg < 90;
  var hasSupp = deg > 0 && deg < 180;

  var eqY = TOP_H + 12;
  var eqCX = (VIZ_LEFT + VIZ_RIGHT) / 2;

  textStyle(BOLD);
  textAlign(CENTER, TOP);

  // Complementary equation (left of center)
  if (hasComp) {
    var glow1 = sin(glowPhase * 2) * 0.15 + 0.85;
    noStroke();
    fill(red(COL_COMP), green(COL_COMP), blue(COL_COMP), 220 * glow1);
    textSize(13);
    text("Complementary: " + deg + "\u00B0 + " + complement + "\u00B0 = 90\u00B0", eqCX - 110, eqY);
  } else {
    noStroke();
    fill(red(COL_COMP), green(COL_COMP), blue(COL_COMP), 80);
    textSize(12);
    text("No complement (angle \u2265 90\u00B0)", eqCX - 110, eqY);
  }

  // Supplementary equation (right of center)
  if (hasSupp) {
    var glow2 = sin(glowPhase * 2 + PI) * 0.15 + 0.85;
    noStroke();
    fill(red(COL_SUPP), green(COL_SUPP), blue(COL_SUPP), 220 * glow2);
    textSize(13);
    text("Supplementary: " + deg + "\u00B0 + " + supplement + "\u00B0 = 180\u00B0", eqCX + 110, eqY);
  }

  textStyle(NORMAL);

  // Color legend
  var legY = eqY + 20;
  textSize(9);
  noStroke();

  fill(COL_ARC);
  circle(eqCX - 85, legY + 5, 8);
  fill(COL_TEXT);
  textAlign(LEFT, TOP);
  text("Your angle", eqCX - 79, legY);

  fill(COL_COMP);
  circle(eqCX - 5, legY + 5, 8);
  fill(COL_TEXT);
  text("Complement", eqCX + 1, legY);

  fill(COL_SUPP);
  circle(eqCX + 75, legY + 5, 8);
  fill(COL_TEXT);
  text("Supplement", eqCX + 81, legY);
}

// ═══════════════════════════════════════════
// Particles
// ═══════════════════════════════════════════
function triggerParticles() {
  var midRad = -radians(currentAngle / 2);
  var px = centerX + cos(midRad) * arcRadius;
  var py = centerY + sin(midRad) * arcRadius;
  for (var i = 0; i < 18; i++) {
    particles.push({
      x: px, y: py,
      vx: random(-3.5, 3.5), vy: random(-5, -1),
      col: color(random(180, 255), random(100, 255), random(50, 200)),
      size: random(4, 10), life: 45
    });
  }
}

function updateParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
  var deg = Math.round(currentAngle);
  var isSpecial = (deg === 30 || deg === 45 || deg === 60 || deg === 90);
  if (isSpecial && lastSpecialHit !== deg) {
    triggerParticles();
    lastSpecialHit = deg;
  }
  if (!isSpecial) lastSpecialHit = -1;
}

function drawParticles() {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    var a = map(p.life, 0, 45, 0, 255);
    noStroke();
    fill(red(p.col), green(p.col), blue(p.col), a);
    circle(p.x, p.y, p.size);
  }
}

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════
function insideBtnRect(btn) {
  return mouseX >= btn.x && mouseX <= btn.x + btn.w &&
         mouseY >= btn.y && mouseY <= btn.y + btn.h;
}

// ═══════════════════════════════════════════
// Mouse Interaction
// ═══════════════════════════════════════════
function mousePressed() {
  // Random button
  if (insideBtnRect(randomBtn)) {
    targetAngle = Math.floor(random(1, 180));
    return;
  }

  // Quick-jump buttons
  for (var i = 0; i < quickBtns.length; i++) {
    if (insideBtnRect(quickBtns[i])) {
      targetAngle = quickBtns[i].angle;
      return;
    }
  }

  // Snap toggle
  if (insideBtnRect(snapBtn)) {
    snapMode = !snapMode;
    return;
  }

  // Drag handle
  var aRad = -radians(currentAngle);
  var hx = centerX + cos(aRad) * rayLength;
  var hy = centerY + sin(aRad) * rayLength;
  if (dist(mouseX, mouseY, hx, hy) < handleRadius + 14) {
    isDragging = true;
    return;
  }

  // Click anywhere in viz area
  var dC = dist(mouseX, mouseY, centerX, centerY);
  if (dC > 25 && dC < rayLength + 50 &&
      mouseX > VIZ_LEFT && mouseX < VIZ_RIGHT &&
      mouseY > TOP_H && mouseY < canvasH - BOTTOM_H) {
    isDragging = true;
    updateAngleFromMouse();
  }
}

function mouseDragged() {
  if (!isDragging) return;
  updateAngleFromMouse();
}

function mouseReleased() {
  isDragging = false;
}

function updateAngleFromMouse() {
  var dx = mouseX - centerX;
  var dy = mouseY - centerY;
  var angleDeg = -degrees(atan2(dy, dx));
  if (angleDeg < 0) angleDeg += 360;

  // Clamp to upper half (0–180°) since complement/supplement are meaningful there
  if (angleDeg > 180 && angleDeg <= 270) angleDeg = 180;
  if (angleDeg > 270) angleDeg = 0;
  angleDeg = constrain(angleDeg, 0, 180);

  if (snapMode) {
    var nearest = angleDeg, minD = 999;
    for (var i = 0; i < SNAP_ANGLES.length; i++) {
      var d = Math.abs(angleDeg - SNAP_ANGLES[i]);
      if (d < minD) { minD = d; nearest = SNAP_ANGLES[i]; }
    }
    if (minD < 8) angleDeg = nearest;
  }

  targetAngle = angleDeg;
  currentAngle = angleDeg;
}
