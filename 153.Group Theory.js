/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var groupType = 0, opA = 0, opB = 0;
var GROUPS = ["Z₄ (integers mod 4)","S₃ (permutations of 3)","Klein Four","Cyclic Z₆"];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Abstract Algebra — Groups",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("A group (G,·) has: closure, associativity, identity, inverses",width/2,52);
  fill(80,60,200);textSize(15);textStyle(BOLD);text(GROUPS[groupType],width/2,75);textStyle(NORMAL);
  if(groupType===0){var n=4;var table=[];for(var i=0;i<n;i++){table[i]=[];for(var j=0;j<n;j++)table[i][j]=(i+j)%n;}
    drawCayleyTable(table,n,["0","1","2","3"],"+");}
  else if(groupType===3){var n2=6;var table2=[];for(var i2=0;i2<n2;i2++){table2[i2]=[];for(var j2=0;j2<n2;j2++)table2[i2][j2]=(i2+j2)%n2;}
    drawCayleyTable(table2,n2,["0","1","2","3","4","5"],"+");}
  else if(groupType===2){var els=["e","a","b","c"];var kt=[[0,1,2,3],[1,0,3,2],[2,3,0,1],[3,2,1,0]];drawCayleyTable(kt,4,els,"·");}
  else{noStroke();fill(100);textSize(13);text("S₃ has 6 elements: {e, (12), (13), (23), (123), (132)}",width/2,120);
    var els2=["e","(12)","(13)","(23)","(123)","(132)"];
    var s3=[[0,1,2,3,4,5],[1,0,4,5,2,3],[2,5,0,4,3,1],[3,4,5,0,1,2],[4,3,1,2,5,0],[5,2,3,1,0,4]];drawCayleyTable(s3,6,els2,"∘");}
  var btnY=height-40;for(var k=0;k<4;k++)drawBtn(width/2+(k-2)*100+10,btnY,90,24,GROUPS[k].split(" ")[0],k===groupType);
}
function drawCayleyTable(table,n,els,op){var sz=Math.min(35,300/n),tx=width/2-n*sz/2-sz/2,ty=110;
  for(var i=-1;i<n;i++){for(var j=-1;j<n;j++){var x=tx+(j+1)*sz,y=ty+(i+1)*sz;if(i===-1&&j===-1){fill(80,60,200,40);stroke(180);strokeWeight(0.5);rect(x,y,sz,sz);noStroke();fill(80);textSize(9);text(op,x+sz/2,y+sz/2);}
    else if(i===-1){fill(80,60,200,20);stroke(180);strokeWeight(0.5);rect(x,y,sz,sz);noStroke();fill(80,60,200);textSize(9);textStyle(BOLD);text(els[j],x+sz/2,y+sz/2);textStyle(NORMAL);}
    else if(j===-1){fill(80,60,200,20);stroke(180);strokeWeight(0.5);rect(x,y,sz,sz);noStroke();fill(80,60,200);textSize(9);textStyle(BOLD);text(els[i],x+sz/2,y+sz/2);textStyle(NORMAL);}
    else{var val=table[i][j];fill(val===0?color(220,240,220):color(255));stroke(180);strokeWeight(0.5);rect(x,y,sz,sz);noStroke();fill(60);textSize(9);text(els[val],x+sz/2,y+sz/2);}}}}
function drawBtn(x,y,w,h,label,active){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(active?color(80,60,200):(hov?color(200,210,255):255));stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(active?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-40;for(var k=0;k<4;k++){if(hitB(width/2+(k-2)*100+10,btnY,90,24))groupType=k;}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
