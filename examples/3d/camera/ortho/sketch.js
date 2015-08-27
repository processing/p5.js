function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
  ortho(-width/2, width/2, height/2, -height/2, 0.1, 100);
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