function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('perPixelLighting', true);
}

function draw() {
  background(0);

  var locY = mouseY - height / 2;
  var locX = mouseX - width / 2;
  specularLight(0, 256, 0);
  ambientLight(100, 80, 80);
  pointLight(200, 200, 200, locX, locY, 0);

  rotateZ(frameCount * 0.02);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.02);
  shininess(15);
  specularMaterial(250);
  torus(81, 20, 64, 64);
}
