/**
 *  Example: Apply a p5.LowPass filter to a p5.SoundFile.
 *  Visualize the sound with FFT.
 *  Map mouseX to the the filter's cutoff frequency
 *  and mouseY to resonance/width of the a BandPass filter
 */

var soundFile;
var fft;

var description = 'loading';
var p;

var filter, filterFreq, filterRes;

function preload() {
  soundFormats('mp3', 'ogg');
  soundFile = loadSound('../_files/beat');
}

function setup() {
  createCanvas(710, 256);
  fill(255, 40, 255);

  // loop the sound file
  soundFile.loop();

  filter = new p5.LowPass();

  // Disconnect soundfile from master output.
  // Then, connect it to the filter, so that we only hear the filtered sound
  soundFile.disconnect();
  soundFile.connect(filter);

  fft = new p5.FFT();

  // update description text
  p = createP(description);
  var p2 = createP('Draw the array returned by FFT.analyze( ). This represents the frequency spectrum, from lowest to highest frequencies.');
}

function draw() {
  background(30);

  // Map mouseX to a the cutoff frequency for our lowpass filter
  filterFreq = map (mouseX, 0, width, 10, 22050);
  // Map mouseY to resonance/width
  filterRes = map(mouseY, 0, height, 15, 5);
  // set filter parameters
  filter.set(filterFreq, filterRes);

  // Draw every value in the FFT spectrum analysis where
  // x = lowest (10Hz) to highest (22050Hz) frequencies,
  // h = energy / amplitude at that frequency
  var spectrum = fft.analyze();
  noStroke();
  for (var i = 0; i< spectrum.length; i++){
    var x = map(i, 0, spectrum.length, 0, width);
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width/spectrum.length, h) ;
  }

  updateDescription();
}


// Change description text if the song is loading, playing or paused
function updateDescription() {
    description = 'Filter Frequency = ' + filterFreq + ' Filter Res = ' + filterRes;
    p.html(description);
}