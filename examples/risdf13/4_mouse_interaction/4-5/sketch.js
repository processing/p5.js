var dragX, dragY, moveX, moveY;

function setup() {
  createCanvas(600, 600);
  smooth();
  noStroke();
};

function draw() {
  background(255);
  fill(0);
  ellipse(dragX, dragY, 100, 100); // Black circle
  fill(153);
  ellipse(moveX, moveY, 100, 100); // Gray circle
};

function mouseMoved() { // Move gray circle
  moveX = mouseX;
  moveY = mouseY;
};

function mouseDragged() { // Move black circle
  dragX = mouseX;
  dragY = mouseY;
};