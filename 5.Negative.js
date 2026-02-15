// ==============================
// State & Configuration
// ==============================

// Variables for the dot position and dragging
let dotX = 400;            // Starting position (center of canvas)
let isDragging = false;
let snapToTick = false;   // Toggle between snap and smooth mode

// Axis settings
let axisY = 400;          // Y position of the axis
let axisStartX = 100;     // Left edge of axis
let axisEndX = 700;       // Right edge of axis
let minValue = -10;      // Minimum value on axis
let maxValue = 10;       // Maximum value on axis
let tickSpacing = 1;     // Space between main ticks
let subTickSpacing = 0.1; // Space between sub-ticks

// Animation variables
let animationParticles = [];
let sparkleRadius = 0;
let bounceOffset = 0;
let isAnimating = false;
let lastIntegerValue = null;


// ==============================
// p5 Lifecycle
// ==============================

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(240, 245, 250);

  drawAxis();

  updateDot();
  drawArrow();

  displayNumber();

  updateAnimations();
  drawAnimations();

  drawModeIndicator();
}


// ==============================
// Axis
// ==============================

function drawAxis() {
  stroke(50);
  strokeWeight(2);
  line(axisStartX, axisY, axisEndX, axisY);

  // Sub-ticks
  let numSubTicks = (maxValue - minValue) / subTickSpacing;
  for (let i = 0; i <= numSubTicks; i++) {
    let subTickValue = minValue + i * subTickSpacing;
    let subTickX = map(
      subTickValue,
      minValue,
      maxValue,
      axisStartX,
      axisEndX
    );

    if (abs(subTickValue % tickSpacing) > 0.001) {
      stroke(150);
      strokeWeight(1);
      line(subTickX, axisY - 5, subTickX, axisY + 5);
    }
  }

  // Main ticks + labels
  let numTicks = (maxValue - minValue) / tickSpacing + 1;
  for (let i = 0; i < numTicks; i++) {
    let tickValue = minValue + i * tickSpacing;
    let tickX = map(
      tickValue,
      minValue,
      maxValue,
      axisStartX,
      axisEndX
    );

    stroke(50);
    strokeWeight(2);
    line(tickX, axisY - 15, tickX, axisY + 15);

    fill(50);
    noStroke();
    textSize(14);
    text(tickValue, tickX, axisY + 35);
  }
}


// ==============================
// Dot Logic
// ==============================

function updateDot() {
  if (!isDragging) return;

  let newX = constrain(mouseX, axisStartX, axisEndX);

  if (snapToTick) {
    let value = map(newX, axisStartX, axisEndX, minValue, maxValue);
    let snappedValue = round(value / tickSpacing) * tickSpacing;
    dotX = map(snappedValue, minValue, maxValue, axisStartX, axisEndX);
  } else {
    dotX = newX;
  }

  checkIntegerLanding();
}

function checkIntegerLanding() {
  let currentValue = map(dotX, axisStartX, axisEndX, minValue, maxValue);
  let currentInteger = round(currentValue);

  if (
    abs(currentValue - currentInteger) < 0.01 &&
    currentInteger !== lastIntegerValue
  ) {
    triggerAnimation();
    lastIntegerValue = currentInteger;
  }
}


// ==============================
// Animations
// ==============================

function triggerAnimation() {
  isAnimating = true;
  sparkleRadius = 0;
  bounceOffset = 0;

  animationParticles = [];
  for (let i = 0; i < 20; i++) {
    animationParticles.push({
      x: dotX,
      y: axisY - 40,
      vx: random(-3, 3),
      vy: random(-5, -2),
      color: color(random(255), random(255), random(255)),
      size: random(5, 10),
      life: 30
    });
  }
}

function updateAnimations() {
  if (!isAnimating) return;

  // Sparkle ring
  sparkleRadius += 3;
  if (sparkleRadius > 80) sparkleRadius = 0;

  // Bounce
  bounceOffset = sin(frameCount * 0.3) * 10;
  if (frameCount % 60 >= 30) bounceOffset = 0;

  // Confetti
  for (let i = animationParticles.length - 1; i >= 0; i--) {
    let p = animationParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2;
    p.life--;

    if (p.life <= 0) {
      animationParticles.splice(i, 1);
    }
  }

  if (animationParticles.length === 0 && sparkleRadius === 0) {
    isAnimating = false;
    lastIntegerValue = null;
  }
}

