/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var funcType = 0;
var FUNCS = ["x²+y²","sin(x)·cos(y)","x·y","x²-y²"];
function f(x,y){if(funcType===0)return x*x+y*y;if(funcType===1)return Math.sin(x)*Math.cos(y);if(funcType===2)return x*y;return x*x-y*y;}
function gx(x,y){if(funcType===0)return 2*x;if(funcType===1)return Math.cos(x)*Math.cos(y);if(funcType===2)return y;return 2*x;}
function gy(x,y){if(funcType===0)return 2*y;if(funcType===1)return-Math.sin(x)*Math.sin(y);if(funcType===2)return x;return-2*y;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Gradient Vector Field",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(14);text("∇f for f(x,y) = "+FUNCS[funcType],width/2,52);
  var cx=width/2,cy=height/2+10,sc=40,step=1;
  stroke(200);strokeWeight(0.5);line(cx-200,cy,cx+200,cy);line(cx,cy-200,cx,cy+200);
  for(var ix=-4;ix<=4;ix+=step){for(var iy=-4;iy<=4;iy+=step){var dx=gx(ix,iy),dy=gy(ix,iy);var mag=Math.sqrt(dx*dx+dy*dy);if(mag>0.01){var len=Math.min(mag*8,sc*0.8);var nx=dx/mag,ny=dy/mag;var sx=cx+ix*sc,sy=cy-iy*sc;var ex=sx+nx*len,ey=sy-ny*len;
      var alpha=Math.min(255,mag*60+50);stroke(80,60,200,alpha);strokeWeight(1.5);line(sx,sy,ex,ey);
      var a=atan2(ey-sy,ex-sx);line(ex,ey,ex-5*cos(a-PI/6),ey-5*sin(a-PI/6));line(ex,ey,ex-5*cos(a+PI/6),ey-5*sin(a+PI/6));}}}
  for(var level=-3;level<=6;level++){noFill();stroke(200,140,30,60);strokeWeight(1);if(funcType===0&&level>=0){var r2=Math.sqrt(level)*sc;if(r2>5)ellipse(cx,cy,r2*2,r2*2);}}
  var btnY=height-40;for(var k=0;k<4;k++)drawBtn(width/2+(k-2)*100+10,btnY,90,24,FUNCS[k],k===funcType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;for(var k=0;k<4;k++){if(hitB(width/2+(k-2)*100+10,btnY,90,24))funcType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
