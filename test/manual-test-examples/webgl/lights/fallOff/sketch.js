function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('perPixelLighting', true);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  ambientLight(50);

  translate(-200, 0, 0);
  fallOff(1, 0, 0);
  pointLight(250, 0, 0, mouseX - width / 2, mouseY - height / 2, 100);
  ambientMaterial(250);
  sphere(50, 64);

  translate(400, 0, 0);
  fallOff(0.1, 0, 0);
  pointLight(250, 0, 0, mouseX - width / 2, mouseY - height / 2, 100);
  ambientMaterial(250);
  sphere(50, 64);
}
