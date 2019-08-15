function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frustum(-1.5, 1.5, -0.3, 0.3, 0.1, 1000);
}

function draw() {
  background(200);
  rotateX(map(mouseY, 0, height, 0, TWO_PI));
  rotateY(map(mouseX, 0, width, 0, TWO_PI));
  normalMaterial();
  box(500);
}
