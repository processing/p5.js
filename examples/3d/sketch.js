function setup(){
  //@todo need to implement default for 4th parameter {bool}
  //so that if user wants to write createCanvas(800,160,'webgl')
  //webgl context gets initialized properly
    // createCanvas(displayWidth,displayHeight); //2d context
    createCanvas(displayWidth, displayHeight, 'webgl');
}

function draw(){
  background(0,0,0,255);

  stroke(0,0,0,0);
  line(0,0,0, mouseX, mouseY,0);
}