/**
 * DEMO: loop a sound and analyze gain to change the size of a visual
 */

var soundFile;
var p5s;
var fft;
var fftBands = 1024;

// spec is an array of values that represent the frequency spectrum from low to high
var frequencySpectrum = [];

function setup() {
  createCanvas(fftBands, 256); 
  fill(255, 40, 255);

  // instantiate the p5sound context. Pass in a reference to this.
  p5s = new p5Sound(this);

  // instantiate the SoundFile. Pass in a reference to this, followed by path to file. Include multiple file types to ensure compatability across browsers (for example, .aiff is only supported by Safari).
  soundFile = new SoundFile('Karl_Blau_-_02_-_Crucial_Contact.mp3', 'beat.wav', 'beat.aiff');

  // loop the sound file
  soundFile.loop();

  // Instantiate the FFT which we will use to analyze the frequencies in our soundFile as it plays.
  fft = new FFT();

  /**
   * Optional parameters are:
   * - Smoothing (between 0.01 and .99)
   * - fftBands (must be a power of two between 32 and 2048)
   * - minimum value of each band in decibels
   * - maximum value of each band in decibles
   */
  // fft = new FFT(.8,fftBands, -100, 0);
}

function draw() {
  background(30);

  /** 
   * Analyze the sound.
   * Return array of frequency volumes, from lowest to highest frequencies
   */
  frequencySpectrum = fft.processFrequency();

  // Draw every value in the frequencySpectrum array. 
  for (var i = 0; i< frequencySpectrum.length; i++){
    noStroke();
    rect(map(i, 0, frequencySpectrum.length, 0, width), height, fftBands/width, -frequencySpectrum[i]);
  }
}

function keyPressed() {
  soundFile.pause();
  // fft.input(soundFile);
}
