function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(220);
  // triangle with immediate mode
  fill(255);
  beginShape(TRIANGLES);
  vertex(0, 25, 100);
  vertex(-25, -25, -100);
  vertex(25, -25, 0);
  endShape();

  // box with retain mode
  push();
  translate(-width / 3, 0);
  box(70);
  pop();

  // // regular drawing command
  push();
  translate(width / 3, 0);
  plane(70);
  pop();
}
