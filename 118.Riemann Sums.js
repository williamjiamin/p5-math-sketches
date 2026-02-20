/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var nRects = 8, a = 0, b = 3, sumType = 0;
var TYPES = ["Left","Right","Midpoint"];
function f(x){return x*x;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Riemann Sums",width/2,25);textStyle(NORMAL);
  fill(80);textSize(13);text("Approximating ∫₀³ x² dx  using "+nRects+" rectangles ("+TYPES[sumType]+")",width/2,55);
  var gx=80,gy=70,gw=width-160,gh=height-180,midY=gy+gh;
  var scX=gw/(b-a+1),scY=gh/12;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(gx,gy,gx,midY);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var xv=a-0.5+px/gw*(b-a+1);var yv=f(xv);vertex(gx+px,midY-yv*scY);}endShape();
  var dx=(b-a)/nRects,total2=0;
  for(var i=0;i<nRects;i++){var xi;if(sumType===0)xi=a+i*dx;else if(sumType===1)xi=a+(i+1)*dx;else xi=a+(i+0.5)*dx;
    var hi=f(xi);total2+=hi*dx;var rx=gx+(a+i*dx-a+0.5)*scX,rw=dx*scX,rh=hi*scY;
    fill(80,60,200,60);stroke(80,60,200);strokeWeight(1);rect(rx,midY-rh,rw,rh);}
  var exact=9;noStroke();fill(220,60,60);textSize(16);textStyle(BOLD);text("Sum ≈ "+total2.toFixed(4),width/2,midY+25);textStyle(NORMAL);
  fill(100);textSize(12);text("Exact = "+exact+"   Error = "+Math.abs(total2-exact).toFixed(4),width/2,midY+45);
  var btnY=height-40;drawBtn(width/2-200,btnY,55,24,"n -");drawBtn(width/2-140,btnY,55,24,"n +");
  for(var k=0;k<3;k++)drawBtn(width/2+(k-1)*80,btnY,75,24,TYPES[k],k===sumType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;if(hitB(width/2-200,btnY,55,24))nRects=Math.max(1,nRects-1);if(hitB(width/2-140,btnY,55,24))nRects=Math.min(100,nRects+1);
  for(var k=0;k<3;k++){if(hitB(width/2+(k-1)*80,btnY,75,24))sumType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
