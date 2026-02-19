/* jshint esversion: 6 */
// ============================================================
// 17. Sum of Interior Angles of a Polygon — Interactive Teaching Tool
// ============================================================
// Shows how any polygon can be divided into triangles from one vertex.
// Each triangle contributes 180°, so Sum = (n-2) × 180°.
// Supports preset regular polygons, draggable vertices, and custom points.

// ═══════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════
var canvasW, canvasH;
var RIGHT_W;
var TOP_H = 58;
var BOTTOM_H = 130;
var vizCX, vizCY, polyRadius;

// Colors
var COL_BG, COL_PANEL_BG, COL_CARD_BG, COL_CARD_BORDER;
var COL_TEXT, COL_MUTED, COL_ACCENT, COL_EDGE, COL_VERTEX_DOT, COL_DIAG;
var TRI_COLORS = [];
var ANGLE_COLORS = [];

// Polygon
var vertices = [];
var numSides = 5;

// Triangulation (fan from vertex 0)
var tris = [];
var diags = [];
var intAngles = [];

// Drag
var draggingIdx = -1;

// Animation — single timer driving three sequential phases
var animPhase = "idle";   // idle | diags | tris | angles | done
var diagProgress = 0;     // 0 → diags.length
var triProgress = 0;      // 0 → tris.length
var angleReveal = 0;      // 0 → 1
var DIAG_SPEED = 0.045;
var TRI_SPEED = 0.035;
var ANGLE_SPEED = 0.03;

// Custom mode
var customMode = false;

// Particles
var particles = [];

// UI Buttons
var sideBtns = [];
var SIDE_RANGE = [3, 4, 5, 6, 7, 8, 9, 10];
var drawBtn = { x: 0, y: 0, w: 0, h: 40 };
var randomBtn = { x: 0, y: 0, w: 0, h: 40 };
var customBtn = { x: 0, y: 0, w: 0, h: 40 };
var clearBtn = { x: 0, y: 0, w: 0, h: 40 };
var resetBtn = { x: 0, y: 0, w: 0, h: 40 };

var POLY_NAMES = [
  "", "", "", "Triangle", "Quadrilateral", "Pentagon",
  "Hexagon", "Heptagon", "Octagon", "Nonagon", "Decagon",
  "Hendecagon", "Dodecagon"
];

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
  COL_TEXT        = color(40, 40, 60);
  COL_MUTED       = color(130, 135, 150);
  COL_ACCENT      = color(80, 60, 200);
  COL_EDGE        = color(50, 50, 70);
  COL_VERTEX_DOT  = color(80, 60, 200);
  COL_DIAG        = color(50, 50, 70);

  TRI_COLORS = [
    color(140, 90, 220), color(40, 180, 120),
    color(240, 140, 40), color(50, 130, 230),
    color(220, 60, 140), color(180, 60, 60),
    color(60, 180, 200), color(200, 180, 40)
  ];
  ANGLE_COLORS = [
    color(140, 90, 220),  color(50, 130, 230),
    color(220, 60, 100),  color(40, 180, 120),
    color(240, 140, 40),  color(180, 60, 60),
    color(60, 180, 200),  color(200, 180, 40),
    color(160, 60, 180),  color(80, 160, 60),
    color(200, 100, 160), color(100, 100, 200)
  ];

  updateLayout();
  generateRegularPolygon(numSides);
}

function windowResized() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  resizeCanvas(canvasW, canvasH);
  updateLayout();
  generateRegularPolygon(numSides);
}

