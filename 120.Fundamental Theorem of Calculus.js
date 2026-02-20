/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var xPos = 2;
function f(x){return x*x;}
function F(x){return x*x*x/3;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Fundamental Theorem of Calculus",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("Part 1: d/dx [∫₀ˣ f(t)dt] = f(x)    Part 2: ∫ₐᵇ f(x)dx = F(b) - F(a)",width/2,50);
  var gx=60,gy=70,gw=(width-140)/2,gh=height-200;
  var midY1=gy+gh*0.75,scX=gw/5,scY=gh/10;
  noStroke();fill(80,60,200);textSize(13);textStyle(BOLD);text("f(x) = x²",gx+gw/2,gy-5);textStyle(NORMAL);
  stroke(200);strokeWeight(1);line(gx,midY1,gx+gw,midY1);line(gx,gy,gx,gy+gh);
  fill(80,60,200,40);noStroke();beginShape();vertex(gx,midY1);for(var t=0;t<=xPos;t+=0.02)vertex(gx+t*scX,midY1-f(t)*scY);vertex(gx+xPos*scX,midY1);endShape(CLOSE);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var xv=px/gw*5;vertex(gx+px,midY1-f(xv)*scY);}endShape();
  fill(220,60,60);noStroke();ellipse(gx+xPos*scX,midY1-f(xPos)*scY,8,8);
  stroke(220,60,60);strokeWeight(1);drawingContext.setLineDash([4,4]);line(gx+xPos*scX,midY1-f(xPos)*scY,gx+xPos*scX,midY1);drawingContext.setLineDash([]);
  var gx2=gx+gw+40,midY2=gy+gh*0.5,scY2=gh/8;
  noStroke();fill(40,160,80);textSize(13);textStyle(BOLD);text("F(x) = x³/3 (antiderivative)",gx2+gw/2,gy-5);textStyle(NORMAL);
  stroke(200);strokeWeight(1);line(gx2,midY2,gx2+gw,midY2);line(gx2,gy,gx2,gy+gh);
  noFill();stroke(40,160,80);strokeWeight(2);beginShape();for(var px2=0;px2<gw;px2+=2){var xv2=px2/gw*5;vertex(gx2+px2,midY2-F(xv2)*scY2);}endShape();
  fill(220,60,60);noStroke();ellipse(gx2+xPos*scX,midY2-F(xPos)*scY2,8,8);
  noStroke();fill(80);textSize(14);var infoY=gy+gh+15;
  text("x = "+xPos.toFixed(1),width/2,infoY);
  fill(80,60,200);text("∫₀ˣ t² dt = "+F(xPos).toFixed(3),width/2-140,infoY+22);
  fill(40,160,80);text("F(x) = x³/3 = "+F(xPos).toFixed(3),width/2+140,infoY+22);
  fill(220,60,60);textStyle(BOLD);text("d/dx[F(x)] = f(x) = "+f(xPos).toFixed(3),width/2,infoY+44);textStyle(NORMAL);
  var btnY=height-35;drawBtn(width/2-60,btnY,50,24,"x -");drawBtn(width/2+10,btnY,50,24,"x +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(11);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-60,btnY,50,24))xPos=Math.max(0,+(xPos-0.5).toFixed(1));if(hitB(width/2+10,btnY,50,24))xPos=Math.min(4.5,+(xPos+0.5).toFixed(1));}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
