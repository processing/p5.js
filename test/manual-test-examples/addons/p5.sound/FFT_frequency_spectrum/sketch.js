/**
 * This example draws the frequency spectrum of a sound by using
 * the p5.FFT object's analyze() method.
 *
 * FFT is a Fast Fourier Transform function that calculates
 * amplitude across the frequency spectrum. The analyze() method returns
 * an array of values. These values represent how much volume exists in a
 * sound at various frequencies (or pitches). The beginning of the
 * array represents the lowest frequencies (bass), and the end of the
 * array represents the highest frequencies (treble).
 *
 * By default, the array length is 1024. We can determine the size of the array by including
 * an optional parameter, but the number must be a power of 2 between
 * 16 and 1024.
 */

let soundFile;
let fft;
const fftBands = 512;

let description = 'loading';
let p;

// This will be an array of amplitude values from lowest to highest frequencies
let frequencySpectrum = [];

function preload() {
  soundFormats('mp3', 'ogg');
  soundFile = loadSound('../_files/lucky_dragons');
}

function setup() {
  createCanvas(fftBands, 256);
  fill(255, 40, 255);

  // loop the sound file
  soundFile.loop();

  fft = new p5.FFT();

  // update description text
  p = createP(description);
  const p2 = createP(
    'Draw the array returned by FFT.analyze( ). This represents the frequency spectrum, from lowest to highest frequencies.'
  );

  // set the master volume;
  masterVolume(0.5);
}

function draw() {
  background(30);

  // update the description if the sound is playing
  updateDescription();

  /**
   * Analyze the sound.
   * Return array of frequency volumes, from lowest to highest frequencies.
   */
  frequencySpectrum = fft.analyze();

  // Draw every value in the frequencySpectrum array as a rectangle
  noStroke();
  for (let i = 0; i < fftBands; i++) {
    const x = map(i, 0, fftBands, 0, width);
    const h = -height + map(frequencySpectrum[i], 0, 255, height, 0);
    rect(x, height, width / fftBands, h);
  }
}

// Change description text if the song is loading, playing or paused
function updateDescription() {
  if (soundFile.isPaused()) {
    description = 'Paused...';
    p.html(description);
  } else if (soundFile.isPlaying()) {
    description = 'Playing! Press any key to pause';
    p.html(description);
  } else {
    for (let i = 0; i < frameCount % 3; i++) {
      // add periods to loading to create a fun loading bar effect
      if (frameCount % 4 === 0) {
        description += '.';
      }
      if (frameCount % 25 === 0) {
        description = 'loading';
      }
    }
    p.html(description);
  }
}

// pause the song if a key is pressed
function keyPressed() {
  if (soundFile.isPlaying()) {
    soundFile.pause();
  } else {
    soundFile.play();
  }
}
