function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw(){

  background(255);

  rotateY(frameCount * 0.01);

  var gap = 200;
  var w = 100;
  var h = 100;

  for(var i = -2; i < 3; i++){
    for(var j = -2; j < 3; j++){
      basicMaterial( (i+2) * 40, (j+2) * 40, 0);
      push();
      translate(i*gap, j*gap,0);
      plane();
      pop();
      // quad(
      //   i * gap, j * gap, 0,
      //   i * gap + w, j * gap, 0,
      //   i * gap, j * gap + h, 0,
      //   i * gap + w, j * gap + h, 0
      //   );
    }
  }
  

}