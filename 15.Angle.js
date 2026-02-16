/* jshint esversion: 6 */
// ============================================================
// 15. Angle Explorer — Interactive Angle Teaching Tool
// ============================================================
// Layout: LEFT panel (naming) | CENTER (angle viz) | RIGHT panel (data)
//         BOTTOM bar (quick-jump buttons + snap toggle)

// ═══════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════
var canvasW, canvasH;
var centerX, centerY;   // vertex position (center of the viz area)
var rayLength = 180;
var arcRadius = 60;
var handleRadius = 16;

// Layout regions
var LEFT_W, RIGHT_W, VIZ_LEFT, VIZ_RIGHT, VIZ_CX, VIZ_CY;
var TOP_H = 56;       // title bar height
var BOTTOM_H = 90;    // bottom bar height

// Colors
var COL_BG, COL_PANEL_BG, COL_CARD_BG, COL_CARD_BORDER;
var COL_RAY, COL_ARC, COL_VERTEX, COL_HANDLE, COL_TEXT, COL_MUTED;
var COL_SPECIAL, COL_SNAP_ON, COL_ACCENT;
var COL_ACUTE, COL_RIGHT, COL_OBTUSE, COL_STRAIGHT, COL_REFLEX, COL_FULL;

// State
var currentAngle = 45;
var targetAngle = 45;
var isDragging = false;
var snapMode = false;
var animSpeed = 0.12;

// Point labels
var pointA = "A";   // movable ray end
var pointB = "B";   // vertex
var pointC = "C";   // fixed ray end

// Special angles
var SPECIAL_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
var SNAP_THRESHOLD = 8;

// Quick-jump buttons
var quickBtns = [];
var QUICK_ANGLES = [30, 45, 60, 90, 120, 180, 270, 360];

// Naming buttons (left panel)
var nameBtns = [];

// Snap toggle button (bottom bar)
var snapBtn = { x: 0, y: 0, w: 130, h: 44 };

// Active naming style (0=∠ABC, 1=∠CBA, 2=∠B)
var activeNameStyle = 0;

// Particles
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

  COL_BG          = color(245, 247, 252);
  COL_PANEL_BG    = color(255, 255, 255, 230);
  COL_CARD_BG     = color(255);
  COL_CARD_BORDER = color(215, 220, 235);
  COL_RAY         = color(220, 60, 140);
  COL_ARC         = color(120, 80, 220, 160);
  COL_VERTEX      = color(220, 60, 140);
  COL_HANDLE      = color(100, 60, 200);
  COL_TEXT         = color(40, 40, 60);
  COL_MUTED        = color(130, 135, 150);
  COL_SPECIAL     = color(255, 175, 40);
  COL_SNAP_ON     = color(50, 180, 90);
  COL_ACCENT      = color(80, 60, 200);
  COL_ACUTE       = color(60, 180, 120);
  COL_RIGHT       = color(50, 120, 220);
  COL_OBTUSE      = color(220, 140, 40);
  COL_STRAIGHT    = color(180, 60, 60);
  COL_REFLEX      = color(160, 60, 180);
  COL_FULL        = color(220, 50, 50);

  updateLayout();
}

function windowResized() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  resizeCanvas(canvasW, canvasH);
  updateLayout();
}

