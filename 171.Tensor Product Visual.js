/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var v1=[2,1],v2=[1,3];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Tensor (Outer) Product",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("v ⊗ w creates a matrix from two vectors: (v⊗w)ᵢⱼ = vᵢwⱼ",width/2,52);
  var tensor=[];for(var i=0;i<v1.length;i++){tensor[i]=[];for(var j=0;j<v2.length;j++)tensor[i][j]=v1[i]*v2[j];}
  var cx=width/2,cy=180;
  fill(80,60,200);textSize(14);textStyle(BOLD);text("v = ["+v1.join(", ")+"]",cx-120,80);
  fill(220,100,40);text("w = ["+v2.join(", ")+"]",cx+120,80);textStyle(NORMAL);
  noStroke();fill(80);textSize(18);text("⊗",cx,80);text("=",cx,cy-20);
  var sz=50,tx=cx-v2.length*sz/2,ty=cy;
  for(var i2=0;i2<v1.length;i2++){for(var j2=0;j2<v2.length;j2++){var val=tensor[i2][j2];fill(val>0?color(80,60,200,40+val*20):color(220,60,60,40-val*20));stroke(180);strokeWeight(1);rect(tx+j2*sz,ty+i2*sz,sz,sz);noStroke();fill(60);textSize(16);textStyle(BOLD);text(val,tx+j2*sz+sz/2,ty+i2*sz+sz/2);textStyle(NORMAL);}}
  for(var i3=0;i3<v1.length;i3++){fill(80,60,200);textSize(12);text("v["+i3+"]="+v1[i3],tx-30,ty+i3*sz+sz/2);}
  for(var j3=0;j3<v2.length;j3++){fill(220,100,40);textSize(12);text("w["+j3+"]="+v2[j3],tx+j3*sz+sz/2,ty-12);}
  fill(80);textSize(12);text("rank(v⊗w) = 1 always  (rank-1 matrix)",width/2,ty+v1.length*sz+30);
  var gridCy=ty+v1.length*sz+70,sc=30;
  noStroke();fill(100);textSize(11);text("Visual: scaled copies of w stacked by v components",width/2,gridCy);
  stroke(200);strokeWeight(0.5);line(cx-3*sc,gridCy+20,cx+3*sc,gridCy+20);line(cx,gridCy+20-2*sc,cx,gridCy+20+2*sc);
  for(var i4=0;i4<v1.length;i4++){var vy=v1[i4];for(var j4=0;j4<v2.length;j4++){var wx=v2[j4];var px2=cx+wx*vy*sc*0.3,py2=gridCy+20-i4*sc*0.8;fill(80,60,200,100+tensor[i4][j4]*20);noStroke();ellipse(px2,py2,Math.abs(tensor[i4][j4])*4+4,Math.abs(tensor[i4][j4])*4+4);}}
  var btnY=height-30;drawBtn(20,btnY,40,22,"v0-");drawBtn(64,btnY,40,22,"v0+");drawBtn(110,btnY,40,22,"v1-");drawBtn(154,btnY,40,22,"v1+");drawBtn(210,btnY,40,22,"w0-");drawBtn(254,btnY,40,22,"w0+");drawBtn(300,btnY,40,22,"w1-");drawBtn(344,btnY,40,22,"w1+");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(8);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-30;if(hitB(20,btnY,40,22))v1[0]--;if(hitB(64,btnY,40,22))v1[0]++;if(hitB(110,btnY,40,22))v1[1]--;if(hitB(154,btnY,40,22))v1[1]++;if(hitB(210,btnY,40,22))v2[0]--;if(hitB(254,btnY,40,22))v2[0]++;if(hitB(300,btnY,40,22))v2[1]--;if(hitB(344,btnY,40,22))v2[1]++;}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
