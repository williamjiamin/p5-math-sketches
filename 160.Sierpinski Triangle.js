/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var depth = 4;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Fractals — Sierpinski Triangle",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("Self-similar at every scale. Dimension ≈ log(3)/log(2) ≈ 1.585",width/2,52);
  var cx=width/2,h=height-130,by=height-65;
  var ax=cx,ay=by-h*0.85;var bx=cx-h*0.5,bby=by;var ccx=cx+h*0.5,ccy=by;
  sierpinski(ax,ay,bx,bby,ccx,ccy,depth);
  fill(80,60,200);textSize(13);text("Depth: "+depth+"   Triangles: "+Math.pow(3,depth),width/2,height-35);
  drawBtn(width/2-60,height-25,50,20,"- Depth");drawBtn(width/2+10,height-25,50,20,"+ Depth");
}
function sierpinski(x1,y1,x2,y2,x3,y3,d){if(d===0){fill(80,60,200,180);stroke(80,60,200);strokeWeight(0.5);triangle(x1,y1,x2,y2,x3,y3);return;}
  var mx1=(x1+x2)/2,my1=(y1+y2)/2,mx2=(x2+x3)/2,my2=(y2+y3)/2,mx3=(x1+x3)/2,my3=(y1+y3)/2;
  sierpinski(x1,y1,mx1,my1,mx3,my3,d-1);sierpinski(mx1,my1,x2,y2,mx2,my2,d-1);sierpinski(mx3,my3,mx2,my2,x3,y3,d-1);}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){if(hitB(width/2-60,height-25,50,20))depth=Math.max(0,depth-1);if(hitB(width/2+10,height-25,50,20))depth=Math.min(7,depth+1);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
