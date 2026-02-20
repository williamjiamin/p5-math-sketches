/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var z1={re:2,im:1},z2={re:-1,im:3},op=0;
var OPS=["Add","Subtract","Multiply","Divide"];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Complex Number Operations",width/2,25);textStyle(NORMAL);
  var result;
  if(op===0)result={re:z1.re+z2.re,im:z1.im+z2.im};
  else if(op===1)result={re:z1.re-z2.re,im:z1.im-z2.im};
  else if(op===2)result={re:z1.re*z2.re-z1.im*z2.im,im:z1.re*z2.im+z1.im*z2.re};
  else{var d=z2.re*z2.re+z2.im*z2.im;if(d>0.001)result={re:(z1.re*z2.re+z1.im*z2.im)/d,im:(z1.im*z2.re-z1.re*z2.im)/d};else result={re:0,im:0};}
  var cx=width/2,cy=height/2+20,sc=30;
  stroke(220);strokeWeight(0.5);for(var gx=-8;gx<=8;gx++)line(cx+gx*sc,cy-6*sc,cx+gx*sc,cy+6*sc);for(var gy=-6;gy<=6;gy++)line(cx-8*sc,cy+gy*sc,cx+8*sc,cy+gy*sc);
  stroke(180);strokeWeight(1.5);line(cx-8*sc,cy,cx+8*sc,cy);line(cx,cy-6*sc,cx,cy+6*sc);
  fill(80,60,200);noStroke();ellipse(cx+z1.re*sc,cy-z1.im*sc,10,10);
  fill(220,100,40);ellipse(cx+z2.re*sc,cy-z2.im*sc,10,10);
  fill(220,60,60);ellipse(cx+result.re*sc,cy-result.im*sc,12,12);
  noStroke();fill(80,60,200);textSize(11);text("z₁="+fmtC(z1),cx+z1.re*sc+10,cy-z1.im*sc-12);
  fill(220,100,40);text("z₂="+fmtC(z2),cx+z2.re*sc+10,cy-z2.im*sc-12);
  fill(220,60,60);textStyle(BOLD);text("Result="+fmtC(result),cx+result.re*sc+10,cy-result.im*sc+14);textStyle(NORMAL);
  fill(80,60,200);textSize(16);textStyle(BOLD);text(fmtC(z1)+" "+["+","-","×","÷"][op]+" "+fmtC(z2)+" = "+fmtC(result),width/2,55);textStyle(NORMAL);
  var btnY=height-45;for(var i=0;i<4;i++){drawBtn(width/2+(i-2)*90+5,btnY,80,26,OPS[i],i===op);}
}
function fmtC(z){var s=z.im>=0?"+":"-";return z.re.toFixed(1)+s+Math.abs(z.im).toFixed(1)+"i";}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(active?255:60);textSize(11);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;for(var i=0;i<4;i++){if(hitB(width/2+(i-2)*90+5,btnY,80,26))op=i;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
