/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var A=[[2,1],[3,4]],B=[[1,0],[0,1]],opType=0;
var OPS=["Add","Subtract","Multiply"];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function matOp(){
  if(opType===0)return[[A[0][0]+B[0][0],A[0][1]+B[0][1]],[A[1][0]+B[1][0],A[1][1]+B[1][1]]];
  if(opType===1)return[[A[0][0]-B[0][0],A[0][1]-B[0][1]],[A[1][0]-B[1][0],A[1][1]-B[1][1]]];
  return[[A[0][0]*B[0][0]+A[0][1]*B[1][0],A[0][0]*B[0][1]+A[0][1]*B[1][1]],[A[1][0]*B[0][0]+A[1][1]*B[1][0],A[1][0]*B[0][1]+A[1][1]*B[1][1]]];
}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Matrix Operations",width/2,25);textStyle(NORMAL);
  var C=matOp();var cy=height/2-30;
  drawMat(width/2-220,cy,"A",A,color(80,60,200));
  noStroke();fill(80);textSize(24);text(["+","-","×"][opType],width/2-120,cy+30);
  drawMat(width/2-60,cy,"B",B,color(220,100,40));
  noStroke();fill(80);textSize(24);text("=",width/2+60,cy+30);
  drawMat(width/2+100,cy,"C",C,color(220,60,60));
  fill(80);textSize(13);text("det(A) = "+(A[0][0]*A[1][1]-A[0][1]*A[1][0]),width/2-150,cy+100);
  text("det(B) = "+(B[0][0]*B[1][1]-B[0][1]*B[1][0]),width/2+50,cy+100);
  var btnY=height-40;for(var i=0;i<3;i++)drawBtn(width/2+(i-1)*90-40,btnY,80,26,OPS[i],i===opType);
  drawBtn(width/2+160,btnY,70,26,"Rand B");
}
function drawMat(x,cy,label,M,c){noStroke();fill(c);textSize(12);textStyle(BOLD);text(label,x+40,cy-15);textStyle(NORMAL);stroke(c);strokeWeight(2);noFill();rect(x,cy,80,60,5);noStroke();fill(80);textSize(16);text(M[0][0],x+20,cy+18);text(M[0][1],x+60,cy+18);text(M[1][0],x+20,cy+45);text(M[1][1],x+60,cy+45);}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(active?255:60);textSize(11);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;for(var i=0;i<3;i++){if(hitB(width/2+(i-1)*90-40,btnY,80,26))opType=i;}
  if(hitB(width/2+160,btnY,70,26)){B=[[Math.floor(Math.random()*5),Math.floor(Math.random()*5)],[Math.floor(Math.random()*5),Math.floor(Math.random()*5)]];}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
