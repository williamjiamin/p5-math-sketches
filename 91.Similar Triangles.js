/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var scaleFactor = 1.5;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Similar Triangles",width/2,25);textStyle(NORMAL);
  fill(100);textSize(14);text("Similar triangles have equal angles and proportional sides",width/2,55);
  var cx1=width/2-150,cy=280,cx2=width/2+130;
  var base=80,h=100;
  var p1=[{x:cx1-base/2,y:cy+h/2},{x:cx1+base/2,y:cy+h/2},{x:cx1,y:cy-h/2}];
  fill(80,60,200,40);stroke(80,60,200);strokeWeight(2);triangle(p1[0].x,p1[0].y,p1[1].x,p1[1].y,p1[2].x,p1[2].y);
  var sb=base*scaleFactor,sh=h*scaleFactor;
  var p2=[{x:cx2-sb/2,y:cy+sh/2},{x:cx2+sb/2,y:cy+sh/2},{x:cx2,y:cy-sh/2}];
  fill(220,100,40,40);stroke(220,100,40);strokeWeight(2);triangle(p2[0].x,p2[0].y,p2[1].x,p2[1].y,p2[2].x,p2[2].y);
  noStroke();fill(80,60,200);textSize(12);text("b="+base,cx1,cy+h/2+16);text("h="+h,cx1-base/2-18,cy);
  fill(220,100,40);text("b="+Math.round(sb),cx2,cy+sh/2+16);text("h="+Math.round(sh),cx2-sb/2-18,cy);
  fill(80,60,200);textSize(16);textStyle(BOLD);text("Scale Factor: "+scaleFactor.toFixed(1),width/2,cy+Math.max(h,sh)/2+40);textStyle(NORMAL);
  fill(100);textSize(13);text("Ratio: "+base+"/"+Math.round(sb)+" = "+h+"/"+Math.round(sh)+" = "+(1/scaleFactor).toFixed(3),width/2,cy+Math.max(h,sh)/2+65);
  var btnY=height-45;drawBtn(width/2-80,btnY,60,26,"Scale -");drawBtn(width/2+20,btnY,60,26,"Scale +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(hov?255:60);textSize(11);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;if(hitB(width/2-80,btnY,60,26))scaleFactor=Math.max(0.5,+(scaleFactor-0.25).toFixed(2));if(hitB(width/2+20,btnY,60,26))scaleFactor=Math.min(3,+(scaleFactor+0.25).toFixed(2));}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
