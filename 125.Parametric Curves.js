/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var curveType = 0, tMax = 6.28, animT = 0;
var CURVES = ["Circle","Lissajous","Cycloid","Spiral"];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function getXY(t){
  if(curveType===0)return{x:cos(t)*120,y:sin(t)*120};
  if(curveType===1)return{x:sin(3*t)*120,y:sin(2*t)*120};
  if(curveType===2){var r2=50;return{x:r2*(t-sin(t)),y:-r2*(1-cos(t));};}
  return{x:t*15*cos(t*4),y:t*15*sin(t*4)};
}
function draw(){
  background(245,247,252);animT=(animT+0.02)%tMax;
  noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Parametric Curves",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(15);text(CURVES[curveType],width/2,55);
  var cx=width/2,cy=height/2+10;
  stroke(200);strokeWeight(1);line(cx-250,cy,cx+250,cy);line(cx,cy-200,cx,cy+200);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var t=0;t<=tMax;t+=0.02){var p=getXY(t);var px=cx+p.x,py=cy+p.y;if(px>30&&px<width-30&&py>50&&py<height-50)vertex(px,py);}endShape();
  var cur=getXY(animT);fill(220,60,60);noStroke();ellipse(cx+cur.x,cy+cur.y,10,10);
  noStroke();fill(80);textSize(12);text("t = "+animT.toFixed(2)+"   x(t) = "+cur.x.toFixed(1)+"   y(t) = "+cur.y.toFixed(1),width/2,height-70);
  var btnY=height-40;for(var k=0;k<4;k++)drawBtn(width/2+(k-2)*95+5,btnY,88,24,CURVES[k],k===curveType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;for(var k=0;k<4;k++){if(hitB(width/2+(k-2)*95+5,btnY,88,24)){curveType=k;animT=0;tMax=curveType===2?12.56:(curveType===3?6.28:6.28);}}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
