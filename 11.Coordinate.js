/* jshint esversion: 8 */
// Coordinate Grid – Step-by-Step Animated Introduction & Interactive Exploration
// Animation steps (click NEXT to advance):
//   1. Rippa & Eon stand on a positive x-axis (number line)
//   2. Axis extends to negative numbers
//   3. Y-axis appears
//   4. Grid lines appear with labels
//   5. Characters shake/charge up, then BOUNCE to a 2D grid position
//   6. Interactive – drag characters, Replay button to restart

// ==============================
// Config
// ==============================
const ORIG_W = 900, ORIG_H = 740;
const gridMin = -10;
const gridMax = 10;
const gridSize = gridMax - gridMin; // 20
const personHitRadius = 36;

// ==============================
// State
// ==============================
let initialized = false;
let canvasW = 900, canvasH = 740;

// Grid layout (computed in updateLayout)
let originX, originY;
let cellPx;
let gridLeft, gridRight, gridTop, gridBottom;

// Characters – starting positions on x-axis (step 1)
let eonXStart = 3, rippaXStart = 7;
// Characters – final grid coordinates (randomized)
let eonX = -4, eonY = 3;
let rippaX = 5, rippaY = -2;
let dragTarget = null;
let isDragging = false;

// ==============================
// Animation state machine
// ==============================
// Phases (click-controlled):
//   "xaxis_positive"  → NEXT → "xaxis_negative"  → NEXT → "y_axis"
//   → NEXT → "grid_appear" → NEXT → "shake" → (auto) → "bounce" → (auto) → "interactive"
let phase = "xaxis_positive";
let phaseStart = 0;
let phaseAnimDone = false; // true when current phase's tween is complete

const PHASE_DUR = {
  xaxis_positive: 1000,
  xaxis_negative: 1000,
  y_axis: 1000,
  grid_appear: 1200,
  shake: 1800,
  bounce: 1200
};

// Shake animation state
let shakeIntensity = 0;

// Bounce animation – interpolated positions
let eonBounceX, eonBounceY, rippaBounceX, rippaBounceY;

// ==============================
// Buttons
// ==============================
const nextBtn   = { x: 0, y: 0, w: 160, h: 44 };
const replayBtn = { x: 0, y: 0, w: 160, h: 44 };
const newPosBtn = { x: 0, y: 0, w: 180, h: 44 };
const skipBtn   = { x: 0, y: 0, w: 140, h: 44 };

// ==============================
// Images
// ==============================
let imgKid, imgMe;
const profileRadius = 26;

// Inline fallbacks (kid.png = Eon, me.png = Rippa)
// ASSET_FALLBACKS_START
const ASSET_ME_DATA_FALLBACK = "data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAkGgAwAEAAAAAQAAAkIAAAAA/8AAEQgCQgJBAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQ";
const ASSET_KID_DATA_FALLBACK = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgoKCgsLCggKCggICgoKCAgICAgICAgKCggKCAgICAgICAgICAgICA0ICAoICAgICgoKCAgLDQoIDQgICggBAwQEBgUGCgYGCg8NCw0QDQ8PEA8PDQ0PDw8NDw0PDQ4PDQ0NDw0NDw8NDQ0PDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDf/AABEI";
// ASSET_FALLBACKS_END

// ==============================
// Easing functions
// ==============================
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}
function easeOutBounce(t) {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    t -= 1.5 / 2.75;
    return 7.5625 * t * t + 0.75;
  } else if (t < 2.5 / 2.75) {
    t -= 2.25 / 2.75;
    return 7.5625 * t * t + 0.9375;
  } else {
    t -= 2.625 / 2.75;
    return 7.5625 * t * t + 0.984375;
  }
}
function easeInBack(t) {
  var s = 1.70158;
  return t * t * ((s + 1) * t - s);
}

// ==============================
// Setup
// ==============================
async function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial");
  textAlign(CENTER, CENTER);
  updateLayout();

  var meData = ASSET_ME_DATA_FALLBACK;
  var kidData = ASSET_KID_DATA_FALLBACK;
  if (typeof window !== "undefined" && window.ASSET_ME_DATA) meData = window.ASSET_ME_DATA;
  if (typeof window !== "undefined" && window.ASSET_KID_DATA) kidData = window.ASSET_KID_DATA;

  var base = "";
  try { base = new URL("./", window.location.href).href; } catch (e) {}

  imgMe = await loadImage(meData || (base + "assets/me.png"));
  imgKid = await loadImage(kidData || (base + "assets/kid.png"));

  randomizePositions();
  phaseStart = millis();
  initialized = true;
}

