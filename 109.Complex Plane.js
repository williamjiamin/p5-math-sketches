/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var re=3,im=2;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("The Complex Plane",width/2,25);textStyle(NORMAL);
  fill(80);textSize(13);text("z = a + bi  plotted on the Argand diagram",width/2,52);
  var cx=width/2,cy=height/2+10,sc=40;
  stroke(220);strokeWeight(0.5);for(var gx=-6;gx<=6;gx++)line(cx+gx*sc,cy-6*sc,cx+gx*sc,cy+6*sc);for(var gy=-6;gy<=6;gy++)line(cx-6*sc,cy+gy*sc,cx+6*sc,cy+gy*sc);
  stroke(180);strokeWeight(1.5);line(cx-6*sc,cy,cx+6*sc,cy);line(cx,cy-6*sc,cx,cy+6*sc);
  noStroke();fill(120);textSize(10);text("Re",cx+6*sc-10,cy+14);text("Im",cx+12,cy-6*sc+10);
  for(var i=-5;i<=5;i++){if(i!==0){fill(150);textSize(9);text(i,cx+i*sc,cy+14);text(i,cx-14,cy-i*sc);}}
  var px=cx+re*sc,py=cy-im*sc;
  stroke(80,60,200,100);strokeWeight(1);drawingContext.setLineDash([4,4]);line(px,py,px,cy);line(px,py,cx,py);drawingContext.setLineDash([]);
  stroke(220,60,60);strokeWeight(2.5);line(cx,cy,px,py);
  fill(80,60,200);noStroke();ellipse(px,py,12,12);
  var mag=Math.sqrt(re*re+im*im);var arg=Math.atan2(im,re);
  noFill();stroke(80,60,200,80);strokeWeight(1);if(mag>0.1)arc(cx,cy,50,50,-arg,0);
  noStroke();fill(80,60,200);textSize(13);textStyle(BOLD);
  var sign=im>=0?"+":"-";text("z = "+re+" "+sign+" "+Math.abs(im)+"i",px+30,py-12);textStyle(NORMAL);
  fill(80);textSize(12);var infoY=height-100;
  text("|z| = √("+re+"² + "+im+"²) = "+mag.toFixed(3),width/2,infoY);
  text("arg(z) = "+degrees(arg).toFixed(1)+"° = "+arg.toFixed(3)+" rad",width/2,infoY+20);
  text("Polar: "+mag.toFixed(2)+"(cos"+degrees(arg).toFixed(1)+"° + i·sin"+degrees(arg).toFixed(1)+"°)",width/2,infoY+40);
  var btnY=height-40;drawBtn(width/2-160,btnY,55,24,"Re -");drawBtn(width/2-100,btnY,55,24,"Re +");drawBtn(width/2+10,btnY,55,24,"Im -");drawBtn(width/2+70,btnY,55,24,"Im +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;if(hitB(width/2-160,btnY,55,24))re=Math.max(-5,re-1);if(hitB(width/2-100,btnY,55,24))re=Math.min(5,re+1);if(hitB(width/2+10,btnY,55,24))im=Math.max(-5,im-1);if(hitB(width/2+70,btnY,55,24))im=Math.min(5,im+1);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
