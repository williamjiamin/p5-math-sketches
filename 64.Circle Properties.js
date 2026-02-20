/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var radius = 80, showUnroll = false, unrollProgress = 0;
function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  if (showUnroll) unrollProgress = Math.min(unrollProgress + 0.01, 1);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Circle Properties", width / 2, 25); textStyle(NORMAL);
  var cx = width / 2, cy = 200;
  stroke(80, 60, 200); strokeWeight(3); noFill();
  ellipse(cx, cy, radius * 2, radius * 2);
  stroke(220, 60, 60); strokeWeight(2);
  line(cx, cy, cx + radius, cy);
  noStroke(); fill(220, 60, 60); textSize(13); textStyle(BOLD);
  text("r=" + radius, cx + radius / 2, cy - 12); textStyle(NORMAL);
  stroke(40, 160, 80); strokeWeight(2);
  line(cx - radius, cy, cx + radius, cy);
  noStroke(); fill(40, 160, 80); textSize(13); textStyle(BOLD);
  text("d=" + (radius * 2), cx, cy + 16); textStyle(NORMAL);
  fill(80, 60, 200); noStroke(); ellipse(cx, cy, 6);
  var circ = 2 * Math.PI * radius;
  var area = Math.PI * radius * radius;
  var infoY = cy + radius + 40;
  noStroke(); fill(30, 50, 120); textSize(16); textStyle(BOLD);
  text("Circumference = 2πr = " + circ.toFixed(1), cx, infoY);
  text("Area = πr² = " + area.toFixed(1), cx, infoY + 25);
  text("π ≈ 3.14159...", cx, infoY + 50); textStyle(NORMAL);
  fill(100); textSize(12);
  text("π = circumference ÷ diameter = " + circ.toFixed(1) + " ÷ " + (radius * 2) + " = " + (circ / (radius * 2)).toFixed(4), cx, infoY + 75);
  if (showUnroll) {
    var unrollY = infoY + 100;
    stroke(80, 60, 200); strokeWeight(3);
    var lineLen = circ * unrollProgress;
    var maxLine = Math.min(circ, width - 100);
    var scale = maxLine / circ;
    line(50, unrollY, 50 + lineLen * scale, unrollY);
    noStroke(); fill(80, 60, 200); textSize(12);
    text("Unrolled circumference = " + circ.toFixed(1), cx, unrollY + 18);
    stroke(220, 60, 60); strokeWeight(2);
    line(50, unrollY + 25, 50 + radius * 2 * scale, unrollY + 25);
    noStroke(); fill(220, 60, 60); textSize(12);
    text("Diameter = " + (radius * 2), 50 + radius * scale, unrollY + 40);
    fill(100); text("π = " + (circ / (radius * 2)).toFixed(4) + " ≈ 3.14159", cx, unrollY + 58);
  }
  var btnY = height - 50;
  drawBtn(cx - 140, btnY, 45, 28, "r-"); drawBtn(cx - 90, btnY, 45, 28, "r+");
  drawBtn(cx + 20, btnY, 100, 28, showUnroll ? "Hide Unroll" : "Unroll π");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6);
  noStroke(); fill(hov ? 255 : 60); textSize(12); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 50;
  if (hitB(width / 2 - 140, btnY, 45, 28)) { radius = Math.max(20, radius - 10); unrollProgress = 0; }
  if (hitB(width / 2 - 90, btnY, 45, 28)) { radius = Math.min(120, radius + 10); unrollProgress = 0; }
  if (hitB(width / 2 + 20, btnY, 100, 28)) { showUnroll = !showUnroll; unrollProgress = 0; }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
