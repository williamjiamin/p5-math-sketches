/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var vW = 4, vH = 3, vD = 3;
var buildProgress = 0, building = false;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  if (building) { buildProgress = Math.min(buildProgress + 0.02, 1); if (buildProgress >= 1) building = false; }
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Volume with Cubes", width / 2, 25); textStyle(NORMAL);
  var total = vW * vH * vD;
  var shown = building ? Math.ceil(buildProgress * total) : total;
  var cubeSz = Math.min(30, (width - 200) / (vW + vD), (height - 250) / (vH + vD));
  var isoX = cubeSz, isoYx = cubeSz * 0.5, isoYz = -cubeSz * 0.5;
  var ox = width / 2 - (vW * isoX) / 2, oy = height / 2 + vH * cubeSz / 3;
  var count = 0;
  var layerColors = [[80,60,200],[40,180,120],[220,140,40],[200,60,60],[60,160,200],[180,60,180],[120,180,60],[200,120,60]];
  for (var y = 0; y < vH; y++) {
    for (var z = 0; z < vD; z++) {
      for (var x = 0; x < vW; x++) {
        count++;
        if (count > shown) break;
        var px = ox + x * isoX + z * cubeSz * 0.5;
        var py = oy - y * cubeSz + z * isoYz;
        var c = layerColors[y % layerColors.length];
        fill(c[0], c[1], c[2], 180); stroke(255); strokeWeight(1);
        rect(px, py - cubeSz, cubeSz - 1, cubeSz - 1, 2);
        fill(c[0] * 0.8, c[1] * 0.8, c[2] * 0.8, 120);
        quad(px + cubeSz - 1, py - cubeSz, px + cubeSz - 1 + cubeSz * 0.3, py - cubeSz - cubeSz * 0.2,
             px + cubeSz - 1 + cubeSz * 0.3, py - cubeSz * 0.2, px + cubeSz - 1, py);
        fill(c[0] * 0.6, c[1] * 0.6, c[2] * 0.6, 100);
        quad(px, py - cubeSz, px + cubeSz * 0.3, py - cubeSz - cubeSz * 0.2,
             px + cubeSz - 1 + cubeSz * 0.3, py - cubeSz - cubeSz * 0.2, px + cubeSz - 1, py - cubeSz);
      }
    }
  }
  noStroke(); fill(30, 50, 120); textSize(16);
  text("Count: " + shown + " / " + total, width / 2, oy + 30);
  fill(80, 60, 200); textSize(20); textStyle(BOLD);
  text("Volume = " + vW + " × " + vH + " × " + vD + " = " + total + " cubic units", width / 2, oy + 58);
  textStyle(NORMAL);
  var btnY = oy + 85;
  noStroke(); fill(80); textSize(12);
  text("Width", width / 2 - 200, btnY - 8); text("Height", width / 2 - 60, btnY - 8); text("Depth", width / 2 + 80, btnY - 8);
  drawBtn(width / 2 - 230, btnY, 35, 28, "-"); drawBtn(width / 2 - 165, btnY, 35, 28, "+");
  drawBtn(width / 2 - 90, btnY, 35, 28, "-"); drawBtn(width / 2 - 25, btnY, 35, 28, "+");
  drawBtn(width / 2 + 50, btnY, 35, 28, "-"); drawBtn(width / 2 + 115, btnY, 35, 28, "+");
  drawBtn(width / 2 - 40, btnY + 36, 80, 30, "Build!");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6);
  noStroke(); fill(hov ? 255 : 60); textSize(13); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 80;
  if (hitB(width / 2 - 230, btnY, 35, 28)) { vW = Math.max(1, vW - 1); buildProgress = 1; }
  if (hitB(width / 2 - 165, btnY, 35, 28)) { vW = Math.min(8, vW + 1); buildProgress = 1; }
  if (hitB(width / 2 - 90, btnY, 35, 28)) { vH = Math.max(1, vH - 1); buildProgress = 1; }
  if (hitB(width / 2 - 25, btnY, 35, 28)) { vH = Math.min(8, vH + 1); buildProgress = 1; }
  if (hitB(width / 2 + 50, btnY, 35, 28)) { vD = Math.max(1, vD - 1); buildProgress = 1; }
  if (hitB(width / 2 + 115, btnY, 35, 28)) { vD = Math.min(8, vD + 1); buildProgress = 1; }
  if (hitB(width / 2 - 40, btnY + 36, 80, 30)) { building = true; buildProgress = 0; }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
