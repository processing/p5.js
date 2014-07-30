// ====================
// DEMO: play a sound at a random speed/pitch when the ball hits the edge.
// Set the sound file's to pan left when ball hits left edge and vice versa.
// ====================

var ball;
var soundFile;

function preload() {
  // Create SoundFile. Multiple filetypes for cross-browser compatability.
  soundFile = loadSound( ['../_files/drum.ogg', '../_files/drum.wav'] );
}

function setup() {
  createCanvas(400, 400); 

  soundFile.volume = .6;

  // create the ball
  ball = {
    x: width/2,
    y: height/2,
    speed: 7
  }
}

function draw() {
  background(0);

  ball.x += ball.speed;


  // when the ball hits the wall...
  if (ball.x > width || ball.x < 0) {

    // map the ball's x location to a panning degree (float between -1.0 and 1.0)
    var panning = map(ball.x, 0, width, -1, 1);
    soundFile.pan(panning);

    // set a random playback speed for the sound
    var newSpeed = random(1);
    ball.speed = -ball.speed;
    soundFile.rate(newSpeed);

    // play the sound
    soundFile.play();
  }
  ellipse(ball.x, ball.y, 100, 100);
}

