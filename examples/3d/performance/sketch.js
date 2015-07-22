var theta = 0;

function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(250, 250, 250, 255);
 
  translate(-10, 0, -100);
  for(var j = 0; j < 5; j++){
    push();
    for(var i = 0; i < 100; i++){
      translate(sin(theta + j) * 4, sin(theta + j) * 4, i * 0.001);
      rotateX(theta * 0.1);
      rotateY(theta);
      rotateZ(theta * 0.2);
      push();
      sphere(8); 
      pop();
    }
    pop();
  }

  theta += 0.03;

}