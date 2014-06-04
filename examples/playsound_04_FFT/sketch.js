/**
 * DEMO: loop a sound and analyze gain to change the size of a visual
 */

var soundFile;
var p5s;

var fft;
var fftBands = 512;
var spec;

function setup() {
  createCanvas(fftBands, 400); 
  background(0, 0, 0);

  // instantiate the p5sound context. Pass in a reference to this.
  p5s = new p5Sound(this);

  // instantiate the SoundFile. Pass in a reference to this, followed by path to file. Include multiple file types to ensure compatability across browsers (for example, .aiff is only supported by Safari).
  soundFile = new SoundFile('beat.aiff', 'beat.wav', 'beat.mp3');

  // loop the sound file
  soundFile.loop();

  fft = new FFT();
}

function draw() {
  background(0, 0, 0);

  spec = fft.processFrequency();
  for (var i = 0; i< fftBands; i++){
    noStroke();
    rect(i, fftBands/width, 5, height-spec[i]);
  }
}

function keyPressed() {
  soundFile.pause();
  // fft.input(soundFile);

}
