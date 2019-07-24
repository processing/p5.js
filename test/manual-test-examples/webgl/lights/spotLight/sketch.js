function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // setAttributes('perPixelLighting', true);
}

function draw() {
  background(0);

  ambientLight(50);
  spotLight(0, 250, 0, 0, 0, 800, 0, 0, -1, Math.PI / 8, 1);

  ambientMaterial(250);
  box(400);
}
