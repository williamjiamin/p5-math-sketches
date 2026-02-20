/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score=0,total=0,prob={},userAns=0,answered=false;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);newProblem();}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function newProblem(){answered=false;userAns=0;var t=Math.floor(Math.random()*2);
  if(t===0){var a=Math.floor(Math.random()*5)+1,d=Math.floor(Math.random()*4)+1,n=Math.floor(Math.random()*6)+4;var an=a+(n-1)*d;prob={text:"Arithmetic: a₁="+a+", d="+d+", n="+n+". Find Sₙ",ans:n*(a+an)/2};}
  else{var a2=Math.floor(Math.random()*3)+1,r2=2,n2=Math.floor(Math.random()*4)+3;prob={text:"Geometric: a₁="+a2+", r="+r2+", n="+n2+". Find Sₙ",ans:Math.round(a2*(1-Math.pow(r2,n2))/(1-r2))};}}
function draw(){background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Series Practice",width/2,25);textStyle(NORMAL);
  fill(30,50,120);textSize(16);text(prob.text,width/2,70);
  fill(240);stroke(180);strokeWeight(1);rect(width/2-40,100,80,40,8);noStroke();fill(30);textSize(20);textStyle(BOLD);text(userAns,width/2,120);textStyle(NORMAL);
  drawBtn(width/2-100,103,40,34,"-1");drawBtn(width/2-145,103,40,34,"-10");drawBtn(width/2+60,103,40,34,"+1");drawBtn(width/2+105,103,40,34,"+10");
  drawBtn(width/2-40,155,80,32,"Check");
  if(answered){fill(userAns===prob.ans?color(40,160,80):color(220,60,60));textSize(18);textStyle(BOLD);text(userAns===prob.ans?"Correct!":"Answer: "+prob.ans,width/2,210);textStyle(NORMAL);drawBtn(width/2-40,235,80,30,"Next");}
  fill(80);textSize(14);text("Score: "+score+"/"+total,width/2,height-25);}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,8);noStroke();fill(hov?255:60);textSize(13);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){if(!answered){if(hitB(width/2-100,103,40,34))userAns--;if(hitB(width/2-145,103,40,34))userAns-=10;if(hitB(width/2+60,103,40,34))userAns++;if(hitB(width/2+105,103,40,34))userAns+=10;if(hitB(width/2-40,155,80,32)){answered=true;total++;if(userAns===prob.ans)score++;}}if(answered&&hitB(width/2-40,235,80,30))newProblem();}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
