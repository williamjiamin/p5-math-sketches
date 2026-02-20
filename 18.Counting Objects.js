/* jshint esversion: 6 */
// ============================================================
// 18. Counting Objects — Interactive Counting Visualization
// ============================================================
// Kids add objects one at a time, grouped in rows of 10.
// Milestones at every 10 trigger a celebration and Rippa message.

const ORIG_W = 800;
const ORIG_H = 600;

var count = 0;
var objects = [];
var particles = [];
var rippaMsg = "";
var rippaMsgTimer = 0;
var shakeT = 0;

var COL_BG, COL_CARD, COL_BORDER, COL_TEXT, COL_MUTED, COL_ACCENT;
var OBJ_COLORS = [];

var addBtn = { x: 0, y: 0, w: 110, h: 42 };
var resetBtn = { x: 0, y: 0, w: 110, h: 42 };

var GRID_LEFT = 60;
var GRID_TOP = 100;
var CELL = 36;
var COLS = 10;

var MESSAGES = [
  "Great counting!", "You're a star!", "Keep going!",
  "Awesome job!", "Way to go!", "Fantastic!", "Super!", "Amazing!"
];

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial");
  COL_BG = color(245, 247, 252);
  COL_CARD = color(255);
  COL_BORDER = color(215, 220, 235);
  COL_TEXT = color(40, 40, 60);
  COL_MUTED = color(130, 135, 150);
  COL_ACCENT = color(66, 133, 244);
  OBJ_COLORS = [
    color(66, 133, 244), color(234, 67, 53), color(52, 168, 83),
    color(251, 188, 4), color(171, 71, 188), color(255, 112, 67)
  ];
  layoutUI();
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  layoutUI();
}

function layoutUI() {
  var cx = width / 2;
  addBtn.x = cx - 120;
  addBtn.y = height - 55;
  resetBtn.x = cx + 10;
  resetBtn.y = height - 55;
  GRID_LEFT = max(20, (width - COLS * CELL) / 2);
  GRID_TOP = 100;
}

function draw() {
  background(COL_BG);
  drawTitle();
  drawGrid();
  drawObjects();
  drawCounter();
  drawGroupHighlights();
  drawButtons();
  drawRippaMessage();
  updateParticles();
  drawParticles();
}

function drawTitle() {
  fill(COL_TEXT);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(22);
  textStyle(BOLD);
  text("Counting Objects", width / 2, 36);
  textStyle(NORMAL);
  textSize(13);
  fill(COL_MUTED);
  text("Add objects and count them! Objects group by 10s.", width / 2, 60);
}

function drawGrid() {
  var maxRows = 10;
  stroke(230, 232, 240);
  strokeWeight(1);
  noFill();
  for (var r = 0; r < maxRows; r++) {
    for (var c = 0; c < COLS; c++) {
      var x = GRID_LEFT + c * CELL;
      var y = GRID_TOP + r * CELL;
      rect(x, y, CELL, CELL, 4);
    }
  }
}

function drawGroupHighlights() {
  var fullRows = floor(count / 10);
  for (var r = 0; r < fullRows; r++) {
    var x = GRID_LEFT - 2;
    var y = GRID_TOP + r * CELL - 2;
    noFill();
    stroke(52, 168, 83, 140);
    strokeWeight(2.5);
    rect(x, y, COLS * CELL + 4, CELL + 4, 6);
  }
}

function drawObjects() {
  for (var i = 0; i < objects.length; i++) {
    var obj = objects[i];
    obj.scale = lerp(obj.scale, 1, 0.15);
    var bounce = obj.scale;
    var col = floor(i % COLS);
    var row = floor(i / COLS);
    var cx = GRID_LEFT + col * CELL + CELL / 2;
    var cy = GRID_TOP + row * CELL + CELL / 2;
    var r = CELL * 0.35 * bounce;

    push();
    translate(cx, cy);
    scale(bounce);
    noStroke();
    fill(obj.col);
    drawStar(0, 0, r * 0.5, r, 5);
    fill(255, 255, 255, 80);
    ellipse(-r * 0.15, -r * 0.2, r * 0.4, r * 0.3);
    pop();
  }
}

function drawStar(x, y, r1, r2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle / 2.0;
  beginShape();
  for (var a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
    var sx = x + cos(a) * r2;
    var sy = y + sin(a) * r2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * r1;
    sy = y + sin(a + halfAngle) * r1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function drawCounter() {
  var cx = width / 2;
  var cy = GRID_TOP + 10 * CELL + 24;
  if (cy > height - 90) cy = height - 90;
  fill(COL_CARD);
  stroke(COL_BORDER);
  strokeWeight(1);
  rect(cx - 90, cy - 18, 180, 36, 18);
  noStroke();
  fill(COL_TEXT);
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  text("Count: " + count, cx, cy);
  textStyle(NORMAL);
}

function drawButtons() {
  drawButton(addBtn, "➕ Add", count >= 100 ? color(180) : COL_ACCENT, 255);
  drawButton(resetBtn, "🔄 Reset", color(234, 67, 53), 255);
}

function drawButton(btn, label, bg, fg) {
  fill(bg);
  noStroke();
  rect(btn.x, btn.y, btn.w, btn.h, 21);
  fill(fg);
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  textStyle(NORMAL);
}

function drawRippaMessage() {
  if (rippaMsgTimer <= 0) return;
  rippaMsgTimer -= deltaTime / 1000;
  var alpha = min(1, rippaMsgTimer / 0.5) * 255;
  var bx = width / 2;
  var by = 78;

  fill(255, 255, 255, alpha * 0.9);
  stroke(66, 133, 244, alpha * 0.5);
  strokeWeight(1.5);
  rect(bx - 120, by - 16, 240, 32, 16);
  noStroke();
  fill(66, 133, 244, alpha);
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text("🎉 Rippa: " + rippaMsg, bx, by);
  textStyle(NORMAL);
}

function addObject() {
  if (count >= 100) return;
  count++;
  objects.push({
    col: OBJ_COLORS[(count - 1) % OBJ_COLORS.length],
    scale: 0.2
  });
  if (count % 10 === 0) {
    rippaMsg = MESSAGES[floor(random(MESSAGES.length))];
    rippaMsgTimer = 2.5;
    spawnParticles(width / 2, GRID_TOP + floor((count - 1) / COLS) * CELL + CELL / 2, 20);
  }
}

function resetAll() {
  count = 0;
  objects = [];
  particles = [];
  rippaMsg = "";
  rippaMsgTimer = 0;
}

function spawnParticles(px, py, n) {
  for (var i = 0; i < n; i++) {
    particles.push({
      x: px, y: py,
      vx: random(-3, 3), vy: random(-5, -1),
      life: 1, col: OBJ_COLORS[floor(random(OBJ_COLORS.length))]
    });
  }
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
    fill(red(p.col), green(p.col), blue(p.col), p.life * 255);
    ellipse(p.x, p.y, 6 * p.life);
  }
}

function insideBtn(btn) {
  return mouseX >= btn.x && mouseX <= btn.x + btn.w &&
         mouseY >= btn.y && mouseY <= btn.y + btn.h;
}

function mousePressed() {
  if (insideBtn(addBtn)) addObject();
  if (insideBtn(resetBtn)) resetAll();
}
