/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var mat={a:2,b:1,c:1,d:3};
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Eigenvalues & Eigenvectors",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("Av = λv — eigenvectors only scale, not rotate",width/2,52);
  var tr=mat.a+mat.d,det2=mat.a*mat.d-mat.b*mat.c;var disc=tr*tr-4*det2;
  var l1,l2,ev1x,ev1y,ev2x,ev2y;
  if(disc>=0){l1=(tr+Math.sqrt(disc))/2;l2=(tr-Math.sqrt(disc))/2;
    if(Math.abs(mat.b)>0.01){ev1x=l1-mat.d;ev1y=mat.b;ev2x=l2-mat.d;ev2y=mat.b;}else if(Math.abs(mat.c)>0.01){ev1x=mat.c;ev1y=l1-mat.a;ev2x=mat.c;ev2y=l2-mat.a;}else{ev1x=1;ev1y=0;ev2x=0;ev2y=1;}}
  else{l1=NaN;l2=NaN;ev1x=1;ev1y=0;ev2x=0;ev2y=1;}
  var cx=width/2,cy=height/2+20,sc=40;
  stroke(220);strokeWeight(0.5);for(var gx=-6;gx<=6;gx++)line(cx+gx*sc,cy-5*sc,cx+gx*sc,cy+5*sc);for(var gy=-5;gy<=5;gy++)line(cx-6*sc,cy+gy*sc,cx+6*sc,cy+gy*sc);
  stroke(180);strokeWeight(1.5);line(cx-6*sc,cy,cx+6*sc,cy);line(cx,cy-5*sc,cx,cy+5*sc);
  if(!isNaN(l1)){var m1=Math.sqrt(ev1x*ev1x+ev1y*ev1y),m2=Math.sqrt(ev2x*ev2x+ev2y*ev2y);if(m1>0.001){ev1x/=m1;ev1y/=m1;}if(m2>0.001){ev2x/=m2;ev2y/=m2;}
    stroke(220,60,60);strokeWeight(1.5);drawingContext.setLineDash([6,4]);line(cx-ev1x*5*sc,cy+ev1y*5*sc,cx+ev1x*5*sc,cy-ev1y*5*sc);drawingContext.setLineDash([]);
    stroke(40,160,80);drawingContext.setLineDash([6,4]);line(cx-ev2x*5*sc,cy+ev2y*5*sc,cx+ev2x*5*sc,cy-ev2y*5*sc);drawingContext.setLineDash([]);
    drawArrow(cx,cy,cx+ev1x*2*sc,cy-ev1y*2*sc,color(220,60,60),3);
    drawArrow(cx,cy,cx+ev2x*2*sc,cy-ev2y*2*sc,color(40,160,80),3);
    drawArrow(cx,cy,cx+ev1x*l1*2*sc,cy-ev1y*l1*2*sc,color(220,60,60,120),2);
    drawArrow(cx,cy,cx+ev2x*l2*2*sc,cy-ev2y*l2*2*sc,color(40,160,80,120),2);}
  noStroke();fill(80);textSize(13);text("["+mat.a+"  "+mat.b+"]",width/2,70);text("["+mat.c+"  "+mat.d+"]",width/2,86);
  fill(220,60,60);textSize(13);text("λ₁ = "+(isNaN(l1)?"complex":l1.toFixed(2)),width/2-120,height-80);
  fill(40,160,80);text("λ₂ = "+(isNaN(l2)?"complex":l2.toFixed(2)),width/2+120,height-80);
  fill(80);textSize(11);text("trace = "+tr+"  det = "+det2+"  disc = "+disc.toFixed(1),width/2,height-58);
  var btnY=height-35;drawBtn(20,btnY,42,22,"a-");drawBtn(66,btnY,42,22,"a+");drawBtn(130,btnY,42,22,"b-");drawBtn(176,btnY,42,22,"b+");drawBtn(240,btnY,42,22,"c-");drawBtn(286,btnY,42,22,"c+");drawBtn(350,btnY,42,22,"d-");drawBtn(396,btnY,42,22,"d+");
}
function drawArrow(x1,y1,x2,y2,c,sw){stroke(c);strokeWeight(sw);line(x1,y1,x2,y2);var a2=atan2(y2-y1,x2-x1);line(x2,y2,x2-9*cos(a2-PI/6),y2-9*sin(a2-PI/6));line(x2,y2,x2-9*cos(a2+PI/6),y2-9*sin(a2+PI/6));}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(20,btnY,42,22))mat.a--;if(hitB(66,btnY,42,22))mat.a++;if(hitB(130,btnY,42,22))mat.b--;if(hitB(176,btnY,42,22))mat.b++;if(hitB(240,btnY,42,22))mat.c--;if(hitB(286,btnY,42,22))mat.c++;if(hitB(350,btnY,42,22))mat.d--;if(hitB(396,btnY,42,22))mat.d++;}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
