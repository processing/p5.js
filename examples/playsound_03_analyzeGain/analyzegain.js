// ====================
// DEMO: loop a sound and analyze gain to change the size of a visual
// ====================

var ball;
var soundFile;
var p5s;

function preload() {
  // create a p5sound context
  p5s = new P5sound();

  // create a SoundFile. Pass in multiple types of files so that the browser chooses an option that works.
  soundFile = new SoundFile(p5s, 'beat.aiff', 'beat.wav', 'beat.mp3');

  // create a new Amplitude
  amplitude = new Amplitude(p5s);

  // give soundFile as input to Amplitude
  amplitude.input(p5s);

}

function setup() {
  createCanvas(400, 400); 
  background(0, 0, 0);

  // create the ball
  ball = ellipse();
  ball.size = 100;
  soundFile.rate(1);
  ellipse(width/2, height/2, ball.size, ball.size);
  soundFile.loop();
}

function draw() {
  // If Statement is necessary (for now) to make sure that the amplitude has loaded.
  if (typeof(amplitude) == 'object') {
    // get volume from the amplitude process
    var volume = amplitude.process();

    //change ball size based on the volume
    ball.size = 10 + (volume * 3000);
  }
  background(0, 0, 0);
  ellipse(width/2, height/2, ball.size, ball.size);
}

function keyPressed(e) {
  soundFile.toggleLoop();
}
