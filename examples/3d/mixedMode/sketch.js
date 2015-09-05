var theta = 0;

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw(){

  background('white');
  colorMode(HSB);

  orbitControl();

  for(var i = 0; i < 500; i+=100){

  push();
  translate(0, 0, i);
  basicMaterial(i * 0.1, 100, 100);

  push();
  translate(0, cos( i + frameCount * 0.1) * 10, 0);
  box(20, 20, 20);
  pop();
  fill(i * 0.1, 100, 100);
  line(
  -100, sin( i + frameCount * 0.1) * 10, 0,
  100, sin( i + frameCount * 0.1) * 10, 0
  );
  pop();

  }
}