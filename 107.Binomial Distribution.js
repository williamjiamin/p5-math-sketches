/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var n=10,p=0.5;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function factorial(x){var f=1;for(var i=2;i<=x;i++)f*=i;return f;}
function comb(n,k){if(k>n||k<0)return 0;return factorial(n)/(factorial(k)*factorial(n-k));}
function binomPMF(k){return comb(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Binomial Distribution",width/2,25);textStyle(NORMAL);
  fill(80);textSize(13);text("P(X=k) = C(n,k) × p^k × (1-p)^(n-k)",width/2,52);
  fill(80,60,200);textSize(15);textStyle(BOLD);text("n="+n+"  p="+p.toFixed(2),width/2,75);textStyle(NORMAL);
  var mean=n*p,variance=n*p*(1-p);fill(100);textSize(12);text("μ = np = "+mean.toFixed(1)+"   σ² = np(1-p) = "+variance.toFixed(2),width/2,95);
  var gx=60,gy=120,gw=width-120,gh=height-220;
  var maxP=0;for(var k=0;k<=n;k++){var pk=binomPMF(k);if(pk>maxP)maxP=pk;}if(maxP<0.01)maxP=0.1;
  stroke(200);strokeWeight(1);line(gx,gy+gh,gx+gw,gy+gh);line(gx,gy,gx,gy+gh);
  var barW=Math.min(40,gw/(n+1)-4);
  for(var k2=0;k2<=n;k2++){var pk2=binomPMF(k2);var bh=pk2/maxP*gh*0.9;var bx=gx+20+(k2/(n+1))*gw;var hov=mouseX>bx&&mouseX<bx+barW&&mouseY>gy+gh-bh&&mouseY<gy+gh;fill(hov?color(220,100,40):color(80,60,200));noStroke();rect(bx,gy+gh-bh,barW,bh,3,3,0,0);fill(80);textSize(9);text(k2,bx+barW/2,gy+gh+12);if(hov||pk2>0.01){fill(80,60,200);textSize(8);text(pk2.toFixed(3),bx+barW/2,gy+gh-bh-10);}}
  stroke(220,60,60);strokeWeight(1.5);drawingContext.setLineDash([4,4]);var mx=gx+20+(mean/(n+1))*gw+barW/2;line(mx,gy,mx,gy+gh);drawingContext.setLineDash([]);noStroke();fill(220,60,60);textSize(10);text("μ",mx,gy-8);
  var btnY=height-45;drawBtn(width/2-200,btnY,55,26,"n -");drawBtn(width/2-140,btnY,55,26,"n +");drawBtn(width/2-40,btnY,55,26,"p -");drawBtn(width/2+20,btnY,55,26,"p +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(hov?255:60);textSize(11);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;if(hitB(width/2-200,btnY,55,26))n=Math.max(1,n-1);if(hitB(width/2-140,btnY,55,26))n=Math.min(20,n+1);if(hitB(width/2-40,btnY,55,26))p=Math.max(0.05,+(p-0.1).toFixed(2));if(hitB(width/2+20,btnY,55,26))p=Math.min(0.95,+(p+0.1).toFixed(2));}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
