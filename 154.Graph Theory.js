/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var nodes=[],edges=[],graphType=0,dragging=-1;
var GRAPHS=["Complete K₅","Cycle C₆","Petersen","Bipartite K₃₃"];
function makeGraph(){nodes=[];edges=[];var cx=width/2,cy=height/2+10,r=150;
  if(graphType===0){for(var i=0;i<5;i++){var a=TWO_PI*i/5-HALF_PI;nodes.push({x:cx+r*cos(a),y:cy+r*sin(a)});}for(var i2=0;i2<5;i2++)for(var j=i2+1;j<5;j++)edges.push([i2,j]);}
  else if(graphType===1){for(var i3=0;i3<6;i3++){var a2=TWO_PI*i3/6-HALF_PI;nodes.push({x:cx+r*cos(a2),y:cy+r*sin(a2)});}for(var i4=0;i4<6;i4++)edges.push([i4,(i4+1)%6]);}
  else if(graphType===2){for(var i5=0;i5<5;i5++){var a3=TWO_PI*i5/5-HALF_PI;nodes.push({x:cx+r*cos(a3),y:cy+r*sin(a3)});}for(var i6=0;i6<5;i6++){var a4=TWO_PI*i6/5-HALF_PI;nodes.push({x:cx+r*0.5*cos(a4),y:cy+r*0.5*sin(a4)});}for(var i7=0;i7<5;i7++){edges.push([i7,(i7+1)%5]);edges.push([i7,i7+5]);edges.push([i7+5,(i7+2)%5+5]);}}
  else{for(var i8=0;i8<3;i8++){nodes.push({x:cx-120,y:cy-80+i8*80});}for(var i9=0;i9<3;i9++){nodes.push({x:cx+120,y:cy-80+i9*80});}for(var a5=0;a5<3;a5++)for(var b=0;b<3;b++)edges.push([a5,b+3]);}}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);makeGraph();}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Graph Theory",width/2,25);textStyle(NORMAL);
  fill(80,60,200);textSize(15);text(GRAPHS[graphType],width/2,55);
  for(var i=0;i<edges.length;i++){stroke(180);strokeWeight(2);line(nodes[edges[i][0]].x,nodes[edges[i][0]].y,nodes[edges[i][1]].x,nodes[edges[i][1]].y);}
  for(var j=0;j<nodes.length;j++){fill(80,60,200);noStroke();ellipse(nodes[j].x,nodes[j].y,20,20);fill(255);textSize(10);textStyle(BOLD);text(j,nodes[j].x,nodes[j].y);textStyle(NORMAL);}
  noStroke();fill(80);textSize(12);text("V="+nodes.length+"  E="+edges.length+"  χ(Euler)="+(nodes.length-edges.length),width/2,height-80);
  var deg=[];for(var k=0;k<nodes.length;k++)deg[k]=0;for(var e=0;e<edges.length;e++){deg[edges[e][0]]++;deg[edges[e][1]]++;}
  text("Degrees: ["+deg.join(",")+"]",width/2,height-60);
  var btnY=height-35;for(var g=0;g<4;g++)drawBtn(width/2+(g-2)*100+10,btnY,90,24,GRAPHS[g],g===graphType);
}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(8);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;for(var g=0;g<4;g++){if(hitB(width/2+(g-2)*100+10,btnY,90,24)){graphType=g;makeGraph();return;}}for(var i=0;i<nodes.length;i++){if(dist(mouseX,mouseY,nodes[i].x,nodes[i].y)<15)dragging=i;}}
function mouseDragged(){if(dragging>=0){nodes[dragging].x=mouseX;nodes[dragging].y=mouseY;}}
function mouseReleased(){dragging=-1;}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
