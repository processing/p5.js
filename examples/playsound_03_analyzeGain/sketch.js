/**
 * DEMO: loop a sound and analyze gain to change the size of a visual
 */

var ball;
var soundFile;
var p5s;
var amplitude;

function setup() {
  createCanvas(400, 400); 
  background(0, 0, 0);
  noStroke();
  
  // instantiate the p5sound context. Pass in a reference to this.
  p5s = new p5Sound(this);

  // instantiate the SoundFile. Pass in a reference to this, followed by path to file. Include multiple file types to ensure compatability across browsers (for example, .aiff is only supported by Safari).
  soundFile = new SoundFile('beat.aiff', 'beat.wav', 'beat.mp3');

  // loop the sound file
  soundFile.loop();

  // create a new Amplitude, give it a reference to this.
  amplitude = new Amplitude();

  // tell the amplitude to listen to the soundFile.
  amplitude.input(soundFile, .97);

  // create the ball
  ball = ellipse();
  ball.size = 100;
  soundFile.rate(1);
  ellipse(width/2, height/2, ball.size, ball.size);

  createHTML('<h1>Press any key to pause the loop</h1>');
}

function draw() {
  background(0, 0, 0);

  // get volume from the amplitude process
  var volume = amplitude.process();

  //change ball size based on the volume, which is a float between 0 and 1.0 but typically lower. Map it to values that will look nice.
  ball.size = map(volume, 0, 1.0, 25, 400);
  text(volume, 20, 20);
  ellipse(width/2, height/2, ball.size, ball.size);
}

function keyPressed() {
  soundFile.pause();
  // give soundFile as input to Amplitude
  amplitude.input(soundFile, .97);
}
