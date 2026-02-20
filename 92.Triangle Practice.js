/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score=0,total=0,prob={},options=[],correctIdx=0,answered=-1;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);newProblem();}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function newProblem(){answered=-1;var t=Math.floor(Math.random()*2);
  if(t===0){var a=Math.floor(Math.random()*60)+30,b=Math.floor(Math.random()*60)+30;var c=180-a-b;prob={q:"Triangle angles: "+a+"° and "+b+"°. Third angle?",ans:""+c};options=[""+c,""+(c+10),""+(c-10)];}
  else{var s=Math.floor(Math.random()*3);var names=["SSS","SAS","ASA"];prob={q:"Two triangles with 3 equal sides. Which postulate?",ans:names[s]};options=[names[s],names[(s+1)%3],names[(s+2)%3]];}
  for(var i=options.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=options[i];options[i]=options[j];options[j]=tmp;}correctIdx=options.indexOf(prob.ans);}
function draw(){background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Triangle Practice",width/2,25);textStyle(NORMAL);
  fill(30,50,120);textSize(16);text(prob.q,width/2,65);
  var optW=120,optH=40,gap=20,startX=width/2-(options.length*optW+(options.length-1)*gap)/2;
  for(var i=0;i<options.length;i++){var ox=startX+i*(optW+gap),oy=100;var hov=mouseX>ox&&mouseX<ox+optW&&mouseY>oy&&mouseY<oy+optH;if(answered>=0){if(i===correctIdx)fill(60,200,100);else if(i===answered)fill(220,80,80);else fill(220);}else fill(hov?color(200,210,255):255);stroke(180);strokeWeight(2);rect(ox,oy,optW,optH,10);noStroke();fill(60);textSize(16);textStyle(BOLD);text(options[i],ox+optW/2,oy+optH/2);textStyle(NORMAL);}
  if(answered>=0)drawBtn(width/2-40,175,80,30,"Next");fill(80);textSize(14);text("Score: "+score+"/"+total,width/2,height-25);}
function drawBtn(x,y,w,h,label){fill(color(80,60,200));noStroke();rect(x,y,w,h,10);fill(255);textSize(13);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){if(answered>=0){if(hitB(width/2-40,175,80,30))newProblem();return;}var optW=120,optH=40,gap=20,startX=width/2-(options.length*optW+(options.length-1)*gap)/2;for(var i=0;i<options.length;i++){var ox=startX+i*(optW+gap);if(mouseX>ox&&mouseX<ox+optW&&mouseY>100&&mouseY<140){answered=i;total++;if(i===correctIdx)score++;}}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
