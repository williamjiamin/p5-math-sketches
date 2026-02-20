/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score=0,total=0,prob={},options=[],answered=-1;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);newProblem();}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function newProblem(){answered=-1;var t=Math.floor(Math.random()*3);
  if(t===0){var a1=Math.floor(Math.random()*7)-3,b1=Math.floor(Math.random()*7)-3,a2=Math.floor(Math.random()*7)-3,b2=Math.floor(Math.random()*7)-3;var rr=a1+a2,ri=b1+b2;prob={q:"("+fmtC(a1,b1)+") + ("+fmtC(a2,b2)+") = ?",ans:fmtC(rr,ri)};options=[fmtC(rr,ri),fmtC(rr+1,ri-1),fmtC(rr-1,ri+2)];}
  else if(t===1){var re=Math.floor(Math.random()*5)-2,im=Math.floor(Math.random()*5)-2;var mag=Math.sqrt(re*re+im*im).toFixed(1);prob={q:"|"+fmtC(re,im)+"| = ?",ans:mag};options=[mag,(+mag+1).toFixed(1),Math.max(0,(+mag-0.5)).toFixed(1)];}
  else{var a3=Math.floor(Math.random()*4)+1,b3=Math.floor(Math.random()*4)+1;var cr=a3*a3-b3*b3;prob={q:"("+fmtC(a3,b3)+")² real part = ?",ans:""+cr};options=[""+cr,""+(cr+2*a3),""+(cr-b3)];}
  for(var i=options.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=options[i];options[i]=options[j];options[j]=tmp;}}
function fmtC(a,b){if(b===undefined)return"";var s=b>=0?"+":"-";return a+s+Math.abs(b)+"i";}
function draw(){background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Complex Numbers Practice",width/2,25);textStyle(NORMAL);
  fill(30,50,120);textSize(16);text(prob.q,width/2,65);
  var optW=130,optH=40,gap=20,startX=width/2-(options.length*optW+(options.length-1)*gap)/2;
  for(var i=0;i<options.length;i++){var ox=startX+i*(optW+gap),oy=100;var hov=mouseX>ox&&mouseX<ox+optW&&mouseY>oy&&mouseY<oy+optH;
    if(answered>=0){if(options[i]===prob.ans)fill(60,200,100);else if(i===answered)fill(220,80,80);else fill(220);}else fill(hov?color(200,210,255):255);
    stroke(180);strokeWeight(2);rect(ox,oy,optW,optH,10);noStroke();fill(60);textSize(13);textStyle(BOLD);text(options[i],ox+optW/2,oy+optH/2);textStyle(NORMAL);}
  if(answered>=0){fill(80,60,200);noStroke();rect(width/2-40,170,80,30,10);fill(255);textSize(13);textStyle(BOLD);text("Next",width/2,185);textStyle(NORMAL);}
  fill(80);textSize(14);text("Score: "+score+"/"+total,width/2,height-25);}
function mousePressed(){if(answered>=0){if(hitB(width/2-40,170,80,30))newProblem();return;}
  var optW=130,optH=40,gap=20,startX=width/2-(options.length*optW+(options.length-1)*gap)/2;
  for(var i=0;i<options.length;i++){var ox=startX+i*(optW+gap);if(mouseX>ox&&mouseX<ox+optW&&mouseY>100&&mouseY<140){answered=i;total++;if(options[i]===prob.ans)score++;}}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
