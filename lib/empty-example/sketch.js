/* eslint-disable no-unused-vars */

function setup() {
  createCanvas(100, 100);
  colorMode(HSL);
}

function draw() {
  let hue = map(sin(frameCount / 100), -1, 1, 0, 100);
  background(hue, 40, 60);
  //   print(frameRate());

  circle(
    100 * sin(frameCount / 10) + width / 2,
    100 * sin(frameCount / 10) + height / 2,
    10
  );
}

function mousePressed() {
  saveGif('mySketch', 2);
}
