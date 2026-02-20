/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var showSpan = true, v1 = {x:2,y:1}, v2 = {x:0,y:2}, scalar1 = 1, scalar2 = 1;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Vector Spaces & Span",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("Span{v₁,v₂} = all linear combinations c₁v₁ + c₂v₂",width/2,52);
  var cx=width/2,cy=height/2+10,sc=35;
  stroke(220);strokeWeight(0.5);for(var gx=-7;gx<=7;gx++)line(cx+gx*sc,cy-5*sc,cx+gx*sc,cy+5*sc);for(var gy=-5;gy<=5;gy++)line(cx-7*sc,cy+gy*sc,cx+7*sc,cy+gy*sc);
  stroke(180);strokeWeight(1.5);line(cx-7*sc,cy,cx+7*sc,cy);line(cx,cy-5*sc,cx,cy+5*sc);
  if(showSpan){fill(80,60,200,15);noStroke();rect(cx-7*sc,cy-5*sc,14*sc,10*sc);}
  drawArrow(cx,cy,cx+v1.x*sc,cy-v1.y*sc,color(80,60,200),3);
  drawArrow(cx,cy,cx+v2.x*sc,cy-v2.y*sc,color(220,100,40),3);
  var combo = {x:scalar1*v1.x+scalar2*v2.x, y:scalar1*v1.y+scalar2*v2.y};
  drawArrow(cx,cy,cx+combo.x*sc,cy-combo.y*sc,color(220,60,60),2.5);
  noStroke();fill(80,60,200);textSize(11);text("v₁("+v1.x+","+v1.y+")",cx+v1.x*sc/2-12,cy-v1.y*sc/2-12);
  fill(220,100,40);text("v₂("+v2.x+","+v2.y+")",cx+v2.x*sc/2+12,cy-v2.y*sc/2+12);
  fill(220,60,60);textStyle(BOLD);text(scalar1+"v₁+"+scalar2+"v₂=("+combo.x.toFixed(1)+","+combo.y.toFixed(1)+")",cx+combo.x*sc/2+20,cy-combo.y*sc/2-12);textStyle(NORMAL);
  var det=v1.x*v2.y-v1.y*v2.x;
  fill(80);textSize(13);text("det = "+det+"  →  "+(det!==0?"Linearly Independent (span = R²)":"Linearly Dependent"),width/2,height-80);
  var btnY=height-45;drawBtn(width/2-200,btnY,50,24,"c₁ -");drawBtn(width/2-145,btnY,50,24,"c₁ +");drawBtn(width/2-60,btnY,50,24,"c₂ -");drawBtn(width/2-5,btnY,50,24,"c₂ +");
  fill(100);textSize(11);text("c₁="+scalar1.toFixed(1)+"  c₂="+scalar2.toFixed(1),width/2+100,btnY+12);
}
function drawArrow(x1,y1,x2,y2,c,sw){stroke(c);strokeWeight(sw);line(x1,y1,x2,y2);var a=atan2(y2-y1,x2-x1);line(x2,y2,x2-10*cos(a-PI/6),y2-10*sin(a-PI/6));line(x2,y2,x2-10*cos(a+PI/6),y2-10*sin(a+PI/6));}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;if(hitB(width/2-200,btnY,50,24))scalar1=+(scalar1-0.5).toFixed(1);if(hitB(width/2-145,btnY,50,24))scalar1=+(scalar1+0.5).toFixed(1);if(hitB(width/2-60,btnY,50,24))scalar2=+(scalar2-0.5).toFixed(1);if(hitB(width/2-5,btnY,50,24))scalar2=+(scalar2+0.5).toFixed(1);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
