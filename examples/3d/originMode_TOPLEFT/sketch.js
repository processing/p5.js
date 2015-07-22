function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){

  background(255);

  originMode('TOP_LEFT');

  translate(0, 0, -800);
  rotateY(frameCount * 0.01);

  var gap = 200;
  var width = 100;
  var height = 100;

  for(var i = 0; i < 5; i++){
    for(var j = 0; j < 5; j++){
      fill( i * 40, j * 40, 0);
      quad(
        i * gap, j * gap, 0,
        i * gap + width, j * gap, 0,
        i * gap, j * gap + height, 0,
        i * gap + width, j * gap + height/2 * (sin(frameCount * 0.1 + i + j) + 1), 0
        );
    }
  }
  

}