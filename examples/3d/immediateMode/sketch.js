var theta = 0;

function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){

  background('white');
  colorMode(HSB);

  translate(0, 0, -1000);

  rotateY(frameCount * 0.01);

  //point
  stroke(0, 200, 200);
  point(0, 0, 0);

  //lines
  translate(100, 0, 0);
  push();
  rotateX(frameCount * 0.01);
  for(var i = 0 ; i < 12; i++){
    var offset = i * PI / 6;
    fill(i * 20, 100, 100);
    line(0, 0, 0, 200 * sin(offset + frameCount*0.01), 200 * cos(offset + frameCount*0.01), 0);
  }
  pop();


  //triangles
  translate(400, 0, 0);
  push();
  for(var i = 0; i < 3; i++){
  fill(i * 30 + 200, 100, 100);
  translate(100, 50, 0);
  triangle(
    100, 0, 0, 
    60 * sin(frameCount * 0.1 + i), 0, 0, 
    0, 100, 0);
  }
  pop();


  //triangle strip
  translate(200, 0, 0);
  for(var i = 0; i < 30; i++){
    fill(i * 10, 120, 120);
    translate(100, -50, 0);
    beginShape('TRIANGLE_STRIP')
    vertex(0, 0, (cos(frameCount * 0.1 + i) + 1) * 100);
    vertex(0, 200, 100);  
    vertex(100, 100, 100);  
    vertex(100, 0, (sin(frameCount * 0.1 + i) + 1) * 100);
    endShape();
  }
}