/* jshint esversion: 8 */
// ============================================================
// 3D Coordinate – Dimensional Upgrade: 1D → 2D → 3D
// ============================================================
// Interactive 3D exploration with axis-locked dragging,
// plane-lock views, and numeric coordinate controls.
//
// Animation stages (click NEXT or SKIP to advance):
//   1. Positive x-axis (number line)           – 1D
//   2. Full x-axis (negative extension)        – 1D
//   3. Y-axis appears                          – 2D surface
//   4. Grid lines fade in                      – 2D surface
//   5. Characters shake (charge up)
//   6. Characters bounce to 2D positions
//   7. Z-axis grows + camera rotates to 3D     – 3D space
//   8. Interactive 3D with full controls

// ═══════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════
var gridMin = -10;
var gridMax = 10;
var gridSize = gridMax - gridMin; // 20
var personHitRadius = 40;
var profileRadius = 24;

// Canvas (dynamically sized to fill the iframe/window)
var canvasW = 960, canvasH = 880;

// 3D Camera defaults
var CAM_3D_AZ = 0.52;      // azimuth for default 3D view
var CAM_3D_EL = 0.36;      // elevation for default 3D view
var CAM_DIST = 950;         // perspective focal length (px)
var CAM_LERP_SPEED = 0.055; // smooth interpolation speed (preset transitions)
var CAM_ORBIT_LERP  = 0.25;  // faster lerp when orbiting with mouse

// View preset angles: { az, el, ortho }
var VIEW_PRESETS = {
  '3D': { az: CAM_3D_AZ, el: CAM_3D_EL, ortho: 0 },
  'XY': { az: 0, el: 0, ortho: 0.85 },
  'XZ': { az: 0, el: 1.5607, ortho: 0.85 },      // ~PI/2
  'YZ': { az: 1.5607, el: 0, ortho: 0.85 }        // ~PI/2
};

// Axis colors (standard 3D: X=red, Y=green, Z=blue)
var AX_COL_X, AX_COL_Y, AX_COL_Z;

// ═══════════════════════════════════════════
// State
// ═══════════════════════════════════════════
var initialized = false;

// Grid layout (computed in updateLayout)
var originX, originY, cellPx;
var gridLeft, gridRight, gridTop, gridBottom;
var panelX, panelW; // right-side control panel position & width

// Camera state (current + targets for smooth interpolation)
var camAz = 0, camEl = 0, camOrtho = 0;
var camAzTarget = 0, camElTarget = 0, camOrthoTarget = 0;
// Cached trig values (updated each frame)
var _cosAz = 1, _sinAz = 0, _cosEl = 1, _sinEl = 0;

// Current view mode: '3D', 'XY', 'XZ', 'YZ'
var currentView = '3D';
// Axis lock mode: 'free', 'x', 'y', 'z'
var axisLock = 'free';

// Characters – starting positions on x-axis (intro)
var eonXStart = 3, rippaXStart = 7;
// Characters – 3D coordinates (integers, grid units)
var eonX = -4, eonY = 3, eonZ = 0;
var rippaX = 5, rippaY = -2, rippaZ = 0;

// Drag state
var dragTarget = null; // 'eon' | 'rippa' | null
var isDragging = false;
var dragAccumX = 0, dragAccumY = 0, dragAccumZ = 0;

// Orbit state (middle mouse click-and-drag to rotate camera)
var isOrbiting = false;
var orbitSensitivity = 0.006;

// Z-axis animation progress (0 → 1 during z_axis phase)
var zAxisVis = 0;

// Bounce interpolated positions
var eonBounceX, eonBounceY, rippaBounceX, rippaBounceY;

// ═══════════════════════════════════════════
// Phase Machine
// ═══════════════════════════════════════════
var phase = "xaxis_positive";
var phaseStart = 0;
var phaseAnimDone = false;
var shakeIntensity = 0;

var PHASE_DUR = {
  xaxis_positive: 1000,
  xaxis_negative: 1000,
  y_axis: 1000,
  grid_appear: 1200,
  shake: 1800,
  bounce: 1200,
  z_axis: 2800
};

// ═══════════════════════════════════════════
// Buttons
// ═══════════════════════════════════════════
var nextBtn   = { x:0, y:0, w:160, h:44 };
var skipBtn   = { x:0, y:0, w:140, h:36 };
var replayBtn = { x:0, y:0, w:190, h:30 };
var newPosBtn = { x:0, y:0, w:190, h:30 };

// View buttons (3D, XY, XZ, YZ)
var viewBtns = {
  '3D': { x:0, y:0, w:44, h:28 },
  'XY': { x:0, y:0, w:44, h:28 },
  'XZ': { x:0, y:0, w:44, h:28 },
  'YZ': { x:0, y:0, w:44, h:28 }
};

// Axis lock buttons (Free, X, Y, Z)
var lockBtns = {
  'free': { x:0, y:0, w:46, h:28 },
  'x':    { x:0, y:0, w:34, h:28 },
  'y':    { x:0, y:0, w:34, h:28 },
  'z':    { x:0, y:0, w:34, h:28 }
};

// Numeric +/- buttons for each point's axes
var numBtns = {
  eon: {
    x: { minus:{x:0,y:0,w:26,h:22}, plus:{x:0,y:0,w:26,h:22} },
    y: { minus:{x:0,y:0,w:26,h:22}, plus:{x:0,y:0,w:26,h:22} },
    z: { minus:{x:0,y:0,w:26,h:22}, plus:{x:0,y:0,w:26,h:22} }
  },
  rippa: {
    x: { minus:{x:0,y:0,w:26,h:22}, plus:{x:0,y:0,w:26,h:22} },
    y: { minus:{x:0,y:0,w:26,h:22}, plus:{x:0,y:0,w:26,h:22} },
    z: { minus:{x:0,y:0,w:26,h:22}, plus:{x:0,y:0,w:26,h:22} }
  }
};

// ═══════════════════════════════════════════
// Images
// ═══════════════════════════════════════════
var imgKid, imgMe;

// ASSET_FALLBACKS_START
var ASSET_ME_DATA_FALLBACK = "data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAkGgAwAEAAAAAQAAAkIAAAAA/8AAEQgCQgJBAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQ";
var ASSET_KID_DATA_FALLBACK = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgoKCgsLCggKCggICgoKCAgICAgICAgKCggKCAgICAgICAgICAgICA0ICAoICAgICgoKCAgLDQoIDQgICggBAwQEBgUGCgYGCg8NCw0QDQ8PEA8PDQ0PDw8NDw0PDQ4PDQ0NDw0NDw8NDQ0PDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDf/AABEI";
// ASSET_FALLBACKS_END

// ═══════════════════════════════════════════
// Easing Functions
// ═══════════════════════════════════════════
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}
function easeOutBounce(t) {
  if (t < 1/2.75) return 7.5625*t*t;
  if (t < 2/2.75) { t -= 1.5/2.75; return 7.5625*t*t + 0.75; }
  if (t < 2.5/2.75) { t -= 2.25/2.75; return 7.5625*t*t + 0.9375; }
  t -= 2.625/2.75; return 7.5625*t*t + 0.984375;
}
function easeInBack(t) {
  var s = 1.70158;
  return t * t * ((s + 1) * t - s);
}
function easeOutBack(t) {
  var s = 1.70158;
  t = t - 1;
  return t * t * ((s + 1) * t + s) + 1;
}

// ═══════════════════════════════════════════
// Setup
// ═══════════════════════════════════════════
async function setup() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  createCanvas(canvasW, canvasH);
  textFont("Arial");
  textAlign(CENTER, CENTER);

  AX_COL_X = color(220, 65, 55);
  AX_COL_Y = color(50, 170, 50);
  AX_COL_Z = color(55, 100, 225);

  updateLayout();

  var meData = ASSET_ME_DATA_FALLBACK;
  var kidData = ASSET_KID_DATA_FALLBACK;
  if (typeof window !== "undefined" && window.ASSET_ME_DATA) meData = window.ASSET_ME_DATA;
  if (typeof window !== "undefined" && window.ASSET_KID_DATA) kidData = window.ASSET_KID_DATA;

  var base = "";
  try { base = new URL("./", window.location.href).href; } catch (e) { /* ignore */ }

  imgMe  = await loadImage(meData || (base + "assets/me.png"));
  imgKid = await loadImage(kidData || (base + "assets/kid.png"));

  randomizePositions();
  phaseStart = millis();
  initialized = true;
}

function windowResized() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  resizeCanvas(canvasW, canvasH);
  updateLayout();
}

