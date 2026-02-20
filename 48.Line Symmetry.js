/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var shapeIdx = 0;
var shapes = [
  { name: "Square", pts: function(cx,cy,r){return [{x:cx-r,y:cy-r},{x:cx+r,y:cy-r},{x:cx+r,y:cy+r},{x:cx-r,y:cy+r}];}, lines: 4 },
  { name: "Equilateral Triangle", pts: function(cx,cy,r){return [{x:cx,y:cy-r},{x:cx+r*0.87,y:cy+r*0.5},{x:cx-r*0.87,y:cy+r*0.5}];}, lines: 3 },
  { name: "Circle", pts: function(cx,cy,r){var p=[];for(var i=0;i<36;i++){var a=TWO_PI*i/36;p.push({x:cx+r*cos(a),y:cy+r*sin(a)});}return p;}, lines: -1 },
  { name: "Rectangle", pts: function(cx,cy,r){return [{x:cx-r*1.3,y:cy-r*0.7},{x:cx+r*1.3,y:cy-r*0.7},{x:cx+r*1.3,y:cy+r*0.7},{x:cx-r*1.3,y:cy+r*0.7}];}, lines: 2 },
  { name: "Regular Pentagon", pts: function(cx,cy,r){var p=[];for(var i=0;i<5;i++){var a=TWO_PI*i/5-HALF_PI;p.push({x:cx+r*cos(a),y:cy+r*sin(a)});}return p;}, lines: 5 }
];
var lineAngle = 0, draggingLine = false;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function draw() {
  background(245, 247, 252);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Line Symmetry", width / 2, 25); textStyle(NORMAL);
  var cx = width / 2, cy = height / 2 - 30, r = Math.min(width, height) * 0.2;
  var shape = shapes[shapeIdx];
  var pts = shape.pts(cx, cy, r);
  fill(80, 60, 200, 50); stroke(80, 60, 200); strokeWeight(2);
  beginShape(); for (var i = 0; i < pts.length; i++) vertex(pts[i].x, pts[i].y); endShape(CLOSE);
  var lineLen = r * 1.8;
  var lx1 = cx + cos(lineAngle) * lineLen, ly1 = cy + sin(lineAngle) * lineLen;
  var lx2 = cx - cos(lineAngle) * lineLen, ly2 = cy - sin(lineAngle) * lineLen;
  stroke(220, 60, 60); strokeWeight(3);
  drawingContext.setLineDash([8, 6]); line(lx1, ly1, lx2, ly2); drawingContext.setLineDash([]);
  fill(220, 60, 60); noStroke();
  ellipse(lx1, ly1, 12); ellipse(lx2, ly2, 12);
  noStroke(); fill(220, 60, 60); textSize(12);
  text("Drag endpoints to rotate", cx, cy + r + 40);
  var linesInfo = shape.lines === -1 ? "Infinite" : shape.lines;
  fill(80); textSize(16); textStyle(BOLD);
  text(shape.name + " — Lines of symmetry: " + linesInfo, cx, cy + r + 65); textStyle(NORMAL);
  var btnY = height - 50;
  for (var s = 0; s < shapes.length; s++) {
    drawBtn(width / 2 + (s - shapes.length / 2) * 120, btnY, 110, 30, shapes[s].name, s === shapeIdx);
  }
}
function drawBtn(x, y, w, h, label, active) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(active ? color(80, 60, 200) : (hov ? color(200, 210, 255) : 255));
  stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(active ? 255 : 60); textSize(10); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var cx = width / 2, cy = height / 2 - 30, r = Math.min(width, height) * 0.2;
  var lineLen = r * 1.8;
  var lx1 = cx + cos(lineAngle) * lineLen, ly1 = cy + sin(lineAngle) * lineLen;
  var lx2 = cx - cos(lineAngle) * lineLen, ly2 = cy - sin(lineAngle) * lineLen;
  if (dist(mouseX, mouseY, lx1, ly1) < 20 || dist(mouseX, mouseY, lx2, ly2) < 20) draggingLine = true;
  var btnY = height - 50;
  for (var s = 0; s < shapes.length; s++) {
    if (hitB(width / 2 + (s - shapes.length / 2) * 120, btnY, 110, 30)) shapeIdx = s;
  }
}
function mouseDragged() {
  if (draggingLine) lineAngle = atan2(mouseY - (height / 2 - 30), mouseX - width / 2);
}
function mouseReleased() { draggingLine = false; }
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
