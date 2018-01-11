function setup () {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw () {

  var angle = map(mouseX, 0, width, 0, 180);

  background(0);
  
  push();
  translate(-200,0,0);
  angleMode(RADIANS);
  rotate(angle * PI/180);
  // rotateZ(angle * PI/180);
  displayScene();
  pop();
  
  push();
  translate(+200,0,0);
  angleMode(DEGREES);
  rotate(angle);
  // rotateZ(angle * PI/180);
  displayScene();
  pop();
}


function displayGizmo(size){
  strokeWeight(1);
  stroke(255,0,0); line(0,0,0,size,0,0);
  stroke(0,255,0); line(0,0,0,0,size,0);
  stroke(0,0,255); line(0,0,0,0,0,size);
}

function displayScene(){
  displayGizmo(150);
  
  noStroke();
  pointLight(255,255,255, 100, 100, 100);
  
  ambientMaterial(255,255,255);
  sphere(20);
  plane(300);
  
  push();
  ambientMaterial(255,0,0);
  translate(100,0,0);
  box(20);
  pop();
  
  push();
  ambientMaterial(0,255,0);
  translate(0,100,0);
  box(20);
  pop();
}