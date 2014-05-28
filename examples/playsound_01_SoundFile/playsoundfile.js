// ====================
// DEMO: play a sound at a random speed/pitch when the ball hits the edge
// ====================

var ball;

var soundFile;

function setup() {
  createCanvas(400, 400); 
  background(0, 0, 0);

  // create a SoundFile
  soundFile = new SoundFile('drum.wav');

  // create the ball
  ball = ellipse()
  ball.x = width/2;
  ball.y = height/2;
  ball.speed = 2;
  ellipse(ball.x, ball.y, 100, 100);
}

function draw() {
  background(0, 0, 0);

  ball.x += ball.speed;

  // when the ball hits the wall...
  if (ball.x > width || ball.x < 0) {
    var newSpeed = Math.random();
    ball.speed = -(ball.speed);

    // set a random playback speed for the sound
    soundFile.rate(newSpeed);

    // play the sound
    soundFile.play();
  }

  ellipse(ball.x, ball.y, 100, 100)

}

