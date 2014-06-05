/**
 * DEMO: loop a sound and analyze gain to change the size of a visual
 */

var soundFile;
var p5s;

var fft;
var fftBands = 1024;

function setup() {
  createCanvas(fftBands, 400); 
  fill(255, 40, 255);
  noStroke();
  textAlign(CENTER);

  // instantiate the p5sound context. Pass in a reference to this.
  p5s = new p5Sound(this);

  // instantiate the SoundFile. Pass in a path to the file.
  soundFile = new SoundFile('Karl_Blau_-_02_-_Crucial_Contact.mp3');

  // loop the sound file
  soundFile.loop();

  // instantiate the FFT object which will analyze the frequency spectrum of sound
  fft = new FFT(.4,fftBands, -140, 0);
}

function draw() {
  background(30,20,30);

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
    text( firstFreq.toFixed(0) +' - ' + centerFreq.toFixed(0) + ' - ' + secondFreq.toFixed(0), (i+1)*width/8 - width/8/2, 30);
  }
}

function keyPressed() {
  soundFile.pause();
}
