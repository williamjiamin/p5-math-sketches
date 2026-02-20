/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score=0,total=0,prob={},options=[],answered=-1;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);newProblem();}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function factorial(x){var f=1;for(var i=2;i<=x;i++)f*=i;return f;}
function perm(n,r){return factorial(n)/factorial(n-r);}
function comb(n,r){return factorial(n)/(factorial(r)*factorial(n-r));}
function newProblem(){answered=-1;var t=Math.floor(Math.random()*3);
  if(t===0){var n=Math.floor(Math.random()*4)+3,r=Math.floor(Math.random()*n)+1;var ans=perm(n,r);prob={q:"P("+n+","+r+") = ?",ans:""+ans};options=[""+ans,""+(ans+n),""+(ans-r+1)];}
  else if(t===1){var n2=Math.floor(Math.random()*5)+3,r2=Math.floor(Math.random()*(n2-1))+1;var ans2=comb(n2,r2);prob={q:"C("+n2+","+r2+") = ?",ans:""+ans2};options=[""+ans2,""+(ans2+2),""+(ans2*2)];}
  else{var n3=Math.floor(Math.random()*3)+4;var ans3=factorial(n3);prob={q:n3+"! = ?",ans:""+ans3};options=[""+ans3,""+(ans3+n3),""+(ans3/2)];}
  for(var i=options.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=options[i];options[i]=options[j];options[j]=tmp;}}
function draw(){background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Combinatorics Practice",width/2,25);textStyle(NORMAL);
  fill(30,50,120);textSize(18);text(prob.q,width/2,65);
  var optW=120,optH=40,gap=20,startX=width/2-(options.length*optW+(options.length-1)*gap)/2;
  for(var i=0;i<options.length;i++){var ox=startX+i*(optW+gap),oy=100;var hov=mouseX>ox&&mouseX<ox+optW&&mouseY>oy&&mouseY<oy+optH;
    if(answered>=0){if(options[i]===prob.ans)fill(60,200,100);else if(i===answered)fill(220,80,80);else fill(220);}else fill(hov?color(200,210,255):255);
    stroke(180);strokeWeight(2);rect(ox,oy,optW,optH,10);noStroke();fill(60);textSize(14);textStyle(BOLD);text(options[i],ox+optW/2,oy+optH/2);textStyle(NORMAL);}
  if(answered>=0){fill(80,60,200);noStroke();rect(width/2-40,170,80,30,10);fill(255);textSize(13);textStyle(BOLD);text("Next",width/2,185);textStyle(NORMAL);}
  fill(80);textSize(14);text("Score: "+score+"/"+total,width/2,height-25);}
function mousePressed(){if(answered>=0){if(hitB(width/2-40,170,80,30))newProblem();return;}
  var optW=120,optH=40,gap=20,startX=width/2-(options.length*optW+(options.length-1)*gap)/2;
  for(var i=0;i<options.length;i++){var ox=startX+i*(optW+gap);if(mouseX>ox&&mouseX<ox+optW&&mouseY>100&&mouseY<140){answered=i;total++;if(options[i]===prob.ans)score++;}}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