// ==============================
// Layout
// ==============================
function updateLayout() {
  canvasW = width;
  canvasH = height;
  var padLeft = 90, padRight = 90, padTop = 100, padBot = 100;
  var areaW = canvasW - padLeft - padRight;
  var areaH = canvasH - padTop - padBot;
  cellPx = Math.min(areaW / gridSize, areaH / gridSize);

  originX = padLeft + (areaW / 2);
  originY = padTop + (areaH / 2);
  gridLeft   = originX + gridMin * cellPx;
  gridRight  = originX + gridMax * cellPx;
  gridTop    = originY + gridMin * cellPx;
  gridBottom = originY + gridMax * cellPx;

  // Buttons
  nextBtn.x = canvasW / 2 - nextBtn.w / 2;
  nextBtn.y = canvasH - nextBtn.h - 14;

  replayBtn.x = 20;
  replayBtn.y = canvasH - replayBtn.h - 14;

  newPosBtn.x = canvasW - newPosBtn.w - 20;
  newPosBtn.y = canvasH - newPosBtn.h - 14;

  skipBtn.x = canvasW - skipBtn.w - 20;
  skipBtn.y = canvasH - skipBtn.h - 14;
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  updateLayout();
}

// ==============================
// Coordinate helpers
// ==============================
function gridToPixelX(gx) { return originX + gx * cellPx; }
function gridToPixelY(gy) { return originY - gy * cellPx; }
function pixelToGridX(px) { return (px - originX) / cellPx; }
function pixelToGridY(py) { return -(py - originY) / cellPx; }

// ==============================
// Phase helpers
// ==============================
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
  phase = "interactive";
  phaseStart = millis();
  phaseAnimDone = false;
  // Set bounce positions to final
  eonBounceX = eonX; eonBounceY = eonY;
  rippaBounceX = rippaX; rippaBounceY = rippaY;
}

function restartAnimation() {
  randomizePositions();
  eonXStart = Math.max(1, Math.abs(eonX));
  rippaXStart = Math.max(1, Math.abs(rippaX));
  if (eonXStart === rippaXStart) rippaXStart = Math.min(9, rippaXStart + 2);
  goToPhase("xaxis_positive");
}

