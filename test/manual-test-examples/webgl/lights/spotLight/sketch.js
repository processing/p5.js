function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('perPixelLighting', true);
}

function draw() {
  background(0);

  var dirY = (mouseY / height - 0.5) * 2;
  var dirX = (mouseX / width - 0.5) * 2;

  ambientLight(50);
  spotLight(0, 250, 0, 0, 0, 200, 0, 0, 100, Math.PI / 16, 5);

  ambientMaterial(250);
  sphere(70, 64);
}
