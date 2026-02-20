/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var mat={a:1,b:0,c:0,d:1},tType=0;
var TYPES=["Identity","Rotation","Scale","Shear","Reflection"];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("2D Matrix Transformations",width/2,25);textStyle(NORMAL);
  var cx=width/2,cy=height/2+10,sc=35;
  stroke(220);strokeWeight(0.5);for(var gx=-6;gx<=6;gx++)line(cx+gx*sc,cy-6*sc,cx+gx*sc,cy+6*sc);for(var gy=-6;gy<=6;gy++)line(cx-6*sc,cy+gy*sc,cx+6*sc,cy+gy*sc);
  stroke(180);strokeWeight(1.5);line(cx-6*sc,cy,cx+6*sc,cy);line(cx,cy-6*sc,cx,cy+6*sc);
  var sq=[{x:0,y:0},{x:2,y:0},{x:2,y:2},{x:0,y:2}];
  fill(200,200,255,60);stroke(180);strokeWeight(1);beginShape();for(var i=0;i<4;i++)vertex(cx+sq[i].x*sc,cy-sq[i].y*sc);endShape(CLOSE);
  var tsq=[];for(var j=0;j<4;j++){tsq.push({x:mat.a*sq[j].x+mat.b*sq[j].y,y:mat.c*sq[j].x+mat.d*sq[j].y});}
  fill(80,60,200,50);stroke(80,60,200);strokeWeight(2);beginShape();for(var k=0;k<4;k++)vertex(cx+tsq[k].x*sc,cy-tsq[k].y*sc);endShape(CLOSE);
  drawArrow(cx,cy,cx+mat.a*sc*2,cy-mat.c*sc*2,color(220,60,60),2);
  drawArrow(cx,cy,cx+mat.b*sc*2,cy-mat.d*sc*2,color(40,160,80),2);
  noStroke();fill(220,60,60);textSize(10);text("e₁'",cx+mat.a*sc*2+10,cy-mat.c*sc*2);
  fill(40,160,80);text("e₂'",cx+mat.b*sc*2+10,cy-mat.d*sc*2);
  fill(80);textSize(13);text("["+mat.a.toFixed(1)+"  "+mat.b.toFixed(1)+"]",width/2,height-100);text("["+mat.c.toFixed(1)+"  "+mat.d.toFixed(1)+"]",width/2,height-82);
  fill(80,60,200);textSize(14);textStyle(BOLD);text(TYPES[tType],width/2,55);textStyle(NORMAL);
  var btnY=height-45;for(var t=0;t<TYPES.length;t++){drawBtn(width/2+(t-2)*90,btnY,85,26,TYPES[t],t===tType);}
}
function drawArrow(x1,y1,x2,y2,c,sw){stroke(c);strokeWeight(sw);line(x1,y1,x2,y2);var ang=atan2(y2-y1,x2-x1);var hl=8;line(x2,y2,x2-hl*cos(ang-PI/6),y2-hl*sin(ang-PI/6));line(x2,y2,x2-hl*cos(ang+PI/6),y2-hl*sin(ang+PI/6));}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;for(var t=0;t<TYPES.length;t++){if(hitB(width/2+(t-2)*90,btnY,85,26)){tType=t;applyType();}}}
function applyType(){if(tType===0)mat={a:1,b:0,c:0,d:1};else if(tType===1){var a=PI/4;mat={a:cos(a),b:-sin(a),c:sin(a),d:cos(a)};}else if(tType===2)mat={a:2,b:0,c:0,d:1.5};else if(tType===3)mat={a:1,b:0.5,c:0,d:1};else mat={a:-1,b:0,c:0,d:1};}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