function updateLayout() {
  // Panel widths (responsive)
  LEFT_W  = constrain(canvasW * 0.20, 170, 240);
  RIGHT_W = constrain(canvasW * 0.20, 170, 240);
  VIZ_LEFT  = LEFT_W;
  VIZ_RIGHT = canvasW - RIGHT_W;

  // Visualization center
  VIZ_CX = (VIZ_LEFT + VIZ_RIGHT) / 2;
  VIZ_CY = TOP_H + (canvasH - TOP_H - BOTTOM_H) / 2;
  centerX = VIZ_CX;
  centerY = VIZ_CY;

  // Scale ray length to fit viz area
  var vizW = VIZ_RIGHT - VIZ_LEFT;
  var vizH = canvasH - TOP_H - BOTTOM_H;
  rayLength = Math.min(vizW, vizH) * 0.30;
  rayLength = constrain(rayLength, 80, 220);
  arcRadius = rayLength * 0.32;
  handleRadius = Math.max(10, rayLength * 0.08);

  // ── Bottom bar: quick-jump buttons + snap toggle ──
  var barY = canvasH - BOTTOM_H + 14;
  var btnW = 56, btnH = 44, btnGap = 6;
  var totalBtnW = QUICK_ANGLES.length * (btnW + btnGap) - btnGap;
  // Center the buttons + snap toggle in the canvas
  var groupW = totalBtnW + 20 + snapBtn.w;
  var startX = (canvasW - groupW) / 2;
  quickBtns = [];
  for (var i = 0; i < QUICK_ANGLES.length; i++) {
    quickBtns.push({
      x: startX + i * (btnW + btnGap),
      y: barY,
      w: btnW, h: btnH,
      angle: QUICK_ANGLES[i]
    });
  }
  snapBtn.x = startX + totalBtnW + 20;
  snapBtn.y = barY;
  snapBtn.h = btnH;

  // ── Left panel: naming buttons ──
  var nBtnW = LEFT_W - 36;
  var nBtnH = 44;
  var nGap = 8;
  var nStartY = TOP_H + 90;
  var nCenterX = LEFT_W / 2;
  nameBtns = [];
  for (var j = 0; j < 3; j++) {
    nameBtns.push({
      x: 18,
      y: nStartY + j * (nBtnH + nGap),
      w: nBtnW,
      h: nBtnH
    });
  }
}

// ═══════════════════════════════════════════
// Main Draw
// ═══════════════════════════════════════════
function draw() {
  background(COL_BG);

  // Smooth angle interpolation
  var diff = targetAngle - currentAngle;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  if (Math.abs(diff) > 0.1) {
    currentAngle += diff * animSpeed;
    if (currentAngle < 0) currentAngle += 360;
    if (currentAngle > 360) currentAngle = 360;
  } else {
    currentAngle = targetAngle;
  }
  currentAngle = constrain(currentAngle, 0, 360);

  // Draw regions
  drawTitleBar();
  drawLeftPanel();
  drawRightPanel();
  drawBottomBar();

  // Center visualization
  drawSpecialAngleMarkers();
  drawAngleRays();
  drawAngleArc();
  drawPointLabels();

  // Particles on top
  updateParticles();
  drawParticles();
}

// ═══════════════════════════════════════════
// Title Bar
// ═══════════════════════════════════════════
function drawTitleBar() {
  // Background strip
  fill(255, 255, 255, 200);
  noStroke();
  rect(0, 0, canvasW, TOP_H);
  // Bottom border
  stroke(215, 220, 235);
  strokeWeight(1);
  line(0, TOP_H, canvasW, TOP_H);

  noStroke();
  fill(COL_TEXT);
  textSize(20);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Angle Explorer", canvasW / 2, TOP_H / 2 - 2);
  textStyle(NORMAL);
}

