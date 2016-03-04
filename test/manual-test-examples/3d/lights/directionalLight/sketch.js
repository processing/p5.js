function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw(){
  background(0);

  var dirY = (mouseY / height - 0.5) *2;
  var dirX = (mouseX / width - 0.5) *2;

  ambientLight(50);
  directionalLight(250, 250, 250, dirX, -dirY, 0.25);

  ambientMaterial(250);
  sphere(50, 64);
}