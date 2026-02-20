/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var a1 = 1, r = 2, n = 8;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Geometric Sequences",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(16);textStyle(BOLD);text("a₁ = "+a1+", r = "+r+", n = "+n,width/2,55);textStyle(NORMAL);
  var terms=[],sum=0;for(var i=0;i<n;i++){var t=a1*Math.pow(r,i);terms.push(Math.round(t*100)/100);sum+=t;}
  fill(80);textSize(13);text("Sequence: "+terms.join(", "),width/2,85);
  var converges=Math.abs(r)<1;
  fill(converges?color(40,160,80):color(220,100,40));textSize(13);
  text(converges?"Converges (|r| < 1)":"Diverges (|r| ≥ 1)",width/2,108);
  var barW=Math.min(50,(width-80)/n),maxV=Math.max.apply(null,terms.map(Math.abs)),barMaxH=180;
  if(maxV===0)maxV=1;
  var bx=width/2-n*barW/2,by=320;
  for(var j=0;j<terms.length;j++){var h=Math.abs(terms[j])/maxV*barMaxH;fill(80+j*15,60,200-j*10,180);stroke(255);strokeWeight(1);rect(bx+j*barW,by-h,barW-4,h,4,4,0,0);noStroke();fill(60);textSize(Math.max(8,11-n/3));text(terms[j],bx+j*barW+barW/2,by-h-12);}
  noStroke();fill(40,160,80);textSize(14);textStyle(BOLD);
  var sumStr=r===1?"S = "+n+"×"+a1+" = "+(n*a1):"S = "+a1+"×(1−"+r+"^"+n+")/(1−"+r+") = "+Math.round(sum*100)/100;
  text(sumStr,width/2,by+25);textStyle(NORMAL);
  if(converges){fill(100);textSize(12);text("S∞ = "+a1+"/(1−"+r+") = "+(a1/(1-r)).toFixed(3),width/2,by+48);}
  var btnY=height-45;
  drawBtn(width/2-200,btnY,40,26,"a₁-");drawBtn(width/2-155,btnY,40,26,"a₁+");
  drawBtn(width/2-80,btnY,35,26,"r-");drawBtn(width/2-40,btnY,35,26,"r+");
  drawBtn(width/2+30,btnY,35,26,"n-");drawBtn(width/2+70,btnY,35,26,"n+");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(hov?255:60);textSize(11);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;
  if(hitB(width/2-200,btnY,40,26))a1--;if(hitB(width/2-155,btnY,40,26))a1++;
  if(hitB(width/2-80,btnY,35,26))r=+(r-0.5).toFixed(1);if(hitB(width/2-40,btnY,35,26))r=+(r+0.5).toFixed(1);
  if(hitB(width/2+30,btnY,35,26))n=Math.max(2,n-1);if(hitB(width/2+70,btnY,35,26))n=Math.min(12,n+1);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
