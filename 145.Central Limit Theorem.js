/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var sampleSize = 5, nSamples = 0, means = [], distType = 0;
var DISTS = ["Uniform","Exponential","Bimodal"];
function sampleOne(){if(distType===0)return Math.random()*6;if(distType===1)return-Math.log(1-Math.random())*2;return Math.random()<0.5?Math.random()*2:4+Math.random()*2;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Central Limit Theorem",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("Sample means approach Normal as n→∞, regardless of original distribution",width/2,52);
  fill(80,60,200);textSize(13);text("Source: "+DISTS[distType]+"   Sample size n="+sampleSize+"   Samples drawn: "+nSamples,width/2,72);
  var gx=60,gy=90,gw=width-120,gh=height-200,midY=gy+gh;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(gx,gy,gx,midY);
  if(means.length>10){var bins=30,minV=0,maxV=6;var counts=new Array(bins).fill(0);for(var i=0;i<means.length;i++){var bi=Math.floor((means[i]-minV)/(maxV-minV)*bins);if(bi>=0&&bi<bins)counts[bi]++;}
    var maxC=Math.max.apply(null,counts);if(maxC<1)maxC=1;var barW=gw/bins;
    for(var j=0;j<bins;j++){var bh=counts[j]/maxC*gh*0.9;fill(80,60,200,150);noStroke();rect(gx+j*barW,midY-bh,barW-1,bh,2,2,0,0);}}
  noStroke();fill(80);textSize(10);text("0",gx,midY+12);text("3",gx+gw/2,midY+12);text("6",gx+gw,midY+12);
  var btnY=height-35;drawBtn(20,btnY,70,24,"Sample +10");drawBtn(100,btnY,70,24,"Sample +100");drawBtn(180,btnY,55,24,"n -");drawBtn(240,btnY,55,24,"n +");drawBtn(310,btnY,55,24,"Reset");
  for(var k=0;k<3;k++)drawBtn(width/2+80+k*80,btnY,75,24,DISTS[k],k===distType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function addSamples(n){for(var i=0;i<n;i++){var sum=0;for(var j=0;j<sampleSize;j++)sum+=sampleOne();means.push(sum/sampleSize);nSamples++;}}
function mousePressed(){var btnY=height-35;if(hitB(20,btnY,70,24))addSamples(10);if(hitB(100,btnY,70,24))addSamples(100);if(hitB(180,btnY,55,24)){sampleSize=Math.max(1,sampleSize-1);means=[];nSamples=0;}if(hitB(240,btnY,55,24)){sampleSize=Math.min(100,sampleSize+1);means=[];nSamples=0;}if(hitB(310,btnY,55,24)){means=[];nSamples=0;}
  for(var k=0;k<3;k++){if(hitB(width/2+80+k*80,btnY,75,24)){distType=k;means=[];nSamples=0;}}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
