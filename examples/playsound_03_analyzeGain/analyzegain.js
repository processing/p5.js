// ====================
// DEMO: loop a sound and analyze gain to change the size of a visual
// ====================

var ball;

var soundFile;

function preload() {
  // create a p5sound context
  p5s = new P5sound();

  // create a SoundFile
  soundFile = new SoundFile('beat.aiff', 'beat.wav', 'beat.mp3');
}

function setup() {
  createCanvas(400, 400); 
  background(0, 0, 0);

  // create the ball
  ball = ellipse();
  ball.size = 100;
  soundFile.rate(1);
  ellipse(width/2, height/2, ball.size, ball.size);

}

function draw() {
  // this if statement is necessary (for now) to make sure that the amplitude has loaded.
  if (typeof(amplitude) == 'object') {
    ball.size = 10 + (amplitude.process() * 3000);
  }
  background(0, 0, 0);
  ellipse(width/2, height/2, ball.size, ball.size);
}

function keyPressed(e) {
  soundFile.toggleLoop();

  // create a new Amplitude
  amplitude = new Amplitude();

  // give soundFile as input to Amplitude
  amplitude.input(soundFile);
}