// ═══════════════════════════════════════════
// LEFT PANEL — Naming the Angle
// ═══════════════════════════════════════════
function drawLeftPanel() {
  // Panel background
  fill(COL_PANEL_BG);
  noStroke();
  rect(0, TOP_H, LEFT_W, canvasH - TOP_H - BOTTOM_H);
  // Right border
  stroke(215, 220, 235);
  strokeWeight(1);
  line(LEFT_W, TOP_H, LEFT_W, canvasH - BOTTOM_H);

  var cx = LEFT_W / 2;
  var py = TOP_H + 18;

  // Section title
  noStroke();
  fill(COL_ACCENT);
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Naming the Angle", cx, py);
  textStyle(NORMAL);

  fill(COL_MUTED);
  textSize(10);
  text("Click to explore each style", cx, py + 20);

  // ── 3 naming buttons ──
  var names = [
    { label: "\u2220" + pointA + pointB + pointC, sub: "vertex in the middle" },
    { label: "\u2220" + pointC + pointB + pointA, sub: "reversed order" },
    { label: "\u2220" + pointB, sub: "just the vertex letter" }
  ];

  for (var i = 0; i < nameBtns.length; i++) {
    var btn = nameBtns[i];
    var active = (activeNameStyle === i);
    var hov = insideBtnRect(btn);

    // Button bg
    if (active) {
      fill(red(COL_ACCENT), green(COL_ACCENT), blue(COL_ACCENT), 22);
      stroke(COL_ACCENT);
      strokeWeight(2.5);
    } else if (hov) {
      fill(242, 240, 255);
      stroke(COL_ACCENT);
      strokeWeight(1.5);
    } else {
      fill(250, 250, 255);
      stroke(COL_CARD_BORDER);
      strokeWeight(1);
    }
    rect(btn.x, btn.y, btn.w, btn.h, 10);

    // Label
    noStroke();
    fill(active ? COL_ACCENT : COL_TEXT);
    textSize(17);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(names[i].label, btn.x + btn.w / 2, btn.y + btn.h / 2 - 4);
    textStyle(NORMAL);

    // Sub label
    fill(active ? COL_ACCENT : COL_MUTED);
    textSize(9);
    text(names[i].sub, btn.x + btn.w / 2, btn.y + btn.h - 8);
  }

  // ── Active name display ──
  var dispY = nameBtns[2].y + nameBtns[2].h + 22;

  // Card
  fill(COL_CARD_BG);
  stroke(COL_ACCENT);
  strokeWeight(2);
  var cardX = 14, cardW = LEFT_W - 28, cardH = 80;
  rect(cardX, dispY, cardW, cardH, 12);

  // Big name
  noStroke();
  fill(COL_ACCENT);
  textSize(28);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(names[activeNameStyle].label, LEFT_W / 2, dispY + 28);
  textStyle(NORMAL);

  // Explanation
  fill(COL_MUTED);
  textSize(10);
  textAlign(CENTER, CENTER);
  var explanations = [
    "Vertex (" + pointB + ") is always\nin the middle",
    "Same angle, read\nthe other way around",
    "Short form when there\u2019s\nonly one angle at " + pointB
  ];
  var expLines = explanations[activeNameStyle].split("\n");
  for (var k = 0; k < expLines.length; k++) {
    text(expLines[k], LEFT_W / 2, dispY + 56 + k * 13);
  }

  // ── How to read guide ──
  var guideY = dispY + cardH + 20;
  noStroke();
  fill(COL_TEXT);
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("How to read:", 20, guideY);
  textStyle(NORMAL);
  fill(80);
  textSize(10);
  textAlign(LEFT, TOP);

  var readTexts = [
    "\"Angle " + pointA + "-" + pointB + "-" + pointC + "\"\nThe vertex letter (" + pointB + ")\nis always in the middle.",
    "\"Angle " + pointC + "-" + pointB + "-" + pointA + "\"\nSame angle, just name\nthe points in reverse.",
    "\"Angle " + pointB + "\"\nUse when there is only\none angle at this vertex."
  ];
  var rLines = readTexts[activeNameStyle].split("\n");
  for (var m = 0; m < rLines.length; m++) {
    text(rLines[m], 20, guideY + 18 + m * 14);
  }
}

// ═══════════════════════════════════════════
// RIGHT PANEL — Degree + Angle Type
// ═══════════════════════════════════════════
function drawRightPanel() {
  var px = canvasW - RIGHT_W;

  // Panel background
  fill(COL_PANEL_BG);
  noStroke();
  rect(px, TOP_H, RIGHT_W, canvasH - TOP_H - BOTTOM_H);
  // Left border
  stroke(215, 220, 235);
  strokeWeight(1);
  line(px, TOP_H, px, canvasH - BOTTOM_H);

  var cx = px + RIGHT_W / 2;
  var pad = 16;
  var cardW = RIGHT_W - pad * 2;

  // ── Degree Card ──
  var degY = TOP_H + 18;
  var displayDeg = Math.round(currentAngle * 10) / 10;
  var isSpec = isSpecialAngle(displayDeg);

  // Section label
  noStroke();
  fill(COL_ACCENT);
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Measurement", cx, degY);
  textStyle(NORMAL);

  // Card
  var cardY = degY + 24;
  var cardH = 90;
  fill(COL_CARD_BG);
  stroke(isSpec ? COL_SPECIAL : COL_CARD_BORDER);
  strokeWeight(isSpec ? 3 : 1.5);
  rect(px + pad, cardY, cardW, cardH, 14);

  // Degree value
  noStroke();
  fill(isSpec ? COL_SPECIAL : COL_ACCENT);
  textSize(40);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(displayDeg + "\u00B0", cx, cardY + cardH / 2 - 6);
  textStyle(NORMAL);

  // Special badge
  if (isSpec) {
    fill(COL_SPECIAL);
    textSize(11);
    textStyle(BOLD);
    text("\u2605 Special Angle", cx, cardY + cardH - 12);
    textStyle(NORMAL);
  }

  // ── Angle Type Card ──
  var typeY = cardY + cardH + 18;
  var info = getAngleType(displayDeg);

  noStroke();
  fill(info.col);
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Angle Type", cx, typeY);
  textStyle(NORMAL);

  var tCardY = typeY + 22;
  var tCardH = 78;
  fill(red(info.col), green(info.col), blue(info.col), 12);
  stroke(info.col);
  strokeWeight(2);
  rect(px + pad, tCardY, cardW, tCardH, 12);

  // Type name
  noStroke();
  fill(info.col);
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(info.name, cx, tCardY + 22);
  textStyle(NORMAL);

  // Description (word-wrap)
  fill(90);
  textSize(10);
  var maxTW = cardW - 16;
  var words = info.desc.split(" ");
  var ln = "", lines = [];
  for (var i = 0; i < words.length; i++) {
    var test = ln + (ln ? " " : "") + words[i];
    if (textWidth(test) > maxTW && ln) { lines.push(ln); ln = words[i]; }
    else ln = test;
  }
  if (ln) lines.push(ln);
  for (var j = 0; j < lines.length; j++) {
    text(lines[j], cx, tCardY + 44 + j * 13);
  }

  // ── Angle Range Diagram ──
  var rangeY = tCardY + tCardH + 20;
  drawAngleRanges(px + pad, rangeY, cardW, displayDeg);
}

