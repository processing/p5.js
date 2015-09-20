function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw(){

  background(255);

  translate(-width/2, -height/2, 0);

  rotateY(frameCount * 0.01);

  var gap = 200;
  var w = 100;
  var h = 100;

  for(var i = 0; i < 5; i++){
    for(var j = 0; j < 5; j++){
      fill( i * 40, j * 40, 0);
      quad(
        i * gap, j * gap, 0,
        i * gap + w, j * gap, 0,
        i * gap, j * gap + h, 0,
        i * gap + w, j * gap + h, 0
        );
    }
  }
  

}