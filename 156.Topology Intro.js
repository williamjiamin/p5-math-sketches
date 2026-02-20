/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var shapeType = 0, morphT = 0;
var SHAPES = ["Coffee Cup → Donut","Möbius Strip","Sphere","Klein Bottle"];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);morphT=(morphT+0.005)%1;noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Topology — Surfaces & Homeomorphisms",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("Topology studies properties preserved under continuous deformation",width/2,52);
  fill(80,60,200);textSize(15);textStyle(BOLD);text(SHAPES[shapeType],width/2,75);textStyle(NORMAL);
  var cx=width/2,cy=height/2+20;
  if(shapeType===0){var t=morphT;var r1=lerp(80,60,t),r2=lerp(0,40,t);var holeY=lerp(cy-50,cy-20,t),holeR=lerp(0,25,t);
    fill(80,60,200,80);stroke(80,60,200);strokeWeight(2);ellipse(cx,cy,r1*2+80,r1*2);
    if(holeR>2){fill(245,247,252);noStroke();ellipse(cx+40*t,holeY,holeR*2,holeR*1.5);}
    noStroke();fill(100);textSize(11);text("genus = 1  (one hole → topologically equivalent)",cx,cy+r1+30);}
  else if(shapeType===1){noFill();stroke(80,60,200);strokeWeight(2);var pts=100;for(var i=0;i<pts;i++){var ang=TWO_PI*i/pts;var halfAng=ang/2;var w=30*cos(halfAng);var px2=cx+(80+w*cos(halfAng))*cos(ang),py2=cy+(80+w*cos(halfAng))*sin(ang)*0.4;
      var ang2=TWO_PI*(i+1)/pts;var ha2=ang2/2;var w2=30*cos(ha2);var px3=cx+(80+w2*cos(ha2))*cos(ang2),py3=cy+(80+w2*cos(ha2))*sin(ang2)*0.4;line(px2,py2,px3,py3);}
    noStroke();fill(100);textSize(11);text("One side, one edge — non-orientable!",cx,cy+100);}
  else if(shapeType===2){noFill();stroke(80,60,200);strokeWeight(2);ellipse(cx,cy,180,180);stroke(80,60,200,80);strokeWeight(1);for(var lat=-60;lat<=60;lat+=30){var r3=90*cos(radians(lat));var yOff=90*sin(radians(lat));ellipse(cx,cy+yOff,r3*2,r3*0.4);}
    noStroke();fill(100);textSize(11);text("genus = 0  (simply connected)",cx,cy+110);}
  else{noFill();stroke(80,60,200);strokeWeight(2);for(var i2=0;i2<120;i2++){var t2=TWO_PI*i2/120;var t3=TWO_PI*(i2+1)/120;for(var s=-1;s<=1;s+=0.5){var r4=60+20*cos(t2+s);var px4=cx+r4*cos(t2),py4=cy+r4*sin(t2)*0.5+s*15*sin(t2);var r5=60+20*cos(t3+s);var px5=cx+r5*cos(t3),py5=cy+r5*sin(t3)*0.5+s*15*sin(t3);line(px4,py4,px5,py5);}}
    noStroke();fill(100);textSize(11);text("Non-orientable, no boundary, self-intersecting in 3D",cx,cy+100);}
  var btnY=height-40;for(var k=0;k<4;k++)drawBtn(width/2+(k-2)*100+10,btnY,90,24,SHAPES[k].split("→")[0].split(" ")[0],k===shapeType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;for(var k=0;k<4;k++){if(hitB(width/2+(k-2)*100+10,btnY,90,24))shapeType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
