/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var a = 80, b = 60;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Hyperbola Properties",width/2,25);textStyle(NORMAL);
  var cx=width/2,cy=height/2;
  stroke(200);strokeWeight(1);line(cx-280,cy,cx+280,cy);line(cx,cy-220,cx,cy+220);
  stroke(180,180,180,100);strokeWeight(1);line(cx-250,cy-250*b/a,cx+250,cy+250*b/a);line(cx-250,cy+250*b/a,cx+250,cy-250*b/a);
  noFill();stroke(80,60,200);strokeWeight(2.5);
  for(var sign=-1;sign<=1;sign+=2){beginShape();for(var t=-2.5;t<=2.5;t+=0.04){var xx=a*Math.cosh(t)*sign,yy=b*Math.sinh(t);if(Math.abs(cx+xx)>0&&Math.abs(cy+yy)>0)vertex(cx+xx,cy+yy);}endShape();}
  var c=Math.sqrt(a*a+b*b);fill(220,60,60);noStroke();ellipse(cx-c,cy,10,10);ellipse(cx+c,cy,10,10);fill(220,60,60);textSize(10);text("F₁",cx-c,cy+14);text("F₂",cx+c,cy+14);
  fill(80,60,200);noStroke();ellipse(cx-a,cy,6,6);ellipse(cx+a,cy,6,6);fill(80);textSize(10);text("V₁",cx-a,cy-12);text("V₂",cx+a,cy-12);
  noStroke();fill(80);textSize(13);text("a="+a+"  b="+b+"  c=√(a²+b²)="+c.toFixed(1),width/2,height-90);text("e = c/a = "+(c/a).toFixed(3),width/2,height-70);
  fill(100);textSize(12);text("x²/"+a+"² - y²/"+b+"² = 1",width/2,55);
  var btnY=height-45;drawBtn(width/2-130,btnY,60,26,"a -");drawBtn(width/2-65,btnY,60,26,"a +");drawBtn(width/2+5,btnY,60,26,"b -");drawBtn(width/2+70,btnY,60,26,"b +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(hov?255:60);textSize(11);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;if(hitB(width/2-130,btnY,60,26))a=Math.max(30,a-10);if(hitB(width/2-65,btnY,60,26))a=Math.min(180,a+10);if(hitB(width/2+5,btnY,60,26))b=Math.max(20,b-10);if(hitB(width/2+70,btnY,60,26))b=Math.min(150,b+10);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
