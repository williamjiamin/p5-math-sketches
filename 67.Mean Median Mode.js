/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var data = [3, 5, 7, 7, 9, 12, 15];
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function getMean() { var s = 0; for (var i = 0; i < data.length; i++) s += data[i]; return s / data.length; }
function getMedian() { var s = data.slice().sort(function(a,b){return a-b;}); var m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m-1] + s[m]) / 2; }
function getMode() { var freq = {}, max = 0, modes = [];
  for (var i = 0; i < data.length; i++) { freq[data[i]] = (freq[data[i]] || 0) + 1; if (freq[data[i]] > max) max = freq[data[i]]; }
  for (var k in freq) { if (freq[k] === max && max > 1) modes.push(+k); }
  return modes.length ? modes.join(", ") : "None";
}
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD); text("Mean, Median, Mode", width / 2, 25); textStyle(NORMAL);
  fill(80); textSize(14); text("Data: [" + data.join(", ") + "]", width / 2, 55);
  var barW = Math.min(50, (width - 100) / data.length), barMaxH = 200;
  var maxVal = Math.max.apply(null, data);
  var bx = width / 2 - data.length * barW / 2, by = 250;
  for (var i = 0; i < data.length; i++) {
    var h = (data[i] / maxVal) * barMaxH;
    fill(80, 60, 200, 180); stroke(255); strokeWeight(1);
    rect(bx + i * barW, by - h, barW - 4, h, 4, 4, 0, 0);
    noStroke(); fill(60); textSize(12); text(data[i], bx + i * barW + barW / 2, by - h - 12);
  }
  var mean = getMean(), median = getMedian(), mode = getMode();
  var meanX = bx + map(mean, 0, maxVal, 0, data.length * barW);
  stroke(220, 60, 60); strokeWeight(2); line(meanX, by - barMaxH - 10, meanX, by + 5);
  noStroke(); fill(220, 60, 60); textSize(11); text("Mean", meanX, by + 16);
  var infoY = by + 40;
  noStroke(); textSize(16); textStyle(BOLD);
  fill(220, 60, 60); text("Mean = " + mean.toFixed(2), width / 2 - 180, infoY);
  fill(40, 160, 80); text("Median = " + median, width / 2, infoY);
  fill(80, 60, 200); text("Mode = " + mode, width / 2 + 180, infoY); textStyle(NORMAL);
  fill(100); textSize(12);
  text("Mean = sum ÷ count = " + data.reduce(function(a,b){return a+b;},0) + " ÷ " + data.length, width / 2, infoY + 25);
  var btnY = height - 50;
  drawBtn(width / 2 - 150, btnY, 80, 28, "Add Value"); drawBtn(width / 2 - 60, btnY, 80, 28, "Remove");
  drawBtn(width / 2 + 30, btnY, 80, 28, "Randomize");
}
function drawBtn(x, y, w, h, label) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(hov ? color(80, 60, 200) : 255); stroke(180); strokeWeight(1); rect(x, y, w, h, 6);
  noStroke(); fill(hov ? 255 : 60); textSize(11); textStyle(BOLD); text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 50;
  if (hitB(width / 2 - 150, btnY, 80, 28) && data.length < 15) data.push(Math.floor(Math.random() * 20) + 1);
  if (hitB(width / 2 - 60, btnY, 80, 28) && data.length > 3) data.pop();
  if (hitB(width / 2 + 30, btnY, 80, 28)) { data = []; for (var i = 0; i < 7; i++) data.push(Math.floor(Math.random() * 20) + 1); }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
