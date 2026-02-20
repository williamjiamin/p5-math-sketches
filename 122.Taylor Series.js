/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var nTerms = 3, funcType = 0, center = 0;
var FUNCS = ["eˣ","sin(x)","cos(x)","ln(1+x)"];
function f(x){if(funcType===0)return Math.exp(x);if(funcType===1)return Math.sin(x);if(funcType===2)return Math.cos(x);return Math.log(1+x);}
function taylorTerm(n,x){
  if(funcType===0){var fact=1;for(var i=1;i<=n;i++)fact*=i;return Math.pow(x,n)/fact;}
  if(funcType===1){if(n%2===0)return 0;var sign=((n-1)/2)%2===0?1:-1;var f2=1;for(var j=1;j<=n;j++)f2*=j;return sign*Math.pow(x,n)/f2;}
  if(funcType===2){if(n%2===1)return 0;var sign2=(n/2)%2===0?1:-1;var f3=1;for(var k=1;k<=n;k++)f3*=k;return sign2*Math.pow(x,n)/f3;}
  if(n===0)return 0;var sign3=n%2===1?1:-1;return sign3*Math.pow(x,n)/n;
}
function taylor(x,terms){var s=0;for(var i=0;i<=terms;i++)s+=taylorTerm(i,x);return s;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Taylor Series Approximation",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(14);text(FUNCS[funcType]+" ≈ Taylor polynomial of degree "+nTerms,width/2,55);
  var gx=60,gy=70,gw=width-120,gh=height-180,midX=gx+gw/2,midY=gy+gh/2;
  var scX=gw/12,scY=gh/6;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(midX,gy,midX,gy+gh);
  noFill();stroke(180);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var xv=-6+px/gw*12;var yv=f(xv);var sy=midY-yv*scY;if(sy>gy-50&&sy<gy+gh+50)vertex(gx+px,sy);}endShape();
  noFill();stroke(220,60,60);strokeWeight(2);beginShape();for(var px2=0;px2<gw;px2+=2){var xv2=-6+px2/gw*12;var yv2=taylor(xv2,nTerms);var sy2=midY-yv2*scY;if(sy2>gy-50&&sy2<gy+gh+50)vertex(gx+px2,sy2);}endShape();
  noStroke();fill(180);textSize(10);text("exact",gx+gw-30,gy+12);fill(220,60,60);text("Taylor",gx+gw-30,gy+25);
  var btnY=height-40;drawBtn(width/2-200,btnY,60,24,"Terms -");drawBtn(width/2-130,btnY,60,24,"Terms +");
  for(var k=0;k<4;k++)drawBtn(width/2+(k-1)*80-20,btnY,75,24,FUNCS[k],k===funcType);
  fill(80);textSize(12);text("Terms: "+nTerms,width/2-165,btnY-14);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;if(hitB(width/2-200,btnY,60,24))nTerms=Math.max(1,nTerms-1);if(hitB(width/2-130,btnY,60,24))nTerms=Math.min(20,nTerms+1);
  for(var k=0;k<4;k++){if(hitB(width/2+(k-1)*80-20,btnY,75,24))funcType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