// ==============================
// Draw
// ==============================
function draw() {
  if (!initialized) {
    if (typeof createCanvas === "function") createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
    if (typeof textFont === "function") textFont("Arial");
    if (typeof textAlign === "function") textAlign(CENTER, CENTER);
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
  drawTitle();

  var t = easeInOut(constrain(phaseProgress(), 0, 1));
  var rawT = phaseProgress();

  // Mark anim done when tween finishes
  if (rawT >= 1 && !phaseAnimDone) {
    phaseAnimDone = true;
  }

  // ---- PHASE RENDERING ----
  if (phase === "xaxis_positive") {
    drawXAxisPositive(t);
    drawCharsOnXAxis(1);
    if (phaseAnimDone) drawNextButton();
    drawSkipButton();

  } else if (phase === "xaxis_negative") {
    drawXAxisFull(t);
    drawCharsOnXAxis(1);
    if (phaseAnimDone) drawNextButton();
    drawSkipButton();

  } else if (phase === "y_axis") {
    drawXAxisFull(1);
    drawVerticalLineAnim(t);
    drawCharsOnXAxis(1);
    if (phaseAnimDone) drawNextButton();
    drawSkipButton();

  } else if (phase === "grid_appear") {
    drawXAxisFull(1);
    drawVerticalLineAnim(1);
    drawGridLinesAnim(t);
    drawAxisLabelsAnim(t);
    drawCharsOnXAxis(1);
    if (phaseAnimDone) drawNextButton();
    drawSkipButton();

  } else if (phase === "shake") {
    drawFullGrid();
    // Shake builds up over time
    shakeIntensity = rawT * rawT * 8; // increases quadratically up to 8px
    drawCharsOnXAxisShake(shakeIntensity);

    // Show "charging" text
    noStroke();
    fill(180, 60, 60);
    textSize(16);
    textStyle(BOLD);
    text("Getting ready to jump into the coordinate plane!", canvasW / 2, canvasH - 50);
    textStyle(NORMAL);

    // Auto-advance to bounce
    if (rawT >= 1) {
      goToPhase("bounce");
    }

  } else if (phase === "bounce") {
    drawFullGrid();
    drawCharsBounce(easeOutBounce(constrain(rawT, 0, 1)));

    // Auto-advance to interactive
    if (rawT >= 1) {
      goToPhase("interactive");
      eonBounceX = eonX; eonBounceY = eonY;
      rippaBounceX = rippaX; rippaBounceY = rippaY;
    }

  } else {
    // interactive
    drawFullGrid();
    drawCharactersFull();
    drawReplayButton();
    drawNewPosButton();
    drawInstructions();
  }
}

// ==============================
// Title
// ==============================
function drawTitle() {
  noStroke();
  fill(30, 50, 80);
  textSize(22);
  textStyle(BOLD);
  text("Coordinate Grid – Explore with Rippa & Eon", canvasW / 2, 28);
  textStyle(NORMAL);

  if (phase === "interactive") {
    fill(80);
    textSize(13);
    text("Drag Rippa or Eon to move them on the grid. Watch the (x, y) coordinates change!", canvasW / 2, 54);
  } else {
    fill(100);
    textSize(13);
    var stepText = {
      xaxis_positive: "Step 1: Rippa and Eon are on the number line!",
      xaxis_negative: "Step 2: The number line extends to negative numbers!",
      y_axis: "Step 3: A new axis appears – the y-axis!",
      grid_appear: "Step 4: The coordinate grid is forming!",
      shake: "Step 5: They're getting ready to explore 2D!",
      bounce: "Jumping into the coordinate plane!"
    };
    text(stepText[phase] || "", canvasW / 2, 54);
  }
}

// ==============================
// Step 1: Positive x-axis with characters
// ==============================
function drawXAxisPositive(t) {
  // Draw positive half of x-axis, animating from origin to right
  var rightEnd = originX + gridMax * cellPx * t;

  stroke(40);
  strokeWeight(3);
  line(originX, originY, rightEnd, originY);

  // Arrow on right end
  if (t > 0.85) {
    var a = easeOut((t - 0.85) / 0.15);
    drawArrow(rightEnd, originY, 1, 0, a);
  }

  // Origin dot
  fill(200, 60, 60);
  noStroke();
  ellipse(originX, originY, 8, 8);

  // Tick marks & labels (positive only, revealed by t)
  for (var i = 0; i <= gridMax; i++) {
    var px = gridToPixelX(i);
    if (px > rightEnd + 5) break;
    stroke(60, 60, 80);
    strokeWeight(i % 5 === 0 ? 2 : 1);
    line(px, originY - 4, px, originY + 4);
    if (i % 2 === 0) {
      noStroke();
      fill(60, 60, 80);
      textSize(11);
      text(i, px, originY + 18);
    }
  }

  // "x" label
  if (t > 0.7) {
    noStroke();
    fill(30, 60, 120, Math.round(((t - 0.7) / 0.3) * 255));
    textSize(15);
    textStyle(BOLD);
    text("x", rightEnd + 18, originY);
    textStyle(NORMAL);
  }
}

// ==============================
// Step 2: Full x-axis (extends negative)
// ==============================
function drawXAxisFull(t) {
  // Full positive side
  stroke(40);
  strokeWeight(3);
  line(originX, originY, gridRight, originY);
  drawArrow(gridRight, originY, 1, 0, 1);

  // Negative side animates
  var leftEnd = originX - (originX - gridLeft) * t;
  line(leftEnd, originY, originX, originY);

  if (t > 0.85) {
    var a = easeOut((t - 0.85) / 0.15);
    drawArrow(leftEnd, originY, -1, 0, a);
  }

  // Origin
  fill(200, 60, 60);
  noStroke();
  ellipse(originX, originY, 8, 8);

  // Positive ticks
  for (var i = 0; i <= gridMax; i++) {
    var px = gridToPixelX(i);
    stroke(60, 60, 80);
    strokeWeight(i % 5 === 0 ? 2 : 1);
    line(px, originY - 4, px, originY + 4);
    if (i % 2 === 0) {
      noStroke(); fill(60, 60, 80); textSize(11);
      text(i, px, originY + 18);
    }
  }

  // Negative ticks (revealed by t)
  for (var j = -1; j >= gridMin; j--) {
    var px2 = gridToPixelX(j);
    if (px2 < leftEnd - 5) break;
    stroke(60, 60, 80);
    strokeWeight(j % 5 === 0 ? 2 : 1);
    line(px2, originY - 4, px2, originY + 4);
    if (j % 2 === 0) {
      noStroke(); fill(60, 60, 80); textSize(11);
      text(j, px2, originY + 18);
    }
  }

  // Labels
  noStroke();
  fill(30, 60, 120);
  textSize(15);
  textStyle(BOLD);
  text("x", gridRight + 18, originY);
  textStyle(NORMAL);
}

// ==============================
// Step 3: Vertical axis (y-axis)
// ==============================
function drawVerticalLineAnim(t) {
  var halfLen = (gridBottom - gridTop) / 2 * t;
  stroke(40);
  strokeWeight(3);
  line(originX, originY - halfLen, originX, originY + halfLen);

  if (t > 0.85) {
    var a = easeOut((t - 0.85) / 0.15);
    drawArrow(originX, originY - halfLen, 0, -1, a);
    drawArrow(originX, originY + halfLen, 0, 1, a);
  }

  // y label
  if (t > 0.6) {
    noStroke();
    fill(30, 60, 120, Math.round(((t - 0.6) / 0.4) * 255));
    textSize(15);
    textStyle(BOLD);
    text("y", originX, originY - halfLen - 18);
    textStyle(NORMAL);
  }

  // y ticks
  for (var j = gridMin; j <= gridMax; j++) {
    if (j === 0) continue;
    var py = gridToPixelY(j);
    if (py < originY - halfLen || py > originY + halfLen) continue;
    stroke(60, 60, 80);
    strokeWeight(j % 5 === 0 ? 2 : 1);
    line(originX - 4, py, originX + 4, py);
    if (j % 2 === 0) {
      noStroke(); fill(60, 60, 80, Math.round(t * 255)); textSize(11);
      text(j, originX - 20, py);
    }
  }
}

// ==============================
// Step 4: Grid lines fade in
// ==============================
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
  // origin label
  var alpha = Math.round(t * 255);
  noStroke();
  fill(200, 60, 60, alpha);
  textSize(12);
  textStyle(BOLD);
  text("(0,0)", originX + 18, originY + 18);
  textStyle(NORMAL);
}

