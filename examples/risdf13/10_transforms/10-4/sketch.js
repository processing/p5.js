// Order of operations

function setup() {
  createCanvas(600, 400);

  noStroke();
  fill(255, 100, 0);
  rectMode(CENTER);
};

function draw() {
  background(100, 200, 200);

  // Compare, rotate then translate
  rotate(frameCount*0.02);
  translate(width/2, height/2);

  // Versus rotate then translate
  // translate(width/2, height/2);
  // rotate(frameCount*0.02);

  // Display rectangle
  rect(0, 0, 100, 100);
};