function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(250, 250, 250, 255);
  var radius = width;
  translate(0, 0, -1600);
  orbitControl();
  
  if(!mouseIsPressed){
    rotateY(frameCount * 0.001);
  }

  normalMaterial();
  for(var i = 0; i <= 20; i++){
    for(var j = 0; j <= 20; j++){
      push();
      var a = j/20 * PI;
      var b = i/20 * PI
      translate(sin(2 * a) * radius * sin(b), cos(b) * radius / 2 , cos(2 * a) * radius * sin(b));
      if(j % 2 === 0) {
        box(60, 60, 60);
      }
      else{
        cone(60, 60);
      }
      pop();
    }
  }


}