// ═══════════════════════════════════════════
// Layout
// ═══════════════════════════════════════════
function updateLayout() {
  RIGHT_W = constrain(canvasW * 0.20, 200, 260);
  var vizW = canvasW - RIGHT_W;
  var vizH = canvasH - TOP_H - BOTTOM_H;
  vizCX = vizW / 2;
  vizCY = TOP_H + vizH / 2;
  polyRadius = Math.min(vizW, vizH) * 0.30;
  polyRadius = constrain(polyRadius, 80, 220);

  sideBtns = [];
  var btnW = 38, btnH = 32, gap = 4;
  var sideStartX = 164;
  for (var i = 0; i < SIDE_RANGE.length; i++) {
    sideBtns.push({
      x: sideStartX + i * (btnW + gap),
      y: (TOP_H - btnH) / 2,
      w: btnW, h: btnH,
      n: SIDE_RANGE[i]
    });
  }

  var rpx = canvasW - RIGHT_W + 14;
  var rpw = RIGHT_W - 28;
  var bY = TOP_H + 14;
  drawBtn.x = rpx; drawBtn.y = bY; drawBtn.w = rpw; drawBtn.h = 42;
  randomBtn.x = rpx; randomBtn.y = bY + 50; randomBtn.w = (rpw - 6) / 2; randomBtn.h = 36;
  customBtn.x = rpx + randomBtn.w + 6; customBtn.y = bY + 50; customBtn.w = randomBtn.w; customBtn.h = 36;
  clearBtn.x = rpx; clearBtn.y = bY + 92; clearBtn.w = (rpw - 6) / 2; clearBtn.h = 32;
  resetBtn.x = rpx + clearBtn.w + 6; resetBtn.y = bY + 92; resetBtn.w = clearBtn.w; resetBtn.h = 32;
}

// ═══════════════════════════════════════════
// Polygon Generation
// ═══════════════════════════════════════════
function generateRegularPolygon(n) {
  numSides = n;
  vertices = [];
  for (var i = 0; i < n; i++) {
    var a = TWO_PI * i / n - HALF_PI;
    vertices.push({ x: vizCX + polyRadius * cos(a), y: vizCY + polyRadius * sin(a) });
  }
  recomputeGeometry();
  resetAnimation();
}

function randomizeVertices() {
  var n = vertices.length;
  var pts = [];
  for (var i = 0; i < n; i++) {
    var a = TWO_PI * i / n + random(-0.35, 0.35);
    var r = polyRadius * random(0.55, 1.05);
    pts.push({ x: vizCX + r * cos(a), y: vizCY + r * sin(a) });
  }
  sortByAngle(pts);
  vertices = pts;
  recomputeGeometry();
  resetAnimation();
}

function sortByAngle(pts) {
  var cx = 0, cy = 0;
  for (var i = 0; i < pts.length; i++) { cx += pts[i].x; cy += pts[i].y; }
  cx /= pts.length; cy /= pts.length;
  pts.sort(function(a, b) {
    return atan2(a.y - cy, a.x - cx) - atan2(b.y - cy, b.x - cx);
  });
}

// ═══════════════════════════════════════════
// Geometry Computation
// ═══════════════════════════════════════════
function recomputeGeometry() {
  var n = vertices.length;
  tris = [];
  diags = [];
  intAngles = [];
  if (n < 3) return;

  for (var i = 1; i < n - 1; i++) {
    tris.push([0, i, i + 1]);
    if (i > 1) diags.push([0, i]);
  }

  for (var j = 0; j < n; j++) {
    var prev = vertices[(j - 1 + n) % n];
    var curr = vertices[j];
    var next = vertices[(j + 1) % n];
    var a1 = atan2(prev.y - curr.y, prev.x - curr.x);
    var a2 = atan2(next.y - curr.y, next.x - curr.x);
    var sweep = a1 - a2;
    while (sweep < 0) sweep += TWO_PI;
    while (sweep > TWO_PI) sweep -= TWO_PI;
    intAngles.push(degrees(sweep));
  }
}

function resetAnimation() {
  animPhase = "idle";
  diagProgress = 0;
  triProgress = 0;
  angleReveal = 0;
}

// ═══════════════════════════════════════════
// Main Draw
// ═══════════════════════════════════════════
function draw() {
  background(COL_BG);
  updateAnimation();
  drawTopBar();
  drawRightPanel();
  drawPolygonViz();
  drawBottomBar();
  updateParticles();
  drawParticles();
}

// ═══════════════════════════════════════════
// Animation
// ═══════════════════════════════════════════
function updateAnimation() {
  if (animPhase === "diags") {
    diagProgress += DIAG_SPEED;
    if (diagProgress >= diags.length) {
      diagProgress = diags.length;
      animPhase = "tris";
      triProgress = 0;
    }
  } else if (animPhase === "tris") {
    triProgress += TRI_SPEED;
    if (triProgress >= tris.length) {
      triProgress = tris.length;
      animPhase = "angles";
      angleReveal = 0;
    }
  } else if (animPhase === "angles") {
    angleReveal += ANGLE_SPEED;
    if (angleReveal >= 1) {
      angleReveal = 1;
      animPhase = "done";
      triggerParticles(vizCX, vizCY);
    }
  }
}

