/**
 * Make some noise to float the ellipse
 */

function setup() {
   createCanvas(400,400);
   mic = new AudioIn();
   mic.on();

   // the Mic reads level using p5.sound's Amplitude object.
   // We can call methods on this Amplitude, just like any other.
   mic.amplitude.toggleNormalize();
}

function draw() {
   background(0);
   micLevel = mic.getLevel(.9);
   ellipse(width/2, height - micLevel*height, 100, 100);
}