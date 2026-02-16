/* jshint esversion: 8 */
// ============================================================
// "Find Rippa!" – Coordinate Grid Practice Game
// ============================================================
// How to play:
//   1. (Optional) Watch the animated intro to learn about coordinates
//   2. Rippa hides at a secret position on the grid
//   3. You're shown the target coordinate (x, y)
//   4. Use +/- buttons (or arrow keys) to set Eon's destination
//   5. Click FIND! – Eon walks: (0,0) → (x,0) → (x,y)
//   6. Colorful ruler-bars show the distance from each axis
//   7. Found Rippa? HOORAY! Wrong spot? Try again!

// ==============================
// Config
// ==============================
const ORIG_W = 900, ORIG_H = 740;
var gridMin = -10;
var gridMax = 10;
var gridSize = gridMax - gridMin;
var profileRadius = 26;

// ==============================
// State
// ==============================
var initialized = false;
var canvasW = 900, canvasH = 740;

// Grid layout (set in updateLayout)
var originX, originY, cellPx;
var gridLeft, gridRight, gridTop, gridBottom;
var panelTop; // y where game panel begins

// ------ Phase Machine ------
// Intro phases: xaxis_positive → xaxis_negative → y_axis
//               → grid_appear → shake → bounce
// Game phases:  game_idle → game_move_x → game_move_y
//               → game_celebrate / game_wrong
var phase = "xaxis_positive";
var phaseStart = 0;
var phaseAnimDone = false;

var PHASE_DUR = {
  xaxis_positive: 1000,
  xaxis_negative: 1000,
  y_axis: 1000,
  grid_appear: 1200,
  shake: 1800,
  bounce: 1200,
  game_move_x: 1200,
  game_move_y: 1200,
  game_celebrate: 5000,
  game_wrong: 2500
};

// Intro state
var shakeIntensity = 0;
var eonXStart = 3, rippaXStart = 7;
var eonX = -4, eonY = 3;
var rippaX = 5, rippaY = -2;

// ------ Game State ------
var rippaHideX = 0, rippaHideY = 0;
var inputX = 0, inputY = 0;
var eonDispX = 0, eonDispY = 0;
var score = 0, streak = 0, bestStreak = 0;
var rippaFound = false;
var showHint = false;
var scorePop = 0, streakPop = 0;

// Distance bar progress (0-1)
var xBarProg = 0, yBarProg = 0;

// Celebration particles
var particles = [];

// ==============================
// Buttons & UI
// ==============================
var nextBtn     = { x:0, y:0, w:160, h:44 };
var skipBtn     = { x:0, y:0, w:160, h:36 };
var findBtn     = { x:0, y:0, w:150, h:52 };
var newGameBtn  = { x:0, y:0, w:170, h:42 };
var tryAgainBtn = { x:0, y:0, w:170, h:42 };
var replayBtn   = { x:0, y:0, w:140, h:34 };

var xMinusBtn = { x:0, y:0, w:42, h:42 };
var xPlusBtn  = { x:0, y:0, w:42, h:42 };
var yMinusBtn = { x:0, y:0, w:42, h:42 };
var yPlusBtn  = { x:0, y:0, w:42, h:42 };

// ==============================
// Images
// ==============================
var imgKid, imgMe;
// ASSET_FALLBACKS_START
var ASSET_ME_DATA_FALLBACK = "data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAkGgAwAEAAAAAQAAAkIAAAAA/8AAEQgCQgJBAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQ";
var ASSET_KID_DATA_FALLBACK = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgoKCgsLCggKCggICgoKCAgICAgICAgKCggKCAgICAgICAgICAgICA0ICAoICAgICgoKCAgLDQoIDQgICggBAwQEBgUGCgYGCg8NCw0QDQ8PEA8PDQ0PDw8NDw0PDQ4PDQ0NDw0NDw8NDQ0PDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDf/AABEI";
// ASSET_FALLBACKS_END

// ==============================
// Easing Functions
// ==============================
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}
function easeOutBounce(t) {
  if (t < 1 / 2.75) { return 7.5625 * t * t; }
  else if (t < 2 / 2.75) { t -= 1.5 / 2.75; return 7.5625 * t * t + 0.75; }
  else if (t < 2.5 / 2.75) { t -= 2.25 / 2.75; return 7.5625 * t * t + 0.9375; }
  else { t -= 2.625 / 2.75; return 7.5625 * t * t + 0.984375; }
}
function easeOutBack(t) {
  var s = 1.70158;
  t = t - 1;
  return t * t * ((s + 1) * t + s) + 1;
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
  try { base = new URL("./", window.location.href).href; } catch (e) { /* ignore */ }

  imgMe = await loadImage(meData || (base + "assets/me.png"));
  imgKid = await loadImage(kidData || (base + "assets/kid.png"));

  randomizeIntroPositions();
  phaseStart = millis();
  initialized = true;
}

// ==============================
// Layout
// ==============================
function updateLayout() {
  canvasW = width;
  canvasH = height;
  var padLeft = 80, padRight = 80, padTop = 55, padBot = 120;
  var areaW = canvasW - padLeft - padRight;
  var areaH = canvasH - padTop - padBot;
  cellPx = Math.min(areaW / gridSize, areaH / gridSize);

  originX = padLeft + areaW / 2;
  originY = padTop + areaH / 2;
  gridLeft   = originX + gridMin * cellPx;
  gridRight  = originX + gridMax * cellPx;
  gridTop    = originY + gridMin * cellPx;
  gridBottom = originY + gridMax * cellPx;

  panelTop = gridBottom + 8;

  // Intro buttons
  nextBtn.x = canvasW / 2 - nextBtn.w / 2;
  nextBtn.y = canvasH - nextBtn.h - 10;
  skipBtn.x = canvasW - skipBtn.w - 16;
  skipBtn.y = canvasH - skipBtn.h - 10;

  // Game input row – properly spaced
  // Layout: "X:" [-] [val] [+]  gap  "Y:" [-] [val] [+]  gap  [FIND!]
  // Each group: label(22) + minus(42) + gap(6) + display(60) + gap(6) + plus(42) = 178
  // Total: 178 + 50 + 178 + 40 + 150 = 596px → start at (900-596)/2 = 152
  var inputRowY = panelTop + 48;
  var cx = canvasW / 2;

  // X group, Y group, FIND button – proportional to canvas width (originally 900)
  var r = canvasW / 900;
  xMinusBtn.x = Math.round(174 * r); xMinusBtn.y = inputRowY - 21;
  xPlusBtn.x  = Math.round(288 * r); xPlusBtn.y  = inputRowY - 21;
  yMinusBtn.x = Math.round(402 * r); yMinusBtn.y = inputRowY - 21;
  yPlusBtn.x  = Math.round(516 * r); yPlusBtn.y  = inputRowY - 21;
  findBtn.x   = Math.round(600 * r); findBtn.y   = inputRowY - 26;

  // New Game / Try Again buttons
  newGameBtn.x = cx - newGameBtn.w / 2;
  newGameBtn.y = panelTop + 85;
  tryAgainBtn.x = cx - tryAgainBtn.w / 2;
  tryAgainBtn.y = panelTop + 85;

  // Replay intro button (small, top-right corner)
  replayBtn.x = canvasW - replayBtn.w - 10;
  replayBtn.y = 6;
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  updateLayout();
}

