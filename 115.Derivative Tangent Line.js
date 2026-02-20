/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var xPos = 1, funcType = 0;
var FUNCS = ["x²","x³","sin(x)","eˣ"];
function f(x){if(funcType===0)return x*x;if(funcType===1)return x*x*x;if(funcType===2)return Math.sin(x);return Math.exp(x);}
function df(x){if(funcType===0)return 2*x;if(funcType===1)return 3*x*x;if(funcType===2)return Math.cos(x);return Math.exp(x);}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Derivative as Tangent Line",width/2,25);textStyle(NORMAL);
  var gx=80,gy=70,gw=width-160,gh=height-180,midX=gx+gw/2,midY=gy+gh/2;
  var scX=gw/10,scY=gh/8;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(midX,gy,midX,gy+gh);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var xv=-5+px/gw*10;var yv=f(xv);var sy=midY-yv*scY;if(sy>gy-50&&sy<gy+gh+50)vertex(gx+px,sy);}endShape();
  var fVal=f(xPos),slope=df(xPos);
  var px2=midX+xPos*scX,py2=midY-fVal*scY;
  stroke(220,60,60);strokeWeight(2);var tLen=3;line(px2-tLen*scX,py2+tLen*slope*scY,px2+tLen*scX,py2-tLen*slope*scY);
  fill(40,160,80);noStroke();ellipse(px2,py2,10,10);
  noStroke();fill(80,60,200);textSize(16);textStyle(BOLD);text("f(x) = "+FUNCS[funcType],width/2,55);textStyle(NORMAL);
  fill(220,60,60);textSize(14);text("f'("+xPos.toFixed(1)+") = "+slope.toFixed(3),width/2,gy+gh+20);
  fill(80);textSize(12);text("Slope of tangent = "+slope.toFixed(3)+"   f("+xPos.toFixed(1)+") = "+fVal.toFixed(3),width/2,gy+gh+42);
  var btnY=height-40;drawBtn(width/2-200,btnY,55,24,"x -");drawBtn(width/2-140,btnY,55,24,"x +");
  for(var k=0;k<4;k++)drawBtn(width/2+(k-1)*80-20,btnY,75,24,FUNCS[k],k===funcType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;if(hitB(width/2-200,btnY,55,24))xPos=Math.max(-4,+(xPos-0.5).toFixed(1));if(hitB(width/2-140,btnY,55,24))xPos=Math.min(4,+(xPos+0.5).toFixed(1));
  for(var k=0;k<4;k++){if(hitB(width/2+(k-1)*80-20,btnY,75,24))funcType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
