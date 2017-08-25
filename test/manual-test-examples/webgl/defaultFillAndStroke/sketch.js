
function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw(){
  background(220);
  fill(255);
  // triangle with immediate mode
  beginShape(TRIANGLES);
  vertex(0, 25, 100);
  vertex(-25, -25, -100);
  vertex(25, -25, 0);
  endShape();

  // box with retain mode
  push();
  translate(-width/3, 0);
  box(70);
  pop();

  // // regular drawing command
  push();
  translate(width / 3, 0);
  rotateX(frameCount * 0.005);
  rotateY(frameCount * 0.015);
  plane(70);
  noFill();
  plane(71);
  // rect(0, 0, 70, 70);
  pop();
}