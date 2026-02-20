/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var funcType = 0;
var ODES = ["y'=y","y'=-y","y'=x","y'=x-y"];
function slope(x,y){if(funcType===0)return y;if(funcType===1)return-y;if(funcType===2)return x;return x-y;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("ODE Direction Fields",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(15);text(ODES[funcType],width/2,55);
  var cx=width/2,cy=height/2+10,sc=40,step=1,segLen=sc*0.4;
  stroke(200);strokeWeight(1);line(cx-5*sc,cy,cx+5*sc,cy);line(cx,cy-5*sc,cx,cy+5*sc);
  for(var ix=-4;ix<=4;ix+=step){for(var iy=-4;iy<=4;iy+=step){var m=slope(ix,iy);var ang=Math.atan(m);var dx=segLen*Math.cos(ang)/2,dy=segLen*Math.sin(ang)/2;var sx=cx+ix*sc,sy=cy-iy*sc;stroke(180,160,200);strokeWeight(1.5);line(sx-dx,sy+dy,sx+dx,sy-dy);}}
  noFill();stroke(220,60,60);strokeWeight(2);
  var sols=funcType===0?[0.5,1,-0.5,-1]:[0.5,1,-0.5,-1];
  for(var s=0;s<sols.length;s++){var y0=sols[s];beginShape();for(var t=-4;t<=4;t+=0.05){var yv;if(funcType===0)yv=y0*Math.exp(t);else if(funcType===1)yv=y0*Math.exp(-t);else if(funcType===2)yv=t*t/2+y0;else yv=t-1+(y0+1)*Math.exp(-t);
      var sy2=midToScreen(t,yv,cx,cy,sc);if(sy2.y>60&&sy2.y<height-60)vertex(sy2.x,sy2.y);}endShape();}
  var btnY=height-40;for(var k=0;k<4;k++)drawBtn(width/2+(k-2)*90+5,btnY,80,24,ODES[k],k===funcType);
}
function midToScreen(x,y,cx,cy,sc){return{x:cx+x*sc,y:cy-y*sc};}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;for(var k=0;k<4;k++){if(hitB(width/2+(k-2)*90+5,btnY,80,24))funcType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
