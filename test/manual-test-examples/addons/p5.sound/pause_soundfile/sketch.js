// ====================
// DEMO: pause sound when the user presses a key, resume on release
// ====================

var soundFile;

function preload() {
  // create a SoundFile
  soundFormats('ogg', 'mp3');
  soundFile = loadSound('../_files/Damscray_-_Dancing_Tiger_02');
}

function setup() {
  createCanvas(400, 400);
  background(0, 255, 0);

  soundFile.loop();
  createP('Press any key to pause. Resume when the key is released')
}

function keyTyped() {
    soundFile.pause();
    background(255, 0, 0);
}

function keyReleased() {
    soundFile.play();
    background(0, 255, 0);
}
