/**
 * DEMO: Draw the waveform of a sound as it plays using p5.FFT.waveform()
 */

var soundFile;
var fft;
var fftBands = 1024;

// Array of amplitude values (0-255) over time.
var waveform = [];

function preload() {
  soundFormats('mp3', 'ogg');
  soundFile = loadSound('../_files/beat');
}

function setup() {
  createCanvas(fftBands, 256);
  noFill();

  soundFile.loop();

  /**
   *  Create an FFT object.
   *  Accepts optional parameters for
   *    - Smoothing 
   *    - Length of the FFT's analyze/waveform array. Must be a power of two between 16 and 1024 (default).
   */
  fft = new p5.FFT(.99, fftBands);

  p = createP('press any key to pause / play');
}

function draw() {
  background(250);

  /** 
   * Analyze the sound as a waveform (amplitude over time)
   */
  waveform = fft.waveform();

  // Draw snapshot of the waveform
  beginShape();
  for (var i = 0; i< waveform.length; i++){
    stroke(5);
    strokeWeight(5);
    vertex(i*2, map(waveform[i], -1, 1, height, 0) );
  }
  endShape();
}

function keyPressed() {
  if (soundFile.isPlaying() ) {
    soundFile.pause();
  } else {
    soundFile.play();
  }
}
