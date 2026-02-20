/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var v1={x:4,y:1},v2={x:2,y:3};
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Dot Product",width/2,25);textStyle(NORMAL);
  var cx=width/2,cy=height/2+20,sc=40;
  stroke(220);strokeWeight(0.5);for(var gx=-6;gx<=6;gx++)line(cx+gx*sc,cy-6*sc,cx+gx*sc,cy+6*sc);for(var gy=-6;gy<=6;gy++)line(cx-6*sc,cy+gy*sc,cx+6*sc,cy+gy*sc);
  stroke(180);strokeWeight(1.5);line(cx-6*sc,cy,cx+6*sc,cy);line(cx,cy-6*sc,cx,cy+6*sc);
  drawArrow(cx,cy,cx+v1.x*sc,cy-v1.y*sc,color(80,60,200),3);
  drawArrow(cx,cy,cx+v2.x*sc,cy-v2.y*sc,color(220,100,40),3);
  var dot=v1.x*v2.x+v1.y*v2.y;
  var mag1=Math.sqrt(v1.x*v1.x+v1.y*v1.y),mag2=Math.sqrt(v2.x*v2.x+v2.y*v2.y);
  var cosA=mag1>0&&mag2>0?dot/(mag1*mag2):0;
  var angBetween=Math.acos(Math.max(-1,Math.min(1,cosA)));
  var projLen=mag1>0?dot/mag2:0;
  var projX=mag2>0?projLen*v2.x/mag2:0,projY=mag2>0?projLen*v2.y/mag2:0;
  stroke(220,60,60,150);strokeWeight(1.5);drawingContext.setLineDash([4,4]);line(cx+v1.x*sc,cy-v1.y*sc,cx+projX*sc,cy-projY*sc);drawingContext.setLineDash([]);
  fill(220,60,60);noStroke();ellipse(cx+projX*sc,cy-projY*sc,8,8);
  noStroke();fill(80,60,200);textSize(12);textStyle(BOLD);text("a("+v1.x+","+v1.y+")",cx+v1.x*sc/2-15,cy-v1.y*sc/2-12);
  fill(220,100,40);text("b("+v2.x+","+v2.y+")",cx+v2.x*sc/2+15,cy-v2.y*sc/2+12);textStyle(NORMAL);
  var infoY=55;fill(80);textSize(14);text("a·b = "+v1.x+"×"+v2.x+" + "+v1.y+"×"+v2.y+" = "+dot,width/2,infoY);
  text("θ = "+degrees(angBetween).toFixed(1)+"°",width/2,infoY+22);
  text("proj_b(a) = "+projLen.toFixed(2),width/2,infoY+44);
  if(Math.abs(dot)<0.01){fill(40,160,80);textStyle(BOLD);text("Perpendicular!",width/2,infoY+68);textStyle(NORMAL);}
  var btnY=height-40;drawBtn(30,btnY,55,24,"ax-");drawBtn(90,btnY,55,24,"ax+");drawBtn(150,btnY,55,24,"ay-");drawBtn(210,btnY,55,24,"ay+");drawBtn(300,btnY,55,24,"bx-");drawBtn(360,btnY,55,24,"bx+");drawBtn(420,btnY,55,24,"by-");drawBtn(480,btnY,55,24,"by+");
}
function drawArrow(x1,y1,x2,y2,c,sw){stroke(c);strokeWeight(sw);line(x1,y1,x2,y2);var ang=atan2(y2-y1,x2-x1);var hl=10;line(x2,y2,x2-hl*cos(ang-PI/6),y2-hl*sin(ang-PI/6));line(x2,y2,x2-hl*cos(ang+PI/6),y2-hl*sin(ang+PI/6));}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;if(hitB(30,btnY,55,24))v1.x=Math.max(-5,v1.x-1);if(hitB(90,btnY,55,24))v1.x=Math.min(5,v1.x+1);if(hitB(150,btnY,55,24))v1.y=Math.max(-5,v1.y-1);if(hitB(210,btnY,55,24))v1.y=Math.min(5,v1.y+1);
  if(hitB(300,btnY,55,24))v2.x=Math.max(-5,v2.x-1);if(hitB(360,btnY,55,24))v2.x=Math.min(5,v2.x+1);if(hitB(420,btnY,55,24))v2.y=Math.max(-5,v2.y-1);if(hitB(480,btnY,55,24))v2.y=Math.min(5,v2.y+1);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
