function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

var theta = 0;

function draw(){
  background(0, 100, 200, 255);
  
  translate(0.0, 0.0, -10.0);

  // for(var i = 0; i < 500; i++){
  //   //z: i / 10
  //   translate(sin(theta),sin(theta),0);    
  //   //push();
  //     // sphere();
  //     plane(1,2);
  //   //pop();
  // }
  push();
  translate(sin(theta),cos(theta),0);
  rotateX(theta);
  cube(width,height);
  // plane(width/2, height/2);
  // sphere();
  pop();
  // stroke(0, 0, 0, 0);
  // push();
  // rotateX(theta);
  // plane(1, 2);
  // pop();

  // translate(3, 0, 0);
  // push();
  // rotateY(theta);
  // plane(2, 1);
  // pop();

  theta += 0.01;
  // translate(3, 0, 0);
  // push();
  // rotateZ(theta);
  // plane();
  // pop();

}