// ═══════════════════════════════════════════
// Layout
// ═══════════════════════════════════════════
function updateLayout() {
  // ── Right-side control panel ──
  panelW = 230;
  panelX = canvasW - panelW;

  // ── 3D Viewport area (left of panel) ──
  var viewportW = panelX;
  var padLeft = 50, padRight = 30, padTop = 60, padBot = 30;
  var areaW = viewportW - padLeft - padRight;
  var areaH = canvasH - padTop - padBot;
  cellPx = Math.min(areaW / gridSize, areaH / gridSize);

  originX = padLeft + areaW / 2;
  originY = padTop + areaH / 2;
  gridLeft   = originX + gridMin * cellPx;
  gridRight  = originX + gridMax * cellPx;
  gridTop    = originY + gridMin * cellPx;
  gridBottom = originY + gridMax * cellPx;

  // ── Intro buttons (centered in viewport area) ──
  nextBtn.x = viewportW / 2 - nextBtn.w / 2;
  nextBtn.y = canvasH - nextBtn.h - 14;
  skipBtn.x = viewportW - skipBtn.w - 20;
  skipBtn.y = canvasH - skipBtn.h - 14;

  // ── Panel content layout ──
  var pL = panelX + 16;
  var pt = 12;

  // View buttons
  var vbY = pt + 18;
  var vNames = ['3D', 'XY', 'XZ', 'YZ'];
  for (var i = 0; i < vNames.length; i++) {
    viewBtns[vNames[i]].x = pL + i * 49;
    viewBtns[vNames[i]].y = vbY;
  }

  // Axis lock buttons
  var lbY = pt + 60;
  var lNames = ['free', 'x', 'y', 'z'];
  var lOff = 0;
  for (var j = 0; j < lNames.length; j++) {
    lockBtns[lNames[j]].x = pL + lOff;
    lockBtns[lNames[j]].y = lbY;
    lOff += lockBtns[lNames[j]].w + 5;
  }

  // Eon numeric controls (vertical layout in panel)
  layoutNumRow('eon', pt + 118, pL);

  // Rippa numeric controls
  layoutNumRow('rippa', pt + 224, pL);

  // Action buttons (full panel width)
  var btnW = panelW - 34;
  replayBtn.w = btnW;
  replayBtn.x = pL + 1;
  replayBtn.y = pt + 322;
  newPosBtn.w = btnW;
  newPosBtn.x = pL + 1;
  newPosBtn.y = pt + 358;
}

function layoutNumRow(who, startY, pL) {
  var axes = ['x', 'y', 'z'];
  var rowSpacing = 28;
  var minusX = pL + 28;
  var plusX = minusX + 26 + 4 + 40 + 4;
  for (var i = 0; i < axes.length; i++) {
    var ax = axes[i];
    var rowY = startY + i * rowSpacing;
    numBtns[who][ax].minus.x = minusX;
    numBtns[who][ax].minus.y = rowY - 11;
    numBtns[who][ax].plus.x  = plusX;
    numBtns[who][ax].plus.y  = rowY - 11;
  }
}

// ═══════════════════════════════════════════
// 2D Coordinate Helpers (for intro phases)
// ═══════════════════════════════════════════
function gridToPixelX(gx) { return originX + gx * cellPx; }
function gridToPixelY(gy) { return originY - gy * cellPx; }
function pixelToGridX(px) { return (px - originX) / cellPx; }
function pixelToGridY(py) { return -(py - originY) / cellPx; }

// ═══════════════════════════════════════════
// 3D Projection
// ═══════════════════════════════════════════
function updateProjectionCache() {
  _cosAz = Math.cos(camAz);
  _sinAz = Math.sin(camAz);
  _cosEl = Math.cos(camEl);
  _sinEl = Math.sin(camEl);
}

function project3D(gx, gy, gz) {
  var x = gx * cellPx;
  var y = -gy * cellPx;
  var z = gz * cellPx;

  // Rotate around Y-axis (azimuth – horizontal camera swing)
  var x1 = x * _cosAz + z * _sinAz;
  var z1 = -x * _sinAz + z * _cosAz;
  var y1 = y;

  // Rotate around X-axis (elevation – vertical camera tilt)
  var x2 = x1;
  var y2 = y1 * _cosEl - z1 * _sinEl;
  var z2 = y1 * _sinEl + z1 * _cosEl;

  // Blend perspective / orthographic
  var pScale = CAM_DIST / (CAM_DIST + z2);
  var s = pScale + (1 - pScale) * camOrtho;

  return { x: originX + x2 * s, y: originY + y2 * s, depth: z2 };
}

function drawLine3D(x1, y1, z1, x2, y2, z2) {
  var a = project3D(x1, y1, z1);
  var b = project3D(x2, y2, z2);
  line(a.x, a.y, b.x, b.y);
}

// ═══════════════════════════════════════════
// Camera Control
// ═══════════════════════════════════════════
function updateCamera() {
  var spd = isOrbiting ? CAM_ORBIT_LERP : CAM_LERP_SPEED;
  camAz    += (camAzTarget    - camAz)    * spd;
  camEl    += (camElTarget    - camEl)    * spd;
  camOrtho += (camOrthoTarget - camOrtho) * CAM_LERP_SPEED;
  updateProjectionCache();
}

function setView(viewName) {
  currentView = viewName;
  var p = VIEW_PRESETS[viewName];
  camAzTarget    = p.az;
  camElTarget    = p.el;
  camOrthoTarget = p.ortho;
}

// ═══════════════════════════════════════════
// Phase Helpers
// ═══════════════════════════════════════════
function phaseProgress() {
  var dur = PHASE_DUR[phase] || 1000;
  return constrain((millis() - phaseStart) / dur, 0, 1);
}

function goToPhase(name) {
  phase = name;
  phaseStart = millis();
  phaseAnimDone = false;
  shakeIntensity = 0;
}

function skipToInteractive() {
  // Jump straight to interactive 3D
  eonBounceX = eonX; eonBounceY = eonY;
  rippaBounceX = rippaX; rippaBounceY = rippaY;
  zAxisVis = 1;
  camAz = CAM_3D_AZ; camEl = CAM_3D_EL; camOrtho = 0;
  camAzTarget = CAM_3D_AZ; camElTarget = CAM_3D_EL; camOrthoTarget = 0;
  currentView = '3D';
  phase = "interactive";
  phaseStart = millis();
  phaseAnimDone = false;
}

function restartAnimation() {
  randomizePositions();
  eonXStart = Math.max(1, Math.abs(eonX));
  rippaXStart = Math.max(1, Math.abs(rippaX));
  if (eonXStart === rippaXStart) rippaXStart = Math.min(9, rippaXStart + 2);
  zAxisVis = 0;
  camAz = 0; camEl = 0; camOrtho = 0;
  camAzTarget = 0; camElTarget = 0; camOrthoTarget = 0;
  currentView = '3D';
  axisLock = 'free';
  goToPhase("xaxis_positive");
}

