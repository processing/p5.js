function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('perPixelLighting', true);
  noStroke();
}

function draw() {
  background(0);

  shininess(10);
  ambientLight(50);
  specularColor(250, 0, 0);
  pointLight(255, 0, 0, 0, -100, 100);
  specularColor(0, 250, 0);
  pointLight(0, 255, 0, 0, 100, 100);
  specularMaterial(255);
  sphere(80);
}