function startAnimation() {
  if (vertices.length < 3) return;
  diagProgress = 0;
  triProgress = 0;
  angleReveal = 0;
  if (diags.length > 0) {
    animPhase = "diags";
  } else {
    animPhase = "tris";
  }
}

// ═══════════════════════════════════════════
// Top Bar
// ═══════════════════════════════════════════
function drawTopBar() {
  fill(255, 255, 255, 210);
  noStroke();
  rect(0, 0, canvasW, TOP_H);
  stroke(215, 220, 235);
  strokeWeight(1);
  line(0, TOP_H, canvasW, TOP_H);

  noStroke();
  fill(COL_ACCENT);
  textSize(16);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text("Polygon Interior Angles", 14, TOP_H / 2);
  textStyle(NORMAL);

  fill(COL_TEXT);
  textSize(13);
  textStyle(BOLD);
  text("Sides:", 126, TOP_H / 2);
  textStyle(NORMAL);

  for (var i = 0; i < sideBtns.length; i++) {
    var btn = sideBtns[i];
    var active = (btn.n === vertices.length && !customMode);
    var hov = ptInRect(mouseX, mouseY, btn);

    if (active) {
      fill(COL_ACCENT);
      noStroke();
    } else if (hov) {
      fill(230, 228, 255);
      stroke(COL_ACCENT);
      strokeWeight(1.5);
    } else {
      fill(COL_CARD_BG);
      stroke(COL_CARD_BORDER);
      strokeWeight(1);
    }
    rect(btn.x, btn.y, btn.w, btn.h, 6);

    noStroke();
    fill(active ? 255 : COL_TEXT);
    textSize(13);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(btn.n, btn.x + btn.w / 2, btn.y + btn.h / 2);
    textStyle(NORMAL);
  }
}