// ═══════════════════════════════════════════
// Main Draw Loop
// ═══════════════════════════════════════════
function draw() {
  if (!initialized) {
    canvasW = windowWidth || 960;
    canvasH = windowHeight || 880;
    if (typeof createCanvas === "function") createCanvas(canvasW, canvasH);
    if (typeof textFont === "function") textFont("Arial");
    if (typeof textAlign === "function") textAlign(CENTER, CENTER);
    if (!AX_COL_X) {
      AX_COL_X = color(220, 65, 55);
      AX_COL_Y = color(50, 170, 50);
      AX_COL_Z = color(55, 100, 225);
    }
    updateLayout();
    randomizePositions();
    eonXStart = Math.max(1, Math.abs(eonX));
    rippaXStart = Math.max(1, Math.abs(rippaX));
    if (eonXStart === rippaXStart) rippaXStart = Math.min(9, rippaXStart + 2);
    phaseStart = millis();
    initialized = true;
  } else {
    updateLayout();
  }

  background(250, 252, 255);

  var rawT = phaseProgress();
  var t = easeInOut(constrain(rawT, 0, 1));
  if (rawT >= 1 && !phaseAnimDone) phaseAnimDone = true;

  // ── INTRO PHASES (2D rendering) ──
  if (phase === "xaxis_positive") {
    drawIntroTitle("Stage 1: The number line — one dimension!");
    drawXAxisPositive(t);
    drawCharsOnXAxis(1);
    if (phaseAnimDone) drawNextButton();
    drawSkipButton();
  }
  else if (phase === "xaxis_negative") {
    drawIntroTitle("Stage 1: Extending to negative numbers...");
    drawXAxisFull(t);
    drawCharsOnXAxis(1);
    if (phaseAnimDone) drawNextButton();
    drawSkipButton();
  }
  else if (phase === "y_axis") {
    drawIntroTitle("Stage 2: A new axis — the y-axis! Entering 2D.");
    drawXAxisFull(1);
    drawVerticalLineAnim(t);
    drawCharsOnXAxis(1);
    if (phaseAnimDone) drawNextButton();
    drawSkipButton();
  }
  else if (phase === "grid_appear") {
    drawIntroTitle("Stage 2: The 2D coordinate surface forms!");
    drawXAxisFull(1);
    drawVerticalLineAnim(1);
    drawGridLinesAnim(t);
    drawAxisLabelsAnim(t);
    drawCharsOnXAxis(1);
    if (phaseAnimDone) drawNextButton();
    drawSkipButton();
  }
  else if (phase === "shake") {
    drawIntroTitle("Getting ready to jump into the coordinate plane!");
    drawFullGrid2D();
    shakeIntensity = rawT * rawT * 8;
    drawCharsOnXAxisShake(shakeIntensity);
    noStroke(); fill(180, 60, 60); textSize(16); textStyle(BOLD);
    text("Charging up...", panelX / 2, canvasH - 200);
    textStyle(NORMAL);
    if (rawT >= 1) goToPhase("bounce");
  }
  else if (phase === "bounce") {
    drawIntroTitle("Jumping into the 2D coordinate plane!");
    drawFullGrid2D();
    drawCharsBounce(easeOutBounce(constrain(rawT, 0, 1)));
    if (rawT >= 1) {
      eonBounceX = eonX; eonBounceY = eonY;
      rippaBounceX = rippaX; rippaBounceY = rippaY;
      goToPhase("z_axis");
    }
  }

  // ── Z-AXIS TRANSITION (3D rendering begins) ──
  else if (phase === "z_axis") {
    updateCamera();
    drawZAxisTransition(rawT, t);
  }

  // ── INTERACTIVE 3D ──
  else if (phase === "interactive") {
    updateCamera();
    drawInteractive3D();
  }
}

// ═══════════════════════════════════════════
// Title Drawing
// ═══════════════════════════════════════════
function drawIntroTitle(stepText) {
  var cx = panelX / 2;
  noStroke(); fill(30, 50, 80); textSize(22); textStyle(BOLD);
  text("Coordinate System — Dimensional Upgrade", cx, 26);
  textStyle(NORMAL);
  fill(100); textSize(14);
  text(stepText, cx, 52);
}

function draw3DTitle() {
  var cx = panelX / 2;
  noStroke(); fill(30, 50, 80); textSize(18); textStyle(BOLD);
  text("3D Coordinate System", cx, 20);
  textStyle(NORMAL);
  fill(100); textSize(11);
  var lockLabel = axisLock === 'free' ? 'Free drag' : axisLock.toUpperCase() + "-locked";
  text("View: " + currentView + "  |  " + lockLabel + "  |  Middle-click orbit  |  Scroll zoom", cx, 40);
}

// ═══════════════════════════════════════════
// Z-Axis Transition Phase
// ═══════════════════════════════════════════
function drawZAxisTransition(rawT, t) {
  // Animate camera from (0,0) to 3D view
  var camT = easeInOut(constrain(rawT / 0.85, 0, 1));
  camAz = CAM_3D_AZ * camT;
  camEl = CAM_3D_EL * camT;
  camOrtho = 0;
  camAzTarget = camAz;
  camElTarget = camEl;
  camOrthoTarget = 0;
  updateProjectionCache();

  // Z-axis grows
  zAxisVis = easeOut(constrain(rawT / 0.9, 0, 1));

  // Title
  var cx = panelX / 2;
  var titleAlpha = constrain(rawT * 4, 0, 1);
  noStroke(); fill(30, 50, 80, titleAlpha * 255); textSize(22); textStyle(BOLD);
  text("Stage 3: Entering the third dimension!", cx, 26);
  textStyle(NORMAL);
  fill(100, 100, 100, titleAlpha * 255); textSize(14);
  text("The z-axis emerges — welcome to 3D space!", cx, 52);

  // Draw 3D grid with animated z-axis
  draw3DGrid(1.0, zAxisVis);

  // Characters at their 2D positions (z=0)
  drawCharAt3D(eonX, eonY, 0, imgKid, "Eon", color(100, 50, 180), eonX, eonY, null);
  drawCharAt3D(rippaX, rippaY, 0, imgMe, "Rippa", color(40, 100, 180), rippaX, rippaY, null);

  // Auto-advance to interactive
  if (rawT >= 1) {
    zAxisVis = 1;
    camAzTarget = CAM_3D_AZ;
    camElTarget = CAM_3D_EL;
    camOrthoTarget = 0;
    currentView = '3D';
    goToPhase("interactive");
  }
}

// ═══════════════════════════════════════════
// Interactive 3D Phase
// ═══════════════════════════════════════════
function drawInteractive3D() {
  draw3DTitle();

  // Draw 3D grid
  draw3DGrid(1.0, 1.0);

  // Draw 3D guidelines for both characters
  draw3DGuidelines(eonX, eonY, eonZ, color(140, 80, 200, 90));
  draw3DGuidelines(rippaX, rippaY, rippaZ, color(50, 120, 200, 90));

  // Depth-sort characters
  var eonP  = project3D(eonX, eonY, eonZ);
  var ripP  = project3D(rippaX, rippaY, rippaZ);

  var drawEonFirst = eonP.depth > ripP.depth;
  if (drawEonFirst) {
    drawCharAt3D(eonX, eonY, eonZ, imgKid, "Eon", color(100, 50, 180), eonX, eonY, eonZ);
    drawCharAt3D(rippaX, rippaY, rippaZ, imgMe, "Rippa", color(40, 100, 180), rippaX, rippaY, rippaZ);
  } else {
    drawCharAt3D(rippaX, rippaY, rippaZ, imgMe, "Rippa", color(40, 100, 180), rippaX, rippaY, rippaZ);
    drawCharAt3D(eonX, eonY, eonZ, imgKid, "Eon", color(100, 50, 180), eonX, eonY, eonZ);
  }

  // Drag highlight
  if (dragTarget === "eon") {
    noFill(); stroke(140, 80, 200); strokeWeight(3);
    ellipse(eonP.x, eonP.y, profileRadius * 2 + 14, profileRadius * 2 + 14);
  }
  if (dragTarget === "rippa") {
    noFill(); stroke(50, 120, 200); strokeWeight(3);
    ellipse(ripP.x, ripP.y, profileRadius * 2 + 14, profileRadius * 2 + 14);
  }

  // Info overlay (bottom-left of viewport)
  drawInfoText();

  // Right-side control panel
  drawControlPanel();
}

// ═══════════════════════════════════════════
// 3D Grid Drawing
// ═══════════════════════════════════════════
function draw3DGrid(gridAlpha, zProg) {
  var gA = gridAlpha;

  // ── XY plane grid lines (at z=0) ──
  stroke(210, 220, 235, gA * 80);
  strokeWeight(1);
  for (var i = gridMin; i <= gridMax; i++) {
    if (i === 0) continue;
    drawLine3D(i, gridMin, 0, i, gridMax, 0);
    drawLine3D(gridMin, i, 0, gridMax, i, 0);
  }

  // ── XZ plane faint reference (at y=0, only if z visible) ──
  if (zProg > 0.05) {
    var zMaxV = gridMax * zProg;
    var zMinV = gridMin * zProg;
    // Faint grid on XZ plane
    stroke(210, 220, 235, gA * 30);
    strokeWeight(0.5);
    for (var ix = gridMin; ix <= gridMax; ix++) {
      if (ix === 0) continue;
      drawLine3D(ix, 0, zMinV, ix, 0, zMaxV);
    }
    for (var iz = Math.ceil(zMinV); iz <= Math.floor(zMaxV); iz++) {
      if (iz === 0) continue;
      drawLine3D(gridMin, 0, iz, gridMax, 0, iz);
    }
    // Faint grid on YZ plane
    stroke(210, 220, 235, gA * 30);
    for (var iy = gridMin; iy <= gridMax; iy++) {
      if (iy === 0) continue;
      drawLine3D(0, iy, zMinV, 0, iy, zMaxV);
    }
    for (var iz2 = Math.ceil(zMinV); iz2 <= Math.floor(zMaxV); iz2++) {
      if (iz2 === 0) continue;
      drawLine3D(0, gridMin, iz2, 0, gridMax, iz2);
    }
  }

  // ── Axes ──
  // X-axis (red)
  stroke(red(AX_COL_X), green(AX_COL_X), blue(AX_COL_X), gA * 255);
  strokeWeight(2.5);
  drawLine3D(gridMin, 0, 0, gridMax, 0, 0);
  // Arrows
  drawArrow3D(gridMax, 0, 0, 1, 0, 0, gA);
  drawArrow3D(gridMin, 0, 0, -1, 0, 0, gA);

  // Y-axis (green)
  stroke(red(AX_COL_Y), green(AX_COL_Y), blue(AX_COL_Y), gA * 255);
  strokeWeight(2.5);
  drawLine3D(0, gridMin, 0, 0, gridMax, 0);
  drawArrow3D(0, gridMax, 0, 0, 1, 0, gA);
  drawArrow3D(0, gridMin, 0, 0, -1, 0, gA);

  // Z-axis (blue, animated)
  if (zProg > 0.01) {
    var zMn = gridMin * zProg;
    var zMx = gridMax * zProg;
    stroke(red(AX_COL_Z), green(AX_COL_Z), blue(AX_COL_Z), gA * 255);
    strokeWeight(2.5);
    drawLine3D(0, 0, zMn, 0, 0, zMx);
    if (zProg > 0.5) {
      var arrowA = (zProg - 0.5) * 2;
      drawArrow3D(0, 0, zMx, 0, 0, 1, gA * arrowA);
      drawArrow3D(0, 0, zMn, 0, 0, -1, gA * arrowA);
    }
  }

  // ── Tick marks & labels ──
  draw3DTicks(gA, zProg);

  // ── Axis labels ──
  draw3DAxisLabels(gA, zProg);

  // ── Origin ──
  var o = project3D(0, 0, 0);
  noStroke(); fill(200, 60, 60, gA * 255);
  ellipse(o.x, o.y, 7, 7);
  fill(200, 60, 60, gA * 200); textSize(11); textStyle(BOLD);
  text("O", o.x + 14, o.y + 14);
  textStyle(NORMAL);
}

