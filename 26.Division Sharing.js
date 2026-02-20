/* jshint esversion: 6 */
// ============================================================
// 26. Division: Fair Sharing — Interactive Teaching Tool
// ============================================================
// Animates distributing objects into groups round-robin style.
// Handles remainders. +/- buttons for total and group count.

const ORIG_W = 800;
const ORIG_H = 600;

var totalObjects = 12;
var numGroups = 3;
var objectPositions = [];
var groupPositions = [];
var groupCounts = [];
var animating = false;
var animStep = 0;
var animObj = null;
var animProgress = 0;
var animDone = false;
var distributed = [];
var remainder = 0;
var perGroup = 0;
var particles = [];

var COL_BG, COL_CARD, COL_ACCENT, COL_TEXT, COL_MUTED;
var COL_COOKIE, COL_PLATE, COL_BTN, COL_BTN_HOVER, COL_GO;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial");
  initColors();
  resetState();
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
}

function initColors() {
  COL_BG = color(245, 247, 252);
  COL_CARD = color(255);
  COL_ACCENT = color(66, 133, 244);
  COL_TEXT = color(40, 40, 60);
  COL_MUTED = color(130, 135, 150);
  COL_COOKIE = color(210, 160, 80);
  COL_PLATE = color(220, 225, 235);
  COL_BTN = color(100, 120, 200);
  COL_BTN_HOVER = color(80, 100, 180);
  COL_GO = color(76, 175, 80);
}

function resetState() {
  animating = false;
  animStep = 0;
  animObj = null;
  animProgress = 0;
  animDone = false;
  distributed = [];
  particles = [];
  groupCounts = [];
  for (var i = 0; i < numGroups; i++) {
    groupCounts.push(0);
    distributed.push([]);
  }
  perGroup = Math.floor(totalObjects / numGroups);
  remainder = totalObjects % numGroups;
  layoutObjects();
  layoutGroups();
}

function layoutObjects() {
  objectPositions = [];
  var cols = Math.min(10, totalObjects);
  var rows = Math.ceil(totalObjects / cols);
  var startX = width * 0.1;
  var endX = width * 0.9;
  var cellW = (endX - startX) / cols;
  var startY = 100;
  var cellH = 36;
  for (var i = 0; i < totalObjects; i++) {
    var col = i % cols;
    var row = Math.floor(i / cols);
    objectPositions.push({
      x: startX + col * cellW + cellW / 2,
      y: startY + row * cellH + cellH / 2,
      visible: true,
      assigned: -1
    });
  }
}

function layoutGroups() {
  groupPositions = [];
  var margin = 60;
  var availW = width - margin * 2;
  var spacing = availW / numGroups;
  for (var i = 0; i < numGroups; i++) {
    groupPositions.push({
      x: margin + spacing * i + spacing / 2,
      y: height - 130
    });
  }
}

function draw() {
  background(COL_BG);
  drawTitle();
  drawControls();
  drawObjects();
  drawGroups();
  updateAnimation();
  drawResult();
  updateParticles();
  drawParticles();
}

function drawTitle() {
  fill(COL_TEXT);
  noStroke();
  textSize(22);
  textAlign(CENTER, TOP);
  text("Division: Fair Sharing", width / 2, 14);
  textSize(13);
  fill(COL_MUTED);
  text("Distribute " + totalObjects + " objects into " + numGroups + " groups", width / 2, 42);
}

function drawControls() {
  var bw = 32, bh = 28, gap = 6;
  var y1 = 62;

  // Total objects controls
  var lx = width * 0.15;
  drawPMButton(lx, y1, bw, bh, "-", "totalMinus");
  fill(COL_TEXT);
  noStroke();
  textSize(15);
  textAlign(CENTER, CENTER);
  text("Objects: " + totalObjects, lx + bw + 50, y1 + bh / 2);
  drawPMButton(lx + bw + 100, y1, bw, bh, "+", "totalPlus");

  // Group controls
  var rx = width * 0.6;
  drawPMButton(rx, y1, bw, bh, "-", "groupMinus");
  fill(COL_TEXT);
  noStroke();
  textSize(15);
  textAlign(CENTER, CENTER);
  text("Groups: " + numGroups, rx + bw + 50, y1 + bh / 2);
  drawPMButton(rx + bw + 100, y1, bw, bh, "+", "groupPlus");

  // Share button
  var sx = width - 100, sy = y1 - 2, sw = 80, sh = 32;
  var hover = mouseX > sx && mouseX < sx + sw && mouseY > sy && mouseY < sy + sh;
  fill(animating ? COL_MUTED : (hover ? color(56, 155, 60) : COL_GO));
  noStroke();
  rect(sx, sy, sw, sh, 8);
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(animDone ? "Reset" : "Share!", sx + sw / 2, sy + sh / 2);
}

function drawPMButton(x, y, w, h, label, id) {
  var hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hover ? COL_BTN_HOVER : COL_BTN);
  noStroke();
  rect(x, y, w, h, 6);
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
}

