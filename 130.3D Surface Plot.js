/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var funcType = 0, rotAngle = 0.8;
var FUNCS = ["x²+y²","sin(x)·cos(y)","x·y","cos(√(x²+y²))"];
function f(x,y){if(funcType===0)return x*x+y*y;if(funcType===1)return Math.sin(x)*Math.cos(y);if(funcType===2)return x*y;return Math.cos(Math.sqrt(x*x+y*y)*2);}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function proj(x,y,z){var ca=Math.cos(rotAngle),sa=Math.sin(rotAngle);var rx=x*ca-y*sa,ry=x*sa+y*ca;return{px:width/2+rx*25,py:height/2-z*20-ry*12};}
function draw(){
  background(245,247,252);rotAngle+=0.003;noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("3D Surface Plot",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(14);text("z = "+FUNCS[funcType],width/2,52);
  var step=0.5,range=3;
  for(var ix=-range;ix<=range;ix+=step){stroke(80,60,200,80);strokeWeight(1);var first=true;for(var iy=-range;iy<=range;iy+=step/2){var z=f(ix,iy);var p=proj(ix,iy,z);if(first){first=false;}else{var pp=proj(ix,iy-step/2,f(ix,iy-step/2));line(pp.px,pp.py,p.px,p.py);}}}
  for(var iy2=-range;iy2<=range;iy2+=step){stroke(80,60,200,80);strokeWeight(1);for(var ix2=-range;ix2<range;ix2+=step/2){var z1=f(ix2,iy2),z2=f(ix2+step/2,iy2);var p1=proj(ix2,iy2,z1),p2=proj(ix2+step/2,iy2,z2);line(p1.px,p1.py,p2.px,p2.py);}}
  var ap=proj(4,0,0),bp=proj(0,4,0),cp=proj(0,0,4);stroke(220,60,60);strokeWeight(2);line(width/2,height/2,ap.px,ap.py);stroke(40,160,80);line(width/2,height/2,bp.px,bp.py);stroke(80,60,200);line(width/2,height/2,cp.px,cp.py);
  noStroke();fill(220,60,60);textSize(10);text("x",ap.px+8,ap.py);fill(40,160,80);text("y",bp.px+8,bp.py);fill(80,60,200);text("z",cp.px+8,cp.py);
  var btnY=height-40;for(var k=0;k<4;k++)drawBtn(width/2+(k-2)*100+10,btnY,90,24,FUNCS[k],k===funcType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;for(var k=0;k<4;k++){if(hitB(width/2+(k-2)*100+10,btnY,90,24))funcType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