// ==============================
// Coordinate Helpers
// ==============================
function gridToPixelX(gx) { return originX + gx * cellPx; }
function gridToPixelY(gy) { return originY - gy * cellPx; }
function pixelToGridX(px) { return (px - originX) / cellPx; }
function pixelToGridY(py) { return -(py - originY) / cellPx; }

// ==============================
// Phase Helpers
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

function skipToGame() {
  startNewRound();
}

// ==============================
// Main Draw Loop
// ==============================
function draw() {
  if (!initialized) {
    if (typeof createCanvas === "function") createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
    if (typeof textFont === "function") textFont("Arial");
    if (typeof textAlign === "function") textAlign(CENTER, CENTER);
    updateLayout();
    randomizeIntroPositions();
    phaseStart = millis();
    initialized = true;
  } else {
    updateLayout();
  }

  background(250, 252, 255);
  var rawT = phaseProgress();
  var t = easeInOut(constrain(rawT, 0, 1));
  if (rawT >= 1 && !phaseAnimDone) phaseAnimDone = true;

  // ---- INTRO PHASES ----
  if (phase === "xaxis_positive") {
    drawIntroTitle("Step 1: Rippa and Eon are on the number line!");
    drawXAxisPositive(t);
    drawCharsOnXAxis(1);
    if (phaseAnimDone) drawNextButton();
    drawSkipButton();
  }
  else if (phase === "xaxis_negative") {
    drawIntroTitle("Step 2: The number line extends to negative numbers!");
    drawXAxisFull(t);
    drawCharsOnXAxis(1);
    if (phaseAnimDone) drawNextButton();
    drawSkipButton();
  }
  else if (phase === "y_axis") {
    drawIntroTitle("Step 3: A new axis appears -- the y-axis!");
    drawXAxisFull(1);
    drawVerticalLineAnim(t);
    drawCharsOnXAxis(1);
    if (phaseAnimDone) drawNextButton();
    drawSkipButton();
  }
  else if (phase === "grid_appear") {
    drawIntroTitle("Step 4: The coordinate grid is forming!");
    drawXAxisFull(1);
    drawVerticalLineAnim(1);
    drawGridLinesAnim(t);
    drawAxisLabelsAnim(t);
    drawCharsOnXAxis(1);
    if (phaseAnimDone) drawNextButton();
    drawSkipButton();
  }
  else if (phase === "shake") {
    drawIntroTitle("Step 5: Getting ready to explore 2D!");
    drawFullGrid();
    shakeIntensity = rawT * rawT * 8;
    drawCharsOnXAxisShake(shakeIntensity);
    noStroke(); fill(180, 60, 60); textSize(16); textStyle(BOLD);
    text("Getting ready to jump into the coordinate plane!", canvasW / 2, canvasH - 50);
    textStyle(NORMAL);
    if (rawT >= 1) goToPhase("bounce");
  }
  else if (phase === "bounce") {
    drawIntroTitle("Jumping into the coordinate plane!");
    drawFullGrid();
    drawCharsBounce(easeOutBounce(constrain(rawT, 0, 1)));
    if (rawT >= 1) startNewRound();
  }

  // ---- GAME PHASES ----
  else if (phase === "game_idle") {
    drawGameTitle();
    drawFullGrid();
    drawHiddenRippaMarker();
    drawPreviewTarget();
    // Eon at origin with idle bob
    var bobY = sin(millis() * 0.003) * 2;
    drawCharacterAtPixel(gridToPixelX(0), gridToPixelY(0) + bobY,
      imgKid, "Eon", color(100, 50, 180), 1, 0, 0);
    drawGamePanel(false);
    drawReplayIntroBtn();
    drawScoreDisplay();
  }
  else if (phase === "game_move_x") {
    drawGameTitle();
    drawFullGrid();
    drawHiddenRippaMarker();
    var mx = easeInOut(constrain(rawT, 0, 1));
    eonDispX = lerp(0, inputX, mx);
    eonDispY = 0;
    drawDistanceBarX(mx);
    drawTrailDots(0, 0, inputX, 0, mx, true);
    drawCharacterAtPixel(gridToPixelX(eonDispX), gridToPixelY(0),
      imgKid, "Eon", color(100, 50, 180), 1, nf(eonDispX, 0, 0) === "0" ? 0 : Math.round(eonDispX), 0);
    drawGamePanel(true);
    drawScoreDisplay();
    if (rawT >= 1) {
      eonDispX = inputX;
      goToPhase("game_move_y");
      PHASE_DUR.game_move_y = Math.max(500, Math.abs(inputY) * 180);
    }
  }
  else if (phase === "game_move_y") {
    drawGameTitle();
    drawFullGrid();
    drawHiddenRippaMarker();
    var my = easeInOut(constrain(rawT, 0, 1));
    eonDispX = inputX;
    eonDispY = lerp(0, inputY, my);
    drawDistanceBarX(1);
    drawDistanceBarY(my);
    drawTrailDots(inputX, 0, inputX, inputY, my, false);
    drawCharacterAtPixel(gridToPixelX(inputX), gridToPixelY(eonDispY),
      imgKid, "Eon", color(100, 50, 180), 1, inputX, Math.round(eonDispY));
    drawGamePanel(true);
    drawScoreDisplay();
    if (rawT >= 1) {
      eonDispY = inputY;
      checkAnswer();
    }
  }
  else if (phase === "game_celebrate") {
    drawGameTitle();
    drawFullGrid();
    drawDistanceBarX(1);
    drawDistanceBarY(1);
    var ct = constrain(rawT, 0, 1);
    // Rippa pop-in
    var popT = constrain(ct / 0.25, 0, 1);
    var popS = easeOutBack(popT);
    // Offset characters so they don't overlap (fixed px, not cell-relative)
    var offPx = profileRadius + 14;
    drawExpandingRings(gridToPixelX(rippaHideX), gridToPixelY(rippaHideY), ct);
    // Rippa appears on the right with coordinate label
    drawCharacterAtPixel(gridToPixelX(rippaHideX) + offPx, gridToPixelY(rippaHideY),
      imgMe, "Rippa", color(40, 100, 180), popS, rippaHideX, rippaHideY);
    // Eon on the left, bouncing with joy – no coordinate label (pass null)
    var joyBounce = sin(millis() * 0.01) * 6 * (1 - ct * 0.5);
    drawCharacterAtPixel(gridToPixelX(inputX) - offPx, gridToPixelY(inputY) + joyBounce,
      imgKid, "Eon", color(100, 50, 180), 1, null, null);
    updateAndDrawParticles();
    drawHoorayText(ct);
    drawStreakMessage(ct);
    // Show new game button after a moment
    if (ct > 0.35) drawNewGameButton();
    drawScoreDisplay();
    drawReplayIntroBtn();
  }
  else if (phase === "game_wrong") {
    drawGameTitle();
    drawFullGrid();
    drawDistanceBarX(1);
    drawDistanceBarY(1);
    drawHiddenRippaMarker();
    var wt = constrain(rawT, 0, 1);
    // Eon at wrong position, shaking head
    var headShake = sin(millis() * 0.02) * 4 * (1 - wt);
    drawCharacterAtPixel(gridToPixelX(inputX) + headShake, gridToPixelY(inputY),
      imgKid, "Eon", color(100, 50, 180), 1, inputX, inputY);
    drawWrongFeedback(wt);
    drawHintArrow(wt);
    if (wt > 0.25) drawTryAgainButton();
    drawScoreDisplay();
    drawReplayIntroBtn();
  }

  // Decay pop effects
  scorePop *= 0.93;
  streakPop *= 0.93;
}

