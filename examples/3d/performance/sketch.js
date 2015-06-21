var theta = 0;

function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(200, 200, 200, 255);
 
  translate(-10, 0, -100);

  for(var j = 0; j < 5; j++){
    push();
    for(var i = 0; i < 200; i++){
      translate(sin(theta + j) * 10, sin(theta + j) * 10, i * 0.001);
      rotateZ(theta * 0.1);
      rotateY(theta);
      push();
      scale(0.6, 0.6, 0.6);
      sphere(20); 
      pop();
    }
    pop();
  }

  theta += 0.05;

}