/**
 *
 */

var soundFile;
var fft;
var fftSize = 1024;


var description = 'loading';
var h1;


function setup() {
  createCanvas(fftSize, 400); 
  fill(255, 40, 255);
  noStroke();
  textAlign(CENTER);

  // Create SoundFile. Multiple filetypes for cross-browser compatability.
  soundFile = new SoundFile('beat.mp3', 'beat.wav');

  // loop the sound file
  soundFile.loop();

  // instantiate the FFT object. Give it smoothing and fftSize
  fft = new FFT(.25,fftSize);

  // update description text
  h1 = createH1(description);
}

function draw() {
  background(30,20,30);
  updateDescription();
  
  // tell the FFT object to process the frequency spectrum as the sound plays
  fft.processFrequency();


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
    var freqValue = fft.getFreqRange(firstFreq,secondFreq-1);

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
    h1.html(description);
  }
  else if (soundFile.isPlaying()){
    description = 'Playing!';
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