// ═══════════════════════════════════════════
// Angle Range Visual (right panel mini diagram)
// ═══════════════════════════════════════════
function drawAngleRanges(x, y, w, currentDeg) {
  noStroke();
  fill(COL_TEXT);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Angle Ranges", x + w / 2, y);
  textStyle(NORMAL);

  var ranges = [
    { label: "Acute",    lo: 0,   hi: 90,  col: COL_ACUTE },
    { label: "Right",    lo: 90,  hi: 90,  col: COL_RIGHT },
    { label: "Obtuse",   lo: 90,  hi: 180, col: COL_OBTUSE },
    { label: "Straight", lo: 180, hi: 180, col: COL_STRAIGHT },
    { label: "Reflex",   lo: 180, hi: 360, col: COL_REFLEX },
    { label: "Full",     lo: 360, hi: 360, col: COL_FULL }
  ];

  var barY = y + 18;
  var barH = 8;
  var totalW = w;

  // Background bar (0-360)
  fill(235, 238, 245);
  noStroke();
  rect(x, barY, totalW, barH, 4);

  // Fill to current angle
  var fillW = map(currentDeg, 0, 360, 0, totalW);
  fill(red(COL_ACCENT), green(COL_ACCENT), blue(COL_ACCENT), 60);
  rect(x, barY, fillW, barH, 4);

  // Current position marker
  var markerX = x + fillW;
  fill(COL_ACCENT);
  noStroke();
  triangle(markerX - 4, barY - 2, markerX + 4, barY - 2, markerX, barY + 3);

  // Tick marks for key angles
  var ticks = [0, 90, 180, 270, 360];
  for (var i = 0; i < ticks.length; i++) {
    var tx = x + map(ticks[i], 0, 360, 0, totalW);
    stroke(180); strokeWeight(1);
    line(tx, barY, tx, barY + barH);
    noStroke();
    fill(COL_MUTED);
    textSize(8);
    textAlign(CENTER, TOP);
    text(ticks[i] + "\u00B0", tx, barY + barH + 3);
  }

  // Range labels below
  var lblY = barY + barH + 16;
  textSize(9);
  textAlign(LEFT, TOP);
  for (var j = 0; j < ranges.length; j++) {
    var r = ranges[j];
    var isActive = false;

    if (r.lo === r.hi) {
      isActive = Math.abs(currentDeg - r.lo) < 0.5;
    } else {
      isActive = currentDeg > r.lo && currentDeg < r.hi;
    }

    fill(isActive ? r.col : color(180));
    textStyle(isActive ? BOLD : NORMAL);

    // Arrange in two columns
    var col = j % 2;
    var row = Math.floor(j / 2);
    var lx = x + col * (w / 2) + 4;
    var ly = lblY + row * 14;

    // Color dot
    noStroke();
    fill(r.col);
    circle(lx + 4, ly + 5, 6);
    fill(isActive ? r.col : color(140));
    textAlign(LEFT, TOP);
    text(r.label, lx + 12, ly);
  }
  textStyle(NORMAL);
}

