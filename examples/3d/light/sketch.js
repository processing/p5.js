var theta = 0;

function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(250, 250, 250, 255);
 
  translate(-10, 0, -100);
  // directionalLight(153, 153, 153, .5, 0, -1);
  // ambientLight(153, 102, 0);
  // ambient(51, 26, 0);
  push();
  rotateX(theta * 0.1);
  rotateZ(theta);
  rotateY(theta * 0.1);
  box(60, 60, 60); 
  pop();
  translate(30, 0, 0);
  basicMaterial();
  push();
  rotateX(-theta * 0.1);
  rotateZ(-theta);
  rotateY(-theta * 0.1);
  sphere(60); 
  translate(30, 0, 0);
  box(60,60,60);
  pop();
  translate(30, 0, 0);
  normalMaterial();
  push();
  rotateX(theta * 0.1);
  rotateZ(theta);
  rotateY(theta * 0.1);
  plane(60, 60); 
  pop();
  theta += 0.03;

}