function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(0);
  orbitControl();
  
  ortho(-width/2, width/2, height/2, -height/2, 0.1, 100);
  
  translate(-width/4, 0, 0);

  normalMaterial(250);
  for(var i = 0; i < 10; i++){
    for(var j = 0; j < 10; j++){
      push();
      translate(i*100, 0, -j*100);
      sphere();
      pop();
    }
  }
}