/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var data = [{label:"A",val:25},{label:"B",val:40},{label:"C",val:15},{label:"D",val:30},{label:"E",val:20}];
var chartType = 0;
var COLORS = [[80,60,200],[220,100,40],[40,180,120],[220,60,100],[60,160,220]];
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Bar & Pie Charts", width / 2, 25); textStyle(NORMAL);
  if (chartType === 0) drawBarChart(); else drawPieChart();
  var btnY = height - 50;
  drawBtn(width / 2 - 110, btnY, 90, 28, "Bar Chart", chartType === 0);
  drawBtn(width / 2 - 10, btnY, 90, 28, "Pie Chart", chartType === 1);
  drawBtn(width / 2 + 100, btnY, 80, 28, "Random");
}
function drawBarChart() {
  var maxV = 0; for (var i = 0; i < data.length; i++) if (data[i].val > maxV) maxV = data[i].val;
  var barW = Math.min(60, (width - 100) / data.length), maxH = 300;
  var bx = width / 2 - data.length * barW / 2, by = 380;
  for (var i2 = 0; i2 < data.length; i2++) {
    var h = (data[i2].val / maxV) * maxH;
    var c = COLORS[i2 % COLORS.length];
    fill(c[0], c[1], c[2], 200); stroke(255); strokeWeight(1);
    rect(bx + i2 * barW, by - h, barW - 6, h, 4, 4, 0, 0);
    noStroke(); fill(60); textSize(14); textStyle(BOLD); text(data[i2].val, bx + i2 * barW + barW / 2, by - h - 14); textStyle(NORMAL);
    textSize(13); text(data[i2].label, bx + i2 * barW + barW / 2, by + 16);
  }
}
function drawPieChart() {
  var total = 0; for (var i = 0; i < data.length; i++) total += data[i].val;
  var cx = width / 2, cy = 230, r = 120;
  var startA = -HALF_PI;
  for (var j = 0; j < data.length; j++) {
    var sweep = (data[j].val / total) * TWO_PI;
    var c = COLORS[j % COLORS.length];
    fill(c[0], c[1], c[2], 200); stroke(255); strokeWeight(2);
    arc(cx, cy, r * 2, r * 2, startA, startA + sweep, PIE);
    var midA = startA + sweep / 2;
    noStroke(); fill(c[0], c[1], c[2]); textSize(12); textStyle(BOLD);
    text(data[j].label + " " + Math.round(data[j].val / total * 100) + "%", cx + cos(midA) * (r + 25), cy + sin(midA) * (r + 25));
    textStyle(NORMAL);
    startA += sweep;
  }
}
function drawBtn(x, y, w, h, label, active) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(active ? color(80, 60, 200) : (hov ? color(200, 210, 255) : 255)); stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(active ? 255 : 60); textSize(11); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 50;
  if (hitB(width / 2 - 110, btnY, 90, 28)) chartType = 0;
  if (hitB(width / 2 - 10, btnY, 90, 28)) chartType = 1;
  if (hitB(width / 2 + 100, btnY, 80, 28)) { for (var i = 0; i < data.length; i++) data[i].val = Math.floor(Math.random() * 50) + 5; }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
