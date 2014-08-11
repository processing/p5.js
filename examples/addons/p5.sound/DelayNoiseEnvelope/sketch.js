/**
 *  Example: p5.Delay w/ p5.Noise, p5.Env & p5.Amplitude
 *  
 *  Click the mouse to hear the p5.Delay process a Noise Envelope.
 *  
 *  MouseX controls the p5.Delay Filter Frequency.
 *  MouseY controls both the p5.Delay Time and Resonance.
 */

var noise, env, analyzer, delay;

function setup() {
  createCanvas(710, 400);
  noise = new p5.Noise('white'); // other types include 'brown' and 'pink'

  // Turn down because we'll control .amp with a p5.Env
  noise.amp(0);

  noise.start();
  noise.disconnect(); // so we will only hear the p5.Delay effect

  delay = new p5.Delay();
  delay.process(noise, .12, .7, 2300); // tell delay to process noise

  // the Env accepts time / value pairs to
  // create a series of timed fades
  env = new p5.Env(.01, 1, .2, .1);

  // p5.Amplitude will analyze all sound in the sketch
  analyzer = new p5.Amplitude();
}

function draw() {
  background(0);

  // get volume reading from the p5.Amplitude analyzer
  var level = analyzer.getLevel();
  // then use level to draw a green rectangle
  var levelHeight = map(level, 0, .4, 0, height);
  fill(100,250,100);
  rect(0, height, width, - levelHeight);

  // map mouseX and mouseY to p5.Delay parameters
  var filterFreq = map(mouseX, 0, width, 60, 15000);
  filterFreq = constrain(filterFreq, 60, 15000);
  var filterRes = map(mouseY, 0, height, 3, 0.01);
  filterRes = constrain(filterRes, 0.01, 3);
  delay.filter(filterFreq, filterRes);
  var delTime = map(mouseY, 0, width, .2, .01);
  delTime = constrain(delTime, .01, .2);
  delay.delayTime(delTime);
}

function mousePressed() {
  env.play(noise);
}