function draw3DTicks(gA, zProg) {
  var tickLen = 0.2; // grid units

  // X-axis ticks
  for (var i = gridMin; i <= gridMax; i++) {
    if (i === 0) continue;
    stroke(red(AX_COL_X), green(AX_COL_X), blue(AX_COL_X), gA * 180);
    strokeWeight(i % 5 === 0 ? 1.8 : 1);
    drawLine3D(i, -tickLen, 0, i, tickLen, 0);
    if (i % 2 === 0) {
      var p = project3D(i, -0.7, 0);
      noStroke(); fill(80, 40, 40, gA * 220); textSize(10);
      text(i, p.x, p.y);
    }
  }

  // Y-axis ticks
  for (var j = gridMin; j <= gridMax; j++) {
    if (j === 0) continue;
    stroke(red(AX_COL_Y), green(AX_COL_Y), blue(AX_COL_Y), gA * 180);
    strokeWeight(j % 5 === 0 ? 1.8 : 1);
    drawLine3D(-tickLen, j, 0, tickLen, j, 0);
    if (j % 2 === 0) {
      var py = project3D(-0.8, j, 0);
      noStroke(); fill(30, 80, 30, gA * 220); textSize(10);
      text(j, py.x, py.y);
    }
  }

  // Z-axis ticks
  if (zProg > 0.2) {
    var zTickA = (zProg - 0.2) / 0.8;
    var zMn = gridMin * zProg;
    var zMx = gridMax * zProg;
    for (var k = Math.ceil(zMn); k <= Math.floor(zMx); k++) {
      if (k === 0) continue;
      stroke(red(AX_COL_Z), green(AX_COL_Z), blue(AX_COL_Z), gA * 180 * zTickA);
      strokeWeight(k % 5 === 0 ? 1.8 : 1);
      drawLine3D(-tickLen, 0, k, tickLen, 0, k);
      if (k % 2 === 0) {
        var pz = project3D(-0.8, 0, k);
        noStroke(); fill(35, 55, 130, gA * 220 * zTickA); textSize(10);
        text(k, pz.x, pz.y);
      }
    }
  }
}

function draw3DAxisLabels(gA, zProg) {
  // X label
  var lx = project3D(gridMax + 0.8, 0, 0);
  noStroke(); fill(red(AX_COL_X), green(AX_COL_X), blue(AX_COL_X), gA * 255);
  textSize(16); textStyle(BOLD);
  text("x", lx.x, lx.y);
  textStyle(NORMAL);

  // Y label
  var ly = project3D(0, gridMax + 0.8, 0);
  fill(red(AX_COL_Y), green(AX_COL_Y), blue(AX_COL_Y), gA * 255);
  textSize(16); textStyle(BOLD);
  text("y", ly.x, ly.y);
  textStyle(NORMAL);

  // Z label
  if (zProg > 0.3) {
    var zA = (zProg - 0.3) / 0.7;
    var lz = project3D(0, 0, gridMax * zProg + 0.8);
    fill(red(AX_COL_Z), green(AX_COL_Z), blue(AX_COL_Z), gA * 255 * zA);
    textSize(16); textStyle(BOLD);
    text("z", lz.x, lz.y);
    textStyle(NORMAL);
  }
}

function drawArrow3D(ax, ay, az, dx, dy, dz, alpha) {
  // Small arrowhead at (ax,ay,az) pointing in direction (dx,dy,dz)
  var tip = project3D(ax, ay, az);
  var len = 0.5; // grid units for arrow length
  var base = project3D(ax - dx * len, ay - dy * len, az - dz * len);

  var adx = tip.x - base.x;
  var ady = tip.y - base.y;
  var al = Math.sqrt(adx * adx + ady * ady);
  if (al < 1) return;

  var nx = adx / al, ny = ady / al;
  var px = -ny, py = nx;  // perpendicular
  var sz = 7;

  noStroke();
  // Determine color from direction
  var cr, cg, cb;
  if (Math.abs(dx) > 0.5) { cr = red(AX_COL_X); cg = green(AX_COL_X); cb = blue(AX_COL_X); }
  else if (Math.abs(dy) > 0.5) { cr = red(AX_COL_Y); cg = green(AX_COL_Y); cb = blue(AX_COL_Y); }
  else { cr = red(AX_COL_Z); cg = green(AX_COL_Z); cb = blue(AX_COL_Z); }

  fill(cr, cg, cb, alpha * 255);
  triangle(
    tip.x, tip.y,
    tip.x - nx * sz + px * sz * 0.4, tip.y - ny * sz + py * sz * 0.4,
    tip.x - nx * sz - px * sz * 0.4, tip.y - ny * sz - py * sz * 0.4
  );
}

// ═══════════════════════════════════════════
// 3D Guidelines (dashed lines to axes)
// ═══════════════════════════════════════════
function draw3DGuidelines(gx, gy, gz, col) {
  stroke(col); strokeWeight(1.2);
  drawingContext.setLineDash([4, 4]);

  // Line from point to XY plane (drop to z=0)
  if (Math.abs(gz) > 0.01) {
    drawLine3D(gx, gy, gz, gx, gy, 0);
  }
  // Line from point projection (at z=0) to x-axis
  drawLine3D(gx, gy, 0, gx, 0, 0);
  // Line from point projection (at z=0) to y-axis
  drawLine3D(gx, gy, 0, 0, gy, 0);
  // Line from point to z-axis (if z != 0)
  if (Math.abs(gz) > 0.01) {
    drawLine3D(gx, 0, 0, gx, 0, gz);
    drawLine3D(0, 0, gz, gx, 0, gz);
  }

  drawingContext.setLineDash([]);

  // Dots on axes
  noStroke(); fill(col);
  var px = project3D(gx, 0, 0);
  ellipse(px.x, px.y, 5, 5);
  var py = project3D(0, gy, 0);
  ellipse(py.x, py.y, 5, 5);
  if (Math.abs(gz) > 0.01) {
    var pz = project3D(0, 0, gz);
    ellipse(pz.x, pz.y, 5, 5);
  }
}

// ═══════════════════════════════════════════
// Draw Character at 3D Position
// ═══════════════════════════════════════════
function drawCharAt3D(gx, gy, gz, img, label, col, cx, cy, cz) {
  var p = project3D(gx, gy, gz);
  drawCharacterAtPixel(p.x, p.y, img, label, col, 1, cx, cy, cz);
}