// ═══════════════════════════════════════════
// BOTTOM BAR — Quick Jump + Snap
// ═══════════════════════════════════════════
function drawBottomBar() {
  var barTop = canvasH - BOTTOM_H;

  // Background
  fill(255, 255, 255, 220);
  noStroke();
  rect(0, barTop, canvasW, BOTTOM_H);
  stroke(215, 220, 235);
  strokeWeight(1);
  line(0, barTop, canvasW, barTop);

  // Label
  noStroke();
  fill(COL_MUTED);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Quick Jump to Special Angles", canvasW / 2, barTop + 10);
  textStyle(NORMAL);

  var deg = Math.round(currentAngle * 10) / 10;

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
    textSize(13);
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
  text(snapMode ? "\u2713 Snap ON" : "Snap to Special", snapBtn.x + snapBtn.w / 2, snapBtn.y + snapBtn.h / 2);
  textStyle(NORMAL);

  // Footer hint
  noStroke();
  fill(185);
  textSize(9);
  textAlign(CENTER, CENTER);
  text("Drag the purple handle  \u2022  Click buttons to jump  \u2022  Toggle snap for precision", canvasW / 2, canvasH - 10);
}

// ═══════════════════════════════════════════
// CENTER — Special Angle Markers
// ═══════════════════════════════════════════
function drawSpecialAngleMarkers() {
  var markerAngles = [30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
  var markerLen = rayLength + 20;

  for (var i = 0; i < markerAngles.length; i++) {
    var a = markerAngles[i];
    var rad = -radians(a);
    var ex = centerX + cos(rad) * markerLen;
    var ey = centerY + sin(rad) * markerLen;

    stroke(210, 218, 235, 60);
    strokeWeight(1);
    drawingContext.setLineDash([3, 6]);
    line(centerX, centerY, ex, ey);
    drawingContext.setLineDash([]);

    // Label
    var lr = markerLen + 14;
    var lx = centerX + cos(rad) * lr;
    var ly = centerY + sin(rad) * lr;
    noStroke();
    fill(185, 192, 210);
    textSize(8);
    textAlign(CENTER, CENTER);
    text(a + "\u00B0", lx, ly);
  }
}

// ═══════════════════════════════════════════
// CENTER — Angle Rays
// ═══════════════════════════════════════════
function drawAngleRays() {
  var aRad = -radians(currentAngle);

  // Endpoints
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

  // Drag handle
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
// CENTER — Angle Arc
// ═══════════════════════════════════════════
function drawAngleArc() {
  var deg = currentAngle;
  if (deg < 0.5) return;

  var endA = -radians(deg);

  // Filled wedge
  fill(red(COL_ARC), green(COL_ARC), blue(COL_ARC), 25);
  noStroke();
  beginShape();
  vertex(centerX, centerY);
  for (var a = 0; a >= endA; a -= 0.04) {
    vertex(centerX + cos(a) * arcRadius, centerY + sin(a) * arcRadius);
  }
  vertex(centerX + cos(endA) * arcRadius, centerY + sin(endA) * arcRadius);
  endShape(CLOSE);

  // Arc stroke
  noFill();
  stroke(COL_ARC);
  strokeWeight(2.5);
  arc(centerX, centerY, arcRadius * 2, arcRadius * 2, endA, 0);

  // Right-angle square
  if (Math.abs(deg - 90) < 1) {
    var sq = Math.min(20, arcRadius * 0.4);
    stroke(COL_RIGHT);
    strokeWeight(2.5);
    noFill();
    line(centerX + sq, centerY, centerX + sq, centerY - sq);
    line(centerX + sq, centerY - sq, centerX, centerY - sq);
  }

  // Degree label on arc
  var midR = -radians(deg / 2);
  var lr = arcRadius + 20;
  noStroke();
  fill(COL_ACCENT);
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  var dd = Math.round(currentAngle * 10) / 10;
  text(dd + "\u00B0", centerX + cos(midR) * lr, centerY + sin(midR) * lr);
  textStyle(NORMAL);
}

// ═══════════════════════════════════════════
// CENTER — Point Labels
// ═══════════════════════════════════════════
function drawPointLabels() {
  var aRad = -radians(currentAngle);
  var off = 26;

  // C (fixed)
  noStroke();
  fill(COL_RAY);
  textSize(17);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(pointC, centerX + rayLength + off, centerY);

  // A (movable)
  fill(COL_HANDLE);
  text(pointA,
    centerX + cos(aRad) * (rayLength + off),
    centerY + sin(aRad) * (rayLength + off));

  // B (vertex)
  fill(COL_VERTEX);
  text(pointB, centerX - 20, centerY + 20);
  textStyle(NORMAL);
}

// ═══════════════════════════════════════════
// Angle Type Classification
// ═══════════════════════════════════════════
function getAngleType(deg) {
  if (deg < 0.5)              return { name: "Zero Angle",     col: COL_FULL,     desc: "The two rays overlap completely (0\u00B0)" };
  if (deg < 90)               return { name: "Acute Angle",    col: COL_ACUTE,    desc: "Less than 90\u00B0 \u2014 a sharp, small angle" };
  if (Math.abs(deg - 90) < 0.5)  return { name: "Right Angle",col: COL_RIGHT,    desc: "Exactly 90\u00B0 \u2014 a perfect corner" };
  if (deg < 180)              return { name: "Obtuse Angle",   col: COL_OBTUSE,   desc: "Between 90\u00B0 and 180\u00B0 \u2014 wider than a right angle" };
  if (Math.abs(deg - 180) < 0.5) return { name: "Straight Angle", col: COL_STRAIGHT, desc: "Exactly 180\u00B0 \u2014 a straight line" };
  if (deg < 360)              return { name: "Reflex Angle",   col: COL_REFLEX,   desc: "Between 180\u00B0 and 360\u00B0 \u2014 more than straight" };
  return                              { name: "Full Angle",    col: COL_FULL,     desc: "Exactly 360\u00B0 \u2014 a complete rotation" };
}

// ═══════════════════════════════════════════
// Particles
// ═══════════════════════════════════════════
function triggerParticles() {
  var midRad = -radians(currentAngle / 2);
  var px = centerX + cos(midRad) * arcRadius;
  var py = centerY + sin(midRad) * arcRadius;
  for (var i = 0; i < 15; i++) {
    particles.push({
      x: px, y: py,
      vx: random(-3, 3), vy: random(-4, -1),
      col: color(random(180, 255), random(100, 255), random(50, 200)),
      size: random(4, 9), life: 40
    });
  }
}

function updateParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
  var deg = Math.round(currentAngle);
  if (isSpecialAngle(deg) && lastSpecialHit !== deg) {
    triggerParticles();
    lastSpecialHit = deg;
  }
  if (!isSpecialAngle(deg)) lastSpecialHit = -1;
}

function drawParticles() {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    var a = map(p.life, 0, 40, 0, 255);
    noStroke();
    fill(red(p.col), green(p.col), blue(p.col), a);
    circle(p.x, p.y, p.size);
  }
}

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════
function isSpecialAngle(deg) {
  for (var i = 0; i < SPECIAL_ANGLES.length; i++) {
    if (Math.abs(deg - SPECIAL_ANGLES[i]) < 1) return true;
  }
  return false;
}

