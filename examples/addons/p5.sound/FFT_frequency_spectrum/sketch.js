/**
 * Draw frequency spectrum of a sound as it plays using FFT.processFreq()
 */

var soundFile;
var fft;
var fftSize = 1024;

var description = 'loading';
var p;

// This will be an array of amplitude from lowest to highest frequencies
var frequencySpectrum = [];


function preload() {
  soundFormats('mp3', 'ogg');
  soundFile = loadSound('../_files/lucky_dragons_-_power_melody');
}

function setup() {
  createCanvas(fftSize/2, 256);
  fill(255, 40, 255);

  // loop the sound file
  soundFile.loop();

  /**
   * Instantiate the FFT which will analyze frequencies of sound as it plays.
   * Optional parameters are:
   * - Smoothing (between 0.01 and .99)
   * - fftSize (must be a power of two between 32 and 2048)
   */
  fft = new FFT(.8, fftSize);

  // update description text
  p = createP(description);
  var p2 = createP('Draw the array returned by FFT.processFreq( ). This represents the frequency spectrum, from lowest to highest frequencies.');

  // set the master volume;
  masterVolume(.5);
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
  frequencySpectrum = fft.processFreq();

  // Draw every value in the frequencySpectrum array as a rectangle
  for (var i = 0; i< frequencySpectrum.length; i++){
    noStroke();
    rect(map(i, 0, frequencySpectrum.length, 0, width), height, fftSize/width, -height -frequencySpectrum[i] ) ;
  }
}



// Change description text if the song is loading, playing or paused
function updateDescription() {
  if (soundFile.isPaused()) {
    description = 'Paused...';
    p.html(description);
  }
  else if (soundFile.isPlaying()){
    description = 'Playing! Press any key to pause';
    p.html(description);
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
    p.html(description);
  }
}


// pause the song if a key is pressed
function keyPressed() {
  soundFile.pause();
}
