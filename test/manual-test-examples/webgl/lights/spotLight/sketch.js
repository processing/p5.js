function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('perPixelLighting', true);
}

function draw() {
  background(0);

  ambientLight(50);
  spotLight(0, 250, 0, 0, 0, 200, 0, 0, -1, -Math.PI / 16, 5);
  spotLight(250, 0);

  ambientMaterial(250);
  sphere(70, 64);
}
