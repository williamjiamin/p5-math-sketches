/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var v1={x:3,y:2},v2={x:1,y:3};
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Vector Addition",width/2,25);textStyle(NORMAL);
  var cx=width/2,cy=height/2+20,sc=40;
  stroke(220);strokeWeight(0.5);for(var gx=-6;gx<=6;gx++){line(cx+gx*sc,cy-6*sc,cx+gx*sc,cy+6*sc);}for(var gy=-6;gy<=6;gy++){line(cx-6*sc,cy+gy*sc,cx+6*sc,cy+gy*sc);}
  stroke(180);strokeWeight(1.5);line(cx-6*sc,cy,cx+6*sc,cy);line(cx,cy-6*sc,cx,cy+6*sc);
  drawArrow(cx,cy,cx+v1.x*sc,cy-v1.y*sc,color(80,60,200),3);
  drawArrow(cx,cy,cx+v2.x*sc,cy-v2.y*sc,color(220,100,40),3);
  var sum={x:v1.x+v2.x,y:v1.y+v2.y};
  drawArrow(cx,cy,cx+sum.x*sc,cy-sum.y*sc,color(220,60,60),3);
  stroke(80,60,200,80);strokeWeight(1);setLineDash([5,5]);line(cx+v1.x*sc,cy-v1.y*sc,cx+sum.x*sc,cy-sum.y*sc);line(cx+v2.x*sc,cy-v2.y*sc,cx+sum.x*sc,cy-sum.y*sc);setLineDash([]);
  noStroke();fill(80,60,200);textSize(13);textStyle(BOLD);text("v₁("+v1.x+","+v1.y+")",cx+v1.x*sc/2-15,cy-v1.y*sc/2-12);
  fill(220,100,40);text("v₂("+v2.x+","+v2.y+")",cx+v2.x*sc/2+15,cy-v2.y*sc/2+12);
  fill(220,60,60);text("v₁+v₂("+sum.x+","+sum.y+")",cx+sum.x*sc/2+20,cy-sum.y*sc/2-12);textStyle(NORMAL);
  fill(80);textSize(12);text("|v₁|="+Math.sqrt(v1.x*v1.x+v1.y*v1.y).toFixed(2)+"  |v₂|="+Math.sqrt(v2.x*v2.x+v2.y*v2.y).toFixed(2)+"  |sum|="+Math.sqrt(sum.x*sum.x+sum.y*sum.y).toFixed(2),width/2,height-70);
  var btnY=height-40;drawBtn(30,btnY,55,24,"v1x-");drawBtn(90,btnY,55,24,"v1x+");drawBtn(150,btnY,55,24,"v1y-");drawBtn(210,btnY,55,24,"v1y+");drawBtn(300,btnY,55,24,"v2x-");drawBtn(360,btnY,55,24,"v2x+");drawBtn(420,btnY,55,24,"v2y-");drawBtn(480,btnY,55,24,"v2y+");
}
function drawArrow(x1,y1,x2,y2,c,sw){stroke(c);strokeWeight(sw);line(x1,y1,x2,y2);var ang=atan2(y2-y1,x2-x1);var hl=10;line(x2,y2,x2-hl*cos(ang-PI/6),y2-hl*sin(ang-PI/6));line(x2,y2,x2-hl*cos(ang+PI/6),y2-hl*sin(ang+PI/6));}
function setLineDash(list){drawingContext.setLineDash(list);}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;if(hitB(30,btnY,55,24))v1.x=Math.max(-5,v1.x-1);if(hitB(90,btnY,55,24))v1.x=Math.min(5,v1.x+1);if(hitB(150,btnY,55,24))v1.y=Math.max(-5,v1.y-1);if(hitB(210,btnY,55,24))v1.y=Math.min(5,v1.y+1);
  if(hitB(300,btnY,55,24))v2.x=Math.max(-5,v2.x-1);if(hitB(360,btnY,55,24))v2.x=Math.min(5,v2.x+1);if(hitB(420,btnY,55,24))v2.y=Math.max(-5,v2.y-1);if(hitB(480,btnY,55,24))v2.y=Math.min(5,v2.y+1);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
