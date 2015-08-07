var theta = 0;

function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(250, 250, 250, 255);
  // directionalLight(153, 153, 153, .5, 0, -1);
  // ambientLight(153, 102, 0);
  // ambient(51, 26, 0);
  translate(-100, 0, -1000);
  push();
  rotateX(theta * 0.1);
  rotateZ(theta);
  rotateY(theta * 0.1);
  normalMaterial();
  box(60, 60, 60); 
  pop();
  translate(300, 0, 0);
  push();
  rotateX(-theta * 0.1);
  rotateZ(-theta);
  rotateY(-theta * 0.1);
  normalMaterial();
  sphere(60);
  pop();
  translate(300, 0, 0);
  push();
  rotateX(theta * 0.1);
  rotateZ(theta);
  rotateY(theta * 0.1);
  basicMaterial(250, 0, 200);
  plane(60, 60); 
  pop();
  theta += 0.03;

}