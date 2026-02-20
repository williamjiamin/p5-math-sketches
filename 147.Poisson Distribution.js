/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var lambda = 4;
function factorial(n){var f=1;for(var i=2;i<=n;i++)f*=i;return f;}
function poissonPMF(k){return Math.exp(-lambda)*Math.pow(lambda,k)/factorial(k);}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Poisson Distribution",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("P(X=k) = λᵏe^(-λ)/k!   — models rare events per interval",width/2,52);
  fill(80,60,200);textSize(15);textStyle(BOLD);text("λ = "+lambda.toFixed(1),width/2,75);textStyle(NORMAL);
  var gx=80,gy=100,gw=width-160,gh=height-220,maxK=Math.max(15,Math.ceil(lambda*2.5));
  var maxP=0;for(var k=0;k<=maxK;k++){var p=poissonPMF(k);if(p>maxP)maxP=p;}
  if(maxP<0.001)maxP=0.1;
  stroke(200);strokeWeight(1);line(gx,gy+gh,gx+gw,gy+gh);line(gx,gy,gx,gy+gh);
  var barW=Math.min(30,gw/(maxK+1)-3);
  for(var k2=0;k2<=maxK;k2++){var pk=poissonPMF(k2);var bh=pk/maxP*gh*0.9;var bx=gx+10+k2*gw/(maxK+1);
    var hov=mouseX>bx&&mouseX<bx+barW&&mouseY>gy+gh-bh&&mouseY<gy+gh;
    fill(hov?color(220,100,40):color(80,60,200));noStroke();rect(bx,gy+gh-bh,barW,bh,3,3,0,0);
    fill(80);textSize(7);text(k2,bx+barW/2,gy+gh+10);
    if(hov){fill(80,60,200);textSize(8);text(pk.toFixed(4),bx+barW/2,gy+gh-bh-10);}}
  noStroke();fill(80);textSize(12);text("Mean = λ = "+lambda.toFixed(1)+"   Variance = λ = "+lambda.toFixed(1),width/2,gy+gh+30);
  var btnY=height-35;drawBtn(width/2-60,btnY,55,24,"λ -");drawBtn(width/2+5,btnY,55,24,"λ +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-60,btnY,55,24))lambda=Math.max(0.5,+(lambda-0.5).toFixed(1));if(hitB(width/2+5,btnY,55,24))lambda=Math.min(20,+(lambda+0.5).toFixed(1));}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
