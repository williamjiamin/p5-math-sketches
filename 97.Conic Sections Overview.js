/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var conicType = 0, CONICS = ["Circle","Ellipse","Parabola","Hyperbola"];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Conic Sections",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(18);textStyle(BOLD);text(CONICS[conicType],width/2,55);textStyle(NORMAL);
  var cx=width/2,cy=height/2-10;
  stroke(200);strokeWeight(1);line(cx-250,cy,cx+250,cy);line(cx,cy-200,cx,cy+200);
  noFill();stroke(80,60,200);strokeWeight(3);
  if(conicType===0){ellipse(cx,cy,240,240);noStroke();fill(100);textSize(13);text("x² + y² = r²",cx,cy+140);}
  else if(conicType===1){ellipse(cx,cy,300,180);noStroke();fill(100);textSize(13);text("x²/a² + y²/b² = 1",cx,cy+120);fill(220,60,60);noStroke();var c2=Math.sqrt(150*150-90*90);ellipse(cx-c2,cy,8,8);ellipse(cx+c2,cy,8,8);fill(220,60,60);textSize(10);text("F₁",cx-c2,cy-12);text("F₂",cx+c2,cy-12);}
  else if(conicType===2){beginShape();for(var t=-3;t<=3;t+=0.05){var xx=40*t,yy=5*t*t;vertex(cx+xx,cy-100+yy);}endShape();noStroke();fill(100);textSize(13);text("y = ax²",cx,cy+140);fill(220,60,60);ellipse(cx,cy-100+1/(4*0.125),8,8);textSize(10);text("Focus",cx+25,cy-100+10);}
  else{for(var sign=-1;sign<=1;sign+=2){beginShape();for(var t2=-2;t2<=2;t2+=0.05){var xx2=80*Math.cosh(t2)*sign,yy2=60*Math.sinh(t2);vertex(cx+xx2,cy+yy2);}endShape();}noStroke();fill(100);textSize(13);text("x²/a² - y²/b² = 1",cx,cy+140);stroke(180);strokeWeight(1);line(cx-200,cy-200*60/80,cx+200,cy+200*60/80);line(cx-200,cy+200*60/80,cx+200,cy-200*60/80);noStroke();fill(120);textSize(10);text("asymptotes",cx+170,cy-130);}
  var desc=["All points equidistant from center","Sum of distances to two foci is constant","Each point equidistant from focus and directrix","Difference of distances to two foci is constant"];
  noStroke();fill(120);textSize(12);text(desc[conicType],cx,height-80);
  var btnY=height-45;for(var i=0;i<4;i++){drawBtn(width/2+(i-2)*100+10,btnY,90,28,CONICS[i],i===conicType);}
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(active?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;for(var i=0;i<4;i++){if(hitB(width/2+(i-2)*100+10,btnY,90,28))conicType=i;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
