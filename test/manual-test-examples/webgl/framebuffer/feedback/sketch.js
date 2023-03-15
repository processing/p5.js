function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frustum(-1.5, 1.5, -0.3, 0.3, 0.5, 1000);
  setAttributes('antialias', true);
}

function draw() {
  background(200);
  rotateX(map(mouseY, 0, height, 0, TWO_PI));
  rotateY(map(mouseX, 0, width, 0, TWO_PI));
  noFill();
  strokeWeight(10);
  stroke(0, 0, 255);
  box(500);
}
