/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var animT = 0;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);animT=(animT+0.01)%TWO_PI;noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Stokes' Theorem",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("∮_∂S F·dr = ∬_S (∇×F)·dS",width/2,52);
  fill(100);textSize(11);text("The circulation around the boundary equals the flux of the curl through the surface",width/2,72);
  var cx=width/2,cy=height/2+20,r=120;
  fill(80,60,200,20);stroke(80,60,200,60);strokeWeight(1);ellipse(cx,cy,r*2.4,r*1.2);
  noFill();stroke(80,60,200);strokeWeight(3);ellipse(cx,cy,r*2.4,r*1.2);
  var nArrows=16;for(var i=0;i<nArrows;i++){var a=TWO_PI*i/nArrows;var px2=cx+r*1.2*cos(a),py2=cy+r*0.6*sin(a);var tx=-sin(a),ty=cos(a)*0.5;var len=15;stroke(220,100,40);strokeWeight(2);line(px2,py2,px2+tx*len,py2+ty*len);
    var ang=atan2(ty*len,tx*len);line(px2+tx*len,py2+ty*len,px2+tx*len-5*cos(ang-PI/6),py2+ty*len-5*sin(ang-PI/6));line(px2+tx*len,py2+ty*len,px2+tx*len-5*cos(ang+PI/6),py2+ty*len-5*sin(ang+PI/6));}
  var ptA=animT;var px3=cx+r*1.2*cos(ptA),py3=cy+r*0.6*sin(ptA);fill(220,60,60);noStroke();ellipse(px3,py3,10,10);
  for(var j=-2;j<=2;j++){for(var k=-2;k<=2;k++){var sx=cx+j*40,sy=cy+k*25;if(dist(sx,sy,cx,cy)<r*0.9){stroke(40,160,80,100);strokeWeight(1);line(sx,sy,sx,sy-12);line(sx,sy-12,sx-3,sy-8);line(sx,sy-12,sx+3,sy-8);}}}
  noStroke();fill(220,100,40);textSize(12);textStyle(BOLD);text("∮ F·dr (boundary circulation)",width/2-130,height-90);
  fill(40,160,80);text("∬ (∇×F)·dS (surface curl flux)",width/2+130,height-90);textStyle(NORMAL);
  fill(220,60,60);textSize(16);textStyle(BOLD);text("Both are equal!",width/2,height-60);textStyle(NORMAL);
  fill(100);textSize(11);text("Generalizes Green's theorem to 3D surfaces",width/2,height-38);
}
