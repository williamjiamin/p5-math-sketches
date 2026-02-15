let axisY = 400;
let axisStartX = 100;
let axisEndX = 700;


let minValue = 0;
let maxValue = 10;
let tickSpacing = 1;




let dotX = 100;
let isDragging = false;

function setup() {
    createCanvas(800,600);
    textAlign(CENTER,CENTER);
}



function draw() {
    background(240);

    // asix
    stroke(0);
    strokeWeight(2);
    line(axisStartX,axisY,axisEndX,axisY);


    if (isDragging) {
        dotX = constrain(mouseX, axisStartX, axisEndX);
    }

    drawArrow(dotX);
    displayNumber(dotX);


   

    let numTicks = (maxValue - minValue) / tickSpacing + 1;

    for (let i = 0; i < numTicks; i++) {
        let tickValue = minValue + i * tickSpacing;

        let tickX = map(tickValue, minValue, maxValue, axisStartX, axisEndX);

        stroke(50);
        strokeWeight(2);
        line(tickX,axisY - 3,tickX,axisY+15);

        noStroke();
        fill(50);
        textSize(16);
        text(tickValue, tickX, axisY + 35);
    }


}


function mousePressed() {
    let d = dist(mouseX, mouseY, dotX, axisY);
    if (d < 20) {
        isDragging = true;
    }
}

function mouseReleased() {
    isDragging = false;
}

function drawArrow(x) {
    const tipY = axisY;
    const headHeight = 18;
    const headHalfWidth = 12;
    const shaftHeight = 55;
    const shaftWidth = 6;

    const topY = tipY - headHeight - shaftHeight;
    const shaftBottomY = tipY - headHeight;

    noStroke();
    fill(50,150,255);
    rectMode(CENTER);
    rect(x,(topY + shaftBottomY)/2,shaftWidth,shaftHeight,3);


    stroke(30,100,200);
    strokeWeight(2);
    fill(50,150,255);
    triangle(x, tipY, x - headHalfWidth, shaftBottomY, x + headHalfWidth, shaftBottomY);
}


function displayNumber(x) {
    let value = map(x, axisStartX, axisEndX, minValue, maxValue);
    fill(0);
    textSize(16);
    text(value.toFixed(2), x, axisY - 80);
}