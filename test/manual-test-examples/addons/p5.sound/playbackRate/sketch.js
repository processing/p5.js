/**
 *  DEMO
 *  - change playback rate of a soundfile based on mouseX position
 *  - a negative playback rate will reverse the soundfile, but won't
 *  preserve current location of the playhead.
 */

// ====================

var soundFile;
var p;

function preload() {
  soundFormats('mp3', 'ogg');
  soundFile = loadSound('../_files/Damscray_-_Dancing_Tiger_02');
}

function setup() {
  soundFile.loop(0);
  p = createP();
}

function draw() {
  // map playback rate of a sound file to mouseX position
  var newRate = (map(mouseX, 0, 1200, -0.5, 1.5));
  // newRate = constrain(newRate, 0.1, 1.5);
  soundFile.rate(newRate);
  p.html( 'Playback Rate: ' + newRate.toFixed(3) )
}

function keyPressed() {
  var key = keyCode;
  // Spacebar: pause
  if (key == 32) {
    soundFile.pause();
  }
}