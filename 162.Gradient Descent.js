/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var xPos = 3, lr = 0.1, history = [3], funcType = 0;
var FUNCS = ["x²","(x-2)²+1","x⁴-3x²+2","sin(x)+x²/10"];
function f(x){if(funcType===0)return x*x;if(funcType===1)return(x-2)*(x-2)+1;if(funcType===2)return x*x*x*x-3*x*x+2;return Math.sin(x)+x*x/10;}
function df(x){if(funcType===0)return 2*x;if(funcType===1)return 2*(x-2);if(funcType===2)return 4*x*x*x-6*x;return Math.cos(x)+x/5;}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Gradient Descent Optimization",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("x ← x - α·f'(x)   (learning rate α = "+lr.toFixed(2)+")",width/2,52);
  var gx=80,gy=70,gw=width-160,gh=height-200,midY=gy+gh*0.7;
  var xMin=-5,xMax=5,scX=gw/(xMax-xMin),scY=gh/12;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var xv=xMin+px/gw*(xMax-xMin);var yv=f(xv);var sy=midY-yv*scY;if(sy>gy-20&&sy<gy+gh)vertex(gx+px,sy);}endShape();
  for(var i=0;i<history.length;i++){var hx=gx+(history[i]-xMin)*scX,hy=midY-f(history[i])*scY;fill(i===history.length-1?color(220,60,60):color(220,100,40,150));noStroke();ellipse(hx,hy,i===history.length-1?10:6,i===history.length-1?10:6);
    if(i>0){stroke(220,100,40,100);strokeWeight(1);var phx=gx+(history[i-1]-xMin)*scX,phy=midY-f(history[i-1])*scY;line(phx,phy,hx,hy);}}
  noStroke();fill(220,60,60);textSize(13);textStyle(BOLD);text("x = "+xPos.toFixed(4)+"   f(x) = "+f(xPos).toFixed(4)+"   f'(x) = "+df(xPos).toFixed(4),width/2,gy+gh+15);textStyle(NORMAL);
  fill(80);textSize(11);text("Steps: "+history.length,width/2,gy+gh+35);
  var btnY=height-35;drawBtn(20,btnY,55,24,"Step");drawBtn(80,btnY,70,24,"Step ×10");drawBtn(160,btnY,50,24,"α -");drawBtn(215,btnY,50,24,"α +");drawBtn(280,btnY,50,24,"Reset");
  for(var k=0;k<4;k++)drawBtn(width/2+60+k*75,btnY,70,24,FUNCS[k],k===funcType);
}
function step(){xPos=xPos-lr*df(xPos);history.push(xPos);}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(20,btnY,55,24))step();if(hitB(80,btnY,70,24))for(var i=0;i<10;i++)step();if(hitB(160,btnY,50,24))lr=Math.max(0.01,+(lr-0.05).toFixed(2));if(hitB(215,btnY,50,24))lr=Math.min(1,+(lr+0.05).toFixed(2));if(hitB(280,btnY,50,24)){xPos=3;history=[3];}
  for(var k=0;k<4;k++){if(hitB(width/2+60+k*75,btnY,70,24)){funcType=k;xPos=3;history=[3];}}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
