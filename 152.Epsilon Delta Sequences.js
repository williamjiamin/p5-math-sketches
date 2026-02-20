/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var seqType = 0, eps = 0.3, nShow = 30;
var SEQS = ["1/n","(-1)ⁿ/n","n/(n+1)","sin(n)/n"];
function aSeq(n){if(n<1)return 0;if(seqType===0)return 1/n;if(seqType===1)return Math.pow(-1,n)/n;if(seqType===2)return n/(n+1);return Math.sin(n)/n;}
function getLimit(){if(seqType===0)return 0;if(seqType===1)return 0;if(seqType===2)return 1;return 0;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Real Analysis — Sequence Convergence",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("∀ε>0, ∃N such that n>N ⟹ |aₙ - L| < ε",width/2,52);
  var L=getLimit();fill(80,60,200);textSize(14);text("aₙ = "+SEQS[seqType]+"   L = "+L,width/2,72);
  var gx=80,gy=95,gw=width-160,gh=height-210,midY=gy+gh/2;
  var scX=gw/(nShow+1),yMin=L-1.5,yMax=L+1.5,scY=gh/(yMax-yMin);
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(gx,gy,gx,gy+gh);
  fill(220,60,60,20);noStroke();rect(gx,gy+gh/2-(L-yMin+eps)*scY+scY*(yMax-yMin)/2-eps*scY,gw,eps*2*scY);
  stroke(220,60,60,100);strokeWeight(1);drawingContext.setLineDash([4,4]);var ly=gy+(yMax-L)*scY;line(gx,ly,gx+gw,ly);line(gx,ly-eps*scY,gx+gw,ly-eps*scY);line(gx,ly+eps*scY,gx+gw,ly+eps*scY);drawingContext.setLineDash([]);
  noStroke();fill(220,60,60);textSize(9);text("L+ε",gx-18,ly-eps*scY);text("L",gx-10,ly);text("L-ε",gx-18,ly+eps*scY);
  var N=-1;
  for(var n=1;n<=nShow;n++){var an=aSeq(n);var py=gy+(yMax-an)*scY;var inBand=Math.abs(an-L)<eps;if(!inBand)N=n;fill(inBand?color(40,160,80):color(220,60,60));noStroke();ellipse(gx+n*scX,py,7,7);}
  noStroke();fill(80);textSize(12);text("ε = "+eps.toFixed(2)+"   N = "+(N+1)+"  (all terms after N are within ε-band)",width/2,gy+gh+20);
  var btnY=height-40;drawBtn(width/2-200,btnY,55,24,"ε -");drawBtn(width/2-140,btnY,55,24,"ε +");
  for(var k=0;k<4;k++)drawBtn(width/2+(k-1)*80-20,btnY,75,24,SEQS[k],k===seqType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;if(hitB(width/2-200,btnY,55,24))eps=Math.max(0.02,+(eps-0.05).toFixed(2));if(hitB(width/2-140,btnY,55,24))eps=Math.min(2,+(eps+0.05).toFixed(2));
  for(var k=0;k<4;k++){if(hitB(width/2+(k-1)*80-20,btnY,75,24))seqType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