// ==============================
// Characters on x-axis (steps 1-4)
// ==============================
function drawCharsOnXAxis(scl) {
  var eonPx = gridToPixelX(eonXStart);
  var rippaPx = gridToPixelX(rippaXStart);
  drawCharacterAtPixel(eonPx, originY, imgKid, "Eon", color(100, 50, 180), scl, eonXStart, 0);
  drawCharacterAtPixel(rippaPx, originY, imgMe, "Rippa", color(40, 100, 180), scl, rippaXStart, 0);
}

// ==============================
// Characters on x-axis with SHAKE
// ==============================
function drawCharsOnXAxisShake(intensity) {
  var eonPx = gridToPixelX(eonXStart) + random(-intensity, intensity);
  var eonPy = originY + random(-intensity, intensity);
  var rippaPx = gridToPixelX(rippaXStart) + random(-intensity, intensity);
  var rippaPy = originY + random(-intensity, intensity);

  drawCharacterAtPixel(eonPx, eonPy, imgKid, "Eon", color(100, 50, 180), 1, "?", "?");
  drawCharacterAtPixel(rippaPx, rippaPy, imgMe, "Rippa", color(40, 100, 180), 1, "?", "?");
}

// ==============================
// Characters BOUNCE from x-axis to grid positions
// ==============================
function drawCharsBounce(t) {
  // Interpolate from (xStart, 0) to (finalX, finalY)
  var eonCurX = lerp(eonXStart, eonX, t);
  var eonCurY = lerp(0, eonY, t);
  var rippaCurX = lerp(rippaXStart, rippaX, t);
  var rippaCurY = lerp(0, rippaY, t);

  // Add a vertical "launch" arc – extra height in the middle
  var arc = sin(t * PI) * 3; // peaks at t=0.5
  eonCurY += arc;
  rippaCurY += arc;

  var eonPx = gridToPixelX(eonCurX);
  var eonPy = gridToPixelY(eonCurY);
  var rippaPx = gridToPixelX(rippaCurX);
  var rippaPy = gridToPixelY(rippaCurY);

  // Draw guidelines at target positions (fading in)
  if (t > 0.5) {
    var ga = (t - 0.5) * 2;
    drawGuidelines(eonX, eonY, color(140, 80, 200, ga * 100));
    drawGuidelines(rippaX, rippaY, color(50, 120, 200, ga * 100));
  }

  // Small trail effect
  if (t < 0.8) {
    noStroke();
    fill(100, 50, 180, 40);
    ellipse(eonPx, eonPy + 10, 20, 8);
    fill(40, 100, 180, 40);
    ellipse(rippaPx, rippaPy + 10, 20, 8);
  }

  drawCharacterAtPixel(eonPx, eonPy, imgKid, "Eon", color(100, 50, 180), 1,
    Math.round(eonCurX), Math.round(eonCurY - arc));
  drawCharacterAtPixel(rippaPx, rippaPy, imgMe, "Rippa", color(40, 100, 180), 1,
    Math.round(rippaCurX), Math.round(rippaCurY - arc));
}

