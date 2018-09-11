function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  //setAttributes('perPixelLighting', true);
}

function draw() {
  background(0);

  const dirY = (mouseY / height - 0.5) * 2;
  const dirX = (mouseX / width - 0.5) * 2;

  ambientLight(50);
  directionalLight(250, 250, 250, -dirX, -dirY, 0);

  ambientMaterial(250);
  sphere(50, 64);
}
