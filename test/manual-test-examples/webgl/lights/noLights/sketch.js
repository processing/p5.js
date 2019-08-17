function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);

  ambientLight(150, 0, 0);
  translate(-200, 0, 0);
  ambientMaterial(250);
  sphere(50, 64);
  noLights();
  ambientLight(0, 150, 0);
  translate(400, 0, 0);
  ambientMaterial(250);
  sphere(50, 64);
}
