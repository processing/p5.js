function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(250, 250, 250, 255);
  var radius = width / 6;
  translate(-10, 0, -200);
  orbitControl();
  
  if(!mouseIsPressed){
    rotateY(frameCount * 0.001);
  }

  for(var i = 0; i <= 20; i++){
    for(var j = 0; j <= 20; j++){
      push();
      var a = j/20 * PI;
      var b = i/20 * PI
      translate(sin(2 * a) * radius * sin(b), cos(b) * 50 , cos(2 * a) * radius * sin(b));
      if(j % 2 === 0) box(60, 60, 60);
      else cone(60, 60);
      pop();
    }
  }


}