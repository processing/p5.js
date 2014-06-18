/**
 * Make some noise to float the ellipse
 */

function setup() {
   createCanvas(400,400);
   mic = new AudioIn();
   mic.on();
   amplitude = new Amplitude(.9);
   amplitude.setInput(mic);
   amplitude.toggleNormalize();
}

function draw() {
   background(0);
   micLevel = amplitude.process();
   ellipse(width/2, height - micLevel*height, 100, 100);
}