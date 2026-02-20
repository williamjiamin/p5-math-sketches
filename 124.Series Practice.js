/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score=0,total=0,prob={},options=[],answered=-1;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);newProblem();}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function newProblem(){answered=-1;var t=Math.floor(Math.random()*3);
  if(t===0){var r2=Math.random()*0.8+0.1;var ans=(1/(1-r2)).toFixed(2);prob={q:"Geometric: Σ "+r2.toFixed(1)+"ⁿ converges to?",ans:ans};options=[ans,(+ans+0.5).toFixed(2),(+ans-0.3).toFixed(2)];}
  else if(t===1){var series2=["Σ1/n","Σ1/n²","Σ1/2ⁿ"];var conv2=["Diverges","Converges","Converges"];var idx=Math.floor(Math.random()*3);prob={q:series2[idx]+" — converges or diverges?",ans:conv2[idx]};options=["Converges","Diverges","Depends"];}
  else{var nVal=Math.floor(Math.random()*3)+3;var geo=0;for(var i=0;i<nVal;i++)geo+=Math.pow(0.5,i);prob={q:"Σ(1/2)ⁿ for n=0 to "+(nVal-1)+" = ?",ans:geo.toFixed(3)};options=[geo.toFixed(3),(geo+0.25).toFixed(3),(geo-0.5).toFixed(3)];}
  for(var i2=options.length-1;i2>0;i2--){var j=Math.floor(Math.random()*(i2+1));var tmp=options[i2];options[i2]=options[j];options[j]=tmp;}}
function draw(){background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Series Practice",width/2,25);textStyle(NORMAL);
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
