function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

var theta = 0;


function draw(){
  background(0, 100, 200, 255);
 
  translate(0.0, 0.0, -10.0);

  for(var j = 0; j < 5; j++){
    push();
    for(var i = 0; i < 200; i++){
      translate(sin(theta + j),sin(theta + j), i * 0.001);
      rotateZ(theta * 0.1);
      push();
      scale(0.6, 0.6, 0.6);
      //if(i % 2 === 0){
      cube(50, 50, 50); 
      //}else sphere(100); 
      pop();
    }
    pop();
  }

  push();
  translate(sin(theta),cos(theta),0);
  rotateX(theta);
  plane(width/4, height/2);
  rotateY(-theta * 1.5);
  sphere(200, 10, 10);
  rotateZ(theta);
  scale(0.2, 0.2, 0.2);
  cube(width, width, width);
  pop();

  theta += 0.05;

}