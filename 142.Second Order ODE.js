/* jshint esversion: 6 */
const ORIG_W = 800, ORIG_H = 600;
var damping = 0, omega = 2;
function setup(){createCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));textFont("Arial");textAlign(CENTER,CENTER);}
function windowResized(){resizeCanvas(Math.min(ORIG_W,windowWidth),Math.min(ORIG_H,windowHeight));}
function draw(){
  background(245,247,252);noStroke();fill(60,40,120);textSize(22);textStyle(BOLD);text("Second-Order ODE: Spring-Mass",width/2,25);textStyle(NORMAL);
  fill(80);textSize(12);text("y'' + "+damping.toFixed(1)+"y' + "+omega.toFixed(1)+"²y = 0   (damped harmonic oscillator)",width/2,52);
  var gx=60,gy=70,gw=width-120,gh=height-180,midY=gy+gh/2;
  var scX=gw/12,scY=gh/3;
  stroke(200);strokeWeight(1);line(gx,midY,gx+gw,midY);line(gx,gy,gx,gy+gh);
  noFill();stroke(80,60,200);strokeWeight(2);beginShape();for(var px=0;px<gw;px+=2){var t=px/scX;var y2=solution(t);var sy=midY-y2*scY;if(sy>gy-20&&sy<gy+gh+20)vertex(gx+px,sy);}endShape();
  if(damping>0){stroke(220,60,60,80);strokeWeight(1);drawingContext.setLineDash([4,4]);beginShape();for(var px2=0;px2<gw;px2+=2){var t2=px2/scX;var env=Math.exp(-damping*t2/2);vertex(gx+px2,midY-env*scY);}endShape();beginShape();for(var px3=0;px3<gw;px3+=2){var t3=px3/scX;vertex(gx+px3,midY+Math.exp(-damping*t3/2)*scY);}endShape();drawingContext.setLineDash([]);}
  var label;
  if(damping===0)label="Undamped (oscillates forever)";
  else if(damping*damping<4*omega*omega)label="Underdamped (oscillates, decays)";
  else if(damping*damping===4*omega*omega)label="Critically damped";
  else label="Overdamped";
  noStroke();fill(80,60,200);textSize(14);textStyle(BOLD);text(label,width/2,midY+scY+30);textStyle(NORMAL);
  var btnY=height-35;drawBtn(width/2-120,btnY,55,24,"ζ -");drawBtn(width/2-60,btnY,55,24,"ζ +");drawBtn(width/2+20,btnY,55,24,"ω -");drawBtn(width/2+80,btnY,55,24,"ω +");
}
function solution(t){var d=damping,w=omega;var disc=d*d-4*w*w;if(disc<0){var wd=Math.sqrt(4*w*w-d*d)/2;return Math.exp(-d*t/2)*Math.cos(wd*t);}else if(disc===0){return(1+t)*Math.exp(-d*t/2);}else{var r1=(-d+Math.sqrt(disc))/2,r2=(-d-Math.sqrt(disc))/2;return 0.5*(Math.exp(r1*t)+Math.exp(r2*t));}}
function drawBtn(x,y,w,h,label){var hov=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;fill(hov?color(80,60,200):255);stroke(180);strokeWeight(1);rect(x,y,w,h,5);noStroke();fill(hov?255:60);textSize(10);textStyle(BOLD);text(label,x+w/2,y+h/2);textStyle(NORMAL);}
function mousePressed(){var btnY=height-35;if(hitB(width/2-120,btnY,55,24))damping=Math.max(0,+(damping-0.5).toFixed(1));if(hitB(width/2-60,btnY,55,24))damping=Math.min(8,+(damping+0.5).toFixed(1));if(hitB(width/2+20,btnY,55,24))omega=Math.max(0.5,+(omega-0.5).toFixed(1));if(hitB(width/2+80,btnY,55,24))omega=Math.min(5,+(omega+0.5).toFixed(1));}
function hitB(x,y,w,h){return mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;}
