/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var h = 0.5, y0 = 1, nSteps = 10;
function f(x,y){return y;}
function exact(x){return Math.exp(x);}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Euler's Method",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("y' = y,  y(0) = 1   (exact: y = eˣ)   step h = "+h.toFixed(2),width/2,52);
  var gx=80,gy=70,gw=width-160,gh=height-180,midY=gy+gh*0.8;
  var xMax=h*nSteps,scX=gw/Math.max(xMax,1),scY=gh*0.7/Math.max(exact(xMax),2);
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(gx,gy,gx,midY);
  noFill();stroke(180);strokeWeight(2);beginShape();for(var px=0;px<=gw;px+=2){var xv=px/scX;var yv=exact(xv);var sy=midY-yv*scY;if(sy>gy-20)vertex(gx+px,sy);}endShape();
  stroke(220,60,60);strokeWeight(2);var ex=0,ey=y0;
  for(var i=0;i<nSteps;i++){var newY=ey+h*f(ex,ey);var sx1=gx+ex*scX,sy1=midY-ey*scY;var sx2=gx+(ex+h)*scX,sy2=midY-newY*scY;line(sx1,sy1,sx2,sy2);fill(220,60,60);noStroke();ellipse(sx1,sy1,6,6);stroke(220,60,60);strokeWeight(2);ex+=h;ey=newY;}
  fill(220,60,60);noStroke();ellipse(gx+ex*scX,midY-ey*scY,6,6);
  noStroke();fill(180);textSize(10);text("exact",gx+gw-30,gy+12);fill(220,60,60);text("Euler",gx+gw-30,gy+25);
  fill(80);textSize(13);text("Euler y("+xMax.toFixed(1)+") = "+ey.toFixed(3)+"   Exact = "+exact(xMax).toFixed(3)+"   Error = "+Math.abs(ey-exact(xMax)).toFixed(3),width/2,midY+25);
  var btnY=height-35;drawBtn(width/2-120,btnY,55,24,"h / 2");drawBtn(width/2-60,btnY,55,24,"h × 2");drawBtn(width/2+20,btnY,55,24,"Steps-");drawBtn(width/2+80,btnY,55,24,"Steps+");
}
function drawBtn(x,y,w,h2,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h2;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h2,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h2/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-120,btnY,55,24))h=Math.max(0.05,h/2);if(hitB(width/2-60,btnY,55,24))h=Math.min(2,h*2);if(hitB(width/2+20,btnY,55,24))nSteps=Math.max(2,nSteps-2);if(hitB(width/2+80,btnY,55,24))nSteps=Math.min(50,nSteps+2);}
function hitB(x,y,w,h2){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h2;}
