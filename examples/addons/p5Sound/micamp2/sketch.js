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

   // turn down the output of p5sound so we don't get feedback
   p5sound.amp(.1);
}

function draw() {
   background(0);
   micLevel = amplitude.analyze();
   ellipse(width/2, height - micLevel*height, 100, 100);
}