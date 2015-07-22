var theta = 0;

function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(250, 250, 250, 255);

  originMode('TOP_LEFT');
  colorMode(HSB);

  translate(0, 0, -1000);

  rotateY(frameCount * 0.01);

  stroke(0);
  line( 0, 0, 0, 200*sin(frameCount*0.005), 200*cos(frameCount*0.005), 0);

  point(0, 310, 0);

  fill(100,120, 100);
  for(var i = 0; i < 10; i++){
    push()
    translate(200 * i, i*10, 0)
    triangle(100, 100, 100, 300 * sin(frameCount * 0.1 + i), 100, 100, 0, 300, 0);
    pop()
  }

  fill(0,255,0)
  quad(
    100, -100, 0,
    -100, -100, 0,
    100, 100, 0,
    -100, 100, 0
    );

  fill(30,120,120);
  push()
  rotateX(PI)
  beginShape('TRIANGLE_STRIP')
  vertex(0, 0, cos(frameCount * 0.1) * 100);
  vertex(0, 200, 100);  
  vertex(100, 100, 100);  
  vertex(100, 0, sin(frameCount * 0.1) * 100);
  pop()   
  endShape();

  fill(10,255,255)
  box(60, 60, 60);

}