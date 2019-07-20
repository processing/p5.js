function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('perPixelLighting', true);
  noStroke();
}

function draw() {
  background(0);

  shininess(10);
  ambientLight(50);
  specularLight(250, 0, 0);
  pointLight(255, 0, 0, 0, -100, 100);
  specularLight(0, 250, 0);
  pointLight(0, 255, 0, 0, 100, 100);
  specularMaterial(255);
  sphere(80);
}
