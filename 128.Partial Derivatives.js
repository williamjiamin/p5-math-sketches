/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var px = 1.5, py2 = 1.0, showDx = true, showDy = true;
function f(x,y){return x*x+y*y;}
function dfx(x){return 2*x;}
function dfy(y){return 2*y;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Partial Derivatives",width/2,25);textStyle(NORMAL);
  fill(80);textSize(13);text("f(x,y) = x² + y²   at point ("+px.toFixed(1)+", "+py2.toFixed(1)+")",width/2,55);
  var cx=width/2,cy=height/2,sc=50;
  stroke(200);strokeWeight(1);for(var g=-4;g<=4;g++){line(cx+g*sc,cy-4*sc,cx+g*sc,cy+4*sc);line(cx-4*sc,cy+g*sc,cx+4*sc,cy+g*sc);}
  stroke(180);strokeWeight(1.5);line(cx-4*sc,cy,cx+4*sc,cy);line(cx,cy-4*sc,cx,cy+4*sc);
  for(var level=1;level<=8;level+=1){noFill();stroke(80,60,200,40+level*15);strokeWeight(1);var r2=Math.sqrt(level)*sc;ellipse(cx,cy,r2*2,r2*2);}
  var ptX=cx+px*sc,ptY=cy-py2*sc;
  fill(220,60,60);noStroke();ellipse(ptX,ptY,12,12);
  if(showDx){stroke(220,100,40);strokeWeight(2);var slopeX=dfx(px);drawArrow(ptX,ptY,ptX+sc,ptY-slopeX*sc*0.3,color(220,100,40));}
  if(showDy){stroke(40,160,80);strokeWeight(2);var slopeY=dfy(py2);drawArrow(ptX,ptY,ptX,ptY-sc-slopeY*sc*0.3,color(40,160,80));}
  noStroke();fill(80);textSize(14);var infoY=height-100;
  text("f("+px.toFixed(1)+","+py2.toFixed(1)+") = "+f(px,py2).toFixed(2),width/2,infoY);
  fill(220,100,40);text("∂f/∂x = 2x = "+dfx(px).toFixed(2),width/2-120,infoY+22);
  fill(40,160,80);text("∂f/∂y = 2y = "+dfy(py2).toFixed(2),width/2+120,infoY+22);
  fill(80,60,200);text("∇f = ("+dfx(px).toFixed(1)+", "+dfy(py2).toFixed(1)+")",width/2,infoY+44);
  var btnY=height-40;drawBtn2(width/2-170,btnY,50,24,"x -");drawBtn2(width/2-115,btnY,50,24,"x +");drawBtn2(width/2-30,btnY,50,24,"y -");drawBtn2(width/2+25,btnY,50,24,"y +");
}
function drawArrow(x1,y1,x2,y2,c){stroke(c);strokeWeight(2);line(x1,y1,x2,y2);var a=atan2(y2-y1,x2-x1);line(x2,y2,x2-8*cos(a-PI/6),y2-8*sin(a-PI/6));line(x2,y2,x2-8*cos(a+PI/6),y2-8*sin(a+PI/6));}
function drawBtn2(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;if(hitB(width/2-170,btnY,50,24))px=Math.max(-3,+(px-0.5).toFixed(1));if(hitB(width/2-115,btnY,50,24))px=Math.min(3,+(px+0.5).toFixed(1));if(hitB(width/2-30,btnY,50,24))py2=Math.max(-3,+(py2-0.5).toFixed(1));if(hitB(width/2+25,btnY,50,24))py2=Math.min(3,+(py2+0.5).toFixed(1));}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
