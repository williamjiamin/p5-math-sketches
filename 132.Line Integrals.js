/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var pathType = 0, animT = 0;
var PATHS = ["Circle","Line","Parabola"];
function Fx(x,y){return-y;}
function Fy(x,y){return x;}
function pathXY(t){
  if(pathType===0)return{x:2*cos(t),y:2*sin(t)};
  if(pathType===1)return{x:t-PI,y:t-PI};
  return{x:t-PI,y:(t-PI)*(t-PI)/2};
}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);animT=(animT+0.015)%(TWO_PI);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Line Integrals",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("∫_C F·dr  where F=(-y, x) along "+PATHS[pathType],width/2,52);
  var cx=width/2,cy=height/2+10,sc=50;
  stroke(220);strokeWeight(0.5);for(var gx=-4;gx<=4;gx++)line(cx+gx*sc,cy-4*sc,cx+gx*sc,cy+4*sc);for(var gy=-4;gy<=4;gy++)line(cx-4*sc,cy+gy*sc,cx+4*sc,cy+gy*sc);
  stroke(180);strokeWeight(1);line(cx-4*sc,cy,cx+4*sc,cy);line(cx,cy-4*sc,cx,cy+4*sc);
  for(var ix=-3;ix<=3;ix+=1){for(var iy=-3;iy<=3;iy+=1){var fx=Fx(ix,iy),fy=Fy(ix,iy);var mag=Math.sqrt(fx*fx+fy*fy);if(mag>0.01){var len=Math.min(mag*8,sc*0.6);var nx=fx/mag,ny=fy/mag;var sx=cx+ix*sc,sy=cy-iy*sc;stroke(200,180,220);strokeWeight(1);line(sx,sy,sx+nx*len,sy-ny*len);}}}
  noFill();stroke(80,60,200);strokeWeight(3);beginShape();for(var t=0;t<=TWO_PI;t+=0.02){var p=pathXY(t);vertex(cx+p.x*sc,cy-p.y*sc);}endShape();
  var cur=pathXY(animT);fill(220,60,60);noStroke();ellipse(cx+cur.x*sc,cy-cur.y*sc,10,10);
  var work=0,dt=0.01;for(var t2=0;t2<TWO_PI;t2+=dt){var p2=pathXY(t2),p3=pathXY(t2+dt);var dxx=p3.x-p2.x,dyy=p3.y-p2.y;work+=Fx(p2.x,p2.y)*dxx+Fy(p2.x,p2.y)*dyy;}
  noStroke();fill(220,60,60);textSize(16);textStyle(BOLD);text("∫ F·dr ≈ "+work.toFixed(3),width/2,height-80);textStyle(NORMAL);
  if(pathType===0){fill(100);textSize(12);text("(Exact for circle: 4π ≈ "+(4*PI).toFixed(3)+")",width/2,height-60);}
  var btnY=height-35;for(var k=0;k<3;k++)drawBtn(width/2+(k-1)*90-40,btnY,80,24,PATHS[k],k===pathType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;for(var k=0;k<3;k++){if(hitB(width/2+(k-1)*90-40,btnY,80,24))pathType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
