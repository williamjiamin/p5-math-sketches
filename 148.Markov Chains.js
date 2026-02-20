/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var state = 0, steps = 0, history = [0], P = [[0.7,0.3],[0.4,0.6]];
var STATES = ["Sunny","Rainy"];
var COLS;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);COLS=[color(220,180,40),color(80,120,200)];}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Markov Chains",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("State transitions depend only on current state (memoryless)",width/2,52);
  var cx1=width/2-100,cx2=width/2+100,cy=160,r=40;
  for(var i=0;i<2;i++){var cx=i===0?cx1:cx2;fill(i===state?COLS[i]:color(240));stroke(COLS[i]);strokeWeight(3);ellipse(cx,cy,r*2,r*2);noStroke();fill(i===state?255:60);textSize(14);textStyle(BOLD);text(STATES[i],cx,cy);textStyle(NORMAL);}
  stroke(80);strokeWeight(2);drawArrow2(cx1+r+5,cy-10,cx2-r-5,cy-10);drawArrow2(cx2-r-5,cy+10,cx1+r+5,cy+10);
  noFill();stroke(COLS[0]);strokeWeight(1.5);arc(cx1-20,cy-r-10,50,40,PI*0.2,PI*1.1);stroke(COLS[1]);arc(cx2+20,cy-r-10,50,40,-PI*0.1,PI*0.8);
  noStroke();fill(80);textSize(10);text(P[0][1].toFixed(1),width/2,cy-18);text(P[1][0].toFixed(1),width/2,cy+20);text(P[0][0].toFixed(1),cx1-40,cy-r-15);text(P[1][1].toFixed(1),cx2+40,cy-r-15);
  var gx=60,gy=230,gw=width-120,gh=height-310;
  stroke(200);strokeWeight(1);line(gx,gy+gh,gx+gw,gy+gh);
  var maxShow=Math.min(history.length,50),barW=gw/maxShow;
  for(var j=Math.max(0,history.length-maxShow);j<history.length;j++){var idx=j-Math.max(0,history.length-maxShow);fill(COLS[history[j]]);noStroke();rect(gx+idx*barW,gy,barW-1,gh);}
  noStroke();fill(80);textSize(12);text("Steps: "+steps+"   Current: "+STATES[state],width/2,gy+gh+15);
  var sunCount=0;for(var k=0;k<history.length;k++)if(history[k]===0)sunCount++;
  text("Sunny freq: "+(sunCount/history.length*100).toFixed(1)+"%  (steady-state ≈ 57%)",width/2,gy+gh+35);
  var btnY=height-35;drawBtn(width/2-120,btnY,70,24,"Step ×1");drawBtn(width/2-45,btnY,70,24,"Step ×10");drawBtn(width/2+30,btnY,75,24,"Step ×100");drawBtn(width/2+115,btnY,55,24,"Reset");
}
function drawArrow2(x1,y1,x2,y2){line(x1,y1,x2,y2);var a=atan2(y2-y1,x2-x1);line(x2,y2,x2-8*cos(a-PI/6),y2-8*sin(a-PI/6));line(x2,y2,x2-8*cos(a+PI/6),y2-8*sin(a+PI/6));}
function step(n){for(var i=0;i<n;i++){var r2=Math.random();state=r2<P[state][0]?0:1;history.push(state);steps++;}}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-120,btnY,70,24))step(1);if(hitB(width/2-45,btnY,70,24))step(10);if(hitB(width/2+30,btnY,75,24))step(100);if(hitB(width/2+115,btnY,55,24)){state=0;steps=0;history=[0];}}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
