/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score = 0, total = 0, prob = {}, userAns = 0, answered = false;
function setup() { createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); textFont("Arial"); textAlign(CENTER, CENTER); newProblem(); }
function windowResized() { resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight)); }
function newProblem() { answered = false; userAns = 0; var b = [2,3,5,10][Math.floor(Math.random()*4)]; var e = Math.floor(Math.random()*4)+1; var r = Math.pow(b,e); if (Math.random()<0.5) prob={text:"log_"+b+"("+r+") = ?",ans:e}; else prob={text:b+"^? = "+r,ans:e}; }
function draw() {
  background(245,247,252); noStroke(); fill(60,40,120); textSize(22); textStyle(BOLD); text("Exponential & Log Practice",width/2,25); textStyle(NORMAL);
  fill(30,50,120); textSize(22); text(prob.text,width/2,75);
  fill(240); stroke(180); strokeWeight(1); rect(width/2-30,110,60,40,8);
  noStroke(); fill(30); textSize(22); textStyle(BOLD); text(userAns,width/2,130); textStyle(NORMAL);
  drawBtn(width/2-80,113,35,34,"-"); drawBtn(width/2+45,113,35,34,"+");
  drawBtn(width/2-40,165,80,32,"Check");
  if(answered){fill(userAns===prob.ans?color(40,160,80):color(220,60,60));textSize(18);textStyle(BOLD);text(userAns===prob.ans?"Correct!":"Answer: "+prob.ans,width/2,220);textStyle(NORMAL);drawBtn(width/2-40,245,80,30,"Next");}
  fill(80);textSize(14);text("Score: "+score+"/"+total,width/2,height-25);
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,8);noStroke();fill(hov?255:60);textSize(14);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){if(!answered){if(hitB(width/2-80,113,35,34))userAns--;if(hitB(width/2+45,113,35,34))userAns++;if(hitB(width/2-40,165,80,32)){answered=true;total++;if(userAns===prob.ans)score++;}}if(answered&&hitB(width/2-40,245,80,30))newProblem();}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
