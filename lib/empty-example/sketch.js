function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
}

function draw() {
  background(0);
  // translate(width/2, height/2);

  // SpecularColor(255, 255, 255);
  directionalLight(127, 127, 127, cos(frameCount * 0.1), 1, -1);
  ambientLight(255, 255, 255);

  // fill(255, 0, 0);
  // emissive(255, 0, 0);
  ambientMaterial(0, 0, 255);
  specularMaterial(255, 0, 0);
  shininess(100);
  sphere(100);
}
