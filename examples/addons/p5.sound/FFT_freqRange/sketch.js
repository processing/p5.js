/**
 * Display the average amount of energy (amplitude) across 
 * a range of frequencies using getFreqRange(). This example
 * divides the frequency spectrum into eight bands.
 */

var soundFile;
var fft;
var fftSize = 1024;


var description = 'loading';
var p;

function preload() {
  soundFile = loadSound( ['../_files/beat.mp3', '../_files/beat.ogg'] );
}


function setup() {
  soundFile.loop();

  createCanvas(fftSize, 400); 
  fill(255, 40, 255);
  noStroke();
  textAlign(CENTER);

  // instantiate the FFT object. Give it smoothing and fftSize
  fft = new FFT(.25,fftSize);

  // update description text
  p = createP(description);
  var p2 = createP('Description: Using getFreq(low, high) to measure amplitude within a range of frequencies.');
}

function draw() {
  background(30,20,30);
  updateDescription();
  
  // tell the FFT object to process the frequency spectrum as the sound plays
  fft.processFreq();


  // Use FFT.getFreqRange() to get 8 ranges of frequency values, and then draw them as rectangles on the canvas
  for (var i = 0; i < 8; i++){
    // give each bar a different color
    fill((i*30) % 100 + 50, 195, (i*25 + 50) % 255 )
    // calculate center frequencies at 63.5hz, 125, 250, 500, 1k, 2k, 4kHz, 8k 
    var centerFreq = (pow(2,i)*125)/2;
    // create ranges based on the center frequency
    var firstFreq = (pow(2,i-1)*125)/2 + centerFreq/4;
    var secondFreq = (centerFreq + centerFreq/2);

    // get the average value for each given frequency range. 
    var freqValue = fft.getFreq(firstFreq,secondFreq-1);

    // draw a rectangle whose height represents the average value of this frequency range
    rect((i+1)*width/8 - width/8, height, width/8, -freqValue);

    // label the frequency range
    text( firstFreq.toFixed(0) +' Hz - ' + secondFreq.toFixed(0)+' Hz', (i+1)*width/8 - width/8/2, 30);
  }
}

function keyPressed() {
  soundFile.pause();
}

// Change description text if the song is loading, playing or paused
function updateDescription() {
  if (soundFile.isPaused()) {
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

