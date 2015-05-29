/**
 *  Example: p5.Delay w/ p5.SoundFile + p5.Amplitude
 *  Click the mouse to hear the p5.Delay process a sound file.
 *  MouseX controls the p5.Delay Filter Frequency.
 *  MouseY controls both the p5.Delay Time and Resonance.
 */

var soundFile, analyzer, delay;

function preload() {
  soundFormats('ogg', 'mp3');
  soundFile = loadSound('../_files/beatbox.mp3');
}

function setup() {
  createCanvas(710, 400);

  soundFile.disconnect(); // so we'll only hear delay

  delay = new p5.Delay();
  delay.process(soundFile, .12, .7, 2300);
  delay.setType('pingPong'); // a stereo effect

  analyzer = new p5.Amplitude();
}

function draw() {
  background(0);

  // get volume reading from the p5.Amplitude analyzer
  var level = analyzer.getLevel();

  // use level to draw a green rectangle
  var levelHeight = map(level, 0, .1, 0, height);
  fill(100,250,100);
  rect(0, height, width, - levelHeight);

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
  soundFile.play();
}