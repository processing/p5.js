function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // setAttributes('perPixelLighting', true);
}

function draw() {
  background(0);

  var locY = mouseY - height / 2;
  var locX = mouseX - width / 2;

  ambientLight(100);
  pointLight(200, 200, 200, locX, locY, 0);

  translate(-200, 0, 0);
  push();
  ambientMaterial(250);
  rotateZ(frameCount * 0.02);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.02);
  torus(80, 20, 64, 64);
  pop();

  translate(400, 0, 0);
  push();
  emissiveMaterial(200, 0, 0);
  rotateZ(frameCount * 0.02);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.02);
  torus(81, 20, 64, 64);
  pop();
}
