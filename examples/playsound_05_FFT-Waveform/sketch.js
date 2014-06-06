/**
 * DEMO: Draw a waveform using FFT
 */

var soundFile;
var p5s;
var fft;
var fftBands = 1024;

// Array of amplitude values (0-255) over time. Length will be 1/2 fftBands.
var waveform = [];

function setup() {
  createCanvas(fftBands, 256); 
  fill(255, 40, 255);

  // instantiate the p5sound context. Pass in a reference to this.
  p5s = new p5Sound(this);

  // instantiate SoundFile as a .wav, with .mp3 fallback if wav isn't supported
  soundFile = new SoundFile('beat.wav', 'beat.mp3');

  // loop the sound file
  soundFile.loop();

  // Create an FFT object. Give it smoothing and a size of fftBands
  fft = new FFT(.99, fftBands);
}

function draw() {
  background(30);

  /** 
   * Analyze the sound as a waveform (amplitude over time)
   */
  waveform = fft.processWaveform();

  // Draw snapshot of the waveform
  for (var i = 0; i< waveform.length; i++){
    noStroke();
    ellipse(i*2, waveform[i], 2, 2);
  }
}

function keyPressed() {
  soundFile.pause();
  // fft.input(soundFile);
}