// ==============================
// Title Drawing
// ==============================
function drawIntroTitle(stepText) {
  noStroke(); fill(30, 50, 80); textSize(22); textStyle(BOLD);
  text("Coordinate Grid -- Explore with Rippa & Eon", canvasW / 2, 24);
  textStyle(NORMAL);
  fill(100); textSize(13);
  text(stepText, canvasW / 2, 50);
}

function drawGameTitle() {
  noStroke(); fill(30, 50, 80); textSize(22); textStyle(BOLD);
  text("Find Rippa! -- Coordinate Practice", canvasW / 2, 24);
  textStyle(NORMAL);
  fill(90); textSize(13);
  if (phase === "game_idle") {
    text("Set the X and Y coordinates, then click FIND!", canvasW / 2, 50);
  } else if (phase === "game_move_x") {
    text("Moving along the x-axis...", canvasW / 2, 50);
  } else if (phase === "game_move_y") {
    text("Now moving along the y-axis...", canvasW / 2, 50);
  } else if (phase === "game_celebrate") {
    // handled by drawHoorayText
  } else if (phase === "game_wrong") {
    text("Hmm, Rippa isn't there...", canvasW / 2, 50);
  }
}

// ==============================
// Game Panel (Bottom UI)
// ==============================
function drawGamePanel(disabled) {
  // Panel background
  fill(240, 244, 252);
  stroke(190, 205, 225);
  strokeWeight(2);
  rect(15, panelTop, canvasW - 30, canvasH - panelTop - 6, 14);

  // Clue text: "Find Rippa at (x, y)!" with colored coordinates
  var clueY = panelTop + 20;
  noStroke(); textSize(17); textStyle(BOLD);
  fill(50, 60, 80);
  var fullLabel = "Find Rippa at (" + rippaHideX + ", " + rippaHideY + ") !";
  textAlign(LEFT, CENTER);
  var startX = canvasW / 2 - textWidth(fullLabel) / 2;
  text("Find Rippa at (", startX, clueY);
  var cx = startX + textWidth("Find Rippa at (");
  fill(230, 100, 30); // x in orange
  var xStr = "" + rippaHideX;
  text(xStr, cx, clueY);
  cx += textWidth(xStr);
  fill(50, 60, 80);
  text(", ", cx, clueY);
  cx += textWidth(", ");
  fill(40, 120, 220); // y in blue
  var yStr = "" + rippaHideY;
  text(yStr, cx, clueY);
  cx += textWidth(yStr);
  fill(50, 60, 80);
  text(") !", cx, clueY);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);

  // Input row – positions come from updateLayout
  var inputRowY = panelTop + 48;
  var alphaM = disabled ? 120 : 255;

  // X label
  noStroke(); fill(230, 100, 30, alphaM); textSize(15); textStyle(BOLD);
  text("X:", xMinusBtn.x - 18, inputRowY);

  // X minus button
  drawRoundBtn(xMinusBtn, "-", color(230, 100, 30), disabled);
  // X value display (centered between minus and plus)
  var xDispCX = xMinusBtn.x + xMinusBtn.w + 6 + 30; // = 174+42+6+30 = 252
  fill(255, 255, 255, disabled ? 180 : 255);
  stroke(230, 100, 30, alphaM); strokeWeight(2);
  rect(xDispCX - 30, inputRowY - 19, 60, 38, 10);
  noStroke(); fill(230, 100, 30, alphaM); textSize(20); textStyle(BOLD);
  text(inputX, xDispCX, inputRowY);
  // X plus button
  drawRoundBtn(xPlusBtn, "+", color(230, 100, 30), disabled);

  // Y label
  noStroke(); fill(40, 120, 220, alphaM); textSize(15); textStyle(BOLD);
  text("Y:", yMinusBtn.x - 18, inputRowY);

  // Y minus button
  drawRoundBtn(yMinusBtn, "-", color(40, 120, 220), disabled);
  // Y value display (centered between minus and plus)
  var yDispCX = yMinusBtn.x + yMinusBtn.w + 6 + 30; // = 402+42+6+30 = 480
  fill(255, 255, 255, disabled ? 180 : 255);
  stroke(40, 120, 220, alphaM); strokeWeight(2);
  rect(yDispCX - 30, inputRowY - 19, 60, 38, 10);
  noStroke(); fill(40, 120, 220, alphaM); textSize(20); textStyle(BOLD);
  text(inputY, yDispCX, inputRowY);
  // Y plus button
  drawRoundBtn(yPlusBtn, "+", color(40, 120, 220), disabled);

  textStyle(NORMAL);

  // FIND button
  if (!disabled) drawFindButton();
}