// ==============================
// Full static grid
// ==============================
function drawFullGrid() {
  // Grid lines
  stroke(210, 220, 235);
  strokeWeight(1);
  for (var i = gridMin; i <= gridMax; i++) {
    if (i === 0) continue;
    var px = gridToPixelX(i);
    var py = gridToPixelY(i);
    line(px, gridTop, px, gridBottom);
    line(gridLeft, py, gridRight, py);
  }

  // Axes
  stroke(40);
  strokeWeight(3);
  line(gridLeft, originY, gridRight, originY);
  line(originX, gridTop, originX, gridBottom);
  drawArrow(gridRight, originY, 1, 0, 1);
  drawArrow(gridLeft, originY, -1, 0, 1);
  drawArrow(originX, gridTop, 0, -1, 1);
  drawArrow(originX, gridBottom, 0, 1, 1);

  // Ticks & labels
  for (var i2 = gridMin; i2 <= gridMax; i2++) {
    var px2 = gridToPixelX(i2);
    stroke(60, 60, 80);
    strokeWeight(i2 % 5 === 0 ? 2 : 1);
    line(px2, originY - 4, px2, originY + 4);
    if (i2 % 2 === 0) {
      noStroke(); fill(60, 60, 80); textSize(11);
      text(i2, px2, originY + 18);
    }
  }
  for (var j2 = gridMin; j2 <= gridMax; j2++) {
    var py2 = gridToPixelY(j2);
    stroke(60, 60, 80);
    strokeWeight(j2 % 5 === 0 ? 2 : 1);
    line(originX - 4, py2, originX + 4, py2);
    if (j2 % 2 === 0 && j2 !== 0) {
      noStroke(); fill(60, 60, 80); textSize(11);
      text(j2, originX - 20, py2);
    }
  }

  // Axis letters
  noStroke(); fill(30, 60, 120); textSize(15); textStyle(BOLD);
  text("x", gridRight + 18, originY);
  text("y", originX, gridTop - 18);
  textStyle(NORMAL);

  // Origin
  fill(200, 60, 60); textSize(12); textStyle(BOLD);
  text("(0,0)", originX + 18, originY + 18);
  textStyle(NORMAL);
}

// ==============================
// Interactive characters (full)
// ==============================
function drawCharactersFull() {
  drawGuidelines(eonX, eonY, color(140, 80, 200, 100));
  drawGuidelines(rippaX, rippaY, color(50, 120, 200, 100));

  drawCharacter(eonX, eonY, imgKid, "Eon", color(100, 50, 180), 1);
  drawCharacter(rippaX, rippaY, imgMe, "Rippa", color(40, 100, 180), 1);

  if (dragTarget === "eon") {
    var px = gridToPixelX(eonX), py = gridToPixelY(eonY);
    noFill(); stroke(140, 80, 200); strokeWeight(3);
    ellipse(px, py, profileRadius * 2 + 12, profileRadius * 2 + 12);
  }
  if (dragTarget === "rippa") {
    var px2 = gridToPixelX(rippaX), py2 = gridToPixelY(rippaY);
    noFill(); stroke(50, 120, 200); strokeWeight(3);
    ellipse(px2, py2, profileRadius * 2 + 12, profileRadius * 2 + 12);
  }
}

// ==============================
// Draw character at GRID position
// ==============================
function drawCharacter(gx, gy, img, label, col, scl) {
  drawCharacterAtPixel(gridToPixelX(gx), gridToPixelY(gy), img, label, col, scl, gx, gy);
}