// ═══════════════════════════════════════════
// Right Panel
// ═══════════════════════════════════════════
function drawRightPanel() {
  var px = canvasW - RIGHT_W;

  fill(COL_PANEL_BG);
  noStroke();
  rect(px, TOP_H, RIGHT_W, canvasH - TOP_H);
  stroke(215, 220, 235);
  strokeWeight(1);
  line(px, TOP_H, px, canvasH);

  var pad = 14;
  var cx = px + RIGHT_W / 2;
  var cardW = RIGHT_W - pad * 2;

  // ── Draw Triangles / Reset button ──
  var isIdle = (animPhase === "idle");
  var isDone = (animPhase === "done");
  var canClick = isIdle || isDone;
  var btnLabel = isDone ? "Reset" : "DRAW TRIANGLES";
  var btnHov = ptInRect(mouseX, mouseY, drawBtn);

  if (btnHov && canClick) {
    fill(COL_ACCENT);
  } else if (canClick) {
    fill(red(COL_ACCENT), green(COL_ACCENT), blue(COL_ACCENT), 210);
  } else {
    fill(red(COL_ACCENT), green(COL_ACCENT), blue(COL_ACCENT), 80);
  }
  stroke(COL_ACCENT);
  strokeWeight(canClick ? 2 : 1);
  rect(drawBtn.x, drawBtn.y, drawBtn.w, drawBtn.h, 8);

  noStroke();
  fill(255);
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(btnLabel, drawBtn.x + drawBtn.w / 2, drawBtn.y + drawBtn.h / 2);
  textStyle(NORMAL);

  // ── Small buttons ──
  drawSmallBtn(randomBtn, "\uD83C\uDFB2 Random", false);
  drawSmallBtn(customBtn, customMode ? "\u2713 Custom" : "Custom", customMode);
  drawSmallBtn(clearBtn, "Clear", false);
  drawSmallBtn(resetBtn, "Regular", false);

  // ── Formula Card ──
  var fY = drawBtn.y + 138;
  noStroke();
  fill(COL_ACCENT);
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Formula", cx, fY);
  textStyle(NORMAL);

  var fcY = fY + 18;
  var fcH = 52;
  fill(red(COL_ACCENT), green(COL_ACCENT), blue(COL_ACCENT), 12);
  stroke(COL_ACCENT);
  strokeWeight(2);
  rect(px + pad, fcY, cardW, fcH, 10);

  noStroke();
  fill(COL_ACCENT);
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("(n \u2212 2) \u00D7 180\u00B0", cx, fcY + 18);
  textStyle(NORMAL);
  fill(COL_MUTED);
  textSize(10);
  text("n = number of sides", cx, fcY + 40);

  // ── Current Polygon Stats ──
  var n = vertices.length;
  var numTri = Math.max(0, n - 2);
  var totalAngle = numTri * 180;
  var polyName = (n < POLY_NAMES.length) ? POLY_NAMES[n] : (n + "-gon");

  var sY = fcY + fcH + 14;
  noStroke();
  fill(COL_TEXT);
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Current Polygon", cx, sY);
  textStyle(NORMAL);

  var scY = sY + 18;
  var scH = 102;
  fill(COL_CARD_BG);
  stroke(COL_CARD_BORDER);
  strokeWeight(1);
  rect(px + pad, scY, cardW, scH, 10);

  noStroke();
  textAlign(LEFT, TOP);
  var lx = px + pad + 10;

  fill(COL_ACCENT);
  textSize(14);
  textStyle(BOLD);
  text(polyName, lx, scY + 8);
  textStyle(NORMAL);

  fill(COL_TEXT);
  textSize(11);
  text("Sides (n):  " + n, lx, scY + 30);
  text("Triangles:  " + n + " \u2212 2 = " + numTri, lx, scY + 46);

  fill(COL_ACCENT);
  textStyle(BOLD);
  text("Sum:  (" + n + " \u2212 2) \u00D7 180\u00B0", lx, scY + 64);
  fill(color(220, 60, 60));
  textSize(16);
  text("= " + totalAngle + "\u00B0", lx, scY + 82);
  textStyle(NORMAL);

  // ── Explanation ──
  var eY = scY + scH + 14;
  noStroke();
  fill(COL_TEXT);
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("Why it works:", px + pad + 4, eY);
  textStyle(NORMAL);

  fill(COL_MUTED);
  textSize(10);
  var steps = [
    "1. Pick any vertex",
    "2. Draw diagonals to all",
    "   non-adjacent vertices",
    "3. This splits the polygon",
    "   into (n\u22122) triangles",
    "4. Each triangle = 180\u00B0",
    "5. Total = (n\u22122) \u00D7 180\u00B0"
  ];
  for (var s = 0; s < steps.length; s++) {
    text(steps[s], px + pad + 4, eY + 18 + s * 14);
  }

  // ── Each Interior Angle (regular) ──
  var raY = eY + 18 + steps.length * 14 + 10;
  if (n >= 3) {
    var regAngle = Math.round(totalAngle / n * 10) / 10;
    noStroke();
    fill(COL_TEXT);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text("Regular interior angle:", px + pad + 4, raY);
    textStyle(NORMAL);
    fill(COL_ACCENT);
    textSize(13);
    textStyle(BOLD);
    text(totalAngle + "\u00B0 \u00F7 " + n + " = " + regAngle + "\u00B0", px + pad + 4, raY + 16);
    textStyle(NORMAL);
  }
}

function drawSmallBtn(btn, label, active) {
  var hov = ptInRect(mouseX, mouseY, btn);
  if (active) {
    fill(red(COL_ACCENT), green(COL_ACCENT), blue(COL_ACCENT), 25);
    stroke(COL_ACCENT);
    strokeWeight(2);
  } else if (hov) {
    fill(235, 232, 255);
    stroke(COL_ACCENT);
    strokeWeight(1.5);
  } else {
    fill(COL_CARD_BG);
    stroke(COL_CARD_BORDER);
    strokeWeight(1);
  }
  rect(btn.x, btn.y, btn.w, btn.h, 6);

  noStroke();
  fill(active ? COL_ACCENT : COL_TEXT);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  textStyle(NORMAL);
}

// ═══════════════════════════════════════════
// Polygon Visualization
// ═══════════════════════════════════════════
function drawPolygonViz() {
  var n = vertices.length;
  if (n < 2) {
    noStroke();
    fill(COL_MUTED);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(customMode ? "Click to add points (need \u2265 3)" : "Select a polygon", vizCX, vizCY);
    return;
  }
  if (n === 2) {
    stroke(COL_EDGE);
    strokeWeight(2);
    line(vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y);
    drawVertexDots();
    noStroke();
    fill(COL_MUTED);
    textSize(14);
    textAlign(CENTER, CENTER);
    text("Add at least 1 more point", vizCX, vizCY + polyRadius + 30);
    return;
  }

  drawTriangleFills();
  drawDiagonalLines();
  drawPolygonEdges();

  if (animPhase === "angles" || animPhase === "done") {
    drawAngleArcs();
  }

  drawVertexDots();
}

