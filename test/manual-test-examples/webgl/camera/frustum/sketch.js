function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  frustum(-2, 1, 1, -1, +1, 10000);
  // frustum();
}

function draw(){
  background(0);
  rotateX(map(mouseY, 0, height, 0, TWO_PI));
  rotateY(map(mouseX, 0, width, 0, TWO_PI));
  normalMaterial();

  for(var i = -5; i < 6; i++){
    for(var j = -5; j < 6; j++){
      push();
      translate(i*100, 0, j*100);
      box(20);
      pop();
    }
  }
}