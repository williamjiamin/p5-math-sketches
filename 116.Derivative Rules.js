/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var ruleIdx = 0;
var RULES = [
  {name:"Power Rule",f:"xⁿ",df:"n·xⁿ⁻¹",ex:"f(x) = x³  →  f'(x) = 3x²"},
  {name:"Product Rule",f:"u·v",df:"u'v + uv'",ex:"f(x) = x²·sin(x)  →  f'(x) = 2x·sin(x) + x²·cos(x)"},
  {name:"Chain Rule",f:"f(g(x))",df:"f'(g(x))·g'(x)",ex:"f(x) = sin(x²)  →  f'(x) = cos(x²)·2x"},
  {name:"Quotient Rule",f:"u/v",df:"(u'v - uv')/v²",ex:"f(x) = sin(x)/x  →  f'(x) = (x·cos(x) - sin(x))/x²"}
];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Derivative Rules",width/2,25);textStyle(NORMAL);
  var r=RULES[ruleIdx],cy=height/2-40;
  fill(80,60,200);textSize(24);textStyle(BOLD);text(r.name,width/2,80);textStyle(NORMAL);
  fill(255);stroke(80,60,200);strokeWeight(2);rect(width/2-200,cy-60,400,120,15);
  noStroke();fill(80);textSize(16);text("d/dx ["+r.f+"] = "+r.df,width/2,cy-20);
  fill(80,60,200);textSize(14);textStyle(BOLD);text("Example:",width/2,cy+15);textStyle(NORMAL);fill(100);textSize(14);text(r.ex,width/2,cy+40);
  var gx=80,gy=cy+80,gw=width-160,gh=height-gy-60,midX=gx+gw/2,midY=gy+gh/2,scX=gw/10,scY=gh/6;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(midX,gy,midX,gy+gh);
  if(ruleIdx===0){noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var xv=-5+px/gw*10;vertex(gx+px,midY-xv*xv*xv*scY/10);}endShape();
    stroke(220,60,60);strokeWeight(2);beginShape();for(var px2=0;px2<gw;px2+=2){var xv2=-5+px2/gw*10;vertex(gx+px2,midY-3*xv2*xv2*scY/10);}endShape();
    noStroke();fill(80,60,200);textSize(10);text("f(x)=x³",gx+gw-30,gy+15);fill(220,60,60);text("f'(x)=3x²",gx+gw-30,gy+28);}
  else if(ruleIdx===2){noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px3=0;px3<gw;px3+=2){var xv3=-5+px3/gw*10;vertex(gx+px3,midY-Math.sin(xv3*xv3)*scY);}endShape();
    stroke(220,60,60);strokeWeight(2);beginShape();for(var px4=0;px4<gw;px4+=2){var xv4=-5+px4/gw*10;vertex(gx+px4,midY-Math.cos(xv4*xv4)*2*xv4*scY);}endShape();}
  var btnY=height-40;for(var i=0;i<RULES.length;i++){drawBtn(width/2+(i-2)*110+15,btnY,100,26,RULES[i].name,i===ruleIdx);}
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;for(var i=0;i<RULES.length;i++){if(hitB(width/2+(i-2)*110+15,btnY,100,26))ruleIdx=i;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
