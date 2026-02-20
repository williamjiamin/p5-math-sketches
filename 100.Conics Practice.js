/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score=0,total=0,prob={},options=[],answered=-1;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);newProblem();}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function newProblem(){answered=-1;var t=Math.floor(Math.random()*3);
  if(t===0){var shapes=["Circle","Ellipse","Parabola","Hyperbola"];var idx=Math.floor(Math.random()*4);var descs=["x²+y²=r²","x²/a²+y²/b²=1, a≠b","y=ax²","x²/a²-y²/b²=1"];prob={q:"Which conic: "+descs[idx]+"?",ans:shapes[idx]};options=shapes.slice();}
  else if(t===1){var ecc=Math.random();var ans2;if(ecc<0.01)ans2="Circle";else if(ecc<1)ans2="Ellipse";else ans2="Hyperbola";prob={q:"Eccentricity e = "+ecc.toFixed(2)+". Which conic?",ans:ans2};options=["Circle","Ellipse","Parabola","Hyperbola"];}
  else{var props=["Sum of distances to foci is constant","Difference of distances to foci is constant","Equidistant from focus and directrix","All points equidistant from center"];var ans3=["Ellipse","Hyperbola","Parabola","Circle"];var pi=Math.floor(Math.random()*4);prob={q:props[pi],ans:ans3[pi]};options=ans3.slice();}
  for(var i=options.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=options[i];options[i]=options[j];options[j]=tmp;}}
function draw(){background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Conics Practice",width/2,25);textStyle(NORMAL);
  fill(30,50,120);textSize(15);text(prob.q,width/2,65);
  var optW=120,optH=38,gap=15,startX=width/2-(options.length*optW+(options.length-1)*gap)/2;
  for(var i=0;i<options.length;i++){var ox=startX+i*(optW+gap),oy=100;var hov=mouseX>ox&&mouseX<ox+optW&&mouseY>oy&&mouseY<oy+optH;
    if(answered>=0){if(options[i]===prob.ans)fill(60,200,100);else if(i===answered)fill(220,80,80);else fill(220);}else fill(hov?color(200,210,255):255);
    stroke(180);strokeWeight(2);rect(ox,oy,optW,optH,10);noStroke();fill(60);textSize(13);textStyle(BOLD);text(options[i],ox+optW/2,oy+optH/2);textStyle(NORMAL);}
  if(answered>=0){fill(80,60,200);noStroke();rect(width/2-40,165,80,30,10);fill(255);textSize(13);textStyle(BOLD);text("Next",width/2,180);textStyle(NORMAL);}
  fill(80);textSize(14);text("Score: "+score+"/"+total,width/2,height-25);}
function mousePressed(){if(answered>=0){if(hitB(width/2-40,165,80,30))newProblem();return;}
  var optW=120,optH=38,gap=15,startX=width/2-(options.length*optW+(options.length-1)*gap)/2;
  for(var i=0;i<options.length;i++){var ox=startX+i*(optW+gap);if(mouseX>ox&&mouseX<ox+optW&&mouseY>100&&mouseY<138){answered=i;total++;if(options[i]===prob.ans)score++;}}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
