/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var origShape = [{x:1,y:1},{x:3,y:1},{x:3,y:2},{x:1,y:2}];
var targetShape = [], playerShape = [];
var playerTx = 0, playerTy = 0, playerRot = 0, score = 0, total = 0, matched = false;
var cellPx = 30;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
  newProblem();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() {
  playerTx = 0; playerTy = 0; playerRot = 0; matched = false;
  var ttx = Math.floor(Math.random() * 7) - 3;
  var tty = Math.floor(Math.random() * 7) - 3;
  var trot = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
  targetShape = [];
  for (var i = 0; i < origShape.length; i++) {
    var x = origShape[i].x, y = origShape[i].y;
    var cos_a = Math.cos(trot * Math.PI / 180), sin_a = Math.sin(trot * Math.PI / 180);
    targetShape.push({ x: Math.round(x * cos_a - y * sin_a + ttx), y: Math.round(x * sin_a + y * cos_a + tty) });
  }
  updatePlayer();
}
function updatePlayer() {
  playerShape = [];
  for (var i = 0; i < origShape.length; i++) {
    var x = origShape[i].x, y = origShape[i].y;
    var cos_a = Math.cos(playerRot * Math.PI / 180), sin_a = Math.sin(playerRot * Math.PI / 180);
    playerShape.push({ x: Math.round(x * cos_a - y * sin_a + playerTx), y: Math.round(x * sin_a + y * cos_a + playerTy) });
  }
}
function checkMatch() {
  if (playerShape.length !== targetShape.length) return false;
  for (var i = 0; i < playerShape.length; i++) {
    if (Math.abs(playerShape[i].x - targetShape[i].x) > 0.5 || Math.abs(playerShape[i].y - targetShape[i].y) > 0.5) return false;
  }
  return true;
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Transformation Practice", width / 2, 25); textStyle(NORMAL);
  cellPx = Math.min(30, (width - 80) / 20);
  var ox = width / 2, oy = height / 2 - 30;
  stroke(230); strokeWeight(1);
  for (var i = -8; i <= 8; i++) {
    line(ox + i * cellPx, oy - 8 * cellPx, ox + i * cellPx, oy + 8 * cellPx);
    line(ox - 8 * cellPx, oy + i * cellPx, ox + 8 * cellPx, oy + i * cellPx);
  }
  stroke(100); strokeWeight(2);
  line(ox - 8 * cellPx, oy, ox + 8 * cellPx, oy); line(ox, oy - 8 * cellPx, ox, oy + 8 * cellPx);
  fill(40, 180, 80, 60); stroke(40, 180, 80); strokeWeight(2);
  beginShape(); for (var t = 0; t < targetShape.length; t++) vertex(ox + targetShape[t].x * cellPx, oy - targetShape[t].y * cellPx); endShape(CLOSE);
  fill(80, 60, 200, 60); stroke(80, 60, 200); strokeWeight(2);
  beginShape(); for (var p = 0; p < playerShape.length; p++) vertex(ox + playerShape[p].x * cellPx, oy - playerShape[p].y * cellPx); endShape(CLOSE);
  noStroke(); fill(40, 180, 80); textSize(11); text("Target (green)", ox + 6 * cellPx, oy - 7 * cellPx);
  fill(80, 60, 200); text("Yours (purple)", ox + 6 * cellPx, oy - 6 * cellPx);
  if (matched) { fill(40, 180, 80); textSize(24); textStyle(BOLD); text("Matched!", width / 2, 55); textStyle(NORMAL); }
  var btnY = height - 85;
  drawBtn(width / 2 - 200, btnY, 50, 28, "Left"); drawBtn(width / 2 - 145, btnY, 50, 28, "Right");
  drawBtn(width / 2 - 90, btnY, 40, 28, "Up"); drawBtn(width / 2 - 45, btnY, 50, 28, "Down");
  drawBtn(width / 2 + 10, btnY, 65, 28, "Rot 90°");
  drawBtn(width / 2 + 85, btnY, 55, 28, "Check");
  drawBtn(width / 2 + 150, btnY, 55, 28, "New");
  fill(80); noStroke(); textSize(13); text("Score: " + score + "/" + total, width / 2, height - 20);
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6);
  noStroke(); fill(hov ? 255 : 60); textSize(11); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 85;
  if (hitB(width / 2 - 200, btnY, 50, 28)) { playerTx--; updatePlayer(); }
  if (hitB(width / 2 - 145, btnY, 50, 28)) { playerTx++; updatePlayer(); }
  if (hitB(width / 2 - 90, btnY, 40, 28)) { playerTy++; updatePlayer(); }
  if (hitB(width / 2 - 45, btnY, 50, 28)) { playerTy--; updatePlayer(); }
  if (hitB(width / 2 + 10, btnY, 65, 28)) { playerRot = (playerRot + 90) % 360; updatePlayer(); }
  if (hitB(width / 2 + 85, btnY, 55, 28)) { total++; if (checkMatch()) { score++; matched = true; } }
  if (hitB(width / 2 + 150, btnY, 55, 28)) newProblem();
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
