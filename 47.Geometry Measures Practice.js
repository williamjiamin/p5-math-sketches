/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score = 0, total = 0, prob = {}, userAns = 0, answered = false, feedback = "";

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
  newProblem();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() {
  answered = false; feedback = ""; userAns = 0;
  var types = ["rect_area", "rect_perim", "tri_area", "circle_area", "box_vol"];
  var t = types[Math.floor(Math.random() * types.length)];
  var a = Math.floor(Math.random() * 8) + 2, b = Math.floor(Math.random() * 8) + 2, c = Math.floor(Math.random() * 6) + 2;
  if (t === "rect_area") prob = { type: t, a: a, b: b, q: "Area of rectangle " + a + "×" + b + "?", ans: a * b, formula: a + " × " + b, unit: "sq" };
  else if (t === "rect_perim") prob = { type: t, a: a, b: b, q: "Perimeter of rectangle " + a + "×" + b + "?", ans: 2 * (a + b), formula: "2×(" + a + "+" + b + ")", unit: "" };
  else if (t === "tri_area") prob = { type: t, a: a, b: b, q: "Area of triangle base=" + a + " height=" + b + "?", ans: Math.round(a * b / 2 * 10) / 10, formula: "½×" + a + "×" + b, unit: "sq" };
  else if (t === "circle_area") { var r = Math.floor(Math.random() * 5) + 2; prob = { type: t, a: r, q: "Area of circle r=" + r + "? (round to nearest)", ans: Math.round(Math.PI * r * r), formula: "π×" + r + "²", unit: "sq" }; }
  else prob = { type: t, a: a, b: b, c: c, q: "Volume of box " + a + "×" + b + "×" + c + "?", ans: a * b * c, formula: a + "×" + b + "×" + c, unit: "cu" };
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Geometry Measures Practice", width / 2, 25); textStyle(NORMAL);
  fill(30, 50, 120); textSize(18); text(prob.q, width / 2, 70);
  drawShape();
  var inputY = 320;
  fill(240); stroke(180); strokeWeight(1); rect(width / 2 - 40, inputY, 80, 40, 8);
  noStroke(); fill(30); textSize(22); textStyle(BOLD); text(userAns, width / 2, inputY + 20); textStyle(NORMAL);
  drawBtn(width / 2 - 100, inputY + 3, 40, 34, "-1"); drawBtn(width / 2 - 145, inputY + 3, 40, 34, "-10");
  drawBtn(width / 2 + 60, inputY + 3, 40, 34, "+1"); drawBtn(width / 2 + 105, inputY + 3, 40, 34, "+10");
  drawBtn(width / 2 - 40, inputY + 50, 80, 34, "Check");
  if (answered) {
    fill(feedback === "Correct!" ? color(40, 160, 80) : color(220, 60, 60));
    textSize(18); textStyle(BOLD); text(feedback, width / 2, inputY + 100); textStyle(NORMAL);
    fill(100); textSize(13); text("Formula: " + prob.formula + " = " + prob.ans, width / 2, inputY + 125);
    drawBtn(width / 2 - 40, inputY + 140, 80, 32, "Next");
  }
  fill(80); textSize(14); text("Score: " + score + "/" + total, width / 2, height - 25);
}
function drawShape() {
  var cx = width / 2, cy = 200;
  stroke(80, 60, 200); strokeWeight(2);
  if (prob.type === "rect_area" || prob.type === "rect_perim") {
    var w = prob.a * 15, h = prob.b * 15;
    fill(80, 60, 200, 40); rect(cx - w / 2, cy - h / 2, w, h, 4);
    noStroke(); fill(80); textSize(12);
    text(prob.a, cx, cy + h / 2 + 12); text(prob.b, cx - w / 2 - 15, cy);
  } else if (prob.type === "tri_area") {
    var bw = prob.a * 15, bh = prob.b * 15;
    fill(80, 60, 200, 40);
    triangle(cx - bw / 2, cy + bh / 2, cx + bw / 2, cy + bh / 2, cx, cy - bh / 2);
    noStroke(); fill(80); textSize(12);
    text("b=" + prob.a, cx, cy + bh / 2 + 14); text("h=" + prob.b, cx + bw / 2 + 20, cy);
  } else if (prob.type === "circle_area") {
    var r = prob.a * 15;
    fill(80, 60, 200, 40); ellipse(cx, cy, r * 2, r * 2);
    noStroke(); fill(80); textSize(12); text("r=" + prob.a, cx + r + 10, cy);
  } else {
    fill(80, 60, 200, 40); noStroke();
    rect(cx - 30, cy - 25, 60, 50, 4);
    fill(80); textSize(11);
    text(prob.a + "×" + prob.b + "×" + prob.c, cx, cy);
  }
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(13); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var inputY = 320;
  if (!answered) {
    if (hitB(width / 2 - 100, inputY + 3, 40, 34)) userAns = Math.max(0, userAns - 1);
    if (hitB(width / 2 - 145, inputY + 3, 40, 34)) userAns = Math.max(0, userAns - 10);
    if (hitB(width / 2 + 60, inputY + 3, 40, 34)) userAns++;
    if (hitB(width / 2 + 105, inputY + 3, 40, 34)) userAns += 10;
    if (hitB(width / 2 - 40, inputY + 50, 80, 34)) {
      answered = true; total++;
      if (userAns === prob.ans) { score++; feedback = "Correct!"; } else feedback = "Answer: " + prob.ans;
    }
  }
  if (answered && hitB(width / 2 - 40, inputY + 140, 80, 32)) newProblem();
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
