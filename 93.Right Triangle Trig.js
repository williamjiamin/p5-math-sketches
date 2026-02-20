/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var angle = 45, animT = 0;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);animT+=0.02;noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Right Triangle Trigonometry",width/2,25);textStyle(NORMAL);
  var cx=width/2-60,cy=320,hyp=180,a=radians(angle);
  var adj=hyp*cos(a),opp=hyp*sin(a);
  var ax=cx,ay=cy,bx=cx+adj,by=cy,cxx=cx+adj,cyy=cy-opp;
  fill(80,60,200,30);stroke(80,60,200);strokeWeight(2);triangle(ax,ay,bx,by,cxx,cyy);
  stroke(80);strokeWeight(1);noFill();arc(ax,ay,50,50,-a,0);
  noStroke();fill(80,60,200);textSize(12);textStyle(BOLD);text(angle+"°",ax+35,ay-15);textStyle(NORMAL);
  stroke(220,60,60);strokeWeight(3);line(ax,ay,cxx,cyy);noStroke();fill(220,60,60);textSize(11);text("hyp="+hyp,lerp(ax,cxx,0.5)-20,lerp(ay,cyy,0.5));
  stroke(40,160,80);strokeWeight(3);line(ax,ay,bx,by);noStroke();fill(40,160,80);textSize(11);text("adj="+Math.round(adj),(ax+bx)/2,by+16);
  stroke(200,140,30);strokeWeight(3);line(bx,by,cxx,cyy);noStroke();fill(200,140,30);textSize(11);text("opp="+Math.round(opp),bx+28,(by+cyy)/2);
  noStroke();fill(10,10,10);rect(bx-8,by-8,8,8);
  var sinV=(opp/hyp).toFixed(3),cosV=(adj/hyp).toFixed(3),tanV=(adj>1?(opp/adj).toFixed(3):"∞");
  var infoX=width/2+140,infoY=150;
  fill(80,60,200);textSize(16);textStyle(BOLD);text("SOH CAH TOA",infoX,infoY);textStyle(NORMAL);
  textSize(14);fill(200,140,30);text("sin("+angle+"°) = opp/hyp = "+sinV,infoX,infoY+30);
  fill(40,160,80);text("cos("+angle+"°) = adj/hyp = "+cosV,infoX,infoY+55);
  fill(220,60,60);text("tan("+angle+"°) = opp/adj = "+tanV,infoX,infoY+80);
  var btnY=height-45;drawBtn(width/2-80,btnY,60,26,"Angle -");drawBtn(width/2+20,btnY,60,26,"Angle +");
  fill(80);textSize(13);text("θ = "+angle+"°",width/2,btnY-20);
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(hov?255:60);textSize(11);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;if(hitB(width/2-80,btnY,60,26))angle=Math.max(5,angle-5);if(hitB(width/2+20,btnY,60,26))angle=Math.min(85,angle+5);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
