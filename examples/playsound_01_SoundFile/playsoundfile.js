// ====================
// DEMO: play a sound at a random speed/pitch when the ball hits the edge
// ====================

// create the p5 sound context
var p5s = new P5sound(this);

// create a variable for the sound file
var soundFile;

function setup() {
  createCanvas(400, 400);
  background(0);
  // create a SoundFile with a reference to this and a path to a sound file
  soundFile = new SoundFile(this, 'beatbox.wav');
  createHTML('<h1> Press any key to play the sound</h1>');
}

// when a key is pressed...
function keyPressed() {

  // play the sound file
  soundFile.play();

  // also make the background yellow
  background(255, 255, 0);
}

function keyReleased() {
  // make the background black again when the key is released
  background(0);
}
