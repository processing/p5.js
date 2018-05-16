function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);

  ambientLight(150);

  push();
  translate(-width / 3, 0, 0);
  ambientMaterial(250, 0, 0);
  sphere(50, 64);
  pop();

  ambientMaterial(0, 250, 0);
  sphere(50, 64);

  push();
  translate(width / 3, 0, 0);
  ambientMaterial(0, 0, 250);
  sphere(50, 64);
  pop();
}
