/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score = 0, total = 0, num = 0, factors = [], userFactors = [], inputVal = 0;
var feedback = "", phase = "play";

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
  newProblem();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() {
  num = Math.floor(Math.random() * 48) + 2;
  factors = [];
  for (var i = 1; i <= num; i++) if (num % i === 0) factors.push(i);
  userFactors = []; inputVal = 1; feedback = ""; phase = "play";
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Factors Practice", width / 2, 25); textStyle(NORMAL);
  fill(30, 50, 120); textSize(16);
  text("Find ALL factors of:", width / 2, 60);
  fill(60, 40, 120); textSize(40); textStyle(BOLD);
  text(num, width / 2, 100); textStyle(NORMAL);
  fill(80); textSize(13);
  text("Your factors: " + (userFactors.length > 0 ? userFactors.sort(function(a,b){return a-b;}).join(", ") : "(none yet)"), width / 2, 150);
  text("Found " + userFactors.length + " of " + factors.length + " factors", width / 2, 170);
  var cy = 210;
  noStroke(); fill(80); textSize(14); text("Add factor:", width / 2, cy);
  drawBtn(width / 2 - 90, cy + 10, 40, 34, "-1");
  drawBtn(width / 2 - 45, cy + 10, 40, 34, "-5");
  fill(240); stroke(180); strokeWeight(1);
  rect(width / 2 - 25, cy + 10, 50, 34, 8);
  noStroke(); fill(30); textSize(18); textStyle(BOLD); text(inputVal, width / 2, cy + 27); textStyle(NORMAL);
  drawBtn(width / 2 + 30, cy + 10, 40, 34, "+1");
  drawBtn(width / 2 + 75, cy + 10, 40, 34, "+5");
  drawBtn(width / 2 - 50, cy + 55, 100, 36, "Add");
  drawBtn(width / 2 - 50, cy + 100, 100, 36, "Check All");
  if (feedback) {
    fill(feedback.indexOf("Correct") >= 0 ? color(40, 160, 80) : color(220, 60, 60));
    textSize(16); textStyle(BOLD); text(feedback, width / 2, cy + 150); textStyle(NORMAL);
  }
  if (phase === "done") {
    fill(100); textSize(13);
    text("All factors: " + factors.join(", "), width / 2, cy + 175);
    drawBtn(width / 2 - 50, cy + 195, 100, 34, "Next");
  }
  fill(80); textSize(13);
  text("Score: " + score + "/" + total, width / 2, height - 25);
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(hov ? 255 : 60); textSize(13); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var cy = 210;
  if (hitB(width / 2 - 90, cy + 10, 40, 34)) inputVal = Math.max(1, inputVal - 1);
  if (hitB(width / 2 - 45, cy + 10, 40, 34)) inputVal = Math.max(1, inputVal - 5);
  if (hitB(width / 2 + 30, cy + 10, 40, 34)) inputVal = Math.min(num, inputVal + 1);
  if (hitB(width / 2 + 75, cy + 10, 40, 34)) inputVal = Math.min(num, inputVal + 5);
  if (hitB(width / 2 - 50, cy + 55, 100, 36) && phase === "play") {
    if (num % inputVal === 0) {
      if (userFactors.indexOf(inputVal) < 0) { userFactors.push(inputVal); feedback = inputVal + " is a factor!"; }
      else feedback = inputVal + " already added";
    } else feedback = inputVal + " is NOT a factor of " + num;
  }
  if (hitB(width / 2 - 50, cy + 100, 100, 36) && phase === "play") {
    total++;
    var sorted = userFactors.slice().sort(function(a,b){return a-b;});
    if (sorted.length === factors.length && sorted.every(function(v,i){return v===factors[i];})) {
      score++; feedback = "Correct! You found all " + factors.length + " factors!";
    } else {
      feedback = "Missing some factors. You had " + userFactors.length + "/" + factors.length;
    }
    phase = "done";
  }
  if (phase === "done" && hitB(width / 2 - 50, cy + 195, 100, 34)) newProblem();
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