// ═══════════════════════════════════════════
// Draw Character at Pixel Position (shared)
// ═══════════════════════════════════════════
function drawCharacterAtPixel(px, py, img, label, col, scl, coordX, coordY, coordZ) {
  var r = profileRadius * scl;
  if (r < 1) return;

  // Profile image (clipped circle)
  push();
  translate(px, py);
  if (img && img.width > 0) {
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.arc(0, 0, r, 0, TWO_PI);
    drawingContext.clip();
    imageMode(CENTER);
    image(img, 0, 0, r * 2, r * 2);
    drawingContext.restore();
  } else {
    fill(200); noStroke();
    ellipse(0, 0, r * 2, r * 2);
  }
  noFill(); stroke(col); strokeWeight(3);
  ellipse(0, 0, r * 2, r * 2);
  pop();

  // Name label above
  noStroke(); fill(col); textSize(12); textStyle(BOLD);
  text(label, px, py - r - 12);
  textStyle(NORMAL);

  // Coordinate label below
  if (coordX !== null && coordX !== undefined) {
    var coordStr;
    if (coordZ !== null && coordZ !== undefined) {
      coordStr = "(" + coordX + ", " + coordY + ", " + coordZ + ")";
    } else {
      coordStr = "(" + coordX + ", " + coordY + ")";
    }
    textSize(11); textStyle(BOLD);
    var tw = textWidth(coordStr) + 14;
    var th = 20;
    var lx = px, ly = py + r + 16;
    fill(255, 255, 255, 220);
    stroke(col); strokeWeight(2);
    rectMode(CENTER);
    rect(lx, ly, tw, th, 10);
    rectMode(CORNER);
    noStroke(); fill(col); textSize(11);
    text(coordStr, lx, ly);
    textStyle(NORMAL);
  }
}

// ═══════════════════════════════════════════
// Control Panel (Interactive phase)
// ═══════════════════════════════════════════
function drawControlPanel() {
  // ── Panel background (full-height right side) ──
  fill(242, 245, 252, 245);
  stroke(195, 208, 228);
  strokeWeight(2);
  rect(panelX, 0, panelW, canvasH);

  // Inner edge line
  stroke(210, 218, 232); strokeWeight(1);
  line(panelX, 0, panelX, canvasH);

  var pL = panelX + 16;
  var pR = panelX + panelW - 16;
  var pt = 12;

  // ── View section ──
  noStroke(); fill(60, 70, 90); textSize(11); textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text("View", pL, pt + 4);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  drawViewButtons();

  // ── Lock section ──
  noStroke(); fill(60, 70, 90); textSize(11); textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text("Axis Lock", pL, pt + 46);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  drawAxisLockButtons();

  // Separator
  stroke(210, 218, 232); strokeWeight(1);
  line(pL, pt + 96, pR, pt + 96);

  // ── Eon controls ──
  drawNumericRow('eon', pt + 118, color(100, 50, 180), "Eon");

  // Separator
  stroke(210, 218, 232); strokeWeight(1);
  line(pL, pt + 204, pR, pt + 204);

  // ── Rippa controls ──
  drawNumericRow('rippa', pt + 224, color(40, 100, 180), "Rippa");

  // Separator
  stroke(210, 218, 232); strokeWeight(1);
  line(pL, pt + 310, pR, pt + 310);

  // ── Action buttons ──
  drawReplayButton();
  drawNewPosButton();
}

function drawViewButtons() {
  var views = ['3D', 'XY', 'XZ', 'YZ'];
  for (var i = 0; i < views.length; i++) {
    var v = views[i];
    var btn = viewBtns[v];
    var active = (currentView === v);
    var hover = hitBtn(btn);

    if (active) {
      fill(55, 125, 215); stroke(35, 95, 185);
    } else if (hover) {
      fill(195, 210, 240); stroke(140, 160, 195);
    } else {
      fill(232, 237, 248); stroke(180, 190, 210);
    }
    strokeWeight(1.5);
    rect(btn.x, btn.y, btn.w, btn.h, 7);

    noStroke();
    fill(active ? 255 : 55);
    textSize(11); textStyle(BOLD);
    text(v, btn.x + btn.w / 2, btn.y + btn.h / 2);
    textStyle(NORMAL);
  }
}

function drawAxisLockButtons() {
  var locks = ['free', 'x', 'y', 'z'];
  var lockLabels = { free: 'Free', x: 'X', y: 'Y', z: 'Z' };
  var lockColors = {
    free: color(120, 120, 130),
    x: AX_COL_X,
    y: AX_COL_Y,
    z: AX_COL_Z
  };

  for (var i = 0; i < locks.length; i++) {
    var lk = locks[i];
    var btn = lockBtns[lk];
    var active = (axisLock === lk);
    var hover = hitBtn(btn);
    var lc = lockColors[lk];

    if (active) {
      fill(red(lc), green(lc), blue(lc), 220);
      stroke(red(lc), green(lc), blue(lc));
    } else if (hover) {
      fill(red(lc), green(lc), blue(lc), 40);
      stroke(red(lc), green(lc), blue(lc), 150);
    } else {
      fill(238, 240, 248);
      stroke(180, 185, 200);
    }
    strokeWeight(1.5);
    rect(btn.x, btn.y, btn.w, btn.h, 7);

    noStroke();
    fill(active ? 255 : 60);
    textSize(11); textStyle(BOLD);
    text(lockLabels[lk], btn.x + btn.w / 2, btn.y + btn.h / 2);
    textStyle(NORMAL);
  }
}

function drawNumericRow(who, startY, col, label) {
  var pL = panelX + 16;

  // Character label
  noStroke(); fill(col); textSize(12); textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(label + ":", pL, startY - 14);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);

  var coords = who === 'eon'
    ? { x: eonX, y: eonY, z: eonZ }
    : { x: rippaX, y: rippaY, z: rippaZ };

  var axColors = [AX_COL_X, AX_COL_Y, AX_COL_Z];
  var axLabels = ['X', 'Y', 'Z'];
  var axes = ['x', 'y', 'z'];
  var rowSpacing = 28;

  for (var i = 0; i < 3; i++) {
    var ax = axes[i];
    var ac = axColors[i];
    var rowY = startY + i * rowSpacing;
    var mb = numBtns[who][ax].minus;
    var pb = numBtns[who][ax].plus;
    var val = coords[ax];

    // Axis letter
    noStroke(); fill(ac); textSize(11); textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(axLabels[i] + ":", pL, rowY);
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);

    // Minus button
    drawSmallBtn(mb, "\u2212", ac);

    // Value display
    var valX = mb.x + mb.w + 24;
    fill(255); stroke(ac); strokeWeight(1.5);
    rectMode(CENTER);
    rect(valX, rowY, 40, 22, 6);
    rectMode(CORNER);
    noStroke(); fill(red(ac), green(ac), blue(ac)); textSize(13); textStyle(BOLD);
    text(val, valX, rowY);
    textStyle(NORMAL);

    // Plus button
    drawSmallBtn(pb, "+", ac);
  }
}

function drawSmallBtn(btn, label, col) {
  var hover = hitBtn(btn);
  if (hover) {
    fill(red(col), green(col), blue(col), 50);
    stroke(col);
  } else {
    fill(248, 248, 252);
    stroke(red(col), green(col), blue(col), 150);
  }
  strokeWeight(1.5);
  rect(btn.x, btn.y, btn.w, btn.h, 5);
  noStroke();
  fill(red(col), green(col), blue(col), hover ? 255 : 200);
  textSize(14); textStyle(BOLD);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  textStyle(NORMAL);
}

// ═══════════════════════════════════════════
// Info Overlay (bottom-left of viewport)
// ═══════════════════════════════════════════
function drawInfoText() {
  var eonStr = "Eon: (" + eonX + ", " + eonY + ", " + eonZ + ")";
  var ripStr = "Rippa: (" + rippaX + ", " + rippaY + ", " + rippaZ + ")";
  var dx = Math.abs(rippaX - eonX);
  var dy = Math.abs(rippaY - eonY);
  var dz = Math.abs(rippaZ - eonZ);
  var dist3d = Math.sqrt(dx*dx + dy*dy + dz*dz);

  var bx = 12, by = canvasH - 78;
  var bw = 210, bh = 66;

  // Background
  fill(255, 255, 255, 210);
  stroke(195, 208, 228);
  strokeWeight(1);
  rect(bx, by, bw, bh, 10);

  // Text
  noStroke(); textSize(11); textStyle(BOLD);
  textAlign(LEFT, CENTER);
  fill(100, 50, 180);
  text(eonStr, bx + 12, by + 16);
  fill(40, 100, 180);
  text(ripStr, bx + 12, by + 34);
  fill(50, 60, 90); textStyle(NORMAL);
  text("Distance: " + dist3d.toFixed(2), bx + 12, by + 52);
  textAlign(CENTER, CENTER);
}

