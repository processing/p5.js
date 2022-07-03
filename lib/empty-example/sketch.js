/* eslint-disable no-unused-vars */

function setup() {
  // put setup code here
  createCanvas(600, 600);
  frameRate(3);
}

function draw() {
  // put drawing code here
  background(20);
  //   print(frameRate());

  circle(
    100 * sin(frameCount / 10) + width / 2,
    100 * sin(frameCount / 10) + height / 2,
    10
  );
}

function mousePressed() {
  createGif('mySketch', 2, 2);
}