function drawRoundBtn(btn, label, col, disabled) {
  var hover = !disabled &&
    mouseX >= btn.x && mouseX <= btn.x + btn.w &&
    mouseY >= btn.y && mouseY <= btn.y + btn.h;
  var a = disabled ? 80 : 255;

  stroke(red(col), green(col), blue(col), a);
  strokeWeight(2);
  if (hover) {
    fill(red(col), green(col), blue(col), 40);
  } else {
    fill(255, 255, 255, disabled ? 160 : 240);
  }
  rect(btn.x, btn.y, btn.w, btn.h, 12);
  noStroke();
  fill(red(col), green(col), blue(col), a);
  textSize(22); textStyle(BOLD);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  textStyle(NORMAL);
}

// ==============================
// FIND Button
// ==============================
function drawFindButton() {
  var hover =
    mouseX >= findBtn.x && mouseX <= findBtn.x + findBtn.w &&
    mouseY >= findBtn.y && mouseY <= findBtn.y + findBtn.h;
  var pulse = sin(millis() * 0.005) * 0.15 + 0.85;

  // Glow
  if (!hover) {
    noStroke();
    fill(40, 200, 80, 30 * pulse);
    rect(findBtn.x - 4, findBtn.y - 4, findBtn.w + 8, findBtn.h + 8, 18);
  }

  stroke(30, 160, 60);
  strokeWeight(hover ? 3 : 2);
  fill(hover ? color(50, 210, 90) : lerpColor(color(40, 190, 80), color(60, 220, 100), pulse));
  rect(findBtn.x, findBtn.y, findBtn.w, findBtn.h, 14);
  noStroke(); fill(255); textSize(20); textStyle(BOLD);
  text("FIND!", findBtn.x + findBtn.w / 2, findBtn.y + findBtn.h / 2);
  textStyle(NORMAL);
}

// ==============================
// Distance Bar X (horizontal ruler)
// ==============================
function drawDistanceBarX(prog) {
  if (inputX === 0) return;
  var barH = 10;
  var fromPx = gridToPixelX(0);
  var toPx = gridToPixelX(inputX * prog);
  var y = originY;

  // Bar background (full extent, faint)
  noStroke();
  fill(255, 140, 60, 30);
  var fullTo = gridToPixelX(inputX);
  rectMode(CORNERS);
  rect(Math.min(fromPx, fullTo), y - barH / 2, Math.max(fromPx, fullTo), y + barH / 2, 5);
  rectMode(CORNER);

  // Filled bar
  fill(255, 130, 50, 180);
  noStroke();
  rectMode(CORNERS);
  rect(Math.min(fromPx, toPx), y - barH / 2, Math.max(fromPx, toPx), y + barH / 2, 5);
  rectMode(CORNER);

  // Segment dividers (white lines at each integer)
  stroke(255, 255, 255, 200);
  strokeWeight(1);
  var minI = Math.min(0, inputX);
  var maxI = Math.max(0, inputX);
  var curEnd = Math.round(inputX * prog);
  for (var i = minI; i <= maxI; i++) {
    if (i === 0) continue;
    var reached = (inputX > 0) ? (i <= curEnd) : (i >= curEnd);
    if (!reached) continue;
    var px = gridToPixelX(i);
    line(px, y - barH / 2, px, y + barH / 2);
  }

  // Label showing |x| distance
  if (prog > 0.3) {
    var labelX = (fromPx + toPx) / 2;
    var labelAlpha = constrain((prog - 0.3) / 0.3, 0, 1) * 255;
    noStroke();
    // Background pill
    fill(255, 130, 50, labelAlpha * 0.85);
    var labelStr = "|x| = " + Math.abs(inputX);
    var tw = textWidth(labelStr) + 16;
    rectMode(CENTER);
    textSize(12); textStyle(BOLD);
    tw = textWidth(labelStr) + 16;
    rect(labelX, y + barH / 2 + 16, tw, 20, 10);
    fill(255, 255, 255, labelAlpha);
    text(labelStr, labelX, y + barH / 2 + 16);
    textStyle(NORMAL);
    rectMode(CORNER);
  }
}

// ==============================
// Distance Bar Y (vertical ruler)
// ==============================
function drawDistanceBarY(prog) {
  if (inputY === 0) return;
  var barW = 10;
  var fromPy = gridToPixelY(0);
  var toPy = gridToPixelY(inputY * prog);
  var x = gridToPixelX(inputX);

  // Bar background
  noStroke();
  fill(60, 160, 255, 30);
  var fullTo = gridToPixelY(inputY);
  rectMode(CORNERS);
  rect(x - barW / 2, Math.min(fromPy, fullTo), x + barW / 2, Math.max(fromPy, fullTo), 5);
  rectMode(CORNER);

  // Filled bar
  fill(50, 150, 250, 180);
  noStroke();
  rectMode(CORNERS);
  rect(x - barW / 2, Math.min(fromPy, toPy), x + barW / 2, Math.max(fromPy, toPy), 5);
  rectMode(CORNER);

  // Segment dividers
  stroke(255, 255, 255, 200);
  strokeWeight(1);
  var minJ = Math.min(0, inputY);
  var maxJ = Math.max(0, inputY);
  var curEndY = Math.round(inputY * prog);
  for (var j = minJ; j <= maxJ; j++) {
    if (j === 0) continue;
    var reached = (inputY > 0) ? (j <= curEndY) : (j >= curEndY);
    if (!reached) continue;
    var py = gridToPixelY(j);
    line(x - barW / 2, py, x + barW / 2, py);
  }

  // Label
  if (prog > 0.3) {
    var labelY = (fromPy + toPy) / 2;
    var labelAlpha = constrain((prog - 0.3) / 0.3, 0, 1) * 255;
    noStroke();
    fill(50, 150, 250, labelAlpha * 0.85);
    textSize(12); textStyle(BOLD);
    var lStr = "|y| = " + Math.abs(inputY);
    var tw2 = textWidth(lStr) + 16;
    rectMode(CENTER);
    rect(x - barW / 2 - tw2 / 2 - 6, labelY, tw2, 20, 10);
    fill(255, 255, 255, labelAlpha);
    text(lStr, x - barW / 2 - tw2 / 2 - 6, labelY);
    textStyle(NORMAL);
    rectMode(CORNER);
  }
}

