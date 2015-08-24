function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){

  background(255);

  camera(0, 0, 800);
  perspective(60 / 180 * Math.PI, width/height, 0.1, 100);

  rotateY(frameCount * 0.01);

  var gap = 200;
  var w = 100;
  var h = 100;

  for(var i = -2; i < 3; i++){
    for(var j = -2; j < 3; j++){
      fill( (i+2) * 40, (j+2) * 40, 0);
      quad(
        i * gap, j * gap, 0,
        i * gap + w, j * gap, 0,
        i * gap, j * gap + h, 0,
        i * gap + w, j * gap + h/2 * (sin(frameCount * 0.1 + i + j) + 1), 0
        );
    }
  }
  

}