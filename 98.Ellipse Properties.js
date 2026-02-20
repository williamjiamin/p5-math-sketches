/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var a = 160, b = 100, showFoci = true, showString = true, traceAngle = 0;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);traceAngle=(traceAngle+0.8)%360;
  noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Ellipse Properties",width/2,25);textStyle(NORMAL);
  var cx=width/2,cy=height/2;
  stroke(200);strokeWeight(1);line(cx-a-40,cy,cx+a+40,cy);line(cx,cy-b-40,cx,cy+b+40);
  noFill();stroke(80,60,200);strokeWeight(2.5);ellipse(cx,cy,a*2,b*2);
  stroke(80,60,200,80);strokeWeight(1);line(cx-a,cy,cx+a,cy);line(cx,cy-b,cx,cy+b);
  noStroke();fill(80);textSize(11);text("a="+a,cx+a/2,cy+14);text("b="+b,cx-14,cy-b/2);
  var c = Math.sqrt(Math.max(a*a-b*b,0));
  if(showFoci){fill(220,60,60);noStroke();ellipse(cx-c,cy,10,10);ellipse(cx+c,cy,10,10);fill(220,60,60);textSize(10);text("F₁",cx-c,cy+14);text("F₂",cx+c,cy+14);}
  if(showString){var ta=radians(traceAngle);var px=cx+a*cos(ta),py=cy+b*sin(ta);fill(40,160,80);noStroke();ellipse(px,py,8,8);stroke(220,100,40);strokeWeight(1.5);line(cx-c,cy,px,py);line(cx+c,cy,px,py);
    var d1=dist(cx-c,cy,px,py),d2=dist(cx+c,cy,px,py);noStroke();fill(220,100,40);textSize(12);text("d₁+d₂ = "+(d1+d2).toFixed(0)+" ≈ "+2*a,width/2,cy+b+30);}
  noStroke();fill(80);textSize(13);text("c = √(a²-b²) = "+c.toFixed(1),width/2,cy+b+50);text("Eccentricity e = c/a = "+(c/a).toFixed(3),width/2,cy+b+68);
  var btnY=height-45;drawBtn(width/2-130,btnY,60,26,"a -");drawBtn(width/2-65,btnY,60,26,"a +");drawBtn(width/2+5,btnY,60,26,"b -");drawBtn(width/2+70,btnY,60,26,"b +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(hov?255:60);textSize(11);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;if(hitB(width/2-130,btnY,60,26))a=Math.max(40,a-20);if(hitB(width/2-65,btnY,60,26))a=Math.min(250,a+20);if(hitB(width/2+5,btnY,60,26))b=Math.max(30,b-20);if(hitB(width/2+70,btnY,60,26))b=Math.min(200,b+20);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
