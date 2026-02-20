/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var eps = 1, delta = 0.5, a = 2;
function f(x){return x*x;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Epsilon-Delta Definition of Limit",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("For every ε>0, there exists δ>0 such that |f(x)-L|<ε when 0<|x-a|<δ",width/2,50);
  var L=f(a),gx=80,gy=70,gw=width-160,gh=height-180;
  var midX=gx+gw/2,midY=gy+gh*0.7,scX=gw/10,scY=gh/12;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(midX,gy,midX,gy+gh);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var xv=-5+px/gw*10;var yv=f(xv);vertex(gx+px,midY-yv*scY);}endShape();
  var ax=midX+a*scX,ly=midY-L*scY;
  fill(220,60,60,30);noStroke();rect(ax-delta*scX,ly-eps*scY,delta*2*scX,eps*2*scY);
  stroke(220,60,60);strokeWeight(1);drawingContext.setLineDash([4,4]);line(ax-delta*scX,gy,ax-delta*scX,gy+gh);line(ax+delta*scX,gy,ax+delta*scX,gy+gh);line(gx,ly-eps*scY,gx+gw,ly-eps*scY);line(gx,ly+eps*scY,gx+gw,ly+eps*scY);drawingContext.setLineDash([]);
  fill(80,60,200);noStroke();ellipse(ax,ly,10,10);
  noStroke();fill(220,60,60);textSize(11);text("δ",ax,midY+14);text("ε",gx-15,ly);
  fill(80,60,200);textSize(12);textStyle(BOLD);text("a="+a+"  L=f(a)="+L,width/2,gy+gh+15);textStyle(NORMAL);
  fill(100);textSize(11);text("ε = "+eps.toFixed(2)+"   δ = "+delta.toFixed(2),width/2,gy+gh+35);
  var works=true;for(var testX=a-delta;testX<=a+delta;testX+=0.01){if(Math.abs(testX-a)>0.001){if(Math.abs(f(testX)-L)>=eps){works=false;break;}}}
  fill(works?color(40,160,80):color(220,60,60));textSize(13);textStyle(BOLD);text(works?"✓ Condition satisfied":"✗ Condition NOT met",width/2,gy+gh+55);textStyle(NORMAL);
  var btnY=height-35;drawBtn(width/2-180,btnY,55,24,"ε -");drawBtn(width/2-120,btnY,55,24,"ε +");drawBtn(width/2-20,btnY,55,24,"δ -");drawBtn(width/2+40,btnY,55,24,"δ +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-180,btnY,55,24))eps=Math.max(0.1,+(eps-0.2).toFixed(2));if(hitB(width/2-120,btnY,55,24))eps=Math.min(4,+(eps+0.2).toFixed(2));if(hitB(width/2-20,btnY,55,24))delta=Math.max(0.05,+(delta-0.1).toFixed(2));if(hitB(width/2+40,btnY,55,24))delta=Math.min(3,+(delta+0.1).toFixed(2));}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
