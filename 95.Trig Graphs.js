/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var showSin=true,showCos=true,showTan=false,amp=1,freq=1,phase=0;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Trigonometric Graphs",width/2,25);textStyle(NORMAL);
  var gx=60,gy=80,gw=width-120,gh=height-180,midY=gy+gh/2;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(gx+gw/2,gy,gx+gw/2,gy+gh);
  for(var i=0;i<=4;i++){var tx=gx+i*gw/4;stroke(230);line(tx,gy,tx,gy+gh);noStroke();fill(120);textSize(10);var degV=Math.round(-360+i*180);text(degV+"°",tx,gy+gh+12);}
  for(var j=-2;j<=2;j++){var ty=midY-j*gh/4;stroke(230);strokeWeight(0.5);line(gx,ty,gx+gw,ty);noStroke();fill(120);textSize(10);text(j,gx-15,ty);}
  var step=2;
  if(showSin){stroke(80,60,200);strokeWeight(2);noFill();beginShape();for(var px=0;px<gw;px+=step){var deg=-360+px/gw*720;var val=amp*sin(radians(freq*deg+phase));var yy=midY-val*gh/4;vertex(gx+px,yy);}endShape();}
  if(showCos){stroke(40,160,80);strokeWeight(2);noFill();beginShape();for(var px2=0;px2<gw;px2+=step){var deg2=-360+px2/gw*720;var val2=amp*cos(radians(freq*deg2+phase));vertex(gx+px2,midY-val2*gh/4);}endShape();}
  if(showTan){stroke(220,100,40);strokeWeight(1.5);noFill();var prevY=null;for(var px3=0;px3<gw;px3+=step){var deg3=-360+px3/gw*720;var val3=amp*Math.tan(radians(freq*deg3+phase));var yy3=midY-val3*gh/4;if(yy3>gy-50&&yy3<gy+gh+50){if(prevY!==null&&Math.abs(yy3-prevY)<gh){line(gx+px3-step,prevY,gx+px3,yy3);}prevY=yy3;}else prevY=null;}}
  noStroke();textSize(12);textStyle(BOLD);fill(80,60,200);text("sin",gx+gw-50,gy+15);fill(40,160,80);text("cos",gx+gw-50,gy+30);fill(220,100,40);text("tan",gx+gw-50,gy+45);textStyle(NORMAL);
  var btnY=height-50;drawBtn(20,btnY,70,26,"sin "+(showSin?"ON":"OFF"),showSin);drawBtn(100,btnY,70,26,"cos "+(showCos?"ON":"OFF"),showCos);drawBtn(180,btnY,70,26,"tan "+(showTan?"ON":"OFF"),showTan);
  drawBtn(290,btnY,60,26,"Amp -");drawBtn(355,btnY,60,26,"Amp +");drawBtn(450,btnY,60,26,"Freq -");drawBtn(515,btnY,60,26,"Freq +");
  fill(80);textSize(11);text("A="+amp.toFixed(1)+" f="+freq.toFixed(1),width/2+120,btnY+13);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(active?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-50;if(hitB(20,btnY,70,26))showSin=!showSin;if(hitB(100,btnY,70,26))showCos=!showCos;if(hitB(180,btnY,70,26))showTan=!showTan;
  if(hitB(290,btnY,60,26))amp=Math.max(0.5,+(amp-0.5).toFixed(1));if(hitB(355,btnY,60,26))amp=Math.min(3,+(amp+0.5).toFixed(1));
  if(hitB(450,btnY,60,26))freq=Math.max(0.5,+(freq-0.5).toFixed(1));if(hitB(515,btnY,60,26))freq=Math.min(4,+(freq+0.5).toFixed(1));}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
