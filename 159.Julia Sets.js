/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var cRe=-0.7,cIm=0.27015,zoom=180,maxIter=50,needsRedraw=true;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);pixelDensity(1);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));needsRedraw=true;}
function draw(){
  if(needsRedraw){needsRedraw=false;loadPixels();for(var px=0;px<width;px++){for(var py=0;py<height;py++){var x=(px-width/2)/zoom,y=(py-height/2)/zoom;var iter=0;while(x*x+y*y<=4&&iter<maxIter){var xt=x*x-y*y+cRe;y=2*x*y+cIm;x=xt;iter++;}
      var idx=(py*width+px)*4;if(iter===maxIter){pixels[idx]=0;pixels[idx+1]=0;pixels[idx+2]=30;}else{var t=iter/maxIter;pixels[idx]=Math.floor(200*sin(t*PI));pixels[idx+1]=Math.floor(60+100*t);pixels[idx+2]=Math.floor(80+120*cos(t*PI));}pixels[idx+3]=255;}}updatePixels();}
  noStroke();fill(255,255,255,200);rect(0,0,width,30);fill(60,40,120);textSize(15);textStyle(BOLD);text("Julia Set — z² + c,  c = "+cRe.toFixed(3)+" + "+cIm.toFixed(3)+"i",width/2,15);textStyle(NORMAL);
  fill(255,255,255,180);rect(0,height-35,width,35);
  drawBtn(10,height-32,55,24,"Re -");drawBtn(70,height-32,55,24,"Re +");drawBtn(140,height-32,55,24,"Im -");drawBtn(200,height-32,55,24,"Im +");drawBtn(270,height-32,55,24,"Zoom +");drawBtn(330,height-32,55,24,"Reset");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):color(255,255,255,200));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-32;if(hitB(10,btnY,55,24)){cRe=+(cRe-0.05).toFixed(3);needsRedraw=true;}if(hitB(70,btnY,55,24)){cRe=+(cRe+0.05).toFixed(3);needsRedraw=true;}if(hitB(140,btnY,55,24)){cIm=+(cIm-0.05).toFixed(3);needsRedraw=true;}if(hitB(200,btnY,55,24)){cIm=+(cIm+0.05).toFixed(3);needsRedraw=true;}if(hitB(270,btnY,55,24)){zoom*=1.5;needsRedraw=true;}if(hitB(330,btnY,55,24)){cRe=-0.7;cIm=0.27015;zoom=180;needsRedraw=true;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
