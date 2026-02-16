const ORIG_W = 800;
const ORIG_H = 600;

let axisY;
let axisStartX;
let axisEndX;

let minValue = 0;
let maxValue = 10;
let tickSpacing = 1;


let dotX;
let isDragging = false;

function setup() {
    createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
    textAlign(CENTER,CENTER);
    updateAxisLayout();
    dotX = axisStartX;
}

function windowResized() {
    resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
    let value = map(dotX, axisStartX, axisEndX, minValue, maxValue);
    updateAxisLayout();
    dotX = map(value, minValue, maxValue, axisStartX, axisEndX);
}

function updateAxisLayout() {
    axisY = height * 0.67;
    axisStartX = width * 0.125;
    axisEndX = width * 0.875;
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

    noStroke();
    fill(50,150,255);
    circle(dotX,axisY,20);


    let value = map(dotX, axisStartX, axisEndX, minValue, maxValue);
    fill(0);
    textSize(16);
    text(value.toFixed(2), dotX, axisY - 60);

    let numTicks = (maxValue - minValue) / tickSpacing + 1;

    for (let i = 0; i < numTicks; i++) {
        let tickValue = minValue + i * tickSpacing;

        let tickX = map(tickValue, minValue, maxValue, axisStartX, axisEndX);

        stroke(50);
        strokeWeight(2);
        line(tickX,axisY-15,tickX,axisY+15);

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