/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var expr = "3 + 4 × 2", steps = [], stepIdx = 0, animating = false;
var PROBLEMS = [
  { expr: "3 + 4 × 2", steps: ["3 + 4 × 2", "3 + 8", "11"] },
  { expr: "8 ÷ 2 + 3", steps: ["8 ÷ 2 + 3", "4 + 3", "7"] },
  { expr: "(2 + 3) × 4", steps: ["(2 + 3) × 4", "5 × 4", "20"] },
  { expr: "6 + 2 × (5 − 1)", steps: ["6 + 2 × (5 − 1)", "6 + 2 × 4", "6 + 8", "14"] },
  { expr: "3² + 4", steps: ["3² + 4", "9 + 4", "13"] },
  { expr: "(8 − 2)² ÷ 3", steps: ["(8 − 2)² ÷ 3", "6² ÷ 3", "36 ÷ 3", "12"] },
  { expr: "5 × 3 − 2 + 8 ÷ 4", steps: ["5 × 3 − 2 + 8 ÷ 4", "15 − 2 + 2", "13 + 2", "15"] }
];
var probIdx = 0;
var RULES = ["P: Parentheses first", "E: Exponents", "M/D: Multiply & Divide (left→right)", "A/S: Add & Subtract (left→right)"];

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
  loadProblem();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function loadProblem() {
  var p = PROBLEMS[probIdx];
  expr = p.expr; steps = p.steps; stepIdx = 0;
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Order of Operations (PEMDAS)", width / 2, 25); textStyle(NORMAL);
  var ruleY = 55;
  for (var i = 0; i < RULES.length; i++) {
    fill(i < 2 ? color(220, 100, 40) : color(80, 60, 200)); textSize(13); textStyle(BOLD);
    text(RULES[i], width / 2, ruleY + i * 20); textStyle(NORMAL);
  }
  fill(30, 50, 120); textSize(16); textStyle(BOLD);
  text("Problem: " + expr, width / 2, 150); textStyle(NORMAL);
  var stepY = 190;
  for (var s = 0; s <= stepIdx && s < steps.length; s++) {
    var isLast = s === steps.length - 1;
    fill(isLast ? color(40, 160, 80) : color(80, 60, 200));
    textSize(isLast ? 28 : 20); textStyle(BOLD);
    text((s === 0 ? "" : "→ ") + steps[s], width / 2, stepY + s * 40);
    textStyle(NORMAL);
  }
  if (stepIdx >= steps.length - 1) {
    fill(40, 160, 80); textSize(14); textStyle(BOLD);
    text("= " + steps[steps.length - 1], width / 2, stepY + steps.length * 40);
    textStyle(NORMAL);
  }
  var btnY = height - 70;
  drawBtn(width / 2 - 120, btnY, 100, 34, stepIdx < steps.length - 1 ? "Next Step" : "Done!");
  drawBtn(width / 2 + 20, btnY, 100, 34, "New Problem");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(13); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 70;
  if (hitB(width / 2 - 120, btnY, 100, 34) && stepIdx < steps.length - 1) stepIdx++;
  if (hitB(width / 2 + 20, btnY, 100, 34)) { probIdx = (probIdx + 1) % PROBLEMS.length; loadProblem(); }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
