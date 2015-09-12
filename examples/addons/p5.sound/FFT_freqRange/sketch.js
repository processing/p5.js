/**
 * Display the average amount of energy (amplitude) across a range
 * of frequencies using the p5.FFT class and its methods analyze()
 * and getEnergy().
 * 
 * This example divides the frequency spectrum into eight bands.
 */

var soundFile;
var fft;

var description = 'loading';
var p;

function preload() {
  soundFormats('mp3', 'ogg');
  soundFile = loadSound('../_files/beat');
}

function setup() {
  createCanvas(1024, 400); 
  fill(255, 40, 255);
  noStroke();
  textAlign(CENTER);

  fft = new p5.FFT();

  p = createP(description);
  var p2 = createP('Description: Using getEnergy(low, high) to measure amplitude within a range of frequencies.');
}

function draw() {
  background(30,20,30);
  updateDescription();

  fft.analyze(); // analyze before calling fft.getEnergy()

  // Generate 8 bars to represent 8 different frequency ranges
  for (var i = 0; i < 8; i++){
    noStroke();
    fill((i*30) % 100 + 50, 195, (i*25 + 50) % 255 )

    // Each bar has a unique frequency range
    var centerFreq = (pow(2,i)*125)/2;
    var loFreq = (pow(2,i-1)*125)/2 + centerFreq/4;
    var hiFreq = (centerFreq + centerFreq/2);

    // get the average value in a frequency range
    var freqValue = fft.getEnergy(loFreq, hiFreq - 1); 

    // Rectangle height represents the average value of this frequency range
    var h = -height + map(freqValue, 0, 255, height, 0);
    rect((i+1)*width/8 - width/8, height, width/8, h);

    fill(255);
    text( loFreq.toFixed(0) +' Hz - ' + hiFreq.toFixed(0)+' Hz', (i+1)*width/8 - width/8/2, 30);
  }
}

function keyPressed() {
  if (soundFile.isPlaying()){
    soundFile.pause();
  } else {
    soundFile.loop();
  }
}

// Change description text if the song is loading, playing or paused
function updateDescription() {
  if (!soundFile.isPlaying()) {
    description = 'Paused...';
    p.html(description);
  }
  else if (soundFile.isPlaying()){
    description = 'Playing!';
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