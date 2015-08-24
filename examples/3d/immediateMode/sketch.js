var theta = 0;

function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){

  background('white');
  colorMode(HSB);

  orbitControl();
  //point
  translate(0, -height/2, 0);

  for(var i = 0; i < 500; i+=100){
  push();
  fill(i * 0.1, 100, 100);
  point(0, 0, i);

  //line
  translate(0, 100, 0);
  line(-100, 0, i, 100, 0, i);

  //triangles
  translate(0, 100, 0);
  triangle(
    0, 0, i, 
    60, 60, i, 
    -60, 60, i);

  translate(0, 200, 0);
  quad(
    -100, 0, i,
    100, 0, i,
    -100, 100, i,
    100, 100, i
    );

  pop();
  }
}