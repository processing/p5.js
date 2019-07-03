function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('perPixelLighting', true);
  noStroke();
}

function draw() {
  background(0);

  ambientLight(100, 80, 80);

  translate(-200, 0, 0);
  push();
  specularLight(250, 0, 0);
  pointLight(200, 200, 200, -100, -100, 100);
  specularMaterial(250);
  sphere(80);
  pop();

  translate(400, 0, 0);
  push();
  shininess(10);
  specularLight(0, 0, 250);
  directionalLight(200, 200, 200, 100, 100, 100);
  specularMaterial(250);
  sphere(80);
  pop();
}
