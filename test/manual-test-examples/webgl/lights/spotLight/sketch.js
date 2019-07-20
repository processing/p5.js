function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);

  ambientLight(50);
  spotLight(0, 250, 0, 0, 0, 150, 0, 0, -1, Math.PI / 3, 5);

  ambientMaterial(250);
  sphere(100);
}
