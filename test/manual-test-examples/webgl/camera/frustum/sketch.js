function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frustum(-width / 2, width / 2, -height / 2, height / 2, -500, 500);
}

function draw() {
  background(200);
  rotateX(map(mouseY, 0, height, 0, TWO_PI));
  rotateY(map(mouseX, 0, width, 0, TWO_PI));
  normalMaterial();
  box(500);
}
