// ====================
// DEMO: play a sound at a random speed/pitch when the ball hits the edge
// Stereo panning for the ball
// ====================

var ball;
var soundFile;
var p5s;

function setup() {
  createCanvas(400, 400); 
  background(0, 0, 0);

  // create a p5sound context
  p5s = new p5Sound(this);

  // create a SoundFile
  soundFile = new SoundFile('drum.ogg', 'drum.wav', 'drum.mp3');
  soundFile.setGain(.6);

  // create the ball
  ball = ellipse()
  ball.x = width/2;
  ball.y = height/2;
  ball.speed = 7;
  ellipse(ball.x, ball.y, 100, 100);
}

function draw() {
  background(0, 0, 0);

  ball.x += ball.speed;


  // when the ball hits the wall...
  if (ball.x > width) {

    // map the ball's x location to a panning degree (float between -1.0 and 1.0)
    var panning = map(ball.x, 0., width,-1.0, 1.0);
    soundFile.pan(panning);


    // set a random playback speed for the sound
    var newSpeed = Math.random();
    ball.speed = -(ball.speed);
    soundFile.rate(newSpeed);

    // play the sound
    soundFile.play();
  }

  if (ball.x < 0) {

    // map the ball's x location to a panning degree (float between -1.0 and 1.0)
    var panning = map(ball.x, 0., width,-1.0, 1.0);
    soundFile.pan(panning);

    // set a random playback speed for the sound
    var newSpeed = Math.random();
    ball.speed = -(ball.speed);
    soundFile.rate(newSpeed);

    // play the sound
    soundFile.play();

  }

  ellipse(ball.x, ball.y, 100, 100)

}

