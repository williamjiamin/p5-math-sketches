/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var curveParam = 0, showCurvature = true;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);curveParam=(curveParam+0.005)%1;noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Differential Geometry — Curvature",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("Curvature κ measures how fast a curve changes direction",width/2,52);
  var cx=width/2,cy=height/2+20;
  var pts=[];for(var i=0;i<=200;i++){var t=TWO_PI*i/200;pts.push({x:cx+150*cos(t),y:cy+100*sin(t)});}
  noFill();stroke(80,60,200);strokeWeight(2.5);beginShape();for(var j=0;j<pts.length;j++)vertex(pts[j].x,pts[j].y);endShape();
  var idx=Math.floor(curveParam*200);var p=pts[idx];
  fill(220,60,60);noStroke();ellipse(p.x,p.y,10,10);
  if(showCurvature&&idx>0&&idx<pts.length-1){var prev=pts[idx-1],next=pts[idx+1];var dx1=p.x-prev.x,dy1=p.y-prev.y,dx2=next.x-p.x,dy2=next.y-p.y;
    var dTheta=atan2(dy2,dx2)-atan2(dy1,dx1);var ds=Math.sqrt(dx1*dx1+dy1*dy1);var kappa=ds>0.01?Math.abs(dTheta)/ds:0;
    var R=kappa>0.001?1/kappa:9999;
    var nx=-(next.y-prev.y),ny=next.x-prev.x;var nm=Math.sqrt(nx*nx+ny*ny);if(nm>0.01){nx/=nm;ny/=nm;}
    var ccx=p.x+nx*R,ccy=p.y+ny*R;
    if(R<400){noFill();stroke(220,100,40,100);strokeWeight(1);ellipse(ccx,ccy,R*2,R*2);
      stroke(220,60,60,150);strokeWeight(1);line(p.x,p.y,ccx,ccy);}
    noStroke();fill(80);textSize(13);text("κ = "+kappa.toFixed(4)+"   R = "+(R<400?R.toFixed(1):"∞"),width/2,height-80);
    fill(100);textSize(11);text("Ellipse: κ varies — high at ends of major axis, low at minor axis ends",width/2,height-58);}
  var a=150,b=100;noStroke();fill(80,60,200);textSize(12);text("a="+a+"  b="+b+"  (ellipse)",width/2,75);
  var btnY=height-35;drawBtn(width/2-40,btnY,80,24,showCurvature?"Hide R":"Show R");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-40,btnY,80,24))showCurvature=!showCurvature;}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