function drawObjects() {
  for (var i = 0; i < objectPositions.length; i++) {
    var obj = objectPositions[i];
    if (!obj.visible) continue;
    if (animObj && animObj.idx === i) continue;
    fill(COL_COOKIE);
    stroke(180, 130, 50);
    strokeWeight(1.5);
    ellipse(obj.x, obj.y, 26, 26);
    fill(160, 110, 40);
    noStroke();
    ellipse(obj.x - 4, obj.y - 2, 4, 4);
    ellipse(obj.x + 3, obj.y + 3, 4, 4);
    ellipse(obj.x + 1, obj.y - 5, 3, 3);
  }

  if (animObj) {
    fill(COL_COOKIE);
    stroke(180, 130, 50);
    strokeWeight(1.5);
    ellipse(animObj.cx, animObj.cy, 28, 28);
    fill(160, 110, 40);
    noStroke();
    ellipse(animObj.cx - 4, animObj.cy - 2, 4, 4);
    ellipse(animObj.cx + 3, animObj.cy + 3, 4, 4);
  }
}

function drawGroups() {
  for (var i = 0; i < numGroups; i++) {
    var gp = groupPositions[i];
    var plateR = Math.min(60, (width - 120) / numGroups * 0.4);

    fill(COL_PLATE);
    stroke(190, 195, 210);
    strokeWeight(2);
    ellipse(gp.x, gp.y, plateR * 2, plateR * 1.2);

    // Draw distributed objects in group
    var items = distributed[i];
    for (var j = 0; j < items.length; j++) {
      var angle = (j / Math.max(items.length, 1)) * TWO_PI - HALF_PI;
      var r = Math.min(plateR * 0.5, 20);
      var ox = gp.x + cos(angle) * r;
      var oy = gp.y + sin(angle) * r * 0.6;
      fill(COL_COOKIE);
      noStroke();
      ellipse(ox, oy, 18, 18);
    }

    // Count label
    fill(COL_TEXT);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text(groupCounts[i], gp.x, gp.y + plateR * 0.75);

    textSize(11);
    fill(COL_MUTED);
    text("Group " + (i + 1), gp.x, gp.y + plateR * 0.75 + 18);
  }
}

function updateAnimation() {
  if (!animating || animDone) return;
  if (!animObj) {
    if (animStep >= totalObjects) {
      animDone = true;
      animating = false;
      spawnCelebration();
      return;
    }
    var targetGroup = animStep % numGroups;
    var obj = objectPositions[animStep];
    animObj = {
      idx: animStep,
      sx: obj.x, sy: obj.y,
      tx: groupPositions[targetGroup].x,
      ty: groupPositions[targetGroup].y,
      cx: obj.x, cy: obj.y,
      group: targetGroup
    };
    animProgress = 0;
  }

  animProgress += 0.04;
  if (animProgress >= 1) {
    animProgress = 1;
    objectPositions[animObj.idx].visible = false;
    groupCounts[animObj.group]++;
    distributed[animObj.group].push(animObj.idx);
    animObj = null;
    animStep++;
  } else {
    var t = easeInOutCubic(animProgress);
    animObj.cx = lerp(animObj.sx, animObj.tx, t);
    var arc = sin(animProgress * PI) * -80;
    animObj.cy = lerp(animObj.sy, animObj.ty, t) + arc;
  }
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function drawResult() {
  if (!animDone) return;
  var y = height - 35;
  fill(COL_CARD);
  noStroke();
  rect(width * 0.15, y - 22, width * 0.7, 44, 12);

  fill(COL_TEXT);
  textSize(20);
  textAlign(CENTER, CENTER);
  var resultStr = totalObjects + " ÷ " + numGroups + " = " + perGroup;
  if (remainder > 0) {
    resultStr += " remainder " + remainder;
  } else {
    resultStr += " per group";
  }
  text(resultStr, width / 2, y);
}

function spawnCelebration() {
  for (var i = 0; i < 40; i++) {
    particles.push({
      x: width / 2, y: height / 2,
      vx: random(-5, 5), vy: random(-8, -2),
      life: 1,
      c: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
}

function updateParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life -= 0.015;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  noStroke();
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    fill(red(p.c), green(p.c), blue(p.c), p.life * 255);
    ellipse(p.x, p.y, 8 * p.life, 8 * p.life);
  }
}

function mousePressed() {
  var bw = 32, bh = 28;
  var y1 = 62;

  // Total -
  var lx = width * 0.15;
  if (hitTest(lx, y1, bw, bh) && !animating) {
    totalObjects = Math.max(1, totalObjects - 1);
    resetState();
    return;
  }
  // Total +
  if (hitTest(lx + bw + 100, y1, bw, bh) && !animating) {
    totalObjects = Math.min(30, totalObjects + 1);
    resetState();
    return;
  }
  // Group -
  var rx = width * 0.6;
  if (hitTest(rx, y1, bw, bh) && !animating) {
    numGroups = Math.max(1, numGroups - 1);
    resetState();
    return;
  }
  // Group +
  if (hitTest(rx + bw + 100, y1, bw, bh) && !animating) {
    numGroups = Math.min(10, numGroups + 1);
    resetState();
    return;
  }
  // Share / Reset button
  var sx = width - 100, sy = y1 - 2, sw = 80, sh = 32;
  if (hitTest(sx, sy, sw, sh)) {
    if (animDone) {
      resetState();
    } else if (!animating) {
      animating = true;
    }
  }
}

function hitTest(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}
