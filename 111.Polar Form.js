/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var r=3,theta=45;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Polar Form of Complex Numbers",width/2,25);textStyle(NORMAL);
  fill(80);textSize(13);text("z = r(cos θ + i sin θ) = r·e^(iθ)",width/2,52);
  var cx=width/2,cy=height/2+10,sc=40;
  stroke(220);strokeWeight(0.5);for(var gx=-6;gx<=6;gx++)line(cx+gx*sc,cy-6*sc,cx+gx*sc,cy+6*sc);for(var gy=-6;gy<=6;gy++)line(cx-6*sc,cy+gy*sc,cx+6*sc,cy+gy*sc);
  stroke(180);strokeWeight(1.5);line(cx-6*sc,cy,cx+6*sc,cy);line(cx,cy-6*sc,cx,cy+6*sc);
  noFill();stroke(80,60,200,60);strokeWeight(1);ellipse(cx,cy,r*sc*2,r*sc*2);
  var a=radians(theta),px=cx+r*sc*cos(a),py=cy-r*sc*sin(a);
  noFill();stroke(80,60,200,120);strokeWeight(1);arc(cx,cy,40,40,-a,0);
  stroke(220,60,60);strokeWeight(2.5);line(cx,cy,px,py);
  stroke(40,160,80,100);strokeWeight(1);drawingContext.setLineDash([4,4]);line(px,py,px,cy);line(cx,cy,px,cy);drawingContext.setLineDash([]);
  fill(80,60,200);noStroke();ellipse(px,py,12,12);
  var re2=r*cos(a),im2=r*sin(a);
  noStroke();fill(80,60,200);textSize(12);textStyle(BOLD);text("z",px+14,py-10);textStyle(NORMAL);
  fill(220,60,60);textSize(11);text("r="+r,lerp(cx,px,0.5)-10,lerp(cy,py,0.5)-10);
  fill(80);textSize(11);text("θ="+theta+"°",cx+30,cy-10);
  fill(40,160,80);text("a="+re2.toFixed(2),(cx+px)/2,cy+14);text("b="+im2.toFixed(2),px+20,(cy+py)/2);
  var infoY=height-100;noStroke();fill(80);textSize(14);textStyle(BOLD);
  text("Polar: "+r+"·e^(i·"+theta+"°)",width/2,infoY);textStyle(NORMAL);
  text("Rectangular: "+re2.toFixed(2)+" + "+im2.toFixed(2)+"i",width/2,infoY+22);
  text("Euler: e^(iπ) + 1 = 0",width/2,infoY+44);
  var btnY=height-40;drawBtn(width/2-160,btnY,55,24,"r -");drawBtn(width/2-100,btnY,55,24,"r +");drawBtn(width/2+10,btnY,55,24,"θ -15");drawBtn(width/2+70,btnY,55,24,"θ +15");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;if(hitB(width/2-160,btnY,55,24))r=Math.max(1,r-1);if(hitB(width/2-100,btnY,55,24))r=Math.min(5,r+1);if(hitB(width/2+10,btnY,55,24))theta=(theta-15+360)%360;if(hitB(width/2+70,btnY,55,24))theta=(theta+15)%360;}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
