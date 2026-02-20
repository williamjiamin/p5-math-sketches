/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var postulate = 0, POSTS = ["SSS","SAS","ASA","AAS"];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Congruence Postulates",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(20);textStyle(BOLD);text(POSTS[postulate],width/2,55);textStyle(NORMAL);
  var desc=["SSS: Three sides equal → triangles congruent","SAS: Two sides and included angle equal","ASA: Two angles and included side equal","AAS: Two angles and non-included side equal"];
  fill(100);textSize(14);text(desc[postulate],width/2,82);
  var cx1=width/2-140,cy1=280,cx2=width/2+140,cy2=280,r=90;
  var pts1=[{x:cx1-r,y:cy1+r*0.6},{x:cx1+r,y:cy1+r*0.6},{x:cx1+r*0.2,y:cy1-r*0.7}];
  var pts2=[{x:cx2-r,y:cy2+r*0.6},{x:cx2+r,y:cy2+r*0.6},{x:cx2+r*0.2,y:cy2-r*0.7}];
  fill(80,60,200,40);stroke(80,60,200);strokeWeight(2);triangle(pts1[0].x,pts1[0].y,pts1[1].x,pts1[1].y,pts1[2].x,pts1[2].y);
  fill(220,100,40,40);stroke(220,100,40);triangle(pts2[0].x,pts2[0].y,pts2[1].x,pts2[1].y,pts2[2].x,pts2[2].y);
  noStroke();fill(80,60,200);textSize(11);text("Triangle 1",cx1,cy1+r+20);
  fill(220,100,40);text("Triangle 2",cx2,cy2+r+20);
  if(postulate===0||postulate===1){stroke(220,60,60);strokeWeight(4);line(pts1[0].x,pts1[0].y,pts1[1].x,pts1[1].y);line(pts2[0].x,pts2[0].y,pts2[1].x,pts2[1].y);}
  if(postulate===0){stroke(220,60,60);strokeWeight(4);line(pts1[1].x,pts1[1].y,pts1[2].x,pts1[2].y);line(pts2[1].x,pts2[1].y,pts2[2].x,pts2[2].y);line(pts1[2].x,pts1[2].y,pts1[0].x,pts1[0].y);line(pts2[2].x,pts2[2].y,pts2[0].x,pts2[0].y);}
  noStroke();fill(40,160,80);textSize(16);textStyle(BOLD);text("≅",width/2,cy1);textStyle(NORMAL);
  var btnY=height-50;for(var i=0;i<4;i++){drawBtn(width/2+(i-2)*90+5,btnY,80,28,POSTS[i],i===postulate);}
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(active?255:60);textSize(12);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-50;for(var i=0;i<4;i++){if(hitB(width/2+(i-2)*90+5,btnY,80,28))postulate=i;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
