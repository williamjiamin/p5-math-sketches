/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var approach = 2, funcType = 0, delta = 2;
var FUNCS = ["x²","sin(x)/x","1/x","(x²-4)/(x-2)"];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function f(x){
  if(funcType===0)return x*x;
  if(funcType===1)return x!==0?Math.sin(x)/x:1;
  if(funcType===2)return x!==0?1/x:9999;
  return x!==2?(x*x-4)/(x-2):4;
}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Limits – Intuition",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(16);text("f(x) = "+FUNCS[funcType]+"   approaching x = "+approach.toFixed(1),width/2,55);
  var gx=80,gy=80,gw=width-160,gh=height-200,midX=gx+gw/2,midY=gy+gh/2;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(midX,gy,midX,gy+gh);
  var scX=gw/12,scY=gh/8;
  for(var i=-6;i<=6;i++){if(i!==0){noStroke();fill(180);textSize(8);text(i,midX+i*scX,midY+12);}}
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var xv=-6+px/gw*12;var yv=f(xv);var sy=midY-yv*scY;if(sy>gy-20&&sy<gy+gh+20)vertex(gx+px,sy);}endShape();
  delta=Math.max(0.01,delta-0.005);
  var leftX=approach-delta,rightX=approach+delta;
  var leftY=f(leftX),rightY=f(rightX);
  stroke(220,60,60,100);strokeWeight(1);drawingContext.setLineDash([4,4]);line(midX+approach*scX,gy,midX+approach*scX,gy+gh);drawingContext.setLineDash([]);
  fill(40,160,80);noStroke();ellipse(midX+leftX*scX,midY-leftY*scY,8,8);ellipse(midX+rightX*scX,midY-rightY*scY,8,8);
  var limVal=f(approach);noStroke();fill(220,60,60);textSize(14);textStyle(BOLD);text("lim → "+(isFinite(limVal)?limVal.toFixed(3):"∞"),width/2,gy+gh+25);textStyle(NORMAL);
  fill(100);textSize(11);text("Left: f("+leftX.toFixed(3)+") = "+leftY.toFixed(4)+"   Right: f("+rightX.toFixed(3)+") = "+rightY.toFixed(4),width/2,gy+gh+45);
  var btnY=height-40;for(var k=0;k<4;k++)drawBtn(width/2+(k-2)*95+8,btnY,88,24,FUNCS[k],k===funcType);drawBtn(width/2+210,btnY,60,24,"Reset");
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;for(var k=0;k<4;k++){if(hitB(width/2+(k-2)*95+8,btnY,88,24)){funcType=k;delta=2;if(k===0)approach=2;if(k===1)approach=0;if(k===2)approach=0;if(k===3)approach=2;}}if(hitB(width/2+210,btnY,60,24))delta=2;}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
