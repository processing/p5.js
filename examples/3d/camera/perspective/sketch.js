function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(0);
  orbitControl();

  perspective(60 / 180 * Math.PI, width/height, 0.1, 100);

  translate(-width/2, 0, -100);

  normalMaterial(250);
  for(var i = 0; i < 10; i++){
    for(var j = 0; j < 10; j++){
      push();
      translate(i*150, 0, -j*150);
      sphere();
      pop();
    }
  }
  
}