// ═══════════════════════════════════════════
// Buttons (Intro + Interactive)
// ═══════════════════════════════════════════
function drawNextButton() {
  var hover = hitBtn(nextBtn);
  var pulse = sin(millis() * 0.005) * 0.3 + 0.7;
  stroke(40, 120, 220); strokeWeight(hover ? 3 : 2);
  fill(hover ? color(60, 140, 240) : lerpColor(color(70, 130, 220), color(100, 160, 255), pulse));
  rect(nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h, 12);
  noStroke(); fill(255); textSize(16); textStyle(BOLD);
  text("NEXT  \u25B6", nextBtn.x + nextBtn.w / 2, nextBtn.y + nextBtn.h / 2);
  textStyle(NORMAL);
}

function drawSkipButton() {
  var hover = hitBtn(skipBtn);
  stroke(120); strokeWeight(1.5);
  fill(hover ? color(228, 228, 235) : color(242, 242, 248));
  rect(skipBtn.x, skipBtn.y, skipBtn.w, skipBtn.h, 8);
  noStroke(); fill(100); textSize(12); textStyle(BOLD);
  text("SKIP \u25B6\u25B6", skipBtn.x + skipBtn.w / 2, skipBtn.y + skipBtn.h / 2);
  textStyle(NORMAL);
}

function drawReplayButton() {
  var hover = hitBtn(replayBtn);
  stroke(100, 60, 160); strokeWeight(1.5);
  fill(hover ? color(210, 195, 240) : color(230, 220, 245));
  rect(replayBtn.x, replayBtn.y, replayBtn.w, replayBtn.h, 8);
  noStroke(); fill(80, 40, 140); textSize(12); textStyle(BOLD);
  text("\u21BA Replay", replayBtn.x + replayBtn.w / 2, replayBtn.y + replayBtn.h / 2);
  textStyle(NORMAL);
}

function drawNewPosButton() {
  var hover = hitBtn(newPosBtn);
  stroke(60, 40, 120); strokeWeight(1.5);
  fill(hover ? color(200, 190, 240) : color(225, 220, 245));
  rect(newPosBtn.x, newPosBtn.y, newPosBtn.w, newPosBtn.h, 8);
  noStroke(); fill(60, 40, 120); textSize(12); textStyle(BOLD);
  text("New Positions", newPosBtn.x + newPosBtn.w / 2, newPosBtn.y + newPosBtn.h / 2);
  textStyle(NORMAL);
}

// ═══════════════════════════════════════════
// INTRO: 2D Drawing Functions (Stages 1-6)
// ═══════════════════════════════════════════

// ── Stage 1: Positive x-axis ──
function drawXAxisPositive(t) {
  var rightEnd = originX + gridMax * cellPx * t;
  stroke(40); strokeWeight(3);
  line(originX, originY, rightEnd, originY);
  if (t > 0.85) {
    var a = easeOut((t - 0.85) / 0.15);
    drawArrow2D(rightEnd, originY, 1, 0, a);
  }
  fill(200, 60, 60); noStroke();
  ellipse(originX, originY, 8, 8);
  for (var i = 0; i <= gridMax; i++) {
    var px = gridToPixelX(i);
    if (px > rightEnd + 5) break;
    stroke(60, 60, 80); strokeWeight(i % 5 === 0 ? 2 : 1);
    line(px, originY - 4, px, originY + 4);
    if (i % 2 === 0) {
      noStroke(); fill(60, 60, 80); textSize(11);
      text(i, px, originY + 18);
    }
  }
  if (t > 0.7) {
    noStroke(); fill(30, 60, 120, Math.round(((t - 0.7) / 0.3) * 255));
    textSize(15); textStyle(BOLD);
    text("x", rightEnd + 18, originY);
    textStyle(NORMAL);
  }
}

// ── Stage 2: Full x-axis (extends negative) ──
function drawXAxisFull(t) {
  stroke(40); strokeWeight(3);
  line(originX, originY, gridRight, originY);
  drawArrow2D(gridRight, originY, 1, 0, 1);
  var leftEnd = originX - (originX - gridLeft) * t;
  line(leftEnd, originY, originX, originY);
  if (t > 0.85) drawArrow2D(leftEnd, originY, -1, 0, easeOut((t - 0.85) / 0.15));
  fill(200, 60, 60); noStroke(); ellipse(originX, originY, 8, 8);
  for (var i = 0; i <= gridMax; i++) {
    var px = gridToPixelX(i);
    stroke(60, 60, 80); strokeWeight(i % 5 === 0 ? 2 : 1);
    line(px, originY - 4, px, originY + 4);
    if (i % 2 === 0) { noStroke(); fill(60, 60, 80); textSize(11); text(i, px, originY + 18); }
  }
  for (var j = -1; j >= gridMin; j--) {
    var px2 = gridToPixelX(j);
    if (px2 < leftEnd - 5) break;
    stroke(60, 60, 80); strokeWeight(j % 5 === 0 ? 2 : 1);
    line(px2, originY - 4, px2, originY + 4);
    if (j % 2 === 0) { noStroke(); fill(60, 60, 80); textSize(11); text(j, px2, originY + 18); }
  }
  noStroke(); fill(30, 60, 120); textSize(15); textStyle(BOLD);
  text("x", gridRight + 18, originY);
  textStyle(NORMAL);
}

// ── Stage 3: Y-axis appears ──
function drawVerticalLineAnim(t) {
  var halfLen = (gridBottom - gridTop) / 2 * t;
  stroke(40); strokeWeight(3);
  line(originX, originY - halfLen, originX, originY + halfLen);
  if (t > 0.85) {
    var a = easeOut((t - 0.85) / 0.15);
    drawArrow2D(originX, originY - halfLen, 0, -1, a);
    drawArrow2D(originX, originY + halfLen, 0, 1, a);
  }
  if (t > 0.6) {
    noStroke(); fill(30, 60, 120, Math.round(((t - 0.6) / 0.4) * 255));
    textSize(15); textStyle(BOLD);
    text("y", originX, originY - halfLen - 18);
    textStyle(NORMAL);
  }
  for (var j = gridMin; j <= gridMax; j++) {
    if (j === 0) continue;
    var py = gridToPixelY(j);
    if (py < originY - halfLen || py > originY + halfLen) continue;
    stroke(60, 60, 80); strokeWeight(j % 5 === 0 ? 2 : 1);
    line(originX - 4, py, originX + 4, py);
    if (j % 2 === 0) {
      noStroke(); fill(60, 60, 80, Math.round(t * 255)); textSize(11);
      text(j, originX - 20, py);
    }
  }
}

// ── Stage 4: Grid lines fade in ──
function drawGridLinesAnim(t) {
  var alpha = Math.round(t * 80);
  stroke(180, 200, 220, alpha);
  strokeWeight(1);
  for (var i = gridMin; i <= gridMax; i++) {
    if (i === 0) continue;
    var px = gridToPixelX(i);
    var py = gridToPixelY(i);
    line(px, gridTop, px, gridBottom);
    line(gridLeft, py, gridRight, py);
  }
}

function drawAxisLabelsAnim(t) {
  var alpha = Math.round(t * 255);
  noStroke(); fill(200, 60, 60, alpha);
  textSize(12); textStyle(BOLD);
  text("(0,0)", originX + 18, originY + 18);
  textStyle(NORMAL);
}

// ── Characters on x-axis (intro) ──
function drawCharsOnXAxis(scl) {
  var eonPx = gridToPixelX(eonXStart);
  var rippaPx = gridToPixelX(rippaXStart);
  drawCharacterAtPixel(eonPx, originY, imgKid, "Eon", color(100, 50, 180), scl, eonXStart, 0);
  drawCharacterAtPixel(rippaPx, originY, imgMe, "Rippa", color(40, 100, 180), scl, rippaXStart, 0);
}

function drawCharsOnXAxisShake(intensity) {
  var eonPx = gridToPixelX(eonXStart) + random(-intensity, intensity);
  var eonPy = originY + random(-intensity, intensity);
  var rippaPx = gridToPixelX(rippaXStart) + random(-intensity, intensity);
  var rippaPy = originY + random(-intensity, intensity);
  drawCharacterAtPixel(eonPx, eonPy, imgKid, "Eon", color(100, 50, 180), 1, "?", "?");
  drawCharacterAtPixel(rippaPx, rippaPy, imgMe, "Rippa", color(40, 100, 180), 1, "?", "?");
}

