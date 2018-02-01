function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);

  ambientLight(50);
  pointLight(250, 250, 250, mouseX - width / 2, mouseY - height / 2, 100);

  ambientMaterial(250);
  sphere(50, 64);
}
