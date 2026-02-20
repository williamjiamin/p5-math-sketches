/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var verts=[{x:200,y:400},{x:600,y:400},{x:350,y:120}],dragging=-1,centerType=0;
var CENTERS=["Centroid","Circumcenter","Incenter","Orthocenter"];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Triangle Centers",width/2,25);textStyle(NORMAL);
  fill(80,60,200,40);stroke(80,60,200);strokeWeight(2);triangle(verts[0].x,verts[0].y,verts[1].x,verts[1].y,verts[2].x,verts[2].y);
  for(var i=0;i<3;i++){fill(80,60,200);noStroke();ellipse(verts[i].x,verts[i].y,12);fill(60);textSize(11);text(String.fromCharCode(65+i),verts[i].x,verts[i].y-14);}
  var cx,cy;
  if(centerType===0){cx=(verts[0].x+verts[1].x+verts[2].x)/3;cy=(verts[0].y+verts[1].y+verts[2].y)/3;stroke(180,180,180);strokeWeight(1);for(var j=0;j<3;j++){var mx=(verts[(j+1)%3].x+verts[(j+2)%3].x)/2,my=(verts[(j+1)%3].y+verts[(j+2)%3].y)/2;line(verts[j].x,verts[j].y,mx,my);}}
  else if(centerType===1){var ax=verts[0].x,ay=verts[0].y,bx=verts[1].x,by=verts[1].y,cxx=verts[2].x,cyy=verts[2].y;var D=2*(ax*(by-cyy)+bx*(cyy-ay)+cxx*(ay-by));if(Math.abs(D)>0.01){cx=((ax*ax+ay*ay)*(by-cyy)+(bx*bx+by*by)*(cyy-ay)+(cxx*cxx+cyy*cyy)*(ay-by))/D;cy=((ax*ax+ay*ay)*(cxx-bx)+(bx*bx+by*by)*(ax-cxx)+(cxx*cxx+cyy*cyy)*(bx-ax))/D;var r=dist(cx,cy,ax,ay);noFill();stroke(180);strokeWeight(1);ellipse(cx,cy,r*2,r*2);}else{cx=ax;cy=ay;}}
  else if(centerType===2){var a=dist(verts[1].x,verts[1].y,verts[2].x,verts[2].y),b=dist(verts[0].x,verts[0].y,verts[2].x,verts[2].y),c=dist(verts[0].x,verts[0].y,verts[1].x,verts[1].y);var p=a+b+c;cx=(a*verts[0].x+b*verts[1].x+c*verts[2].x)/p;cy=(a*verts[0].y+b*verts[1].y+c*verts[2].y)/p;}
  else{var ax2=verts[0].x,ay2=verts[0].y,bx2=verts[1].x,by2=verts[1].y,cx2=verts[2].x,cy2=verts[2].y;var D2=(bx2-ax2)*(cy2-ay2)-(cx2-ax2)*(by2-ay2);if(Math.abs(D2)>0.01){cx=ax2+((cy2-ay2)*((bx2-ax2)*(bx2-ax2)+(by2-ay2)*(by2-ay2))-(by2-ay2)*((cx2-ax2)*(cx2-ax2)+(cy2-ay2)*(cy2-ay2)))/(2*D2);cy=ay2+((bx2-ax2)*((cx2-ax2)*(cx2-ax2)+(cy2-ay2)*(cy2-ay2))-(cx2-ax2)*((bx2-ax2)*(bx2-ax2)+(by2-ay2)*(by2-ay2)))/(2*D2);}else{cx=ax2;cy=ay2;}}
  fill(220,60,60);noStroke();ellipse(cx,cy,12);
  fill(220,60,60);textSize(12);textStyle(BOLD);text(CENTERS[centerType],cx,cy-14);textStyle(NORMAL);
  var btnY=height-45;for(var k=0;k<4;k++){drawBtn(width/2+(k-2)*110+5,btnY,100,28,CENTERS[k],k===centerType);}
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,6);noStroke();fill(active?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-45;for(var k=0;k<4;k++){if(hitB(width/2+(k-2)*110+5,btnY,100,28))centerType=k;}for(var i=0;i<3;i++){if(dist(mouseX,mouseY,verts[i].x,verts[i].y)<15)dragging=i;}}
function mouseDragged(){if(dragging>=0){verts[dragging].x=constrain(mouseX,20,width-20);verts[dragging].y=constrain(mouseY,60,height-60);}}
function mouseReleased(){dragging=-1;}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
