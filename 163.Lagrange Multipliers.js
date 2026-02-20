/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var constraintR = 1.5;
function f(x,y){return x*y;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Lagrange Multipliers",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("Maximize f(x,y) = xy subject to x²+y² = r²",width/2,52);
  var cx=width/2,cy=height/2+10,sc=80;
  stroke(220);strokeWeight(0.5);for(var gx=-3;gx<=3;gx++)line(cx+gx*sc,cy-3*sc,cx+gx*sc,cy+3*sc);for(var gy=-3;gy<=3;gy++)line(cx-3*sc,cy+gy*sc,cx+3*sc,cy+gy*sc);
  stroke(180);strokeWeight(1.5);line(cx-3*sc,cy,cx+3*sc,cy);line(cx,cy-3*sc,cx,cy+3*sc);
  for(var level=-3;level<=3;level+=0.5){if(Math.abs(level)<0.01)continue;noFill();stroke(80,60,200,40);strokeWeight(1);
    for(var px=0;px<width;px+=3){for(var py=0;py<height;py+=3){var xv=(px-cx)/sc,yv=(cy-py)/sc;if(Math.abs(xv*yv-level)<0.05){point(px,py);}}}}
  noFill();stroke(220,60,60);strokeWeight(3);ellipse(cx,cy,constraintR*2*sc,constraintR*2*sc);
  var optX=constraintR/Math.sqrt(2),optY=constraintR/Math.sqrt(2);
  fill(40,160,80);noStroke();ellipse(cx+optX*sc,cy-optY*sc,12,12);ellipse(cx-optX*sc,cy+optY*sc,12,12);
  fill(220,100,40);ellipse(cx+optX*sc,cy+optY*sc,10,10);ellipse(cx-optX*sc,cy-optY*sc,10,10);
  noStroke();fill(40,160,80);textSize(11);text("max: ("+optX.toFixed(2)+","+optY.toFixed(2)+")",cx+optX*sc+40,cy-optY*sc);
  fill(220,100,40);text("min",cx+optX*sc+20,cy+optY*sc+14);
  fill(80);textSize(13);text("max f = "+(optX*optY).toFixed(3)+"   at tangency of level curve and constraint",width/2,height-70);
  text("∇f = λ∇g   →   gradient condition",width/2,height-50);
  fill(220,60,60);textSize(12);text("r = "+constraintR.toFixed(1),width/2,75);
  var btnY=height-30;drawBtn(width/2-60,btnY,50,22,"r -");drawBtn(width/2+10,btnY,50,22,"r +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-30;if(hitB(width/2-60,btnY,50,22))constraintR=Math.max(0.5,+(constraintR-0.25).toFixed(2));if(hitB(width/2+10,btnY,50,22))constraintR=Math.min(2.5,+(constraintR+0.25).toFixed(2));}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
