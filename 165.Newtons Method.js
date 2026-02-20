/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var xPos = 3, history = [3], funcType = 0;
var FUNCS = ["x²-2","x³-x-1","sin(x)"];
function f(x){if(funcType===0)return x*x-2;if(funcType===1)return x*x*x-x-1;return Math.sin(x);}
function df(x){if(funcType===0)return 2*x;if(funcType===1)return 3*x*x-1;return Math.cos(x);}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Newton's Method — Root Finding",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)",width/2,52);
  var gx=80,gy=70,gw=width-160,gh=height-190,midX=gx+gw/2,midY=gy+gh/2;
  var scX=gw/10,scY=gh/8;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(midX,gy,midX,gy+gh);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var xv=-5+px/gw*10;var yv=f(xv);var sy=midY-yv*scY;if(sy>gy-20&&sy<gy+gh+20)vertex(gx+px,sy);}endShape();
  for(var i=0;i<history.length;i++){var hx=midX+history[i]*scX,hy=midY-f(history[i])*scY;
    if(hy>gy&&hy<gy+gh){fill(i===history.length-1?color(220,60,60):color(220,100,40,150));noStroke();ellipse(hx,hy,8,8);}
    if(i===history.length-1){stroke(220,60,60);strokeWeight(1.5);var sl=df(history[i]);var tangY=function(x2){return f(history[i])+sl*(x2-history[i]);};line(gx,midY-tangY(-5)*scY,gx+gw,midY-tangY(5)*scY);}}
  noStroke();fill(220,60,60);textSize(13);textStyle(BOLD);text("x = "+xPos.toFixed(8)+"   f(x) = "+f(xPos).toFixed(8),width/2,gy+gh+15);textStyle(NORMAL);
  fill(80);textSize(11);text("Steps: "+(history.length-1),width/2,gy+gh+35);
  var btnY=height-30;drawBtn(width/2-130,btnY,60,22,"Step");drawBtn(width/2-65,btnY,60,22,"Reset");
  for(var k=0;k<3;k++)drawBtn(width/2+10+k*80,btnY,75,22,FUNCS[k],k===funcType);
}
function step2(){var d=df(xPos);if(Math.abs(d)>1e-10){xPos=xPos-f(xPos)/d;history.push(xPos);}}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-30;if(hitB(width/2-130,btnY,60,22))step2();if(hitB(width/2-65,btnY,60,22)){xPos=3;history=[3];}
  for(var k=0;k<3;k++){if(hitB(width/2+10+k*80,btnY,75,22)){funcType=k;xPos=3;history=[3];}}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
