/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var ang = 0, autoAnim = true;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("The Unit Circle",width/2,25);textStyle(NORMAL);
  if(autoAnim)ang=(ang+0.5)%360;
  var cx=width/2-80,cy=height/2+10,r=180,a=radians(ang);
  stroke(200);strokeWeight(1);line(cx-r-20,cy,cx+r+20,cy);line(cx,cy-r-20,cx,cy+r+20);
  noFill();stroke(80,60,200);strokeWeight(2);ellipse(cx,cy,r*2,r*2);
  var px=cx+r*cos(-a),py=cy+r*sin(-a);
  stroke(220,60,60);strokeWeight(2);line(cx,cy,px,py);
  stroke(40,160,80,150);strokeWeight(1.5);line(px,py,px,cy);
  stroke(200,140,30,150);line(cx,cy,px,cy);
  fill(220,60,60);noStroke();ellipse(px,py,10,10);
  noFill();stroke(80,60,200,100);strokeWeight(1.5);arc(cx,cy,40,40,-a,0);
  noStroke();fill(80);textSize(11);text("cos",lerp(cx,px,0.5),cy+14);text("sin",px+14,lerp(cy,py,0.5));
  var sinV=sin(a).toFixed(3),cosV=cos(a).toFixed(3),tanV=Math.abs(cos(a))>0.01?(sin(a)/cos(a)).toFixed(3):"undef";
  var ix=width/2+160,iy=130;fill(80,60,200);textSize(16);textStyle(BOLD);text("θ = "+ang.toFixed(0)+"°",ix,iy);textStyle(NORMAL);
  textSize(14);fill(200,140,30);text("cos θ = "+cosV,ix,iy+30);fill(40,160,80);text("sin θ = "+sinV,ix,iy+55);fill(220,60,60);text("tan θ = "+tanV,ix,iy+80);
  var btnY=height-45;drawBtn(width/2-110,btnY,90,26,autoAnim?"Pause":"Animate",autoAnim);drawBtn(width/2+20,btnY,60,26,"- 15°");drawBtn(width/2+90,btnY,60,26,"+ 15°");

  stroke(200);strokeWeight(0.5);noFill();
  var specials=[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330];
  for(var i=0;i<specials.length;i++){var sa=radians(specials[i]);fill(150);noStroke();ellipse(cx+r*cos(-sa),cy+r*sin(-sa),4,4);}
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(active?255:60);textSize(11);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;if(hitB(width/2-110,btnY,90,26))autoAnim=!autoAnim;if(hitB(width/2+20,btnY,60,26)){autoAnim=false;ang=(ang-15+360)%360;}if(hitB(width/2+90,btnY,60,26)){autoAnim=false;ang=(ang+15)%360;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
