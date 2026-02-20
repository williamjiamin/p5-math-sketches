/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var nHarmonics = 3, waveType = 0;
var WAVES = ["Square","Sawtooth","Triangle"];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function fourier(x){var s=0;for(var n=1;n<=nHarmonics;n++){if(waveType===0){if(n%2===1)s+=4/(PI*n)*sin(n*x);}else if(waveType===1){s+=2*Math.pow(-1,n+1)/(PI*n)*sin(n*x);}else{if(n%2===1)s+=8/(PI*PI*n*n)*Math.pow(-1,(n-1)/2)*sin(n*x);}}return s;}
function target(x){x=((x%TWO_PI)+TWO_PI)%TWO_PI;if(waveType===0)return x<PI?1:-1;if(waveType===1)return x/PI-1;var q=x/PI;return q<0.5?4*q:(q<1.5?2-4*(q-0.5):-4+4*(q-1.5));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Fourier Series",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(14);text(WAVES[waveType]+" wave — "+nHarmonics+" harmonics",width/2,55);
  var gx=60,gy=80,gw=width-120,gh=height-200,midY=gy+gh/2;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);
  noFill();stroke(180,180,180,120);strokeWeight(1.5);beginShape();for(var px=0;px<gw;px+=2){var xv=px/gw*4*PI;vertex(gx+px,midY-target(xv)*gh*0.35);}endShape();
  noFill();stroke(80,60,200);strokeWeight(2.5);beginShape();for(var px2=0;px2<gw;px2+=2){var xv2=px2/gw*4*PI;vertex(gx+px2,midY-fourier(xv2)*gh*0.35);}endShape();
  noStroke();fill(180);textSize(10);text("target",gx+gw-30,gy+10);fill(80,60,200);text("Fourier",gx+gw-30,gy+23);
  fill(80);textSize(12);text("More harmonics → better approximation (Gibbs phenomenon at jumps)",width/2,gy+gh+15);
  var btnY=height-35;drawBtn(width/2-140,btnY,60,24,"Harm -");drawBtn(width/2-75,btnY,60,24,"Harm +");
  for(var k=0;k<3;k++)drawBtn(width/2+10+k*80,btnY,75,24,WAVES[k],k===waveType);
  fill(80);textSize(11);text("n = "+nHarmonics,width/2-108,btnY-14);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-140,btnY,60,24))nHarmonics=Math.max(1,nHarmonics-1);if(hitB(width/2-75,btnY,60,24))nHarmonics=Math.min(50,nHarmonics+1);
  for(var k=0;k<3;k++){if(hitB(width/2+10+k*80,btnY,75,24))waveType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
