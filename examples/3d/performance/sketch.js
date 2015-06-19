var theta = 0;

function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(0, 100, 200, 255);
  translate(-10, 0, -100.0);

  for(var j = 0; j < 5; j++){
    push();
    for(var i = 0; i < 50; i++){
      translate(sin(theta + j),sin(theta + j), i * 0.001);
      rotateZ(theta * 0.1);
      rotateY(theta);
      push();
      scale(0.6, 0.6, 0.6);
      cube(50, 50, 50);
      pop();
    }
    pop();
  }
  theta += 0.01;

}