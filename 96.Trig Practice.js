/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score=0,total=0,prob={},options=[],answered=-1;
var SPECIAL=[{a:0,s:0,c:1},{a:30,s:0.5,c:0.866},{a:45,s:0.707,c:0.707},{a:60,s:0.866,c:0.5},{a:90,s:1,c:0}];
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);newProblem();}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function newProblem(){
  answered=-1;var idx=Math.floor(Math.random()*SPECIAL.length);var sp=SPECIAL[idx];
  var fn=Math.floor(Math.random()*2);
  if(fn===0){prob={q:"sin("+sp.a+"°) = ?",ans:""+sp.s};var w1=+(sp.s+0.2).toFixed(3),w2=+(sp.s-0.3+0.001).toFixed(3);options=[""+sp.s,""+Math.abs(w1),""+Math.abs(w2)];}
  else{prob={q:"cos("+sp.a+"°) = ?",ans:""+sp.c};var w3=+(sp.c+0.134).toFixed(3),w4=+(sp.c-0.234+0.001).toFixed(3);options=[""+sp.c,""+Math.abs(w3),""+Math.abs(w4)];}
  for(var i=options.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=options[i];options[i]=options[j];options[j]=tmp;}
}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Trig Practice",width/2,25);textStyle(NORMAL);
  fill(30,50,120);textSize(18);text(prob.q,width/2,70);
  var optW=110,optH=40,gap=20,startX=width/2-(options.length*optW+(options.length-1)*gap)/2;
  for(var i=0;i<options.length;i++){var ox=startX+i*(optW+gap),oy=110;var hov=mouseX>ox&&mouseX<ox+optW&&mouseY>oy&&mouseY<oy+optH;
    if(answered>=0){if(options[i]===prob.ans)fill(60,200,100);else if(i===answered)fill(220,80,80);else fill(220);}else fill(hov?color(200,210,255):255);
    stroke(180);strokeWeight(2);rect(ox,oy,optW,optH,10);noStroke();fill(60);textSize(14);textStyle(BOLD);text(options[i],ox+optW/2,oy+optH/2);textStyle(NORMAL);}
  if(answered>=0){fill(80,60,200);noStroke();rect(width/2-40,175,80,30,10);fill(255);textSize(13);textStyle(BOLD);text("Next",width/2,190);textStyle(NORMAL);}
  fill(80);textSize(14);text("Score: "+score+"/"+total,width/2,height-25);
}
function mousePressed(){if(answered>=0){if(hitB(width/2-40,175,80,30))newProblem();return;}
  var optW=110,optH=40,gap=20,startX=width/2-(options.length*optW+(options.length-1)*gap)/2;
  for(var i=0;i<options.length;i++){var ox=startX+i*(optW+gap);if(mouseX>ox&&mouseX<ox+optW&&mouseY>110&&mouseY<150){answered=i;total++;if(options[i]===prob.ans)score++;}}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
