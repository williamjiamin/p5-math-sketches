/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var shapeIdx = 0, shapes = ["Rectangle", "Triangle", "Pentagon", "Hexagon"];
var vertices = [], dims = [];
var walking = false, walkProgress = 0, walkSpeed = 0.008;
var perimTotal = 0;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial"); textAlign(CENTER, CENTER);
  buildShape();
}
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); buildShape(); }
function buildShape() {
  var cx = width / 2, cy = height / 2 - 30, r = Math.min(width, height) * 0.22;
  vertices = []; dims = [];
  if (shapeIdx === 0) {
    var w = r * 1.4, h = r;
    vertices = [{x:cx-w/2,y:cy-h/2},{x:cx+w/2,y:cy-h/2},{x:cx+w/2,y:cy+h/2},{x:cx-w/2,y:cy+h/2}];
  } else if (shapeIdx === 1) {
    vertices = [{x:cx,y:cy-r},{x:cx+r*0.9,y:cy+r*0.7},{x:cx-r*0.9,y:cy+r*0.7}];
  } else {
    var n = shapeIdx === 2 ? 5 : 6;
    for (var i = 0; i < n; i++) {
      var a = TWO_PI * i / n - HALF_PI;
      vertices.push({x: cx + r * cos(a), y: cy + r * sin(a)});
    }
  }
  perimTotal = 0;
  dims = [];
  for (var j = 0; j < vertices.length; j++) {
    var nxt = vertices[(j + 1) % vertices.length];
    var d = dist(vertices[j].x, vertices[j].y, nxt.x, nxt.y);
    dims.push(Math.round(d));
    perimTotal += Math.round(d);
  }
  walking = false; walkProgress = 0;
}
function draw() {
  background(245, 247, 252);
  if (walking) walkProgress = Math.min(walkProgress + walkSpeed, 1);
  noStroke(); fill(60, 40, 120); textSize(22); textStyle(BOLD);
  text("Perimeter Walker", width / 2, 25); textStyle(NORMAL);
  stroke(80, 60, 200); strokeWeight(3); noFill();
  beginShape();
  for (var i = 0; i < vertices.length; i++) vertex(vertices[i].x, vertices[i].y);
  endShape(CLOSE);
  for (var j = 0; j < vertices.length; j++) {
    var v1 = vertices[j], v2 = vertices[(j + 1) % vertices.length];
    var mx = (v1.x + v2.x) / 2, my = (v1.y + v2.y) / 2;
    noStroke(); fill(100); textSize(12); textStyle(BOLD);
    text(dims[j], mx + (my < height / 2 ? 0 : 0), my + (mx < width / 2 ? -12 : 12)); textStyle(NORMAL);
  }
  if (walking || walkProgress > 0) {
    var totalLen = 0;
    for (var k = 0; k < dims.length; k++) totalLen += dims[k];
    var walked = walkProgress * totalLen;
    var accum = 0;
    stroke(220, 80, 40); strokeWeight(4); noFill();
    beginShape();
    vertex(vertices[0].x, vertices[0].y);
    for (var s = 0; s < vertices.length; s++) {
      var segLen = dims[s];
      if (accum + segLen <= walked) {
        vertex(vertices[(s + 1) % vertices.length].x, vertices[(s + 1) % vertices.length].y);
        accum += segLen;
      } else {
        var t = (walked - accum) / segLen;
        var ex = lerp(vertices[s].x, vertices[(s + 1) % vertices.length].x, t);
        var ey = lerp(vertices[s].y, vertices[(s + 1) % vertices.length].y, t);
        vertex(ex, ey);
        noStroke(); fill(220, 80, 40);
        ellipse(ex, ey, 14);
        break;
      }
    }
    endShape();
    noStroke(); fill(220, 80, 40); textSize(16); textStyle(BOLD);
    text("Distance: " + Math.round(walked) + " / " + perimTotal, width / 2, height - 100);
    textStyle(NORMAL);
  }
  if (walkProgress >= 1) {
    fill(40, 160, 80); textSize(20); textStyle(BOLD);
    text("Perimeter = " + perimTotal, width / 2, height - 70); textStyle(NORMAL);
  }
  var btnY = height - 45;
  for (var si = 0; si < shapes.length; si++) {
    var bx = width / 2 + (si - shapes.length / 2) * 100;
    drawBtn(bx, btnY, 90, 30, shapes[si], si === shapeIdx);
  }
  drawBtn(width / 2 - 45, btnY - 38, 90, 30, walking ? "Walking..." : "Walk!");
}
function drawBtn(x, y, w, h, label, active) {
  var hov = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(active ? color(80, 60, 200) : (hov ? color(200, 210, 255) : 255));
  stroke(180); strokeWeight(1); rect(x, y, w, h, 8);
  noStroke(); fill(active ? 255 : 60); textSize(11); textStyle(BOLD);
  text(label, x + w / 2, y + h / 2); textStyle(NORMAL);
}
function mousePressed() {
  var btnY = height - 45;
  for (var si = 0; si < shapes.length; si++) {
    var bx = width / 2 + (si - shapes.length / 2) * 100;
    if (hitB(bx, btnY, 90, 30)) { shapeIdx = si; buildShape(); }
  }
  if (hitB(width / 2 - 45, btnY - 38, 90, 30) && !walking) { walking = true; walkProgress = 0; }
}
function hitB(x, y, w, h) { return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; }
