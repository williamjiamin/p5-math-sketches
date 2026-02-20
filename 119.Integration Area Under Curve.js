/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var aVal = 0, bVal = 3, funcType = 0;
var FUNCS = ["x²","sin(x)","eˣ","√x"];
function f(x){if(funcType===0)return x*x;if(funcType===1)return Math.sin(x);if(funcType===2)return Math.exp(x);return Math.sqrt(Math.max(0,x));}
function F(x){if(funcType===0)return x*x*x/3;if(funcType===1)return-Math.cos(x);if(funcType===2)return Math.exp(x);return 2*Math.pow(Math.max(0,x),1.5)/3;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Integration – Area Under Curve",width/2,25);textStyle(NORMAL);
  var area=F(bVal)-F(aVal);
  fill(80,60,200);textSize(14);text("∫ from "+aVal.toFixed(1)+" to "+bVal.toFixed(1)+" of "+FUNCS[funcType]+" dx = "+area.toFixed(4),width/2,55);
  var gx=80,gy=75,gw=width-160,gh=height-180,midY=gy+gh*0.75;
  var xMin=-1,xMax=5,scX=gw/(xMax-xMin),scY=gh/10;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(gx+(0-xMin)*scX,gy,gx+(0-xMin)*scX,gy+gh);
  fill(80,60,200,40);noStroke();beginShape();vertex(gx+(aVal-xMin)*scX,midY);for(var px=aVal;px<=bVal;px+=0.02){var yy=midY-f(px)*scY;vertex(gx+(px-xMin)*scX,yy);}vertex(gx+(bVal-xMin)*scX,midY);endShape(CLOSE);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px2=0;px2<gw;px2+=2){var xv=xMin+px2/gw*(xMax-xMin);var yv=f(xv);var sy=midY-yv*scY;if(sy>gy-50&&sy<gy+gh+50)vertex(gx+px2,sy);}endShape();
  stroke(220,60,60);strokeWeight(1.5);drawingContext.setLineDash([4,4]);line(gx+(aVal-xMin)*scX,gy,gx+(aVal-xMin)*scX,midY);line(gx+(bVal-xMin)*scX,gy,gx+(bVal-xMin)*scX,midY);drawingContext.setLineDash([]);
  noStroke();fill(220,60,60);textSize(11);text("a="+aVal.toFixed(1),gx+(aVal-xMin)*scX,midY+14);text("b="+bVal.toFixed(1),gx+(bVal-xMin)*scX,midY+14);
  var btnY=height-40;drawBtn(width/2-220,btnY,55,24,"a -");drawBtn(width/2-160,btnY,55,24,"a +");drawBtn(width/2-80,btnY,55,24,"b -");drawBtn(width/2-20,btnY,55,24,"b +");
  for(var k=0;k<4;k++)drawBtn(width/2+60+k*80,btnY,75,24,FUNCS[k],k===funcType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;if(hitB(width/2-220,btnY,55,24))aVal=Math.max(-1,+(aVal-0.5).toFixed(1));if(hitB(width/2-160,btnY,55,24))aVal=Math.min(bVal-0.5,+(aVal+0.5).toFixed(1));if(hitB(width/2-80,btnY,55,24))bVal=Math.max(aVal+0.5,+(bVal-0.5).toFixed(1));if(hitB(width/2-20,btnY,55,24))bVal=Math.min(5,+(bVal+0.5).toFixed(1));
  for(var k=0;k<4;k++){if(hitB(width/2+60+k*80,btnY,75,24))funcType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
