// mouse events - mousePressed(), mouseReleased(), mouseMoved(), mouseDragged()
// runs once each time unlike mousepressed

var gray = 0;

function setup() {
  createCanvas(600, 400);
};

function draw() {
  background(gray);
};

function mousePressed() {
  gray += 20;
};