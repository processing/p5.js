/**
 * Draw frequency spectrum of a sound as it plays using FFT.processFrequency()
 */

var soundFile;
var fft;
var fftSize = 1024;

var description = 'loading';
var h1;

// This will be an array of amplitude from lowest to highest frequencies
var frequencySpectrum = [];



function setup() {
  createCanvas(fftSize/2, 256);
  fill(255, 40, 255);

  // Create SoundFile. Multiple filetypes for cross-browser compatability.
  soundFile = new SoundFile('lucky_dragons_-_power_melody.mp3', 'lucky_dragons_-_power_melody.wav');

  // loop the sound file
  soundFile.loop();

  /**
   * Instantiate the FFT which will analyze frequencies of sound as it plays.
   * Optional parameters are:
   * - Smoothing (between 0.01 and .99)
   * - fftSize (must be a power of two between 32 and 2048)
   * - minimum value of each band in decibels
   * - maximum value of each band in decibels
   */
  fft = new FFT(.8, fftSize, -140, 0);

  // update description text
  h1 = createH1(description);

  // set the master volume;
  p5sound.amp(.5);
}

function draw() {
  background(30);

  // update the description if the sound is playing
  updateDescription();

  /** 
   * Analyze the sound.
   * Return array of frequency volumes, from lowest to highest frequencies.
   * The length of the frequencySpectrum will be 1/2 the fftSize.
   */
  frequencySpectrum = fft.processFrequency();

  // Draw every value in the frequencySpectrum array as a rectangle
  for (var i = 0; i< frequencySpectrum.length; i++){
    noStroke();
    rect(map(i, 0, frequencySpectrum.length, 0, width), height, fftSize/width, -frequencySpectrum[i] ) ;
  }
}



// Change description text if the song is loading, playing or paused
function updateDescription() {
  if (soundFile.isPaused()) {
    description = 'Paused...';
    h1.html(description);
  }
  else if (soundFile.isPlaying()){
    description = 'Playing! Press any key to pause';
    h1.html(description);
  }
  else {
    for (var i = 0; i < frameCount%3; i++ ) {
      // add periods to loading to create a fun loading bar effect
      if (frameCount%4 == 0){
        description += '.';
      }
      if (frameCount%25 == 0) {
        description = 'loading';
      }
    }
    h1.html(description);
  }
}


// pause the song if a key is pressed
function keyPressed() {
  soundFile.pause();
}
