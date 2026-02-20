/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var curveType = 0;
var CURVES = ["Circle","Cardioid","Rose (3)","Spiral"];
function rFunc(theta){
  if(curveType===0)return 120;
  if(curveType===1)return 100*(1+cos(theta));
  if(curveType===2)return 130*cos(3*theta);
  return theta*15;
}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Polar Coordinates",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(15);text(CURVES[curveType],width/2,55);
  var cx=width/2,cy=height/2+10;
  stroke(220);strokeWeight(0.5);for(var ri=40;ri<=200;ri+=40)ellipse(cx,cy,ri*2,ri*2);
  for(var ai=0;ai<360;ai+=30){var ex=cx+200*cos(radians(ai)),ey=cy+200*sin(radians(ai));line(cx,cy,ex,ey);}
  stroke(180);strokeWeight(1);line(cx-220,cy,cx+220,cy);line(cx,cy-220,cx,cy+220);
  noFill();stroke(80,60,200);strokeWeight(2.5);beginShape();var maxT=curveType===3?TWO_PI*3:TWO_PI;for(var t=0;t<=maxT;t+=0.01){var r2=rFunc(t);var px=cx+r2*cos(t),py=cy-r2*sin(t);if(Math.abs(r2)<250)vertex(px,py);}endShape();
  var eqs=["r = constant","r = a(1+cos θ)","r = a·cos(3θ)","r = a·θ"];
  noStroke();fill(100);textSize(13);text(eqs[curveType],width/2,height-70);
  var btnY=height-40;for(var k=0;k<4;k++)drawBtn(width/2+(k-2)*95+5,btnY,88,24,CURVES[k],k===curveType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;for(var k=0;k<4;k++){if(hitB(width/2+(k-2)*95+5,btnY,88,24))curveType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