function drawAnimations() {
  if (!isAnimating) return;

  // Sparkle ring
  if (sparkleRadius > 0) {
    push();
    translate(dotX, axisY - 40);

    let alpha = map(sparkleRadius, 0, 80, 255, 0);

    noFill();
    stroke(255, 200, 0, alpha);
    strokeWeight(3);
    circle(0, 0, sparkleRadius * 2);

    for (let i = 0; i < 8; i++) {
      let angle = (TWO_PI / 8) * i;
      let x1 = cos(angle) * sparkleRadius;
      let y1 = sin(angle) * sparkleRadius;
      let x2 = cos(angle) * (sparkleRadius + 10);
      let y2 = sin(angle) * (sparkleRadius + 10);

      stroke(255, 255, 0, alpha);
      strokeWeight(2);
      line(x1, y1, x2, y2);
    }

    pop();
  }

  // Confetti particles
  for (let p of animationParticles) {
    fill(p.color);
    noStroke();
    circle(p.x, p.y, p.size);
  }
}


// ==============================
// Arrow & Display
// ==============================

function drawArrow() {
  const tipY = axisY;
  const headH = 18;
  const headHalfW = 14;
  const shaftH = 55;
  const shaftW = 6;

  const topY = tipY - headH - shaftH;
  const shaftBottomY = tipY - headH;

  noStroke();
  fill(50, 150, 255);
  rectMode(CENTER);
  rect(dotX, (topY + shaftBottomY) / 2, shaftW, shaftH, 3);

  stroke(30, 100, 200);
  strokeWeight(2);
  fill(50, 150, 255);
  triangle(
    dotX, tipY,
    dotX - headHalfW, shaftBottomY,
    dotX + headHalfW, shaftBottomY
  );
}

function displayNumber() {
  let value = map(dotX, axisStartX, axisEndX, minValue, maxValue);
  const sign = value < 0 ? "-" : "";
  const absValue = abs(value);
  const integerPart = floor(absValue);
  const decimalDigits = (absValue - integerPart).toFixed(2).substring(2);

  textAlign(CENTER, CENTER);

  textSize(28);
  textStyle(BOLD);
  let integerText = sign + integerPart.toString();
  let integerWidth = textWidth(integerText);

  textSize(20);
  textStyle(NORMAL);
  let decimalText = "." + decimalDigits;
  let decimalWidth = textWidth(decimalText);

  let totalWidth = integerWidth + decimalWidth;
  let startX = dotX - totalWidth / 2;

  fill(30, 50, 100);
  noStroke();
  textSize(28);
  textStyle(BOLD);
  text(integerText, startX + integerWidth / 2, axisY - 120);

  fill(100, 120, 150);
  textSize(20);
  textStyle(NORMAL);
  text(
    decimalText,
    startX + integerWidth + decimalWidth / 2,
    axisY - 120
  );
}


// ==============================
// UI & Input
// ==============================

function drawModeIndicator() {
  fill(50);
  noStroke();
  textSize(16);
  textStyle(NORMAL);
  textAlign(LEFT);
  text("Mode: " + (snapToTick ? "SNAP TO TICK" : "SMOOTH"), 20, 30);
  text("(Press SPACE to toggle)", 20, 50);
}

function mousePressed() {
  const tipY = axisY;
  const headH = 18;
  const headHalfW = 14;
  const shaftH = 55;
  const shaftW = 6;

  const topY = tipY - headH - shaftH;
  const leftX = dotX - max(headHalfW, shaftW) - 6;
  const rightX = dotX + max(headHalfW, shaftW) + 6;
  const bottomY = tipY;

  if (
    mouseX >= leftX &&
    mouseX <= rightX &&
    mouseY >= topY &&
    mouseY <= bottomY
  ) {
    isDragging = true;
  }
}

function mouseReleased() {
  isDragging = false;
}

function keyPressed() {
  if (key === ' ') {
    snapToTick = !snapToTick;
  }
}
