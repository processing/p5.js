/**
 * Make some noise to float the ellipse
 */

var mic, fft;

function setup() {
   createCanvas(512,400);
   mic = new AudioIn();
   mic.start();
   fft = new FFT();
   fft.setInput(mic);
}

function draw() {
   background(200);

   var spectrum = fft.analyze();

   beginShape();
   for (i = 0; i<spectrum.length; i++) {
    vertex(i, map(spectrum[i], -140, 0, height, 0) );
   }
   endShape();

}