// ── Bounce from x-axis to 2D positions ──
function drawCharsBounce(t) {
  var eCurX = lerp(eonXStart, eonX, t);
  var eCurY = lerp(0, eonY, t);
  var rCurX = lerp(rippaXStart, rippaX, t);
  var rCurY = lerp(0, rippaY, t);
  var arc = sin(t * PI) * 3;
  eCurY += arc; rCurY += arc;

  if (t > 0.5) {
    var ga = (t - 0.5) * 2;
    drawGuidelines2D(eonX, eonY, color(140, 80, 200, ga * 100));
    drawGuidelines2D(rippaX, rippaY, color(50, 120, 200, ga * 100));
  }
  if (t < 0.8) {
    noStroke();
    fill(100, 50, 180, 40); ellipse(gridToPixelX(eCurX), gridToPixelY(eCurY) + 10, 20, 8);
    fill(40, 100, 180, 40); ellipse(gridToPixelX(rCurX), gridToPixelY(rCurY) + 10, 20, 8);
  }
  drawCharacterAtPixel(gridToPixelX(eCurX), gridToPixelY(eCurY), imgKid, "Eon",
    color(100, 50, 180), 1, Math.round(eCurX), Math.round(eCurY - arc));
  drawCharacterAtPixel(gridToPixelX(rCurX), gridToPixelY(rCurY), imgMe, "Rippa",
    color(40, 100, 180), 1, Math.round(rCurX), Math.round(rCurY - arc));
}

// ── Full 2D grid (for shake/bounce phases) ──
function drawFullGrid2D() {
  stroke(210, 220, 235); strokeWeight(1);
  for (var i = gridMin; i <= gridMax; i++) {
    if (i === 0) continue;
    var px = gridToPixelX(i);
    var py = gridToPixelY(i);
    line(px, gridTop, px, gridBottom);
    line(gridLeft, py, gridRight, py);
  }
  stroke(40); strokeWeight(3);
  line(gridLeft, originY, gridRight, originY);
  line(originX, gridTop, originX, gridBottom);
  drawArrow2D(gridRight, originY, 1, 0, 1);
  drawArrow2D(gridLeft, originY, -1, 0, 1);
  drawArrow2D(originX, gridTop, 0, -1, 1);
  drawArrow2D(originX, gridBottom, 0, 1, 1);

  for (var i2 = gridMin; i2 <= gridMax; i2++) {
    var px2 = gridToPixelX(i2);
    stroke(60, 60, 80); strokeWeight(i2 % 5 === 0 ? 2 : 1);
    line(px2, originY - 4, px2, originY + 4);
    if (i2 % 2 === 0) { noStroke(); fill(60, 60, 80); textSize(11); text(i2, px2, originY + 18); }
  }
  for (var j2 = gridMin; j2 <= gridMax; j2++) {
    var py2 = gridToPixelY(j2);
    stroke(60, 60, 80); strokeWeight(j2 % 5 === 0 ? 2 : 1);
    line(originX - 4, py2, originX + 4, py2);
    if (j2 % 2 === 0 && j2 !== 0) { noStroke(); fill(60, 60, 80); textSize(11); text(j2, originX - 20, py2); }
  }

  noStroke(); fill(30, 60, 120); textSize(15); textStyle(BOLD);
  text("x", gridRight + 18, originY);
  text("y", originX, gridTop - 18);
  textStyle(NORMAL);

  fill(200, 60, 60); textSize(12); textStyle(BOLD);
  text("(0,0)", originX + 18, originY + 18);
  textStyle(NORMAL);
}

// ── 2D Guidelines (dashed lines to axes) ──
function drawGuidelines2D(gx, gy, col) {
  var px = gridToPixelX(gx);
  var py = gridToPixelY(gy);
  stroke(col); strokeWeight(1.5);
  drawingContext.setLineDash([5, 5]);
  line(px, py, px, originY);
  line(px, py, originX, py);
  drawingContext.setLineDash([]);
  fill(col); noStroke();
  ellipse(px, originY, 6, 6);
  ellipse(originX, py, 6, 6);
  noStroke();
  fill(red(col), green(col), blue(col), 200);
  textSize(11); textStyle(BOLD);
  text(gx, px, originY + 28);
  text(gy, originX - 30, py);
  textStyle(NORMAL);
}

// ── 2D Arrow helper ──
function drawArrow2D(x, y, dx, dy, alpha) {
  push();
  translate(x, y);
  noStroke();
  fill(40, 40, 40, Math.round(alpha * 255));
  var sz = 10;
  if (dx !== 0) {
    triangle(dx * 0, 0, -dx * sz, -sz / 1.5, -dx * sz, sz / 1.5);
  } else {
    triangle(0, dy * 0, -sz / 1.5, -dy * sz, sz / 1.5, -dy * sz);
  }
  pop();
}

// ═══════════════════════════════════════════
// Random Positions
// ═══════════════════════════════════════════
function randomizePositions() {
  eonX = floor(random(-7, 8));
  eonY = floor(random(-7, 8));
  eonZ = 0;
  if (eonY === 0) eonY = floor(random(1, 6));
  rippaX = floor(random(-7, 8));
  rippaY = floor(random(-7, 8));
  rippaZ = 0;
  if (rippaY === 0) rippaY = floor(random(-6, -1));
  while (rippaX === eonX && rippaY === eonY) {
    rippaX = floor(random(-7, 8));
    rippaY = floor(random(-7, 8));
  }
  // Intro start positions
  eonXStart = Math.max(1, Math.abs(eonX));
  rippaXStart = Math.max(1, Math.abs(rippaX));
  if (eonXStart === rippaXStart) rippaXStart = Math.min(9, rippaXStart + 2);
}

function randomize3DPositions() {
  eonX = floor(random(-6, 7));
  eonY = floor(random(-6, 7));
  eonZ = floor(random(-4, 5));
  rippaX = floor(random(-6, 7));
  rippaY = floor(random(-6, 7));
  rippaZ = floor(random(-4, 5));
  while (rippaX === eonX && rippaY === eonY && rippaZ === eonZ) {
    rippaX = floor(random(-6, 7));
    rippaY = floor(random(-6, 7));
    rippaZ = floor(random(-4, 5));
  }
}

// ═══════════════════════════════════════════
// Button Hit Testing
// ═══════════════════════════════════════════
function hitBtn(btn) {
  return mouseX >= btn.x && mouseX <= btn.x + btn.w &&
         mouseY >= btn.y && mouseY <= btn.y + btn.h;
}

// ═══════════════════════════════════════════
// 3D Drag Helpers
// ═══════════════════════════════════════════
function getDragAxes() {
  // Determine which axes are draggable based on view + axis lock
  var planeAxes;
  if (currentView === 'XY') planeAxes = ['x', 'y'];
  else if (currentView === 'XZ') planeAxes = ['x', 'z'];
  else if (currentView === 'YZ') planeAxes = ['y', 'z'];
  else planeAxes = ['x', 'y']; // 3D default: drag on XY plane

  if (axisLock === 'free') return planeAxes;
  if (planeAxes.indexOf(axisLock) >= 0) return [axisLock];
  // Locked axis not in current plane → allow single axis drag anyway
  return [axisLock];
}

function dragAlongAxis(who, axisName, mouseDX, mouseDY) {
  // Compute screen-space direction of the axis at the character's position
  var gx = who === 'eon' ? eonX : rippaX;
  var gy = who === 'eon' ? eonY : rippaY;
  var gz = who === 'eon' ? eonZ : rippaZ;

  var p0 = project3D(gx, gy, gz);
  var p1;
  if (axisName === 'x') p1 = project3D(gx + 1, gy, gz);
  else if (axisName === 'y') p1 = project3D(gx, gy + 1, gz);
  else p1 = project3D(gx, gy, gz + 1);

  var adx = p1.x - p0.x;
  var ady = p1.y - p0.y;
  var axLen = Math.sqrt(adx * adx + ady * ady);
  if (axLen < 0.5) return 0;

  // Project mouse delta onto axis direction
  var proj = (mouseDX * adx + mouseDY * ady) / axLen;
  return proj / axLen; // grid units
}

function dragOnPlane(who, ax1, ax2, mouseDX, mouseDY) {
  // Solve 2x2 system: screen delta = J * grid delta
  var gx = who === 'eon' ? eonX : rippaX;
  var gy = who === 'eon' ? eonY : rippaY;
  var gz = who === 'eon' ? eonZ : rippaZ;

  var p0 = project3D(gx, gy, gz);
  var p1, p2;
  if (ax1 === 'x') p1 = project3D(gx + 1, gy, gz);
  else if (ax1 === 'y') p1 = project3D(gx, gy + 1, gz);
  else p1 = project3D(gx, gy, gz + 1);

  if (ax2 === 'x') p2 = project3D(gx + 1, gy, gz);
  else if (ax2 === 'y') p2 = project3D(gx, gy + 1, gz);
  else p2 = project3D(gx, gy, gz + 1);

  var v1x = p1.x - p0.x, v1y = p1.y - p0.y;
  var v2x = p2.x - p0.x, v2y = p2.y - p0.y;

  var det = v1x * v2y - v2x * v1y;
  if (Math.abs(det) < 0.1) return [0, 0]; // degenerate

  var d1 = (mouseDX * v2y - mouseDY * v2x) / det;
  var d2 = (mouseDY * v1x - mouseDX * v1y) / det;
  return [d1, d2];
}

