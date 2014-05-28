// ====================
// DEMO: play a sound at a random speed/pitch when the ball hits the edge
// Stereo panning for the ball
// ====================

var ball;

var soundFile;

function setup() {
  createCanvas(400, 400); 
  background(0, 0, 0);

  // create a p5sound context
  p5s = new P5sound();

  // create a SoundFile
  soundFile = new SoundFile('drum.ogg', 'drum.wav', 'drum.mp3');

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

  // map the ball's x location to a panning degree (float between -1.0 and 1.0)
  var panning = map(ball.x, 0., width,-1.0, 1.0);
  soundFile.pan(panning);

  // when the ball hits the wall...
  if (ball.x > width) {

    var newSpeed = Math.random();
    ball.speed = -(ball.speed);

    // set a random playback speed for the sound
    soundFile.rate(newSpeed);

    // play the sound
    soundFile.play();
  }

  if (ball.x < 0) {

    var newSpeed = Math.random();
    ball.speed = -(ball.speed);


    // set a random playback speed for the sound
    soundFile.rate(newSpeed);

    // play the sound
    soundFile.play();

  }

  ellipse(ball.x, ball.y, 100, 100)

}

