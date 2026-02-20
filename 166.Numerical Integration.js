/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var nPts = 8, methodType = 0;
var METHODS = ["Trapezoidal","Simpson's","Monte Carlo"];
function f(x){return Math.sin(x)+1.5;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Numerical Integration Methods",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(14);text(METHODS[methodType]+"   n = "+nPts,width/2,55);
  var a=0,b=PI,gx=80,gy=80,gw=width-160,gh=height-200,midY=gy+gh;
  var scX=gw/(b-a+1),scY=gh/3,exact=PI+3*PI/2;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var xv=a-0.5+px/gw*(b-a+1);vertex(gx+px,midY-f(xv)*scY);}endShape();
  var result=0;
  if(methodType===0){var dx=(b-a)/nPts;result=0;for(var i=0;i<=nPts;i++){var x=a+i*dx;var w2=(i===0||i===nPts)?0.5:1;result+=w2*f(x)*dx;}
    fill(80,60,200,40);stroke(80,60,200,80);strokeWeight(1);for(var i2=0;i2<nPts;i2++){var x1=a+i2*dx,x2=a+(i2+1)*dx;beginShape();vertex(gx+(x1-a+0.5)*scX,midY);vertex(gx+(x1-a+0.5)*scX,midY-f(x1)*scY);vertex(gx+(x2-a+0.5)*scX,midY-f(x2)*scY);vertex(gx+(x2-a+0.5)*scX,midY);endShape(CLOSE);}}
  else if(methodType===1){var dx2=(b-a)/nPts;result=0;if(nPts%2!==0)nPts++;for(var i3=0;i3<=nPts;i3++){var x3=a+i3*dx2;var w3=i3===0||i3===nPts?1:(i3%2===0?2:4);result+=w3*f(x3);}result*=dx2/3;
    fill(80,60,200,40);noStroke();beginShape();vertex(gx+(a-a+0.5)*scX,midY);for(var i4=0;i4<=nPts;i4++){var x4=a+i4*dx2;vertex(gx+(x4-a+0.5)*scX,midY-f(x4)*scY);}vertex(gx+(b-a+0.5)*scX,midY);endShape(CLOSE);}
  else{result=0;var hits=0,maxY=3;for(var i5=0;i5<nPts*50;i5++){var rx=a+Math.random()*(b-a),ry=Math.random()*maxY;if(ry<=f(rx))hits++;fill(ry<=f(rx)?color(40,160,80,60):color(220,60,60,30));noStroke();ellipse(gx+(rx-a+0.5)*scX,midY-ry*scY,3,3);}result=hits/(nPts*50)*(b-a)*maxY;}
  noStroke();fill(220,60,60);textSize(16);textStyle(BOLD);text("≈ "+result.toFixed(4),width/2,midY+20);textStyle(NORMAL);
  fill(80);textSize(12);text("Exact = "+(exact).toFixed(4)+"   Error = "+Math.abs(result-exact).toFixed(4),width/2,midY+42);
  var btnY=height-35;drawBtn(width/2-200,btnY,55,24,"n -");drawBtn(width/2-140,btnY,55,24,"n +");
  for(var k=0;k<3;k++)drawBtn(width/2+(k-1)*95-30,btnY,90,24,METHODS[k],k===methodType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-200,btnY,55,24))nPts=Math.max(2,nPts-2);if(hitB(width/2-140,btnY,55,24))nPts=Math.min(100,nPts+2);
  for(var k=0;k<3;k++){if(hitB(width/2+(k-1)*95-30,btnY,90,24))methodType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
