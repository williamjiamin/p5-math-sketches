const ORIG_W = 800;
const ORIG_H = 600;

let axisY;
let axisStartX;
let axisEndX;

let minValue = 0;
let maxValue = 10;
let tickSpacing = 1;



function setup() {
    createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
    updateAxisLayout();
}

function windowResized() {
    resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
    updateAxisLayout();
}

function updateAxisLayout() {
    axisY = height * 0.67;
    axisStartX = width * 0.125;
    axisEndX = width * 0.875;
}



function draw() {
    background(240);
    stroke(0);
    strokeWeight(2);
    line(axisStartX,axisY,axisEndX,axisY);


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