/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var walks=[],nWalks=5,nSteps=200;
function resetWalks(){walks=[];for(var w=0;w<nWalks;w++){var path=[{x:0,y:0}];for(var s=0;s<nSteps;s++){var prev=path[path.length-1];var dir=Math.floor(Math.random()*4);var nx=prev.x+(dir===0?1:(dir===1?-1:0)),ny=prev.y+(dir===2?1:(dir===3?-1:0));path.push({x:nx,y:ny});}walks.push(path);}}
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);resetWalks();}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Random Walks",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("2D lattice random walk — E[distance] ∝ √n",width/2,52);
  var cx=width/2,cy=height/2+10,sc=5;
  stroke(200);strokeWeight(0.5);line(cx-200,cy,cx+200,cy);line(cx,cy-200,cx,cy+200);
  var cols=[color(80,60,200),color(220,100,40),color(40,160,80),color(220,60,60),color(160,80,200)];
  for(var w=0;w<walks.length;w++){stroke(cols[w%cols.length]);strokeWeight(1.5);for(var s=1;s<walks[w].length;s++){line(cx+walks[w][s-1].x*sc,cy-walks[w][s-1].y*sc,cx+walks[w][s].x*sc,cy-walks[w][s].y*sc);}
    var last=walks[w][walks[w].length-1];fill(cols[w%cols.length]);noStroke();ellipse(cx+last.x*sc,cy-last.y*sc,8,8);}
  fill(255);stroke(80);strokeWeight(2);ellipse(cx,cy,10,10);
  noStroke();fill(80);textSize(11);
  var dists=[];for(var w2=0;w2<walks.length;w2++){var l=walks[w2][walks[w2].length-1];dists.push(Math.sqrt(l.x*l.x+l.y*l.y).toFixed(1));}
  text("Final distances: ["+dists.join(", ")+"]   √n = "+Math.sqrt(nSteps).toFixed(1),width/2,height-65);
  text(nWalks+" walks, "+nSteps+" steps each",width/2,height-45);
  var btnY=height-30;drawBtn(width/2-80,btnY,70,22,"New Walks");drawBtn(width/2+10,btnY,55,22,"Steps -");drawBtn(width/2+70,btnY,55,22,"Steps +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-30;if(hitB(width/2-80,btnY,70,22))resetWalks();if(hitB(width/2+10,btnY,55,22)){nSteps=Math.max(20,nSteps-50);resetWalks();}if(hitB(width/2+70,btnY,55,22)){nSteps=Math.min(1000,nSteps+50);resetWalks();}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
