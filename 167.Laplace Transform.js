/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var funcType = 0;
var FUNCS = ["1 (step)","t","e^(-t)","sin(t)"];
var LAPLACE = ["1/s","1/s²","1/(s+1)","1/(s²+1)"];
function ft(t){if(funcType===0)return 1;if(funcType===1)return t;if(funcType===2)return Math.exp(-t);return Math.sin(t);}
function Fs(s){if(funcType===0)return s>0?1/s:10;if(funcType===1)return s>0?1/(s*s):10;if(funcType===2)return 1/(s+1);return 1/(s*s+1);}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Laplace Transform",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("L{f(t)} = F(s) = ∫₀^∞ f(t)e^(-st) dt",width/2,52);
  fill(80,60,200);textSize(14);textStyle(BOLD);text("f(t) = "+FUNCS[funcType]+"  →  F(s) = "+LAPLACE[funcType],width/2,75);textStyle(NORMAL);
  var gx1=50,gy=100,gw=(width-120)/2,gh=height-220;
  noStroke();fill(80,60,200);textSize(12);text("Time domain: f(t)",gx1+gw/2,gy-8);
  var midY1=gy+gh*0.7,scX1=gw/8,scY1=gh/3;
  stroke(200);strokeWeight(1);line(gx1,midY1,gx1+gw,midY1);line(gx1,gy,gx1,gy+gh);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var tv=px/gw*8;var yv=ft(tv);var sy=midY1-yv*scY1;if(sy>gy&&sy<gy+gh)vertex(gx1+px,sy);}endShape();
  var gx2=gx1+gw+20;
  noStroke();fill(220,60,60);textSize(12);text("Frequency domain: F(s)",gx2+gw/2,gy-8);
  var midY2=gy+gh*0.7,scX2=gw/6,scY2=gh/3;
  stroke(200);strokeWeight(1);line(gx2,midY2,gx2+gw,midY2);line(gx2,gy,gx2,gy+gh);
  noFill();stroke(220,60,60);strokeWeight(2);beginShape();for(var px2=0;px2<gw;px2+=2){var sv=0.1+px2/gw*6;var fv=Fs(sv);var sy2=midY2-fv*scY2;if(sy2>gy&&sy2<gy+gh)vertex(gx2+px2,sy2);}endShape();
  noStroke();fill(80);textSize(11);text("t →",gx1+gw-15,midY1+14);text("s →",gx2+gw-15,midY2+14);
  var btnY=height-35;for(var k=0;k<4;k++)drawBtn(width/2+(k-2)*95+5,btnY,88,24,FUNCS[k],k===funcType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;for(var k=0;k<4;k++){if(hitB(width/2+(k-2)*95+5,btnY,88,24))funcType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
