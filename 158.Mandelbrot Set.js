/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var centerX=-0.5,centerY=0,zoom=200,maxIter=50,needsRedraw=true;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);pixelDensity(1);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));needsRedraw=true;}
function draw(){
  if(needsRedraw){needsRedraw=false;loadPixels();for(var px=0;px<width;px++){for(var py=0;py<height;py++){var x0=(px-width/2)/zoom+centerX,y0=(py-height/2)/zoom+centerY;var x=0,y=0,iter=0;while(x*x+y*y<=4&&iter<maxIter){var xt=x*x-y*y+x0;y=2*x*y+y0;x=xt;iter++;}
      var idx=(py*width+px)*4;if(iter===maxIter){pixels[idx]=0;pixels[idx+1]=0;pixels[idx+2]=0;}else{var t=iter/maxIter;pixels[idx]=Math.floor(80+140*t);pixels[idx+1]=Math.floor(60+100*sin(t*PI));pixels[idx+2]=Math.floor(200*t);}pixels[idx+3]=255;}}updatePixels();}
  noStroke();fill(255,255,255,200);rect(0,0,width,30);fill(60,40,120);textSize(15);textStyle(BOLD);text("Mandelbrot Set — zₙ₊₁ = zₙ² + c",width/2,15);textStyle(NORMAL);
  fill(255,255,255,180);rect(0,height-35,width,35);fill(80);textSize(10);text("Zoom: "+zoom.toFixed(0)+"  Center: ("+centerX.toFixed(4)+", "+centerY.toFixed(4)+")  Iter: "+maxIter,width/2,height-22);
  drawBtn(10,height-32,55,24,"Zoom In");drawBtn(70,height-32,60,24,"Zoom Out");drawBtn(140,height-32,55,24,"Iter +");drawBtn(200,height-32,55,24,"Reset");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):color(255,255,255,200));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-32;if(hitB(10,btnY,55,24)){zoom*=2;needsRedraw=true;return;}if(hitB(70,btnY,60,24)){zoom=Math.max(50,zoom/2);needsRedraw=true;return;}if(hitB(140,btnY,55,24)){maxIter=Math.min(500,maxIter+25);needsRedraw=true;return;}if(hitB(200,btnY,55,24)){centerX=-0.5;centerY=0;zoom=200;maxIter=50;needsRedraw=true;return;}
  if(mouseY<height-35){centerX+=(mouseX-width/2)/zoom;centerY+=(mouseY-height/2)/zoom;zoom*=1.5;needsRedraw=true;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
