/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var depth = 3;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Koch Snowflake",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("Infinite perimeter, finite area. Dimension ≈ log(4)/log(3) ≈ 1.262",width/2,52);
  var cx=width/2,cy=height/2+10,r=180;
  var pts=[{x:cx+r*cos(-HALF_PI),y:cy+r*sin(-HALF_PI)},{x:cx+r*cos(-HALF_PI+TWO_PI/3),y:cy+r*sin(-HALF_PI+TWO_PI/3)},{x:cx+r*cos(-HALF_PI+2*TWO_PI/3),y:cy+r*sin(-HALF_PI+2*TWO_PI/3)}];
  for(var d=0;d<depth;d++){var newPts=[];for(var i=0;i<pts.length;i++){var a=pts[i],b=pts[(i+1)%pts.length];var dx=b.x-a.x,dy=b.y-a.y;var p1={x:a.x+dx/3,y:a.y+dy/3};var p3={x:a.x+2*dx/3,y:a.y+2*dy/3};var mx=a.x+dx/2,my=a.y+dy/2;var p2={x:mx+dy*Math.sqrt(3)/6,y:my-dx*Math.sqrt(3)/6};newPts.push(a,p1,p2,p3);}pts=newPts;}
  fill(80,60,200,40);stroke(80,60,200);strokeWeight(1.5);beginShape();for(var j=0;j<pts.length;j++)vertex(pts[j].x,pts[j].y);endShape(CLOSE);
  fill(80,60,200);noStroke();textSize(13);text("Depth: "+depth+"   Segments: "+3*Math.pow(4,depth),width/2,height-45);
  drawBtn(width/2-60,height-30,50,22,"- Depth");drawBtn(width/2+10,height-30,50,22,"+ Depth");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){if(hitB(width/2-60,height-30,50,22))depth=Math.max(0,depth-1);if(hitB(width/2+10,height-30,50,22))depth=Math.min(6,depth+1);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
