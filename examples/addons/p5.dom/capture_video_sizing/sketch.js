var capture;

function setup() {
  createCanvas(390, 240);
  capture = createCapture(VIDEO);
  capture.size(320, 240);
  devicePixelScaling(false);
}

function draw() {
  background(255);
  image(capture, 0, 0);

  capture.loadPixels();
  console.log(capture.pixels.length === 320*240*4);
}

function mousePressed() {
  capture.size(32, 24);
}