// ═══════════════════════════════════════════
// Mouse Interaction
// ═══════════════════════════════════════════
function mousePressed() {
  // ── Middle mouse: start camera orbit ──
  if (mouseButton === CENTER && (phase === "interactive" || phase === "z_axis")) {
    isOrbiting = true;
    return;
  }

  // ── Intro: NEXT button ──
  var introPhases = ["xaxis_positive", "xaxis_negative", "y_axis", "grid_appear"];
  if (introPhases.indexOf(phase) >= 0 && phaseAnimDone) {
    if (hitBtn(nextBtn)) {
      var nextMap = {
        xaxis_positive: "xaxis_negative",
        xaxis_negative: "y_axis",
        y_axis: "grid_appear",
        grid_appear: "shake"
      };
      var nxt = nextMap[phase];
      if (nxt) goToPhase(nxt);
      return;
    }
  }

  // ── Intro: SKIP button ──
  if (phase !== "interactive" && phase !== "z_axis") {
    if (hitBtn(skipBtn)) { skipToInteractive(); return; }
  }

  // ── Interactive: View buttons ──
  if (phase === "interactive") {
    var views = ['3D', 'XY', 'XZ', 'YZ'];
    for (var vi = 0; vi < views.length; vi++) {
      if (hitBtn(viewBtns[views[vi]])) {
        setView(views[vi]);
        return;
      }
    }

    // Axis lock buttons
    var locks = ['free', 'x', 'y', 'z'];
    for (var li = 0; li < locks.length; li++) {
      if (hitBtn(lockBtns[locks[li]])) {
        axisLock = locks[li];
        return;
      }
    }

    // Numeric +/- buttons
    var whos = ['eon', 'rippa'];
    var axes = ['x', 'y', 'z'];
    for (var wi = 0; wi < whos.length; wi++) {
      for (var ai = 0; ai < axes.length; ai++) {
        var w = whos[wi];
        var ax = axes[ai];
        if (hitBtn(numBtns[w][ax].minus)) {
          adjustCoord(w, ax, -1);
          return;
        }
        if (hitBtn(numBtns[w][ax].plus)) {
          adjustCoord(w, ax, 1);
          return;
        }
      }
    }

    // Replay button
    if (hitBtn(replayBtn)) { restartAnimation(); return; }

    // New positions button
    if (hitBtn(newPosBtn)) { randomize3DPositions(); return; }

    // ── Drag characters ──
    var eonP = project3D(eonX, eonY, eonZ);
    var ripP = project3D(rippaX, rippaY, rippaZ);

    if (dist(mouseX, mouseY, eonP.x, eonP.y) <= personHitRadius) {
      dragTarget = "eon"; isDragging = true;
      dragAccumX = 0; dragAccumY = 0; dragAccumZ = 0;
      return;
    }
    if (dist(mouseX, mouseY, ripP.x, ripP.y) <= personHitRadius) {
      dragTarget = "rippa"; isDragging = true;
      dragAccumX = 0; dragAccumY = 0; dragAccumZ = 0;
      return;
    }
  }
}

function mouseDragged() {
  // ── Middle mouse orbit ──
  if (isOrbiting) {
    var odx = mouseX - pmouseX;
    var ody = mouseY - pmouseY;
    camAzTarget += odx * orbitSensitivity;
    camElTarget -= ody * orbitSensitivity;
    // Clamp elevation so we don't flip upside-down
    camElTarget = constrain(camElTarget, -HALF_PI + 0.05, HALF_PI - 0.05);
    // Switch to free 3D perspective when user manually orbits
    currentView = '3D';
    camOrthoTarget = 0;
    return;
  }

  if (phase !== "interactive" || !isDragging || !dragTarget) return;

  var mdx = mouseX - pmouseX;
  var mdy = mouseY - pmouseY;
  if (Math.abs(mdx) < 0.5 && Math.abs(mdy) < 0.5) return;

  var dragAx = getDragAxes();

  if (dragAx.length === 1) {
    // Single axis drag
    var delta = dragAlongAxis(dragTarget, dragAx[0], mdx, mdy);
    applyDragDelta(dragTarget, dragAx[0], delta);
  } else if (dragAx.length === 2) {
    // Two-axis (plane) drag
    var deltas = dragOnPlane(dragTarget, dragAx[0], dragAx[1], mdx, mdy);
    applyDragDelta(dragTarget, dragAx[0], deltas[0]);
    applyDragDelta(dragTarget, dragAx[1], deltas[1]);
  }
}

function applyDragDelta(who, axName, delta) {
  if (axName === 'x') {
    if (who === 'eon') { dragAccumX += delta; var step = Math.round(dragAccumX); if (step !== 0) { eonX = constrain(eonX + step, gridMin + 1, gridMax - 1); dragAccumX -= step; } }
    else { dragAccumX += delta; var step2 = Math.round(dragAccumX); if (step2 !== 0) { rippaX = constrain(rippaX + step2, gridMin + 1, gridMax - 1); dragAccumX -= step2; } }
  } else if (axName === 'y') {
    if (who === 'eon') { dragAccumY += delta; var stepY = Math.round(dragAccumY); if (stepY !== 0) { eonY = constrain(eonY + stepY, gridMin + 1, gridMax - 1); dragAccumY -= stepY; } }
    else { dragAccumY += delta; var stepY2 = Math.round(dragAccumY); if (stepY2 !== 0) { rippaY = constrain(rippaY + stepY2, gridMin + 1, gridMax - 1); dragAccumY -= stepY2; } }
  } else {
    if (who === 'eon') { dragAccumZ += delta; var stepZ = Math.round(dragAccumZ); if (stepZ !== 0) { eonZ = constrain(eonZ + stepZ, gridMin + 1, gridMax - 1); dragAccumZ -= stepZ; } }
    else { dragAccumZ += delta; var stepZ2 = Math.round(dragAccumZ); if (stepZ2 !== 0) { rippaZ = constrain(rippaZ + stepZ2, gridMin + 1, gridMax - 1); dragAccumZ -= stepZ2; } }
  }
}

function adjustCoord(who, axName, delta) {
  if (who === 'eon') {
    if (axName === 'x') eonX = constrain(eonX + delta, gridMin + 1, gridMax - 1);
    else if (axName === 'y') eonY = constrain(eonY + delta, gridMin + 1, gridMax - 1);
    else eonZ = constrain(eonZ + delta, gridMin + 1, gridMax - 1);
  } else {
    if (axName === 'x') rippaX = constrain(rippaX + delta, gridMin + 1, gridMax - 1);
    else if (axName === 'y') rippaY = constrain(rippaY + delta, gridMin + 1, gridMax - 1);
    else rippaZ = constrain(rippaZ + delta, gridMin + 1, gridMax - 1);
  }
}

function mouseReleased() {
  if (isOrbiting) {
    isOrbiting = false;
    return;
  }
  isDragging = false;
  dragTarget = null;
  dragAccumX = 0; dragAccumY = 0; dragAccumZ = 0;
}

// ═══════════════════════════════════════════
// Scroll Wheel Zoom
// ═══════════════════════════════════════════
function mouseWheel(event) {
  if (phase === "interactive" || phase === "z_axis") {
    CAM_DIST += event.delta * 0.8;
    CAM_DIST = constrain(CAM_DIST, 250, 3000);
    return false; // prevent page scroll
  }
}

// ═══════════════════════════════════════════
// Keyboard Support
// ═══════════════════════════════════════════
function keyPressed() {
  if (phase !== "interactive") return;

  // View shortcuts: 1=3D, 2=XY, 3=XZ, 4=YZ
  if (key === '1') { setView('3D'); return; }
  if (key === '2') { setView('XY'); return; }
  if (key === '3') { setView('XZ'); return; }
  if (key === '4') { setView('YZ'); return; }

  // Axis lock shortcuts: F=free, X/Y/Z
  if (key === 'f' || key === 'F') { axisLock = 'free'; return; }
  if (key === 'x' || key === 'X') { axisLock = 'x'; return; }
  if (key === 'y' || key === 'Y') { axisLock = 'y'; return; }
  if (key === 'z' || key === 'Z') { axisLock = 'z'; return; }
}
