/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var mu0 = 0, xBar = 1.5, n = 25, sigma = 2, alpha = 0.05;
function normalPDF(x,m,s){return Math.exp(-0.5*Math.pow((x-m)/s,2))/(s*Math.sqrt(2*Math.PI));}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Hypothesis Testing (Z-test)",width/2,25);textStyle(NORMAL);
  var se=sigma/Math.sqrt(n);var z=(xBar-mu0)/se;
  var zCrit=alpha===0.05?1.96:2.576;
  var reject=Math.abs(z)>zCrit;
  fill(80);textSize(12);text("H₀: μ = "+mu0+"   H₁: μ ≠ "+mu0+"   (two-tailed, α = "+alpha+")",width/2,52);
  fill(80,60,200);textSize(13);text("x̄ = "+xBar.toFixed(1)+"   n = "+n+"   σ = "+sigma+"   SE = "+se.toFixed(3),width/2,72);
  var gx=80,gy=100,gw=width-160,gh=height-220,midY=gy+gh;
  var xMin=-4,xMax=4,scX=gw/(xMax-xMin),maxP=normalPDF(0,0,1),scY=gh*0.9/maxP;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);
  fill(220,60,60,50);noStroke();beginShape();vertex(gx,midY);for(var px=0;px<=gw;px+=2){var xv=xMin+px/gw*(xMax-xMin);if(xv<-zCrit||xv>zCrit)vertex(gx+px,midY-normalPDF(xv,0,1)*scY);else vertex(gx+px,midY);}vertex(gx+gw,midY);endShape(CLOSE);
  fill(80,60,200,40);noStroke();beginShape();vertex(gx,midY);for(var px2=0;px2<=gw;px2+=2){var xv2=xMin+px2/gw*(xMax-xMin);vertex(gx+px2,midY-normalPDF(xv2,0,1)*scY);}vertex(gx+gw,midY);endShape(CLOSE);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px3=0;px3<=gw;px3+=2){var xv3=xMin+px3/gw*(xMax-xMin);vertex(gx+px3,midY-normalPDF(xv3,0,1)*scY);}endShape();
  var zx=gx+(z-xMin)*scX;stroke(220,60,60);strokeWeight(2);line(zx,gy,zx,midY);
  noStroke();fill(220,60,60);textSize(11);text("z="+z.toFixed(2),zx,gy-10);
  stroke(180);strokeWeight(1);drawingContext.setLineDash([4,4]);line(gx+(-zCrit-xMin)*scX,gy,gx+(-zCrit-xMin)*scX,midY);line(gx+(zCrit-xMin)*scX,gy,gx+(zCrit-xMin)*scX,midY);drawingContext.setLineDash([]);
  noStroke();fill(reject?color(220,60,60):color(40,160,80));textSize(18);textStyle(BOLD);text(reject?"Reject H₀":"Fail to Reject H₀",width/2,midY+25);textStyle(NORMAL);
  fill(80);textSize(12);text("z = "+z.toFixed(3)+"   z_crit = ±"+zCrit.toFixed(3),width/2,midY+48);
  var btnY=height-35;drawBtn(width/2-180,btnY,55,24,"x̄ -");drawBtn(width/2-120,btnY,55,24,"x̄ +");drawBtn(width/2-40,btnY,55,24,"n -");drawBtn(width/2+20,btnY,55,24,"n +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-180,btnY,55,24))xBar=+(xBar-0.5).toFixed(1);if(hitB(width/2-120,btnY,55,24))xBar=+(xBar+0.5).toFixed(1);if(hitB(width/2-40,btnY,55,24))n=Math.max(2,n-5);if(hitB(width/2+20,btnY,55,24))n=Math.min(200,n+5);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