// ==============================
// Trail Dots
// ==============================
function drawTrailDots(fx, fy, tx, ty, prog, isHoriz) {
  noStroke();
  if (isHoriz) {
    var dir = tx > fx ? 1 : -1;
    var cur = Math.round(lerp(fx, tx, prog));
    for (var i = fx; (dir > 0 ? i <= cur : i >= cur); i += dir) {
      var alpha = constrain(200 - Math.abs(i - cur) * 40, 40, 200);
      fill(180, 120, 255, alpha);
      ellipse(gridToPixelX(i), gridToPixelY(fy), 7, 7);
    }
  } else {
    var dirY = ty > fy ? 1 : -1;
    var curY = Math.round(lerp(fy, ty, prog));
    for (var j = fy; (dirY > 0 ? j <= curY : j >= curY); j += dirY) {
      var alpha2 = constrain(200 - Math.abs(j - curY) * 40, 40, 200);
      fill(120, 180, 255, alpha2);
      ellipse(gridToPixelX(fx), gridToPixelY(j), 7, 7);
    }
  }
}

// ==============================
// Hidden Rippa Marker (pulsing ?)
// ==============================
function drawHiddenRippaMarker() {
  var px = gridToPixelX(rippaHideX);
  var py = gridToPixelY(rippaHideY);
  var t = millis() * 0.003;
  var pulse = sin(t) * 0.2 + 0.8;
  var bob = sin(t * 1.3) * 3;

  // Glow circle
  noStroke();
  fill(160, 80, 220, 25 * pulse);
  ellipse(px, py + bob, 70 * pulse, 70 * pulse);
  fill(160, 80, 220, 40 * pulse);
  ellipse(px, py + bob, 50 * pulse, 50 * pulse);

  // Circle background
  fill(120, 60, 180, 200);
  stroke(255, 255, 255, 180);
  strokeWeight(2);
  ellipse(px, py + bob, 36, 36);

  // Question mark
  noStroke(); fill(255);
  textSize(22); textStyle(BOLD);
  text("?", px, py + bob);
  textStyle(NORMAL);

  // Sparkle dots orbiting
  for (var i = 0; i < 4; i++) {
    var angle = t * 2 + i * HALF_PI;
    var r = 28 + sin(t * 3 + i) * 4;
    var sx = px + cos(angle) * r;
    var sy = py + bob + sin(angle) * r;
    fill(255, 200, 100, 180);
    noStroke();
    ellipse(sx, sy, 4, 4);
  }
}

// ==============================
// Preview Target (translucent crosshair at input position)
// ==============================
function drawPreviewTarget() {
  if (inputX === 0 && inputY === 0) return;
  var px = gridToPixelX(inputX);
  var py = gridToPixelY(inputY);

  // Crosshair lines (very faint)
  stroke(100, 200, 100, 60);
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(px, gridTop, px, gridBottom);
  line(gridLeft, py, gridRight, py);
  drawingContext.setLineDash([]);

  // Target dot
  noStroke();
  fill(80, 200, 100, 120);
  ellipse(px, py, 14, 14);
  fill(255, 255, 255, 180);
  ellipse(px, py, 6, 6);

  // Label
  fill(80, 180, 80, 180);
  textSize(11); textStyle(BOLD);
  text("(" + inputX + ", " + inputY + ")", px, py - 18);
  textStyle(NORMAL);
}

// ==============================
// Celebration Effects
// ==============================
function createConfetti(cx, cy) {
  particles = [];
  for (var i = 0; i < 80; i++) {
    particles.push({
      x: cx, y: cy,
      vx: random(-9, 9),
      vy: random(-16, -4),
      size: random(4, 11),
      cr: random(100, 255),
      cg: random(100, 255),
      cb: random(100, 255),
      rot: random(TWO_PI),
      rotSpd: random(-0.15, 0.15),
      grav: random(0.2, 0.45),
      alpha: 255,
      shape: random() > 0.5 ? 0 : 1 // 0=circle, 1=rect
    });
  }
}

function updateAndDrawParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.grav;
    p.rot += p.rotSpd;
    p.alpha -= 2.5;
    if (p.alpha <= 0) { particles.splice(i, 1); continue; }

    push();
    translate(p.x, p.y);
    rotate(p.rot);
    noStroke();
    fill(p.cr, p.cg, p.cb, p.alpha);
    if (p.shape === 0) {
      ellipse(0, 0, p.size, p.size);
    } else {
      rectMode(CENTER);
      rect(0, 0, p.size, p.size * 0.6);
      rectMode(CORNER);
    }
    pop();
  }
}

function drawExpandingRings(cx, cy, t) {
  noFill();
  for (var i = 0; i < 3; i++) {
    var ringT = constrain((t - i * 0.12) / 0.5, 0, 1);
    if (ringT <= 0) continue;
    var radius = ringT * 90;
    var alpha = (1 - ringT) * 180;
    stroke(255, 210, 60, alpha);
    strokeWeight(3 - i * 0.8);
    ellipse(cx, cy, radius * 2, radius * 2);
  }
}

function drawHoorayText(t) {
  if (t < 0.08) return;
  var textT = constrain((t - 0.08) / 0.25, 0, 1);
  var s = easeOutBack(textT);

  var letters = "HOORAY!";
  var rainbow = [
    [255, 60, 60], [255, 160, 30], [255, 220, 40],
    [60, 200, 80], [60, 160, 255], [140, 80, 220], [255, 100, 180]
  ];

  push();
  translate(canvasW / 2, 50);
  scale(s);
  textSize(38); textStyle(BOLD);
  for (var i = 0; i < letters.length; i++) {
    var ci = i % rainbow.length;
    var wobble = sin(millis() * 0.008 + i * 0.8) * 4;
    fill(rainbow[ci][0], rainbow[ci][1], rainbow[ci][2]);
    text(letters[i], (i - 3) * 32, wobble);
  }
  textStyle(NORMAL);
  pop();
}

