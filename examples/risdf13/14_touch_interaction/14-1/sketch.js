// touch events are very similar to mouse events

function setup() {
  createCanvas(1000, 1600); // set to fit a standard-ish smartphone
  noStroke();
  fill(255, 255, 255);
  background(200, 190, 190);
};

function draw() {
  // keeps program looping even though it is empty
};

function touchStarted() {
  fill(0, 255, 0);
  ellipse(touchX, touchY, 80, 80);
}

function touchMoved() {
  fill(0, 0, 255);
  ellipse(touchX, touchY, 80, 80);
}

function touchEnded() {
  fill(255, 0, 0);
  ellipse(touchX, touchY, 80, 80);
}