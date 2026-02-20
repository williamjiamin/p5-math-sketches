/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var seriesType = 0, nTerms = 20;
var SERIES = ["1/n (Harmonic)","1/n² (p=2)","1/2ⁿ (Geometric)","(-1)ⁿ/n (Alternating)"];
function aTerm(n){
  if(n<1)return 0;
  if(seriesType===0)return 1/n;
  if(seriesType===1)return 1/(n*n);
  if(seriesType===2)return 1/Math.pow(2,n);
  return Math.pow(-1,n+1)/n;
}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Series Convergence",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(15);text(SERIES[seriesType],width/2,55);
  var converges=[false,true,true,true];
  var limits=["Diverges (→∞)","π²/6 ≈ 1.6449","1","ln(2) ≈ 0.6931"];
  fill(converges[seriesType]?color(40,160,80):color(220,60,60));textSize(13);textStyle(BOLD);text(converges[seriesType]?"Converges → "+limits[seriesType]:"Diverges",width/2,78);textStyle(NORMAL);
  var gx=80,gy=100,gw=width-160,gh=height-220;
  stroke(200);strokeWeight(1);line(gx,gy+gh,gx+gw,gy+gh);line(gx,gy,gx,gy+gh);
  var partials=[],s=0;for(var i=1;i<=nTerms;i++){s+=aTerm(i);partials.push(s);}
  var maxV=Math.max.apply(null,partials.map(Math.abs)),minV=Math.min.apply(null,partials);
  var range=Math.max(maxV-minV,0.1);
  var barW=Math.min(20,gw/nTerms-2);
  for(var j=0;j<partials.length;j++){var bx=gx+10+j*(gw-20)/nTerms;var by=gy+gh-(partials[j]-Math.min(0,minV))/range*gh*0.85;
    fill(80,60,200,180);noStroke();ellipse(bx+barW/2,by,6,6);if(j>0){stroke(80,60,200,100);strokeWeight(1);var prev=gy+gh-(partials[j-1]-Math.min(0,minV))/range*gh*0.85;line(bx-((gw-20)/nTerms)+barW/2,prev,bx+barW/2,by);}}
  noStroke();fill(80);textSize(12);text("S("+nTerms+") = "+s.toFixed(6),width/2,gy+gh+20);text("n",gx+gw/2,gy+gh+40);
  var btnY=height-40;drawBtn(width/2-250,btnY,55,24,"n -");drawBtn(width/2-190,btnY,55,24,"n +");
  for(var k=0;k<4;k++)drawBtn(width/2+(k-2)*100+40,btnY,95,24,SERIES[k].split(" ")[0],k===seriesType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;if(hitB(width/2-250,btnY,55,24))nTerms=Math.max(5,nTerms-5);if(hitB(width/2-190,btnY,55,24))nTerms=Math.min(100,nTerms+5);
  for(var k=0;k<4;k++){if(hitB(width/2+(k-2)*100+40,btnY,95,24))seriesType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