function drawStreakMessage(t) {
  if (t < 0.3) return;
  var fadeIn = constrain((t - 0.3) / 0.2, 0, 1);
  var msg = "";
  if (streak === 1) msg = "You found Rippa!";
  else if (streak === 2) msg = "Great job! 2 in a row!";
  else if (streak === 3) msg = "Amazing! 3 in a row!";
  else if (streak === 4) msg = "Incredible! Keep going!";
  else if (streak >= 5) msg = "UNSTOPPABLE! " + streak + " streak!";

  if (msg === "") return;
  noStroke();
  fill(60, 60, 100, fadeIn * 230);
  textSize(16); textStyle(BOLD);
  text(msg, canvasW / 2, panelTop + 20);
  textStyle(NORMAL);
}

// ==============================
// Wrong Answer Feedback
// ==============================
function drawWrongFeedback(t) {
  if (t < 0.05) return;
  var fadeT = constrain(t / 0.3, 0, 1);
  var px = gridToPixelX(inputX);
  var py = gridToPixelY(inputY);

  // Red X mark
  var xSize = 18 * easeOutBack(fadeT);
  stroke(220, 60, 60, 200 * fadeT);
  strokeWeight(4);
  line(px - xSize, py - xSize, px + xSize, py + xSize);
  line(px + xSize, py - xSize, px - xSize, py + xSize);

  // "Oops!" text
  noStroke();
  fill(220, 60, 60, fadeT * 240);
  textSize(20); textStyle(BOLD);
  text("Oops! Not here!", canvasW / 2, panelTop + 18);
  textStyle(NORMAL);
}

function drawHintArrow(t) {
  if (t < 0.5) return;
  var fadeT = constrain((t - 0.5) / 0.3, 0, 1);

  // Compute direction hint text
  var hints = [];
  if (inputX < rippaHideX) hints.push("X higher");
  else if (inputX > rippaHideX) hints.push("X lower");
  if (inputY < rippaHideY) hints.push("Y higher");
  else if (inputY > rippaHideY) hints.push("Y lower");

  if (hints.length === 0) return;

  noStroke();
  fill(100, 60, 160, fadeT * 200);
  textSize(14); textStyle(BOLD);
  text("Hint: Try " + hints.join(" and "), canvasW / 2, panelTop + 40);
  textStyle(NORMAL);

  // Subtle arrow from wrong pos towards correct pos
  var fromPx = gridToPixelX(inputX);
  var fromPy = gridToPixelY(inputY);
  var toPx = gridToPixelX(rippaHideX);
  var toPy = gridToPixelY(rippaHideY);

  var dx = toPx - fromPx;
  var dy = toPy - fromPy;
  var d = Math.sqrt(dx * dx + dy * dy);
  if (d < 1) return;

  // Normalize and draw short arrow
  var nx = dx / d * 40;
  var ny = dy / d * 40;
  stroke(160, 100, 220, fadeT * 150);
  strokeWeight(2.5);
  drawingContext.setLineDash([6, 4]);
  line(fromPx + nx * 0.5, fromPy + ny * 0.5, fromPx + nx * 1.5, fromPy + ny * 1.5);
  drawingContext.setLineDash([]);

  // Arrow head
  var tipX = fromPx + nx * 1.5;
  var tipY = fromPy + ny * 1.5;
  push();
  translate(tipX, tipY);
  var ang = atan2(ny, nx);
  rotate(ang);
  noStroke();
  fill(160, 100, 220, fadeT * 150);
  triangle(0, 0, -10, -5, -10, 5);
  pop();
}

// ==============================
// Score Display
// ==============================
function drawScoreDisplay() {
  var isGamePhase = phase.startsWith("game_");
  if (!isGamePhase) return;

  var sx = 25, sy = panelTop + 78;
  noStroke();

  // Score
  fill(40, 80, 140);
  textSize(14); textStyle(BOLD);
  push();
  translate(sx + 50, sy);
  var ss = 1 + scorePop * 0.4;
  scale(ss);
  text("Score: " + score, 0, 0);
  pop();

  // Streak
  fill(220, 110, 30);
  push();
  translate(sx + 170, sy);
  var st = 1 + streakPop * 0.4;
  scale(st);
  var streakStr = "Streak: " + streak;
  if (streak >= 3) streakStr += " !!";
  text(streakStr, 0, 0);
  pop();

  // Best streak
  fill(120, 120, 140);
  textSize(12);
  text("Best: " + bestStreak, sx + 280, sy);
  textStyle(NORMAL);
}

