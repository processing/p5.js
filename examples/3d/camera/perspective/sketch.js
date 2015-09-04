function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  perspective(60 / 180 * PI, width/height, 0.1, 100);
}

function draw(){
  background(0);
  rotateX(map(mouseY, 0, height, 0, TWO_PI));
  rotateY(map(mouseX, 0, width, 0, TWO_PI));
  for(var i = -5; i < 6; i++){
    for(var j = -5; j < 6; j++){
      push();
      translate(i*100, 0, j*100);
      sphere(20);
      pop();
    }
  }
}