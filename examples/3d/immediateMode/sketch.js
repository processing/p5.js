var theta = 0;

function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(250, 250, 250, 255);
 
  translate(0, 0, -100);
  rotateY(frameCount * 0.01);
  //stroke(0, 0, 0);
  line( 100, 200, 0, 0, 100, 200);


  point(100, 100, 100);

  beginShape('TRIANGLES');
  vertex(100, 100, 0);
  vertex(0, 100 * sin(frameCount * 0.01), 100);
  vertex(100, 0, 100);
  endShape();

for(var i = 0; i< 6; i++){
  push();
  translate(30 * i, 0, 0);
  beginShape('TRIANGLE_STRIP');
  vertex(100, 100, 0);
  vertex(0, 100 * sin(frameCount * 0.01), 100);
  vertex(100, 0, 100);
  vertex(0,0,0);
  endShape();
  pop();
}
  rotateX(frameCount * 0.01);
  rotateZ(frameCount * 0.01);
  box(60, 60, 60);

}