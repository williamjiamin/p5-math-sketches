/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var score=0,total=0,prob={},options=[],answered=-1;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);newProblem();}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function newProblem(){answered=-1;var t=Math.floor(Math.random()*6);
  if(t===0){prob={q:"Mandelbrot set: z→z²+c. Fixed point z²+c=z when c=0?",ans:"z=0, z=1"};options=["z=0, z=1","z=0","z=i"];}
  else if(t===1){prob={q:"Fourier series of square wave has which harmonics?",ans:"Odd only"};options=["Odd only","Even only","All"];}
  else if(t===2){prob={q:"Sierpinski triangle dimension ≈ ?",ans:"1.585"};options=["1.585","2.000","1.262"];}
  else if(t===3){prob={q:"Group Z₄ under addition: order of element 2?",ans:"2"};options=["2","4","1"];}
  else if(t===4){prob={q:"Shannon entropy is maximized when distribution is?",ans:"Uniform"};options=["Uniform","Peaked","Bimodal"];}
  else{prob={q:"Stokes' theorem relates ∮F·dr to ∬ ___ ·dS",ans:"∇×F"};options=["∇×F","∇·F","∇²F"];}
  for(var i=options.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=options[i];options[i]=options[j];options[j]=tmp;}}
function draw(){background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Advanced Math Practice",width/2,25);textStyle(NORMAL);
  fill(30,50,120);textSize(14);text(prob.q,width/2,65);
  var optW=140,optH=40,gap=15,startX=width/2-(options.length*optW+(options.length-1)*gap)/2;
  for(var i=0;i<options.length;i++){var ox=startX+i*(optW+gap),oy=100;var hov=mouseX>ox&&mouseX<ox+optW&&mouseY>oy&&mouseY<oy+optH;
    if(answered>=0){if(options[i]===prob.ans)fill(60,200,100);else if(i===answered)fill(220,80,80);else fill(220);}else fill(hov?color(200,210,255):255);
    stroke(180);strokeWeight(2);rect(ox,oy,optW,optH,10);noStroke();fill(60);textSize(12);textStyle(BOLD);text(options[i],ox+optW/2,oy+optH/2);textStyle(NORMAL);}
  if(answered>=0){fill(80,60,200);noStroke();rect(width/2-40,170,80,30,10);fill(255);textSize(13);textStyle(BOLD);text("Next",width/2,185);textStyle(NORMAL);}
  fill(80);textSize(14);text("Score: "+score+"/"+total,width/2,height-25);}
function mousePressed(){if(answered>=0){if(hitB(width/2-40,170,80,30))newProblem();return;}
  var optW=140,optH=40,gap=15,startX=width/2-(options.length*optW+(options.length-1)*gap)/2;
  for(var i=0;i<options.length;i++){var ox=startX+i*(optW+gap);if(mouseX>ox&&mouseX<ox+optW&&mouseY>100&&mouseY<140){answered=i;total++;if(options[i]===prob.ans)score++;}}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