function findNearestSpecial(deg) {
  var nearest = deg, minD = 999;
  for (var i = 0; i < SPECIAL_ANGLES.length; i++) {
    var d = Math.abs(deg - SPECIAL_ANGLES[i]);
    if (d < minD) { minD = d; nearest = SPECIAL_ANGLES[i]; }
  }
  return { angle: nearest, dist: minD };
}

function insideBtnRect(btn) {
  return mouseX >= btn.x && mouseX <= btn.x + btn.w &&
         mouseY >= btn.y && mouseY <= btn.y + btn.h;
}

// ═══════════════════════════════════════════
// Mouse Interaction
// ═══════════════════════════════════════════
function mousePressed() {
  // Quick-jump buttons
  for (var i = 0; i < quickBtns.length; i++) {
    if (insideBtnRect(quickBtns[i])) {
      targetAngle = quickBtns[i].angle;
      return;
    }
  }

  // Naming buttons (left panel)
  for (var j = 0; j < nameBtns.length; j++) {
    if (insideBtnRect(nameBtns[j])) {
      activeNameStyle = j;
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

  // Click in viz area to start dragging
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

  if (snapMode) {
    var nearest = findNearestSpecial(angleDeg);
    if (nearest.dist < SNAP_THRESHOLD) {
      angleDeg = nearest.angle;
    }
  }

  targetAngle = angleDeg;
  currentAngle = angleDeg;
}
