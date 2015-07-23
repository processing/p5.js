function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){

  background(255);

  translate(0, 0, -800);
  rotateY(frameCount * 0.01);

  var gap = 200;
  var width = 100;
  var height = 100;

  for(var i = -2; i < 3; i++){
    for(var j = -2; j < 3; j++){
      fill( (i+2) * 40, (j+2) * 40, 0);
      quad(
        i * gap, j * gap, 0,
        i * gap + width, j * gap, 0,
        i * gap, j * gap + height, 0,
        i * gap + width, j * gap + height/2 * (sin(frameCount * 0.1 + i + j) + 1), 0
        );
    }
  }
  

}