// ==============================
// Draw character at PIXEL position
// ==============================
function drawCharacterAtPixel(px, py, img, label, col, scl, coordX, coordY) {
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
  noStroke(); fill(col); textSize(13); textStyle(BOLD);
  text(label, px, py - r - 14);
  textStyle(NORMAL);

  // (x,y) coordinate label below
  var coordStr = "(" + coordX + ", " + coordY + ")";
  var tw = textWidth(coordStr) + 16;
  var th = 22;
  var lx = px, ly = py + r + 18;
  fill(255, 255, 255, 220);
  stroke(col); strokeWeight(2);
  rectMode(CENTER);
  rect(lx, ly, tw, th, 10);
  rectMode(CORNER);
  noStroke(); fill(col); textSize(13); textStyle(BOLD);
  text(coordStr, lx, ly);
  textStyle(NORMAL);
}

// ==============================
// Dashed guidelines to axes
// ==============================
function drawGuidelines(gx, gy, col) {
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

// ==============================
// Arrow helper
// ==============================
function drawArrow(x, y, dx, dy, alpha) {
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

// ==============================
// Instructions (interactive)
// ==============================
function drawInstructions() {
  noStroke();
  fill(40, 60, 100);
  textSize(14);
  text(
    "Eon is at (" + eonX + ", " + eonY + ")   |   Rippa is at (" + rippaX + ", " + rippaY + ")",
    canvasW / 2, canvasH - 60
  );
  fill(80);
  textSize(12);
  var dx = Math.abs(rippaX - eonX);
  var dy = Math.abs(rippaY - eonY);
  text(
    "Horizontal distance: " + dx + "   Vertical distance: " + dy,
    canvasW / 2, canvasH - 40
  );
}

// ==============================
// NEXT button (during intro steps)
// ==============================
function drawNextButton() {
  var hover =
    mouseX >= nextBtn.x && mouseX <= nextBtn.x + nextBtn.w &&
    mouseY >= nextBtn.y && mouseY <= nextBtn.y + nextBtn.h;

  // Pulsing glow
  var pulse = sin(millis() * 0.005) * 0.3 + 0.7;
  stroke(40, 120, 220); strokeWeight(hover ? 3 : 2);
  fill(hover ? color(60, 140, 240) : lerpColor(color(70, 130, 220), color(100, 160, 255), pulse));
  rect(nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h, 12);
  noStroke(); fill(255); textSize(16); textStyle(BOLD);
  text("NEXT  \u25B6", nextBtn.x + nextBtn.w / 2, nextBtn.y + nextBtn.h / 2);
  textStyle(NORMAL);
}

// ==============================
// REPLAY button (interactive)
// ==============================
function drawReplayButton() {
  var hover =
    mouseX >= replayBtn.x && mouseX <= replayBtn.x + replayBtn.w &&
    mouseY >= replayBtn.y && mouseY <= replayBtn.y + replayBtn.h;

  stroke(100, 60, 160); strokeWeight(2);
  fill(hover ? color(210, 195, 240) : color(230, 220, 245));
  rect(replayBtn.x, replayBtn.y, replayBtn.w, replayBtn.h, 10);
  noStroke(); fill(80, 40, 140); textSize(14); textStyle(BOLD);
  text("\u21BA  REPLAY", replayBtn.x + replayBtn.w / 2, replayBtn.y + replayBtn.h / 2);
  textStyle(NORMAL);
}

// ==============================
// NEW POSITIONS button
// ==============================
function drawNewPosButton() {
  var hover =
    mouseX >= newPosBtn.x && mouseX <= newPosBtn.x + newPosBtn.w &&
    mouseY >= newPosBtn.y && mouseY <= newPosBtn.y + newPosBtn.h;

  stroke(60, 40, 120); strokeWeight(2);
  fill(hover ? color(200, 190, 240) : color(225, 220, 245));
  rect(newPosBtn.x, newPosBtn.y, newPosBtn.w, newPosBtn.h, 10);
  noStroke(); fill(60, 40, 120); textSize(14); textStyle(BOLD);
  text("NEW POSITIONS", newPosBtn.x + newPosBtn.w / 2, newPosBtn.y + newPosBtn.h / 2);
  textStyle(NORMAL);
}

// ==============================
// SKIP button (during intro)
// ==============================
function drawSkipButton() {
  var hover =
    mouseX >= skipBtn.x && mouseX <= skipBtn.x + skipBtn.w &&
    mouseY >= skipBtn.y && mouseY <= skipBtn.y + skipBtn.h;

  stroke(120); strokeWeight(1.5);
  fill(hover ? color(230, 230, 235) : color(245, 245, 248));
  rect(skipBtn.x, skipBtn.y, skipBtn.w, skipBtn.h, 8);
  noStroke(); fill(100); textSize(12); textStyle(BOLD);
  text("SKIP \u25B6\u25B6", skipBtn.x + skipBtn.w / 2, skipBtn.y + skipBtn.h / 2);
  textStyle(NORMAL);
}

// ==============================
// Random positions
// ==============================
function randomizePositions() {
  eonX = floor(random(-8, 9));
  eonY = floor(random(-8, 9));
  if (eonY === 0) eonY = floor(random(1, 7));
  rippaX = floor(random(-8, 9));
  rippaY = floor(random(-8, 9));
  if (rippaY === 0) rippaY = floor(random(-7, -1));
  while (rippaX === eonX && rippaY === eonY) {
    rippaX = floor(random(-8, 9));
    rippaY = floor(random(-8, 9));
  }
  // Set start positions on x-axis
  eonXStart = Math.max(1, Math.abs(eonX));
  rippaXStart = Math.max(1, Math.abs(rippaX));
  if (eonXStart === rippaXStart) rippaXStart = Math.min(9, rippaXStart + 2);
}

// ==============================
// Interaction
// ==============================
function mousePressed() {
  // NEXT button (during animated intro, only when anim done)
  if (phase !== "interactive" && phase !== "shake" && phase !== "bounce" && phaseAnimDone) {
    if (
      mouseX >= nextBtn.x && mouseX <= nextBtn.x + nextBtn.w &&
      mouseY >= nextBtn.y && mouseY <= nextBtn.y + nextBtn.h
    ) {
      var nextPhaseMap = {
        xaxis_positive: "xaxis_negative",
        xaxis_negative: "y_axis",
        y_axis: "grid_appear",
        grid_appear: "shake"
      };
      var next = nextPhaseMap[phase];
      if (next) goToPhase(next);
      return;
    }
  }

  // SKIP button (during intro)
  if (phase !== "interactive") {
    if (
      mouseX >= skipBtn.x && mouseX <= skipBtn.x + skipBtn.w &&
      mouseY >= skipBtn.y && mouseY <= skipBtn.y + skipBtn.h
    ) {
      skipToInteractive();
      return;
    }
  }

  // REPLAY button
  if (phase === "interactive") {
    if (
      mouseX >= replayBtn.x && mouseX <= replayBtn.x + replayBtn.w &&
      mouseY >= replayBtn.y && mouseY <= replayBtn.y + replayBtn.h
    ) {
      restartAnimation();
      return;
    }
  }

  // NEW POSITIONS button
  if (phase === "interactive") {
    if (
      mouseX >= newPosBtn.x && mouseX <= newPosBtn.x + newPosBtn.w &&
      mouseY >= newPosBtn.y && mouseY <= newPosBtn.y + newPosBtn.h
    ) {
      randomizePositions();
      return;
    }
  }

  // Drag characters (interactive only)
  if (phase !== "interactive") return;

  var eonPx = gridToPixelX(eonX), eonPy = gridToPixelY(eonY);
  var ripPx = gridToPixelX(rippaX), ripPy = gridToPixelY(rippaY);

  if (dist(mouseX, mouseY, eonPx, eonPy) <= personHitRadius) {
    dragTarget = "eon"; isDragging = true; return;
  }
  if (dist(mouseX, mouseY, ripPx, ripPy) <= personHitRadius) {
    dragTarget = "rippa"; isDragging = true;
  }
}

function mouseDragged() {
  if (phase !== "interactive") return;
  if (!isDragging || !dragTarget) return;

  var gx = Math.round(pixelToGridX(mouseX));
  var gy = Math.round(pixelToGridY(mouseY));
  gx = constrain(gx, gridMin + 1, gridMax - 1);
  gy = constrain(gy, gridMin + 1, gridMax - 1);

  if (dragTarget === "eon") {
    eonX = gx; eonY = gy;
  } else {
    rippaX = gx; rippaY = gy;
  }
}

function mouseReleased() {
  isDragging = false;
  dragTarget = null;
}
