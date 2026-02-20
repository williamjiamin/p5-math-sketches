/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var n=5,r=3;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function factorial(x){var f=1;for(var i=2;i<=x;i++)f*=i;return f;}
function comb(n,r){if(r>n)return 0;return factorial(n)/(factorial(r)*factorial(n-r));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Combinations",width/2,25);textStyle(NORMAL);
  fill(80);textSize(14);text("C(n,r) = n! / (r!(n-r)!) — order doesn't matter",width/2,55);
  fill(80,60,200);textSize(18);textStyle(BOLD);text("C("+n+","+r+") = "+comb(n,r),width/2,85);textStyle(NORMAL);
  fill(100);textSize(13);text(n+"! / ("+r+"! × "+(n-r)+"!) = "+factorial(n)+" / ("+factorial(r)+" × "+factorial(n-r)+") = "+comb(n,r),width/2,110);
  var items=[];var cols=[color(80,60,200),color(220,100,40),color(40,160,80),color(220,60,60),color(160,80,200),color(60,160,200)];
  for(var i=0;i<n;i++)items.push(String.fromCharCode(65+i));
  var iw=40,gap=10,startX=width/2-(n*(iw+gap)-gap)/2;
  for(var j=0;j<n;j++){fill(cols[j%cols.length]);noStroke();rect(startX+j*(iw+gap),140,iw,iw,8);fill(255);textSize(16);textStyle(BOLD);text(items[j],startX+j*(iw+gap)+iw/2,140+iw/2);textStyle(NORMAL);}
  if(comb(n,r)<=56){var combos=getCombs(items,r);var cx=60,cy=210,cw=90,ch=22;for(var k=0;k<combos.length;k++){var px=cx+(k%7)*cw,py=cy+Math.floor(k/7)*(ch+4);fill(k%2===0?color(240,242,255):color(250));noStroke();rect(px,py,cw-4,ch,4);fill(80);textSize(11);text("{"+combos[k].join(",")+"}",px+(cw-4)/2,py+ch/2);}}
  var btnY=height-45;drawBtn(width/2-160,btnY,60,26,"n -");drawBtn(width/2-90,btnY,60,26,"n +");drawBtn(width/2,btnY,60,26,"r -");drawBtn(width/2+70,btnY,60,26,"r +");
}
function getCombs(items,r){var result=[];function bt(start,chosen){if(chosen.length===r){result.push(chosen.slice());return;}for(var i=start;i<items.length;i++){chosen.push(items[i]);bt(i+1,chosen);chosen.pop();}}bt(0,[]);return result;}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(hov?255:60);textSize(11);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;if(hitB(width/2-160,btnY,60,26))n=Math.max(1,n-1);if(hitB(width/2-90,btnY,60,26))n=Math.min(8,n+1);if(hitB(width/2,btnY,60,26))r=Math.max(1,r-1);if(hitB(width/2+70,btnY,60,26))r=Math.min(n,r+1);r=Math.min(r,n);}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
