/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var nSlices = 6;
function f(x,y){return 4-x*x-y*y;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Double Integrals – Volume Under Surface",width/2,25);textStyle(NORMAL);
  fill(80);textSize(13);text("∫∫ (4-x²-y²) dA over [0,1]×[0,1]",width/2,52);
  var gx=100,gy=80,gw=width-200,gh=height-200;
  var dx=1/nSlices,dy=1/nSlices;
  var cx=gx+gw/2,cy=gy+gh/2,sc=gw/3;
  var rotA=0.6;
  function proj(x,y,z){var ca=Math.cos(rotA),sa=Math.sin(rotA);var rx=x*ca-y*sa,ry=x*sa+y*ca;return{px:cx+rx*sc,py:cy-z*sc*0.6-ry*sc*0.4};}
  var vol=0;
  for(var i=0;i<nSlices;i++){for(var j=0;j<nSlices;j++){var xm=i*dx+dx/2,ym=j*dy+dy/2;var h=Math.max(0,f(xm,ym));vol+=h*dx*dy;
    var alpha=150+h*20;fill(80,60,200,alpha);stroke(80,60,200,180);strokeWeight(0.5);
    var p1=proj(i*dx,j*dy,0),p2=proj((i+1)*dx,j*dy,0),p3=proj((i+1)*dx,(j+1)*dy,0),p4=proj(i*dx,(j+1)*dy,0);
    var t1=proj(i*dx,j*dy,h),t2=proj((i+1)*dx,j*dy,h),t3=proj((i+1)*dx,(j+1)*dy,h),t4=proj(i*dx,(j+1)*dy,h);
    beginShape();vertex(t1.px,t1.py);vertex(t2.px,t2.py);vertex(t3.px,t3.py);vertex(t4.px,t4.py);endShape(CLOSE);
    stroke(80,60,200,60);line(p1.px,p1.py,t1.px,t1.py);line(p2.px,p2.py,t2.px,t2.py);}}
  noStroke();fill(220,60,60);textSize(16);textStyle(BOLD);text("Volume ≈ "+vol.toFixed(4),width/2,gy+gh+15);textStyle(NORMAL);
  fill(100);textSize(12);text("Exact = 10/3 ≈ 3.3333   Slices: "+nSlices+"×"+nSlices,width/2,gy+gh+38);
  var btnY=height-35;drawBtn(width/2-60,btnY,50,24,"n -");drawBtn(width/2+10,btnY,50,24,"n +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(11);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-60,btnY,50,24))nSlices=Math.max(2,nSlices-1);if(hitB(width/2+10,btnY,50,24))nSlices=Math.min(20,nSlices+1);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
