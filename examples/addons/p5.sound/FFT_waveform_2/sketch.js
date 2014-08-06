/**
 * DEMO: Draw the waveform of a sound as it plays using p5.FFT.waveform()
 */

var soundFile;
var fft;
var fftSize = 1024;

var xOffset = 0;

// Array of amplitude values (0-255) over time. Length will be 1/2 fftSize.
var waveform = [];

function preload() {
  soundFormats('ogg', 'mp3');
  soundFile = loadSound('../_files/lucky_dragons_-_power_melody');
}

function setup() {
  createCanvas(fftSize, 400);
  fill(60, 60, 180);
  background(0);

  // a slower playback rate also lowers the pitch, and with lower frequencies the waveforms are longer
  soundFile.rate(.2);

  // loop the sound file
  soundFile.loop();

  // Create an FFT object. Give it smoothing and fftSize
  fft = new p5.FFT(.99, fftSize);
  createP('Press spacebar to pause');
}

function draw() {
  background(30, 30, 30, frameCount%40 + 4);

  /** 
   * Analyze the sound as a waveform (amplitude over time)
   */
  if (frameCount%2 == 0 ){
    waveform = fft.waveform();
  }
  // Draw two mirrored snapshots of the waveform
  for (var i = 0; i< waveform.length; i++){
    noStroke();
    fill(60, 60, 180, waveform[i] % 100);
    ellipse( -(i*2)%width/2 + width/2 + 1, height-( map(Math.log(waveform[i]),0,10,0,height) + log(i/2)*waveform[i]  )/4, waveform[i]/100, waveform[i]*2);
    ellipse( (i*2)%width/2 + width/2, height-( map(Math.log(waveform[i]),0,10,0,-height) + log(i/2)*waveform[i]  )/4, waveform[i]/100, waveform[i]*2);
  }

  xOffset++;

}

function keyPressed(e) {
  console.log(e);
  if (e.keyCode == 32) {
    soundFile.pause();
  }
}
