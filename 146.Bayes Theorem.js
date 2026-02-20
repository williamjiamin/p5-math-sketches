/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var pA = 0.01, pBgA = 0.95, pBgNotA = 0.05;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Bayes' Theorem",width/2,25);textStyle(NORMAL);
  fill(80);textSize(13);text("P(A|B) = P(B|A)·P(A) / P(B)",width/2,52);
  var pB = pBgA*pA + pBgNotA*(1-pA);
  var pAgB = pB>0 ? (pBgA*pA)/pB : 0;
  var cy=height/2-20;
  fill(80,60,200);textSize(14);textStyle(BOLD);text("Medical Test Example",width/2,80);textStyle(NORMAL);
  fill(80);textSize(13);
  text("P(Disease) = "+pA.toFixed(3),width/2,110);
  text("P(+Test | Disease) = "+pBgA.toFixed(2),width/2,132);
  text("P(+Test | No Disease) = "+pBgNotA.toFixed(2),width/2,154);
  var tw=300,th=160,tx=width/2-tw/2,ty=180;
  var wA=tw*pA,wNotA=tw*(1-pA);
  fill(220,60,60,60);stroke(220,60,60);strokeWeight(1);rect(tx,ty,wA,th,5,0,0,5);
  fill(200,220,255,60);stroke(80,60,200);rect(tx+wA,ty,wNotA,th,0,5,5,0);
  var hTP=th*pBgA,hFP=th*pBgNotA;
  fill(220,60,60,150);noStroke();rect(tx,ty,wA,hTP);
  fill(80,60,200,80);rect(tx+wA,ty,wNotA,hFP);
  noStroke();fill(60);textSize(9);text("True +",tx+wA/2,ty+hTP/2);text("False +",tx+wA+wNotA/2,ty+hFP/2);text("Disease",tx+wA/2,ty+th+12);text("Healthy",tx+wA+wNotA/2,ty+th+12);
  fill(220,60,60);textSize(20);textStyle(BOLD);text("P(Disease | +Test) = "+(pAgB*100).toFixed(1)+"%",width/2,ty+th+45);textStyle(NORMAL);
  fill(80);textSize(12);text("Even a good test gives many false positives when the disease is rare!",width/2,ty+th+70);
  var btnY=height-35;drawBtn(20,btnY,70,24,"P(D) -");drawBtn(95,btnY,70,24,"P(D) +");drawBtn(190,btnY,80,24,"Sens -");drawBtn(275,btnY,80,24,"Sens +");drawBtn(380,btnY,80,24,"FPR -");drawBtn(465,btnY,80,24,"FPR +");
}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(9);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(20,btnY,70,24))pA=Math.max(0.001,+(pA-0.01).toFixed(3));if(hitB(95,btnY,70,24))pA=Math.min(0.5,+(pA+0.01).toFixed(3));if(hitB(190,btnY,80,24))pBgA=Math.max(0.5,+(pBgA-0.05).toFixed(2));if(hitB(275,btnY,80,24))pBgA=Math.min(1,+(pBgA+0.05).toFixed(2));if(hitB(380,btnY,80,24))pBgNotA=Math.max(0.01,+(pBgNotA-0.01).toFixed(2));if(hitB(465,btnY,80,24))pBgNotA=Math.min(0.5,+(pBgNotA+0.01).toFixed(2));}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
