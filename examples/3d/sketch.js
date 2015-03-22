function setup(){
  //@todo need to implement default for 4th parameter {bool}
  //so that if user wants to write createCanvas(800,160,'webgl')
  //webgl context gets initialized properly
    // createCanvas(displayWidth,displayHeight); //2d context
    createCanvas(displayWidth, displayHeight, 'webgl');
    colorMode(HSB);
}

function draw(){
  background(0,0,255);
  // stroke(random(255),random(255),random(255), 255);
  // line(random(displayWidth),0,random(20), mouseX+displayWidth/2, mouseY+displayHeight/2, random(100));
}