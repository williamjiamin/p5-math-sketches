/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var probIdx = 0, step = 0;
var PROBS = [
  { eq: "x + 5 = 12", steps: ["x + 5 = 12", "x + 5 − 5 = 12 − 5", "x = 7"], ans: 7 },
  { eq: "2x = 14", steps: ["2x = 14", "2x ÷ 2 = 14 ÷ 2", "x = 7"], ans: 7 },
  { eq: "3x − 4 = 11", steps: ["3x − 4 = 11", "3x − 4 + 4 = 11 + 4", "3x = 15", "x = 5"], ans: 5 },
  { eq: "x/2 + 3 = 8", steps: ["x/2 + 3 = 8", "x/2 = 5", "x = 10"], ans: 10 },
  { eq: "4x + 2 = 18", steps: ["4x + 2 = 18", "4x = 16", "x = 4"], ans: 4 }
];
function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Solve Linear Equations", width / 2, 25); textStyle(NORMAL);
  var p = PROBS[probIdx];
  fill(30, 50, 120); textSize(18); text("Solve: " + p.eq, width / 2, 60);
  for (var i = 0; i <= step && i < p.steps.length; i++) {
    var isLast = i === p.steps.length - 1;
    fill(isLast ? color(40, 160, 80) : (i === 0 ? color(30, 50, 120) : color(80, 60, 200)));
    textSize(isLast ? 26 : 18); textStyle(BOLD);
    text(p.steps[i], width / 2, 110 + i * 45); textStyle(NORMAL);
    if (i > 0 && i <= step) {
      fill(220, 100, 40); textSize(11);
      if (p.steps[i].indexOf("−") > 0 && i === 1) text("(subtract from both sides)", width / 2, 110 + i * 45 + 18);
      else if (p.steps[i].indexOf("÷") > 0) text("(divide both sides)", width / 2, 110 + i * 45 + 18);
      else if (p.steps[i].indexOf("+") > 0 && i === 1) text("(add to both sides)", width / 2, 110 + i * 45 + 18);
    }
  }
  var btnY = height - 60;
  drawBtn(width / 2 - 120, btnY, 100, 34, step < p.steps.length - 1 ? "Next Step" : "Done!");
  drawBtn(width / 2 + 20, btnY, 100, 34, "New Problem");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(13); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 60;
  if (hitB(width / 2 - 120, btnY, 100, 34)) step = Math.min(step + 1, PROBS[probIdx].steps.length - 1);
  if (hitB(width / 2 + 20, btnY, 100, 34)) { probIdx = (probIdx + 1) % PROBS.length; step = 0; }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
