/**
 * DEMO: Draw the waveform of a sound as it plays using FFT.processWaveform()
 */

var soundFile;
var fft;
var fftSize = 1024;

// Array of amplitude values (0-255) over time. Length will be 1/2 fftSize.
var waveform = [];

function setup() {
  createCanvas(fftSize, 256);
  fill(255, 40, 255);


  // instantiate using a .wav, with .mp3 fallback if .wav isn't supported
  soundFile = new SoundFile('beat.wav', 'beat.mp3');

  // loop the sound file
  soundFile.loop();

  // Create an FFT object. Give it smoothing and fftSize
  fft = new FFT(.99, fftSize);
}

function draw() {
  background(30,30,30,2);

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
}
