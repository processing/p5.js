function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('perPixelLighting', true);
  noStroke();
}

function draw() {
  background(0);

  var locY = mouseY - height / 2;
  var locX = mouseX - width / 2;
  specularLight(0, 0, 256);
  pointLight(0, 0, 256, locX, locY, 100);
  ambientLight(100);

  shininess(10);
  specularMaterial(250);
  sphere(80);
}