// ==============================
// Full Static Grid
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
// Intro: Positive x-axis
// ==============================
function drawXAxisPositive(t) {
  var rightEnd = originX + gridMax * cellPx * t;
  stroke(40); strokeWeight(3);
  line(originX, originY, rightEnd, originY);
  if (t > 0.85) {
    drawArrow(rightEnd, originY, 1, 0, easeOut((t - 0.85) / 0.15));
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

// ==============================
// Intro: Full x-axis
// ==============================
function drawXAxisFull(t) {
  stroke(40); strokeWeight(3);
  line(originX, originY, gridRight, originY);
  drawArrow(gridRight, originY, 1, 0, 1);
  var leftEnd = originX - (originX - gridLeft) * t;
  line(leftEnd, originY, originX, originY);
  if (t > 0.85) drawArrow(leftEnd, originY, -1, 0, easeOut((t - 0.85) / 0.15));
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

// ==============================
// Intro: Y-axis animation
// ==============================
function drawVerticalLineAnim(t) {
  var halfLen = (gridBottom - gridTop) / 2 * t;
  stroke(40); strokeWeight(3);
  line(originX, originY - halfLen, originX, originY + halfLen);
  if (t > 0.85) {
    var a = easeOut((t - 0.85) / 0.15);
    drawArrow(originX, originY - halfLen, 0, -1, a);
    drawArrow(originX, originY + halfLen, 0, 1, a);
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

// ==============================
// Intro: Grid lines
// ==============================
function drawGridLinesAnim(t) {
  stroke(180, 200, 220, Math.round(t * 80));
  strokeWeight(1);
  for (var i = gridMin; i <= gridMax; i++) {
    if (i === 0) continue;
    line(gridToPixelX(i), gridTop, gridToPixelX(i), gridBottom);
    line(gridLeft, gridToPixelY(i), gridRight, gridToPixelY(i));
  }
}

function drawAxisLabelsAnim(t) {
  noStroke(); fill(200, 60, 60, Math.round(t * 255));
  textSize(12); textStyle(BOLD);
  text("(0,0)", originX + 18, originY + 18);
  textStyle(NORMAL);
}

// ==============================
// Intro: Characters on x-axis
// ==============================
function drawCharsOnXAxis(scl) {
  drawCharacterAtPixel(gridToPixelX(eonXStart), originY, imgKid, "Eon", color(100, 50, 180), scl, eonXStart, 0);
  drawCharacterAtPixel(gridToPixelX(rippaXStart), originY, imgMe, "Rippa", color(40, 100, 180), scl, rippaXStart, 0);
}

function drawCharsOnXAxisShake(intensity) {
  var ePx = gridToPixelX(eonXStart) + random(-intensity, intensity);
  var ePy = originY + random(-intensity, intensity);
  var rPx = gridToPixelX(rippaXStart) + random(-intensity, intensity);
  var rPy = originY + random(-intensity, intensity);
  drawCharacterAtPixel(ePx, ePy, imgKid, "Eon", color(100, 50, 180), 1, "?", "?");
  drawCharacterAtPixel(rPx, rPy, imgMe, "Rippa", color(40, 100, 180), 1, "?", "?");
}

// ==============================
// Intro: Bounce animation
// ==============================
function drawCharsBounce(t) {
  var eCurX = lerp(eonXStart, eonX, t);
  var eCurY = lerp(0, eonY, t);
  var rCurX = lerp(rippaXStart, rippaX, t);
  var rCurY = lerp(0, rippaY, t);
  var arc = sin(t * PI) * 3;
  eCurY += arc; rCurY += arc;

  if (t > 0.5) {
    var ga = (t - 0.5) * 2;
    drawGuidelines(eonX, eonY, color(140, 80, 200, ga * 100));
    drawGuidelines(rippaX, rippaY, color(50, 120, 200, ga * 100));
  }
  if (t < 0.8) {
    noStroke();
    fill(100, 50, 180, 40); ellipse(gridToPixelX(eCurX), gridToPixelY(eCurY) + 10, 20, 8);
    fill(40, 100, 180, 40); ellipse(gridToPixelX(rCurX), gridToPixelY(rCurY) + 10, 20, 8);
  }
  drawCharacterAtPixel(gridToPixelX(eCurX), gridToPixelY(eCurY), imgKid, "Eon", color(100, 50, 180), 1,
    Math.round(eCurX), Math.round(eCurY - arc));
  drawCharacterAtPixel(gridToPixelX(rCurX), gridToPixelY(rCurY), imgMe, "Rippa", color(40, 100, 180), 1,
    Math.round(rCurX), Math.round(rCurY - arc));
}

// ==============================
// Draw Character at Pixel Position
// ==============================
function drawCharacterAtPixel(px, py, img, label, col, scl, coordX, coordY) {
  var r = profileRadius * scl;
  if (r < 1) return;

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

  // Coordinate label below (skip if coordX is null)
  if (coordX !== null && coordX !== undefined) {
    var coordStr = "(" + coordX + ", " + coordY + ")";
    textSize(13); textStyle(BOLD);
    var tw = textWidth(coordStr) + 16;
    var th = 22;
    var lx = px, ly = py + r + 18;
    fill(255, 255, 255, 220);
    stroke(col); strokeWeight(2);
    rectMode(CENTER);
    rect(lx, ly, tw, th, 10);
    rectMode(CORNER);
    noStroke(); fill(col);
    text(coordStr, lx, ly);
    textStyle(NORMAL);
  }
}

// ==============================
// Guidelines (dashed lines to axes)
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
// Arrow Helper
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
// Buttons: NEXT, SKIP, NEW GAME, TRY AGAIN, REPLAY
// ==============================
function drawNextButton() {
  var hover = mouseX >= nextBtn.x && mouseX <= nextBtn.x + nextBtn.w &&
              mouseY >= nextBtn.y && mouseY <= nextBtn.y + nextBtn.h;
  var pulse = sin(millis() * 0.005) * 0.3 + 0.7;
  stroke(40, 120, 220); strokeWeight(hover ? 3 : 2);
  fill(hover ? color(60, 140, 240) : lerpColor(color(70, 130, 220), color(100, 160, 255), pulse));
  rect(nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h, 12);
  noStroke(); fill(255); textSize(16); textStyle(BOLD);
  text("NEXT  \u25B6", nextBtn.x + nextBtn.w / 2, nextBtn.y + nextBtn.h / 2);
  textStyle(NORMAL);
}

function drawSkipButton() {
  var hover = mouseX >= skipBtn.x && mouseX <= skipBtn.x + skipBtn.w &&
              mouseY >= skipBtn.y && mouseY <= skipBtn.y + skipBtn.h;
  stroke(120); strokeWeight(1.5);
  fill(hover ? color(210, 225, 250) : color(235, 240, 250));
  rect(skipBtn.x, skipBtn.y, skipBtn.w, skipBtn.h, 8);
  noStroke(); fill(80, 80, 130); textSize(13); textStyle(BOLD);
  text("SKIP TO GAME \u25B6\u25B6", skipBtn.x + skipBtn.w / 2, skipBtn.y + skipBtn.h / 2);
  textStyle(NORMAL);
}

function drawNewGameButton() {
  var hover = mouseX >= newGameBtn.x && mouseX <= newGameBtn.x + newGameBtn.w &&
              mouseY >= newGameBtn.y && mouseY <= newGameBtn.y + newGameBtn.h;
  var pulse = sin(millis() * 0.004) * 0.2 + 0.8;
  stroke(40, 120, 200); strokeWeight(hover ? 3 : 2);
  fill(hover ? color(60, 150, 240) : lerpColor(color(70, 140, 230), color(100, 170, 255), pulse));
  rect(newGameBtn.x, newGameBtn.y, newGameBtn.w, newGameBtn.h, 12);
  noStroke(); fill(255); textSize(16); textStyle(BOLD);
  text("NEW ROUND", newGameBtn.x + newGameBtn.w / 2, newGameBtn.y + newGameBtn.h / 2);
  textStyle(NORMAL);
}

function drawTryAgainButton() {
  var hover = mouseX >= tryAgainBtn.x && mouseX <= tryAgainBtn.x + tryAgainBtn.w &&
              mouseY >= tryAgainBtn.y && mouseY <= tryAgainBtn.y + tryAgainBtn.h;
  var pulse = sin(millis() * 0.005) * 0.2 + 0.8;
  stroke(220, 120, 30); strokeWeight(hover ? 3 : 2);
  fill(hover ? color(255, 170, 60) : lerpColor(color(255, 160, 50), color(255, 190, 80), pulse));
  rect(tryAgainBtn.x, tryAgainBtn.y, tryAgainBtn.w, tryAgainBtn.h, 12);
  noStroke(); fill(255); textSize(16); textStyle(BOLD);
  text("TRY AGAIN", tryAgainBtn.x + tryAgainBtn.w / 2, tryAgainBtn.y + tryAgainBtn.h / 2);
  textStyle(NORMAL);
}

function drawReplayIntroBtn() {
  var hover = mouseX >= replayBtn.x && mouseX <= replayBtn.x + replayBtn.w &&
              mouseY >= replayBtn.y && mouseY <= replayBtn.y + replayBtn.h;
  stroke(140, 140, 160); strokeWeight(1);
  fill(hover ? color(220, 225, 235) : color(240, 242, 248));
  rect(replayBtn.x, replayBtn.y, replayBtn.w, replayBtn.h, 8);
  noStroke(); fill(100, 100, 130); textSize(11); textStyle(BOLD);
  text("WATCH INTRO", replayBtn.x + replayBtn.w / 2, replayBtn.y + replayBtn.h / 2);
  textStyle(NORMAL);
}

// ==============================
// Game Logic
// ==============================
function randomizeIntroPositions() {
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
  eonXStart = Math.max(1, Math.abs(eonX));
  rippaXStart = Math.max(1, Math.abs(rippaX));
  if (eonXStart === rippaXStart) rippaXStart = Math.min(9, rippaXStart + 2);
}

function startNewRound() {
  rippaHideX = floor(random(-8, 9));
  rippaHideY = floor(random(-8, 9));
  // Avoid origin
  while (rippaHideX === 0 && rippaHideY === 0) {
    rippaHideX = floor(random(-8, 9));
    rippaHideY = floor(random(-8, 9));
  }
  inputX = 0;
  inputY = 0;
  eonDispX = 0;
  eonDispY = 0;
  rippaFound = false;
  showHint = false;
  xBarProg = 0;
  yBarProg = 0;
  particles = [];
  goToPhase("game_idle");
}

function checkAnswer() {
  if (inputX === rippaHideX && inputY === rippaHideY) {
    // Correct!
    rippaFound = true;
    score++;
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    scorePop = 1;
    if (streak > 1) streakPop = 1;
    createConfetti(gridToPixelX(inputX), gridToPixelY(inputY));
    goToPhase("game_celebrate");
  } else {
    // Wrong
    streak = 0;
    goToPhase("game_wrong");
  }
}

function triggerFind() {
  if (phase !== "game_idle") return;
  eonDispX = 0;
  eonDispY = 0;
  PHASE_DUR.game_move_x = Math.max(500, Math.abs(inputX) * 180);
  goToPhase("game_move_x");
}

function restartIntro() {
  randomizeIntroPositions();
  goToPhase("xaxis_positive");
}

// ==============================
// Hit-test helper
// ==============================
function btnHit(btn) {
  return mouseX >= btn.x && mouseX <= btn.x + btn.w &&
         mouseY >= btn.y && mouseY <= btn.y + btn.h;
}

// ==============================
// Mouse Interaction
// ==============================
function mousePressed() {
  // --- Intro phases ---
  var introPhases = ["xaxis_positive", "xaxis_negative", "y_axis", "grid_appear"];
  if (introPhases.indexOf(phase) >= 0 && phaseAnimDone) {
    if (btnHit(nextBtn)) {
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

  // Skip button (during intro)
  if (!phase.startsWith("game_")) {
    if (btnHit(skipBtn)) { skipToGame(); return; }
  }

  // --- Game: idle ---
  if (phase === "game_idle") {
    if (btnHit(xMinusBtn)) { inputX = Math.max(gridMin + 1, inputX - 1); return; }
    if (btnHit(xPlusBtn))  { inputX = Math.min(gridMax - 1, inputX + 1); return; }
    if (btnHit(yMinusBtn)) { inputY = Math.max(gridMin + 1, inputY - 1); return; }
    if (btnHit(yPlusBtn))  { inputY = Math.min(gridMax - 1, inputY + 1); return; }
    if (btnHit(findBtn))   { triggerFind(); return; }
  }

  // --- Game: celebrate ---
  if (phase === "game_celebrate") {
    if (btnHit(newGameBtn)) { startNewRound(); return; }
  }

  // --- Game: wrong ---
  if (phase === "game_wrong") {
    if (btnHit(tryAgainBtn)) {
      // Reset to idle, keep same hiding position
      inputX = 0; inputY = 0;
      eonDispX = 0; eonDispY = 0;
      particles = [];
      goToPhase("game_idle");
      return;
    }
  }

  // Replay intro button (during any game phase)
  if (phase.startsWith("game_")) {
    if (btnHit(replayBtn)) { restartIntro(); return; }
  }
}

// ==============================
// Keyboard Support
// ==============================
function keyPressed() {
  if (phase === "game_idle") {
    if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') {
      inputX = Math.max(gridMin + 1, inputX - 1);
    } else if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') {
      inputX = Math.min(gridMax - 1, inputX + 1);
    } else if (keyCode === UP_ARROW || key === 'w' || key === 'W') {
      inputY = Math.min(gridMax - 1, inputY + 1);
    } else if (keyCode === DOWN_ARROW || key === 's' || key === 'S') {
      inputY = Math.max(gridMin + 1, inputY - 1);
    } else if (keyCode === ENTER || keyCode === 32) {
      triggerFind();
    }
  }
  else if (phase === "game_celebrate") {
    if (keyCode === ENTER || keyCode === 32) {
      startNewRound();
    }
  }
  else if (phase === "game_wrong") {
    if (keyCode === ENTER || keyCode === 32) {
      inputX = 0; inputY = 0;
      eonDispX = 0; eonDispY = 0;
      particles = [];
      goToPhase("game_idle");
    }
  }
}
