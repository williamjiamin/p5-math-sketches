/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var mu = 0, sigma = 1;
function normalPDF(x){return Math.exp(-0.5*Math.pow((x-mu)/sigma,2))/(sigma*Math.sqrt(2*Math.PI));}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Normal Distribution",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("f(x) = (1/σ√2π) e^(-(x-μ)²/2σ²)",width/2,52);
  fill(80,60,200);textSize(14);text("μ = "+mu.toFixed(1)+"   σ = "+sigma.toFixed(1),width/2,72);
  var gx=60,gy=90,gw=width-120,gh=height-200;
  var xMin=mu-4*sigma,xMax=mu+4*sigma,midY=gy+gh;
  var scX=gw/(xMax-xMin),maxP=normalPDF(mu),scY=gh*0.9/maxP;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);
  fill(80,60,200,40);noStroke();beginShape();vertex(gx,midY);for(var px=0;px<=gw;px+=2){var xv=xMin+px/gw*(xMax-xMin);vertex(gx+px,midY-normalPDF(xv)*scY);}vertex(gx+gw,midY);endShape(CLOSE);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px2=0;px2<=gw;px2+=2){var xv2=xMin+px2/gw*(xMax-xMin);vertex(gx+px2,midY-normalPDF(xv2)*scY);}endShape();
  stroke(220,60,60);strokeWeight(1.5);drawingContext.setLineDash([4,4]);var mx=gx+(mu-xMin)*scX;line(mx,gy,mx,midY);drawingContext.setLineDash([]);
  for(var s=-2;s<=2;s++){if(s!==0){var sx=gx+(mu+s*sigma-xMin)*scX;stroke(180);strokeWeight(0.5);line(sx,midY-5,sx,midY+5);noStroke();fill(150);textSize(9);text((s>0?"+":"")+s+"σ",sx,midY+14);}}
  noStroke();fill(80);textSize(11);
  text("68% within ±1σ",width/2-150,midY+30);text("95% within ±2σ",width/2,midY+30);text("99.7% within ±3σ",width/2+150,midY+30);
  var btnY=height-35;drawBtn(width/2-120,btnY,55,24,"μ -");drawBtn(width/2-60,btnY,55,24,"μ +");drawBtn(width/2+20,btnY,55,24,"σ -");drawBtn(width/2+80,btnY,55,24,"σ +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-120,btnY,55,24))mu=+(mu-0.5).toFixed(1);if(hitB(width/2-60,btnY,55,24))mu=+(mu+0.5).toFixed(1);if(hitB(width/2+20,btnY,55,24))sigma=Math.max(0.3,+(sigma-0.3).toFixed(1));if(hitB(width/2+80,btnY,55,24))sigma=Math.min(4,+(sigma+0.3).toFixed(1));}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
