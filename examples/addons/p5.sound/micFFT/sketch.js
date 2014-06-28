/**
 * Make some noise to float the ellipse
 */

var mic, fft;

function setup() {
   createCanvas(512,400);
   mic = new AudioIn();
   mic.on();
   fft = new FFT();
   fft.setInput(mic);
}

function draw() {
   background(255);

   var spectrum = fft.processFreq(.01, 1024);

   beginShape();
   for (i = 0; i<spectrum.length; i++) {
    vertex(i, height - spectrum[i]);
   }
   endShape();

}