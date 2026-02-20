/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var animT = 0, nPts = 40;
function P(x,y){return -y;}
function Q(x,y){return x;}
function dQdx(){return 1;}
function dPdy(){return -1;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);animT=(animT+0.01)%(TWO_PI);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Green's Theorem",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("∮_C P dx + Q dy = ∬_D (∂Q/∂x - ∂P/∂y) dA",width/2,50);
  fill(80,60,200);textSize(13);text("P=-y, Q=x  →  ∂Q/∂x - ∂P/∂y = 1-(-1) = 2",width/2,72);
  var cx=width/2,cy=height/2+20,sc=60,R=2;
  stroke(220);strokeWeight(0.5);for(var gx=-3;gx<=3;gx++)line(cx+gx*sc,cy-3*sc,cx+gx*sc,cy+3*sc);for(var gy=-3;gy<=3;gy++)line(cx-3*sc,cy+gy*sc,cx+3*sc,cy+gy*sc);
  stroke(180);strokeWeight(1);line(cx-3*sc,cy,cx+3*sc,cy);line(cx,cy-3*sc,cx,cy+3*sc);
  fill(80,60,200,30);stroke(80,60,200);strokeWeight(2);ellipse(cx,cy,R*2*sc,R*2*sc);
  for(var i=0;i<nPts;i++){var t=TWO_PI*i/nPts;var px2=cx+R*sc*cos(t),py2=cy-R*sc*sin(t);var fx=P(R*cos(t),R*sin(t)),fy=Q(R*cos(t),R*sin(t));stroke(220,100,40,150);strokeWeight(1);var len=Math.min(Math.sqrt(fx*fx+fy*fy)*15,25);var nm=Math.sqrt(fx*fx+fy*fy);if(nm>0.01)line(px2,py2,px2+fx/nm*len,py2-fy/nm*len);}
  var cpt={x:R*cos(animT),y:R*sin(animT)};fill(220,60,60);noStroke();ellipse(cx+cpt.x*sc,cy-cpt.y*sc,10,10);
  var lineInt=0,dt=0.001;for(var t2=0;t2<TWO_PI;t2+=dt){var x2=R*cos(t2),y2=R*sin(t2);var dxx=-R*sin(t2)*dt,dyy=R*cos(t2)*dt;lineInt+=P(x2,y2)*dxx+Q(x2,y2)*dyy;}
  var areaInt=2*PI*R*R;
  noStroke();fill(80);textSize(14);var infoY=height-90;
  fill(220,100,40);text("∮ Line integral ≈ "+lineInt.toFixed(3),width/2,infoY);
  fill(40,160,80);text("∬ 2 dA = 2·πR² = "+areaInt.toFixed(3),width/2,infoY+22);
  fill(220,60,60);textStyle(BOLD);text("Both equal! Green's theorem confirmed",width/2,infoY+46);textStyle(NORMAL);
}
