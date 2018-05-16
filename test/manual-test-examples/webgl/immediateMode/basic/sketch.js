function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(150);

  var t = millis() / 1000;

  fill(255, 200, 100);

  push();
  translate(-width / 3, -height / 3);
  rotateX(t);
  translate(-50, -50);
  beginShape();
  vertex(30, 20);
  vertex(85, 20);
  vertex(85, 75);
  vertex(30, 75);
  endShape(CLOSE);

  pop();

  push();
  translate(0, -height / 3);
  rotateX(t);
  translate(-50, -50);
  beginShape(LINES);
  vertex(30, 20);
  vertex(85, 20);
  vertex(85, 75);
  vertex(30, 75);
  endShape();
  pop();

  push();
  translate(width / 3, -height / 3);
  noFill();
  rotateX(t);
  translate(-50, -50);
  beginShape();
  vertex(30, 20);
  vertex(85, 20);
  vertex(85, 75);
  vertex(30, 75);
  endShape();
  pop();

  push();
  translate(-width / 3, 0);
  noFill();
  rotateX(t);
  translate(-50, -50);
  beginShape();
  vertex(30, 20);
  vertex(85, 20);
  vertex(85, 75);
  vertex(30, 75);
  endShape(CLOSE);
  pop();

  push();
  translate(0, 0);
  rotateX(t);
  translate(-50, -50);
  beginShape(TRIANGLES);
  vertex(30, 75);
  vertex(40, 20);
  vertex(50, 75);
  vertex(60, 20);
  vertex(70, 75);
  vertex(80, 20);
  endShape();
  pop();

  push();
  translate(width / 3, 0);
  rotateX(t);
  translate(-50, -50);
  beginShape(TRIANGLE_STRIP);
  vertex(30, 75);
  vertex(40, 20);
  vertex(50, 75);
  vertex(60, 20);
  vertex(70, 75);
  vertex(80, 20);
  vertex(90, 75);
  endShape();
  pop();

  push();
  translate(-width / 3, height / 3);
  rotateX(t);
  translate(-50, -50);
  beginShape(TRIANGLE_FAN);
  vertex(57.5, 50);
  vertex(57.5, 15);
  vertex(92, 50);
  vertex(57.5, 85);
  vertex(22, 50);
  vertex(57.5, 15);
  endShape();
  pop();

  push();
  translate(0, height / 3);
  rotateX(t);
  translate(-50, -50);
  beginShape();
  vertex(20, 20);
  vertex(40, 20);
  vertex(40, 40);
  vertex(60, 40);
  vertex(60, 60);
  vertex(20, 60);
  endShape(CLOSE);
  pop();
}

// function draw(){

//   background('white');
//   colorMode(HSB);

//   orbitControl();

//   translate(0, -height/2, 0);

//   for(var i = 0; i < 500; i+=100){
//   push();
//   fill(i * 0.1, 100, 100);

//   //line
//   translate(0, 100, 0);
//   line(-100, 0, i, 100, 0, i);

//   //triangles
//   translate(0, 100, 0);
//   triangle(
//     0, sin( i + frameCount * 0.1) * 10, i,
//     60, 60, i,
//     -60, 60, i);

//   //quad
//   translate(0, 200, 0);
//   quad(
//     -100, 0, i,
//     100, 0, i,
//     -100, 100, i,
//     100, 100, i
//     );

//   pop();
//   }
// }
