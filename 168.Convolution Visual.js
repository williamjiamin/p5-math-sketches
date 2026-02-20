/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var shiftT = 0, autoAnim = true;
function f(x){return x>=0&&x<=1?1:0;}
function g(x){return x>=0&&x<=1?1:0;}
function conv(t){var sum=0,dt=0.01;for(var tau=-2;tau<=4;tau+=dt){sum+=f(tau)*g(t-tau)*dt;}return sum;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);if(autoAnim)shiftT=(shiftT+0.01)%4-1;noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Convolution",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("(f * g)(t) = ∫ f(τ)g(t-τ) dτ — two box functions",width/2,52);
  var gx=60,gy=70,gw=(width-140)/2,gh=130,midY;
  noStroke();fill(80,60,200);textSize(11);text("f(τ) and g(t-τ)",gx+gw/2,gy-5);
  midY=gy+gh;stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);
  var scX=gw/4,scY=gh*0.8;
  fill(80,60,200,60);stroke(80,60,200);strokeWeight(1.5);beginShape();vertex(gx+0*scX,midY);vertex(gx+0*scX,midY-scY);vertex(gx+1*scX,midY-scY);vertex(gx+1*scX,midY);endShape(CLOSE);
  fill(220,100,40,60);stroke(220,100,40);beginShape();var gStart=shiftT,gEnd=shiftT+1;vertex(gx+Math.max(-1,gStart)*scX+scX,midY);vertex(gx+Math.max(-1,gStart)*scX+scX,midY-scY);vertex(gx+Math.min(3,gEnd)*scX+scX,midY-scY);vertex(gx+Math.min(3,gEnd)*scX+scX,midY);endShape(CLOSE);
  var overlap=Math.max(0,Math.min(1,shiftT+1)-Math.max(0,shiftT));fill(40,160,80,80);noStroke();if(overlap>0){var oStart=Math.max(0,shiftT),oEnd=Math.min(1,shiftT+1);rect(gx+oStart*scX+scX,midY-scY,overlap*scX,scY);}
  noStroke();fill(80);textSize(10);text("t = "+shiftT.toFixed(2),gx+gw/2,midY+14);
  var gx2=gx+gw+20;noStroke();fill(220,60,60);textSize(11);text("(f*g)(t)",gx2+gw/2,gy-5);
  var midY2=gy+gh;stroke(200);strokeWeight(1);line(gx2,midY2,gx2+gw,midY2);
  noFill();stroke(220,60,60);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var tv=-1+px/gw*4;var cv=conv(tv);vertex(gx2+px,midY2-cv*scY);}endShape();
  fill(220,60,60);noStroke();ellipse(gx2+(shiftT+1)/4*gw,midY2-conv(shiftT)*scY,8,8);
  noStroke();fill(80);textSize(12);text("Overlap area = (f*g)("+shiftT.toFixed(2)+") = "+conv(shiftT).toFixed(3),width/2,height-65);
  var btnY=height-35;drawBtn(width/2-80,btnY,70,24,autoAnim?"Pause":"Animate");drawBtn(width/2+10,btnY,50,24,"t -");drawBtn(width/2+65,btnY,50,24,"t +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-80,btnY,70,24))autoAnim=!autoAnim;if(hitB(width/2+10,btnY,50,24)){autoAnim=false;shiftT=Math.max(-1,+(shiftT-0.1).toFixed(2));}if(hitB(width/2+65,btnY,50,24)){autoAnim=false;shiftT=Math.min(3,+(shiftT+0.1).toFixed(2));}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
