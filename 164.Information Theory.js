/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var pA = 0.5;
function entropy(p){if(p<=0||p>=1)return 0;return-(p*Math.log2(p)+(1-p)*Math.log2(1-p));}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Information Theory — Entropy",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("H(X) = -Σ p(x) log₂ p(x)  (bits of surprise)",width/2,52);
  var gx=100,gy=90,gw=width-200,gh=height-220,midY=gy+gh;
  var scX=gw,scY=gh;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(gx,gy,gx,midY);
  noFill();stroke(80,60,200);strokeWeight(2.5);beginShape();for(var px=0;px<=gw;px+=2){var p=px/gw;var h=entropy(p);vertex(gx+px,midY-h*scY);}endShape();
  var curX=gx+pA*gw,curY=midY-entropy(pA)*scY;
  fill(220,60,60);noStroke();ellipse(curX,curY,12,12);
  stroke(220,60,60,100);strokeWeight(1);drawingContext.setLineDash([4,4]);line(curX,curY,curX,midY);drawingContext.setLineDash([]);
  noStroke();fill(80);textSize(10);text("0",gx,midY+14);text("0.5",gx+gw/2,midY+14);text("1",gx+gw,midY+14);text("p",gx+gw/2,midY+28);text("H (bits)",gx-25,gy+gh/2);text("0",gx-10,midY);text("1",gx-10,gy);
  fill(80,60,200);textSize(16);textStyle(BOLD);text("p = "+pA.toFixed(2)+"   H = "+entropy(pA).toFixed(4)+" bits",width/2,midY+50);textStyle(NORMAL);
  fill(100);textSize(12);text("Max entropy at p=0.5 (most uncertain). Min at p=0 or p=1 (certain).",width/2,midY+75);
  var btnY=height-30;drawBtn(width/2-60,btnY,50,22,"p -");drawBtn(width/2+10,btnY,50,22,"p +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-30;if(hitB(width/2-60,btnY,50,22))pA=Math.max(0.01,+(pA-0.05).toFixed(2));if(hitB(width/2+10,btnY,50,22))pA=Math.min(0.99,+(pA+0.05).toFixed(2));}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
