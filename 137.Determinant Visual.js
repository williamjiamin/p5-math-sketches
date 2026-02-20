/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var a=2,b=1,c=0,d=2;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Determinant = Signed Area",width/2,25);textStyle(NORMAL);
  var det=a*d-b*c;
  fill(80);textSize(13);text("det([["+a+","+b+"],["+c+","+d+"]]) = "+a+"×"+d+" - "+b+"×"+c+" = "+det,width/2,55);
  var cx=width/2,cy=height/2+10,sc=40;
  stroke(220);strokeWeight(0.5);for(var gx=-6;gx<=6;gx++)line(cx+gx*sc,cy-5*sc,cx+gx*sc,cy+5*sc);for(var gy=-5;gy<=5;gy++)line(cx-6*sc,cy+gy*sc,cx+6*sc,cy+gy*sc);
  stroke(180);strokeWeight(1.5);line(cx-6*sc,cy,cx+6*sc,cy);line(cx,cy-5*sc,cx,cy+5*sc);
  fill(80,60,200,60);stroke(80,60,200);strokeWeight(2);beginShape();vertex(cx,cy);vertex(cx+a*sc,cy-c*sc);vertex(cx+(a+b)*sc,cy-(c+d)*sc);vertex(cx+b*sc,cy-d*sc);endShape(CLOSE);
  drawArrow(cx,cy,cx+a*sc,cy-c*sc,color(220,60,60),2.5);
  drawArrow(cx,cy,cx+b*sc,cy-d*sc,color(40,160,80),2.5);
  noStroke();fill(220,60,60);textSize(11);text("col₁("+a+","+c+")",cx+a*sc/2+15,cy-c*sc/2-12);
  fill(40,160,80);text("col₂("+b+","+d+")",cx+b*sc/2-15,cy-d*sc/2+12);
  fill(det>0?color(40,160,80):(det<0?color(220,60,60):color(180)));textSize(16);textStyle(BOLD);
  text("det = "+det+(det>0?" (positive orientation)":(det<0?" (flipped)":"")),width/2,height-80);textStyle(NORMAL);
  fill(80);textSize(12);text("|det| = Area of parallelogram = "+Math.abs(det),width/2,height-58);
  var btnY=height-35;drawBtn(20,btnY,42,22,"a-");drawBtn(66,btnY,42,22,"a+");drawBtn(130,btnY,42,22,"b-");drawBtn(176,btnY,42,22,"b+");drawBtn(240,btnY,42,22,"c-");drawBtn(286,btnY,42,22,"c+");drawBtn(350,btnY,42,22,"d-");drawBtn(396,btnY,42,22,"d+");
}
function drawArrow(x1,y1,x2,y2,col,sw){stroke(col);strokeWeight(sw);line(x1,y1,x2,y2);var ang=atan2(y2-y1,x2-x1);line(x2,y2,x2-9*cos(ang-PI/6),y2-9*sin(ang-PI/6));line(x2,y2,x2-9*cos(ang+PI/6),y2-9*sin(ang+PI/6));}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(20,btnY,42,22))a--;if(hitB(66,btnY,42,22))a++;if(hitB(130,btnY,42,22))b--;if(hitB(176,btnY,42,22))b++;if(hitB(240,btnY,42,22))c--;if(hitB(286,btnY,42,22))c++;if(hitB(350,btnY,42,22))d--;if(hitB(396,btnY,42,22))d++;}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
