function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
  perspective(60 / 180 * PI, width/height, 0.1, 100);
}

function draw(){
  background(0);
  orbitControl();
  for(var i = -5; i < 6; i++){
    for(var j = -5; j < 6; j++){
      push();
      translate(i*100, 0, j*100);
      sphere(20);
      pop();
    }
  }
}