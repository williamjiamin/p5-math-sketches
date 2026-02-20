/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var points = [], showLine = true;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);for(var i=0;i<12;i++){points.push({x:Math.random()*6+0.5,y:Math.random()*6+0.5});}}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Linear Regression (Least Squares)",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("Click to add points. Best-fit line minimizes sum of squared residuals.",width/2,52);
  var gx=80,gy=70,gw=width-160,gh=height-180;
  var scX=gw/8,scY=gh/8;
  stroke(200);strokeWeight(1);line(gx,gy+gh,gx+gw,gy+gh);line(gx,gy,gx,gy+gh);
  for(var i=0;i<=8;i++){noStroke();fill(180);textSize(8);text(i,gx+i*scX,gy+gh+12);text(i,gx-14,gy+gh-i*scY);}
  for(var j=0;j<points.length;j++){fill(80,60,200);noStroke();ellipse(gx+points[j].x*scX,gy+gh-points[j].y*scY,10,10);}
  if(points.length>=2&&showLine){var n2=points.length,sx=0,sy=0,sxx=0,sxy=0;for(var k=0;k<n2;k++){sx+=points[k].x;sy+=points[k].y;sxx+=points[k].x*points[k].x;sxy+=points[k].x*points[k].y;}
    var m=(n2*sxy-sx*sy)/(n2*sxx-sx*sx),b2=(sy-m*sx)/n2;
    stroke(220,60,60);strokeWeight(2);var y1=m*0+b2,y2=m*8+b2;line(gx,gy+gh-y1*scY,gx+8*scX,gy+gh-y2*scY);
    for(var k2=0;k2<n2;k2++){var pred=m*points[k2].x+b2;stroke(220,60,60,80);strokeWeight(1);drawingContext.setLineDash([3,3]);line(gx+points[k2].x*scX,gy+gh-points[k2].y*scY,gx+points[k2].x*scX,gy+gh-pred*scY);drawingContext.setLineDash([]);}
    var ss=0;for(var k3=0;k3<n2;k3++){var r2=points[k3].y-(m*points[k3].x+b2);ss+=r2*r2;}
    var r2val=1-ss/(n2*variance(points.map(function(p){return p.y;})));
    noStroke();fill(220,60,60);textSize(13);text("y = "+m.toFixed(2)+"x + "+b2.toFixed(2),width/2,gy+gh+20);fill(80);textSize(11);text("R² = "+r2val.toFixed(3)+"   SSE = "+ss.toFixed(2),width/2,gy+gh+40);}
  var btnY=height-35;drawBtn(width/2-60,btnY,55,24,"Clear");drawBtn(width/2+5,btnY,70,24,"Random");
}
function variance(arr){var m2=arr.reduce(function(a,b){return a+b;},0)/arr.length;var s=0;for(var i=0;i<arr.length;i++)s+=(arr[i]-m2)*(arr[i]-m2);return s/arr.length;}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-60,btnY,55,24)){points=[];return;}if(hitB(width/2+5,btnY,70,24)){points=[];for(var i=0;i<12;i++)points.push({x:Math.random()*6+0.5,y:Math.random()*6+0.5});return;}
  var gx=80,gy=70,gw=width-160,gh=height-180,scX=gw/8,scY=gh/8;
  if(mouseX>gx&&mouseX<gx+gw&&mouseY>gy&&mouseY<gy+gh){var px=(mouseX-gx)/scX,py2=(gy+gh-mouseY)/scY;if(px>=0&&px<=8&&py2>=0&&py2<=8)points.push({x:px,y:py2});}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
