function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
    lights();
    background(0);
    ambientMaterial(250);
    sphere(50, 64);
}