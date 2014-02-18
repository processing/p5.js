var gray = 0;

function setup() {
  createCanvas(600, 400);
  background(100, 200, 30);
  fill(0, 102);
  noStroke();
};

function draw() {  // Empty draw() keeps the program running
};

function mouseReleased() {
  rect(mouseX, mouseY, 33, 33);
};