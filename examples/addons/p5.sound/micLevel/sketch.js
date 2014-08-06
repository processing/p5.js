/**
 * Make some noise to float the ellipse
 */

function setup() {
   createCanvas(400,400);
   mic = new p5.AudioIn();
   mic.start();
}

function draw() {
   background(0);

   // getLevel takes an optional smoothing value, or defaults to 0.0
   micLevel = mic.getLevel();
   ellipse(width/2, height - micLevel*height, 100, 100);
}