// ── Triangle Fills ──
function drawTriangleFills() {
  var shown;
  if (animPhase === "tris") {
    shown = triProgress;
  } else if (animPhase === "angles" || animPhase === "done") {
    shown = tris.length;
  } else {
    return;
  }

  for (var t = 0; t < tris.length; t++) {
    var fadeAlpha;
    if (t < Math.floor(shown)) {
      fadeAlpha = 1.0;
    } else if (t < Math.ceil(shown)) {
      fadeAlpha = shown - t;
    } else {
      continue;
    }

    var tri = tris[t];
    var v0 = vertices[tri[0]];
    var v1 = vertices[tri[1]];
    var v2 = vertices[tri[2]];
    var col = TRI_COLORS[t % TRI_COLORS.length];

    fill(red(col), green(col), blue(col), 55 * fadeAlpha);
    noStroke();
    triangle(v0.x, v0.y, v1.x, v1.y, v2.x, v2.y);

    // Triangle label
    if (fadeAlpha > 0.5) {
      var tcx = (v0.x + v1.x + v2.x) / 3;
      var tcy = (v0.y + v1.y + v2.y) / 3;
      noStroke();
      fill(red(col), green(col), blue(col), 180 * fadeAlpha);
      textSize(12);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text("180\u00B0", tcx, tcy);
      textStyle(NORMAL);
    }
  }
}

// ── Diagonal Lines ──
function drawDiagonalLines() {
  var shown;
  if (animPhase === "diags") {
    shown = diagProgress;
  } else if (animPhase === "tris" || animPhase === "angles" || animPhase === "done") {
    shown = diags.length;
  } else {
    return;
  }

  for (var d = 0; d < diags.length; d++) {
    var lineProgress;
    if (d < Math.floor(shown)) {
      lineProgress = 1.0;
    } else if (d < Math.ceil(shown)) {
      lineProgress = shown - d;
    } else {
      continue;
    }

    var from = vertices[diags[d][0]];
    var to = vertices[diags[d][1]];
    var ex = lerp(from.x, to.x, lineProgress);
    var ey = lerp(from.y, to.y, lineProgress);

    stroke(COL_DIAG);
    strokeWeight(2);
    drawingContext.setLineDash([8, 6]);
    line(from.x, from.y, ex, ey);
    drawingContext.setLineDash([]);
  }
}

// ── Polygon Edges ──
function drawPolygonEdges() {
  var n = vertices.length;
  stroke(COL_EDGE);
  strokeWeight(3);
  for (var i = 0; i < n; i++) {
    line(vertices[i].x, vertices[i].y,
         vertices[(i + 1) % n].x, vertices[(i + 1) % n].y);
  }
}

// ── Vertex Dots ──
function drawVertexDots() {
  for (var i = 0; i < vertices.length; i++) {
    var v = vertices[i];
    var hov = dist(mouseX, mouseY, v.x, v.y) < 18;

    if (hov || draggingIdx === i) {
      noFill();
      stroke(COL_VERTEX_DOT);
      strokeWeight(2);
      circle(v.x, v.y, 28);
    }

    noStroke();
    fill(i === 0 ? color(220, 60, 60) : COL_VERTEX_DOT);
    circle(v.x, v.y, 14);
    fill(255);
    circle(v.x, v.y, 6);
  }
}

