var capture;

function setup() {
  createCanvas(340, 260);
  capture = createCapture(VIDEO);
  //capture.hide();
}

function draw() {
  background(150);
  video(capture, 10, 10, 320, 240);
  filter('INVERT');
}