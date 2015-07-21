var theta = 0;

function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(250, 250, 250, 255);
 
  translate(0, 0, -100);
  rotateY(frameCount * 0.01);

  stroke(0);
  line( 0, 0, 0, 200*sin(frameCount*0.005), 200*cos(frameCount*0.005), 0);

  point(0, 310, 0);

  fill(255,0,0);
  for(var i = 0; i < 10; i++){
    push()
    translate(20 * i, i, 0)
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

  fill(0,0,0);
  push()
  rotateX(PI)
  beginShape('TRIANGLE_STRIP')
  vertex(0, 0, cos(frameCount * 0.1) * 100);
  vertex(0, 200, 100);  
  vertex(100, 100, 100);  
  vertex(100, 0, sin(frameCount * 0.1) * 100);
  pop()   
  endShape();


  
  box(60, 60, 60);

}