// ── Interior Angle Arcs ──
function drawAngleArcs() {
  var n = vertices.length;
  var arcR = Math.min(30, polyRadius * 0.18);
  var reveal = (animPhase === "angles") ? angleReveal : 1.0;

  for (var i = 0; i < n; i++) {
    var prev = vertices[(i - 1 + n) % n];
    var curr = vertices[i];
    var next = vertices[(i + 1) % n];

    var a1 = atan2(prev.y - curr.y, prev.x - curr.x);
    var a2 = atan2(next.y - curr.y, next.x - curr.x);
    var sweep = a1 - a2;
    while (sweep < 0) sweep += TWO_PI;
    while (sweep > TWO_PI) sweep -= TWO_PI;

    var col = ANGLE_COLORS[i % ANGLE_COLORS.length];
    var drawSweep = sweep * reveal;

    // Filled wedge
    fill(red(col), green(col), blue(col), 70 * reveal);
    noStroke();
    beginShape();
    vertex(curr.x, curr.y);
    for (var a = a2; a <= a2 + drawSweep; a += 0.05) {
      vertex(curr.x + cos(a) * arcR, curr.y + sin(a) * arcR);
    }
    vertex(curr.x + cos(a2 + drawSweep) * arcR, curr.y + sin(a2 + drawSweep) * arcR);
    endShape(CLOSE);

    // Arc stroke
    noFill();
    stroke(red(col), green(col), blue(col), 220 * reveal);
    strokeWeight(2.5);
    arc(curr.x, curr.y, arcR * 2, arcR * 2, a2, a2 + drawSweep);

    // Angle label
    if (reveal > 0.4) {
      var midA = a2 + drawSweep / 2;
      var lr = arcR + 16;
      noStroke();
      fill(red(col), green(col), blue(col), 255 * reveal);
      textSize(10);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text(Math.round(intAngles[i]) + "\u00B0",
        curr.x + cos(midA) * lr, curr.y + sin(midA) * lr);
      textStyle(NORMAL);
    }
  }
}

// ═══════════════════════════════════════════
// Bottom Bar — Visual Angle Sum Equation
// ═══════════════════════════════════════════
function drawBottomBar() {
  var barTop = canvasH - BOTTOM_H;
  var barW = canvasW - RIGHT_W;

  fill(255, 255, 255, 220);
  noStroke();
  rect(0, barTop, barW, BOTTOM_H);
  stroke(215, 220, 235);
  strokeWeight(1);
  line(0, barTop, barW, barTop);

  var n = vertices.length;
  if (n < 3) return;

  var numTri = n - 2;
  var totalAngle = numTri * 180;
  var barCX = barW / 2;
  var showAngles = (animPhase === "done");

  // Title
  noStroke();
  fill(COL_MUTED);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Interior Angle Sum", barCX, barTop + 5);
  textStyle(NORMAL);

  // Calculate protractor layout
  var plusW = 16;
  var eqTextW = 100;
  var availW = barW - 40;
  var protW = Math.min(52, (availW - (n - 1) * plusW - eqTextW) / n);
  protW = Math.max(26, protW);
  var protR = protW / 2 - 2;

  var totalRowW = n * protW + (n - 1) * plusW + eqTextW;
  var startX = barCX - totalRowW / 2;
  var rowY = barTop + 24 + protR + 16;

  for (var i = 0; i < n; i++) {
    var pcx = startX + i * (protW + plusW) + protW / 2;
    var angleDeg = showAngles ? intAngles[i] : 0;
    var col = ANGLE_COLORS[i % ANGLE_COLORS.length];

    drawMiniProtractor(pcx, rowY, protR, angleDeg, col, showAngles);

    if (i < n - 1) {
      noStroke();
      fill(COL_MUTED);
      textSize(15);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text("+", pcx + protW / 2 + plusW / 2, rowY);
      textStyle(NORMAL);
    }
  }

  // Equals and total
  var eqX = startX + n * (protW + plusW) - plusW + 8;
  noStroke();
  fill(COL_TEXT);
  textSize(16);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text("=", eqX, rowY);

  fill(color(220, 60, 60));
  textSize(20);
  text(totalAngle + "\u00B0", eqX + 22, rowY);
  textStyle(NORMAL);

  // Sub text
  noStroke();
  fill(COL_MUTED);
  textSize(10);
  textAlign(CENTER, TOP);
  var subY = rowY + protR + 14;
  if (showAngles) {
    var angleSum = 0;
    for (var k = 0; k < intAngles.length; k++) angleSum += intAngles[k];
    text("Measured: " + Math.round(angleSum) + "\u00B0  |  Formula: (" + n + "\u22122)\u00D7180\u00B0 = " + totalAngle + "\u00B0",
      barCX, subY);
  } else {
    text("Click \u201CDRAW TRIANGLES\u201D to reveal  |  (" + n + "\u22122)\u00D7180\u00B0 = " + totalAngle + "\u00B0",
      barCX, subY);
  }
}

