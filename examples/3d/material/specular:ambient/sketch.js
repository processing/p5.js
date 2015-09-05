function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw(){
  background(0);

  var locY = (mouseY / height - 0.5) * (-2);
  var locX = (mouseX / width - 0.5) *2;

  ambientLight(100, 80, 80);
  pointLight(200, 200, 200, locX, locY, 0);
  
  translate(-200, 0, 0);
  push();
  rotateZ(frameCount * 0.02);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.02);
  ambientMaterial(250);
  torus(80, 20, 64, 64);
  pop();

  translate(400, 0, 0);
  push();
  specularMaterial(250);
  rotateZ(frameCount * 0.02);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.02);
  torus(80, 20, 64, 64);
  pop();
}