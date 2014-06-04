/**
 * DEMO: loop a sound and analyze gain to change the size of a visual
 */

var soundFile;
var p5s;

var fft;
var fftBands = 1024;
var spec;

function setup() {
  createCanvas(fftBands, 400); 
  background(20, 20, 0);
  fill(255,255,0);

  // instantiate the p5sound context. Pass in a reference to this.
  p5s = new p5Sound(this);

  // instantiate the SoundFile. Pass in a reference to this, followed by path to file. Include multiple file types to ensure compatability across browsers (for example, .aiff is only supported by Safari).
  soundFile = new SoundFile('beat.aiff', 'beat.wav', 'beat.mp3');

  // loop the sound file
  soundFile.loop();

  fft = new FFT(.95,fftBands, -100, 0);
}

function draw() {
  background(20, 200, 0);

  spec = fft.processFrequency();
  for (var i = 0; i< spec.length; i++){
    noStroke();
    rect(map(i, 0, spec.length, 0, width), fftBands/width, 5, height-spec[i]);
  }
}

function keyPressed() {
  soundFile.pause();
  // fft.input(soundFile);

}