function drawMiniProtractor(cx, cy, r, angleDeg, col, active) {
  // Base line
  stroke(COL_EDGE);
  strokeWeight(2);
  line(cx - r - 3, cy, cx + r + 3, cy);

  // Semicircle background
  fill(245);
  stroke(200);
  strokeWeight(1);
  arc(cx, cy, r * 2, r * 2, PI, TWO_PI);

  if (!active || angleDeg < 1) return;

  var dispAngle = constrain(angleDeg, 0, 180);
  var startA = PI;
  var endA = PI + radians(dispAngle);

  // Colored wedge
  fill(red(col), green(col), blue(col), 150);
  noStroke();
  beginShape();
  vertex(cx, cy);
  for (var a = startA; a <= endA; a += 0.05) {
    vertex(cx + cos(a) * r, cy + sin(a) * r);
  }
  vertex(cx + cos(endA) * r, cy + sin(endA) * r);
  endShape(CLOSE);

  // Colored arc
  noFill();
  stroke(red(col), green(col), blue(col));
  strokeWeight(2);
  arc(cx, cy, r * 2, r * 2, startA, endA);

  // Angle edge line
  stroke(COL_EDGE);
  strokeWeight(2);
  line(cx, cy, cx + cos(endA) * (r + 4), cy + sin(endA) * (r + 4));

  // Label
  noStroke();
  fill(red(col), green(col), blue(col));
  textSize(Math.max(7, r * 0.55));
  textStyle(BOLD);
  textAlign(CENTER, BOTTOM);
  text(Math.round(angleDeg) + "\u00B0", cx, cy - r - 2);
  textStyle(NORMAL);
}

// ═══════════════════════════════════════════
// Particles
// ═══════════════════════════════════════════
function triggerParticles(px, py) {
  for (var i = 0; i < 25; i++) {
    particles.push({
      x: px + random(-50, 50), y: py + random(-50, 50),
      vx: random(-4, 4), vy: random(-5, -1),
      col: color(random(180, 255), random(100, 255), random(50, 200)),
      size: random(4, 10), life: 50
    });
  }
}

function updateParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    var a = map(p.life, 0, 50, 0, 255);
    noStroke();
    fill(red(p.col), green(p.col), blue(p.col), a);
    circle(p.x, p.y, p.size);
  }
}

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════
function ptInRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

// ═══════════════════════════════════════════
// Mouse Interaction
// ═══════════════════════════════════════════
function mousePressed() {
  // Side buttons
  for (var i = 0; i < sideBtns.length; i++) {
    if (ptInRect(mouseX, mouseY, sideBtns[i])) {
      customMode = false;
      generateRegularPolygon(sideBtns[i].n);
      return;
    }
  }

  // Draw Triangles / Reset
  if (ptInRect(mouseX, mouseY, drawBtn)) {
    if (animPhase === "idle") {
      startAnimation();
    } else if (animPhase === "done") {
      resetAnimation();
    }
    return;
  }

  // Random
  if (ptInRect(mouseX, mouseY, randomBtn)) {
    if (vertices.length >= 3) randomizeVertices();
    return;
  }

  // Custom toggle
  if (ptInRect(mouseX, mouseY, customBtn)) {
    customMode = !customMode;
    if (customMode) {
      vertices = [];
      resetAnimation();
    }
    return;
  }

  // Clear
  if (ptInRect(mouseX, mouseY, clearBtn)) {
    vertices = [];
    resetAnimation();
    customMode = true;
    return;
  }

  // Reset to regular
  if (ptInRect(mouseX, mouseY, resetBtn)) {
    customMode = false;
    generateRegularPolygon(numSides);
    return;
  }

  // Viz area interactions
  var inViz = mouseX < canvasW - RIGHT_W && mouseY > TOP_H && mouseY < canvasH - BOTTOM_H;
  if (!inViz) return;

  // Try dragging a vertex
  for (var v = 0; v < vertices.length; v++) {
    if (dist(mouseX, mouseY, vertices[v].x, vertices[v].y) < 18) {
      draggingIdx = v;
      return;
    }
  }

  // Custom mode: add point
  if (customMode) {
    vertices.push({ x: mouseX, y: mouseY });
    if (vertices.length >= 3) {
      sortByAngle(vertices);
    }
    recomputeGeometry();
    resetAnimation();
  }
}

function mouseDragged() {
  if (draggingIdx < 0) return;
  vertices[draggingIdx].x = constrain(mouseX, 30, canvasW - RIGHT_W - 30);
  vertices[draggingIdx].y = constrain(mouseY, TOP_H + 20, canvasH - BOTTOM_H - 20);
  recomputeGeometry();
}

function mouseReleased() {
  draggingIdx = -1;
}
